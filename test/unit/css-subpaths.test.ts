import { describe, it, expect } from 'vitest'
import { existsSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '../..')
const V212_BASELINE_PATH = join(ROOT, 'reports', 'bundle', 'v2.12.0-baseline.json')

const distExists = existsSync(join(ROOT, 'dist'))

// Sentinel selectors confirmed against src/less/src/<widget>.less
// field:   '.tsg-field-helper' — fields.less L7 (source is fields.less, entry is field.less)
// tooltip: '.tsg-overlay'      — tooltip.less L9 (no .tsg-tooltip class exists in source)
const SENTINEL_SELECTOR: Record<string, string> = {
    grid:    '.tsg-grid',
    form:    '.tsg-form',
    tooltip: '.tsg-overlay',
    popup:   '.tsg-popup',
    sidebar: '.tsg-sidebar',
    tabs:    '.tsg-tabs',
    toolbar: '.tsg-toolbar',
    layout:  '.tsg-layout',
    field:   '.tsg-field-helper',
}

const CSS_SUBPATHS = ['grid', 'form', 'tooltip', 'popup', 'sidebar', 'tabs', 'toolbar', 'layout', 'field']

describe('css-subpaths — dist artifacts (R-GCP-8/9/10)', () => {
    it.skipIf(!distExists).each(CSS_SUBPATHS)('dist/%s.css exists', (name) => {
        expect(existsSync(join(ROOT, 'dist', `${name}.css`))).toBe(true)
    })

    it.skipIf(!distExists).each(CSS_SUBPATHS)('dist/%s.css is non-empty and > 5KB (compiled content sanity)', (name) => {
        const cssPath = join(ROOT, 'dist', `${name}.css`)
        if (!existsSync(cssPath)) return
        const size = statSync(cssPath).size
        // v3.0.0: Per-icon SVG data URI background-image rules removed from icons.less (R-SCI-13).
        // Per-widget CSS files no longer contain SVG data URI blobs; widget-specific rules remain.
        // popup.css and sidebar.css are ~10KB; threshold updated from 20KB to 5KB.
        // A file < 5KB would mean something went wrong with the compile.
        expect(size).toBeGreaterThan(5 * 1024)
    })

    it.skipIf(!distExists).each(CSS_SUBPATHS)('dist/%s.css has NO tsg-icon-{name} background-image rules (v3.0.0 — R-SCI-13)', (name) => {
        const cssPath = join(ROOT, 'dist', `${name}.css`)
        if (!existsSync(cssPath)) return
        const css = readFileSync(cssPath, 'utf8')
        // v3.0.0: .tsg-icon-{name} background-image rules are removed from icons.less (R-SCI-13).
        // Note: other background-image data URIs (e.g. column resizer in grid.css) are allowed.
        expect(css).not.toMatch(/\.tsg-icon-\w[\w-]*\s*\{[^}]*background-image/)
    })

    it.skipIf(!distExists).each(CSS_SUBPATHS)('dist/%s.css contains expected sentinel selector', (name) => {
        const cssPath = join(ROOT, 'dist', `${name}.css`)
        if (!existsSync(cssPath)) return
        const css = readFileSync(cssPath, 'utf8')
        expect(css).toContain(SENTINEL_SELECTOR[name])
    })

    // T-GCP-11: spot-check shared-rule duplication
    it.skipIf(!distExists)('dist/grid.css contains .tsg-spinner (shared-rule duplication)', () => {
        const cssPath = join(ROOT, 'dist', 'grid.css')
        if (!existsSync(cssPath)) return
        const css = readFileSync(cssPath, 'utf8')
        expect(css).toContain('.tsg-spinner')
    })

    it.skipIf(!distExists)('dist/tabs.css contains .tsg-scroll (shared-rule duplication)', () => {
        const cssPath = join(ROOT, 'dist', 'tabs.css')
        if (!existsSync(cssPath)) return
        const css = readFileSync(cssPath, 'utf8')
        expect(css).toContain('.tsg-scroll')
    })
})

// ---------------------------------------------------------------------------
// package.json wiring assertions (R-GCP-1, R-GCP-2, R-GCP-3) — RED until PR 3 GREEN step
// ---------------------------------------------------------------------------

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

describe('css-subpaths — package.json wiring (R-GCP-2/3)', () => {
    it.each(CSS_SUBPATHS)('"./%s.css" export maps to "./dist/%s.css"', (name) => {
        expect(pkg.exports[`./${name}.css`]).toBe(`./dist/${name}.css`)
    })

    it.each(CSS_SUBPATHS)('"./%s.css" export is a plain string value (no conditions object)', (name) => {
        expect(typeof pkg.exports[`./${name}.css`]).toBe('string')
    })

    it.each(CSS_SUBPATHS)('sideEffects contains "./dist/%s.css"', (name) => {
        expect(pkg.sideEffects).toContain(`./dist/${name}.css`)
    })
})

// ---------------------------------------------------------------------------
// Monolith unchanged assertions (R-GCP-6, R-GCP-11)
// ---------------------------------------------------------------------------

describe('css-subpaths — monolith unchanged (R-GCP-6/R-GCP-11)', () => {
    it('"./css" export still maps to ./dist/tsgrid-ui.css', () => {
        expect(pkg.exports['./css']).toBe('./dist/tsgrid-ui.css')
    })

    it.skipIf(!distExists)('dist/tsgrid-ui.css still exists', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.css'))).toBe(true)
    })

    it.skipIf(!distExists)('dist/tsgrid-ui.min.css still exists', () => {
        expect(existsSync(join(ROOT, 'dist', 'tsgrid-ui.min.css'))).toBe(true)
    })

    // T-GCP-12: monolith byte-stability vs v3.0.0 fixture (modulo dated header).
    // Updated from v2.14.0 fixture in v3.0.0 (svg-component-icons cycle) per Q5 convention:
    // fixture renamed and regenerated to track the current CSS shape (no SVG data URIs).
    // The fixture test/fixtures/tsgrid-ui-v3.0.0.css is the v3.0.0 baseline anchor;
    // any drift from variables.less, mixins.less, or partial imports MUST fail this check.
    it.skipIf(!distExists)('dist/tsgrid-ui.css byte-stable vs v3.0.0 fixture (modulo dated header)', () => {
        const stripHeader = (s: string) => s.replace(/^\/\* tsgrid-ui[^\n]*\n/, '')
        const monolith = readFileSync(join(ROOT, 'dist', 'tsgrid-ui.css'), 'utf8')
        const fixture  = readFileSync(join(ROOT, 'test', 'fixtures', 'tsgrid-ui-v3.0.0.css'), 'utf8')
        expect(stripHeader(monolith)).toEqual(stripHeader(fixture))
    })
})

// ---------------------------------------------------------------------------
// Bundle-snapshot invariant (R-GCP-20, T-GCP-15) — CSS keys must NOT appear
// in subpathEffective. Skips gracefully if v2.12.0-baseline.json not yet generated.
// ---------------------------------------------------------------------------

describe('css-subpaths — bundle-snapshot invariant (R-GCP-20)', () => {
    it('v2.12.0 baseline contains no CSS keys in subpathEffective', () => {
        if (!existsSync(V212_BASELINE_PATH)) return
        const snap = JSON.parse(readFileSync(V212_BASELINE_PATH, 'utf8'))
        const cssNames = CSS_SUBPATHS.map(n => `${n}.css`)
        for (const name of cssNames) {
            expect(Object.keys(snap.subpathEffective)).not.toContain(name)
        }
    })
})
