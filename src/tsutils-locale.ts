/**
 * TsUtils locale sub-module — Phase 5b of v2.7 SDD.
 * DAG position: leaf module (no tsbase/tsutils runtime imports).
 *
 * Imports:
 *   ./tslocale.js  — runtime import for TsLocale data const (zero-dep data leaf)
 *   ./tsutils.js   — type-only import type { TsUISettings } (TS erases at emit)
 *                    Precedent: tsutils-datetime.ts:29
 *
 * INV-4 / INV-L7-LEAF: MUST NOT import from tsbase.ts or tsutils.ts at runtime.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 *
 * 4-space indent convention.
 */

import type { TsUISettings } from './tsutils.js'
import { TsLocale } from './tslocale.js'

// ---------------------------------------------------------------------------
// DI interface — LocaleDeps (v2.7 locale injection pattern)
// ---------------------------------------------------------------------------

/**
 * Locale loader dependencies injected into _locale() by the TsUtils.locale() delegator.
 * Follows the v2.3 MessageDeps / v2.6 DateDeps deps-injection pattern.
 * Both fields are REQUIRED — no optional fallbacks (design OQ-1/D1).
 *
 * Internal only — NOT re-exported through src/index.ts barrel (INV-L7-DEPS-INTERNAL).
 */
export interface LocaleDeps {
    extend: (target: object, ...sources: object[]) => object
    fetch: (url: string, init?: { method?: string }) => Promise<Response>
}

// ---------------------------------------------------------------------------
// Internal result type
// ---------------------------------------------------------------------------

/**
 * Internal resolved-value shape returned by _locale() to the delegator.
 * The delegator unwraps this to the public Promise<{ file; data } | void> shape.
 *
 * @internal
 */
export type LocaleResult =
    | { kind: 'load'; file: string; data: unknown; settings?: TsUISettings }
    | { kind: 'merge'; settings: TsUISettings }
    | { kind: 'void'; settings?: TsUISettings }

// ---------------------------------------------------------------------------
// _locale() — Phase 5b (full body)
// Extracted from TsUtils.locale() body (tsutils.ts:625-686 in v2.6.0).
// ---------------------------------------------------------------------------

/**
 * Locale loader — pure async function extracted from TsUtils.locale() body.
 * Called by the TsUtils.locale() delegator; NOT part of the public API.
 *
 * INV-9: zero this.X references in this body.
 * INV-L7-LEAF: no runtime imports from tsutils.ts or tsbase.ts.
 *
 * @param locale      - string locale code, full URL, array of codes, or plain object to merge
 * @param keepPhrases - if true, existing phrases are preserved before merge (default: clear)
 * @param noMerge     - if true, settings are NOT mutated; resolves with { file, data } payload
 * @param settings    - TsUISettings reference (passed by ref from the delegator)
 * @param deps        - injected dependencies (extend + fetch)
 */
export async function _locale(
    locale: string | string[] | Record<string, unknown>,
    keepPhrases: boolean | undefined,
    noMerge: boolean | undefined,
    settings: TsUISettings,
    deps: LocaleDeps,
): Promise<LocaleResult> {
    // --- Array branch (OQ-2/D2 — DIRECT recursion via _locale, not through delegator) ---
    if (Array.isArray(locale)) {
        // Pre-reset phrases before fanout — v2.7.1 PATCH (INV-L7-PHRASES-CLEAR, array clause).
        // The spread { ...settings, phrases: {} } resets phrases to a fresh empty object BEFORE
        // deep-extend deep-clones the result. Pre-v2.7.1 the `{ phrases: {} }` source position
        // was a deep-extend no-op (extend iterates Object.keys({}) → 0 keys), so pre-existing
        // settings.phrases keys leaked into the initial accumulator.
        let mergedSettings: TsUISettings = deps.extend({}, { ...settings, phrases: {} }) as TsUISettings
        // .map() upfront — produces a FRESH array of expanded paths; original `locale` is never
        // mutated. v2.7.1 PATCH for R-LOC-2 (INV-L7-IMMUTABLE-INPUT). Downstream merge loop at
        // line 99 consumes localeArr (expanded) for files[file] lookup keys — semantics identical.
        const localeArr = (locale as string[]).map(f =>
            f.length === 5 ? 'locale/'+ f.toLowerCase() +'.json' : f
        )
        const proms: Array<Promise<LocaleResult>> = []
        const files: Record<string, unknown> = {}
        localeArr.forEach(file => {
            // Direct _locale call — NOT through delegator. Design OQ-2/D2 chosen option (ii).
            // keepPhrases=true, noMerge=false for inner recursive calls (mirrors original line 638)
            proms.push(_locale(file, true, false, mergedSettings, deps))
        })
        const res = await Promise.allSettled(proms)
        res.forEach(r => {
            if (r.status === 'fulfilled' && r.value.kind === 'load') {
                files[r.value.file] = r.value.data
            }
        })
        // Merge in declared order (order of files is important — mirrors original lines 646-648)
        localeArr.forEach(file => {
            mergedSettings = deps.extend({}, mergedSettings, (files[file] ?? {}) as object) as TsUISettings
        })
        return { kind: 'void', settings: mergedSettings }
    }

    if (!locale) locale = 'en-us'

    // --- Object branch (Thread C — INV-L7-OBJFIX fix) ---
    // Original line 658: `return` without resolve → Promise hung forever.
    // Fix: async function return auto-wraps; return { kind: 'merge', settings } resolves correctly.
    if (typeof locale === 'object') {
        const mergedSettings = deps.extend({}, settings, TsLocale, locale) as TsUISettings
        return { kind: 'merge', settings: mergedSettings }
    }

    // --- String branch (5-char auto-expansion or full path) ---
    let localeStr = locale as string
    if (localeStr.length === 5) {
        localeStr = 'locale/'+ localeStr.toLowerCase() +'.json'
    }

    // Load from the file (mirrors original lines 667-684)
    try {
        const res = await deps.fetch(localeStr, { method: 'GET' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (res as any).json() as object
        if (noMerge !== true) {
            if (keepPhrases) {
                // keep phrases, useful for recursive calls (mirrors original line 673)
                const newSettings = deps.extend({}, settings, data) as TsUISettings
                return { kind: 'load', file: localeStr, data, settings: newSettings }
            } else {
                // clear phrases from language before merging — v2.7.1 PATCH (INV-L7-PHRASES-CLEAR)
                // The spread { ...settings, phrases: {} } resets phrases to a fresh empty object
                // BEFORE deep-extend sees it; subsequent TsLocale + data sources then populate phrases
                // from a clean baseline. Pre-v2.7.1 the `{ phrases: {} }` source position was a
                // deep-extend no-op (extend iterates Object.keys({}) → 0 keys), so pre-existing
                // settings.phrases keys survived. See engram #925 (discovery).
                const phrasesCleared = { ...settings, phrases: {} }
                const newSettings = deps.extend({}, phrasesCleared, TsLocale, data) as TsUISettings
                return { kind: 'load', file: localeStr, data, settings: newSettings }
            }
        }
        return { kind: 'load', file: localeStr, data }
    } catch (err) {
        console.log('ERROR: Cannot load locale '+ localeStr)
        throw err   // rejects the async Promise (T-LOC-8); mirrors original .catch(reject)
    }
}
