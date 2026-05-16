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
 */

// Import all 23 public names from the source barrel
import {
    TsUi,
    TsUtils,
    query,
    TsLocale,
    TsEvent,
    TsBase,
    TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog,
    TsTooltip, TsMenu, TsColor, TsDate, Tooltip,
    TsToolbar,
    TsSidebar,
    TsTabs,
    TsLayout,
    TsGrid,
    TsForm,
    TsField,
} from '../src/index.js'
import type { TsEventPayload } from '../src/index.js'

// Import branded types from src/types.ts
import type { Brand, RecId, LayoutPanelId, FieldName } from '../src/types.js'

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
// Branded type smoke checks
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

// ===========================================================================
// v2.8.0 subpath exports — runtime + type-only probes (INV-SX-3, REQ-SX-6)
// Cycle 6: 12 subpaths (./grid reintroduced).
// ===========================================================================

// 12 named-import probes (runtime side — proves dist/{name}.es6.js resolves)
import { TsLocale as _SP_TsLocale }                                                                          from 'tsgrid-ui/locale'
import { TsBase as _SP_TsBase, TsEvent as _SP_TsEvent, toSafeEvent as _SP_toSafeEvent }                     from 'tsgrid-ui/base'
import { TsUi as _SP_TsUi, TsUtils as _SP_TsUtils, query as _SP_query }                                     from 'tsgrid-ui/utils'
import { TsPopup as _SP_TsPopup, TsAlert as _SP_TsAlert, TsConfirm as _SP_TsConfirm, TsPrompt as _SP_TsPrompt, TsDialog as _SP_TsDialog } from 'tsgrid-ui/popup'
import { TsTooltip as _SP_TsTooltip, TsMenu as _SP_TsMenu, TsColor as _SP_TsColor, TsDate as _SP_TsDate, Tooltip as _SP_Tooltip }        from 'tsgrid-ui/tooltip'
import { TsTabs as _SP_TsTabs }       from 'tsgrid-ui/tabs'
import { TsToolbar as _SP_TsToolbar } from 'tsgrid-ui/toolbar'
import { TsSidebar as _SP_TsSidebar } from 'tsgrid-ui/sidebar'
import { TsField as _SP_TsField }     from 'tsgrid-ui/field'
import { TsLayout as _SP_TsLayout }   from 'tsgrid-ui/layout'
import { TsForm as _SP_TsForm }       from 'tsgrid-ui/form'
import { TsGrid as _SP_TsGrid }       from 'tsgrid-ui/grid'
void _SP_TsLocale; void _SP_TsBase; void _SP_TsEvent; void _SP_toSafeEvent
void _SP_TsUi; void _SP_TsUtils; void _SP_query
void _SP_TsPopup; void _SP_TsAlert; void _SP_TsConfirm; void _SP_TsPrompt; void _SP_TsDialog
void _SP_TsTooltip; void _SP_TsMenu; void _SP_TsColor; void _SP_TsDate; void _SP_Tooltip
void _SP_TsTabs; void _SP_TsToolbar; void _SP_TsSidebar; void _SP_TsField
void _SP_TsLayout; void _SP_TsForm; void _SP_TsGrid

// 12 type-only-import probes (per design §6 Resolution 1 — class-as-type via typeof for const exports)
import type { TsLocaleSettings }    from 'tsgrid-ui/locale'
import type { TsEventData }         from 'tsgrid-ui/base'
import type { TsMessageOptions }    from 'tsgrid-ui/utils'
import type { TsSidebarRefreshOptions } from 'tsgrid-ui/sidebar'
import type { TsFieldOptions }      from 'tsgrid-ui/field'
import type { TsLayoutPanel }       from 'tsgrid-ui/layout'
// popup, tooltip, tabs, toolbar, form: TsPopup/TsMenu/TsTabs/TsToolbar/TsForm are const exports,
// use typeof of the already-imported value binding for type-only validation
const _t_locale : TsLocaleSettings          | undefined = undefined ; void _t_locale
const _t_base   : TsEventData               | undefined = undefined ; void _t_base
const _t_utils  : TsMessageOptions          | undefined = undefined ; void _t_utils
const _t_popup  : typeof _SP_TsPopup        | undefined = undefined ; void _t_popup
const _t_tt     : typeof _SP_TsMenu         | undefined = undefined ; void _t_tt
const _t_tabs   : typeof _SP_TsTabs         | undefined = undefined ; void _t_tabs
const _t_tb     : typeof _SP_TsToolbar      | undefined = undefined ; void _t_tb
const _t_sb     : TsSidebarRefreshOptions   | undefined = undefined ; void _t_sb
const _t_field  : TsFieldOptions            | undefined = undefined ; void _t_field
const _t_lay    : TsLayoutPanel             | undefined = undefined ; void _t_lay
const _t_form   : typeof _SP_TsForm         | undefined = undefined ; void _t_form
// grid type-only probes (R-GSR-3, T-GSR-2)
import type {
    TsGridRecord, TsGridColumn, TsGridSearch, TsGridSortData,
    TsGridSelection, TsGridCellSelection, TsGridRange, TsGridRangeEndpoint, TsGridGroupBy,
} from 'tsgrid-ui/grid'
const _t_grid_record    : TsGridRecord        | undefined = undefined ; void _t_grid_record
const _t_grid_column    : TsGridColumn        | undefined = undefined ; void _t_grid_column
const _t_grid_search    : TsGridSearch        | undefined = undefined ; void _t_grid_search
const _t_grid_sort      : TsGridSortData      | undefined = undefined ; void _t_grid_sort
const _t_grid_selection : TsGridSelection     | undefined = undefined ; void _t_grid_selection
const _t_grid_cellsel   : TsGridCellSelection | undefined = undefined ; void _t_grid_cellsel
const _t_grid_range     : TsGridRange         | undefined = undefined ; void _t_grid_range
const _t_grid_rangeend  : TsGridRangeEndpoint | undefined = undefined ; void _t_grid_rangeend
const _t_grid_groupby   : TsGridGroupBy       | undefined = undefined ; void _t_grid_groupby

// ---------------------------------------------------------------------------
// Export nothing — this file is type-check-only
// ---------------------------------------------------------------------------
export {}
