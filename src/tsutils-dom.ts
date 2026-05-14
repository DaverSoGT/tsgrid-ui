/**
 * TsUtils DOM sub-module — Phase 5b of v2.4 SDD.
 * DAG position: leaf module (no tsbase/tsutils imports).
 *
 * Imports: ./tsutils-string.js (_encodeTags), ./tsutils-type-guards.js (_isInt),
 *          ./tsutils-data.js (_extend), ./query.js (query, Query), DOM globals only.
 * 4-space indent convention.
 *
 * INV-4: MUST NOT import from tsbase.ts or tsutils.ts.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 */

import { encodeTags as _encodeTags } from './tsutils-string.js'
import { isInt as _isInt } from './tsutils-type-guards.js'
import { extend as _extend } from './tsutils-data.js'
import { query as _query, Query } from './query.js'

// TsUtils always calls query() with a selector (never a callback) so the return is always Query.
// any: query() overload returns void|Query when called with a callback; we only use selector calls here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _query as (selector: any, context?: unknown) => Query

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Options for TsUtils.lock() — moved from tsutils.ts (Phase 5a of v2.4 SDD) */
export interface TsLockOptions {
    msg?: string | number
    spinner?: boolean
    opacity?: number
    bgColor?: string
    onClick?: () => void
}

// ---------------------------------------------------------------------------
// Exported functions — Phase 5b (real bodies)
// ---------------------------------------------------------------------------

/**
 * Animates a transition between two DOM elements.
 * Playwright-only coverage: jsdom cannot observe CSS transitions.
 */
export function transition(
    divOld: HTMLElement,
    divNew: HTMLElement,
    type: string,
    callBack?: () => void
): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
        const styles = getComputedStyle(divOld)
        const width  = parseInt(styles.width)
        const height = parseInt(styles.height)
        const time   = 0.5

        if (!divOld || !divNew) {
            console.log('ERROR: Cannot do transition when one of the divs is null')
            return
        }

        // any: parentNode is ParentNode | null; for transition usage it's always an HTMLElement
        ;(divOld.parentNode as HTMLElement).style.cssText += 'perspective: 900px; overflow: hidden;'
        divOld.style.cssText            += '; position: absolute; z-index: 1019; backface-visibility: hidden'
        divNew.style.cssText            += '; position: absolute; z-index: 1020; backface-visibility: hidden'

        switch (type) {
            case 'slide-left':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; transform: translate3d('+ width + 'px, 0, 0)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: translate3d(-'+ width +'px, 0, 0)'
                }, 1)
                break

            case 'slide-right':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; transform: translate3d(-'+ width +'px, 0, 0)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: translate3d(0px, 0, 0)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: translate3d('+ width +'px, 0, 0)'
                }, 1)
                break

            case 'slide-down':
                // init divs
                divOld.style.cssText += 'overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, '+ height +'px, 0)'
                }, 1)
                break

            case 'slide-up':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; transform: translate3d(0, '+ height +'px, 0)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                }, 1)
                break

            case 'flip-left':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: rotateY(0deg)'
                divNew.style.cssText += 'overflow: hidden; transform: rotateY(-180deg)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: rotateY(0deg)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: rotateY(180deg)'
                }, 1)
                break

            case 'flip-right':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: rotateY(0deg)'
                divNew.style.cssText += 'overflow: hidden; transform: rotateY(180deg)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: rotateY(0deg)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: rotateY(-180deg)'
                }, 1)
                break

            case 'flip-down':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: rotateX(0deg)'
                divNew.style.cssText += 'overflow: hidden; transform: rotateX(180deg)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: rotateX(0deg)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: rotateX(-180deg)'
                }, 1)
                break

            case 'flip-up':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: rotateX(0deg)'
                divNew.style.cssText += 'overflow: hidden; transform: rotateX(-180deg)'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: rotateX(0deg)'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: rotateX(180deg)'
                }, 1)
                break

            case 'pop-in':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; transform: scale(1); opacity: 1;'
                    divOld.style.cssText += 'transition: '+ time +'s;'
                }, 1)
                break

            case 'pop-out':
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;'
                divNew.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; opacity: 1;'
                    divOld.style.cssText += 'transition: '+ time +'s; transform: scale(1.7); opacity: 0;'
                }, 1)
                break

            default:
                // init divs
                divOld.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                divNew.style.cssText += 'overflow: hidden; translate3d(0, 0, 0); opacity: 0;'
                query(divNew).show()
                // -- need a timing function because otherwise not working
                setTimeout(() => {
                    divNew.style.cssText += 'transition: '+ time +'s; opacity: 1;'
                    divOld.style.cssText += 'transition: '+ time +'s'
                }, 1)
                break
        }

        setTimeout(() => {
            if (type === 'slide-down') {
                query(divOld).css('z-index', '1019')
                query(divNew).css('z-index', '1020')
            }
            if (divNew) {
                // any: .css({...}) returns Query when called with object arg; chain cast needed
                ;(query(divNew).css({ 'opacity': '1' }) as Query).css({ 'transition': '', 'transform' : '' })
            }
            if (divOld) {
                ;(query(divOld).css({ 'opacity': '1' }) as Query).css({ 'transition': '', 'transform' : '' })
            }
            if (typeof callBack === 'function') callBack()
            resolve()
        }, time * 1000)
    })
}

