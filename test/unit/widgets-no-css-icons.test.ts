/**
 * widgets-no-css-icons.test.ts — TDD RED commit (A3)
 *
 * Asserts that:
 *   1. Widget source files have NO .tsg-icon-{name} class injection strings
 *      (R-SCI-12 from spec #1138).
 *   2. src/less/src/icons.less has ZERO background-image rules (R-SCI-13).
 *   3. src/less/src/common.less has NO .tsg-icon-expand / .tsg-icon-collapse
 *      CSS-border-trick rules (R-SCI-14).
 *   4. test/smoke/*.html fixtures do NOT reference deleted barrel bundles
 *      (dist/tsgrid-ui.js or dist/tsgrid-ui.min.js).
 *
 * At commit A3 (RED) these assertions FAIL because:
 *   - Widget files still contain tsg-icon-{name} class strings
 *   - icons.less still contains background-image rules
 *   - common.less still contains .tsg-icon-expand / .tsg-icon-collapse rules
 *   - smoke/*.html files still reference dist/tsgrid-ui.js
 *
 * At commit B3 (GREEN) ALL assertions pass.
 *
 * Allowed exceptions (must NOT be flagged):
 *   - 'tsg-icon' base class (no suffix) is a layout class — allowed everywhere
 *   - 'tsg-icon-selected' in tssidebar.ts is a CSS state modifier — allowed (per
 *     tasks #1141 §2 A-4 audit: it is NOT an icon-set class, it is a UI-state
 *     modifier applied to the icon container)
 *   - The comment-only string 'tsg-icon-selected' in tssidebar.ts is allowed
 *   - Template strings like icon: 'tsg-icon-search' in tsgrid.ts toolbar item
 *     definitions are MIGRATED data (user-supplied string field on toolbar items
 *     is different from the widget rendering using it as a CSS class) — however
 *     per R-SCI-12, ALL internal render-side injections must be migrated. The
 *     icon: 'tsg-icon-{name}' data assignments in tsgrid.ts toolbar defaults ARE
 *     in scope: they feed the toolbar renderer which uses them as CSS classes.
 *
 * Widget files in scope (10 files per R-SCI-12 + v3.0.1 hotfix):
 *   src/tsgrid.ts, src/grid-render.ts, src/tspopup.ts, src/tstooltip.ts,
 *   src/tsfield.ts, src/tsform.ts, src/tstoolbar.ts, src/tstabs.ts, src/tssidebar.ts,
 *   src/tsutils-notify.ts (added in v3.0.1 — closes v3.0.0 coverage hole)
 *
 * Additionally: src/grid-search.ts (grid search helper with icon data).
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// ---------------------------------------------------------------------------
// Suite 1 setup: glob-derived widget file list (D-8 refactor)
// ---------------------------------------------------------------------------

/**
 * Non-widget source files to exclude from the css-icon injection scan.
 * These are utility modules, base classes, grid sub-modules, or files
 * that do not render widget HTML and therefore have no icon-class injection surface.
 *
 * IMPORTANT: When adding a new src/*.ts file that is NOT a widget, add it here.
 * If you add a new WIDGET file, do NOT add it here — the length-guard below
 * (`has 11 widget files`) will catch the drift and remind you to update the count.
 */
