import { describe, it, expect } from 'vitest'
import { existsSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(__dirname, '../..')

function stripHeader(s: string): string {
    return s.replace(/^\/\* tsgrid-ui 1\.0\.x \(nightly\) \([^)]+\) [^*]*\*\/\n/, '')
}

describe('PR1 — variables.less extraction is byte-stable for monolith', () => {
    it('src/less/src/variables.less exists and is non-empty (> 1KB)', () => {
        const p = join(ROOT, 'src/less/src/variables.less')
        expect(existsSync(p)).toBe(true)
        expect(statSync(p).size).toBeGreaterThan(1000)
    })

    it('src/less/tsgrid-ui.less imports variables.less FIRST among @imports', () => {
        const src = readFileSync(join(ROOT, 'src/less/tsgrid-ui.less'), 'utf8')
        const imports = [...src.matchAll(/^@import\s+["']([^"']+)["'];?/gm)].map(m => m[1])
        expect(imports[0]).toBe('src/variables.less')
    })

    it('NO @<name>: declarations remain in src/less/tsgrid-ui.less outside @import/@font-face/@media', () => {
        const src = readFileSync(join(ROOT, 'src/less/tsgrid-ui.less'), 'utf8')
        const decls = [...src.matchAll(/^@([a-zA-Z][\w-]*)\s*:/gm)]
            .map(m => m[1])
            .filter(name => !['import', 'font-face', 'media', 'keyframes', 'supports'].includes(name))
        expect(decls).toEqual([])
    })

    it('dist/tsgrid-ui.css after extraction matches the v2.11.0 snapshot (header-stripped)', () => {
        const monolithAfter = readFileSync(join(ROOT, 'dist/tsgrid-ui.css'), 'utf8')
        const snapshot = readFileSync(join(ROOT, 'test/fixtures/tsgrid-ui-v2.11.0.css'), 'utf8')
        expect(stripHeader(monolithAfter)).toEqual(stripHeader(snapshot))
    })
})
