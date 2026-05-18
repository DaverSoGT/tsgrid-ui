/**
 * icons-api.test.ts — TDD RED commit (A2)
 *
 * Asserts the shape and contract of the tsgrid-ui/icons module.
 * Covers R-SCI-1..5, R-SCI-6..9, R-SCI-10..11, R-SCI-12..15
 * from spec #1138.
 *
 * At commit A2 these assertions FAIL (src/icons.ts does not exist,
 * ./icons export not in package.json, no dist/icons.* files).
 * At commit B2 all assertions pass GREEN.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SVG_DIR = join(ROOT, 'src', 'less', 'icons', 'svg')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const distExists = existsSync(join(ROOT, 'dist'))

// The 18 icon functions that must be exported from src/icons.ts
const ICON_FN_NAMES = [
    'boxIcon',
    'checkIcon',
    'chevronDownIcon',
    'collapseIcon',
    'colorsIcon',
    'columnsIcon',
    'crossIcon',
    'dropIcon',
    'emptyIcon',
    'expandIcon',
    'eyeDropperIcon',
    'infoIcon',
    'pasteIcon',
    'pencilIcon',
    'plusIcon',
    'reloadIcon',
    'searchIcon',
    'settingsIcon',
] as const

// The 18 kebab-case TsgIconName literal values
const ICON_NAMES_KEBAB = [
    'box', 'check', 'chevron-down', 'collapse', 'colors',
    'columns', 'cross', 'drop', 'empty', 'expand',
    'eye-dropper', 'info', 'paste', 'pencil', 'plus',
    'reload', 'search', 'settings',
] as const

// ---------------------------------------------------------------------------
// T-SCI-1: src/icons.ts exports exactly 18 icon functions (R-SCI-1)
// ---------------------------------------------------------------------------
describe('T-SCI-1: src/icons.ts exports exactly 18 icon functions (R-SCI-1)', () => {
    it('src/icons.ts file exists', () => {
        expect(existsSync(join(ROOT, 'src', 'icons.ts'))).toBe(true)
    })

    it('exports exactly 18 functions named {name}Icon', async () => {
        // Dynamic import of the source module. Fails RED if src/icons.ts does not exist.
        const iconsModule = await import('../../src/icons.js')
        const exportedFunctions = Object.entries(iconsModule)
            .filter(([, v]) => typeof v === 'function')
            .map(([k]) => k)
        expect(exportedFunctions).toHaveLength(18)
    })

    it('all 18 icon function names follow {name}Icon shape', async () => {
        const iconsModule = await import('../../src/icons.js')
        for (const name of ICON_FN_NAMES) {
            expect(typeof (iconsModule as Record<string, unknown>)[name]).toBe('function')
        }
    })
})

// ---------------------------------------------------------------------------
// T-SCI-2: each icon function returns string starting with <svg  (R-SCI-2)
// T-SCI-3: each icon function returns string ending with </svg>   (R-SCI-2)
// ---------------------------------------------------------------------------
describe('T-SCI-2..3: icon functions return valid SVG strings (R-SCI-2)', () => {
    it.each(ICON_FN_NAMES)('%s() returns string starting with <svg ', async (fnName) => {
        const iconsModule = await import('../../src/icons.js')
        const fn = (iconsModule as Record<string, unknown>)[fnName] as () => string
        const result = fn()
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^<svg /)
    })

    it.each(ICON_FN_NAMES)('%s() returns string ending with </svg>', async (fnName) => {
        const iconsModule = await import('../../src/icons.js')
        const fn = (iconsModule as Record<string, unknown>)[fnName] as () => string
        const result = fn()
        expect(result.trim()).toMatch(/<\/svg>$/)
    })

    it.each(ICON_FN_NAMES)('%s() output contains fill="currentColor" (R-SCI-6 theming)', async (fnName) => {
        const iconsModule = await import('../../src/icons.js')
        const fn = (iconsModule as Record<string, unknown>)[fnName] as () => string
        const result = fn()
        expect(result).toContain('fill="currentColor"')
    })
})

// ---------------------------------------------------------------------------
// T-SCI-4: each function accepts IconOpts parameter (R-SCI-3)
// ---------------------------------------------------------------------------
describe('T-SCI-4: icon functions accept IconOpts parameter (R-SCI-3)', () => {
    it('checkIcon({ label: "Test" }) returns string (accepts IconOpts)', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ label: 'Test' })
        expect(typeof result).toBe('string')
    })

    it('checkIcon({ class: "custom", size: 24 }) returns string (accepts optional fields)', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ class: 'custom', size: 24 })
        expect(typeof result).toBe('string')
    })
})

// ---------------------------------------------------------------------------
// T-SCI-5: TsgIconName type union has exactly 18 members (R-SCI-4)
// Note: runtime check via the exported constant list or type extract.
// ---------------------------------------------------------------------------
describe('T-SCI-5: TsgIconName type has 18 literal members (R-SCI-4)', () => {
    it('src/icons.ts exports TsgIconName (type export detectable via source scan)', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toContain('TsgIconName')
    })

    it('TsgIconName source definition contains all 18 kebab-case names', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        for (const name of ICON_NAMES_KEBAB) {
            expect(src).toContain(`'${name}'`)
        }
    })

    it('TsgIconName definition does not contain extra icon names (count via | separators)', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        // Find TsgIconName = ... line(s) and count | occurrences
        const typeMatch = src.match(/TsgIconName\s*=\s*([^;]+);/)
        expect(typeMatch).not.toBeNull()
        const typeBody = typeMatch![1]
        const pipeCount = (typeBody.match(/\|/g) ?? []).length
        // Leading-pipe style: 18 members = 18 pipes (one per member including first)
        // Traditional style: 18 members = 17 pipe separators
        // Accept both: between 17 and 18 pipes
        expect(pipeCount).toBeGreaterThanOrEqual(17)
        expect(pipeCount).toBeLessThanOrEqual(18)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-6: IconOpts interface has exactly 4 optional fields (R-SCI-5)
// ---------------------------------------------------------------------------
describe('T-SCI-6: IconOpts interface has 4 optional fields (R-SCI-5)', () => {
    it('src/icons.ts exports IconOpts', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toContain('IconOpts')
    })

    it('IconOpts has label?: string field', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toMatch(/label\?\s*:\s*string/)
    })

    it('IconOpts has class?: string field', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toMatch(/class\?\s*:\s*string/)
    })

    it('IconOpts has size?: number field', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toMatch(/size\?\s*:\s*number/)
    })

    it('IconOpts has color?: string field', () => {
        const src = readFileSync(join(ROOT, 'src', 'icons.ts'), 'utf8')
        expect(src).toMatch(/color\?\s*:\s*string/)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-7: all SVG source files use fill="currentColor" exclusively (R-SCI-6)
// ---------------------------------------------------------------------------
describe('T-SCI-7: SVG sources use fill="currentColor" only (R-SCI-6)', () => {
    const svgFiles = [
        'box.svg', 'check.svg', 'colors.svg', 'columns.svg', 'cross.svg',
        'drop.svg', 'empty.svg', 'eye-dropper.svg', 'info.svg', 'paste.svg',
        'pencil.svg', 'plus.svg', 'reload.svg', 'search.svg', 'settings.svg',
        'expand.svg', 'collapse.svg', 'chevron-down.svg',
    ]

    it.each(svgFiles)('%s does not contain hardcoded hex fill (no fill="#...")', (name) => {
        const content = readFileSync(join(SVG_DIR, name), 'utf8')
        // Must not contain fill="#..." (hex colors) — currentColor is the only allowed fill value
        expect(content).not.toMatch(/fill="#[0-9a-fA-F]/)
    })

    it.each(svgFiles)('%s does not contain fill="black", fill="white", or other named colors', (name) => {
        const content = readFileSync(join(SVG_DIR, name), 'utf8')
        // Must not contain named color fills (e.g. fill="black", fill="white", fill="red")
        // Allowed: fill="currentColor" and no fill at all
        expect(content).not.toMatch(/fill="(black|white|red|blue|green|navy|gray|grey|#[0-9a-fA-F])/)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-8: 3 new SVG files exist (R-SCI-7)
// ---------------------------------------------------------------------------
describe('T-SCI-8: new SVG source files exist (R-SCI-7)', () => {
    it('src/less/icons/svg/expand.svg exists', () => {
        expect(existsSync(join(SVG_DIR, 'expand.svg'))).toBe(true)
    })

    it('src/less/icons/svg/collapse.svg exists', () => {
        expect(existsSync(join(SVG_DIR, 'collapse.svg'))).toBe(true)
    })

    it('src/less/icons/svg/chevron-down.svg exists', () => {
        expect(existsSync(join(SVG_DIR, 'chevron-down.svg'))).toBe(true)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-9: drop-inverted.svg does NOT exist (R-SCI-8)
// ---------------------------------------------------------------------------
describe('T-SCI-9: drop-inverted.svg is deleted (R-SCI-8)', () => {
    it('src/less/icons/svg/drop-inverted.svg does NOT exist', () => {
        expect(existsSync(join(SVG_DIR, 'drop-inverted.svg'))).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-10: package.json#exports["./icons"] shape (R-SCI-9)
// ---------------------------------------------------------------------------
describe('T-SCI-10: package.json exports["./icons"] correct shape (R-SCI-9)', () => {
    it('pkg.exports["./icons"] is defined', () => {
        expect(pkg.exports['./icons']).toBeDefined()
    })

    it('pkg.exports["./icons"].types points to ./dist/icons.d.ts', () => {
        expect(pkg.exports['./icons'].types).toBe('./dist/icons.d.ts')
    })

    it('pkg.exports["./icons"].import points to ./dist/icons.es6.js', () => {
        expect(pkg.exports['./icons'].import).toBe('./dist/icons.es6.js')
    })

    it('pkg.exports["./icons"].require points to ./dist/icons.js', () => {
        expect(pkg.exports['./icons'].require).toBe('./dist/icons.js')
    })
})

// ---------------------------------------------------------------------------
// T-SCI-11..13: dist/icons.* files exist and are non-empty (R-SCI-10)
// ---------------------------------------------------------------------------
describe('T-SCI-11..13: dist/icons.* artifacts exist and non-empty (R-SCI-10)', () => {
    it.skipIf(!distExists)('T-SCI-11: dist/icons.es6.js exists and is non-empty', () => {
        const p = join(ROOT, 'dist', 'icons.es6.js')
        expect(existsSync(p)).toBe(true)
        expect(statSync(p).size).toBeGreaterThan(0)
    })

    it.skipIf(!distExists)('T-SCI-12: dist/icons.js exists and is non-empty', () => {
        const p = join(ROOT, 'dist', 'icons.js')
        expect(existsSync(p)).toBe(true)
        expect(statSync(p).size).toBeGreaterThan(0)
    })

    it.skipIf(!distExists)('T-SCI-13: dist/icons.d.ts exists and is non-empty', () => {
        const p = join(ROOT, 'dist', 'icons.d.ts')
        expect(existsSync(p)).toBe(true)
        expect(statSync(p).size).toBeGreaterThan(0)
    })
})

// ---------------------------------------------------------------------------
// T-SCI-14: dist/icons.es6.js NOT in package.json#sideEffects (R-SCI-11)
// ---------------------------------------------------------------------------
describe('T-SCI-14: icons dist NOT in sideEffects (R-SCI-11, INV-4)', () => {
    it('dist/icons.es6.js is NOT in sideEffects', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.es6.js')
    })

    it('dist/icons.js is NOT in sideEffects', () => {
        expect(pkg.sideEffects).not.toContain('./dist/icons.js')
    })
})

// ---------------------------------------------------------------------------
// T-SCI-15: widget files have zero tsg-icon-{name} class strings (R-SCI-12)
// NOTE: B3-scope test — widget migration happens in PR3 (B3 GREEN commit).
//       This test stays RED until B3 removes tsg-icon-* class injection.
// ---------------------------------------------------------------------------
describe('T-SCI-15: widget files have no tsg-icon-{name} class strings (R-SCI-12) [B3-scope]', () => {
    // B3-scope: widget migration happens in PR3 (B3 GREEN commit).
    // These tests are marked todo until PR3 migrates all 9 widget files.
    it.todo('src/tsgrid.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/grid-render.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tspopup.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tstooltip.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tsfield.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tsform.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tstoolbar.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tstabs.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
    it.todo('src/tssidebar.ts has no tsg-icon-{name} class injection [B3-scope: migrated in PR3]')
})

// ---------------------------------------------------------------------------
// T-SCI-16: icons.less has zero background-image rules (R-SCI-13)
// NOTE: B3-scope test — icons.less background-image removal happens in PR3 (B3 GREEN commit).
// ---------------------------------------------------------------------------
describe('T-SCI-16: icons.less has no background-image rules (R-SCI-13) [B3-scope]', () => {
    it.todo('src/less/src/icons.less has zero background-image declarations [B3-scope: removed in PR3]')
})

// ---------------------------------------------------------------------------
// T-SCI-17: common.less has no .tsg-icon-expand / .tsg-icon-collapse rules (R-SCI-14)
// NOTE: B3-scope test — common.less CSS-trick removal happens in PR3 (B3 GREEN commit).
// ---------------------------------------------------------------------------
describe('T-SCI-17: common.less has no expand/collapse CSS-trick rules (R-SCI-14) [B3-scope]', () => {
    it.todo('common.less has no .tsg-icon-expand rule [B3-scope: removed in PR3]')
    it.todo('common.less has no .tsg-icon-collapse rule [B3-scope: removed in PR3]')
})

// ---------------------------------------------------------------------------
// T-SCI-18: grid.less has no tsg-icon-drop hover background-image rule (R-SCI-15)
// ---------------------------------------------------------------------------
describe('T-SCI-18: grid.less has no tsg-icon-drop hover background-image override (R-SCI-15)', () => {
    it('grid.less does not contain tsg-icon-drop hover background-image pattern', () => {
        const content = readFileSync(join(ROOT, 'src', 'less', 'src', 'grid.less'), 'utf8')
        expect(content).not.toMatch(/tsg-icon-drop[^}]*background-image/)
    })
})
