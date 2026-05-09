# Exploration: tsgrid-v2-core

## Scope (locked by user)
1. Decompose `src/tsgrid.ts` (9,684 LOC monolithic class) into composable sub-modules
2. Correct event handler signatures `(event: CustomEvent) => void` → `(event: TsEventPayload) => void` across all `src/ts*.ts` widget classes

---

## 1. Anatomy of `src/tsgrid.ts`

### File metrics
- Total LOC: 9,684
- Single `class TsGrid extends TsBase`
- 45 public event handler declarations (all typed `CustomEvent` — wrong)
- 281 usages of `this.last.*` (the main shared-state object)
- 103 usages of `this.columns`
- 130 usages of `this.records`
- Approx. 95 public/internal methods

### Method inventory by domain

**Data/Records cluster** (lines ~854–1062) — ~210 LOC
- `add`, `find`, `set`, `replace`, `get`, `getFirst`, `remove`, `processGroupBy`
- Cross-references: `this.records`, `this.summary`, `this.total`, `this.url`, `this.last.vscroll`, `this.recid`, calls `localSort`, `localSearch`, `refresh`, `getSearch`, `get`

**Column cluster** (lines ~1063–1296) — ~235 LOC
- `addColumn`, `removeColumn`, `getColumn`, `updateColumn`, `toggleColumn`, `showColumn`, `hideColumn`
- Cross-references: `this.columns`, `this.columnGroups`, `this.last.colResizing`

**Search cluster** (lines ~1199–3261) — ~1,500 LOC (largest single domain)
- `addSearch`, `removeSearch`, `getSearch`, `toggleSearch`, `showSearch`, `hideSearch`, `getSearchData`
- `localSort`, `localSearch`, `getRangeData`
- `addRange`, `removeRange`, `refreshRanges`
- `search`, `searchOpen`, `searchClose`, `searchFieldTooltip`, `searchSuggest`, `searchSave`, `cache`, `cacheSave`, `searchReset`, `searchShowFields`, `searchInitInput`
- `getSearchesHTML`, `getOperators`, `initOperator`, `initSearchLists`, `initSearches`
- Cross-references: `this.searches`, `this.searchData`, `this.sortData`, `this.last.field`, `this.last.label`, `this.last.logic`, `this.last.search`, `this.last.searchIds`, `this.savedSearches`, `this.defaultSearches`; calls `localSearch`, `localSort`, `refresh`, `resize`, `select`, `records`, `columns`

**Selection cluster** (lines ~2130–2620) — ~490 LOC
- `select`, `unselect`, `compareSelection`, `selectAll`, `selectNone`, `updateToolbar`, `getSelectionRows`, `getSelectionCells`, `getSelection`
- Core state: `this.last.selection` (indexes + columns dictionary)
- Cross-references: `this.records`, `this.columns`, `this.multiSelect`, `this.selectType`, `this.last.selection`, `this.last.inEditMode`, `this.toolbar`; calls `addRange`, `refreshRanges`, `scroll`, `refresh`

**Data I/O cluster** (lines ~3403–3890) — ~490 LOC
- `clear`, `reset`, `skip`, `load`, `reload`, `request`, `requestComplete`, `error`, `getChanges`, `mergeChanges`, `save`
- Cross-references: `this.url`, `this.limit`, `this.offset`, `this.last.fetch`, `this.records`, `this.summary`, `this.postData`, `this.httpHeaders`, `this.parser`, `this.total`; calls `lock`, `unlock`, `refresh`, `selectionSave`, `selectionRestore`, `localSort`, `localSearch`

**Editing cluster** (lines ~3889–4394) — ~505 LOC
- `editField`, `editChange`, `editDone` (delete also in here: ~4330)
- Cross-references: `this.last.inEditMode`, `this.last._edit`, `this.records`, `this.columns`, `this.selectType`; calls `select`, `scroll`, `nextCell`, `prevCell`, `nextRow`, `prevRow`, `refresh`, `save`, `request`

**Interaction cluster** (lines ~4396–5777) — ~1,380 LOC
- `click`, `columnClick`, `columnDblClick`, `columnContextMenu`, `columnAutoSize`, `columnAutoSizeAll`, `focus`, `blur`, `keydown`, `scrollIntoView`, `scrollToColumn`, `dblClick`, `showContextMenu`, `contextMenuClick`, `toggle`, `expand`, `collapse`, `updateExpanded`, `sort`, `copy`, `getCellCopy`, `paste`
- Cross-references: nearly everything — `this.last`, `this.records`, `this.columns`, `this.searches`, `this.sortData`, selection state, edit state; triggers ~30+ events

