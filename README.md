# TsGrid UI

TypeScript-native UI component library: data grid, forms, fields, layout, sidebar, tabs, toolbar, popup, tooltip. Strict-mode TypeScript port of the venerable w2ui v2.0 codebase, with modern tooling, zero runtime dependencies, and full `.d.ts` declarations.

> **This is a hard fork of [w2ui](https://github.com/vitmalina/w2ui) by Vit Malina.** See [Acknowledgments](#acknowledgments) below.

[![npm version](https://img.shields.io/npm/v/tsgrid-ui.svg)](https://www.npmjs.com/package/tsgrid-ui)
[![license](https://img.shields.io/npm/l/tsgrid-ui.svg)](LICENSE)

> **v3.0 is a MAJOR release.** The flat `tsgrid-ui` barrel (`import { TsGrid } from 'tsgrid-ui'`),
> the IIFE bundle (`dist/tsgrid-ui.js`), and the `.tsg-icon-{name}` CSS background-image rules
> are removed. Migrate to per-widget subpath imports and `tsgrid-ui/icons` functions.
> See [MIGRATION_v3.md](MIGRATION_v3.md) for the full guide.

## Install

```bash
pnpm add tsgrid-ui
# or: npm install tsgrid-ui
# or: yarn add tsgrid-ui
```

## Quick start

```ts
import { TsGrid } from 'tsgrid-ui/grid'
import 'tsgrid-ui/css'

const grid = new TsGrid({
    name: 'mygrid',
    columns: [
        { field: 'name',  text: 'Name',  size: '50%' },
        { field: 'email', text: 'Email', size: '50%' }
    ],
    records: [
        { recid: 1, name: 'Ada Lovelace',     email: 'ada@example.com' },
        { recid: 2, name: 'Alan Turing',      email: 'alan@example.com' },
        { recid: 3, name: 'Grace Hopper',     email: 'grace@example.com' }
    ]
})
grid.render('#mygrid')
```

```html
<div id="mygrid" style="width: 600px; height: 300px;"></div>
```

## Icons

v3.0 ships 18 named icon functions via `tsgrid-ui/icons`:

```ts
import { checkIcon, crossIcon, searchIcon } from 'tsgrid-ui/icons'

// Basic use (decorative — aria-hidden="true" emitted automatically)
const html = `<span class="tsg-icon">${searchIcon()}</span>`

// Interactive use — pass label for accessibility
const closeBtn = `<button>${crossIcon({ label: 'Close dialog' })}</button>`

// Custom size
const bigCheck = checkIcon({ size: 24, label: 'Confirmed' })
```

All icons use `fill="currentColor"` — set `color:` on the parent to theme them.
See [MIGRATION_v3.md#v300--icon-api](MIGRATION_v3.md#v300--icon-api) for the full 18-icon table.

## CommonJS Usage

Starting in **v2.13.0**, all 12 JS subpath exports support `require()` in Node.js CJS modules.

```js
// CJS subpath import — Node.js only
const { TsGrid }    = require('tsgrid-ui/grid')
const { TsForm }    = require('tsgrid-ui/form')
const { TsField }   = require('tsgrid-ui/field')
const { TsLocale }  = require('tsgrid-ui/locale')
const { TsUtils }   = require('tsgrid-ui/utils')
// ... all 12 subpaths available
```

ESM equivalent (preferred — use ESM whenever your environment supports it):

```ts
import { TsGrid }   from 'tsgrid-ui/grid'
import { TsForm }   from 'tsgrid-ui/form'
import { TsField }  from 'tsgrid-ui/field'
import { TsLocale } from 'tsgrid-ui/locale'
import { TsUtils }  from 'tsgrid-ui/utils'
```

**CJS subpath imports are Node.js only.** Browser consumers should use `<script type="module">` with subpath ESM imports — the IIFE monolith (`dist/tsgrid-ui.min.js`) is removed in v3.0. See [MIGRATION_v3.md#v300--iife-globals](MIGRATION_v3.md#v300--iife-globals) for the browser migration guide. For multi-subpath CJS consumers, note that each subpath file inlines all its dependencies because `splitting: false` is required for CJS output.

**Pure-Node consumers must provide a DOM environment** (jsdom / happy-dom or equivalent stubs) before the `require()` call resolves — tsgrid-ui references `document`, `window`, `Node`, `Event`, `MutationObserver`, `navigator`, `localStorage`, and `self` at module-load time because it targets browsers as its primary runtime. Calling `require('tsgrid-ui/grid')` in a bare Node process without these polyfills throws at load. See [CHANGELOG v2.13.0 Known Limitations](CHANGELOG.md) for the full list and `test/consumer-smoke-cjs.js` for a working stub example.

## Per-component CSS

Starting in **v2.12.0**, individual per-widget CSS subpaths are available. There are two import patterns:

**Monolith (recommended for most consumers)**

```ts
import 'tsgrid-ui/css'  // ~700 KB — all widgets + fonts in one import
```

Use this when you render multiple widgets on the same page and want simplicity. One import, all styles.

**Per-widget (granular cache control)**

```ts
import 'tsgrid-ui/grid.css'     // 56 KB — grid styles only
import 'tsgrid-ui/form.css'     // 32 KB — form styles only
import 'tsgrid-ui/tooltip.css'  // 47 KB
import 'tsgrid-ui/popup.css'    // 15 KB
import 'tsgrid-ui/sidebar.css'  // 15 KB
import 'tsgrid-ui/tabs.css'     // 27 KB
import 'tsgrid-ui/toolbar.css'  // 30 KB
import 'tsgrid-ui/layout.css'   // 26 KB
import 'tsgrid-ui/field.css'    // 31 KB
```

Use this when you import only a subset of widgets and want CSS cache granularity — each widget's
styles are cached independently, so a change to the grid style does not invalidate the form cache.

**Note**: per-widget CSS files do NOT include the OpenSans text font embedded in the monolith.
If you use ONLY per-widget CSS imports, text rendering may differ from the monolith. To fix:
also import `tsgrid-ui/css`, or provide OpenSans via a CDN or your own font pipeline.

Icon rendering (v3.0+) is handled via inline SVG strings from `tsgrid-ui/icons` — not CSS
background-image rules — so per-widget CSS files have no icon font dependency.

## Components

| Class       | Purpose                                        |
|-------------|------------------------------------------------|
| `TsGrid`    | Data grid with sort / search / select / edit   |
| `TsForm`    | Form with field validation + submit lifecycle  |
| `TsField`   | Standalone field types (text/list/date/color/file) |
| `TsLayout`  | 6-panel resizable layout                       |
| `TsSidebar` | Tree / sidebar with expandable nodes           |
| `TsTabs`    | Tab strip                                      |
| `TsToolbar` | Toolbar with multiple item types               |
| `TsTooltip` | Hover tooltips and overlays                    |
| `TsPopup`   | Modal popup, alert, confirm, prompt            |

Helpers exported: `TsAlert`, `TsConfirm`, `TsPrompt`, `TsColor`, `TsDate`, `TsMenu`, `TsDialog`, `TsUtils`, `TsLocale`, `TsBase`, `TsEvent`, `TsUi` (instance registry), `query` (DOM helper), plus branded primitive types `RecId`, `LayoutPanelId`, `FieldName`.

## TypeScript support

Full type declarations ship in `dist/w2ui.d.ts` (will be renamed to `dist/tsgrid-ui.d.ts` once the build artifacts are rebuilt — see CHANGELOG). Strict mode is active in source: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.

```ts
import { TsGrid, type TsGridColumn, type TsGridCellSelection } from 'tsgrid-ui'

const cols: TsGridColumn[] = [
    { field: 'name', text: 'Name', sortable: true }
]
```

## Building

```bash
pnpm install
pnpm build       # CSS (gulp) + JS (tsup) + .d.ts rollup
pnpm verify      # lint + typecheck + consumer-smoke + unit tests + Playwright smoke
```

| Script               | Purpose                                             |
|----------------------|-----------------------------------------------------|
| `pnpm test`          | ESLint + `tsc --noEmit`                             |
| `pnpm test:unit`     | Vitest unit suite (w2utils helpers, w2base events, types brands) |
| `pnpm consumer-smoke`| Typecheck the public API surface as a consumer would |
| `pnpm smoke`         | Playwright DOM smoke harness (38 tests)             |
| `pnpm verify`        | All of the above, end-to-end                        |
| `pnpm dev`           | tsup watch mode for JS bundle                       |
| `pnpm start`         | Local dev server (Python http.server) on :3500     |

## Migration from w2ui

If you're coming from `w2ui` v2.0 or v2.1, see [MIGRATION-FROM-W2UI.md](MIGRATION-FROM-W2UI.md) for the complete renaming map (JS globals, CSS classes, file paths, jQuery shim removal).

## Acknowledgments

TsGrid UI is a hard fork of **[w2ui](https://github.com/vitmalina/w2ui)** by **Vit Malina** ([@vitmalina](https://github.com/vitmalina)). The original w2ui (MIT-licensed, started in 2014) was the foundation for this project — every widget pattern, every interaction model, and most of the architectural decisions originate there. This fork's contribution is:

- A full **TypeScript-native** port (the original was JS with optional types).
- Modern **tsup / esbuild** build pipeline replacing the original Gulp-based regex concat.
- **Zero runtime dependencies** — the jQuery shim (`w2compat`) was removed.
- **Vitest** unit test layer alongside the original Playwright smoke harness.
- **Renamed identity** at every layer (package, globals, classes, types, CSS classes) to operate as an independent library while preserving the original's MIT copyright per license terms.

If you need the original library, please use [vitmalina/w2ui](https://github.com/vitmalina/w2ui).

## License

[MIT](LICENSE) — preserves the original w2ui copyright (2014, Vit Malina) and adds the fork copyright (2026, DaverSoGT). You are free to use, modify, and redistribute under MIT terms.
