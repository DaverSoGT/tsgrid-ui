import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Referential-integrity guard for dist/chunks/ (R-DOS-4, R-DOS-5, R-DOS-6).
//
// Strategy: parse static import statements in dist/*.es6.js entries using a
// regex that covers both named-import and bare side-effect import forms
// (confirmed against real tsup ESM output — see dist/popup.es6.js lines 1-15).
// Asserts set-equality in both directions:
//   forward  — every file on dist/chunks/ is referenced by ≥1 entry
//   backward — every referenced path has a corresponding file on disk
// No build is triggered; this test reads committed dist/ only (< 1 s, CI-safe).

const ROOT = join(__dirname, '../..')
const DIST = join(ROOT, 'dist')
const CHUNKS = join(DIST, 'chunks')

// esbuild produces UPPERCASE alphanumeric hashes (e.g. chunk-EQK6JAHT.js)
const CHUNK_NAME_RE = /^chunk-[A-Z0-9]{8}\.js$/

// Matches both:
//   import { X } from "./chunks/chunk-XXXXXXXX.js"
//   import "./chunks/chunk-XXXXXXXX.js"
const CHUNK_IMPORT_RE = /import\s*(?:\{[^}]*\}\s*from\s*)?["']\.\/chunks\/(chunk-[A-Z0-9]{8}\.js)["']/g

const distExists = existsSync(DIST) && existsSync(CHUNKS)

describe('chunks-orphan-free (R-DOS-4/5/6)', () => {
    it.skipIf(!distExists)(
        'every dist/chunks/*.js is referenced by ≥1 dist/*.es6.js entry (forward check)',
        () => {
            const referenced = new Set<string>()
            const es6Files = readdirSync(DIST).filter(n => n.endsWith('.es6.js'))
            for (const f of es6Files) {
                const src = readFileSync(join(DIST, f), 'utf8')
                for (const m of src.matchAll(CHUNK_IMPORT_RE)) referenced.add(m[1])
            }
            const onDisk = new Set(readdirSync(CHUNKS).filter(n => CHUNK_NAME_RE.test(n)))

            expect(referenced.size, 'expected at least one chunk reference in dist/*.es6.js').toBeGreaterThan(0)

            // Forward: every file on disk must be referenced
            const unreferenced = [...onDisk].filter(f => !referenced.has(f))
            expect(unreferenced, `orphan chunks on disk (not referenced by any entry): ${unreferenced.join(', ')}`).toEqual([])

            // Backward: every referenced file must exist on disk
            const missing = [...referenced].filter(f => !onDisk.has(f))
            expect(missing, `referenced chunks missing from dist/chunks/: ${missing.join(', ')}`).toEqual([])
        }
    )

    it.skipIf(!distExists)(
        'every dist/chunks/*.js has a sibling .js.map sourcemap',
        () => {
            const jsFiles = readdirSync(CHUNKS).filter(n => CHUNK_NAME_RE.test(n))
            for (const f of jsFiles) {
                expect(
                    existsSync(join(CHUNKS, f + '.map')),
                    `missing sourcemap for ${f}`
                ).toBe(true)
            }
        }
    )
})
