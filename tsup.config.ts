/* tsgrid-ui 3.0.0 — tsup build configuration
 *
 * Bundler ownership:
 *   JS bundle  = tsup (this file)
 *   CSS/icons  = gulp (gulp less)
 *
 * Entry points (v3.0.0 — flat barrel removed):
 *   src/tsgrid.ts, src/tstooltip.ts, etc. → dist/<name>.es6.js  (ESM non-min, sourcemap)
 *   src/tslocale.ts, etc.                 → dist/<name>.js       (CJS subpaths)
 *
 * Removed in v3.0.0:
 *   src/index.ts        → dist/tsgrid-ui.es6.js    (barrel ESM — DELETED)
 *   src/index.ts        → dist/tsgrid-ui.es6.min.js(barrel ESM min — DELETED)
 *   src/index-legacy.ts → dist/tsgrid-ui.js         (barrel CJS — DELETED)
 *   src/index-legacy.ts → dist/tsgrid-ui.min.js     (barrel CJS min — DELETED)
 *   scripts/wrap-legacy.mjs  — DELETED (no barrel to wrap)
 *   scripts/patch-deprecated.mjs — DELETED (no barrel .d.ts to patch)
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM bundle (non-min) — dist/<widget>.es6.js (12 per-widget subpaths)
    // outExtension: force .js (not .mjs) for consumer ergonomics.
    // sourcemap: true — ESM is not post-processed, sourcemap is safe.
    // -----------------------------------------------------------------------
    {
        entry: {
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
            'icons.es6':     'src/icons.ts',
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
    // .d.ts rollup — dist/<widget>.d.ts (12 per-widget subpaths)
    // stripInternal: true — strips @internal-tagged declarations from output
    // -----------------------------------------------------------------------
    {
        entry: {
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
            'icons':     'src/icons.ts',
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
    // -----------------------------------------------------------------------
    // Block 6 — CJS subpath bundles (Phase 4 / v2.13.0)
    //
    // Plain CJS, not post-processed by any script.
    // Each entry is self-contained (splitting:false) so `require('tsgrid-ui/grid')`
    // resolves with no chunk-graph dependencies.
    //
    // outDir: dist (same as ESM); naming via entry KEYS produces dist/<key>.js
    // because tsup's default CJS extension is .js. NO outExtension() override.
    //
    // IMPORTANT: this block emits Node-only require() targets. These files
    // ship as plain CJS — INTENTIONALLY unwrapped.
    // -----------------------------------------------------------------------
    {
        entry: {
            'locale':  'src/tslocale.ts',
            'base':    'src/tsbase.ts',
            'utils':   'src/tsutils.ts',
            'popup':   'src/tspopup.ts',
            'tooltip': 'src/tstooltip.ts',
            'tabs':    'src/tstabs.ts',
            'toolbar': 'src/tstoolbar.ts',
            'sidebar': 'src/tssidebar.ts',
            'field':   'src/tsfield.ts',
            'layout':  'src/tslayout.ts',
            'form':    'src/tsform.ts',
            'grid':    'src/tsgrid.ts',
            'icons':   'src/icons.ts',
        },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        // CJS lacks import.meta; substitute per existing Block 3/4 pattern.
        define: { 'import.meta.url': 'undefined' },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: true,    // NOT post-processed, sourcemap is safe
        minify: false,
        shims: false,
    },
])
