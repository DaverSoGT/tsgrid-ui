/**
 * Anti-regression test for scripts/wrap-legacy.mjs — wrap-legacy-determinism SDD.
 *
 * INV-WLD-3: scripts/wrap-legacy.mjs MUST NOT contain any of:
 *   - new Date(
 *   - Date.now(
 *   - Math.random(
 *
 * Strict TDD: committed BEFORE the buildHeader() fix.
 * RED on master @ 088c024c (line 65 has `new Date(`).
 * GREEN after T2 fix lands.
 *
 * Negative control (SC-WLD-5): findBannedTokens is run against an in-test
 * synthetic string to prove it is not vacuously passing.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT   = path.resolve(__dirname, '..', '..')
const WRAP_LEGACY = path.resolve(REPO_ROOT, 'scripts', 'wrap-legacy.mjs')

// Banned tokens per INV-WLD-3 / REQ-WLD-2. Regex literals anchor on the
// trailing `(` so identifiers in comments without an invocation (e.g. the
// JSDoc string "Date" alone) are not flagged. Case-sensitive.
const BANNED_TOKENS: ReadonlyArray<{ name: string, re: RegExp }> = [
    { name: 'new Date(',    re: /new\s+Date\(/ },
    { name: 'Date.now(',    re: /Date\.now\(/ },
    { name: 'Math.random(', re: /Math\.random\(/ },
]

function findBannedTokens(source: string): string[] {
    return BANNED_TOKENS.filter(({ re }) => re.test(source)).map(b => b.name)
}

describe('scripts/wrap-legacy.mjs determinism (INV-WLD-3)', () => {
    it('does not contain any banned non-deterministic tokens', async () => {
        const source = await readFile(WRAP_LEGACY, 'utf8')
        const hits   = findBannedTokens(source)
        expect(hits).toEqual([])
    })

    // Negative control (SC-WLD-5) — proves the check actually detects hits.
    it('findBannedTokens flags a synthetic source containing new Date(', () => {
        const synthetic = `
            function buildHeader() {
                const ts = new Date().toLocaleString('en-us')
                return ts
            }
        `
        const hits = findBannedTokens(synthetic)
        expect(hits).toContain('new Date(')
    })
})
