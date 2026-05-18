// Byte-floor guard for Phase 4 CJS subpath bundles (R-CSP-14, R-CSP-22).
// Baselines now live in ./cjs-subpath-baselines (extracted to close S-2 from
// verify report #1104 so other tests can import the same source of truth).
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { CJS_SUBPATH_BYTE_BASELINES, CJS_SUBPATH_NAMES } from './cjs-subpath-baselines'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

const BYTE_BASELINES = CJS_SUBPATH_BYTE_BASELINES
const SUBPATHS = CJS_SUBPATH_NAMES
const distExists = existsSync(join(ROOT, 'dist'))

describe('cjs-subpath-bytes — per-file byte-floor guard (R-CSP-14, R-CSP-22)', () => {
    it('package version is 2.14.0 (font-externalization release anchor)', () => {
        expect(pkg.version).toBe('2.14.0')
    })

    it.skipIf(!distExists).each(SUBPATHS)(
        'dist/%s.js exists (CJS subpath bundle present)',
        (name) => {
            const p = join(ROOT, 'dist', `${name}.js`)
            expect(existsSync(p)).toBe(true)
        }
    )

    it.skipIf(!distExists).each(SUBPATHS)(
        'dist/%s.js size is within [min, max] baseline range (R-CSP-14)',
        (name) => {
            const p = join(ROOT, 'dist', `${name}.js`)
            expect(existsSync(p)).toBe(true)
            const { size } = statSync(p)
            const { min, max } = BYTE_BASELINES[name]
            expect(size, `${name}.js size ${size} bytes is below floor ${min} bytes`).toBeGreaterThanOrEqual(min)
            expect(size, `${name}.js size ${size} bytes exceeds ceiling ${max} bytes`).toBeLessThanOrEqual(max)
        }
    )
})
