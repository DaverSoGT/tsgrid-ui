# Changelog

All notable changes to **TsGrid UI** will be documented in this file.

## [Unreleased]

### Added (tooling)
- `pnpm bundle:analyze` — generate esbuild metafile + per-module advisory summary (`reports/bundle/latest.md`, gitignored).
- `pnpm bundle:snapshot -- --version=vX.Y.Z` — write committed baseline JSON to `reports/bundle/<version>-baseline.json`.
- `tsup.config.analyze.ts` — analyze-only tsup config (single ESM-non-min block + `metafile: true`); structurally isolated from `tsup.config.ts` (INV-ANALYZE-ISOLATION).
- `reports/bundle/v2.7.1-baseline.json` — v2.7.1 ESM-non-min per-module byte composition. This artifact unlocks Phase 2 (subpath exports) acceptance testing (INV-CYCLE-1-HARD-GATE).
- `reports/bundle/README.md` — schema + scope documentation.

### Internal
- Zero new devDependencies. Zero changes to `src/`. Zero changes to `dist/*.js` on production builds (byte-identical, verified via `shasum` gate).
- SEMVER: chore / no version bump. Next version bump (v2.8.0) reserved for Phase 2 (subpath exports).

## v2.7.1 — 2026-05-14

### Fixed

- **R-LOC-V26-PRESERVED — `keepPhrases=false` now actually clears phrases** (`src/tsutils-locale.ts:133`, string branch): The v2.6.0 / v2.7.0 implementation `deps.extend({}, settings, TsLocale, { phrases: {} }, data)` was a deep-merge no-op on the phrases sub-tree — `extend` is deep and `extend(existingPhrases, {})` iterates `Object.keys({})` → zero keys, leaving pre-existing phrase keys intact. v2.7.1 replaces this with the spread-override-before-extend idiom: `const phrasesCleared = { ...settings, phrases: {} }; deps.extend({}, phrasesCleared, TsLocale, data)`. Pre-existing `settings.phrases` keys are NOW cleared before the `TsLocale` + `data` phrase-merge, aligning with the original code comment "clear phrases from language before merging" (in place since v2.6.0). Covered by `T-LOC-5` (flipped) + `INV-L7-PHRASES-CLEAR` (string clause). See engram #925 (discovery).
- **R-LOC-2 — `_locale()` no longer mutates the caller's input array** (`src/tsutils-locale.ts:80,86`, array branch): Calling `await Utils.locale(['en-us', 'ru-ru'])` previously rewrote the caller's array in-place to `['locale/en-us.json', 'locale/ru-ru.json']` (alias mutation via `const localeArr = locale as string[]` + `localeArr[ind] = file`). v2.7.1 uses `.map()` upfront for path expansion, producing a fresh internal array; the caller's original array reference and contents are byte-identical post-call. Covered by new `T-LOC-11` + `INV-L7-IMMUTABLE-INPUT`.
- **R-V271-4 — Array-branch `mergedSettings` init now actually pre-resets phrases** (`src/tsutils-locale.ts:79`, array branch): `let mergedSettings = deps.extend({}, settings, { phrases: {} })` had the same deep-merge no-op as R-LOC-V26-PRESERVED — pre-existing `settings.phrases` keys leaked into the initial fanout accumulator. v2.7.1 replaces it with `let mergedSettings = deps.extend({}, { ...settings, phrases: {} })`, aligning with the comment "Pre-reset phrases before fanout" (in place since v2.7.0). Covered by new `T-LOC-12` + `INV-L7-PHRASES-CLEAR` (array clause).

### Tests

- `T-LOC-5` flipped + header rewritten: was `expect(phrases).toHaveProperty('stale', 'remove-me')`; now `expect(phrases).not.toHaveProperty('stale')`. Positive assertion `expect(phrases).toHaveProperty('Add new record')` retained (proves the `keepPhrases=false` branch still merges TsLocale defaults). Comment block removes the `R-LOC-V26-PRESERVED` preservation note and adds the `INV-L7-PHRASES-CLEAR` reference + "v2.7.1 PATCH: phrases-clear now works as documented" one-liner.
- `T-LOC-11` NEW: array-input immutability gate (`INV-L7-IMMUTABLE-INPUT`). Snapshots the caller's input array, awaits `_locale(input, ...)`, asserts `expect(input).toEqual(snapshot)` AND `expect(input).toBe(inputRef)`. Sub-assertion: `deps.fetch` was still called with expanded paths (`'locale/en-us.json'`, `'locale/ru-ru.json'`).
- `T-LOC-12` NEW: array-branch `mergedSettings` phrases-clear gate (`INV-L7-PHRASES-CLEAR`, array clause). Sets `TsUtils.settings.phrases = { stale: 'remove-me' }` pre-call; asserts post-call `result.settings.phrases` does NOT contain `stale`.
- Total Vitest tests: **299/299 GREEN** (v2.7.0 baseline: 297/297).

### Bundle

Delta vs v2.7.0 baseline (`e8d9a74e`):

