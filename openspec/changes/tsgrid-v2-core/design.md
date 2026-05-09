# Design: tsgrid-v2-core

Status: ready
Phase inputs: proposal #744, exploration #742, init #722
Strategy: D — Hybrid sibling files (per proposal §6, recommendation §6 of explore)
Author: sdd-design
Date: 2026-05-09

---

## 1. Final File Layout

**Decision: 8 files, NOT 9.** `grid-html.ts` is MERGED into `grid-render.ts`.

### Evidence (R4 resolution)

The exploration tentatively listed `grid-html.ts` as a separate file. Reading `src/tsgrid.ts` showed three structural facts that defeat clean separation:

1. **Render orchestration calls HTML generators directly inside its own bodies.**
   - `tsgrid.ts:5863` — `update()` calls `self.getCellHTML(index, column, false)` mid-loop, replacing nodes in place.
   - `tsgrid.ts:6055` — `refresh()` injects `this.getFooterHTML()` into the DOM.
   - `tsgrid.ts:8810`, `8817`, `8826`, `8850`, `8862–8864` — `scroll()` (the largest method, ~270 LOC) interleaves `getColumnCellHTML(i)`, `getCellHTML(...)`, `getColumnsHTML()`, `getRecordsHTML()`, `getSummaryHTML()` with `resizeRecords()` in the same critical-path branches.

2. **HTML generators call render helpers in return.**
   - `tsgrid.ts:8060–8061` — the tail of `refreshBody()` (which is "render") immediately calls `this.initResize()` and `this.refreshRanges()`, then control flows directly into `getSearchesHTML()` declared at line 8072 — these are interleaved sections, not a clean cluster boundary. The exploration's "render ends ~7065" / "html starts ~8072" partition is misleading; the real boundary in source is the `refreshBody()` body itself, which mixes both concerns.

3. **`scroll()` is structurally placed in the HTML region but is a virtual-scroll renderer.** Splitting it would require either (a) moving `scroll()` into `grid-render.ts` while leaving the HTML helpers it calls in `grid-html.ts` — creating a render→html dependency that is fine in isolation, BUT
4. **Splitting forces every render entry-point to import grid-html, while grid-html consumes nothing from grid-render.** The "split" would yield `grid-render.ts` with N imports from `grid-html.ts` and zero imports the other way. That is just a code-org noise file with no abstraction win — it adds an import line to every render function and nothing else.

**Conclusion**: keep one `grid-render.ts` (~2,820 LOC) that owns BOTH render orchestration (resize/refresh/refreshBody/refreshSearch/refreshCell/refreshRow/update/scroll/destroy/initToolbar/initResize/resizeBoxes/resizeRecords/initColumnOnOff/initColumnDrag/columnOnOff) AND HTML generation (getColumnsHTML/getColumnCellHTML/getRecordsHTML/getSummaryHTML/getRecordHTML/getLineHTML/getCellHTML/getCellEditable/getCellValue/getFooterHTML/getSearchesHTML/getOperators/initOperator/initSearchLists/initSearches/columnTooltipShow/columnTooltipHide/clipboardCopy/showBubble).

### Final 8-file layout

| File | Est. LOC | Domain |
|---|---|---|
| `src/grid-columns.ts` | ~235 | Column add/remove/get/update/toggle/show/hide |
| `src/grid-state.ts` | ~390 | stateSave, stateRestore, stateReset, lock, unlock, status, parseField, prepareData, nextCell, prevCell, nextRow, prevRow, selectionSave, selectionRestore, message, confirm |
| `src/grid-data.ts` | ~910 | add/find/set/replace/get/getFirst/remove/processGroupBy + clear/reset/skip/load/reload/request/requestComplete/error/getChanges/mergeChanges/save + **localSort/localSearch** + getRangeData/addRange/removeRange/refreshRanges |
| `src/grid-selection.ts` | ~490 | select, unselect, compareSelection, selectAll, selectNone, updateToolbar, getSelectionRows, getSelectionCells, getSelection |
| `src/grid-edit.ts` | ~505 | editField, editChange, editDone |
| `src/grid-search.ts` | ~1,300 | addSearch/removeSearch/getSearch/toggleSearch/showSearch/hideSearch + getSearchData + search/searchOpen/searchClose/searchFieldTooltip/searchSuggest/searchSave/cache/cacheSave/searchReset/searchShowFields/searchInitInput |
| `src/grid-interaction.ts` | ~1,380 | click, columnClick, columnDblClick, columnContextMenu, columnAutoSize, columnAutoSizeAll, focus, blur, keydown, scrollIntoView, scrollToColumn, dblClick, showContextMenu, contextMenuClick, toggle, expand, collapse, updateExpanded, sort, copy, getCellCopy, paste |
| `src/grid-render.ts` | ~2,820 | resize/update/refreshCell/refreshRow/refresh/refreshSearch/refreshBody/destroy/unmount + initToolbar/initResize/resizeBoxes/resizeRecords/initColumnOnOff/initColumnDrag/columnOnOff + ALL HTML generators (getColumnsHTML/getColumnCellHTML/getRecordsHTML/getSummaryHTML/scroll/getRecordHTML/getLineHTML/getCellHTML/getCellEditable/getCellValue/getFooterHTML/getSearchesHTML/getOperators/initOperator/initSearchLists/initSearches/columnTooltipShow/columnTooltipHide/clipboardCopy/showBubble) |

