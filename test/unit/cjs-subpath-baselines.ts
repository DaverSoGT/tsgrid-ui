// Shared byte-floor baselines for the 12 CJS subpath bundles emitted by
// tsup Block 6 (Phase 4 / v2.13.0). Extracted out of cjs-subpath-bytes.test.ts
// to close S-2 from verify report #1104 — future tests that need the same
// baselines (e.g. bundle-snapshot CJS observability if it ever lands, or a
// rollup-quality cycle) can import from one source of truth.
//
// Range = [floor(actual * 0.90), ceil(actual * 1.30)] — 30% headroom matches
// R2 contingency from memory #1078 Rule 2 (frozen-artifact touch).
//
// Baseline values measured during PR #1 pre-flight build (G-1 gate,
// engram #1102), frozen here in PR #2 after consuming the actual build
// output. Update ONLY when a deliberate refactor of a widget changes its
// inlined-dep set — drift means a real surface-size change worth a
// CHANGELOG note.
//
// G-1 actual measurements (PR #1, Block 6 first build):
//   locale: 4854 | base: 33214 | utils: 128870 | popup: 162017
//   tooltip: 247246 | tabs: 270543 | toolbar: 294038 | sidebar: 308447
//   field: 314910 | layout: 359777 | form: 473701 | grid: 703346

export const CJS_SUBPATH_BYTE_BASELINES: Record<string, { min: number; max: number }> = {
    locale:  { min:  4_369, max:   6_311 },
    base:    { min: 29_893, max:  43_178 },
    utils:   { min: 115_983, max: 167_531 },
    popup:   { min: 145_815, max: 210_622 },
    tooltip: { min: 222_521, max: 321_420 },
    tabs:    { min: 243_489, max: 351_706 },
    toolbar: { min: 264_634, max: 382_249 },
    sidebar: { min: 277_602, max: 401_181 },
    field:   { min: 283_419, max: 409_383 },
    layout:  { min: 323_799, max: 467_710 },
    form:    { min: 426_331, max: 615_811 },
    grid:    { min: 633_011, max: 914_350 },
}

export const CJS_SUBPATH_NAMES = Object.keys(CJS_SUBPATH_BYTE_BASELINES) as Array<keyof typeof CJS_SUBPATH_BYTE_BASELINES>
