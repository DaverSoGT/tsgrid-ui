# Changelog

All notable changes to **TsGrid UI** will be documented in this file.

## [1.0.0] — Hard Fork from w2ui v2.1

This is the initial public release of **TsGrid UI**, a hard fork of [w2ui](https://github.com/vitmalina/w2ui) by Vit Malina. See [README — Acknowledgments](README.md#acknowledgments) for the relationship to upstream and [MIGRATION-FROM-W2UI.md](MIGRATION-FROM-W2UI.md) for the complete renaming map if you're coming from w2ui.

### Identity changes (vs upstream w2ui v2.x)

- **Package name**: `w2ui` → `tsgrid-ui` (npm public registry).
- **Version reset**: starts at 1.0.0 (this is project v1; upstream w2ui continues independently).
- **JS globals renamed**: `w2grid` → `TsGrid`, `w2form` → `TsForm`, `w2field` → `TsField`, `w2layout` → `TsLayout`, `w2sidebar` → `TsSidebar`, `w2tabs` → `TsTabs`, `w2toolbar` → `TsToolbar`, `w2tooltip` → `TsTooltip`, `w2popup` → `TsPopup`. Helpers: `w2alert`/`w2confirm`/`w2prompt`/`w2color`/`w2date`/`w2menu`/`Dialog`/`w2utils`/`w2base`/`w2event`/`w2locale` → `TsAlert`/`TsConfirm`/`TsPrompt`/`TsColor`/`TsDate`/`TsMenu`/`TsDialog`/`TsUtils`/`TsBase`/`TsEvent`/`TsLocale`. Registry `w2ui` → `TsUi`. `query` and `Tooltip` (class name) kept unchanged.
- **TypeScript types renamed**: all `W2*Foo` types → `TsFoo` (e.g. `W2GridColumn` → `TsGridColumn`, `W2GridCellSelection` → `TsGridCellSelection`). Brand types `RecId`, `LayoutPanelId`, `FieldName` are kept (semantic, not library-tied).
- **CSS class prefix**: `.w2ui-*` → `.tsg-*` (~1500 reemplazos across source and stylesheets).
- **iconfont**: family name `w2ui-font` → `tsgrid-font`; classes `w2ui-icon-*` → `tsg-icon-*`.
- **dist filenames**: `dist/w2ui.{js,es6.js,d.ts,css}` → `dist/tsgrid-ui.{js,es6.js,d.ts,css}` (and minified variants).
- **jQuery compatibility shim removed**: `w2compat.ts` was deleted. TsGrid is ESM-native and does not register `$.fn.w2grid` etc. If you need jQuery support, use upstream w2ui.
- **Repo cleanup**: `demos/`, `server/`, `baseline/`, `es6mods/`, `libs/` moved to `legacy/` (excluded from npm publish).
- **License**: dual copyright — preserves `(c) 2014 Vit Malina` per MIT terms, adds `(c) 2026 DaverSoGT` for the fork.

### Inherited from the w2ui v2.1 TypeScript port (pre-fork)

These changes were applied to the local v2.1 baseline before the fork; they are preserved verbatim in TsGrid v1.0:

- **Full TypeScript-native source**: 17 `.ts` files (14 widgets + 2 barrels + 1 types), zero `.js` in `src/`.
- **Strict mode**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`. Zero `@ts-nocheck`.
- **Bundler**: tsup (esbuild) for JS — dual ESM + CJS + `.d.ts` rollup. Gulp retains Less + iconfont.
- **`.d.ts` rollup**: single file with all public exports.
- **Branded primitive types**: `RecId`, `LayoutPanelId`, `FieldName` (compile-only, zero runtime cost).
- **Discriminated `getSelection`**: `TsGrid.getSelectionRows()` + `TsGrid.getSelectionCells()` typed methods plus a back-compat wrapper that returns `RecId[] | number[] | TsGridCellSelection[]` (no longer `any[]`).
- **Vitest unit test suite**: 84 tests across `TsUtils` helpers, `TsBase` event system, and `types` brands.
- **Playwright smoke harness**: 38 tests across all widgets at three viewport sizes.
- **Consumer-smoke gate**: independent `tsc --noEmit` of the public API surface as a consumer would import it.
- **Bug fixes uncovered during the TS port**:
  - `'fuction'` typo in `prepareParams()` (silently ignored custom-function `dataType`).
  - Two `??` always-left branches in `w2form` and `w2grid` save error handlers.
  - Type mismatch in `w2grid` line-number column fallback (`{ field: col_ind }` number → string).
  - `w2sidebar.getNodeHTML()` referenced `window.self` instead of the local instance.
- **Behavioral notes preserved**:
  - `TsForm` input/textarea handlers use delegated-event objects (`{ delegate: 'input, textarea' }`).
  - `TsUtils.locale()` returns `Promise<{ file, data } | void>`.

---

## Pre-fork history (w2ui v2.x)

The pre-fork local commit chain (53 ts-port commits + 16 follow-up commits leading up to v2.1 final) is preserved in git history under the same `master` branch. See git log between the initial port commit and the F1 sealing commit (`d90c038e`) for detail.

For upstream w2ui releases (v1.x stable, v2.0 RC), refer to [vitmalina/w2ui releases](https://github.com/vitmalina/w2ui/releases).
