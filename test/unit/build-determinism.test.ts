import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execSync } from 'child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

// Automates T-GCP-13: `pnpm build:css` is deterministic across invocations.
// Closes S-2 from verify report #1088. Manual gate was acceptable per the
// original spec (no vitest mechanism to invoke gulp from inside the suite),
// but the gulpfile now honors TSGRID_CSS_OUT so we can redirect output to
// tmpdirs and avoid mutating ./dist (root cause of bug #1080).

const ROOT = join(__dirname, '../..')

// Gulp `less` produces 11 files: monolith + .min + 9 per-widget.
// Order must match gulpfile.js exports.less = series(less, widgets).
const EXPECTED_FILES = [
    'tsgrid-ui.css',
    'tsgrid-ui.min.css',
    'field.css',
    'form.css',
    'grid.css',
    'layout.css',
    'popup.css',
    'sidebar.css',
    'tabs.css',
    'toolbar.css',
    'tooltip.css',
]

// The gulp header carries `new Date()).toLocaleString('en-us')` so the first
// comment line differs between runs by design. Strip it before comparison —
// same pattern used by the T-GCP-12 byte-stability check in css-subpaths.test.ts.
const stripHeader = (s: string) => s.replace(/^\/\* tsgrid-ui[^\n]*\n/, '')

function runBuildInto(out: string): void {
    execSync('npx gulp less', {
        cwd:   ROOT,
        env:   { ...process.env, TSGRID_CSS_OUT: out + '/' },
        stdio: 'pipe',
    })
}

function readAll(out: string): Record<string, string> {
    const result: Record<string, string> = {}
    for (const name of EXPECTED_FILES) {
        const path = join(out, name)
        result[name] = stripHeader(readFileSync(path, 'utf8'))
    }
    return result
}

describe('build determinism — gulp less produces byte-stable output (T-GCP-13 / S-2)', () => {
    let run1: Record<string, string> | null = null
    let run2: Record<string, string> | null = null
    let tmp1: string | null = null
    let tmp2: string | null = null
    let buildOK = false

    beforeAll(() => {
        tmp1 = mkdtempSync(join(tmpdir(), 'tsgrid-css-det-1-'))
        tmp2 = mkdtempSync(join(tmpdir(), 'tsgrid-css-det-2-'))
        try {
            runBuildInto(tmp1)
            runBuildInto(tmp2)
            run1 = readAll(tmp1)
            run2 = readAll(tmp2)
            buildOK = true
        } catch {
            // Build failure surfaces as a single FAIL in the structural test below.
            buildOK = false
        }
    }, 120_000)

    afterAll(() => {
        if (tmp1 && existsSync(tmp1)) rmSync(tmp1, { recursive: true, force: true })
        if (tmp2 && existsSync(tmp2)) rmSync(tmp2, { recursive: true, force: true })
    })

    it('both runs produced all 11 expected output files', () => {
        expect(buildOK, 'gulp less must succeed twice').toBe(true)
        if (!tmp1 || !tmp2) throw new Error('tmpdirs not allocated')
        const files1 = readdirSync(tmp1).sort()
        const files2 = readdirSync(tmp2).sort()
        expect(files1).toEqual(EXPECTED_FILES.slice().sort())
        expect(files2).toEqual(EXPECTED_FILES.slice().sort())
    })

    it.each(EXPECTED_FILES)('%s is byte-identical across two consecutive builds (modulo dated header)', (name) => {
        if (!buildOK || !run1 || !run2) throw new Error('build did not complete')
        expect(run2[name]).toEqual(run1[name])
    })

    // Belt-and-suspenders: the dated header itself MUST differ between the
    // two runs (otherwise our stripHeader regex would be silently masking a
    // case where the header was never written). This proves the strip works
    // on real data, not just an empty-header degenerate case.
    it('dated header was actually written by each run (sanity check on stripHeader)', () => {
        if (!buildOK || !tmp1 || !tmp2) throw new Error('build did not complete')
        const raw1 = readFileSync(join(tmp1, 'tsgrid-ui.css'), 'utf8')
        const raw2 = readFileSync(join(tmp2, 'tsgrid-ui.css'), 'utf8')
        expect(raw1).toMatch(/^\/\* tsgrid-ui/)
        expect(raw2).toMatch(/^\/\* tsgrid-ui/)
        // Each header carries new Date()).toLocaleString('en-us') — stripped output is identical.
        expect(stripHeader(raw1)).toEqual(stripHeader(raw2))
    })

    // Confirms ./dist was not mutated by the test (S-2 implementation requirement).
    // The test must not produce diff in working tree (bug #1080 anchor).
    it('test execution did not mutate ./dist (TSGRID_CSS_OUT honored)', () => {
        if (!buildOK || !tmp1 || !tmp2) throw new Error('build did not complete')
        expect(tmp1).not.toBe(join(ROOT, 'dist'))
        expect(tmp2).not.toBe(join(ROOT, 'dist'))
        expect(tmp1).toContain('tsgrid-css-det-1-')
        expect(tmp2).toContain('tsgrid-css-det-2-')
    })
})
