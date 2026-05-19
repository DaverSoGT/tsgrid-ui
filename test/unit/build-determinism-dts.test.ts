import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// dts canonical-order guard (S-DOS-1).
//
// TypeScript 5.x emits union member types in an internal type-ID order that can
// shift between builds. For `getRecordHTML` the inferred return type is
// `string[] | ""` — but without an explicit annotation TypeScript may emit
// `"" | string[]` in some builds, causing non-deterministic dts output.
//
// This test reads the COMMITTED dist/grid.d.ts (no build trigger — fast, safe
// to run in the `parallel` vitest project per D-CCF-9) and asserts the canonical
// order: TypeReference `string[]` MUST precede StringLiteral `""`.
//
// If this test becomes RED it means either:
//   a) The explicit return-type annotation in src/ was removed (regression), OR
//   b) A new build emitted the non-canonical order (dts non-determinism surfaced).
//
// Strict TDD: commit 1 writes this file before the source annotation (commit 2).
// The test may be coincidentally GREEN if dist/grid.d.ts:517 is already canonical
// (v3.0.2 master state). Either outcome is recorded in apply-progress per D-CCF-22.

const ROOT = join(__dirname, '../..')

describe('build-determinism-dts — dist/grid.d.ts getRecordHTML line shows canonical string[] | "" order (S-DOS-1)', () => {
    const DTS = readFileSync(join(ROOT, 'dist', 'grid.d.ts'), 'utf8')
    const line = DTS.split('\n').find(l => l.includes('getRecordHTML('))

    it('getRecordHTML declaration exists in dist/grid.d.ts', () => {
        expect(line, 'getRecordHTML not found in dist/grid.d.ts — was the dts regenerated?').toBeDefined()
    })

    it('getRecordHTML return type is canonical string[] | "" (not "" | string[])', () => {
        expect(line).toBeDefined()
        // Tolerant of inter-token whitespace; strict on member order.
        // Canonical: string[] BEFORE "" (TypeReference before StringLiteral).
        expect(
            line,
            `getRecordHTML dts line does not match canonical order.\nActual line: ${line}\nExpected pattern: getRecordHTML(...): string[] | "";`,
        ).toMatch(/getRecordHTML\([^)]*\):\s*string\[\]\s*\|\s*""\s*;/)
    })
})
