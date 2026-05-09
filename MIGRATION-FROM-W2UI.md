# Migration Guide — w2ui v2.x → tsgrid-ui v1.0.0

This guide documents every renaming you need to apply when migrating an existing **w2ui** v2.0/v2.1 project to **tsgrid-ui** v1.0.0. The runtime API is **functionally identical** — every method, option, and event is preserved — but identifiers changed at every layer (package name, JS globals, TypeScript types, CSS classes, dist filenames).

> **Why fork?** TsGrid UI is a TypeScript-native, ESM-first redistribution of the original w2ui codebase by Vit Malina (2014, MIT). It removes the jQuery shim, modernizes the build pipeline (tsup + esbuild instead of Gulp regex concat), and ships a `.d.ts` rollup. The original project remains independently maintained at [vitmalina/w2ui](https://github.com/vitmalina/w2ui). License preserves the original copyright per MIT terms.

---

## Quick install

```bash
pnpm remove w2ui
pnpm add tsgrid-ui
```

```diff
- import { w2grid } from 'w2ui'
- import 'w2ui/css'
+ import { TsGrid } from 'tsgrid-ui'
+ import 'tsgrid-ui/css'
```

That's the smallest possible diff. The rest of this guide enumerates the full rename map for `git grep` / sed / IDE find-replace flows.

---

## 1. Package + dist filenames

| Before | After |
|---|---|
| `w2ui` | `tsgrid-ui` |
| `dist/w2ui.js` | `dist/tsgrid-ui.js` |
| `dist/w2ui.es6.js` | `dist/tsgrid-ui.es6.js` |
| `dist/w2ui.d.ts` | `dist/tsgrid-ui.d.ts` |
| `dist/w2ui.css` | `dist/tsgrid-ui.css` |
| `dist/w2ui.min.css` | `dist/tsgrid-ui.min.css` |

ESM consumers benefit from the `exports` map — `import 'tsgrid-ui'` and `import 'tsgrid-ui/css'` both resolve. (The `/dark` subpath was advertised by upstream w2ui but never had a generated artifact; tsgrid-ui v1.0 drops it. A real dark theme can be added in a future minor.)

## 2. JavaScript globals (widget classes)

| Before | After |
|---|---|
| `w2grid` | `TsGrid` |
| `w2form` | `TsForm` |
| `w2field` | `TsField` |
| `w2layout` | `TsLayout` |
| `w2sidebar` | `TsSidebar` |
| `w2tabs` | `TsTabs` |
| `w2toolbar` | `TsToolbar` |
| `w2tooltip` | `TsTooltip` |
| `w2popup` | `TsPopup` |

```diff
- const grid = new w2grid({ name: 'mygrid', columns, records })
+ const grid = new TsGrid({ name: 'mygrid', columns, records })
```

## 3. JavaScript globals (helpers + utilities)

| Before | After |
|---|---|
| `w2alert` | `TsAlert` |
| `w2confirm` | `TsConfirm` |
| `w2prompt` | `TsPrompt` |
| `w2color` | `TsColor` |
| `w2date` | `TsDate` |
| `w2menu` | `TsMenu` |
| `Dialog` | `TsDialog` |
| `w2utils` | `TsUtils` |
| `w2locale` | `TsLocale` |
| `w2base` | `TsBase` |
| `w2event` | `TsEvent` |
| `w2ui` (instance registry) | `TsUi` |

**Unchanged**: `query` (the DOM helper) and `Tooltip` (class name) keep their identifiers.

```diff
- w2alert('Saved!')
+ TsAlert('Saved!')

- w2utils.isEmail(value)
+ TsUtils.isEmail(value)

- if (w2ui['mygrid']) w2ui['mygrid'].refresh()
+ if (TsUi['mygrid']) TsUi['mygrid'].refresh()
```

## 4. TypeScript types

All `W2*` interfaces and types renamed to `Ts*`:

| Before | After |
|---|---|
| `W2GridColumn` | `TsGridColumn` |
| `W2GridSearch` | `TsGridSearch` |
| `W2GridSelection` | `TsGridSelection` |
| `W2GridCellSelection` | `TsGridCellSelection` |
| `W2GridRange` | `TsGridRange` |
| `W2GridRangeEndpoint` | `TsGridRangeEndpoint` |
| `W2GridSearchFilter` | `TsGridSearchFilter` |
| `W2GridRecord` | `TsGridRecord` |
| `W2EventData` | `TsEventData` |
| `W2EventListener` | `TsEventListener` |
| `W2LayoutPanel` | `TsLayoutPanel` |
| `W2FieldElement` | `TsFieldElement` |
| `W2LockOptions` | `TsLockOptions` |
| `W2TimeResult` | `TsTimeResult` |
| `W2MessageProm` | `TsMessageProm` |
| `W2Color` | **`TsColorRgb`** (special case — disambig from `TsColor` helper) |

Plus all the `W2Field*` / `W2Sidebar*` / `W2Grid*` option interfaces (`W2FieldNumericOptions` → `TsFieldNumericOptions`, etc.). Find-replace `\bW2([A-Z])` → `Ts$1` covers all of them in one pass.

**Brand types unchanged** (semantic, not library-prefixed): `RecId`, `LayoutPanelId`, `FieldName`.

## 5. CSS classes

The `.w2ui-*` prefix becomes `.tsg-*` everywhere:

| Before | After |
|---|---|
| `.w2ui-grid-data` | `.tsg-grid-data` |
| `.w2ui-form-field` | `.tsg-form-field` |
| `.w2ui-toolbar-btn` | `.tsg-toolbar-btn` |
| `.w2ui-icon-search` | `.tsg-icon-search` |
| `.w2ui-icon-arrow` | `.tsg-icon-arrow` |
| ... (all 1500+ classes) | replace prefix `w2ui-` → `tsg-` |

Sed/find-replace pattern: `s/\bw2ui-/tsg-/g`.

## 6. iconfont

Font family + class prefix:

| Before | After |
|---|---|
| `font-family: 'w2ui-font'` | `font-family: 'tsgrid-font'` |
| `<i class="w2ui-icon-search">` | `<i class="tsg-icon-search">` |
| `dist/w2ui-font.woff` (embedded base64) | `dist/tsgrid-font.woff` (embedded base64) |

The full set of icon names (`box`, `check`, `colors`, `columns`, `cross`, `drop`, `empty`, `eye-dropper`, `info`, `paste`, `pencil`, `plus`, `reload`, ...) is preserved — only the prefix changes.

## 7. jQuery support — REMOVED

The `w2compat.ts` shim that registered `$.fn.w2grid`, `$.fn.w2form`, `$.fn.w2render`, `$.fn.w2destroy`, `$.fn.w2tag`, `$.fn.w2overlay`, `$.fn.w2menu`, `$.fn.w2color`, `$.fn.w2popup`, `$.fn.w2marker`, `$.fn.w2field` is **gone**. tsgrid-ui is ESM-native.

```diff
- $('#my-grid').w2grid({ name: 'mygrid', columns, records })
+ const grid = new TsGrid({ name: 'mygrid', columns, records })
+ grid.render('#my-grid')
```

If you need jQuery plugin syntax, you can still use the original [vitmalina/w2ui](https://github.com/vitmalina/w2ui) project.

## 8. Globals registration (legacy `<script>` tag consumers)

The IIFE-wrapped CJS bundle (`dist/tsgrid-ui.js`) still attaches widgets to the global `window` for `<script>`-tag consumers:

```html
<script src="https://cdn.jsdelivr.net/npm/tsgrid-ui/dist/tsgrid-ui.js"></script>
<script>
  // Globals available now: TsGrid, TsForm, TsField, TsLayout, TsSidebar,
  // TsTabs, TsToolbar, TsTooltip, TsPopup, TsAlert, TsConfirm, TsPrompt,
  // TsColor, TsDate, TsMenu, TsDialog, Tooltip, TsUtils, TsLocale,
  // TsBase, TsEvent, TsUi, query
  const grid = new TsGrid({ /* ... */ })
</script>
```

## 9. Things that DIDN'T change

- All widget options + methods + events (functional behavior is identical)
- All locale/i18n configuration via `TsUtils.locale(...)`
- All event handlers, `.on()` / `.off()` / `.trigger()` semantics
- Selectors API (`query()` is the same DOM helper, same chainable methods)
- IIFE bundle still exposes globals for legacy `<script>` consumers
- License: still MIT, with the original Vit Malina (2014) copyright preserved

## 10. New in tsgrid-ui v1.0 (vs upstream w2ui v2.x)

- Full TypeScript-native source (zero `.js` in `src/`)
- Strict mode active (`strict`, `noUncheckedIndexedAccess`, etc.) — zero `@ts-nocheck`
- `.d.ts` rollup with all 23 public exports
- Branded primitive types (`RecId`, `LayoutPanelId`, `FieldName`)
- Discriminated `getSelection()` API: prefer the typed split methods `TsGrid.getSelectionRows()` / `TsGrid.getSelectionCells()` over the union-returning legacy wrapper
- Vitest unit test suite (84 tests covering helpers, events, brands)
- Modern build via tsup (esbuild) instead of Gulp's regex concat

## Help / questions

Open an issue at [github.com/DaverSoGT/tsgrid-ui/issues](https://github.com/DaverSoGT/tsgrid-ui/issues). For upstream w2ui questions, use [vitmalina/w2ui/issues](https://github.com/vitmalina/w2ui/issues).
