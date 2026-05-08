/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - observeResize for the box
 *  - refactored w2events
 *  - scrollIntoView - removed callback
 *  - scroll, scrollIntoView return promise
 *  - animateInsert, animateClose - returns a promise
 *  - add, insert return a promise
 *  - onMouseEnter, onMouseLeave, onMouseDown, onMouseUp
 */

import { w2base } from './w2base.js'
import { w2ui, w2utils } from './w2utils.js'
import { query as _queryRaw, Query } from './query.js'
import { w2tooltip } from './w2tooltip.js'
// any: query() returns Query|void; cast once here for clean chaining
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

class w2tabs extends w2base {
    declare box: HTMLElement | null
    declare name: string
    active: any
    reorder: boolean
    flow: string
    tooltip: string
    tabs: any[] // any: tab objects have dynamic shape
    routeData: Record<string, unknown>
    last: any // any: accumulates reordering state, observeResize, moving bag
    right: string
    style: string
    tab_template: Record<string, unknown>
    [key: string]: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: any) { // any: options bag — mixed type at construction time
        super(options.name)
        this.box          = null // DOM Element that holds the element
        this.name         = '' // unique name for w2ui
        this.active       = null
        this.reorder      = false
        this.flow         = 'down' // can be down or up
        this.tooltip      = 'top|left' // can be top, bottom, left, right
        this.tabs         = []
        this.routeData    = {} // data for dynamic routes
        this.last         = {} // placeholder for internal variables
        this.right        = ''
        this.style        = ''
        this['onClick']      = null
        this['onMouseEnter'] = null // mouse enter and leave
        this['onMouseLeave'] = null
        this['onMouseDown']  = null
        this['onMouseUp']    = null
        this['onClose']      = null
        this['onRender']     = null
        this['onRefresh']    = null
        this['onResize']     = null
        this['onDestroy']    = null
        this.tab_template = {
            id: null,
            text: null,
            icon: null,
            route: null,
            hidden: false,
            disabled: false,
            closable: false,
            tooltip: null,
            style: '',
            onClick: null,
            onRefresh: null,
            onClose: null
        }
        const tabs = options.tabs
        delete options.tabs
        // mix in options
        Object.assign(this, options)
        // add item via method to makes sure item_template is applied
        if (Array.isArray(tabs)) this.add(tabs)
        // need to reassign back to keep it in config
        options.tabs = tabs

        // render if box specified
        if (typeof this.box == 'string') this.box = query(this.box).get(0) as HTMLElement
        if (this.box) this.render(this.box)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add(tab: any): Promise<any> { // any: tab object has dynamic shape
        return this.insert(null, tab)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insert(id: any, tabs: any): Promise<any> { // any: tab objects and ids are heterogeneous
        if (!Array.isArray(tabs)) tabs = [tabs]
        // assume it is array
        const proms: Promise<void>[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tabs.forEach((tab: any) => { // any: tab object shape is dynamic
            // checks
            if (tab.id == null) {
                console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`)
                return
            }
            if (!w2utils.checkUniqueId(tab.id, this.tabs, 'tabs', this.name)) return
            // add tab
            const it = Object.assign({}, this.tab_template, tab)
            if (id == null) {
                this.tabs.push(it)
                proms.push(this.animateInsert(null, it))
            } else {
                const middle = this.get(id, true)
                const before = this.tabs[middle].id
                this.tabs.splice(middle, 0, it)
                proms.push(this.animateInsert(before, it))
            }
        })
        return Promise.all(proms)
    }

    remove(...ids: any[]) {
        let effected = 0
        ids.forEach(it => {
            const tab = this.get(it)
            if (!tab) return
            effected++
            // remove from array
            this.tabs.splice(this.get(tab.id, true), 1)
            // remove from screen
            query(this.box).find(`#tabs_${this.name}_tab_${w2utils.escapeId(tab.id)}`).remove()
        })
        this.resize()
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(id: any): boolean { // any: id can be string or number
        if (this.active == id || this.get(id) == null) return false
        this.active = id
        this.refresh()
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(id: any, tab: any): boolean { // any: tab partial update object
        const index = this.get(id, true)
        if (index == null) return false
        w2utils.extend(this.tabs[index], tab)
        this.refresh(id)
        return true
    }

    get(id?: any, returnIndex?: boolean): any {
        if (arguments.length === 0) {
            const all = []
            for (let i1 = 0; i1 < this.tabs.length; i1++) {
                if (this.tabs[i1].id != null) {
                    all.push(this.tabs[i1].id)
                }
            }
            return all
        } else {
            for (let i2 = 0; i2 < this.tabs.length; i2++) {
                if (this.tabs[i2].id == id) { // need to be == since id can be numeric
                    return (returnIndex === true ? i2 : this.tabs[i2])
                }
            }
        }
        return null
    }

    show(...ids: any[]) {
        const effected: any[] = []
        ids.forEach(it => {
            const tab = this.get(it)
            if (!tab || tab.hidden === false) return
            tab.hidden = false
            effected.push(tab.id)
        })
        setTimeout(() => { effected.forEach(it => { this.refresh(it); this.resize() }) }, 15) // needs timeout
        return effected
    }

    hide(...ids: any[]) {
        const effected: any[] = []
        ids.forEach(it => {
            const tab = this.get(it)
            if (!tab || tab.hidden === true) return
            tab.hidden = true
            effected.push(tab.id)
        })
        setTimeout(() => { effected.forEach(it => { this.refresh(it); this.resize() }) }, 15) // needs timeout
        return effected
    }

    enable(...ids: any[]) {
        const effected: any[] = []
        ids.forEach(it => {
            const tab = this.get(it)
            if (!tab || tab.disabled === false) return
            tab.disabled = false
            effected.push(tab.id)
        })
        setTimeout(() => { effected.forEach(it => { this.refresh(it) }) }, 15) // needs timeout
        return effected
    }

    disable(...ids: any[]) {
        const effected: any[] = []
        ids.forEach(it => {
            const tab = this.get(it)
            if (!tab || tab.disabled === true) return
            tab.disabled = true
            effected.push(tab.id)
        })
        setTimeout(() => { effected.forEach(it => { this.refresh(it) }) }, 15) // needs timeout
        return effected
    }

    dragMove(event: MouseEvent): void {
        if (!this.last.reordering) return
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const info = this.last.moving
        const tab  = this.tabs[info.index]
        const next = _find(info.index, 1)
        const prev = _find(info.index, -1)
        const $el  = query(this.box).find('#tabs_'+ this.name + '_tab_'+ w2utils.escapeId(tab.id))
        if (info.divX > 0 && next) {
            const $nextEl = query(this.box).find('#tabs_'+ this.name + '_tab_'+ w2utils.escapeId(next.id))
            let width1  = ($el.get(0) as HTMLElement).clientWidth
            let width2  = ($nextEl.get(0) as HTMLElement).clientWidth
            if (width1 < width2) {
                width1 = Math.floor(width1 / 3)
                width2 = width2 - width1
            } else {
                width1 = Math.floor(width2 / 3)
                width2 = width2 - width1
            }
            if (info.divX > width2) {
                const index = this.tabs.indexOf(next)
                this.tabs.splice(info.index, 0, this.tabs.splice(index, 1)[0]) // reorder in the array
                info.$tab.before($nextEl.get(0))
                info.$tab.css('opacity', 0)
                Object.assign(this.last.moving, {
                    index: index,
                    divX: -width1,
                    x: event.pageX + width1,
                    left: info.left + info.divX + width1
                })
                return
            }
        }
        if (info.divX < 0 && prev) {
            const $prevEl = query(this.box).find('#tabs_'+ this.name + '_tab_'+ w2utils.escapeId(prev.id))
            let width1  = ($el.get(0) as HTMLElement).clientWidth
            let width2  = ($prevEl.get(0) as HTMLElement).clientWidth
            if (width1 < width2) {
                width1 = Math.floor(width1 / 3)
                width2 = width2 - width1
            } else {
                width1 = Math.floor(width2 / 3)
                width2 = width2 - width1
            }
            if (Math.abs(info.divX) > width2) {
                const index = this.tabs.indexOf(prev)
                this.tabs.splice(info.index, 0, this.tabs.splice(index, 1)[0]) // reorder in the array
                $prevEl.before(info.$tab)
                info.$tab.css('opacity', 0)
                Object.assign(info, {
                    index: index,
                    divX: width1,
                    x: event.pageX - width1,
                    left: info.left + info.divX - width1
                })
                return
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _find(ind: number, inc: number): any { // any: tab objects have dynamic shape
            ind    += inc
            const tab = self.tabs[ind]
            if (tab && tab.hidden) {
                return _find(ind, inc)
            }
            return tab
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouseAction(action: string, id: any, event: MouseEvent): void { // any: id can be string or number
        const tab = this.get(id)
        const edata = this.trigger('mouse' + action, { target: id, tab, object: tab, originalEvent: event })
        if (edata.isCancelled === true || tab?.disabled || tab?.hidden) return
        switch (action) {
            case 'Enter':
                this.tooltipShow(id)
                break
            case 'Leave':
                this.tooltipHide(id)
                break
            case 'Down':
                this.initReorder(id, event)
                break
            case 'Up':
                break
        }
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltipShow(id: any): void { // any: tab id can be string or number
        const tab = this.get(id)
        const el = query(this.box).find('#tabs_'+ this.name + '_tab_'+ w2utils.escapeId(id)).get(0) as HTMLElement
        if (this.tooltip == null || tab?.disabled || this.last.reordering) {
            return
        }
        const pos = this.tooltip
        let txt = tab?.tooltip
        if (typeof txt == 'function') txt = txt.call(this, tab)
        w2tooltip.show({
            anchor: el,
            name: this.name + '_tooltip',
            html: txt,
            position: pos
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltipHide(_id: any): void { // any: id used for routing only, not checked here
        if (this.tooltip == null) return
        w2tooltip.hide(this.name + '_tooltip')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTabHTML(id: any): string | false { // any: tab id can be string or number
        const index = this.get(id, true)
        const tab   = this.tabs[index]
        if (tab == null) return false
        if (tab.text == null && tab.caption != null) tab.text = tab.caption
        if (tab.tooltip == null && tab.hint != null) tab.tooltip = tab.hint // for backward compatibility
        if (tab.caption != null) {
            console.log('NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ', tab)
        }
        if (tab.hint != null) {
            console.log('NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ', tab)
        }

        let text = tab.text
        if (typeof text == 'function') text = text.call(this, tab)
        if (text == null) text = ''

        let closable = ''
        let addStyle = ''
        if (tab.hidden) { addStyle += 'display: none;' }
        if (tab.disabled) { addStyle += 'opacity: 0.2;' }
        if (tab.closable && !tab.disabled) {
            closable = `<div class="w2ui-tab-close w2ui-eaction ${this.active === tab.id ? 'active' : ''}"
                data-mousedown="stop" data-mouseup="clickClose|${tab.id}|event">
            </div>`
        }
        let icon = ''
        if (tab.icon) {
            icon = `<span class="w2ui-tab-icon ${tab.icon}"></span>`
        }
        return `
            <div id="tabs_${this.name}_tab_${tab.id}" style="${addStyle} ${tab.style}"
                class="w2ui-tab w2ui-eaction ${this.active === tab.id ? 'active' : ''} ${tab.closable ? 'closable' : ''} ${tab.class ? tab.class : ''}"
                data-mouseenter="mouseAction|Enter|${tab.id}|event]"
                data-mouseleave="mouseAction|Leave|${tab.id}|event]"
                data-mousedown="mouseAction|Down|${tab.id}|event"
                data-mouseup="mouseAction|Up|${tab.id}|event"
                data-click="click|${tab.id}|event">
                    ${icon + w2utils.lang(text) + closable}
            </div>`
    }

    refresh(id?: any) {
        const time = Date.now()
        if (this.flow == 'up') {
            query(this.box).addClass('w2ui-tabs-up')
        } else {
            query(this.box).removeClass('w2ui-tabs-up')
        }
        // event before
        const edata = this.trigger('refresh', { target: (id != null ? id : this.name), object: this.get(id) })
        if (edata.isCancelled === true) return
        if (id == null) {
            // refresh all
            for (let i = 0; i < this.tabs.length; i++) {
                this.refresh(this.tabs[i].id)
            }
        } else {
            // create or refresh only one item
            const selector = '#tabs_'+ this.name +'_tab_'+ w2utils.escapeId(id)
            const $tab = query(this.box).find(selector)
            const tabHTML = this.getTabHTML(id)
            if ($tab.length === 0) {
                if (tabHTML) query(this.box).find('#tabs_'+ this.name +'_right').before(tabHTML as string)
            } else {
                if (query(this.box).find('.tab-animate-insert').length == 0) {
                    if (tabHTML) $tab.replace(tabHTML as string)
                }
            }
            w2utils.bindEvents(query(this.box).find(`${selector}, ${selector} .w2ui-eaction`), this)
        }
        // right html
        query(this.box).find('#tabs_'+ this.name +'_right').html(this.right)
        // event after
        edata.finish()
        // this.resize();
        return Date.now() - time
    }

    override render(box?: any) {
        const time = Date.now()
        if (typeof box == 'string') box = query(box).get(0)
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // default action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box
        }
        if (!this.box) return false
        // render all buttons
        const html =`
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`
        query(this.box)
            .attr('name', this.name)
            .addClass('w2ui-reset w2ui-tabs')
            .html(html)
        if (query(this.box).length > 0) {
            (query(this.box)[0] as HTMLElement).style.cssText += this.style
        }
        w2utils.bindEvents(query(this.box).find('.w2ui-eaction'), this)
        // observe div resize
        this.last.observeResize = new ResizeObserver(() => { this.resize() })
        this.last.observeResize.observe(this.box)
        // event after
        edata.finish()
        this.refresh()
        this.resize()
        return Date.now() - time
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initReorder(id: any, event: MouseEvent): void { // any: id can be string or number
        if (!this.reorder) return
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self     = this
        const $tab     = query(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(id))
        const tabIndex = this.get(id, true)
        const $ghost   = query(($tab.get(0) as HTMLElement).cloneNode(true))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any // any: w2event instance returned by trigger(); typed generically
        $ghost.attr('id', '#tabs_' + this.name + '_tab_ghost')
        this.last.moving = {
            index: tabIndex,
            indexFrom: tabIndex,
            $tab: $tab,
            $ghost: $ghost,
            divX: 0,
            left: ($tab.get(0) as HTMLElement).getBoundingClientRect().left,
            parentX: (query(this.box).get(0) as HTMLElement).getBoundingClientRect().left,
            x: event.pageX,
            opacity: $tab.css('opacity')
        }

        query(document)
            .off('.w2uiTabReorder')
            .on('mousemove.w2uiTabReorder', function (event: Event) {
                const mouseEvent = event as MouseEvent
                if (!self.last.reordering) {
                    // event before
                    edata = self.trigger('reorder', { target: self.tabs[tabIndex].id, indexFrom: tabIndex, tab: self.tabs[tabIndex] })
                    if (edata.isCancelled === true) return

                    w2tooltip.hide(self.name + '_tooltip')
                    self.last.reordering = true
                    $ghost.addClass('moving')
                    $ghost.css({
                        'pointer-events': 'none',
                        'position': 'absolute',
                        'left': ($tab.get(0) as HTMLElement).getBoundingClientRect().left
                    })
                    $tab.css('opacity', 0)
                    query(self.box).find('.w2ui-scroll-wrapper').append($ghost.get(0) as HTMLElement)
                    query(self.box).find('.w2ui-tab-close').hide()
                }
                self.last.moving.divX = mouseEvent.pageX - self.last.moving.x
                $ghost.css('left', (self.last.moving.left - self.last.moving.parentX + self.last.moving.divX) + 'px')
                self.dragMove(mouseEvent)
            })
            .on('mouseup.w2uiTabReorder', function () {
                query(document).off('.w2uiTabReorder')
                $ghost.css({
                    'transition': '0.1s',
                    'left': (self.last.moving.$tab.get(0) as HTMLElement).getBoundingClientRect().left - self.last.moving.parentX
                })
                query(self.box).find('.w2ui-tab-close').show()
                $ghost.remove()
                $tab.css({ opacity: self.last.moving.opacity })
                // self.render()
                if (self.last.reordering) {
                    edata.finish({ indexTo: self.last.moving.index })
                }
                self.last.reordering = false
            })
    }

    scroll(direction?: any, instant?: any) {
        return new Promise<void>((resolve, reject) => {
            const scrollBox  = query(this.box).find('.w2ui-scroll-wrapper')
            const scrollBoxEl = scrollBox.get(0) as HTMLElement
            const scrollLeft = scrollBoxEl.scrollLeft
            const right      = scrollBox.find('.w2ui-tabs-right').get(0) as HTMLElement
            const width1     = (scrollBox.parent().get(0) as HTMLElement).getBoundingClientRect().width
            const width2     = scrollLeft + right.offsetLeft + right.clientWidth

            switch (direction) {
                case 'left': {
                    let scroll = scrollLeft - width1 + 50 // 35 is width of both button
                    if (scroll <= 0) scroll = 0
                    scrollBoxEl.scrollTo({ top: 0, left: scroll, behavior: instant ? 'auto' : 'smooth' })
                    break
                }
                case 'right': {
                    let scroll = scrollLeft + width1 - 50 // 35 is width of both button
                    if (scroll >= width2 - width1) scroll = width2 - width1
                    scrollBoxEl.scrollTo({ top: 0, left: scroll, behavior: instant ? 'auto' : 'smooth' })
                    break
                }
            }
            setTimeout(() => { this.resize(); resolve() }, instant ? 0 : 350)
        })
    }

    scrollIntoView(id?: any, instant?: any) {
        return new Promise<void>((resolve, reject) => {
            if (id == null) id = this.active
            const tab = this.get(id)
            if (tab == null) return
            const tabEl = query(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(id)).get(0) as HTMLElement
            tabEl.scrollIntoView({ block: 'start', inline: 'center', behavior: instant ? 'auto' : 'smooth' })
            setTimeout(() => { this.resize(); resolve() }, instant ? 0 : 500)
        })
    }

    resize() {
        const time = Date.now()
        if (this.box == null) return
        // event before
        const edata = this.trigger('resize', { target: this.name })
        if (edata.isCancelled === true) return

        // show hide overflow buttons
        if (this.box != null) {
            const box = query(this.box)
            box.find('.w2ui-scroll-left, .w2ui-scroll-right').hide()
            const scrollBox  = box.find('.w2ui-scroll-wrapper').get(0) as HTMLElement
            const $right     = box.find('.w2ui-tabs-right')
            const boxWidth   = (box.get(0) as HTMLElement).getBoundingClientRect().width
            const itemsWidth = ($right.length > 0 ? ($right[0] as HTMLElement).offsetLeft + ($right[0] as HTMLElement).clientWidth : 0)
            if (boxWidth < itemsWidth) {
                // we have overflown content
                if (scrollBox.scrollLeft > 0) {
                    box.find('.w2ui-scroll-left').show()
                }
                if (boxWidth < itemsWidth - scrollBox.scrollLeft) {
                    box.find('.w2ui-scroll-right').show()
                }
            }
        }
        // event after
        edata.finish()
        return Date.now() - time
    }

    destroy() {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        // clean up
        if (query(this.box).find('#tabs_'+ this.name + '_right').length > 0) {
            this.unmount()
        }
        delete w2ui[this.name]
        // event after
        edata.finish()
    }

    override unmount(): void {
        super.unmount()
        this.last.observeResize?.disconnect()
    }

    // ===================================================
    // -- Internal Event Handlers

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(id: any, event?: MouseEvent): false | void { // any: id can be string or number
        if (event && query(event.target).hasClass('w2ui-tab-close')) {
            // do not consider click on close button as tab click
            return
        }
        const tab = this.get(id)
        if (tab == null || tab.disabled || this.last.reordering) return false
        // event before
        const edata = this.trigger('click', { target: id, tab: tab, object: tab, originalEvent: event })
        if (edata.isCancelled === true) return
        // default action
        query(this.box).find('#tabs_'+ this.name +'_tab_'+ w2utils.escapeId(this.active)).removeClass('active')
        this.active = tab.id
        query(this.box).find('#tabs_'+ this.name +'_tab_'+ w2utils.escapeId(this.active)).addClass('active')
        // route processing
        if (typeof tab.route == 'string') {
            let route = tab.route !== '' ? String('/'+ tab.route).replace(/\/{2,}/g, '/') : ''
            const info  = w2utils.parseRoute(route)
            if (info.keys.length > 0) {
                for (let k = 0; k < info.keys.length; k++) {
                    const key = info.keys[k]
                    if (key == null || this.routeData[key.name] == null) continue
                    route = route.replace((new RegExp(':'+ key.name, 'g')), this.routeData[key.name] as string)
                }
            }
            setTimeout(() => { window.location.hash = route }, 1)
        }
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clickClose(id: any, event?: MouseEvent): false | void { // any: id can be string or number
        const tab = this.get(id)
        if (tab == null || tab.disabled) return false
        // event before
        const edata = this.trigger('close', { target: id, object: tab, tab, originalEvent: event })
        if (edata.isCancelled === true) return
        this.animateClose(id).then(() => {
            this.remove(id)
            edata.finish()
            this.refresh()
        })
        event?.stopPropagation()
    }

    animateClose(id?: any) {
        return new Promise<void>((resolve, reject) => {
            const $tab  = query(this.box).find('#tabs_'+ this.name +'_tab_'+ w2utils.escapeId(id))
            const width = ($tab.get(0) as HTMLElement).clientWidth || 0
            const anim = `<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${width}px; transition: width 0.25s"></div>`
            const $anim = $tab.replace(anim)
            setTimeout(() => { $anim.css({ width: '0px' }) }, 1)
            setTimeout(() => {
                $anim.remove()
                this.resize()
                resolve()
            }, 500)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animateInsert(id: any, tab: any): Promise<void> { // any: id/tab objects have dynamic shape
        return new Promise<void>((resolve, reject) => {
            let $before = query(this.box).find('#tabs_'+ this.name +'_tab_'+ w2utils.escapeId(id))
            const tabHTML = this.getTabHTML(tab.id)
            const $tab    = (_queryRaw as any).html(tabHTML) as Query
            if ($before.length == 0) {
                $before = query(this.box).find('#tabs_tabs_right')
                $before.before($tab)
                this.resize()
            } else {
                $tab.css({ opacity: 0 })
                // first insert tab on the right to get its proper dimentions
                query(this.box).find('#tabs_tabs_right').before($tab.get(0) as HTMLElement)
                const $tmp  = query(this.box).find('#' + $tab.attr('id'))
                const width = ($tmp.get(0) as HTMLElement)?.clientWidth ?? 0
                // insert animation div
                const $anim = (_queryRaw as any).html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>') as Query
                $before.before($anim)
                // hide tab and move it in the right position
                $tab.hide()
                $anim.before($tab[0] as HTMLElement)
                setTimeout(() => { $anim.css({ width: width + 'px' }) }, 1)
                setTimeout(() => {
                    $anim.remove()
                    ;($tab.css({ opacity: 1 }) as unknown as Query).show()
                    this.refresh(tab.id)
                    this.resize()
                    resolve()
                }, 500)
            }
        })
    }
}
export { w2tabs }