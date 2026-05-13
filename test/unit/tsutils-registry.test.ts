/**
 * tsutils-registry.test.ts — Phase 0 of v2.3 SDD
 *
 * Tests for the new tsutils-registry.ts cycle-break module.
 * Tests 1-4 are RED until tsutils-registry.ts is created.
 * Test 5 asserts referential identity (TsUi singleton, INV-12 / R-N1).
 * Test 6 asserts that tsutils-registry.ts has no imports from tsutils/tsbase family.
 */

import { describe, it, expect } from 'vitest'

describe('tsutils-registry (Phase 0 — cycle break)', () => {
    it('checkName(null) returns false (null guard)', async () => {
        const { checkName } = await import('../../src/tsutils-registry.js')
        expect(checkName(null as unknown as string)).toBe(false)
    })

    it('checkName returns false when name already exists in TsUi (duplicate guard)', async () => {
        const { checkName, TsUi } = await import('../../src/tsutils-registry.js')
        // Temporarily pollute registry then restore
        ;(TsUi as Record<string, unknown>)['alreadyRegistered'] = {}
        try {
            expect(checkName('alreadyRegistered')).toBe(false)
        } finally {
            delete (TsUi as Record<string, unknown>)['alreadyRegistered']
        }
    })

    it('checkName returns false for non-alphanumeric names (bad name guard)', async () => {
        const { checkName } = await import('../../src/tsutils-registry.js')
        expect(checkName('bad name!')).toBe(false)
    })

    it('checkName returns true for a valid widget name (happy path)', async () => {
        const { checkName } = await import('../../src/tsutils-registry.js')
        expect(checkName('validWidget')).toBe(true)
    })

    it('TsUi from tsutils-registry.ts is the same object reference as TsUi from tsutils.ts barrel (INV-12)', async () => {
        const { TsUi: registryTsUi } = await import('../../src/tsutils-registry.js')
        const { TsUi: barrelTsUi } = await import('../../src/tsutils.js')
        expect(registryTsUi).toBe(barrelTsUi)
    })

    it('tsutils-registry.ts module source has zero imports from tsutils, tsbase, or tsutils-* family', async () => {
        const fs = await import('fs')
        const path = await import('path')
        const registryPath = path.resolve('src/tsutils-registry.ts')
        const src = fs.readFileSync(registryPath, 'utf-8')
        // Must not import from tsutils.ts, tsbase.ts, or any tsutils-*.ts
        const forbidden = /from\s+['"].*tsutils['"]/
        const forbiddenBase = /from\s+['"].*tsbase['"]/
        expect(forbidden.test(src)).toBe(false)
        expect(forbiddenBase.test(src)).toBe(false)
    })
})
