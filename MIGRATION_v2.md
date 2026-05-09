# Migration Guide: v1.x to v2.0

<!-- baseline: 943401 bytes -->

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

> For maintainer reference only — do NOT execute these commands automatically.

```sh
# 1. Ensure pnpm verify is green
pnpm verify

# 2. Update CHANGELOG.md with v2.0.0 entry (Task 9.2)
#    Include explicit "no bundle reduction in v2.0" disclosure per spec Req 3.3.

# 3. Bump version in package.json to 2.0.0 (Task 9.5)
# (edit manually or use: npm version 2.0.0 --no-git-tag-version)

# 4. Tag the release
git tag -a v2.0.0 -m "chore(release): v2.0.0"

# 5. Push tag
git push origin v2.0.0

# 6. Publish to npm
npm publish --access public
```
