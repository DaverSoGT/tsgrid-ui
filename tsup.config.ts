/* tsgrid-ui 1.0 — tsup build configuration
 *
 * Bundler ownership:
 *   JS bundle  = tsup (this file)
 *   CSS/icons  = gulp (gulp less && gulp icons)
 *
 * Two entry points:
 *   src/index.ts        → dist/tsgrid-ui.es6.js  (ESM, no wrapper)
 *   src/index-legacy.ts → dist/tsgrid-ui.js      (CJS → post-processed by scripts/wrap-legacy.mjs)
 *
 * Post-build step: `node scripts/wrap-legacy.mjs` wraps the CJS output with
 * the legacy IIFE (AMD / CommonJS / globals).
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM bundle — dist/tsgrid-ui.es6.js
    // outExtension: force .js (not .mjs) for consumer ergonomics.
    // -----------------------------------------------------------------------
    {
        entry: { 'tsgrid-ui.es6': 'src/index.ts' },
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
        splitting: false,
        sourcemap: false,
        minify: false,
    },
    // -----------------------------------------------------------------------
    // Legacy CJS bundle — dist/tsgrid-ui.js (pre-wrap)
    // After tsup: `node scripts/wrap-legacy.mjs` splices the IIFE wrapper.
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
    // .d.ts rollup — dist/tsgrid-ui.d.ts (single canonical name)
    // -----------------------------------------------------------------------
    {
        entry: { 'tsgrid-ui': 'src/index.ts' },
        format: ['cjs'],
        dts: { only: true },
        outDir: 'dist',
        target: 'es2022',
        outExtension() {
            return { js: '.js', dts: '.d.ts' }
        },
        clean: false,
    },
])
