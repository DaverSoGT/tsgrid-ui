# Migration Guide: v1.x to v2.0

<!-- baseline: 943401 bytes -->

## Bundle size measurement

| Metric | Value |
|--------|-------|
| Baseline (v1.0.1, pre-v2.0) | 943,401 bytes |
| Post-v2.0 actual | 941,597 bytes |
| Delta | -1,804 bytes (-0.19%) |
| Status | PASS (within ±2% gate) |
| Build date | 2026-05-09 |

v2.0 is a structural refactor with no bundle reduction goal. The -0.19% delta is
within the ±2% measurement gate and does not constitute a meaningful change. Bundle
improvements are explicitly deferred to v2.2 (multi-entry subpath exports + tree-shaking).

---

## Overview

`tsgrid-ui` v2.0 is a **code-organisation and type-system release**. No runtime behavior
changes between v1.0.1 and v2.0.0. All public API method signatures remain identical.

Two breaking changes are documented below (BC-1 and BC-2). Both were intentional and
are codemod-friendly.

---

## Breaking Change BC-1: Event handler types

### What changed

All `on*` event handler properties on `TsGrid`, `TsForm`, and `TsField` now declare
`TsEventPayload` as the handler parameter type instead of `CustomEvent`.

**v1.x (old type):**
```ts
onSelect: ((event: CustomEvent) => void) | null
```

**v2.0 (corrected type):**
```ts
onSelect: ((event: TsEventPayload) => void) | null
```

### Why this is a correction, not a new feature

The runtime event system in `TsGrid`/`TsForm` has always passed a `TsEventPayload`
object to handlers — never a DOM `CustomEvent`. The v1.x type declarations were
inaccurate. This change aligns the declared types with what was always happening at
runtime.

### Who is affected

Only consumers who **explicitly annotated** their handler parameter as `CustomEvent`:

```ts
// This breaks on v2.0 — parameter type mismatch
grid.onSelect = (event: CustomEvent) => {
    console.log(event.detail)
}
```

Consumers who used **no annotation** or **inferred types** are unaffected:

```ts
// These continue to work — TypeScript infers TsEventPayload
grid.onSelect = (event) => { console.log(event.detail) }
grid.onSelect = (event: TsEventPayload) => { console.log(event.detail) }
```

### Codemod

Apply the following regex to your source files to migrate in bulk:

**Find:**
```
\(event:\s*CustomEvent\)\s*=>
```

**Replace:**
```
(event: TsEventPayload) =>
```

**Caveats:**
1. You must add `import type { TsEventPayload } from 'tsgrid-ui'` to each migrated file.
2. The regex may produce false positives on unrelated DOM `CustomEvent` handler sites
   (e.g., handlers attached via `element.addEventListener('custom', ...)`). Review
   replacements manually before committing.
3. `event.detail` is now typed as `TsEventData` (with `[key: string]: unknown`). If you
   accessed properties like `event.detail.someField`, TypeScript strict mode requires
   bracket notation: `event.detail['someField']`. Cast as needed.

### Before / after example

The updated `test/consumer-smoke.ts` is the canonical reference. Below is a condensed
example:

**Before (v1.x):**
```ts
import { TsGrid } from 'tsgrid-ui'

const grid = new TsGrid({ name: 'my-grid', columns: [], records: [] })

// Explicit CustomEvent annotation — BREAKS on v2.0
grid.onSelect = (event: CustomEvent) => {
    console.log(event.detail)
}
```

**After (v2.0):**
```ts
import { TsGrid } from 'tsgrid-ui'
import type { TsEventPayload } from 'tsgrid-ui'

const grid = new TsGrid({ name: 'my-grid', columns: [], records: [] })

// Option A: explicit TsEventPayload annotation
grid.onSelect = (event: TsEventPayload) => {
    console.log(event.detail)
}

// Option B: remove the annotation — TypeScript infers correctly
grid.onSelect = (event) => {
    console.log(event.detail)
}
```

`TsEventPayload` has been importable from `tsgrid-ui` since **v1.0.1**. Consumers may
pre-migrate before upgrading to v2.0.

---

## Breaking Change BC-2: Deep imports are unsupported

v2.0 decomposes `src/tsgrid.ts` into sibling modules (`src/grid-*.ts`). Any import from
an internal path is **not supported** and carries no stability guarantee:

```ts
// UNSUPPORTED — may break in any minor or patch release
import { someHelper } from 'tsgrid-ui/src/tsgrid'
import { someHelper } from 'tsgrid-ui/src/grid-columns'
```

Always import from the public barrel:

```ts
// SUPPORTED — stable public API
import { TsGrid, TsEventPayload } from 'tsgrid-ui'
```

---

## Bundle size disclosure

v2.0 decomposes the codebase for maintainability. **Bundle size is unchanged by design.**
Bundle improvements are deferred to v2.2 (multi-entry subpath exports + tree-shaking).

Do not expect or claim bundle size reduction from upgrading to v2.0.

---

## Release checklist

> Reference — execute manually after PR review and approval. The SDD apply phase does NOT
> run any of these.

```bash
# After PR merged to master:
git checkout master && git pull
git tag -a v2.0.0 -m "v2.0.0 — TsGrid decomposition + event signature fix"
git push origin v2.0.0
pnpm publish --access public --tag latest
gh release create v2.0.0 --title "v2.0.0 — TsGrid v2 decomposition" --notes-from-tag
```

---

## v2.12.0 — Per-widget CSS import pattern

v2.12.0 adds nine per-widget CSS subpath exports. No breaking changes — this is additive only.

### New import pattern

```ts
// Before (still works — recommended for most consumers)
import 'tsgrid-ui/css'

// After v2.12.0 — optional per-widget imports
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

Each per-widget CSS file is self-contained: it includes the widget's Less rules plus the shared
`variables`, `mixins`, `icons`, `common` (where applicable), and `buttons` (where applicable)
partials. File sizes range from 15 KB (popup, sidebar) to 56 KB (grid).

### When to use per-widget CSS

Use per-widget imports when:
- You render only a subset of widgets (e.g., only `TsGrid` and `TsForm`) and want granular HTTP
  cache control — a style change to the grid does not invalidate the cached form CSS.
- You are building a micro-frontend where different teams own different widget CSS files.

Continue using `tsgrid-ui/css` (the monolith) when:
- You render most or all widgets on the same page (simpler, no duplication cost).
- You want a single cache entry for all styles.

### Known limitation: icon glyphs

Per-widget CSS files include the icon woff font (the `.tsg-icon-*` symbol font, ~3 KB) but do NOT
include the OpenSans text font that is embedded in the monolith. More importantly: if you import
ONLY per-widget CSS and skip `tsgrid-ui/css` entirely, **icon glyphs (sort arrows, checkboxes,
calendar icons, etc.) will appear as empty boxes**.

To avoid this, either:
1. Also import `tsgrid-ui/css` for the icon and text fonts (zero overhead if you code-split CSS by route).
2. Provide the OpenSans font and a compatible icon font via your own pipeline or CDN.

A dedicated `tsgrid-ui/icons.css` subpath is planned for a future cycle to allow importing only
the fonts without the full monolith.

### No migration required

This is a SEMVER MINOR release. No existing import paths change. The only required action is:
- If you want to use per-widget imports: add the new `import 'tsgrid-ui/<widget>.css'` statements.
- If you are satisfied with the monolith: no changes needed.
