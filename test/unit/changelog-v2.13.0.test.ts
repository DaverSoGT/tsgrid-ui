// CHANGELOG.md v2.13.0 entry assertions (T-CSP-14 / R-CSP-27).
// Asserts that CHANGELOG.md has a v2.13.0 section with the required
// Known Limitations subsection and at minimum 3 numbered caveats.
//
// This test is RED before PR #2 writes the CHANGELOG entry (T-CSP-18),
// and turns GREEN once the v2.13.0 section is committed.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8')

describe('CHANGELOG.md v2.13.0 entry (R-CSP-27)', () => {
    it('contains ## v2.13.0 section', () => {
        expect(changelog).toMatch(/^## v2\.13\.0/m)
    })

    it('contains Known Limitations subsection', () => {
        expect(changelog).toMatch(/Known Limitations/)
    })

    it('contains limitation 1: per-subpath CJS file size caveat', () => {
        expect(changelog).toMatch(/1\.\s+\*\*Per-subpath CJS/)
    })

    it('contains limitation 2: type conditions caveat', () => {
        expect(changelog).toMatch(/2\.\s+\*\*Type conditions/)
    })

    it('contains limitation 3: Node.js only caveat', () => {
        expect(changelog).toMatch(/3\.\s+\*\*Node\.js only/)
    })

    it('contains "INTENTIONALLY unwrapped" cross-reference', () => {
        expect(changelog).toMatch(/INTENTIONALLY unwrapped/)
    })

    it('contains "splitting: false" reasoning mention', () => {
        expect(changelog).toMatch(/splitting:\s*false/)
    })
})