/**
 * Locks a DOM element with an optional overlay message.
 * R-DOM-1: internal unlock call uses module-level unlock() directly (no this.unlock).
 * R-DOM-1b: internal extend call uses _extend directly (no this.extend).
 */
export function lock(
    box: unknown,
    options: TsLockOptions | string = {},
    ...rest: unknown[]
): void {
    if (box == null) return
    // Normalise: string shorthand → { msg }
    let opts: TsLockOptions = typeof options === 'string' ? { msg: options } : { ...options }
    if (rest[0] != null) {
        opts.spinner = rest[0] as boolean
    }
    opts = _extend({ spinner: false }, opts) as TsLockOptions
    // for backward compatibility: unwrap jQuery-like array wrappers
    // any: box may be a legacy jQuery wrapper with [0] and .get(); normalise to a plain selector
    let boxSel: unknown = box
    if ((box as Record<string, unknown>)?.[0] instanceof Node) {
        boxSel = Array.isArray(box) ? box : (box as { get(): unknown[] }).get()
    }
    if (!opts.msg && opts.msg !== 0) opts.msg = ''
    unlock(boxSel)  // R-DOM-1: direct module-level call (was this.unlock)
    // any: Query.get(0) returns Element|null; HTMLElement is needed for scrollWidth/scrollHeight
    const el = query(boxSel).get(0) as HTMLElement
    const pWidth = el.scrollWidth
    const pHeight = el.scrollHeight
    // if it is body and only has absolute elements, its height will be 0, need to lock entire window
    let style = `height: ${pHeight}px; width: ${pWidth}px`
    if (el.tagName == 'BODY') {
        style = 'position: fixed; right: 0; bottom: 0;'
    }
    query(boxSel).prepend(
        `<div class="tsg-lock" style="${style}"></div>` +
        '<div class="tsg-lock-msg"></div>'
    )
    const $lock = query(boxSel).find('.tsg-lock')
    const $mess = query(boxSel).find('.tsg-lock-msg')
    if (!opts.msg) {
        $mess.css({
            'background-color': 'transparent',
            'background-image': 'none',
            'border': '0px',
            'box-shadow': 'none'
        })
    }
    if (opts.spinner === true) {
        opts.msg = `<div class="tsg-spinner" ${(!opts.msg ? 'style="width: 35px; height: 35px"' : '')}></div>`
            + opts.msg
    }
    if (opts.msg) {
        // any: .html(str) returns Query when setting content; cast needed for chaining
        ;($mess.html(String(opts.msg)) as Query).css('display', 'block')
    } else {
        $mess.remove()
    }
    if (opts.opacity != null) {
        $lock.css('opacity', String(opts.opacity))
    }
    $lock.css({ display: 'block' })
    if (opts.bgColor) {
        $lock.css({ 'background-color': opts.bgColor })
    }
    const styles = getComputedStyle($lock.get(0) as Element)
    const opacity = styles.opacity ?? 0.15
    $lock
        .on('mousedown', function() {
            if (typeof opts.onClick == 'function') {
                opts.onClick()
            } else {
                $lock.css({
                    'transition': '.2s',
                    'opacity': String(Number(opacity) * 1.5)
                })
            }
        })
        .on('mouseup', function() {
            if (typeof opts.onClick !== 'function') {
                $lock.css({
                    'transition': '.2s',
                    'opacity': String(opacity)
                })
            }
        })
        .on('mousewheel', function(event) {
            if (event) {
                event.stopPropagation()
                event.preventDefault()
            }
        })
}

