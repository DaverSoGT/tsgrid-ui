/**
 * TsUtils notify — Phase 1 of v2.3 SDD (message-cluster-extraction).
 *
 * Extracted from TsUtils.notify() in src/tsutils.ts.
 * INV-4 satisfied: this module does NOT import from tsbase.ts or tsutils.ts.
 * INV-9 satisfied: no `this.X` references — all class state is passed via NotifyDeps.
 *
 * Imports:
 * - query from ./query.js  (DOM helper, leaf module)
 */
import { query as _query, Query } from './query.js'
import { crossIcon } from './icons.js'

// query() overload returns void|Query when called with a callback; notify only uses selector calls.
// Cast to always return Query so chained calls don't need type guards — matches tsutils.ts pattern.
// any: same recast as in tsutils.ts:50
const query = _query as (selector: unknown, context?: unknown) => Query

// ── dependency interface ───────────────────────────────────────────────────

/**
 * Dependency injection shape for the extracted notify() function.
 * The class delegator on TsUtils.prototype constructs this per-call:
 *
 *   _notify(text, options, { execTemplate: this.execTemplate.bind(this), tmpSlot: this.tmp })
 *
 * Using `this.tmp` by reference (Option A from design §C.4) preserves the
 * single-object identity visible in devtools and avoids ownership transfer.
 */
export interface NotifyDeps {
    /** String template interpolator — sourced from tsutils-string.ts via TsUtils.execTemplate */
    execTemplate: (str: unknown, replaceObj: unknown) => unknown
    /** Reference to TsUtils.tmp — notify reads/writes notify_resolve, notify_where, notify_timer */
    tmpSlot: Record<string, unknown>
}

// ── exported function ──────────────────────────────────────────────────────

/**
 * Shows a small notification message at the bottom of the page, or a container
 * specified in options.where.
 *
 * TsUtils.notify('Document saved')
 * TsUtils.notify('Message sent ${undo}', { actions: { undo: function () {...} } })
 *
 * @param text    Message string or options object (object-form shorthand)
 * @param options Optional options: { where, timeout, error, success, class, actions }
 * @param deps    Injected dependencies (execTemplate + tmpSlot)
 * @returns Promise<void> that resolves when the notification is dismissed
 */
export function notify(
    text: string | Record<string, unknown>,
    options: Record<string, unknown> | undefined,
    deps: NotifyDeps,
): Promise<void> {
    return new Promise<void>(resolve => {
        // any: text can be an options object; normalize in-place
        let opts: Record<string, unknown> = options ?? {}
        let textStr: string = ''
        if (typeof text == 'object') {
            opts = text
            textStr = String(opts['text'] ?? '')
        } else {
            textStr = String(text ?? '')
        }
        opts['where'] ??= document.body
        opts['timeout'] ??= 15_000 // 15 seconds or will be hidden on route change
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (typeof deps.tmpSlot['notify_resolve'] == 'function') {
            ;(deps.tmpSlot['notify_resolve'] as () => void)()
            query(deps.tmpSlot['notify_where']).find('#tsg-notify').remove()
        }
        deps.tmpSlot['notify_resolve'] = resolve
        deps.tmpSlot['notify_where'] = opts['where']
        clearTimeout(deps.tmpSlot['notify_timer'] as number)
        const where = opts['where']
        if (textStr) {
            if (typeof opts['actions'] == 'object') {
                const actions: Record<string, string> = {}
                Object.keys(opts['actions'] as Record<string, unknown>).forEach(action => {
                    actions[action] = `<a class="tsg-notify-link" value="${action}">${action}</a>`
                })
                textStr = deps.execTemplate(textStr, actions) as string
            }
            const html = `
                    <div id="tsg-notify" style="${where == document.body ? 'position: fixed' : ''}">
                        <div class="${opts['class'] ?? ''} ${opts['error'] ? 'tsg-notify-error' : ''} ${opts['success'] ? 'tsg-notify-success' : ''}">
                            ${textStr}
                            <span class="tsg-notify-close">${crossIcon({ label: 'Close', size: 16 })}</span>
                        </div>
                    </div>`
            query(where).append(html)
            query(where).find('#tsg-notify').find('.tsg-notify-close')
                .on('click', (_event: Event) => {
                    query(where).find('#tsg-notify').remove()
                    resolve()
                })
            if (opts['actions']) {
                query(where).find('#tsg-notify .tsg-notify-link')
                    .on('click', (event: Event) => {
                        const value = query(event.target).attr('value') ?? ''
                        ;((opts['actions'] as Record<string, unknown>)[value] as () => void)()
                        query(where).find('#tsg-notify').remove()
                        resolve()
                    })
            }
            if ((opts['timeout'] as number) > 0) {
                deps.tmpSlot['notify_timer'] = setTimeout(() => {
                    query(where).find('#tsg-notify').remove()
                    resolve()
                }, opts['timeout'] as number)
            }
        }
    })
}
