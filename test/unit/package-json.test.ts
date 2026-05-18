// v2.10.0: popup + tooltip removed from sideEffects (lazy singleton — safe to tree-shake)
// v2.13.0: utils.js added to sideEffects (CJS parity for the ESM utils.es6.js singleton)
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// Spec Q2: the exact 17-entry sideEffects list (v2.13.0 — utils.js CJS pair added).
// utils stays (side-effectful: reads navigator/localStorage at construction).
// popup and tooltip are now lazy-init — safe to tree-shake.
// locale and base are NOT in the array (pure ESM — safe to tree-shake).
// All chunk files (dist/chunks/*.js) are implicitly pure and must NOT appear here.
// v2.12.0: 9 per-widget CSS entries appended in alphabetical order (field, form, grid, layout,
//   popup, sidebar, tabs, toolbar, tooltip). CSS files are always side-effectful.
// v2.13.0: utils.js inserted immediately after utils.es6.js (ESM+CJS pair stays adjacent).
const EXPECTED_SIDE_EFFECTS: string[] = [
    // v2.10.0 — JS singleton + monolith CSS (UNCHANGED ordering)
    './dist/tsgrid-ui.css',
    './dist/tsgrid-ui.min.css',
    './dist/utils.es6.js',
    // v2.13.0 — CJS parity for utils singleton (adjacent to ESM pair)
    './dist/utils.js',
    './dist/tsgrid-ui.es6.js',
    './dist/tsgrid-ui.es6.min.js',
    './dist/tsgrid-ui.js',
    './dist/tsgrid-ui.min.js',
    // v2.12.0 — per-widget CSS (NEW, alphabetical)
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

    it('sideEffects has exactly 17 entries (v2.13.0 — utils.js CJS pair added)', () => {
        expect(pkg.sideEffects).toHaveLength(17)
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

    it('sideEffects contains all expected entries in the correct order (v2.13.0 mandatory order)', () => {
        expect(pkg.sideEffects).toEqual(EXPECTED_SIDE_EFFECTS)
    })

    it('package version is 2.14.0 (font-externalization release)', () => {
        expect(pkg.version).toBe('2.14.0')
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

    it('T-FE-13: package version is 2.14.0 (font-externalization release)', () => {
        expect(pkg.version).toBe('2.14.0')
    })
})
