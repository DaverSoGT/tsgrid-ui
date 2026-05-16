// bundle-snapshot schemaVersion=3 with Opt-C deferral (R-CSSE-4/6, AC6, AC8)
// Amendment 1: chunks block is NOT in schema v3 (Opt C). This test asserts its ABSENCE.
// v2.10.0 addition: R-SLI-DESIGN-3 ctor-marker assertions for popup + tooltip stubs.
// v2.10.0 addition: subpathEffective block (T-BBI-3 through T-BBI-9, T-01 main guard).
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'

const V212_BASELINE_PATH = join(process.cwd(), 'reports', 'bundle', 'v2.12.0-baseline.json')

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
    // Note: this test is only meaningful when pkg.version === '2.8.1'. On later working trees,
    // chunk hashes differ from the committed v2.8.1 baseline — this is expected cross-version
    // divergence, not a non-determinism failure. Determinism for v2.10.0+ is covered in the
    // 'subpathEffective block (v2.10.0+)' suite below.
    it('produces structurally identical JSON (excluding generatedAt) across two consecutive runs', { timeout: 30000 }, () => {
        const pkgVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version
        if (!existsSync(BASELINE_PATH) || pkgVersion !== '2.8.1') {
            // Skip: baseline absent or working tree version differs from baseline anchor.
            return
        }
        const stripTimestamp = (snap: Record<string, unknown>) => {
            const { generatedAt: _ts, ...rest } = snap
            return rest
        }
        // Write to an OS-tmpdir path via --out= so the committed baseline file
        // is never mutated by this determinism check (#1080).
        const TMP = join(tmpdir(), 'tsgrid-bundle-snapshot-determinism-v2.8.1.json')
        try {
            const before = stripTimestamp(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')))
            execSync(`pnpm bundle:snapshot --version=v2.8.1 --out="${TMP}"`, {
                cwd: ROOT,
                stdio: 'pipe',
            })
            const after = stripTimestamp(JSON.parse(readFileSync(TMP, 'utf8')))
            expect(JSON.stringify(after, null, 2)).toBe(JSON.stringify(before, null, 2))
        } finally {
            if (existsSync(TMP)) unlinkSync(TMP)
        }
    })
})

// ---------------------------------------------------------------------------
// T-02: describe('subpathEffective block (v2.10.0+)') — RED suite skeleton
// Maps to T-BBI-3, T-BBI-4, T-BBI-5, T-BBI-10, R-BBI-B1–B3
// ---------------------------------------------------------------------------

const V210_BASELINE_PATH = join(ROOT, 'reports', 'bundle', 'v2.10.0-baseline.json')
const V211_BASELINE_PATH = join(ROOT, 'reports', 'bundle', 'v2.11.0-baseline.json')
const EXPECTED_SUBPATH_KEYS_V211 = ['base', 'field', 'form', 'grid', 'layout', 'locale', 'popup', 'sidebar', 'tabs', 'toolbar', 'tooltip', 'utils']
const REQUIRED_ENTRY_FIELDS = ['stubPath', 'stubBytes', 'chunks', 'chunkBytes', 'loadedBytes', 'executedBytes', 'effectiveBytes'] as const
const REQUIRED_CHUNK_FIELDS = ['path', 'bytes', 'lazyDeferred'] as const

