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
 *   5  tsup config mirror assertion fails (Q5: splitting:true or chunkNames template drift)
 *   6  schema version conflict (--version flag implies different schema than pkg.version gate)
 */

import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { resolve, join, relative, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'

// --- Schema v2/v3 helpers ---

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

// Maps a semver to the schemaVersion it would produce.
// v1: < 2.8.0, v2: >= 2.8.0 < 2.8.1, v3: >= 2.8.1
function schemaVersionFor(semver) {
    if (semverGte(semver, { maj: 2, min: 8, pat: 1 })) return 3
    if (semverGte(semver, { maj: 2, min: 8, pat: 0 })) return 2
    return 1
}

// Cycle 6 (v2.11.0): ./grid reintroduced. 12 subpaths total.
// Cycle 4 (v2.8.1): forecastBytes updated to post-splitting stub sizes.
// With splitting:true, each subpath dist file is a tiny import stub (118-371 B)
// that re-exports from dist/chunks/*.js. The forecastPct is relative to the
// monolith dist/tsgrid-ui.es6.js (340,952 B post-splitting).
// Note: forecastBytes measures ONLY the stub file, not the transitive chunk size.
// Consumer effective size = stub + union of consumed chunk bytes.
const SUBPATH_INVENTORY = [
    { name: 'locale',  sourceFile: 'src/tslocale.ts',  forecastBytes: 118,  forecastPct: 0.0 },
    { name: 'base',    sourceFile: 'src/tsbase.ts',    forecastBytes: 164,  forecastPct: 0.0 },
    { name: 'utils',   sourceFile: 'src/tsutils.ts',   forecastBytes: 231,  forecastPct: 0.1 },
    { name: 'popup',   sourceFile: 'src/tspopup.ts',   forecastBytes: 322,  forecastPct: 0.1 },
    { name: 'tooltip', sourceFile: 'src/tstooltip.ts', forecastBytes: 316,  forecastPct: 0.1 },
    { name: 'tabs',    sourceFile: 'src/tstabs.ts',    forecastBytes: 260,  forecastPct: 0.1 },
    { name: 'toolbar', sourceFile: 'src/tstoolbar.ts', forecastBytes: 269,  forecastPct: 0.1 },
    { name: 'sidebar', sourceFile: 'src/tssidebar.ts', forecastBytes: 269,  forecastPct: 0.1 },
    { name: 'field',   sourceFile: 'src/tsfield.ts',   forecastBytes: 263,  forecastPct: 0.1 },
    { name: 'layout',  sourceFile: 'src/tslayout.ts',  forecastBytes: 340,  forecastPct: 0.1 },
    { name: 'form',    sourceFile: 'src/tsform.ts',    forecastBytes: 371,  forecastPct: 0.1 },
    { name: 'grid',    sourceFile: 'src/tsgrid.ts',    forecastBytes: 500,  forecastPct: 0.1 },
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

// ---------------------------------------------------------------------------
// ESM main guard — allows importing algorithm helpers (buildSubpathEffectiveBlock,
// bfsChunkClosure, detectLazyDeferred) from tests without triggering CLI side-effects.
// ---------------------------------------------------------------------------

export function bfsChunkClosure(meta, stubKey) {
    const visited = new Set()
    const queue   = [stubKey]
    const closure = new Set()
    while (queue.length > 0) {
        const cur = queue.shift()
        for (const imp of (meta.outputs[cur]?.imports ?? [])) {
            const impPath = (typeof imp === 'string') ? imp : imp.path
            if (!impPath || impPath.includes('node_modules')) continue
            if (visited.has(impPath)) continue
            visited.add(impPath)
            closure.add(impPath)
            queue.push(impPath)
        }
    }
    return closure
}

export function detectLazyDeferred(chunkPath, cwd, contentCache) {
    if (!contentCache.has(chunkPath)) {
        try {
            const abs = join(cwd, chunkPath)
            contentCache.set(chunkPath, readFileSync(abs, 'utf8'))
        } catch {
            contentCache.set(chunkPath, '')
        }
    }
    const content = contentCache.get(chunkPath) ?? ''

    // Popup markers (TsDialog ctor body — v2.10.0 lazy-singleton)
    const isPopup = /this\.handleResize\s*=/.test(content) &&
        /this\.status\s*=\s*['"]closed['"]/.test(content)

    // Tooltip markers (Tooltip ctor body — v2.10.0 lazy-singleton)
    const isTooltip = /this\.defaults\s*=/.test(content) &&
        /screenMargin/.test(content)

    return isPopup || isTooltip
}

export function buildSubpathEffectiveBlock(meta, packageExports, cwd) {
    const contentCache = new Map()
    const out = {}
    for (const sp of SUBPATH_INVENTORY) {
        const stubKey = `dist/${sp.name}.es6.js`
        const stubMetaEntry = meta.outputs[stubKey]
        if (!stubMetaEntry) {
            process.stderr.write(`ERROR: subpath stub not found in metafile: ${stubKey}. Check tsup.config.analyze.ts entry list.\n`)
            process.exit(1)
        }
        let stubBytes
        try {
            stubBytes = statSync(join(cwd, stubKey)).size
        } catch {
            stubBytes = stubMetaEntry.bytes ?? 0
        }
        const closure = bfsChunkClosure(meta, stubKey)
        const chunks = [...closure]
            .map(p => {
                const normalizedP = p.replace(/\\/g, '/')
                const chunkMeta   = meta.outputs[p]
                const chunkBytes  = chunkMeta?.bytes ?? 0
                // Size threshold omitted: content markers are specific enough to avoid false positives.
                // Only the popup and tooltip ctor-body chunks match the known marker regexes.
                const isLazy      = detectLazyDeferred(p, cwd, contentCache)
                return {
                    path:         normalizedP,
                    bytes:        chunkBytes,
                    lazyDeferred: isLazy,
                }
            })
            .sort((a, b) => a.path.localeCompare(b.path))

        const chunkBytes    = chunks.reduce((s, c) => s + c.bytes, 0)
        const loadedBytes   = stubBytes + chunkBytes
        const executedBytes = stubBytes + chunks.reduce((s, c) => c.lazyDeferred ? s : s + c.bytes, 0)

        out[sp.name] = {
            stubPath:       stubKey.replace(/\\/g, '/'),
            stubBytes,
            chunks,
            chunkBytes,
            loadedBytes,
            executedBytes,
            effectiveBytes: loadedBytes,
        }
    }
    return out
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {

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

// --- RS-4 gate: schema version conflict detection (exit code 6) ---
// Prevents emitting the wrong schema for a historic version label.
// e.g. running --version=v2.7.1 from a v2.8.1 working tree would emit schemaVersion:3
// into a "v2.7.1" baseline, which is misleading and frozen (INV-BBI-5).
const pkgSemverForGate = parseSemver(pkg.version)
const requestedSchemaV = schemaVersionFor(parseSemver(versionNumeric))
const pkgSchemaV       = schemaVersionFor(pkgSemverForGate)
if (requestedSchemaV !== pkgSchemaV) {
    process.stderr.write(
        `ERROR: Cannot regenerate ${version} baseline from a v${pkg.version} working tree. ` +
        `Schema gate would emit schemaVersion ${pkgSchemaV}, but ${version} baseline expects schemaVersion ${requestedSchemaV}. ` +
        `Frozen baselines are committed (INV-BBI-5); checkout the matching git tag if a fresh baseline is truly required.\n`
    )
    process.exit(6)
}

// --- Q5 assertion: tsup config mirror (exit code 5) ---
// Both tsup.config.ts and tsup.config.analyze.ts MUST contain splitting:true
// and the correct chunkNames template. Fires if INV-ANALYZE-ISOLATION drift is detected.
// Only checked when schema v3 is active (splitting:true is a v3+ requirement).
if (pkgSchemaV >= 3) {
    const tsupProdSrc    = readFileSync(join(CWD, 'tsup.config.ts'), 'utf8')
    const tsupAnalyzeSrc = readFileSync(join(CWD, 'tsup.config.analyze.ts'), 'utf8')

    const CHUNK_NAMES_TEMPLATE = 'chunks/[name]-[hash]'

    const prodHasSplitting    = /splitting:\s*true/.test(tsupProdSrc)
    const analyzeHasSplitting = /splitting:\s*true/.test(tsupAnalyzeSrc)
    const prodHasChunkNames    = tsupProdSrc.includes(CHUNK_NAMES_TEMPLATE)
    const analyzeHasChunkNames = tsupAnalyzeSrc.includes(CHUNK_NAMES_TEMPLATE)

    if (!(prodHasSplitting && analyzeHasSplitting && prodHasChunkNames && analyzeHasChunkNames)) {
        process.stderr.write(
            'ERROR: tsup config mirror assertion failed (Q5, INV-ANALYZE-ISOLATION). ' +
            'Both tsup.config.ts and tsup.config.analyze.ts must contain ' +
            '`splitting: true` and the chunkNames template "' + CHUNK_NAMES_TEMPLATE + '".\n' +
            `  tsup.config.ts     — splitting:true=${prodHasSplitting}, chunkNames=${prodHasChunkNames}\n` +
            `  tsup.config.analyze.ts — splitting:true=${analyzeHasSplitting}, chunkNames=${analyzeHasChunkNames}\n`
        )
        process.exit(5)
    }
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

// --- Schema v2 gate (β: pkg.version >= 2.8.0) ---
const pkgSemver = pkgSemverForGate  // already parsed above for RS-4 gate
if (semverGte(pkgSemver, { maj: 2, min: 8, pat: 0 })) {
    snapshot.schemaVersion = 2
    snapshot.subpaths = buildSubpathsBlock(CWD)
}

// --- Schema v3 gate (β: pkg.version >= 2.8.1) ---
// schemaVersion 3: splitting:true active in ESM non-min block. chunk files are produced
// under dist/chunks/ but are not tracked per-chunk in the baseline (chunk-level tracking
// deferred to cycle 5+ per Amendment 1 Opt C, pending singleton refactor and semantic
// naming resolution). Existing subpaths block and outputBundle fields are unchanged from v2.
if (semverGte(pkgSemver, { maj: 2, min: 8, pat: 1 })) {
    snapshot.schemaVersion = 3
    snapshot.scope.splitting = true
    // NOTE: no chunks block in schema v3 (Opt C deferral — see Amendment 1 #1003).
    // The chunks === undefined assertion in bundle-snapshot.test.ts is LOAD-BEARING
    // negative coverage. Do not add a chunks block here without a spec amendment.
    snapshot.subpathEffective = buildSubpathEffectiveBlock(meta, pkg.exports, CWD)  // R-BBI-B1, design §3.1
}

// --- Write output ---
mkdirSync(join(CWD, 'reports', 'bundle'), { recursive: true })
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')

// --- stdout confirmation ---
process.stdout.write(
    `[bundle-snapshot] Wrote ${outPath.replace(/\\/g, '/')} (${totalsModules} modules, ${totalBytes.toLocaleString()} total bytes).\n`
)

} // end ESM main guard
