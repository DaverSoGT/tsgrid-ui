/**
 * TsUtils message cluster (message/alert/confirm/prompt/normButtons + types)
 * — Phase 2 of v2.3 SDD (message-cluster-extraction).
 *
 * IMPORTANT: This module imports TsBase from tsbase.ts — the only carve-out
 * to INV-4. Rationale: message() does `new TsBase()` to mix events into msgBase.
 * This import is added in Phase 3a; for Phase 2 the file is normButtons-only.
 *
 * Exports (Phase 2):
 *   normButtons — standalone pure helper; no DOM, no timers
 *
 * Exports (Phase 3a+):
 *   TsMessageProm, TsMessageWhere, TsMessageOptions (types)
 *   message, alert, confirm, prompt (extraction phases 3a/3b/4)
 *
 * Imports (Phase 2): none from tsbase / tsutils family (INV-4 satisfied for Phase 2)
 */

import type { TsUISettings } from './tsutils.js'

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
