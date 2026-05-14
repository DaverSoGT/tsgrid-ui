/**
 * TsUtils locale sub-module — Phase 5a scaffold of v2.7 SDD.
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

// Keep TsLocale in scope for P5b body — avoids unused-import error at scaffold stage
void TsLocale

// ---------------------------------------------------------------------------
// _locale() — STUB (Phase 5a)
// Body lands in Phase 5b.
// ---------------------------------------------------------------------------

/**
 * Locale loader — extracted from TsUtils.locale() body in Phase 5b.
 * Called by the TsUtils.locale() delegator; NOT part of the public API.
 *
 * @param locale  - string locale code, full URL, array of codes, or plain object to merge
 * @param keepPhrases - if true, existing phrases are preserved before merge (default: clear)
 * @param noMerge - if true, settings are NOT mutated; resolves with { file, data } payload
 * @param settings - TsUISettings reference (passed by ref from the delegator)
 * @param deps - injected dependencies (extend + fetch)
 */
export async function _locale(
    _loc: string | string[] | Record<string, unknown>,
    _keepPhrases: boolean | undefined,
    _noMerge: boolean | undefined,
    _settings: TsUISettings,
    _deps: LocaleDeps,
): Promise<LocaleResult> {
    throw new Error('_locale not implemented — landing in P5b')
}