/**
 * Removes the lock overlay from a DOM element.
 * R-UNLOCK-1: this.isInt → _isInt (direct import from tsutils-type-guards).
 */
export function unlock(box: unknown, speed?: number): void {
    if (box == null) return
    // any: box may store a _prevUnlock timer id on the element; dynamic property on Element
    const prevBox = box as Record<string, unknown>
    clearTimeout(prevBox['_prevUnlock'] as number)
    // for backward compatibility
    let boxSel: unknown = box
    if ((box as Record<string, unknown>)?.[0] instanceof Node) {
        boxSel = Array.isArray(box) ? box : (box as { get(): unknown[] }).get()
    }
    if (_isInt(speed) && (speed ?? 0) > 0) {
        query(boxSel).find('.tsg-lock').css({
            transition: ((speed ?? 0)/1000) + 's',
            opacity: 0,
        })
        // any: Element may have a dynamic _prevUnlock property used for timer management
        const _box = query(boxSel).get(0) as unknown as Record<string, unknown>
        clearTimeout(_box['_prevUnlock'] as number)
        _box['_prevUnlock'] = setTimeout(() => {
            query(boxSel).find('.tsg-lock').remove()
        }, speed)
        query(boxSel).find('.tsg-lock-msg').remove()
    } else {
        query(boxSel).find('.tsg-lock').remove()
        query(boxSel).find('.tsg-lock-msg').remove()
    }
}

/**
 * Returns a numeric CSS size measurement for a DOM element.
 */
export function getSize(el: unknown, type: string): number {
    const $el = query(el) // for backward compatibility
    let ret = 0
    if ($el.length > 0) {
        const styles = getComputedStyle($el[0] as Element)
        switch (type) {
            case 'width' :
                ret = parseFloat(styles.width)
                if (styles.width === 'auto') ret = 0
                break
            case 'height' :
                ret = parseFloat(styles.height)
                if (styles.height === 'auto') ret = 0
                break
            default:
                // any: type is a CSS property name; CSSStyleDeclaration is indexable by string
                ret = parseFloat(String(styles[type as keyof CSSStyleDeclaration] ?? '')) || 0
                break
        }
    }
    return ret
}

/**
 * Measures the pixel dimensions of a string rendered with given styles.
 * R-DOM-2: this.encodeTags → _encodeTags (direct import from tsutils-string.js).
 */
export function getStrDimentions(
    str: string,
    styles?: string,
    raw?: boolean
): { width: number; height: number } {
    let div = query('body > #_tmp_width')
    if (div.length === 0) {
        query('body').append('<div id="_tmp_width" style="position: absolute; top: -9000px;"></div>')
        div = query('body > #_tmp_width')
    }
    if (raw === undefined && str.trim().startsWith('<') && str.trim().endsWith('>')) {
        raw = true
    }
    ;(div.html(raw ? str : _encodeTags(str ?? '') as string) as Query).attr('style', `position: absolute; top: -9000px; ${styles || ''}`)
    // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const width = (div[0] as any).clientWidth
    // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const height = (div[0] as any).clientHeight
    div.html('')
    return { width, height }
}

