// font-externalization (v2.14.0): structural assertions for icons.less and SVG sources.
// T-FE-1..T-FE-9: icons.less shape; T-FE-14: stale files absent; T-FE-15: SVG sources present.
// Commit A = RED. Commit B (icons.less + grid.less rewrite) = GREEN.
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ICONS_LESS_PATH = join(ROOT, 'src', 'less', 'src', 'icons.less')
const GRID_LESS_PATH  = join(ROOT, 'src', 'less', 'src', 'grid.less')
const SVG_DIR         = join(ROOT, 'src', 'less', 'icons', 'svg')

const ICON_NAMES = [
    'box', 'check', 'colors', 'columns', 'cross',
    'drop', 'empty', 'eye-dropper', 'info', 'paste',
    'pencil', 'plus', 'reload', 'search', 'settings',
]

const iconsLess = existsSync(ICONS_LESS_PATH)
    ? readFileSync(ICONS_LESS_PATH, 'utf8')
    : ''

const gridLess = existsSync(GRID_LESS_PATH)
    ? readFileSync(GRID_LESS_PATH, 'utf8')
    : ''

// ---------------------------------------------------------------------------
// T-FE-1: @font-face removed; no x-font-woff string (R-FE-1)
// ---------------------------------------------------------------------------
describe('T-FE-1: @font-face absent from icons.less (R-FE-1)', () => {
    it('@font-face rule must not be present in icons.less', () => {
        expect(iconsLess).not.toContain('@font-face')
    })

    it('x-font-woff string must not appear in icons.less', () => {
        expect(iconsLess).not.toContain('x-font-woff')
    })
})

// ---------------------------------------------------------------------------
// T-FE-2: :before content rules removed (R-FE-2)
// ---------------------------------------------------------------------------
describe('T-FE-2: no :before content rules in icons.less (R-FE-2)', () => {
    it('no ":before { content:" rules present', () => {
        expect(iconsLess).not.toMatch(/:before\s*\{[^}]*content\s*:/)
    })

    it('no tsg-icon-*]:before attribute selector present', () => {
        expect(iconsLess).not.toMatch(/tsg-icon-[^\]]*\]:before/)
    })
})

// ---------------------------------------------------------------------------
// T-FE-3: exactly 15 background-image rules (R-FE-3)
// ---------------------------------------------------------------------------
describe('T-FE-3: exactly 15 background-image declarations in icons.less (R-FE-3)', () => {
    it('background-image property count equals 15', () => {
        const matches = iconsLess.match(/background-image\s*:/g) ?? []
        expect(matches).toHaveLength(15)
    })
})

// ---------------------------------------------------------------------------
// T-FE-4: each named icon class has a background-image line (R-FE-3)
// ---------------------------------------------------------------------------
describe('T-FE-4: each icon class has a background-image rule in icons.less (R-FE-3)', () => {
    it.each(ICON_NAMES)('.tsg-icon-%s has background-image', (name) => {
        const pattern = new RegExp(`\\.tsg-icon-${name}\\s*\\{[^}]*background-image`)
        expect(iconsLess).toMatch(pattern)
    })
})

// ---------------------------------------------------------------------------
// T-FE-5: no raw < or > inside data URI strings (R-FE-4)
// ---------------------------------------------------------------------------
describe('T-FE-5: no raw < or > inside data URI strings (R-FE-4)', () => {
    it('data URI values must not contain raw < characters', () => {
        // Extract everything between url(" and ")
        const uriMatches = iconsLess.matchAll(/url\("([^"]+)"\)/g)
        for (const m of uriMatches) {
            expect(m[1]).not.toContain('<')
            expect(m[1]).not.toContain('>')
        }
    })
})

