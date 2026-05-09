/**
 * scripts/wrap-legacy.mjs
 * Post-process step for tsup CJS output → TsUi legacy IIFE bundle.
 *
 * Reads dist/TsUi.js (CJS output from tsup), wraps it in the verbatim
 * legacy_code IIFE template from gulpfile.js, prepends the TsUi header
 * comment, and writes the result back to dist/TsUi.js (atomically via tmp).
 *
 * This reproduces what Gulp's pack/build tasks did with:
 *   .pipe(replace(legacy_replace, legacy_code))
 *   .pipe(header(comments.TsUi))
 *
 * Usage: node scripts/wrap-legacy.mjs
 */

import { readFile, writeFile, rename, rm, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DIST_JS        = path.join(ROOT, 'dist', 'TsUi.js')
const DIST_JS_TMP    = path.join(ROOT, 'dist', 'TsUi.js.tmp')
// Stale ESM artifact left over before T1.7 fixed outExtension().
// tsup now emits dist/TsUi.es6.js (not .mjs). Remove idempotently on every run.
const STALE_ES6_MJS  = path.join(ROOT, 'dist', 'TsUi.es6.mjs')

// ---------------------------------------------------------------------------
// IIFE wrapper — verbatim from gulpfile.js lines 24–46
// Note: the CJS output from tsup has no "export { ... }" block to replace.
// Instead we APPEND the IIFE after the CJS module body, injecting the
// 23 named symbols into it as the TsUi object literal.
// ---------------------------------------------------------------------------
const IIFE_WRAPPER = `
// Compatibility with CommonJS and AMD modules
!(function(global, TsUi) {
if (typeof define == 'function' && define.amd) {
    return define(() => TsUi)
}
if (typeof exports != 'undefined') {
    if (typeof module != 'undefined' && module.exports) {
        return exports = module.exports = TsUi
    }
    global = exports
}
if (global) {
    Object.keys(TsUi).forEach(key => {
        global[key] = TsUi[key]
    })
}
})(self, {
    TsUi, TsUtils, query, TsLocale, TsEvent, TsBase,
    TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog,
    TsTooltip, TsMenu, TsColor, TsDate, Tooltip,
    TsToolbar, TsSidebar, TsTabs, TsLayout, TsGrid, TsForm, TsField
});`

// ---------------------------------------------------------------------------
// Header comment — same format as gulpfile.js comments.TsUi
// ---------------------------------------------------------------------------
function buildHeader() {
    const ts = new Date().toLocaleString('en-us')
    return `/* TsUi 2.0.x (nightly) (${ts}) (c) http://TsUi.com, vitmalina@gmail.com */\n`
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function fileExists(p) {
    try {
        await stat(p)
        return true
    } catch {
        return false
    }
}

async function wrapFile(src, tmp) {
    if (!(await fileExists(src))) {
        throw new Error(`Input file not found: ${src}`)
    }

    const cjsBody = await readFile(src, 'utf8')
    if (!cjsBody || cjsBody.trim().length === 0) {
        throw new Error(`Input file is empty: ${src}`)
    }

    const header  = buildHeader()

    // tsup CJS output: the bundle is a self-contained module. We strip the
    // trailing CommonJS exports assignment that tsup injects
    // ("Object.defineProperty(exports, '__esModule', ...)") because the IIFE
    // wrapper owns the export surface.
    // We do NOT do a byte-for-byte regex strip of Gulp's
    // replace(/^(import.*'|export.*}|module\.exports.*})$\n/gm, '') because
    // tsup already resolved all imports. We only need to neutralise the CJS
    // module header that esbuild adds.
    const strippedBody = stripCjsArtifacts(cjsBody)

    const output = header + strippedBody + '\n' + IIFE_WRAPPER + '\n'

    // Atomic write: write to .tmp then rename
    await writeFile(tmp, output, 'utf8')
    await rename(tmp, src)
}

/**
 * Remove the esbuild/tsup CJS artifact lines that crash the browser when the
 * bundle is loaded via a plain <script> tag.
 *
 * esbuild CJS output contains two browser-hostile lines near the top:
 *
 *   module.exports = __toCommonJS(index_legacy_exports);
 *
 * In a browser context `module` is not defined → immediate ReferenceError →
 * the entire script dies before any widget var-assignment can execute.
 * (Function declarations are fully hoisted and survive; var assignments are
 * not — this is why only the function-declared globals like TsAlert pass.)
 *
 * The IIFE wrapper that wrap-legacy.mjs appends owns the UMD/global export
 * surface (AMD, CJS, and browser-global paths), so the esbuild line is
 * fully redundant AND harmful. We strip it here.
 *
 * We also strip `Object.defineProperty(exports, "__esModule", { value: true })`
 * if esbuild ever emits it as a standalone statement (defensive; not in current
 * output shape but possible with future esbuild versions).
 *
 * All other helper declarations (__defProp, __getOwnPropDesc, __getOwnPropNames,
 * __hasOwnProp, __export, __copyProps, __toCommonJS) are LEFT INTACT — they are
 * plain var declarations that don't reference `module` or `exports` and do not
 * crash in browsers.
 *
 * @param {string} code - Raw CJS bundle content
 * @returns {string} - Content with browser-crashing lines removed
 */
function stripCjsArtifacts(code) {
    let result = code

    // ── Strip: module.exports = __toCommonJS(<varname>); ──────────────────────
    // This is the primary crash point. esbuild emits exactly one such line.
    const moduleExportsRe = /^module\.exports = __toCommonJS\([^)]+\);\s*$/m
    if (moduleExportsRe.test(result)) {
        result = result.replace(moduleExportsRe, '')
    } else {
        process.stderr.write(
            '[wrap-legacy] WARNING: expected `module.exports = __toCommonJS(...)` ' +
            'line not found — esbuild output shape may have changed. ' +
            'Verify dist/TsUi.js loads correctly in browser.\n'
        )
    }

    // ── Strip (defensive): Object.defineProperty(exports, "__esModule", ...) ──
    // Not present in current esbuild output (it uses __defProp inline in
    // __toCommonJS instead), but guard against future esbuild versions.
    const esModuleDefineRe = /^Object\.defineProperty\(\s*exports,\s*["']__esModule["'],\s*\{\s*value:\s*true\s*\}\s*\);\s*$/m
    if (esModuleDefineRe.test(result)) {
        result = result.replace(esModuleDefineRe, '')
        process.stderr.write(
            '[wrap-legacy] INFO: stripped standalone Object.defineProperty(__esModule) line.\n'
        )
    }

    return result
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    // ── One-time stale artifact cleanup ─────────────────────────────────────
    // Before T1.7 fixed tsup outExtension(), ESM output landed as .mjs.
    // T1.7 corrected the extension to .js. Remove the old .mjs if it exists
    // so it doesn't confuse consumers or bundlers. force:true makes this a
    // no-op on clean builds (idempotent).
    await rm(STALE_ES6_MJS, { force: true })

    console.log('[wrap-legacy] Wrapping dist/TsUi.js with legacy IIFE...')

    try {
        await wrapFile(DIST_JS, DIST_JS_TMP)
        console.log('[wrap-legacy] Done: dist/TsUi.js')
    } catch (err) {
        console.error('[wrap-legacy] ERROR:', err.message)
        process.exit(1)
    }
}

main()
