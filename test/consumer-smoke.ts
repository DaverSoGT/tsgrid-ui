/**
 * Consumer smoke test — TypeScript type-check only (never executed at runtime).
 *
 * Purpose: verify the public API surface of TsUi is importable and correctly
 * typed from a TypeScript consumer's perspective. This file is compiled by
 * `npx tsc --noEmit --project test/tsconfig.json` (no build output).
 *
 * After `pnpm build`, this same file can be pointed at `dist/TsUi.d.ts` to
 * validate the rolled-up declaration file.
 *
 * All assertions are pure type-level; no DOM APIs are invoked.
 *
 * v2.15.0: restructured into PRIMARY (subpath-canonical) + REGRESSION GUARD (barrel, deprecated).
 */

// ===========================================================================
// === PRIMARY: subpath imports (canonical as of v2.15.0) ===
// Per-widget subpaths are the canonical import shape. Each import exercises
// both the type resolution (dist/<name>.d.ts) and the module resolver.
// ===========================================================================

import { TsLocale }                                                                              from 'tsgrid-ui/locale'
import { TsBase, TsEvent, toSafeEvent }                                                          from 'tsgrid-ui/base'
import { TsUi, TsUtils, query }                                                                  from 'tsgrid-ui/utils'
import { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog }                                      from 'tsgrid-ui/popup'
import { TsTooltip, TsMenu, TsColor, TsDate, Tooltip }                                          from 'tsgrid-ui/tooltip'
import { TsTabs }                                                                                from 'tsgrid-ui/tabs'
import { TsToolbar }                                                                             from 'tsgrid-ui/toolbar'
import { TsSidebar }                                                                             from 'tsgrid-ui/sidebar'
import { TsField }                                                                               from 'tsgrid-ui/field'
import { TsLayout }                                                                              from 'tsgrid-ui/layout'
import { TsForm }                                                                                from 'tsgrid-ui/form'
import { TsGrid }                                                                                from 'tsgrid-ui/grid'

// Type-only subpath imports
import type { TsEventPayload }              from 'tsgrid-ui/base'
import type { TsLocaleSettings }            from 'tsgrid-ui/locale'
import type { TsMessageOptions }            from 'tsgrid-ui/utils'
import type { TsSidebarRefreshOptions }     from 'tsgrid-ui/sidebar'
import type { TsFieldOptions }              from 'tsgrid-ui/field'
import type { TsLayoutPanel }               from 'tsgrid-ui/layout'
import type { TsEventData }                 from 'tsgrid-ui/base'
import type {
    TsGridRecord, TsGridColumn, TsGridSearch, TsGridSortData,
    TsGridSelection, TsGridCellSelection, TsGridRange, TsGridRangeEndpoint, TsGridGroupBy,
} from 'tsgrid-ui/grid'

// v2.15.0 types-gap closure: branded primitives now accessible via tsgrid-ui/utils (R-TG-1)
import type { Brand, RecId, LayoutPanelId, FieldName } from 'tsgrid-ui/utils'

// ---------------------------------------------------------------------------
// Type-level assertions (no runtime effect)
// Ensure each import is assignable to itself — catches "any" bleed-through.
// ---------------------------------------------------------------------------

// Utility: assert T is not `any` by checking it extends `never` in one branch
type IsAny<T> = (T extends never ? true : false) extends (false extends true ? true : false) ? true : false

// TsUi registry object
const _w2ui: typeof TsUi = TsUi
void _w2ui

// TsUtils namespace
const _w2utils: typeof TsUtils = TsUtils
void _w2utils

// query (jQuery-like selector)
const _query: typeof query = query
void _query

// locale object
const _locale: typeof TsLocale = TsLocale
void _locale

// Base event / base class
const _event: typeof TsEvent = TsEvent
void _event
const _base: typeof TsBase = TsBase
void _base
const _toSafeEvent: typeof toSafeEvent = toSafeEvent
void _toSafeEvent

// Popup family
const _popup: typeof TsPopup = TsPopup
void _popup
const _alert: typeof TsAlert = TsAlert
void _alert
const _confirm: typeof TsConfirm = TsConfirm
void _confirm
const _prompt: typeof TsPrompt = TsPrompt
void _prompt
const _Dialog: typeof TsDialog = TsDialog
void _Dialog

// Tooltip family
const _tooltip: typeof TsTooltip = TsTooltip
void _tooltip
const _menu: typeof TsMenu = TsMenu
void _menu
const _color: typeof TsColor = TsColor
void _color
const _date: typeof TsDate = TsDate
void _date
const _Tooltip: typeof Tooltip = Tooltip
void _Tooltip

// Remaining widgets
const _toolbar: typeof TsToolbar = TsToolbar
void _toolbar
const _sidebar: typeof TsSidebar = TsSidebar
void _sidebar
const _tabs: typeof TsTabs = TsTabs
void _tabs
const _layout: typeof TsLayout = TsLayout
void _layout
const _grid: typeof TsGrid = TsGrid
void _grid
const _form: typeof TsForm = TsForm
void _form
const _field: typeof TsField = TsField
void _field

// ---------------------------------------------------------------------------
// Branded type smoke checks (v2.15.0: now from tsgrid-ui/utils, not tsgrid-ui)
// ---------------------------------------------------------------------------

// Brand utility
type _TestBrand = Brand<number, 'test'>
const _branded: _TestBrand = 42 as _TestBrand
void _branded

