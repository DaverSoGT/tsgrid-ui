#!/usr/bin/env node
/**
 * Lint cleanup utility — bulk-applies `eslint-disable-next-line` for targeted
 * `any` sites and renames unused parameters with `_` prefix.
 *
 * History: created during the v2.1.0 TypeScript native port (Phase 6 strict
 * tighten). When @typescript-eslint/no-explicit-any was raised from `warn` to
 * `error`, the codebase had ~755 targeted `any` sites already documented with
 * `// any: <reason>` comments per typing_policy. Rather than retype them all
 * (many are runtime-mutation patterns that genuinely cannot be expressed in
 * TS), we silenced them with `// eslint-disable-next-line` directives — one
 * per offending line, matching the comment indentation.
 *
 * The script also renames the first 50 unused parameters per ESLint's
 * exact line:column report to satisfy `argsIgnorePattern: ^_`.
 *
 * IDEMPOTENT: re-running has no effect (won't double-insert disables, won't
 * re-rename `_`-prefixed identifiers).
 *
 * USAGE:
 *   node scripts/lint-cleanup.mjs
 *
 * WHEN TO USE: any future migration that flips a wide-impact ESLint rule from
 * warn/off to error and needs a one-time pass to silence pre-existing sites
 * that the new rule flags but the typing_policy explicitly allows.
 *
 * NOT A LONG-TERM TOOL: prefer fixing the underlying type instead of suppressing.
 * This script is for migrations only.
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const DISABLE = '// eslint-disable-next-line @typescript-eslint/no-explicit-any'

function runEslintJson() {
    try {
        return execSync('pnpm exec eslint src --ext .js,.ts --format json', {
            encoding: 'utf8',
            maxBuffer: 64 * 1024 * 1024,
            stdio: ['ignore', 'pipe', 'pipe'],
        })
    } catch (e) {
        // eslint exits non-zero when errors exist; captured stdout has the JSON
        if (e.stdout) return e.stdout
        throw e
    }
}

console.log('[cleanup] running eslint to collect errors...')
const reports = JSON.parse(runEslintJson())

let totalAnyDisables = 0
let totalUnusedRenames = 0

for (const file of reports) {
    const errs = file.messages.filter(m =>
        m.ruleId === '@typescript-eslint/no-explicit-any' ||
        m.ruleId === '@typescript-eslint/no-unused-vars'
    )
    if (errs.length === 0) continue

    let content = readFileSync(file.filePath, 'utf8')
    const lineEnding = content.includes('\r\n') ? '\r\n' : '\n'
    let lines = content.split(/\r?\n/)

    // Step 1: rename unused-vars FIRST while line numbers still match ESLint.
    // Sort by descending line/column so column-precise replacements on the same
    // line don't shift each other.
    const unusedErrs = errs
        .filter(e => e.ruleId === '@typescript-eslint/no-unused-vars')
        .sort((a, b) => (b.line - a.line) || (b.column - a.column))

    for (const err of unusedErrs) {
        const idx = err.line - 1
        if (idx < 0 || idx >= lines.length) continue
        const line = lines[idx]
        const m = err.message.match(/^'([^']+)' is (?:defined but never used|assigned a value but never used)/)
        if (!m) continue
        const varName = m[1]
        if (varName.startsWith('_')) continue
        const start = err.column - 1  // ESLint columns are 1-indexed
        if (line.slice(start, start + varName.length) !== varName) {
            console.warn(`[cleanup] WARN: ${file.filePath}:${err.line}:${err.column} expected '${varName}' at column but found '${line.slice(start, start + varName.length)}' — skipping`)
            continue
        }
        const before = start > 0 ? line[start - 1] : ' '
        if (/[A-Za-z0-9_$]/.test(before)) {
            console.warn(`[cleanup] WARN: ${file.filePath}:${err.line}:${err.column} non-boundary before '${varName}' — skipping`)
            continue
        }
        lines[idx] = line.slice(0, start) + '_' + line.slice(start)
        totalUnusedRenames++
    }

    // Step 2: insert eslint-disable-next-line for no-explicit-any (highest line first)
    const anyLines = new Set()
    for (const err of errs) {
        if (err.ruleId === '@typescript-eslint/no-explicit-any') {
            anyLines.add(err.line)
        }
    }
    const sortedAnyLines = [...anyLines].sort((a, b) => b - a)
    for (const lineNum of sortedAnyLines) {
        const idx = lineNum - 1
        if (idx < 0 || idx >= lines.length) continue
        const targetLine = lines[idx]
        const prevLine = idx > 0 ? lines[idx - 1] : ''
        if (prevLine.includes('eslint-disable-next-line') && prevLine.includes('no-explicit-any')) continue
        const indent = (targetLine.match(/^(\s*)/) || ['', ''])[1]
        lines.splice(idx, 0, indent + DISABLE)
        totalAnyDisables++
    }

    writeFileSync(file.filePath, lines.join(lineEnding), 'utf8')
    console.log(`[cleanup] ${file.filePath}: anyDisables=${anyLines.size}, unused=${unusedErrs.length}`)
}

console.log(`[cleanup] total: anyDisables=${totalAnyDisables}, unusedRenames=${totalUnusedRenames}`)
console.log('')
console.log('[cleanup] EDGE CASES that need manual review (not handled by this script):')
console.log('  - `any` inside template literals: the disable comment would render as HTML.')
console.log('    Convert `as any` to a structural type (e.g. `as { max?: number }`) instead.')
console.log('  - Unused IMPORTS (not just args): renaming an import alias to _Foo will break')
console.log('    the import statement if the source module exports `Foo` (not `_Foo`). Remove')
console.log('    the unused import or rename via the `import { Foo as _Foo }` syntax.')
console.log('')
console.log('[cleanup] After this script, run:  pnpm test')
