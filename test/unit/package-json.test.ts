// v2.10.0: popup + tooltip removed from sideEffects (lazy singleton — safe to tree-shake)
// v2.13.0: utils.js added to sideEffects (CJS parity for the ESM utils.es6.js singleton)
// v3.0.0: barrel JS artifacts removed from sideEffects (tsgrid-ui.es6.js, tsgrid-ui.js, etc.)
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// v3.0.0: barrel JS artifacts removed — 13 entries remain (monolith CSS + utils pair + 9 per-widget CSS).
// tsgrid-ui.es6.js, tsgrid-ui.es6.min.js, tsgrid-ui.js, tsgrid-ui.min.js removed (barrel deleted).
// utils stays (side-effectful: reads navigator/localStorage at construction).
// popup and tooltip are now lazy-init — safe to tree-shake.
// locale and base are NOT in the array (pure ESM — safe to tree-shake).
// icons subpath files MUST NOT appear here (R-SCI-11, INV-4).
// All chunk files (dist/chunks/*.js) are implicitly pure and must NOT appear here.
// v2.12.0: 9 per-widget CSS entries appended in alphabetical order (field, form, grid, layout,
//   popup, sidebar, tabs, toolbar, tooltip). CSS files are always side-effectful.
// v2.13.0: utils.js inserted immediately after utils.es6.js (ESM+CJS pair stays adjacent).
const EXPECTED_SIDE_EFFECTS: string[] = [
    // monolith CSS (unchanged)
    './dist/tsgrid-ui.css',
    './dist/tsgrid-ui.min.css',
    './dist/utils.es6.js',
    // v2.13.0 — CJS parity for utils singleton (adjacent to ESM pair)
    './dist/utils.js',
    // v2.12.0 — per-widget CSS (alphabetical)
    './dist/field.css',
    './dist/form.css',
    './dist/grid.css',
    './dist/layout.css',
    './dist/popup.css',
    './dist/sidebar.css',
    './dist/tabs.css',
    './dist/toolbar.css',
    './dist/tooltip.css',
]

describe('package.json sideEffects (R-CSSE-1)', () => {
    it('sideEffects is an array (not a boolean)', () => {
        expect(Array.isArray(pkg.sideEffects)).toBe(true)
    })

    it('sideEffects has exactly 13 entries (v3.0.0 — barrel JS artifacts removed)', () => {
        expect(pkg.sideEffects).toHaveLength(13)
    })

    it('sideEffects contains ./dist/utils.es6.js (singleton — side-effectful)', () => {
        expect(pkg.sideEffects).toContain('./dist/utils.es6.js')
    })

    it('sideEffects contains ./dist/utils.js (v2.13.0 CJS pair — singleton parity)', () => {
        expect(pkg.sideEffects).toContain('./dist/utils.js')
    })

    it('sideEffects does NOT contain ./dist/popup.es6.js (lazy singleton — safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/popup.es6.js')
    })

    it('sideEffects does NOT contain ./dist/tooltip.es6.js (lazy singleton — safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tooltip.es6.js')
    })

    it('sideEffects does NOT contain ./dist/locale.es6.js (pure ESM, safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/locale.es6.js')
    })

    it('sideEffects does NOT contain ./dist/base.es6.js (pure ESM, safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/base.es6.js')
    })

    it('sideEffects does NOT contain ./dist/tsgrid-ui.es6.js (v3.0.0 — barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.es6.js')
    })

    it('sideEffects does NOT contain ./dist/tsgrid-ui.js (v3.0.0 — barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.js')
    })

    it('sideEffects does NOT contain ./dist/tsgrid-ui.min.js (v3.0.0 — barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.min.js')
    })

    it('sideEffects does NOT contain ./dist/icons.es6.js (R-SCI-11, INV-4)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.es6.js')
    })

    it('sideEffects does NOT contain ./dist/icons.js (R-SCI-11, INV-4)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.js')
    })

    it('sideEffects contains all expected entries in the correct order (v3.0.0 mandatory order)', () => {
        expect(pkg.sideEffects).toEqual(EXPECTED_SIDE_EFFECTS)
    })

    // version-anchor: manual-review-trigger (see W-2 convention)
    it('package version is 3.0.0-rc.1 or 3.0.0 or 3.0.1 (v3.0 cycle)', () => {
        expect(['3.0.0-rc.1', '3.0.0', '3.0.1']).toContain(pkg.version)
    })

    // R-GCP-4 regression guard: files[] must not exclude per-widget CSS
    // (verify report #1088 W-1). The 9 new dist/<widget>.css files ship via the
    // implicit "dist/" glob; any future regression that adds "!dist/*.css" (or
    // a narrower !dist/<widget>.css) would silently drop them from the tarball.
    it('files[] has no !dist/*.css exclusion pattern (R-GCP-4 regression guard)', () => {
        const cssExclusions = pkg.files.filter((f: string) => /^!dist.*\.css$/.test(f))
        expect(cssExclusions).toEqual([])
    })

    it('scripts["consumer-smoke-cjs"] is wired to run the CJS smoke probe', () => {
        expect(pkg.scripts['consumer-smoke-cjs']).toBe('node test/consumer-smoke-cjs.js')
    })

    it('scripts.verify chain includes pnpm build and pnpm consumer-smoke-cjs', () => {
        const verify: string = pkg.scripts['verify']
        expect(verify).toContain('pnpm build')
        expect(verify).toContain('pnpm consumer-smoke-cjs')
    })
})