Total: ~8,030 LOC across 8 sibling files (matches proposal estimates within rounding; the 9-file split's `grid-html.ts` ~1,530 LOC is folded into `grid-render.ts`).

---

## 2. Module Specifications

### 2.1 `src/grid-columns.ts`

**Imports**
```ts
import type { TsGrid } from './tsgrid'
import type { TsGridColumn } from './tsgrid'
import { TsUtils } from './tsutils'
```

**Exported function signatures** (all consumed by `tsgrid.ts` thin delegators)
```ts
export function addColumn(grid: TsGrid, before: number | string | TsGridColumn | TsGridColumn[], columns?: TsGridColumn | TsGridColumn[]): number
export function removeColumn(grid: TsGrid, ...fields: string[]): number
export function getColumn(grid: TsGrid, field: string, returnIndex?: boolean): TsGridColumn | number | null
export function updateColumn(grid: TsGrid, fields: string | string[], properties: Partial<TsGridColumn>): number
export function toggleColumn(grid: TsGrid, ...fields: string[]): number
export function showColumn(grid: TsGrid, ...fields: string[]): number
export function hideColumn(grid: TsGrid, ...fields: string[]): number
```

**Internal helpers**: none expected (current methods are flat).

**Imports of other grid-*.ts**: none. Lowest-coupling file.

### 2.2 `src/grid-state.ts`

**Imports**
```ts
import type { TsGrid } from './tsgrid'
import { TsUtils } from './tsutils'
import { TsLocale } from './tslocale'
```

**Exported function signatures**
```ts
export function status(grid: TsGrid, msg?: string): void
export function lock(grid: TsGrid, msg: string, options?: any): void          // any: TsUtils.lock options bag
export function unlock(grid: TsGrid, speed?: number): void
export function stateSave(grid: TsGrid, returnOnly?: boolean): any            // any: state blob shape varies
export function stateRestore(grid: TsGrid, state?: any): boolean              // any: state blob input
export function stateReset(grid: TsGrid): boolean
export function parseField(grid: TsGrid, obj: any, field: string): any        // any: nested-field accessor
export function prepareData(grid: TsGrid): void
export function nextCell(grid: TsGrid, index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null
export function prevCell(grid: TsGrid, index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null
export function nextRow(grid: TsGrid, index: number, col_ind?: number): number | null
export function prevRow(grid: TsGrid, index: number, col_ind?: number): number | null
export function selectionSave(grid: TsGrid): any                              // any: selection snapshot
export function selectionRestore(grid: TsGrid, noRefresh?: boolean): boolean
export function message(grid: TsGrid, options: any): Promise<any> | undefined // any: TsMessageOptions
export function confirm(grid: TsGrid, options: any): Promise<any> | undefined
```

**Imports of other grid-*.ts**: none. State helpers are leaves (called by data, search, interaction, render).

### 2.3 `src/grid-data.ts`

**Imports**
```ts
import type { TsGrid, TsGridRecord, TsGridRange, TsGridRangeEndpoint, TsGridGroupBy } from './tsgrid'
import { TsUtils } from './tsutils'
import { query } from './query'
import * as gridState from './grid-state'   // selectionSave/selectionRestore/prepareData
```

**Exported function signatures**
```ts
// CRUD
export function add(grid: TsGrid, record: TsGridRecord | TsGridRecord[], first?: boolean): number
export function find(grid: TsGrid, obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[]
export function set(grid: TsGrid, recid: any, record?: any, noRefresh?: boolean): boolean
export function replace(grid: TsGrid, recid: string | number, record: TsGridRecord, noRefresh?: boolean): boolean
export function get(grid: TsGrid, recid: any, returnIndex?: boolean): TsGridRecord | (TsGridRecord | number)[] | number | null
export function getFirst(grid: TsGrid, offset?: number): TsGridRecord | null
export function remove(grid: TsGrid, ...recids: (string | number)[]): number
export function processGroupBy(grid: TsGrid): void

// Local sort/search (placed here per proposal §6 Q5, see §4 boundaries below)
export function localSort(grid: TsGrid, silent?: boolean, noResetRefresh?: boolean): number
export function localSearch(grid: TsGrid, silent?: boolean): number

// Ranges
export function getRangeData(grid: TsGrid, range: [TsGridRangeEndpoint, TsGridRangeEndpoint], extra?: boolean): any[]
export function addRange(grid: TsGrid, rangesInput: TsGridRange | TsGridRange[] | string | Record<string, any>): number
export function removeRange(grid: TsGrid, ...names: string[]): number
export function refreshRanges(grid: TsGrid): boolean

// I/O
export function clear(grid: TsGrid, noRefresh?: boolean): void
export function reset(grid: TsGrid, noRefresh?: boolean): void
export function skip(grid: TsGrid, offset: any, callBack?: any): void
export function load(grid: TsGrid, url: any, callBack?: any): Promise<any>
export function reload(grid: TsGrid, callBack?: (...args: any[]) => void): Promise<any>
export function request(grid: TsGrid, action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any>
export function requestComplete(grid: TsGrid, data: any, action: any, callBack: any, resolve: any, reject: any): void
export function error(grid: TsGrid, msg: any): void
export function getChanges(grid: TsGrid, recordsBase?: TsGridRecord[]): Record<string, any>[]
export function mergeChanges(grid: TsGrid): void
export function save(grid: TsGrid, callBack?: (data: any) => void): Promise<any>
```

**Imports of other grid-*.ts**: only `grid-state` (for `selectionSave`, `selectionRestore`, `prepareData`).

### 2.4 `src/grid-selection.ts`

**Imports**
```ts
import type { TsGrid, TsGridSelection, TsGridCellSelection } from './tsgrid'
import { TsUtils } from './tsutils'
import { query } from './query'
import * as gridData from './grid-data'   // addRange, refreshRanges
```

**Exported function signatures**
```ts
export function select(grid: TsGrid, ...recids: any[]): number
export function unselect(grid: TsGrid, ...recids: any[]): number
export function compareSelection(grid: TsGrid, sel: TsGridSelection): boolean
export function selectAll(grid: TsGrid): number
export function selectNone(grid: TsGrid, skipUpdate?: boolean): number
export function updateToolbar(grid: TsGrid, sel: TsGridSelection): void
export function getSelectionRows(grid: TsGrid): HTMLElement[]
export function getSelectionCells(grid: TsGrid): TsGridCellSelection[]
export function getSelection(grid: TsGrid, returnIndex?: boolean): any[]
```

**Imports of other grid-*.ts**: `grid-data` (for `addRange`, `refreshRanges`).

### 2.5 `src/grid-edit.ts`

**Imports**
```ts
import type { TsGrid } from './tsgrid'
import { TsUtils } from './tsutils'
import { query } from './query'
import * as gridState from './grid-state'   // nextCell, prevCell, nextRow, prevRow
```

**Exported function signatures**
```ts
export function editField(grid: TsGrid, recid: string | number, column: number, value?: any, event?: any): void
export function editChange(grid: TsGrid, el: HTMLElement, index: number, column: number, event?: any): boolean | undefined
export function editDone(grid: TsGrid, ind?: number, col?: number, event?: any): void
```

Note: `delete` lives here (proposal exploration cites ~line 4330 in the editing cluster).

**Imports of other grid-*.ts**: `grid-state` (for `nextCell`/`prevCell`/`nextRow`/`prevRow`).

### 2.6 `src/grid-search.ts`

**Imports**
```ts
import type { TsGrid, TsGridSearch } from './tsgrid'
import { TsUtils } from './tsutils'
import { query } from './query'
```

**Exported function signatures**
```ts
export function addSearch(grid: TsGrid, before: any, searches?: any): number
export function removeSearch(grid: TsGrid, ...fields: string[]): number
export function getSearch(grid: TsGrid, field: string, returnIndex?: boolean): TsGridSearch | number | null
export function toggleSearch(grid: TsGrid, ...fields: string[]): number
export function showSearch(grid: TsGrid, ...fields: string[]): number
export function hideSearch(grid: TsGrid, ...fields: string[]): number
export function getSearchData(grid: TsGrid): any[]
export function search(grid: TsGrid, field?: any, value?: any): void
export function searchOpen(grid: TsGrid): void
export function searchClose(grid: TsGrid): void
export function searchFieldTooltip(grid: TsGrid, ind: number, sd_ind: number, el: HTMLElement): void
export function searchSuggest(grid: TsGrid, search?: any, hideOnBlur?: boolean): void
export function searchSave(grid: TsGrid): void
export function cache(grid: TsGrid, type: string): any
export function cacheSave(grid: TsGrid, type: string, value: any): void
export function searchReset(grid: TsGrid, noRefresh?: boolean): void
export function searchShowFields(grid: TsGrid): void
export function searchInitInput(grid: TsGrid, field: string, value?: any): void
```

**Imports of other grid-*.ts**: none directly. Search calls `grid.localSort(...)` / `grid.localSearch(...)` THROUGH the TsGrid orchestrator — i.e., `grid.localSearch()` resolves via the thin delegator on TsGrid, which in turn calls `gridData.localSearch(grid, ...)`. This breaks the cycle without forcing `grid-search.ts` to import `grid-data.ts` directly. (See §4.)

### 2.7 `src/grid-interaction.ts`

**Imports**
```ts
import type { TsGrid } from './tsgrid'
import { TsUtils } from './tsutils'
import { query } from './query'
import { TsTooltip, TsMenu } from './tspopup'    // contextMenu rendering
```

**Exported function signatures**
```ts
export function click(grid: TsGrid, recid: any, event?: any): void
export function columnClick(grid: TsGrid, field: string, event?: any): void
export function columnDblClick(grid: TsGrid, field: string, event?: any): void
export function columnContextMenu(grid: TsGrid, field: string, event?: any): void
export function columnAutoSize(grid: TsGrid, field: string): number
export function columnAutoSizeAll(grid: TsGrid): number
export function focus(grid: TsGrid, event?: any): void
export function blur(grid: TsGrid, event?: any): void
export function keydown(grid: TsGrid, event: KeyboardEvent | any): void
export function scrollIntoView(grid: TsGrid, ind?: number, column?: number, instant?: boolean, recTop?: number): void
export function scrollToColumn(grid: TsGrid, field: string): void
export function dblClick(grid: TsGrid, recid: any, event?: any): void
export function showContextMenu(grid: TsGrid, recid: any, column: number, event?: any): void
export function contextMenuClick(grid: TsGrid, recid: any, column: number, event?: any): void
export function toggle(grid: TsGrid, recid: any): boolean
export function expand(grid: TsGrid, recid: any): boolean
export function collapse(grid: TsGrid, recid: any): boolean
export function updateExpanded(grid: TsGrid): void
export function sort(grid: TsGrid, field?: string, direction?: string, multiField?: boolean): void
export function copy(grid: TsGrid, flag?: any, oEvent?: any): string | undefined
export function getCellCopy(grid: TsGrid, ind: number, col_ind: number): string
export function paste(grid: TsGrid, text: string, event?: any): void
```

**Imports of other grid-*.ts**: none directly. Calls into other domains go through `grid.X(...)` (the thin delegator on TsGrid). Heavy interaction → render coupling exists at runtime, but at the TYPE level it's mediated by `TsGrid` itself. This avoids `interaction → render → interaction` import cycles.

### 2.8 `src/grid-render.ts`

**Imports**
```ts
import type { TsGrid, TsGridRecord, TsGridSearch } from './tsgrid'
import { TsUtils } from './tsutils'
import { TsLocale } from './tslocale'
import { query } from './query'
import { TsTooltip } from './tspopup'
import { TsToolbar } from './tstoolbar'
import * as gridData from './grid-data'         // refreshRanges, getRangeData (used inside scroll/refreshBody)
import * as gridSelection from './grid-selection' // updateToolbar (called in refresh)
```

**Exported function signatures**

Render orchestration:
```ts
export function resize(grid: TsGrid): number
export function update(grid: TsGrid, opts?: { cells?: any[]; fullCellRefresh?: boolean; ignoreColumns?: any[] }): number
export function refreshCell(grid: TsGrid, recid: any, field: any): boolean
export function refreshRow(grid: TsGrid, recid: any, ind?: any): boolean
export function refresh(grid: TsGrid): number
export function refreshSearch(grid: TsGrid): void
export function refreshBody(grid: TsGrid): void
export function destroy(grid: TsGrid): void
export function unmount(grid: TsGrid): void
export function initColumnOnOff(grid: TsGrid): any[]
export function initColumnDrag(grid: TsGrid, _box?: any): false | { remove(): void }
export function columnOnOff(grid: TsGrid, event: MouseEvent | any, field: string): void
export function initToolbar(grid: TsGrid): void
export function initResize(grid: TsGrid): void
export function resizeBoxes(grid: TsGrid): void
export function resizeRecords(grid: TsGrid): void
export function scroll(grid: TsGrid, event?: Event | any): void
```

HTML generators (formerly the `grid-html.ts` candidate — folded in here):
```ts
export function getColumnsHTML(grid: TsGrid): [string, string]
export function getColumnCellHTML(grid: TsGrid, i: any): string
export function getRecordsHTML(grid: TsGrid): [string, string]
export function getSummaryHTML(grid: TsGrid): [string, string] | null
export function getRecordHTML(grid: TsGrid, ind: number, lineNum: number, summary?: boolean): [string, string]
export function getLineHTML(grid: TsGrid, lineNum: number): string
export function getCellHTML(grid: TsGrid, ind: number, col_ind: number, summary?: boolean, col_span?: number): string
export function getCellEditable(grid: TsGrid, ind: number, col_ind: number): any
export function getCellValue(grid: TsGrid, ind: number, col_ind: number, summary?: boolean, extra?: boolean): any
export function getFooterHTML(grid: TsGrid): string
export function getSearchesHTML(grid: TsGrid): string
export function getOperators(grid: TsGrid, type: string, fOperators: any[]): string
export function initOperator(grid: TsGrid, ind: number): void
export function initSearchLists(grid: TsGrid): void
export function initSearches(grid: TsGrid): void
export function columnTooltipShow(grid: TsGrid, ind: number, event: any): void
export function columnTooltipHide(grid: TsGrid, ind: number, event?: any): void
export function clipboardCopy(grid: TsGrid, ind: number, col_ind: number, _btn?: HTMLElement | null): void
export function showBubble(grid: TsGrid, ind: number, col_ind: number, summary?: boolean): boolean
```

**Imports of other grid-*.ts**: `grid-data` (refreshRanges, getRangeData), `grid-selection` (updateToolbar). One-way fan-in from data + selection; no inverse imports.

---

## 3. tsgrid.ts Post-Extraction

The post-extraction `tsgrid.ts` is a **thin orchestrator** that owns:

- All class fields (props + state — `columns`, `records`, `last`, `searches`, `searchData`, `sortData`, etc.)
- The TsGridLast / TsGridSearchFilter / TsGridGroupBy interfaces (move with class)
- The 45 `on*` event handler declarations (lines 395–445), now retyped to `TsEventPayload`
- The `constructor`
- `init()` and `render()` lifecycle methods (still custom on TsGrid; not extracted)
- All public methods as **thin delegators** to sibling-file functions:

```ts
import * as gridColumns    from './grid-columns'
import * as gridState      from './grid-state'
import * as gridData       from './grid-data'
import * as gridSelection  from './grid-selection'
import * as gridEdit       from './grid-edit'
import * as gridSearch     from './grid-search'
import * as gridInteraction from './grid-interaction'
import * as gridRender     from './grid-render'
import type { TsEventPayload } from './tsbase'

class TsGrid extends TsBase {
    // ... all fields unchanged ...

    onAdd: ((event: TsEventPayload) => void) | null    // BC-1 fix (was CustomEvent)
    onEdit: ((event: TsEventPayload) => void) | null
    // ... 43 more ...

    constructor(options: Record<string, any>) { /* unchanged */ }

    // Delegators
    add(record: TsGridRecord | TsGridRecord[], first?: boolean): number {
        return gridData.add(this, record, first)
    }
    addColumn(before: any, columns?: any): number {
        return gridColumns.addColumn(this, before, columns)
    }
    refresh(): number { return gridRender.refresh(this) }
    select(...recids: any[]): number { return gridSelection.select(this, ...recids) }
    localSearch(silent?: boolean): number { return gridData.localSearch(this, silent) }
    localSort(silent?: boolean, noResetRefresh?: boolean): number {
        return gridData.localSort(this, silent, noResetRefresh)
    }
    // ... 90 more delegators ...
}
```

**Estimated final LOC for `tsgrid.ts` (post-extraction): ~1,500–1,700 LOC.**

Breakdown of what stays in `tsgrid.ts`:
- License header + TODO + 2.0 changes comment block: ~150 LOC
- Imports + type imports: ~30 LOC
- `interface TsGridLast` and other internal interfaces: ~100 LOC (lines 199–295 today; some may move with their domain — see §5)
- Class field declarations (props, state, on* handlers, defaults): ~600 LOC (lines 297–471 + initializer at 472–800)
- Constructor body with all default initializers: ~350 LOC (lines 472–800 today)
- ~95 thin delegator methods (~3 LOC each): ~285 LOC
- `init()` / `render()` / any small lifecycle method that stays: ~50 LOC

This satisfies the proposal success criterion `tsgrid.ts < 2k LOC`.

---

## 4. Inter-Module Boundaries

### 4.1 Allowed import graph (one-way only)

```
grid-columns        (leaf — imports nothing from grid-*)
grid-state          (leaf — imports nothing from grid-*)
grid-data           → grid-state
grid-selection      → grid-data
grid-edit           → grid-state
grid-search         (leaf — calls gridData.localSort/localSearch via grid.X delegator, NOT direct import)
grid-interaction    (leaf at type level — calls all domains via grid.X delegators)
grid-render         → grid-data, grid-selection
```

**No cycles.** Verified by topological order: columns, state, data, selection, edit, search, interaction, render.

### 4.2 Allowed call graph at runtime (delegator-mediated)

A function in module A may call `grid.foo()` where `foo` is defined in module B even when A does not import B, because the call resolves through the TsGrid prototype's thin delegator. This is the cycle-breaker: import dependency ≠ call dependency.

Example: `gridSearch.search(grid, ...)` calls `grid.localSearch()`. At type level, `grid-search.ts` only imports `TsGrid` type. At runtime, `grid.localSearch()` dispatches via the TsGrid prototype to `gridData.localSearch(grid, ...)`. This is exactly the proposal §6 Q5 resolution, but stated as a CONCRETE rule.

### 4.3 Forbidden imports

- `grid-data.ts` MUST NOT import `grid-search.ts`. (R3 — would create a cycle.)
- `grid-search.ts` MUST NOT import `grid-data.ts`. Calls go through `grid.localSort()` / `grid.localSearch()`.
- `grid-interaction.ts` MUST NOT import `grid-render.ts`. Render calls go through `grid.refresh()`, `grid.scroll()`, etc.
- `grid-render.ts` MUST NOT import `grid-interaction.ts`. Interaction calls go through `grid.sort()`, `grid.click()`, etc.
- No grid-*.ts file may import `tsgrid.ts` for VALUE — only `import type { TsGrid } from './tsgrid'`. This is enforced by the typing-only constraint.

### 4.4 Shared internal helpers

There are no expected shared helpers between grid-*.ts files (each domain's helpers live as nested functions inside the exported function, matching the existing source style — see e.g. `update()`'s nested `_update()` at line 5851).

If a helper IS needed across two grid-*.ts files in the future, the rule is: extract it into the LOWEST-COUPLED module (typically `grid-state.ts`). Do NOT introduce a new `grid-utils.ts` in v2.0 — this is YAGNI.

---

## 5. Type Architecture

### 5.1 Type ownership

All public types currently exported from `src/index.ts` (TsGridRecord, TsGridColumn, TsGridSearch, TsGridSortData, TsGridSelection, TsGridCellSelection, TsGridRange, TsGridRangeEndpoint, TsGridGroupBy) **remain in `tsgrid.ts`** and continue to be re-exported from the barrel.

`grid-*.ts` files import them as `import type { ... } from './tsgrid'`.

### 5.2 Internal types

`TsGridLast` (currently `interface TsGridLast` at `tsgrid.ts:199`) **stays in `tsgrid.ts`** because it is the `last` property's type and is referenced by every domain. It remains internal (not exported from the barrel).

`TsGridSearchFilter` (currently at `tsgrid.ts:275`, internal) **stays in `tsgrid.ts`** for the same reason — referenced as `searchData: TsGridSearchFilter[]` on the class.

`TsGridFetch` and `TsGridVScroll` (the sub-shapes of TsGridLast) **stay in `tsgrid.ts`**.

### 5.3 New internal types — NONE

No new internal types are introduced. The decomposition is purely structural — same types, redistributed function bodies. This minimizes typecheck surface area and matches the proposal's "no new types" implicit constraint.

### 5.4 Event handler retyping (BC-1)

The 45 `on*` field declarations on TsGrid (lines 395–445) change shape:

```ts
// Before (v1.0.1)
onAdd: ((event: CustomEvent) => void) | null

// After (v2.0)
onAdd: ((event: TsEventPayload) => void) | null
```

`TsEventPayload` is imported from `./tsbase` (already exported from the barrel since v1.0.1 per init #722). No generic parameter is used (`TsEventPayload<unknown>` is the default — proposal §6 Q2).

Same retyping applied verbatim to:
- `tsform.ts` lines 105–119 (13 declarations)
- `tsfield.ts` lines 1766, 1770, 1808, 1845 (4 inline callbacks INSIDE method bodies — these are local var types, not class fields, but consumer-facing because they document expected callback shape)

### 5.5 `[key: string]: any` index signature

The class-level `[key: string]: any` at `tsgrid.ts:299` STAYS. Removal is explicitly out of scope per proposal §4. Sibling-file functions that read transient props (`grid.last.foo`, `grid.someTransient`) continue to rely on this index signature.

---

## 6. Build Pipeline Impact

### 6.1 tsup.config.ts — NO CHANGES

Current config has 3 entries (ESM, CJS legacy, .d.ts rollup), all rooted at `src/index.ts` / `src/index-legacy.ts`. Strategy D adds 8 sibling files imported transitively by `tsgrid.ts`, which is imported by `index.ts`. tsup discovers them automatically. No new entries, no subpath exports, no config changes.

(v2.2 will add subpath exports — out of scope here.)

### 6.2 .d.ts rollup — UNCHANGED FOR CONSUMERS

The dts entry at tsup.config.ts:58–68 rolls up types from `src/index.ts`. After extraction:
- `grid-*.ts` exports are NOT in the public barrel (not re-exported from index.ts). Their types do not appear in `dist/tsgrid-ui.d.ts`.
- The TsGrid class shape in the rollup is IDENTICAL except for the 58 `CustomEvent → TsEventPayload` changes (BC-1).

**Verification gate**: a `git diff` of `dist/tsgrid-ui.d.ts` pre/post must show ONLY 58 line changes (the event sig type). Anything else is a regression and must be investigated before tagging v2.0.

### 6.3 Gulp pipeline — UNAFFECTED

CSS (less compilation) and iconfont generation read `src/less/`. They do not touch `src/*.ts` files. Zero impact.

### 6.4 wrap-legacy.mjs — UNAFFECTED

The legacy IIFE wrapper post-processes `dist/tsgrid-ui.js` regardless of internal source structure. Decomposition is invisible to it.

### 6.5 Bundle size expectation

Per proposal §7 and exploration §7: ZERO bundle reduction expected. `dist/tsgrid-ui.es6.js` baseline must be measured BEFORE the refactor and again AFTER. Acceptable variance: ±2%. Anything beyond +2% blocks release; anything beyond -2% is suspicious (possible accidental dead-code removal — investigate).

---

## 7. Test/Verification Strategy

### 7.1 Unit tests (Vitest, 84 tests)

Confirmed via grep over `test/unit/`: **no unit test references TsGrid or tsgrid**. Unit tests cover TsUtils helpers, TsBase event system, and types brands. Decomposition does not affect them.

→ **No unit test changes required.**

### 7.2 Smoke tests (Playwright, 38 tests)

Smoke tests run `pnpm build` and exercise public TsGrid behavior end-to-end through HTML fixtures. Public API is unchanged → smoke tests must pass without modification.

→ **No smoke test changes required.** Failure of any smoke test is a regression in the extraction itself.

### 7.3 consumer-smoke

`test/consumer-smoke.ts` is an independent typecheck of the public API as a consumer would import it. It WILL break on BC-1 because consumer-smoke types event handlers as `CustomEvent`. This is the documented breakage.

→ **REQUIRED update**: change all `(event: CustomEvent) =>` annotations in `test/consumer-smoke.ts` to `(event: TsEventPayload) =>`. Same PR as the BC-1 commit.

### 7.4 Per-module unit tests — DEFERRED

Recommendation: **do NOT add unit tests for grid-*.ts modules in v2.0**. Rationale:
- R1 from proposal: every sub-module needs a full TsGrid instance because of `this.last` coupling. Mocking TsGrid is impractical (300+ fields).
- The cost/value ratio is poor. Tests would mostly assert pass-through behavior already covered by smoke.
- Adding unit tests is a separate refactor (decoupling state) that is OUT OF SCOPE for v2.0.

This is a deliberate tradeoff and must be documented in MIGRATION_v2.md as a known limitation.

### 7.5 Verification chain

`pnpm verify` (lint + typecheck + consumer-smoke + test:unit + smoke) must pass GREEN at every extraction commit. Per proposal §6 Q1 and the chained-PR strategy (R7), each module extraction = one PR = one verify pass.

---

## 8. BC-1 Codemod

### 8.1 Codemod recipe (for MIGRATION_v2.md)

**Pattern**: regex-based substitution.

```
Find:    \(event:\s*CustomEvent\)\s*=>
Replace: (event: TsEventPayload) =>
```

**Scope**: project-wide search-replace across user TS/TSX files that handle TsGrid / TsForm / TsField events.

### 8.2 Caveats (must be in MIGRATION_v2.md)

1. **Import requirement**: replacement uses `TsEventPayload` which must be imported. Add `import type { TsEventPayload } from 'tsgrid-ui'` to files where you apply the replacement. The codemod regex does NOT do this automatically — it is the user's responsibility. (TsEventPayload has been exported from the barrel since v1.0.1, so no install/version pinning is needed.)

2. **False-positive risk**: the regex matches ANY callback typed `(event: CustomEvent) =>`, including ones unrelated to TsGrid (e.g., DOM event handlers attached via `addEventListener`). After running the codemod, users MUST review changes and revert any that are genuine `CustomEvent` handlers (e.g., for browser-native custom events). This is documented as an explicit step.

3. **`event.detail` access**: `TsEventPayload<unknown>` requires explicit narrowing at the `.detail` site. Users with code like `event.detail.recid` will need either:
   - a runtime check + cast: `const detail = event.detail as { recid: string | number }`
   - or wait for v2.x domain-specific overloads (proposal §6 Q2 — deferred).

4. **Untyped handlers unaffected**: handlers like `(event) =>` (no annotation) or `(event: any) =>` continue to work without changes. The codemod does NOT need to be run on those.

### 8.3 Worked example for MIGRATION_v2.md

```ts
// Before — v1.0.1
import { TsGrid } from 'tsgrid-ui'
const grid = new TsGrid({ name: 'g1' })
grid.onSelect = (event: CustomEvent) => {
    console.log('selected:', event.detail.recid) // worked at runtime (TsEventPayload)
                                                  // but type was CustomEvent — fake autocomplete
}

// After — v2.0
import { TsGrid, TsEventPayload } from 'tsgrid-ui'
const grid = new TsGrid({ name: 'g1' })
grid.onSelect = (event: TsEventPayload) => {
    const { recid } = event.detail as { recid: string | number }
    console.log('selected:', recid)
}
```

---

## 9. Implementation Order

This is HIGH-LEVEL phasing — not a task list. Tasks phase will produce the granular breakdown.

### Phase 1: BC-1 first (event signature fix)

- Single mechanical PR.
- Replace 45 declarations in `tsgrid.ts` + 13 in `tsform.ts` + 4 inline in `tsfield.ts`.
- Update `test/consumer-smoke.ts` event handler annotations.
- Run `pnpm verify`.
- Tag as a separate commit/PR for review-budget reasons (~80 lines changed; trivially reviewable).
- Reason for going first: it is mechanical and codemod-friendly. Going first means consumers can pre-migrate against `next` dist-tag while the structural work is in flight.

### Phase 2: Decomposition in dependency order

Per proposal §6 Q1, extract in lowest-coupling-first order. Each module = its own commit/PR per the chained-PR strategy (R7 → §10 below):

1. `grid-columns.ts` (leaf, ~235 LOC)
2. `grid-state.ts` (leaf, ~390 LOC) — must precede data/edit (they import it)
3. `grid-data.ts` (~910 LOC) — imports state
4. `grid-selection.ts` (~490 LOC) — imports data
5. `grid-edit.ts` (~505 LOC) — imports state
6. `grid-search.ts` (~1,300 LOC) — leaf at import level (uses delegator pattern for localSort/localSearch)
7. `grid-interaction.ts` (~1,380 LOC) — leaf at import level
8. `grid-render.ts` (~2,820 LOC) — imports data + selection; LARGEST and LAST

After each extraction commit, `pnpm verify` must pass green.

### Phase 3: Release

- Update `package.json` version to `2.0.0`.
- Write `CHANGELOG.md` v2.0.0 entry with explicit "no bundle reduction" disclaimer (per R5 + proposal §9).
- Write `MIGRATION_v2.md` with the BC-1 codemod (§8 above).
- Optional: tag `v2.0.0-rc.1` under npm `next` dist-tag for Angular demo validation.
- Run `pnpm build` + `pnpm verify` against the final `dist/tsgrid-ui.es6.js` size; commit dist/.
- Tag `v2.0.0`, push, publish.

---

## 10. Risks & Mitigations

### Inherited from proposal

| ID | Risk | Status | Mitigation |
|---|---|---|---|
| R1 | `this.last` universal coupling — sub-modules not unit-testable in isolation | ACCEPT | Documented in §7.4 as a known limitation. Defer per-module unit tests to a future change that decouples state. |
| R2 | BC-1 typed break on consumer code | ACCEPT (SEMVER MAJOR) | Codemod recipe in §8 + MIGRATION_v2.md. Pre-migration possible against current v1.0.1 since `TsEventPayload` is already exported. |
| R3 | localSort/localSearch cycle | RESOLVED | Placed in `grid-data.ts` (§2.3). Search calls them via the TsGrid delegator (`grid.localSearch()`), so `grid-search.ts` does not import `grid-data.ts`. (§4.2, §4.3) |
| R4 | html/render coupling | RESOLVED | **8 files, not 9.** HTML generators folded into `grid-render.ts`. Evidence: `update()`, `scroll()`, `refresh()`, `refreshBody()` all interleave HTML and render calls in the same critical paths (§1). |
| R5 | Zero bundle improvement in v2.0 | ACCEPT | Disclosed in CHANGELOG, README, MIGRATION_v2.md per proposal §9. Pre/post measurement gate at ±2% (§6.5). |
| R6 | consumer-smoke must update | ACCEPT | Treated as a deliverable bundled with the BC-1 PR (§7.3). |
| R7 | Review budget — multi-PR | ACCEPT | Chained PR strategy. BC-1 isolated PR first; each module extraction its own PR (§9). Apply `delivery_strategy=ask-on-risk` per init #722. |

### New risks discovered during design

| ID | Risk | Mitigation |
|---|---|---|
| R8 | Per-module file LOC estimates assume each method body moves verbatim. Hidden helpers (closures over `this`) may force adjustments. | Per §4.4, helpers stay nested inside their owning function (closure pattern). If a helper IS shared across two extractions, place it in `grid-state.ts`. Worst case: one extraction PR is larger than estimated; not a release blocker. |
| R9 | `update()` at line 5796 has a nested `_update()` closure (line 5851) that captures `self`. Extracting `update()` to `grid-render.ts` requires rewriting the closure to take `grid` as a parameter, OR keeping the closure pattern with `const self = grid` at function entry. | Use the `const self = grid` pattern verbatim. Mechanical. No semantic change. |
| R10 | `getFooterHTML`, `getSearchesHTML` and others contain large inline template strings with embedded `this.X` references. Replacing with `grid.X` is mechanical but voluminous (~30+ template strings). | Done as part of `grid-render.ts` extraction; flagged in tasks phase as the largest single edit. |
| R11 | `scroll()` (line 8728, ~270 LOC) is the single most complex method and lives at the render/HTML seam. Any error here breaks vertical scrolling — a critical UX path covered by smoke test `grid-vscroll`. | Extract `scroll()` LAST within the `grid-render.ts` work. Verify with `pnpm smoke` immediately after extraction. If any virtual-scroll smoke fails, revert and split into smaller chunks. |
| R12 | TsGrid delegator-pattern call resolution requires the `[key: string]: any` index signature to remain on the class (since some sibling-file functions read dynamic transient props via `grid.X`). | Index signature kept (§5.5). Removal deferred to a future change. |
| R13 | Reviewers may be tempted to add per-module unit tests during the extraction PR review. | Explicitly call out in PR descriptions: "per-module unit tests deferred per design §7.4 — do not add in this PR." |

---

## Appendix A: File:line evidence cited

| Claim | Source |
|---|---|
| 9,684 LOC total | exploration §1 (cross-checked: `tsgrid.ts` ends at line ~9993 per grep matches at line 9970) |
| `TsGridLast` interface declaration | tsgrid.ts:199 |
| 45 on* event handler declarations | tsgrid.ts:395–445 |
| Constructor + initializers | tsgrid.ts:448–~800 |
| `add()` data CRUD start | tsgrid.ts:854 |
| `localSort()` | tsgrid.ts:1303 |
| `localSearch()` | tsgrid.ts:1513 |
| `update()` calls `getCellHTML` | tsgrid.ts:5863 |
| `refresh()` calls `getFooterHTML` | tsgrid.ts:6055 |
| `refreshBody()` tail calls `initResize()` + `refreshRanges()` | tsgrid.ts:8060–8061 |
| `scroll()` interleaves HTML + render | tsgrid.ts:8810–8878 (multiple `getCellHTML`, `getColumnsHTML`, `resizeRecords` calls) |
| HTML cluster start (`getColumnsHTML`) | tsgrid.ts:8439 |
| HTML cluster: `scroll`, `getRecordHTML`, `getCellHTML` | tsgrid.ts:8728, 9050, 9222 |
| State cluster (lock, status, parseField, prepareData, nextCell, etc.) | tsgrid.ts:9604–9993 |
| `localSort` calls `selectionSave` + `prepareData` | tsgrid.ts:1326–1327 |
| No unit tests reference TsGrid | grep over test/unit/ — zero matches |
| tsup.config.ts has 3 entries, `src/index.ts` rooted | tsup.config.ts:17–69 |

---

End of design.
