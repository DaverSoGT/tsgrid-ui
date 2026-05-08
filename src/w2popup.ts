/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - popup.open - returns promise like object
 *  - popup.confirm - refactored
 *  - popup.message - refactored
 *  - removed popup.options.mutliple
 *  - refactores w2alert, w2confirm, w2prompt
 *  - add w2popup.open().on('')
 *  - removed w2popup.restoreTemplate
 *  - deprecated onMsgOpen and onMsgClose
 *  - deprecated options.bgColor
 *  - rename focus -> setFocus
 *  - added center() // will auto center on window resize
 *  - close(immediate), also refactored if popup is closed when opening
 *  - options.resizable
 *  - actions in popup can be just html (for example separator)
 *  - resize - returns promise
 */

import { w2base } from './w2base.js'
import { w2utils } from './w2utils.js'
import { query as _queryRaw, Query } from './query.js'
// any: query() returns Query|void but is always used in chain; cast once here
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

interface DialogOptions {
    title?: string
    text?: string
    body?: string
    buttons?: string
    width?: number
    height?: number
    focus?: number | string | null
    actions?: Record<string, unknown> | null
    style?: string
    speed?: number
    blockPage?: boolean
    modal?: boolean
    maximized?: boolean
    keyboard?: boolean
    showClose?: boolean
    showMax?: boolean
    resizable?: boolean
    transition?: unknown
    openMaximized?: boolean
    moved?: boolean
    prevSize?: string | null
    cancelAction?: string
    closingTimer?: ReturnType<typeof setTimeout>
    _last_focus?: HTMLElement | null
    [key: string]: unknown
}

class Dialog extends w2base {
    defaults: DialogOptions
    options!: DialogOptions // definite assignment: set in open() before any property access
    declare name: string
    status: string
    tmp: Record<string, unknown>
    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleResize: (event?: any) => void
    _promCreated!: (value?: unknown) => void
    _promOpened!: (value?: unknown) => void
    _promClosing!: (value?: unknown) => void
    _promClosed!: (value?: unknown) => void
    _timer?: ReturnType<typeof setTimeout>

    constructor() {
        super()
        this.defaults   = {
            title: '',
            text: '',           // just a text (will be centered)
            body: '',
            buttons: '',
            width: 450,
            height: 250,
            focus: null,        // brings focus to the element, can be a number or selector
            actions: null,      // actions object
            style: '',          // style of the message div
            speed: 0.3,
            blockPage: true,
            modal: false,
            maximized: false,   // this is a flag to show the state - to open the popup maximized use openMaximized instead
            keyboard: true,     // will close popup on esc if not modal
            showClose: true,
            showMax: false,
            resizable: false,
            transition: null,
            openMaximized: false,
            moved: false
        }
        this.name       = 'popup'
        this.status     = 'closed' // string that describes current status
        this['onOpen']     = null
        this['onClose']    = null
        this['onMax']      = null
        this['onMin']      = null
        this['onToggle']   = null
        this['onKeydown']  = null
        this['onAction']   = null
        this['onMove']     = null
        this.tmp        = {}
        // event handler for resize
        this.handleResize = (_event) => {
            // if it was moved by the user, do not auto resize
            if (!this.options.moved) {
                this.center(undefined, undefined, true)
            }
        }
    }

