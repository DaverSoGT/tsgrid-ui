/**
 * TsUtils message cluster (message/alert/confirm/prompt/normButtons + types)
 * — Phase 2-4 of v2.3 SDD (message-cluster-extraction).
 *
 * IMPORTANT: This module imports TsBase from tsbase.ts — the only carve-out
 * to INV-4. Rationale: message() does `new TsBase()` to mix events into msgBase.
 * This exception is documented here and whitelisted in the INV-4 grep policy.
 *
 * Exports (Phase 2):
 *   normButtons — standalone pure helper; no DOM, no timers
 *
 * Exports (Phase 3a):
 *   TsMessageProm, TsMessageWhere, TsMessageOptions (types)
 *   MessageDeps (deps interface for _message — scaffold for Phase 3b)
 *   _message (stub — body lands in Phase 3b)
 *
 * Exports (Phase 3b+):
 *   _message (full body), _alert, _confirm, _prompt (Phase 4)
 *
 * Imports: TsBase from tsbase.ts (INV-4 carve-out, see above)
 *          TsUISettings type from tsutils.ts (type-only, no runtime dep)
 *          query from query.js (DOM helper)
 */

import { TsBase } from './tsbase.js'
import type { TsUISettings } from './tsutils.js'
import { query as _query, Query } from './query.js'

// TsUtils always calls query() with a selector (never a callback) so the return is always Query.
const query = _query as (selector: unknown, context?: unknown) => Query

// ---------------------------------------------------------------------------
// Public types — TsMessageProm / TsMessageWhere / TsMessageOptions
// These are re-exported from tsutils.ts to keep the public barrel unaffected.
// ---------------------------------------------------------------------------

/** Promise-chain handle returned by message() / confirm() / prompt() */
export interface TsMessageProm {
    self: TsBase
    action(callBack: (event: unknown) => void): TsMessageProm
    close(callBack: (event: unknown) => void): TsMessageProm
    open(callBack: (event: unknown) => void): TsMessageProm
    then(callBack: (event: unknown) => void): TsMessageProm
    change?: (callBack: (event: unknown) => void) => TsMessageProm
    [key: string]: unknown  // dynamic action keys (yes/no/ok/cancel) added at runtime
}

/** Where-descriptor for message() */
export interface TsMessageWhere {
    box: string | Element | null
    after?: string | Element | null
    owner?: { name?: string; lock?: (...args: unknown[]) => void; unlock?: (...args: unknown[]) => void; focus?: () => void }
    param?: unknown
}

