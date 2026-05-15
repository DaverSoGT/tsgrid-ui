/**
 * bundle-snapshot.mjs — committed versioned bundle baseline generator
 *
 * Invocation: chained AFTER `tsup --config tsup.config.analyze.ts` by the
 * `bundle:snapshot` npm script. Do NOT invoke directly without the prior tsup build.
 *
 * Usage:
 *   node scripts/bundle-snapshot.mjs --version=v2.7.1
 *   node scripts/bundle-snapshot.mjs --version=v2.7.1 --out=reports/bundle/v2.7.1-baseline.json
 *
 * CLI flags:
 *   --version=<vX.Y.Z>   (REQUIRED) — release version string
 *   --out=<path>          (OPTIONAL) — override output path; default: reports/bundle/<version>-baseline.json
 *
 * Inputs:
 *   dist/tsgrid-ui.es6.meta.json  — esbuild metafile (emitted by tsup metafile: true)
 *   package.json                  — reads tsgrid-ui version + tsup version
 *
 * Outputs:
 *   reports/bundle/<version>-baseline.json  — committed JSON snapshot
 *   stdout                                  — confirmation line
 *
 * Exit codes:
 *   0  success
 *   1  metafile missing, malformed, or output bundle not found
 *   2  --version flag missing or invalid format
 *   3  path-normalization assertion fails (absolute path or Windows drive letter detected)
 *   4  wrong cwd (package.json.name !== "tsgrid-ui")
 */

import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { resolve, join, relative, isAbsolute } from 'node:path'

// --- Schema v2 helpers (β gate: pkg.version >= 2.8.0 triggers schema v2) ---

function parseSemver(v) {
    const [base] = v.split('-')
    const [maj, min, pat] = base.split('.').map(n => parseInt(n, 10))
    return { maj, min, pat }
}

function semverGte(a, b) {
    if (a.maj !== b.maj) return a.maj > b.maj
    if (a.min !== b.min) return a.min > b.min
    return a.pat >= b.pat
}

// Amendment #983: 11 subpaths (./grid deferred to Phase 3 with splitting:true)
const SUBPATH_INVENTORY = [
    { name: 'locale',  sourceFile: 'src/tslocale.ts',  forecastBytes: 3763,   forecastPct: 0.4  },
    { name: 'base',    sourceFile: 'src/tsbase.ts',    forecastBytes: 39260,  forecastPct: 4.2  },
    { name: 'utils',   sourceFile: 'src/tsutils.ts',   forecastBytes: 127798, forecastPct: 13.5 },
    { name: 'popup',   sourceFile: 'src/tspopup.ts',   forecastBytes: 159764, forecastPct: 16.9 },
    { name: 'tooltip', sourceFile: 'src/tstooltip.ts', forecastBytes: 244730, forecastPct: 25.9 },
    { name: 'tabs',    sourceFile: 'src/tstabs.ts',    forecastBytes: 268677, forecastPct: 28.4 },
    { name: 'toolbar', sourceFile: 'src/tstoolbar.ts', forecastBytes: 288775, forecastPct: 30.5 },
    { name: 'sidebar', sourceFile: 'src/tssidebar.ts', forecastBytes: 306622, forecastPct: 32.4 },
    { name: 'field',   sourceFile: 'src/tsfield.ts',   forecastBytes: 313303, forecastPct: 33.1 },
    { name: 'layout',  sourceFile: 'src/tslayout.ts',  forecastBytes: 354536, forecastPct: 37.5 },
    { name: 'form',    sourceFile: 'src/tsform.ts',    forecastBytes: 468649, forecastPct: 49.6 },
]

function buildSubpathsBlock(cwd) {
    const subpaths = {}
    for (const sp of SUBPATH_INVENTORY) {
        const outputFile = `dist/${sp.name}.es6.js`
        const abs = join(cwd, outputFile)
        let totalBytes
        try { totalBytes = statSync(abs).size }
        catch {
            process.stderr.write(`ERROR: subpath bundle missing: ${outputFile}. Run pnpm build:js first.\n`)
            process.exit(1)
        }
        subpaths[sp.name] = {
            totalBytes,
            sourceFile: sp.sourceFile,
            outputFile,
            forecastBytes: sp.forecastBytes,
            forecastPct:   sp.forecastPct,
        }
    }
    return subpaths
}

const CWD       = process.cwd()
// tsup 8.5.1 writes metafile as dist/metafile-esm.json (not dist/<entry>.meta.json)
const META_PATH = join(CWD, 'dist', 'metafile-esm.json')
const PKG_PATH  = join(CWD, 'package.json')

// --- Parse CLI args ---
const args = Object.fromEntries(
    process.argv.slice(2)
        .filter(a => a.startsWith('--'))
        .map(a => {
            const eq = a.indexOf('=')
            return eq >= 0 ? [a.slice(2, eq), a.slice(eq + 1)] : [a.slice(2), true]
        })
)

// --- Gate: --version required and valid format ---
const VERSION_RE = /^v\d+\.\d+\.\d+(-[\w.]+)?$/
const versionRaw = args['version']
if (!versionRaw || typeof versionRaw !== 'string' || !VERSION_RE.test(versionRaw)) {
    process.stderr.write(
        `ERROR: --version flag is required and must match vX.Y.Z (got: ${JSON.stringify(versionRaw)}).\n` +
        'Example: node scripts/bundle-snapshot.mjs --version=v2.7.1\n'
    )
    process.exit(2)
}
const version = versionRaw // e.g. "v2.7.1"
const versionNumeric = version.slice(1) // e.g. "2.7.1"

