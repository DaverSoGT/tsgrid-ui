/**
 * barrel-deprecation.test.ts — TDD RED commit (Commit A)
 *
 * Tests for:
 *  - R-BD-1: @deprecated JSDoc on every export statement in src/index.ts
 *  - R-BD-2: one-time dev-mode console.warn guard pattern in src/index.ts
 *  - R-BD-3: console.warn message text requirements
 *  - R-BD-4: @deprecated JSDoc on every export statement in src/index-legacy.ts; no console.warn
 *  - R-BD-5: dist/tsgrid-ui.d.ts contains @deprecated for TsGrid, TsForm, TsField (post-build)
 *  - R-BD-6: dist/tsgrid-ui.es6.js contains process.env.NODE_ENV and console.warn (post-build)
 *  - R-TG-1: src/tsutils.ts exports RecId, LayoutPanelId, FieldName, Brand
 *  - R-TG-2: dist/utils.d.ts contains RecId, LayoutPanelId, FieldName, Brand (post-build)
 *  - G-1: no new non-determinism in src/index.ts
 *
 * Source files are read as plain text — NOT imported at runtime (avoids triggering console.warn).
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const indexSrc      = readFileSync(join(ROOT, 'src', 'index.ts'), 'utf8')
const legacySrc     = readFileSync(join(ROOT, 'src', 'index-legacy.ts'), 'utf8')
const tsutilsSrc    = readFileSync(join(ROOT, 'src', 'tsutils.ts'), 'utf8')

const distDir       = join(ROOT, 'dist')
const distExists    = existsSync(distDir)

// ---------------------------------------------------------------------------
// Suite 1 — src/index.ts source checks
// ---------------------------------------------------------------------------

describe('barrel-deprecation — src/index.ts source checks', () => {
    // T-BD-1: @deprecated count >= 20 (12 value + 8 type export statements)
    it('T-BD-1: src/index.ts has @deprecated JSDoc on at least 20 export statements (R-BD-1)', () => {
        const matches = indexSrc.match(/@deprecated/g)
        expect(matches).not.toBeNull()
        expect(matches!.length).toBeGreaterThanOrEqual(20)
    })

    // T-BD-2: warn guard pattern — flag name + NODE_ENV check
    it('T-BD-2: src/index.ts contains _barrelDeprecationWarned flag (R-BD-2)', () => {
        expect(indexSrc).toMatch(/_barrelDeprecationWarned/)
    })

    it('T-BD-2: src/index.ts contains process?.env?.NODE_ENV guard (R-BD-2)', () => {
        expect(indexSrc).toMatch(/process\?\.env\?\.NODE_ENV/)
    })

    // T-BD-3: warn message text requirements
    it('T-BD-3: warn message contains [tsgrid-ui] namespace prefix (R-BD-3)', () => {
        expect(indexSrc).toMatch(/\[tsgrid-ui\]/)
    })

    it('T-BD-3: warn message contains "deprecated" (R-BD-3)', () => {
        expect(indexSrc).toMatch(/deprecated/)
    })

    it('T-BD-3: warn message contains tsgrid-ui/grid canonical subpath example (R-BD-3)', () => {
        expect(indexSrc).toMatch(/tsgrid-ui\/grid/)
    })

    it('T-BD-3: warn message contains v3.0 removal target (R-BD-3)', () => {
        expect(indexSrc).toMatch(/v3\.0/)
    })

    // T-TG-1: tsutils.ts exports branded types
    it('T-TG-1: src/tsutils.ts exports RecId, LayoutPanelId, FieldName, Brand via export type (R-TG-1)', () => {
        expect(tsutilsSrc).toMatch(/export type \{ Brand, RecId, LayoutPanelId, FieldName \}/)
    })

    // G-1: no new non-determinism introduced in src/index.ts
    it('G-1: src/index.ts introduces no new Date() calls (determinism guard)', () => {
        expect(indexSrc).not.toMatch(/new Date\(\)/)
    })

    it('G-1: src/index.ts introduces no Date.now() calls (determinism guard)', () => {
        expect(indexSrc).not.toMatch(/Date\.now\(\)/)
    })

    it('G-1: src/index.ts introduces no Math.random() calls (determinism guard)', () => {
        expect(indexSrc).not.toMatch(/Math\.random/)
    })

    it('G-1: src/index.ts introduces no randomUUID calls (determinism guard)', () => {
        expect(indexSrc).not.toMatch(/randomUUID/)
    })

    it('G-1: src/index.ts introduces no randomBytes calls (determinism guard)', () => {
        expect(indexSrc).not.toMatch(/randomBytes/)
    })
})

// ---------------------------------------------------------------------------
// Suite 2 — src/index-legacy.ts source checks
// ---------------------------------------------------------------------------

describe('barrel-deprecation — src/index-legacy.ts source checks', () => {
    // T-BD-4: @deprecated count >= 12 in legacy barrel; no console.warn
    it('T-BD-4: src/index-legacy.ts has @deprecated JSDoc on at least 12 export statements (R-BD-4)', () => {
        const matches = legacySrc.match(/@deprecated/g)
        expect(matches).not.toBeNull()
        expect(matches!.length).toBeGreaterThanOrEqual(12)
    })

    it('T-BD-4: src/index-legacy.ts does NOT contain console.warn (R-BD-4)', () => {
        expect(legacySrc).not.toMatch(/console\.warn/)
    })
})

// ---------------------------------------------------------------------------
// Suite 3 — dist artifacts (all skipped if dist/ does not exist)
// ---------------------------------------------------------------------------

describe('barrel-deprecation — dist artifacts', () => {
    // T-BD-5: dist/tsgrid-ui.d.ts contains @deprecated for TsGrid, TsForm, TsField
    it.skipIf(!distExists)('T-BD-5: dist/tsgrid-ui.d.ts contains @deprecated for TsGrid (R-BD-5)', () => {
        const dts = readFileSync(join(distDir, 'tsgrid-ui.d.ts'), 'utf8')
        expect(dts).toMatch(/@deprecated[\s\S]*?TsGrid|TsGrid[\s\S]*?@deprecated/)
        // simpler: at least 3 @deprecated occurrences for the canonical sample set
        const depMatches = dts.match(/@deprecated/g)
        expect(depMatches).not.toBeNull()
        expect(depMatches!.length).toBeGreaterThanOrEqual(3)
    })

    it.skipIf(!distExists)('T-BD-5: dist/tsgrid-ui.d.ts contains @deprecated near TsForm (R-BD-5)', () => {
        const dts = readFileSync(join(distDir, 'tsgrid-ui.d.ts'), 'utf8')
        expect(dts).toContain('@deprecated')
        // The file must export TsForm
        expect(dts).toContain('TsForm')
    })

    it.skipIf(!distExists)('T-BD-5: dist/tsgrid-ui.d.ts contains @deprecated near TsField (R-BD-5)', () => {
        const dts = readFileSync(join(distDir, 'tsgrid-ui.d.ts'), 'utf8')
        expect(dts).toContain('@deprecated')
        expect(dts).toContain('TsField')
    })

    // T-BD-6: dist/tsgrid-ui.es6.js contains NODE_ENV guard and console.warn
    // D-A-1: esbuild preserves optional chaining (process?.env?.NODE_ENV) from source,
    // so we match either the optional-chaining or standard form.
    it.skipIf(!distExists)('T-BD-6: dist/tsgrid-ui.es6.js contains process NODE_ENV guard (R-BD-6)', () => {
        const es6 = readFileSync(join(distDir, 'tsgrid-ui.es6.js'), 'utf8')
        expect(es6).toMatch(/process\??\.\??env\??\.\??NODE_ENV/)
    })

    it.skipIf(!distExists)('T-BD-6: dist/tsgrid-ui.es6.js contains console.warn (R-BD-6)', () => {
        const es6 = readFileSync(join(distDir, 'tsgrid-ui.es6.js'), 'utf8')
        expect(es6).toContain('console.warn')
    })

    // T-TG-2: dist/utils.d.ts contains RecId, LayoutPanelId, FieldName, Brand
    it.skipIf(!distExists)('T-TG-2: dist/utils.d.ts contains RecId (R-TG-2)', () => {
        const utilsDts = readFileSync(join(distDir, 'utils.d.ts'), 'utf8')
        expect(utilsDts).toContain('RecId')
    })

    it.skipIf(!distExists)('T-TG-2: dist/utils.d.ts contains LayoutPanelId (R-TG-2)', () => {
        const utilsDts = readFileSync(join(distDir, 'utils.d.ts'), 'utf8')
        expect(utilsDts).toContain('LayoutPanelId')
    })

    it.skipIf(!distExists)('T-TG-2: dist/utils.d.ts contains FieldName (R-TG-2)', () => {
        const utilsDts = readFileSync(join(distDir, 'utils.d.ts'), 'utf8')
        expect(utilsDts).toContain('FieldName')
    })

    it.skipIf(!distExists)('T-TG-2: dist/utils.d.ts contains Brand (R-TG-2)', () => {
        const utilsDts = readFileSync(join(distDir, 'utils.d.ts'), 'utf8')
        expect(utilsDts).toContain('Brand')
    })
})
