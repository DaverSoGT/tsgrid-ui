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
 */

import { TsBase } from './tsbase.js'
import type { TsUISettings } from './tsutils.js'

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
// Deps interface for _message (Phase 3a scaffold — body lands in Phase 3b)
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
// _message — scaffold (Phase 3a)
// Full body moves here in Phase 3b. The class delegator (tsutils.ts) still
// contains the complete implementation during Phase 3a.
// The TsBase import above is pre-staged for Phase 3b when new TsBase() is needed.
// ---------------------------------------------------------------------------

/**
 * Extracted message() implementation — STUB in Phase 3a.
 * Body lands verbatim (with deps-injection substitutions) in Phase 3b.
 * @internal — called by the TsUtils class delegator only
 */
export function _message(
    this: void,
    where: TsMessageWhere,
    options: TsMessageOptions | string | number | undefined,
    deps: MessageDeps
): TsMessageProm | undefined {
    // Phase 3a: body intentionally not implemented here.
    // The class delegator (Utils.prototype.message) still holds the full body.
    // Phase 3b will move the body here and replace the class delegator.
    void TsBase  // reference to silence unused-import lint until Phase 3b
    void deps
    void where
    void options
    throw new Error('_message: not implemented in Phase 3a — class body still active')
}
