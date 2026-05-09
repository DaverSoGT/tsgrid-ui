// TsUi 2.0 — ESM barrel file (public API)
// This file is the entry point for dist/tsgrid-ui.es6.js (tsup ESM build)

// === Classes ===
export { TsUi, TsUtils, query } from './tsutils.js'
export { TsLocale } from './tslocale.js'
export { TsEvent, TsBase, toSafeEvent } from './tsbase.js'
export { TsPopup, TsAlert, TsConfirm, TsPrompt, TsDialog } from './tspopup.js'
export { TsTooltip, TsMenu, TsColor, TsDate, Tooltip } from './tstooltip.js'
export { TsToolbar } from './tstoolbar.js'
export { TsSidebar } from './tssidebar.js'
export { TsTabs } from './tstabs.js'
export { TsLayout } from './tslayout.js'
export { TsGrid } from './tsgrid.js'
export { TsForm } from './tsform.js'
export { TsField } from './tsfield.js'

// === Public types — common ===
export type { RecId } from './types.js'
export type { TsEventData, TsEventPayload } from './tsbase.js'

// === Public types — TsGrid ===
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
export type {
    TsLayoutPanel,
    TsPanelType,
    TsPanelContent,
} from './tslayout.js'

// === Public types — TsSidebar ===
export type {
    TsSidebarRefreshOptions,
    TsSidebarUpdateOptions,
    TsSidebarSetCountOptions,
    TsSidebarFindOptions,
    TsSidebarSortOptions,
} from './tssidebar.js'

// === Public types — TsLocale / TsUtils ===
export type { TsLocaleSettings } from './tslocale.js'
export type {
    TsMessageProm,
    TsMessageWhere,
    TsMessageOptions,
    TsMenuItem,
    TsColorRgb,
    TsLockOptions,
    TsCloneOptions,
} from './tsutils.js'
