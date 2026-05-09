# tsgrid-v2-core Specification

> New capability — no existing spec to delta against. This is the v2.0.0 public contract.

**Status**: ready
**Source proposal**: `sdd/tsgrid-v2-core/proposal` (#744)
**Target version**: v2.0.0 (SEMVER MAJOR)
**Date**: 2026-05-09

---

## Purpose

This spec defines the behavioral and type-level contract that `tsgrid-ui` v2.0.0 MUST satisfy toward all consumers. It covers what is guaranteed to remain stable, what is intentionally broken (BC-1, BC-2), and what is explicitly NOT guaranteed (deep imports, bundle reduction).

v1.x had no formal spec. This document is the baseline from which all future delta specs will be written.

---

## Out of Scope

The following are NOT part of the v2.0.0 contract and MUST NOT be claimed:

- Bundle size reduction (zero reduction is expected and disclosed)
- Tree-shaking support (requires multi-entry, deferred to v2.2)
- `.on(eventName, handler)` overload typing (deferred to future minor)
- Domain-specific `TsEventPayload<T>` generics (deferred to future minor)
- Independent sub-module testability without a full `TsGrid` instance
- Deep imports from internal paths (`tsgrid-ui/src/*`)
- TsUtils refactor (v2.1)
- Multi-entry / subpath exports (v2.2)
- Any runtime behavior change — v2.0 is a code-organization and type-system release only

---

## Capability 1: Event Handler Typing

### Requirement 1.1 — TsGrid `on*` properties use `TsEventPayload`

All 45 `on*` event handler properties on `TsGrid` SHALL declare the type `((event: TsEventPayload) => void) | null`. No `on*` property SHALL declare `CustomEvent` as the handler parameter type.

The complete list of affected properties is: `onAdd`, `onEdit`, `onRequest`, `onLoad`, `onDelete`, `onSave`, `onSelect`, `onClick`, `onDblClick`, `onContextMenu`, `onContextMenuClick`, `onColumnClick`, `onColumnDblClick`, `onColumnContextMenu`, `onColumnResize`, `onColumnAutoResize`, `onSort`, `onSearch`, `onSearchOpen`, `onSearchClose`, `onChange`, `onRestore`, `onExpand`, `onCollapse`, `onError`, `onKeydown`, `onToolbar`, `onColumnOnOff`, `onCopy`, `onPaste`, `onSelectionExtend`, `onEditField`, `onRender`, `onRefresh`, `onReload`, `onResize`, `onDestroy`, `onStateSave`, `onStateRestore`, `onFocus`, `onBlur`, `onReorderRow`, `onSearchSave`, `onSearchRemove`, `onSearchSelect`, `onColumnSelect`, `onColumnDragStart`, `onColumnDragEnd`, `onResizerDblClick`, `onMouseEnter`, `onMouseLeave`.

### Requirement 1.2 — TsForm `on*` properties use `TsEventPayload`

All 13 `on*` event handler properties on `TsForm` SHALL declare the type `((event: TsEventPayload) => void) | null`. No `on*` property on `TsForm` SHALL declare `CustomEvent` as the handler parameter type.

### Requirement 1.3 — TsField inline callback annotations use `TsEventPayload`

The 4 inline callback type annotations in `src/tsfield.ts` (at method-body sites where callbacks are passed to `.select()` / `.liveUpdate()` on `TsField` instances) SHALL use `TsEventPayload`, not `CustomEvent`.

### Requirement 1.4 — `TsEventPayload` runtime shape

When the grid or form triggers any event, the handler SHALL receive an object that satisfies the `TsEventPayload` type exported from `tsgrid-ui`. The runtime payload MUST include at minimum: `target` (the widget instance), `type` (string event name), `detail` (event-specific payload, typed `unknown` in the bare form), `phase` (event lifecycle phase), `done` (function to finalize the event), and `preventDefault` (function to cancel default behavior).

### Requirement 1.5 — `.on()` registration API remains untyped

The `.on(eventName, handler)` method registration API SHALL NOT be covered by this spec. Its typing remains loose (accepts `any`) for backward compatibility. This is an explicit non-guarantee.

#### Scenario 1-A: Typed-handler consumer receives a TypeScript error on upgrade

- **GIVEN** a consumer whose codebase contains `grid.onSelect = (event: CustomEvent) => { console.log(event.detail) }`
- **WHEN** the consumer upgrades to v2.0.0 and runs `tsc --noEmit` (or `pnpm typecheck`)
- **THEN** TypeScript reports a type error at the assignment site, indicating that `(event: CustomEvent) => void` is not assignable to `((event: TsEventPayload) => void) | null`
- **AND** the error message references the `TsEventPayload` type, giving the consumer a clear migration target

#### Scenario 1-B: Untyped-handler consumer sees no errors and no runtime change

- **GIVEN** a consumer whose codebase contains `grid.onSelect = (event) => { console.log(event) }` (no explicit type annotation on `event`)
- **WHEN** the consumer upgrades to v2.0.0 and runs typecheck
- **THEN** no TypeScript error is reported (TypeScript infers `TsEventPayload` from the declaration)
- **AND** at runtime, the handler is invoked with the same object as in v1.x (runtime is unchanged)

#### Scenario 1-C: `any`-typed handler consumer sees no errors

- **GIVEN** a consumer whose codebase contains `grid.onSelect = (event: any) => { console.log(event) }`
- **WHEN** the consumer upgrades to v2.0.0 and runs typecheck
- **THEN** no TypeScript error is reported

#### Scenario 1-D: Runtime event payload matches `TsEventPayload` shape

- **GIVEN** an active `TsGrid` instance with a registered `onSelect` handler
- **WHEN** the grid fires the `select` event (e.g., user clicks a row)
- **THEN** the handler is invoked with a single argument that satisfies `TsEventPayload`
- **AND** the argument has a `target` property pointing to the `TsGrid` instance
- **AND** the argument has a `type` property with value `"select"`
- **AND** the argument has a `detail` property containing the event-specific data
- **AND** the argument has `done` and `preventDefault` as callable functions

#### Scenario 1-E: TsForm handler typing follows the same contract

- **GIVEN** a consumer whose codebase contains `form.onSave = (event: CustomEvent) => void`
- **WHEN** the consumer upgrades to v2.0.0 and runs typecheck
- **THEN** TypeScript reports a type error identical in structure to Scenario 1-A (same root cause: `TsEventPayload` vs `CustomEvent`)

---

## Capability 2: Public API Stability

### Requirement 2.1 — Barrel exports remain identical

Every class and type currently re-exported from `src/index.ts` (the public barrel) SHALL remain importable from `tsgrid-ui` with the same name and same shape after v2.0.0. The list includes but is not limited to: `TsUi`, `TsUtils`, `query`, `TsLocale`, `TsEvent`, `TsBase`, `TsGrid`, `TsForm`, `TsField`, `TsLayout`, `TsToolbar`, `TsSidebar`, `TsTabs`, `TsPopup`, `TsTooltip`, `toSafeEvent`, and all exported types (`TsEventPayload`, `RecId`, `TsGridRecord`, `TsGridColumn`, etc.).

### Requirement 2.2 — `TsGrid` method signatures are preserved

Every public instance method on `TsGrid` SHALL retain its exact signature (parameter list and return type) in v2.0.0. The only permitted `.d.ts` changes for `TsGrid` are the 45 `on*` property type changes (BC-1). Any additional change to a method signature is a regression.

### Requirement 2.3 — `TsForm` method signatures are preserved

Every public instance method on `TsForm` SHALL retain its exact signature. The only permitted `.d.ts` changes for `TsForm` are the 13 `on*` property type changes (BC-1).

### Requirement 2.4 — Class identity is preserved

`grid instanceof TsGrid` SHALL return `true` for instances created via `new TsGrid(...)` or any factory that previously produced `TsGrid` instances. The prototype chain SHALL NOT be altered by v2.0.0.

### Requirement 2.5 — Public properties remain accessible

`TsGrid` instance properties `records`, `columns`, `last`, `searches`, `searchData`, `sortData`, `toolbar`, `url`, `limit`, `offset`, `total`, `summary`, `name`, `box` SHALL remain accessible and return values of the same type as in v1.0.1.

### Requirement 2.6 — `dist/tsgrid-ui.d.ts` diff is bounded

The rollup `.d.ts` diff between v1.0.1 and v2.0.0 SHALL contain ONLY the 58 event handler property type changes (45 in `TsGrid`, 13 in `TsForm`). Any additional public-surface diff is a regression that blocks the release.

#### Scenario 2-A: Barrel import resolves identically

- **GIVEN** consumer code containing `import { TsGrid } from 'tsgrid-ui'`
- **WHEN** v2.0.0 is installed
- **THEN** the import resolves to the same `TsGrid` class with the same public method set
- **AND** `instanceof` checks continue to work
- **AND** no consumer-side import change is required

#### Scenario 2-B: `grid.records` access returns same data shape

- **GIVEN** an existing `TsGrid` instance with loaded records
- **WHEN** consumer code reads `grid.records[0]`
- **THEN** the returned object has the same shape as in v1.0.1 (a `TsGridRecord` with at least a `recid` property and any user-defined fields)
- **AND** no casting or shape adaptation is needed

#### Scenario 2-C: `grid.columns` access returns same data shape

- **GIVEN** an existing `TsGrid` instance with defined columns
- **WHEN** consumer code reads `grid.columns[0]`
- **THEN** the returned object has the same shape as in v1.0.1 (a `TsGridColumn`)

#### Scenario 2-D: `instanceof TsGrid` still returns `true`

- **GIVEN** `const grid = new TsGrid(...)` constructed before or after the v2.0.0 upgrade
- **WHEN** consumer code evaluates `grid instanceof TsGrid`
- **THEN** the expression returns `true`

#### Scenario 2-E: Extending `TsGrid` continues to work

- **GIVEN** a consumer class `class MyGrid extends TsGrid { ... }` overriding one or more public methods
- **WHEN** v2.0.0 is installed
- **THEN** the subclass compiles and runs correctly
- **AND** the overridden methods receive the same `this` context as in v1.0.1

---

## Capability 3: Internal Restructure Transparency

### Requirement 3.1 — Barrel consumers are not affected by internal restructure

Consumers who import exclusively from the public barrel (`import { ... } from 'tsgrid-ui'`) SHALL observe no change in behavior or type shape from the decomposition of `src/tsgrid.ts` into sibling files.

### Requirement 3.2 — Deep imports are explicitly unsupported

Imports from internal paths (e.g., `import { X } from 'tsgrid-ui/src/tsgrid'`, `import { X } from 'tsgrid-ui/src/grid-data'`, or any path below the package root's `src/` directory) are NOT supported in any version and carry no stability guarantee. v2.0.0 MAY break such imports. This breakage is BC-2 and is documented but not a regression.

### Requirement 3.3 — Breaking change disclosure is mandatory

`CHANGELOG.md` and `MIGRATION_v2.md` SHALL explicitly document both BC-1 (event handler types) and BC-2 (internal restructure — deep-import path removal) before the v2.0.0 release tag is applied.

#### Scenario 3-A: Barrel import resolves through internal restructure transparently

- **GIVEN** consumer code using `import { TsGrid } from 'tsgrid-ui'` where `TsGrid` was previously implemented in a single `src/tsgrid.ts`
- **WHEN** v2.0.0 ships with `src/tsgrid.ts` reduced to a thin orchestrator delegating to `src/grid-*.ts` sibling files
- **THEN** the import continues to resolve to the same `TsGrid` class with an unchanged public API
- **AND** all method calls behave identically to v1.0.1

#### Scenario 3-B: Deep import from `src/tsgrid` is unsupported and may break

- **GIVEN** consumer code containing `import { something } from 'tsgrid-ui/src/tsgrid'`
- **WHEN** v2.0.0 ships
- **THEN** this import is DOCUMENTED as unsupported and not guaranteed to work
- **AND** if the import breaks, this is NOT considered a regression — it is BC-2
- **AND** `MIGRATION_v2.md` SHALL direct such consumers to use `import { TsGrid } from 'tsgrid-ui'` instead

#### Scenario 3-C: Deep import from a new sibling file is also unsupported

- **GIVEN** consumer code attempting `import { add } from 'tsgrid-ui/src/grid-data'`
- **WHEN** v2.0.0 ships
- **THEN** this import is DOCUMENTED as unsupported with no stability guarantee
- **AND** the public barrel is the only supported import surface

---

## Capability 4: Migration Behavior

### Requirement 4.1 — Migration is codemod-friendly

The v2.0.0 release SHALL include `MIGRATION_v2.md` (or an equivalent README section) containing a regex codemod that covers the vast majority of BC-1 fixes: replacing `(event: CustomEvent) =>` with `(event: TsEventPayload) =>` in consumer handlers attached to `TsGrid` or `TsForm` `on*` properties.

### Requirement 4.2 — `TsEventPayload` is importable before upgrade

`TsEventPayload` SHALL be importable from `tsgrid-ui` as of v1.0.1. Consumers MAY begin using `TsEventPayload` in their handler annotations BEFORE upgrading to v2.0.0, eliminating the breaking change preemptively.

### Requirement 4.3 — Runtime behavior is unchanged across the upgrade

No runtime behavior, event timing, payload content, or observable DOM mutation SHALL change between v1.0.1 and v2.0.0. The upgrade is a types-only correction.

### Requirement 4.4 — Untyped handlers require no migration

Consumers who do not explicitly annotate event handler parameter types SHALL compile and run correctly after upgrading to v2.0.0 with zero changes.

### Requirement 4.5 — `consumer-smoke` serves as the canonical migration example

The updated `test/consumer-smoke.ts` (modified as part of BC-1 delivery) SHALL serve as the reference before/after example for the `MIGRATION_v2.md` codemod documentation.

#### Scenario 4-A: Consumer with typed handler gets a clear, fixable error

- **GIVEN** a consumer with `grid.onSelect = (event: CustomEvent) => { console.log(event.detail) }`
- **WHEN** they upgrade to v2.0.0 and run typecheck
- **THEN** TypeScript reports exactly one error at the handler annotation site
- **AND** the fix is: change `CustomEvent` to `TsEventPayload` and add `import { TsEventPayload } from 'tsgrid-ui'` if not already present
- **AND** after applying the fix, typecheck passes with no further errors

#### Scenario 4-B: Removing the type annotation entirely also resolves the error

- **GIVEN** the same consumer from Scenario 4-A after the typecheck error is discovered
- **WHEN** they change the handler to `grid.onSelect = (event) => { console.log(event.detail) }` (removing the explicit annotation)
- **THEN** TypeScript infers `TsEventPayload` from the `TsGrid.onSelect` declaration
- **AND** typecheck passes
- **AND** `event.detail` autocomplete reflects `TsEventPayload.detail` (typed `unknown` in the bare form)

#### Scenario 4-C: Pre-upgrade adoption of `TsEventPayload` eliminates the breaking change

- **GIVEN** a consumer who, while still on v1.0.1, changes their handler to use `import { TsEventPayload } from 'tsgrid-ui'` and annotates `(event: TsEventPayload) =>`
- **WHEN** they upgrade to v2.0.0
- **THEN** no typecheck errors occur (the annotation now matches the property declaration)
- **AND** `event.detail` is typed identically before and after the upgrade

---

## Capability 5: Bundle Size Negative Guarantee

### Requirement 5.1 — v2.0.0 makes no bundle reduction claim

The `CHANGELOG.md` v2.0.0 entry, `MIGRATION_v2.md`, and any associated release notes SHALL NOT claim a bundle size reduction, tree-shaking improvement, or performance gain attributable to the v2.0.0 decomposition.

### Requirement 5.2 — Bundle size is within ±2% of baseline

After the v2.0.0 build, `dist/tsgrid-ui.es6.js` size SHALL be within ±2% of the pre-v2.0.0 baseline measured on master immediately before implementation. A regression exceeding +2% is a release blocker. A reduction exceeding −2% is unexpected and MUST be investigated before tagging.

### Requirement 5.3 — Zero-reduction disclosure is mandatory

`CHANGELOG.md` and release notes SHALL include an explicit statement to the effect of: "v2.0 decomposes the codebase for maintainability. Bundle size is unchanged by design. Bundle size improvements are deferred to v2.2 (multi-entry exports) where they will be validated with measured evidence."

### Requirement 5.4 — Bundle improvements in future versions require measured evidence

Any future release claiming bundle reduction (v2.2 or later) SHALL provide measured evidence from a real consumer build, not theoretical analysis. This requirement is a standing covenant derived from the v1.1.0 cancellation (#736).

#### Scenario 5-A: Bundle size is not meaningfully reduced by v2.0.0

- **GIVEN** a consumer who measures `dist/tsgrid-ui.es6.js` bundle size before upgrading to v2.0.0
- **WHEN** they upgrade to v2.0.0 and rebuild their consumer app
- **THEN** the bundle size is within ±2% of the pre-upgrade measurement
- **AND** no significant reduction is observed (this is expected and disclosed)

#### Scenario 5-B: Release materials do not claim bundle reduction

- **GIVEN** the v2.0.0 `CHANGELOG.md` entry and `MIGRATION_v2.md` content
- **WHEN** a consumer reads them
- **THEN** they find no claim of bundle reduction, tree-shaking benefit, or performance improvement
- **AND** they find an explicit statement that bundle improvements are deferred to v2.2

#### Scenario 5-C: Bundle regression blocks release

- **GIVEN** a post-implementation build of v2.0.0
- **WHEN** `dist/tsgrid-ui.es6.js` byte size is compared against the pre-implementation baseline
- **THEN** if the size has grown by more than 2%, the release is BLOCKED until the regression is investigated and resolved

---

## Cross-Cutting Requirements

### CCR-1 — TypeScript strict mode compliance

All source files (including the 9 new `src/grid-*.ts` sibling files) SHALL compile cleanly under the project's TypeScript configuration: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitOverride: true`, `noPropertyAccessFromIndexSignature: true`.

### CCR-2 — `pnpm verify` must pass end-to-end

The full verification chain (`pnpm lint` + `pnpm typecheck` + `pnpm consumer-smoke` + `pnpm test:unit` + `pnpm smoke`) SHALL pass with zero errors before v2.0.0 is tagged. Individual steps that must pass:

- `pnpm lint` — 0 ESLint errors, 0 new warnings
- `pnpm typecheck` — `tsc --noEmit` clean across all `src/*.ts`
- `pnpm consumer-smoke` — clean after the event handler type update in `test/consumer-smoke.ts`
- `pnpm test:unit` — all 84 Vitest unit tests pass
- `pnpm smoke` — all 38 Playwright tests pass (chromium-only)

### CCR-3 — `.d.ts` diff is bounded

The diff between the v1.0.1 and v2.0.0 `dist/tsgrid-ui.d.ts` rollup SHALL contain ONLY the 58 event handler property type changes. This requirement is a gate condition for release. (Identical to Requirement 2.6 — repeated here for visibility.)

### CCR-4 — Semver is correctly applied

v2.0.0 SHALL be tagged with a SEMVER MAJOR increment. No feature or fix from this change may be backported to a v1.x release as a non-breaking change, because BC-1 is a type-system breaking change by definition.

### CCR-5 — No runtime behavior changes

Every event, method call, DOM mutation, and observable side effect that functioned in v1.0.1 SHALL function identically in v2.0.0. Any divergence in runtime behavior is a regression, regardless of whether it is covered by the existing test suite.

### CCR-6 — Consumer-smoke update is a co-deliverable with BC-1

The update to `test/consumer-smoke.ts` (changing `CustomEvent` → `TsEventPayload` in handler annotations) SHALL land in the same PR or work unit as BC-1. It MUST NOT be deferred. The consumer-smoke is the canary that confirms the public API changed correctly.
