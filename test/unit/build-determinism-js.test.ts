import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// JS build determinism guard (R-DOS-7, F-DOS-5).
//
// Runs pnpm build:js twice and asserts:
//   1. Chunk filename sets are identical across both runs.
//   2. Per-file SHA-256 hashes are identical across both runs (content stability).
//   3. Every dist/chunks/*.js has a sibling .js.map (byproduct sanity).
//
// Hashes .js files ONLY — sourcemaps embed absolute paths that vary by checkout
// location and would produce false positives for non-determinism.
//
// Uses readWithRetry (pattern from css-subpaths.test.ts commit d2feb53a) to
// guard against Windows AV/indexer FS flush races when reading files just
// written by tsup.
//
// Opt-out: set SKIP_BUILD_TESTS=1 to skip this suite in environments where
// running two consecutive pnpm build:js invocations is impractical.

const ROOT = join(__dirname, '../..')
const CHUNKS = join(ROOT, 'dist', 'chunks')
const CHUNK_NAME_RE = /^chunk-[A-Z0-9]{8}\.js$/

// readWithRetry — guards against the Windows tsup/esbuild FS race where
// readFileSync returns empty content for a file that exists on disk but
// whose write has not yet been flushed by the OS. Retries up to `attempts`
// times with incremental back-off (delayMs * attempt-index ms).
// Pattern anchor: test/unit/css-subpaths.test.ts:15-29, commit d2feb53a.
async function readWithRetry(filePath: string, attempts = 5, delayMs = 50): Promise<Buffer> {
    let lastErr: unknown
    for (let i = 0; i < attempts; i++) {
        try {
            const content = readFileSync(filePath)
            if (content.length > 0) return content
            lastErr = new Error(`readWithRetry: got empty content on attempt ${i + 1}: ${filePath}`)
        } catch (err) {
            lastErr = err
        }
        await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
    throw lastErr ?? new Error(`readWithRetry exhausted after ${attempts} attempts: ${filePath}`)
}

// readdirWithRetry — guards against transient empty-listing races on Windows.
// Treats an empty directory (immediately after tsup clears it) as transient.
async function readdirWithRetry(dir: string, minCount = 1, attempts = 5, delayMs = 50): Promise<string[]> {
    let lastResult: string[] = []
    for (let i = 0; i < attempts; i++) {
        if (!existsSync(dir)) {
            await new Promise(r => setTimeout(r, delayMs * (i + 1)))
            continue
        }
        lastResult = readdirSync(dir)
        if (lastResult.length >= minCount) return lastResult
        await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
    return lastResult
}

interface ChunkSnapshot {
    filenames: string[]
    hashes: Record<string, string>
}

async function snapshotChunks(): Promise<ChunkSnapshot> {
    const files = (await readdirWithRetry(CHUNKS, 1)).filter(n => CHUNK_NAME_RE.test(n)).sort()
    const hashes: Record<string, string> = {}
    for (const f of files) {
        const buf = await readWithRetry(join(CHUNKS, f))
        hashes[f] = createHash('sha256').update(buf).digest('hex')
    }
    return { filenames: files, hashes }
}

function runBuildJs(): void {
    execSync('pnpm build:js', {
        cwd: ROOT,
        stdio: 'pipe',
        env: { ...process.env },
    })
}

describe.skipIf(process.env.SKIP_BUILD_TESTS === '1')(
    'build-determinism-js — pnpm build:js produces byte-stable chunk output across two consecutive runs (R-DOS-7)',
    () => {
        let snap1: ChunkSnapshot | null = null
        let snap2: ChunkSnapshot | null = null
        let buildOK = false

        beforeAll(async () => {
            try {
                runBuildJs()
                snap1 = await snapshotChunks()
                runBuildJs()
                snap2 = await snapshotChunks()
                buildOK = true
            } catch {
                buildOK = false
            }
        }, 90_000)

        it('both pnpm build:js runs succeeded', () => {
            expect(buildOK, 'pnpm build:js must succeed twice').toBe(true)
        })

        it('chunk filenames are identical across two consecutive builds', () => {
            if (!buildOK || !snap1 || !snap2) throw new Error('build did not complete')
            expect(snap2.filenames, 'chunk filename set differs between runs').toEqual(snap1.filenames)
        })

        it.each(
            snap1 && snap1.filenames.length > 0 ? snap1.filenames : ['(no chunks)']
        )('%s SHA-256 is identical across two consecutive pnpm build:js runs', async (name) => {
            if (name === '(no chunks)') return
            if (!buildOK || !snap1 || !snap2) throw new Error('build did not complete')
            expect(
                snap2.hashes[name],
                `${name} hash changed between consecutive builds — non-deterministic esbuild output`
            ).toBe(snap1.hashes[name])
        })

        it('every dist/chunks/*.js has a sibling .js.map sourcemap (byproduct sanity)', async () => {
            if (!buildOK) throw new Error('build did not complete')
            const allFiles = await readdirWithRetry(CHUNKS, 1)
            const jsFiles = allFiles.filter(n => CHUNK_NAME_RE.test(n))
            expect(jsFiles.length, 'expected at least one chunk after build').toBeGreaterThan(0)
            for (const f of jsFiles) {
                expect(
                    existsSync(join(CHUNKS, f + '.map')),
                    `missing sourcemap for ${f}`
                ).toBe(true)
            }
        })
    }
)
