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
    it('has exactly 15 exports keys (Cycle 6: 12 subpaths + ".", "./css", "./package.json")', () => {
        expect(Object.keys(pkg.exports)).toHaveLength(15)
    })

    it('"." entry is byte-identical shape (INV-SX-6)', () => {
        expect(pkg.exports['.']).toEqual({
            types:   './dist/tsgrid-ui.d.ts',
            import:  './dist/tsgrid-ui.es6.js',
            require: './dist/tsgrid-ui.js',
        })
    })

    it('"./css" entry is unchanged (string)', () => {
        expect(pkg.exports['./css']).toBe('./dist/tsgrid-ui.css')
    })

    it('"./package.json" entry exists (REQ-SX-2)', () => {
        expect(pkg.exports['./package.json']).toBe('./package.json')
    })

    it.each(SUBPATHS)('"./%s" has correct types+import shape, no require (INV-SX-5)', (name) => {
        const key = `./${name}`
        const entry = pkg.exports[key]
        expect(entry).toBeDefined()
        expect(entry).toEqual({
            types:  `./dist/${name}.d.ts`,
            import: `./dist/${name}.es6.js`,
        })
        expect('require' in entry).toBe(false)
    })

    it('NEGATIVE CONTROL — synthetic subpath with require IS detected (SC-SX-8, DD-SX-H)', () => {
        const synthetic = {
            ...pkg.exports,
            './popup': { types: './x.d.ts', import: './x.js', require: './x.cjs' },
        }
        const bad = Object.entries(synthetic)
            .filter(([k, v]) => k !== '.' && typeof v === 'object' && v !== null && 'require' in (v as object))
        expect(bad.length).toBeGreaterThan(0)
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