// ---------------------------------------------------------------------------
// barrel-deprecation (v2.15.0) → barrel-removal (v3.0.0): T-BD-10, T-BD-11 superseded
// The barrel is now REMOVED in v3.0.0 — sideEffects no longer includes barrel JS artifacts.
// These tests are updated to assert the v3.0.0 contract.
// ---------------------------------------------------------------------------
describe('package.json barrel-removal transition (v2.15.0→v3.0.0)', () => {
    it('T-BD-10-v3: package version is 3.0.0-rc.1 or 3.0.0 or 3.0.1 (barrel removed in v3.0.0)', () => {
        expect(['3.0.0-rc.1', '3.0.0', '3.0.1']).toContain(pkg.version)
    })

    it('T-BD-11-v3: sideEffects array does NOT include ./dist/tsgrid-ui.es6.js (barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.es6.js')
    })

    it('T-BD-11-v3: sideEffects array does NOT include ./dist/tsgrid-ui.es6.min.js (barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.es6.min.js')
    })

    it('T-BD-11-v3: sideEffects array does NOT include ./dist/tsgrid-ui.js (barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.js')
    })

    it('T-BD-11-v3: sideEffects array does NOT include ./dist/tsgrid-ui.min.js (barrel removed)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/tsgrid-ui.min.js')
    })
})

// ---------------------------------------------------------------------------
// barrel-removal (v3.0.0): T-PKG-1..T-PKG-3 (R-BR-3, R-BR-4, R-BR-8, R-SCI-9, R-SCI-11)
// ---------------------------------------------------------------------------
describe('package.json barrel-removal assertions (v3.0.0)', () => {
    it('T-PKG-1: package version is 3.0.0-rc.1 or 3.0.0 or 3.0.1 (v3.0 cycle allow-list)', () => {
        expect(['3.0.0-rc.1', '3.0.0', '3.0.1']).toContain(pkg.version)
    })

    it('T-PKG-2: package.json#exports["./icons"] is defined (R-SCI-9)', () => {
        expect(pkg.exports['./icons']).toBeDefined()
    })

    it('T-PKG-3: package.json#sideEffects does NOT contain ./dist/icons.es6.js (R-SCI-11, INV-4)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.es6.js')
    })

    it('T-PKG-3b: package.json#sideEffects does NOT contain ./dist/icons.js (R-SCI-11, INV-4)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.js')
    })
})

// ---------------------------------------------------------------------------
// font-externalization (v2.14.0): T-FE-10..T-FE-13 (R-FE-8, R-FE-9, R-FE-11, R-FE-12)
// ---------------------------------------------------------------------------
describe('package.json font-externalization assertions (T-FE-10..T-FE-13)', () => {
    it('T-FE-10: scripts["build:css"] does not contain "gulp icons" (R-FE-8, R-FE-9)', () => {
        expect(pkg.scripts['build:css']).not.toContain('gulp icons')
    })

    it('T-FE-11: scripts.verify starts with "pnpm build &&" (R-FE-10, W-3 closure)', () => {
        expect(pkg.scripts.verify).toMatch(/^pnpm build &&/)
    })

    it('T-FE-12: gulp-iconfont not in devDependencies (R-FE-11)', () => {
        expect('gulp-iconfont' in pkg.devDependencies).toBe(false)
    })

    it('T-FE-13: package version is 3.0.0-rc.1 or 3.0.0 or 3.0.1 (v3.0 cycle — barrel-deprecation baseline superseded)', () => { // version-anchor: manual-review-trigger (see W-2 convention)
        expect(['3.0.0-rc.1', '3.0.0', '3.0.1']).toContain(pkg.version)
    })
})
