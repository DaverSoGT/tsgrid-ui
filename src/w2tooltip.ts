/**
 * Part of w2ui 2.0 library
 * - Dependencies: mQuery, w2utils, w2base
 *
 * T3.1: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 *
 * TODO:
 * - need help pages
 *
 * 2.0 Changes
 * - multiple tooltips to the same anchor
 * - options.contextMenu
 * - options.prefilter - if true, it will show prefiltered items for w2menu, otherwise all
 * - menu.item.help, menu.item.hotkey, menu.item.extra
 * - options.selected -> for w2menu
 * - options.tooltip => {}
 * - w2menu event onTooltip
 * - added onMouseEnter and onMouseLeave for w2menu
 */

import { w2base } from './w2base.js'
import { w2utils } from './w2utils.js'
import { query as _queryRaw, Query } from './query.js'

// w2tooltip always calls query() with a selector (never a callback), so return is always Query.
// any: query() overload returns void when called with a callback; we only use selector calls here
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

// ---------------------------------------------------------------------------
// Public interfaces for option shapes
// ---------------------------------------------------------------------------

/** Base options shared by all tooltip variants */
interface TooltipOptions {
    name?: string | null
    html?: string
    style?: string
    class?: string
    position?: string | string[]
    draggable?: boolean
    align?: string
    anchor?: HTMLElement | null
    contextMenu?: boolean
    anchorClass?: string
    anchorStyle?: string
    autoShow?: boolean
    autoShowOn?: string | null
    autoHideOn?: string | null
    arrowSize?: number
    screenMargin?: number
    autoResize?: boolean
    margin?: number
    offsetX?: number
    offsetY?: number
    maxWidth?: number | null
    maxHeight?: number | null
    hideOn?: string | string[] | null
    onThen?: ((event: unknown) => void) | null
    onShow?: ((event: unknown) => void) | null
    onHide?: ((event: unknown) => void) | null
    onUpdate?: ((event: unknown) => void) | null
    onMove?: ((event: unknown) => void) | null
    // runtime-only fields added during attach
    _keep?: boolean
    text?: string
    [key: string]: unknown   // any: options objects are open-ended; runtime code adds fields freely
}

/** A single menu item */
interface MenuItem {
    id?: string | number | null
    text?: string | null | ((item: MenuItem, options: MenuOptions) => string)
    style?: string
    icon?: string | null
    count?: string | number | null
    tooltip?: string | { html?: string; [key: string]: unknown } | null
    hint?: string | null
    hotkey?: string | null
    removable?: boolean | null
    remove?: boolean | null
    help?: string | null
    items?: MenuItem[] | ((item: MenuItem) => MenuItem[]) | null
    indent?: number
    type?: 'check' | 'radio' | 'break' | null
    group?: string | boolean | null
    expanded?: boolean
    hidden?: boolean
    checked?: boolean | null
    disabled?: boolean
    keepOpen?: boolean | null
    extra?: string
    _noSearchInside?: boolean
    [key: string]: unknown   // any: menu items carry arbitrary runtime fields (e.g., data-* mirrors)
}

/** Options for w2menu (MenuTooltip) */
interface MenuOptions extends TooltipOptions {
    type?: 'normal' | 'radio' | 'check'
    items?: MenuItem[]
    selected?: null | string | number | MenuItem | Array<string | number | MenuItem>
    render?: ((item: MenuItem, options: MenuOptions) => string) | null
    spinner?: boolean
    msgNoItems?: string
    msgSearch?: string
    topHTML?: string
    menuStyle?: string
    search?: boolean
    filter?: boolean
    match?: 'contains' | 'is' | 'begins' | 'begins with' | 'ends' | 'ends with' | 'regexp'
    markSearch?: boolean
    prefilter?: boolean
    altRows?: boolean
    url?: string
    postData?: Record<string, unknown>
    method?: string
    recId?: string | ((item: Record<string, unknown>) => unknown) | null
    recid?: string | null
    recText?: string | ((item: Record<string, unknown>) => unknown) | null
    cacheMax?: number
    minLength?: number
    debounce?: number
    hideSelected?: boolean
    parentOverlay?: TooltipOverlay | null
    parents?: number[]
    onSelect?: ((event: unknown) => void) | null
    onSubMenu?: ((event: unknown) => void) | null
    onRemove?: ((event: unknown) => void) | null
    onTooltip?: ((event: unknown) => void) | null
    onMouseEnter?: ((event: unknown) => void) | null
    onMouseLeave?: ((event: unknown) => void) | null
}

/** Options for w2color (ColorTooltip) */
interface ColorOptions extends TooltipOptions {
    advanced?: boolean
    transparent?: boolean
    color?: string
    updateInput?: boolean
    onSelect?: ((event: unknown) => void) | null
    onLiveUpdate?: ((event: unknown) => void) | null
}

/** Options for w2date (DateTooltip) */
interface DateOptions extends TooltipOptions {
    type?: 'date' | 'time' | 'datetime'
    value?: string
    format?: string
    start?: string | HTMLElement | null
    end?: string | HTMLElement | null
    btnNow?: boolean
    blockDates?: string[]
    blockWeekdays?: number[]
    colored?: Record<string, string>
    noMinutes?: boolean
    startTime?: string
    endTime?: string
    onSelect?: ((event: unknown) => void) | null
}

/** The overlay object — a w2base instance extended at runtime with many dynamic props */
// any: overlay is a w2base extended by Object.assign at runtime with anchor, options, tmp, etc.
// The shape cannot be expressed as a static interface without lying about the full structure.
type TooltipOverlay = // any: dynamic w2base extension
    InstanceType<typeof w2base> & {
        id: string
        name: string
        options: TooltipOptions & MenuOptions & ColorOptions & DateOptions
        anchor: HTMLElement
        self: Tooltip
        displayed: boolean
        box: HTMLElement & { overlay?: TooltipOverlay } | null
        needsUpdate?: boolean
        prevOptions?: TooltipOptions
        // any: tmp is a grab-bag of runtime state (observers, scroll positions, search state, etc.)
        tmp: Record<string, unknown>
        selected?: string | number | null
        newColor?: string
        newValue?: string
        newDate?: string
        next?: () => void
        prev?: () => void
        click?: () => void
        hide: () => void
    }

/** Return value of Tooltip.attach() */
interface AttachReturn {
    overlay: TooltipOverlay
    then: (callback: (event: unknown) => void) => AttachReturn
    show: (callback: (event: unknown) => void) => AttachReturn
    hide: (callback: (event: unknown) => void) => AttachReturn
    update: (callback: (event: unknown) => void) => AttachReturn
    move: (callback: (event: unknown) => void) => AttachReturn
    liveUpdate?: (callback: (event: unknown) => void) => AttachReturn
    select?: (callback: (event: unknown) => void) => AttachReturn
    remove?: (callback: (event: unknown) => void) => AttachReturn
    subMenu?: (callback: (event: unknown) => void) => AttachReturn
}

/** Position calculation result */
interface TooltipPosition {
    left: number
    top: number
    arrow: { offset: number; class: string; style: string }
    adjust: { left: number; top: number }
    width?: number
    height?: number
    pos: string
}

class Tooltip {
    // no need to extend w2base, as each individual tooltip extends it
    static active: Record<string, TooltipOverlay> = {}
    defaults: TooltipOptions
    // any: setColor is assigned dynamically inside ColorTooltip.initControls closure
    setColor?: (color: Partial<{ h: number; s: number; v: number; a: number }>, fullUpdate?: boolean, initial?: string) => void
    // optional hook — overridden in subclasses; declared as method stub to allow subclass override
    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initControls(_overlay: any): void { /* overridden in ColorTooltip, MenuTooltip, DateTooltip */ }

    constructor() {
        this.defaults = {
            name            : null,     // name for the overlay, otherwise input id is used
            html            : '',       // text or html
            style           : '',       // additional style for the overlay
            class           : '',       // add class for w2ui-tooltip-body
            position        : 'top|bottom',   // can be left, right, top, bottom
            draggable       : false,    // if true, then tooltip can be move with mouse
            align           : '',       // can be: both, both:XX left, right, both, top, bottom
            anchor          : null,     // element it is attached to, if anchor is body, then it is context menu
            contextMenu     : false,    // if true, then it is context menu
            anchorClass     : '',       // add class for anchor when tooltip is shown
            anchorStyle     : '',       // add style for anchor when tooltip is shown
            autoShow        : false,    // if autoShow true, then tooltip will show on mouseEnter and hide on mouseLeave
            autoShowOn      : null,     // when options.autoShow = true, mouse event to show on
            autoHideOn      : null,     // when options.autoShow = true, mouse event to hide on
            arrowSize       : 8,        // size of the carret
            screenMargin    : 2,        // min margin from screen to tooltip
            autoResize      : true,     // auto resize based on content size and available size
            margin          : 1,        // distance from the anchor
            offsetX         : 0,        // delta for left coordinate
            offsetY         : 0,        // delta for top coordinate
            maxWidth        : null,     // max width
            maxHeight       : null,     // max height
            hideOn          : null,     // events when to hide tooltip, ['doc-click', 'tooltip-click', 'focus-change', 'select', 'item-remove', ... or any standard event on the anchor],
            onThen          : null,     // called when displayed
            onShow          : null,     // callBack when shown
            onHide          : null,     // callBack when hidden
            onUpdate        : null,     // callback when tooltip gets updated
            onMove          : null      // callback when tooltip is moved
        }
    }

