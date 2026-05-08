/* w2ui 2.0 — tsup build configuration
 *
 * Bundler ownership (Phase 1 ts-native-port migration):
 *   JS bundle  = tsup (this file)
 *   CSS/icons  = gulp (gulp less && gulp icons)
 *
 * Two entry points (renamed to .ts in T6.9):
 *   src/index.ts        → dist/w2ui.es6.js  (ESM, no wrapper)
 *   src/index-legacy.ts → dist/w2ui.js      (CJS → post-processed by scripts/wrap-legacy.mjs)
 *
 * Post-build step: `node scripts/wrap-legacy.mjs` wraps the CJS output with
 * the legacy IIFE (AMD / CommonJS / globals) from gulpfile.js lines 24–46.
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM bundle — dist/w2ui.es6.js
    // outExtension: force .js (not .mjs) to preserve the v2.0 consumer contract
    // -----------------------------------------------------------------------
    {
        entry: { 'w2ui.es6': 'src/index.ts' },
        format: ['esm'],
        outDir: 'dist',
        target: 'es2022',
        // Force .js extension for ESM output — preserves dist/w2ui.es6.js name
        // that package.json "module" field and existing consumers reference.
        // Without this tsup emits dist/w2ui.es6.mjs by default for ESM format.
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
    // Legacy CJS bundle — dist/w2ui.js (pre-wrap)
    // After tsup: `node scripts/wrap-legacy.mjs` splices the IIFE wrapper
    // define: substitute import.meta.url → undefined (matches gulp-replace
    // behavior: replace('import.meta.url', 'undefined') in w2compat.js)
    // -----------------------------------------------------------------------
    {
        entry: { 'w2ui': 'src/index-legacy.ts' },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        // Reproduce Gulp's `.pipe(replace('import.meta.url', 'undefined'))`.
        // In w2compat.js: String(import.meta.url).split('?')[1] || ''
        // → String(undefined).split('?')[1] || '' → '' (globals branch disabled)
        define: { 'import.meta.url': 'undefined' },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: false,
        minify: false,
    },
    // -----------------------------------------------------------------------
    // .d.ts rollup — dist/w2ui.d.ts (single canonical name for both ESM and CJS)
    // dts.only emits ONLY the type declarations (no JS).
    // format=cjs + outExtension forces .d.ts extension. ESM format would
    // emit .d.mts (which works fine but has unusual extension); CJS+override
    // gives the canonical .d.ts that the package.json "types" field references.
    // -----------------------------------------------------------------------
    {
        entry: { 'w2ui': 'src/index.ts' },
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
