/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTabs, TsToolbar
 *
 * T3.6: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - remove jQuery dependency
 *  - layout.confirm - refactored
 *  - layout.message - refactored
 *  - panel.removed
 *  - assignTabs
 */

import { TsBase } from './tsbase.js'
import { TsUi, TsUtils } from './tsutils.js'
import { query as _queryRaw, Query } from './query.js'
import { TsTabs } from './tstabs.js'
import { TsToolbar } from './tstoolbar.js'

// any: query() returns Query|void; cast once for clean selector usage
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

// IMPORTANT: do NOT rebind TsUi to a module-top const. esbuild's CJS bundle
// inlines tslayout BEFORE tsutils, so any module-init binding captures TsUi
// while it's still hoisted-undefined. Read TsUi at call time via this getter
// inside class methods (post-init).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _TsUiRegistry = (): Record<string, any> => TsUi as Record<string, any>

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

/** Valid panel type names in a layout */
export type TsPanelType = 'top' | 'left' | 'main' | 'preview' | 'right' | 'bottom'

/** Content that can be placed in a layout panel */
export type TsPanelContent =
    | string
    | { render: (box?: HTMLElement) => void; unmount?: () => void; box?: HTMLElement | null; [key: string]: unknown }

/** Individual panel configuration and runtime state */
export interface TsLayoutPanel {
    type: TsPanelType | null
    title: string
    size: number | string
    minSize: number
    maxSize: number | boolean
    hidden: boolean
    resizable: boolean
    overflow: string
    style: string
    html: TsPanelContent
    tabs: TsTabs | Record<string, unknown> | null
    toolbar: TsToolbar | Record<string, unknown> | null
    /** Runtime-computed width (read-only after resize) */
    width: number | null
    /** Runtime-computed height (read-only after resize) */
    height: number | null
    /** Runtime-computed size in pixels */
    sizeCalculated?: number
    show: {
        toolbar: boolean
        tabs: boolean
    }
    removed: ((info: { panel: string; html: TsPanelContent; html_new: TsPanelContent; transition: string }) => void) | null
    onRefresh: ((event: unknown) => void) | null
    onShow: ((event: unknown) => void) | null
    onHide: ((event: unknown) => void) | null
}

/** Options for the html() method return promise-like */
interface TsHtmlResult {
    panel: string
    html: TsPanelContent
    error: boolean
    cancelled: boolean
    status?: boolean
    removed: (cb: () => void) => void
}

const w2panels: TsPanelType[] = ['top', 'left', 'main', 'preview', 'right', 'bottom']

