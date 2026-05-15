// RED test: package.json sideEffects must have exactly 9 entries (R-CSSE-1, AC7)
// This file is intentionally RED until T-CSSE-6 (GREEN: update sideEffects array + version bump).
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// Spec Q2: the exact 9-entry sideEffects list (mandatory order).
// The 3 unsafe singletons (utils, popup, tooltip) must be in the array (side-effectful).
// locale and base are NOT in the array (pure ESM — safe to tree-shake).
// All chunk files (dist/chunks/*.js) are implicitly pure and must NOT appear here.
const EXPECTED_SIDE_EFFECTS: string[] = [
    './dist/tsgrid-ui.css',
    './dist/tsgrid-ui.min.css',
    './dist/utils.es6.js',
    './dist/popup.es6.js',
    './dist/tooltip.es6.js',
    './dist/tsgrid-ui.es6.js',
    './dist/tsgrid-ui.es6.min.js',
    './dist/tsgrid-ui.js',
    './dist/tsgrid-ui.min.js',
]

describe('package.json sideEffects (R-CSSE-1)', () => {
    it('sideEffects is an array (not a boolean)', () => {
        expect(Array.isArray(pkg.sideEffects)).toBe(true)
    })

    it('sideEffects has exactly 9 entries', () => {
        expect(pkg.sideEffects).toHaveLength(9)
    })

    it('sideEffects contains ./dist/utils.es6.js (singleton — side-effectful)', () => {
        expect(pkg.sideEffects).toContain('./dist/utils.es6.js')
    })

    it('sideEffects contains ./dist/popup.es6.js (singleton — side-effectful)', () => {
        expect(pkg.sideEffects).toContain('./dist/popup.es6.js')
    })

    it('sideEffects contains ./dist/tooltip.es6.js (singleton — side-effectful)', () => {
        expect(pkg.sideEffects).toContain('./dist/tooltip.es6.js')
    })

    it('sideEffects does NOT contain ./dist/locale.es6.js (pure ESM, safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/locale.es6.js')
    })

    it('sideEffects does NOT contain ./dist/base.es6.js (pure ESM, safe to tree-shake)', () => {
        expect(pkg.sideEffects).not.toContain('./dist/base.es6.js')
    })

    it('sideEffects contains all expected entries in the correct order (Q2 mandatory order)', () => {
        expect(pkg.sideEffects).toEqual(EXPECTED_SIDE_EFFECTS)
    })

    it('package version is 2.8.1 (R-CSSE-8)', () => {
        expect(pkg.version).toBe('2.8.1')
    })
})