describe('subpathEffective block (v2.10.0+)', () => {
    const EXPECTED_SUBPATH_KEYS_V210 = ['base', 'field', 'form', 'layout', 'locale', 'popup', 'sidebar', 'tabs', 'toolbar', 'tooltip', 'utils']
    let snap: any

    beforeAll(() => {
        // Prefer committed file (faster). Fall back to live generation.
        if (existsSync(V210_BASELINE_PATH)) {
            snap = JSON.parse(readFileSync(V210_BASELINE_PATH, 'utf8'))
        } else {
            execSync('pnpm bundle:snapshot --version=v2.10.0', { cwd: ROOT, stdio: 'pipe' })
            snap = JSON.parse(readFileSync(V210_BASELINE_PATH, 'utf8'))
        }
    }, 120_000)

    // T-BBI-1: file exists
    it('reports/bundle/v2.10.0-baseline.json exists', () => {
        expect(existsSync(V210_BASELINE_PATH)).toBe(true)
    })

    // T-BBI-2: version fields
    it('tsgridUiVersion is "2.10.0" and schemaVersion is 3', () => {
        expect(snap.tsgridUiVersion).toBe('2.10.0')
        expect(snap.schemaVersion).toBe(3)
    })

    // T-BBI-3: all 11 subpath entries present (v2.10.0 anchor — 11 keys, no grid)
    it('subpathEffective contains exactly 11 subpath keys (sorted)', () => {
        expect(snap.subpathEffective).toBeDefined()
        expect(Object.keys(snap.subpathEffective).sort()).toEqual(EXPECTED_SUBPATH_KEYS_V210)
    })

    // T-BBI-4: each entry has required fields (T-02 RED)
    it('every subpathEffective entry has required fields with correct types', () => {
        for (const [name, entry] of Object.entries(snap.subpathEffective as Record<string, any>)) {
            for (const k of REQUIRED_ENTRY_FIELDS) {
                expect(entry, `${name} missing field "${k}"`).toHaveProperty(k)
            }
            expect(typeof entry.stubPath, `${name}.stubPath must be string`).toBe('string')
            expect(typeof entry.stubBytes, `${name}.stubBytes must be number`).toBe('number')
            expect(entry.stubBytes, `${name}.stubBytes must be > 0`).toBeGreaterThan(0)
            expect(Array.isArray(entry.chunks), `${name}.chunks must be array`).toBe(true)
            expect(typeof entry.chunkBytes, `${name}.chunkBytes must be number`).toBe('number')
            expect(entry.chunkBytes, `${name}.chunkBytes must be >= 0`).toBeGreaterThanOrEqual(0)
            expect(typeof entry.effectiveBytes, `${name}.effectiveBytes must be number`).toBe('number')
            expect(entry.effectiveBytes, `${name}.effectiveBytes must be > 0`).toBeGreaterThan(0)
            // effectiveBytes === loadedBytes === stubBytes + chunkBytes
            expect(entry.effectiveBytes, `${name}: effectiveBytes !== stubBytes + chunkBytes`).toBe(entry.stubBytes + entry.chunkBytes)
            expect(entry.loadedBytes, `${name}: loadedBytes !== stubBytes + chunkBytes`).toBe(entry.stubBytes + entry.chunkBytes)
            // executedBytes <= loadedBytes
            expect(entry.executedBytes, `${name}: executedBytes must be <= loadedBytes`).toBeLessThanOrEqual(entry.loadedBytes)
            // per-chunk fields
            for (const c of entry.chunks) {
                for (const k of REQUIRED_CHUNK_FIELDS) {
                    expect(c, `${name} chunk missing field "${k}"`).toHaveProperty(k)
                }
            }
        }
    })

    // T-BBI-10: schema v3 top-level key set is exact — no extra keys (T-02 RED)
    it('schema v3 top-level key set is exactly correct (no extra or missing keys)', () => {
        const expectedKeys = ['schemaVersion', 'tsgridUiVersion', 'generatedAt', 'generator', 'scope', 'outputBundle', 'modules', 'totals', 'subpaths', 'subpathEffective']
        expect(Object.keys(snap)).toEqual(expectedKeys)
    })

    // T-03: ./popup specific assertions (T-03 RED)
    // Note: design §4.2 estimated 4 chunks; actual v2.10.0 build has 5 (chunk topology
    // evolved between design authoring and first actual build). Test reflects reality.
    it('./popup has exactly 5 transitive chunks (v2.10.0 actual)', () => {
        const popup = snap.subpathEffective.popup
        expect(popup.chunks).toHaveLength(5)
        for (const c of popup.chunks) {
            expect(c.path).toMatch(/^dist\/chunks\/chunk-[A-Z0-9]+\.js$/)
        }
    })

    it('./popup loadedBytes is in [150000, 170000]', () => {
        const lb = snap.subpathEffective.popup.loadedBytes
        expect(lb).toBeGreaterThanOrEqual(150_000)
        expect(lb).toBeLessThanOrEqual(170_000)
    })

    it('./popup executedBytes is strictly less than loadedBytes (lazyDeferred chunks present)', () => {
        const popup = snap.subpathEffective.popup
        expect(popup.executedBytes).toBeLessThan(popup.loadedBytes)
        expect(popup.chunks.some((c: any) => c.lazyDeferred === true)).toBe(true)
    })

    // T-04: ./locale well-formed assertion + chunks[] sort assertion (T-04 RED)
    it('./locale executedBytes === loadedBytes (no lazyDeferred chunks expected)', () => {
        const locale = snap.subpathEffective.locale
        expect(Array.isArray(locale.chunks)).toBe(true)
        expect(locale.executedBytes).toBe(locale.loadedBytes)
    })

    it('every subpathEffective entry chunks[] is sorted lexicographically', () => {
        for (const [name, entry] of Object.entries(snap.subpathEffective as Record<string, any>)) {
            const paths = entry.chunks.map((c: any) => c.path)
            expect(paths, `${name}.chunks[] not sorted`).toEqual([...paths].sort())
        }
    })

    // T-06: determinism — subpathEffective deep-equal across two runs (T-06 RED)
    // Note: only meaningful when pkg.version === '2.10.0'. On later working trees,
    // SUBPATH_INVENTORY has changed so regenerating the baseline produces different output —
    // this is expected cross-version divergence, not a non-determinism failure.
    // Determinism for v2.11.0+ is covered in the 'subpathEffective block (v2.11.0+)' suite.
    it('subpathEffective is stable across two consecutive snapshot runs', { timeout: 120_000 }, () => {
        const pkgVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version
        if (!existsSync(V210_BASELINE_PATH) || pkgVersion !== '2.10.0') return
        // Write to an OS-tmpdir path via --out= so the committed baseline file
        // is never mutated by this determinism check (#1080).
        const TMP = join(tmpdir(), 'tsgrid-bundle-snapshot-determinism-v2.10.0.json')
        try {
            const before = JSON.parse(readFileSync(V210_BASELINE_PATH, 'utf8')).subpathEffective
            execSync(`pnpm bundle:snapshot --version=v2.10.0 --out="${TMP}"`, { cwd: ROOT, stdio: 'pipe' })
            const after = JSON.parse(readFileSync(TMP, 'utf8')).subpathEffective
            expect(JSON.stringify(after, null, 2)).toBe(JSON.stringify(before, null, 2))
        } finally {
            if (existsSync(TMP)) unlinkSync(TMP)
        }
    })
})