const NON_WIDGET_SRC = new Set<string>([
    'tslocale.ts',            // locale data, not a widget
    'tsbase.ts',              // base class shared by widgets — not a standalone widget
    'tsutils.ts',             // utils barrel re-exporting submodules
    'query.ts',               // query helper, no HTML rendering
    'tslayout.ts',            // layout manager — no icon-class injection surface in this cycle
    'grid-columns.ts',        // grid sub-module (column definitions)
    'grid-data.ts',           // grid sub-module (data handling)
    'grid-edit.ts',           // grid sub-module (editing logic)
    'grid-interaction.ts',    // grid sub-module (event handling)
    'grid-selection.ts',      // grid sub-module (selection state)
    'grid-state.ts',          // grid sub-module (state management)
    'tsutils-data.ts',        // utils sub-module (data utilities)
    'tsutils-marker.ts',      // utils sub-module (marker utilities)
    'tsutils-type-guards.ts', // utils sub-module (type guards — no rendering)
    'tsutils-color.ts',       // utils sub-module (color utilities)
    'tsutils-message.ts',     // utils sub-module (message utilities)
    'tsutils-registry.ts',    // utils sub-module (registry pattern)
    'tsutils-string.ts',      // utils sub-module (string utilities)
    'tsutils-dom.ts',         // utils sub-module (DOM utilities)
    'tsutils-datetime.ts',    // utils sub-module (datetime utilities)
    'tsutils-locale.ts',      // utils sub-module (locale utilities)
    'lazy-singleton.ts',      // build/DI helper — no HTML rendering
    'types.ts',               // pure types module — no runtime rendering
    'icons.ts',               // icon module — exports SVG helpers, not a widget that injects CSS class names
])

/**
 * Widget source files: all src/*.ts files not in NON_WIDGET_SRC.
 * Expected = 11 (tsgrid, grid-render, grid-search, tspopup, tstooltip,
 *               tsfield, tsform, tstoolbar, tstabs, tssidebar, tsutils-notify).
 */
const widgetFiles = readdirSync(join(ROOT, 'src'))
    .filter(f => f.endsWith('.ts') && !NON_WIDGET_SRC.has(f))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The 18 migrated icon names (kebab-case). */
const MIGRATED_ICON_NAMES = [
    'box', 'check', 'chevron-down', 'collapse', 'colors',
    'columns', 'cross', 'drop', 'empty', 'expand',
    'eye-dropper', 'info', 'paste', 'pencil', 'plus',
    'reload', 'search', 'settings',
] as const

/**
 * Returns true if the given string contains a .tsg-icon-{name} pattern for
 * any of the 18 migrated icons (class="tsg-icon tsg-icon-{name}" template or
 * icon: 'tsg-icon-{name}' data field style).
 *
 * Allowed exceptions (not counted as violations):
 *   - 'tsg-icon-selected' (CSS state modifier — not an icon-set class)
 *   - bare 'tsg-icon' without a suffix
 *   - class toggling for 'tsg-icon-selected' in tssidebar (see above)
 */
function findCssIconViolations(source: string): string[] {
    const violations: string[] = []
    for (const name of MIGRATED_ICON_NAMES) {
        // Match patterns like:
        //   tsg-icon-check           (bare CSS class name substring)
        //   'tsg-icon-search'        (quoted JS string)
        //   "tsg-icon-cross"         (double-quoted JS string)
        //   `tsg-icon-reload`        (template literal)
        // Using a general pattern: tsg-icon-{name} appears literally
        const pattern = new RegExp(`tsg-icon-${name.replace(/-/g, '[-]')}(?:[^-a-z]|$)`)
        if (pattern.test(source)) {
            violations.push(`tsg-icon-${name}`)
        }
    }
    return violations
}

// ---------------------------------------------------------------------------
// Suite 1: Widget source files — no tsg-icon-{name} class injection (R-SCI-12)
// D-8 refactor: 11 hardcoded it() blocks replaced with glob-derived it.each(widgetFiles).
// NON_WIDGET_SRC denylist + length-guard defined above (pre-describe block).
// ---------------------------------------------------------------------------

describe('T-SCI-15: widget source files have no tsg-icon-{name} CSS class injection (R-SCI-12)', () => {

    // Length-guard: must be the FIRST it() in Suite 1 (D-CCF-15).
    // Fails loud if NON_WIDGET_SRC denylist drifts (new src/*.ts added without updating the set).
    it('has 11 widget files (denylist sanity check)', () => {
        expect(
            widgetFiles.length,
            'NON_WIDGET_SRC denylist drifted — update the set when adding non-widget src/*.ts files',
        ).toBe(11)
    })

    // Covers all 11 widget files derived from src/ minus NON_WIDGET_SRC.
    // Same assertions as the former individual it() blocks — no regression in violation detection.
    // tsg-icon-selected is a CSS state modifier (not in MIGRATED_ICON_NAMES) — correctly ignored.
    it.each(widgetFiles)('src/%s has no tsg-icon-{name} class injection', (file) => {
        const src = readFileSync(join(ROOT, 'src', file), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `${file} still contains: ${violations.join(', ')}`).toHaveLength(0)
    })
})

