/* tsgrid-ui 1.0 — tsup build configuration
 *
 * Bundler ownership:
 *   JS bundle  = tsup (this file)
 *   CSS/icons  = gulp (gulp less && gulp icons)
 *
 * Entry points:
 *   src/index.ts        → dist/tsgrid-ui.es6.js      (ESM non-min, sourcemap)
 *   src/index.ts        → dist/tsgrid-ui.es6.min.js  (ESM minified, no sourcemap)
 *   src/index-legacy.ts → dist/tsgrid-ui.js           (CJS → post-processed by scripts/wrap-legacy.mjs)
 *   src/index-legacy.ts → dist/tsgrid-ui.min.js       (CJS minified → post-processed by scripts/wrap-legacy.mjs)
 *
 * Post-build step: `node scripts/wrap-legacy.mjs` wraps BOTH CJS outputs with
 * the legacy IIFE (AMD / CommonJS / globals).
 *
 * NOTE: CJS blocks have sourcemap: false — wrap-legacy.mjs post-processes the
 * bundle which invalidates any inline sourcemap. ESM blocks are not post-processed
 * so sourcemap: true is safe for the non-minified ESM build.
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM bundle (non-min) — dist/tsgrid-ui.es6.js
    // outExtension: force .js (not .mjs) for consumer ergonomics.
    // sourcemap: true — ESM is not post-processed, sourcemap is safe.
    // -----------------------------------------------------------------------
    {
        entry: {
            'tsgrid-ui.es6': 'src/index.ts',
            'locale.es6':    'src/tslocale.ts',
            'base.es6':      'src/tsbase.ts',
            'utils.es6':     'src/tsutils.ts',
            'popup.es6':     'src/tspopup.ts',
            'tooltip.es6':   'src/tstooltip.ts',
            'tabs.es6':      'src/tstabs.ts',
            'toolbar.es6':   'src/tstoolbar.ts',
            'sidebar.es6':   'src/tssidebar.ts',
            'field.es6':     'src/tsfield.ts',
            'layout.es6':    'src/tslayout.ts',
            'form.es6':      'src/tsform.ts',
            'grid.es6':      'src/tsgrid.ts',
        },
        format: ['esm'],
        outDir: 'dist',
        target: 'es2022',
        outExtension() {
            return { js: '.js' }
        },
        // dts handled by the dedicated dts-only block below (canonical .d.ts name)
        dts: false,
        // Never delete dist/ — Less-compiled CSS and iconfont live there too
        clean: false,
        splitting: true,
        esbuildOptions(options) {
            // Amendment 1: use [hash] (NOT [hash:8]) — esbuild 0.27.7 does not recognize [hash:8].
            // [hash] expands to an 8-character UPPERCASE hex hash automatically.
            options.chunkNames = 'chunks/[name]-[hash]'
        },
        sourcemap: true,
        minify: false,
    },
    // -----------------------------------------------------------------------
    // ESM bundle (minified) — dist/tsgrid-ui.es6.min.js
    // INV-MIN: minified ESM artifact. No sourcemap (minified consumers don't debug).
    // -----------------------------------------------------------------------
    {
        entry: { 'tsgrid-ui.es6.min': 'src/index.ts' },
        format: ['esm'],
        outDir: 'dist',
        target: 'es2022',
        outExtension() {
            return { js: '.js' }
        },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: true,
    },
    // -----------------------------------------------------------------------
    // Legacy CJS bundle (non-min) — dist/tsgrid-ui.js (pre-wrap)
    // After tsup: `node scripts/wrap-legacy.mjs` splices the IIFE wrapper.
    // sourcemap: false — wrap-legacy.mjs post-processes the bundle (R-SM-1).
    // -----------------------------------------------------------------------
    {
        entry: { 'tsgrid-ui': 'src/index-legacy.ts' },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        // import.meta.url is not legal in CJS context; substitute undefined.
        define: { 'import.meta.url': 'undefined' },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: false,
    },
    // -----------------------------------------------------------------------
    // CJS bundle (minified) — dist/tsgrid-ui.min.js (pre-wrap)
    // INV-MIN: minified CJS artifact. Also post-processed by wrap-legacy.mjs.
    // sourcemap: false — same R-SM-1 constraint as non-min CJS block.
    // -----------------------------------------------------------------------
    {
        entry: { 'tsgrid-ui.min': 'src/index-legacy.ts' },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        define: { 'import.meta.url': 'undefined' },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: true,
    },
    // -----------------------------------------------------------------------
    // .d.ts rollup — dist/tsgrid-ui.d.ts (single canonical name)
    // stripInternal: true — strips @internal-tagged declarations from output
    // (Phase 3 of v2.4 SDD: prune private/internal surface from .d.ts)
    // -----------------------------------------------------------------------
    {
        entry: {
            'tsgrid-ui': 'src/index.ts',
            'locale':    'src/tslocale.ts',
            'base':      'src/tsbase.ts',
            'utils':     'src/tsutils.ts',
            'popup':     'src/tspopup.ts',
            'tooltip':   'src/tstooltip.ts',
            'tabs':      'src/tstabs.ts',
            'toolbar':   'src/tstoolbar.ts',
            'sidebar':   'src/tssidebar.ts',
            'field':     'src/tsfield.ts',
            'layout':    'src/tslayout.ts',
            'form':      'src/tsform.ts',
            'grid':      'src/tsgrid.ts',
        },
        format: ['cjs'],
        dts: {
            only: true,
            compilerOptions: {
                stripInternal: true,
            },
        },
        outDir: 'dist',
        target: 'es2022',
        outExtension() {
            return { js: '.js', dts: '.d.ts' }
        },
        clean: false,
    },
])
