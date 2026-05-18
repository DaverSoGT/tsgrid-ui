# Migration Guide: v2.x to v3.0

> v3.0 is a **MAJOR** release. Three breaking surfaces are removed. Most consumers
> that followed the v2.15.0 deprecation notices need only 2–3 small changes.

---

## Table of contents

1. [Flat barrel removed](#v300--barrel-removed)
2. [Icon API migration](#v300--icon-api)
3. [drop-inverted hover state](#v300--drop-inverted)
4. [A11y opt-in](#v300--a11y)
5. [Theming via currentColor](#v300--theming)
6. [IIFE / browser-global consumers](#v300--iife-globals)
7. [Known limitations](#v300--known-limitations)
8. [Removal-target lookahead](#v300--lookahead)
9. [Version anchors](#v300--version-anchors)

---

## v3.0.0 — Barrel removed {#v300--barrel-removed}

### What changed

`exports["."]` is removed from `package.json`. Importing from the flat barrel no longer
resolves:

```ts
// v2.x — worked, deprecated as of v2.15.0
import { TsGrid } from 'tsgrid-ui'   // ERR_PACKAGE_PATH_NOT_EXPORTED in v3.0

// v3.0 — correct
import { TsGrid } from 'tsgrid-ui/grid'
```

The IIFE monolith (`dist/tsgrid-ui.js`, `dist/tsgrid-ui.min.js`) is also removed.
`<script src="...tsgrid-ui.js">` consumers must migrate to ESM subpath imports.

### Migration action

Replace every `from 'tsgrid-ui'` with the matching subpath. Use the table from
[MIGRATION_v2.md — v2.15.0 Barrel Deprecation](MIGRATION_v2.md#v2150--barrel-deprecation).

**Quick codemod (sd — install via `cargo install sd` or `brew install sd`)**:

```bash
# ESM consumers — run once per subpath you use
sd "from 'tsgrid-ui'" "from 'tsgrid-ui/grid'" src/**/*.ts   # adjust subpath per widget
```

**Affected subpaths**:

| Old barrel import | New subpath |
|---|---|
| `import { TsGrid } from 'tsgrid-ui'` | `from 'tsgrid-ui/grid'` |
| `import { TsForm } from 'tsgrid-ui'` | `from 'tsgrid-ui/form'` |
| `import { TsField } from 'tsgrid-ui'` | `from 'tsgrid-ui/field'` |
| `import { TsLayout } from 'tsgrid-ui'` | `from 'tsgrid-ui/layout'` |
| `import { TsSidebar } from 'tsgrid-ui'` | `from 'tsgrid-ui/sidebar'` |
| `import { TsTabs } from 'tsgrid-ui'` | `from 'tsgrid-ui/tabs'` |
| `import { TsToolbar } from 'tsgrid-ui'` | `from 'tsgrid-ui/toolbar'` |
| `import { TsTooltip } from 'tsgrid-ui'` | `from 'tsgrid-ui/tooltip'` |
| `import { TsPopup } from 'tsgrid-ui'` | `from 'tsgrid-ui/popup'` |
| `import { TsLocale } from 'tsgrid-ui'` | `from 'tsgrid-ui/locale'` |
| `import { TsUtils } from 'tsgrid-ui'` | `from 'tsgrid-ui/utils'` |
| `import { TsBase } from 'tsgrid-ui'` | `from 'tsgrid-ui/base'` |
| `import type { RecId, ... } from 'tsgrid-ui'` | `from 'tsgrid-ui/utils'` |

---

## v3.0.0 — Icon API migration {#v300--icon-api}

### What changed

`.tsg-icon-{name}` CSS classes no longer have `background-image` rules. Widgets now
render icons as inline SVG strings using functions from `tsgrid-ui/icons`.

If you passed `.tsg-icon-*` class strings as `icon:` values in toolbar items, grid
search configs, or other widget options, those class strings no longer display an icon.

### New icon API

```ts
import {
    boxIcon, checkIcon, chevronDownIcon, collapseIcon, colorsIcon,
    columnsIcon, crossIcon, dropIcon, emptyIcon, expandIcon,
    eyeDropperIcon, infoIcon, pasteIcon, pencilIcon, plusIcon,
    reloadIcon, searchIcon, settingsIcon
} from 'tsgrid-ui/icons'
```

Each function has the signature:

```ts
function checkIcon(opts?: IconOpts): string
// returns an <svg ...>...</svg> HTML string

interface IconOpts {
    label?: string   // sets aria-label on the <svg> element (recommended for interactive icons)
    size?: number    // CSS pixels; default 16
    class?: string   // appended class on the <svg> element
}
```

### Migration table

| Old CSS class string | New function call |
|---|---|
| `'tsg-icon-box'` | `boxIcon()` |
| `'tsg-icon-check'` | `checkIcon()` |
| `'tsg-icon-chevron-down'` | `chevronDownIcon()` |
| `'tsg-icon-collapse'` | `collapseIcon()` |
| `'tsg-icon-colors'` | `colorsIcon()` |
| `'tsg-icon-columns'` | `columnsIcon()` |
| `'tsg-icon-cross'` | `crossIcon()` |
| `'tsg-icon-drop'` | `dropIcon()` |
| `'tsg-icon-empty'` | `emptyIcon()` |
| `'tsg-icon-expand'` | `expandIcon()` |
| `'tsg-icon-eye-dropper'` | `eyeDropperIcon()` |
| `'tsg-icon-info'` | `infoIcon()` |
| `'tsg-icon-paste'` | `pasteIcon()` |
| `'tsg-icon-pencil'` | `pencilIcon()` |
| `'tsg-icon-plus'` | `plusIcon()` |
| `'tsg-icon-reload'` | `reloadIcon()` |
| `'tsg-icon-search'` | `searchIcon()` |
| `'tsg-icon-settings'` | `settingsIcon()` |

### Toolbar passthrough

`TsToolbar` item `icon:` fields detect the first character. If the string starts with
`<`, it is used as raw HTML (inline SVG). If it does NOT start with `<`, it is wrapped
in `<span class="${icon}">`. This means `icon: checkIcon()` works automatically — no
changes to toolbar item logic needed.

```ts
// v2.x
{ type: 'button', id: 'save', icon: 'tsg-icon-check', text: 'Save' }

// v3.0
import { checkIcon } from 'tsgrid-ui/icons'
{ type: 'button', id: 'save', icon: checkIcon({ label: 'Save' }), text: 'Save' }
```

### A11y recommendation

For interactive icons (buttons, toggle controls), pass `label`:

```ts
import { crossIcon } from 'tsgrid-ui/icons'
const html = `<span class="tsg-icon">${crossIcon({ label: 'Close dialog' })}</span>`
```

For decorative icons (visually redundant — text is nearby), omit `label`:

```ts
const html = `<span class="tsg-icon" aria-hidden="true">${searchIcon()}</span>`
```

---

## v3.0.0 — drop-inverted hover state {#v300--drop-inverted}

### What changed

`src/less/icons/svg/drop-inverted.svg` is deleted. The white-fill drop icon hover state
in grid column header is now handled by `color: #fff` on the parent span, with the SVG
using `fill="currentColor"`.

### Migration action

**None for most consumers.** The visible behavior is identical (white drop icon on hover).

If you used `drop-inverted.svg` as a reference in your own LESS/CSS — replace with
`drop.svg` and add `color: #fff` on the hover rule:

```less
// v2.x — you referenced drop-inverted.svg in your CSS
.my-icon:hover { background-image: url('/path/to/drop-inverted.svg'); }

// v3.0 — use fill="currentColor" with color: #fff on hover
.my-icon:hover { color: #fff; }
// (assuming the SVG uses fill="currentColor")
```

---

## v3.0.0 — A11y opt-in {#v300--a11y}

All 18 icon functions emit `role="img"` on the `<svg>` element. When `opts.label` is
provided, `aria-label` is set and `aria-hidden` is omitted. When `opts.label` is absent,
`aria-hidden="true"` is set.

Consumer-supplied `icon:` values in widget options that start with `<` are passed
through as raw HTML — the library does not re-annotate them. Ensure your own SVG strings
include appropriate ARIA attributes.

---

## v3.0.0 — Theming via currentColor {#v300--theming}

All 18 icons use `fill="currentColor"` on their `<path>` / `<polygon>` elements. Setting
`color:` on a parent container changes the icon fill:

```css
/* Dark theme — all tsg-icon spans become white */
.dark-theme .tsg-icon { color: #ffffff; }

/* Accent color for a specific toolbar button */
.my-toolbar .tsg-icon-save-btn .tsg-icon { color: #0066cc; }
```

v2.x icon CSS classes used `background-image: url(data:image/svg+xml;utf8,...)` with
a hard-coded fill color. The v3.0 inline SVG approach supports dynamic theming via CSS
`color:` without re-encoding the SVG.

---

## v3.0.0 — IIFE / browser-global consumers {#v300--iife-globals}

`dist/tsgrid-ui.js` and `dist/tsgrid-ui.min.js` (the IIFE monolith bundles) are removed
in v3.0.

### Migration to ESM

If you used the IIFE bundle via a CDN `<script>` tag:

```html
<!-- v2.x -->
<link rel="stylesheet" href="https://cdn.example.com/tsgrid-ui/dist/tsgrid-ui.css">
<script src="https://cdn.example.com/tsgrid-ui/dist/tsgrid-ui.min.js"></script>
<script>
    var grid = new TsGrid({ ... })
</script>
```

Migrate to ESM:

```html
<!-- v3.0 -->
<link rel="stylesheet" href="https://cdn.example.com/tsgrid-ui@3/dist/tsgrid-ui.css">
<script type="module">
    import { TsGrid } from 'https://cdn.example.com/tsgrid-ui@3/dist/grid.es6.js'
    const grid = new TsGrid({ ... })
    grid.render('#mygrid')
</script>
```

**Note**: The CSS monolith (`dist/tsgrid-ui.css`, `dist/tsgrid-ui.min.css`) and all
per-widget CSS files still exist in v3.0 — only the JS IIFE bundles are removed.

### Import maps (recommended for modern browsers)

```html
<script type="importmap">
{
    "imports": {
        "tsgrid-ui/grid":    "/node_modules/tsgrid-ui/dist/grid.es6.js",
        "tsgrid-ui/form":    "/node_modules/tsgrid-ui/dist/form.es6.js",
        "tsgrid-ui/icons":   "/node_modules/tsgrid-ui/dist/icons.es6.js"
    }
}
</script>
<script type="module">
    import { TsGrid } from 'tsgrid-ui/grid'
</script>
```

---

## v3.0.0 — Known limitations {#v300--known-limitations}

1. **Tree-shake bundler compatibility**: Per-widget ES6 bundles (`dist/grid.es6.js`)
   already tree-shake unused icons (each widget imports only its own icon functions).
   Consumer-level tree-shaking of `tsgrid-ui/icons` depends on your bundler's DCE
   quality. Vite (esbuild) and webpack 5 with `sideEffects: false` correctly DCE
   unused icon functions. Older bundlers or non-standard configurations may not.

2. **`Brand<K, T>` type status**: `Brand` was promoted from `@internal` to public in
   v2.15.0. It remains public and accessible via `tsgrid-ui/utils` in v3.0. No changes.

3. **CJS consumers**: All CJS subpath exports (`require('tsgrid-ui/grid')` etc.) still
   work in v3.0. The removed `exports["."]` (flat barrel) was the only CJS monolith;
   individual CJS subpaths are unaffected.

4. **`tsg-icon-selected` CSS class**: `.tsg-icon-selected` (used as a state modifier
   on the `.tsg-icon` container in sidebar nodes) is NOT removed — it is not one of the
   18 migrated icon names. Any CSS that targets `.tsg-icon-selected` continues to work.

5. **Compat shim remains in icons.less**: The `[class^="tsg-icon-"]:before { content: "" }`
   shim from v2.14.0 is kept to prevent stale cached font-glyph pseudo-content. It adds
   < 50 bytes to the CSS output and will be removed in v4.0.

---

## v3.0.0 — Removal-target lookahead {#v300--lookahead}

Planned for **v4.0** (no calendar date; version-anchored):

- Remove `[class^="tsg-icon-"]:before` compat shim from `icons.less`.
- Remove the `TsToolbar` CSS-class passthrough path (the `if (icon.slice(0, 1) !== '<')` branch). All icon values will be expected to be SVG strings.
- Evaluate moving icon functions to a separate `@tsgrid-ui/icons` package for consumers who want icons without the widget bundle.

---

## v3.0.0 — Version anchors {#v300--version-anchors}

| Milestone | Version | Notes |
|---|---|---|
| Barrel deprecated | v2.15.0 | `exports["."]` still present; `@deprecated` JSDoc + dev warn |
| Barrel removed | v3.0.0 | `exports["."]` removed; IIFE bundles removed |
| Icon CSS removed | v3.0.0 | `background-image` rules removed from `icons.less` |
| Compat shim removal | v4.0 (planned) | `:before { content: "" }` removed |
| Named icon functions | v3.0.0 | `tsgrid-ui/icons` subpath with 18 functions |