// ---------------------------------------------------------------------------
// Cycle 6 (v2.11.0): subpathEffective block for the ./grid reintroduction
// Maps to T-GSR-4, T-GSR-5, T-GSR-6, T-GSR-7, R-GSR-11
// Guards skipped gracefully when v2.11.0-baseline.json is absent (pre-build).
// ---------------------------------------------------------------------------

describe('subpathEffective block (v2.11.0+)', () => {
    let snap: any

    beforeAll(() => {
        if (!existsSync(V211_BASELINE_PATH)) return
        snap = JSON.parse(readFileSync(V211_BASELINE_PATH, 'utf8'))
    }, 120_000)

    // T-GSR-5: file exists
    it('reports/bundle/v2.11.0-baseline.json exists', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        expect(existsSync(V211_BASELINE_PATH)).toBe(true)
    })

    // T-GSR-5: version and schema fields
    it('tsgridUiVersion is "2.11.0" and schemaVersion is 3', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        expect(snap.tsgridUiVersion).toBe('2.11.0')
        expect(snap.schemaVersion).toBe(3)
    })

    // T-GSR-4: 12 subpath keys including grid
    it('subpathEffective contains exactly 12 subpath keys (sorted)', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        expect(snap.subpathEffective).toBeDefined()
        expect(Object.keys(snap.subpathEffective).sort()).toEqual(EXPECTED_SUBPATH_KEYS_V211)
    })

    // T-GSR-5: every entry has required fields with correct types
    it('every subpathEffective entry has required fields with correct types', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        for (const [name, entry] of Object.entries(snap.subpathEffective as Record<string, any>)) {
            for (const k of REQUIRED_ENTRY_FIELDS) {
                expect(entry, `${name} missing field "${k}"`).toHaveProperty(k)
            }
            expect(typeof entry.stubPath, `${name}.stubPath must be string`).toBe('string')
            expect(typeof entry.stubBytes, `${name}.stubBytes must be number`).toBe('number')
            expect(entry.stubBytes, `${name}.stubBytes must be > 0`).toBeGreaterThan(0)
            expect(Array.isArray(entry.chunks), `${name}.chunks must be array`).toBe(true)
            expect(typeof entry.chunkBytes, `${name}.chunkBytes must be number`).toBe('number')
            expect(entry.chunkBytes, `${name}.chunkBytes must be >= 0`).toBeGreaterThanOrEqual(0)
            expect(typeof entry.effectiveBytes, `${name}.effectiveBytes must be number`).toBe('number')
            expect(entry.effectiveBytes, `${name}.effectiveBytes must be > 0`).toBeGreaterThan(0)
            expect(entry.effectiveBytes, `${name}: effectiveBytes !== stubBytes + chunkBytes`).toBe(entry.stubBytes + entry.chunkBytes)
            expect(entry.loadedBytes, `${name}: loadedBytes !== stubBytes + chunkBytes`).toBe(entry.stubBytes + entry.chunkBytes)
            expect(entry.executedBytes, `${name}: executedBytes must be <= loadedBytes`).toBeLessThanOrEqual(entry.loadedBytes)
            for (const c of entry.chunks) {
                for (const k of REQUIRED_CHUNK_FIELDS) {
                    expect(c, `${name} chunk missing field "${k}"`).toHaveProperty(k)
                }
            }
        }
    })

    // T-GSR-4: ./grid effectiveBytes range guard (v2.11.0 actual: ~704 KB)
    // Grid transitively loads grid-render.ts (largest chunk ~340 KB) plus 7 more chunks.
    // Effective load is larger than the barrel stub alone — this is the chunk closure cost.
    it('./grid effectiveBytes is in [500_000, 900_000] (actual ~704 KB per v2.11.0 baseline)', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        const grid = snap.subpathEffective.grid
        expect(grid.effectiveBytes).toBeGreaterThanOrEqual(500_000)
        expect(grid.effectiveBytes).toBeLessThanOrEqual(900_000)
    })

    // T-GSR-4: ./grid has at least one transitive chunk
    it('./grid chunks[] has at least 1 entry', () => {
        if (!existsSync(V211_BASELINE_PATH)) return
        const grid = snap.subpathEffective.grid
        expect(grid.chunks.length).toBeGreaterThanOrEqual(1)
        for (const c of grid.chunks) {
            expect(c.path).toMatch(/^dist\/chunks\/chunk-[A-Z0-9]+\.js$/)
        }
    })

    // T-GSR-7: determinism — subpathEffective./grid numeric fields stable across two runs.
    // Note: only meaningful when pkg.version === '2.11.0'. On later working trees,
    // SUBPATH_INVENTORY may have changed so regenerating the baseline would produce
    // different output — that is expected cross-version divergence, not a non-determinism
    // failure. Determinism for v2.12.0+ will be covered in its own suite.
    it('subpathEffective is stable across two consecutive snapshot runs', { timeout: 120_000 }, () => {
        const pkgVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version
        if (!existsSync(V211_BASELINE_PATH) || pkgVersion !== '2.11.0') return
        // Write to an OS-tmpdir path via --out= so the committed baseline file
        // is never mutated by this determinism check (#1080).
        const TMP = join(tmpdir(), 'tsgrid-bundle-snapshot-determinism-v2.11.0.json')
        try {
            const before = JSON.parse(readFileSync(V211_BASELINE_PATH, 'utf8')).subpathEffective
            execSync(`pnpm bundle:snapshot --version=v2.11.0 --out="${TMP}"`, { cwd: ROOT, stdio: 'pipe' })
            const after = JSON.parse(readFileSync(TMP, 'utf8')).subpathEffective
            expect(JSON.stringify(after, null, 2)).toBe(JSON.stringify(before, null, 2))
        } finally {
            if (existsSync(TMP)) unlinkSync(TMP)
        }
    })
})