**Rendering cluster** (lines ~5777–7065) — ~1,290 LOC
- `resize`, `update`, `refreshCell`, `refreshRow`, `refresh`, `refreshSearch`, `refreshBody`, `destroy`, `unmount`
- Internal: `initColumnOnOff`, `initColumnDrag`, `columnOnOff`, `initToolbar`, `initResize`, `resizeBoxes`, `resizeRecords`
- Cross-references: nearly all state — `this.columns`, `this.records`, `this.searches`, `this.last.vscroll`, `this.last.selection`, `this.toolbar`, `this.box`

**HTML generation cluster** (lines ~8072–9604) — ~1,530 LOC
- `getSearchesHTML`, `getOperators`, `initOperator`, `initSearchLists`, `initSearches`
- `getColumnsHTML`, `getColumnCellHTML`, `columnTooltipShow`, `columnTooltipHide`
- `getRecordsHTML`, `getSummaryHTML`, `scroll`, `getRecordHTML`, `getLineHTML`, `getCellHTML`, `clipboardCopy`, `showBubble`, `getCellEditable`, `getCellValue`, `getFooterHTML`
- Cross-references: `this.columns`, `this.records`, `this.summary`, `this.last.vscroll`, `this.last.selection`, `this.searchData`, `this.sortData`

**State/Utility cluster** (lines ~9604–9993) — ~390 LOC
- `status`, `lock`, `unlock`, `stateSave`, `stateRestore`, `stateReset`, `parseField`, `prepareData`
- `nextCell`, `prevCell`, `nextRow`, `prevRow`, `selectionSave`, `selectionRestore`
- `message`, `confirm`

---

## 2. Shared State Surface (the cross-cutting coupling)

The `this.last` object (a bag of 25+ fields) is the primary shared state touching ALL domains:

| Property | Domains that read/write it |
|---|---|
| `this.last.selection` | Selection, Interaction, Rendering, HTML gen |
| `this.last.vscroll` | Data, Rendering, HTML gen, Interaction (scroll) |
| `this.last.fetch` | Data I/O, Status display |
| `this.last.inEditMode` | Editing, Interaction (keydown) |
| `this.last._edit` | Editing, Interaction |
| `this.last.field/label/logic/search/searchIds` | Search, HTML gen |
| `this.last.colResizing/tmp` | Rendering (initResize) |
| `this.last.move` | Interaction (drag/drop) |
| `this.last.columnDrag` | Rendering, Interaction |
| `this.last.toolbar_height` | Rendering, initToolbar |

Top-level shared arrays:
- `this.records` — touched by ALL domains (130 usages)
- `this.columns` — touched by all except pure data I/O (103 usages)
- `this.searches` / `this.searchData` / `this.sortData` — touched by Search, Interaction (keydown), HTML gen

**Key finding**: There is no clean separation. Every domain accesses `this.columns`, `this.records`, and `this.last`. The "natural seams" are code organization seams, not data isolation seams.

---

## 3. Event Surface

### Events emitted by TsGrid (via `this.trigger`)
55 total event triggers across all domains.

Events by domain:
- Data I/O: `request`, `load`, `save`, `delete`, `error`
- Search: `search`, `searchOpen`, `searchClose`, `searchSave`, `searchRemove`, `searchSelect`
- Selection: `select` (called from select, selectAll, selectNone, click)
- Interaction: `click`, `dblClick`, `contextMenu`, `contextMenuClick`, `sort`, `copy`, `paste`, `expand`, `collapse`, `focus`, `blur`, `keydown`, `toolbar`, `add`, `edit`
- Columns: `columnClick`, `columnDblClick`, `columnContextMenu`, `columnResize`, `columnAutoResize`, `columnOnOff`, `columnSelect`, `columnDragStart`, `columnDragEnd`, `resizerDblClick`
- Rendering: `render`, `refresh`, `reload`, `resize`, `destroy`, `stateSave`, `stateRestore`
- Editing: `editField`, `change`, `restore`
- UI: `mouseEnter`, `mouseLeave`, `reorderRow`, `selectionExtend`

