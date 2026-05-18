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
// The old font-glyph content rules used non-empty Unicode values like content: "A".
// The compat shim (T-FE-9) uses content: "" (empty) — that is allowed.
// ---------------------------------------------------------------------------
describe('T-FE-2: no :before glyph-content rules in icons.less (R-FE-2)', () => {
    it('no ":before { content:" rules with non-empty Unicode values (old glyph assignments)', () => {
        // Match content with non-empty values (exclude the compat shim content: "")
        expect(iconsLess).not.toMatch(/:before\s*\{[^}]*content\s*:\s*"[^"]/)
    })

    it('no per-icon :before content rules (e.g. .tsg-icon-box:before { content: "A" })', () => {
        expect(iconsLess).not.toMatch(/\.tsg-icon-[a-z-]+:before\s*\{/)
    })
})

// ---------------------------------------------------------------------------
// T-FE-3: v3.0.0 — ZERO background-image rules (R-SCI-13 supersedes R-FE-3)
// v2.14.0 had exactly 15 per-icon background-image rules.
// v3.0.0 removes ALL background-image rules from icons.less (R-SCI-13).
// ---------------------------------------------------------------------------
describe('T-FE-3-v3: ZERO background-image declarations in icons.less (R-SCI-13 — R-FE-3 superseded)', () => {
    it('background-image property count equals 0 (v3.0.0 — all per-icon rules removed)', () => {
        const matches = iconsLess.match(/background-image\s*:/g) ?? []
        expect(matches).toHaveLength(0)
    })
})

// ---------------------------------------------------------------------------
// T-FE-4: v3.0.0 — icon CSS classes no longer have background-image rules (R-SCI-13)
// ---------------------------------------------------------------------------
describe('T-FE-4-v3: icon CSS classes have NO background-image rule in icons.less (R-SCI-13)', () => {
    it.each(ICON_NAMES)('.tsg-icon-%s has NO background-image (v3.0.0 — inline SVG replaces data URIs)', (name) => {
        const pattern = new RegExp(`\\.tsg-icon-${name}\\s*\\{[^}]*background-image`)
        expect(iconsLess).not.toMatch(pattern)
    })
})

// ---------------------------------------------------------------------------
// T-FE-5: v3.0.0 — no data URI strings exist (all background-image rules removed)
// ---------------------------------------------------------------------------
describe('T-FE-5-v3: no data URI strings in icons.less (R-SCI-13 — all background-image removed)', () => {
    it('icons.less has no url(...) data URI values (v3.0.0 — per-icon CSS rules deleted)', () => {
        const uriMatches = Array.from(iconsLess.matchAll(/url\("([^"]+)"\)/g))
        expect(uriMatches).toHaveLength(0)
    })
})

// ---------------------------------------------------------------------------
// T-FE-6: v3.0.0 — no background-image data URIs (R-SCI-13)
// ---------------------------------------------------------------------------
describe('T-FE-6-v3: zero background-image data URIs in icons.less (R-SCI-13)', () => {
    it('icons.less has zero background-image data URIs (v3.0.0 — inline SVG replaces all data URIs)', () => {
        const bgMatches = Array.from(iconsLess.matchAll(/background-image\s*:\s*url\("([^"]+)"\)/g))
        expect(bgMatches).toHaveLength(0)
    })
})

// ---------------------------------------------------------------------------
// T-FE-7: tsg-icon-drop hover rule has background-image with %23fff (R-FE-5)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// T-FE-7 updated for v3.0.0 (R-SCI-15): background-image replaced by color: #fff
// The old white-fill SVG background-image is removed; color: #fff is used instead
// so fill="currentColor" on the icon SVG inherits the white color.
// ---------------------------------------------------------------------------
describe('T-FE-7-v3: tsg-icon-drop hover uses color: #fff (R-SCI-15 — R-FE-5 superseded)', () => {
    it('hover/checked block for span.tsg-icon-drop uses color: #fff (v3.0.0 currentColor migration)', () => {
        // v3.0.0: background-image replaced by color: #fff (theming via currentColor)
        expect(gridLess).toMatch(/span\.tsg-icon-drop[^}]*color\s*:\s*#fff/)
    })

    it('hover/checked block for span.tsg-icon-drop has NO background-image (R-SCI-15)', () => {
        // R-SCI-15: grid.less MUST NOT contain tsg-icon-drop hover background-image
        expect(gridLess).not.toMatch(/span\.tsg-icon-drop[^}]*background-image/)
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
// Activated at Commit E when stale files are deleted.
// ---------------------------------------------------------------------------
describe('T-FE-14: stale icon-font generated artifacts deleted (R-FE-13)', () => {
    it('tsgrid-font.woff must not exist', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'tsgrid-font.woff'))).toBe(false)
    })

    it('tsgrid-font.css must not exist', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'tsgrid-font.css'))).toBe(false)
    })

    it('preview.html must not exist', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'preview.html'))).toBe(false)
    })

    it('icons.json must not exist', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'icons', 'icons.json'))).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// T-FE-15: all 15 + drop-inverted.svg present under svg/ (R-FE-14)
// ---------------------------------------------------------------------------
describe('T-FE-15: SVG source files preserved (R-FE-14)', () => {
    // v3.0.0: drop-inverted.svg deleted (R-SCI-8). The 15 original files + 3 new ones.
    // expand.svg, collapse.svg, chevron-down.svg are new in v3.0.0 (R-SCI-7).
    it.each(ICON_NAMES)('src/less/icons/svg/%s.svg exists', (name) => {
        expect(existsSync(join(SVG_DIR, `${name}.svg`))).toBe(true)
    })

    it('src/less/icons/svg/drop-inverted.svg does NOT exist (R-SCI-8 — deleted in v3.0.0)', () => {
        expect(existsSync(join(SVG_DIR, 'drop-inverted.svg'))).toBe(false)
    })
})