| Artifact | v2.7.0 | v2.7.1 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 947,274 B | 947,277 B | +3 B | +0.0003% |
| `dist/tsgrid-ui.es6.js` (ESM) | 945,466 B | 945,470 B | +4 B | +0.0004% |
| `dist/tsgrid-ui.min.js` (CJS min) | 509,260 B | 509,263 B | +3 B | +0.0003% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 508,125 B | 508,129 B | +4 B | +0.0004% |
| `dist/tsgrid-ui.d.ts` | 94,446 B | 94,446 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.css` | 246,980 B | 246,979 B | -1 B | -0.0004% |
| `dist/tsgrid-ui.min.css` | 229,707 B | 229,706 B | -1 B | -0.0004% |

All within ±2% gate. PASSED. JS bundles grew by +3–4 B (3 small fixes + new INV-L7-* inline comments — Terser strips comments in min bundles so min delta is tiny). The `d.ts` is **byte-identical** to v2.7.0 (INV-L7-API PASS — `locale(` signature unchanged). CSS delta is icon-noise (non-deterministic gulp regen, ±1 B).

### BC

- `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file: string; data: unknown } | void>` — signature **BYTE-IDENTICAL** to v2.7.0. Public API surface unchanged. `dist/tsgrid-ui.d.ts` `locale(` line unchanged (INV-L7-API PASS).
- **Behavior corrections** (PATCH-classifiable per SemVer §6 — implementation now matches documented intent in all three cases):
  - `await Utils.locale(lang, false /* keepPhrases */)` no longer preserves pre-existing `settings.phrases` keys (now matches the in-code comment "clear phrases from language before merging").
  - `await Utils.locale([...])` no longer mutates the input array (caller's array reference + contents are byte-identical post-call).
  - The internal array-branch `mergedSettings` accumulator no longer leaks pre-existing phrase keys into the fanout.
- `src/index.ts` barrel — **byte-identical** to v2.7.0 (INV-7 PASS).
- SEMVER PATCH. BC verdict: NONE for consumers using the documented behavior; latent-bug-correction for consumers depending on the never-documented broken behavior (none identified in repo audit).

### Known issues

- **R-LOC-3** (carry-forward from v2.6 / v2.7): Locale extraction does NOT directly unblock formatter extraction. The `format()` family still has its own deps-injection requirement; will be tackled separately in v2.8 via a `FormatterDeps` cluster.
- `R-LOC-V26-PRESERVED`, `R-LOC-2`, `R-V271-4` — **REMOVED** (now fixed; see §Fixed above).

### Internal

- `INV-L7-PHRASES-CLEAR` (NEW invariant): When `keepPhrases=false` (string branch) OR array-branch init, the resulting `settings.phrases` MUST NOT contain keys from the pre-call `settings.phrases` that are absent from `TsLocale.phrases` (and `data.phrases` for the string branch). Gated by `T-LOC-5` (flipped) + `T-LOC-12` (new).
- `INV-L7-IMMUTABLE-INPUT` (NEW invariant): `_locale()` MUST NOT mutate the `locale` argument when it is an array. Caller's array reference + contents are byte-identical post-call. Gated by `T-LOC-11` (new).
- `INV-L7-LEAF` (carry, PASS): `tsutils-locale.ts` runtime imports limited to `./tslocale.js`; type-only from `./tsutils.js`. No tsbase/tsutils runtime imports.
- `INV-9` (carry, PASS): zero `this.X` references in `_locale()` body.
- `INV-LINT-INV8` canary (carry, PASS): `src/tsutils-*.ts` ESLint glob covers `tsutils-locale.ts`.

---

## v2.7.0 — 2026-05-14

### Refactor

- **`locale()` extraction — `LocaleDeps` deps-injection pattern**: Extracted the `TsUtils.locale()` method body (62 LOC, the largest remaining cluster in `tsutils.ts`) into `_locale()` in `src/tsutils-locale.ts` via a new minimal `LocaleDeps` interface (`{ extend: (target, ...sources) => object; fetch: (url, init?) => Promise<Response> }`). Class method `locale()` becomes a 4-line delegator: `return _locale(locale, keepPhrases, noMerge, this.settings, { extend: this.extend.bind(this), fetch: globalThis.fetch.bind(globalThis) }).then(result => { if (result.settings) this.settings = result.settings; return result.kind === 'load' ? { file: result.file, data: result.data } : undefined })`. Public signature `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file; data } | void>` is **byte-identical** to v2.6.0. `vi.spyOn(TsUtils.prototype, 'locale')` continues to work (prototype delegator — INV-SPY PASS). Follows the v2.3 `MessageDeps` / v2.6 `DateDeps` canonical patterns. Array-form branch uses **direct `_locale()` recursion** (not delegator round-trip — design OQ-2/D2) to keep the internal call graph leaf-friendly.
  - `LocaleDeps` / `LocaleResult` are **internal** types backing the deps-injection delegation pattern. They are NOT exported through `src/index.ts` barrel (INV-L7-DEPS-INTERNAL PASS; INV-7 byte-identical barrel maintained). Consumers of `TsUtils.locale()` are unaffected.

### Fixed

- **Object-form `Utils.locale({...})` Promise hang (R-LOC-4 / INV-L7-OBJFIX)**: The v2.6.0 `locale()` body had `if (typeof locale === 'object') { this.settings = this.extend({}, this.settings, TsLocale, locale); return }` — the bare `return` inside the `new Promise((resolve, reject) => {...})` executor neither called `resolve()` nor `reject()`, so the Promise hung **forever** for any object-form input. v2.7.0 replaces the bare `return` with a value-returning path: the extracted `async function _locale()` returns `{ kind: 'merge', settings: mergedSettings }` for the object branch; the delegator unwraps to `undefined` (matching the original public contract for object form). `await Utils.locale({ dateFormat: 'dd.mm.yyyy' })` now resolves within ~1 ms (was: pending forever). Covered by test `T-LOC-1` with `vitest timeout: 1000`.

### Tests

- Added 10-case safety-net suite for `_locale()` in `test/unit/tsutils-locale.test.ts` committed as Phase 4 RED before extraction (INV-TDD PASS — `c7e64b43` < `dda197ad` < `32538179`):
  - **T-LOC-1** — object-form `_locale({ dateFormat: 'dd.mm.yyyy' })` resolves within 1 s with `{ kind: 'merge', settings.dateFormat: 'dd.mm.yyyy' }` (INV-L7-OBJFIX gate)
  - **T-LOC-2** — 5-char string `'ru-ru'` auto-expanded to `'locale/ru-ru.json'` before `deps.fetch`
  - **T-LOC-3** — Full-path string `'locale/ru-ru.json'` passed verbatim (no double-expansion)
  - **T-LOC-4** — `keepPhrases=true` preserves pre-existing phrase keys in returned settings
  - **T-LOC-5** — `keepPhrases=false` (default) executes the TsLocale-merge branch; documents `R-LOC-V26-PRESERVED` (see Known Issues)
  - **T-LOC-6** — `noMerge=true` returns `{ kind: 'load', file, data }` without including merged settings
  - **T-LOC-7** — Array form `['en-us', 'ru-ru']` triggers N fetch calls and resolves `{ kind: 'void' }` (delegator maps to `undefined`)
  - **T-LOC-8** — `deps.fetch` rejection re-throws and rejects the returned Promise
  - **T-LOC-9** — Design constraint: T-LOC-2..T-LOC-8 pass in jsdom **without** a global `fetch` polyfill (proven by T-LOC-2..T-LOC-8 collectively)
  - **T-LOC-10** — `vi.spyOn(TsUtils, 'locale')` observes exactly one call when `TsUtils.locale('en-us')` is invoked (INV-SPY / INV-L7-DELEGATOR gate)
- Total Vitest tests: **297/297 GREEN** (v2.6.0 baseline: 288/288).

### Bundle

Delta vs v2.6.0 baseline:

| Artifact | v2.6.0 | v2.7.0 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 946,686 B | 947,274 B | +588 B | +0.0621% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,878 B | 945,466 B | +588 B | +0.0622% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,954 B | 509,260 B | +306 B | +0.0601% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,819 B | 508,125 B | +306 B | +0.0603% |
| `dist/tsgrid-ui.d.ts` | 94,446 B | 94,446 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.css` | 246,980 B | 246,980 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.min.css` | 229,707 B | 229,707 B | 0 B | 0.0000% |

All within ±2% gate. PASSED. The JS bundles grew by ~0.06% (the new `_locale` function body + deps wiring); the `d.ts` is **byte-identical** to v2.6.0 (INV-L7-API PASS — `locale(` signature unchanged, `LocaleDeps`/`LocaleResult` declared `@internal` and stripped by tsup `stripInternal: true`). CSS/min.css unchanged (no css edits in v2.7).

### BC

- `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file: string; data: unknown } | void>` — signature and (now-resolving) runtime behavior **BYTE-IDENTICAL** to v2.6.0 for all string/array inputs. **Object-form input changes**: previously hung forever (effectively unusable); now resolves with `undefined` after merging. Existing call sites using string/array inputs work unchanged; existing call sites using object-form were necessarily broken (Promise never settled) and now begin working.
- `src/index.ts` barrel — **byte-identical** to v2.6.0 (INV-7 PASS).
- `LocaleDeps` / `LocaleResult` — NEW **internal** types. NOT exported through `src/index.ts` barrel (INV-L7-DEPS-INTERNAL PASS). `LocaleResult` declared `/** @internal */` and stripped from the rolled d.ts. `LocaleDeps` is type-only at the delegator call site and does not affect the d.ts surface.
- SEMVER MINOR. BC verdict: NONE for string/array inputs; BUGFIX for object-form input (R-LOC-4).

### Known issues

- **R-LOC-2** (deferred from v2.6 — confirmed still present): Array-form input `await Utils.locale(['en-us', 'ru-ru'])` MUTATES the caller's input array (each 5-char code is rewritten in-place to `'locale/xx-xx.json'`). Preserved verbatim in v2.7. Candidate fix in v2.8.
- **R-LOC-V26-PRESERVED** (newly documented): `keepPhrases=false` branch in v2.6.0 had comment "clear phrases from language before merging" but the implementation `extend({}, settings, TsLocale, { phrases: {} }, data)` does **not** actually clear pre-existing phrase keys — `extend` is deep, and `extend(existingPhrases, {})` is a no-op. Pre-existing phrase keys survive the merge in both v2.6.0 and v2.7.0. v2.7 scope was constrained to **one** behavior change (R-LOC-4 — object-form hang), so this latent behavior is preserved verbatim with `T-LOC-5` documenting the actual semantics. Candidate fix in v2.8.
- **R-LOC-3** (carry-forward from v2.6): Locale extraction does NOT unblock formatter extraction. The `format()` family still has its own deps-injection requirement; will be tackled separately in v2.8 via a `FormatterDeps` cluster.

### Internal

- `src/tsutils-locale.ts` is a **leaf module** (INV-L7-LEAF PASS): zero runtime imports from `./tsbase.js` or `./tsutils.js`. Only `import type { TsUISettings } from './tsutils.js'` (erased at emit) and `import { TsLocale } from './tslocale.js'` (zero-dep data leaf). DAG depth unchanged.
- INV-9 (zero `this.` in extracted function body) PASS.
- INV-LINT-INV8 canary: `src/tsutils-*.ts` ESLint glob continues to cover the new file (verified by inserting `void arguments.length;` → `pnpm lint` EXIT 1 → revert → EXIT 0).

---

## v2.6.0 — 2026-05-13

### Refactor

- **`date()` extraction — `DateDeps` deps-injection pattern**: Extracted the `TsUtils.date()` method body (22 LOC, the sole `this.lang('Yesterday')` coupling in `tsutils.ts`) into `_date()` in `src/tsutils-datetime.ts` via a new minimal `DateDeps` interface (`{ lang: (phrase: string) => string }`). Class method `date()` becomes a one-line delegator: `return _date(dateStr, this.settings, { lang: this.lang.bind(this) })`. Public signature `TsUtils.date(dateStr: unknown): string` is **byte-identical** to v2.5.0. `vi.spyOn(TsUtils, 'date')` continues to work (prototype delegator). Follows the v2.3 `MessageDeps` / `NotifyDeps` canonical pattern.
  - `DateDeps` is an **internal** interface backing the deps-injection delegation pattern. It is NOT exported through `src/index.ts` barrel (INV-7 byte-identical). Consumers of `TsUtils.date()` are unaffected — the public method signature and runtime behavior are identical to v2.5.0 (same string outputs for all date inputs).
- **`TsTimeResult` dedup**: Promoted `interface TsTimeResult` in `src/tsutils-datetime.ts` from non-exported to `export interface TsTimeResult`. Deleted the local duplicate declaration in `src/tsutils.ts` (lines 102-107); replaced with `import type { TsTimeResult } from './tsutils-datetime.js'` (for internal use by `isTime()`) and `export type { TsTimeResult } from './tsutils-datetime.js'` (barrel re-export). Single source-of-truth now in `tsutils-datetime.ts`. Mirrors the `TsColorRgb` precedent (`tsutils.ts:104`). `dist/tsgrid-ui.d.ts` continues to declare `TsTimeResult` exactly once (INV-LOC-1 `grep -c` = 1, line 425). Existing `import type { TsTimeResult } from 'tsgrid-ui'` consumers continue to work unchanged — same d.ts reachability, different source file.

### Tests

- Added 7-case safety-net suite for `_date()` in `test/unit/tsutils-datetime.test.ts` committed as Phase 4 RED before extraction (INV-TDD PASS):
  - T-DATE-1 — empty string → `''`
  - T-DATE-2 — `null` → `''`
  - T-DATE-3 — invalid date string → `''`
  - T-DATE-4 — today (frozen clock, `vi.useFakeTimers()`) → regex match on `<span title="...">H:MM am|pm</span>`
  - T-DATE-5 — yesterday (frozen clock) → regex match on `<span title="May 12, 2026 ...">Yesterday</span>` (proves `deps.lang` is called)
  - T-DATE-6 — Unix timestamp (older) → `<span title="...">` with month-day-year
  - T-DATE-7 — older date string → `<span title="...">` with month-day-year
- `vi.useFakeTimers()` / `vi.useRealTimers()` wrap the entire `_date()` describe block (INV-DATE-TIMEFREEZE PASS). Total Vitest tests: **288/288 GREEN** (v2.5.0 baseline: 280/280).

### Bundle

Delta vs v2.5.0 baseline:

| Artifact | v2.5.0 | v2.6.0 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 946,611 B | 946,686 B | +75 B | +0.0079% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,804 B | 944,878 B | +74 B | +0.0078% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,902 B | 508,954 B | +52 B | +0.0102% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,768 B | 507,819 B | +51 B | +0.0100% |
| `dist/tsgrid-ui.d.ts` | 93,022 B | 94,446 B | +1,424 B | +1.5308% |

All within ±2% gate. PASSED. The JS bundles are essentially byte-stable (≤0.011%) — the mechanical extraction added nothing meaningful at runtime. The `d.ts` grew by +1,424 B because `TsTimeResult` is now emitted as a named export from `tsutils-datetime.ts` (its source-of-truth file) rather than transitively via `isTime()` from `tsutils.ts`; additionally `DateDeps` is declared in `tsutils-datetime.ts` and included in the rolled d.ts.

**Note on P6 dist commit**: `pnpm build` was run at P6-DEDUP to enable the INV-LOC-1 audit-trail gate (`grep -c` = 1 in committed dist). P8 re-emits dist with the `v2.6.0` version banner baked into the JS headers. This is intentional and mirrors the v2.5.0 release commit (`51c00836`) pattern.

### BC

- `TsUtils.date(dateStr: unknown): string` — signature and runtime behavior **BYTE-IDENTICAL** to v2.5.0. All existing call sites work unchanged.
- `TsUtils.isTime(val: unknown, retTime?: boolean): boolean | TsTimeResult` — signature **BYTE-IDENTICAL** to v2.5.0.
- `TsTimeResult` — shape `{ hours: number; minutes: number; seconds: number }` unchanged. Continues to be reachable in `dist/tsgrid-ui.d.ts` at the same surface. Existing `import type { TsTimeResult } from 'tsgrid-ui'` consumers unaffected.
- `DateDeps` — NEW **internal** interface. Not exported through `src/index.ts` barrel (INV-7 byte-identical). Consumers do not depend on it; `_date()` is not a public export. Spec requirement A-4 (emit `DateDeps` in d.ts as a named export) is NOT honored because honoring it would require modifying `src/index.ts`, violating INV-7. The type IS present in the rolled d.ts (tsutils-datetime.ts is included by tsup), but is not consumer-reachable via a top-level import path. This is a documented spec divergence: INV-7 (backwards compat, blocking) takes precedence over A-4 (additive surface, non-blocking for existing consumers). Future revision: export `DateDeps` from `src/index.ts` if consumers need it.
- `src/index.ts` barrel — **byte-identical** to v2.5.0 (INV-7 PASS).
- SEMVER MINOR. BC verdict: NONE.

### Internal

- v2.5 SUGG-5 (INV-8 over `src/tsutils-color.ts`) **CLOSED by verification**: ESLint `no-restricted-syntax` glob `src/tsutils-*.ts` already covers `tsutils-color.ts`. The two `arguments` occurrences at lines 110 and 145 of that file are inside explanatory comments (`// ... example: arguments[0]...`), not AST nodes — the rule does not fire on comment text. Confirmed by INV-LINT-INV8 canary: injecting `void arguments.length;` into `src/tsutils-datetime.ts` triggers `pnpm lint` EXIT 1 with the expected diagnostic; reverting restores EXIT 0. No code change required. No carry-forward to v2.7+ SUGG list.