// --- Resolve output path ---
const outRelDefault = join('reports', 'bundle', `${version}-baseline.json`)
const outRel  = args['out'] ?? outRelDefault
const outPath = resolve(CWD, String(outRel))

// --- Gate: correct working directory ---
let pkg
try {
    pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'))
} catch {
    process.stderr.write('ERROR: Cannot read package.json. Run from the tsgrid-ui repo root.\n')
    process.exit(4)
}
if (pkg.name !== 'tsgrid-ui') {
    process.stderr.write(`ERROR: package.json.name is "${pkg.name}", expected "tsgrid-ui". Run from the repo root.\n`)
    process.exit(4)
}

// Warn (but do not abort) if package.json version doesn't match --version flag
if (pkg.version && pkg.version !== versionNumeric) {
    process.stderr.write(`WARN: package.json version is "${pkg.version}" but --version flag is "${version}". Proceeding anyway.\n`)
}

// Read tsup version from devDependencies
const tsupVersion = (pkg.devDependencies?.tsup ?? '').replace(/[\^~]/, '')

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
const outputFilePath = join(CWD, outputKey)
let totalBytes
try {
    totalBytes = statSync(outputFilePath).size
} catch {
    // Fall back to metafile-reported bytes if file not found on disk
    totalBytes = outputBundle.bytes ?? 0
}
if (totalBytes === 0) {
    process.stderr.write('ERROR: outputBundle size is 0 — metafile may be empty or build failed.\n')
    process.exit(1)
}

// --- Path normalization helper ---
function normalizePath(rawPath) {
    // Resolve to absolute, then make relative to CWD, then convert to POSIX
    const abs = resolve(CWD, rawPath)
    const rel = relative(CWD, abs)
    const posix = rel.replace(/\\/g, '/')

    // Assertion: no absolute path, no drive letter, no ".." escape from repo root
    if (isAbsolute(posix) || posix.includes(':') || posix.startsWith('..')) {
        process.stderr.write(
            `ERROR: Path normalization assertion failed for "${rawPath}" → "${posix}". ` +
            'Absolute path or drive letter or ../ escape detected post-normalization.\n'
        )
        process.exit(3)
    }
    return posix
}

// --- Build modules array from outputBundle.inputs ---
const inputsMap = outputBundle.inputs || {}

// Build the modules array: only include src/ paths and local (non-node_modules) paths
const modules = Object.entries(inputsMap)
    .filter(([path]) => !path.includes('node_modules'))
    .map(([path, info]) => {
        const normalizedPath = normalizePath(path)
        const sourceBytes    = (meta.inputs?.[path]?.bytes) ?? 0

        // Collect local imports from metafile (filter to local src/ imports only)
        const rawImports = meta.inputs?.[path]?.imports ?? []
        const localImports = rawImports
            .filter(imp => imp.path && !imp.path.includes('node_modules'))
            .map(imp => normalizePath(imp.path))
            .sort()

        return {
            path:          normalizedPath,
            bytes:         sourceBytes,
            bytesInOutput: info.bytesInOutput ?? 0,
            imports:       localImports,
        }
    })
    .sort((a, b) => a.path.localeCompare(b.path)) // sort by path ASC for diff stability

// --- outputBundle.imports (chunk imports — always [] when splitting: false) ---
const outputImports = (outputBundle.imports ?? [])
    .filter(imp => typeof imp === 'string' ? !imp.includes('node_modules') : !imp.path?.includes('node_modules'))
    .map(imp => (typeof imp === 'string' ? normalizePath(imp) : normalizePath(imp.path)))
    .sort()

// --- Compute totals ---
const totalsModules  = modules.length
const totalsInput    = modules.reduce((s, m) => s + m.bytes, 0)
const totalsOutput   = totalBytes

// Sanity check: totals.outputBytes should equal outputBundle.bytes
if (totalsOutput !== totalBytes) {
    process.stderr.write(`WARN: totals.outputBytes (${totalsOutput}) !== outputBundle.bytes (${totalBytes}).\n`)
}

// --- Build snapshot object (explicit key order per design §D) ---
const snapshot = {
    schemaVersion:   1,
    tsgridUiVersion: versionNumeric,
    generatedAt:     new Date().toISOString(),
    generator: {
        tool:            'tsup',
        toolVersion:     tsupVersion,
        esbuildMetafile: true,
    },
    scope: {
        format:    'esm',
        minified:  false,
        entry:     'src/index.ts',
        output:    'dist/tsgrid-ui.es6.js',
        splitting: false,
        sourcemap: true,
    },
    outputBundle: {
        path:       normalizePath(outputKey),
        totalBytes: totalBytes,
        imports:    outputImports,
    },
    modules: modules,
    totals: {
        modules:     totalsModules,
        inputBytes:  totalsInput,
        outputBytes: totalsOutput,
    },
}

// --- Schema v2 gate (β: implicit from pkg.version) ---
const pkgSemver = parseSemver(pkg.version)
if (semverGte(pkgSemver, { maj: 2, min: 8, pat: 0 })) {
    snapshot.schemaVersion = 2
    snapshot.subpaths = buildSubpathsBlock(CWD)
}

// --- Write output ---
mkdirSync(join(CWD, 'reports', 'bundle'), { recursive: true })
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')

// --- stdout confirmation ---
process.stdout.write(
    `[bundle-snapshot] Wrote ${outPath.replace(/\\/g, '/')} (${totalsModules} modules, ${totalBytes.toLocaleString()} total bytes).\n`
)
