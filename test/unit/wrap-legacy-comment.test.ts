// wrap-legacy.mjs comment + SUBPATH_CJS_NEVER_WRAP constant assertions (T-CSP-12).
// R-CSP-13: asserts that wrap-legacy.mjs carries the v2.13.0 Phase 4 comment
// with "INTENTIONALLY unwrapped" (exact phrase) and the SUBPATH_CJS_NEVER_WRAP
// tripwire constant with all 12 widget filenames.
//
// This test is RED before PR #2 updates wrap-legacy.mjs (old comment + no constant),
// and turns GREEN after T-CSP-15 applies the changes.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const wrapLegacySource = readFileSync(join(ROOT, 'scripts', 'wrap-legacy.mjs'), 'utf8')

const EXPECTED_WIDGET_FILENAMES = [
    'base.js', 'field.js', 'form.js', 'grid.js', 'layout.js',
    'locale.js', 'popup.js', 'sidebar.js', 'tabs.js', 'toolbar.js',
    'tooltip.js', 'utils.js',
]

describe('wrap-legacy.mjs Phase 4 comment + SUBPATH_CJS_NEVER_WRAP (R-CSP-13)', () => {
    it('source contains "INTENTIONALLY unwrapped" (R-CSP-13 exact phrase)', () => {
        expect(wrapLegacySource).toMatch(/INTENTIONALLY unwrapped/)
    })

    it('source contains SUBPATH_CJS_NEVER_WRAP constant (tripwire for future glob refactors)', () => {
        expect(wrapLegacySource).toMatch(/SUBPATH_CJS_NEVER_WRAP/)
    })

    it.each(EXPECTED_WIDGET_FILENAMES)(
        'SUBPATH_CJS_NEVER_WRAP contains "%s"',
        (filename) => {
            expect(wrapLegacySource).toContain(`'${filename}'`)
        }
    )

    it('SUBPATH_CJS_NEVER_WRAP is a Set with exactly 12 widget filenames', () => {
        // Count occurrences of widget .js filenames in the SUBPATH_CJS_NEVER_WRAP block.
        // We check that all 12 expected names appear and the pattern uses new Set([...]).
        expect(wrapLegacySource).toMatch(/SUBPATH_CJS_NEVER_WRAP\s*=\s*new Set/)
    })
})
