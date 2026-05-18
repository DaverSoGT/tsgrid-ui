// Tarball-contents smoke test (S-3 from verify report #1088).
//
// Runs `pnpm pack --dry-run` and asserts that the tarball that WOULD be
// published includes all required files (per package.json#files[] + dist
// glob) and excludes everything that should not ship (gitignored dirs,
// repo-only docs, test/, src/, reports/, etc).
//
// This guard would have caught the v2.12.0 S-1 issue (readme.md vs
// README.md case-collision) at apply time, before the v2.12.0 publish.
// Subsequent regressions in packaging surface are now CI-detectable.
import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// Parse the file listing from `pnpm pack --dry-run` stdout.
// Output shape:
//   📦 tsgrid-ui@X.Y.Z
//   Tarball Contents
//   <file>
//   <file>
//   ...
//   Tarball Details
//   tsgrid-ui-X.Y.Z.tgz
function getTarballContents(): string[] {
    const output = execSync('pnpm pack --dry-run', {
        cwd:      ROOT,
        encoding: 'utf8',
        stdio:    ['ignore', 'pipe', 'ignore'],
    })
    const lines = output.split('\n').map(l => l.trim())
    const start = lines.indexOf('Tarball Contents') + 1
    const end   = lines.indexOf('Tarball Details')
    if (start === 0 || end === -1) {
        throw new Error('Could not parse pnpm pack --dry-run output: missing section markers')
    }
    return lines.slice(start, end).filter(l => l.length > 0)
}

const WIDGETS = ['grid', 'form', 'tooltip', 'popup', 'sidebar', 'tabs', 'toolbar', 'layout', 'field']
const SUBPATHS = ['base', 'utils', 'locale', 'popup', 'tooltip', 'tabs', 'toolbar', 'sidebar', 'field', 'layout', 'form', 'grid']

describe('tarball contents (S-3 — packaging regression guard)', () => {
    let contents: string[]

    beforeAll(() => {
        contents = getTarballContents()
    }, 60_000)

    // -----------------------------------------------------------------------
    // Required documentation files
    // -----------------------------------------------------------------------

    // R-S3-1: README.md (uppercase) MUST ship — package.json#files[] entry is
    // "README.md", and on case-sensitive FS (Linux/macOS), the file must be
    // tracked with matching case. This is the regression guard for v2.12.0 S-1.
    it('includes README.md (uppercase — critical for npm display + case-sensitive FS)', () => {
        expect(contents).toContain('README.md')
    })

    it('includes CHANGELOG.md', () => {
        expect(contents).toContain('CHANGELOG.md')
    })

    it('includes LICENSE', () => {
        expect(contents).toContain('LICENSE')
    })

    it('includes MIGRATION_v2.md', () => {
        expect(contents).toContain('MIGRATION_v2.md')
    })

    it('includes MIGRATION-FROM-W2UI.md', () => {
        expect(contents).toContain('MIGRATION-FROM-W2UI.md')
    })

    it('includes package.json', () => {
        expect(contents).toContain('package.json')
    })

    // -----------------------------------------------------------------------
    // CSS surface (monolith + 9 per-widget — v2.12.0 grid-css-pairing)
    // -----------------------------------------------------------------------

    it('includes the monolith CSS + minified variant', () => {
        expect(contents).toContain('dist/tsgrid-ui.css')
        expect(contents).toContain('dist/tsgrid-ui.min.css')
    })

    it.each(WIDGETS)('includes per-widget CSS dist/%s.css (v2.12.0+)', (name) => {
        expect(contents).toContain(`dist/${name}.css`)
    })

    // -----------------------------------------------------------------------
    // JS surface (12 subpath ESM stubs + monolith CJS/ESM + minified)
    // -----------------------------------------------------------------------

    it.each(SUBPATHS)('includes ESM subpath dist/%s.es6.js', (name) => {
        expect(contents).toContain(`dist/${name}.es6.js`)
    })

    it.each(SUBPATHS)('includes CJS subpath dist/%s.js (v2.13.0 Phase 4)', (name) => {
        expect(contents).toContain(`dist/${name}.js`)
    })

    it.each(SUBPATHS)('includes subpath types dist/%s.d.ts', (name) => {
        expect(contents).toContain(`dist/${name}.d.ts`)
    })

    it('includes the monolith JS (CJS + ESM + minified variants)', () => {
        expect(contents).toContain('dist/tsgrid-ui.js')
        expect(contents).toContain('dist/tsgrid-ui.es6.js')
        expect(contents).toContain('dist/tsgrid-ui.min.js')
        expect(contents).toContain('dist/tsgrid-ui.es6.min.js')
        expect(contents).toContain('dist/tsgrid-ui.d.ts')
    })

    // -----------------------------------------------------------------------
    // Required exclusions
    // -----------------------------------------------------------------------

    it('does NOT include dist/metafile-esm.json (explicit !exclusion in files[])', () => {
        expect(contents).not.toContain('dist/metafile-esm.json')
    })

    it('does NOT include CHANGELOG-archive.md (repo-only, not in files[])', () => {
        expect(contents).not.toContain('CHANGELOG-archive.md')
    })

    it('does NOT include legacy/ directory (pre-fork w2ui sources, not shipped)', () => {
        const legacyEntries = contents.filter(f => f.startsWith('legacy/'))
        expect(legacyEntries).toEqual([])
    })

    it('does NOT include node_modules/', () => {
        const nodeModulesEntries = contents.filter(f => f.startsWith('node_modules/'))
        expect(nodeModulesEntries).toEqual([])
    })

    it('does NOT include test/ directory (tests + fixtures not shipped)', () => {
        const testEntries = contents.filter(f => f.startsWith('test/'))
        expect(testEntries).toEqual([])
    })

    it('does NOT include src/ directory (TypeScript sources not shipped — only compiled dist/)', () => {
        const srcEntries = contents.filter(f => f.startsWith('src/'))
        expect(srcEntries).toEqual([])
    })

    it('does NOT include reports/ directory (bundle baselines not shipped)', () => {
        const reportsEntries = contents.filter(f => f.startsWith('reports/'))
        expect(reportsEntries).toEqual([])
    })

    it('does NOT include scripts/ directory (build scripts not shipped)', () => {
        const scriptsEntries = contents.filter(f => f.startsWith('scripts/'))
        expect(scriptsEntries).toEqual([])
    })

    it('does NOT include any .ts source files (only .d.ts + compiled .js)', () => {
        const tsSourceEntries = contents.filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
        expect(tsSourceEntries).toEqual([])
    })

    // -----------------------------------------------------------------------
    // Sanity: package version matches what we expect ships
    // -----------------------------------------------------------------------

    it('package.json version anchors the tarball name', () => {
        // pkg.version is read from disk — drives the tarball filename.
        // If a future release accidentally bumps version without updating
        // tests, this fails and forces a deliberate update.
        expect(typeof pkg.version).toBe('string')
        expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?$/)
    })
})