// ---------------------------------------------------------------------------
// T-FE-6: each data URI starts with data:image/svg+xml;utf8,%3C (R-FE-4)
// ---------------------------------------------------------------------------
describe('T-FE-6: each background-image data URI starts with svg+xml (R-FE-4)', () => {
    it('all background-image data URIs start with data:image/svg+xml;utf8,%3C', () => {
        // Extract only background-image data URIs
        const bgMatches = iconsLess.matchAll(/background-image\s*:\s*url\("([^"]+)"\)/g)
        let count = 0
        for (const m of bgMatches) {
            expect(m[1]).toMatch(/^data:image\/svg\+xml;utf8,%3C/)
            count++
        }
        expect(count).toBe(15)
    })
})

// ---------------------------------------------------------------------------
// T-FE-7: tsg-icon-drop hover rule has background-image with %23fff (R-FE-5)
// ---------------------------------------------------------------------------
describe('T-FE-7: tsg-icon-drop hover has white-fill background-image in grid.less (R-FE-5)', () => {
    it('hover/checked block for span.tsg-icon-drop has background-image with %23fff', () => {
        // Look for the hover/checked block containing tsg-icon-drop with %23fff fill
        expect(gridLess).toMatch(/span\.tsg-icon-drop[^}]*background-image[^}]*%23fff/)
    })
})

// ---------------------------------------------------------------------------
// T-FE-8: empty.svg has no visible shape elements (R-FE-6, Gate G-2)
// ---------------------------------------------------------------------------
describe('T-FE-8: empty.svg contains no visible shape elements (R-FE-6)', () => {
    it('empty.svg exists', () => {
        expect(existsSync(join(SVG_DIR, 'empty.svg'))).toBe(true)
    })

    it('empty.svg contains no <path element', () => {
        const content = readFileSync(join(SVG_DIR, 'empty.svg'), 'utf8')
        expect(content).not.toContain('<path')
    })

    it('empty.svg contains no <polygon element', () => {
        const content = readFileSync(join(SVG_DIR, 'empty.svg'), 'utf8')
        expect(content).not.toContain('<polygon')
    })

    it('empty.svg contains no <rect element', () => {
        const content = readFileSync(join(SVG_DIR, 'empty.svg'), 'utf8')
        expect(content).not.toContain('<rect')
    })
})

// ---------------------------------------------------------------------------
// T-FE-9: compat shim content:"" present in icons.less (R-FE-7)
// ---------------------------------------------------------------------------
describe('T-FE-9: compat shim content:"" present after last icon rule (R-FE-7)', () => {
    it('[class^="tsg-icon-"]:before compat shim present with content: ""', () => {
        expect(iconsLess).toMatch(/\[class\^="tsg-icon-"\]:before[^{]*\{[^}]*content\s*:\s*""[^}]*\}/)
    })
})

// ---------------------------------------------------------------------------
// T-FE-14: stale generated artifacts do NOT exist (R-FE-13)
// NOTE: marked skip — files exist on master; will be activated at Commit E (file deletion)
// ---------------------------------------------------------------------------
describe('T-FE-14: stale icon-font generated artifacts deleted (R-FE-13)', () => {
    it.skip('tsgrid-font.woff must not exist (activated at Commit E)', () => {
        // activated at Commit E (file deletion)
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'tsgrid-font.woff'))).toBe(false)
    })

    it.skip('tsgrid-font.css must not exist (activated at Commit E)', () => {
        // activated at Commit E (file deletion)
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'tsgrid-font.css'))).toBe(false)
    })

    it.skip('preview.html must not exist (activated at Commit E)', () => {
        // activated at Commit E (file deletion)
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'preview.html'))).toBe(false)
    })

    it.skip('icons.json must not exist (activated at Commit E)', () => {
        // activated at Commit E (file deletion)
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'icons.json'))).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// T-FE-15: all 15 + drop-inverted.svg present under svg/ (R-FE-14)
// ---------------------------------------------------------------------------
describe('T-FE-15: SVG source files preserved (R-FE-14)', () => {
    it.each([...ICON_NAMES, 'drop-inverted'])('src/less/icons/svg/%s.svg exists', (name) => {
        expect(existsSync(join(SVG_DIR, `${name}.svg`))).toBe(true)
    })
})
