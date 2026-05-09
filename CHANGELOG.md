# Changelog

## [2.1.0] — TypeScript Native Port

### Added

- **TypeScript type declarations**: every public export now ships with types via `dist/w2ui.d.ts` (83 KB rollup, 23 named exports). Consumers can `import { w2grid, type W2GridColumn } from 'w2ui'` and get full editor support.
- **Branded primitive types** (`src/types.ts`): `RecId`, `LayoutPanelId`, `FieldName`. Compile-time only, zero runtime cost.
- **Seven new w2grid interfaces**: `W2GridColumn`, `W2GridSearch`, `W2GridSelection`, `W2GridCellSelection`, `W2GridRangeEndpoint`, `W2GridRange`, `W2GridSearchFilter`.
- **`W2MessageProm` interface** exported from `w2utils` for `message()` / `confirm()` / `prompt()` chain handles.
- **Playwright smoke harness** (`test/smoke/`): 38 tests across grid, form, layout, sidebar, popup, tooltip widgets at three viewport sizes. Runs via `pnpm smoke`.
- **Consumer smoke typecheck** (`test/consumer-smoke.ts`): independent compile-time validation that all 11 public class imports work as a library consumer.
- **Strict mode** active across the entire codebase: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `allowJs: false`.
- **`w2grid.getSelectionRows()` and `w2grid.getSelectionCells()`**: discriminated typed methods that replace the `any[]` return of the legacy `getSelection()`. Exported `W2GridCellSelection` interface (`{ recid, index, column }`). The legacy `getSelection(returnIndex?)` is preserved as a back-compat wrapper that returns `RecId[] | number[] | W2GridCellSelection[]` (no longer `any[]`). Prefer the split methods when the caller knows the selection mode statically.

### Changed

- **Source migrated from JavaScript to TypeScript**: all 14 widget modules (`w2base`, `w2locale`, `w2utils`, `query`, `w2tooltip`, `w2popup`, `w2tabs`, `w2toolbar`, `w2sidebar`, `w2layout`, `w2field`, `w2form`, `w2grid`, `w2compat`) plus 2 entry barrels and 1 types module — 17 `.ts` files total, zero `.js` in `src/`.
- **Build pipeline**: Gulp's regex-based concat + import/export stripping replaced by **tsup** (esbuild + dual ESM/CJS + `.d.ts` rollup). Gulp continues to handle Less compilation and iconfont generation. `pnpm build` is the new entry point (replaces `npx gulp`).
- **ESLint config**: per-extension overrides — `align-assignments` retained for `.js` files (no TS-equivalent plugin exists), `@typescript-eslint/recommended` active for `.ts` files. `dot-notation` disabled on `.ts` (bracket access on dynamic types is intentional).
- **`prepareParams()` in w2utils**: `dataType` parameter handling restructured to a `switch(dataType)` statement (was an if/else chain). Custom function `dataType` values now correctly execute (see Fixed below).
- **`w2utils.locale()` return type**: now resolves to `Promise<{ file, data } | void>` (previously `Promise<void>`). Callers that `await locale(...)` can read the loaded file path and parsed payload directly without a second fetch. Backward-compatible — code that ignored the resolved value still works.
- **`w2form` delegated-event registration**: input/textarea handlers in `w2form` now use jQuery-style delegated-event objects (`{ delegate: 'input, textarea' }`) instead of raw selector strings. Behavior is unchanged; the new shape plays nicely with strict typings and modern delegation libraries.
- **Package manager**: standardized on **pnpm** (lockfile is `pnpm-lock.yaml`). Compound scripts (`build`, `test`, `verify`) use `pnpm`; top-level scripts unchanged.
- **`package.json` exports**: dual-package conditional exports map (`types` / `import` / `require`) so both ESM and CJS consumers resolve the right artifact.

### Fixed

- **`'fuction'` typo in `w2utils.prepareParams()`**: previously `typeof dataType == 'fuction'` (typo), so a custom function `dataType` was silently ignored. Now correctly spelled `'function'`; custom function `dataType` executes as the original `// do nothing, it is custom function that will handle everything` comment intended.
- **`??` always-left in `w2form.js:1317` save error handler**: `data.message ?? response.statusText` would never trigger because `response.status + ': ' + data.message` is always a string. Replaced with `data.message || response.statusText` so empty-string server messages fall back to the status text.
- **`??` always-left in `w2grid.js:3061` save error handler**: same pattern as `w2form`, same fix.
- **Type mismatch in w2grid line-number column fallback**: `{ field: col_ind }` (number) → `{ field: String(col_ind) }`. The `columnClick(field: string, ...)` signature now receives the correct type.
- **`w2sidebar.ts` `getNodeHTML()`** referenced `window.self` instead of the local `obj` parameter — fixed during the TypeScript port (was previously dead code in the bundle because `w2sidebar.js` continued to ship until T3.5-fix removed it).

### Internal

- **53 commits across 6 phases** (Phase 0 smoke harness baseline → Phase 1 bundler swap → Phase 2 leaves + cycle → Phase 3 UI primitives → Phase 4 form/field → Phase 5 w2grid sub-chain → Phase 6 strict tighten + branded types + barrels + .d.ts rollup).
- **Aggressive typing policy** enforced: zero `@ts-nocheck` directives across all source files. Targeted `any` (633 sites) is allowed only with explicit `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + adjacent `// any: <reason>` comment documenting the runtime constraint that prevents proper typing.
- **Bundle output**: `dist/w2ui.js` (913 KB IIFE-wrapped CJS, AMD-compatible), `dist/w2ui.es6.js` (907 KB pure ESM), `dist/w2ui.d.ts` (83 KB type declarations). Bundle sizes are ~22% smaller than the original Gulp baseline due to esbuild's tree-shaking.
- **Cycle resolution**: `w2base ↔ w2utils` (mutual import) ported via stub-then-fill: 3 commits (stub `any`s in w2base → port w2utils → fill stubs with real types from w2utils).