/** Options for message() */
export interface TsMessageOptions {
    width?: number
    height?: number
    text?: string | null
    body?: string
    buttons?: string
    html?: string
    focus?: number | string | null
    hideOn?: string[]
    actions?: Record<string, unknown>
    cancelAction?: string
    on?: unknown
    onOpen?: unknown
    onClose?: unknown
    onAction?: unknown
    originalWidth?: number
    originalHeight?: number
    msgIndex?: number
    tmp?: { zIndex: string; overflow: string }
    input?: Element | null
    box?: Element | null
    trigger?: (event: string, data: Record<string, unknown>) => unknown
    close?: () => void
    setFocus?: (focus: number | string | null | undefined) => void
    action?: (action: string, event: unknown) => void
    // any: message mixes in TsBase methods at runtime via extend(); typed loosely here
    [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Deps interface for normButtons
// ---------------------------------------------------------------------------

export interface NormButtonsDeps {
    /** Object/array merge — sourced from tsutils-data */
    extend: (target: object, ...sources: object[]) => object
    /** i18n translation — sourced from TsUtils.lang.bind(this) */
    lang: (phrase: string, params?: Record<string, string | number> | boolean) => string
    /** Settings object — sourced from TsUtils.settings */
    settings: TsUISettings
}

// ---------------------------------------------------------------------------
// Deps interface for _message (Phase 3b — full body)
// Per design §C.2.
// ---------------------------------------------------------------------------

export interface MessageDeps {
    /** Object/array merge — sourced from tsutils-data */
    extend: (target: object, ...sources: object[]) => object
    /** DOM data-event binder — sourced from Utils singleton (forward ref) */
    bindEvents: (selector: unknown, subject: Record<string, unknown>) => void
    /** Lock — sourced from Utils singleton (this.lock) */
    lock: (box: unknown, options?: unknown) => void
    /** Unlock — sourced from Utils singleton (this.unlock) */
    unlock: (box: unknown, speed?: number) => void
    /** Widget owner name for DOM IDs like tsg-message-${ownerName}-${i} */
    ownerName: string | undefined
    /** Utils instance — passed as subject to bindEvents for the message box element binding */
    self: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// normButtons — extracted from TsUtils.prototype.normButtons (tsutils.ts:1560-1599)
// ---------------------------------------------------------------------------

/**
 * Normalizes yes/no/ok/cancel buttons for confirmation dialogs.
 * Pure function — no DOM access, no timers, no this references.
 *
 * Substitutions from original:
 *   TsUtils.lang(...)    → deps.lang(...)
 *   TsUtils.settings.*   → deps.settings.*
 *   TsUtils.extend(...)  → deps.extend(...)
 */
export function normButtons(
    options: Record<string, unknown>,
    btn: Record<string, unknown>,
    deps: NormButtonsDeps
): Record<string, unknown> {
    options['actions'] = options['actions'] ?? {}
    const btns = Object.keys(btn)
    btns.forEach(name => {
        const action = options['btn_' + name] as Record<string, unknown> | undefined
        if (action) {
            btn[name] = {
                text: deps.lang(String(action['text'] ?? btn[name] ?? '')),
                class: action['class'] ?? '',
                style: action['style'] ?? '',
                attrs: action['attrs'] ?? ''
            }
            delete options['btn_' + name]
        }
        ;['text', 'class', 'style', 'attrs'].forEach(suffix => {
            if (options[name + '_' + suffix]) {
                if (typeof btn[name] == 'string') {
                    btn[name] = { text: btn[name] }
                }
                ;(btn[name] as Record<string, unknown>)[suffix] = options[name + '_' + suffix]
                delete options[name + '_' + suffix]
            }
        })
    })
    if (btns.includes('yes') && btns.includes('no')) {
        if (deps.settings.macButtonOrder) {
            deps.extend(options['actions'] as object, { no: btn['no'], yes: btn['yes'] })
        } else {
            deps.extend(options['actions'] as object, { yes: btn['yes'], no: btn['no'] })
        }
    }
    if (btns.includes('ok') && btns.includes('cancel')) {
        if (deps.settings.macButtonOrder) {
            deps.extend(options['actions'] as object, { cancel: btn['cancel'], ok: btn['ok'] })
        } else {
            deps.extend(options['actions'] as object, { ok: btn['ok'], cancel: btn['cancel'] })
        }
    }
    return options
}

// ---------------------------------------------------------------------------
// _message — full body (Phase 3b)
// Extracted verbatim from TsUtils.prototype.message (tsutils.ts:1030-1390)
// with the following deps-injection substitutions:
//   TsUtils.extend(...)          → deps.extend(...)
//   TsUtils.bindEvents(...)      → deps.bindEvents(...)
//   this.unlock(...)             → deps.unlock(...)
//   this.lock(...)               → deps.lock(...)
//   typeof this.lock == 'function' → typeof deps.lock == 'function'
//   (this as ...)['name']        → deps.ownerName
//   TsUtils.bindEvents(box, this)→ deps.bindEvents(box, deps.self)
//   arguments.length == 1 || options == null → options == null  (INV-8 / design §F)
// @internal — called by the TsUtils class delegator only
// ---------------------------------------------------------------------------

/**
 * Extracted message() implementation — full body (Phase 3b).
 * @internal — called by the TsUtils class delegator only
 */
export function _message(
    this: void,
    where: TsMessageWhere,
    options: TsMessageOptions | string | number | undefined,
    deps: MessageDeps
): TsMessageProm | undefined {
    let closeTimer: ReturnType<typeof setTimeout>,
        openTimer: ReturnType<typeof setTimeout>,
        edata: unknown
    // any: msgBase is the live TsMessageOptions reference shared across all closures
    let msgBase: TsMessageOptions = {}
    const removeLast = () => {
        const msgs = query(where?.box).find('.tsg-message')
        if (msgs.length == 0) return // no messages already
        // any: DOM element has _msg_options stored dynamically at open time
        msgBase = (msgs.get(0) as unknown as Record<string, unknown>)['_msg_options'] as TsMessageOptions || {}
        if (typeof msgBase?.close == 'function') {
            msgBase.close!()
        }
    }
    // any: options is morphed into a TsBase instance mid-function; the full shape is known only at runtime
    const closeComplete = (options: Record<string, unknown>) => {
        // any: DOM element has _msg_prevFocus stored dynamically at open time
        const msgBoxEl = options['box'] as Record<string, unknown> | null
        const focus = msgBoxEl?.['_msg_prevFocus'] as Element | undefined
        if (query(where.box).find('.tsg-message').length <= 1) {
            if (where.owner) {
                where.owner.unlock?.(where.param, 150)
            } else {
                deps.unlock(where.box, 150)
            }
        } else {
            query(where.box).find(`#tsg-message-${where.owner?.name}-${(options['msgIndex'] as number)-1}`).css('z-index', '1500')
        }
        if (focus) {
            const msg = query(focus).closest('.tsg-message')
            if (msg.length > 0) {
                // any: DOM element has _msg_options + setFocus stored dynamically at open time
                const opt = (msg.get(0) as unknown as Record<string, unknown>)['_msg_options'] as Record<string, unknown>
                ;(opt['setFocus'] as (f: Element) => void)(focus)
            } else {
                (focus as HTMLElement).focus()
            }
        } else {
            if (typeof where.owner?.focus == 'function') where.owner.focus()
        }
        query(options['box'] as unknown).remove()
        if (options['msgIndex'] === 0) {
            const tmp = options['tmp'] as { zIndex: string; overflow: string }
            head.css('z-index', tmp.zIndex)
            query(where.box).css('overflow', tmp.overflow)
        }
        // event after
        if (options['trigger']) {
            // any: edata is a TsEvent whose finish() is called after close; runtime-owned by options.trigger
            ;((edata as Record<string, unknown>)?.['finish'] as (() => void) | undefined)?.()
        }
    }

    if (typeof options == 'string' || typeof options == 'number') {
        msgBase = {
            width : (String(options).length < 300 ? 350 : 550),
            height: (String(options).length < 300 ? 170: 250),
            text  : String(options),
        }
    } else if (options == null) {
        // INV-8: arguments.length == 1 replaced with options == null (covers undefined AND null).
        // Per design §F.2: strict superset of original guard. Parity tests lock this in Phase 3b.
        msgBase = where as unknown as TsMessageOptions
    } else {
        msgBase = options ?? {}
    }
    if ((msgBase.text === '' || msgBase.text == null) && (msgBase.body === '' || msgBase.body == null)) {
        removeLast()
        return
    }
    if (msgBase.text != null) msgBase.body = `<div class="tsg-centered tsg-msg-text">${msgBase.text}</div>`
    if (msgBase.width == null) msgBase.width = 350
    if (msgBase.height == null) msgBase.height = 170
    if (msgBase.hideOn == null) msgBase.hideOn = ['esc']
    msgBase.cancelAction ??= 'Ok'
    // mix in events
    // any: msgBase is coerced into a TsBase instance here so that .on/.off/.trigger work;
    // the resulting shape is a hybrid TsMessageOptions + TsBase that TS cannot express statically
    if (msgBase.on == null) {
        const opts = msgBase
        msgBase = new TsBase() as unknown as TsMessageOptions
        deps.extend(msgBase as object, opts as object)
    }
    // any: at this point msgBase has both TsMessageOptions fields AND TsBase event methods (on/off/trigger)
    const msgOpts = msgBase as unknown as Record<string, unknown>
    ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open', (event: Record<string, unknown>) => {
        deps.bindEvents(query(msgOpts['box'] as unknown).find('.tsg-eaction'), msgOpts) // msgOpts is TsBase object
        const detail = event['detail'] as Record<string, unknown>
        query(detail['box'] as unknown).find('button, input, textarea, [name=hidden-first]')
            .off('.message')
            .on('keydown.message', function(evt: Event) {
                const keyEvt = evt as KeyboardEvent
                if (keyEvt.keyCode == 27 && (msgOpts['hideOn'] as string[]).includes('esc')) {
                    if (msgOpts['cancelAction']) {
                        ;(msgOpts['action'] as (..._a: unknown[]) => unknown)(msgOpts['cancelAction'])
                    } else {
                        ;(msgOpts['close'] as (..._a: unknown[]) => unknown)()
                    }
                }
            })
        // timeout is needed because messages opens over 0.3 seconds
        setTimeout(() => (msgOpts['setFocus'] as (..._a: unknown[]) => unknown)(msgOpts['focus']), 300)
    })
    ;(msgOpts['off'] as (..._a: unknown[]) => unknown)('.prom')
    const prom: TsMessageProm = {
        self: msgBase as unknown as TsBase,
        action(callBack: (event: unknown) => void) {
            ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('action.prom', callBack)
            return prom
        },
        close(callBack: (event: unknown) => void) {
            ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('close.prom', callBack)
            return prom
        },
        open(callBack: (event: unknown) => void) {
            ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open.prom', callBack)
            return prom
        },
        then(callBack: (event: unknown) => void) {
            ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open:after.prom', callBack)
            return prom
        }
    }
    if (msgBase.actions == null && msgBase.buttons == null && msgBase.html == null) {
        msgBase.actions = { Ok(event: Record<string, unknown>) { ((event['detail'] as Record<string, unknown>)?.['self'] as Record<string, () => void> | null | undefined)?.['close']?.() }}
    }
    ;(msgOpts['off'] as (..._a: unknown[]) => unknown)('.buttons')
    if (msgBase.actions != null) {
        msgBase.buttons = ''
        Object.keys(msgBase.actions).forEach((action) => {
            const handler = msgBase.actions![action]
            let btnAction: string = action
            if (typeof handler == 'function') {
                msgBase.buttons += `<button class="tsg-btn tsg-eaction" data-click='["action","${action}","event"]' name="${action}">${action}</button>`
            }
            if (typeof handler == 'object' && handler !== null) {
                const h = handler as Record<string, unknown>
                msgBase.buttons += `<button class="tsg-btn tsg-eaction ${h['class'] || ''}" name="${action}" data-click='["action","${action}","event"]'
                    style="${h['style'] ?? ''}" ${h['attrs'] ?? ''}>${h['text'] || action}</button>`
                btnAction = Array.isArray(msgBase.actions) ? String(h['text']) : action
            }
            if (typeof handler == 'string') {
                msgBase.buttons += `<button class="tsg-btn tsg-eaction" name="${handler}" data-click='["action","${handler}","event"]'>${handler}</button>`
                btnAction = handler
            }
            if (typeof btnAction == 'string') {
                btnAction = (btnAction[0] ?? '').toLowerCase() + btnAction.substr(1).replace(/\s+/g, '')
            }
            prom[btnAction] = function (callBack: (event: unknown) => void) {
                ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('action.buttons', (event: Record<string, unknown>) => {
                    const detail = event['detail'] as Record<string, unknown>
                    const act = String(detail['action'])
                    const target = (act[0] ?? '').toLowerCase() + act.substr(1).replace(/\s+/g, '')
                    if (target == btnAction) callBack(event)
                })
                return prom
            }
        })
    }
    // trim if any
    ;(['html', 'body', 'buttons'] as const).forEach(param => {
        msgBase[param] = String(msgBase[param] ?? '').trim()
    })
    if (msgBase.body !== '' || msgBase.buttons !== '') {
        msgBase.html = `
            <div class="tsg-message-body">${msgBase.body || ''}</div>
            <div class="tsg-message-buttons">${msgBase.buttons || ''}</div>
        `
    }
    let styles  = getComputedStyle(query(where.box).get(0) as Element)
    const pWidth  = parseFloat(styles.width)
    const pHeight = parseFloat(styles.height)
    let titleHeight = 0
    if (query(where.after).length > 0) {
        styles = getComputedStyle(query(where.after).get(0) as Element)
        titleHeight = parseInt(styles.display != 'none' ? styles.height : '0')
    }
    if ((msgBase.width ?? 0) > pWidth) msgBase.width = pWidth - 10
    if ((msgBase.height ?? 0) > pHeight - titleHeight) msgBase.height = pHeight - 10 - titleHeight
    if (msgBase.width != null) msgBase.originalWidth = msgBase.width
    if (msgBase.height != null) msgBase.originalHeight = msgBase.height
    if (parseInt(String(msgBase.width)) < 0) msgBase.width = pWidth + (msgBase.width ?? 0)
    if (parseInt(String(msgBase.width)) < 10) msgBase.width = 10
    if (parseInt(String(msgBase.height)) < 0) msgBase.height = pHeight + (msgBase.height ?? 0) - titleHeight
    if (parseInt(String(msgBase.height)) < 10) msgBase.height = 10
    // negative value means margin
    if ((msgBase.originalHeight ?? 0) < 0) msgBase.height = pHeight + (msgBase.originalHeight ?? 0) - titleHeight
    if ((msgBase.originalWidth ?? 0) < 0) msgBase.width = pWidth + (msgBase.originalWidth ?? 0) * 2 // x 2 because there is left and right margin
    const head = query(where.box).find(where.after as string) // needed for z-index manipulations
    if (!msgBase.tmp) {
        msgBase.tmp = {
            zIndex: String(head.css('z-index')),
            overflow: styles.overflow
        }
    }
    // remove message
    if (msgBase.html === '' && msgBase.body === '' && msgBase.buttons === '') {
        removeLast()
    } else {
        msgBase.msgIndex = query(where.box).find('.tsg-message').length
        if (msgBase.msgIndex === 0 && typeof deps.lock == 'function') {
            query(where.box).css('overflow', 'hidden')
            if (where.owner) { // where.param is used in the panel
                // any: lock() is a widget method accessed via TsBase index signature; safe runtime call
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(where.owner as any).lock?.(where.param)
            } else {
                deps.lock(where.box)
            }
        }
        // send back previous messages
        query(where.box).find('.tsg-message').css('z-index', '1390')
        head.css('z-index', '1501')
        // add message
        const content = `
            <div id="tsg-message-${where.owner?.name}-${msgBase.msgIndex}" class="tsg-message" data-mousedown="stop"
                style="z-index: 1500; left: ${((pWidth - (msgBase.width ?? 0)) / 2)}px; top: ${titleHeight}px;
                    width: ${msgBase.width}px; height: ${msgBase.height}px; transform: translateY(-${msgBase.height}px)"
                ${(msgBase.hideOn ?? []).includes('click')
                    ? where.param
                        ? `data-click='["message", "${where.param}"]`
                        : 'data-click="message"'
                    : ''}>
                <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                ${msgBase.html}
                <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
            </div>`
        if (query(where.after).length > 0) {
            query(where.box).find(where.after as string).after(content)
        } else {
            query(where.box).prepend(content)
        }
        // any: DOM elements get _msg_options + _msg_prevFocus dynamic properties at open time
        msgBase.box = query(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`)[0] as Element
        deps.bindEvents(msgBase.box, deps.self)
        query(msgBase.box)
            .addClass('animating')
        // remember options and prev focus
        ;(msgBase.box as unknown as Record<string, unknown>)['_msg_options'] = msgBase
        ;(msgBase.box as unknown as Record<string, unknown>)['_msg_prevFocus'] = document.activeElement
        // timeout is needed so that callBacks are setup
        setTimeout(() => {
            // before event
            // any: trigger is mixed in from TsBase; edata is a TsEvent with isCancelled + finish()
            edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('open', { target: deps.ownerName, box: msgBase.box, self: msgBase })
            const edataR = edata as Record<string, unknown>
            if (edataR['isCancelled'] === true) {
                query(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`).remove()
                if (msgBase.msgIndex === 0) {
                    head.css('z-index', msgBase.tmp!.zIndex)
                    query(where.box).css('overflow', msgBase.tmp!.overflow)
                }
                return
            }
            // slide down
            query(msgBase.box).css({
                transition: '0.3s',
                transform: 'translateY(0px)'
            })
        }, 0)
        // timeout is needed so that animation can finish
        openTimer = setTimeout(() => {
            // has to be on top of lock
            query(where.box)
                .find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`)
                .removeClass('animating')
                .css({ 'transition': '0s' })
            // event after
            ;((edata as Record<string, unknown>)?.['finish'] as (() => void) | undefined)?.()
        }, 300)
    }
    // action handler
    msgBase.action = (action: string, event: unknown) => {
        let click = msgBase.actions?.[action]
        if (click instanceof Object && (click as Record<string, unknown>)['onClick']) click = (click as Record<string, unknown>)['onClick'] as unknown
        // event before
        // any: trigger is mixed in from TsBase
        const edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('action', { target: deps.ownerName, action, self: msgBase,
            originalEvent: event, value: msgBase.input ? (msgBase.input as HTMLInputElement).value : null })
        const edataR = edata as Record<string, unknown>
        if (edataR['isCancelled'] === true) return
        // default actions
        if (typeof click === 'function') click(edata)
        // event after
        ;(edataR['finish'] as (() => void) | undefined)?.()
    }
    msgBase.close = () => {
        // any: trigger is mixed in from TsBase
        edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('close', { target: 'self', box: msgBase.box, self: msgBase })
        const edataR = edata as Record<string, unknown>
        if (edataR['isCancelled'] === true) return
        clearTimeout(openTimer)
        if (query(msgBase.box).hasClass('animating')) {
            clearTimeout(closeTimer)
            closeComplete(msgOpts)
            return
        }
        // default behavior
        query(msgBase.box)
            .addClass('tsg-closing animating')
            .css({
                'transition': '0.15s',
                'transform': 'translateY(-' + msgBase.height + 'px)'
            })
        if ((msgBase.msgIndex ?? 0) !== 0) {
            // previous message
            query(where.box).find(`#tsg-message-${where.owner?.name}-${(msgBase.msgIndex ?? 1)-1}`).css('z-index', '1499')
        }
        closeTimer = setTimeout(() => { closeComplete(msgOpts) }, 150)
    }
    msgBase.setFocus = (focus: number | string | null | undefined) => {
        // in message or popup
        const cnt = query(where.box).find('.tsg-message').length - 1
        const box = query(where.box).find(`#tsg-message-${where.owner?.name}-${cnt}`)
        const sel = 'input, button, select, textarea, [contentEditable], .tsg-input'
        if (focus != null) {
            // any: parameter typed any — runtime dispatch by call site; TsUtils helper accepts heterogeneous runtime input
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const el: any = typeof focus === 'string'
                ? box.find(sel).filter(focus).get(0)
                : box.find(sel).get(focus as number)
            el?.focus()
        } else {
            // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (box.find('[name=hidden-first]').get(0) as any)?.focus()
        }

        // clear focus if there are other messages
        query(where.box)
            .find('.tsg-message')
            .find(sel + ',[name=hidden-first],[name=hidden-last]')
            .off('.keep-focus')

        // keep focus/blur inside popup
        query(box)
            .find(sel + ',[name=hidden-first],[name=hidden-last]')
            .on('blur.keep-focus', function (_event) {
                setTimeout(() => {
                    const focus = document.activeElement
                    const inside = focus != null && query(box).find(sel).filter(focus as Node).length > 0
                    const name = query(focus).attr('name')
                    if (!inside && focus && focus !== document.body) {
                        // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (query(box).find(sel).get(0) as any)?.focus()
                    }
                    if (name == 'hidden-last') {
                        // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (query(box).find(sel).get(0) as any)?.focus()
                    }
                    if (name == 'hidden-first') {
                        // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (query(box).find(sel).get(-1) as any)?.focus()
                    }
                }, 1)
            })
    }
    return prom
}
