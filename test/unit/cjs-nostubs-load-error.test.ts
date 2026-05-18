// Pins the v2.13.0 CJS Known Limitation #3 (CHANGELOG L22) as observed
// behavior: `require('tsgrid-ui/<widget>')` in a bare Node process — no DOM
// stubs, no jsdom, no polyfills — MUST throw at module-load. This is the
// no-stubs counterpart to test/consumer-smoke-cjs.js (which proves the
// WITH-stubs path works); together they bracket the documented contract.
//
// Closes S-1 from verify report #1104. The CHANGELOG and README warn users
// about the DOM-globals requirement, but until this test landed, the failure
// mode was undocumented in CI — a regression where the bundles stopped
// referencing DOM at module-load (e.g. lazy DOM access) would silently flip
// the contract without anyone noticing.
//
// The test asserts the EXIT CODE and an error pattern, NOT a specific
// global name, because the first missing global is implementation-dependent
// (esbuild ordering, tree-shaking outcomes can shift it). What matters is
// the ReferenceError shape — that's the consumer-visible contract.
import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const distExists = existsSync(join(ROOT, 'dist'))

// The full list per CHANGELOG L22 — load failure WILL trip one of these
// before any other code runs. The set is small enough that an exhaustive
// regex catches the failure regardless of which global resolves first.
const EXPECTED_GLOBAL_NAMES = [
    'document', 'window', 'Node', 'Event',
    'MutationObserver', 'navigator', 'localStorage', 'self',
]

// One representative subpath is enough — the load-time DOM dependency is a
// property of the inlined deps, not the entry. `grid` is the largest and
// touches the most DOM globals, so it's the strongest probe.
const SUBPATH_FIXTURE = './dist/grid.js'

describe('cjs-nostubs-load-error — Known Limitation #3 pinned (S-1 / verify #1104)', () => {
    it.skipIf(!distExists)(
        'require(\'./dist/grid.js\') throws ReferenceError in bare Node (no DOM polyfills)',
        () => {
            // Spawn a child Node process with NO global stubs. The `-e` script
            // wraps the require in try/catch and prints the error name + message
            // to stderr, then exits non-zero. We avoid `require()` at the top
            // level so we control how the error surfaces.
            const result = spawnSync(
                process.execPath,
                [
                    '--no-warnings',
                    '-e',
                    `try { require('${SUBPATH_FIXTURE}'); process.exit(0) } ` +
                    `catch (e) { console.error(e.name + ': ' + e.message); process.exit(42) }`,
                ],
                { cwd: ROOT, encoding: 'utf8' }
            )

            // Exit code MUST be 42 (our catch-branch sentinel). 0 would mean
            // the require unexpectedly succeeded — the DOM contract regressed
            // and the cleanup may now ship a silently broken Known Limitation.
            expect(result.status, `bare-Node require(${SUBPATH_FIXTURE}) unexpectedly succeeded — DOM contract regressed`)
                .toBe(42)

            // The error MUST be a ReferenceError naming one of the documented
            // DOM globals. If the error name flips to TypeError or the missing
            // identifier drifts outside the documented set, the CHANGELOG needs
            // updating BEFORE this test is loosened.
            const stderr = result.stderr || ''
            expect(stderr, 'expected ReferenceError prefix in stderr').toMatch(/^ReferenceError:/m)
            const globalsPattern = new RegExp(`\\b(${EXPECTED_GLOBAL_NAMES.join('|')})\\b`)
            expect(stderr, `expected stderr to name one of the documented DOM globals (${EXPECTED_GLOBAL_NAMES.join(', ')})`)
                .toMatch(globalsPattern)
        }
    )
})
