/* w2ui 2.0 — tsup build configuration
 *
 * Bundler ownership (Phase 1 ts-native-port migration):
 *   JS bundle  = tsup (this file)
 *   CSS/icons  = gulp (gulp less && gulp icons)
 *
 * Two entry points:
 *   src/index.js        → dist/w2ui.es6.js  (ESM, no wrapper)
 *   src/index-legacy.js → dist/w2ui.js      (CJS → post-processed by scripts/wrap-legacy.mjs)
 *
 * Post-build step: `node scripts/wrap-legacy.mjs` wraps the CJS output with
 * the legacy IIFE (AMD / CommonJS / globals) from gulpfile.js lines 24–46.
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM bundle — dist/w2ui.es6.js
    // -----------------------------------------------------------------------
    {
        entry: { 'w2ui.es6': 'src/index.js' },
        format: ['esm'],
        outDir: 'dist',
        target: 'es2022',
        // Phase 1: no .d.ts — enabled in Phase 6 after strict pass
        dts: false,
        // Never delete dist/ — Less-compiled CSS and iconfont live there too
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: false,
    },
    // -----------------------------------------------------------------------
    // Legacy CJS bundle — dist/w2ui.js (pre-wrap)
    // After tsup: `node scripts/wrap-legacy.mjs` splices the IIFE wrapper
    // -----------------------------------------------------------------------
    {
        entry: { 'w2ui': 'src/index-legacy.js' },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: false,
    },
])
