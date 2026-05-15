/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip, TsColor, TsMenu
 *
 * == TODO ==
 *  - tab navigation (index state)
 *  - vertical toolbar
 *  - TsMenu on second click of tb button should hide
 *  - button display groups for each show/hide, possibly add state: { single: t/f, multiple: t/f, type: 'font' }
 *  - item.count - should just support html, so a custom block can be created, such as a colored line
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - item.icon - can be class or <custom-icon-component> or <svg>
 *  - new w2tooltips and TsMenu
 *  - scroll returns promise
 *  - added onMouseEntter, onMouseLeave, onMouseDown, onMouseUp events
 *  - add(..., skipRefresh), insert(..., skipRefresh)
 *  - item.items can be a function
 *  - item.icon_style - style for the icon
 *  - item.icon - can be a function
 *  - item.type = 'label', item.type = 'input'
 *  - item.placeholder
 *  - item.input: { spinner, style, min, max, step, precision, suffix }
 *  - item.backColor
 *  - onLiveUpdate - for colors
 */

import { TsBase } from './tsbase.js'
import { TsUi, TsUtils } from './tsutils.js'
import { query as _queryRaw, Query } from './query.js'
import { TsTooltip, TsColor, TsMenu } from './tstooltip.js'
// any: query() returns Query|void; cast once here for clean chaining
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

class TsToolbar extends TsBase {
    declare box: HTMLElement | null
    declare name: string
    routeData: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[] // any: toolbar items have dynamic shape
    right: string | string[]
    tooltip: string
    item_template: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    last: any // any: accumulates badge, pendingRefresh, etc.
    // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _refresh: (opts: any) => void
    _refreshDebounced: () => void
    // any: targeted-any per typing_policy; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: any) { // any: options bag — mixed type at construction time
        super(options.name)
        this.box           = null // DOM Element that holds the element
        this.name          = '' // unique name for TsUi
        this.routeData     = {} // data for dynamic routes
        this.items         = []
        this.right         = '' // HTML text on the right of toolbar
        this.tooltip       = 'top|left'// can be top, bottom, left, right
        this['onClick']       = null
        this['onChange']      = null
        this['onMouseDown']   = null
        this['onMouseUp']     = null
        this['onMouseEnter']  = null // mouse enter the button event
        this['onMouseLeave']  = null
        this['onRender']      = null
        this['onRefresh']     = null
        this['onResize']      = null
        this['onDestroy']     = null
        this['onLiveUpdate']  = null
        this.item_template = {
            id: null, // command to be sent to all event handlers
            type: 'button', // button, check, radio, drop, menu, menu-radio, menu-check, break, html, label, input spacer
            text: null,
            html: '',
            tooltip: null,  // TsToolbar.tooltip should be
            count: null,
            hidden: false,
            disabled: false,
            checked: false, // used for radio buttons
            icon: null,
            route: null,     // if not null, it is route to go
            arrow: null,     // arrow down for drop/menu types
            style: null,     // extra css style for caption
            group: null,     // used for radio buttons
            items: null,     // for type menu* it is an array of items in the menu
            selected: null,  // used for menu-check, menu-radio
            color: null,     // color value - used in color pickers
            backColor: null, // background color value for color pickter
            overlay: {       // additional options for overlay
                anchorClass: ''
            },
            onClick: null,
            onRefresh: null
        }
        this.last = {
            badge: {},
            pendingRefresh: {} // what should be refreshed with a debounce
        }
        /**
         * This _refresh function is needed for speed. It will store what should be refreshed in this.last.refesh
         * obect and then call _refreshDebounced(), which will do it withing 15 ms. However, if new items are added
         * they will not cause multiple unnecessary refreshes
         */
        this._refresh = ({ effected, resize, refreshTooltip, hideTooltip }) => {
            const options = this.last.pendingRefresh
            options.ids ??= []
            options.ids.push(...effected)
            Object.assign(options, { resize, refreshTooltip, hideTooltip })
            this._refreshDebounced()
        }
        this._refreshDebounced = TsUtils.debounce(() => {
            const options = this.last.pendingRefresh
            // new Set will make array unique
            new Set(options.ids).forEach(id => {
                this.refresh(id)
                if (options.hideTooltip) this.tooltipHide(id)
            })
            if (options.resize) this.resize()
            // once refresh is complete, then clear refresh object
            this.last.pendingRefresh = {}
        }, 15)
        // mix in options, w/o items
        const items = options.items
        delete options.items
        Object.assign(this, options)
        // add item via method to makes sure item_template is applied
        if (Array.isArray(items)) this.add(items, true)
        // need to reassign back to keep it in config
        options.items = items