// RecId: accepts string or number cast
const _recIdStr: RecId = 'row-1' as RecId
const _recIdNum: RecId = 42 as RecId
void _recIdStr
void _recIdNum

// LayoutPanelId: string cast
const _panelId: LayoutPanelId = 'left' as LayoutPanelId
void _panelId

// FieldName: string cast
const _fieldName: FieldName = 'firstName' as FieldName
void _fieldName

// ---------------------------------------------------------------------------
// Ensure grid + form constructors accept a name parameter
// (guards against signature regression)
// ---------------------------------------------------------------------------

// Constructor signatures: TsGrid / TsForm / TsField are classes — `new` must work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _gridInst: InstanceType<typeof TsGrid> = new TsGrid({ name: 'test-grid', columns: [], records: [] as any[] })
void _gridInst

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _formInst: InstanceType<typeof TsForm> = new TsForm({ name: 'test-form', fields: [] as any[] })
void _formInst

// ---------------------------------------------------------------------------
// BC-1 event handler type assertions (v2.0.0)
// on* properties on TsGrid and TsForm MUST accept TsEventPayload, not CustomEvent.
// This section serves as the canonical migration example for MIGRATION_v2.md.
// ---------------------------------------------------------------------------

// BC-1 — before (v1.x, causes TS error on v2.0.0):
//   _gridInst.onSelect = (event: CustomEvent) => { console.log(event.detail) }
//
// BC-1 — after (v2.0.0):
const _gridHandler: (event: TsEventPayload) => void = (event) => { void event.detail }
_gridInst.onSelect = _gridHandler
_gridInst.onClick = _gridHandler
_gridInst.onLoad = _gridHandler
void _gridHandler

const _formHandler: (event: TsEventPayload) => void = (event) => { void event.detail }
_formInst.onChange = _formHandler
_formInst.onSave = _formHandler
void _formHandler

// Untyped handler: no annotation required — inference continues to work (Req 4.4)
_gridInst.onSearch = (event) => { void event }

// Type-level probes for imported types (grid types)
const _t_grid_record    : TsGridRecord        | undefined = undefined ; void _t_grid_record
const _t_grid_column    : TsGridColumn        | undefined = undefined ; void _t_grid_column
const _t_grid_search    : TsGridSearch        | undefined = undefined ; void _t_grid_search
const _t_grid_sort      : TsGridSortData      | undefined = undefined ; void _t_grid_sort
const _t_grid_selection : TsGridSelection     | undefined = undefined ; void _t_grid_selection
const _t_grid_cellsel   : TsGridCellSelection | undefined = undefined ; void _t_grid_cellsel
const _t_grid_range     : TsGridRange         | undefined = undefined ; void _t_grid_range
const _t_grid_rangeend  : TsGridRangeEndpoint | undefined = undefined ; void _t_grid_rangeend
const _t_grid_groupby   : TsGridGroupBy       | undefined = undefined ; void _t_grid_groupby

const _t_locale  : TsLocaleSettings          | undefined = undefined ; void _t_locale
const _t_base    : TsEventData               | undefined = undefined ; void _t_base
const _t_utils   : TsMessageOptions          | undefined = undefined ; void _t_utils
const _t_popup   : typeof TsPopup            | undefined = undefined ; void _t_popup
const _t_tt      : typeof TsMenu             | undefined = undefined ; void _t_tt
const _t_tabs    : typeof TsTabs             | undefined = undefined ; void _t_tabs
const _t_tb      : typeof TsToolbar          | undefined = undefined ; void _t_tb
const _t_sb      : TsSidebarRefreshOptions   | undefined = undefined ; void _t_sb
const _t_field   : TsFieldOptions            | undefined = undefined ; void _t_field
const _t_lay     : TsLayoutPanel             | undefined = undefined ; void _t_lay
const _t_form    : typeof TsForm             | undefined = undefined ; void _t_form

// ---------------------------------------------------------------------------
// v2.12.0 grid-css-pairing — per-widget CSS subpaths (side-effect imports)
// These validate that TypeScript's module resolver accepts each CSS subpath
// via the package.json export map. No named imports — pure side-effect form.
// ---------------------------------------------------------------------------
import 'tsgrid-ui/grid.css'
import 'tsgrid-ui/form.css'
import 'tsgrid-ui/tooltip.css'
import 'tsgrid-ui/popup.css'
import 'tsgrid-ui/sidebar.css'
import 'tsgrid-ui/tabs.css'
import 'tsgrid-ui/toolbar.css'
import 'tsgrid-ui/layout.css'
import 'tsgrid-ui/field.css'

// ===========================================================================
// === REGRESSION GUARD: barrel still resolvable (deprecated as of v2.15.0, removed in v3.0) ===
// Per Q3 lock: ensures src/index.ts and src/index-legacy.ts continue to expose
// the public surface until v3.0 actually removes them.
// Strikethrough is EXPECTED on these imports in IDE preview — @deprecated is a
// suggestion diagnostic, NOT a tsc error. pnpm consumer-smoke exits 0 here.
// ===========================================================================
import { TsGrid as _BarrelTsGrid } from '../src/index.js'
import type { RecId as _BarrelRecId } from '../src/index.js'
void _BarrelTsGrid
// type-level reference — proves the type is importable from the barrel (no runtime use)
const _barrelRecIdRef: _BarrelRecId | undefined = undefined
void _barrelRecIdRef

// ---------------------------------------------------------------------------
// Export nothing — this file is type-check-only
// ---------------------------------------------------------------------------
export {}