### Event handler declarations (wrong type, must be fixed)
In `src/tsgrid.ts`, lines 395–445:
All 45 `on*` properties declared as `((event: CustomEvent) => void) | null`
Full list: `onAdd`, `onEdit`, `onRequest`, `onLoad`, `onDelete`, `onSave`, `onSelect`, `onClick`, `onDblClick`, `onContextMenu`, `onContextMenuClick`, `onColumnClick`, `onColumnDblClick`, `onColumnContextMenu`, `onColumnResize`, `onColumnAutoResize`, `onSort`, `onSearch`, `onSearchOpen`, `onSearchClose`, `onChange`, `onRestore`, `onExpand`, `onCollapse`, `onError`, `onKeydown`, `onToolbar`, `onColumnOnOff`, `onCopy`, `onPaste`, `onSelectionExtend`, `onEditField`, `onRender`, `onRefresh`, `onReload`, `onResize`, `onDestroy`, `onStateSave`, `onStateRestore`, `onFocus`, `onBlur`, `onReorderRow`, `onSearchSave`, `onSearchRemove`, `onSearchSelect`, `onColumnSelect`, `onColumnDragStart`, `onColumnDragEnd`, `onResizerDblClick`, `onMouseEnter`, `onMouseLeave`

### Other widgets with the same problem
- `src/tsform.ts` lines 105–119: 13 handlers typed `CustomEvent`
- `src/tsgrid.ts`: 45 handlers (as above)
- `src/tsfield.ts` lines 1766, 1770, 1808, 1845: 4 inline callback usages `(event: CustomEvent)` inside method bodies (not class-level declarations — these are callbacks passed to `.select()` / `.liveUpdate()` on TsField instances)
- `src/tstoolbar.ts` lines 569, 574, 591, 596: 4 inline callbacks using `any` comment "Tooltip CustomEvent" — these are already typed `any`, so no breaking change needed
- `src/tslayout.ts`: 0 (already clean)
- `src/tspopup.ts`: 0 (already clean)
- `src/tstabs.ts`: 0 (already clean)
- `src/tssidebar.ts`: 0 (already clean)

### Correct replacement type
`TsEventPayload` (from `./tsbase.ts`) is the runtime type. It is already exported in the barrel (`src/index.ts` line 20).

The tsbase.ts comment at lines 30–32 explicitly documents:
> "Note: the per-class declarations like `onSelect: (event: CustomEvent) => void` in TsGrid/TsForm/etc. are historical noise — the runtime always passes a `TsEventPayload`, never a DOM `CustomEvent`. This will be corrected in v2.0."

`TsEventPayload` is parameterized: `TsEventPayload<TDetail = unknown>`. For the bulk replacement, `TsEventPayload` (no type param, defaults to `TsEventPayload<unknown>`) is the safe choice. Specific events could use narrowed generics (e.g. `TsEventPayload<{ recid: string | number }>` for `onSelect`) but that granularity is out of scope for v2.0.

**Consumer-visible breakages**: Any consumer who passes a typed `(event: CustomEvent) => void` function to an `on*` prop will see a TypeScript type error at the call site after this change. This is a BREAKING CHANGE. Callers using `event: any` or no type annotation are unaffected at runtime. The `.d.ts` rollup exposes all `on*` declarations, so this affects every consumer who types their handlers.

**Estimate**: 45 + 13 = 58 declaration sites. The 4 tsfield.ts inline usages and 4 tstoolbar.ts usages are internal (not public API declarations). Total consumer-visible `.d.ts` breakages: 58 property type changes.

---

## 4. Decomposition Strategy Analysis

### Candidate seams from entrypoint

| Candidate | Est. LOC | Key Methods | Shared-state dependencies |
|---|---|---|---|
| `grid/data` | ~700 | add, find, set, replace, get, remove, clear, reset, skip, load, reload, request, requestComplete, error, getChanges, mergeChanges, save, processGroupBy | this.records, this.summary, this.url, this.total, this.last.fetch, this.last.vscroll |
| `grid/columns` | ~235 | addColumn, removeColumn, getColumn, updateColumn, toggleColumn, showColumn, hideColumn | this.columns, this.columnGroups |
| `grid/search` | ~1,500 | all search + sort methods, range methods, HTML gen for searches | this.searches, this.searchData, this.sortData, this.last.field/logic/searchIds, this.records, this.columns |
| `grid/selection` | ~490 | select, unselect, compareSelection, selectAll, selectNone, getSelection*, updateToolbar | this.last.selection, this.records, this.columns, this.toolbar |
| `grid/edit` | ~505 | editField, editChange, editDone | this.last.inEditMode, this.last._edit, this.records, this.columns |
| `grid/render` | ~2,820 | refresh, resize, refreshBody, refreshSearch, HTML gen, initToolbar, initResize, scroll | this.columns, this.records, this.searches, this.last.vscroll, this.last.selection, this.toolbar, this.box |
| `grid/interaction` | ~1,380 | click, dblClick, contextMenu, sort, copy, paste, keydown, expand, collapse | everything |
| `grid/state` | ~390 | stateSave, stateRestore, lock, unlock, status, parseField, prepareData, nextCell, prevCell | this.columns, this.records, this.last |

