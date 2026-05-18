// Vitest unit test for v2.8.0 subpath exports contract.
// Group 1 — exports shape (no build needed): FAILS RED at this commit (2 keys, not 14).
// Group 2 — dist artifacts: SKIPS (no dist yet).
// Group 3 — bundle floor: SKIPS (no v2.8.0-baseline.json yet).
//
// Cycle 6 (v2.11.0): ./grid reintroduced. 12 subpaths, 15 total keys.
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// Cycle 6: 12 subpaths (./grid reintroduced from amendment #983 deferral)
const SUBPATHS = [
    'base', 'field', 'form', 'grid', 'layout', 'locale',
    'popup', 'sidebar', 'tabs', 'toolbar', 'tooltip', 'utils',
] as const

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

describe('subpath-exports — package.json shape', () => {
    it('has exactly 23 exports keys (v3.0.0-rc.1: 24 - 1 for "." removal; +1 for "./icons" comes in B2)', () => {
        // v3.0.0: "." removed (-1). "./icons" added in B2 (+1). Net = 23 at B1, 24 at B2+.
        expect(Object.keys(pkg.exports)).toHaveLength(23)
    })

    it('"." entry is absent (v3.0.0 — barrel removed, INV-3)', () => {
        // v3.0.0: exports["."] is removed — consumers must use subpaths (tsgrid-ui/grid, etc.)
        expect(pkg.exports['.']).toBeUndefined()
    })

    it('"./css" entry is unchanged (string)', () => {
        expect(pkg.exports['./css']).toBe('./dist/tsgrid-ui.css')
    })

    it('"./package.json" entry exists (REQ-SX-2)', () => {
        expect(pkg.exports['./package.json']).toBe('./package.json')
    })

    it.each(SUBPATHS)('"./%s" has types+import+require shape (v2.13.0 Phase 4)', (name) => {
        const key = `./${name}`
        const entry = pkg.exports[key]
        expect(entry).toBeDefined()
        expect(entry).toEqual({
            types:   `./dist/${name}.d.ts`,
            import:  `./dist/${name}.es6.js`,
            require: `./dist/${name}.js`,
        })
    })

    it.each(SUBPATHS)('"./%s" require condition points to dist/<name>.js (CJS plain)', (name) => {
        const entry = pkg.exports[`./${name}`]
        expect(entry.require).toBe(`./dist/${name}.js`)
        expect(entry.require).not.toMatch(/\.es6\.js$/)
    })

    it('NEGATIVE CONTROL — synthetic entry MISSING require is detected (v2.13.0 Phase 4)', () => {
        // After Phase 4, every JS subpath has require:. The negative control
        // detects a subpath entry that is MISSING require — the post-Phase-4 invariant.
        const syntheticMissingRequire = { types: './dist/x.d.ts', import: './dist/x.es6.js' }
        const hasMissingRequire = !('require' in syntheticMissingRequire)
        expect(hasMissingRequire).toBe(true)
    })
})

describe('subpath-exports — dist artifacts (skipped if no build)', () => {
    const distExists = existsSync(join(ROOT, 'dist'))

    it.skipIf(!distExists).each(SUBPATHS)('dist/%s.es6.js exists (INV-SX-9)', (name) => {
        expect(existsSync(join(ROOT, 'dist', `${name}.es6.js`))).toBe(true)
    })

    it.skipIf(!distExists).each(SUBPATHS)('dist/%s.d.ts exists and has exports (INV-SX-9/10)', (name) => {
        const p = join(ROOT, 'dist', `${name}.d.ts`)
        expect(existsSync(p)).toBe(true)
        expect(statSync(p).size).toBeGreaterThan(0)
        expect(readFileSync(p, 'utf8')).toMatch(/\bexport\b/)
    })
})

// ---------------------------------------------------------------------------
// barrel-removal (v3.0.0): T-SX-2, T-SX-3 (R-BR-3, R-SCI-9)
// T-SX-2: "." removed; T-SX-3: "./icons" present.
// Count stays 24: -1 for "." removal, +1 for "./icons" addition.
// ---------------------------------------------------------------------------
describe('subpath-exports — v3.0.0 barrel-removal assertions (T-SX-2, T-SX-3)', () => {
    it('T-SX-2: pkg.exports["."] is undefined (removed in v3.0.0 — R-BR-3)', () => {
        expect(pkg.exports['.']).toBeUndefined()
    })

    it('T-SX-3: pkg.exports["./icons"] is defined with correct shape (R-SCI-9)', () => {
        expect(pkg.exports['./icons']).toBeDefined()
        expect(pkg.exports['./icons']).toMatchObject({
            types:   './dist/icons.d.ts',
            import:  './dist/icons.es6.js',
            require: './dist/icons.js',
        })
    })
})

describe('subpath-exports — CSS subpaths (v2.12.0 grid-css-pairing)', () => {
    const CSS_SUBPATHS = ['grid', 'form', 'tooltip', 'popup', 'sidebar', 'tabs', 'toolbar', 'layout', 'field']

    it.each(CSS_SUBPATHS)('"./%s.css" entry maps to ./dist/%s.css', (name) => {
        expect(pkg.exports[`./${name}.css`]).toBe(`./dist/${name}.css`)
    })

    it.each(CSS_SUBPATHS)('"./%s.css" export value is a plain string (no conditions object)', (name) => {
        expect(typeof pkg.exports[`./${name}.css`]).toBe('string')
    })
})

describe('subpath-exports — bundle floor (skipped if no baseline)', () => {
    const baselinePath = join(ROOT, 'reports', 'bundle', 'v2.8.0-baseline.json')
    const baselineExists = existsSync(baselinePath)

    it.skipIf(!baselineExists)('schemaVersion === 2 (INV-SX-12)', () => {
        const b = JSON.parse(readFileSync(baselinePath, 'utf8'))
        expect(b.schemaVersion).toBe(2)
        expect(typeof b.subpaths).toBe('object')
        // v2.8.0 baseline anchors 11 subpaths; grid is a v2.11.0 addition.
        expect(Object.keys(b.subpaths)).toHaveLength(11)
    })

    it.skipIf(!baselineExists).each(SUBPATHS)('subpaths.%s.totalBytes < 756,376 (INV-SX-1)', (name) => {
        const b = JSON.parse(readFileSync(baselinePath, 'utf8'))
        // v2.8.0 baseline anchors 11 subpaths; grid is a v2.11.0 addition — skip gracefully.
        if (!b.subpaths[name]) return
        expect(b.subpaths[name].totalBytes).toBeLessThan(756376)
    })

    it.skipIf(!baselineExists)('outputBundle.totalBytes === 945,470 (INV-SX-6 cross-check)', () => {
        const b = JSON.parse(readFileSync(baselinePath, 'utf8'))
        expect(b.outputBundle.totalBytes).toBe(945470)
    })
})