    static observeRemove = new MutationObserver((_mutations) => {
        let cnt = 0
        Object.keys(Tooltip.active).forEach(name => {
            const overlay = Tooltip.active[name]
            if (overlay?.displayed) {
                if (!overlay.anchor || !overlay.anchor.isConnected) {
                    overlay.hide()
                } else {
                    cnt++
                }
            }
        })
        // remove observer, as there is no active tooltips
        if (cnt === 0) {
            Tooltip.observeRemove.disconnect()
        }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger(event: any, data?: any): { isCancelled?: boolean; finish: () => void; detail?: Record<string, unknown> } { // any: event is string or object; data carries event payload
        if (arguments.length == 2) {
            const type = event
            event = data
            data.type = type
        }
        if (event.overlay) {
            return event.overlay.trigger(event)
        } else {
            console.log('ERROR: cannot find overlay where to trigger events')
            return { finish: () => {} } // stub edata when overlay is missing
        }
    }

    get(name?: string | true): string[] | Record<string, TooltipOverlay> | TooltipOverlay | undefined {
        if (arguments.length == 0) {
            return Object.keys(Tooltip.active)
        } else if (name === true) {
            return Tooltip.active
        } else {
            return Tooltip.active[(name ?? '').replace(/[\s\.#]/g, '_')]
        }
    }

    attach(anchorArg?: HTMLElement | TooltipOptions | null, textArg?: string | TooltipOptions): AttachReturn | undefined {
        // any: anchor/text/options are mutated across branches; runtime shape determined by call path
        // any: overlay is a w2base extended via Object.assign; full shape not statically knowable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let anchor: any = anchorArg // any: reassigned to HTMLElement or options.anchor in branches
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let text: any = textArg     // any: reassigned to string in some branches
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let options: any            // any: merged from defaults + user options; open-ended shape
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let overlay: any            // any: w2base + Object.assign runtime extension
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: Tooltip = this
        if (arguments.length == 0) {
            return
        } else if (arguments.length == 1 && anchor instanceof Object) {
            options = anchor
            anchor = options.anchor
        } else if (arguments.length === 2 && typeof text === 'string') {
            options = { anchor, html: text }
            text = options.html
        } else if (arguments.length === 2 && text != null && typeof text === 'object') {
            options = text
            text = options.html
        }
        options = w2utils.extend({}, this.defaults, options || {})
        if (!text && options.text) text = options.text
        if (!text && options.html) text = options.html
        // anchor is func var
        delete options.anchor

        // define tooltip
        let name = (options.name ? options.name : anchor?.id)
        if (anchor == document || anchor == null) {
            anchor = document.body
        }
        if (options.contextMenu) {
            anchor = document.body
            name = name ?? 'context-menu'
        }
        if (!name) {
            name = 'noname-' + Object.keys(Tooltip.active).length
            console.log('NOTICE: name property is not defined for tooltip, could lead to too many instances')
        }
        // clean name as it is used as id and css selector
        name = name.replace(/[\s\.#]/g, '_')
        if (Tooltip.active[name]) {
            overlay = Tooltip.active[name]
            overlay.prevOptions = overlay.options
            overlay.options = options // do not merge or extend, otherwiser menu items get merged too
            // overlay.options = w2utils.extend({}, overlay.options, options)
            overlay.anchor = anchor // as HTML elements are not copied
            if (overlay.prevOptions.html != overlay.options.html || overlay.prevOptions.class != overlay.options.class
                    || overlay.prevOptions.style != overlay.options.style) {
                overlay.needsUpdate = true
            }
            options = overlay.options // it was recreated
            // clear all previous overlay events
            Object.keys(overlay).forEach(key => {
                const val = overlay[key]
                if (key.startsWith('on') && typeof val == 'function') {
                    delete overlay[key]
                }
            })
        } else {
            overlay = new w2base()
            Object.assign(overlay, {
                id: 'w2overlay-' + name,
                name, options, anchor, self,
                displayed: false,
                tmp: {
                    observeTooltipResize: new ResizeObserver(() => {
                        this.resize(overlay.name)
                    }),
                    observeAnchorResize: new ResizeObserver(() => {
                        this.resize(overlay.name)
                    }),
                    observeAnchorMove: new MutationObserver((mutations) => {
                        // any: MutationObserver target is Node; cast to Element to access getBoundingClientRect
                        const target = mutations[0]!.target as Element & { _lastBoundingRect?: DOMRect }
                        const currRect = target.getBoundingClientRect()
                        const lastRect = target._lastBoundingRect
                        if (!target._lastBoundingRect) {
                            target._lastBoundingRect = currRect
                        } else if (currRect.left !== lastRect!.left || currRect.top !== lastRect!.top) {
                            this.resize(overlay.name)
                            target._lastBoundingRect = currRect
                        }
                    })
                },
                hide() {
                    self.hide(name)
                }
            })
            Tooltip.active[name] = overlay
        }
        // move events on to overlay layer
        Object.keys(overlay.options).forEach(key => {
            const val = overlay.options[key]
            if (key.startsWith('on') && typeof val == 'function') {
                overlay[key] = val
                delete overlay.options[key]
            }
        })
        // add event for auto show/hide
        if (options.autoShow === true) {
            options.autoShowOn = options.autoShowOn ?? 'mouseenter'
            options.autoHideOn = options.autoHideOn ?? 'mouseleave'
            options.autoShow = false
            options._keep = true
        }
        if (options.autoShowOn) {
            const scope = 'autoShow-' + overlay.name
            query(anchor)
                .off(`.${scope}`)
                .on(`${options.autoShowOn}.${scope}`, event => {
                    self.show(overlay.name)
                    event.stopPropagation()
                })
            delete options.autoShowOn
            options._keep = true
        }
        if (options.autoHideOn) {
            const scope = 'autoHide-' + overlay.name
            query(anchor)
                .off(`.${scope}`)
                .on(`${options.autoHideOn}.${scope}`, event => {
                    self.hide(overlay.name)
                    event.stopPropagation()
                })
            delete options.autoHideOn
            options._keep = true
        }
        overlay.off('.attach')
        const ret = {
            overlay,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            then: (callback: any) => { // any: event shape varies by overlay type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                overlay.on('show:after.attach', (event: any) => { callback(event) }) // any: w2base event
                return ret
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            show: (callback: any) => { // any: event shape varies by overlay type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                overlay.on('show.attach', (event: any) => { callback(event) }) // any: w2base event
                return ret
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hide: (callback: any) => { // any: event shape varies by overlay type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                overlay.on('hide.attach', (event: any) => { callback(event) }) // any: w2base event
                return ret
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            update: (callback: any) => { // any: event shape varies by overlay type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                overlay.on('update.attach', (event: any) => { callback(event) }) // any: w2base event
                return ret
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            move: (callback: any) => { // any: event shape varies by overlay type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                overlay.on('move.attach', (event: any) => { callback(event) }) // any: w2base event
                return ret
            }
        }
        return ret
    }

    update(name: string, html: string): void {
        const overlay = Tooltip.active[name]
        if (overlay) {
            overlay.needsUpdate = true
            overlay.options.html = html
            this.show(name)
        } else {
            console.log(`Tooltip "${name}" is not displayed. Cannot update it.`)
        }
    }

    show(name?: string | HTMLElement | TooltipOptions, extraOptions?: TooltipOptions): AttachReturn | { overlay: TooltipOverlay } | undefined { // any: name is polymorphic (string|HTMLElement|options)
        if (name instanceof HTMLElement || name instanceof Object) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let options: any = name // any: name is object-as-options in this branch
            if (name instanceof HTMLElement) {
                options = extraOptions || {}
                options.anchor = name
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ret: any = this.attach(options) // any: AttachReturn overlay is runtime-extended
            ret.overlay.tmp.hidden = false

            query(ret.overlay.anchor)
                .off('.autoShow-' + ret.overlay.name)
                .off('.autoHide-' + ret.overlay.name)

            /**
             * Need a timer, so that events in the 'return ret` would be properly set as it is using chaining mechanism
             * to set listeners: w2tooltip.show({}).then(...).show(...). Since it could be hidden before timer kick in
             * to show it, need the check in the timeout.
             */
            setTimeout(() => {
                if (!ret.overlay.tmp.hidden) {
                    this.show(ret.overlay.name)
                    if (this.initControls) {
                        this.initControls(ret.overlay)
                    }
                }
            }, 1)
            return ret
        }
        let edata
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = Tooltip.active[(name as string).replace(/[\s\.#]/g, '_')] // any: runtime overlay
        if (!overlay) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = overlay.options // any: options is open-ended TooltipOptions at runtime
        if (!overlay || (overlay.displayed && !overlay.needsUpdate)) {
            this.resize(overlay?.name)
            return
        }
        const position = options.position.split('|')
        const isVertical = ['top', 'bottom'].includes(position[0])
        // enforce nowrap only when align=both and vertical
        let overlayStyles = (options.align == 'both' && isVertical ? '' : 'white-space: nowrap;')
        /**
         * If max-width is set in the html, then use it to calculate the width of the tooltip. This is needed to avoid
         * slow expansion of the tooltip bug.
         */
        if (options.maxWidth == null && /^<div[^>]*style=["'][^"']*max-width[^"']*["'][^>]*>/i.test(options.html?.trim?.() ?? '')) {
            options.maxWidth = w2utils.getStrWidth(options.html, '', true)
        }
        if (options.maxWidth && w2utils.getStrWidth(options.html, '', true) >= options.maxWidth) {
            overlayStyles = 'width: '+ options.maxWidth + 'px; white-space: inherit; overflow: auto;'
        }
        overlayStyles += ' max-height: '+ (options.maxHeight ? options.maxHeight : window.innerHeight - 4) + 'px;'
        // if empty content - then hide it
        if (options.html === '' || options.html == null) {
            self.hide(name)
            return
        } else if (overlay.box) {
            // if already present, update it
            edata = this.trigger('update', { target: name, overlay })
            if (edata.isCancelled === true) {
                // restore previous options
                if (overlay.prevOptions) {
                    overlay.options = overlay.prevOptions
                    delete overlay.prevOptions
                }
                return
            }
            query(overlay.box)
                .find('.w2ui-overlay-body')
                .attr('style', (options.style || '') + '; ' + overlayStyles)
                .removeClass(null) // removes all classes
                .addClass('w2ui-overlay-body ' + options.class + (options.draggable ? ' w2ui-draggable' : ''))
                .html(options.html)
            this.resize(overlay.name)
        } else {
            // event before
            edata = this.trigger('show', { target: name, overlay })
            if (edata.isCancelled === true) return
            // normal processing
            query('body').append(
                // pointer-events will be re-enabled leter
                `<div id="${overlay.id}" name="${name}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body w2ui-eaction ${options.class} ${options.draggable ? 'w2ui-draggable' : ''}"
                            style="${options.style || ''}; ${overlayStyles}" ${options.draggable ? 'data-mousedown="startDrag|event"' : ''}>
                        ${options.html}
                    </div>
                </div>`)
            overlay.box = query('#' + w2utils.escapeId(overlay.id))[0]
            overlay.displayed = true
            const names: string[] = (query(overlay.anchor).data('tooltipName') ?? []) as string[] // any: data() returns unknown; runtime-validated as string[]
            names.push(name as string)
            query(overlay.anchor).data('tooltipName', names) // make available to element overlay attached to
            w2utils.bindEvents(overlay.box, {})
            // remember anchor's original styles
            overlay.tmp.originalCSS = ''
            if (query(overlay.anchor).length > 0) {
                overlay.tmp.originalCSS = (query(overlay.anchor)[0] as HTMLElement).style.cssText // any: query [0] is Node; anchor is always HTMLElement
            }
            this.resize(overlay.name)
        }
        if (options.anchorStyle) {
            overlay.anchor.style.cssText += ';' + options.anchorStyle
        }
        if (options.anchorClass) {
            // do not add w2ui-focus to body
            if (!(options.anchorClass == 'w2ui-focus' && overlay.anchor == document.body)) {
                query(overlay.anchor).addClass(options.anchorClass)
            }
        }
        // add on hide events
        if (typeof options.hideOn == 'string') options.hideOn = [options.hideOn]
        if (!Array.isArray(options.hideOn)) options.hideOn = []
        // initial scroll
        Object.assign(overlay.tmp, {
            scrollLeft: document.body.scrollLeft,
            scrollTop: document.body.scrollTop
        })
        addHideEvents()
        addWatchEvents(document.body)
        // first show empty tooltip, so it will popup up in the right position
        query(overlay.box).show()
        overlay.tmp.observeTooltipResize.observe(overlay.box)
        overlay.tmp.observeAnchorResize.observe(overlay.anchor)
        overlay.tmp.observeAnchorMove.observe(overlay.anchor, { attributes: true })
        // observer element removal from DOM
        Tooltip.observeRemove.observe(document.body, { subtree: true, childList: true })
        // then insert html and it will adjust
        // any: .css() returns string|Query|undefined; at runtime with object arg it always returns Query
        ;(query(overlay.box).css('opacity', 1) as unknown as Query)
            .find('.w2ui-overlay-body')
            .html(options.html)
        /**
         * pointer-events: none is needed to avoid cases when popup is shown right under the cursor
         * or it will trigger onmouseout, onmouseleave and other events.
         */
        setTimeout(() => { (query(overlay.box).css({ 'pointer-events': 'auto' }) as unknown as Query).data('ready', 'yes') }, 100) // any: css() with object returns Query

        // bind events
        w2utils.bindEvents(query(overlay.box).find('.w2ui-eaction'), this as unknown as Record<string, unknown>) // any: bindEvents accepts event handler object; Tooltip is valid

        delete overlay.needsUpdate
        // expose overlay to DOM element
        overlay.box.overlay = overlay
        // click / drag: raise stacking order among sibling overlays (DOM order, not z-index)
        query(overlay.box)
            .off('mousedown.w2ui-bringfront')
            .on('mousedown.w2ui-bringfront', () => {
                self.bringOverlayToFront(overlay)
            })
        // event after
        if (edata) edata.finish()
        return { overlay }

        function addWatchEvents(el: HTMLElement) {
            const scope = 'tooltip-' + overlay.name
            let queryEl: HTMLElement | Document = el
            if (el.tagName == 'BODY') {
                queryEl = el.ownerDocument
            }
            query(queryEl)
                .off(`.${scope}`)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on(`scroll.${scope}`, (_event: any) => { // any: query event shape
                    Object.assign(overlay.tmp, {
                        scrollLeft: el.scrollLeft,
                        scrollTop: el.scrollTop
                    })
                    self.resize(overlay.name)
                })
        }

        function addHideEvents() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hide = (_event: any) => { self.hide(overlay.name) } // any: event from query listener
            const $anchor = query(overlay.anchor)
            const scope = 'tooltip-' + overlay.name
            // document click
            query('html').off(`.${scope}`)
            if (options.hideOn.includes('doc-click')) {
                if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                    // otherwise hides on click to focus
                    $anchor
                        .off(`.${scope}-doc`)
                        .on(`click.${scope}-doc`, (event) => { event.stopPropagation() })
                }
                query('html').on(`click.${scope}`, hide)
            }
            if (options.hideOn.includes('tooltip-click')) {
                query(overlay.box)
                    .off(`click.${scope}`)
                    .on(`click.${scope}`, hide)
            }
            if (options.hideOn.includes('focus-change') || options.hideOn.includes('blur')) {
                query('html')
                    .on(`focusin.${scope}`, (_e) => {
                        if (document.activeElement != overlay.anchor) {
                            self.hide(overlay.name)
                        }
                    })
            }
            if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                $anchor.off(`.${scope}`)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options.hideOn.forEach((event: any) => { // any: hideOn is string[]
                    if (['doc-click', 'focus-change', 'blur'].indexOf(event) == -1) {
                        $anchor.on(`${event}.${scope}`, { once: true }, hide)
                    }
                })
            }
        }
    }

    hide(name?: string | HTMLElement): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let overlay: any // any: TooltipOverlay extended at runtime; property access is runtime-safe
        if (arguments.length == 0) {
            // hide all tooltips
            Object.keys(Tooltip.active).forEach(name => { this.hide(name) })
            return
        }
        if (name instanceof HTMLElement) {
            const names = (query(name).data('tooltipName') ?? []) as string[] // any: data() unknown; runtime is string[]
            names.forEach(name => { this.hide(name) })
            return
        }
        if (typeof name == 'string') {
            name = name.replace(/[\s\.#]/g, '_')
            overlay = Tooltip.active[name]
        }
        if (overlay?.tmp) overlay.tmp.hidden = true // it could be hidden before it is actually shown
        if (!overlay || !overlay.box) return

        // event before
        const edata = this.trigger('hide', { target: name, overlay })
        if (edata.isCancelled === true) return

        // normal processing
        if (!overlay.options._keep) delete Tooltip.active[name as string]
        const scope = 'tooltip-' + overlay.name
        overlay.tmp.observeTooltipResize?.disconnect()
        overlay.tmp.observeAnchorResize?.disconnect()
        overlay.tmp.observeAnchorMove?.disconnect()
        // if no active tooltip then disable observeRemove
        let cnt = 0
        Object.keys(Tooltip.active).forEach(key => {
            const overlay = Tooltip.active[key]
            if (overlay?.displayed) {
                cnt++
            }
        })
        if (cnt == 0) {
            Tooltip.observeRemove.disconnect()
        }
        query('html').off(`.${scope}`)   // hide to click event here
        query(document).off(`.${scope}`) // scroll event here
        // remove element
        overlay.box?.remove()
        overlay.box = null
        overlay.displayed = false
        // remove name from anchor properties
        const names = (query(overlay.anchor).data('tooltipName') ?? []) as string[] // any: data() unknown; runtime is string[]
        const ind = names.indexOf(overlay.name)
        if (ind != -1) names.splice(names.indexOf(overlay.name), 1)
        if (names.length == 0) {
            query(overlay.anchor).removeData('tooltipName')
        } else {
            query(overlay.anchor).data('tooltipName', names)
        }
        // restore original CSS, only if anchor styles where extended
        if (overlay.options.anchorStyle) {
            overlay.anchor.style.cssText = overlay.tmp.originalCSS
        }
        query(overlay.anchor)
            .off(`.${scope}`)
            .removeClass(overlay.options.anchorClass)
        // for remote data source
        if (overlay.options.url) {
            // remove all cached items
            overlay.options.items.splice(0)
            overlay.tmp.remote.hasMore = true
            overlay.tmp.remote.search = null
        }
        // event after
        edata.finish()
    }

    resize(name?: string): { moved: boolean; resize: boolean } | { multiple: boolean } | void {
        const state = { moved: false, resize: false }
        if (arguments.length == 0) {
            Object.keys(Tooltip.active).forEach(key => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const overlay: any = Tooltip.active[key] // any: runtime overlay shape
                if (overlay.displayed) this.resize(overlay.name)
            })
            return { multiple: true }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = Tooltip.active[(name ?? '').replace(/[\s\.#]/g, '_')] // any: runtime overlay
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pos: any = this.getPosition(overlay.name) // any: pos may be undefined or TooltipPosition
        const newPos = pos.left + 'x' + pos.top
        const newSize = pos.width + 'x' + pos.height
        let edata1, edata2
        if (overlay.tmp.lastPos != newPos) {
            edata1 = this.trigger('move', { target: name, overlay, pos })
            state.moved = true
        }
        if (overlay.tmp.lastSize != newSize) {
            edata2 = this.trigger('resize', { target: name, overlay, pos })
            state.moved = true
        }
        // any: .css({}) returns Query at runtime (object arg path); TypeScript types it as string|Query|... union
        // any: Query.css({object}) always returns Query; TypeScript union type makes .then() ambiguous
        const qBox = query(overlay.box).css({
            left: pos.left + 'px',
            top : pos.top + 'px'
        }) as unknown as Query
        qBox.then((q: Query): Query => {
            if (pos.width != null) {
                (q.css('width', pos.width + 'px') as unknown as Query)
                     .find('.w2ui-overlay-body')
                     .css('width', '100%')
            }
            if (pos.height != null) {
                (q.css('height', pos.height + 'px') as unknown as Query)
                     .find('.w2ui-overlay-body')
                     .css('height', '100%')
            }
            return q
        })
            .find('.w2ui-overlay-body')
            .removeClass('w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom')
            .addClass(pos.arrow.class)
            .closest('.w2ui-overlay')
            .find('style:first-child')
            .text(pos.arrow.style)

        if (overlay.tmp.lastPos != newPos && edata1) {
            overlay.tmp.lastPos = newPos
            edata1.finish()
        }
        if (overlay.tmp.lastSize != newSize && edata2) {
            overlay.tmp.lastSize = newSize
            edata2.finish()
        }
        return state
    }

    getPosition(name: string): TooltipPosition | undefined {
        // any: overlay.options and anchor positions are runtime-extended DOMRect-like objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = Tooltip.active[name.replace(/[\s\.#]/g, '_')]
        if (!overlay || !overlay.box) {
            return
        }
        const options = overlay.options
        if (overlay.tmp.resizedY || overlay.tmp.resizedX) {
            query(overlay.box).css({ width: '', height: '', scroll: 'auto' })
        }
        const scrollSize = w2utils.scrollBarSize() as number // any: scrollBarSize returns unknown (tmp bag); runtime is always number
        const hasScrollBarX = !(document.body.scrollWidth == document.body.clientWidth)
        const hasScrollBarY = !(document.body.scrollHeight == document.body.clientHeight)
        const max = {
            width: window.innerWidth - (hasScrollBarY ? scrollSize : 0),
            height: window.innerHeight - (hasScrollBarX ? scrollSize : 0)
        }
        const position = options.position == 'auto'
            ? 'top|bottom|right|left'.split('|')
            : Array.isArray(options.position) ? options.position : options.position.split('|')
        const isVertical = ['top', 'bottom'].includes(position[0])
        const content = overlay.box.getBoundingClientRect()
        let anchor = overlay.anchor?.getBoundingClientRect?.()

        // minimal width should be a least content width (avoid slow expansion of the tooltip bug)
        const min_width = w2utils.getStrWidth(options.html, '', true)
        if (content.width < min_width) content.width = min_width

        if (overlay.anchor == document.body) {
            // context menu
            let evt = options.originalEvent
            while (evt?.originalEvent) { evt = evt.originalEvent }
            const { x, y, width, height } = evt ?? { x: options.x, y: options.y, width: 0, height: 10 }
            anchor = {
                left: x - (options.contextMenu ? 4: 0),
                top: y - (options.contextMenu ? 4: 0),
                width: width ?? 0,
                height: height ?? 10,
                arrow: options.contextMenu ? 'none' : null
            }
        }
        let arrowSize = options.arrowSize
        if (anchor.arrow == 'none') arrowSize = 0
        if (isNaN(arrowSize)) arrowSize = this.defaults.arrowSize

        // space available
        const available: Record<string, number> = { // tipsize adjustment should be here, not in max.width/max.height
            top: anchor.top - arrowSize,
            bottom: max.height - arrowSize - (anchor.top + anchor.height) - (hasScrollBarX ? scrollSize : 0) - 2,
            left: anchor.left,
            right: max.width - (anchor.left + anchor.width) + (hasScrollBarY ? scrollSize : 0),
        }
        // size of empty tooltip
        if (content.width < 22) content.width = 22
        if (content.height < 14) content.height = 14
        let left: number | undefined, top: number | undefined, width: number | undefined, height: number | undefined // tooltip position
        let found = ''
        const arrow = {
            offset: 0,
            class: '',
            style: `#${overlay.id} { --tip-size: ${arrowSize}px; }`
        }
        const adjust   = { left: 0, top: 0 }
        const bestFit  = { posX: '', x: 0, posY: '', y: 0 }

        // find best position
        position.forEach((pos: string) => {
            const avail = available[pos] ?? 0
            if (['top', 'bottom'].includes(pos)) {
                if (!found && (content.height + arrowSize/1.893) < avail) { // 1.893 = 1 + sin(90)
                    found = pos
                }
                if (avail > bestFit.y) {
                    Object.assign(bestFit, { posY: pos, y: avail })
                }
            }
            if (['left', 'right'].includes(pos)) {
                if (!found && (content.width + arrowSize/1.893) < avail) { // 1.893 = 1 + sin(90)
                    found = pos
                }
                if (avail > bestFit.x) {
                    Object.assign(bestFit, { posX: pos, x: avail })
                }
            }
        })
        // if not found, use best (greatest available space) position
        if (!found) {
            if (isVertical) {
                found = bestFit.posY
            } else {
                found = bestFit.posX
            }
        }
        if (options.autoResize) {
            if (['top', 'bottom'].includes(found)) {
                const availFound = available[found] ?? 0
                if (content.height > availFound) {
                    height = availFound
                    overlay.tmp.resizedY = true
                } else {
                    overlay.tmp.resizedY = false
                }
            }
            if (['left', 'right'].includes(found)) {
                const availFound = available[found] ?? 0
                if (content.width > availFound) {
                    width = availFound
                    overlay.tmp.resizedX = true
                } else {
                    overlay.tmp.resizedX = false
                }
            }
        }
        usePosition(found)
        if (isVertical) anchorAlignment()

        // user offset
        top = (top ?? 0) + parseFloat(String(options.offsetY * (found == 'top' ? -1 : 1)))   // offset will always move from original position
        left = (left ?? 0) + parseFloat(String(options.offsetX * (found == 'left' ? -1 : 1))) // offset will always move from original position

        // make sure it is inside visible screen area
        screenAdjust()

        // adjust for scrollbar
        const extraTop = (found == 'top' ? -options.margin : (found == 'bottom' ? options.margin : 0))
        const extraLeft = (found == 'left' ? -options.margin : (found == 'right' ? options.margin : 0))
        top = Math.floor(((top ?? 0) + parseFloat(extraTop)) * 100) / 100
        left = Math.floor(((left ?? 0) + parseFloat(extraLeft)) * 100) / 100

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const retPos: any = { left: left ?? 0, top: top ?? 0, arrow, adjust, pos: found } // any: exactOptionalPropertyTypes — build conditionally
        if (width != null) retPos.width = width
        if (height != null) retPos.height = height
        return retPos as TooltipPosition

        function usePosition(pos: string) {
            arrow.class = anchor.arrow ? anchor.arrow : `w2ui-arrow-${pos}`
            switch (pos) {
                case 'top': {
                    left = anchor.left + (anchor.width - (width ?? content.width)) / 2
                    top = anchor.top - (height ?? content.height) - arrowSize / 1.5 + 1
                    break
                }
                case 'bottom': {
                    left = anchor.left + (anchor.width - (width ?? content.width)) / 2
                    top = anchor.top + anchor.height + arrowSize / 1.25 + 1
                    break
                }
                case 'left': {
                    left = anchor.left - (width ?? content.width) - arrowSize / 1.2 - 1
                    top = anchor.top + (anchor.height - (height ?? content.height)) / 2
                    break
                }
                case 'right': {
                    left = anchor.left + anchor.width + arrowSize / 1.2 + 1
                    top = anchor.top + (anchor.height - (height ?? content.height)) / 2
                    break
                }
            }
        }

        function anchorAlignment() {
            // top/bottom alignments
            if (options.align == 'left') {
                adjust.left = anchor.left - (left ?? 0)
                left = anchor.left
            }
            if (options.align == 'right') {
                adjust.left = (anchor.left + anchor.width - (width ?? content.width)) - (left ?? 0)
                left = anchor.left + anchor.width - (width ?? content.width)
            }
            if (['top', 'bottom'].includes(found) && options.align.startsWith('both')) {
                const minWidth = options.align.split(':')[1] ?? 50
                if (anchor.width >= minWidth) {
                    left = anchor.left
                    width = anchor.width
                }
            }
            // left/right alignments
            if (options.align == 'top') {
                adjust.top = anchor.top - (top ?? 0)
                top = anchor.top
            }
            if (options.align == 'bottom') {
                adjust.top = (anchor.top + anchor.height - (height ?? content.height)) - (top ?? 0)
                top = anchor.top + anchor.height - (height ?? content.height)
            }
            if (['left', 'right'].includes(found) && options.align.startsWith('both')) {
                const minHeight = options.align.split(':')[1] ?? 50
                if (anchor.height >= minHeight) {
                    top = anchor.top
                    height = anchor.height
                }
            }
        }

        function screenAdjust() {
            let adjustArrow
            // adjust tip if needed after alignment
            if ((['left', 'right'].includes(options.align) && anchor.width < (width ?? content.width))
                || (['top', 'bottom'].includes(options.align) && anchor.height < (height ?? content.height))
            ) {
                adjustArrow = true
            }
            // if off screen then adjust
            const minLeft = (found == 'right' ? arrowSize : options.screenMargin)
            const minTop  = (found == 'bottom' ? arrowSize : options.screenMargin)
            const maxLeft = max.width - (width ?? content.width) - (found == 'left' ? arrowSize : options.screenMargin)
            const maxTop  = max.height - (height ?? content.height) - (found == 'top' ? arrowSize : options.screenMargin) + 3
            // adjust X
            if (['top', 'bottom'].includes(found) || options.autoResize) {
                if ((left ?? 0) < minLeft) {
                    adjustArrow = true
                    adjust.left -= (left ?? 0)
                    left = minLeft
                }
                if ((left ?? 0) > maxLeft) {
                    adjustArrow = true
                    adjust.left -= (left ?? 0) - maxLeft
                    left = (left ?? 0) + maxLeft - (left ?? 0)
                }
            }
            // adjust Y
            if (['left', 'right'].includes(found) || options.autoResize) {
                if ((top ?? 0) < minTop) {
                    adjustArrow = true
                    adjust.top -= (top ?? 0)
                    top = minTop
                }
                if ((top ?? 0) > maxTop) {
                    adjustArrow = true
                    adjust.top -= (top ?? 0) - maxTop
                    top = (top ?? 0) + maxTop - (top ?? 0)
                }
            }
            // moves carret to adjust it with element width
            if (adjustArrow) {
                const aType = isVertical ? 'left' : 'top'
                const sType = isVertical ? 'width' : 'height'
                arrow.offset = -adjust[aType]
                const maxOffset = content[sType] / 2 - arrowSize
                if (Math.abs(arrow.offset) > maxOffset + arrowSize) {
                    arrow.class = '' // no arrow
                }
                if (Math.abs(arrow.offset) > maxOffset) {
                    arrow.offset = arrow.offset < 0 ? -maxOffset : maxOffset
                }
                // any: stripSpaces returns unknown; runtime always produces a string
                arrow.style = w2utils.stripSpaces(`#${overlay.id} .w2ui-overlay-body:after,
                            #${overlay.id} .w2ui-overlay-body:before {
                                --tip-size: ${arrowSize}px;
                                margin-${aType}: ${arrow.offset}px;
                            }`) as string
            }
        }
    }

    /**
     * Move overlay node to the end of its parent (typically body) so it stacks above other .w2ui-overlay siblings
     * without relying on z-index. No-op if it is already the last element child.
     */
    bringOverlayToFront(overlay: TooltipOverlay): void {
        if (!overlay || !overlay.box || !overlay.box.parentNode || !overlay.box.nextElementSibling) {
            return
        }
        overlay.box.parentNode.appendChild(overlay.box)
    }

    startDrag(event: MouseEvent & { target: EventTarget & { _lastBoundingRect?: DOMRect } }): void {
        if (event.preventDefault) {
            event.preventDefault()
        }
        const el = query(event.target).closest('.w2ui-overlay')
        // any: overlay DOM element has .overlay property attached at runtime (line: overlay.box.overlay = overlay)
        const overlay = (el[0] as HTMLElement & { overlay?: TooltipOverlay })?.overlay
        if (overlay) {
            this.bringOverlayToFront(overlay)
        }
        const initial = {
            el,
            x: parseFloat(el.css('left') as string), // any: css(string) returns string when reading a property
            y: parseFloat(el.css('top') as string),
            pageX: event.pageX,
            pageY: event.pageY,
            moved: false,
            _removed: false
        }
        query(document)
            .off('.w2ui-drag')
            .on('selectstart.w2ui-drag, dragstart.w2ui-drag', e => e.preventDefault())
            .find('body')
            .addClass('w2ui-overlay-dragging')
        query('html')
            .off('.w2color')
            .on('mousemove.w2color', mouseMove)
            .on('mouseup.w2color', mouseUp)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseUp(_event: any) { // any: query event
            query('html').off('.w2color')
            query(document).off('selectstart.w2ui-drag')
            query(document).off('dragstart.w2ui-drag')
            query(document.body).removeClass('w2ui-overlay-dragging')
            if (initial['moved']) {
                const ov = initial.el[0] && (initial.el[0] as HTMLElement & { overlay?: TooltipOverlay }).overlay // any: runtime .overlay prop
                if (ov) {
                    if (!ov.tmp) ov.tmp = {}
                    ov.tmp['moved'] = true
                    clearTimeout(ov.tmp['_movedClearTimer'] as number) // any: tmp bag value; runtime is timer ID
                    ov.tmp['_movedClearTimer'] = setTimeout(() => {
                        if (ov.tmp) {
                            delete ov.tmp['moved']
                            delete ov.tmp['_movedClearTimer']
                        }
                    }, 400)
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseMove(event: any) { // any: query event
            const divX = event.pageX - initial.pageX
            const divY = event.pageY - initial.pageY
            if (Math.abs(divX) > 3 || Math.abs(divY) > 3) {
                initial.moved = true
            }
            initial.el.css({
                left: initial.x + divX + 'px',
                top: initial.y + divY + 'px'
            })
            if (!initial._removed) {
                initial._removed = true
                initial.el.find(':scope > .w2ui-overlay-body')
                    .removeClass('w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom')
            }
        }
    }
}

class ColorTooltip extends Tooltip {
    static custom_colors: string[] = []
    palette: string[][]
    // any: index tracks keyboard position in the palette grid; tuple [row, col]
    index!: [number, number]

    constructor() {
        super()
        this.palette = [
            ['000000', '333333', '555555', '777777', '888888', '999999', 'AAAAAA', 'CCCCCC', 'DDDDDD', 'EEEEEE', 'F7F7F7', 'FFFFFF'],
            ['FF011B', 'FF9838', 'FFC300', 'FFFD59', '86FF14', '14FF7A', '2EFFFC', '2693FF', '006CE7', '9B24F4', 'FF21F5', 'FF0099'],
            ['FFEAEA', 'FCEFE1', 'FCF4DC', 'FFFECF', 'EBFFD9', 'D9FFE9', 'E0FFFF', 'E8F4FF', 'ECF4FC', 'EAE6F4', 'FFF5FE', 'FCF0F7'],
            ['F4CCCC', 'FCE5CD', 'FFF1C2', 'FFFDA1', 'D5FCB1', 'B5F7D0', 'BFFFFF', 'D6ECFF', 'CFE2F3', 'D9D1E9', 'FFE3FD', 'FFD9F0'],
            ['EA9899', 'F9CB9C', 'FFE48C', 'F7F56F', 'B9F77E', '84F0B1', '83F7F7', 'B5DAFF', '9FC5E8', 'B4A7D6', 'FAB9F6', 'FFADDE'],
            ['E06666', 'F6B26B', 'DEB737', 'E0DE51', '8FDB48', '52D189', '4EDEDB', '76ACE3', '6FA8DC', '8E7CC3', 'E07EDA', 'F26DBD'],
            ['CC0814', 'E69138', 'AB8816', 'B5B20E', '6BAB30', '27A85F', '1BA8A6', '3C81C7', '3D85C6', '674EA7', 'A14F9D', 'BF4990'],
            ['99050C', 'B45F17', '80650E', '737103', '395E14', '10783D', '13615E', '094785', '0A5394', '351C75', '780172', '782C5A']
        ]
        this.defaults = w2utils.extend({}, this.defaults, {
            advanced    : false,
            transparent : true,
            position    : 'top|bottom',
            class       : 'w2ui-white',
            color       : '',
            updateInput : true,
            arrowSize   : 12,
            autoResize  : false,
            anchorClass : 'w2ui-focus',
            autoShowOn  : 'focus',
            hideOn      : ['doc-click', 'focus-change'],
            onSelect    : null,
            onLiveUpdate: null
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override attach(anchor: any, text?: any): AttachReturn | undefined { // any: params are overloaded per call site
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let options: any // any: merged from defaults + user options; open-ended shape
        if (arguments.length == 1 && anchor instanceof Object) {
            options = anchor
            anchor = options.anchor
        } else if (arguments.length === 2 && text != null && typeof text === 'object') {
            options = text
            options.anchor = anchor
        }
        const prevHideOn = options.hideOn
        options = w2utils.extend({}, this.defaults, options || {})
        if (prevHideOn) {
            options.hideOn = prevHideOn
        }
        options.style += '; padding: 0;'
        // add remove transparent color
        if (options.transparent && this.palette[0]![1] == '333333') {
            this.palette[0]!.splice(1, 1)
            this.palette[0]!.push('TRANSPARENT')
        }
        if (!options.transparent && this.palette[0]![1] != '333333') {
            this.palette[0]!.splice(1, 0, '333333')
            this.palette[0]!.pop()
        }
        if (options.color) options.color = String(options.color).toUpperCase()
        if (typeof options.color === 'string' && options.color.substr(0,1) === '#') options.color = options.color.substr(1)
        // needed for keyboard navigation
        this.index = [-1, -1]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ret = super.attach(options) as any as AttachReturn // any: super.attach returns AttachReturn | undefined; non-null here since options is object
        const overlay = ret.overlay
        overlay.options.html = this.getColorHTML(overlay.name, options)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('show.attach', (event: any) => { // any: w2base event
            const overlay = event.detail.overlay
            const anchor  = overlay.anchor
            const options = overlay.options
            if (['INPUT', 'TEXTAREA'].includes(anchor.tagName) && !options.color && anchor.value) {
                overlay.tmp['initColor'] = anchor.value
            }
            delete overlay.newColor
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('show:after.attach', (_event: any) => { // any: w2base event
            if (ret.overlay?.box) {
                const actions = query(ret.overlay.box).find('.w2ui-eaction')
                w2utils.bindEvents(actions, this as unknown as Record<string, unknown>)
                this.initControls(ret.overlay)
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('update:after.attach', (_event: any) => { // any: w2base event
            if (ret.overlay?.box) {
                const actions = query(ret.overlay.box).find('.w2ui-eaction')
                w2utils.bindEvents(actions, this as unknown as Record<string, unknown>)
                this.initControls(ret.overlay)
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('hide.attach', (event: any) => { // any: w2base event
            const overlay = event.detail.overlay
            const anchor  = overlay.anchor
            const color   = overlay.newColor ?? overlay.options.color ?? ''
            // color has been selected
            if (color !== '') {
                if (['INPUT', 'TEXTAREA'].includes(anchor.tagName) && anchor.value != color && overlay.options.updateInput) {
                    anchor.value = color
                }
                const edata = this.trigger('select', { color, target: overlay.name, overlay })
                if (edata.isCancelled === true) return
                // event after
                edata.finish()
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ret.liveUpdate = (callback: any) => { // any: event shape varies by overlay type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('liveUpdate.attach', (event: any) => { callback(event) }) // any: w2base event
            return ret
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ret.select = (callback: any) => { // any: event shape varies by overlay type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('select.attach', (event: any) => { callback(event) }) // any: w2base event
            return ret
        }
        return ret
    }

    // regular panel handler, adds selection class
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(color: any, name: any) { // any: color is string; name can be string or Event-like object
        let target
        this.index = [-1, -1]
        if (typeof name != 'string') {
            target = name.target
            this.index = (query(target).attr('index') ?? '').split(':').map(Number) as [number, number] // any: attr returns string; map to numbers for palette grid coordinates
            name = query(target).closest('.w2ui-overlay').attr('name') as string // any: attr returns string|undefined; name is always present here
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = this.get(name) // any: get() returns union; runtime is TooltipOverlay when name is string
        // event before
        // any: param carries the original event object when name was non-string (event used as 2nd arg)
        const edata = this.trigger('liveUpdate', { color, target: name, overlay, param: name as unknown })
        if (edata.isCancelled === true) return
        // if anchor is input - live update
        if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName) && overlay.options.updateInput) {
            query(overlay.anchor).val(color)
        }
        overlay.newColor = color
        query(overlay.box).find('.w2ui-color.w2ui-selected').removeClass('w2ui-selected')
        if (target) {
            query(target).addClass('w2ui-selected')
        }
        // event after
        edata.finish()
    }

    // used for keyboard navigation, if any
    nextColor(direction: string) { // TODO: check it
        const pal = this.palette
        switch (direction) {
            case 'up':
                this.index[0]--
                break
            case 'down':
                this.index[0]++
                break
            case 'right':
                this.index[1]++
                break
            case 'left':
                this.index[1]--
                break
        }
        if (this.index[0] < 0) this.index[0] = 0
        if (this.index[0] > pal.length - 2) this.index[0] = pal.length - 2
        if (this.index[1] < 0) this.index[1] = 0
        if (this.index[1] > (pal[0]?.length ?? 0) - 1) this.index[1] = (pal[0]?.length ?? 1) - 1
        return pal[this.index[0]]?.[this.index[1]]
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabClick(index: any, name: any) { // any: index is number or string; name can be string or Event-like
        if (typeof name != 'string') {
            name = query(name.target).closest('.w2ui-overlay').attr('name')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = this.get(name) // any: get() returns union; runtime is TooltipOverlay
        const tab = query(overlay.box).find(`.w2ui-color-tab:nth-child(${index})`)
        query(overlay.box).find('.w2ui-color-tab').removeClass('w2ui-selected')
        query(tab).addClass('w2ui-selected')
        query(overlay.box)
            .find('.w2ui-tab-content')
            .hide()
            .closest('.w2ui-colors')
            .find('.tab-'+ index)
            .show()
    }

    // generate HTML with color pallent and controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getColorHTML(name: any, options: any) { // any: name is string; options is TooltipOptions
        let html = `
            <div class="w2ui-colors-header w2ui-eaction" data-mousedown="startDrag|event">
                Colors
            </div>
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`
        for (let i = 0; i < this.palette.length; i++) {
            html += '<div class="w2ui-color-row">'
            for (let j = 0; j < (this.palette[i]?.length ?? 0); j++) {
                const color = this.palette[i]![j]!
                let border = ''
                if (color === 'FFFFFF') border = '; border: 1px solid #efefef'
                html += `
                    <div class="w2ui-color w2ui-eaction ${color === 'TRANSPARENT' ? 'w2ui-no-color' : ''} ${options.color == color ? 'w2ui-selected' : ''}"
                        style="background-color: #${color + border};" name="${color}" index="${i}:${j}"
                        data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                    </div>`
            }
            html += '</div>'
            if (i < 2) html += '<div style="height: 8px"></div>'
        }
        // custom colors
        html += `
            <div style="height: 8px"></div>
            <div class="w2ui-colors-custom">
                ${this.getCustomColorsHTML(name)}
            </div>`
        html += '</div>'
        // advanced tab
        html += `
            <div class="w2ui-tab-content tab-2" style="display: none">
                <div class="color-info">
                    <div class="color-preview-bg"><div class="color-preview"></div><div class="color-original"></div></div>
                    <div class="color-part">
                        <span>H</span> <input class="w2ui-input" name="h" maxlength="3" max="360" tabindex="101">
                        <span>R</span> <input class="w2ui-input" name="r" maxlength="3" max="255" tabindex="104">
                    </div>
                    <div class="color-part">
                        <span>S</span> <input class="w2ui-input" name="s" maxlength="3" max="100" tabindex="102">
                        <span>G</span> <input class="w2ui-input" name="g" maxlength="3" max="255" tabindex="105">
                    </div>
                    <div class="color-part">
                        <span>V</span> <input class="w2ui-input" name="v" maxlength="3" max="100" tabindex="103">
                        <span>B</span> <input class="w2ui-input" name="b" maxlength="3" max="255" tabindex="106">
                    </div>
                    <div class="color-part opacity">
                        <span>${w2utils.lang('Opacity')}</span>
                        <input class="w2ui-input" name="a" maxlength="5" max="1" tabindex="107">
                    </div>
                </div>
                <div class="palette" name="palette">
                    <div class="palette-bg"></div>
                    <div class="value1 move-x move-y"></div>
                </div>
                <div class="rainbow" name="rainbow">
                    <div class="value2 move-x"></div>
                </div>
                <div class="alpha" name="alpha">
                    <div class="alpha-bg"></div>
                    <div class="value2 move-x"></div>
                </div>
                <div class="final" name="final">
                    <span style="text-align: right"> Hex </span>
                    <input class="w2ui-input final" name="hex" tabindex="107" style="width: 70px" readonly>
                    <div class="w2ui-color w2ui-color-picker w2ui-eaction" data-click="pickAndUse|${name}">
                        <span class="w2ui-icon w2ui-icon-eye-dropper"></span>
                    </div>
                </div>
            </div>`
        // color tabs on the bottom
        html += `
            <div class="w2ui-color-tabs">
                <div class="w2ui-color-tab w2ui-selected w2ui-eaction" data-click="tabClick|1|event|this"><span class="w2ui-icon w2ui-icon-colors"></span></div>
                <div class="w2ui-color-tab w2ui-eaction" data-click="tabClick|2|event|this"><span class="w2ui-icon w2ui-icon-settings"></span></div>
                <div style="padding: 5px; width: 100%; text-align: right;">
                    ${(typeof options.html == 'string' ? options.html : '')}
                </div>
            </div>`
        return html
    }

    getCustomColorsHTML(name: string): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = (this.get(name) as any)?.options // any: get() returns union; runtime is TooltipOverlay
        let html = '<div class="w2ui-color-row" style="min-height: 21px">'
        ColorTooltip.custom_colors.forEach((color, i) => {
            let border = ''
            if (color === 'FFFFFF') border = '; border: 1px solid #efefef'
            html += `
                <div class="w2ui-color w2ui-eaction ${color === 'TRANSPARENT' ? 'w2ui-no-color' : ''} ${options.color == color ? 'w2ui-selected' : ''}"
                    style="background-color: #${color + border};" name="${color}" index="c:${i}"
                    data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                </div>`

        })
        html += `
                <div class="w2ui-color w2ui-color-picker w2ui-eaction" data-click="pickAndSelect|${name}|event">
                    <span class="w2ui-icon w2ui-icon-eye-dropper"></span>
                </div>
            </div>`
        return html
    }

    // bind advanced tab controls
    override initControls(overlay: TooltipOverlay): void {
        // any: complex HSV/RGB slider state shared across closures; runtime shapes are always correct
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let initial: any // used for mouse events
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const options = overlay.options
        const color = (options.color || overlay.tmp['initColor']) as string // any: initColor in tmp bag; runtime is always string
        // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rgb: any = w2utils.parseColor(color)
        if (rgb == null) {
            rgb = { r: 140, g: 150, b: 160, a: 1 }
        }
        // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let hsv: any = (w2utils.rgb2hsv as any)(rgb)
        if (options.advanced === true) {
            this.tabClick(2, overlay.name)
        }
        setColor(hsv, true, color ?? '') // should not be null or undefined

        // even for rgb, hsv inputs
        query(overlay.box)
            .off('.w2color')
            .on('contextmenu.w2color', event => {
                event.preventDefault() // prevent browser context menu
            })
            .find('input')
            .off('.w2color')
            .on('change.w2color', (event) => {
                // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const el: any = query(event.target)
                let val = parseFloat(el.val())
                const max = parseFloat(el.attr('max'))
                if (isNaN(val)) {
                    val = 0
                    el.val(0)
                }
                if (max > 1) val = parseInt(String(val)) // trancate fractions
                if (max > 0 && val > max) {
                    el.val(max)
                    val = max
                }
                if (val < 0) {
                    el.val(0)
                    val = 0
                }
                const name  = el.attr('name')
                // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const color: any = {}
                if (['r', 'g', 'b', 'a'].indexOf(name) !== -1) {
                    rgb[name] = val
                    // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    hsv = (w2utils.rgb2hsv as any)(rgb)
                } else if (['h', 's', 'v'].indexOf(name) !== -1) {
                    color[name] = val
                }
                setColor(color, true)
            })

        // click on original color resets it
        query(overlay.box).find('.color-original')
            .off('.w2color')
            .on('click.w2color', (event) => {
                const tmp = w2utils.parseColor(query(event.target).css('background-color') as string)
                if (tmp != null) {
                    rgb = tmp
                    // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    hsv = (w2utils.rgb2hsv as any)(rgb)
                    setColor(hsv, true)
                }
            })

        // color sliders events
        const mDown = `${!w2utils.isMobile ? 'mousedown' : 'touchstart'}.w2color`
        const mUp   = `${!w2utils.isMobile ? 'mouseup' : 'touchend'}.w2color`
        const mMove = `${!w2utils.isMobile ? 'mousemove' : 'touchmove'}.w2color`
        query(overlay.box).find('.palette, .rainbow, .alpha')
            .off('.w2color')
            .on(`${mDown}.w2color`, mouseDown)

        this.setColor = setColor
        return

        // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function setColor(color: any, fullUpdate?: boolean, initial?: string) {
            if (color.h != null) hsv.h = color.h
            if (color.s != null) hsv.s = color.s
            if (color.v != null) hsv.v = color.v
            if (color.a != null) { rgb.a = color.a; hsv.a = color.a }
            // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rgb = (w2utils.hsv2rgb as any)(hsv)
            const rgba = 'rgba('+ rgb.r +','+ rgb.g +','+ rgb.b +','+ rgb.a +')'
            const cl = [
                Number(rgb.r).toString(16).toUpperCase(),
                Number(rgb.g).toString(16).toUpperCase(),
                Number(rgb.b).toString(16).toUpperCase(),
                (Math.round(Number(rgb.a)*255)).toString(16).toUpperCase()
            ]
            cl.forEach((item, ind) => { if (item.length === 1) cl[ind] = '0' + item })
            let newColor = cl[0]! + cl[1]! + cl[2]! + cl[3]!
            if (rgb.a === 1) {
                newColor = cl[0]! + cl[1]! + cl[2]!
            }
            query(overlay.box).find('.color-preview').css('background-color', '#' + newColor)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query(overlay.box).find('input').each((el: any) => { // any: query.each gives Node; runtime is HTMLInputElement
                if (el.name) {
                    if (rgb[el.name] != null) el.value = String(rgb[el.name])
                    if (hsv[el.name] != null) el.value = String(hsv[el.name])
                    if (el.name === 'a') el.value = String(rgb.a)
                    if (el.name == 'hex') el.value = newColor
                    if (el.name == 'rgb') el.value = rgba
                }
            })
            // if it is in pallette
            if (initial != null) {
                const color = overlay.tmp['initColor'] || newColor
                query(overlay.box).find('.color-original')
                    .css('background-color', '#' + color)
                query(overlay.box).find('.w2ui-color.w2ui-selected')
                    .removeClass('w2ui-selected')
                query(overlay.box).find(`.w2ui-colors [name="${color}"], .w2ui-colors [name="${initial}"]`) // color conversion might be slightly off
                    .addClass('w2ui-selected')
                // if has transparent color, open advanced tab
                if (newColor.length == 8) {
                    self.tabClick(2, overlay.name)
                }
            } else {
                self.select(newColor, overlay.name)
            }
            if (fullUpdate) {
                updateSliders()
                refreshPalette()
            }
        }

        function updateSliders() {
            const el1 = query(overlay.box).find('.palette .value1')
            const el2 = query(overlay.box).find('.rainbow .value2')
            const el3 = query(overlay.box).find('.alpha .value2')
            if (!el1[0] || !el2[0] || !el3[0]) return
            const offset1 = (el1[0] as HTMLElement).clientWidth / 2
            const offset2 = (el2[0] as HTMLElement).clientWidth / 2
            el1.css({
                'left': (hsv.s * 150 / 100 - offset1) + 'px',
                'top': ((100 - hsv.v) * 125 / 100 - offset1) + 'px'
            })
            el2.css('left', (hsv.h/(360/150) - offset2) + 'px')
            el3.css('left', (rgb.a*150 - offset2) + 'px')
        }

        function refreshPalette() {
            // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cl  = (w2utils.hsv2rgb as any)(hsv.h, 100, 100)
            const rgb = `${cl.r},${cl.g},${cl.b}`
            query(overlay.box).find('.palette')
                .css('background-image', `linear-gradient(90deg, rgba(${rgb},0) 0%, rgba(${rgb},1) 100%)`)
        }

        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseDown(this: any, event: any) {
            // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const el: any = query(this).find('.value1, .value2')
            const offset = el.prop('clientWidth') / 2
            if (el.hasClass('move-x')) el.css({ left: (event.offsetX - offset) + 'px' })
            if (el.hasClass('move-y')) el.css({ top: (event.offsetY - offset) + 'px' })
            initial = {
                el: el,
                x: event.pageX,
                y: event.pageY,
                width: el.prop('parentNode').clientWidth,
                height: el.prop('parentNode').clientHeight,
                left: parseInt(el.css('left')),
                top: parseInt(el.css('top'))
            }
            mouseMove(event)
            query('html')
                .off('.w2color')
                .on(mMove, mouseMove)
                .on(mUp, mouseUp)
        }

        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseUp(_event: any) {
            query('html').off('.w2color')
        }

        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseMove(event: any) {
            // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const el: any   = initial.el
            const divX   = event.pageX - initial.x
            const divY   = event.pageY - initial.y
            let newX   = initial.left + divX
            let newY   = initial.top + divY
            const offset = el.prop('clientWidth') / 2
            if (newX < -offset) newX = -offset
            if (newY < -offset) newY = -offset
            if (newX > initial.width - offset) newX = initial.width - offset
            if (newY > initial.height - offset) newY = initial.height - offset
            if (el.hasClass('move-x')) el.css({ left : newX + 'px' })
            if (el.hasClass('move-y')) el.css({ top : newY + 'px' })

            // move
            const name = query(el.get(0).parentNode).attr('name')
            const x    = parseInt(el.css('left')) + offset
            const y    = parseInt(el.css('top')) + offset
            if (name === 'palette') {
                setColor({
                    s: Math.round(x / initial.width * 100),
                    v: Math.round(100 - (y / initial.height * 100))
                })
            }
            if (name === 'rainbow') {
                const h = Math.round(360 / 150 * x)
                setColor({ h: h })
                refreshPalette()
            }
            if (name === 'alpha') {
                setColor({ a: parseFloat(Number(x / 150).toFixed(2)) })
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addCustomColor(color: any, _name: any) { // any: color is string; name is string
        if (typeof color == 'string' && color.substr(0, 1) == '#' && [7, 9].includes(color.length)) {
            color = color.substr(1).toUpperCase()
            const custom = ColorTooltip.custom_colors
            if (custom.includes(color)) {
                custom.splice(custom.indexOf(color), 1)
            }
            if (custom.length >= 5) {
                custom.pop() // removes last one
            }
            custom.unshift(color)
        }
        return color
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async pickAndSelect(name: string, event: any) {
        const color = await this.pickColor()
        if (typeof color == 'string' && color.substr(0, 1) == '#' && [7, 9].includes(color.length)) {
            this.addCustomColor(color, name)
            const cnt = query(event.target).closest('.w2ui-colors-custom')
            cnt.html(this.getCustomColorsHTML(name))
            w2utils.bindEvents(cnt.find('.w2ui-eaction'), this as unknown as Record<string, unknown>)
            this.select(color.substr(1), name)
            // this.hide(name)
        }
    }

    async pickAndUse(_name: string) {
        const color = await this.pickColor()
        if (typeof color == 'string' && color.substr(0, 1) == '#' && [7, 9].includes(color.length)) {
            // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hsv = (w2utils.rgb2hsv as any)(w2utils.parseColor(color))
            this.setColor!(hsv, true)
        }
    }

    async pickColor(): Promise<string | undefined> {
        // any: EyeDropper is a browser experimental API not yet in lib.dom.d.ts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any
        if (!win.EyeDropper) {
            console.error('EyeDropper API is not supported in this browser.')
            return
        }
        const eyeDropper = new win.EyeDropper()
        try {
            const result = await eyeDropper.open()
            return result.sRGBHex
        } catch (err) {
            console.error('Error picking color:', err)
        }
        return ''
    }
}

class MenuTooltip extends Tooltip {
    constructor() {
        super()
        // ITEM STRUCTURE
        // item : {
        //   id       : null,
        //   text     : '',
        //   style    : '',
        //   icon     : '',
        //   count    : '',
        //   tooltip  : '',
        //   hotkey   : '',
        //   removable: false,
        //   help     : '',      // text for help tooltip
        //   hotkey   ; '',      // hotkey text for the items
        //   items    : []
        //   indent   : 0,
        //   type     : null,    // check/radio
        //   group    : false,   // groupping for checks
        //   expanded : false,
        //   hidden   : false,
        //   checked  : null,
        //   disabled : false
        //   ...
        // }
        this.defaults = w2utils.extend({}, this.defaults, {
            type        : 'normal',    // can be normal, radio, check
            items       : [],
            selected    : null,        // current selected
            render      : null,
            spinner     : false,
            msgNoItems  : w2utils.lang('No items found'),
            topHTML     : '',
            menuStyle   : '',
            search      : false,        // search input inside tooltip
            filter      : false,        // will apply filter, if anchor is INPUT or TEXTAREA
            match       : 'contains',   // is, begins, ends, contains, regexp
            markSearch  : false,
            prefilter   : false,
            altRows     : false,
            arrowSize   : 10,
            align       : 'left',
            position    : 'bottom|top',
            class       : 'w2ui-white',
            anchorClass : 'w2ui-focus',
            autoShowOn  : 'focus',
            hideOn      : ['doc-click', 'focus-change', 'select'], // also can 'item-remove'
            onSelect    : null,
            onSubMenu   : null,
            onRemove    : null,
            onTooltip   : null,
            onMouseEnter: null,
            onMouseLeave: null
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override attach(anchor: any, text?: any): AttachReturn | undefined { // any: params are overloaded per call site
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let options: any // any: merged from defaults + user options; open-ended shape
        if (arguments.length == 1 && anchor instanceof Object) {
            options = anchor
            anchor = options.anchor
        } else if (arguments.length === 2 && text != null && typeof text === 'object') {
            options = text
            options.anchor = anchor
        }
        const prevHideOn = options.hideOn
        options = w2utils.extend({}, this.defaults, options || {})
        if (prevHideOn) {
            options.hideOn = prevHideOn
        }
        options.style += '; padding: 0;'
        if (options.items == null) {
            options.items = []
        }
        if (options.cacheMax <= 0) {
            console.log(`The option "cacheMax" is ${options.cacheMax} but should be more than 0`)
        }
        options.items = w2utils.normMenu(options.items, options)
        options.html = this.getMenuHTML(options)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ret = super.attach(options) as any as AttachReturn // any: super.attach returns AttachReturn | undefined; non-null here since options is object
        // any: overlay is a w2base instance extended at runtime with menu-specific fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overlay: any = ret.overlay
        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('show:after.attach, update:after.attach', (_event: any) => {
            if (ret.overlay?.box) {
                let search = ''
                // reset selected and active chain
                overlay.selected = overlay.options.selected // this is needed so that menu item can be preselected
                const index = overlay.anchor.dataset?.selectedIndex
                if ((overlay.options.selected !== false && overlay.options.selected !== -1) || index != null) {
                    if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                        search = (overlay.anchor as HTMLInputElement).value
                        overlay.selected = null // no element should be pre-selected
                        if (index != null) {
                            overlay.selected = index
                        }
                    }
                }
                const actions = query(ret.overlay.box).find('.w2ui-eaction')
                if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                    overlay.tmp._new_search = false
                    query(overlay.anchor).on('input.search-trigger', () => {
                        overlay.tmp._new_search = true
                        query(overlay.anchor).off('input.search-trigger')
                    })
                }
                w2utils.bindEvents(actions, this as unknown as Record<string, unknown>)
                this.applyFilter(overlay.name, null, search, undefined)
                    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((data: any) => {
                        if (!Tooltip.active[overlay.name]?.displayed) {
                            // if toolitp is not visible, do not proceed as it would make it visible
                            return
                        }
                        this.getActiveChain(overlay.name, options.items) // need this to update chain for up/down key navigation
                        overlay.tmp.searchCount = data.count
                        overlay.tmp.search = data.search
                        if (options.prefilter || search !== '') {
                            // if selected is not in searched items
                            if (data.count === 0 || !this.getActiveChain(overlay.name, options.items).includes(overlay.selected)) {
                                overlay.selected = null
                            }
                            this.refreshSearch(overlay.name)
                        }
                        this.initControls(ret.overlay)
                        this.refreshIndex(overlay.name, true)
                    })
            }
        })
        overlay.next = () => {
            // any: array of heterogeneous runtime values; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const chain: any[] = this.getActiveChain(overlay.name)
            if (overlay.selected == null || String(overlay.selected).length == 0) {
                overlay.selected = chain[0]
            } else {
                const ind = chain.indexOf(String(overlay.selected)) // if nested menu, selected will be "2-2"
                // selected not in chain of items
                if (ind == -1) {
                    overlay.selected = chain[0]
                }
                // not the last item
                if (ind < chain.length - 1) {
                    overlay.selected = chain[ind + 1]
                }
            }
            this.refreshIndex(overlay.name)
            this.showTooltip(overlay.name)
        }
        overlay.prev = () => {
            // any: array of heterogeneous runtime values; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const chain: any[] = this.getActiveChain(overlay.name)
            if (overlay.selected == null || String(overlay.selected).length == 0) {
                overlay.selected = chain[chain.length-1]
            } else {
                const ind = chain.indexOf(String(overlay.selected)) // if nested menu, selected will be "2-2"
                // selected not in chain of items
                if (ind == -1) {
                    overlay.selected = chain[chain.length-1]
                }
                // not first item
                if (ind > 0) {
                    overlay.selected = chain[ind - 1]
                }
            }
            this.refreshIndex(overlay.name)
            this.showTooltip(overlay.name)
        }
        overlay.click = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query(overlay.box).find('.w2ui-selected').each((el: any) => { el.click() }) // any: query.each gives Node; runtime is HTMLElement
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('hide:after.attach', (_event: any) => { // any: w2base event
            w2tooltip.hide(overlay.name + '-tooltip')
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ret.select = (callback: any) => { // any: event shape varies
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('select.attach', (event: any) => { callback(event) }) // any: w2base event
            return ret
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ret.remove = (callback: any) => { // any: event shape varies
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('remove.attach', (event: any) => { callback(event) }) // any: w2base event
            return ret
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ret.subMenu = (callback: any) => { // any: event shape varies
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('subMenu.attach', (event: any) => { callback(event) }) // any: w2base event
            return ret
        }
        return ret
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override update(name: any, items: any) { // any: name is string; items is array
        const overlay = Tooltip.active[name]
        if (overlay) {
            const options = overlay.options
            if (options.items != items) {
                options.items = items
            }
            const menuHTML = this.getMenuHTML(options)
            if (options.html != menuHTML) {
                options.html = menuHTML
                overlay.needsUpdate = true
                this.show(name)
            }
        } else {
            console.log(`Tooltip "${name}" is not displayed. Cannot update it.`)
        }
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override initControls(overlay: any): void {
        let mdown = 'mousedown'
        let mclick = 'click'
        if (w2utils.isMobile) {
            mdown = 'touchstart'
            mclick = 'touchend'
        }
        query(overlay.box).find('.w2ui-menu:not(.w2ui-sub-menu)')
            .off('.w2menu')
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('contextmenu.w2menu', (event: any) => {
                event.preventDefault() // prevent browser context menu
            })
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on(`${mdown}.w2menu`, { delegate: '.w2ui-menu-item' }, (event: any) => {
                const dt = event.delegate.dataset
                const parents = query(event.delegate).closest('.w2ui-menu').data('parents')
                this.menuDown(overlay, event, dt.index, parents)
                if (w2utils.isMobile) {
                    // need it for mobile so that it would not generate onclick (items under menu receive focus)
                    event.preventDefault()
                }
            })
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on(`${mclick}.w2menu`, { delegate: '.w2ui-menu-item' }, (event: any) => {
                const dt = event.delegate.dataset
                const parents = query(event.delegate).closest('.w2ui-menu').data('parents')
                this.menuClick(overlay, event, parseInt(dt['index'] ?? '0'), parents)
            })
            .find('.w2ui-menu-item')
            .off('.w2menu')
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseEnter.w2menu', (event: any) => {
                const dt = (event.target as HTMLElement).dataset
                const item = overlay.options.items[dt['index'] ?? '']
                const edata = this.trigger('mouseEnter', { overlay, item, originalEvent: event })
                if (edata.isCancelled) {
                    return
                }
                const tooltip = item?.tooltip
                if (tooltip && dt['hassubmenu'] != 'yes') {
                    this.showTooltip(overlay.name, { tooltip, anchor: event.target })
                }
                // hide previous sub-menu if any
                // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const _menu: any = query(event.target).closest('.w2ui-menu').get(0)
                if (_menu._evt && _menu._evt.target != event.target) {
                    this.closeSubMenu(_menu._evt)
                }
                // show new sub-menu
                if (dt['hassubmenu'] == 'yes') {
                    const _evt = {
                        index: parseInt(dt['index'] ?? '0'),
                        parents: _menu.dataset.parents !== '' ? _menu.dataset.parents.split('-').map((ind: string) => parseInt(ind)) : [],
                        target: event.target,
                        originalEvent: event,
                        overlay
                    }
                    _menu._evt = _evt
                    this.openSubMenu(_evt)
                }
                edata.finish()
            })
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseLeave.w2menu', (event: any) => {
                const dt = (event.target as HTMLElement).dataset
                const item = overlay.options.items[dt['index'] ?? '']
                const edata = this.trigger('mouseLeave', { overlay, item, originalEvent: event })
                if (edata.isCancelled) {
                    return
                }
                w2tooltip.hide(overlay.name + '-tooltip')
                edata.finish()
            })
            .find('.menu-help')
            .off('.w2menu')
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseEnter.w2menu', (event: any) => {
                const target = event.target as HTMLElement
                const dt = (target.parentNode as HTMLElement)?.parentNode as HTMLElement
                // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tooltip = overlay.options.items[(dt as any).dataset?.index]?.help
                if (tooltip) {
                    w2tooltip.show({
                        name: overlay.name + '-help-tp',
                        anchor: event.target,
                        html: tooltip,
                        position: 'right|left',
                        hideOn: ['doc-click']
                    })
                }
            })
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseLeave.w2menu', (_event: any) => {
                w2tooltip.hide(overlay.name + '-help-tp')
            })
        if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
            query(overlay.anchor)
                .off('.w2menu')
                // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('input.w2menu', (_event: any) => {
                    // if user types, clear selection
                    // let dt = event.target.dataset
                    // delete dt.selected
                    // delete dt.selectedIndex
                })
                // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('keyup.w2menu', (event: any) => {
                    // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (event as any)._searchType = 'filter'
                    this.keyUp(overlay, event)
                })
        }
        if (overlay.options.search) {
            query(overlay.box).find('#menu-search')
                .off('.w2menu')
                // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('keyup.w2menu', (event: any) => {
                    // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (event as any)._searchType = 'search'
                    this.keyUp(overlay, event)
                })
        }
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCurrent(name: string, id?: any) {
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]!
        const options = overlay.options
        const selected = String(id ? id : (overlay.selected || '')).split('-')
        if (selected?.[0] === '') {
            selected.shift()
        }
        const last = selected.length - 1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let index: any = selected[last] // any: index can be string or number during processing
        const parents = selected.slice(0, selected.length - 1).join('-')
        index = w2utils.isInt(index) ? parseInt(index as string) : 0
        // items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let items: any = options.items // any: items is menu array; traversed via string keys at runtime
        selected.forEach((id, ind) => {
            // do not go to the last one
            if (ind < selected.length - 1) {
                items = items[id].items
            }
        })
        return { last, index, items, item: items?.[index], parents }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMenuHTML(options: any) { // any: options is TooltipOptions-like with items array
        if (options.spinner) {
            return `
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${w2utils.lang('Loading...')}
                </div>
            </div>`
        }
        const parents = options.parents ?? []
        let items = options.items
        if (!Array.isArray(items)) items = []
        let count = 0
        let icon = null
        let topHTML = ''
        if (options.search) {
            topHTML += `
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.forEach((item: any) => item.hidden = false) // any: menu item shape
        }
        if (options.topHTML) {
            topHTML += `<div class="w2ui-menu-top">${options.topHTML}</div>`
        }
        let menu_html = `
            ${topHTML}
            <div class="w2ui-menu" style="${options.menuStyle}" data-parents="${parents.join('-')}">
        `
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((mitem: any, f: any) => { // any: menu item shape
            icon = mitem.icon
            const index = (parents.length > 0 ? parents.join('-') + '-' : '') + f
            if (icon == null) icon = null // icon might be undefined
            if (['radio', 'check'].includes(options.type) && !Array.isArray(mitem.items) && mitem.group !== false) {
                if (mitem.checked === true) icon = 'w2ui-icon-check'; else icon = 'w2ui-icon-empty'
            }
            if (mitem.hidden !== true) {
                let txt  = mitem.text
                let icon_dsp = ''
                if (typeof options.render === 'function') txt = options.render(mitem, options)
                if (typeof txt == 'function') txt = txt(mitem, options)
                if (icon) {
                    const first = String(icon).trim().slice(0, 1)
                    if (first == '#') {
                        icon = `<span class="w2ui-icon w2ui-icon-empty" style="background-color: ${icon}"></span>`
                    } else if (first !== '<') {
                        icon = `<span class="w2ui-icon ${icon}"></span>`
                    }
                    icon_dsp = `<div class="menu-icon">${icon}</div>`
                }
                // for backward compatibility
                if (mitem.removable == null && mitem.remove != null) {
                    mitem.removable = mitem.remove
                }
                // render only if non-empty
                if (mitem.type !== 'break' && txt != null && txt !== '' && String(txt).substr(0, 2) != '--') {
                    const classes = ['w2ui-menu-item']
                    if (options.altRows == true) {
                        classes.push(count % 2 === 0 ? 'w2ui-even' : 'w2ui-odd')
                    }
                    let colspan = 1
                    if (icon_dsp === '') colspan++
                    if (mitem.count == null && mitem.hotkey == null && mitem.removable !== true && mitem.items == null) colspan++
                    if (mitem.tooltip == null && mitem.hint != null) mitem.tooltip = mitem.hint // for backward compatibility
                    let count_dsp = ''
                    if (mitem.removable === true) {
                        count_dsp = '<span class="menu-remove">x</span>'
                    } else if (mitem.items != null) {
                        classes.push('has-sub-menu')
                        count_dsp = '<span style="background-color: transparent; border: transparent; box-shadow: none;"></span>' // used as drop arrow
                    } else {
                        if (mitem.count != null) count_dsp += '<span>' + mitem.count + '</span>'
                        if (mitem.hotkey != null) count_dsp += '<span class="menu-hotkey">' + mitem.hotkey + '</span>'
                        if (mitem.help != null) count_dsp += '<span class="menu-help">?</span>'
                    }
                    if (mitem.disabled === true) classes.push('w2ui-disabled')
                    if (mitem._noSearchInside === true) classes.push('w2ui-no-search-inside')
                    menu_html += `
                        <div index="${index}" class="${classes.join(' ')}" style="${mitem.style ? mitem.style : ''}"
                            data-index="${f}" data-hasSubmenu="${mitem.items != null ? 'yes' : ''}">
                                <div style="width: ${parseInt(mitem.indent ?? 0)}px"></div>
                                ${icon_dsp}
                                <div class="menu-text" colspan="${colspan}">${w2utils.lang(txt)}</div>
                                <div class="menu-extra">${mitem.extra ?? ''}${count_dsp}</div>
                        </div>`
                    count++
                } else {
                    // horizontal line
                    const divText = (txt ?? '').replace(/^-+/g, '')
                    menu_html  += `
                        <div index="${index}" class="w2ui-menu-divider ${divText != '' ? 'has-text' : ''}">
                            <div class="line"></div>
                            ${divText ? `<div class="text">${divText}</div>` : ''}
                        </div>`
                }
            }
            items[f] = mitem
        })
        if (count === 0 && options.msgNoItems) {
            const overlay = Tooltip.active[options.name.replace(/[\s\.#]/g, '_')]
            const remote = overlay?.tmp['remote']
            let msg = options.msgNoItems
            if (options.url) {
                // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (count == 0 && (remote as any)?.hasMore === false) {
                    // if search is applied, but there are no items
                    msg = options.msgNoItems
                } else {
                    msg = options.msgSearch
                }
            }
            menu_html += `
                <div class="w2ui-no-items">
                    ${w2utils.lang(msg)}
                </div>`
        }
        menu_html += '</div>'
        return menu_html
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openSubMenu(event: any) {
        const anchor = query(event.originalEvent.target).get(0)
        const { overlay } = event
        const { items } = overlay.options
        // build sub-items list
        const mitem = items[event.index]
        let _items = []
        if (typeof mitem.items == 'function') {
            _items = mitem.items(mitem)
        } else if (Array.isArray(mitem.items)) {
            _items = mitem.items
        }
        // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prev: any = w2menu.get(overlay.name + '-submenu')
        if (prev) {
            prev.hide()
        }
        query(event.target).addClass('expanded')
        ;(w2menu.show({
            name: overlay.name + '-submenu',
            anchor: anchor as HTMLElement,
            items: _items,
            class: overlay.options.class + ' ' + mitem.overlay?.class,
            offsetX: -7,
            arrowSize: 0,
            parentOverlay: overlay,
            parents: [...event.parents, event.index],
            position: 'right|left',
            hideOn: ['doc-click', 'select']
        // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any)
        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .hide((_evt: any) => {
            query(event.target).removeClass('expanded')
        })
        // indicates if user cursor is over sub menu
        setTimeout(() => {
            query('#w2overlay-' + overlay.name + '-submenu')
                // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('mouseenter', (event: any) => { (event.target as any)._keepSubOpen = true })
                // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('mouseleave', (event: any) => { (event.target as any)._keepSubOpen = false })
        }, 10)
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    closeSubMenu(event: any) {
        const { overlay } = event
        // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((event.target as any)._keepSubOpen !== true) {
            // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const prev: any = w2menu.get(overlay.name + '-submenu')
            if (prev) {
                prev.hide()
            }
        }
    }

    // Refreshed only selected item highligh, used in keyboard navigation
    refreshIndex(name: string, instant?: boolean) {
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]
        if (!overlay) return
        if (!overlay.displayed) {
            this.show(overlay.name)
        }
        const view = query(overlay.box).find('.w2ui-overlay-body').get(0) as HTMLElement
        const search = query(overlay.box).find('.w2ui-menu-search, .w2ui-menu-top').get(0) as HTMLElement
        query(overlay.box).find('.w2ui-menu-item.w2ui-selected')
            .removeClass('w2ui-selected')
        const el = query(overlay.box).find(`.w2ui-menu-item[index="${overlay.selected}"]`)
            .addClass('w2ui-selected')
            .get(0) as HTMLElement
        if (el) {
            if (el.offsetTop + el.clientHeight > view.clientHeight + view.scrollTop) {
                el.scrollIntoView({
                    behavior: instant ? 'instant' : 'smooth',
                    block: instant ? 'center' : 'start',
                    inline: instant ? 'center' : 'start'
                })
            }
            if (el.offsetTop < view.scrollTop + (search ? search.clientHeight : 0)) {
                el.scrollIntoView({
                    behavior: instant ? 'instant' : 'smooth',
                    block: instant ? 'center' : 'end',
                    inline: instant ? 'center' : 'end'
                })
            }
        }
        w2tooltip.hide(overlay.name + '-tooltip')
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showTooltip(name: string, options?: any) {
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]
        if (!overlay || !overlay.displayed) return
        const anchor = options?.anchor ?? query(overlay.box).find(`.w2ui-menu-item[index="${overlay.selected}"]`).get(0)
        // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tooltip = options?.tooltip ?? (overlay.selected != null ? (overlay.options.items as any)?.[overlay.selected]?.tooltip : undefined)
        if (tooltip) {
            const html = tooltip.html ?? tooltip
            w2tooltip.show(Object.assign({
                name: overlay.name + '-tooltip',
                anchor,
                html,
                position: 'right|left',
                hideOn: ['doc-click'],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onShow(event: any) { // any: w2base event
                    overlay.self.trigger('tooltip', { overlay, action: 'show', originalEvent: event })
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onHide(event: any) { // any: w2base event
                    overlay.self.trigger('tooltip', { overlay, action: 'hide', originalEvent: event })
                }
            }, typeof tooltip == 'object' && tooltip != null ? tooltip : {}))
        }
    }

    // show/hide searched items
    refreshSearch(name: string) {
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]
        if (!overlay) return
        if (!overlay.displayed) {
            this.show(overlay.name)
        }
        w2tooltip.hide(overlay.name + '-tooltip')
        query(overlay.box).find('.w2ui-no-items').hide()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query(overlay.box).find('.w2ui-menu-item, .w2ui-menu-divider').each((el: any) => { // any: query.each gives Node; runtime is HTMLElement
            const cur = this.getCurrent(name, (el as Element).getAttribute('index'))
            if (cur.item?.hidden) {
                query(el).hide()
            } else {
                const search = overlay.tmp?.['search']
                if (overlay.options.markSearch) {
                    w2utils.marker(el, search as string, { onlyFirst: overlay.options.match == 'begins' })
                }
                query(el).show()
            }
        })
        // hide empty menus
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query(overlay.box).find('.w2ui-sub-menu').each((sub: any) => { // any: query.each gives Node; runtime is HTMLElement
            const hasItems = (query(sub).find('.w2ui-menu-item').get() as HTMLElement[]).some(el => {
                return el.style.display != 'none' ? true : false
            })
            // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parent = this.getCurrent(name, (sub as any).dataset?.parent)
            // only if parent is expaneded
            if (parent.item.expanded) {
                if (!hasItems) {
                    query(sub).parent().hide()
                } else {
                    query(sub).parent().show()
                }
            }
        })
        // show empty message
        if (overlay.tmp['searchCount'] == 0 || (overlay.options?.items?.length ?? 0) == 0) {
            if (query(overlay.box).find('.w2ui-no-items').length == 0) {
                query(overlay.box).find('.w2ui-menu:not(.w2ui-sub-menu)').append(`
                    <div class="w2ui-no-items">
                        ${w2utils.lang(overlay.options.msgNoItems as string)}
                    </div>`)
            }
            query(overlay.box).find('.w2ui-no-items').show()
        }
    }

    /**
     * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
     * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
     */
    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyFilter(name: string, items: any, search: any, debounce?: any): Promise<any> {
        let count = 0
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]!
        const options = overlay.options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolve: any, reject: any // any: Promise resolve/reject callbacks
        const prom = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })
        if (overlay.tmp['_skip_filter'] === true) {
            return prom
        }
        if (search == null) {
            if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                search = (overlay.anchor as HTMLInputElement).value
            } else {
                search = ''
            }
        }
        /**
         * If it is input control that has a menu, and if filter is true, then show all the items unfiltered, unless user
         * starts filtering again.
         */
        if (overlay.tmp['_new_search'] === false) {
            search = ''
        }
        // any: array of heterogeneous runtime values; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let selectedIds: any[] = []
        if (options.selected) {
            if (Array.isArray(options.selected)) {
                // any: cast-then-index for dynamic property access; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedIds = (options.selected as any[]).map(item => {
                    return item?.id ?? item
                })
            // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((options.selected as any)?.id) {
                // any: cast-to-any for dynamic dispatch; w2tooltip overlay options merge from multiple user sources at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedIds = [(options.selected as any).id]
            }
        }
        overlay.tmp['activeChain'] = null
        // if url is defined, get items from it
        // any: remote is stored in overlay.tmp bag as unknown; shape is always this object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const remote: any = overlay.tmp['remote'] ?? { hasMore: true, emptySet: false, search: null, cached: -1 }
        if (remote.hasMore == false) {
            const len = remote.hasMore_search.length
            if (search.substr(0, len) != remote.hasMore_search) {
                remote.hasMore = true
            }
        }
        if (items == null && options.url && remote.hasMore && remote.search !== search) {
            let proceed = true
            // only when items == null because it is case of nested items
            let msg = w2utils.lang('Loading...')
            if (search.length < (options.minLength ?? 0) && remote.emptySet !== true) {
                msg = w2utils.lang('${count} letters or more...', { count: String(options.minLength) })
                proceed = false
                if (search === '') {
                    msg = w2utils.lang(options.msgSearch as string)
                }
                // if there are items - then clear them
                if ((options.items?.length ?? 0) > 0) {
                    this.update(name, [])
                    this.applyFilter(name, null, search)
                }
            }
            query(overlay.box).find('.w2ui-no-items').html(msg)
            remote.search = search
            options.items = []
            overlay.tmp['remote'] = remote
            if (proceed) {
                this.request(overlay, search, debounce)
                    .then(remoteItems => {
                        overlay.tmp['_skip_filter'] = true
                        this.update(name, remoteItems)
                        delete overlay.tmp['_skip_filter']
                        overlay.tmp['_new_search'] = true
                        this.applyFilter(name, remoteItems, search).then(data => {
                            this.getActiveChain(overlay.name, options.items) // need this to update chain for up/down key navigation
                            overlay.tmp['searchCount'] = data.count
                            overlay.tmp['search'] = data.search
                            if (options.prefilter || search !== '') {
                                // if selected is not in searched items
                                if (data.count === 0 || !this.getActiveChain(overlay.name, options.items).includes(overlay.selected)) {
                                    overlay.selected = null
                                }
                                this.refreshSearch(overlay.name)
                            }
                            this.initControls(overlay)
                            this.refreshIndex(overlay.name, true)

                            resolve(data)
                        })
                    })
                    .catch(error => {
                        console.log('Server Request error', error)
                    })
            }
            return prom
        }
        let edata
        // only trigger search event when data is present and for the top level
        if (items == null) {
            edata = this.trigger('search', { search, overlay, prom, resolve, reject })
            if (edata.isCancelled === true) {
                return prom
            }
        }
        if (items == null) {
            items = overlay.options.items
        }
        if (options.filter === false) {
            resolve({ count: -1, search })
            return prom
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any) => { // any: menu item shape
            if ((options.match as string) == 'regex') {
                try {
                    const re = new RegExp(search, 'i')
                    if (re.test(item.text) || item.text === '...') {
                        item.hidden = false
                    } else {
                        item.hidden = true
                    }
                } catch (e) {}
            } else {
                let prefix = ''
                let suffix = ''
                if (['is', 'begins', 'begins with'].indexOf(options.match ?? '') !== -1) prefix = '^'
                if (['is', 'ends', 'ends with'].indexOf(options.match ?? '') !== -1) suffix = '$'
                try {
                    const re = new RegExp(prefix + search + suffix, 'i')
                    if (re.test(item.text) || item.text === '...') {
                        item.hidden = false
                    } else {
                        item.hidden = true
                    }
                } catch (e) {}
            }
            // do not show selected items
            if (options.hideSelected && selectedIds.includes(item.id)) {
                item.hidden = true
            }
            // search nested items
            if (Array.isArray(item.items) && item.items.length > 0) {
                delete item._noSearchInside
                this.applyFilter(name, item.items, search).then(data => {
                    const subCount = data.count
                    if (subCount > 0) {
                        count += subCount
                        if (item.hidden) item._noSearchInside = true
                        // only expand items if search is not empty
                        if (search) item.expanded = true
                        item.hidden = false
                    }
                })
            }
            if (item.hidden !== true) count++
        })
        resolve({ count, search })
        edata?.finish()
        return prom
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request(overlay: any, search: any, debounce: any): Promise<any> { // any: overlay/search/debounce shapes vary at runtime
        const options = overlay.options
        const remote = overlay.tmp['remote']
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolve: any, reject: any // any: Promise resolve/reject callbacks
        if ((options.items.length === 0 && remote.cached !== 0)
            || (remote.cached == options.cacheMax && search.length > remote.search.length)
            || (search.length >= remote.search.length && search.substr(0, remote.search.length) !== remote.search)
            || (search.length < remote.search.length))
        {
            // Aabort previous request if any
            if (remote.controller) {
                remote.controller.abort()
            }
            remote.loading = true
            clearTimeout(remote.timeout)
            remote.timeout = setTimeout(() => {
                let url = options.url
                const postData = { search, max: options.cacheMax }
                Object.assign(postData, options.postData)
                // trigger event
                const edata = this.trigger('request', {
                    search, overlay, url, postData,
                    httpMethod: options.method ?? 'GET',
                    httpHeaders: {}
                })
                if (edata.isCancelled === true) return
                // if event updated url and postData, use it
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const detail: any = edata.detail // any: edata.detail index signature requires bracket access
                url = new URL(detail['url'] as string, location.href)
                const fetchOptions = w2utils.prepareParams(url, {
                    method: detail['httpMethod'],
                    headers: detail['httpHeaders'],
                    body: detail['postData']
                }, { caller: this, overlay, search })
                // Create new abort controller
                remote.controller = new AbortController()
                fetchOptions['signal'] = remote.controller.signal
                // send request
                fetch(url, fetchOptions)
                    .then(resp => resp.json())
                    .then(data => {
                        remote.controller = null
                        // trigger event
                        const edata = overlay.trigger('load', { search: postData.search, overlay, data })
                        if (edata.isCancelled === true) return
                        // default behavior
                        data = edata.detail.data
                        if (typeof data === 'string') data = JSON.parse(data)
                        // if server just returns array
                        if (Array.isArray(data)) {
                            data = { records: data }
                        }
                        // needed for backward compatibility
                        if (data.records == null && data.items != null) {
                            data.records = data.items
                            delete data.items
                        }
                        // handles Golang marshal of empty arrays to null
                        if (!data.error && data.records == null) {
                            data.records = []
                        }
                        if (!Array.isArray(data.records)) {
                            console.error('ERROR: server did not return proper JSON data structure', '\n',
                                ' - it should return', { records: [{ id: 1, text: 'item' }] }, '\n',
                                ' - or just an array ', [{ id: 1, text: 'item' }], '\n',
                                ' - or if errorr ', { error: true, message: 'error message' })
                            return
                        }
                        // remove all extra items if more then needed for cache
                        if (data.records.length >= options.cacheMax) {
                            data.records.splice(options.cacheMax, data.records.length)
                            remote.hasMore = true
                        } else {
                            remote.hasMore = false
                            remote.hasMore_search = search
                        }
                        // map id and text
                        if (options.recId == null && options.recid != null) options.recId = options.recid // since lower-case recid is used in grid
                        if (options.recId || options.recText) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data.records.forEach((item: any) => { // any: raw server record shape unknown
                                if (typeof options.recId === 'string') item.id = item[options.recId]
                                if (typeof options.recId === 'function') item.id = options.recId(item)
                                if (typeof options.recText === 'string') item.text = item[options.recText]
                                if (typeof options.recText === 'function') item.text = options.recText(item)
                            })
                        }
                        // remember stats
                        remote.loading = false
                        remote.search = search
                        remote.cached = data.records.length == 0 ? -1 : data.records.length
                        remote.lastError = ''
                        remote.emptySet = (search === '' && data.records.length === 0 ? true : false)
                        // event after
                        edata.finish()
                        resolve(w2utils.normMenu(data.records, data))
                    })
                    .catch(error => {
                        const edata = this.trigger('error', { overlay, search, error })
                        if (edata.isCancelled === true) return
                        // default behavior
                        if (error?.name !== 'AbortError') {
                            console.error('ERROR: Server communication failed.', '\n',
                                ' - it should return', { records: [{ id: 1, text: 'item' }] }, '\n',
                                ' - or just an array ', [{ id: 1, text: 'item' }], '\n',
                                ' - or if errorr ', { error: true, message: 'error message' })
                        }
                        // reset stats
                        remote.loading = false
                        remote.search = ''
                        remote.cached = -1
                        remote.emptySet = true
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        remote.lastError = ((edata.detail as any)['error'] || 'Server communication failed') // any: edata.detail index signature
                        options.items = []
                        // event after
                        edata.finish()
                        reject()
                    })
                // event after
                edata.finish()
            }, debounce ? (options.debounce ?? 350) : 0)
        }
        return new Promise((res, rej) => {
            resolve = res
            reject = rej
        })
    }

    /**
     * Builds an array of item ids that sequencial order for navigation with up/down keys. Skips hidden and disabled items
     * and goes into nested structures. It will remember last active chain in 'overlay.tmp.activeChain'
     */
    // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getActiveChain(name: string, items?: any, parents: any[] = [], res: any[] = [], noSave?: boolean): any[] {
        const overlay = Tooltip.active[name.replace(/[\s\.#]/g, '_')]!
        if (overlay.tmp['activeChain'] != null) {
            // any: cast-then-index for dynamic property access; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return overlay.tmp['activeChain'] as any[]
        }
        if (items == null) items = overlay.options.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any, ind: any) => { // any: menu item shape varies
            if (!item.hidden && !item.disabled && !item?.text?.startsWith?.('--')) {
                res.push(parents.concat([ind]).join('-'))
                if (Array.isArray(item.items) && item.items.length > 0 && item.expanded) {
                    parents.push(ind)
                    this.getActiveChain(name, item.items, parents, res, true)
                    parents.pop()
                }
            }
        })
        if (noSave == null) {
            overlay.tmp['activeChain'] = res
        }
        return res
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuDown(overlay: any, event: any, index: any, parents: any) {
        const options = overlay.options
        let items   = options.items
        const icon    = query(event.delegate).find('.w2ui-icon')
        const menu    = query(event.target).closest('.w2ui-menu:not(.w2ui-sub-menu)')
        if (typeof items == 'function') {
            items = items({ overlay, index, parents, event })
        }
        const item = items[index]
        if (item == null || item.disabled) {
            return
        }
        // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uncheck = (items: any, parent?: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.forEach((other: any, ind: any) => { // any: menu item shape varies
                if (other.id == item.id) return
                if (other.group === item.group && other.checked) {
                    menu
                        .find(`.w2ui-menu-item[index="${(parent ? parent + '-' : '') + ind}"] .w2ui-icon`)
                        .removeClass('w2ui-icon-check')
                        .addClass('w2ui-icon-empty')
                    items[ind].checked = false
                }
                if (Array.isArray(other.items)) {
                    uncheck(other.items, ind)
                }
            })
        }
        if ((options.type === 'check' || options.type === 'radio') && item.group !== false
                    && !query(event.target).hasClass('menu-remove')
                    && !query(event.target).hasClass('menu-help')
                    && !query(event.target).closest('.w2ui-menu-item').hasClass('has-sub-menu')) {
            item.checked = options.type == 'radio' ? true : !item.checked
            if (item.checked) {
                if (options.type === 'radio') {
                    query(event.target).closest('.w2ui-menu').find('.w2ui-icon')
                        .removeClass('w2ui-icon-check')
                        .addClass('w2ui-icon-empty')
                }
                if (options.type === 'check' && item.group != null) {
                    uncheck(options.items)
                }
                icon.removeClass('w2ui-icon-empty').addClass('w2ui-icon-check')
            } else if (options.type === 'check') {
                icon.removeClass('w2ui-icon-check').addClass('w2ui-icon-empty')
            }
        }
        // highlight record
        if (!query(event.target).hasClass('menu-remove') && !query(event.target).hasClass('menu-help')) {
            menu.find('.w2ui-menu-item').removeClass('w2ui-selected')
            // click on the item that has submenu will not select the item
            if (!query(event.delegate).hasClass('has-sub-menu')) {
                query(event.delegate).addClass('w2ui-selected')
            }
        }
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuClick(overlay: any, event: any, index: any, parents: any) {
        const options  = overlay.options
        let items    = options.items
        const $item    = query(event.delegate).closest('.w2ui-menu-item')
        let keepOpen = options.hideOn.includes('select') ? false : true
        if (event.shiftKey || event.metaKey || event.ctrlKey) {
            keepOpen = true
        }
        if (typeof items == 'function') {
            items = items({ overlay, index, parents, event })
        }
        const item = items[index]
        if (!item || (item.disabled && !query(event.target).hasClass('menu-remove'))) {
            return
        }
        let edata
        const overlays = [overlay]
        let topOverlay = overlay
        let parentOverlay
        while (topOverlay.options.parentOverlay) {
            topOverlay = topOverlay.options.parentOverlay
            parentOverlay ??= topOverlay // not top overlay, but parent overlay items
            overlays.push(topOverlay)
        }

        if (query(event.target).hasClass('menu-remove')) {
            edata = topOverlay.trigger('remove', {
                originalEvent: event, target: overlay.name, overlay, topOverlay, parentOverlay,
                item, index, el: $item[0], parents
            })
            if (edata.isCancelled === true) {
                return
            }
            // delete from items
            const items = options.items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ind = items.findIndex((it: any) => it.id == item.id) // any: menu item shape varies
            if (ind != -1) {
                const tmp = items.splice(ind, 1)
                // delete from the parent too
                if (overlay.options.parents) {
                    const pind = overlay.options.parents[overlay.options.parents.length -1]
                    const pitems = parentOverlay.options.items[pind].items
                    if (pitems[ind].id == tmp[0].id) {
                        pitems.splice(ind, 1)
                    }
                }
            }
            keepOpen = !options.hideOn.includes('item-remove')
            const name = $item.closest('.w2ui-overlay').attr('name')
            overlay.self.update(name, items)

        } else if ($item.hasClass('has-sub-menu')) {

            edata = topOverlay.trigger('subMenu', {
                originalEvent: event, target: overlay.name, overlay, topOverlay, parentOverlay,
                item, index, el: $item[0], parents
            })
            if (edata.isCancelled === true) {
                return
            }
            keepOpen = true

        } else {

            // find items that are selected
            const selected = this.findChecked(options.items)
            const a_index = $item.attr('index') as string
            overlay.selected = isNaN(Number(a_index)) ? a_index : parseInt(a_index)
            edata = topOverlay.trigger('select', {
                originalEvent: event, target: overlay.name, overlay, topOverlay, parentOverlay,
                item, index, selected, keepOpen, el: $item[0], parents
            })
            if (edata.isCancelled === true) {
                return
            }
            if (item.keepOpen != null) {
                keepOpen = item.keepOpen
            }
            if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
                overlay.anchor.dataset.selected = item.id
                overlay.anchor.dataset.selectedIndex = overlay.selected
            }
        }
        if (!keepOpen) {
            overlays.forEach(overlay => this.hide(overlay.name))
        }
        // if (['INPUT', 'TEXTAREA'].includes(overlay.anchor.tagName)) {
        //     overlay.anchor.focus()
        // }
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findChecked(items: any): any[] { // any: menu item shape varies
        // any: array of heterogeneous runtime values; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let found: any[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any) => { // any: menu item shape varies
            if (item.checked) found.push(item)
            if (Array.isArray(item.items)) {
                found = found.concat(this.findChecked(item.items))
            }
        })
        return found
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyUp(overlay: any, event: any) {
        const options = overlay.options
        const search = event.target.value
        let filter = true
        let refreshIndex = false
        switch (event.keyCode) {
            case 46:  // delete
            case 8: { // backspace
                // if search empty and delete is clicked, do not filter nor show overlay
                if (search === '' && !overlay.displayed) filter = false
                break
            }
            case 13: { // enter
                if (!overlay.displayed || !overlay.selected) return
                const { index, parents } = this.getCurrent(overlay.name)
                event.delegate = query(overlay.box).find('.w2ui-selected').get(0)
                // reset active chain for folders
                this.menuClick(overlay, event, parseInt(String(index)), parents)
                filter = false
                break
            }
            case 27: { // escape
                filter = false
                if (overlay.displayed) {
                    this.hide(overlay.name)
                } else {
                    // clear selected
                    const el = overlay.anchor
                    if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
                        el.value = ''
                        delete el.dataset.selected
                        delete el.dataset.selectedIndex
                    }
                }
                break
            }
            case 37: { // left
                if (!overlay.displayed) return
                let { item, index, parents } = this.getCurrent(overlay.name)
                // collapse parent if any
                if (parents) {
                    item    = options.items[parseInt(parents)]
                    index   = parseInt(parents)
                    parents = ''
                    refreshIndex = true
                }
                if (Array.isArray(item?.items) && item.items.length > 0 && item.expanded) {
                    event.delegate = query(overlay.box).find(`.w2ui-menu-item[index="${index}"]`).get(0)
                    overlay.selected = index
                    this.menuClick(overlay, event, parseInt(String(index)), parents)
                }
                filter = false
                break
            }
            case 39: { // right
                if (!overlay.displayed) return
                const { item, index, parents } = this.getCurrent(overlay.name)
                if (Array.isArray(item?.items) && item.items.length > 0 && !item.expanded) {
                    event.delegate = query(overlay.box).find('.w2ui-selected').get(0)
                    this.menuClick(overlay, event, parseInt(String(index)), parents)
                }
                filter = false
                break
            }
            case 38: { // up
                if (!overlay.displayed) {
                    break
                }
                overlay.prev()
                filter = false
                event.preventDefault()
                break
            }
            case 40: { // down
                if (!overlay.displayed) {
                    break
                }
                overlay.next()
                filter = false
                event.preventDefault()
                break
            }
        }
        // filter
        if (filter && overlay.displayed
                && ((options.filter && event._searchType == 'filter') || (options.search && event._searchType == 'search'))) {
            this.applyFilter(overlay.name, null, search, true)
                .then(data => {
                    overlay.tmp.searchCount = data.count
                    overlay.tmp.search = data.search
                    // if selected is not in searched items
                    if (data.count === 0 || !this.getActiveChain(overlay.name).includes(overlay.selected)) {
                        overlay.selected = null
                    }
                    this.refreshSearch(overlay.name)
                })
        }
        if (refreshIndex) {
            this.refreshIndex(overlay.name)
        }
    }
}

class DateTooltip extends Tooltip {
    daysCount: number[]
    today: string

    constructor() {
        super()
        const td = new Date()
        this.daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        this.today = td.getFullYear() + '/' + (Number(td.getMonth()) + 1) + '/' + td.getDate()
        this.defaults = w2utils.extend({}, this.defaults, {
            position      : 'top|bottom',
            class         : 'w2ui-calendar',
            type          : 'date', // can be date/time/datetime
            value         : '', // initial date (in w2utils.settings format)
            format        : '',
            start         : null,
            end           : null,
            btnNow        : false,
            blockDates    : [], // array of blocked dates
            blockWeekdays : [], // blocked weekdays 0 - sunday, 1 - monday, etc
            colored       : {}, // ex: { '3/13/2022': 'bg-color|text-color' }
            arrowSize     : 12,
            autoResize    : false,
            anchorClass   : 'w2ui-focus',
            autoShowOn    : 'focus',
            hideOn        : ['doc-click', 'focus-change'],
            onSelect      : null
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override attach(anchor: any, text?: any): AttachReturn | undefined { // any: polymorphic attach signature
        let options
        if (arguments.length == 1 && anchor instanceof Object) {
            options = anchor
            anchor = options.anchor
        } else if (arguments.length === 2 && text != null && typeof text === 'object') {
            options = text
            options.anchor = anchor
        }
        const prevHideOn = options.hideOn
        options = w2utils.extend({}, this.defaults, options || {})
        if (prevHideOn) {
            options.hideOn = prevHideOn
        }
        if (!options.format) {
            const df = w2utils.settings.dateFormat
            const tf = w2utils.settings.timeFormat
            if (options.type == 'date') {
                options.format = df
            } else if (options.type == 'time') {
                options.format = tf
            } else {
                options.format = df + '|' + tf
            }
        }
        const cal = options.type == 'time' ? this.getHourHTML(options) : this.getMonthHTML(options, undefined, undefined)
        options.style += '; padding: 0;'
        options.html = cal.html
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ret = super.attach(options) as any as AttachReturn // any: super.attach returns AttachReturn|undefined but we know it's defined here
        const overlay = ret.overlay
        Object.assign(overlay.tmp, cal)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('show.attach', (event: any) => { // any: event detail shape varies
            const overlay = event.detail.overlay
            const anchor  = overlay.anchor
            const options = overlay.options
            if (['INPUT', 'TEXTAREA'].includes(anchor.tagName) && !options.value && anchor.value) {
                overlay.tmp.initValue = anchor.value
            }
            delete overlay.newValue
            delete overlay.newDate
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('show:after.attach', (_event: any) => { // any: event detail shape varies
            if (ret.overlay?.box) {
                this.initControls(ret.overlay)
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('update:after.attach', (_event: any) => { // any: event detail shape varies
            if (ret.overlay?.box) {
                this.initControls(ret.overlay)
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overlay.on('hide.attach', (event: any) => { // any: event detail shape varies
            const overlay = event.detail.overlay
            const anchor  = overlay.anchor
            if (overlay.newValue != null) {
                if (overlay.newDate) {
                    overlay.newValue = overlay.newDate + ' ' + overlay.newValue
                }
                if (['INPUT', 'TEXTAREA'].includes(anchor.tagName) && anchor.value != overlay.newValue) {
                    anchor.value = overlay.newValue
                }
                const edata = this.trigger('select', { date: overlay.newValue, target: overlay.name, overlay })
                if (edata.isCancelled === true) return
                // event after
                edata.finish()
            }
        })
        ret.select = (callback: (event: unknown) => void) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overlay.on('select.attach', (event: any) => { callback(event) }) // any: event detail shape varies
            return ret
        }
        return ret
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override initControls(overlay: any) { // any: overlay shape varies at runtime
        const options = overlay.options
        const moveMonth = (inc: number) => {
            let { month, year } = overlay.tmp
            month += inc
            if (month > 12) {
                month = 1
                year++
            }
            if (month < 1 ) {
                month = 12
                year--
            }
            const cal = this.getMonthHTML(options, month, year)
            Object.assign(overlay.tmp, cal)
            query(overlay.box).find('.w2ui-overlay-body').html(cal.html)
            this.initControls(overlay)
        }
        // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkJump = (event: any, dblclick?: boolean) => {
            query(event.target).parent().find('.w2ui-jump-month, .w2ui-jump-year')
                .removeClass('w2ui-selected')
            query(event.target).addClass('w2ui-selected')
            const dt = new Date()
            let { jumpMonth, jumpYear } = overlay.tmp
            if (dblclick) {
                if (jumpYear == null) jumpYear = dt.getFullYear()
                if (jumpMonth == null) jumpMonth = dt.getMonth() + 1
            }
            if (jumpMonth && jumpYear) {
                const cal = this.getMonthHTML(options, jumpMonth, jumpYear)
                Object.assign(overlay.tmp, cal)
                query(overlay.box).find('.w2ui-overlay-body').html(cal.html)
                overlay.tmp.jump = false
                this.initControls(overlay)
            }
        }

        // events for next/prev buttons and title
        query(overlay.box)
            .find('.w2ui-cal-title')
            .off('.calendar')
            // click on title
            .on('click.calendar', event => {
                if (options.draggable && overlay.tmp?.moved) {
                    event.stopPropagation()
                    return
                }
                Object.assign(overlay.tmp, { jumpYear: null, jumpMonth: null })
                if (overlay.tmp.jump) {
                    const { month, year } = overlay.tmp
                    const cal = this.getMonthHTML(options, month, year)
                    query(overlay.box).find('.w2ui-overlay-body').html(cal.html)
                    overlay.tmp.jump = false
                } else {
                    query(overlay.box).find('.w2ui-overlay-body .w2ui-cal-days')
                        .replace(this.getYearHTML())
                    const el = query(overlay.box).find(`[name="${overlay.tmp.year}"]`).get(0) as HTMLElement
                    if (el) el.scrollIntoView(true)
                    overlay.tmp.jump = true
                }
                this.initControls(overlay)
                event.stopPropagation()
            })
            // prev button
            .find('.w2ui-cal-previous')
            .off('.calendar')
            .on('click.calendar', event => {
                moveMonth(-1)
                event.stopPropagation()
            })
            .parent()
            // next button
            .find('.w2ui-cal-next')
            .off('.calendar')
            .on('click.calendar', event => {
                moveMonth(1)
                event.stopPropagation()
            })
        // now button
        query(overlay.box).find('.w2ui-cal-now')
            .off('.calendar')
            .on('click.calendar', _event => {
                if (options.type == 'datetime') {
                    if (overlay.newDate) {
                        overlay.newValue = w2utils.formatTime(new Date(), options.format.split('|')[1])
                    } else {
                        overlay.newValue = w2utils.formatDateTime(new Date(), options.format)
                    }
                } else if (options.type == 'date') {
                    overlay.newValue = w2utils.formatDate(new Date(), options.format)
                } else if (options.type == 'time') {
                    overlay.newValue = w2utils.formatTime(new Date(), options.format)
                }
                this.hide(overlay.name)
            })
        // events for dates
        query(overlay.box)
            .off('.calendar')
            .on('contextmenu.calendar', event => {
                event.preventDefault() // prevent browser context menu
            })
            .on('click.calendar', { delegate: '.w2ui-day.w2ui-date' }, event => {
                if (options.type == 'datetime') {
                    overlay.newDate = query(event.target).attr('date')
                    query(overlay.box).find('.w2ui-overlay-body').html(this.getHourHTML(overlay.options).html)
                    this.initControls(overlay)
                } else {
                    overlay.newValue = query(event.target).attr('date')
                    this.hide(overlay.name)
                }
            })
            // click on month
            .on('click.calendar', { delegate: '.w2ui-jump-month' }, event => {
                overlay.tmp.jumpMonth = parseInt(query(event.target).attr('name') ?? '0')
                checkJump(event)
            })
            // double click on month
            .on('dblclick.calendar', { delegate: '.w2ui-jump-month' }, event => {
                overlay.tmp.jumpMonth = parseInt(query(event.target).attr('name') ?? '0')
                checkJump(event, true)
            })
            // click on year
            .on('click.calendar', { delegate: '.w2ui-jump-year' }, event => {
                overlay.tmp.jumpYear = parseInt(query(event.target).attr('name') ?? '0')
                checkJump(event)
            })
            // dbl click on year
            .on('dblclick.calendar', { delegate: '.w2ui-jump-year' }, event => {
                overlay.tmp.jumpYear = parseInt(query(event.target).attr('name') ?? '0')
                checkJump(event, true)
            })
            // click on hour
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.calendar', { delegate: '.w2ui-time.hour' }, (event: any) => {
                const hour = Number(query(event.target).attr('hour'))
                let min  = (this.str2min(options.value as string) ?? 0) % 60
                if (overlay.tmp.initValue && !options.value) {
                    min = (this.str2min(overlay.tmp.initValue as string) ?? 0) % 60
                }
                if (options.noMinutes) {
                    overlay.newValue = this.min2str(hour * 60, options.format)
                    this.hide(overlay.name)
                } else {
                    overlay.newValue = hour + ':' + min
                    const html = this.getMinHTML(hour, options).html
                    query(overlay.box).find('.w2ui-overlay-body').html(html)
                    this.initControls(overlay)
                }
            })
            // click on minute
            // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.calendar', { delegate: '.w2ui-time.min' }, (event: any) => {
                const hour = Math.floor((this.str2min(overlay.newValue as string) ?? 0) / 60)
                const time = (hour * 60) + parseInt(query(event.target).attr('min') as string)
                overlay.newValue = this.min2str(time, options.format)
                this.hide(overlay.name)
            })
        // After any innerHTML refresh, re-attach w2ui-eaction handlers (startDrag on title, stop on arrows, etc.)
        w2utils.bindEvents(query(overlay.box).find('.w2ui-eaction'), this as unknown as Record<string, unknown>)
    }

    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMonthHTML(options: any, month?: any, year?: any) {
        const days = w2utils.settings.fulldays.slice() // creates copy of the array
        const sdays = w2utils.settings.shortdays.slice() // creates copy of the array
        if (w2utils.settings.weekStarts !== 'M') {
            days.unshift(days.pop()!)
            sdays.unshift(sdays.pop()!)
        }

        let DT = new Date()
        const dayLengthMil = 1000 * 60 * 60 * 24

        const selected = options.type === 'datetime'
            ? w2utils.isDateTime(options.value, options.format, true)
            : w2utils.isDate(options.value, options.format, true)
        const selected_dsp = w2utils.formatDate(selected)

        // normalize date
        if (month == null || year == null) {
            const selDate = (selected instanceof Date) ? selected : DT
            year  = selDate.getFullYear()
            month = selDate.getMonth() + 1
        }
        if (month > 12) { month -= 12; year++ }
        if (month < 1 || month === 0) { month += 12; year-- }
        if (year/4 == Math.floor(year/4)) { this.daysCount[1] = 29 } else { this.daysCount[1] = 28 }
        options.current = month + '/' + year

        let weekDaysHeaderHTML = ''
        const st = w2utils.settings.weekStarts
        for (let i = 0; i < sdays.length; i++) {
            const isSat = (st == 'M' && i == 5) || (st != 'M' && i == 6) ? true : false
            const isSun = (st == 'M' && i == 6) || (st != 'M' && i == 0) ? true : false
            weekDaysHeaderHTML += `<div class="w2ui-day w2ui-weekday ${isSat ? 'w2ui-sunday' : ''} ${isSun ? 'w2ui-saturday' : ''}">${sdays[i]}</div>`
        }

        const calTitleClass = 'w2ui-cal-title' + (options.draggable ? ' w2ui-eaction w2ui-draggable' : '')
        const calTitleData  = options.draggable ? ' data-mousedown="startDrag|event"' : ''

        let html = `
            <div class="${calTitleClass}"${calTitleData}>
                <div class="w2ui-cal-previous w2ui-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                <div class="w2ui-cal-next w2ui-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                ${w2utils.settings.fullmonths[month-1]}, ${year}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${weekDaysHeaderHTML}
        `

        // start with the required date
        DT = new Date(year, month-1, 1)

        /**
         * Move to noon, instead of midnight. If not, then the date when time saving happens
         * will be duplicated in the calendar
         */
        DT = new Date(DT.getTime() + dayLengthMil * 0.5)

        // calendar offset
        let weekDayOffset = DT.getDay()
        if (w2utils.settings.weekStarts == 'M') {
            // offset should be 1 day more, but not negative (Sunday)
            weekDayOffset = weekDayOffset > 0 ? weekDayOffset - 1 : 6
        }

        // apply the offset for the first day in the calendar
        DT = new Date(DT.getTime() - (weekDayOffset * dayLengthMil))

        const DaySat = 6, DaySun = 0
        for (let ci = 0; ci < 42; ci++) {
            const className = []
            const dt = `${DT.getFullYear()}/${DT.getMonth()+1}/${DT.getDate()}`
            if (DT.getDay() === DaySat) className.push('w2ui-saturday')
            if (DT.getDay() === DaySun) className.push('w2ui-sunday')
            if (DT.getMonth() + 1 !== month) className.push('outside')
            if (dt == this.today) className.push('w2ui-today')

            const dspDay = DT.getDate()
            let col    = ''
            let bgcol  = ''
            let tmp_dt, tmp_dt_fmt
            if (options.type === 'datetime') {
                tmp_dt     = w2utils.formatDateTime(dt, options.format)
                tmp_dt_fmt = w2utils.formatDate(dt, w2utils.settings.dateFormat)
            } else {
                tmp_dt     = w2utils.formatDate(dt, options.format)
                tmp_dt_fmt = tmp_dt
            }
            if (options.colored && options.colored[tmp_dt_fmt] !== undefined) { // if there is predefined colors for dates
                const tmp = options.colored[tmp_dt_fmt].split('|')
                bgcol   = 'background-color: ' + tmp[0] + ';'
                col     = 'color: ' + tmp[1] + ';'
            }
            html += `<div class="w2ui-day ${this.inRange(tmp_dt, options, true)
                            ? 'w2ui-date ' + (tmp_dt_fmt == selected_dsp ? 'w2ui-selected' : '')
                            : 'w2ui-blocked'
                        } ${className.join(' ')}"
                       style="${col + bgcol}" date="${tmp_dt_fmt}" data-date="${DT.getTime()}">
                            ${dspDay}
                    </div>`
            DT = new Date(DT.getTime() + dayLengthMil)
        }
        html += '</div>'
        if (options.btnNow) {
            const label = w2utils.lang('Today' + (options.type == 'datetime' ? ' & Now' : ''))
            html += `<div class="w2ui-cal-now">${label}</div>`
        }
        return { html, month, year }
    }

    getYearHTML() {
        let mhtml = ''
        let yhtml = ''
        for (let m = 0; m < w2utils.settings.fullmonths.length; m++) {
            mhtml += `<div class="w2ui-jump-month" name="${m+1}">${w2utils.settings.shortmonths[m]}</div>`
        }
        for (let y = w2utils.settings.dateStartYear; y <= w2utils.settings.dateEndYear; y++) {
            yhtml += `<div class="w2ui-jump-year" name="${y}">${y}</div>`
        }
        return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${mhtml}</div>
            <div id="w2ui-jump-year">${yhtml}</div>
        </div>`
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHourHTML(options: any) { // any: options shape varies at runtime
        options = options ?? {}
        if (!options.format) options.format = w2utils.settings.timeFormat
        const h24 = (options.format.indexOf('h24') > -1)
        const value = options.value ? options.value : (options.anchor ? options.anchor.value : '')

        const tmp = []
        for (let a = 0; a < 24; a++) {
            let time = (a >= 12 && !h24 ? a - 12 : a) + ':00' + (!h24 ? (a < 12 ? ' am' : ' pm') : '')
            if (a == 12 && !h24) time = '12:00 pm'
            if (!tmp[Math.floor(a/8)]) tmp[Math.floor(a/8)] = ''
            let tm1 = this.min2str(this.str2min(time) ?? 0)
            let tm2 = this.min2str((this.str2min(time) ?? 0) + 59)
            if (options.type === 'datetime') {
                const dt = w2utils.isDateTime(value, options.format, true)
                const fm = options.format.split('|')[0].trim()
                tm1    = w2utils.formatDate(dt, fm) + ' ' + tm1
                tm2    = w2utils.formatDate(dt, fm) + ' ' + tm2
            }
            const valid = this.inRange(tm1, options) || this.inRange(tm2, options)
            tmp[Math.floor(a/8)] += `<span hour="${a}"
                class="hour ${valid ? 'w2ui-time ' : 'w2ui-blocked'}">${time}</span>`
        }
        const timeTitleClass = 'w2ui-time-title' + (options.draggable ? ' w2ui-eaction w2ui-draggable' : '')
        const timeTitleData  = options.draggable ? ' data-mousedown="startDrag|event"' : ''
        const html = `<div class="w2ui-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${w2utils.lang('Select Hour')}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${tmp[0]}</div>
                <div class="w2ui-cal-column">${tmp[1]}</div>
                <div class="w2ui-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="w2ui-cal-now">${w2utils.lang('Now')}</div>` : '' }
        </div>`
        return { html }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMinHTML(hour: any, options: any) { // any: hour/options shapes vary at runtime
        if (hour == null) hour = 0
        options = options ?? {}
        if (!options.format) options.format = w2utils.settings.timeFormat
        const h24 = (options.format.indexOf('h24') > -1)
        const value = options.value ? options.value : (options.anchor ? options.anchor.value : '')

        const tmp = []
        for (let a = 0; a < 60; a += 5) {
            const time = (hour > 12 && !h24 ? hour - 12 : hour) + ':' + (a < 10 ? 0 : '') + a + ' ' + (!h24 ? (hour < 12 ? 'am' : 'pm') : '')
            let tm   = time
            const ind  = a < 20 ? 0 : (a < 40 ? 1 : 2)
            if (!tmp[ind]) tmp[ind] = ''
            if (options.type === 'datetime') {
                const dt = w2utils.isDateTime(value, options.format, true)
                const fm = options.format.split('|')[0].trim()
                tm = w2utils.formatDate(dt, fm) + ' ' + tm
            }
            tmp[ind] += `<span min="${a}" class="min ${(this.inRange(tm, options) ? 'w2ui-time ' : 'w2ui-blocked')}">${time}</span>`
        }
        const timeTitleClass = 'w2ui-time-title' + (options.draggable ? ' w2ui-eaction w2ui-draggable' : '')
        const timeTitleData  = options.draggable ? ' data-mousedown="startDrag|event"' : ''
        const html = `<div class="w2ui-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${w2utils.lang('Select Minute')}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${tmp[0]}</div>
                <div class="w2ui-cal-column">${tmp[1]}</div>
                <div class="w2ui-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="w2ui-cal-now">${w2utils.lang('Now')}</div>` : '' }
        </div>`
        return { html }
    }

    // checks if date is in range (loost at start, end, blockDates, blockWeekdays)
    // any: parameter typed any — runtime dispatch by call site; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inRange(str: any, options: any, dateOnly?: boolean) {
        let inRange = false
        if (options.type === 'date') {
            const dt = w2utils.isDate(str, options.format, true)
            if (dt) {
                // enable range
                if (options.start || options.end) {
                    const st      = (typeof options.start === 'string' ? options.start : query(options.start).val())
                    const en      = (typeof options.end === 'string' ? options.end : query(options.end).val())
                    let start   = w2utils.isDate(st, options.format, true)
                    let end     = w2utils.isDate(en, options.format, true)
                    const dtDate = dt instanceof Date ? dt : new Date()
                    const current = new Date(dtDate)
                    if (!start) start = current
                    if (!end) end = current
                    if (current >= start && current <= end) inRange = true
                } else {
                    inRange = true
                }
                // block predefined dates
                if (Array.isArray(options.blockDates) && options.blockDates.includes(str)) inRange = false
                // block weekdays
                if (Array.isArray(options.blockWeekdays) && options.blockWeekdays.includes((dt instanceof Date ? dt : new Date()).getDay())) inRange = false
            }
        } else if (options.type === 'time') {
            if (options.start || options.end) {
                const tm  = this.str2min(str) ?? 0
                let tm1 = this.str2min(options.start) ?? tm
                let tm2 = this.str2min(options.end) ?? tm
                if (!tm1) tm1 = tm
                if (!tm2) tm2 = tm
                if (tm >= tm1 && tm <= tm2) inRange = true
            } else {
                inRange = true
            }
        } else if (options.type === 'datetime') {
            const dt = w2utils.isDateTime(str, options.format, true)
            if (dt) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const format = options.format.split('|').map((format: any) => format.trim()) // any: split result items
                if (dateOnly) {
                    const date = w2utils.formatDate(dt, format[0])
                    const opts = w2utils.extend({}, options, { type: 'date', format: format[0] })
                    if (this.inRange(date, opts)) inRange = true
                } else {
                    const time = w2utils.formatTime(dt, format[1])
                    const opts =  { type: 'time', format: format[1], start: options.startTime, end: options.endTime }
                    if (this.inRange(time, opts)) inRange = true
                }
            }
        }
        return inRange
    }

    // converts time into number of minutes since midnight -- '11:50am' => 710
    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    str2min(str: any): number | null {
        if (typeof str !== 'string') return null
        // any: array of heterogeneous runtime values; w2tooltip overlay options merge from multiple user sources at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tmp: any[] = str.split(':')
        if (tmp.length === 2) {
            tmp[0] = parseInt(tmp[0])
            tmp[1] = parseInt(tmp[1])
            if (str.indexOf('pm') !== -1 && tmp[0] !== 12) tmp[0] += 12
            if (str.includes('am') && tmp[0] == 12) tmp[0] = 0 // 12:00am - is midnight
        } else {
            return null
        }
        return tmp[0] * 60 + tmp[1]
    }

    // converts minutes since midnight into time str -- 710 => '11:50am'
    // any: callback parameter — caller signature varies; w2tooltip overlay options merge from multiple user sources at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    min2str(time: number, format?: any): string {
        let ret = ''
        if (time >= 24 * 60) time = time % (24 * 60)
        if (time < 0) time = 24 * 60 + time
        const hour = Math.floor(time/60)
        const min = ((time % 60) < 10 ? '0' : '') + (time % 60)
        if (!format) { format = w2utils.settings.timeFormat}
        if (format.indexOf('h24') !== -1) {
            ret = hour + ':' + min
        } else {
            ret = (hour <= 12 ? hour : hour - 12) + ':' + min + ' ' + (hour >= 12 ? 'pm' : 'am')
        }
        return ret
    }
}

const w2tooltip = new Tooltip()
const w2menu    = new MenuTooltip()
const w2color   = new ColorTooltip()
const w2date    = new DateTooltip()

export { w2tooltip, w2color, w2menu, w2date, Tooltip }
