// TsUi 2.0 — ESM barrel file (public API)
// This file is the entry point for dist/tsgrid-ui.es6.js (tsup ESM build)
// @deprecated as of v2.15.0 — import from per-widget subpaths instead.
// See MIGRATION_v2.md#v2150--barrel-deprecation

// === Deprecation warning (v2.15.0) — fires once per module evaluation in dev only.
// Dead-code-eliminated by Vite/webpack/esbuild in production builds via NODE_ENV substitution.
// Guarded by `typeof process` so it's SSR-safe in browser-only contexts that lack `process`.
declare const process: { env?: { NODE_ENV?: string } } | undefined
let _barrelDeprecationWarned = false
if (
    !_barrelDeprecationWarned &&
    typeof process !== 'undefined' &&
    process?.env?.NODE_ENV !== 'production'
) {
    _barrelDeprecationWarned = true
    console.warn(
        '[tsgrid-ui] Importing from "tsgrid-ui" (the flat barrel) is deprecated as of v2.15.0 ' +
        'and will be removed in v3.0. Migrate to per-widget subpaths: ' +
        '`import { TsGrid } from "tsgrid-ui/grid"`. ' +
        'See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation'
    )
}

// === Classes ===

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/utils` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsUi, TsUtils, query } from './tsutils.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/locale` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsLocale } from './tslocale.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/base` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsEvent, TsBase, toSafeEvent } from './tsbase.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/popup` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog } from './tspopup.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/tooltip` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsTooltip, TsMenu, TsColor, TsDate, Tooltip } from './tstooltip.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/toolbar` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsToolbar } from './tstoolbar.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/sidebar` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsSidebar } from './tssidebar.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/tabs` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsTabs } from './tstabs.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/layout` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsLayout } from './tslayout.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/grid` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsGrid } from './tsgrid.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/form` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsForm } from './tsform.js'

/**
 * @deprecated Import from the per-widget subpath `tsgrid-ui/field` instead.
 * The flat `tsgrid-ui` barrel is deprecated as of v2.15.0 and will be removed in v3.0.
 * See https://github.com/DaverSoGT/tsgrid-ui/blob/master/MIGRATION_v2.md#v2150--barrel-deprecation
 */
export { TsField } from './tsfield.js'

// === Public types — common ===

/**
 * @deprecated Import from `tsgrid-ui/utils` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type { RecId } from './types.js'

/**
 * @deprecated Import from `tsgrid-ui/base` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type { TsEventData, TsEventPayload } from './tsbase.js'

// === Public types — TsGrid ===

/**
 * @deprecated Import from `tsgrid-ui/grid` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type {
    TsGridRecord,
    TsGridColumn,
    TsGridSearch,
    TsGridSortData,
    TsGridSelection,
    TsGridCellSelection,
    TsGridRange,
    TsGridRangeEndpoint,
    TsGridGroupBy,
} from './tsgrid.js'

// === Public types — TsField ===

/**
 * @deprecated Import from `tsgrid-ui/field` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type {
    TsFieldOptions,
    TsFieldElement,
    TsFieldNumericOptions,
    TsFieldColorOptions,
    TsFieldDateOptions,
    TsFieldTimeOptions,
    TsFieldDateTimeOptions,
    TsFieldListOptions,
    TsFieldEnumOptions,
    TsFieldFileOptions,
} from './tsfield.js'

// === Public types — TsLayout ===

/**
 * @deprecated Import from `tsgrid-ui/layout` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type {
    TsLayoutPanel,
    TsPanelType,
    TsPanelContent,
} from './tslayout.js'

// === Public types — TsSidebar ===

/**
 * @deprecated Import from `tsgrid-ui/sidebar` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type {
    TsSidebarRefreshOptions,
    TsSidebarUpdateOptions,
    TsSidebarSetCountOptions,
    TsSidebarFindOptions,
    TsSidebarSortOptions,
} from './tssidebar.js'

// === Public types — TsLocale / TsUtils ===

/**
 * @deprecated Import from `tsgrid-ui/locale` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type { TsLocaleSettings } from './tslocale.js'

/**
 * @deprecated Import from `tsgrid-ui/utils` instead. Barrel removed in v3.0.
 * See MIGRATION_v2.md#v2150--barrel-deprecation
 */
export type {
    TsMessageProm,
    TsMessageWhere,
    TsMessageOptions,
    TsMenuItem,
    TsColorRgb,
    TsLockOptions,
    TsCloneOptions,
} from './tsutils.js'
