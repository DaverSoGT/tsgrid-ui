/**
 * barrel-removed.test.ts — TDD RED commit (A1)
 *
 * Asserts the hard-removal of the flat barrel and deprecated scripts
 * introduced in v3.0.0 (R-BR-1..R-BR-8 from spec #1138).
 *
 * At commit A1 these assertions FAIL (barrel files still exist).
 * At commit B1 these assertions all pass GREEN.
 *
 * Tests are filesystem / package.json text assertions only — no runtime imports.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const distExists = existsSync(join(ROOT, 'dist'))

// ---------------------------------------------------------------------------
// Suite 1 — source file deletions (R-BR-1, R-BR-2, R-BR-6)
// ---------------------------------------------------------------------------

describe('barrel-removed — source file deletions', () => {
    it('T-BR-1: src/index.ts does NOT exist (R-BR-1)', () => {
        expect(existsSync(join(ROOT, 'src', 'index.ts'))).toBe(false)
    })

    it('T-BR-2: src/index-legacy.ts does NOT exist (R-BR-2)', () => {
        expect(existsSync(join(ROOT, 'src', 'index-legacy.ts'))).toBe(false)
    })

    it('T-BR-3: scripts/patch-deprecated.mjs does NOT exist (R-BR-6a)', () => {
        expect(existsSync(join(ROOT, 'scripts', 'patch-deprecated.mjs'))).toBe(false)
    })

    it('T-BR-4: scripts/wrap-legacy.mjs does NOT exist (R-BR-6b)', () => {
        expect(existsSync(join(ROOT, 'scripts', 'wrap-legacy.mjs'))).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// Suite 2 — package.json exports and top-level field removals (R-BR-3, R-BR-4)
// ---------------------------------------------------------------------------

describe('barrel-removed — package.json exports and field removals', () => {
    it('T-BR-5: package.json#exports["."] is undefined (R-BR-3)', () => {
        expect(pkg.exports['.']).toBeUndefined()
    })

    it('T-BR-6: package.json top-level "main" field is undefined (R-BR-4)', () => {
        expect(pkg.main).toBeUndefined()
    })

    it('T-BR-7: package.json top-level "module" field is undefined (R-BR-4)', () => {
        expect(pkg.module).toBeUndefined()
    })

    it('T-BR-8: package.json top-level "types" field is undefined (R-BR-4)', () => {
        expect(pkg.types).toBeUndefined()
    })
})

// ---------------------------------------------------------------------------
// Suite 3 — build:js script no longer references deleted scripts (R-BR-6c)
// ---------------------------------------------------------------------------

describe('barrel-removed — build:js script cleanup (R-BR-6c)', () => {
    it('T-BR-6c-1: scripts["build:js"] does NOT reference patch-deprecated.mjs', () => {
        expect(pkg.scripts['build:js']).not.toContain('patch-deprecated')
    })

    it('T-BR-6c-2: scripts["build:js"] does NOT reference wrap-legacy.mjs', () => {
        expect(pkg.scripts['build:js']).not.toContain('wrap-legacy')
    })
})

// ---------------------------------------------------------------------------
// Suite 4 — consumer smoke has no barrel import (R-BR-7)
// ---------------------------------------------------------------------------

describe('barrel-removed — consumer-smoke.ts has no flat barrel import (R-BR-7)', () => {
    it('T-BR-9: test/consumer-smoke.ts has no direct import from the flat barrel package (R-BR-7)', () => {
        const text = readFileSync(join(ROOT, 'test', 'consumer-smoke.ts'), 'utf8')
        // Must not import from 'tsgrid-ui' bare (non-subpath)
        expect(text).not.toMatch(/from 'tsgrid-ui'(?!\/)/)
        // Must not import from the relative barrel path (src/index)
        expect(text).not.toMatch(/from '\.\.\/src\/index/)
    })
})

// ---------------------------------------------------------------------------
// Suite 5 — version bump (T-PKG-1 allow-list at A1/B1; tightened in B3)
// ---------------------------------------------------------------------------

describe('barrel-removed — version bump (R-BR-8)', () => {
    it('T-PKG-1: package.json version is 3.0.0-rc.1 or 3.0.0 (v3.0 cycle pre-release allow-list)', () => {
        expect(['3.0.0-rc.1', '3.0.0']).toContain(pkg.version)
    })
})

// ---------------------------------------------------------------------------
// Suite 6 — barrel-deprecation test file removed
// ---------------------------------------------------------------------------

describe('barrel-removed — barrel-deprecation.test.ts is gone', () => {
    it('test/unit/barrel-deprecation.test.ts does NOT exist (superseded by barrel-removed.test.ts)', () => {
        expect(existsSync(join(ROOT, 'test', 'unit', 'barrel-deprecation.test.ts'))).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// Suite 7 — dist artifacts (skipped if dist/ does not exist) (R-BR-5)
// ---------------------------------------------------------------------------

describe('barrel-removed — dist barrel artifacts absent after build (R-BR-5)', () => {
    it.skipIf(!distExists)('T-BR-10: dist/tsgrid-ui.es6.js does NOT exist (R-BR-5)', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.es6.js'))).toBe(false)
    })

    it.skipIf(!distExists)('T-BR-5-js: dist/tsgrid-ui.js does NOT exist (R-BR-5)', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.js'))).toBe(false)
    })

    it.skipIf(!distExists)('T-BR-5-dts: dist/tsgrid-ui.d.ts does NOT exist (R-BR-5)', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.d.ts'))).toBe(false)
    })

    it.skipIf(!distExists)('T-BR-5-min: dist/tsgrid-ui.min.js does NOT exist (R-BR-5)', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.min.js'))).toBe(false)
    })
})
