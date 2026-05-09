# SDD Proposal: tsgrid-v2-core

**Status**: ready
**Phase input**: exploration #742 (`sdd/tsgrid-v2-core/explore`)
**Recommended approach**: Strategy D (Hybrid — sibling file imports with `(grid: TsGrid)` parameter)
**Target version**: v2.0.0 (SEMVER MAJOR)
**Author**: sdd-propose phase
**Date**: 2026-05-09

---

## 1. Intent

### Problem

`src/tsgrid.ts` is a 9,684-LOC monolithic class with 95 methods spanning nine distinct responsibilities (data, columns, search, selection, edit, render, HTML generation, interaction, state). Maintenance cost is high: any change requires loading the entire file mentally, and shared mutable state on `this.last`, `this.records`, `this.columns` makes refactors risky. Additionally, every public event handler property (`onSelect`, `onClick`, `onChange`, etc.) is declared as `((event: CustomEvent) => void) | null`, but the runtime ALWAYS dispatches `TsEventPayload`. Consumers who type their handlers correctly are misled by the `.d.ts` and either cast to `any` or accept incorrect IntelliSense.

### Why now

1. **v1.0.1 is shipped and stable** — public API is locked; we have a stable baseline to break against.
2. **v1.1.0 was cancelled (#736)** because predicting bundle reduction without architectural change was a flawed premise. Decomposition is the prerequisite, not the alternative.
3. **`TsEventPayload` exists since v1.0.1** (#722) and is already exported from the public barrel — the type is ready, the declarations just need to match it.
4. **Staging is locked**: v2.0 = decomp + event sigs only; v2.1 = TsUtils; v2.2 = multi-entry (#740).

### Success criteria

- `src/tsgrid.ts` shrinks from ~9,684 LOC to a thin orchestrator (target: under 2,000 LOC; the rest lives in domain sibling files).
- All 58 `(event: CustomEvent) => void` declarations across `tsgrid.ts`, `tsform.ts`, and inline `tsfield.ts` callbacks are corrected to `(event: TsEventPayload) => void`.
- All 84 unit tests pass; all 38 Playwright smoke tests pass; consumer-smoke compiles after a documented migration step.
- Bundle size after build is **equal to or within ±2% of the pre-v2.0 baseline** (no regression; no claim of reduction).
- Public method signatures of `TsGrid` are **unchanged**. Consumers who do not type event handlers see zero behavioral or type changes.

---

## 2. Scope

### In scope (v2.0)

- Decompose `src/tsgrid.ts` into nine sibling domain files using Strategy D (hybrid).
- `tsgrid.ts` retained as the public class; each method delegates to a sibling-file function `(grid: TsGrid, ...args) => ...`.
- Correct event handler property types from `CustomEvent` to `TsEventPayload` in:
  - `src/tsgrid.ts` (45 declarations, lines ~395–445)
  - `src/tsform.ts` (13 declarations, lines ~105–119)
  - `src/tsfield.ts` (4 inline callback annotations, lines 1766, 1770, 1808, 1845)
- Update `test/consumer-smoke.ts` to reflect the corrected event handler types.
- Add a `MIGRATION_v2.md` (or README section) documenting the breaking change and the codemod-style replacement.

### Out of scope (explicit non-goals — see §4)

- TsUtils refactor (deferred to v2.1)
- Multi-entry / subpath exports (deferred to v2.2)
- Bundle size REDUCTION (Strategy D produces zero reduction by design)
- `[key: string]: any` cleanup
- Domain-specific `TsEventPayload<T>` generics (e.g., narrowing `onSelect` to `TsEventPayload<{ recid: RecId }>`)
- Runtime `.on(eventName, handler)` overload typing
- Touching `tstoolbar.ts` (already typed `any`, not a property declaration)
- Touching `tslayout.ts`, `tspopup.ts`, `tstabs.ts`, `tssidebar.ts` (already clean)

---

## 3. Breaking changes (individual rationale)

This is a SEMVER MAJOR release. Each break is justified individually, NOT bundled under "it's v2.0".

### BC-1 — Event handler property type changes from `CustomEvent` to `TsEventPayload`

**WHAT**: All 45 `on*` properties on `TsGrid` and all 13 `on*` properties on `TsForm` change their declared type from `((event: CustomEvent) => void) | null` to `((event: TsEventPayload) => void) | null`. The 4 inline callback type annotations in `tsfield.ts` change correspondingly.

**WHO is affected**:
- Consumers who write typed handlers, e.g. `grid.onSelect = (event: CustomEvent) => { ... }` will receive a TypeScript compile error after upgrading.
- Consumers using untyped handlers (`grid.onSelect = (event) => { ... }`) or `event: any` are unaffected at compile time.
- Runtime behavior is **identical** — the runtime has always dispatched `TsEventPayload`. This is a type-system correction, not a runtime change.

**WHY (user value)**:
- IntelliSense becomes truthful. Today, typing `event.detail` produces wrong autocomplete because `CustomEvent.detail` is `unknown` whereas `TsEventPayload` exposes the real shape (`target`, `phase`, `type`, `detail`, `done`, `preventDefault`, etc.).
- Eliminates a class of consumer bugs where users believed `event.detail` was a DOM CustomEventInit detail (it isn't — `TsEventPayload` is its own shape).
- Closes the discrepancy documented in `tsbase.ts` (lines 30–32) since v1.0.1.

**HOW to migrate**:
- **Codemod-friendly**: a single find-and-replace at consumer level: `(event: CustomEvent) =>` → `(event: TsEventPayload) =>` on any handler attached to a `TsGrid`/`TsForm` `on*` property. The regex `\(event:\s*CustomEvent\)\s*=>` covers ~99% of cases.
- Import `TsEventPayload` from `tsgrid-ui` (already exported in v1.0.1, confirmed in #722).
- Provide a `MIGRATION_v2.md` snippet showing before/after.

### BC-2 — Internal restructure of `src/tsgrid.ts` (file-level breaking change for source-importers only)

**WHAT**: Code that previously lived in `src/tsgrid.ts` will be redistributed across nine sibling files (`src/grid-*.ts`). The exported `TsGrid` class and its public methods remain identical.

**WHO is affected**:
- Consumers who import directly from `tsgrid-ui` (the public barrel) — **NOT affected**. The barrel re-exports `TsGrid` unchanged.
- Consumers who deep-import from internal paths (e.g., `import { something } from 'tsgrid-ui/src/tsgrid'`) — affected. This was never a documented or supported path.
- Consumers using `[key: string]: any` to attach ad-hoc properties to a `TsGrid` instance — **NOT affected** (the index signature remains).
- Consumers extending `TsGrid` via `class MyGrid extends TsGrid` — **NOT affected** at the class API level. Behavior of overridden methods is preserved because every public method body is `return moduleFn(this, ...args)`.

**WHY (user value)**:
- Maintainability: domain bug fixes touch ~500–1,500 LOC files instead of one ~10k LOC file.
- Future-proofing: the sibling-file structure is the prerequisite for v2.2 multi-entry tree-shaking. Without it, no subpath could ever produce a smaller bundle.
- Reviewability: PRs touching one domain (e.g., search) are reviewable without scrolling past unrelated edit/render code.

**HOW to migrate**: For supported public-API consumers, **no migration needed**. For deep-import consumers, switch to the public barrel (`import { TsGrid } from 'tsgrid-ui'`). Document this in `MIGRATION_v2.md`.

### Combined breaking-change scope

Two breaking changes total. Both are deliberate; both pass the user-value test from #739/#740. There are no other public-API breakages introduced by this proposal.

---

## 4. Non-goals (explicit)

The following are **NOT delivered in v2.0** and any expectation otherwise must be challenged:

| Non-goal | Reason | Future home |
|---|---|---|
| Bundle size reduction | Strategy D produces zero reduction. Single barrel imports all sibling files. | v2.2 (multi-entry, with measured evidence per #736 lesson) |
| TsUtils refactor | 2,733 LOC singleton; out-of-scope per #740 | v2.1 |
| Multi-entry / subpath exports | Architecturally meaningful only after both decompositions | v2.2 |
| `[key: string]: any` cleanup | Removing escape hatches breaks unknown consumers; not justified by v2.0 user value | Possibly never |
| Domain-specific `TsEventPayload<T>` generics | DX upgrade, but multiplies API surface and breaking-change count | Future minor (v2.x) as additive overloads |
| `.on(eventName, handler)` overload typing | Separate concern from class-field declarations | Future minor (v2.x) |
| Tree-shaking validation | Cannot be validated until multi-entry exists | v2.2 |
| Runtime behavior changes | This is a code-org + types release, not a behavior change | n/a |

---

## 5. Deliverables

### Source files (new)

| File | Role | Approx. LOC | Source domain in old `tsgrid.ts` |
|---|---|---|---|
| `src/grid-columns.ts` | Column management functions | ~235 | Column cluster (lines ~1063–1296) |
| `src/grid-data.ts` | Records CRUD, data load/save, `localSort`, `localSearch` | ~910 | Data/Records cluster + Data I/O cluster + localSort/localSearch |
| `src/grid-search.ts` | Search/filter UI, ranges, search HTML init (excluding `localSort`/`localSearch`) | ~1,300 | Search cluster minus localSort/localSearch |
| `src/grid-selection.ts` | Selection state, selectAll, getSelection* | ~490 | Selection cluster |
| `src/grid-edit.ts` | Inline editing | ~505 | Editing cluster |
| `src/grid-render.ts` | Layout, resize, refresh*, scroll | ~1,290 | Rendering cluster minus templates |
| `src/grid-html.ts` | HTML template generation (`getRecordsHTML`, `getColumnsHTML`, `getSearchesHTML`, etc.) | ~1,530 | HTML generation cluster |
| `src/grid-interaction.ts` | Click/keydown/contextMenu/sort/copy/paste handlers | ~1,380 | Interaction cluster |
| `src/grid-state.ts` | stateSave/Restore, lock/unlock, status, parseField, prepareData, nextCell/prevCell | ~390 | State/Utility cluster |

### Source files (modified)

| File | Modification |
|---|---|
| `src/tsgrid.ts` | Becomes thin orchestrator. Retains class declaration, properties, event handler declarations (with corrected types), and method bodies that delegate to sibling-file functions. Estimated final size: ~1,500–2,000 LOC. |
| `src/tsform.ts` | Event signature fix only: 13 `CustomEvent` → `TsEventPayload` declarations. No structural change. |
| `src/tsfield.ts` | Event signature fix only: 4 inline callback annotations corrected. No structural change. |

### Test files (modified)

| File | Modification |
|---|---|
| `test/consumer-smoke.ts` | Update event handler typings to use `TsEventPayload`. |

### Documentation

| File | Content |
|---|---|
| `MIGRATION_v2.md` (or README section) | Codemod for `CustomEvent` → `TsEventPayload`; note about deep-import path removal; explicit "no bundle reduction in v2.0; bundle improvements arrive in v2.2" disclosure. |
| `CHANGELOG.md` | v2.0.0 entry: BC-1 and BC-2, with explicit "no bundle reduction in v2.0" disclaimer. |

### Files NOT touched

- `src/tsutils.ts`, `src/tsbase.ts`, `src/tsevent.ts`, `src/tslocale.ts`, `src/types.ts`
- `src/tslayout.ts`, `src/tspopup.ts`, `src/tstabs.ts`, `src/tssidebar.ts`, `src/tstoolbar.ts`, `src/tstooltip.ts` (no `CustomEvent` declarations to fix)
- `src/index.ts`, `src/index-legacy.ts` (no public surface changes)
- `tsup.config.ts`, `tsconfig.json`, `package.json` (no build pipeline changes)
- `gulpfile.js`, `scripts/wrap-legacy.mjs`

---

## 6. Open question resolutions

The five open questions from explore #742 are resolved here.

### Q1 — Extraction order

**Resolution**: Extract in dependency-aware sequence, columns-first.

Recommended order (lowest coupling first):
1. **`grid-columns.ts`** — lowest coupling (~235 LOC; only `this.columns`/`this.columnGroups`/`this.last.colResizing`). Safe pilot extraction; validates the Strategy D pattern with minimal risk.
2. **`grid-state.ts`** — small (~390 LOC), mostly utility methods (`stateSave`, `lock`, `parseField`, `nextCell`). Few cross-domain calls.
3. **`grid-selection.ts`** — medium (~490 LOC). Touches `records`, `columns`, `last.selection`, `toolbar`, but does not call into edit/search.
4. **`grid-data.ts`** — includes `localSort`/`localSearch` (Q5 resolution). Foundational for search and interaction.
5. **`grid-edit.ts`** — depends on data + selection.
6. **`grid-search.ts`** — depends on data (calls `localSort`/`localSearch`).
7. **`grid-html.ts`** — pure template generation; depends on columns/records/searches/selection.
8. **`grid-render.ts`** — depends on html + state.
9. **`grid-interaction.ts`** — touches everything; extracted last.

This order minimizes integration conflicts: each step can run `pnpm verify` independently before moving on.

### Q2 — `TsEventPayload` generic depth

**Resolution**: Use bare `TsEventPayload` (no type param; defaults to `TsEventPayload<unknown>`) for all 58 declaration sites.

Rationale:
- Adding domain-specific generics (`TsEventPayload<{ recid: RecId }>` for `onSelect`, etc.) would be a 45-event surface explosion of decisions, each requiring runtime verification of the actual payload shape.
- Bare `TsEventPayload` is type-safe, matches the runtime, and is the minimum correct change.
- Domain-specific generics are valid future DX work for v2.x minor releases (additive overloads — non-breaking).
- This keeps the v2.0 breaking-change count at 2 (BC-1, BC-2) and avoids scope creep.

### Q3 — Internal vs public boundary

**Resolution**: Scope the fix to **class field declarations only** (the `on*` properties). The `.on(eventName, handler)` registration API typing is OUT of scope for v2.0.

Rationale:
- The class fields are what the `.d.ts` rollup exposes most prominently and what consumers reference directly (`grid.onSelect = ...`).
- The runtime `.on()` API is a separate concern with its own typing complexity (event name → payload type mapping). Addressing it requires either string-literal types or a discriminated event registry — both larger architectural decisions.
- Doing both at once doubles the breaking-change risk and conflates two unrelated improvements.

### Q4 — TsUtils sequencing risk

**Resolution**: No sequencing problem. `TsUtils.extend` calls remain unchanged.

Verification:
- Sibling files (`grid-data.ts`, `grid-search.ts`, etc.) will each `import TsUtils from './tsutils.js'` (or equivalent) and call `TsUtils.extend(...)` exactly as `tsgrid.ts` does today.
- No method bodies are rewritten; they are MOVED with all `TsUtils.*` calls intact.
- v2.1 (TsUtils refactor) will replace these calls in a future release, but that work is independent of v2.0 decomposition.
- Confirmed in #740: "Tasks de v2.0 NO deben tocar tsutils.ts".

### Q5 — `localSort` / `localSearch` placement

**Resolution**: Place `localSort` and `localSearch` in `grid-data.ts`, NOT in `grid-search.ts`.

Rationale:
- Their **primary callers** are data operations: `add`, `set`, `replace`, `load`, `requestComplete`, `mergeChanges` all call `localSort`/`localSearch` to refresh derived data.
- The Search cluster also calls them, but the call direction is `search → data.localSort` (search invokes data ops to refresh after a filter changes), not the reverse.
- Placing them in `grid-search.ts` would require `grid-data.ts` to import from `grid-search.ts`, creating a high-traffic module dependency edge that runs counter to the cluster's natural ownership.
- Placing them in `grid-data.ts` keeps the dependency graph one-directional: search depends on data; data does not depend on search.
- This avoids the cycle risk explicitly flagged as risk #3 in explore #742.

Architectural note: even though these methods conceptually "filter and sort", they operate on `this.records` and produce derived state stored on the grid itself. Their identity is data-side, not search-UI-side.

---

## 7. Test / verification plan

### Existing test suite (must pass unchanged)

- `pnpm lint` — 0 errors, 0 new warnings.
- `pnpm typecheck` — `tsc --noEmit` clean across all `src/*.ts`.
- `pnpm test:unit` — all 84 Vitest unit tests pass.
- `pnpm smoke` — all 38 Playwright tests pass (chromium-only).

### Test suite that requires updates

- `pnpm consumer-smoke` (`test/consumer-smoke.ts`) — REQUIRES updates. The `CustomEvent` → `TsEventPayload` change is intentionally consumer-visible. Update event handler annotations to import `TsEventPayload` from `tsgrid-ui` and type handlers accordingly. After update, the file must compile clean.

### Bundle size verification

- **Pre-implementation baseline**: run `pnpm build` on master before any change; record `dist/tsgrid-ui.es6.js` byte size, `dist/tsgrid-ui.js` byte size, gzip sizes.
- **Post-implementation comparison**: run `pnpm build` after v2.0 implementation; compare. Acceptable range: ±2% of baseline. **Reduction is NOT expected.** Any regression > 2% is a blocker for release (indicates accidental duplication or import bloat).
- **No tree-shake validation in v2.0** — meaningless without multi-entry.

### Public API preservation verification

- Generate `dist/tsgrid-ui.d.ts` after implementation; diff against pre-implementation `.d.ts` rollup.
- Acceptable diff: only the 58 event handler signature changes (`CustomEvent` → `TsEventPayload`).
- Any other `.d.ts` change in the `TsGrid` / `TsForm` / `TsField` public surface is a regression.

### Module-level verification

- Each new `src/grid-*.ts` file must:
  - Be importable from `src/tsgrid.ts` with no runtime error.
  - Compile in isolation (verified by `tsc --noEmit`).
  - Export functions whose first parameter is `grid: TsGrid`.
- TsGrid public method bodies must be reduced to one-line delegations: `methodName(...args) { return gridDomain.methodName(this, ...args) }`.

### Verification chain

`pnpm verify` (lint + typecheck + consumer-smoke + test:unit + smoke) must succeed end-to-end before tagging v2.0.0.

---

## 8. Risks and mitigations

Refined from explore #742 risks.

### R1 — `this.last` as universal coupling

**Risk**: Every domain accesses `this.last`. Sibling-file modules cannot be independently testable without a full `TsGrid` instance.

**Mitigation**:
- Accept this constraint; v2.0 is not introducing unit testability of sub-modules.
- Sibling-file functions take `grid: TsGrid` as the first param, which preserves access to `this.last` cleanly.
- Future work (v2.x or v3) could introduce a `GridContext` interface for sub-module testing — explicitly out of scope here.
- Rely on existing 38 Playwright + 84 unit tests for behavior validation.

### R2 — Event signature change is a typed breaking change

**Risk**: All consumers who type `(event: CustomEvent) =>` handlers see TS errors.

**Mitigation**:
- Document in `MIGRATION_v2.md` with a one-line codemod regex.
- Tag release as v2.0.0 (SEMVER MAJOR) so semver tooling alerts consumers.
- CHANGELOG entry calls this out explicitly with before/after example.
- `TsEventPayload` is already exported in v1.0.1 — consumers can prepare BEFORE upgrading by switching their handlers (the type was always assignable).

### R3 — `localSort` / `localSearch` placement cycle risk

**Risk**: If misplaced in `grid-search.ts`, creates a cycle (data → search → data).

**Mitigation**: Resolved by Q5 — placed in `grid-data.ts`. Dependency graph remains acyclic: `interaction → render → html → {columns, data, search, selection, edit, state}`; `search → data`; never `data → search`.

### R4 — HTML generation tightly coupled to render

**Risk**: `getSearchesHTML`, `getColumnsHTML`, `getRecordsHTML` reference `this.name`, `this.box`, `this.columns`, etc. Splitting render and html into two files may reveal hidden coupling.

**Mitigation**:
- Apply Q1 extraction order: `grid-html.ts` is extracted BEFORE `grid-render.ts`. If splitting reveals coupling that requires a circular import, fall back to a single `grid-render.ts` that contains both layout and templates (collapse R4 contingency: 8 sibling files instead of 9).
- Document the fallback explicitly in the design phase. Either outcome is acceptable; the goal is correctness, not file count.

### R5 — Zero bundle improvement in v2.0

**Risk**: Stakeholders or users expect a smaller bundle from "decomposition".

**Mitigation**:
- CHANGELOG, README, and migration guide all contain the disclaimer: "v2.0 decomposes the codebase for maintainability. Bundle size is unchanged. Bundle reductions arrive in v2.2 with multi-entry exports."
- Internal honesty: do not write a blog post, tweet, or release note that implies otherwise.
- Per #736 lesson: never claim a bundle benefit without measured evidence from a real consumer.

### R6 — Consumer-smoke test must be updated

**Risk**: `test/consumer-smoke.ts` will fail typecheck after BC-1 lands, blocking `pnpm verify`.

**Mitigation**:
- Update consumer-smoke as part of the same PR/work-unit as BC-1.
- Treat the consumer-smoke update as a deliverable, not an afterthought. It is the canary for "did our public API change correctly?"
- Document the change in `MIGRATION_v2.md` so consumers can mirror the same fix in their own typecheck setups.

### R7 (new) — Long-running PR / review-budget risk

**Risk**: A single PR touching ~10k LOC across 11 files exceeds reasonable review capacity.

**Mitigation**:
- Apply the Review Workload Forecast in `sdd-tasks` phase. If chained PRs are recommended, deliver decomposition in slices following Q1 extraction order (one PR per domain, possibly grouped 2–3 domains per PR).
- BC-1 (event signatures) is small and self-contained — it can be its own first PR (the "easy win") to establish v2.0.0-pre tagging.
- Each PR runs full `pnpm verify` independently.

---

## 9. Versioning and release plan

### Version: v2.0.0

- **Semver**: MAJOR (breaking via BC-1, BC-2).
- **Tag**: `v2.0.0` on master after `pnpm verify` succeeds.
- **NPM dist-tag**: `latest` (replaces v1.0.1 `latest`).
- **Pre-release option**: optionally publish `v2.0.0-rc.1` first under `next` dist-tag for downstream validation against the Angular demo (`tsgrid-angular-example`) before promoting to `latest`.

### Release artifacts

- `dist/tsgrid-ui.{js,es6.js,d.ts,css,min.css}` rebuilt and committed (per init #722 convention: `dist/` is versioned).
- `CHANGELOG.md` v2.0.0 entry with:
  - `### Breaking changes` section listing BC-1 and BC-2.
  - **Explicit disclaimer**: "v2.0 introduces no bundle size reduction. The decomposition lays the groundwork for multi-entry exports in v2.2, where bundle improvements will be validated and disclosed with measured evidence."
  - Migration link to `MIGRATION_v2.md`.
- `MIGRATION_v2.md` (or README section) with:
  - Codemod snippet for the `CustomEvent` → `TsEventPayload` replacement.
  - Note that deep-import paths from `src/tsgrid` are no longer valid; switch to the public barrel.
  - List of files whose internal location changed (informational only).

### Release sequencing

1. Land BC-1 (event signatures) first — small, mechanical, high-confidence change.
2. Land decomposition in chained PRs per Q1 extraction order.
3. After all decomposition lands and `pnpm verify` is green: tag `v2.0.0`.
4. Publish to npm: `pnpm publish --tag latest`.
5. GitHub Release notes mirroring CHANGELOG entry, including the no-bundle-reduction disclosure.

### Rollback plan

- If post-release a critical regression is found, publish `v2.0.1` with the fix (preferred).
- If the regression is unfixable in <24h, deprecate v2.0.0 on npm with `pnpm deprecate` and publish `v2.0.1` reverting the regression. v1.0.1 remains installable via explicit version pin.

---

## Appendix — Phase next steps

After this proposal is accepted, the next SDD phases are:

- **`sdd-spec`** — formalize the behavior contract: which methods of `TsGrid` exist, their signatures, the `TsEventPayload` shape per event. This is the API-surface specification.
- **`sdd-design`** — formalize the architecture: file boundaries, function signatures of each `grid-*.ts` module, dependency graph, the "fallback to 8 files if html/render coupling is too tight" decision.

These two phases can run **in parallel** — spec defines WHAT the public surface guarantees; design defines HOW the internal split achieves it.