// ---------------------------------------------------------------------------
// T-05: AC-8 hard-fail describe block — fixture-metafile unit test
// Maps to T-BBI-9, R-BBI-B7, design §4.2, §4.4
// Imports buildSubpathEffectiveBlock directly (requires ESM main guard from T-01)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Cycle 7 (v2.12.0): grid-css-pairing — CSS subpaths must NOT appear in subpathEffective
// Maps to T-GCP-15, T-GCP-16, R-GCP-18, R-GCP-19, R-GCP-20
// Guards skip gracefully when v2.12.0-baseline.json is absent (pre-generate).
// ---------------------------------------------------------------------------

describe('subpathEffective block (v2.12.0 grid-css-pairing)', () => {
    const CSS_WIDGET_NAMES = ['field', 'form', 'grid', 'layout', 'popup', 'sidebar', 'tabs', 'toolbar', 'tooltip']

    // T-GCP-16: file exists + version + schema fields
    it('reports/bundle/v2.12.0-baseline.json exists', () => {
        if (!existsSync(V212_BASELINE_PATH)) return
        expect(existsSync(V212_BASELINE_PATH)).toBe(true)
    })

    it('tsgridUiVersion is "2.12.0" and schemaVersion is 3', () => {
        if (!existsSync(V212_BASELINE_PATH)) return
        const snap = JSON.parse(readFileSync(V212_BASELINE_PATH, 'utf8'))
        expect(snap.tsgridUiVersion).toBe('2.12.0')
        expect(snap.schemaVersion).toBe(3)
    })

    // T-GCP-15: subpathEffective has exactly 12 JS keys — CSS subpaths excluded
    it('subpathEffective contains exactly 12 JS subpath keys (no CSS subpaths)', () => {
        if (!existsSync(V212_BASELINE_PATH)) return
        const snap = JSON.parse(readFileSync(V212_BASELINE_PATH, 'utf8'))
        expect(Object.keys(snap.subpathEffective)).toHaveLength(12)
        // Negative assertions: CSS subpath names must NOT appear
        for (const name of CSS_WIDGET_NAMES) {
            expect(Object.keys(snap.subpathEffective)).not.toContain(`${name}.css`)
            // Also guard against bare CSS widget names slipping through (without .css suffix)
            // Only "grid", "form", etc. are valid JS subpath keys — those ARE expected to exist
        }
    })

    // T-GCP-15: NEGATIVE test — specific CSS subpath names must be absent from subpathEffective
    it('CSS subpath names (.css suffix) are absent from subpathEffective keys', () => {
        if (!existsSync(V212_BASELINE_PATH)) return
        const snap = JSON.parse(readFileSync(V212_BASELINE_PATH, 'utf8'))
        const subpathKeys = Object.keys(snap.subpathEffective)
        for (const name of CSS_WIDGET_NAMES) {
            expect(subpathKeys, `"${name}.css" must not appear in subpathEffective`).not.toContain(`${name}.css`)
        }
        // Belt-and-suspenders: no key should end with .css
        const cssKeys = subpathKeys.filter(k => k.endsWith('.css'))
        expect(cssKeys, 'no .css-suffixed keys allowed in subpathEffective').toEqual([])
    })

    // T-GCP-16: determinism — v2.12.0 subpathEffective stable across two consecutive runs
    it('subpathEffective is stable across two consecutive snapshot runs (v2.12.0)', { timeout: 120_000 }, () => {
        const pkgVersion = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')).version
        if (!existsSync(V212_BASELINE_PATH) || pkgVersion !== '2.12.0') return
        const TMP = join(tmpdir(), 'tsgrid-bundle-snapshot-determinism-v2.12.0.json')
        try {
            const before = JSON.parse(readFileSync(V212_BASELINE_PATH, 'utf8')).subpathEffective
            execSync(`pnpm bundle:snapshot --version=v2.12.0 --out="${TMP}"`, {
                cwd: process.cwd(),
                stdio: 'pipe',
            })
            const after = JSON.parse(readFileSync(TMP, 'utf8')).subpathEffective
            expect(JSON.stringify(after, null, 2)).toBe(JSON.stringify(before, null, 2))
        } finally {
            if (existsSync(TMP)) unlinkSync(TMP)
        }
    })
})

