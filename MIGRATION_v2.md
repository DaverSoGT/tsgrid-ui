# Migration Guide: v1.x to v2.0

## v2.13.0 — CJS Subpath Parity

### What changed

CJS `require:` conditions are now available for all 12 JS subpath exports. This is a **purely additive** change — no existing behavior is modified.

```js
// Before v2.13.0 — this threw ERR_PACKAGE_PATH_NOT_EXPORTED
const { TsGrid } = require('tsgrid-ui/grid')  // ERROR

// After v2.13.0 — resolves to dist/grid.js
const { TsGrid } = require('tsgrid-ui/grid')  // OK
```

### Migration action for ESM consumers

**None.** ESM imports (`import { TsGrid } from 'tsgrid-ui/grid'`) are completely unchanged. The `require:` condition is only invoked by CJS-mode `require()` calls.

### Migration action for CJS monolith consumers

**None required, but optional improvement available.** CJS consumers previously relying on `require('tsgrid-ui')` can now selectively require individual subpaths:

```js
// Before: monolith require (still fully supported)
const lib = require('tsgrid-ui')
const { TsGrid } = lib

// After: subpath require (new option, Node.js only)
const { TsGrid } = require('tsgrid-ui/grid')
```

**Caution**: If you `require` multiple subpaths AND `require('tsgrid-ui')` in the same process, class identities are NOT shared. `instanceof` checks across the two copies will fail (see [CHANGELOG Known Limitation #4](CHANGELOG.md)). For multi-subpath CJS consumers, `require('tsgrid-ui')` remains the safer choice.

### Migration action for pure-Node consumers

**DOM environment required at require() time.** tsgrid-ui targets browsers as its primary runtime and the CJS bundles reference `document`, `window`, `Node`, `Event`, `MutationObserver`, `navigator`, `localStorage`, and `self` at module-load. Pure-Node use cases (SSR pre-render, CLI tooling, headless test scripts) MUST provide a DOM environment before calling `require()`:

```js
// Option A — jsdom (recommended for SSR / SEO use cases)
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!DOCTYPE html>')
global.window = dom.window
global.document = dom.window.document
global.Node = dom.window.Node
global.Event = dom.window.Event
global.MutationObserver = dom.window.MutationObserver
global.navigator = dom.window.navigator
global.localStorage = dom.window.localStorage
global.self = dom.window
const { TsGrid } = require('tsgrid-ui/grid')  // OK

// Option B — minimal stubs (sufficient for type-only / smoke tests)
// See test/consumer-smoke-cjs.js in the repo for a working example
```

Calling `require('tsgrid-ui/grid')` in a bare Node process (no polyfills, no jsdom) throws at load. See [CHANGELOG v2.13.0 Known Limitation #3](CHANGELOG.md) for the full list of referenced DOM globals.

---

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

Always import from the canonical per-widget subpath:

```ts
// SUPPORTED — stable public API (v2.15.0+)
import { TsGrid } from 'tsgrid-ui/grid'
import type { TsEventPayload } from 'tsgrid-ui/base'
```

> The flat `tsgrid-ui` barrel still works in v2.x but is **deprecated** as of v2.15.0
> and **will be removed in v3.0**. See the section below for the migration table.

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

---

## v2.15.0 — Barrel Deprecation

The flat barrel `import { ... } from 'tsgrid-ui'` is **deprecated** as of v2.15.0 and **will be removed in v3.0**. There is no calendar date for v3.0 — the removal is version-anchored, not time-anchored.

### Why

Per-widget subpaths (introduced in v2.8.0 and completed in v2.13.0) enable tree-shaking. Importing from the flat barrel forces consumers' bundlers to retain the full 700 KB module graph even when they only use one widget. Subpath imports give consumers per-widget granularity and unlock the multi-entry build that v2.x has been promising since v2.0.

### What you'll see

1. **IDE strikethrough** on every named import from `tsgrid-ui` (powered by `@deprecated` JSDoc on each re-export).
2. **One dev-mode console warning** per process at module load:
   ```
   [tsgrid-ui] Importing from "tsgrid-ui" (the flat barrel) is deprecated as of v2.15.0 ...
   ```
   Dead-code-eliminated in production bundles. Guarded by `process.env.NODE_ENV !== 'production'`.
3. **No runtime behavior change** — the barrel still re-exports everything and resolves identically. Production consumers see ZERO change.

### Migration table

| Barrel import (deprecated) | Replace with |
|---|---|
| `import { TsUi, TsUtils, query } from 'tsgrid-ui'` | `from 'tsgrid-ui/utils'` |
| `import { TsLocale } from 'tsgrid-ui'` | `from 'tsgrid-ui/locale'` |
| `import { TsEvent, TsBase, toSafeEvent } from 'tsgrid-ui'` | `from 'tsgrid-ui/base'` |
| `import { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog } from 'tsgrid-ui'` | `from 'tsgrid-ui/popup'` |
| `import { TsTooltip, TsMenu, TsColor, TsDate, Tooltip } from 'tsgrid-ui'` | `from 'tsgrid-ui/tooltip'` |
| `import { TsToolbar } from 'tsgrid-ui'` | `from 'tsgrid-ui/toolbar'` |
| `import { TsSidebar } from 'tsgrid-ui'` | `from 'tsgrid-ui/sidebar'` |
| `import { TsTabs } from 'tsgrid-ui'` | `from 'tsgrid-ui/tabs'` |
| `import { TsLayout } from 'tsgrid-ui'` | `from 'tsgrid-ui/layout'` |
| `import { TsGrid } from 'tsgrid-ui'` | `from 'tsgrid-ui/grid'` |
| `import { TsForm } from 'tsgrid-ui'` | `from 'tsgrid-ui/form'` |
| `import { TsField } from 'tsgrid-ui'` | `from 'tsgrid-ui/field'` |
| `import type { RecId, LayoutPanelId, FieldName, Brand } from 'tsgrid-ui'` | `from 'tsgrid-ui/utils'` (NEW in v2.15.0) |
| `import type { TsEventData, TsEventPayload } from 'tsgrid-ui'` | `from 'tsgrid-ui/base'` |
| `import type { TsGridRecord, TsGridColumn, ... } from 'tsgrid-ui'` | `from 'tsgrid-ui/grid'` |
| `import type { TsFieldOptions, TsFieldElement, ... } from 'tsgrid-ui'` | `from 'tsgrid-ui/field'` |
| `import type { TsLayoutPanel, TsPanelType, TsPanelContent } from 'tsgrid-ui'` | `from 'tsgrid-ui/layout'` |
| `import type { TsSidebar* } from 'tsgrid-ui'` | `from 'tsgrid-ui/sidebar'` |
| `import type { TsLocaleSettings } from 'tsgrid-ui'` | `from 'tsgrid-ui/locale'` |
| `import type { TsMessage*, TsMenuItem, TsColorRgb, TsLockOptions, TsCloneOptions } from 'tsgrid-ui'` | `from 'tsgrid-ui/utils'` |

### Codemod regex hint

For codebases with many barrel imports, a one-shot regex substitution gets you most of the way (review diffs manually):

```bash
# PowerShell + sd (https://github.com/chmln/sd)
sd "from 'tsgrid-ui'" "from 'tsgrid-ui/<subpath>'" path/to/your/src/**/*.ts
```

Replace `<subpath>` per the table above. Most consumer codebases import 1–3 widgets, so 1–3 sd passes are typical.

### Removal target

**v3.0** (no calendar date; version-anchored). v3.0 will remove `exports["."]` from `package.json`, breaking `import 'tsgrid-ui'` for ESM and `require('tsgrid-ui')` for CJS. The IIFE monolith (`dist/tsgrid-ui.js` for `<script>` tag consumers) may live longer than `exports["."]` — that decision is deferred to the v3.0 design cycle.
- If you are satisfied with the monolith: no changes needed.
