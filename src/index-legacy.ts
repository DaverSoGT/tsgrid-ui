// TsGrid UI 1.0 — Legacy IIFE barrel file (public API only)
// This file is the entry point for dist/w2ui.js (tsup CJS build → wrap-legacy.mjs post-process).
// Renamed to dist/tsgrid-ui.js in F11.
// jQuery shim (w2compat) was removed in F4 — no side-effect imports here.

export { w2ui, w2utils, query } from './tsutils.js'
export { w2locale } from './tslocale.js'
export { w2event, w2base } from './tsbase.js'
export { w2popup, w2alert, w2confirm, w2prompt, Dialog } from './tspopup.js'
export { w2tooltip, w2menu, w2color, w2date, Tooltip } from './tstooltip.js'
export { w2toolbar } from './tstoolbar.js'
export { w2sidebar } from './tssidebar.js'
export { w2tabs } from './tstabs.js'
export { w2layout } from './tslayout.js'
export { w2grid } from './tsgrid.js'
export { w2form } from './tsform.js'
export { w2field } from './tsfield.js'
