// v2.10.0: popup + tooltip removed from sideEffects (lazy singleton — safe to tree-shake)
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// Spec Q2: the exact 7-entry sideEffects list (v2.10.0 — popup + tooltip removed).
// utils stays (side-effectful: reads navigator/localStorage at construction).
// popup and tooltip are now lazy-init — safe to tree-shake.
// locale and base are NOT in the array (pure ESM — safe to tree-shake).
// All chunk files (dist/chunks/*.js) are implicitly pure and must NOT appear here.
const EXPECTED_SIDE_EFFECTS: string[] = [
    './dist/tsgrid-ui.css',
    './dist/tsgrid-ui.min.css',
    './dist/utils.es6.js',
    './dist/tsgrid-ui.es6.js',
    './dist/tsgrid-ui.es6.min.js',
    './dist/tsgrid-ui.js',
    './dist/tsgrid-ui.min.js',
]

describe('package.json sideEffects (R-CSSE-1)', () => {
    it('sideEffects is an array (not a boolean)', () => {
        expect(Array.isArray(pkg.sideEffects)).toBe(true)
    })

    it('sideEffects has exactly 7 entries (popup + tooltip removed in v2.10.0)', () => {
        expect(pkg.sideEffects).toHaveLength(7)
    })

    it('sideEffects contains ./dist/utils.es6.js (singleton — side-effectful)', () => {
        expect(pkg.sideEffects).toContain('./dist/utils.es6.js')
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

    it('sideEffects contains all expected entries in the correct order (v2.10.0 mandatory order)', () => {
        expect(pkg.sideEffects).toEqual(EXPECTED_SIDE_EFFECTS)
    })

    it('package version is 2.11.0 (grid-subpath-reintroduction release)', () => {
        expect(pkg.version).toBe('2.11.0')
    })
})
