// Build idempotency guard — pnpm build:css must produce byte-identical dist/*.css
// on consecutive runs (T-FE-19 / W-3 banner-determinism closure).
//
// Distinct from build-determinism.test.ts which uses TSGRID_CSS_OUT tmp-dirs and
// strips the dated header before comparison. THIS test asserts the real dist/
// files are unchanged byte-for-byte after two sequential `pnpm build:css` runs —
// i.e. the banner itself must be deterministic, not just the body content.
//
// RED state: banner contains `new Date().toLocaleString('en-us')` → run 1 and run 2
// may collide by second-boundary luck, but the banner contains a date literal that
// violates the determinism contract. We detect non-determinism by asserting the
// banner matches the deterministic form (version-only, no date/time literal).
//
// GREEN state: banner is version-only (no timestamp) → hashes identical across runs.

import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(__dirname, '../..')
const DIST = join(ROOT, 'dist')
const distExists = existsSync(DIST)

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

// A banner is deterministic if it does NOT contain any date/time patterns.
// Current non-deterministic banner contains e.g. "(5/17/2026, 8:49:52 PM)"
// The fixed deterministic banner contains only the version string.
const TIMESTAMP_PATTERN = /\(\d{1,2}\/\d{1,2}\/\d{4},\s*\d{1,2}:\d{2}:\d{2}\s*(AM|PM)\)/i

function hashFile(filePath: string): string {
    return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function hashDist(): Record<string, string> {
    const hashes: Record<string, string> = {}
    const cssFiles = readdirSync(DIST).filter(f => f.endsWith('.css'))
    for (const name of cssFiles) {
        hashes[name] = hashFile(join(DIST, name))
    }
    return hashes
}

function readBanners(): Record<string, string> {
    const banners: Record<string, string> = {}
    const cssFiles = readdirSync(DIST).filter(f => f.endsWith('.css'))
    for (const name of cssFiles) {
        const content = readFileSync(join(DIST, name), 'utf8')
        const match = content.match(/^\/\*[^\n]*\n/)
        banners[name] = match ? match[0] : ''
    }
    return banners
}

function runBuildCss(): void {
    execSync('pnpm build:css', {
        cwd: ROOT,
        stdio: 'pipe',
    })
}

describe.skipIf(!distExists)(
    'build idempotency — pnpm build:css produces byte-identical dist/*.css on consecutive runs (T-FE-19)',
    () => {
        let hashes1: Record<string, string> = {}
        let hashes2: Record<string, string> = {}
        let banners1: Record<string, string> = {}
        let cssNames: string[] = []

        beforeAll(() => {
            runBuildCss()
            hashes1 = hashDist()
            banners1 = readBanners()
            cssNames = Object.keys(hashes1).sort()
            runBuildCss()
            hashes2 = hashDist()
        }, 120_000)

        it('at least one CSS file exists in dist/ after build', () => {
            expect(cssNames.length).toBeGreaterThan(0)
        })

        // Banner determinism: the first line of each CSS file must NOT contain
        // a date/time literal. This assertion goes RED with the current banner
        // (which contains `new Date().toLocaleString('en-us')`) regardless of
        // second-boundary timing luck.
        it.each(cssNames.length > 0 ? cssNames : ['(no css)'])(
            'dist/%s banner must not contain a date/time literal (banner must be deterministic)',
            (name) => {
                if (name === '(no css)') return
                const banner = banners1[name] ?? ''
                expect(
                    banner,
                    `dist/${name} banner contains a runtime date/time — banner is non-deterministic.\nActual banner: ${banner.trim()}`
                ).not.toMatch(TIMESTAMP_PATTERN)
            }
        )

        // Hash-equality: byte-for-byte identical across two consecutive builds.
        // This catches any other sources of non-determinism (not just timestamp).
        it.each(cssNames.length > 0 ? cssNames : ['(no css)'])(
            'dist/%s SHA-256 is identical across two consecutive pnpm build:css runs',
            (name) => {
                if (name === '(no css)') return
                expect(
                    hashes2[name],
                    `dist/${name} hash changed between consecutive builds — build output is non-deterministic`
                ).toBe(hashes1[name])
            }
        )

        // Belt-and-suspenders: verify the banner carries the correct package version.
        it('tsgrid-ui.css banner contains the package version', () => {
            const banner = banners1['tsgrid-ui.css'] ?? ''
            expect(banner, `tsgrid-ui.css banner must reference version ${pkg.version}`).toContain(pkg.version)
        })
    }
)