**Seam viability verdict**: The columns seam (~235 LOC) is the ONLY seam with low coupling. All other seams require access to at minimum `records`, `columns`, `last.selection`, and `box`. The `search` seam is deceptive — it directly triggers `localSort`, `localSearch`, calls `refresh`, `resize`, `select`, and generates HTML using `this.columns`. The render seam is the largest, but it's coupled to every other domain by design (it reads everything to produce HTML).

---

## 5. Architectural Strategy Comparison

### Strategy A: Composition (sub-classes with injected grid reference)
TsGrid composes `GridSelection`, `GridEdit`, `GridSearch`, etc. Each is an independent class that receives `grid: TsGrid` in its constructor and accesses state through it.

| Dimension | Assessment |
|---|---|
| Public API impact | Zero — TsGrid outer interface unchanged; sub-classes are internal |
| Tree-shaking | None — esbuild cannot eliminate GridEdit if TsGrid always imports and instantiates it |
| Type safety | Good — sub-class methods are typed; cross-class calls go through `grid.X` |
| Migration cost for consumers | Zero — no public API change |
| Decomp benefit | Code organization only; all code still ships in one bundle |
| Effort | Medium — careful constructor injection; avoid circular references between sub-classes |

### Strategy B: Facade (TsGrid as thin shell, internal context object)
TsGrid becomes a thin facade; all logic moves to internal modules that share a `GridContext` object (`{ records, columns, last, box, ... }`). TsGrid delegates every method call.

| Dimension | Assessment |
|---|---|
| Public API impact | Zero externally — all method names preserved |
| Tree-shaking | None — TsGrid still imports all modules at top level |
| Type safety | Medium — `GridContext` becomes a large `any`-adjacent bag |
| Migration cost for consumers | Zero |
| Decomp benefit | Code organization only; same bundle size |
| Effort | High — full rewrite of every method into module functions with context parameter |

### Strategy C: Mixin/Trait chain
TsGrid extends a chain: `TsGridBase → TsGridSelectionMixin → TsGridEditMixin → TsGridSearchMixin → TsGrid`.

| Dimension | Assessment |
|---|---|
| Public API impact | Zero — same surface |
| Tree-shaking | None — mixin chain is evaluated at class definition time |
| Type safety | Poor — TypeScript mixin pattern requires complex generic intersection types; `this` is shared across all mixins |
| Migration cost for consumers | Zero externally; internally highest complexity |
| Decomp benefit | Purely organizational |
| Effort | Very High — mixin typing in TypeScript is non-trivial |

### Strategy D: Hybrid (code organization via sibling file imports)
Each domain lives in its own file (`grid-data.ts`, `grid-search.ts`, etc.) exporting plain functions that take `(grid: TsGrid, ...args)`. TsGrid imports and delegates:
```ts
// grid-data.ts
export function add(grid: TsGrid, record: TsGridRecord | TsGridRecord[], first?: boolean): number { ... }
// tsgrid.ts
add(record, first?) { return gridData.add(this, record, first) }
```

| Dimension | Assessment |
|---|---|
| Public API impact | Zero — TsGrid method signatures unchanged |
| Tree-shaking | Possible in future (subpath imports): NOT in v2.0 because TsGrid imports all modules |
| Type safety | Good — plain functions with explicit `grid: TsGrid` parameter |
| Migration cost for consumers | Zero |
| Decomp benefit | Code organization NOW; enables future subpath tree-shaking (v2.2) |
| Effort | Medium — systematic extraction; each function needs `grid` param; no architectural restructuring |

---

## 6. Recommendation

**Recommended strategy for v2.0: Strategy D (Hybrid — sibling file imports)**

Rationale:
1. It is the ONLY strategy that lays groundwork for future tree-shaking without breaking anything in v2.0.
2. It requires zero consumer migration (public API unchanged).
3. Type safety is clean and verifiable with `pnpm typecheck`.
4. It is honest about bundle impact: v2.0 produces no bundle reduction. Bundle reduction only becomes possible if v2.2 (multi-entry) adds subpath exports that consumers actually use selectively.
5. Effort is medium and parallelizable — each domain can be extracted independently.