/**
 * Returns the pixel width of a string rendered with given styles.
 * Delegates to module-level getStrDimentions (was this.getStrDimentions).
 */
export function getStrWidth(str: string, styles?: string, raw?: boolean): number {
    return getStrDimentions(str, styles, raw).width
}

/**
 * Returns the pixel height of a string rendered with given styles.
 * Delegates to module-level getStrDimentions (was this.getStrDimentions).
 */
export function getStrHeight(str: string, styles?: string, raw?: boolean): number {
    return getStrDimentions(str, styles, raw).height
}

/**
 * Binds DOM events from a subject map to matching child elements.
 */
export function bindEvents(
    selector: unknown,
    subject: Record<string, unknown>
): void {
    // format is
    // <div ... data-<event>='["<method>","param1","param2",...]'> -- should be valid JSON (no undefined)
    // <div ... data-<event>="<method>|param1|param2">
    // -- can have "event", "this", "stop", "stopPrevent", "alert" - as predefined objects
    // any: selector can be Element, Node[], Query, or string; normalize via query()
    const selectorR = selector as Record<string, unknown>
    if ((selectorR?.['length'] as number) == 0) return
    // for backward compatibility
    let normalizedSelector = selector
    if (selectorR?.[0] instanceof Node) {
        normalizedSelector = Array.isArray(selector) ? selector : (selector as { get(): unknown[] }).get()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(query(normalizedSelector as any) as ReturnType<typeof query>).each((el) => { // any: normalizedSelector is pre-validated above
        const actions = query(el).data() as Record<string, unknown>
        Object.keys(actions).forEach(name => {
            const events = ['click', 'dblclick', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mousedown', 'mousemove', 'mouseup',
                'contextmenu', 'focus', 'focusin', 'focusout', 'blur', 'input', 'change', 'keydown', 'keyup', 'keypress']
            if (events.indexOf(String(name).toLowerCase()) == -1) {
                return
            }
            let params: unknown[] = Array.isArray(actions[name]) ? actions[name] as unknown[] : [actions[name]]
            if (typeof actions[name] == 'string') {
                params = (actions[name] as string).split('|').map(key => {
                    // any: key is progressively coerced from string to typed value
                    let val: unknown = key
                    if (key === 'true') val = true
                    if (key === 'false') val = false
                    if (key === 'undefined') val = undefined
                    if (key === 'null') val = null
                    if (typeof val === 'string' && parseFloat(val) == (val as unknown as number)) val = parseFloat(val)
                    const quotes = ['\'', '"', '`']
                    if (typeof val == 'string' && quotes.includes(val[0] ?? '') && quotes.includes(val[val.length-1] ?? '')) {
                        val = val.substring(1, val.length-1)
                    }
                    return val
                })
            }
            const method = String(params[0]) // params[0] is the method name
            params = params.slice(1) // should be new array
            query(el)
                .off(name + '.TsUtils-bind')
                .on(name + '.TsUtils-bind', function(this: HTMLElement, event: Event) {
                    switch (method) {
                        case 'alert':
                            alert(params[0]) // for testing purposes
                            break
                        case 'stop':
                            event.stopPropagation()
                            break
                        case 'prevent':
                            event.preventDefault()
                            break
                        case 'stopPrevent':
                            event.stopPropagation()
                            event.preventDefault()
                            return false
                            break
                        default:
                            if (subject[method] == null) {
                                throw new Error(`Cannot dispatch event as the method "${method}" does not exist.`)
                            }
                            // any: subject[method] is a function mixed in at runtime; cast required
                            ;(subject[method] as (...args: unknown[]) => void)(...params.map((key, _ind) => {
                                switch (String(key).toLowerCase()) {
                                    case 'event':
                                        return event
                                    case 'this':
                                        return this
                                    default:
                                        return key
                                }
                            }))
                    }
                })
        })
    })
}
