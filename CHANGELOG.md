# Changelog

All notable changes to **TsGrid UI** will be documented in this file.

## v3.0.1 — 2026-05-18

### Fixed

- `TsUtils.notify(...)` close button rendered an invisible empty `<span>`
  in v3.0.0 because the `.tsg-icon-cross` CSS background-image rule was
  removed in v3.0.0 but `src/tsutils-notify.ts` was missed by the
  inline-SVG migration. The close button now renders an inline `<svg>` via
  `crossIcon({ label: 'Close', size: 16 })` (consistent with the v3.0.0
  `tspopup.ts:240` pattern). Accessible name "Close" is now present via
  `role="img"` + `aria-label="Close"` on the SVG. (R-CDC-1..4)

### Removed

- `.w2field` rule (5 LOC) from `src/less/src/fields.less` — unused since the
  w2ui migration; zero TS references, only mentioned in non-shipping test HTML.
- `.tsg-field-helper .tsg-icon-search` and `&.show-search` rules (12 LOC)
  from `src/less/src/fields.less` — superseded by the
  `[data-icon="search"]` attribute selector + inline `searchIcon()` SVG
  pattern in `tsfield.ts:2061` already shipped in v3.0.0.

### Changed

- `test/unit/widgets-no-css-icons.test.ts` now also scans
  `src/tsutils-notify.ts` (regression guard for the v3.0.0 hole).
- `src/less/icons/readme.md` rewritten to reflect the v3.0.0+ inline-SVG
  icon model. Old references to `drop-inverted.svg` and the
  background-image data-URI pipeline removed.

### Migration

None — PATCH release with no public API changes.

## v3.0.0 — 2026-05-18

### Breaking Changes

