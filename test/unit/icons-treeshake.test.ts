// @vitest-environment node
/**
 * icons-treeshake.test.ts — TDD RED commit (A2)
 *
 * G-TS: Tree-shaking proof gate (AC-SCI-6, R-SCI-1, spec #1138 §4).
 *
 * Empirically verifies that per-icon tree-shaking works by:
 * 1. Bundling test/fixtures/tree-shake-consumer/import-one.ts (one icon)
 * 2. Bundling test/fixtures/tree-shake-consumer/import-all.ts (all icons)
 * 3. Asserting: byteLength(import-one bundle) < byteLength(import-all bundle) * 0.80
 *
 * RED at A2: fails because dist/icons.es6.js does not exist yet.
 * GREEN at B2: passes after icons module is built.
 *
 * Uses esbuild (tsup's internal bundler — available as transitive dep).
 * Resolves tsgrid-ui/icons → dist/icons.es6.js via package.json exports.
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = process.cwd()
const DIST_ICONS_ESM = join(ROOT, 'dist', 'icons.es6.js')
const FIXTURE_DIR = join(ROOT, 'test', 'fixtures', 'tree-shake-consumer')
const IMPORT_ONE_TS = join(FIXTURE_DIR, 'import-one.ts')
const IMPORT_ALL_TS = join(FIXTURE_DIR, 'import-all.ts')

// esbuild is available as tsup's transitive dep (pnpm stores it at the path below).
// We resolve it from the project root to be robust.
function resolveEsbuild(): typeof import('esbuild') {
    // Try direct require first (available if hoisted or linked by pnpm)
    try {
        return require(resolve(ROOT, 'node_modules', '.pnpm', 'esbuild@0.27.7', 'node_modules', 'esbuild'))
    } catch {
        // Fallback: let Node's resolution find it via tsup's dependency
        return require('esbuild')
    }
}

// ---------------------------------------------------------------------------
// T-TS-1: G-TS tree-shaking proof (AC-SCI-6, G-TS gate, spec §4)
// ---------------------------------------------------------------------------
describe('T-TS-1: G-TS tree-shaking gate (AC-SCI-6)', () => {
    it('dist/icons.es6.js exists (required for bundling — fails RED until B2)', () => {
        expect(existsSync(DIST_ICONS_ESM)).toBe(true)
    })

    it('fixture import-one.ts exists', () => {
        expect(existsSync(IMPORT_ONE_TS)).toBe(true)
    })

    it('fixture import-all.ts exists', () => {
        expect(existsSync(IMPORT_ALL_TS)).toBe(true)
    })

    it('import-one bundle is < 80% of import-all bundle (G-TS threshold)', async () => {
        // This test requires dist/icons.es6.js to exist.
        // Fails RED at A2 (file absent), passes GREEN after B2 build.
        expect(existsSync(DIST_ICONS_ESM)).toBe(true)

        const esbuild = resolveEsbuild()

        // Bundle import-one (single icon)
        const oneResult = await esbuild.build({
            entryPoints: [IMPORT_ONE_TS],
            bundle: true,
            minify: true,
            write: false,
            format: 'esm',
            platform: 'browser',
            // Resolve tsgrid-ui/icons → our local dist/icons.es6.js
            alias: {
                'tsgrid-ui/icons': DIST_ICONS_ESM,
            },
        })

        // Bundle import-all (all icons)
        const allResult = await esbuild.build({
            entryPoints: [IMPORT_ALL_TS],
            bundle: true,
            minify: true,
            write: false,
            format: 'esm',
            platform: 'browser',
            alias: {
                'tsgrid-ui/icons': DIST_ICONS_ESM,
            },
        })

        const oneBytes = oneResult.outputFiles[0].contents.byteLength
        const allBytes = allResult.outputFiles[0].contents.byteLength

        // The G-TS spec contract: import-one must be < 80% of import-all
        const ratio = oneBytes / allBytes

        // Log ratio for diagnostics
        console.log(`G-TS tree-shake ratio: ${ratio.toFixed(4)} (${oneBytes} / ${allBytes} bytes)`)
        console.log(`G-TS threshold: 0.80 — must be < 0.80`)

        expect(ratio).toBeLessThan(0.80)
    })
})
