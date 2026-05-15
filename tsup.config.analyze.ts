/* tsgrid-ui — analyze-only tsup config
 *
 * SCOPE: ESM non-min entry ONLY. This config exists SOLELY to emit
 * dist/metafile-esm.json (esbuild metafile, tsup 8.5.1 naming) for bundle composition
 * analysis. It is INVOKED ONLY by `pnpm bundle:analyze` and is NEVER
 * referenced by `pnpm build:js` or any production code path.
 *
 * INV-ANALYZE-ISOLATION (from spec): this file MUST NOT import, share
 * modules with, or be referenced from tsup.config.ts. Production build
 * byte-output MUST be identical before and after this file exists.
 *
 * Drift maintenance: if the ESM non-min block in tsup.config.ts changes
 * its target / outDir / sourcemap / outExtension settings, manually mirror
 * the change here. See reports/bundle/README.md → Maintenance.
 */

import { defineConfig } from 'tsup'

export default defineConfig({
    entry: { 'tsgrid-ui.es6': 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    target: 'es2022',
    outExtension() {
        return { js: '.js' }
    },
    dts: false,
    clean: false,        // never wipe dist/ — CSS, iconfont, production bundles live there
    splitting: false,    // mirror production: no code-splitting (Phase 3+ work)
    sourcemap: true,
    minify: false,
    metafile: true,      // <<< only differentiator from tsup.config.ts ESM-non-min block
})