    /**
     * Sample calls
     * - w2popup.open('ddd').ok(() => { w2popup.close() })
     * - w2popup.open('ddd', { height: 120 }).ok(() => { w2popup.close() })
     * - w2popup.open({ body: 'text', title: 'caption', actions: ["Close"] }).close(() => { w2popup.close() })
     * - w2popup.open({ body: 'text', title: 'caption', actions: { Close() { w2popup.close() }} })
     */
    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    open(options?: any, extraOptions?: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        if (this.status == 'closing' || query('#w2ui-popup').hasClass('animating')) {
            // if called when previous is closing
            this.close(true)
        }
        // get old options and merge them
        const old_options = this.options
        if (['string', 'number'].includes(typeof options)) {
            options = w2utils.extend({
                title: 'Notification',
                body: `<div class="w2ui-centered">${options}</div>`,
                actions: { Ok() { self.close() }},
                cancelAction: 'ok'
            }, extraOptions ?? {})
        }
        if (options.text != null) options.body = `<div class="w2ui-centered w2ui-msg-text">${options.text}</div>`
        options = Object.assign({}, this.defaults, old_options, { title: '', body : '' }, options, { maximized: false })
        this.options = options
        // if new - reset event handlers
        if (query('#w2ui-popup').length === 0) {
            this.off('*')
            Object.keys(this).forEach(key => {
                if (key.startsWith('on') && key != 'on') this[key] = null
            })
        }
        // reassign events
        Object.keys(options).forEach(key => {
            if (key.startsWith('on') && key != 'on' && options[key]) {
                this[key] = options[key]
            }
        })
        options.width  = parseInt(options.width)
        options.height = parseInt(options.height)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any, msg: any // any: w2event + dynamic message state
        const { top, left, width, height } = this.center()
        // make sure popup is not bigger then available screen
        if (options.width > width) options.width = width
        if (options.height > height) options.height = height

        const prom: Record<string, unknown> & {
            self: Dialog
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            action(callBack: any): typeof prom // any: callback event shape is dynamic
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            close(callBack: any): typeof prom // any: callback event shape is dynamic
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            then(callBack: any): typeof prom // any: callback event shape is dynamic
        } = {
            self: this,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            action(callBack: any) { // any: action callback event shape is dynamic
                self.on('action.prom', callBack)
                return prom
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            close(callBack: any) { // any: close callback event shape is dynamic
                self.on('close.prom', callBack)
                return prom
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            then(callBack: any) { // any: then callback event shape is dynamic
                self.on('open:after.prom', callBack)
                return prom
            }
        }
        // convert action arrays into buttons
        if (options.actions != null && !options.buttons) {
            options.buttons = ''
            Object.keys(options.actions).forEach((action) => {
                const handler = options.actions[action]
                let btnAction = action
                if (typeof handler == 'function') {
                    options.buttons += `<button class="w2ui-btn w2ui-eaction" name="${action}" data-click='["action","${action}","event"]'>${action}</button>`
                }
                if (typeof handler == 'object') {
                    options.buttons += `<button class="w2ui-btn w2ui-eaction ${handler.class || ''}" name="${action}" data-click='["action","${action}","event"]'
                        style="${handler.style}" ${handler.attrs}>${handler.text || action}</button>`
                    btnAction = Array.isArray(options.actions) ? handler.text : action
                }
                if (typeof handler == 'string') {
                    if (handler.trim().startsWith('<')) {
                        btnAction = 'none'
                        options.buttons += handler

                    } else {
                        btnAction = (handler[0] ?? '').toLowerCase() + handler.substr(1).replace(/\s+/g, '')
                        options.buttons += `<button class="w2ui-btn w2ui-eaction" name="${action}" data-click='["action","${btnAction}","event"]'>${handler}</button>`
                    }
                }
                if (typeof btnAction == 'string') {
                    btnAction = (btnAction[0] ?? '').toLowerCase() + btnAction.substr(1).replace(/\s+/g, '')
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                prom[btnAction] = function (callBack: any) { // any: button action callback event shape is dynamic
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    self.on('action.buttons', (event: any) => { // any: action event has dynamic detail
                        const target = (event.detail.action[0] ?? '').toLowerCase() + event.detail.action.substr(1).replace(/\s+/g, '')
                        if (target == btnAction) callBack(event)
                    })
                    return prom
                }
            })
        }
        // check if message is already displayed
        let titleBtns = ''
        if (options.showClose) {
            titleBtns += `<div class="w2ui-popup-button w2ui-popup-close">
                        <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                    </div>`
        }
        if (options.showMax) {
            titleBtns += `<div class="w2ui-popup-button w2ui-popup-max">
                        <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                    </div>`
        }

        if (query('#w2ui-popup').length === 0) {
            // trigger event
            edata = this.trigger('open', { target: 'popup', present: false })
            if (edata.isCancelled === true) return
            this.status = 'opening'
            // output message
            if (options.blockPage) {
                w2utils.lock(document.body, {
                    opacity: 0.3,
                    ...(options.modal ? {} : { onClick: () => { this.close() } })
                })
            }
            // first insert just body
            let styles = `
                left: ${left}px;
                top: ${top}px;
                width: ${parseInt(options.width)}px;
                height: ${parseInt(options.height)}px;
                transition: ${options.speed}s
            `
            msg = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating ${!options.blockPage ? 'w2ui-non-blocking' : ''}" style="${w2utils.stripSpaces(styles)}"></div>`
            query('body').append(msg)
            // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(query('#w2ui-popup')[0] as any)._w2popup = {
                self: this,
                created: new Promise((resolve) => { this._promCreated = resolve }),
                opened: new Promise((resolve) => { this._promOpened = resolve }),
                closing: new Promise((resolve) => { this._promClosing = resolve }),
                closed: new Promise((resolve) => { this._promClosed = resolve }),
            }
            // then content
            styles = `${!options.title ? 'top: 0px !important;' : ''} ${!options.buttons ? 'bottom: 0px !important;' : ''}`
            msg = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="w2ui-popup-title-btns">${titleBtns}</div>
                <div class="w2ui-popup-title" style="${!options.title ? 'display: none' : ''}"></div>
                <div class="w2ui-box" style="${styles}">
                    <div class="w2ui-popup-body ${!options.title || ' w2ui-popup-no-title'}
                        ${!options.buttons || ' w2ui-popup-no-buttons'}" style="${options.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${!options.buttons ? 'display: none' : ''}"></div>
                <div class="w2ui-popup-resizer resize-point resize-icon"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `
            query('#w2ui-popup').html(msg)

            if (options.title) query('#w2ui-popup .w2ui-popup-title').append(w2utils.lang(options.title))
            if (options.buttons) query('#w2ui-popup .w2ui-popup-buttons').append(options.buttons)
            if (options.body) query('#w2ui-popup .w2ui-popup-body').append(options.body)

            // allow element to render
            setTimeout(() => {
                ;(query('#w2ui-popup')
                    .css('transition', options.speed + 's') as unknown as Query)
                    .removeClass('w2ui-anim-open')
                w2utils.bindEvents('#w2ui-popup .w2ui-eaction', this)
                query('#w2ui-popup').find('.w2ui-popup-body').show()
                this._promCreated()
            }, 1)
            // clean transform
            clearTimeout(this._timer)
            this._timer = setTimeout(() => {
                this.status = 'open'
                self.setFocus(options.focus)
                // event after
                edata.finish()
                this._promOpened()
                query('#w2ui-popup').removeClass('animating')
            }, options.speed * 1000)

        } else {
            // trigger event
            edata = this.trigger('open', { target: 'popup', present: true })
            if (edata.isCancelled === true) return
            // check if size changed
            this.status = 'opening'
            if (old_options != null) {
                if (!old_options.maximized && (old_options.width != options.width || old_options.height != options.height)) {
                    this.resize(options.width, options.height)
                }
                options.prevSize  = options.width + 'px:' + options.height + 'px'
                options.maximized = old_options.maximized
            }
            // show new items
            const cloned = (query('#w2ui-popup .w2ui-box').get(0) as Node).cloneNode(true)
            query(cloned as HTMLElement).removeClass('w2ui-box').addClass('w2ui-box-temp').find('.w2ui-popup-body').empty().append(options.body as string)
            query('#w2ui-popup .w2ui-box').after(cloned)

            if (options.buttons) {
                ;(query('#w2ui-popup .w2ui-popup-buttons').show().html('') as unknown as Query).append(options.buttons as string)
                query('#w2ui-popup .w2ui-popup-body').removeClass('w2ui-popup-no-buttons')
                query('#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp').css('bottom', '')
            } else {
                query('#w2ui-popup .w2ui-popup-buttons').hide().html('')
                query('#w2ui-popup .w2ui-popup-body').addClass('w2ui-popup-no-buttons')
                query('#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp').css('bottom', '0px')
            }
            if (options.title) {
                query('#w2ui-popup .w2ui-popup-title')
                    .show()
                    .html(w2utils.lang(options.title))
                query('#w2ui-popup .w2ui-popup-body').removeClass('w2ui-popup-no-title')
                query('#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp').css('top', '')
            } else {
                query('#w2ui-popup .w2ui-popup-title').hide().html('')
                query('#w2ui-popup .w2ui-popup-body').addClass('w2ui-popup-no-title')
                query('#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp').css('top', '0px')
            }
            if (titleBtns) {
                query('#w2ui-popup .w2ui-popup-title-btns')
                    .show()
                    .html(titleBtns)
            } else {
                query('#w2ui-popup .w2ui-popup-title-btns')
                    .hide()
            }
            // transition
            const div_old = query('#w2ui-popup .w2ui-box')[0] as HTMLElement
            const div_new = query('#w2ui-popup .w2ui-box-temp')[0] as HTMLElement
            query('#w2ui-popup').addClass('animating')
            w2utils.transition(div_old, div_new, options.transition as string, () => {
                // clean up
                query(div_old).remove()
                query(div_new).removeClass('w2ui-box-temp').addClass('w2ui-box')
                const $body = query(div_new).find('.w2ui-popup-body')
                if ($body.length == 1) {
                    ($body[0] as HTMLElement).style.cssText = options.style as string
                    $body.show()
                }
                // focus on first button
                self.setFocus(options.focus)
                query('#w2ui-popup').removeClass('animating')
            })
            // call event onOpen
            this.status = 'open'
            edata.finish()
            w2utils.bindEvents('#w2ui-popup .w2ui-eaction', this)
            query('#w2ui-popup').find('.w2ui-popup-body').show()
        }

        if (options.openMaximized) {
            this.max()
        }
        // save new options
        options._last_focus = document.activeElement
        // keyboard events
        if (options.keyboard) {
            query(document.body)
                .off('.w2popup')
                .on('keydown.w2popup', (event) => {
                    this.keydown(event)
                })
        }
        query(window).on('resize', this.handleResize)
        // initialize move; any: drag-state bag mutated dynamically in mvStart/mvMove/mvStop
        // any: parameter typed any — runtime dispatch by call site; w2popup options accept untyped user payloads at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tmp: any = {
            changing : false,
            mvMove   : mvMove,
            mvStop   : mvStop
        }
        query('#w2ui-popup .w2ui-popup-title')
            .off('mousedown')
            .on('mousedown', function(event) {
                if (!self.options.maximized) mvStart(event)
            })

        if (options.resizable) {
            query('#w2ui-popup .w2ui-popup-resizer').show()
            query('#w2ui-popup .w2ui-popup-resizer')
                .off('mousedown')
                .on('mousedown', event => {
                    mvStart(event, true)
                })
        } else {
            query('#w2ui-popup .w2ui-popup-resizer').hide()
        }

        return prom

        // handlers
        // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mvStart(evt: any, resizer?: any) {
            if (!evt) evt = window.event
            self.status = resizer ? 'resizing' : 'moving'
            const rect = (query('#w2ui-popup').get(0) as HTMLElement).getBoundingClientRect()
            Object.assign(tmp, {
                changing: true,
                isLocked: query('#w2ui-popup > .w2ui-lock').length == 1 ? true : false,
                x       : evt.screenX,
                y       : evt.screenY,
                pos_x   : rect.x,
                pos_y   : rect.y,
                width   : rect.width,
                height  : rect.height
            })
            if (!tmp.isLocked) self.lock({ opacity: 0 })
            query(document.body)
                .on('mousemove.w2ui-popup', tmp.mvMove)
                .on('mouseup.w2ui-popup', tmp.mvStop)
            if (evt.stopPropagation) evt.stopPropagation(); else evt.cancelBubble = true
            if (evt.preventDefault) evt.preventDefault(); else return false
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mvMove(evt: any): void { // any: MouseEvent or window.event
            if (tmp.changing != true) return
            if (!evt) evt = window.event
            tmp.div_x = evt.screenX - tmp.x
            tmp.div_y = evt.screenY - tmp.y
            // trigger event
            const edata = self.trigger('move', { target: 'popup', div_x: tmp.div_x, div_y: tmp.div_y, originalEvent: evt })
            if (edata.isCancelled === true) return
            // default behavior
            if (self.status == 'moving') {
                query('#w2ui-popup').css({
                    'transition': 'none',
                    'transform' : 'translate3d('+ tmp.div_x +'px, '+ tmp.div_y +'px, 0px)'
                })
                self.options.moved = true
            } else {
                query('#w2ui-popup').css({
                    transition: 'none',
                    width: (tmp.width + tmp.div_x) + 'px',
                    height: (tmp.height + tmp.div_y) + 'px'
                })
            }
            // event after
            edata.finish()
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mvStop(evt: any): void { // any: MouseEvent or window.event
            if (tmp.changing != true) return
            if (!evt) evt = window.event
            tmp.div_x = (evt.screenX - tmp.x)
            tmp.div_y = (evt.screenY - tmp.y)
            if (self.status == 'moving') {
                ;(query('#w2ui-popup')
                    .css({
                        'left': (tmp.pos_x + tmp.div_x) + 'px',
                        'top' : (tmp.pos_y + tmp.div_y) + 'px'
                    }) as unknown as Query)
                    .css({
                        'transition': 'none',
                        'transform' : 'translate3d(0px, 0px, 0px)'
                    })
            } else {
                query('#w2ui-popup').css({
                    transition: 'none',
                    width: (tmp.width + tmp.div_x) + 'px',
                    height: (tmp.height + tmp.div_y) + 'px'
                })
                self.resizeMessages()
            }
            tmp.changing = false
            self.status = 'open'
            query(document.body).off('.w2ui-popup')
            if (!tmp.isLocked) self.unlock()
        }
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(options: any) {
        return new Promise((resolve, reject) => {
            if (typeof options == 'string') {
                options = { url: options }
            }
            if (options.url == null) {
                console.log('ERROR: The url is not defined.')
                reject('The url is not defined')
                return
            }
            this.status = 'loading'
            const [url, selector] = String(options.url).split('#')
            if (url) {
                fetch(url).then(res => res.text()).then(html => {
                    resolve(this.template(html, selector, options))
                })
            }
        })
    }

    // any: parameter typed any — runtime dispatch by call site; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template(data: any, id: any, options: any = {}) {
        let html
        try {
            html = query(data)
        } catch (e) {
            // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            html = (_queryRaw as any).html(data)
        }
        if (id) html = html.filter('#' + id)
        Object.assign(options, {
            width: parseInt(query(html).css('width') as string),
            height: parseInt(query(html).css('height') as string),
            title: query(html).find('[rel=title]').html(),
            body: query(html).find('[rel=body]').html(),
            buttons: query(html).find('[rel=buttons]').html(),
            style: (query(html).find('[rel=body]').get(0) as HTMLElement).style.cssText,
        })
        return this.open(options)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action(action: any, event?: any) {
        // any: parameter typed any — runtime dispatch by call site; w2popup options accept untyped user payloads at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let click: any = this.options.actions?.[action]
        // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (click instanceof Object && (click as any).onClick) click = (click as any).onClick
        // event before
        const edata = this.trigger('action', { action, target: 'popup', self: this,
            // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            originalEvent: event, value: this['input'] ? (this['input'] as any).value : null })
        if (edata.isCancelled === true) return
        // default actions
        if (typeof click === 'function') click.call(this, event)
        // event after
        edata.finish()
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keydown(event: any) {
        if (this.options && !this.options.keyboard) return
        // trigger event
        const edata = this.trigger('keydown', { target: 'popup', originalEvent: event })
        if (edata.isCancelled === true) return
        // default behavior
        switch (event.keyCode) {
            case 27:
                event.preventDefault()
                if (query('#w2ui-popup .w2ui-message').length == 0) {
                    if (this.options.cancelAction) {
                        this.action(this.options.cancelAction)
                    } else {
                        this.close()
                    }
                }
                break
        }
        // event after
        edata.finish()
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    close(immediate?: any) {
        // trigger event
        const edata = this.trigger('close', { target: 'popup' })
        if (edata.isCancelled === true) return
        const cleanUp = () => {
            // return template
            query('#w2ui-popup').remove()
            // restore active
            if (this.options._last_focus) this.options._last_focus.focus()
            this.status = 'closed'
            this.options = {}
            // event after
            edata.finish()
            this._promClosed()
        }
        if (query('#w2ui-popup').length === 0 || this.status == 'closed') { // already closed
            return
        }
        if (this.status == 'opening') { // if it is opening
            immediate = true
        }
        if (this.status == 'closing' && immediate === true) {
            cleanUp()
            clearTimeout(this.tmp['closingTimer'] as ReturnType<typeof setTimeout>)
            w2utils.unlock(document.body, 0)
            return
        }
        // default behavior
        this.status = 'closing'
        ;(query('#w2ui-popup')
            .css('transition', this.options.speed + 's') as unknown as Query)
            .addClass('w2ui-anim-close animating')
        w2utils.unlock(document.body, 300)
        this._promClosing()

        if (immediate) {
            cleanUp()
        } else {
            this.tmp['closingTimer'] = setTimeout(cleanUp, (this.options.speed ?? 0.3) * 1000)
        }
        // remove keyboard events
        if (this.options.keyboard) {
            query(document.body).off('keydown', this.keydown)
        }
        query(window).off('resize', this.handleResize)
    }

    toggle() {
        const edata = this.trigger('toggle', { target: 'popup' })
        if (edata.isCancelled === true) return
        // default action
        if (this.options.maximized === true) this.min(); else this.max()
        // event after
        setTimeout(() => {
            edata.finish()
        }, ((this.options.speed ?? 0.3) * 1000) + 50)
    }

    max() {
        if (this.options.maximized === true) return
        // trigger event
        const edata = this.trigger('max', { target: 'popup' })
        if (edata.isCancelled === true) return
        // default behavior
        this.status = 'resizing'
        const rect = (query('#w2ui-popup').get(0) as HTMLElement).getBoundingClientRect()
        this.options.prevSize = rect.width + ':' + rect.height
        // do resize
        this.resize(10000, 10000, () => {
            this.status = 'open'
            this.options.maximized = true
            edata.finish()
        })
    }

    min() {
        if (this.options.maximized !== true) return
        const size = (this.options.prevSize ?? '').split(':')
        // trigger event
        const edata = this.trigger('min', { target: 'popup' })
        if (edata.isCancelled === true) return
        // default behavior
        this.status = 'resizing'
        // do resize
        this.options.maximized = false
        this.resize(parseInt(size[0] ?? '0'), parseInt(size[1] ?? '0'), () => {
            this.status = 'open'
            this.options.prevSize  = null
            edata.finish()
        })
    }

    clear() {
        query('#w2ui-popup .w2ui-popup-title').html('')
        query('#w2ui-popup .w2ui-popup-body').html('')
        query('#w2ui-popup .w2ui-popup-buttons').html('')
    }

    reset() {
        this.open(this.defaults)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message(options: any) {
        return w2utils.message({
            owner: this,
            box  : query('#w2ui-popup').get(0) as HTMLElement,
            after: '.w2ui-popup-title'
        }, options)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confirm(options: any) {
        return w2utils.confirm({
            owner: this,
            box  : query('#w2ui-popup').get(0) as HTMLElement,
            after: '.w2ui-popup-title'
        }, options)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFocus(focus?: any) {
        const box = query('#w2ui-popup')
        const sel = 'input, button, select, textarea, [contentEditable], [tabindex], .w2ui-input'
        if (focus != null) {
            const el = isNaN(focus)
                ? box.find(sel).filter(focus).filter(':not([name=hidden-first])').get(0) as HTMLElement
                : box.find(sel).filter(':not([name=hidden-first])').get(focus) as HTMLElement
            el?.focus()
        } else {
            const el = box.find('[name=hidden-first]').get(0) as HTMLElement
            if (el) el.focus()
        }
        // keep focus/blur inside popup
        query(box).find(sel)
            .off('.keep-focus')
            // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('blur.keep-focus', function (_event: any) {
                setTimeout(() => {
                    const focus = document.activeElement
                    // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const inside = query(box).find(sel).filter(focus as any).length > 0
                    // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const name = query(focus as any).attr('name')
                    if (!inside && focus && focus !== document.body) {
                        (query(box).find(sel).get(0) as HTMLElement)?.focus()
                    }
                    if (name == 'hidden-last') {
                        (query(box).find(sel).get(1) as HTMLElement)?.focus()
                    }
                    if (name == 'hidden-first') {
                        (query(box).find(sel).get(-2) as HTMLElement)?.focus()
                    }
                }, 1)
            })
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lock(msg?: any, showSpinner?: any) {
        w2utils.lock(query('#w2ui-popup'), msg, showSpinner)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unlock(speed?: any) {
        w2utils.unlock(query('#w2ui-popup'), speed)
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    center(width?: any, height?: any, force?: any) {
        let maxW, maxH
        if (window.innerHeight == undefined) {
            maxW = Math.floor(document.documentElement.offsetWidth)
            maxH = Math.floor(document.documentElement.offsetHeight)
        } else {
            maxW = Math.floor(window.innerWidth)
            maxH = Math.floor(window.innerHeight)
        }
        width = parseInt(width ?? this.options.width)
        height = parseInt(height ?? this.options.height)
        if (this.options.maximized === true) {
            width = maxW
            height = maxH
        }
        if (maxW - 10 < width) width = maxW - 10
        if (maxH - 10 < height) height = maxH - 10
        const top  = (maxH - height) / 3 // it is my oppinion that it is more estatic to show closer to top then in exact middle
        const left = (maxW - width) / 2
        if (force) {
            query('#w2ui-popup').css({
                'transition': 'none',
                'top'   : top + 'px',
                'left'  : left + 'px',
                'width' : width + 'px',
                'height': height + 'px'
            })
            this.resizeMessages() // then messages resize nicely
        }
        return { top, left, width, height }
    }

    // any: callback parameter — caller signature varies; w2popup options accept untyped user payloads at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resize(newWidth: any, newHeight: any, callBack?: any) {
        return new Promise(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this
            if (this.options.speed == null) this.options.speed = 0
            // calculate new position
            const { top, left, width, height } = this.center(newWidth, newHeight)
            const speed = this.options.speed
            query('#w2ui-popup').css({
                'transition': `${speed}s width, ${speed}s height, ${speed}s left, ${speed}s top`,
                'top'   : top + 'px',
                'left'  : left + 'px',
                'width' : width + 'px',
                'height': height + 'px'
            })
            const tmp_int = setInterval(() => { self.resizeMessages() }, 10) // then messages resize nicely
            setTimeout(() => {
                clearInterval(tmp_int)
                self.resizeMessages()
                if (typeof callBack == 'function') callBack()
                resolve(undefined)
            }, (this.options.speed * 1000) + 50) // give extra 50 ms
        })
    }

    // internal function
    resizeMessages() {
        // see if there are messages and resize them
        query('#w2ui-popup .w2ui-message').each((node: Node) => {
            const msg = node as HTMLElement
            // any: cast-to-any for dynamic dispatch; w2popup options accept untyped user payloads at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mopt = (msg as any)._msg_options
            const popup = query('#w2ui-popup')
            if (parseInt(mopt.width) < 10) mopt.width = 10
            if (parseInt(mopt.height) < 10) mopt.height = 10
            const rect = (popup[0] as HTMLElement).getBoundingClientRect()
            const titleHeight = (popup.find('.w2ui-popup-title')[0] as HTMLElement).clientHeight
            const pWidth      = Math.floor(rect.width)
            const pHeight     = Math.floor(rect.height)
            // re-calc width
            mopt.width = mopt.originalWidth
            if (mopt.width > pWidth - 10) {
                mopt.width = pWidth - 10
            }
            // re-calc height
            mopt.height = mopt.originalHeight
            if (mopt.height > pHeight - titleHeight - 5) {
                mopt.height = pHeight - titleHeight - 5
            }
            if (mopt.originalHeight < 0) mopt.height = pHeight + mopt.originalHeight - titleHeight
            if (mopt.originalWidth < 0) mopt.width = pWidth + mopt.originalWidth * 2 // x 2 because there is left and right margin
            query(msg).css({
                left    : ((pWidth - mopt.width) / 2) + 'px',
                width   : mopt.width + 'px',
                height  : mopt.height + 'px'
            })
        })
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function w2alert(msg: any, title?: any, callBack?: any): any { // any: msg/title/callBack are heterogeneous convenience params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prom: any // any: return from open() or message() differs; unified at call site
    const options = {
        title: w2utils.lang(title ?? 'Notification'),
        body: `<div class="w2ui-centered w2ui-msg-text">${msg}</div>`,
        showClose: false,
        actions: { ok: w2utils.lang('Ok') },
        cancelAction: 'ok'
    }
    if (query('#w2ui-popup').length > 0 && w2popup.status != 'closing') {
        prom = w2popup.message(options)
    } else {
        prom = w2popup.open(options)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prom['ok']((event: any) => { // any: ok callback event is dynamic
        if (typeof event.detail.self?.close == 'function') {
            event.detail.self.close()
        }
        if (typeof callBack == 'function') callBack()
    })
    return prom
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function w2confirm(msg: any, title?: any, callBack?: any): any { // any: msg/title/callBack are heterogeneous convenience params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prom: any // any: return from open() or message() differs; unified at call site
    let options = msg
    if (['string', 'number'].includes(typeof options)) {
        options = { msg: options }
    }
    if (options.msg) {
        options.body = `<div class="w2ui-centered w2ui-msg-text">${options.msg}</div>`,
        delete options.msg
    }
    if (typeof title == 'function' && callBack == null) {
        callBack = title
        title = undefined
    }
    w2utils.extend(options, {
        title: w2utils.lang(title ?? options.title ?? 'Confirmation'),
        showClose: false,
        modal: true,
        cancelAction: 'no'
    })
    if (callBack == null && options.callBack != null) {
        callBack = options.callBack
    }
    w2utils.normButtons(options, { yes: w2utils.lang('Yes'), no: w2utils.lang('No') })
    if (query('#w2ui-popup').length > 0 && w2popup.status != 'closing') {
        prom = w2popup.message(options)
    } else {
        prom = w2popup.open(options)
    }
    prom.self
        .off('.confirm')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('action:after.confirm', (event: any) => { // any: action event detail is dynamic
            if (typeof event.detail.self?.close == 'function') {
                event.detail.self.close()
            }
            if (typeof callBack == 'function') callBack(event.detail.action)
        })
    return prom
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function w2prompt(label: any, title?: any, callBack?: any): any { // any: label/title/callBack are heterogeneous convenience params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prom: any // any: return from open() or message() differs; unified at call site
    let options = label
    if (['string', 'number'].includes(typeof options)) {
        options = { label: options }
    }
    if (options.label) {
        options.focus = 0 // the input should be in focus, which is first in the popup
        options.body = (options.textarea
            ? `<div class="w2ui-prompt textarea">
                 <div>${options.label}</div>
                 <textarea id="w2prompt" class="w2ui-input" ${options.attrs ?? ''}
                    data-keydown="keydown|event" data-keyup="change|event"></textarea>
               </div>`
            : `<div class="w2ui-prompt w2ui-centered">
                 <label>${options.label}</label>
                 <input id="w2prompt" class="w2ui-input" ${options.attrs ?? ''}
                    data-keydown="keydown|event" data-keyup="change|event">
               </div>`
        )
    }
    w2utils.extend(options, {
        title: w2utils.lang(title ?? options.title ?? 'Notification'),
        showClose: false,
        modal: true,
        cancelAction: 'cancel'
    })
    w2utils.normButtons(options, { ok: w2utils.lang('Ok'), cancel: w2utils.lang('Cancel') })
    if (query('#w2ui-popup').length > 0 && w2popup.status != 'closing') {
        prom = w2popup.message(options)
    } else {
        prom = w2popup.open(options)
    }
    if (prom.self.box) {
        prom.self['input'] = query(prom.self.box).find('#w2prompt').get(0)
    } else {
        prom.self['input'] = query('#w2ui-popup .w2ui-popup-body #w2prompt').get(0)
    }
    if (options.value != null) {
        prom.self['input'].value = options.value
        prom.self['input'].select()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prom.change = function (callback: any) { // any: change callback event shape is dynamic
        prom.self.on('change', callback)
        return this
    }
    prom.self
        .off('.prompt')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('open:after.prompt', (event: any) => { // any: open event detail is dynamic
            const box = event.detail.box ? event.detail.box : query('#w2ui-popup .w2ui-popup-body').get(0)
            w2utils.bindEvents(query(box).find('#w2prompt'), {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                keydown(evt: any) { // any: KeyboardEvent
                    if (evt.keyCode == 27) evt.stopPropagation()
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                change(evt: any) { // any: KeyboardEvent
                    const edata = prom.self.trigger('change', { target: 'prompt', originalEvent: evt })
                    if (edata.isCancelled === true) return
                    if (evt.keyCode == 13 && (evt.ctrlKey || evt.metaKey || evt.target.tagName != 'TEXTAREA')) {
                        prom.self.action('Ok', evt)
                    }
                    if (evt.keyCode == 27) {
                        prom.self.action('Cancel', evt)
                    }
                    edata.finish()
                }
            })
            query(box).find('.w2ui-eaction').trigger('keyup')
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('action:after.prompt', (event: any) => { // any: action event detail is dynamic
            if (typeof event.detail.self?.close == 'function') {
                event.detail.self.close()
            }
            if (typeof callBack == 'function') callBack(event.detail.action)
        })
    return prom
}

const w2popup = new Dialog()
export { w2popup, w2alert, w2confirm, w2prompt, Dialog }