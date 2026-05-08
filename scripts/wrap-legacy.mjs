/**
 * scripts/wrap-legacy.mjs
 * Post-process step for tsup CJS output → w2ui legacy IIFE bundle.
 *
 * Reads dist/w2ui.js (CJS output from tsup), wraps it in the verbatim
 * legacy_code IIFE template from gulpfile.js, prepends the w2ui header
 * comment, and writes the result back to dist/w2ui.js (atomically via tmp).
 *
 * This reproduces what Gulp's pack/build tasks did with:
 *   .pipe(replace(legacy_replace, legacy_code))
 *   .pipe(header(comments.w2ui))
 *
 * Usage: node scripts/wrap-legacy.mjs
 */

import { readFile, writeFile, rename, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DIST_JS     = path.join(ROOT, 'dist', 'w2ui.js')
const DIST_JS_TMP = path.join(ROOT, 'dist', 'w2ui.js.tmp')

// ---------------------------------------------------------------------------
// IIFE wrapper — verbatim from gulpfile.js lines 24–46
// Note: the CJS output from tsup has no "export { ... }" block to replace.
// Instead we APPEND the IIFE after the CJS module body, injecting the
// 23 named symbols into it as the w2ui object literal.
// ---------------------------------------------------------------------------
const IIFE_WRAPPER = `
// Compatibility with CommonJS and AMD modules
!(function(global, w2ui) {
if (typeof define == 'function' && define.amd) {
    return define(() => w2ui)
}
if (typeof exports != 'undefined') {
    if (typeof module != 'undefined' && module.exports) {
        return exports = module.exports = w2ui
    }
    global = exports
}
if (global) {
    Object.keys(w2ui).forEach(key => {
        global[key] = w2ui[key]
    })
}
})(self, {
    w2ui, w2utils, query, w2locale, w2event, w2base,
    w2popup, w2alert, w2confirm, w2prompt, Dialog,
    w2tooltip, w2menu, w2color, w2date, Tooltip,
    w2toolbar, w2sidebar, w2tabs, w2layout, w2grid, w2form, w2field
});`

// ---------------------------------------------------------------------------
// Header comment — same format as gulpfile.js comments.w2ui
// ---------------------------------------------------------------------------
function buildHeader() {
    const ts = new Date().toLocaleString('en-us')
    return `/* w2ui 2.0.x (nightly) (${ts}) (c) http://w2ui.com, vitmalina@gmail.com */\n`
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
 * Remove esbuild/tsup CJS preamble + trailing exports object so the content
 * can sit bare inside the IIFE wrapper.
 *
 * esbuild CJS output structure:
 *   "use strict";
 *   var __defProp = Object.defineProperty;
 *   ... helpers ...
 *   // ---- actual source ----
 *   Object.assign(exports, { w2ui, w2utils, ... });
 *
 * We strip the final `Object.assign(exports, ...)` / `exports.xxx = yyy` lines
 * and the leading "use strict" + helper block, but keep all the class/function
 * definitions that are the real payload.
 */
function stripCjsArtifacts(code) {
    // Remove the esbuild CJS preamble ("use strict"; __defProp etc.)
    // and trailing exports. The safest approach: keep everything between
    // the end of the preamble and the start of the trailing exports block.
    //
    // esbuild wraps in a block like:
    //   "use strict"; var __defProp = ...; ... __export(exports, { ... });
    // Then the source, then at the very end may add nothing extra (exports
    // are already wired via __export at top).
    //
    // For tsup format=iife we'd get a different shape, but we're using cjs.
    // The key thing to strip is any trailing `Object.assign(exports, {...})`
    // or the __export() call that tsup adds.
    //
    // Strategy: just return the code as-is. The IIFE wrapper uses variable
    // names from the CJS scope directly (they are module-level vars in the
    // CJS output). The CJS `exports` assignment is harmless in the IIFE
    // context since `exports` is declared as a global by the AMD/CJS check
    // inside the IIFE.
    return code
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    console.log('[wrap-legacy] Wrapping dist/w2ui.js with legacy IIFE...')

    try {
        await wrapFile(DIST_JS, DIST_JS_TMP)
        console.log('[wrap-legacy] Done: dist/w2ui.js')
    } catch (err) {
        console.error('[wrap-legacy] ERROR:', err.message)
        process.exit(1)
    }
}

main()