        // render if box specified
        if (typeof this.box == 'string') this.box = query(this.box).get(0) as HTMLElement
        if (this.box) this.render(this.box)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add(items: any, skipRefresh?: any): void { // any: items array or single item object
        this.insert(null, items, skipRefresh)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insert(id: any, items: any, skipRefresh?: any): void { // any: id, items, skipRefresh are heterogeneous
        if (!Array.isArray(items)) items = [items]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any, idx: any, arr: any) => { // any: toolbar item objects have dynamic shape
            if (typeof item === 'string') {
                item = arr[idx] = { id: item, text: item }
            }
            // checks
            const valid = ['button', 'check', 'radio', 'drop', 'menu', 'menu-radio', 'menu-check', 'color', 'text-color', 'html', 'label', 'input',
                'group', 'break', 'spacer', 'new-line']
            if (!valid.includes(String(item.type))) {
                console.log('ERROR: The parameter "type" should be one of the following:', valid, `, but ${item.type} is supplied.`, item)
                return
            }
            if (item.id == null && !['break', 'spacer', 'new-line'].includes(item.type)) {
                console.log('ERROR: The parameter "id" is required but not supplied.', item)
                return
            }
            if (item.type == null) {
                console.log('ERROR: The parameter "type" is required but not supplied.', item)
                return
            }
            if (!TsUtils.checkUniqueId(item.id, this.items, 'toolbar', this.name)) return
            // add item
            const newItem = TsUtils.extend({}, this.item_template, item)
            if (newItem.type == 'group' && Array.isArray(newItem.items)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                newItem.items.forEach((_it: any, ind: any) => { // any: item shape is dynamic
                    newItem.items[ind] = TsUtils.extend({}, this.item_template, newItem.items[ind])
                })
            }
            if (newItem.type == 'menu-check') {
                if (!Array.isArray(newItem.selected)) newItem.selected = []
                if (Array.isArray(newItem.items)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newItem.items.forEach((it: any, idx: any, arr: any) => { // any: menu item shape is dynamic
                        if (typeof it === 'string') {
                            it = arr[idx] = { id: it, text: it }
                        }
                        if (it.checked && !newItem.selected.includes(it.id)) newItem.selected.push(it.id)
                        if (!it.checked && newItem.selected.includes(it.id)) it.checked = true
                        if (it.checked == null) it.checked = false
                    })
                }
            } else if (newItem.type == 'menu-radio') {
                if (Array.isArray(newItem.items)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newItem.items.forEach((it: any, idx: any, arr: any) => { // any: menu item shape is dynamic
                        if (typeof it === 'string') {
                            it = arr[idx] = { id: it, text: it }
                        }
                        if (it.checked && newItem.selected == null) newItem.selected = it.id; else it.checked = false
                        if (!it.checked && newItem.selected == it.id) it.checked = true
                        if (it.checked == null) it.checked = false
                    })
                }
            }
            if (id == null) {
                this.items.push(newItem)
            } else {
                const middle = this.get(id, true)
                this.items = this.items.slice(0, middle).concat([newItem], this.items.slice(middle))
            }
            newItem.line = newItem.line ?? 1
            if (skipRefresh !== true) this.refresh(newItem.id)
        })
        if (skipRefresh !== true) this.resize()
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remove(...args: any[]) {
        let effected = 0
        args.forEach(item => {
            const it = this.get(item)
            if (!it || String(item).indexOf(':') != -1) return
            effected++
            // remove from screen
            query(this.box).find('#tb_'+ this.name +'_item_'+ TsUtils.escapeId(it.id)).remove()
            // remove from array
            const ind = this.get(it.id, true)
            if (ind != null) this.items.splice(ind, 1)
        })
        this.resize()
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(id: any, newOptions: any): boolean { // any: id can be string or number; newOptions is partial item config
        const item = this.get(id)
        if (item == null) return false
        Object.assign(item, newOptions)
        this.refresh(String(id).split(':')[0])
        return true
    }

    // any: parameter typed any — runtime dispatch by call site; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(id?: any, returnIndex?: boolean, items?: any[]): any {
        if (arguments.length === 0) {
            const all = []
            for (let i1 = 0; i1 < this.items.length; i1++) {
                const it = this.items[i1]
                if (it.id != null) all.push(it.id)
                if (it.type == 'group') {
                    for (let i2 = 0; i2 < it.items.length; i2++) {
                        if (it.items[i2].id != null) all.push(it.items[i2].id)
                    }
                }
            }
            return all
        }
        const tmp = String(id).split(':')
        if (items == null) items = this.items
        for (let i1 = 0; i1 < items.length; i1++) {
            const it = items[i1]
            // find a menu item
            if (['menu', 'menu-radio', 'menu-check'].includes(it.type) && tmp.length == 2 && it.id == tmp[0]) {
                let subItems = it.items
                if (typeof subItems == 'function') subItems = subItems(this)
                for (let i = 0; i < subItems.length; i++) {
                    const item = subItems[i]
                    if (item.id == tmp[1] || (item.id == null && item.text == tmp[1])) {
                        if (returnIndex == true) return i; else return item
                    }
                    if (Array.isArray(item.items)) {
                        for (let j = 0; j < item.items.length; j++) {
                            if (item.items[j].id == tmp[1] || (item.items[j].id == null && item.items[j].text == tmp[1])) {
                                if (returnIndex == true) return i; else return item.items[j]
                            }
                        }
                    }
                }
            } else if (it.id == tmp[0]) {
                if (returnIndex == true) return i1; else return it
            } else if (it.type == 'group') {
                const sub = this.get(id, returnIndex, it.items)
                if (sub != null) return sub
            }
        }
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCount(id: any, count: any, className?: any, style?: any): void { // any: toolbar item badge params are heterogeneous
        const btn = query(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(id)} .tsg-tb-count > span`)
        if (btn.length > 0) {
            btn.removeClass(null)
                .addClass(className ?? '')
                .text(count);
            (btn.get(0) as HTMLElement).style.cssText = style ?? ''
            this.last.badge[id] = {
                className: className ?? '',
                style: style ?? ''
            }
            const item = this.get(id)
            item.count = count
        } else {
            this.set(id, { count: count })
            this.setCount(id, count, className, style) // to update styles
        }
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    show(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it) return
            // since group can have style, it should still be shown
            it.hidden = false
            effected.push(String(item).split(':')[0])
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.show(itm.id)) // any: group items are dynamic
            }
        })
        this._refresh({ effected, resize: true }) // debounced, needed for speed
        return effected
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hide(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it) return
            // since group can have style, it should still be hidden
            it.hidden = true
            effected.push(String(item).split(':')[0])
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.hide(itm.id)) // any: group items are dynamic
            }
        })
        this._refresh({ effected, hideTooltip: true, resize: true }) // debounced, needed for speed
        return effected
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enable(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it) return
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.enable(itm.id)) // any: group items are dynamic
            } else {
                it.disabled = false
                effected.push(String(item).split(':')[0])
            }
        })
        this._refresh({ effected }) // debounced, needed for speed
        return effected
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disable(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it) return
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.disable(itm.id)) // any: group items are dynamic
            } else {
                it.disabled = true
                effected.push(String(item).split(':')[0])
            }
        })
        this._refresh({ effected, hideTooltip: true }) // debounced, needed for speed
        return effected
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    check(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it || String(item).indexOf(':') != -1) return
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.check(itm.id)) // any: group items are dynamic
            } else {
                it.checked = true
                effected.push(String(item).split(':')[0])
            }
        })
        this._refresh({ effected }) // debounced, needed for speed
        return effected
    }

    // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uncheck(...args: any[]) {
        // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args.forEach((item: any) => { // any: item id can be string or number
            const it = this.get(item)
            if (!it || String(item).indexOf(':') != -1) return
            // remove overlay
            if (['menu', 'menu-radio', 'menu-check', 'drop', 'color', 'text-color'].includes(it.type) && it.checked) {
                TsTooltip.hide(this.name + '-drop')
            }
            if (it.type == 'group') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                it.items.forEach((itm: any) => this.uncheck(itm.id)) // any: group items are dynamic
            } else {
                it.checked = false
                effected.push(String(item).split(':')[0])
            }
        })
        this._refresh({ effected }) // debounced, needed for speed
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(id: any, event?: any): void { // any: id can be string or number; event is MouseEvent or similar
        // click on menu items
        const tmp   = String(id).split(':')
        const it    = this.get(tmp[0])
        let items = (it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [])

        if (tmp.length > 1) {
            const subItem = this.get(id)
            if (subItem && !subItem.disabled) {
                this.menuClick({ name: this.name, item: it, subItem: subItem, originalEvent: event })
            }
            return
        }
        if (it && !it.disabled) {
            // event before
            const edata = this.trigger('click', {
                target: (id != null ? id : this.name),
                item: it, object: it, originalEvent: event
            })
            if (edata.isCancelled === true) return
            // read items again, they might have been changed in the click event handler
            items = (it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [])

            const btn = '#tb_'+ this.name +'_item_'+ TsUtils.escapeId(it.id)
            query(this.box).find(btn).removeClass('down') // need to re-query at the moment -- as well as elsewhere in this function

            if (it.type == 'radio') {
                for (let i = 0; i < this.items.length; i++) {
                    const itt = this.items[i]
                    if (itt.type == 'group') {
                        for (let i1 = 0; i1 < itt.items.length; i1++) {
                            const itt1 = itt.items[i1]
                            if (itt1 == null || itt1.id == it.id || itt1.type !== 'radio') continue
                            if (itt1.group == it.group && itt1.checked) {
                                itt1.checked = false
                                this.refresh(itt1.id)
                            }
                        }
                    }
                    if (itt == null || itt.id == it.id || itt.type !== 'radio') continue
                    if (itt.group == it.group && itt.checked) {
                        itt.checked = false
                        this.refresh(itt.id)
                    }
                }
                it.checked = true
                query(this.box).find(btn).addClass('checked')
            }

            if (['menu', 'menu-radio', 'menu-check', 'drop', 'color', 'text-color'].includes(it.type)) {
                this.tooltipHide(id)
                if (it.checked) {
                    TsTooltip.hide(this.name + '-drop')
                    return
                } else {
                    /**
                     * Need to clear all previous event listeners, since tooltip name is reused and it finds the old configuration and
                     * extends it. If events are not cleared, it would trigger old listeners too.
                     */
                    // any: parameter typed any — runtime dispatch by call site; TsToolbar item shape varies by `type` at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const overlay: any = TsTooltip.get(this.name + '-drop')
                    if (overlay?.displayed) overlay.hide()
                    overlay?.listeners?.splice(0)

                    // timeout is needed to make sure previous overlay hides
                    setTimeout(() => {
                        // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hideDrop = (id: any, _btn?: any) => {
                            // need a closure to capture id variable
                            return () => {
                                this.set(id, { checked: false })
                            }
                        }
                        const el = query(this.box).find('#tb_'+ this.name +'_item_'+ TsUtils.escapeId(it.id))
                        if (!TsUtils.isPlainObject(it.overlay)) it.overlay = {}
                        if (it.type == 'drop') {
                            ;(TsTooltip.show(TsUtils.extend({
                                html: it.html,
                                class: 'tsg-white',
                                hideOn: ['doc-click']
                            }, it.overlay, {
                                anchor: el[0],
                                name: this.name + '-drop',
                                data: { item: it, btn }
                            // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            })) as any)
                            .hide(hideDrop(it.id, btn))
                        }
                        if (['menu', 'menu-radio', 'menu-check'].includes(it.type)) {
                            let menuType = 'normal'
                            if (it.type == 'menu-radio') {
                                menuType = 'radio'
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                items?.forEach((item: any) => { // any: TsMenuItem extended with checked flag
                                    if (it.selected == item.id) item['checked'] = true; else item['checked'] = false
                                })
                            }
                            if (it.type == 'menu-check') {
                                menuType = 'check'
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                items?.forEach((item: any) => { // any: TsMenuItem extended with checked flag
                                    if (Array.isArray(it.selected) && it.selected.includes(item.id)) item['checked'] = true; else item['checked'] = false
                                })
                            }
                            ;(TsMenu.show(TsUtils.extend({
                                items,
                                selected: -1,
                                align: it.text ? 'left' : 'none', // if there is no text, then no alignent
                            }, it.overlay, {
                                type: menuType,
                                name : this.name + '-drop',
                                anchor: el[0],
                                data: { item: it, btn }
                            // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            })) as any)
                                .hide(hideDrop(it.id, btn))
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .remove((event: any) => { // any: Tooltip CustomEvent
                                    this.menuClick({ name: this.name, remove: true, item: it, subItem: event.detail.item,
                                        originalEvent: event })
                                })
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .select((event: any) => { // any: Tooltip CustomEvent
                                    this.menuClick({ name: this.name, item: it, subItem: event.detail.item,
                                        originalEvent: event })
                                })
                        }
                        if (['color', 'text-color'].includes(it.type)) {
                            ;(TsColor.show(TsUtils.extend({
                                color: it.color
                            }, it.overlay, {
                                anchor: el[0],
                                name: this.name + '-drop',
                                data: { item: it, btn }
                            // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            })) as any)
                                .hide(hideDrop(it.id, btn))
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .liveUpdate((event: any) => { // any: Tooltip CustomEvent
                                    const edata = this.trigger('liveUpdate', { name: this.name, item: it, color: event.detail.color })
                                    edata.finish()
                                })
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .select((event: any) => { // any: Tooltip CustomEvent
                                    if (event.detail.color != null) {
                                        this.colorClick({ name: this.name, item: it, color: event.detail.color })
                                    }
                                })
                        }
                    }, 0)
                }
            }

            if (['check', 'menu', 'menu-radio', 'menu-check', 'drop', 'color', 'text-color'].includes(it.type)) {
                it.checked = !it.checked
                if (it.checked) {
                    query(this.box).find(btn).addClass('checked')
                } else {
                    query(this.box).find(btn).removeClass('checked')
                }
            }
            // route processing
            if (it.route) {
                let route = String('/'+ it.route).replace(/\/{2,}/g, '/')
                const info  = TsUtils.parseRoute(route)
                if (info.keys.length > 0) {
                    for (let k = 0; k < info.keys.length; k++) {
                        const key = info.keys[k]
                        if (key == null) continue
                        route = route.replace((new RegExp(':'+ key.name, 'g')), this.routeData[key.name] as string)
                    }
                }
                setTimeout(() => { window.location.hash = route }, 1)
            }
            // need to refresh toolbar as it might be dynamic
            this.tooltipShow(id)
            // event after
            edata.finish()
        }
    }

    // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scroll(direction?: any, line?: any, instant?: any) {
        return new Promise<void>((resolve, _reject) => {
            const scrollBox    = query(this.box).find(`.tsg-tb-line:nth-child(${line}) .tsg-scroll-wrapper`)
            const scrollBoxEl  = scrollBox.get(0) as HTMLElement
            const scrollLeft   = scrollBoxEl.scrollLeft
            const right        = scrollBox.find('.tsg-tb-right').get(0) as HTMLElement
            const width1       = (scrollBox.parent().get(0) as HTMLElement).getBoundingClientRect().width
            const width2       = scrollLeft + right.offsetLeft + right.clientWidth

            switch (direction) {
                case 'left': {
                    let scrollPos = scrollLeft - width1 + 50 // 35 is width of both button
                    if (scrollPos <= 0) scrollPos = 0
                    scrollBoxEl.scrollTo({ top: 0, left: scrollPos, behavior: instant ? 'auto' : 'smooth' })
                    break
                }
                case 'right': {
                    let scrollPos = scrollLeft + width1 - 50 // 35 is width of both button
                    if (scrollPos >= width2 - width1) scrollPos = width2 - width1
                    scrollBoxEl.scrollTo({ top: 0, left: scrollPos, behavior: instant ? 'auto' : 'smooth' })
                    break
                }
            }
            /**
             * Timeout is needed because browser animates scroll. Also, I found that 500ms is not enough
             * as it could take longer then that, but animation seems to be around 500ms
             */
            setTimeout(() => { this.resize(); resolve() }, instant ? 0 : 600)
        })
    }

    // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override render(box?: any) {
        const time = Date.now()
        if (typeof box == 'string') box = query(box).get(0) as HTMLElement
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // defaul action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box
        }
        if (!this.box) return
        if (!Array.isArray(this.right)) {
            this.right = [this.right]
        }
        // render all buttons
        let html = ''
        let line = 0
        for (let i = 0; i < this.items.length; i++) {
            const it = this.items[i]
            if (it == null) continue
            if (it.id == null) it.id = 'item_' + i
            if (it.caption != null) {
                console.log('NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ', it)
            }
            if (it.hint != null) {
                console.log('NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ', it)
            }
            if (i === 0 || it.type == 'new-line') {
                line++
                html += `
                    <div class="tsg-tb-line">
                        <div class="tsg-scroll-wrapper tsg-eaction" data-mousedown="resize">
                            <div class="tsg-tb-right">${this.right[line-1] ?? ''}</div>
                        </div>
                        <div class="tsg-scroll-left tsg-eaction" data-click='["scroll", "left", "${line}"]'></div>
                        <div class="tsg-scroll-right tsg-eaction" data-click='["scroll", "right", "${line}"]'></div>
                    </div>
                `
            }
            it.line = line
        }
        query(this.box)
            .attr('name', this.name)
            .addClass('tsg-reset tsg-toolbar')
            .html(html)
        if (query(this.box).length > 0) {
            (query(this.box)[0] as HTMLElement).style.cssText += this['style']
        }
        // overflow buttons
        TsUtils.bindEvents(query(this.box).find('.tsg-tb-line .tsg-eaction'), this)
        // observe div resize
        this.last.observeResize = new ResizeObserver(() => { this.resize() })
        this.last.observeResize.observe(this.box)
        // refresh all
        this.refresh()
        this.resize()
        // event after
        edata.finish()
        return Date.now() - time
    }

    // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refresh(id?: any) {
        const time = Date.now()
        // event before
        const edata = this.trigger('refresh', { target: (id != null ? id : this.name), item: this.get(id) })
        if (edata.isCancelled === true) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata2: any // any: TsEvent instance or undefined
        // refresh all
        if (id == null) {
            for (let i = 0; i < this.items.length; i++) {
                const it1 = this.items[i]
                if (it1.id == null) it1.id = 'item_' + i
                this.refresh(it1.id)
            }
            return
        }
        // create or refresh only one item
        const it = this.get(id)
        if (it == null) return false
        if (typeof it.onRefresh == 'function') {
            edata2 = this.trigger('refresh', { target: id, item: it, object: it })
            if (edata2.isCancelled === true) return
        }
        const selector = `#tb_${this.name}_item_${TsUtils.escapeId(it.id)}`
        const btn  = query(this.box).find(selector)
        const html = this.getItemHTML(it)
        // hide tooltip
        this.tooltipHide(id)

        // if there is a spacer, then right HTML is not 100%
        if (it.type == 'spacer') {
            query(this.box).find(`.tsg-tb-line:nth-child(${it.line ?? 1})`).find('.tsg-tb-right').css('width', 'auto')
        }

        if (btn.length === 0) {
            const next = parseInt(this.get(id, true)) + 1
            let $next = query(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(this.items[next] ? this.items[next].id : '--')}`) // "--" is needed or it will insert wrong
            if ($next.length == 0) {
                $next = query(this.box).find(`.tsg-tb-line:nth-child(${it.line})`).find('.tsg-tb-right').before(html)
            } else {
                $next.after(html)
            }
            TsUtils.bindEvents(query(this.box).find(`${selector}, ${selector} .tsg-eaction`), this)
        } else {
            // refresh
            // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query(this.box).find(selector).replace((_queryRaw as any).html(html))
            const newBtn = query(this.box).find(selector)
            TsUtils.bindEvents(newBtn, this)
            TsUtils.bindEvents(newBtn.find('.tsg-eaction'), this)
            // update overlay's anchor if changed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const overlays = TsTooltip.get(true) as Record<string, any> | undefined // any: TooltipOverlay shape is dynamic
            if (overlays != null) Object.keys(overlays).forEach(key => {
                if (overlays[key]?.anchor == btn.get(0)) {
                    overlays[key].anchor = newBtn.get(0)
                }
            })
        }
        if (['menu', 'menu-radio', 'menu-check'].includes(it.type) && it.checked) {
            // check selected items
            const selected = Array.isArray(it.selected) ? it.selected : [it.selected]
            const items = typeof it.items == 'function' ? it.items(it) : [...it.items]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.forEach((item: any) => { // any: menu item shape is dynamic
                if (selected.includes(item.id)) item.checked = true; else item.checked = false
            })
            TsMenu.update(this.name + '-drop', items)
        }
        // event after
        if (typeof it.onRefresh == 'function') {
            edata2.finish()
        }
        edata.finish()
        return Date.now() - time
    }

    resize() {
        const time = Date.now()
        // event before
        const edata = this.trigger('resize', { target: this.name })
        if (edata.isCancelled === true) return

        query(this.box).find('.tsg-tb-line').each(el => {
            // show hide overflow buttons
            const box = query(el)
            box.find('.tsg-scroll-left, .tsg-scroll-right').hide()
            const scrollBox  = box.find('.tsg-scroll-wrapper').get(0) as HTMLElement
            const $right     = box.find('.tsg-tb-right')
            const boxWidth   = (box.get(0) as HTMLElement).getBoundingClientRect().width
            // Do not use $right[0].getBoundingClientRect(). right box is the most left div
            const itemsWidth = ($right.length > 0 ? ($right[0] as HTMLElement).offsetLeft + ($right[0] as HTMLElement).clientWidth : 0)
            if (boxWidth < itemsWidth) {
                // we have overflown content
                if (scrollBox.scrollLeft > 0) {
                    box.find('.tsg-scroll-left').show()
                }
                if (boxWidth < itemsWidth - scrollBox.scrollLeft) {
                    box.find('.tsg-scroll-right').show()
                }
            }
        })
        // event after
        edata.finish()
        return Date.now() - time
    }

    destroy() {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        // clean up
        if (query(this.box).find('.tsg-scroll-wrapper').length > 0) {
            this.unmount()
        }
        delete TsUi[this.name]
        // event after
        edata.finish()
    }

    override unmount(): void {
        super.unmount()
        this.last.observeResize?.disconnect()
    }

    // ========================================
    // --- Internal Functions

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getItemHTML(item: any): string { // any: toolbar item config has dynamic shape
        let html = ''
        if (item.caption != null && item.text == null) item.text = item.caption // for backward compatibility
        if (item.text == null) item.text = ''
        if (item.tooltip == null && item.hint != null) item.tooltip = item.hint // for backward compatibility
        if (item.tooltip == null) item.tooltip = ''
        if (typeof item.get !== 'function' && (Array.isArray(item.items) || typeof item.items == 'function')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item.get = function get(id: any): any { // any: item ids and shapes are dynamic
                let tmp = item.items
                if (typeof tmp == 'function') tmp = item.items(item)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return tmp.find((it: any) => it.id == id ? true : false) // any: menu item shape is dynamic
            }
        }
        let icon = ''
        let text = (typeof item.text == 'function' ? item.text.call(this, item) : item.text)
        if (item.icon) {
            icon = item.icon
            if (typeof item.icon == 'function') {
                icon = item.icon.call(this, item)
            }
            if (String(icon).slice(0, 1) !== '<') {
                icon = `<span class="${icon}" ${item.icon_style ? `style="${item.icon_style}"` : ''}></span>`
            }
            icon = `<div class="tsg-tb-icon">${icon}</div>`
        }
        const classes = ['tsg-tb-button', 'tsg-eaction']
        if (item.checked) classes.push('checked')
        if (item.disabled) classes.push('disabled')
        if (item.hidden) classes.push('hidden')
        if (!icon) classes.push('no-icon')

        switch (item.type) {
            case 'color':
            case 'text-color':
                if (typeof item.color == 'string') {
                    if (item.color.slice(0, 1) == '#') item.color = item.color.slice(1)
                    if ([3, 6, 8].includes(item.color.length)) item.color = '#' + item.color
                }
                if (item.type == 'color') {
                    text = `<span class="tsg-tb-color-box" style="background-color: ${(item.color != null ? item.color : '#fff')}"></span>
                           ${(item.text ? `<div style="margin-left: 17px;">${TsUtils.lang(item.text)}</div>` : '')}`
                }
                if (item.type == 'text-color') {
                    const color = (item.color != null ? item.color : '#444')
                    let bcolor = item.backColor
                    if (item.backColor === true) {
                        bcolor = '#fff'
                        if (TsUtils.colorContrastValue('#fff', color) < 2) {
                            bcolor = '#555'
                        }
                    }
                    text = `<span style="color: ${color}">${item.text
                        ? TsUtils.lang(item.text)
                        : (item.backColor
                            ? `<b style="background-color: ${bcolor ?? 'transparent'}; padding: 2px 5px; border-radius: 3px;">Ab</b>`
                            : '<b>Ab</b>'
                        )
                    }</span>`
                }
            case 'menu':
            case 'menu-check':
            case 'menu-radio':
            case 'button':
            case 'check':
            case 'radio':
            case 'label':
            case 'drop': {
                const arrow = (item.arrow === true
                    || (item.arrow !== false && ['menu', 'menu-radio', 'menu-check', 'drop', 'color', 'text-color'].includes(item.type)))
                html = `
                    <div id="tb_${this.name}_item_${item.id}" class="${classes.join(' ')} ${(item.class ? item.class : '')}"
                        style="${(item.hidden ? 'display: none;' : '')} ${item.type == 'label' ? (item.style ?? '') + ';' : ''}"
                        ${!item.disabled
                            ? `data-click='["click","${item.id}", "event"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${item.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${item.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${item.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${item.id}"]'`
                            : ''}
                    >
                        ${ icon }
                        ${ (text != '' && text != null) || item.count != null || arrow
                            ? `<div class="tsg-tb-text" style="${item.type != 'label' ? (item.style ?? '') : ''}; ${!text ? 'padding-left: 0; margin-left: 23px;' : ''}">
                                    ${ TsUtils.lang(text) }
                                    ${ item.count != null
                                        ? TsUtils.stripSpaces(`
                                            <span class="tsg-tb-count">
                                                <span class="${this.last.badge[item.id] ? this.last.badge[item.id].className ?? '' : ''}"
                                                        style="${this.last.badge[item.id] ? this.last.badge[item.id].style ?? '' : ''}">${item.count}</span>
                                            </span>`)
                                        : ''
                                    }
                                    ${ arrow
                                        ? `<span class="tsg-tb-down" ${!text && !item.count ? 'style="margin-left: -3px"' : ''}><span></span></span>`
                                        : ''
                                    }
                                </div>`
                            : ''
                        }
                    </div>
                `
                break
            }
            case 'break': {
                html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-break"
                            style="${(item.hidden ? 'display: none' : '')}; ${(item.style ? item.style : '')}">
                            &#160;
                        </div>`
                break
            }
            case 'spacer': {
                html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-spacer"
                            style="${(item.hidden ? 'display: none' : '')}; ${(item.style ? item.style : '')}">
                        </div>`
                break
            }
            case 'html': {
                html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-html ${classes.join(' ')}"
                            style="${(item.hidden ? 'display: none' : '')}; ${(item.style ? item.style : '')}">
                            ${(typeof item.html == 'function' ? item.html.call(this, item) : item.html)}
                        </div>`
                break
            }
            case 'input': {
                const ph = item.placeholder
                let val = item.value
                // For backword compatibility
                if (item.spinner && typeof item.spinner == 'object') {
                    item.input ??= {}
                    Object.assign(item.input, item.spinner, { spinner: true })
                }
                // round to step
                if (val != null && String(val).trim() !== '' && item.input?.spinner) {
                    const step = item.input?.step ?? 1
                    const prec = item.input?.precision ?? String(step).split('.')[1]?.length ?? 0
                    val = isNaN(val) ? val : Number(val).toFixed(prec)
                }
                html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-input tsg-eaction ${classes.join(' ')}"
                            style="${(item.hidden ? 'display: none' : '')}; ${(item.style ? item.style : '')}"
                        >
                            <span class="tsg-input-label">${item.text ?? ''}</span>
                            ${item.input?.spinner
                                ? `<span class="tsg-spinner-dec tsg-eaction" data-click='["spinner", "${item.id}", "dec", "event"]'> – </span>`
                                : ''}
                            <input class="tsg-toolbar-input tsg-eaction ${item.input?.spinner ? 'tsg-has-spinner' : ''}"
                                ${ph ? `placeholder="${ph}"` : ''} style="${item.input?.style ?? ''}"
                                value="${val ?? ''}${item.input?.suffix ?? ''}" ${item.input?.attrs ?? ''}
                                data-input='["change", "${item.id}", "this", true]'
                                data-change='["change", "${item.id}", "this"]'
                                data-keydown='["spinner", "${item.id}", "key", "event"]'
                                data-mouseenter='["mouseAction", "event", "this", "Enter", "${item.id}"]'
                                data-mouseleave='["mouseAction", "event", "this", "Leave", "${item.id}"]'
                            >
                            ${item.input?.spinner
                                ? `<span class="tsg-spinner-inc tsg-eaction" data-click='["spinner", "${item.id}", "inc", "event"]'> + </span>`
                                : ''}
                        </div>`
                break
            }
            case 'group': {
                html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-group"
                    style="display: flex; ${(item.hidden ? 'display: none' : '')}; ${(item.style ? item.style : '')}">`
                if (Array.isArray(item.items)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    item.items.forEach((it: any) => { // any: item shape is dynamic
                        html += this.getItemHTML(it)
                    })
                } else {
                    console.log('ERROR: toolbar group is empty')
                }
                html += '</div>'
            }
        }
        return html
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spinner(id: any, action: any, event?: any): void { // any: id/action/event are heterogeneous at runtime
        const it = this.get(id)
        let inc = 0
        const edata = this.trigger('keyDown', { id, item: it, originalEvent: event })
        switch (action) {
            case 'inc': {
                inc = (it.input?.step ?? 1)
                break
            }
            case 'dec': {
                inc = -(it.input?.step ?? 1)
                break
            }
            case 'key': {
                if (it.input?.spinner || it.input?.step != null) {
                    let mult = 1
                    if (event.shiftKey || event.metaKey) mult = 10
                    if (event.altKey) mult = 0.1
                    switch (event.key) {
                        case 'ArrowUp': {
                            inc = (it.input?.step ?? 1) * mult
                            event.preventDefault()
                            break
                        }
                        case 'ArrowDown': {
                            inc = -(it.input?.step ?? 1) * mult
                            event.preventDefault()
                            break
                        }
                    }
                }
                break
            }
        }
        if (inc !== 0) {
            this.change(id, parseFloat(it.value ?? 0) + inc)
        }
        edata.finish()
    }

    // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    change(id?: any, value?: any, dynamic?: any) {
        const it = this.get(id)
        const input = query(this.box).find('#tb_'+ this.name +'_item_'+ TsUtils.escapeId(id)).find('input.tsg-toolbar-input')
        if (value instanceof HTMLInputElement) {
            value = value.value
        }
        if (value == null) value = input.val()
        if (it.input?.spinner || it.input?.min != null || it.input?.max != null || it.input?.step != null) {
            value = parseFloat(value)
        }
        // remove suffix if it is there
        if (it.input?.suffix != null && String(value).substr(-it.input.suffix.length) == it.input.suffix) {
            value = String(value).substr(0, value.length - it.input.suffix.length)
        }
        // min/max
        if (it.input?.min != null && it.input.min > value) {
            value = it.input.min
        }
        if (it.input?.max != null && it.input.max < value) {
            value = it.input.max
        }
        // round to step
        if (it.input?.step != null) {
            if (isNaN(value)) value = it.input.min ?? 0
            const step = it.input.step ?? 1
            const prec = it.input.precision ?? String(step).split('.')[1]?.length ?? 0
            value = Number(value).toFixed(prec)
        }

        // event beofre
        const edata = this.trigger(dynamic ? 'input' : 'change', { target: id, id, value, item: it })
        if (edata.isCancelled) {
            return
        }
        it.value = value
        let suffix = ''
        if (it.input?.suffix != null && String(value).substr(-it.input.suffix.length) != it.input.suffix) {
            suffix = it.input.suffix
        }
        if (!dynamic) input.val(value + suffix)
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltipShow(id: any): void { // any: id can be string or number
        if (this.tooltip == null) return
        const el   = query(this.box).find('#tb_'+ this.name + '_item_'+ TsUtils.escapeId(id)).get(0) as HTMLElement
        const item = this.get(id)
        const overlay = (typeof this.tooltip == 'string' ? { position: this.tooltip } : this.tooltip)
        let txt  = item.tooltip
        if (typeof txt == 'function') txt = txt.call(this, item)
        // not for opened drop downs
        if (['menu', 'menu-radio', 'menu-check', 'drop', 'color', 'text-color'].includes(item.type)
            && item.checked == true) {
            return
        }
        TsTooltip.show({
            anchor: el,
            name: this.name + '-tooltip',
            html: txt,
            ...overlay
        })
        return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltipHide(_id: any): void { // any: id can be string or number
        if (this.tooltip == null) return
        TsTooltip.hide(this.name + '-tooltip')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuClick(event: any): void { // any: menu click event has dynamic detail shape
        if (event.item && !event.item.disabled) {
            // event before
            const edata = this.trigger((event.remove !== true ? 'click' : 'remove'), {
                target: event.item.id + ':' + event.subItem.id, item: event.item,
                subItem: event.subItem, originalEvent: event.originalEvent
            })
            if (edata.isCancelled === true) return

            // route processing
            const it    = event.subItem
            const item  = this.get(event.item.id)
            let items = item.items
            if (typeof items == 'function') items = item.items()
            if (item.type == 'menu') {
                item.selected = it.id
            }
            if (item.type == 'menu-radio') {
                item.selected = it.id
                if (Array.isArray(items)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items.forEach((item: any) => { // any: menu item shape is dynamic
                        if (item.checked === true) delete item.checked
                        if (Array.isArray(item.items)) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            item.items.forEach((item: any) => { // any: nested menu item shape is dynamic
                                if (item.checked === true) delete item.checked
                            })
                        }
                    })
                }
                it.checked = true
            }
            if (item.type == 'menu-check') {
                if (!Array.isArray(item.selected)) item.selected = []
                if (it.group == null) {
                    const ind = item.selected.indexOf(it.id)
                    if (ind == -1) {
                        item.selected.push(it.id)
                        it.checked = true
                    } else {
                        item.selected.splice(ind, 1)
                        it.checked = false
                    }
                } else if (it.group === false) {
                    // if group is false, then it is not part of checkboxes
                } else {
                    const unchecked = []
                    const ind = item.selected.indexOf(it.id)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const checkNested = (items: any): void => { // any: nested menu items have dynamic shape
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        items.forEach((sub: any) => { // any: sub-item shape is dynamic
                            if (sub.group === it.group) {
                                const ind = item.selected.indexOf(sub.id)
                                if (ind != -1) {
                                    if (sub.id != it.id) unchecked.push(sub.id)
                                    item.selected.splice(ind, 1)
                                }
                            }
                            if (Array.isArray(sub.items)) checkNested(sub.items)
                        })
                    }
                    checkNested(items)
                    if (ind == -1) {
                        item.selected.push(it.id)
                        it.checked = true
                    }
                }
            }
            if (typeof it.route == 'string') {
                let route = it.route !== '' ? String('/'+ it.route).replace(/\/{2,}/g, '/') : ''
                const info  = TsUtils.parseRoute(route)
                if (info.keys.length > 0) {
                    for (let k = 0; k < info.keys.length; k++) {
                        const key = info.keys[k]
                        if (key == null || this.routeData[key.name] == null) continue
                        route = route.replace((new RegExp(':'+ key.name, 'g')), this.routeData[key.name] as string)
                    }
                }
                setTimeout(() => { window.location.hash = route }, 1)
            }
            this.refresh(event.item.id)
            // event after
            edata.finish()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colorClick(event: any): void { // any: color pick event has dynamic shape
        if (event.item && !event.item.disabled) {
            // event before
            const edata = this.trigger('click', { target: event.item.id, item: event.item, color: event.color, final: true })
            if (edata.isCancelled === true) return

            // default behavior
            event.item.color = event.color
            this.refresh(event.item.id)

            // event after
            edata.finish()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouseAction(event: any, target: any, action: any, id: any): void { // any: mouse event and toolbar item ids are heterogeneous
        const btn = this.get(id)
        const edata = this.trigger('mouse' + action, { target: id, item: btn, object: btn, originalEvent: event })
        if (edata.isCancelled === true || btn.disabled || btn.hidden) { edata.finish(); return }
        switch (action) {
            case 'Enter':
                if (!['label', 'input'].includes(btn.type)) {
                    query(target).addClass('over')
                }
                this.tooltipShow(id)
                break
            case 'Leave':
                if (!['label', 'input'].includes(btn.type)) {
                    query(target).removeClass('over down')
                }
                this.tooltipHide(id)
                break
            case 'Down':
                if (!['label', 'input'].includes(btn.type)) {
                    query(target).addClass('down')
                }
                break
            case 'Up':
                if (!['label', 'input'].includes(btn.type)) {
                    query(target).removeClass('down')
                }
                break
        }
        edata.finish()
    }
}
export { TsToolbar }