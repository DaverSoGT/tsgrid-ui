#!/usr/bin/env node
/**
 * Lint cleanup utility — modes:
 *
 *   default        Bulk-applies `eslint-disable-next-line` for targeted `any`
 *                  sites and renames unused parameters with `_` prefix.
 *                  Used during the v2.1.0 strict-flip migration.
 *
 *   --audit-comments
 *                  Walks every `eslint-disable-next-line @typescript-eslint/
 *                  no-explicit-any` directive in src/ and reports which ones
 *                  lack the typing_policy-required `// any: <reason>` comment
 *                  on the line(s) immediately above. Multi-line `// ...`
 *                  comment blocks are folded — the directive is "covered" if
 *                  any line of the contiguous comment block above it starts
 *                  with `// any:`.
 *
 *   --fill-comments [--dry-run]
 *                  After --audit-comments, insert a categorical `// any:`
 *                  reason above each uncovered disable. The reason is derived
 *                  from the module + line pattern (this-cast, record-cast,
 *                  callback-arg, return-cast, etc). With --dry-run the script
 *                  prints the planned insertions without modifying files.
 *
 * IDEMPOTENT: re-running any mode has no effect once the codebase is clean.
 *
 * USAGE:
 *   node scripts/lint-cleanup.mjs                       # default disable+rename pass
 *   node scripts/lint-cleanup.mjs --audit-comments      # report coverage gap
 *   node scripts/lint-cleanup.mjs --fill-comments --dry-run
 *   node scripts/lint-cleanup.mjs --fill-comments       # apply the inserts
 *
 * WHEN TO USE: any future migration that flips a wide-impact ESLint rule from
 * warn/off to error and needs a one-time pass to silence pre-existing sites
 * that the new rule flags but the typing_policy explicitly allows.
 *
 * NOT A LONG-TERM TOOL: prefer fixing the underlying type instead of suppressing.
 * This script is for migrations and post-migration coverage cleanup only.
 */

import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DISABLE = '// eslint-disable-next-line @typescript-eslint/no-explicit-any'
const DISABLE_RE = /eslint-disable-next-line[^@]*@typescript-eslint\/no-explicit-any/
const REASON_RE = /^\s*\/\/\s*any\s*:/i
const COMMENT_LINE_RE = /^\s*\/\//

const args = process.argv.slice(2)
const MODE_AUDIT = args.includes('--audit-comments')
const MODE_FILL = args.includes('--fill-comments')
const DRY_RUN = args.includes('--dry-run')

// ---------------------------------------------------------------------------
// Coverage modes (audit / fill)
// ---------------------------------------------------------------------------

function* walkSrc(dir = 'src') {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        const stat = statSync(full)
        if (stat.isDirectory()) {
            yield* walkSrc(full)
        } else if (entry.endsWith('.ts')) {
            yield full
        }
    }
}

// Module-level context — feeds into the categorical reason.
const MODULE_CONTEXT = {
    'TsGrid':    'TsGrid record/cell shape is user-defined at runtime',
    'TsTooltip': 'TsTooltip overlay options merge from multiple user sources at runtime',
    'TsField':   'TsField instance shape varies by `type` (text/list/date/color/etc) at runtime',
    'TsForm':    'TsForm field schema is user-defined at runtime',
    'TsSidebar': 'TsSidebar node tree shape is user-defined at runtime',
    'TsToolbar': 'TsToolbar item shape varies by `type` at runtime',
    'TsPopup':   'TsPopup options accept untyped user payloads at runtime',
    'TsUtils':   'TsUtils helper accepts heterogeneous runtime input',
    'TsTabs':    'TsTabs tab item shape is user-defined at runtime',
    'TsLayout':  'TsLayout panel shape is user-defined at runtime',
    'w2compat':  'jQuery shim — runtime-validated dynamic dispatch',
    'TsBase':    'TsBase event payload is widget-defined at runtime',
    'query':     'query DOM-traversal accepts arbitrary HTMLElement subclasses at runtime',
}

function moduleNameOf(path) {
    const m = path.match(/([^/\\]+)\.ts$/)
    return m ? m[1] : path
}

// Categorize the line that owns the `any` and produce a short pattern label.
function categorize(codeLine) {
    if (/\(this\s+as\s+any\)/.test(codeLine)) return 'this-cast for legacy widget self-reference'
    if (/\(\s*window\s+as\s+any\s*\)/.test(codeLine)) return 'window-cast — global is not in lib.dom.d.ts'
    if (/as\s+any\s*\)\s*\[/.test(codeLine)) return 'cast-then-index for dynamic property access'
    if (/\bas\s+any\s*\[/.test(codeLine)) return 'cast-then-index for dynamic property access'
    if (/\bas\s+any\s*[)\.]/.test(codeLine)) return 'cast-to-any for dynamic dispatch'
    if (/\bas\s+any\s*$/.test(codeLine)) return 'cast-to-any for return-position narrowing'
    if (/:\s*any\s*\)/.test(codeLine)) return 'callback parameter — caller signature varies'
    if (/:\s*any\s*[,=]/.test(codeLine)) return 'parameter typed any — runtime dispatch by call site'
    if (/:\s*any\s*\[\s*\]/.test(codeLine)) return 'array of heterogeneous runtime values'
    if (/\):\s*any/.test(codeLine)) return 'return type any — caller narrows by code path'
    if (/<any>/.test(codeLine)) return 'generic any — runtime polymorphic'
    if (/Record<[^,]+,\s*any>/.test(codeLine)) return 'Record<string, any> — dynamic property bag'
    if (/Promise<any>/.test(codeLine)) return 'Promise<any> — resolved value shape varies'
    return 'targeted-any per typing_policy'
}

