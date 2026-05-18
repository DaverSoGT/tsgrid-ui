/**
 * scripts/patch-deprecated.mjs — Post-build @deprecated patcher for dist/tsgrid-ui.d.ts
 *
 * D-4 Path B: tsup/rollup-dts strips JSDoc comments from re-export statements in the
 * rolled-up dist/tsgrid-ui.d.ts. This script runs after `pnpm build:js` and prepends
 * a `@deprecated` JSDoc block above each `export { ... }` line in the barrel .d.ts.
 *
 * Wired into scripts.build:js via `&& node scripts/patch-deprecated.mjs` suffix.
 *
 * v2.15.0 — barrel deprecation (R-BD-5, G-2 gate)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DTS_PATH = join(ROOT, 'dist', 'tsgrid-ui.d.ts')

const DEPRECATED_JSDOC = `/**
 * @deprecated Import from the per-widget subpath (e.g. \`tsgrid-ui/grid\`) instead.
 * The flat \`tsgrid-ui\` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */`

const src = readFileSync(DTS_PATH, 'utf8')

// Prepend @deprecated JSDoc before each `export { ... } from '...'` line.
// Preserve import lines and blank lines as-is.
const lines = src.split('\n')
const patched = lines
    .map((line, idx) => {
        const trimmed = line.trim()
        if (trimmed.startsWith('export {') && trimmed.includes(' from ')) {
            // Idempotent: skip injection if preceding lines already contain @deprecated
            const lookback = lines.slice(Math.max(0, idx - 6), idx)
            if (lookback.some(l => l.includes('@deprecated'))) {
                return line
            }
            return `${DEPRECATED_JSDOC}\n${line}`
        }
        return line
    })
    .join('\n')

writeFileSync(DTS_PATH, patched, 'utf8')
console.log(`[patch-deprecated] Patched ${DTS_PATH} with @deprecated JSDoc blocks.`)