**For event signatures**: A flat mechanical replacement of all 58 `((event: CustomEvent) => void) | null` declarations to `((event: TsEventPayload) => void) | null`. This is a breaking change for consumers who type their handlers, but it is a CORRECT change — the runtime has always passed `TsEventPayload`. It improves DX and IntelliSense.

---

## 7. Bundle Reduction: Methodology Constraint

**MANDATORY CAVEAT** — v1.1.0 was cancelled after predicting ~27% bundle reduction without evidence and measuring ~3%.

For v2.0:
- Strategy D produces ZERO bundle reduction in v2.0. The single entry point still imports all sibling files.
- Bundle reduction becomes possible only in v2.2 when consumers import from subpaths (e.g., `tsgrid-ui/grid/search`) instead of the root barrel.
- DO NOT claim or predict any percentage reduction for v2.0 decomposition.

**Measurement plan** (for design phase validation):
1. Before implementation: run `pnpm build` and record `dist/tsgrid-ui.es6.js` size as baseline.
2. After v2.0 implementation: build again. Expect no significant change (validates we didn't accidentally grow the bundle).
3. Prototype test (before committing to v2.2): create a throwaway consumer that imports ONLY `TsGrid` from a hypothetical subpath. Measure with `esbuild --bundle --analyze` to see actual dead-code elimination.
4. Only publish v2.2 bundle reduction claims AFTER step 3 produces evidence.

---

## 8. Open Questions for Proposal Phase

1. **Extraction order**: Should the proposal define a dependency-ordered extraction sequence (e.g., columns first, then data, then selection) to minimize integration conflicts? The columns domain has the lowest coupling and is the safest starting point.

2. **`TsEventPayload` generic depth**: Should the event signature correction use bare `TsEventPayload` (unknown detail) or attempt domain-specific generics (e.g., `TsEventPayload<{ recid: RecId }>`)?  The safe answer is bare, but specific generics would be a larger DX win.

3. **Internal vs public boundary**: The `on*` property declarations are class fields, not part of the `.on()` registration API. Should the proposal also type the `.on(eventName, handler)` call correctly, or scope the fix to class field declarations only?

4. **v2.0 / v2.1 sequencing risk**: If TsUtils needs refactoring before decomposition can safely proceed (e.g., `TsUtils.extend` calls throughout), flag this in the proposal. The current code uses `TsUtils.extend` in 50+ places in tsgrid.ts — the decomposed sibling files will all import TsUtils, preserving this dependency.

5. **`localSort` and `localSearch`**: These two methods are in the Search cluster but called heavily from Data and Interaction clusters. Their placement in a `grid/search` module would require the data module to import search — a cross-module dependency. The proposal should decide whether these are `grid/data` methods (called by search) or `grid/search` methods (called by data, creating a cycle risk).

---

## 9. Risks

1. **`this.last` as universal coupling**: Any decomposition that tries to isolate state will immediately be defeated by `this.last`. The sibling-file strategy sidesteps this by keeping `this.last` on the TsGrid instance and passing `grid` by reference — but it means sub-modules are not independently testable without a full TsGrid instance.

2. **Event signature change is a breaking change**: All consumers who typed their event handlers will receive TypeScript errors. This is a deliberate SEMVER MAJOR increment. The proposal must include a migration note and a CHANGELOG entry.

3. **localSort / localSearch placement creates a cycle risk**: If placed in `grid/search`, the data module calls into search, and search calls into data (for `records`). With the `(grid: TsGrid)` parameter approach this is not a circular module dependency (both import TsGrid type), but it does mean search logic affects data display, which should be explicit in the design.

4. **HTML generation tightly coupled to render**: `getSearchesHTML`, `getColumnsHTML`, `getRecordsHTML`, etc., all live in the same method body as the layout logic. Extracting these into a `grid/render` or `grid/templates` module is feasible but requires verifying that the `this.name`, `this.box`, `this.columns`, etc. references all come through the `grid` parameter cleanly.

5. **No bundle improvement in v2.0**: Stakeholders must be set to ZERO expectation of performance improvement from decomposition alone. The win is maintainability and future readiness.

6. **Consumer-smoke test must be updated**: `pnpm consumer-smoke` tests the public API surface. After the `CustomEvent` → `TsEventPayload` change, the consumer smoke test's event handler typings will need updating. This is a test-maintenance cost.
