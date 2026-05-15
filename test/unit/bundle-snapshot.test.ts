// bundle-snapshot schemaVersion=3 with Opt-C deferral (R-CSSE-4/6, AC6, AC8)
// Amendment 1: chunks block is NOT in schema v3 (Opt C). This test asserts its ABSENCE.
// v2.10.0 addition: R-SLI-DESIGN-3 ctor-marker assertions for popup + tooltip stubs.
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

    // R-SLI-DESIGN-3: popup stub must not contain TsDialog ctor body markers
    it('R-SLI-DESIGN-3: popup.es6.js stub does not contain TsDialog ctor body markers', () => {
        const popupStub = readFileSync(join(ROOT, 'dist', 'popup.es6.js'), 'utf8')
        expect(popupStub).not.toMatch(/this\.handleResize\s*=/)
        expect(popupStub).not.toMatch(/this\.status\s*=\s*['"]closed['"]/)
    })

    // R-SLI-DESIGN-3: tooltip stub must not contain Tooltip ctor body markers
    it('R-SLI-DESIGN-3: tooltip.es6.js stub does not contain Tooltip ctor body markers', () => {
        const tooltipStub = readFileSync(join(ROOT, 'dist', 'tooltip.es6.js'), 'utf8')
        expect(tooltipStub).not.toMatch(/this\.defaults\s*=\s*\{[\s\S]*?screenMargin/)
    })

    // Determinism: two consecutive snapshot runs must produce structurally identical JSON.
    // generatedAt is excluded (it is a wall-clock timestamp and changes every run by design).
    // All other fields (schemaVersion, modules[], subpaths, totals, outputBundle) must be stable.
    // Timeout: 30s because pnpm bundle:snapshot invokes tsup internally (~6-8s per run).
    it('produces structurally identical JSON (excluding generatedAt) across two consecutive runs', { timeout: 30000 }, () => {
        if (!existsSync(BASELINE_PATH)) {
            // Can only run determinism test once baseline exists
            return
        }
        const stripTimestamp = (snap: Record<string, unknown>) => {
            const { generatedAt: _ts, ...rest } = snap
            return rest
        }
        const before = stripTimestamp(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')))
        execSync('pnpm bundle:snapshot --version=v2.8.1', {
            cwd: ROOT,
            stdio: 'pipe',
        })
        const after = stripTimestamp(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')))
        expect(JSON.stringify(after, null, 2)).toBe(JSON.stringify(before, null, 2))
    })
})