1. **Flat barrel removed** (`exports["."]` deleted from `package.json`). `import { TsGrid } from 'tsgrid-ui'` throws `ERR_PACKAGE_PATH_NOT_EXPORTED`. Migrate to `import { TsGrid } from 'tsgrid-ui/grid'`. See [MIGRATION_v3.md#v300--barrel-removed](MIGRATION_v3.md#v300--barrel-removed) for the full per-widget table.

2. **IIFE monolith bundles removed** (`dist/tsgrid-ui.js`, `dist/tsgrid-ui.min.js`). Browser `<script src="...tsgrid-ui.min.js">` consumers must migrate to `<script type="module">` with subpath ESM imports. See [MIGRATION_v3.md#v300--iife-globals](MIGRATION_v3.md#v300--iife-globals).

3. **`.tsg-icon-{name}` CSS background-image rules removed from `icons.less`**. The 18 named icon CSS classes (`tsg-icon-box`, `tsg-icon-check`, `tsg-icon-columns`, `tsg-icon-cross`, `tsg-icon-drop`, `tsg-icon-empty`, `tsg-icon-expand`, `tsg-icon-collapse`, `tsg-icon-eye-dropper`, `tsg-icon-info`, `tsg-icon-paste`, `tsg-icon-pencil`, `tsg-icon-plus`, `tsg-icon-reload`, `tsg-icon-search`, `tsg-icon-settings`, `tsg-icon-colors`, `tsg-icon-chevron-down`) no longer render icons. Use functions from `tsgrid-ui/icons` instead. See [MIGRATION_v3.md#v300--icon-api](MIGRATION_v3.md#v300--icon-api).

4. **CSS border-trick expand/collapse chevrons removed from `common.less`**. The `.tsg-icon-expand` and `.tsg-icon-collapse` CSS border-triangle rules are deleted. The `tsform.ts` and `grid-render.ts` renderers now use inline SVG (`expandIcon()` / `collapseIcon()`). Consumer CSS that targeted `.tsg-icon-expand::before` or `.tsg-icon-collapse::before` will no longer match.

### Removed

- `exports["."]` (flat barrel) from `package.json`
- `dist/tsgrid-ui.js` and `dist/tsgrid-ui.min.js` (IIFE monolith bundles)
- `background-image:` rules for 18 named icons from `src/less/src/icons.less`
- `.tsg-icon-expand` / `.tsg-icon-collapse` border-trick rules from `src/less/src/common.less`
- `src/less/icons/svg/drop-inverted.svg` (replaced by `color: #fff` + `fill="currentColor"` pattern)

### Added

- **`tsgrid-ui/icons` subpath** — 18 icon functions (`boxIcon`, `checkIcon`, `chevronDownIcon`, `collapseIcon`, `colorsIcon`, `columnsIcon`, `crossIcon`, `dropIcon`, `emptyIcon`, `expandIcon`, `eyeDropperIcon`, `infoIcon`, `pasteIcon`, `pencilIcon`, `plusIcon`, `reloadIcon`, `searchIcon`, `settingsIcon`). Each returns an `<svg>` HTML string. Supports `opts.label` (sets `aria-label`), `opts.size` (default 16px), `opts.class`.
- **3 new SVG source files**: `src/less/icons/svg/expand.svg`, `collapse.svg`, `chevron-down.svg`.
- **`test/fixtures/tsgrid-ui-v3.0.0.css`** — new byte-stable CSS fixture anchor (replaces v2.14.0 fixture). Reflects removal of per-icon background-image SVG data URI blobs.
- **`MIGRATION_v3.md`** — full v3.0 migration guide with per-section anchors.

### Changed

- All 8 widget renderers (`tsgrid`, `grid-render`, `grid-search`, `tsfield`, `tsform`, `tspopup`, `tstooltip`) now import named icon functions from `./icons.js` and emit inline `<svg>` strings instead of CSS class name strings.
- `package.json` version: `3.0.0-rc.1` → `3.0.0`.
- Per-widget CSS files (`dist/grid.css`, `dist/popup.css`, etc.) are smaller — no SVG data URI blobs for per-icon background-image rules.
- Drop icon hover state in grid column header uses `color: #fff` on the parent `span.tsg-icon-drop` rather than a separate white-fill SVG data URI.
- Smoke test fixtures (`test/smoke/*.html`) migrated from IIFE `<script>` to `<script type="module">` with subpath ESM imports.

### Migration

See [MIGRATION_v3.md](MIGRATION_v3.md) for the step-by-step guide covering all four breaking surfaces.

**Quick summary**: if you followed v2.15.0 deprecation notices, you have already migrated barrel imports. For icons, replace `'tsg-icon-{name}'` strings with `{name}Icon()` call results — the [MIGRATION_v3.md icon table](MIGRATION_v3.md#v300--icon-api) lists all 18 mappings.

### Known Limitations

1. **Compat shim remains**: `[class^="tsg-icon-"]:before { content: "" }` is kept in `icons.less` to prevent stale cached font-glyph pseudo-content. Adds < 50 bytes. Planned removal in v4.0.
2. **CJS consumers unaffected**: CJS subpath exports (`require('tsgrid-ui/grid')` etc.) still work. Only the flat barrel `require('tsgrid-ui')` is removed.
3. **Per-widget CSS still includes shared rules**: Each per-widget CSS file (e.g. `dist/grid.css`) inlines shared rules like `.tsg-spinner`, `.tsg-scroll`. This is expected behavior — deduplication is a build-level concern for consumers who bundle multiple widget CSS files.

---

## v2.15.0 — 2026-05-17

### Deprecated

- **`tsgrid-ui` flat barrel is deprecated** (R-BD-1..R-BD-6, R-BD-11). Importing from `tsgrid-ui` (e.g., `import { TsGrid } from 'tsgrid-ui'`) is now marked `@deprecated` in TypeScript declarations. Consumers will see IDE strikethrough on every barrel-sourced name. The barrel STILL WORKS in v2.x — `exports["."]` is unchanged, no signatures change, zero runtime behavior change in production. **Removal target: v3.0** (no calendar date; version-anchored). See [MIGRATION_v2.md#v2150--barrel-deprecation](MIGRATION_v2.md#v2150--barrel-deprecation) for the per-widget migration table.
- A one-time **dev-mode console warning** fires at module evaluation when the barrel is imported. Guarded by `typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'`, so production bundles (Vite/webpack/esbuild) DCE-eliminate it. Warning includes the migration URL and the v3.0 removal covenant.
- The CJS/IIFE barrel (`src/index-legacy.ts` → `dist/tsgrid-ui.js`) carries the same `@deprecated` JSDoc but NO runtime warning. `process.env` is unreliable in browser IIFE contexts; deprecation signaling for IIFE consumers is documentation-only.

### Added

- **Branded utility types are now accessible via `tsgrid-ui/utils`** (R-TG-1, R-TG-2). `Brand`, `RecId`, `LayoutPanelId`, and `FieldName` are re-exported from `src/tsutils.ts` and appear in `dist/utils.d.ts`. This closes the single subpath coverage gap that previously left these types reachable only via the (now-deprecated) flat barrel. Consumers can `import type { RecId } from 'tsgrid-ui/utils'`.

### Changed

- **`README.md` Quick Start** now uses `import { TsGrid } from 'tsgrid-ui/grid'` as the canonical example. The previous barrel-form example is removed. A brief migration note links to MIGRATION_v2.md.
- **`MIGRATION_v2.md`** gains a `## v2.15.0 — Barrel Deprecation` section with the complete widget→subpath migration table, codemod regex hint, and v3.0 removal covenant. The contradicting "SUPPORTED — stable public API: `import { TsGrid } from 'tsgrid-ui'`" line in the BC-2 (deep imports) section is replaced with the subpath-canonical form.
- **`scripts/patch-deprecated.mjs`** added as a post-build step in `build:js`. tsup/rollup-dts strips JSDoc from re-export statements in the rolled-up `dist/tsgrid-ui.d.ts`; this script patches `@deprecated` JSDoc back above each export line after every build (G-2 gate).

### Known Limitations

1. **One-time warn fires per module instance, not per process**. In simple consumer setups (one bundler entry point), this means "once per page load." In code-splitting bundlers that emit multiple chunks each containing the `tsgrid-ui` barrel module, the warning may fire 2× (rarely more). This is informational, not safety-critical; the warning is intentionally non-throwing.
2. **CJS/IIFE barrel deprecation is JSDoc-only**. `src/index-legacy.ts` consumers (browser `<script>` and Node CJS `require('tsgrid-ui')`) get the `@deprecated` JSDoc but no runtime signal. Browsers don't expose `process.env`; falling back to a `localStorage` flag or unconditional `console.warn` was rejected for safety/noise tradeoffs. IIFE consumers should consult MIGRATION_v2.md directly.
3. **The `Brand<K, T>` utility type was `@internal`-tagged at the source declaration site** (`src/types.ts`) but the tag was removed in v2.15.0 to enable the `tsgrid-ui/utils` re-export (R-TG-2). With `stripInternal: true` in tsup, `@internal` declarations are stripped from `.d.ts` outputs. Consumers who derive their own branded types may import `Brand` from `tsgrid-ui/utils`.

### Breaking Changes

None. v2.15.0 is a purely additive release. All existing imports continue to work. The barrel remains in `exports["."]`. No public function or class signatures change. No `exports` map keys are removed.

---

## v2.14.0 — 2026-05-17

### Changed

- **Icon rendering migrated from woff font-face to inline SVG data URIs** (R-FE-1..R-FE-7). The `@font-face` + woff base64 block is removed from `icons.less`. Each of the 15 icons (box, check, colors, columns, cross, drop, empty, eye-dropper, info, paste, pencil, plus, reload, search, settings) is now rendered via `background-image: url("data:image/svg+xml;utf8,...")`. SVG source files live under `src/less/icons/svg/` as reference artwork; they are NOT part of the build graph (icons are inlined in `icons.less` directly).
- **Build chain restored to `pnpm build` in `scripts.verify`** (R-FE-10, closes W-3 from verify #1104). The verify script now begins with `pnpm build &&` instead of `pnpm build:js &&`, because the prior reason for skipping `build:css` (non-deterministic `gulp icons` regeneration) is eliminated. Both CSS and JS artifacts are now validated on every verify run. **W-3 banner-determinism closure (Commit G)**: the gulp CSS banner previously embedded `new Date().toLocaleString('en-us')`, making every `pnpm build:css` run produce a different first line in all 11 `dist/*.css` files and leaving the working tree dirty after every `pnpm verify`. The banner is now `/* tsgrid-ui {version} ... */` (deterministic, version-only). Covered by `test/unit/build-idempotency.test.ts` (T-FE-19).
- **`gulp icons` task removed from build pipeline** (R-FE-8, R-FE-9). `scripts.build:css` now runs `gulp less` only. The `gulp-iconfont` devDependency is removed. The `gulpfile.js` `icons` task and its `gulp.watch` hook are deleted.
- **Drop-button hover state migrated** (R-FE-5): `grid.less` no longer uses a CSS font-color trick for the white drop icon on hover. The `&:hover, &.checked` block for `span.tsg-icon-drop` now carries an inline SVG data URI with `fill='%23ffffff'`. The `drop-inverted.svg` reference source is added alongside `drop.svg` in `src/less/icons/svg/`.
- **Compat shim added to icons.less** (R-FE-7): `[class^="tsg-icon-"]:before, [class*=" tsg-icon-"]:before { content: "" }` prevents stale font-glyph pseudo-content from rendering in browsers that cached the old woff stylesheet.
- **Stale icon-font artifacts deleted** (R-FE-13): `src/less/icons/tsgrid-font.woff`, `tsgrid-font.css`, `preview.html`, and `icons.json` are removed from the repository.
- **`test/fixtures/tsgrid-ui-v2.14.0.css`** replaces `tsgrid-ui-v2.11.0.css` as the byte-stable fixture anchor. The monolith CSS now contains `data:image/svg+xml` data URIs (was `data:application/x-font-woff`).

### Known Limitations

1. **SVG icon duplication across per-widget CSS files**: Each per-widget CSS file (`dist/field.css`, `dist/form.css`, etc.) imports `icons.less`, so all 15 icon SVG data URIs (~7.7 KB total) are inlined into every per-widget CSS bundle. This is expected — the monolith (`tsgrid-ui/css`) also inlines them once. Consumers using multiple per-widget CSS subpaths in a browser will receive duplicate SVG data; the browser will deduplicate identical stylesheet rules. A shared icons import strategy is deferred to a future cycle.
2. **`drop-inverted.svg` must stay in sync with `drop.svg`**: The white-fill drop icon hover state is inlined in `grid.less` as a separate data URI. If the drop icon shape changes, both `drop.svg` AND the inline URI in `grid.less` (and `drop-inverted.svg`) must be updated manually. See `src/less/icons/readme.md`.

### Breaking Changes

None. All existing `import 'tsgrid-ui/css'` and `import 'tsgrid-ui/<widget>.css'` paths continue to work. The icon `background-image` approach is a visual-only change; any consumers overriding `.tsg-icon-*` via `color:` will no longer see that color applied to icon glyphs (glyphs are gone — use `filter:` or a custom SVG if color control is needed).

---

## v2.13.0 — 2026-05-17

### Added

- CJS `require:` condition on all 12 JS subpath exports (`./locale`, `./base`, `./utils`, `./popup`, `./tooltip`, `./tabs`, `./toolbar`, `./sidebar`, `./field`, `./layout`, `./form`, `./grid`). Consumers can now `require('tsgrid-ui/grid')` in Node.js CJS modules.
- `dist/<widget>.js` files (12 new self-contained CJS bundles, one per subpath, emitted by tsup Block 6 with `splitting: false`).
- Runtime CJS smoke test (`test/consumer-smoke-cjs.js`) wired into `pnpm verify` as `pnpm consumer-smoke-cjs`.

### Implementation (2-PR summary)

- **PR #1** (`feat/cjs-subpath-build`): tsup Block 6 (CJS subpath emission, `splitting: false`, 12 entries), package.json exports + sideEffects update (16→17 entries, `utils.js` added adjacent to `utils.es6.js`), subpath-exports + tarball-contents tests updated, consumer-smoke-cjs script created, `pnpm verify` chain updated to include `pnpm build` and `pnpm consumer-smoke-cjs`.
- **PR #2** (`feat/cjs-subpath-hardening`): Byte-floor guards (`cjs-subpath-bytes.test.ts`, tightened from G-1 measurements), `wrap-legacy.mjs` comment clarification + `SUBPATH_CJS_NEVER_WRAP` tripwire constant, `bundle-snapshot.mjs` CJS exclusion comment, v2.13.0 baseline snapshot, CHANGELOG + docs, version bump.

### Known Limitations

1. **Per-subpath CJS file size (~5 KB–700 KB each)**: Because `splitting: false` is required for CJS output, each `dist/<name>.js` file inlines all transitive dependencies. A consumer `require()`-ing both `tsgrid-ui/grid` AND `tsgrid-ui/form` will load duplicated transitive code (`TsBase`, `TsUtils`, etc.) twice into the process. For memory-sensitive CJS consumers using multiple subpaths, prefer `require('tsgrid-ui')` (the CJS monolith) or migrate to ESM.
2. **Type conditions**: Types are exposed via the shared `types:` condition — valid for all consumers under `moduleResolution: node16` regardless of CJS/ESM. Explicit `.d.cts` per-subpath type entries are deferred to a future cycle.
3. **Node.js only — and DOM environment required at require() time**: Subpath CJS files (`dist/<name>.js`) are Node.js `require()` targets only — browser `<script>` consumers must continue using `dist/tsgrid-ui.min.js` (the IIFE monolith). These files ship INTENTIONALLY unwrapped (see `scripts/wrap-legacy.mjs` for the rationale). On the Node side, the bundles reference DOM APIs (`document`, `window`, `Node`, `Event`, `MutationObserver`, `navigator`, `localStorage`, `self`) at module-load time because tsgrid-ui targets browsers as its primary runtime. Pure-Node consumers (e.g. SSR pre-render, CLI tooling, test environments without a browser-like global setup) MUST provide a DOM environment before the `require()` call resolves — typical options: install `jsdom` (`new JSDOM(...).window` assigned onto `global`) or `happy-dom` and wire its globals, OR install a lightweight stub set as `test/consumer-smoke-cjs.js` does. Calling `require('tsgrid-ui/grid')` in a bare Node process without these polyfills will throw at load.
4. **Cross-copy instanceof**: A consumer `require()`-ing `tsgrid-ui/grid` AND `require('tsgrid-ui')` simultaneously may see two copies of the class identity; `instanceof` checks across the two copies will fail. This is documented behavior inherent to `splitting: false` (each subpath file inlines its own copy of the class definitions). See `test/consumer-smoke-cjs.js` cross-copy probe.

### Breaking Changes

None. This is a purely additive release. Existing ESM imports (`import { TsGrid } from 'tsgrid-ui/grid'`) are unchanged. The new `require:` condition is only invoked by CJS-mode `require()` calls.

---

## v2.12.0 — 2026-05-16

### Added: per-widget CSS subpaths (`tsgrid-ui/grid.css`, `tsgrid-ui/form.css`, etc.)

Nine new CSS subpath exports are now available. Consumers can import CSS for individual widgets
instead of (or in addition to) the monolith `tsgrid-ui/css`.

```ts
// Option A — monolith (unchanged, still recommended for most consumers)
import 'tsgrid-ui/css'

// Option B — per-widget (granular cache control, explicit dependency)
import 'tsgrid-ui/grid.css'
import 'tsgrid-ui/form.css'
import 'tsgrid-ui/tooltip.css'
import 'tsgrid-ui/popup.css'
import 'tsgrid-ui/sidebar.css'
import 'tsgrid-ui/tabs.css'
import 'tsgrid-ui/toolbar.css'
import 'tsgrid-ui/layout.css'
import 'tsgrid-ui/field.css'
```

Each subpath resolves to a standalone compiled CSS file in `dist/<widget>.css`.
The exports are plain string mappings (no `import`/`require` conditions — raw CSS).

### Implementation

3-PR chained delivery:

- **PR 1** (`refactor(less): extract variables to src/less/src/variables.less`): extracted all 123
  `@<name>: <value>;` Less variable declarations from `src/less/tsgrid-ui.less` into a new shared
  partial `src/less/src/variables.less`. The monolith CSS (`dist/tsgrid-ui.css`) remains
  byte-stable after extraction (verified by the v2.11.0 fixture test).
- **PR 2** (`build(less): per-widget entry points + gulp wiring`): created 9 Less compile entry
  points in `src/less/entries/` (one per widget), each importing `variables`, `mixins`, `icons`,
  and the widget's own rules. Added `tasks.widgets` to gulpfile.js with an explicit file list and
  `{ base: 'src/less/entries' }`. Built 9 new `dist/<widget>.css` files.
- **PR 3** (`feat(exports): add 9 per-widget CSS subpaths (v2.12.0)`): added 9 `"./field.css"`
  through `"./tooltip.css"` entries to `package.json#exports` (plain strings, no conditions) and 9
  corresponding `"./dist/<widget>.css"` entries to `package.json#sideEffects` (alphabetical, appended
  after existing 7). Bumped version to `2.12.0`. Generated `reports/bundle/v2.12.0-baseline.json`
  (schema v3, 12 JS subpath entries, CSS excluded from bundle tracking by design).

### Known limitations

- **Icon glyphs require the monolith CSS (or explicit icon font import).** Each per-widget CSS file
  includes the icon woff base64 (`~3 KB`, the icon-symbol font from `icons.less`), but does NOT
  include the OpenSans TrueType font (`~200 KB`) that is embedded only in the monolith
  (`tsgrid-ui/css`). However, the critical consequence is about icon glyphs specifically:
  widgets use `.tsg-icon-*` classes that map to the icon font characters (arrows, checkboxes,
  calendar glyphs, etc.). If you import ONLY `tsgrid-ui/grid.css` and do NOT import
  `tsgrid-ui/css`, **icon glyphs will not render** — you will see empty boxes instead of icons.
  The fix is to either also import `tsgrid-ui/css`, or provide an external icon font.
  A dedicated `tsgrid-ui/icons.css` subpath (extracting only the icon font) is tracked for a
  future `font-externalization` cycle.
- **Per-widget CSS file sizes are 14 KB–56 KB each** (field: 31 KB, form: 32 KB, grid: 56 KB,
  layout: 26 KB, popup: 15 KB, sidebar: 15 KB, tabs: 27 KB, toolbar: 30 KB, tooltip: 47 KB).
  Shared rules (`.tsg-spinner`, `.tsg-scroll-*`, `.tsg-lock`) are duplicated across files that need
  them — this is intentional for self-containment and noted as a design-accepted limitation.
- **No `.min.css` variants**: only unminified per-widget CSS ships in this cycle. Modern bundlers
  (Vite, webpack production) minify CSS at build time, so pre-minified variants would be redundant
  for most consumers. `.min.css` variants are deferred to a future cycle.
- **OpenSans font duplication**: the OpenSans `@font-face` block (~200 KB TTF base64) lives only in
  the monolith `tsgrid-ui.less` entry, not in per-widget entries. This is by design — the OpenSans
  font is a global concern (body text, inputs) and does not make sense as a per-widget dependency.
  The monolith remains the correct single-import choice for full-page applications.
- **CSS subpaths are excluded from `bundle-snapshot` tracking**: `reports/bundle/v2.12.0-baseline.json`
  tracks only the 12 JS subpaths (same as v2.11.0). CSS observability (gzipped size, selector
  count) is deferred to a future schema v4 cycle.

### BC

- **Purely additive**. All existing imports (`import 'tsgrid-ui/css'`, all JS subpaths, the barrel)
  are unchanged. No removals, no renames, no behavior changes.
- `package.json#exports` grows from 15 to 24 keys. All 15 existing keys are byte-identical.
- `package.json#sideEffects` grows from 7 to 16 entries. The first 7 entries are unchanged.
- SEMVER MINOR per SemVer §7. No breaking changes.

## v2.11.0 — 2026-05-15

### Added: `tsgrid-ui/grid` ESM subpath

The `./grid` subpath is now available, resolving amendment #983 which deferred this entry at v2.8.0
pending the introduction of `splitting: true`. With tsup `splitting: true` active since v2.8.1, the
deduplication guarantee is in place: `import { TsGrid } from 'tsgrid-ui/grid'` resolves to the same
class identity as the barrel `import { TsGrid } from 'tsgrid-ui'`. The 12-subpath surface is now
complete.

### Implementation

- `tsup.config.ts`: added `'grid.es6': 'src/tsgrid.ts'` to the ESM entry block and `'grid': 'src/tsgrid.ts'` to the dts-only entry block. No stub file created — direct-source entry, matching the `./popup` pattern.
- `package.json#exports`: inserted `"./grid": { "types": "./dist/grid.d.ts", "import": "./dist/grid.es6.js" }` after `./form`. No `require` condition (ESM-only). Total exports keys: 15.
- `scripts/bundle-snapshot.mjs`: appended `grid` entry to `SUBPATH_INVENTORY` (12 subpaths total).
- `test/unit/subpath-exports.test.ts`: `SUBPATHS` array includes `'grid'`; count assertion bumped 14 → 15.
- `test/unit/bundle-snapshot.test.ts`: new `describe('subpathEffective block (v2.11.0+)')` suite with 12-key assertion, effectiveBytes range guard, and determinism test.
- `test/consumer-smoke.ts`: added `TsGrid` value import and all 9 public grid type-only imports from `tsgrid-ui/grid`.
- `reports/bundle/v2.11.0-baseline.json`: generated and committed (schema v3, 12 subpathEffective entries). Built with tsup 8.5.1.

### Known limitations

- **CSS pairing required**: consumers importing `tsgrid-ui/grid` MUST also import `tsgrid-ui/css`
  (or `dist/tsgrid-ui.css` directly) for styles. A per-component CSS split is tracked in a future
  `grid-css-pairing` cycle.
- **ESM-only**: no `require` condition in `exports["./grid"]`. CJS subpath parity will land
  uniformly across all 12 subpaths in Phase 4 of the v3.0 roadmap.
- **Effective load**: `tsgrid-ui/grid` transitively loads ~704 KB of shared chunks (measured in
  v2.11.0 baseline) because `grid-render.ts` pulls in `tstoolbar`, `tstooltip`, and `tsfield`. The
  real tree-shaking benefit accrues to consumers using grid AND NOT form/sidebar/etc. who can avoid
  loading those transitive deps.

### BC

- Public API surface: **purely additive**. All existing imports (`tsgrid-ui`, all 11 prior subpaths) work unchanged.
- SEMVER MINOR per SemVer §7. No breaking changes.

## v2.10.0 — 2026-05-15

### Tree-shake-friendly lazy singletons

`TsPopup`, `TsTooltip`, `TsMenu`, `TsColor`, and `TsDate` now defer their underlying class
construction until first use via a Proxy-based lazy-init pattern. Consumers that import
`tsgrid-ui/popup` or `tsgrid-ui/tooltip` but do NOT call any method get a smaller bundle —
bundlers respecting `sideEffects` can now eliminate the constructor bodies.

- `package.json#sideEffects[]` no longer lists `./dist/popup.es6.js` or `./dist/tooltip.es6.js`.
- Public API unchanged: same imports, same method calls, same `instanceof`, same `vi.spyOn` behavior.
- Internal: new `src/lazy-singleton.ts` helper, named export `__test_internals` on `tspopup.ts`
  and `tstooltip.ts` for construction-count assertions.

Not changed in this release (deferred to future cycles):
- `TsUtils` stays eager — its constructor reads `navigator` and `localStorage` (real side-effects
  regardless of timing).
- SSR safety remains future work.
- `Tooltip.observeRemove = new MutationObserver(...)` static field is unchanged.

### Implementation

- `src/lazy-singleton.ts` (NEW): `lazySingleton<T>(factory, protoRef): T` — Proxy helper with
  `get`, `set`, `has`, `ownKeys`, `getOwnPropertyDescriptor`, `defineProperty`, `getPrototypeOf`
  traps. Factory invoked at most once; `getPrototypeOf` returns `protoRef.prototype` without
  materializing to preserve `instanceof` semantics without triggering construction.
- `src/tspopup.ts`: `TsPopup = lazySingleton<TsDialog>(...)` replaces `new TsDialog()`.
- `src/tstooltip.ts`: four `lazySingleton(...)` calls replace `new Tooltip()` / `new MenuTooltip()`
  / `new ColorTooltip()` / `new DateTooltip()`.

### Tests

- `test/unit/singleton-lazy-init.test.ts` (NEW): T-LAZY-1..8 covering deferred construction,
  exactly-once guarantee, singleton identity, `vi.spyOn` forwarding, `TsUtils.lang` init-chain
  safety, and `instanceof` invariant.
- `test/unit/package-json.test.ts`: updated to assert 7-entry `sideEffects[]` and version 2.10.0.
- `test/unit/bundle-snapshot.test.ts`: added R-SLI-DESIGN-3 ctor-marker assertions for
  `popup.es6.js` and `tooltip.es6.js` stubs.

### BC

- Public API surface: **purely additive**. All existing imports and call sites work unchanged.
- SEMVER MINOR per SemVer §7. No breaking changes.

## v2.9.0 — 2026-05-15

### Added

- **`TsToolbar.toggle(...args): any[]` — new public API** (`src/tstoolbar.ts:481`): flips the `checked` state of one or more items without firing events or opening overlays. Complements `check()` / `uncheck()` / `click()`:
  - `button` / `check` / `html` / `spacer` / `break`: flip `it.checked`.
  - `drop` / `menu` / `menu-radio` / `menu-check` / `color` / `text-color`: if currently checked, closes the toolbar's `-drop` overlay via `TsTooltip.hide` before flipping (mirrors `uncheck()` overlay-close path). Never opens overlays.
  - `radio`: `console.warn` + skip. Use `check()` / `uncheck()` for radios.
  - `group`: recurses into `it.items`; the container itself is never in the effected list.
  - `sub-id` with `:` notation and missing ids: silently skipped.
  - Returns the array of ids whose state actually flipped (never `undefined`).
  - State-only — does NOT fire `onClick` or `onChange`.

### Fixed (toolbar polish-lifecycle)

- `setCount` no longer recurses into non-count item types — guarded at function entry (`7d721185`).
- `destroy()` now closes pending overlays before unmount, preventing detached tooltip refs (`01752f36`).
- `menu-check` items now seed `selected` from `it.items` function-form returns at insert time (`712a1bac`).

### Fixed (toolbar polish-api)

- `get(id, true)` and `remove()` now compute the correct sub-item index inside group containers (`8a522974`, Smell 6).

### Refactor (toolbar polish-api)

- Removed unreachable `item.type==null` guard in toolbar render path (`50c8f2ea`, Smell 2).

### Style (toolbar polish-api)

- Single display value emitted for hidden-group sub-items (`2418f929`, Smell 4).
- Intentional switch fall-through explicitly annotated (`577bd566`, Smell 3).

### Build / Dist

- Removed orphan chunks from analyze build (`459b8202`, closes WARNING-V1).
- Rebuilt CJS dist with v2.8.1 banner (`48960492`, closes WARNING-V2).
- Rebuilt `dist/` after polish-api merge — restored coherence (`35fd76ba`, closes WARNING-V4).

### BC

- Public API surface: **purely additive**. `TsToolbar.toggle()` is new; all existing methods unchanged.
- SEMVER MINOR (new public API on `TsToolbar`).

### Internal

- Verify-pass for v2.8.1 (`2bcb55a3`) was completed on the `feature/v2.8.1-chunk-splitting-side-effects` branch before polish-lifecycle (3 fixes), polish-api Smells (2/3/4/6), and `toggle()` API landed on master. v2.9.0 packages those post-verify additions as a minor release.

## v2.8.1 — 2026-05-15

### Added

#### Bundle

- **`sideEffects` per-file map** — `package.json` now declares an explicit 9-entry
  `sideEffects` array, enabling webpack and rollup to tree-shake unused subpaths:
  - Side-effectful (must load): `tsgrid-ui.css`, `tsgrid-ui.min.css`,
    `utils.es6.js`, `popup.es6.js`, `tooltip.es6.js`, `tsgrid-ui.es6.js`,
    `tsgrid-ui.es6.min.js`, `tsgrid-ui.js`, `tsgrid-ui.min.js`.
  - Implicitly pure (may tree-shake): `locale.es6.js`, `base.es6.js`,
    `tabs.es6.js`, `toolbar.es6.js`, `sidebar.es6.js`, `field.es6.js`,
    `layout.es6.js`, `form.es6.js`, and all `dist/chunks/*.js`.
  - **IMPORTANT**: esbuild (and therefore vite, tsup) does **NOT** honor
    `package.json sideEffects`. Only webpack and rollup benefit from this field.
    esbuild's own tree-shaking is based solely on static analysis of ESM imports.

- **ESM shared chunks under `dist/chunks/`** — `splitting: true` is now active in the
  ESM non-min block (`tsup.config.ts` block 1). esbuild extracts shared code into
  `dist/chunks/chunk-<8CHAR>.js` files automatically. With 12 entry points, 10 chunks
  are produced. Consumers importing multiple subpaths load shared code once.

- **Multi-subpath byte savings** (webpack/rollup consumers):
  - SC-A (`./popup` + `./form`): **19.8% reduction** (627,883 B → 503,563 B effective)
  - SC-B (`./popup` + `./tooltip` + `./tabs`): **54.9% reduction** (672,606 B → 303,119 B)
  - SC-C (`./locale` only): +123 B overhead (+3.2%, well within ≤1 KB canary threshold)
  - SC-D (monolith `.`): +2,348 B overhead (+0.25%, within ±2% AC10 allowance)
  - Full scenario table: `reports/bundle/v2.8.1-splitting-savings.md`

- **Cycle 5 forward reference** — `dist/utils.es6.js`, `dist/popup.es6.js`, and
  `dist/tooltip.es6.js` remain in the `sideEffects` array because their constructors
  run module-level side effects at import time (global singleton registration).
  Cycle 5 (singleton lazy-init refactor) will remove these from the array, unlocking
  additional savings for esbuild/vite consumers that currently cannot benefit.

- **`dist/chunks/` must ship with the package** — consumers installing tsgrid-ui from
  npm must ensure `dist/chunks/*.js` files are present. The `package.json files` array
  already covers `dist/` recursively; no additional configuration needed.

### BC

- Public API surface: **purely additive**. All existing `import` paths are unchanged.
  `dist/chunks/` is a new subdirectory but is an implementation detail — not a public API.
- SEMVER PATCH. No breaking changes.

---

### Fixed (build)
- `scripts/wrap-legacy.mjs`: `buildHeader()` is now deterministic — per-build
  `new Date().toLocaleString('en-us')` timestamp removed. Version string is now
  read dynamically from `package.json` via `readFile + JSON.parse` (was stale
  hardcoded `1.0.x (nightly)`). CJS dist artifacts (`dist/tsgrid-ui.js`,
  `dist/tsgrid-ui.min.js`) are now bit-identical across consecutive rebuilds
  on unchanged source.
- Anti-regression: new Vitest unit test at `test/unit/wrap-legacy.test.ts`
  guards against reintroduction of `new Date(`, `Date.now(`, `Math.random(`
  in the post-build script.

### Notes (build)
- SEMVER: chore — no version bump.
- Supersedes the CJS-SHA Option-B caveat from the bundle-baseline-instrumentation
  cycle (spec #960 INV-BBI-1). Future cycles MAY assume strict CJS-SHA equality
  across all 5 dist artifacts.

### Added (tooling)
- `pnpm bundle:analyze` — generate esbuild metafile + per-module advisory summary (`reports/bundle/latest.md`, gitignored).
- `pnpm bundle:snapshot -- --version=vX.Y.Z` — write committed baseline JSON to `reports/bundle/<version>-baseline.json`.
- `tsup.config.analyze.ts` — analyze-only tsup config (single ESM-non-min block + `metafile: true`); structurally isolated from `tsup.config.ts` (INV-ANALYZE-ISOLATION).
- `reports/bundle/v2.7.1-baseline.json` — v2.7.1 ESM-non-min per-module byte composition. This artifact unlocks Phase 2 (subpath exports) acceptance testing (INV-CYCLE-1-HARD-GATE).
- `reports/bundle/README.md` — schema + scope documentation.

### Internal
- Zero new devDependencies. Zero changes to `src/`. Zero changes to `dist/*.js` on production builds (byte-identical, verified via `shasum` gate).
- SEMVER: chore / no version bump. Next version bump (v2.8.0) reserved for Phase 2 (subpath exports).

## v2.8.0 — 2026-05-14

### Added

- **Subpath exports** — 11 new `package.json` export entries enable tree-shakable imports
  (amendment #983: `./grid` deferred to Phase 3 pending `splitting:true` code-split):
  - `tsgrid-ui/locale` → `TsLocale` (~3,843 B, 99.6% smaller than barrel)
  - `tsgrid-ui/base` → `TsBase`, `TsEvent`, `toSafeEvent` (~32,135 B, 96.6% smaller)
  - `tsgrid-ui/utils` → `TsUi`, `TsUtils`, `query` (~127,812 B, 86.5% smaller)
  - `tsgrid-ui/popup` → `TsPopup`, `TsAlert`, `TsConfirm`, `TsPrompt`, `TsDialog` (~159,775 B, 83.1% smaller)
  - `tsgrid-ui/tooltip` → `TsTooltip`, `TsMenu`, `TsColor`, `TsDate`, `Tooltip` (~244,488 B, 74.1% smaller)
  - `tsgrid-ui/tabs` → `TsTabs` (~268,343 B, 71.6% smaller)
  - `tsgrid-ui/toolbar` → `TsToolbar` (~288,428 B, 69.5% smaller)
  - `tsgrid-ui/sidebar` → `TsSidebar` (~306,229 B, 67.6% smaller)
  - `tsgrid-ui/field` → `TsField` (~312,704 B, 66.9% smaller)
  - `tsgrid-ui/layout` → `TsLayout` (~354,172 B, 62.5% smaller)
  - `tsgrid-ui/form` → `TsForm` (~468,108 B, 50.5% smaller)
- **`./package.json` export** — enables tooling that reads package metadata at runtime.
- **`reports/bundle/v2.8.0-baseline.json`** — schemaVersion 2; per-subpath empirical byte
  measurements. Phase 2 gate for the v3.0 tree-shakable roadmap.
- Grid users continue using the barrel import (`tsgrid-ui`); `./grid` subpath export deferred
  to Phase 3 once `splitting:true` reduces transitive duplication.

### Bundle

- Monolith `tsgrid-ui` entry unchanged at 945,470 bytes (byte-identical to v2.7.1).
- Subpath bundles emitted with `splitting: false`; shared modules re-emitted per subpath.
  Most modern bundlers deduplicate transparently (esbuild, Rollup, Vite, webpack 5+, Parcel 2+).
- `splitting: true` shared-chunk optimization planned for v2.9 / Phase 3.
- Dist artifact count: 7 → 29 files (+11 ESM subpath bundles + 11 `.d.ts` files).

### BC

- Public API surface: **purely additive**. The `"."` barrel entry is byte-identical to v2.7.1.
- `dist/tsgrid-ui.es6.js` SHA: byte-identical to v2.7.1 (INV-SX-6 PASS).
- `src/index.ts` barrel: byte-identical to v2.7.1 (INV-7 PASS).
- No `require:` condition on subpaths — CJS consumers continue using `'tsgrid-ui'` barrel.
  CJS subpaths planned for Phase 4 (requires `wrap-legacy.mjs` per-symbol refactoring).
- No barrel deprecation: `'tsgrid-ui'` barrel is fully supported with zero deprecation markers.
- SEMVER MINOR per SemVer §7. No breaking changes.

### Tests

- `test/unit/subpath-exports.test.ts` (NEW) — 3 groups: exports shape, dist existence,
  bundle floor. All 3 groups GREEN from Phase 6 onward.
- `test/consumer-smoke.ts` — extended with 11 named-import probes + 11 type-only probes.
- Total Vitest tests: **352/352 GREEN** (v2.7.1 baseline: 301/301 — +13 new assertions
  plus expanded parametric tests via `it.each`).
- `tsup.config.analyze.ts`: UNCHANGED (INV-ANALYZE-ISOLATION PASS).

## v2.7.1 — 2026-05-14

### Fixed

- **R-LOC-V26-PRESERVED — `keepPhrases=false` now actually clears phrases** (`src/tsutils-locale.ts:133`, string branch): The v2.6.0 / v2.7.0 implementation `deps.extend({}, settings, TsLocale, { phrases: {} }, data)` was a deep-merge no-op on the phrases sub-tree — `extend` is deep and `extend(existingPhrases, {})` iterates `Object.keys({})` → zero keys, leaving pre-existing phrase keys intact. v2.7.1 replaces this with the spread-override-before-extend idiom: `const phrasesCleared = { ...settings, phrases: {} }; deps.extend({}, phrasesCleared, TsLocale, data)`. Pre-existing `settings.phrases` keys are NOW cleared before the `TsLocale` + `data` phrase-merge, aligning with the original code comment "clear phrases from language before merging" (in place since v2.6.0). Covered by `T-LOC-5` (flipped) + `INV-L7-PHRASES-CLEAR` (string clause). See engram #925 (discovery).
- **R-LOC-2 — `_locale()` no longer mutates the caller's input array** (`src/tsutils-locale.ts:80,86`, array branch): Calling `await Utils.locale(['en-us', 'ru-ru'])` previously rewrote the caller's array in-place to `['locale/en-us.json', 'locale/ru-ru.json']` (alias mutation via `const localeArr = locale as string[]` + `localeArr[ind] = file`). v2.7.1 uses `.map()` upfront for path expansion, producing a fresh internal array; the caller's original array reference and contents are byte-identical post-call. Covered by new `T-LOC-11` + `INV-L7-IMMUTABLE-INPUT`.
- **R-V271-4 — Array-branch `mergedSettings` init now actually pre-resets phrases** (`src/tsutils-locale.ts:79`, array branch): `let mergedSettings = deps.extend({}, settings, { phrases: {} })` had the same deep-merge no-op as R-LOC-V26-PRESERVED — pre-existing `settings.phrases` keys leaked into the initial fanout accumulator. v2.7.1 replaces it with `let mergedSettings = deps.extend({}, { ...settings, phrases: {} })`, aligning with the comment "Pre-reset phrases before fanout" (in place since v2.7.0). Covered by new `T-LOC-12` + `INV-L7-PHRASES-CLEAR` (array clause).

### Tests

- `T-LOC-5` flipped + header rewritten: was `expect(phrases).toHaveProperty('stale', 'remove-me')`; now `expect(phrases).not.toHaveProperty('stale')`. Positive assertion `expect(phrases).toHaveProperty('Add new record')` retained (proves the `keepPhrases=false` branch still merges TsLocale defaults). Comment block removes the `R-LOC-V26-PRESERVED` preservation note and adds the `INV-L7-PHRASES-CLEAR` reference + "v2.7.1 PATCH: phrases-clear now works as documented" one-liner.
- `T-LOC-11` NEW: array-input immutability gate (`INV-L7-IMMUTABLE-INPUT`). Snapshots the caller's input array, awaits `_locale(input, ...)`, asserts `expect(input).toEqual(snapshot)` AND `expect(input).toBe(inputRef)`. Sub-assertion: `deps.fetch` was still called with expanded paths (`'locale/en-us.json'`, `'locale/ru-ru.json'`).
- `T-LOC-12` NEW: array-branch `mergedSettings` phrases-clear gate (`INV-L7-PHRASES-CLEAR`, array clause). Sets `TsUtils.settings.phrases = { stale: 'remove-me' }` pre-call; asserts post-call `result.settings.phrases` does NOT contain `stale`.
- Total Vitest tests: **299/299 GREEN** (v2.7.0 baseline: 297/297).

### Bundle

Delta vs v2.7.0 baseline (`e8d9a74e`):

| Artifact | v2.7.0 | v2.7.1 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 947,274 B | 947,277 B | +3 B | +0.0003% |
| `dist/tsgrid-ui.es6.js` (ESM) | 945,466 B | 945,470 B | +4 B | +0.0004% |
| `dist/tsgrid-ui.min.js` (CJS min) | 509,260 B | 509,263 B | +3 B | +0.0003% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 508,125 B | 508,129 B | +4 B | +0.0004% |
| `dist/tsgrid-ui.d.ts` | 94,446 B | 94,446 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.css` | 246,980 B | 246,979 B | -1 B | -0.0004% |
| `dist/tsgrid-ui.min.css` | 229,707 B | 229,706 B | -1 B | -0.0004% |

All within ±2% gate. PASSED. JS bundles grew by +3–4 B (3 small fixes + new INV-L7-* inline comments — Terser strips comments in min bundles so min delta is tiny). The `d.ts` is **byte-identical** to v2.7.0 (INV-L7-API PASS — `locale(` signature unchanged). CSS delta is icon-noise (non-deterministic gulp regen, ±1 B).

### BC

- `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file: string; data: unknown } | void>` — signature **BYTE-IDENTICAL** to v2.7.0. Public API surface unchanged. `dist/tsgrid-ui.d.ts` `locale(` line unchanged (INV-L7-API PASS).
- **Behavior corrections** (PATCH-classifiable per SemVer §6 — implementation now matches documented intent in all three cases):
  - `await Utils.locale(lang, false /* keepPhrases */)` no longer preserves pre-existing `settings.phrases` keys (now matches the in-code comment "clear phrases from language before merging").
  - `await Utils.locale([...])` no longer mutates the input array (caller's array reference + contents are byte-identical post-call).
  - The internal array-branch `mergedSettings` accumulator no longer leaks pre-existing phrase keys into the fanout.
- `src/index.ts` barrel — **byte-identical** to v2.7.0 (INV-7 PASS).
- SEMVER PATCH. BC verdict: NONE for consumers using the documented behavior; latent-bug-correction for consumers depending on the never-documented broken behavior (none identified in repo audit).

### Known issues

- **R-LOC-3** (carry-forward from v2.6 / v2.7): Locale extraction does NOT directly unblock formatter extraction. The `format()` family still has its own deps-injection requirement; will be tackled separately in v2.8 via a `FormatterDeps` cluster.
- `R-LOC-V26-PRESERVED`, `R-LOC-2`, `R-V271-4` — **REMOVED** (now fixed; see §Fixed above).

### Internal

- `INV-L7-PHRASES-CLEAR` (NEW invariant): When `keepPhrases=false` (string branch) OR array-branch init, the resulting `settings.phrases` MUST NOT contain keys from the pre-call `settings.phrases` that are absent from `TsLocale.phrases` (and `data.phrases` for the string branch). Gated by `T-LOC-5` (flipped) + `T-LOC-12` (new).
- `INV-L7-IMMUTABLE-INPUT` (NEW invariant): `_locale()` MUST NOT mutate the `locale` argument when it is an array. Caller's array reference + contents are byte-identical post-call. Gated by `T-LOC-11` (new).
- `INV-L7-LEAF` (carry, PASS): `tsutils-locale.ts` runtime imports limited to `./tslocale.js`; type-only from `./tsutils.js`. No tsbase/tsutils runtime imports.
- `INV-9` (carry, PASS): zero `this.X` references in `_locale()` body.
- `INV-LINT-INV8` canary (carry, PASS): `src/tsutils-*.ts` ESLint glob covers `tsutils-locale.ts`.

---

## v2.7.0 — 2026-05-14

### Refactor

- **`locale()` extraction — `LocaleDeps` deps-injection pattern**: Extracted the `TsUtils.locale()` method body (62 LOC, the largest remaining cluster in `tsutils.ts`) into `_locale()` in `src/tsutils-locale.ts` via a new minimal `LocaleDeps` interface (`{ extend: (target, ...sources) => object; fetch: (url, init?) => Promise<Response> }`). Class method `locale()` becomes a 4-line delegator: `return _locale(locale, keepPhrases, noMerge, this.settings, { extend: this.extend.bind(this), fetch: globalThis.fetch.bind(globalThis) }).then(result => { if (result.settings) this.settings = result.settings; return result.kind === 'load' ? { file: result.file, data: result.data } : undefined })`. Public signature `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file; data } | void>` is **byte-identical** to v2.6.0. `vi.spyOn(TsUtils.prototype, 'locale')` continues to work (prototype delegator — INV-SPY PASS). Follows the v2.3 `MessageDeps` / v2.6 `DateDeps` canonical patterns. Array-form branch uses **direct `_locale()` recursion** (not delegator round-trip — design OQ-2/D2) to keep the internal call graph leaf-friendly.
  - `LocaleDeps` / `LocaleResult` are **internal** types backing the deps-injection delegation pattern. They are NOT exported through `src/index.ts` barrel (INV-L7-DEPS-INTERNAL PASS; INV-7 byte-identical barrel maintained). Consumers of `TsUtils.locale()` are unaffected.

### Fixed

- **Object-form `Utils.locale({...})` Promise hang (R-LOC-4 / INV-L7-OBJFIX)**: The v2.6.0 `locale()` body had `if (typeof locale === 'object') { this.settings = this.extend({}, this.settings, TsLocale, locale); return }` — the bare `return` inside the `new Promise((resolve, reject) => {...})` executor neither called `resolve()` nor `reject()`, so the Promise hung **forever** for any object-form input. v2.7.0 replaces the bare `return` with a value-returning path: the extracted `async function _locale()` returns `{ kind: 'merge', settings: mergedSettings }` for the object branch; the delegator unwraps to `undefined` (matching the original public contract for object form). `await Utils.locale({ dateFormat: 'dd.mm.yyyy' })` now resolves within ~1 ms (was: pending forever). Covered by test `T-LOC-1` with `vitest timeout: 1000`.

### Tests

- Added 10-case safety-net suite for `_locale()` in `test/unit/tsutils-locale.test.ts` committed as Phase 4 RED before extraction (INV-TDD PASS — `c7e64b43` < `dda197ad` < `32538179`):
  - **T-LOC-1** — object-form `_locale({ dateFormat: 'dd.mm.yyyy' })` resolves within 1 s with `{ kind: 'merge', settings.dateFormat: 'dd.mm.yyyy' }` (INV-L7-OBJFIX gate)
  - **T-LOC-2** — 5-char string `'ru-ru'` auto-expanded to `'locale/ru-ru.json'` before `deps.fetch`
  - **T-LOC-3** — Full-path string `'locale/ru-ru.json'` passed verbatim (no double-expansion)
  - **T-LOC-4** — `keepPhrases=true` preserves pre-existing phrase keys in returned settings
  - **T-LOC-5** — `keepPhrases=false` (default) executes the TsLocale-merge branch; documents `R-LOC-V26-PRESERVED` (see Known Issues)
  - **T-LOC-6** — `noMerge=true` returns `{ kind: 'load', file, data }` without including merged settings
  - **T-LOC-7** — Array form `['en-us', 'ru-ru']` triggers N fetch calls and resolves `{ kind: 'void' }` (delegator maps to `undefined`)
  - **T-LOC-8** — `deps.fetch` rejection re-throws and rejects the returned Promise
  - **T-LOC-9** — Design constraint: T-LOC-2..T-LOC-8 pass in jsdom **without** a global `fetch` polyfill (proven by T-LOC-2..T-LOC-8 collectively)
  - **T-LOC-10** — `vi.spyOn(TsUtils, 'locale')` observes exactly one call when `TsUtils.locale('en-us')` is invoked (INV-SPY / INV-L7-DELEGATOR gate)
- Total Vitest tests: **297/297 GREEN** (v2.6.0 baseline: 288/288).

### Bundle

Delta vs v2.6.0 baseline:

| Artifact | v2.6.0 | v2.7.0 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 946,686 B | 947,274 B | +588 B | +0.0621% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,878 B | 945,466 B | +588 B | +0.0622% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,954 B | 509,260 B | +306 B | +0.0601% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,819 B | 508,125 B | +306 B | +0.0603% |
| `dist/tsgrid-ui.d.ts` | 94,446 B | 94,446 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.css` | 246,980 B | 246,980 B | 0 B | 0.0000% |
| `dist/tsgrid-ui.min.css` | 229,707 B | 229,707 B | 0 B | 0.0000% |

All within ±2% gate. PASSED. The JS bundles grew by ~0.06% (the new `_locale` function body + deps wiring); the `d.ts` is **byte-identical** to v2.6.0 (INV-L7-API PASS — `locale(` signature unchanged, `LocaleDeps`/`LocaleResult` declared `@internal` and stripped by tsup `stripInternal: true`). CSS/min.css unchanged (no css edits in v2.7).

### BC

- `TsUtils.locale(locale, keepPhrases?, noMerge?): Promise<{ file: string; data: unknown } | void>` — signature and (now-resolving) runtime behavior **BYTE-IDENTICAL** to v2.6.0 for all string/array inputs. **Object-form input changes**: previously hung forever (effectively unusable); now resolves with `undefined` after merging. Existing call sites using string/array inputs work unchanged; existing call sites using object-form were necessarily broken (Promise never settled) and now begin working.
- `src/index.ts` barrel — **byte-identical** to v2.6.0 (INV-7 PASS).
- `LocaleDeps` / `LocaleResult` — NEW **internal** types. NOT exported through `src/index.ts` barrel (INV-L7-DEPS-INTERNAL PASS). `LocaleResult` declared `/** @internal */` and stripped from the rolled d.ts. `LocaleDeps` is type-only at the delegator call site and does not affect the d.ts surface.
- SEMVER MINOR. BC verdict: NONE for string/array inputs; BUGFIX for object-form input (R-LOC-4).

### Known issues

- **R-LOC-2** (deferred from v2.6 — confirmed still present): Array-form input `await Utils.locale(['en-us', 'ru-ru'])` MUTATES the caller's input array (each 5-char code is rewritten in-place to `'locale/xx-xx.json'`). Preserved verbatim in v2.7. Candidate fix in v2.8.
- **R-LOC-V26-PRESERVED** (newly documented): `keepPhrases=false` branch in v2.6.0 had comment "clear phrases from language before merging" but the implementation `extend({}, settings, TsLocale, { phrases: {} }, data)` does **not** actually clear pre-existing phrase keys — `extend` is deep, and `extend(existingPhrases, {})` is a no-op. Pre-existing phrase keys survive the merge in both v2.6.0 and v2.7.0. v2.7 scope was constrained to **one** behavior change (R-LOC-4 — object-form hang), so this latent behavior is preserved verbatim with `T-LOC-5` documenting the actual semantics. Candidate fix in v2.8.
- **R-LOC-3** (carry-forward from v2.6): Locale extraction does NOT unblock formatter extraction. The `format()` family still has its own deps-injection requirement; will be tackled separately in v2.8 via a `FormatterDeps` cluster.

### Internal

- `src/tsutils-locale.ts` is a **leaf module** (INV-L7-LEAF PASS): zero runtime imports from `./tsbase.js` or `./tsutils.js`. Only `import type { TsUISettings } from './tsutils.js'` (erased at emit) and `import { TsLocale } from './tslocale.js'` (zero-dep data leaf). DAG depth unchanged.
- INV-9 (zero `this.` in extracted function body) PASS.
- INV-LINT-INV8 canary: `src/tsutils-*.ts` ESLint glob continues to cover the new file (verified by inserting `void arguments.length;` → `pnpm lint` EXIT 1 → revert → EXIT 0).

---

## v2.6.0 — 2026-05-13

### Refactor

- **`date()` extraction — `DateDeps` deps-injection pattern**: Extracted the `TsUtils.date()` method body (22 LOC, the sole `this.lang('Yesterday')` coupling in `tsutils.ts`) into `_date()` in `src/tsutils-datetime.ts` via a new minimal `DateDeps` interface (`{ lang: (phrase: string) => string }`). Class method `date()` becomes a one-line delegator: `return _date(dateStr, this.settings, { lang: this.lang.bind(this) })`. Public signature `TsUtils.date(dateStr: unknown): string` is **byte-identical** to v2.5.0. `vi.spyOn(TsUtils, 'date')` continues to work (prototype delegator). Follows the v2.3 `MessageDeps` / `NotifyDeps` canonical pattern.
  - `DateDeps` is an **internal** interface backing the deps-injection delegation pattern. It is NOT exported through `src/index.ts` barrel (INV-7 byte-identical). Consumers of `TsUtils.date()` are unaffected — the public method signature and runtime behavior are identical to v2.5.0 (same string outputs for all date inputs).
- **`TsTimeResult` dedup**: Promoted `interface TsTimeResult` in `src/tsutils-datetime.ts` from non-exported to `export interface TsTimeResult`. Deleted the local duplicate declaration in `src/tsutils.ts` (lines 102-107); replaced with `import type { TsTimeResult } from './tsutils-datetime.js'` (for internal use by `isTime()`) and `export type { TsTimeResult } from './tsutils-datetime.js'` (barrel re-export). Single source-of-truth now in `tsutils-datetime.ts`. Mirrors the `TsColorRgb` precedent (`tsutils.ts:104`). `dist/tsgrid-ui.d.ts` continues to declare `TsTimeResult` exactly once (INV-LOC-1 `grep -c` = 1, line 425). Existing `import type { TsTimeResult } from 'tsgrid-ui'` consumers continue to work unchanged — same d.ts reachability, different source file.

### Tests

- Added 7-case safety-net suite for `_date()` in `test/unit/tsutils-datetime.test.ts` committed as Phase 4 RED before extraction (INV-TDD PASS):
  - T-DATE-1 — empty string → `''`
  - T-DATE-2 — `null` → `''`
  - T-DATE-3 — invalid date string → `''`
  - T-DATE-4 — today (frozen clock, `vi.useFakeTimers()`) → regex match on `<span title="...">H:MM am|pm</span>`
  - T-DATE-5 — yesterday (frozen clock) → regex match on `<span title="May 12, 2026 ...">Yesterday</span>` (proves `deps.lang` is called)
  - T-DATE-6 — Unix timestamp (older) → `<span title="...">` with month-day-year
  - T-DATE-7 — older date string → `<span title="...">` with month-day-year
- `vi.useFakeTimers()` / `vi.useRealTimers()` wrap the entire `_date()` describe block (INV-DATE-TIMEFREEZE PASS). Total Vitest tests: **288/288 GREEN** (v2.5.0 baseline: 280/280).

### Bundle

Delta vs v2.5.0 baseline:

| Artifact | v2.5.0 | v2.6.0 | Δ bytes | Δ % |
|----------|--------|--------|---------|-----|
| `dist/tsgrid-ui.js` (CJS) | 946,611 B | 946,686 B | +75 B | +0.0079% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,804 B | 944,878 B | +74 B | +0.0078% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,902 B | 508,954 B | +52 B | +0.0102% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,768 B | 507,819 B | +51 B | +0.0100% |
| `dist/tsgrid-ui.d.ts` | 93,022 B | 94,446 B | +1,424 B | +1.5308% |

All within ±2% gate. PASSED. The JS bundles are essentially byte-stable (≤0.011%) — the mechanical extraction added nothing meaningful at runtime. The `d.ts` grew by +1,424 B because `TsTimeResult` is now emitted as a named export from `tsutils-datetime.ts` (its source-of-truth file) rather than transitively via `isTime()` from `tsutils.ts`; additionally `DateDeps` is declared in `tsutils-datetime.ts` and included in the rolled d.ts.

**Note on P6 dist commit**: `pnpm build` was run at P6-DEDUP to enable the INV-LOC-1 audit-trail gate (`grep -c` = 1 in committed dist). P8 re-emits dist with the `v2.6.0` version banner baked into the JS headers. This is intentional and mirrors the v2.5.0 release commit (`51c00836`) pattern.

### BC

- `TsUtils.date(dateStr: unknown): string` — signature and runtime behavior **BYTE-IDENTICAL** to v2.5.0. All existing call sites work unchanged.
- `TsUtils.isTime(val: unknown, retTime?: boolean): boolean | TsTimeResult` — signature **BYTE-IDENTICAL** to v2.5.0.
- `TsTimeResult` — shape `{ hours: number; minutes: number; seconds: number }` unchanged. Continues to be reachable in `dist/tsgrid-ui.d.ts` at the same surface. Existing `import type { TsTimeResult } from 'tsgrid-ui'` consumers unaffected.
- `DateDeps` — NEW **internal** interface. Not exported through `src/index.ts` barrel (INV-7 byte-identical). Consumers do not depend on it; `_date()` is not a public export. Spec requirement A-4 (emit `DateDeps` in d.ts as a named export) is NOT honored because honoring it would require modifying `src/index.ts`, violating INV-7. The type IS present in the rolled d.ts (tsutils-datetime.ts is included by tsup), but is not consumer-reachable via a top-level import path. This is a documented spec divergence: INV-7 (backwards compat, blocking) takes precedence over A-4 (additive surface, non-blocking for existing consumers). Future revision: export `DateDeps` from `src/index.ts` if consumers need it.
- `src/index.ts` barrel — **byte-identical** to v2.5.0 (INV-7 PASS).
- SEMVER MINOR. BC verdict: NONE.

### Internal

- v2.5 SUGG-5 (INV-8 over `src/tsutils-color.ts`) **CLOSED by verification**: ESLint `no-restricted-syntax` glob `src/tsutils-*.ts` already covers `tsutils-color.ts`. The two `arguments` occurrences at lines 110 and 145 of that file are inside explanatory comments (`// ... example: arguments[0]...`), not AST nodes — the rule does not fire on comment text. Confirmed by INV-LINT-INV8 canary: injecting `void arguments.length;` into `src/tsutils-datetime.ts` triggers `pnpm lint` EXIT 1 with the expected diagnostic; reverting restores EXIT 0. No code change required. No carry-forward to v2.7+ SUGG list.

---

## v2.5.0 — 2026-05-13

### Refactor

Decomposed the **date-time cluster** (8 methods, 293 LOC) out of `TsUtils` into a new leaf module `src/tsutils-datetime.ts` — **no breaking changes**, public API preserved. Class methods remain; bodies are now one-line delegators routing to pure functions in the sibling module.

- `src/tsutils-datetime.ts` — `isDate`, `isTime`, `isDateTime`, `age`, `interval`, `formatDate`, `formatTime`, `formatDateTime` extracted as stateless functions (~427 LOC including header + types + 8 function bodies). Zero `this.X` references in function bodies (INV-9); no runtime import from `tsbase.ts` or `tsutils.ts` (INV-4 leaf rule). Only allowed imports: `_isInt` from `tsutils-type-guards.js`; `TsUISettings` as a type-only import from `tsutils.js` (erased at emit — same precedent as `tsutils-message.ts` and `tsutils-type-guards.ts`).
- `settings` parameter injected by reference (`this.settings`) in each delegator so TsLocale runtime mutations to `fullmonths`, `shortmonths`, `dateFormat`, `timeFormat`, `datetimeFormat` flow through without restart.
- Intra-cluster cross-calls become module-level function references: `_isDateTime` calls `_isDate` + `_isTime` directly; `_formatDateTime` calls `_formatDate` + `_formatTime` directly; `_formatTime` calls `_isTime` directly (R-DT-2 / R-DT-8 mitigations — zero `this.X` in extracted bodies).
- `date()` stays in `tsutils.ts` (sole `this.lang('Yesterday')` coupling; deferred to v2.6 locale cycle). `formatters` initializer stays in `tsutils.ts` (goes through class delegators — one extra hop within bundle budget per R-DT-9).
- `src/tsutils.ts` shrinks from ~1,470 → ~1,183 LOC (293 cluster LOC removed, 24 LOC delegators added). Mirrors the v2.4 DOM cluster pattern (engram #889).

`TsUtils` singleton shape and all ~78 call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Tests

- Added 56 unit tests (224 → 280) across 8 method blocks in `test/unit/tsutils-datetime.test.ts`: `isDate` (12), `isTime` (8), `isDateTime` (7), `age` (8), `interval` (5), `formatDate` (5), `formatTime` (4), `formatDateTime` (3) + delegation spy (2). jsdom feasibility: 100% — no Playwright-only paths in this cluster. Safety-net tests committed as Phase 4 RED before extraction (INV-TDD PASS).

### Bundle

Delta vs v2.4.1 baseline:

| Artifact | v2.4.1 | v2.5.0 | Delta | % |
|----------|--------|--------|-------|---|
| `dist/tsgrid-ui.js` (CJS) | 946,553 B | 946,611 B | +58 B | +0.006% |
| `dist/tsgrid-ui.es6.js` (ESM) | 944,746 B | 944,804 B | +58 B | +0.006% |
| `dist/tsgrid-ui.min.js` (CJS min) | 508,818 B | 508,902 B | +84 B | +0.017% |
| `dist/tsgrid-ui.es6.min.js` (ESM min) | 507,684 B | 507,768 B | +84 B | +0.017% |
| `dist/tsgrid-ui.d.ts` | 93,022 B | 93,022 B | 0 B | 0% |

All within ±2% gate. PASSED. The `+84 B` increase in minified bundles is expected noise from the delegator shim layer (same one-extra-hop pattern as v2.4 DOM cluster). The d.ts is byte-identical — extracted function bodies and the local `TsTimeResult` interface in `tsutils-datetime.ts` are internal, not emitted in the rolled d.ts.

### BC

Net-additive (new module + delegators). Public method signatures byte-identical OR narrowed-with-strict-refinement per documentation. `TsTimeResult` continues to be declared in `tsutils.ts` (no-export, emitted transitively in d.ts per v2.4.1 hotfix); the new `tsutils-datetime.ts` module declares a structurally identical local `TsTimeResult` for `_isTime`'s internal use — non-exported, not emitted in rolled d.ts. No consumer-visible type change. `vi.spyOn(TsUtils, 'X')` continues to work for all 8 extracted methods via class-prototype delegators (INV-SPY PASS). SEMVER MINOR. BC verdict: NONE.

---

## v2.4.1 — 2026-05-13

### Fixed

- **d.ts correctness** — `dist/tsgrid-ui.d.ts` referenced `TsFormatter` and `TsTimeResult` in public method signatures (`formatters: Record<string, TsFormatter>`, `isTime(...): boolean | TsTimeResult`) but did NOT declare them — they were stripped by tsup `stripInternal` in v2.4.0. Consumers compiling with strict TypeScript saw unresolved type references. Removed the `@internal` JSDoc tag from `TsFormatterExtra`, `TsFormatter`, and `TsTimeResult` in `src/tsutils.ts`; the three types remain non-exported but are now emitted in the rolled `.d.ts` because they're transitively referenced from public surface. SEMVER PATCH — runtime bundles byte-identical to v2.4.0; only the `.d.ts` grows by ~458 B (+0.49%).

### BC

`.d.ts` is now internally consistent; no other change. Public API surface, runtime, and bundles: UNCHANGED. SEMVER PATCH. BC verdict: NONE.

---

## v2.4.0 — 2026-05-13

### Added

- **Minified bundles** — new `dist/tsgrid-ui.min.js` (CJS, IIFE-wrapped) and `dist/tsgrid-ui.es6.min.js` (ESM). ~46% smaller than non-min counterparts (~508 KB vs ~947 KB). Non-min bundles remain the default for debugging; minified are opt-in by direct path.
- **ESM sourcemap** — `dist/tsgrid-ui.es6.js.map` shipped alongside the ESM bundle for consumer debugging. CJS sourcemap intentionally omitted (incompatible with the legacy IIFE wrapper rewrite).
- **ESLint enforcement of INV-8** — new `no-restricted-syntax` rule scoped to `src/tsutils-*.ts` blocks `arguments.length` (codifies the delegator-trap discovered in v2.1 / fixed in v2.3 into the lint gate).

### Refactor

Decomposed the **DOM cluster** (8 methods, ~397 LOC) out of `TsUtils` into a new leaf module `src/tsutils-dom.ts` — **no breaking changes**, public API preserved. Class methods remain; bodies are now one-line delegators routing to pure functions in the sibling module.

- `src/tsutils-dom.ts` — `transition`, `lock`, `unlock`, `getSize`, `getStrDimentions`, `getStrWidth`, `getStrHeight`, `bindEvents` extracted as stateless functions (~234 LOC). Zero `this.X` references in function bodies (INV-9); no import from `tsbase.ts` (INV-4 leaf rule).
- `TsLockOptions` interface moved to `tsutils-dom.ts` and re-exported via `tsutils.ts` barrel (TsCloneOptions / TsMessageOptions pattern). Public API unchanged.
- `lock()` internal `this.unlock(...)` call → direct module-level `unlock()` call (R-DOM-1 mitigation).
- `getStrDimentions()` internal `this.encodeTags(...)` → import `_encodeTags` from `tsutils-string.js` (R-DOM-2 mitigation).
- `src/tsutils.ts` shrinks from ~1,602 → ~1,470 LOC. **NET REPO DELTA: −18 LOC** (397 removed inline, 234 + 25 added in dom + delegators).

`TsUtils` singleton shape and all ~49+ call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Improved (type)

- `TsUtils.getStrDimentions(str, styles): { width: number; height: number }`, `TsUtils.getStrWidth(str, styles): number`, `TsUtils.getStrHeight(str, styles): number` — return types narrowed from accidental `any` to explicit `number`. **Type improvement, runtime-equivalent**; no behavior change. Consumers using strict tsconfig settings will see the tighter types (all previously valid call sites remain valid — `any → number` is a strict refinement).

### Internal

- `@internal` JSDoc + tsup `stripInternal: true` for private surface (`_msgDeps`/`_confirmDeps`/`_promptDeps`, plus `TsFormatterExtra`/`TsFormatter`/`TsTimeResult`). `dist/tsgrid-ui.d.ts` reduced ~1.07% (93,567 → 92,564 B). Larger reductions deferred to v2.5+ (root cause: `TsFormatter`/`TsTimeResult` referenced inline in public method signatures, so tsc re-emits them).
- `scripts/wrap-legacy.mjs` regex generalized to match esbuild's minified `module.exports=ui(_i);` form (anchors removed) — handles both `tsgrid-ui.js` and `tsgrid-ui.min.js` (R-WRAP-1 mitigation).

### Tests

- Added 27 unit tests (197 → 224) covering DOM cluster (lock/unlock/getSize/getStrDimentions/getStrWidth/getStrHeight/bindEvents). `transition` covered by Playwright smoke only (jsdom cannot observe CSS animations).

### Bundle

Non-min delta vs v2.3.0 baseline:
- `dist/tsgrid-ui.js`: 946,684 → 946,553 B (−0.014%)
- `dist/tsgrid-ui.es6.js`: 944,836 → 944,746 B (−0.010%)

New minified artifacts:
- `dist/tsgrid-ui.min.js`: ~509 KB (−46.3% vs non-min)
- `dist/tsgrid-ui.es6.min.js`: ~508 KB (−46.3%)

All within ±2% gate. PASSED.

### BC

Net-additive (new artifacts + type narrowing). Public method signatures: byte-identical for transition/lock/unlock/getSize/bindEvents. `getStrWidth/Height/getStrDimentions` types narrowed `any → number` (strict superset; no runtime change). SEMVER MINOR. BC verdict: NONE.

---

## v2.3.0 — 2026-05-13

### Refactor

Decomposed the **message cluster** (652 LOC) out of `TsUtils` into two new sibling modules — **no breaking changes**, public API byte-identical to v2.2.0. Class methods remain; bodies are now one-line delegators routing to plain functions in sibling modules.

- `src/tsutils-registry.ts` — `TsUi` widget registry + `checkName()` validation helper. Phase 0 Cycle-Break: severs the `tsbase ↔ tsutils` circular import that existed since v1.x. `tsbase.ts` now imports from `tsutils-registry.ts`, `tsutils-data.ts`, `tsutils-type-guards.ts`, and `query.js` directly — zero edges back into `tsutils.ts`.
- `src/tsutils-notify.ts` — `notify()` pure function + `NotifyDeps` DI interface. Imports only `query.js`; `this.tmp` state passed by reference via `deps.tmpSlot`.
- `src/tsutils-message.ts` — `normButtons()`, `_message()`, `_alert()`, `_confirm()`, `_prompt()` pure functions + `MessageDeps`, `NotifyDeps`, `ConfirmDeps`, `PromptDeps` DI interfaces + `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions` type definitions. The only sub-module permitted to import `TsBase` from `tsbase.ts` (required for event-mixin instantiation; documented carve-out to INV-4).

`TsUtils` singleton shape and all ~788+ call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Added

- New internal DI interfaces exported from `tsutils-message.ts`: `MessageDeps`, `ConfirmDeps`, `PromptDeps`.
- `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions` types relocated from inline declarations in `tsutils.ts` to `tsutils-message.ts`; re-exported via `tsutils.ts` barrel — all existing import paths remain valid.

### Fixed

- **`arguments.length == 1` overload trap** in `message()`, `confirm()`, and `prompt()`: the class delegator always passes 2 arguments to the extracted function, making `arguments.length` always `2` and silently breaking the single-arg `where-as-options` call form. Replaced with `options == null` (loose-equality covers both `undefined` and `null`). Behavior is a strict superset: additionally fixes `confirm(where, null)` and `prompt(where, null)` which previously assigned `null` to `msgOpts` and would crash on subsequent property access. Locked by parity tests (1-arg vs 2-arg-undefined produce identical DOM output for each method).

### Tests

- Added 82 unit tests (115 → 197): 6 registry (Phase 0), 17 notify (Phase 1), 15 normButtons (Phase 2), 15 message scaffold (Phase 3a), 14 message body/animation/parity (Phase 3b), 15 alert/confirm/prompt/parity (Phase 4).

### Bundle

Delta vs v2.2.0 baseline: `dist/tsgrid-ui.js` 946,684 B (+1,648 B, +0.17%), `dist/tsgrid-ui.es6.js` 944,836 B (+1,657 B, +0.18%). Within ±2% gate. PASSED.

### BC

Net-additive. All `TsUtils` method signatures, arities, return types, and runtime behavior unchanged. Three type definitions relocated (re-exported at original paths). SEMVER MINOR. BC verdict: NONE.

---

## v2.2.0 — 2026-05-13

### Added

- **`TsUtils.colorContrastValue(color1, color2): number`** — numeric companion to `colorContrast()` that returns the raw WCAG ratio as a `number` instead of a `.toFixed(2)` string. Consumers performing threshold checks no longer need to wrap the result in `Number(...)` or `parseFloat(...)`.

### Refactor

- `colorContrast()` now delegates to `colorContrastValue().toFixed(2)`. Output is byte-identical to v2.1.0; no behavior change.
- `tstoolbar.ts` background-color contrast check upgraded to the numeric API (`TsUtils.colorContrastValue('#fff', color) < 2`), removing the `Number(...)` cast.

### Tests

- Added 4 unit tests for `colorContrastValue` (111 → 115): typeof number, white/black ≥ 21 (max WCAG), identical = 1, parity with `colorContrast` string form via `.toFixed(2)`.

### BC

Net-additive. `colorContrast` return type and value unchanged. SEMVER MINOR. BC verdict: NONE.

---

## v2.1.0 — 2026-05-13

### Refactor

Decomposed `TsUtils` into 5 stateless sub-modules — **no breaking changes**, no public API surface change. The class still exists with the same shape; method bodies are now one-line delegators that route to plain functions in sibling modules.

- `src/tsutils-type-guards.ts` — 9 type-guard functions (`isInt`, `isFloat`, `isMoney`, `isHex`, `isAlphaNumeric`, `isEmail`, `isIpAddress`, `isPlainObject`, `isBin`). `isFloat`/`isMoney` accept a `Pick<TsUISettings, ...>` slice for locale-aware testing.
- `src/tsutils-color.ts` — 4 color math functions (`parseColor`, `hsv2rgb`, `rgb2hsv`, `colorContrast`) + `TsColorRgb` type. Dual-form dispatch (object-arg vs positional) preserved using `typeof` detection — more robust than `arguments.length` under the delegator pattern.
- `src/tsutils-data.ts` — 10 data helpers (`clone`, `extend`, `naturalCompare`, `normMenu`, `getNested`, `encodeParams`, `prepareParams`, `parseRoute`, `debounce`, `wait`) + `TsCloneOptions`, `TsNormMenuOptions` types. `prepareParams` accepts `defaultDataType` parameter.
- `src/tsutils-string.ts` — 10 string/HTML helpers (`stripSpaces`, `stripTags`, `encodeTags`, `decodeTags`, `escapeId`, `unescapeId`, `base64encode`, `base64decode`, `sha256`, `execTemplate`).
- `src/tsutils-marker.ts` — `marker` + private DOM regex helpers (`_clearMarkers`, `_replace`).

`TsUtils` singleton shape and all ~788 call sites: **UNCHANGED**. SEMVER MINOR. BC verdict: NONE.

### Tests

Added 27 unit tests (84 → 111): 15 color cluster (`parseColor`, `hsv2rgb`, `rgb2hsv`, `colorContrast`) + 2 `isBin` ratchet + 2 object-form regression locks (`hsv2rgb`/`rgb2hsv`) + 6 data ratchet (`getNested`, `normMenu`) + 2 string ratchet (`decodeTags`, `execTemplate`).

### Bundle

Delta vs v2.0.1 baseline: `dist/tsgrid-ui.js` +0.15% (944,879 → 943,454 bytes), `dist/tsgrid-ui.es6.js` +0.15% (943,022 → 941,597 bytes). Within ±2% gate. PASSED.

---

## v2.0.1 — 2026-05-13

### Fixed

- **`MIGRATION_v2.md` now included in the published npm tarball.** v2.0.0 omitted this file from `package.json` `files`, so `CHANGELOG.md` and `README.md` links pointing to `MIGRATION_v2.md` (codemod, bundle measurement, release checklist) broke on npmjs.com. No source code changes — package metadata only.

## v2.0.0 — 2026-05-09

### Breaking changes

**BC-1 — Event handler signatures changed (`CustomEvent` → `TsEventPayload`)**

All `on*` event handler properties across `TsGrid`, `TsForm`, and `TsField` now declare
`(event: TsEventPayload) => void` instead of `(event: CustomEvent) => void`.

This is a type-level correction: the runtime has always dispatched `TsEventPayload` objects,
never DOM `CustomEvent` instances. Consumers who explicitly annotated handlers with
`CustomEvent` will see a TypeScript compile error. Untyped or `any`-typed handlers are
unaffected. Mechanical migration via codemod — see [MIGRATION_v2.md § Codemod](MIGRATION_v2.md#codemod).

**BC-2 — Internal restructure; deep imports are unsupported**

`src/tsgrid.ts` has been decomposed from ~10,006 LOC into 8 sibling modules:
`grid-columns`, `grid-state`, `grid-data`, `grid-selection`, `grid-edit`, `grid-search`,
`grid-interaction`, `grid-render`. The public class `TsGrid` is now ~2,392 LOC (thin
orchestrator of one-liner delegators).

The public API surface is **UNCHANGED**: all method signatures, names, and behaviors are
preserved (verified by 84 Vitest + 38 Playwright tests). Consumers who import from the
public barrel (`import { TsGrid } from 'tsgrid-ui'`) require **no changes**. Subclasses
or code that inspects `TsGrid.prototype` directly may observe method bodies as one-line
delegators — this is expected behavior. Deep imports from internal paths
(`tsgrid-ui/src/*`) are not supported and may break.

### Bundle size disclosure

v2.0 is a structural refactor with no bundle reduction goal. Bundle size delta vs v1.0.1
baseline: **-0.19%** (actual: 941,597 bytes vs baseline: 943,401 bytes). No reduction is
claimed. Bundle improvements are deferred to v2.2 (multi-entry subpath exports +
tree-shaking). See [MIGRATION_v2.md § Bundle size measurement](MIGRATION_v2.md#bundle-size-measurement).

### Migration

See [MIGRATION_v2.md](MIGRATION_v2.md) for the codemod, full migration guide, and
release checklist.

---

## Pre-v2.0.0 history

Entries for **v1.0.1**, **v1.0.0**, and the **pre-fork w2ui v2.x** chain have
been moved to [CHANGELOG-archive.md](https://github.com/DaverSoGT/tsgrid-ui/blob/master/CHANGELOG-archive.md)
to keep this file focused on the v2.x series shipped to npm. The archive lives
in the repository but is not included in the published tarball.