---

## v2.5.0 — 2026-05-13

### Refactor

Decomposed the **date-time cluster** (8 methods, 293 LOC) out of `TsUtils` into a new leaf module `src/tsutils-datetime.ts` — **no breaking changes**, public API preserved. Class methods remain; bodies are now one-line delegators routing to pure functions in the sibling module.

- `src/tsutils-datetime.ts` — `isDate`, `isTime`, `isDateTime`, `age`, `interval`, `formatDate`, `formatTime`, `formatDateTime` extracted as stateless functions (~427 LOC including header + types + 8 function bodies). Zero `this.X` references in function bodies (INV-9); no runtime import from `tsbase.ts` or `tsutils.ts` (INV-4 leaf rule). Only allowed imports: `_isInt` from `tsutils-type-guards.js`; `TsUISettings` as a type-only import from `tsutils.js` (erased at emit — same precedent as `tsutils-message.ts` and `tsutils-type-guards.ts`).
- `settings` parameter injected by reference (`this.settings`) in each delegator so TsLocale runtime mutations to `fullmonths`, `shortmonths`, `dateFormat`, `timeFormat`, `datetimeFormat` flow through without restart.
- Intra-cluster cross-calls become module-level function references: `_isDateTime` calls `_isDate` + `_isTime` directly; `_formatDateTime` calls `_formatDate` + `_formatTime` directly; `_formatTime` calls `_isTime` directly (R-DT-2 / R-DT-8 mitigations — zero `this.X` in extracted bodies).
- `date()` stays in `tsutils.ts` (sole `this.lang('Yesterday')` coupling; deferred to v2.6 locale cycle). `formatters` initializer stays in `tsutils.ts` (goes through class delegators — one extra hop within bundle budget per R-DT-9).
- `src/tsutils.ts` shrinks from ~1,470 → ~1,183 LOC (293 cluster LOC removed, 24 LOC delegators added). Mirrors the v2.4 DOM cluster pattern (engram #889).

`TsUtils` singleton shape and all ~78 call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Tests

- Added 56 unit tests (224 → 280) across 8 method blocks in `test/unit/tsutils-datetime.test.ts`: `isDate` (12), `isTime` (8), `isDateTime` (7), `age` (8), `interval` (5), `formatDate` (5), `formatTime` (4), `formatDateTime` (3) + delegation spy (2). jsdom feasibility: 100% — no Playwright-only paths in this cluster. Safety-net tests committed as Phase 4 RED before extraction (INV-TDD PASS).

### Bundle

Delta vs v2.4.1 baseline:

| Artifact | v2.4.1 | v2.5.0 | Delta | % |
|----------|--------|--------|-------|---|
| `dist/tsgrid-ui.js` (CJS) | 946,553 B | 946,611 B | +58 B | +0.006% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,746 B | 944,804 B | +58 B | +0.006% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,818 B | 508,902 B | +84 B | +0.017% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,684 B | 507,768 B | +84 B | +0.017% |
| `dist/tsgrid-ui.d.ts` | 93,022 B | 93,022 B | 0 B | 0% |

All within ±2% gate. PASSED. The `+84 B` increase in minified bundles is expected noise from the delegator shim layer (same one-extra-hop pattern as v2.4 DOM cluster). The d.ts is byte-identical — extracted function bodies and the local `TsTimeResult` interface in `tsutils-datetime.ts` are internal, not emitted in the rolled d.ts.

### BC

Net-additive (new module + delegators). Public method signatures byte-identical OR narrowed-with-strict-refinement per documentation. `TsTimeResult` continues to be declared in `tsutils.ts` (no-export, emitted transitively in d.ts per v2.4.1 hotfix); the new `tsutils-datetime.ts` module declares a structurally identical local `TsTimeResult` for `_isTime`'s internal use — non-exported, not emitted in rolled d.ts. No consumer-visible type change. `vi.spyOn(TsUtils, 'X')` continues to work for all 8 extracted methods via class-prototype delegators (INV-SPY PASS). SEMVER MINOR. BC verdict: NONE.

---

## v2.4.1 — 2026-05-13

### Fixed

- **d.ts correctness** — `dist/tsgrid-ui.d.ts` referenced `TsFormatter` and `TsTimeResult` in public method signatures (`formatters: Record<string, TsFormatter>`, `isTime(...): boolean | TsTimeResult`) but did NOT declare them — they were stripped by tsup `stripInternal` in v2.4.0. Consumers compiling with strict TypeScript saw unresolved type references. Removed the `@internal` JSDoc tag from `TsFormatterExtra`, `TsFormatter`, and `TsTimeResult` in `src/tsutils.ts`; the three types remain non-exported but are now emitted in the rolled `.d.ts` because they're transitively referenced from public surface. SEMVER PATCH — runtime bundles byte-identical to v2.4.0; only the `.d.ts` grows by ~458 B (+0.49%).

### BC

`.d.ts` is now internally consistent; no other change. Public API surface, runtime, and bundles: UNCHANGED. SEMVER PATCH. BC verdict: NONE.

---

## v2.4.0 — 2026-05-13

### Added

- **Minified bundles** — new `dist/tsgrid-ui.min.js` (CJS, IIFE-wrapped) and `dist/tsgrid-ui.es6.min.js` (ESM). ~46% smaller than non-min counterparts (~508 KB vs ~947 KB). Non-min bundles remain the default for debugging; minified are opt-in by direct path.
- **ESM sourcemap** — `dist/tsgrid-ui.es6.js.map` shipped alongside the ESM bundle for consumer debugging. CJS sourcemap intentionally omitted (incompatible with the legacy IIFE wrapper rewrite).
- **ESLint enforcement of INV-8** — new `no-restricted-syntax` rule scoped to `src/tsutils-*.ts` blocks `arguments.length` (codifies the delegator-trap discovered in v2.1 / fixed in v2.3 into the lint gate).

### Refactor

Decomposed the **DOM cluster** (8 methods, ~397 LOC) out of `TsUtils` into a new leaf module `src/tsutils-dom.ts` — **no breaking changes**, public API preserved. Class methods remain; bodies are now one-line delegators routing to pure functions in the sibling module.

- `src/tsutils-dom.ts` — `transition`, `lock`, `unlock`, `getSize`, `getStrDimentions`, `getStrWidth`, `getStrHeight`, `bindEvents` extracted as stateless functions (~234 LOC). Zero `this.X` references in function bodies (INV-9); no import from `tsbase.ts` (INV-4 leaf rule).
- `TsLockOptions` interface moved to `tsutils-dom.ts` and re-exported via `tsutils.ts` barrel (TsCloneOptions / TsMessageOptions pattern). Public API unchanged.
- `lock()` internal `this.unlock(...)` call → direct module-level `unlock()` call (R-DOM-1 mitigation).
- `getStrDimentions()` internal `this.encodeTags(...)` → import `_encodeTags` from `tsutils-string.js` (R-DOM-2 mitigation).
- `src/tsutils.ts` shrinks from ~1,602 → ~1,470 LOC. **NET REPO DELTA: −18 LOC** (397 removed inline, 234 + 25 added in dom + delegators).

`TsUtils` singleton shape and all ~49+ call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Improved (type)

- `TsUtils.getStrDimentions(str, styles): { width: number; height: number }`, `TsUtils.getStrWidth(str, styles): number`, `TsUtils.getStrHeight(str, styles): number` — return types narrowed from accidental `any` to explicit `number`. **Type improvement, runtime-equivalent**; no behavior change. Consumers using strict tsconfig settings will see the tighter types (all previously valid call sites remain valid — `any → number` is a strict refinement).

### Internal

- `@internal` JSDoc + tsup `stripInternal: true` for private surface (`_msgDeps`/`_confirmDeps`/`_promptDeps`, plus `TsFormatterExtra`/`TsFormatter`/`TsTimeResult`). `dist/tsgrid-ui.d.ts` reduced ~1.07% (93,567 → 92,564 B). Larger reductions deferred to v2.5+ (root cause: `TsFormatter`/`TsTimeResult` referenced inline in public method signatures, so tsc re-emits them).
- `scripts/wrap-legacy.mjs` regex generalized to match esbuild's minified `module.exports=ui(_i);` form (anchors removed) — handles both `tsgrid-ui.js` and `tsgrid-ui.min.js` (R-WRAP-1 mitigation).

### Tests

- Added 27 unit tests (197 → 224) covering DOM cluster (lock/unlock/getSize/getStrDimentions/getStrWidth/getStrHeight/bindEvents). `transition` covered by Playwright smoke only (jsdom cannot observe CSS animations).

### Bundle

Non-min delta vs v2.3.0 baseline:
- `dist/tsgrid-ui.js`: 946,684 → 946,553 B (−0.014%)
- `dist/tsgrid-ui.es6.js`: 944,836 → 944,746 B (−0.010%)

New minified artifacts:
- `dist/tsgrid-ui.min.js`: ~509 KB (−46.3% vs non-min)
- `dist/tsgrid-ui.es6.min.js`: ~508 KB (−46.3%)

All within ±2% gate. PASSED.

### BC

Net-additive (new artifacts + type narrowing). Public method signatures: byte-identical for transition/lock/unlock/getSize/bindEvents. `getStrWidth/Height/getStrDimentions` types narrowed `any → number` (strict superset; no runtime change). SEMVER MINOR. BC verdict: NONE.

---

## v2.3.0 — 2026-05-13

### Refactor

Decomposed the **message cluster** (652 LOC) out of `TsUtils` into two new sibling modules — **no breaking changes**, public API byte-identical to v2.2.0. Class methods remain; bodies are now one-line delegators routing to plain functions in sibling modules.

- `src/tsutils-registry.ts` — `TsUi` widget registry + `checkName()` validation helper. Phase 0 Cycle-Break: severs the `tsbase ↔ tsutils` circular import that existed since v1.x. `tsbase.ts` now imports from `tsutils-registry.ts`, `tsutils-data.ts`, `tsutils-type-guards.ts`, and `query.js` directly — zero edges back into `tsutils.ts`.
- `src/tsutils-notify.ts` — `notify()` pure function + `NotifyDeps` DI interface. Imports only `query.js`; `this.tmp` state passed by reference via `deps.tmpSlot`.
- `src/tsutils-message.ts` — `normButtons()`, `_message()`, `_alert()`, `_confirm()`, `_prompt()` pure functions + `MessageDeps`, `NotifyDeps`, `ConfirmDeps`, `PromptDeps` DI interfaces + `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions` type definitions. The only sub-module permitted to import `TsBase` from `tsbase.ts` (required for event-mixin instantiation; documented carve-out to INV-4).

`TsUtils` singleton shape and all ~788+ call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Added

- New internal DI interfaces exported from `tsutils-message.ts`: `MessageDeps`, `ConfirmDeps`, `PromptDeps`.
- `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions` types relocated from inline declarations in `tsutils.ts` to `tsutils-message.ts`; re-exported via `tsutils.ts` barrel — all existing import paths remain valid.

### Fixed

- **`arguments.length == 1` overload trap** in `message()`, `confirm()`, and `prompt()`: the class delegator always passes 2 arguments to the extracted function, making `arguments.length` always `2` and silently breaking the single-arg `where-as-options` call form. Replaced with `options == null` (loose-equality covers both `undefined` and `null`). Behavior is a strict superset: additionally fixes `confirm(where, null)` and `prompt(where, null)` which previously assigned `null` to `msgOpts` and would crash on subsequent property access. Locked by parity tests (1-arg vs 2-arg-undefined produce identical DOM output for each method).

### Tests

- Added 82 unit tests (115 → 197): 6 registry (Phase 0), 17 notify (Phase 1), 15 normButtons (Phase 2), 15 message scaffold (Phase 3a), 14 message body/animation/parity (Phase 3b), 15 alert/confirm/prompt/parity (Phase 4).

### Bundle

Delta vs v2.2.0 baseline: `dist/tsgrid-ui.js` 946,684 B (+1,648 B, +0.17%), `dist/tsgrid-ui.es6.js` 944,836 B (+1,657 B, +0.18%). Within ±2% gate. PASSED.

### BC

Net-additive. All `TsUtils` method signatures, arities, return types, and runtime behavior unchanged. Three type definitions relocated (re-exported at original paths). SEMVER MINOR. BC verdict: NONE.

---

## v2.2.0 — 2026-05-13

### Added

- **`TsUtils.colorContrastValue(color1, color2): number`** — numeric companion to `colorContrast()` that returns the raw WCAG ratio as a `number` instead of a `.toFixed(2)` string. Consumers performing threshold checks no longer need to wrap the result in `Number(...)` or `parseFloat(...)`.

### Refactor

- `colorContrast()` now delegates to `colorContrastValue().toFixed(2)`. Output is byte-identical to v2.1.0; no behavior change.
- `tstoolbar.ts` background-color contrast check upgraded to the numeric API (`TsUtils.colorContrastValue('#fff', color) < 2`), removing the `Number(...)` cast.

### Tests

- Added 4 unit tests for `colorContrastValue` (111 → 115): typeof number, white/black ≥ 21 (max WCAG), identical = 1, parity with `colorContrast` string form via `.toFixed(2)`.

### BC

Net-additive. `colorContrast` return type and value unchanged. SEMVER MINOR. BC verdict: NONE.

---

## v2.1.0 — 2026-05-13

### Refactor

Decomposed `TsUtils` into 5 stateless sub-modules — **no breaking changes**, no public API surface change. The class still exists with the same shape; method bodies are now one-line delegators that route to plain functions in sibling modules.

- `src/tsutils-type-guards.ts` — 9 type-guard functions (`isInt`, `isFloat`, `isMoney`, `isHex`, `isAlphaNumeric`, `isEmail`, `isIpAddress`, `isPlainObject`, `isBin`). `isFloat`/`isMoney` accept a `Pick<TsUISettings, ...>` slice for locale-aware testing.
- `src/tsutils-color.ts` — 4 color math functions (`parseColor`, `hsv2rgb`, `rgb2hsv`, `colorContrast`) + `TsColorRgb` type. Dual-form dispatch (object-arg vs positional) preserved using `typeof` detection — more robust than `arguments.length` under the delegator pattern.
- `src/tsutils-data.ts` — 10 data helpers (`clone`, `extend`, `naturalCompare`, `normMenu`, `getNested`, `encodeParams`, `prepareParams`, `parseRoute`, `debounce`, `wait`) + `TsCloneOptions`, `TsNormMenuOptions` types. `prepareParams` accepts `defaultDataType` parameter.
- `src/tsutils-string.ts` — 10 string/HTML helpers (`stripSpaces`, `stripTags`, `encodeTags`, `decodeTags`, `escapeId`, `unescapeId`, `base64encode`, `base64decode`, `sha256`, `execTemplate`).
- `src/tsutils-marker.ts` — `marker` + private DOM regex helpers (`_clearMarkers`, `_replace`).

`TsUtils` singleton shape and all ~788 call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Tests

Added 27 unit tests (84 → 111): 15 color cluster (`parseColor`, `hsv2rgb`, `rgb2hsv`, `colorContrast`) + 2 `isBin` ratchet + 2 object-form regression locks (`hsv2rgb`/`rgb2hsv`) + 6 data ratchet (`getNested`, `normMenu`) + 2 string ratchet (`decodeTags`, `execTemplate`).

### Bundle

Delta vs v2.0.1 baseline: `dist/tsgrid-ui.js` +0.15% (944,879 → 943,454 bytes), `dist/tsgrid-ui.es6.js` +0.15% (943,022 → 941,597 bytes). Within ±2% gate. PASSED.

---

## v2.0.1 — 2026-05-13

### Fixed

- **`MIGRATION_v2.md` now included in the published npm tarball.** v2.0.0 omitted this file from `package.json` `files`, so `CHANGELOG.md` and `README.md` links pointing to `MIGRATION_v2.md` (codemod, bundle measurement, release checklist) broke on npmjs.com. No source code changes — package metadata only.

## v2.0.0 — 2026-05-09

### Breaking changes

**BC-1 — Event handler signatures changed (`CustomEvent` → `TsEventPayload`)**

All `on*` event handler properties across `TsGrid`, `TsForm`, and `TsField` now declare
`(event: TsEventPayload) => void` instead of `(event: CustomEvent) => void`.

This is a type-level correction: the runtime has always dispatched `TsEventPayload` objects,
never DOM `CustomEvent` instances. Consumers who explicitly annotated handlers with
`CustomEvent` will see a TypeScript compile error. Untyped or `any`-typed handlers are
unaffected. Mechanical migration via codemod — see [MIGRATION_v2.md § Codemod](MIGRATION_v2.md#codemod).

**BC-2 — Internal restructure; deep imports are unsupported**

`src/tsgrid.ts` has been decomposed from ~10,006 LOC into 8 sibling modules:
`grid-columns`, `grid-state`, `grid-data`, `grid-selection`, `grid-edit`, `grid-search`,
`grid-interaction`, `grid-render`. The public class `TsGrid` is now ~2,392 LOC (thin
orchestrator of one-liner delegators).

The public API surface is **UNCHANGED**: all method signatures, names, and behaviors are
preserved (verified by 84 Vitest + 38 Playwright tests). Consumers who import from the
public barrel (`import { TsGrid } from 'tsgrid-ui'`) require **no changes**. Subclasses
or code that inspects `TsGrid.prototype` directly may observe method bodies as one-line
delegators — this is expected behavior. Deep imports from internal paths
(`tsgrid-ui/src/*`) are not supported and may break.

### Bundle size disclosure

v2.0 is a structural refactor with no bundle reduction goal. Bundle size delta vs v1.0.1
baseline: **-0.19%** (actual: 941,597 bytes vs baseline: 943,401 bytes). No reduction is
claimed. Bundle improvements are deferred to v2.2 (multi-entry subpath exports +
tree-shaking). See [MIGRATION_v2.md § Bundle size measurement](MIGRATION_v2.md#bundle-size-measurement).

### Migration

See [MIGRATION_v2.md](MIGRATION_v2.md) for the codemod, full migration guide, and
release checklist.

---

## [1.0.1] — Consumer DX fixes

Patch release driven by integrating tsgrid-ui v1.0.0 in a real Angular 21 standalone project. Three changes, no breaking, no API removals.

### Added — `sideEffects` declaration

`package.json` now declares `"sideEffects": ["./dist/tsgrid-ui.css", "./dist/tsgrid-ui.min.css"]`. Modern bundlers (esbuild, Vite, webpack 5+, Rollup) can now tree-shake widgets the consumer does not import. Importing only `TsGrid` no longer drags `TsForm`, `TsLayout`, `TsSidebar`, `TsTabs`, `TsPopup`, `TsTooltip` into the final bundle.

### Added — public type exports

The barrel `src/index.ts` previously re-exported only the **classes** (`TsGrid`, `TsForm`, etc.). Auxiliary interfaces and types lived in `dist/tsgrid-ui.d.ts` but were inaccessible — consumers had to type their inputs as `any` or import from internal paths. v1.0.1 re-exports the full public type surface:

- **TsGrid**: `TsGridRecord`, `TsGridColumn`, `TsGridSearch`, `TsGridSortData`, `TsGridSelection`, `TsGridCellSelection`, `TsGridRange`, `TsGridRangeEndpoint`, `TsGridGroupBy`
- **TsField**: `TsFieldOptions`, `TsFieldElement`, `TsFieldNumericOptions`, `TsFieldColorOptions`, `TsFieldDateOptions`, `TsFieldTimeOptions`, `TsFieldDateTimeOptions`, `TsFieldListOptions`, `TsFieldEnumOptions`, `TsFieldFileOptions`
- **TsLayout**: `TsLayoutPanel`, `TsPanelType`, `TsPanelContent`
- **TsSidebar**: `TsSidebarRefreshOptions`, `TsSidebarUpdateOptions`, `TsSidebarSetCountOptions`, `TsSidebarFindOptions`, `TsSidebarSortOptions`
- **TsLocale / TsUtils**: `TsLocaleSettings`, `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions`, `TsMenuItem`, `TsColorRgb`, `TsLockOptions`, `TsCloneOptions`
- **Common**: `RecId`, `TsEventData`, `TsEventPayload`

Consumers can now write `import type { TsGridColumn, TsGridRecord } from 'tsgrid-ui'` and get full autocomplete + type checking.

### Added — `TsEventPayload` interface and `toSafeEvent()` helper

The per-class event-handler signatures (`onSelect: (event: CustomEvent) => void`) are misleading: the runtime always passes a `TsEvent` instance from the TsBase event system, **not** a DOM `CustomEvent`. The real payload contains a circular reference (`event.owner` ↔ `widget.activeEvents[]`), so calling `JSON.stringify(event)` throws "Converting circular structure to JSON". This breaks reactive state in any framework: Angular signals + JsonPipe, React state + Redux DevTools, Vue ref + Pinia, etc.

This release adds:

- **`interface TsEventPayload<TDetail>`** — accurate shape of the object passed to handlers, with the `owner` field documented as circular and unsafe to serialize. The misleading `(event: CustomEvent) => void` per-class declarations remain for backwards compatibility and will be corrected in v2.0.
- **`function toSafeEvent(event)`** — extracts a JSON-serializable subset (`type`, `phase`, `detail`, `isStopped`, `isCancelled`) for use in reactive state.

```ts
import { toSafeEvent } from 'tsgrid-ui'

grid.on('select', (event) => {
    mySignal.set(toSafeEvent(event)) // safe to JSON.stringify
})
```

### Bundle-size impact (measured)

Bundle in a fresh Angular 21 standalone project consuming only `TsGrid`:

| | v1.0.0 | v1.0.1 |
| --- | --- | --- |
| `main.js` raw | 506.18 KB | _re-measure pending_ |
| `main.js` gzip | 121.90 KB | _re-measure pending_ |

Re-measurement after publish lives in the `tsgrid-angular-example` demo repo.

## [1.0.0] — Hard Fork from w2ui v2.1

This is the initial public release of **TsGrid UI**, a hard fork of [w2ui](https://github.com/vitmalina/w2ui) by Vit Malina. See [README — Acknowledgments](README.md#acknowledgments) for the relationship to upstream and [MIGRATION-FROM-W2UI.md](MIGRATION-FROM-W2UI.md) for the complete renaming map if you're coming from w2ui.

### Identity changes (vs upstream w2ui v2.x)

- **Package name**: `w2ui` → `tsgrid-ui` (npm public registry).
- **Version reset**: starts at 1.0.0 (this is project v1; upstream w2ui continues independently).
- **JS globals renamed**: `w2grid` → `TsGrid`, `w2form` → `TsForm`, `w2field` → `TsField`, `w2layout` → `TsLayout`, `w2sidebar` → `TsSidebar`, `w2tabs` → `TsTabs`, `w2toolbar` → `TsToolbar`, `w2tooltip` → `TsTooltip`, `w2popup` → `TsPopup`. Helpers: `w2alert`/`w2confirm`/`w2prompt`/`w2color`/`w2date`/`w2menu`/`Dialog`/`w2utils`/`w2base`/`w2event`/`w2locale` → `TsAlert`/`TsConfirm`/`TsPrompt`/`TsColor`/`TsDate`/`TsMenu`/`TsDialog`/`TsUtils`/`TsBase`/`TsEvent`/`TsLocale`. Registry `w2ui` → `TsUi`. `query` and `Tooltip` (class name) kept unchanged.
- **TypeScript types renamed**: all `W2*Foo` types → `TsFoo` (e.g. `W2GridColumn` → `TsGridColumn`, `W2GridCellSelection` → `TsGridCellSelection`). Brand types `RecId`, `LayoutPanelId`, `FieldName` are kept (semantic, not library-tied).
- **CSS class prefix**: `.w2ui-*` → `.tsg-*` (~1500 reemplazos across source and stylesheets).
- **iconfont**: family name `w2ui-font` → `tsgrid-font`; classes `w2ui-icon-*` → `tsg-icon-*`.
- **dist filenames**: `dist/w2ui.{js,es6.js,d.ts,css}` → `dist/tsgrid-ui.{js,es6.js,d.ts,css}` (and minified variants).
- **jQuery compatibility shim removed**: `w2compat.ts` was deleted. TsGrid is ESM-native and does not register `$.fn.w2grid` etc. If you need jQuery support, use upstream w2ui.
- **Repo cleanup**: `demos/`, `server/`, `baseline/`, `es6mods/`, `libs/` moved to `legacy/` (excluded from npm publish).
- **License**: dual copyright — preserves `(c) 2014 Vit Malina` per MIT terms, adds `(c) 2026 DaverSoGT` for the fork.

### Inherited from the w2ui v2.1 TypeScript port (pre-fork)

These changes were applied to the local v2.1 baseline before the fork; they are preserved verbatim in TsGrid v1.0:

- **Full TypeScript-native source**: 17 `.ts` files (14 widgets + 2 barrels + 1 types), zero `.js` in `src/`.
- **Strict mode**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`. Zero `@ts-nocheck`.
- **Bundler**: tsup (esbuild) for JS — dual ESM + CJS + `.d.ts` rollup. Gulp retains Less + iconfont.
- **`.d.ts` rollup**: single file with all public exports.
- **Branded primitive types**: `RecId`, `LayoutPanelId`, `FieldName` (compile-only, zero runtime cost).
- **Discriminated `getSelection`**: `TsGrid.getSelectionRows()` + `TsGrid.getSelectionCells()` typed methods plus a back-compat wrapper that returns `RecId[] | number[] | TsGridCellSelection[]` (no longer `any[]`).
- **Vitest unit test suite**: 84 tests across `TsUtils` helpers, `TsBase` event system, and `types` brands.
- **Playwright smoke harness**: 38 tests across all widgets at three viewport sizes.
- **Consumer-smoke gate**: independent `tsc --noEmit` of the public API surface as a consumer would import it.
- **Bug fixes uncovered during the TS port**:
  - `'fuction'` typo in `prepareParams()` (silently ignored custom-function `dataType`).
  - Two `??` always-left branches in `w2form` and `w2grid` save error handlers.
  - Type mismatch in `w2grid` line-number column fallback (`{ field: col_ind }` number → string).
  - `w2sidebar.getNodeHTML()` referenced `window.self` instead of the local instance.
- **Behavioral notes preserved**:
  - `TsForm` input/textarea handlers use delegated-event objects (`{ delegate: 'input, textarea' }`).
  - `TsUtils.locale()` returns `Promise<{ file, data } | void>`.

---

## Pre-fork history (w2ui v2.x)

The pre-fork local commit chain (53 ts-port commits + 16 follow-up commits leading up to v2.1 final) is preserved in git history under the same `master` branch. See git log between the initial port commit and the F1 sealing commit (`d90c038e`) for detail.

For upstream w2ui releases (v1.x stable, v2.0 RC), refer to [vitmalina/w2ui releases](https://github.com/vitmalina/w2ui/releases).
