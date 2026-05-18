/**
 * icons-a11y.test.ts — TDD RED commit (A2)
 *
 * Asserts the accessibility contract of the tsgrid-ui/icons module.
 * Covers R-A11y-1..R-A11y-6 from spec #1138.
 *
 * At commit A2 these assertions FAIL (src/icons.ts does not exist).
 * At commit B2 all assertions pass GREEN.
 *
 * Strategy: regex-based unit test on the HTML string output of icon functions.
 * No axe-core, no DOM required (pure string assertions).
 * Minimum 6 test cases per R-A11y-6: 3 icons × 2 a11y branches.
 */
import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// R-A11y-1: no label → aria-hidden="true", no role="img", no aria-label
// R-A11y-2: label provided → role="img" + aria-label, no aria-hidden
// ---------------------------------------------------------------------------

describe('T-A11y-1..2: checkIcon() aria-hidden default (R-A11y-1)', () => {
    it('T-A11y-1: checkIcon() with no opts contains aria-hidden="true"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon()
        expect(result).toContain('aria-hidden="true"')
    })

    it('T-A11y-2: checkIcon() with no opts does NOT contain role="img"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon()
        expect(result).not.toContain('role="img"')
    })

    it('T-A11y-2b: checkIcon() with no opts does NOT contain aria-label=', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon()
        expect(result).not.toContain('aria-label=')
    })
})

describe('T-A11y-3..4: checkIcon({ label }) role=img contract (R-A11y-2)', () => {
    it('T-A11y-3: checkIcon({ label: "Check" }) contains role="img"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ label: 'Check' })
        expect(result).toContain('role="img"')
    })

    it('T-A11y-3b: checkIcon({ label: "Check" }) contains aria-label="Check"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ label: 'Check' })
        expect(result).toContain('aria-label="Check"')
    })

    it('T-A11y-4: checkIcon({ label: "Check" }) does NOT contain aria-hidden', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ label: 'Check' })
        expect(result).not.toContain('aria-hidden')
    })
})

// ---------------------------------------------------------------------------
// T-A11y-5: empty string label treated as absent → aria-hidden="true"
// ---------------------------------------------------------------------------
describe('T-A11y-5: reloadIcon({ label: "" }) treated as absent (R-A11y-1)', () => {
    it('T-A11y-5: reloadIcon({ label: "" }) contains aria-hidden="true" (empty string = absent)', async () => {
        const { reloadIcon } = await import('../../src/icons.js')
        const result = reloadIcon({ label: '' })
        expect(result).toContain('aria-hidden="true"')
    })

    it('T-A11y-5b: reloadIcon({ label: "" }) does NOT contain role="img"', async () => {
        const { reloadIcon } = await import('../../src/icons.js')
        const result = reloadIcon({ label: '' })
        expect(result).not.toContain('role="img"')
    })
})

// ---------------------------------------------------------------------------
// T-A11y-6: HTML attribute escaping in aria-label (R-A11y-3)
// ---------------------------------------------------------------------------
describe('T-A11y-6: eyeDropperIcon HTML attribute escaping in aria-label (R-A11y-3)', () => {
    it('T-A11y-6a: aria-label escapes " to &quot;', async () => {
        const { eyeDropperIcon } = await import('../../src/icons.js')
        const result = eyeDropperIcon({ label: 'A"B' })
        expect(result).toContain('&quot;')
        expect(result).not.toMatch(/aria-label="[^"]*"[^"]*"/)
    })

    it('T-A11y-6b: aria-label escapes & to &amp;', async () => {
        const { eyeDropperIcon } = await import('../../src/icons.js')
        const result = eyeDropperIcon({ label: 'A&B' })
        expect(result).toContain('&amp;')
        expect(result).not.toMatch(/aria-label="[^"]*&[^a-z#]/)
    })

    it('T-A11y-6c: aria-label escapes < to &lt;', async () => {
        const { eyeDropperIcon } = await import('../../src/icons.js')
        const result = eyeDropperIcon({ label: 'A<B' })
        expect(result).toContain('&lt;')
        expect(result).not.toContain('aria-label="A<B"')
    })

    it('T-A11y-6d: aria-label escapes > to &gt;', async () => {
        const { eyeDropperIcon } = await import('../../src/icons.js')
        const result = eyeDropperIcon({ label: 'A>B' })
        expect(result).toContain('&gt;')
        expect(result).not.toContain('aria-label="A>B"')
    })

    it('T-A11y-6e: full escape sequence — no raw <script> in output', async () => {
        const { eyeDropperIcon } = await import('../../src/icons.js')
        const result = eyeDropperIcon({ label: '"<script>' })
        expect(result).not.toContain('<script>')
    })
})

// ---------------------------------------------------------------------------
// Additional samples — expandIcon and reloadIcon a11y branch tests (R-A11y-6 minimum)
// ---------------------------------------------------------------------------

describe('expandIcon a11y contract (R-A11y-1..2)', () => {
    it('expandIcon() no opts → aria-hidden="true"', async () => {
        const { expandIcon } = await import('../../src/icons.js')
        const result = expandIcon()
        expect(result).toContain('aria-hidden="true"')
    })

    it('expandIcon() no opts → no role="img"', async () => {
        const { expandIcon } = await import('../../src/icons.js')
        const result = expandIcon()
        expect(result).not.toContain('role="img"')
    })

    it('expandIcon({ label: "Expand row" }) → role="img" + aria-label', async () => {
        const { expandIcon } = await import('../../src/icons.js')
        const result = expandIcon({ label: 'Expand row' })
        expect(result).toContain('role="img"')
        expect(result).toContain('aria-label="Expand row"')
        expect(result).not.toContain('aria-hidden')
    })
})

describe('reloadIcon a11y contract (R-A11y-1..2)', () => {
    it('reloadIcon() no opts → aria-hidden="true"', async () => {
        const { reloadIcon } = await import('../../src/icons.js')
        const result = reloadIcon()
        expect(result).toContain('aria-hidden="true"')
    })

    it('reloadIcon({ label: "Reload" }) → role="img" + aria-label', async () => {
        const { reloadIcon } = await import('../../src/icons.js')
        const result = reloadIcon({ label: 'Reload' })
        expect(result).toContain('role="img"')
        expect(result).toContain('aria-label="Reload"')
        expect(result).not.toContain('aria-hidden')
    })
})

// ---------------------------------------------------------------------------
// IconOpts.class and IconOpts.size output tests
// ---------------------------------------------------------------------------

describe('IconOpts.class and IconOpts.size output contract (D-7, D-8)', () => {
    it('checkIcon({ class: "my-icon" }) → output contains class="my-icon"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ class: 'my-icon' })
        expect(result).toContain('class="my-icon"')
    })

    it('checkIcon({ size: 32 }) → output contains width="32" height="32"', async () => {
        const { checkIcon } = await import('../../src/icons.js')
        const result = checkIcon({ size: 32 })
        expect(result).toContain('width="32"')
        expect(result).toContain('height="32"')
    })
})
