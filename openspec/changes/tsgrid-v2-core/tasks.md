# Tasks: tsgrid-v2-core

Status: ready
Phase inputs: spec #745, design #746, proposal #744
Strategy: D — Hybrid sibling files; chained PRs by phase

---

## Review Workload Forecast

| Phase | Files touched | Estimated changed lines | 400-line budget? | Suggested PR shape |
|-------|--------------|------------------------|------------------|--------------------|
| Phase 0 — BC-1 + baseline | `src/tsgrid.ts`, `src/tsform.ts`, `src/tsfield.ts`, `test/consumer-smoke.ts`, `MIGRATION_v2.md` | ~70 | Under budget | PR 0: standalone, low risk |
| Phase 1 — grid-columns.ts | `src/grid-columns.ts` (new), `src/tsgrid.ts` | ~250 | Under budget | PR 1 |
| Phase 2 — grid-state.ts | `src/grid-state.ts` (new), `src/tsgrid.ts` | ~400 | At limit | PR 2 |
| Phase 3 — grid-data.ts | `src/grid-data.ts` (new), `src/tsgrid.ts` | ~750 | EXCEEDS | PR 3 — chained |
| Phase 4 — grid-selection.ts | `src/grid-selection.ts` (new), `src/tsgrid.ts` | ~500 | EXCEEDS | PR 4 — chained |
| Phase 5 — grid-edit.ts | `src/grid-edit.ts` (new), `src/tsgrid.ts` | ~520 | EXCEEDS | PR 5 — chained |
| Phase 6 — grid-search.ts | `src/grid-search.ts` (new), `src/tsgrid.ts` | ~1,500 | EXCEEDS | PR 6 — chained |
| Phase 7 — grid-interaction.ts | `src/grid-interaction.ts` (new), `src/tsgrid.ts` | ~1,400 | EXCEEDS | PR 7 — chained |
| Phase 8 — grid-render.ts | `src/grid-render.ts` (new), `src/tsgrid.ts` | ~3,000+ | EXCEEDS | PR 8 — chained, largest |
| Phase 9 — Release prep | `CHANGELOG.md`, `README.md`, `package.json`, `MIGRATION_v2.md` | ~50 | Under budget | PR 9 or merge into PR 8 |

**Estimated total changed lines (added + deleted)**: ~8,500+
**Files touched**: 12 (8 new + 4 modified)
**400-line budget risk**: High
**Chained PRs recommended**: Yes
**Suggested split**: Phase 0 as one small isolated PR; each extraction phase as its own chained PR in topo order; Phase 9 release prep in a final PR
**Decision needed before apply**: Yes
**Rationale**: Phases 3–8 individually exceed the 400-line review budget. Phases 6, 7, and 8 are 3–7x over budget. Chained-PR strategy is mandatory per design R7. Each phase is a clean extraction with its own `pnpm verify` gate, making it a natural PR boundary.

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| PR 0 | BC-1 event sig fix + baseline + migration doc | PR 0 → master | Small, mechanical, ships independently |
| PR 1 | grid-columns.ts extraction | PR 1 → feature/tsgrid-v2-core | Lowest coupling, safest first slice |
| PR 2 | grid-state.ts extraction | PR 2 → PR 1 branch | Leaf; ~400 lines, at limit |
| PR 3 | grid-data.ts extraction | PR 3 → PR 2 branch | grid-state dependency; largest non-render |
| PR 4 | grid-selection.ts extraction | PR 4 → PR 3 branch | grid-data dependency |
| PR 5 | grid-edit.ts extraction | PR 5 → PR 4 branch | grid-state dependency |
| PR 6 | grid-search.ts extraction | PR 6 → PR 5 branch | Leaf; largest search surface |
| PR 7 | grid-interaction.ts extraction | PR 7 → PR 6 branch | Leaf; event-heavy |
| PR 8 | grid-render.ts extraction (incl. HTML) | PR 8 → PR 7 branch | Riskiest; scroll() extracted last within PR |
| PR 9 | Release prep: version bump, CHANGELOG, README | PR 9 → PR 8 branch | No source changes |

---

## Strict TDD Note

