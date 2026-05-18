// Block 6 structural parity test (T-CSP-8 / R-CSP-9, R-CSP-12).
// Asserts that both tsup.config.ts and tsup.config.analyze.ts contain
// Block 6 (CJS subpath block) with format:['cjs'], splitting:false,
// and all 12 widget entry keys.
//
// This test is GREEN after T-PRE-1 wires Block 6 into both configs,
// and turns RED if a future refactor removes or degrades Block 6.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const PROD_CONFIG   = readFileSync(join(ROOT, 'tsup.config.ts'), 'utf8')
const ANALYZE_CONFIG = readFileSync(join(ROOT, 'tsup.config.analyze.ts'), 'utf8')

// The 12 widget entry keys that Block 6 must contain
const BLOCK6_ENTRIES = [
    'locale', 'base', 'utils', 'popup', 'tooltip',
    'tabs', 'toolbar', 'sidebar', 'field', 'layout', 'form', 'grid',
]

describe('tsup Block 6 parity (R-CSP-9, R-CSP-12)', () => {
    it('tsup.config.ts contains a CJS subpath block (format: [\'cjs\'])', () => {
        expect(PROD_CONFIG).toMatch(/format:\s*\['cjs'\]/)
    })

    it('tsup.config.ts Block 6 has splitting: false', () => {
        // v3.0.0: barrel blocks removed — only Block 6 (CJS subpaths) has splitting: false.
        const splitFalseCount = (PROD_CONFIG.match(/splitting:\s*false/g) || []).length
        expect(splitFalseCount).toBeGreaterThanOrEqual(1) // Block 6 CJS subpaths
    })

    it('tsup.config.ts Block 6 references all 12 widget source files', () => {
        for (const name of BLOCK6_ENTRIES) {
            expect(PROD_CONFIG).toContain(`'${name}':`)
        }
    })

    it('tsup.config.analyze.ts is now an array config (defineConfig([...]))', () => {
        expect(ANALYZE_CONFIG).toMatch(/defineConfig\(\[/)
    })

    it('tsup.config.analyze.ts contains a CJS subpath block (format: [\'cjs\'])', () => {
        expect(ANALYZE_CONFIG).toMatch(/format:\s*\['cjs'\]/)
    })

    it('tsup.config.analyze.ts Block 6 has splitting: false', () => {
        expect(ANALYZE_CONFIG).toMatch(/splitting:\s*false/)
    })

    it('tsup.config.analyze.ts Block 6 references all 12 widget source files', () => {
        for (const name of BLOCK6_ENTRIES) {
            // The analyze config uses the same entry keys (not the .es6 variants for Block 6)
            expect(ANALYZE_CONFIG).toContain(`'${name}':`)
        }
    })

    it('both configs have define: { \'import.meta.url\': \'undefined\' } for CJS block', () => {
        expect(PROD_CONFIG).toContain("'import.meta.url': 'undefined'")
        expect(ANALYZE_CONFIG).toContain("'import.meta.url': 'undefined'")
    })

    it('tsup.config.analyze.ts Block 6 has sourcemap: true (safe — not post-processed)', () => {
        // The analyze config's Block 6 mirrors the prod Block 6 which has sourcemap: true
        // (unlike Blocks 3/4 which have sourcemap: false because wrap-legacy.mjs processes them)
        const analyzeHasSourcemapTrue = ANALYZE_CONFIG.includes('sourcemap: true')
        expect(analyzeHasSourcemapTrue).toBe(true)
    })
})
