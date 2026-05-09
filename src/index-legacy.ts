// TsGrid UI 1.0 — Legacy IIFE barrel file (public API only)
// This file is the entry point for dist/TsUi.js (tsup CJS build → wrap-legacy.mjs post-process).
// Renamed to dist/tsgrid-ui.js in F11.
// jQuery shim (w2compat) was removed in F4 — no side-effect imports here.

export { TsUi, TsUtils, query } from './tsutils.js'
export { TsLocale } from './tslocale.js'
export { TsEvent, TsBase } from './tsbase.js'
export { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog } from './tspopup.js'
export { TsTooltip, TsMenu, TsColor, TsDate, Tooltip } from './tstooltip.js'
export { TsToolbar } from './tstoolbar.js'
export { TsSidebar } from './tssidebar.js'
export { TsTabs } from './tstabs.js'
export { TsLayout } from './tslayout.js'
export { TsGrid } from './tsgrid.js'
export { TsForm } from './tsform.js'
export { TsField } from './tsfield.js'
