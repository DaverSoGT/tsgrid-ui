// Byte-floor guard for Phase 4 CJS subpath bundles (R-CSP-14, R-CSP-22).
// Range = [floor(actual * 0.90), ceil(actual * 1.30)] — 30% headroom matches
// R2 contingency from memory #1078 Rule 2 (frozen-artifact touch).
//
// Baseline values measured during PR #1 pre-flight build (G-1 gate, engram #1102),
// frozen here in PR #2 after consuming the actual build output. Update only when a
// deliberate refactor of a widget changes its inlined-dep set.
//
// G-1 actual measurements (PR #1, Block 6 first build):
//   locale: 4854 | base: 33214 | utils: 128870 | popup: 162017
//   tooltip: 247246 | tabs: 270543 | toolbar: 294038 | sidebar: 308447
//   field: 314910 | layout: 359777 | form: 473701 | grid: 703346
//
// Tightened ranges: low = floor(actual * 0.90), high = ceil(actual * 1.30)
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

const BYTE_BASELINES: Record<string, { min: number; max: number }> = {
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

const SUBPATHS = Object.keys(BYTE_BASELINES) as Array<keyof typeof BYTE_BASELINES>
const distExists = existsSync(join(ROOT, 'dist'))

describe('cjs-subpath-bytes — per-file byte-floor guard (R-CSP-14, R-CSP-22)', () => {
    it('package version is 2.13.0 (Phase 4 release anchor)', () => {
        expect(pkg.version).toBe('2.13.0')
    })

    it.skipIf(!distExists).each(SUBPATHS)(
        'dist/%s.js exists (CJS subpath bundle present)',
        (name) => {
            const p = join(ROOT, 'dist', `${name}.js`)
            expect(existsSync(p)).toBe(true)
        }
    )

    it.skipIf(!distExists).each(SUBPATHS)(
        'dist/%s.js size is within [min, max] baseline range (R-CSP-14)',
        (name) => {
            const p = join(ROOT, 'dist', `${name}.js`)
            expect(existsSync(p)).toBe(true)
            const { size } = statSync(p)
            const { min, max } = BYTE_BASELINES[name]
            expect(size, `${name}.js size ${size} bytes is below floor ${min} bytes`).toBeGreaterThanOrEqual(min)
            expect(size, `${name}.js size ${size} bytes exceeds ceiling ${max} bytes`).toBeLessThanOrEqual(max)
        }
    )
})
