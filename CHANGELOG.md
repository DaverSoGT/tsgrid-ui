# Changelog

All notable changes to **TsGrid UI** will be documented in this file.

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

## [1.0.1] — Consumer DX fixes

Patch release driven by integrating tsgrid-ui v1.0.0 in a real Angular 21 standalone project. Three changes, no breaking, no API removals.

### Added — `sideEffects` declaration

`package.json` now declares `"sideEffects": ["./dist/tsgrid-ui.css", "./dist/tsgrid-ui.min.css"]`. Modern bundlers (esbuild, Vite, webpack 5+, Rollup) can now tree-shake widgets the consumer does not import. Importing only `TsGrid` no longer drags `TsForm`, `TsLayout`, `TsSidebar`, `TsTabs`, `TsPopup`, `TsTooltip` into the final bundle.

### Added — public type exports

The barrel `src/index.ts` previously re-exported only the **classes** (`TsGrid`, `TsForm`, etc.). Auxiliary interfaces and types lived in `dist/tsgrid-ui.d.ts` but were inaccessible — consumers had to type their inputs as `any` or import from internal paths. v1.0.1 re-exports the full public type surface:

- **TsGrid**: `TsGridRecord`, `TsGridColumn`, `TsGridSearch`, `TsGridSortData`, `TsGridSelection`, `TsGridCellSelection`, `TsGridRange`, `TsGridRangeEndpoint`, `TsGridGroupBy`
- **TsField**: `TsFieldOptions`, `TsFieldElement`, `TsFieldNumericOptions`, `TsFieldColorOptions`, `TsFieldDateOptions`, `TsFieldTimeOptions`, `TsFieldDateTimeOptions`, `TsFieldListOptions`, `TsFieldEnumOptions`, `TsFieldFileOptions`
- **TsLayout**: `TsLayoutPanel`, `TsPanelType`, `TsPanelContent`
- **TsSidebar**: `TsSidebarRefreshOptions`, `TsSidebarUpdateOptions`, `TsSidebarSetCountOptions`, `TsSidebarFindOptions`, `TsSidebarSortOptions`
- **TsLocale / TsUtils**: `TsLocaleSettings`, `TsMessageProm`, `TsMessageWhere`, `TsMessageOptions`, `TsMenuItem`, `TsColorRgb`, `TsLockOptions`, `TsCloneOptions`
- **Common**: `RecId`, `TsEventData`, `TsEventPayload`

Consumers can now write `import type { TsGridColumn, TsGridRecord } from 'tsgrid-ui'` and get full autocomplete + type checking.

### Added — `TsEventPayload` interface and `toSafeEvent()` helper

The per-class event-handler signatures (`onSelect: (event: CustomEvent) => void`) are misleading: the runtime always passes a `TsEvent` instance from the TsBase event system, **not** a DOM `CustomEvent`. The real payload contains a circular reference (`event.owner` ↔ `widget.activeEvents[]`), so calling `JSON.stringify(event)` throws "Converting circular structure to JSON". This breaks reactive state in any framework: Angular signals + JsonPipe, React state + Redux DevTools, Vue ref + Pinia, etc.

This release adds:

- **`interface TsEventPayload<TDetail>`** — accurate shape of the object passed to handlers, with the `owner` field documented as circular and unsafe to serialize. The misleading `(event: CustomEvent) => void` per-class declarations remain for backwards compatibility and will be corrected in v2.0.
- **`function toSafeEvent(event)`** — extracts a JSON-serializable subset (`type`, `phase`, `detail`, `isStopped`, `isCancelled`) for use in reactive state.

```ts
import { toSafeEvent } from 'tsgrid-ui'

grid.on('select', (event) => {
    mySignal.set(toSafeEvent(event)) // safe to JSON.stringify
})
```

### Bundle-size impact (measured)

Bundle in a fresh Angular 21 standalone project consuming only `TsGrid`:

| | v1.0.0 | v1.0.1 |
| --- | --- | --- |
| `main.js` raw | 506.18 KB | _re-measure pending_ |
| `main.js` gzip | 121.90 KB | _re-measure pending_ |

Re-measurement after publish lives in the `tsgrid-angular-example` demo repo.

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
