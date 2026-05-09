# TsGrid UI

TypeScript-native UI component library: data grid, forms, fields, layout, sidebar, tabs, toolbar, popup, tooltip. Strict-mode TypeScript port of the venerable w2ui v2.0 codebase, with modern tooling, zero runtime dependencies, and full `.d.ts` declarations.

> **This is a hard fork of [w2ui](https://github.com/vitmalina/w2ui) by Vit Malina.** See [Acknowledgments](#acknowledgments) below.

[![npm version](https://img.shields.io/npm/v/tsgrid-ui.svg)](https://www.npmjs.com/package/tsgrid-ui)
[![license](https://img.shields.io/npm/l/tsgrid-ui.svg)](LICENSE)

> **v2.0 is a breaking release.** Event handler types changed (`CustomEvent` →
> `TsEventPayload`) and the internal `src/tsgrid.ts` has been decomposed into 8 sibling
> modules. The public API is unchanged — barrel consumers need no updates. Consumers who
> explicitly annotated handlers with `CustomEvent` must apply a one-line codemod. No bundle
> reduction is claimed. See [MIGRATION_v2.md](MIGRATION_v2.md) for the codemod regex,
> full migration guide, and release checklist.

## Install

```bash
pnpm add tsgrid-ui
# or: npm install tsgrid-ui
# or: yarn add tsgrid-ui
```

## Quick start

```ts
import { TsGrid } from 'tsgrid-ui'
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
