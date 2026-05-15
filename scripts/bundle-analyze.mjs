/**
 * bundle-analyze.mjs — advisory per-module bundle summary
 *
 * Invocation: chained AFTER `tsup --config tsup.config.analyze.ts` by the
 * `bundle:analyze` npm script. Do NOT invoke directly without the prior tsup build.
 *
 * Inputs:
 *   dist/tsgrid-ui.es6.meta.json  — esbuild metafile (emitted by tsup metafile: true)
 *   package.json                  — reads tsgrid-ui version
 *
 * Outputs:
 *   reports/bundle/latest.md      — Markdown table, top-30 modules by bytesInOutput DESC
 *   stdout                        — short summary line
 *
 * Exit codes:
 *   0  success
 *   1  metafile missing, malformed JSON, or outputBundle not found in metafile
 *   2  wrong cwd (package.json.name !== "tsgrid-ui")
 */

import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const CWD         = process.cwd()
// tsup 8.5.1 writes metafile as dist/metafile-esm.json (not dist/<entry>.meta.json)
const META_PATH   = join(CWD, 'dist', 'metafile-esm.json')
const PKG_PATH    = join(CWD, 'package.json')
const OUTPUT_DIR  = join(CWD, 'reports', 'bundle')
const OUTPUT_PATH = join(OUTPUT_DIR, 'latest.md')

// --- Gate: correct working directory ---
let pkg
try {
    pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'))
} catch {
    process.stderr.write('ERROR: Cannot read package.json. Run from the tsgrid-ui repo root.\n')
    process.exit(2)
}
if (pkg.name !== 'tsgrid-ui') {
    process.stderr.write(`ERROR: package.json.name is "${pkg.name}", expected "tsgrid-ui". Run from the repo root.\n`)
    process.exit(2)
}

// --- Load metafile ---
let meta
try {
    const raw = readFileSync(META_PATH, 'utf8')
    meta = JSON.parse(raw)
} catch (err) {
    if (err.code === 'ENOENT') {
        process.stderr.write('ERROR: dist/metafile-esm.json not found. Did you run `tsup --config tsup.config.analyze.ts` first?\n')
    } else {
        process.stderr.write(`ERROR: Failed to parse metafile: ${err.message}\n`)
    }
    process.exit(1)
}

// --- Find the ESM output bundle ---
const outputKey = Object.keys(meta.outputs || {}).find(k => k.endsWith('tsgrid-ui.es6.js') && !k.endsWith('.map'))
if (!outputKey) {
    process.stderr.write('ERROR: Could not find tsgrid-ui.es6.js entry in metafile outputs. Metafile may be malformed.\n')
    process.exit(1)
}
const outputBundle = meta.outputs[outputKey]
// Use actual on-disk file size (tsup may add banners not counted in esbuild metafile bytes)
let totalBytes
try {
    totalBytes = statSync(join(CWD, outputKey)).size
} catch {
    totalBytes = outputBundle.bytes ?? 0
}

// --- Build per-module table from inputs map ---
const inputsMap = outputBundle.inputs || {}
const modules = Object.entries(inputsMap).map(([path, info]) => ({
    path:          path.replace(/\\/g, '/'),
    bytesInOutput: info.bytesInOutput ?? 0,
    bytes:         (meta.inputs?.[path]?.bytes) ?? 0,
}))

// Sort by bytesInOutput DESC
modules.sort((a, b) => b.bytesInOutput - a.bytesInOutput)

const top30      = modules.slice(0, 30)
const version    = pkg.version ?? 'unknown'

// --- Write reports/bundle/latest.md ---
mkdirSync(OUTPUT_DIR, { recursive: true })

const pct = (n) => totalBytes > 0 ? ((n / totalBytes) * 100).toFixed(2) + '%' : '0.00%'
const rows = top30.map(m => `| \`${m.path}\` | ${m.bytes.toLocaleString()} | ${m.bytesInOutput.toLocaleString()} | ${pct(m.bytesInOutput)} |`)

const md = [
    `# Bundle analysis — tsgrid-ui v${version} (ESM non-min)`,
    '',
    `> Generated: ${new Date().toISOString()}`,
    `> Output bundle: \`dist/tsgrid-ui.es6.js\` — **${totalBytes.toLocaleString()} bytes** total`,
    '',
    '## Top 30 modules by bytes in output',
    '',
    '| Module | bytes (source) | bytesInOutput | % of output |',
    '|--------|---------------|---------------|-------------|',
    ...rows,
    '',
    `_${modules.length} total modules contributing to output._`,
    '',
    '> **Advisory output** — regenerated on every `pnpm bundle:analyze` run; gitignored.',
    '> For a committed snapshot, run `pnpm bundle:snapshot -- --version=vX.Y.Z`.',
    '',
].join('\n')

writeFileSync(OUTPUT_PATH, md, 'utf8')

// --- stdout summary ---
const top3 = top30.slice(0, 3).map(m => {
    const short = m.path.split('/').pop()
    return `${short} (${m.bytesInOutput.toLocaleString()})`
})
process.stdout.write(
    `[bundle-analyze] Total output: ${totalBytes.toLocaleString()} bytes across ${modules.length} modules. ` +
    `Top-3: ${top3.join(', ')}. Wrote ${OUTPUT_PATH}.\n`
)