This project has `strict_tdd: true` (init #722). However, v2.0 is a **structural refactor**, not a behavior addition. The TDD red-green-refactor cycle (write failing test → make it pass → clean up) applies to new behavior, not to moving existing behavior between files while keeping the public API identical.

**Gate for this change**: existing tests MUST keep passing after each phase — the 84 Vitest unit tests and 38 Playwright smoke tests are the invariant, not a red-green cycle. No new unit tests are added per phase (per design R13: sub-modules need a full `TsGrid` instance to run, making them non-unit-testable in v2.0). Per-module tests are deferred to a future minor.

The `pnpm verify` command at the end of each phase is the substitute gate.

---

## Phase 0 — Baseline + BC-1

- [x] Task 0.1: Record `dist/tsgrid-ui.es6.js` byte size as the ±2% baseline. Save the value in a comment at the top of `MIGRATION_v2.md` under a `<!-- baseline: N bytes -->` marker so Phase 9 can compare it.
- [x] Task 0.2: In `src/tsgrid.ts`, replace the type of all 45 `on*` event handler property declarations from `((event: CustomEvent) => void) | null` to `((event: TsEventPayload) => void) | null`. Verify `TsEventPayload` is already imported (it is — from `./tsbase`). Do not change any method body.
- [x] Task 0.3: In `src/tsform.ts`, replace the type of all 13 `on*` event handler property declarations from `((event: CustomEvent) => void) | null` to `((event: TsEventPayload) => void) | null`. Same import check.
- [x] Task 0.4: In `src/tsfield.ts`, replace the 4 inline callback type annotations `(event: CustomEvent)` with `(event: TsEventPayload)`. These are inline arrow function annotations in field setup code, not class property declarations.
- [x] Task 0.5: Update `test/consumer-smoke.ts` — change any typed handler annotations from `CustomEvent` to `TsEventPayload` to align with the new declarations. This is a mandatory co-deliverable with BC-1 (spec CCR-6). Add a `TsEventPayload` import from `tsgrid-ui` if not already present.
- [x] Task 0.6: Run `pnpm verify` (lint + typecheck + consumer-smoke + test:unit + smoke). BLOCKING GATE — all checks must pass before Phase 1 starts. Note: smoke requires `pnpm build` first per init #722.
- [x] Task 0.7: Create `MIGRATION_v2.md` at the repo root with: (a) BC-1 explanation, (b) codemod regex from design §8 (`\(event:\s*CustomEvent\)\s*=>` → `(event: TsEventPayload) =>`), (c) codemod caveats (false positives on unrelated DOM handlers; `event.detail` needs explicit cast), (d) BC-2 explanation (deep-import path break), (e) before/after example using `test/consumer-smoke.ts`, (f) baseline bytes marker for Phase 9.

**Spec links**: Req 1.1, 1.2, 1.3, 4.1, 4.5, CCR-3, CCR-6

---

## Phase 1 — grid-columns.ts extraction

- [ ] Task 1.1: Create `src/grid-columns.ts`. Export plain functions `addColumn(grid: TsGrid, column, before?)`, `removeColumn(grid: TsGrid, field)`, `getColumn(grid: TsGrid, field)`, `updateColumn(grid: TsGrid, field, changes)`, `toggleColumn(grid: TsGrid, field, visible?)`, `showColumn(grid: TsGrid, ...fields)`, `hideColumn(grid: TsGrid, ...fields)`. Use `import type { TsGrid } from './tsgrid'`. Move the ~235 LOC bodies verbatim from `src/tsgrid.ts`. Use `const self = grid` where the original uses `const self = this`.
- [ ] Task 1.2: In `src/tsgrid.ts`, add `import * as gridColumns from './grid-columns'` and replace each column method body with a single delegator call, e.g., `addColumn(column, before?) { return gridColumns.addColumn(this, column, before) }`. Remove the moved LOC.
- [ ] Task 1.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 2 — grid-state.ts extraction

- [ ] Task 2.1: Create `src/grid-state.ts`. Export plain functions covering: `stateSave`, `stateRestore`, `stateReset`, `lock`, `unlock`, `status`, `parseField`, `prepareData`, `nextCell`, `prevCell`, `nextRow`, `prevRow`, `selectionSave`, `selectionRestore`, `message`, `confirm`. ~390 LOC. Same `import type { TsGrid }` and `const self = grid` pattern.
- [ ] Task 2.2: In `src/tsgrid.ts`, add `import * as gridState from './grid-state'` and replace each state method body with a delegator. Remove moved LOC.
- [ ] Task 2.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 3 — grid-data.ts extraction

- [ ] Task 3.1: Create `src/grid-data.ts`. This is the largest non-render module (~910 LOC). Export plain functions covering: CRUD ops (`add`, `find`, `set`, `replace`, `get`, `remove`, `processGroupBy`), I/O ops (`clear`, `reset`, `load`, `reload`, `request`, `save`), **`localSort` and `localSearch`** (per design Q5 resolution — these live here, not in grid-search.ts), and range ops (`getRangeData`, `addRange`, `removeRange`, `refreshRanges`). Import `import type { TsGrid } from './tsgrid'`. Import `import * as gridState from './grid-state'` for state-dependent calls (per DAG: grid-data → grid-state is allowed).
- [ ] Task 3.2: In `src/tsgrid.ts`, add `import * as gridData from './grid-data'` and replace each data method body with a delegator. Remove moved LOC.
- [ ] Task 3.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 4 — grid-selection.ts extraction

- [ ] Task 4.1: Create `src/grid-selection.ts`. Export plain functions: `select`, `unselect`, `compareSelection`, `selectAll`, `selectNone`, `updateToolbar`, `getSelection`, `getSelectionData`. ~490 LOC. Import `import type { TsGrid } from './tsgrid'` and `import * as gridData from './grid-data'` (per DAG: grid-selection → grid-data allowed).
- [ ] Task 4.2: In `src/tsgrid.ts`, add `import * as gridSelection from './grid-selection'` and replace each selection method body with a delegator. Remove moved LOC.
- [ ] Task 4.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 5 — grid-edit.ts extraction

- [ ] Task 5.1: Create `src/grid-edit.ts`. Export plain functions: `editField`, `editChange`, `editDone`. ~505 LOC. Import `import type { TsGrid } from './tsgrid'` and `import * as gridState from './grid-state'` (per DAG: grid-edit → grid-state allowed).
- [ ] Task 5.2: In `src/tsgrid.ts`, add `import * as gridEdit from './grid-edit'` and replace each edit method body with a delegator. Remove moved LOC.
- [ ] Task 5.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 6 — grid-search.ts extraction

- [ ] Task 6.1: Create `src/grid-search.ts`. Export plain functions: `addSearch`, `removeSearch`, `getSearch`, `toggleSearch`, `showSearch`, `hideSearch`, `search`, `searchOpen`, `searchClose`, `searchSave`, `searchSuggest`, `searchReset`, `searchShowFields`, `searchInitInput`, `searchCache`, `searchCacheSave`, `searchFieldTooltip`. ~1,300 LOC. This is the largest leaf module. Import `import type { TsGrid } from './tsgrid'` only — FORBIDDEN: do NOT import from `grid-data.ts` directly (per design §4 cycle prevention). Cross-domain calls use `grid.localSearch()` delegator on TsGrid prototype. Flag R10 risk: `getSearchesHTML` has large inline templates — move verbatim, do not refactor.
- [ ] Task 6.2: In `src/tsgrid.ts`, add `import * as gridSearch from './grid-search'` and replace each search method body with a delegator. Remove moved LOC.
- [ ] Task 6.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 7 — grid-interaction.ts extraction

- [ ] Task 7.1: Create `src/grid-interaction.ts`. Export plain functions: `click`, `columnClick`, `dblClick`, `contextMenu`, `sort`, `copy`, `paste`, `keydown`, `expand`, `collapse`, `focus`, `blur`, `scrollIntoView`. ~1,380 LOC. Import `import type { TsGrid } from './tsgrid'` only — FORBIDDEN: do NOT import from `grid-render.ts` or vice versa (per design §4). Cross-domain calls go through `grid.X()` delegator.
- [ ] Task 7.2: In `src/tsgrid.ts`, add `import * as gridInteraction from './grid-interaction'` and replace each interaction method body with a delegator. Remove moved LOC.
- [ ] Task 7.3: Run `pnpm verify`. BLOCKING GATE.

**Spec links**: Req 2.2, 3.1, CCR-1, CCR-2

---

## Phase 8 — grid-render.ts extraction (LAST — riskiest)

- [ ] Task 8.1: Create `src/grid-render.ts` with the render orchestration methods first (excluding `scroll()`): `refresh`, `resize`, `refreshBody`, `refreshSearch`, `refreshCell`, `refreshRow`, `update`, `destroy`, `init*` methods. ~2,550 LOC of the ~2,820 total. Include ALL HTML generator functions in this same file (design §1: `grid-html.ts` merged here — `getCellHTML`, `getFooterHTML`, `getSearchesHTML`, `getColumnCellHTML`, `getColumnsHTML`, `getRecordsHTML`, `getSummaryHTML`, etc.). Import `import type { TsGrid } from './tsgrid'`; import `import * as gridData from './grid-data'` and `import * as gridSelection from './grid-selection'` (per DAG). Flag R10: `getFooterHTML`/`getSearchesHTML` have voluminous inline templates — move verbatim.
- [ ] Task 8.2: In `src/tsgrid.ts`, add `import * as gridRender from './grid-render'` and replace all render/HTML method bodies with delegators (excluding `scroll()`). Remove moved LOC.
- [ ] Task 8.3: Extract `scroll()` (tsgrid.ts line ~8728, ~270 LOC) into `grid-render.ts` as the FINAL extraction step. Per design R11: `scroll()` is the riskiest method — it interleaves `getColumnCellHTML`, `getCellHTML`, `getColumnsHTML`, `getRecordsHTML`, `getSummaryHTML` with `resizeRecords()`. After adding `scroll` to `grid-render.ts` and the delegator to `tsgrid.ts`, run `pnpm build && pnpm smoke` immediately as a focused Playwright gate before the full verify.
- [ ] Task 8.4: Run `pnpm verify`. BLOCKING GATE. This is the final extraction gate — `tsgrid.ts` should now be ~1,500–1,700 LOC (orchestrator shell with fields + constructor + delegators).

**Spec links**: Req 2.2, 3.1, 5.2, CCR-1, CCR-2

---

## Phase 9 — Final verification + release prep

- [ ] Task 9.1: Measure `dist/tsgrid-ui.es6.js` byte size. Compare against the baseline recorded in Task 0.1. Verify within ±2% of baseline (spec Req 5.2). If regression exceeds +2%, block release and investigate. Document the result in `MIGRATION_v2.md`.
- [ ] Task 9.2: Update `CHANGELOG.md` — add v2.0.0 entry with: (a) BC-1 event handler type change, (b) BC-2 deep-import path note, (c) explicit no-bundle-reduction disclosure: "v2.0 decomposes the codebase for maintainability. Bundle size is unchanged by design. Bundle improvements deferred to v2.2.", (d) link to `MIGRATION_v2.md` (spec Req 5.1, 5.3, 3.3).
- [ ] Task 9.3: Update `README.md` — add a v2.0 migration callout under a prominent header, pointing to `MIGRATION_v2.md`. One short paragraph, no false bundle claims.
- [ ] Task 9.4: Run full `pnpm verify`. FINAL BLOCKING GATE. Zero errors required (spec CCR-2).
- [ ] Task 9.5: Bump `package.json` `"version"` to `"2.0.0"`. Do not publish — user decides when to publish (per task constraint).
- [ ] Task 9.6: Prepare release notes in a scratch section of `MIGRATION_v2.md` under `## Release checklist` — list tag command (`git tag v2.0.0`), dist-tag command (`npm publish --tag latest`), optional RC command (`npm publish --tag next`). Do NOT execute these — leave as reference for user.

**Spec links**: Req 3.3, 5.1, 5.2, 5.3, CCR-2, CCR-4

---

## Verification gates per phase

| Phase | Gate command | Pass criterion |
|-------|-------------|----------------|
| 0 | `pnpm build && pnpm verify` | All lint + typecheck + consumer-smoke + 84 unit + 38 Playwright pass |
| 1 | `pnpm verify` | Same as above |
| 2 | `pnpm verify` | Same as above |
| 3 | `pnpm verify` | Same as above |
| 4 | `pnpm verify` | Same as above |
| 5 | `pnpm verify` | Same as above |
| 6 | `pnpm verify` | Same as above |
| 7 | `pnpm verify` | Same as above |
| 8 (pre-scroll) | `pnpm verify` | Same as above |
| 8 (post-scroll) | `pnpm build && pnpm smoke` then `pnpm verify` | Playwright smoke first, then full verify |
| 9 | `pnpm verify` | Zero errors; bundle ±2% gate; tsgrid.ts ~1,500–1,700 LOC |

---

## Risk-driven sequencing

**R11 — `scroll()` extracted last within Phase 8**: `scroll()` at tsgrid.ts:~8728 (~270 LOC) is the method most deeply entangled with HTML generators. It is extracted as the final step inside Phase 8 (Task 8.3), with an immediate Playwright smoke gate before the full verify.

**R3 — Delegator pattern for cross-domain calls**: `grid-search.ts` MUST NOT import `grid-data.ts` directly (cycle risk). It calls `grid.localSearch()` through the TsGrid delegator prototype. Same for `grid-interaction.ts` and `grid-render.ts` — no cross-import. All inter-domain calls route through `grid.X()`.

**R13 — No per-module unit tests**: PR descriptions for Phases 1–8 MUST state explicitly: "Do NOT add per-module unit tests in this PR. Sub-modules require a full TsGrid instance; per-module tests are deferred to a future minor." The existing 84 Vitest + 38 Playwright tests are the invariant gate.

**R10 — Large inline templates**: `getFooterHTML`, `getSearchesHTML`, and HTML generators in Phase 8 have voluminous inline templates. Move these verbatim — do not refactor or extract string literals. Refactoring increases risk during migration.

**R9 — Nested closures in `update()`**: The `update()` method contains a nested `_update()` closure. When extracting to `grid-render.ts`, use `const self = grid` pattern verbatim from the original — do not flatten the closure structure.

**R8 — Shared helpers**: If any helper function is referenced by more than one sub-module, place it in `grid-state.ts` (the lowest shared dependency in the DAG), not in `grid-render.ts`.
