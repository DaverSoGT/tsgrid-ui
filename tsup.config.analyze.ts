/* tsgrid-ui — analyze-only tsup config
 *
 * SCOPE: ESM non-min entries (all 12, mirroring prod). This config exists SOLELY to emit
 * dist/metafile-esm.json (esbuild metafile, tsup 8.5.1 naming) for bundle composition
 * analysis. It is INVOKED ONLY by `pnpm bundle:analyze` and `pnpm bundle:snapshot`,
 * and is NEVER referenced by `pnpm build:js` or any production code path.
 *
 * INV-ANALYZE-ISOLATION (from spec): this file MUST NOT import, share
 * modules with, or be referenced from tsup.config.ts. Production build
 * byte-output MUST be identical before and after this file exists.
 *
 * Amendment 1 (cycle 4): entry list expanded from 1 to 12 entries to mirror the
 * prod ESM non-min block. This is REQUIRED for splitting:true to produce any chunks
 * (esbuild needs ≥2 entry points to extract shared modules). Mirroring is MANUAL COPY
 * per INV-ANALYZE-ISOLATION — do NOT import from tsup.config.ts.
 *
 * Drift maintenance: if the ESM non-min block in tsup.config.ts changes
 * its entry list, target, outDir, sourcemap, outExtension, splitting, or chunkNames,
 * manually mirror the change here. The Q5 assertion in scripts/bundle-snapshot.mjs
 * will fire exit-code 5 if splitting:true or chunkNames template drift is detected.
 * See reports/bundle/README.md → Maintenance.
 */

import { defineConfig } from 'tsup'

export default defineConfig([
    // -----------------------------------------------------------------------
    // ESM non-min (analyze) — mirrors Block 1 of tsup.config.ts
    // INV-ANALYZE-ISOLATION: do NOT import from tsup.config.ts.
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
        dts: false,
        clean: false,        // never wipe dist/ — CSS, iconfont, production bundles live there
        splitting: true,     // must mirror prod ESM non-min block (Amendment 1, cycle 4)
        esbuildOptions(options) {
            // Amendment 1: use [hash] (NOT [hash:8]) — esbuild 0.27.7 does not recognize [hash:8].
            // Must be byte-identical to the chunkNames in tsup.config.ts block 1.
            // Q5 assertion in bundle-snapshot.mjs will fire exit-code 5 if this drifts.
            options.chunkNames = 'chunks/[name]-[hash]'
        },
        sourcemap: true,
        minify: false,
        metafile: true,      // <<< only differentiator from tsup.config.ts ESM-non-min block
    },
    // -----------------------------------------------------------------------
    // Block 6 (analyze) — CJS subpath bundles (Phase 4 / v2.13.0)
    // Mirrors Block 6 of tsup.config.ts. INV-ANALYZE-ISOLATION: manual copy,
    // NOT imported from tsup.config.ts.
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
        },
        format: ['cjs'],
        outDir: 'dist',
        target: 'es2022',
        define: { 'import.meta.url': 'undefined' },
        dts: false,
        clean: false,
        splitting: false,
        sourcemap: true,
        minify: false,
        shims: false,
    },
])
