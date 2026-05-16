import { describe, it, expect } from 'vitest'
import { existsSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '../..')

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

    it.skipIf(!distExists).each(CSS_SUBPATHS)('dist/%s.css is non-empty and > 500KB (font sanity)', (name) => {
        const cssPath = join(ROOT, 'dist', `${name}.css`)
        if (!existsSync(cssPath)) return
        const size = statSync(cssPath).size
        // Font base64 (~600KB) dominates; a file < 500KB means woff was NOT included.
        // This guards proposal risk #2 — woff duplication acknowledged.
        expect(size).toBeGreaterThan(500 * 1024)
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
