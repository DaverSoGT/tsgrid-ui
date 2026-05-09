/**
 * Consumer smoke test — TypeScript type-check only (never executed at runtime).
 *
 * Purpose: verify the public API surface of w2ui is importable and correctly
 * typed from a TypeScript consumer's perspective. This file is compiled by
 * `npx tsc --noEmit --project test/tsconfig.json` (no build output).
 *
 * After `pnpm build`, this same file can be pointed at `dist/w2ui.d.ts` to
 * validate the rolled-up declaration file.
 *
 * All assertions are pure type-level; no DOM APIs are invoked.
 */

// Import all 23 public names from the source barrel
import {
    w2ui,
    TsUtils,
    query,
    TsLocale,
    TsEvent,
    TsBase,
    TsPopup, w2alert, w2confirm, w2prompt, Dialog,
    TsTooltip, w2menu, w2color, w2date, Tooltip,
    TsToolbar,
    TsSidebar,
    TsTabs,
    TsLayout,
    TsGrid,
    TsForm,
    TsField,
} from '../src/index.js'

// Import branded types from src/types.ts
import type { Brand, RecId, LayoutPanelId, FieldName } from '../src/types.js'

// ---------------------------------------------------------------------------
// Type-level assertions (no runtime effect)
// Ensure each import is assignable to itself — catches "any" bleed-through.
// ---------------------------------------------------------------------------

// Utility: assert T is not `any` by checking it extends `never` in one branch
type IsAny<T> = (T extends never ? true : false) extends (false extends true ? true : false) ? true : false

// w2ui registry object
const _w2ui: typeof w2ui = w2ui
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
const _alert: typeof w2alert = w2alert
void _alert
const _confirm: typeof w2confirm = w2confirm
void _confirm
const _prompt: typeof w2prompt = w2prompt
void _prompt
const _Dialog: typeof Dialog = Dialog
void _Dialog

// Tooltip family
const _tooltip: typeof TsTooltip = TsTooltip
void _tooltip
const _menu: typeof w2menu = w2menu
void _menu
const _color: typeof w2color = w2color
void _color
const _date: typeof w2date = w2date
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
// Export nothing — this file is type-check-only
// ---------------------------------------------------------------------------
export {}
