// RED test: dist/chunks/ must exist with ≥1 matching file (R-CSSE-2, AC1, AC9)
// Amendment 1: regex uses uppercase hex [A-F0-9]{8} (esbuild produces UPPERCASE hex).
// This file is intentionally RED until T-CSSE-5 (GREEN: enable splitting:true in tsup configs).
import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const CHUNKS_DIR = join(ROOT, 'dist', 'chunks')

// Amendment 1 correction: esbuild produces UPPERCASE hex hashes (e.g., chunk-BIB3X2TW.js).
// Do NOT use [a-f0-9]{8} (lowercase) — that was the design's initial assumption, disproved by SPIKE 1.
const CHUNK_FILENAME_RE = /^chunk-[A-F0-9]{8}\.js$/i

describe('build-output chunks directory (R-CSSE-2, AC1, AC9)', () => {
    it('dist/chunks/ directory exists after pnpm build:js', () => {
        expect(existsSync(CHUNKS_DIR)).toBe(true)
    })

    it('dist/chunks/ contains at least one file matching chunk-[A-F0-9]{8}.js', () => {
        expect(existsSync(CHUNKS_DIR)).toBe(true)
        const files = readdirSync(CHUNKS_DIR)
        const matchingFiles = files.filter(f => CHUNK_FILENAME_RE.test(f))
        expect(matchingFiles.length).toBeGreaterThanOrEqual(1)
    })

    it('all files in dist/chunks/ match the expected chunk filename pattern', () => {
        if (!existsSync(CHUNKS_DIR)) return
        const files = readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.js'))
        for (const file of files) {
            expect(file, `unexpected chunk filename: ${file}`).toMatch(CHUNK_FILENAME_RE)
        }
    })
})