class TsLayout extends TsBase {
    declare box: HTMLElement | null
    declare name: string
    panels: TsLayoutPanel[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    last: Record<string, any> // any: accumulates resize state, observeResize, events dict
    padding: number
    resizer: number
    style: string
    onShow: ((event: unknown) => void) | null
    onHide: ((event: unknown) => void) | null
    onResizing: ((event: unknown) => void) | null
    onResizerClick: ((event: unknown) => void) | null
    onRender: ((event: unknown) => void) | null
    onRefresh: ((event: unknown) => void) | null
    onChange: ((event: unknown) => void) | null
    onResize: ((event: unknown) => void) | null
    onDestroy: ((event: unknown) => void) | null
    panel_template: TsLayoutPanel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: TsBase dynamic event handlers

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: any) { // any: options bag — mixed type at construction time
        super(options.name)
        this.box            = null // DOM Element that holds the element
        this.name           = '' // unique name for TsUi
        this.panels         = []
        this.last           = {}
        this.padding        = 1 // panel padding
        this.resizer        = 4 // resizer width or height
        this.style          = ''
        this.onShow         = null
        this.onHide         = null
        this.onResizing     = null
        this.onResizerClick = null
        this.onRender       = null
        this.onRefresh      = null
        this.onChange       = null
        this.onResize       = null
        this.onDestroy      = null
        this.panel_template = {
            type: null, // left, right, top, bottom
            title: '',
            size: 100, // width or height depending on panel name
            minSize: 20,
            maxSize: false,
            hidden: false,
            resizable: false,
            overflow: 'auto',
            style: '',
            html: '', // can be String or Object with .render(box) method
            tabs: null,
            toolbar: null,
            width: null, // read only
            height: null, // read only
            show: {
                toolbar: false,
                tabs: false
            },
            removed: null, // function to call when content is overwritten
            onRefresh: null,
            onShow: null,
            onHide: null
        }
        // mix in options
        Object.assign(this, options)
        if (!Array.isArray(this.panels)) this.panels = []
        // add defined panels
        this.panels.forEach((panel, ind) => {
            this.panels[ind] = TsUtils.extend({}, this.panel_template, panel)
            if (TsUtils.isPlainObject(panel.tabs) || Array.isArray(panel.tabs)) initTabs(this, panel.type)
            if (TsUtils.isPlainObject(panel.toolbar) || Array.isArray(panel.toolbar)) initToolbar(this, panel.type)
        })
        // add all other panels
        w2panels.forEach(tab => {
            if (this.get(tab) != null) return
            this.panels.push(TsUtils.extend({}, this.panel_template, { type: tab, hidden: (tab !== 'main'), size: 50 }))
        })

        // render if box specified
        // any: query().get(0) returns Node|Node[]; box selector always resolves to HTMLElement
        if (typeof this.box == 'string') this.box = query(this.box).get(0) as HTMLElement
        if (this.box) this.render(this.box)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function initTabs(object: TsLayout, panel: TsPanelType | null, tabs?: any): boolean { // any: tabs config bag
            const pan = panel != null ? object.get(panel) : null
            if (pan != null && tabs == null) tabs = pan.tabs
            if (pan == null || tabs == null) return false
            // instantiate tabs
            if (Array.isArray(tabs)) tabs = { tabs: tabs }
            const name = object.name + '_' + (panel ?? '') + '_tabs'
            if (_TsUiRegistry()[name]) _TsUiRegistry()[name].destroy() // destroy if existed
            pan.tabs      = new TsTabs(TsUtils.extend({}, tabs, { owner: object, name: object.name + '_' + (panel ?? '') + '_tabs' }))
            pan.show.tabs = true
            return true
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function initToolbar(object: TsLayout, panel: TsPanelType | null, toolbar?: any): boolean { // any: toolbar config bag
            const pan = panel != null ? object.get(panel) : null
            if (pan != null && toolbar == null) toolbar = pan.toolbar
            if (pan == null || toolbar == null) return false
            // instantiate toolbar
            if (Array.isArray(toolbar)) toolbar = { items: toolbar }
            const name = object.name + '_' + (panel ?? '') + '_toolbar'
            if (_TsUiRegistry()[name]) _TsUiRegistry()[name].destroy() // destroy if existed
            pan.toolbar      = new TsToolbar(TsUtils.extend({}, toolbar, { owner: object, name: object.name + '_' + (panel ?? '') + '_toolbar' }))
            pan.show.toolbar = true
            return true
        }
    }

    html(panel: string, data: TsPanelContent, transition?: string): TsHtmlResult {
        const p = this.get(panel)
        const promise: TsHtmlResult = {
            panel: panel,
            html: p.html,
            error: false,
            cancelled: false,
            removed(cb) {
                if (typeof cb == 'function') {
                    p.removed = cb
                }
            }
        }
        if (typeof p.removed == 'function') {
            p.removed({ panel: panel, html: p.html, html_new: data, transition: transition || 'none' })
            p.removed = null // this is one time call back only
        }
        // if it is CSS panel
        if (panel == 'css') {
            query(this.box).find('#layout_'+ this.name +'_panel_css').html('<style>'+ data +'</style>')
            promise.status = true
            return promise
        }
        if (p == null) {
            console.log('ERROR: incorrect panel name. Panel name can be main, left, right, top, bottom, preview or css')
            promise.error = true
            return promise
        }
        if (data == null) {
            return promise
        }
        // event before
        const edata = this.trigger('change', { target: panel, panel: p, html_new: data, transition: transition })
        if (edata.isCancelled === true) {
            promise.cancelled = true
            return promise
        }
        const pname = '#layout_'+ this.name + '_panel_'+ p.type
        const current = query(this.box).find(pname + '> [data-role="panel-content"]')
        let panelTop: string | number = 0
        if (current.length > 0) {
            // any: query().get(0) returns Node|Node[]; panel element is always HTMLElement
            ;(query(this.box).find(pname).get(0) as HTMLElement).scrollTop = 0
            panelTop = query(current).css('top') as string
        }
        // clean up previous content
        if (typeof (p.html as { unmount?: unknown }).unmount == 'function') (p.html as { unmount: () => void }).unmount()
        current.addClass('tsg-panel-content')
        current.removeAttr('style') // styles could have added manually, but all necessary will be added by resizeBoxes
        this.resizeBoxes(panel)

        if (p.html === '') {
            p.html = data
            this.refresh(panel)
        } else {
            p.html = data
            if (!p.hidden) {
                if (transition != null && transition !== '') {
                    // apply transition
                    query(this.box).addClass('animating')
                    const div1 = query(this.box).find(pname + '> [data-role="panel-content"]')
                    // any: query()[0] returns Node; panel content div is HTMLElement
                    div1.after('<div class="tsg-panel-content new-panel" data-role="panel-content" style="'+ (div1[0] as HTMLElement).style.cssText +'"></div>')
                    const div2 = query(this.box).find(pname + '> [data-role="panel-content"].new-panel')
                    div1.css('top', panelTop)
                    div2.css('top', panelTop)
                    if (typeof data == 'object') {
                        data.box = div2[0] as HTMLElement // do not do .render(box);
                        data.render()
                    } else {
                        div2.hide().html(data)
                    }
                    // transition
                    let style1: string, style2: string
                    switch (transition) {
                        case 'slide-left':
                            style1 = 'left: -'+ TsUtils.getSize(query(this.box), 'width') +'px'
                            style2 = 'left: 0px'
                            break
                        case 'slide-right':
                            style1 = 'left: '+ TsUtils.getSize(query(this.box), 'width') +'px'
                            style2 = 'left: 0px'
                            break
                        case 'slide-down':
                            style1 = 'top: -'+ TsUtils.getSize(query(this.box), 'height') +'px'
                            style2 = 'top: '+ panelTop +'px'
                            break
                        case 'slide-up':
                            style1 = 'top: '+ TsUtils.getSize(query(this.box), 'height') +'px'
                            style2 = 'top: '+ panelTop +'px'
                            break
                        case 'flip-left':
                            style1 = 'transform: rotate(90deg)'
                            style2 = 'transform: rotate(0deg)'
                            break
                        case 'flip-right':
                            style1 = 'transform: rotate(-90deg)'
                            style2 = 'transform: rotate(0deg)'
                            break
                        case 'flip-down':
                            style1 = 'transform: rotate(-180deg)'
                            style2 = 'transform: rotate(0deg)'
                            break
                        case 'flip-up':
                            style1 = 'transform: rotate(180deg)'
                            style2 = 'transform: rotate(0deg)'
                            break
                        case 'pop-in':
                            style1 = 'transform: scale(.5); opacity: 0;'
                            style2 = 'transform: scale(1); opacity: 1;'
                            break
                        case 'pop-out':
                            style1 = 'transform: scale(1); opacity: 1;'
                            style2 = 'transform: scale(.5); opacity: 0;'
                            break
                        default:
                            style1 = ''
                            style2 = ''
                    }
                    div1.addClass('previous').css({ 'cssText': 'transition: .5s; '+ style1 })
                    div2.addClass('current').css({ 'cssText': 'transition: .5s; '+ style2 })
                    // clean
                    setTimeout(() => {
                        query(this.box).removeClass('animating')
                        div1.remove()
                        div2.removeClass('new-panel current')
                        query(this.box).find(pname +'> [data-role="panel-content"]')
                            .css({ 'cssText': '' })
                        edata.finish()
                    }, 500)
                } else {
                    this.refresh(panel)
                    edata.finish()
                }
            } else {
                edata.finish()
            }
        }
        return promise
    }

    message(panel: string, options: unknown) {
        const p = this.get(panel)
        const box = query(this.box).find('#layout_'+ this.name + '_panel_'+ p.type)
        const oldOverflow = box.css('overflow') as string
        box.css('overflow', 'hidden')
        // any: options is pass-through from caller; TsUtils.message accepts string|number|object
        const prom = TsUtils.message({
            owner: this as unknown as { name?: string; lock?: (...args: unknown[]) => void; unlock?: (...args: unknown[]) => void; focus?: () => void },
            // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
            box  : box.get(0) as HTMLElement,
            after: '.tsg-panel-title',
            param: panel
        // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, options as any)
        if (prom) {
            prom.self.on('close:after', () => {
                box.css('overflow', oldOverflow)
            })
        }
        return prom
    }

    confirm(panel: string, options: unknown) {
        const p = this.get(panel)
        const box = query(this.box).find('#layout_'+ this.name + '_panel_'+ p.type)
        const oldOverflow = box.css('overflow') as string
        box.css('overflow', 'hidden')
        // any: options is pass-through from caller; TsUtils.confirm accepts string|number|object
        const prom = TsUtils.confirm({
            owner : this as unknown as { name?: string; lock?: (...args: unknown[]) => void; unlock?: (...args: unknown[]) => void; focus?: () => void },
            // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
            box   : box.get(0) as HTMLElement,
            after : '.tsg-panel-title',
            param : panel
        // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, options as any)
        if (prom) {
            prom.self.on('close:after', () => {
                box.css('overflow', oldOverflow)
            })
        }
        return prom
    }

    load(panel: string, url: string, transition?: string) {
        return new Promise<TsHtmlResult | void>((resolve, reject) => {
            if ((panel == 'css' || this.get(panel) != null) && url != null) {
                fetch(url)
                    .then(resp => resp.text())
                    .then(text => {
                        this.resize()
                        resolve(this.html(panel, text, transition))
                    })
            } else {
                reject()
            }
        })
    }

    sizeTo(panel: string, size: number | string, instant?: boolean) {
        const pan = this.get(panel)
        if (pan == null) return false
        // resize
        query(this.box).find(':scope > div > .tsg-panel')
            .css('transition', (instant !== true ? '.2s' : '0s'))
        setTimeout(() => { this.set(panel, { size: size }) }, 1)
        // clean
        setTimeout(() => {
            query(this.box).find(':scope > div > .tsg-panel').css('transition', '0s')
            this.resize()
        }, 300)
        return true
    }

    show(panel: string, immediate?: boolean) {
        // event before
        const edata = this.trigger('show', { target: panel, thisect: this.get(panel), immediate: immediate })
        if (edata.isCancelled === true) return

        const p = this.get(panel)
        if (p == null) return false
        p.hidden = false
        if (immediate === true) {
            query(this.box).find('#layout_'+ this.name +'_panel_'+panel)
                .css({ 'opacity': '1' })
            edata.finish()
            this.resize()
        } else {
            // resize
            query(this.box).addClass('animating')
            query(this.box).find('#layout_'+ this.name +'_panel_'+panel)
                .css({ 'opacity': '0' })
            query(this.box).find(':scope > div > .tsg-panel')
                .css('transition', '.2s')
            setTimeout(() => { this.resize() }, 1)
            // show
            setTimeout(() => {
                query(this.box).find('#layout_'+ this.name +'_panel_'+ panel).css({ 'opacity': '1' })
            }, 250)
            // clean
            setTimeout(() => {
                query(this.box).find(':scope > div > .tsg-panel')
                    .css('transition', '0s')
                query(this.box).removeClass('animating')
                edata.finish()
                this.resize()
            }, 300)
        }
        return true
    }

    hide(panel: string, immediate?: boolean) {
        // event before
        const edata = this.trigger('hide', { target: panel, object: this.get(panel), immediate: immediate })
        if (edata.isCancelled === true) return

        const p = this.get(panel)
        if (p == null) return false
        p.hidden = true
        if (immediate === true) {
            query(this.box).find('#layout_'+ this.name +'_panel_'+panel)
                .css({ 'opacity': '0' })
            edata.finish()
            this.resize()
        } else {
            // hide
            query(this.box).addClass('animating')
            query(this.box).find(':scope > div > .tsg-panel')
                .css('transition', '.2s')
            query(this.box).find('#layout_'+ this.name +'_panel_'+panel)
                .css({ 'opacity': '0' })
            setTimeout(() => { this.resize() }, 1)
            // clean
            setTimeout(() => {
                query(this.box).find(':scope > div > .tsg-panel')
                    .css('transition', '0s')
                query(this.box).removeClass('animating')
                edata.finish()
                this.resize()
            }, 300)
        }
        return true
    }

    toggle(panel: string, immediate?: boolean) {
        const p = this.get(panel)
        if (p == null) return false
        if (p.hidden) return this.show(panel, immediate); else return this.hide(panel, immediate)
    }

    set(panel: string, options: Partial<TsLayoutPanel>) {
        const ind = this.get(panel, true)
        if (ind == null) return false
        TsUtils.extend(this.panels[ind], options)
        // refresh only when content changed
        if (options.html != null || options.resizable != null) {
            this.refresh(panel)
        }
        // show/hide resizer
        this.resize() // resize is needed when panel size is changed
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(panel: string, returnIndex?: boolean): any { // any: returns panel object or index depending on returnIndex
        for (let p = 0; p < this.panels.length; p++) {
            const pan = this.panels[p]
            if (pan != null && pan.type == panel) {
                if (returnIndex === true) return p; else return pan
            }
        }
        return null
    }

    el(panel: string): HTMLElement | null {
        const el = query(this.box).find('#layout_'+ this.name +'_panel_'+ panel +'> [data-role="panel-content"]')
        if (el.length != 1) return null
        // any: query()[0] returns Node; panel content element is always HTMLElement
        return el[0] as HTMLElement
    }

    hideToolbar(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        pan.show.toolbar = false
        query(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).hide()
        this.resize()
    }

    showToolbar(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        pan.show.toolbar = true
        query(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).show()
        this.resize()
    }

    toggleToolbar(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        if (pan.show.toolbar) this.hideToolbar(panel); else this.showToolbar(panel)
    }

    assignToolbar(panel: string, toolbar: TsToolbar | string | null) {
        if (typeof toolbar == 'string' && _TsUiRegistry()[toolbar] != null) toolbar = _TsUiRegistry()[toolbar]
        const pan = this.get(panel)
        pan.toolbar = toolbar
        // any: query().attr(name) returns string|undefined; used as selector fallback
        const tmp = query(this.box).find(panel +'> [data-role="panel-toolbar"]')
        if (pan.toolbar != null) {
            if ((tmp.attr('name') as string | undefined) != (pan.toolbar as TsToolbar).name) {
                // any: query().get(0) returns Node|Node[]; toolbar container is HTMLElement
                ;(pan.toolbar as TsToolbar).render(tmp.get(0) as HTMLElement)
            } else if (pan.toolbar != null) {
                ;(pan.toolbar as TsToolbar).refresh()
            }
            if (typeof toolbar != 'string' && toolbar) toolbar['owner'] = this
            this.showToolbar(panel)
            this.refresh(panel)
        } else {
            tmp.html('')
            this.hideToolbar(panel)
        }
    }

    hideTabs(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        pan.show.tabs = false
        query(this.box).find('#layout_'+ this.name +'_panel_'+ panel +'> [data-role="panel-tabs"]').hide()
        this.resize()
    }

    showTabs(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        pan.show.tabs = true
        query(this.box).find('#layout_'+ this.name +'_panel_'+ panel +'> [data-role="panel-tabs"]').show()
        this.resize()
    }

    toggleTabs(panel: string) {
        const pan = this.get(panel)
        if (!pan) return
        if (pan.show.tabs) this.hideTabs(panel); else this.showTabs(panel)
    }

    assignTabs(panel: string, tabs: TsTabs | string | null) {
        if (typeof tabs == 'string' && _TsUiRegistry()[tabs] != null) tabs = _TsUiRegistry()[tabs]
        const pan = this.get(panel)
        pan.tabs = tabs
        const tmp = query(this.box).find(panel +'> [data-role="panel-tabs"]')
        if (pan.tabs != null) {
            if ((tmp.attr('name') as string | undefined) != (pan.tabs as TsTabs).name) {
                // any: query().get(0) returns Node|Node[]; tabs container is HTMLElement
                ;(pan.tabs as TsTabs).render(tmp.get(0) as HTMLElement)
            } else if (pan.tabs != null) {
                ;(pan.tabs as TsTabs).refresh()
            }
            if (typeof tabs != 'string' && tabs) tabs['owner'] = this
            this.showTabs(panel)
            this.refresh(panel)
        } else {
            tmp.html('')
            this.hideTabs(panel)
        }
    }

    override render(box?: HTMLElement | string) {
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        // any: query().get(0) returns Node|Node[]; box selector always resolves to HTMLElement
        if (typeof box == 'string') box = query(box).get(0) as HTMLElement
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // default action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box
        }
        if (!this.box) return false
        // render layout
        // any: .attr(name,val) overload returns string|Query; cast to Query for chaining
        ;(query(this.box)
            .attr('name', this.name) as unknown as Query)
            .addClass('tsg-layout')
            .html('<div></div>')
        if (query(this.box).length > 0) {
            // any: query()[0] returns Node; layout box is HTMLElement
            ;(query(this.box)[0] as HTMLElement).style.cssText += this.style
        }
        // create all panels
        for (let p1 = 0; p1 < w2panels.length; p1++) {
            const html = '<div id="layout_'+ this.name + '_panel_'+ w2panels[p1] +'" class="tsg-panel">'+
                        '    <div class="tsg-panel-title"></div>'+
                        '    <div class="tsg-panel-tabs" data-role="panel-tabs"></div>'+
                        '    <div class="tsg-panel-toolbar" data-role="panel-toolbar"></div>'+
                        '    <div class="tsg-panel-content" data-role="panel-content"></div>'+
                        '</div>'+
                        '<div id="layout_'+ this.name + '_resizer_'+ w2panels[p1] +'" class="tsg-resizer"></div>'
            query(this.box).find(':scope > div').append(html)
        }
        query(this.box).find(':scope > div')
            .append('<div id="layout_'+ this.name + '_panel_css" style="position: absolute; top: 10000px;"></div>')
        this.refresh() // if refresh is not called here, the layout will not be available right after initialization
        // observe div resize
        this.last['observeResize'] = new ResizeObserver(() => { this.resize() })
        this.last['observeResize'].observe(this.box)
        // process event
        edata.finish()
        // re-init events
        setTimeout(() => { // needed this timeout to allow browser to render first if there are tabs or toolbar
            self.last['events'] = { resizeStart, mouseMove, mouseUp }
            this.resize()
        }, 0)
        return Date.now() - time

        function resizeStart(type: string, evnt: MouseEvent) {
            if (!self.box) return
            if (!evnt) evnt = window.event as MouseEvent
            query(document)
                .off('mousemove', self.last['events'].mouseMove)
                .on('mousemove', self.last['events'].mouseMove)
            query(document)
                .off('mouseup', self.last['events'].mouseUp)
                .on('mouseup', self.last['events'].mouseUp)
            self.last['resize'] = {
                type    : type,
                x       : evnt.screenX,
                y       : evnt.screenY,
                diff_x  : 0,
                diff_y  : 0,
                value   : 0
            }
            // lock all panels
            w2panels.forEach(panel => {
                const $tmp = query(self.el(panel)).find('.tsg-lock')
                if ($tmp.length > 0) {
                    $tmp.data('locked', 'yes')
                } else {
                    self.lock(panel, { opacity: 0 })
                }
            })
            // any: query().get(0) returns Node|Node[]; resizer element is HTMLElement
            const el = query(self.box).find('#layout_'+ self.name +'_resizer_'+ type).get(0) as HTMLElement
            if (type == 'left' || type == 'right') {
                self.last['resize'].value = parseInt(el.style.left)
            }
            if (type == 'top' || type == 'preview' || type == 'bottom') {
                self.last['resize'].value = parseInt(el.style.top)
            }
        }

        function mouseUp(evnt: MouseEvent) {
            if (!self.box) return
            if (!evnt) evnt = window.event as MouseEvent
            query(document).off('mousemove', self.last['events'].mouseMove)
            query(document).off('mouseup', self.last['events'].mouseUp)
            if (self.last['resize'] == null) return
            // unlock all panels
            w2panels.forEach(panel => {
                const $tmp = query(self.el(panel)).find('.tsg-lock')
                if ($tmp.data('locked') == 'yes') {
                    $tmp.removeData('locked')
                } else {
                    self.unlock(panel)
                }
            })
            // set new size
            if (self.last['diff_x'] !== 0 || self.last['resize'].diff_y !== 0) { // only recalculate if changed
                const ptop    = self.get('top')
                const pbottom = self.get('bottom')
                const panel   = self.get(self.last['resize'].type)
                const width   = TsUtils.getSize(query(self.box), 'width')
                const height  = TsUtils.getSize(query(self.box), 'height')
                const str     = String(panel.size)
                let ns: number, nd: number
                switch (self.last['resize'].type) {
                    case 'top':
                        ns = parseInt(panel.sizeCalculated) + self.last['resize'].diff_y
                        nd = 0
                        break
                    case 'bottom':
                        ns = parseInt(panel.sizeCalculated) - self.last['resize'].diff_y
                        nd = 0
                        break
                    case 'preview':
                        ns = parseInt(panel.sizeCalculated) - self.last['resize'].diff_y
                        nd = (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) +
                            (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0)
                        break
                    case 'left':
                        ns = parseInt(panel.sizeCalculated) + self.last['resize'].diff_x
                        nd = 0
                        break
                    case 'right':
                        ns = parseInt(panel.sizeCalculated) - self.last['resize'].diff_x
                        nd = 0
                        break
                    default:
                        ns = 0
                        nd = 0
                }
                // set size
                if (str.substr(str.length-1) == '%') {
                    panel.size = Math.floor(ns * 100 / (panel.type == 'left' || panel.type == 'right' ? width : height - nd) * 100) / 100 + '%'
                } else {
                    if (String(panel.size).substr(0, 1) == '-') {
                        panel.size = parseInt(panel.size) - panel.sizeCalculated + ns
                    } else {
                        panel.size = ns
                    }
                }
                self.resize()
            }
            query(self.box)
                .find('#layout_'+ self.name + '_resizer_'+ self.last['resize'].type)
                .removeClass(null)
                .addClass('active')
            query(self.box)
                .find('#layout_'+ self.name + '_resizer_'+ self.last['resize'].type)
                .removeClass('active')
            delete self.last['resize']
        }

        function mouseMove(evnt: MouseEvent) {
            if (!self.box) return
            if (!evnt) evnt = window.event as MouseEvent
            if (self.last['resize'] == null) return
            const panel = self.get(self.last['resize'].type)
            // event before
            const tmp   = self.last['resize']
            const edata = self.trigger('resizing', { target: self.name, object: panel, originalEvent: evnt,
                panel: tmp ? tmp.type : 'all', diff_x: tmp ? tmp.diff_x : 0, diff_y: tmp ? tmp.diff_y : 0 })
            if (edata.isCancelled === true) return

            const p         = query(self.box).find('#layout_'+ self.name + '_resizer_'+ tmp.type)
            const resize_x  = (evnt.screenX - tmp.x)
            const resize_y  = (evnt.screenY - tmp.y)
            const mainPanel = self.get('main')

            if (!p.hasClass('active')) p.addClass('active')

            let adjusted_x = resize_x
            let adjusted_y = resize_y

            switch (tmp.type) {
                case 'left':
                    if (panel.minSize - adjusted_x > panel.width) {
                        adjusted_x = panel.minSize - panel.width
                    }
                    if (panel.maxSize && (panel.width + adjusted_x > panel.maxSize)) {
                        adjusted_x = panel.maxSize - panel.width
                    }
                    if (mainPanel.minSize + adjusted_x > mainPanel.width) {
                        adjusted_x = mainPanel.width - mainPanel.minSize
                    }
                    break

                case 'right':
                    if (panel.minSize + adjusted_x > panel.width) {
                        adjusted_x = panel.width - panel.minSize
                    }
                    if (panel.maxSize && (panel.width - adjusted_x > panel.maxSize)) {
                        adjusted_x = panel.width - panel.maxSize
                    }
                    if (mainPanel.minSize - adjusted_x > mainPanel.width) {
                        adjusted_x = mainPanel.minSize - mainPanel.width
                    }
                    break

                case 'top':
                    if (panel.minSize - adjusted_y > panel.height) {
                        adjusted_y = panel.minSize - panel.height
                    }
                    if (panel.maxSize && (panel.height + adjusted_y > panel.maxSize)) {
                        adjusted_y = panel.maxSize - panel.height
                    }
                    if (mainPanel.minSize + adjusted_y > mainPanel.height) {
                        adjusted_y = mainPanel.height - mainPanel.minSize
                    }
                    break

                case 'preview':
                case 'bottom':
                    if (panel.minSize + adjusted_y > panel.height) {
                        adjusted_y = panel.height - panel.minSize
                    }
                    if (panel.maxSize && (panel.height - adjusted_y > panel.maxSize)) {
                        adjusted_y = panel.height - panel.maxSize
                    }
                    if (mainPanel.minSize - adjusted_y > mainPanel.height) {
                        adjusted_y = mainPanel.minSize - mainPanel.height
                    }
                    break
            }
            tmp.diff_x = adjusted_x
            tmp.diff_y = adjusted_y

            switch (tmp.type) {
                case 'top':
                case 'preview':
                case 'bottom':
                    tmp.diff_x = 0
                    // any: query()[0] returns Node; resizer element is HTMLElement
                    if (p.length > 0) (p[0] as HTMLElement).style.top = (tmp.value + tmp.diff_y) + 'px'
                    break

                case 'left':
                case 'right':
                    tmp.diff_y = 0
                    // any: query()[0] returns Node; resizer element is HTMLElement
                    if (p.length > 0) (p[0] as HTMLElement).style.left = (tmp.value + tmp.diff_x) + 'px'
                    break
            }
            // event after
            edata.finish()
        }
    }

    override unmount(): void {
        super.unmount()
        this.panels.forEach(panel => {
            // any: tabs/toolbar may be TsTabs/TsToolbar or plain config object
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(panel.tabs as any)?.unmount?.()
            // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(panel.toolbar as any)?.unmount?.()
        })
        this.last['observeResize']?.disconnect()
    }

    destroy() {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        if (_TsUiRegistry()[this.name] == null) return false
        // clean up
        this.panels.forEach(panel => {
            // any: tabs/toolbar may be TsTabs/TsToolbar or plain config object
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(panel.tabs as any)?.destroy?.()
            // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(panel.toolbar as any)?.destroy?.()
        })
        if (query(this.box).find('#layout_'+ this.name +'_panel_main').length > 0) {
            this.unmount()
        }
        delete _TsUiRegistry()[this.name]
        // event after
        edata.finish()
        if (this.last['events'] && this.last['events'].resize) {
            query(window).off('resize', this.last['events'].resize)
        }
        return true
    }

    refresh(panel?: string) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        // if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection
        const time = Date.now()
        // event before
        const edata = self.trigger('refresh', { target: (panel != null ? panel : self.name), object: panel != null ? self.get(panel) : null })
        if (edata.isCancelled === true) return
        // self.unlock(panel);
        if (typeof panel == 'string') {
            const p = self.get(panel)
            if (p == null) return
            const pname = '#layout_'+ self.name + '_panel_'+ p.type
            const rname = '#layout_'+ self.name +'_resizer_'+ p.type
            // apply properties to the panel
            query(self.box).find(pname).css({ display: p.hidden ? 'none' : 'block' })
            if (p.resizable) {
                query(self.box).find(rname).show()
            } else {
                query(self.box).find(rname).hide()
            }
            // insert content
            if (typeof p.html == 'object' && typeof (p.html as { render?: unknown }).render === 'function') {
                // any: query()[0] returns Node; panel content element is HTMLElement
                ;(p.html as { box: HTMLElement | null; render: () => void }).box =
                    query(self.box).find(pname +'> [data-role="panel-content"]')[0] as HTMLElement
                setTimeout(() => {
                    // need to remove unnecessary classes
                    if (query(self.box).find(pname +'> [data-role="panel-content"]').length > 0) {
                        // any: css(key,val) and query()[0] chain issues; cast needed for .style.cssText
                        const $content = query(self.box).find(pname +'> [data-role="panel-content"]')
                            .removeClass(null)
                            .removeAttr('name')
                            .addClass('tsg-panel-content')
                        ;(($content.css('overflow', p.overflow) as unknown as Query)[0] as HTMLElement).style.cssText += ';' + p.style
                    }
                    if (p.html && typeof (p.html as { render?: unknown }).render == 'function') {
                        ;(p.html as { render: () => void }).render() // do not do .render(box);
                    }
                }, 1)
            } else {
                // need to remove unnecessary classes
                if (query(self.box).find(pname +'> [data-role="panel-content"]').length > 0) {
                    // any: html(val) and css(key,val) both return union types; cast for chaining
                    const $content = query(self.box).find(pname +'> [data-role="panel-content"]')
                        .removeClass(null)
                        .removeAttr('name')
                        .addClass('tsg-panel-content')
                    ;(((($content.html(p.html as string) as unknown as Query)
                        .css('overflow', p.overflow)) as unknown as Query)[0] as HTMLElement).style.cssText += ';' + p.style
                }
            }
            // if there are tabs and/or toolbar - render it
            let tmp = query(self.box).find(pname +'> [data-role="panel-tabs"]')
            if (p.show.tabs) {
                if ((tmp.attr('name') as string | undefined) != (p.tabs as TsTabs)?.name && p.tabs != null) {
                    ;(p.tabs as TsTabs).render(tmp.get(0) as HTMLElement)
                } else {
                    ;(p.tabs as TsTabs).refresh()
                }
                tmp.addClass('tsg-panel-tabs')
            } else {
                // any: html(val) return type is string|Query; cast needed to chain removeAttr/css
                ;(tmp.html('') as unknown as Query).removeAttr('name').removeClass(null)
                // any: css(key,val) overload; need to chain hide after css
                ;(tmp.css('display', 'none') as unknown as Query).hide()
            }
            tmp = query(self.box).find(pname +'> [data-role="panel-toolbar"]')
            if (p.show.toolbar) {
                if ((tmp.attr('name') as string | undefined) != (p.toolbar as TsToolbar)?.name && p.toolbar != null) {
                    ;(p.toolbar as TsToolbar).render(tmp.get(0) as HTMLElement)
                } else {
                    ;(p.toolbar as TsToolbar).refresh()
                }
                tmp.addClass('tsg-panel-toolbar')
            } else {
                // any: html(val) return type is string|Query; cast needed to chain removeAttr/css
                ;(tmp.html('') as unknown as Query).removeAttr('name').removeClass(null)
                // any: css(key,val) overload; need to chain hide after css
                ;(tmp.css('display', 'none') as unknown as Query).hide()
            }
            // show title
            tmp = query(self.box).find(pname +'> .tsg-panel-title')
            if (p.title) {
                // any: html(val) return type is string|Query; cast needed to chain show/hide
                ;(tmp.html(p.title) as unknown as Query).show()
            } else {
                ;(tmp.html('') as unknown as Query).hide()
            }
        } else {
            if (query(self.box).find('#layout_'+ self.name +'_panel_main').length === 0) {
                self.render()
                return
            }
            self.resize()
            // refresh all of them
            for (let p1 = 0; p1 < this.panels.length; p1++) { const p = this.panels[p1]; if (p != null) self.refresh(p.type ?? undefined) }
        }
        edata.finish()
        return Date.now() - time
    }

    resize() {
        // if (window.getSelection) window.getSelection().removeAllRanges();    // clear selection
        if (!this.box) return false
        const time = Date.now()
        // event before
        const tmp   = this.last['resize']
        const edata = this.trigger('resize', { target: this.name,
            panel: tmp ? tmp.type : 'all', diff_x: tmp ? tmp.diff_x : 0, diff_y: tmp ? tmp.diff_y : 0 })
        if (edata.isCancelled === true) return
        if (this.padding < 0) this.padding = 0

        // layout itself
        const width  = TsUtils.getSize(query(this.box), 'width')
        const height = TsUtils.getSize(query(this.box), 'height')
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        // panels
        const pmain   = this.get('main')
        const pprev   = this.get('preview')
        const pleft   = this.get('left')
        const pright  = this.get('right')
        const ptop    = this.get('top')
        const pbottom = this.get('bottom')
        const sprev   = (pprev != null && pprev.hidden !== true ? true : false)
        const sleft   = (pleft != null && pleft.hidden !== true ? true : false)
        const sright  = (pright != null && pright.hidden !== true ? true : false)
        const stop    = (ptop != null && ptop.hidden !== true ? true : false)
        const sbottom = (pbottom != null && pbottom.hidden !== true ? true : false)
        let l: number, t: number, w: number, h: number
        // calculate %
        for (let p = 0; p < w2panels.length; p++) {
            const panelType = w2panels[p]
            if (panelType == null || panelType === 'main') continue
            const panTmp = this.get(panelType)
            if (!panTmp) continue
            const str = String(panTmp.size || 0)
            if (str.substr(str.length-1) == '%') {
                let tmph = height
                if (panTmp.type == 'preview') {
                    tmph = tmph -
                        (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) -
                        (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0)
                }
                panTmp.sizeCalculated = parseInt(String((panTmp.type == 'left' || panTmp.type == 'right' ? width : tmph) * parseFloat(panTmp.size as string) / 100))
            } else {
                panTmp.sizeCalculated = parseInt(panTmp.size as string)
            }
            panTmp.sizeCalculated = Math.max(panTmp.sizeCalculated, parseInt(panTmp.minSize as unknown as string))
        }
        // negative size
        if (parseInt(pright.size as string) < 0) {
            if (sleft && parseInt(pleft.size as string) < 0) {
                console.log('ERROR: you cannot have both left panel.size and right panel.size be negative.')
            } else {
                pright.sizeCalculated = width - (sleft ? pleft.sizeCalculated : 0) + parseInt(pright.size as string)
            }
        }
        if (parseInt(pleft.size as string) < 0) {
            if (sright && parseInt(pright.size as string) < 0) {
                console.log('ERROR: you cannot have both left panel.size and right panel.size be negative.')
            } else {
                pleft.sizeCalculated = width - (sright ? pright.sizeCalculated : 0) + parseInt(pleft.size as string)
            }
        }
        if (parseInt(pprev.size as string) < 0) {
            pprev.sizeCalculated = height + parseInt(pprev.size as string)
            if (pprev.sizeCalculated > height) pprev.sizeCalculated = height
        }
        // top if any
        if (ptop != null && ptop.hidden !== true) {
            l = 0
            t = 0
            w = width
            h = ptop.sizeCalculated
            query(this.box).find('#layout_'+ this.name +'_panel_top')
                .css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                })
            ptop.width  = w
            ptop.height = h
            // resizer
            if (ptop.resizable) {
                t = ptop.sizeCalculated - (this.padding === 0 ? this.resizer : 0)
                h = (this.resizer > this.padding ? this.resizer : this.padding)
                // any: css(obj) returns string|Record|Query; cast needed to chain off/on
                ;(query(this.box).find('#layout_'+ this.name +'_resizer_top')
                    .css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }) as unknown as Query)
                    .off('mousedown')
                    .on('mousedown', function(event) {
                        event.preventDefault()
                        // event before
                        const edata = self.trigger('resizerClick', { target: 'top', originalEvent: event })
                        if (edata.isCancelled === true) return
                        // default action
                        // any: TsUi registry value is dynamic; resize events dict accessed at runtime
                        _TsUiRegistry()[self.name].last.events.resizeStart('top', event)
                        // event after
                        edata.finish()
                        return false
                    })
            }
        } else {
            query(this.box).find('#layout_'+ this.name +'_panel_top').hide()
            query(this.box).find('#layout_'+ this.name +'_resizer_top').hide()
        }
        // left if any
        if (pleft != null && pleft.hidden !== true) {
            l = 0
            t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0)
            w = pleft.sizeCalculated
            h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
                    (sbottom ? pbottom.sizeCalculated + this.padding : 0)
            query(this.box).find('#layout_'+ this.name +'_panel_left')
                .css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                })
            pleft.width  = w
            pleft.height = h
            // resizer
            if (pleft.resizable) {
                l = pleft.sizeCalculated - (this.padding === 0 ? this.resizer : 0)
                w = (this.resizer > this.padding ? this.resizer : this.padding)
                // any: css(obj) returns string|Record|Query; cast needed to chain off/on
                ;(query(this.box).find('#layout_'+ this.name +'_resizer_left')
                    .css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ew-resize'
                    }) as unknown as Query)
                    .off('mousedown')
                    .on('mousedown', function(event) {
                        event.preventDefault()
                        // event before
                        const edata = self.trigger('resizerClick', { target: 'left', originalEvent: event })
                        if (edata.isCancelled === true) return
                        // default action
                        _TsUiRegistry()[self.name].last.events.resizeStart('left', event)
                        // event after
                        edata.finish()
                        return false
                    })
            }
        } else {
            query(this.box).find('#layout_'+ this.name +'_panel_left').hide()
            query(this.box).find('#layout_'+ this.name +'_resizer_left').hide()
        }
        // right if any
        if (pright != null && pright.hidden !== true) {
            l = width - pright.sizeCalculated
            t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0)
            w = pright.sizeCalculated
            h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
                (sbottom ? pbottom.sizeCalculated + this.padding : 0)
            query(this.box).find('#layout_'+ this.name +'_panel_right')
                .css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                })
            pright.width  = w
            pright.height = h
            // resizer
            if (pright.resizable) {
                l = l - this.padding
                w = (this.resizer > this.padding ? this.resizer : this.padding)
                // any: css(obj) returns string|Record|Query; cast needed to chain off/on
                ;(query(this.box).find('#layout_'+ this.name +'_resizer_right')
                    .css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ew-resize'
                    }) as unknown as Query)
                    .off('mousedown')
                    .on('mousedown', function(event) {
                        event.preventDefault()
                        // event before
                        const edata = self.trigger('resizerClick', { target: 'right', originalEvent: event })
                        if (edata.isCancelled === true) return
                        // default action
                        _TsUiRegistry()[self.name].last.events.resizeStart('right', event)
                        // event after
                        edata.finish()
                        return false
                    })
            }
        } else {
            query(this.box).find('#layout_'+ this.name +'_panel_right').hide()
            query(this.box).find('#layout_'+ this.name +'_resizer_right').hide()
        }
        // bottom if any
        if (pbottom != null && pbottom.hidden !== true) {
            l = 0
            t = height - pbottom.sizeCalculated
            w = width
            h = pbottom.sizeCalculated
            query(this.box).find('#layout_'+ this.name +'_panel_bottom')
                .css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                })
            pbottom.width  = w
            pbottom.height = h
            // resizer
            if (pbottom.resizable) {
                t = t - (this.padding === 0 ? 0 : this.padding)
                h = (this.resizer > this.padding ? this.resizer : this.padding)
                // any: css(obj) returns string|Record|Query; cast needed to chain off/on
                ;(query(this.box).find('#layout_'+ this.name +'_resizer_bottom')
                    .css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }) as unknown as Query)
                    .off('mousedown')
                    .on('mousedown', function(event) {
                        event.preventDefault()
                        // event before
                        const edata = self.trigger('resizerClick', { target: 'bottom', originalEvent: event })
                        if (edata.isCancelled === true) return
                        // default action
                        _TsUiRegistry()[self.name].last.events.resizeStart('bottom', event)
                        // event after
                        edata.finish()
                        return false
                    })
            }
        } else {
            query(this.box).find('#layout_'+ this.name +'_panel_bottom').hide()
            query(this.box).find('#layout_'+ this.name +'_resizer_bottom').hide()
        }
        // main - always there
        l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0)
        t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0)
        w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) -
            (sright ? pright.sizeCalculated + this.padding: 0)
        h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
            (sbottom ? pbottom.sizeCalculated + this.padding : 0) -
            (sprev ? pprev.sizeCalculated + this.padding : 0)
        query(this.box)
            .find('#layout_'+ this.name +'_panel_main')
            .css({
                'display': 'block',
                'left': l + 'px',
                'top': t + 'px',
                'width': w + 'px',
                'height': h + 'px'
            })
        pmain.width  = w
        pmain.height = h

        // preview if any
        if (pprev != null && pprev.hidden !== true) {
            l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0)
            t = height - (sbottom ? pbottom.sizeCalculated + this.padding : 0) - pprev.sizeCalculated
            w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) -
                (sright ? pright.sizeCalculated + this.padding : 0)
            h = pprev.sizeCalculated
            query(this.box).find('#layout_'+ this.name +'_panel_preview')
                .css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                })
            pprev.width  = w
            pprev.height = h
            // resizer
            if (pprev.resizable) {
                t = t - (this.padding === 0 ? 0 : this.padding)
                h = (this.resizer > this.padding ? this.resizer : this.padding)
                // any: css(obj) returns string|Record|Query; cast needed to chain off/on
                ;(query(this.box).find('#layout_'+ this.name +'_resizer_preview')
                    .css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }) as unknown as Query)
                    .off('mousedown')
                    .on('mousedown', function(event) {
                        event.preventDefault()
                        // event before
                        const edata = self.trigger('resizerClick', { target: 'preview', originalEvent: event })
                        if (edata.isCancelled === true) return
                        // default action
                        _TsUiRegistry()[self.name].last.events.resizeStart('preview', event)
                        // event after
                        edata.finish()
                        return false
                    })
            }
        } else {
            query(this.box).find('#layout_'+ this.name +'_panel_preview').hide()
            query(this.box).find('#layout_'+ this.name +'_resizer_preview').hide()
        }

        // resizes boxes for header, tabs, toolbar inside the panel
        this.resizeBoxes()

        edata.finish()
        return Date.now() - time
    }

    resizeBoxes(panel?: string) {
        const panels = w2panels
        if (!panel && typeof panel == 'string') panels.slice() // defensive copy if filtered
        // display tabs and toolbar if needed
        panels.forEach((pname, ind) => {
            const pan = w2panels[ind] != null ? this.get(w2panels[ind] as string) : null
            const tmp2 = `#layout_${this.name}_panel_${pname} > `
            let topHeight = 0
            if (pan) {
                if (pan.title) {
                    const el = query(this.box).find(tmp2 + '.tsg-panel-title').css({ top: topHeight + 'px', display: 'block' })
                    topHeight += TsUtils.getSize(el, 'height')
                }
                if (pan.show.tabs) {
                    const el = query(this.box).find(tmp2 + '[data-role="panel-tabs"]').css({ top: topHeight + 'px', display: 'block' })
                    topHeight += TsUtils.getSize(el, 'height')
                }
                if (pan.show.toolbar) {
                    const el = query(this.box).find(tmp2 + '[data-role="panel-toolbar"]').css({ top: topHeight + 'px', display: 'block' })
                    topHeight += TsUtils.getSize(el, 'height')
                }
            }
            query(this.box).find(tmp2 + '[data-role="panel-content"]')
                .css({
                    display: 'block',
                    top: topHeight + 'px'
                })
        })
    }

    lock(panel: string, msg: unknown, showSpinner?: boolean) {
        if (w2panels.indexOf(panel as TsPanelType) == -1) {
            console.log('ERROR: First parameter needs to be the a valid panel name.')
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TsUtils.lock('#layout_'+ this.name + '_panel_' + panel, msg as any, showSpinner) // any: msg is string|TsLockOptions; TsLockOptions not exported from TsUtils
    }

    unlock(panel: string, speed?: number) {
        if (w2panels.indexOf(panel as TsPanelType) == -1) {
            console.log('ERROR: First parameter needs to be the a valid panel name.')
            return
        }
        const nm = '#layout_'+ this.name + '_panel_' + panel
        TsUtils.unlock(nm, speed)
    }
}

export { TsLayout }
