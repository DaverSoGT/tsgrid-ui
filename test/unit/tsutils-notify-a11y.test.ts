import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { crossIcon } from '../../src/icons.js'

const ROOT = process.cwd()

describe('tsutils-notify a11y — close button (G-CDC-2)', () => {
    it('tsutils-notify.ts calls crossIcon({ label: \'Close\', size: 16 }) for the close span', () => {
        const src = readFileSync(join(ROOT, 'src', 'tsutils-notify.ts'), 'utf8')
        expect(src).toContain("crossIcon({ label: 'Close', size: 16 })")
        expect(src).toContain('tsg-notify-close')
        expect(src).not.toContain('tsg-icon-cross')
    })

    it('crossIcon({ label: "Close", size: 16 }) produces svg with role="img" aria-label="Close" width="16" height="16"', () => {
        const svg = crossIcon({ label: 'Close', size: 16 })
        expect(svg).toContain('role="img"')
        expect(svg).toContain('aria-label="Close"')
        expect(svg).toContain('width="16"')
        expect(svg).toContain('height="16"')
        expect(svg).not.toContain('aria-hidden')
    })
})
