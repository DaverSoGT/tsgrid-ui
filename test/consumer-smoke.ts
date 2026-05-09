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

// ---------------------------------------------------------------------------
// Export nothing — this file is type-check-only
// ---------------------------------------------------------------------------
export {}