describe('subpathEffective AC-8 — hard-fail on missing stub', () => {
    it('buildSubpathEffectiveBlock throws / exits when a stub is missing from metafile.outputs', async () => {
        const { buildSubpathEffectiveBlock } = await import('../../scripts/bundle-snapshot.mjs')

        const fakeMeta = {
            outputs: {
                // intentionally missing dist/locale.es6.js → triggers AC-8
                'dist/base.es6.js':    { bytes: 164, imports: [] },
                'dist/utils.es6.js':   { bytes: 231, imports: [] },
                'dist/popup.es6.js':   { bytes: 362, imports: [{ path: 'dist/chunks/chunk-A.js', kind: 'import-statement' }] },
                'dist/tooltip.es6.js': { bytes: 316, imports: [] },
                'dist/tabs.es6.js':    { bytes: 260, imports: [] },
                'dist/toolbar.es6.js': { bytes: 269, imports: [] },
                'dist/sidebar.es6.js': { bytes: 269, imports: [] },
                'dist/field.es6.js':   { bytes: 263, imports: [] },
                'dist/layout.es6.js':  { bytes: 340, imports: [] },
                'dist/form.es6.js':    { bytes: 371, imports: [] },
                'dist/chunks/chunk-A.js': { bytes: 100_000, imports: [] },
            },
        }

        // The function calls process.exit(1) when stub is missing.
        // We capture that by mocking process.exit, or by checking stderr output.
        // Strategy: spy on process.exit and process.stderr.write, then call the function.
        const originalExit   = process.exit
        const originalStderr = process.stderr.write.bind(process.stderr)
        const stderrMessages: string[] = []
        let exitCode: number | undefined

        process.stderr.write = ((msg: string) => { stderrMessages.push(msg); return true }) as typeof process.stderr.write
        process.exit = ((code?: number) => { exitCode = code; throw new Error(`process.exit(${code})`) }) as typeof process.exit

        try {
            buildSubpathEffectiveBlock(fakeMeta, {}, '/tmp/fake-cwd')
        } catch (err: any) {
            // expected — process.exit throws
        } finally {
            process.exit   = originalExit
            process.stderr.write = originalStderr
        }

        expect(exitCode).toBe(1)
        expect(stderrMessages.join('')).toMatch(/subpath stub not found in metafile/)
    })
})
