// TsGrid UI 1.0 — Legacy IIFE barrel file (public API only)
// This file is the entry point for dist/TsUi.js (tsup CJS build → wrap-legacy.mjs post-process).
// Renamed to dist/tsgrid-ui.js in F11.
// jQuery shim (w2compat) was removed in F4 — no side-effect imports here.
// @deprecated as of v2.15.0 — see MIGRATION_v2.md#v2150--barrel-deprecation

/**
 * @deprecated Import from `tsgrid-ui/utils` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsUi, TsUtils, query } from './tsutils.js'

/**
 * @deprecated Import from `tsgrid-ui/locale` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsLocale } from './tslocale.js'

/**
 * @deprecated Import from `tsgrid-ui/base` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsEvent, TsBase } from './tsbase.js'

/**
 * @deprecated Import from `tsgrid-ui/popup` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog } from './tspopup.js'

/**
 * @deprecated Import from `tsgrid-ui/tooltip` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsTooltip, TsMenu, TsColor, TsDate, Tooltip } from './tstooltip.js'

/**
 * @deprecated Import from `tsgrid-ui/toolbar` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsToolbar } from './tstoolbar.js'

/**
 * @deprecated Import from `tsgrid-ui/sidebar` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsSidebar } from './tssidebar.js'

/**
 * @deprecated Import from `tsgrid-ui/tabs` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsTabs } from './tstabs.js'

/**
 * @deprecated Import from `tsgrid-ui/layout` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsLayout } from './tslayout.js'

/**
 * @deprecated Import from `tsgrid-ui/grid` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsGrid } from './tsgrid.js'

/**
 * @deprecated Import from `tsgrid-ui/form` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsForm } from './tsform.js'

/**
 * @deprecated Import from `tsgrid-ui/field` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsField } from './tsfield.js'