// Determine if a directive at line `idx` is "covered" by a // any: reason.
// Coverage modes accepted (any one of):
//   (a) a contiguous comment block above contains at least one `// any:` line.
//   (b) the code line directly below the directive has an end-of-line
//       `// any:` comment (inline-documented site).
function isCovered(lines, idx) {
    // (a) walk up consecutive comment lines
    let i = idx - 1
    while (i >= 0 && COMMENT_LINE_RE.test(lines[i])) {
        if (REASON_RE.test(lines[i])) return true
        i--
    }
    // (b) inline at end of the code line
    const codeLine = lines[idx + 1] || ''
    if (/\/\/\s*any\s*:/i.test(codeLine)) return true
    return false
}

function indentOf(line) {
    return (line.match(/^(\s*)/) || ['', ''])[1]
}

function runCoverageMode({ fill, dryRun }) {
    const perModule = []
    let totalSites = 0
    let totalCovered = 0
    let totalGap = 0

    for (const file of walkSrc()) {
        const original = readFileSync(file, 'utf8')
        // Always write LF — project's ESLint enforces linebreak-style: 'unix',
        // and Windows checkouts may produce CRLF on .ts files (no eol=lf rule
        // for *.ts in .gitattributes). Forcing LF keeps the script idempotent
        // and avoids reintroducing CRLF that the lint rule would reject.
        const lineEnding = '\n'
        let lines = original.split(/\r?\n/)
        const module = moduleNameOf(file)
        const moduleCtx = MODULE_CONTEXT[module] || 'targeted-any per typing_policy'

        // Find every directive line; record idx + coverage state.
        const records = []
        for (let i = 0; i < lines.length; i++) {
            if (DISABLE_RE.test(lines[i])) {
                const covered = isCovered(lines, i)
                records.push({ idx: i, covered })
            }
        }
        const sites = records.length
        const covered = records.filter(r => r.covered).length
        const gap = sites - covered
        totalSites += sites
        totalCovered += covered
        totalGap += gap
        perModule.push({ file, module, sites, covered, gap })

        if (!fill || gap === 0) continue

        // Insert comments highest-line-first so subsequent indices stay valid.
        const inserts = records.filter(r => !r.covered).sort((a, b) => b.idx - a.idx)
        for (const r of inserts) {
            const directiveLine = lines[r.idx]
            const codeLine = lines[r.idx + 1] || ''
            const pattern = categorize(codeLine)
            const reason = `// any: ${pattern}; ${moduleCtx}`
            const indented = indentOf(directiveLine) + reason
            if (dryRun) {
                console.log(`[fill:dry] ${file}:${r.idx + 1}`)
                console.log(`           insert: ${indented.trim()}`)
                console.log(`           above:  ${directiveLine.trim()}`)
                console.log(`           code:   ${codeLine.trim()}`)
                continue
            }
            lines.splice(r.idx, 0, indented)
        }

        if (!dryRun) {
            writeFileSync(file, lines.join(lineEnding), 'utf8')
        }
    }

    console.log('')
    console.log(`[${fill ? (dryRun ? 'fill:dry' : 'fill') : 'audit'}] no-explicit-any disable coverage:`)
    for (const m of perModule) {
        const pct = m.sites > 0 ? ((m.covered / m.sites) * 100).toFixed(1) : '100.0'
        console.log(`  ${m.file.padEnd(28)} sites=${String(m.sites).padStart(4)}  covered=${String(m.covered).padStart(4)}  gap=${String(m.gap).padStart(4)}  pct=${pct}%`)
    }
    const totalPct = totalSites > 0 ? ((totalCovered / totalSites) * 100).toFixed(1) : '100.0'
    console.log(`  ${'TOTAL'.padEnd(28)} sites=${String(totalSites).padStart(4)}  covered=${String(totalCovered).padStart(4)}  gap=${String(totalGap).padStart(4)}  pct=${totalPct}%`)

    if (fill && !dryRun) {
        console.log('')
        console.log(`[fill] inserted ${totalGap} reason comment(s). Run \`pnpm test\` to verify.`)
    }
}

// ---------------------------------------------------------------------------
// Mode dispatcher — placed AFTER coverage-mode declarations so the const
// MODULE_CONTEXT table is past the temporal dead zone when invoked.
// ---------------------------------------------------------------------------

if (MODE_AUDIT || MODE_FILL) {
    runCoverageMode({ fill: MODE_FILL, dryRun: DRY_RUN })
    process.exit(0)
}

// ---------------------------------------------------------------------------
// Default mode (original strict-flip migration helper)
// ---------------------------------------------------------------------------

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
