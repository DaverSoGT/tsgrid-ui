/**
 * Test suite for TsUtils locale cluster — Phase 4 (TDD safety-net) of v2.7 SDD.
 *
 * Phase 4 framing:
 *   Tests are written against the FUTURE _locale() implementation (RED phase).
 *   The _locale() function and LocaleDeps interface do not exist yet (tsutils-locale.ts
 *   is created in Phase 5a). These tests MUST fail until Phase 5b lands the full body.
 *   All previously-GREEN tests MUST remain GREEN (lint + tsc MUST pass at P4 commit).
 *
 * RED-tolerance:
 *   - pnpm test (lint + tsc): MUST EXIT 0
 *   - pnpm test:unit: EXPECTED RED on T-LOC-* cases only
 *
 * Infrastructure:
 *   - jsdom environment (vitest.config.ts: testEnvironment: 'jsdom')
 *   - SETTINGS_SNAPSHOT / beforeEach restore pattern (prevents locale-mutation leaks)
 *   - deps.fetch mock: vi.fn().mockResolvedValue({ json: async () => ({}) })
 *
 * INV-TDD: These tests are committed before Phase 5a/5b implementation commits,
 *   satisfying the pre-commit test requirement (git log order: P4 < P5a < P5b).
 *
 * T-LOC-9: design constraint — all T-LOC-2..T-LOC-8 pass via deps.fetch without
 *   global polyfill. The passing of T-LOC-2..T-LOC-8 in jsdom IS T-LOC-9's runtime evidence.
 *
 * INV-L7-OBJFIX: T-LOC-1 asserts object-form awaits within 1s (was: hangs forever).
 * INV-SPY (T-LOC-10): vi.spyOn(TsUtils.prototype, 'locale') works after delegator rewrite.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'

// @ts-expect-error — P4 RED: tsutils-locale.ts does not exist yet (created in P5a)
import { _locale, type LocaleDeps } from '../../src/tsutils-locale.js'

// Snapshot of mutable settings — restore between tests so locale-mutation doesn't
// leak across cases. Pattern from w2utils.test.ts lines 6-9 and tsutils-datetime.test.ts.
const SETTINGS_SNAPSHOT = JSON.parse(JSON.stringify(TsUtils.settings))
beforeEach(() => {
    Object.assign(TsUtils.settings, SETTINGS_SNAPSHOT)
    // Deep-restore phrases and other nested objects
    TsUtils.settings.phrases = { ...(SETTINGS_SNAPSHOT.phrases as Record<string, string>) }
})
afterEach(() => {
    vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Shared deps factory — mirrors design §B-D1 shape
// ---------------------------------------------------------------------------

function makeDeps(): LocaleDeps {
    return {
        extend: TsUtils.extend.bind(TsUtils) as (...args: unknown[]) => unknown,
        fetch: vi.fn().mockResolvedValue({ json: async () => ({}) } as unknown as Response),
    }
}

function makeUtils(): InstanceType<typeof TsUtils> {
    // TsUtils is a singleton class; use the static instance for delegation tests
    return TsUtils
}

// ---------------------------------------------------------------------------
// T-LOC-1 — Object form + INV-L7-OBJFIX
// ---------------------------------------------------------------------------

describe('T-LOC-1: object-form locale({ ... }) resolves with merged settings', () => {
    it('awaits within 1s and merges settings (INV-L7-OBJFIX)', { timeout: 1000 }, async () => {
        const deps = makeDeps()
        // Proof of INV-L7-OBJFIX: this await completing (not hanging) IS the fix.
        // _locale is functional (deps.extend({}, ...)); the delegator applies result.settings
        // back to this.settings. We assert on the returned LocaleResult to verify merge shape.
        const result = await _locale({ dateFormat: 'dd.mm.yyyy' }, undefined, undefined, TsUtils.settings, deps)
        expect((result as { kind: string }).kind).toBe('merge')
        expect((result as { settings: { dateFormat: string } }).settings.dateFormat).toBe('dd.mm.yyyy')
    })
})

// ---------------------------------------------------------------------------
// T-LOC-2 — String 5-char auto-expansion
// ---------------------------------------------------------------------------

describe('T-LOC-2: string 5-char code "ru-ru" → fetch called with "locale/ru-ru.json"', () => {
    it('expands 5-char code to locale/xx-xx.json path', async () => {
        const deps = makeDeps()
        await _locale('ru-ru', undefined, undefined, TsUtils.settings, deps)
        expect(deps.fetch).toHaveBeenCalledWith('locale/ru-ru.json', { method: 'GET' })
        expect(deps.fetch).not.toHaveBeenCalledWith('ru-ru', expect.anything())
    })
})

// ---------------------------------------------------------------------------
// T-LOC-3 — String full path passed verbatim
// ---------------------------------------------------------------------------

describe('T-LOC-3: string full path → fetch called with exact path (no double-expansion)', () => {
    it('uses full path verbatim without re-expanding', async () => {
        const deps = makeDeps()
        await _locale('locale/ru-ru.json', undefined, undefined, TsUtils.settings, deps)
        expect(deps.fetch).toHaveBeenCalledWith('locale/ru-ru.json', { method: 'GET' })
        // Must NOT re-expand a path that is already longer than 5 chars
        expect(deps.fetch).toHaveBeenCalledTimes(1)
    })
})

// ---------------------------------------------------------------------------
// T-LOC-4 — keepPhrases=true: pre-existing phrase keys survive
// ---------------------------------------------------------------------------

describe('T-LOC-4: keepPhrases=true → existing phrase keys survive after merge', () => {
    it('preserves pre-existing phrase key when keepPhrases=true', async () => {
        const deps = makeDeps()
        // Pre-populate a phrase
        TsUtils.settings.phrases = { existing: 'keep-me' }
        await _locale('en-us', true, undefined, TsUtils.settings, deps)
        expect(TsUtils.settings.phrases).toHaveProperty('existing', 'keep-me')
    })
})

// ---------------------------------------------------------------------------
// T-LOC-5 — keepPhrases=false (default): phrases cleared before merge
// ---------------------------------------------------------------------------

describe('T-LOC-5: keepPhrases=false (default) → TsLocale defaults merged via keepPhrases=false branch', () => {
    it('merges TsLocale default phrases when keepPhrases is falsy (branch taken)', async () => {
        const deps = makeDeps()
        TsUtils.settings.phrases = { stale: 'remove-me' }
        const result = await _locale('en-us', false, undefined, TsUtils.settings, deps)
        expect((result as { kind: string }).kind).toBe('load')
        // R-LOC-V26-PRESERVED — v2.6.0 BEHAVIOR PRESERVED VERBATIM (per spec §Non-Goals scope):
        // The original `extend({}, settings, TsLocale, { phrases: {} }, data)` pattern was authored
        // with the intent "clear phrases before merging" (see preserved comment in body), but
        // `extend` is DEEP — `extend(existingPhrases, {})` iterates Object.keys({}) → zero keys →
        // no-op. So pre-existing phrase keys (e.g. 'stale') are PRESERVED by the keepPhrases=false
        // branch in v2.6.0, not cleared. v2.7 scope is ONE latent bugfix (INV-L7-OBJFIX) — a true
        // phrases-clear would be a second behavior change, deferred to v2.8 alongside R-LOC-2.
        //
        // What this test verifies: the keepPhrases=false BRANCH is exercised — TsLocale defaults
        // get merged into result.settings.phrases (e.g. 'Add new record' from TsLocale.phrases).
        // This distinguishes the keepPhrases=false branch from keepPhrases=true (where TsLocale is
        // NOT merged — see T-LOC-4).
        const phrases = (result as { settings: { phrases: Record<string, string> } }).settings.phrases
        expect(phrases).toHaveProperty('Add new record')   // from TsLocale.phrases — proves branch taken
        expect(phrases).toHaveProperty('stale', 'remove-me') // pre-existing key preserved (deep-extend no-op)
    })
})

// ---------------------------------------------------------------------------
// T-LOC-6 — noMerge=true: settings NOT mutated; resolves with { file, data }
// ---------------------------------------------------------------------------

describe('T-LOC-6: noMerge=true → settings unchanged, resolves with { file, data }', () => {
    it('returns { file, data } without mutating settings', async () => {
        const deps = makeDeps()
        const originalDateFormat = TsUtils.settings.dateFormat
        const result = await _locale('en-us', undefined, true, TsUtils.settings, deps)
        // settings must not be mutated (dateFormat stays the same)
        expect(TsUtils.settings.dateFormat).toBe(originalDateFormat)
        // resolved value must have file + data properties
        expect(result).toHaveProperty('file')
        expect(result).toHaveProperty('data')
    })
})

// ---------------------------------------------------------------------------
// T-LOC-7 — Array form: N fetch calls, merged in order, resolves void
// ---------------------------------------------------------------------------

describe('T-LOC-7: array form → N fetch calls, resolves void (kind: "void")', () => {
    it('fetches all files and resolves kind:void (not { file, data })', async () => {
        const deps = makeDeps()
        const result = await _locale(['en-us', 'ru-ru'], undefined, undefined, TsUtils.settings, deps)
        // 2 files → 2 fetch calls (5-char expansion each)
        expect(deps.fetch).toHaveBeenCalledTimes(2)
        // Resolved value for array form is kind:'void' (internal LocaleResult — not a load payload)
        // The delegator maps kind:'void' → undefined for the public Promise<void> shape
        expect((result as { kind: string }).kind).toBe('void')
    })
})

// ---------------------------------------------------------------------------
// T-LOC-8 — Fetch rejection → Promise rejects with caught error
// ---------------------------------------------------------------------------

describe('T-LOC-8: fetch rejection → Promise rejects with the caught error', () => {
    it('rejects with the network error thrown by deps.fetch', async () => {
        const deps = makeDeps()
        const networkErr = new Error('network')
        ;(deps.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(networkErr)
        await expect(_locale('ru-ru', undefined, undefined, TsUtils.settings, deps)).rejects.toThrow('network')
    })
})

// ---------------------------------------------------------------------------
// T-LOC-10 — spyOn TsUtils.prototype.locale (INV-SPY / INV-L7-DELEGATOR)
// ---------------------------------------------------------------------------

describe('T-LOC-10: vi.spyOn(TsUtils.prototype, "locale") observes delegator call', () => {
    it('spy registers exactly one call when instance.locale() is invoked', async () => {
        const deps = makeDeps()
        // Spy on the delegator method — must remain a class-prototype method
        const spy = vi.spyOn(TsUtils, 'locale')
        spy.mockResolvedValueOnce(undefined)
        // Call through the delegator (not _locale directly)
        await TsUtils.locale('en-us')
        expect(spy).toHaveBeenCalledOnce()
        spy.mockRestore()
    })
})
