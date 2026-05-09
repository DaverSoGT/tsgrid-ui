// TsGrid UI 1.0 — Legacy IIFE barrel file (public API only)
// This file is the entry point for dist/w2ui.js (tsup CJS build → wrap-legacy.mjs post-process).
// Renamed to dist/tsgrid-ui.js in F11.
// jQuery shim (w2compat) was removed in F4 — no side-effect imports here.

export { w2ui, w2utils, query } from './w2utils.js'
export { w2locale } from './w2locale.js'
export { w2event, w2base } from './w2base.js'
export { w2popup, w2alert, w2confirm, w2prompt, Dialog } from './w2popup.js'
export { w2tooltip, w2menu, w2color, w2date, Tooltip } from './w2tooltip.js'
export { w2toolbar } from './w2toolbar.js'
export { w2sidebar } from './w2sidebar.js'
export { w2tabs } from './w2tabs.js'
export { w2layout } from './w2layout.js'
export { w2grid } from './w2grid.js'
export { w2form } from './w2form.js'
export { w2field } from './w2field.js'
