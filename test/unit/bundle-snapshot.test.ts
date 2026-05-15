// RED test: bundle-snapshot schemaVersion=3 with Opt-C deferral (R-CSSE-4/6, AC6, AC8)
// Amendment 1: chunks block is NOT in schema v3 (Opt C). This test asserts its ABSENCE.
// This file is intentionally RED until T-CSSE-8 (MEASURE: regen v2.8.1-baseline.json).
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = process.cwd()
const BASELINE_PATH = join(ROOT, 'reports', 'bundle', 'v2.8.1-baseline.json')

describe('bundle-snapshot schema v3 — Opt-C deferral (R-CSSE-4 amended, AC6, AC8)', () => {
    it('reports/bundle/v2.8.1-baseline.json exists', () => {
        expect(existsSync(BASELINE_PATH)).toBe(true)
    })

    it('schemaVersion is 3', () => {
        const snap = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
        expect(snap.schemaVersion).toBe(3)
    })

    it('scope.splitting is true', () => {
        const snap = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
        expect(snap.scope.splitting).toBe(true)
    })

    // Opt-C deferral: chunks block is explicitly ABSENT from schema v3.
    // This negative-coverage assertion documents the deferral decision and will
    // FAIL if a future apply agent accidentally reintroduces a partial chunks block.
    it('chunks key is absent (Opt-C: chunk-level tracking deferred to cycle 5+)', () => {
        const snap = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
        expect(snap.chunks).toBeUndefined()
    })

    // Opt-C corollary: no chunkImports per subpath either.
    it('subpath entries do NOT have chunkImports field (Opt-C corollary)', () => {
        const snap = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
        if (snap.subpaths) {
            for (const [name, entry] of Object.entries(snap.subpaths as Record<string, unknown>)) {
                expect(
                    (entry as Record<string, unknown>).chunkImports,
                    `subpath "${name}" must not have chunkImports at schema v3 Opt-C`
                ).toBeUndefined()
            }
        }
    })

    // Determinism: two consecutive snapshot runs must produce byte-identical JSON.
    // This guards against timestamp leaks, Object.keys ordering, or other non-determinism.
    it('produces byte-identical JSON across two consecutive snapshot runs', () => {
        if (!existsSync(BASELINE_PATH)) {
            // Can only run determinism test once baseline exists
            return
        }
        const before = readFileSync(BASELINE_PATH, 'utf8')
        execSync('pnpm bundle:snapshot --version=v2.8.1', {
            cwd: ROOT,
            stdio: 'pipe',
        })
        const after = readFileSync(BASELINE_PATH, 'utf8')
        expect(after).toBe(before)
    })
})