// ---------------------------------------------------------------------------
// Suite 2: icons.less — zero background-image rules (R-SCI-13)
// ---------------------------------------------------------------------------

describe('T-SCI-16: src/less/src/icons.less has zero background-image rules (R-SCI-13)', () => {
    it('icons.less file exists', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'src', 'icons.less'))).toBe(true)
    })

    it('icons.less has no background-image declarations', () => {
        const content = readFileSync(join(ROOT, 'src', 'less', 'src', 'icons.less'), 'utf8')
        // After B3 the per-icon background-image rules are removed.
        // The file may retain the base .tsg-icon layout rule and compat shim only.
        expect(content).not.toMatch(/background-image\s*:/)
    })
})

// ---------------------------------------------------------------------------
// Suite 3: common.less — no expand/collapse CSS border-trick rules (R-SCI-14)
// ---------------------------------------------------------------------------

describe('T-SCI-17: src/less/src/common.less has no tsg-icon-expand/collapse rules (R-SCI-14)', () => {
    it('common.less file exists', () => {
        expect(existsSync(join(ROOT, 'src', 'less', 'src', 'common.less'))).toBe(true)
    })

    it('common.less has no .tsg-icon-expand CSS rule', () => {
        const content = readFileSync(join(ROOT, 'src', 'less', 'src', 'common.less'), 'utf8')
        // After B3 the CSS border-trick expand/collapse rules are removed from common.less
        // because the widget now renders inline SVG via expandIcon() / collapseIcon().
        expect(content).not.toContain('.tsg-icon-expand')
    })

    it('common.less has no .tsg-icon-collapse CSS rule', () => {
        const content = readFileSync(join(ROOT, 'src', 'less', 'src', 'common.less'), 'utf8')
        expect(content).not.toContain('.tsg-icon-collapse')
    })
})

// ---------------------------------------------------------------------------
// Suite 4: Smoke fixtures — no references to deleted barrel IIFE bundles
// ---------------------------------------------------------------------------

const SMOKE_FIXTURES = [
    'test/smoke/form.html',
    'test/smoke/grid-basic.html',
    'test/smoke/grid-edit.html',
    'test/smoke/grid-selection.html',
    'test/smoke/layout.html',
    'test/smoke/popup.html',
    'test/smoke/sidebar.html',
    'test/smoke/tooltip.html',
] as const

describe('smoke fixture barrel-IIFE migration — fixtures must not reference deleted dist/tsgrid-ui bundles', () => {
    it.each(SMOKE_FIXTURES)('%s does not reference dist/tsgrid-ui.js (deleted in PR1)', (fixture) => {
        expect(existsSync(join(ROOT, fixture))).toBe(true)
        const content = readFileSync(join(ROOT, fixture), 'utf8')
        expect(content, `${fixture} still contains dist/tsgrid-ui.js`).not.toContain('dist/tsgrid-ui.js')
    })

    it.each(SMOKE_FIXTURES)('%s does not reference dist/tsgrid-ui.min.js (deleted in PR1)', (fixture) => {
        const content = readFileSync(join(ROOT, fixture), 'utf8')
        expect(content, `${fixture} still contains dist/tsgrid-ui.min.js`).not.toContain('dist/tsgrid-ui.min.js')
    })
})

// ---------------------------------------------------------------------------
// Suite 5: package.json version is final 3.0.0 (R-BR-8 final pin)
// NOTE: currently 3.0.0-rc.1 — this test will go RED until B3 bumps to 3.0.0.
// ---------------------------------------------------------------------------

describe('T-PKG-1-final: package.json version is exactly 3.0.3 (v3.0.3 cleanup-carry-forwards)', () => {
    it('package.json#version === "3.0.3"', () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
        expect(pkg.version).toBe('3.0.3')
    })
})
