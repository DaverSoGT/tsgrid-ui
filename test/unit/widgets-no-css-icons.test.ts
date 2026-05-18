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
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

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
// ---------------------------------------------------------------------------

describe('T-SCI-15: widget source files have no tsg-icon-{name} CSS class injection (R-SCI-12)', () => {

    // --- src/tsgrid.ts ---
    it('src/tsgrid.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tsgrid.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tsgrid.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/grid-render.ts ---
    it('src/grid-render.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'grid-render.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `grid-render.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/grid-search.ts ---
    it('src/grid-search.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'grid-search.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `grid-search.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tspopup.ts ---
    it('src/tspopup.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tspopup.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tspopup.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tstooltip.ts ---
    it('src/tstooltip.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tstooltip.ts'), 'utf8')
        // tsg-icon-selected is an allowed CSS state modifier — not a migrated icon
        // We use the standard findCssIconViolations which only checks the 18 icon names.
        const violations = findCssIconViolations(src)
        expect(violations, `tstooltip.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tsfield.ts ---
    it('src/tsfield.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tsfield.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tsfield.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tsform.ts ---
    it('src/tsform.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tsform.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tsform.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tstoolbar.ts (CONFIRMED zero violations per pre-flight 0.6 audit) ---
    it('src/tstoolbar.ts has no tsg-icon-{name} class injection (confirmed zero in pre-flight)', () => {
        const src = readFileSync(join(ROOT, 'src', 'tstoolbar.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tstoolbar.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tstabs.ts (CONFIRMED zero violations per pre-flight 0.6 audit) ---
    it('src/tstabs.ts has no tsg-icon-{name} class injection (confirmed zero in pre-flight)', () => {
        const src = readFileSync(join(ROOT, 'src', 'tstabs.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tstabs.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tssidebar.ts ---
    // NOTE: tsg-icon-selected is a CSS STATE MODIFIER, NOT an icon-set class.
    // It is applied to a container span to indicate selected state.
    // The 18 migrated icon names do NOT include 'selected', so findCssIconViolations
    // will correctly return empty for tssidebar.ts if only 'tsg-icon-selected' is present.
    it('src/tssidebar.ts has no tsg-icon-{name} class injection (tsg-icon-selected is allowed state modifier)', () => {
        const src = readFileSync(join(ROOT, 'src', 'tssidebar.ts'), 'utf8')
        // findCssIconViolations only checks the 18 icon names; 'selected' is not among them.
        const violations = findCssIconViolations(src)
        expect(violations, `tssidebar.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
    })

    // --- src/tsutils-notify.ts (added in v3.0.1 — closes v3.0.0 coverage hole) ---
    it('src/tsutils-notify.ts has no tsg-icon-{name} class injection', () => {
        const src = readFileSync(join(ROOT, 'src', 'tsutils-notify.ts'), 'utf8')
        const violations = findCssIconViolations(src)
        expect(violations, `tsutils-notify.ts still contains: ${violations.join(', ')}`).toHaveLength(0)
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

describe('T-PKG-1-final: package.json version is exactly 3.0.0 (R-BR-8)', () => {
    it('package.json#version === "3.0.0" (bumped in B3)', () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
        expect(pkg.version).toBe('3.0.0')
    })
})
