/**
 * Part of TsUi 2.0 library
 *  - Dependencies: TsUtils, TsBase, TsToolbar, TsTooltip, TsField
 *
 * T5.1: Renamed src/TsGrid.js → src/TsGrid.ts.
 * Skeleton + data CRUD cluster typed per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 * T5.6 will fix the pre-existing `??` unreachable warning at original line 3061.
 * EXCEPTION: 9,115 LOC initial rename; subsequent T5.2–T5.9 sub-units are
 * incremental edits ≤400 LOC each on the same .ts file.
 *
 * == TODO ==
 *  - problem with .set() and arrays, array get extended too, but should be replaced
 *  - allow functions in routeData (also add routeData to list/enum)
 *  - send parsed URL to the event if there is routeData
 *  - add selectType: 'none' so that no selection can be make but with mouse
 *  - focus/blur for selectType = cell not display grayed out selection
 *  - allow enum in inline edit (see https://github.com/vitmalina/TsUi/issues/911#issuecomment-107341193)
 *  - remote source, but localSort/localSearch
 *  - promise for request, load, save, etc.
 *  - onloadmore event (so it will be easy to implement remote data source with local sort)
 *  - status() - clears on next select, etc. Should not if it is off
 *
 * == DEMOS To create ==
 *  - batch for disabled buttons
 *  - natural sort
 *
 * == 2.0 changes
 *  - toolbarInput - deprecated, toolbarSearch stays
 *  - searchSuggest
 *  - searchSave, searchSelected, savedSearches, defaultSearches, useLocalStorage, searchFieldTooltip
 *  - cache, cacheSave
 *  - onSearchSave, onSearchRemove, onSearchSelect
 *  - show.searchLogic
 *  - show.searchSave
 *  - refreshSearch
 *  - initAllFields -> searchInitInput
 *  - textSearch - deprecated in favor of defaultOperator
 *  - grid.confirm - refactored
 *  - grid.message - refactored
 *  - search.type == 'text' can have 'in' and 'not in' operators, then it will switch to enum
 *  - grid.find(..., displayedOnly)
 *  - column.render(..., this) - added
 *  - observeResize for the box
 *  - remove edit.type == 'select'
 *  - editDone(...)
 *  - liveSearch
 *  - deprecated onUnselect event
 *  - requestComplete(data, action, callBack, resolve, reject) - new argument list
 *  - msgAJAXError -> msgHTTPError
 *  - aded msgServerError
 *  - added mouseEnter/mouseLeave
 *  - grid.show.columnReorder -> grid.reorderRows
 *  - updagte docs search.label (not search.text)
 *  - added columnAutoSize - which resizes column based on text in it
 *  - added grid.replace()
 *  - grid.compareSelection
 *  - this.showContextMenu(event, { recid, column, index }) - arguments changed
 *  - this.parseField
 *  - added rec.TsUi.selectable
 *  - added rec.TsUi.styles
 *  - added grid.groupBy = {} and grid.last.groupBy_links = {}
 */

import { TsBase, TsEventPayload } from './tsbase.js'
import { TsUi, TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'
import type { RecId } from './types.js'
import * as gridColumns from './grid-columns.js'
import * as gridState from './grid-state.js'
import * as gridData from './grid-data.js'
import * as gridSelection from './grid-selection.js'
import * as gridEdit from './grid-edit.js'
import * as gridSearch from './grid-search.js'
import { reloadIcon, columnsIcon, searchIcon, plusIcon, pencilIcon, crossIcon, checkIcon } from './icons.js'
import * as gridInteraction from './grid-interaction.js'
import * as gridRender from './grid-render.js'

// any: query() always returns Query at runtime; cast to any for clean duck-typing throughout TsGrid
// (grid makes extensive use of .get(0) as HTMLElement and Node.style patterns)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like in TsGrid
// ---------------------------------------------------------------------------
// Type definitions — T5.1 (skeleton + CRUD); T5.2 (column + search cluster)
//                    T5.4 (selection + ranges)
// Additional interfaces added in T5.3–T5.9 as clusters are typed
// ---------------------------------------------------------------------------

/** A single data record stored in the grid */
export interface TsGridRecord {
    recid: string | number
    TsUi?: {
        summary?: boolean
        children?: TsGridRecord[]
        parent_recid?: string | number
        expanded?: boolean
        selectable?: boolean
        styles?: Record<string, string>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any // any: dynamic per-record TsUi metadata
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: user-defined field values
}

/** Sort descriptor used in grid.sortData */
export interface TsGridSortData {
    field: string
    direction: 'asc' | 'desc'
    field_?: string // any: runtime-computed cached field name for date/time render types (localSort internal)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: runtime-assigned sort state properties
}

/** Virtual scroll state kept in grid.last.vscroll */
interface TsGridVScroll {
    scrollTop: number
    scrollLeft: number
    recIndStart: number | null
    recIndEnd: number | null
    colIndStart: number
    colIndEnd: number
    pull_more: boolean
    pull_refresh: boolean
    show_extra: number
}

/** Fetch state kept in grid.last.fetch */
interface TsGridFetch {
    action: string
    offset?: number | null
    start: number
    response: number
    options: RequestInit | null
    controller: AbortController | null
    loaded: boolean
    hasMore: boolean
}

/** Column definition — T5.2 */
export interface TsGridColumn {
    field: string
    text: string | ((col: TsGridColumn) => string)
    size?: string | number        // CSS size e.g. '100px' or '20%'
    min?: number                  // minimum pixel width (for resize)
    max?: number                  // maximum pixel width (for resize)
    frozen?: boolean              // if true column is frozen (left-pinned)
    hidden?: boolean              // if true column is hidden
    hideable?: boolean            // if false user cannot hide/show via menu
    resizable?: boolean           // if false resize handle is omitted
    sortable?: boolean            // if false column header is not clickable for sort
    searchable?: boolean | string // if true/string auto-adds a search field
    sortMode?: string             // 'default' | 'natural' | 'i18n' | function
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editable?: boolean | { type: string; [key: string]: any } | ((rec: TsGridRecord, cell: any) => any)
    render?: string | ((record: TsGridRecord, index: number, colIndex: number) => string)
    tooltip?: string              // tooltip shown on column header hover
    style?: string                // inline CSS for cells in this column
    attr?: string                 // HTML attributes for <td> elements
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clipboardCopy?: boolean | ((record: TsGridRecord, cell: any) => string) // if true/function show clipboard copy icon in cells
    colspan?: Record<string, number> | ((record: TsGridRecord, index: number) => number)
    sizeCalculated?: string       // runtime-computed pixel width string (e.g. '120px')
    sizeOriginal?: string | number // original size before resize operations
    sizeType?: string             // 'px' or '%'
    gridMinWidth?: number         // minimum grid width for this column to be visible
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any            // any: custom per-column metadata
}

/** Search field definition — T5.2 */
export interface TsGridSearch {
    field: string
    label?: string
    caption?: string              // deprecated alias for label
    type: string                  // 'text' | 'int' | 'float' | 'date' | 'list' | 'enum' | 'new-column' | ...
    hidden?: boolean
    attr?: string                 // HTML attributes for the search input
    text?: string                 // extra text/HTML rendered in the search row
    style?: string                // CSS style for the search cell
    operator?: string             // default operator key for this search
    operators?: string[]          // override available operators for this search
    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: Record<string, any> // extra options passed to TsField (list items, etc.)
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any                   // current value of the search field (runtime)
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svalue?: any                  // display value for enum/list searches (runtime)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any            // any: custom per-search metadata
}

/** Internal last-state object */
interface TsGridLast {
    field: string
    label: string
    logic: 'AND' | 'OR'
    search: string
    searchIds: number[]
    selection: TsGridSelection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saved_sel: any | null // any: complex selection restore payload
    multi: boolean
    fetch: TsGridFetch
    vscroll: TsGridVScroll
    sel_ind: number | null
    sel_col: number | null
    sel_type: string | null
    sel_recid: string | number | null
    idCache: Record<string | number, number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    move: any | null // any: drag/move state object shape varies
    cancelClick: boolean | null
    inEditMode: boolean
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _edit: { value: any; index: number; column: number; recid: string | number; [key: string]: any } | null
    kbd_timer: ReturnType<typeof setTimeout> | null
    marker_timer: ReturnType<typeof setTimeout> | null
    click_time: number | null
    click_recid: string | number | null
    bubbleEl: HTMLElement | null
    colResizing: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmp: any | null // any: column resize temp state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copy_event: any | null // any: copy() returns a TsEvent with .detail.text, not a ClipboardEvent
    userSelect: string
    columnDrag: false | { remove(): void }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any | null // any: serialized grid state blob
    toolbar_height: number
    groupBy_links: Record<string, TsGridRecord>
    originalSort?: (string | number)[] // any: saved original record order for sort restore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: runtime-assigned transient last-state properties
}

/** Cell-level selection descriptor returned by `getSelectionCells()` (and by `getSelection()` when `selectType === 'cell'`). */
export interface TsGridCellSelection {
    recid: string | number
    index: number
    column: number
}

/** Selection state — T5.4 */
export interface TsGridSelection {
    indexes: number[]
    columns: Record<string | number, number[]>
}

/** Range endpoint (used in addRange / refreshRanges) */
export interface TsGridRangeEndpoint {
    recid: string | number
    column: number
    index?: number  // runtime index (added by refreshRanges)
}

/** Range descriptor for addRange / refreshRanges */
export interface TsGridRange {
    name: string
    range: TsGridRangeEndpoint[]  // [start, end] — 2-element in practice
    style?: string
    class?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: custom range metadata
}

/** Active search filter — one entry in grid.searchData — T5.5 */
interface TsGridSearchFilter {
    field: string
    type: string
    operator: string
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svalue?: any // display values for enum/list searches
    text?: string // display text for list/enum
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: dynamic search filter props
}

/** GroupBy configuration object */
export interface TsGridGroupBy {
    field: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: user can attach extra groupBy metadata
}

class TsGrid extends TsBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: dynamic properties added via TsUtils.extend and event handlers

    declare name: string
    declare box: HTMLElement | null
    columns: TsGridColumn[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnGroups: any[]   // any: column group shapes — span/text/main/style; minimal typing for T5.2
    records: TsGridRecord[]
    summary: TsGridRecord[]
    searches: TsGridSearch[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolbar: any          // any: TsToolbar instance or config object
    ranges: TsGridRange[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenu: any[]    // any: context menu item shapes
    searchMap: Record<string, string>
    searchData: TsGridSearchFilter[]
    sortMap: Record<string, string>
    sortData: TsGridSortData[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    savedSearches: any[]  // any: saved search objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultSearches: any[] // any: default search objects
    groupBy: TsGridGroupBy | null
    total: number
    recid: string | null
    hierarchyColumn: number
    last: TsGridLast
    header: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    url: any // any: url can be string or {get,save,remove,...} object; duck-typed with ?.get ?? url pattern
    limit: number
    offset: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postData: Record<string, any> // any: user-supplied post data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeData: Record<string, any> // any: route params
    httpHeaders: Record<string, string>
    show: {
        header: boolean; toolbar: boolean; footer: boolean; columnMenu: boolean
        columnHeaders: boolean; lineNumbers: boolean; expandColumn: boolean
        selectColumn: boolean; emptyRecords: boolean; toolbarReload: boolean
        toolbarColumns: boolean; toolbarSearch: boolean; toolbarAdd: boolean
        toolbarEdit: boolean; toolbarDelete: boolean; toolbarSave: boolean
        searchAll: boolean; searchLogic: boolean; searchHiddenMsg: boolean
        searchSave: boolean; statusRange: boolean; statusBuffered: boolean
        statusRecordID: boolean; statusSelection: boolean; statusResponse: boolean
        statusSort: boolean; statusSearch: boolean; recordTitles: boolean
        selectionBorder: boolean; selectionResizer: boolean; skipRecords: boolean
        saveRestoreState: boolean; columns?: boolean
    }
    stateId: string | null
    hasFocus: boolean
    autoLoad: boolean
    fixedBody: boolean
    recordHeight: number
    lineNumberWidth: number
    keyboard: boolean
    selectType: 'row' | 'cell'
    liveSearch: boolean
    multiSearch: boolean
    multiSelect: boolean
    multiSort: boolean
    reorderColumns: boolean
    reorderRows: boolean
    showExtraOnSearch: number
    markSearch: boolean
    columnTooltip: string
    disableCVS: boolean
    nestedFields: boolean
    vs_start: number
    vs_extra: number
    style: string
    tabIndex: number | null
    dataType: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parser: ((data: any) => any) | null // any: parser transforms arbitrary server response
    advanceOnEdit: boolean
    useLocalStorage: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colTemplate: Record<string, any> // any: column template default values
    stateColProps: Record<string, boolean>
    msgDelete: string
    msgNotJSON: string
    msgHTTPError: string
    msgServerError: string
    msgRefresh: string
    msgNeedReload: string
    msgEmpty: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttons: Record<string, any> // any: toolbar button definitions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operators: Record<string, any[]>  // any: operator list items vary by type
    defaultOperator: Record<string, string>
    operatorsMap: Record<string, string>
    // event handlers
    onAdd: ((event: TsEventPayload) => void) | null
    onEdit: ((event: TsEventPayload) => void) | null
    onRequest: ((event: TsEventPayload) => void) | null
    onLoad: ((event: TsEventPayload) => void) | null
    onDelete: ((event: TsEventPayload) => void) | null
    onSave: ((event: TsEventPayload) => void) | null
    onSelect: ((event: TsEventPayload) => void) | null
    onClick: ((event: TsEventPayload) => void) | null
    onDblClick: ((event: TsEventPayload) => void) | null
    onContextMenu: ((event: TsEventPayload) => void) | null
    onContextMenuClick: ((event: TsEventPayload) => void) | null
    onColumnClick: ((event: TsEventPayload) => void) | null
    onColumnDblClick: ((event: TsEventPayload) => void) | null
    onColumnContextMenu: ((event: TsEventPayload) => void) | null
    onColumnResize: ((event: TsEventPayload) => void) | null
    onColumnAutoResize: ((event: TsEventPayload) => void) | null
    onSort: ((event: TsEventPayload) => void) | null
    onSearch: ((event: TsEventPayload) => void) | null
    onSearchOpen: ((event: TsEventPayload) => void) | null
    onSearchClose: ((event: TsEventPayload) => void) | null
    onChange: ((event: TsEventPayload) => void) | null
    onRestore: ((event: TsEventPayload) => void) | null
    onExpand: ((event: TsEventPayload) => void) | null
    onCollapse: ((event: TsEventPayload) => void) | null
    onError: ((event: TsEventPayload) => void) | null
    onKeydown: ((event: TsEventPayload) => void) | null
    onToolbar: ((event: TsEventPayload) => void) | null
    onColumnOnOff: ((event: TsEventPayload) => void) | null
    onCopy: ((event: TsEventPayload) => void) | null
    onPaste: ((event: TsEventPayload) => void) | null
    onSelectionExtend: ((event: TsEventPayload) => void) | null
    onEditField: ((event: TsEventPayload) => void) | null
    onRender: ((event: TsEventPayload) => void) | null
    onRefresh: ((event: TsEventPayload) => void) | null
    onReload: ((event: TsEventPayload) => void) | null
    onResize: ((event: TsEventPayload) => void) | null
    onDestroy: ((event: TsEventPayload) => void) | null
    onStateSave: ((event: TsEventPayload) => void) | null
    onStateRestore: ((event: TsEventPayload) => void) | null
    onFocus: ((event: TsEventPayload) => void) | null
    onBlur: ((event: TsEventPayload) => void) | null
    onReorderRow: ((event: TsEventPayload) => void) | null
    onSearchSave: ((event: TsEventPayload) => void) | null
    onSearchRemove: ((event: TsEventPayload) => void) | null
    onSearchSelect: ((event: TsEventPayload) => void) | null
    onColumnSelect: ((event: TsEventPayload) => void) | null
    onColumnDragStart: ((event: TsEventPayload) => void) | null
    onColumnDragEnd: ((event: TsEventPayload) => void) | null
    onResizerDblClick: ((event: TsEventPayload) => void) | null
    onMouseEnter: ((event: TsEventPayload) => void) | null
    onMouseLeave: ((event: TsEventPayload) => void) | null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: Record<string, any>) { // any: options bag is user-supplied
        super(options['name'])
        this.name         = ''
        this.box          = null // HTML element that hold this element
        this.columns      = [] // { field, text, size, attr, render, hidden, gridMinWidth, editable }
        this.columnGroups = [] // { span: int, text: 'string', main: true/false, style: 'string' }
        this.records      = [] // { recid: int(required), field1: 'value1', ... fieldN: 'valueN', style: 'string',  changes: object }
        this.summary      = [] // array of summary records, same structure as records array
        this.searches     = [] // { type, label, field, attr, text, hidden }
        this.toolbar      = {} // if not empty object; then it is toolbar object
        this.ranges       = []
        this.contextMenu  = []
        this.searchMap    = {} // re-map search fields
        this.searchData   = []
        this.sortMap      = {} // re-map sort fields
        this.sortData     = []
        this.savedSearches   = []
        this.defaultSearches = []
        this.groupBy      = null // defines how to group records
        this.total        = 0 // server total
        this.recid        = null // field from records to be used as recid
        this.hierarchyColumn = 0 // index of the hierarchy column

        // internal
        this.last = {
            field     : '',         // last search field, e.g. 'all'
            label     : '',         // last search field label, e.g. 'All Fields'
            logic     : 'AND',      // last search logic, e.g. 'AND' or 'OR'
            search    : '',         // last search text
            searchIds : [],         // last search IDs
            selection : {           // last selection details
                indexes : [],
                columns : {}
            },
            saved_sel     : null,     // last result of selectionSave()
            multi         : false,    // last multi flag, true when searching for multiple fields
            fetch: {
                action    : '',       // last fetch command, e.g. 'load'
                offset    : null,     // last fetch offset, integer
                start     : 0,        // timestamp of start of last fetch request
                response  : 0,        // time it took to complete the last fetch request in seconds
                options   : null,
                controller: null,
                loaded    : false,    // data is loaded from the server
                hasMore   : false     // flag to indicate if there are more items to pull from the server
            },
            vscroll: {
                scrollTop     : 0,    // last scrollTop position
                scrollLeft    : 0,    // last scrollLeft position
                recIndStart   : null, // record index for first record in DOM
                recIndEnd     : null, // record index for last record in DOM
                colIndStart   : 0,    // for column virtual scrolling
                colIndEnd     : 0,    // for column virtual scrolling
                pull_more     : false,
                pull_refresh  : true,
                show_extra    : 0,    // last show extra for virtual scrolling
            },
            sel_ind       : null,     // last selected cell index
            sel_col       : null,     // last selected column
            sel_type      : null,     // last selection type, e.g. 'click' or 'key'
            sel_recid     : null,     // last selected record id
            idCache       : {},       // object, id cache for get()
            move          : null,     // object, move details
            cancelClick   : null,     // boolean flag to indicate if the click event should be ignored, set during mouseMove()
            inEditMode    : false,    // flag to indicate if we're currently in edit mode during inline editing
            _edit         : null,     // object with details on the last edited cell, { value, index, column, recid }
            kbd_timer     : null,     // last id of blur() timer
            marker_timer  : null,     // last id of markSearch() timer
            click_time    : null,     // timestamp of last click
            click_recid   : null,     // last clicked record id
            bubbleEl      : null,     // last bubble element
            colResizing   : false,    // flag to indicate that a column is currently being resized
            tmp           : null,     // object with last column resizing details
            copy_event    : null,     // last copy event
            userSelect    : '',       // last user select type, e.g. 'text'
            columnDrag    : false,    // false or an object with a remove() method
            state         : null,     // last grid state
            toolbar_height: 0,        // height of grid's toolbar
            groupBy_links : {},       // map of group links used in conjuntction with groupBy
        }
        this.header            = ''
        this.url               = ''
        this.limit             = 100
        this.offset            = 0 // how many records to skip (for infinite scroll) when pulling from server
        this.postData          = {}
        this.routeData         = {}
        this.httpHeaders       = {}
        this.show              = {
            header          : false,
            toolbar         : false,
            footer          : false,
            columnMenu      : true,
            columnHeaders   : true,
            lineNumbers     : false,
            expandColumn    : false,
            selectColumn    : false,
            emptyRecords    : true,
            toolbarReload   : true,
            toolbarColumns  : false,
            toolbarSearch   : true,
            toolbarAdd      : false,
            toolbarEdit     : false,
            toolbarDelete   : false,
            toolbarSave     : false,
            searchAll       : true,
            searchLogic     : true,
            searchHiddenMsg : false,
            searchSave      : true,
            statusRange     : true,
            statusBuffered  : false,
            statusRecordID  : true,
            statusSelection : true,
            statusResponse  : true,
            statusSort      : false,
            statusSearch    : false,
            recordTitles    : false,
            selectionBorder : true,
            selectionResizer: true,
            skipRecords     : true,
            saveRestoreState: true
        }
        this.stateId           = null // Custom state name for stateSave, stateRestore and stateReset
        this.hasFocus          = false
        this.autoLoad          = true // for infinite scroll
        this.fixedBody         = true // if false; then grid grows with data
        this.recordHeight      = (TsUtils.settings?.['recordHeight'] as number) ?? 32
        this.lineNumberWidth   = 34
        this.keyboard          = true
        this.selectType        = 'row' // can be row|cell
        this.liveSearch        = false // if true, it will auto search if typed in search_all
        this.multiSearch       = true
        this.multiSelect       = true
        this.multiSort         = true
        this.reorderColumns    = false
        this.reorderRows       = false
        this.showExtraOnSearch = 0 // show extra records before and after on search
        this.markSearch        = true
        this.columnTooltip     = 'top|bottom' // can be top, bottom, left, right
        this.disableCVS        = false // disable Column Virtual Scroll
        this.nestedFields      = true // use field name containing dots as separator to look into object
        this.vs_start          = 150
        this.vs_extra          = 5
        this.style             = ''
        this.tabIndex          = null
        this.dataType          = null // if defined, then overwrites TsUtils.settings.dataType
        this.parser            = null
        this.advanceOnEdit     = true // automatically begin editing the next cell after submitting an inline edit?
        this.useLocalStorage   = true

        // default values for the column
        this.colTemplate = {
            text           : '',    // column text (can be a function)
            field          : '',    // field name to map the column to a record
            size           : null,  // size of column in px or %
            min            : 20,    // minimum width of column in px
            max            : null,  // maximum width of column in px
            gridMinWidth   : null,  // minimum width of the grid when column is visible
            sizeCorrected  : null,  // read only, corrected size (see explanation below)
            sizeCalculated : null,  // read only, size in px (see explanation below)
            sizeOriginal   : null,  // size as defined
            sizeType       : null,  // px or %
            hidden         : false, // indicates if column is hidden
            sortable       : false, // indicates if column is sortable
            sortMode       : null,  // sort mode ('default'|'natural'|'i18n') or custom compare function
            searchable     : false, // bool/string: int,float,date,... or an object to create search field
            resizable      : true,  // indicates if column is resizable
            hideable       : true,  // indicates if column can be hidden
            autoResize     : null,  // indicates if column can be auto-resized by double clicking on the resizer
            attr           : '',    // string that will be inside the <td ... attr> tag
            style          : '',    // additional style for the td tag
            render         : null,  // string or render function
            title          : null,  // string or function for the title property for the column cells
            tooltip        : null,  // string for the title property for the column header
            editable       : {},    // editable object (see explanation below)
            frozen         : false, // indicates if the column is fixed to the left
            info           : null,  // info bubble, can be bool/object
            clipboardCopy  : false, // if true (or string or function), it will display clipboard copy icon
        }

        // these column properties will be saved in stateSave()
        this.stateColProps = {
            text            : false,
            field           : true,
            size            : true,
            min             : false,
            max             : false,
            gridMinWidth    : false,
            sizeCorrected   : false,
            sizeCalculated  : true,
            sizeOriginal    : true,
            sizeType        : true,
            hidden          : true,
            sortable        : false,
            sortMode        : true,
            searchable      : false,
            resizable       : false,
            hideable        : false,
            autoResize      : false,
            attr            : false,
            style           : false,
            render          : false,
            title           : false,
            tooltip         : false,
            editable        : false,
            frozen          : true,
            info            : false,
            clipboardCopy   : false
        }

        this.msgDelete     = 'Are you sure you want to delete ${count} ${records}?'
        this.msgNotJSON    = 'Returned data is not in valid JSON format.'
        this.msgHTTPError  = 'HTTP error. See console for more details.'
        this.msgServerError= 'Server error'
        this.msgRefresh    = 'Refreshing...'
        this.msgNeedReload = 'Your remote data source record count has changed, reloading from the first record.'
        this.msgEmpty      = '' // if not blank, then it is message when server returns no records

        this.buttons = {
            'reload'   : { type: 'button', id: 'tsg-reload', icon: reloadIcon(), tooltip: TsUtils.lang('Reload data in the list') },
            'columns'  : { type: 'menu-check', id: 'tsg-column-on-off', icon: columnsIcon(), tooltip: TsUtils.lang('Show/hide columns'),
                overlay: { align: 'none' }
            },
            'search'   : { type: 'html', id: 'tsg-search',
                html: `<div class="tsg-icon tsg-search-down tsg-action" data-click="searchShowFields">${searchIcon()}</div>`
            },
            'add'      : { type: 'button', id: 'tsg-add', text: 'Add New', tooltip: TsUtils.lang('Add new record'), icon: plusIcon() },
            'edit'     : { type: 'button', id: 'tsg-edit', text: 'Edit', tooltip: TsUtils.lang('Edit selected record'), icon: pencilIcon(), batch: 1, disabled: true },
            'delete'   : { type: 'button', id: 'tsg-delete', text: 'Delete', tooltip: TsUtils.lang('Delete selected records'), icon: crossIcon(), batch: true, disabled: true },
            'save'     : { type: 'button', id: 'tsg-save', text: 'Save', tooltip: TsUtils.lang('Save changed records'), icon: checkIcon() }
        }

        this.operators = { // for search fields
            'text': ['is', 'begins', 'contains', 'ends', 'is not'], // could have "in" and "not in"
            'number': ['=', 'between', '>', '<', '>=', '<=', '!='],
            'date'    : ['is', { oper: 'less', text: 'before'}, { oper: 'more', text: 'since' }, 'between'],
            'list'    : ['is'],
            'hex'     : ['is', 'between'],
            'color'   : ['is', 'begins', 'contains', 'ends'],
            'enum'    : ['in', 'not in']
            // -- all possible
            // "text"    : ['is', 'begins', 'contains', 'ends'],
            // "number"  : ['is', 'between', 'less', 'more', 'null', 'not null'],
            // "list"    : ['is', 'null', 'not null'],
            // "enum"    : ['in', 'not in', 'null', 'not null']
        }
        this.defaultOperator = {
            'text'    : 'begins',
            'number'  : '=',
            'date'    : 'is',
            'list'    : 'is',
            'enum'    : 'in',
            'hex'     : 'begins',
            'color'   : 'begins'
        }

        // map search field type to operator
        this.operatorsMap = {
            'text'         : 'text',
            'int'          : 'number',
            'float'        : 'number',
            'money'        : 'number',
            'currency'     : 'number',
            'percent'      : 'number',
            'hex'          : 'hex',
            'alphanumeric' : 'text',
            'color'        : 'color',
            'date'         : 'date',
            'time'         : 'date',
            'datetime'     : 'date',
            'list'         : 'list',
            'combo'        : 'text',
            'enum'         : 'enum',
            'file'         : 'enum',
            'select'       : 'list',
            'radio'        : 'list',
            'checkbox'     : 'list',
            'toggle'       : 'list'
        }

        // events
        this.onAdd               = null
        this.onEdit              = null
        this.onRequest           = null // called on any server event
        this.onLoad              = null
        this.onDelete            = null
        this.onSave              = null
        this.onSelect            = null
        this.onClick             = null
        this.onDblClick          = null
        this.onContextMenu       = null
        this.onContextMenuClick  = null // when context menu item selected
        this.onColumnClick       = null
        this.onColumnDblClick    = null
        this.onColumnContextMenu = null
        this.onColumnResize      = null
        this.onColumnAutoResize  = null
        this.onSort              = null
        this.onSearch            = null
        this.onSearchOpen        = null
        this.onSearchClose       = null
        this.onChange            = null // called when editable record is changed
        this.onRestore           = null // called when editable record is restored
        this.onExpand            = null
        this.onCollapse          = null
        this.onError             = null
        this.onKeydown           = null
        this.onToolbar           = null // all events from toolbar
        this.onColumnOnOff       = null
        this.onCopy              = null
        this.onPaste             = null
        this.onSelectionExtend   = null
        this.onEditField         = null
        this.onRender            = null
        this.onRefresh           = null
        this.onReload            = null
        this.onResize            = null
        this.onDestroy           = null
        this.onStateSave         = null
        this.onStateRestore      = null
        this.onFocus             = null
        this.onBlur              = null
        this.onReorderRow        = null
        this.onSearchSave        = null
        this.onSearchRemove      = null
        this.onSearchSelect      = null
        this.onColumnSelect      = null
        this.onColumnDragStart   = null
        this.onColumnDragEnd     = null
        this.onResizerDblClick   = null
        this.onMouseEnter        = null // mouse enter over record event
        this.onMouseLeave        = null

        // need deep merge, should be extend, not objectAssign
        TsUtils.extend(this, options)

        // check if there are records without recid
        if (Array.isArray(this.records)) {
            // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const remove: any[] = [] // remove from records as they are summary
            this.records.forEach((rec, ind) => {
                if (this.recid != null && rec[this.recid] != null) {
                    rec.recid = rec[this.recid!]
                }
                if (rec.recid == null) {
                    console.log('ERROR: Cannot add records without recid. (obj: '+ this.name +')')
                }
                if (rec.TsUi?.summary === true) {
                    this.summary.push(rec)
                    remove.push(ind) // cannot remove here as it will mess up array walk thru
                }
            })
            remove.sort()
            for (let t = remove.length-1; t >= 0; t--) {
                this.records.splice(remove[t], 1)
            }
            this.processGroupBy()
        }
        // add searches
        if (Array.isArray(this.columns)) {
            this.columns.forEach((col, ind) => {
                col = TsUtils.extend({}, this.colTemplate, col)
                this.columns[ind] = col
                const search = col.searchable
                if (search == null || search === false || this.getSearch(col.field) != null) return
                if (TsUtils.isPlainObject(search)) {
                    this.addSearch(TsUtils.extend({ field: col.field, label: col.text, type: 'text' }, search))
                } else {
                    let stype = col.searchable
                    let attr  = ''
                    if (col.searchable === true) {
                        stype = 'text'
                        attr  = 'size="20"'
                    }
                    this.addSearch({ field: col.field, label: col.text, type: stype, attr: attr })
                }
            })
        }
        // add icon to default searches if not defined
        if (Array.isArray(this.defaultSearches)) {
            this.defaultSearches.forEach((search, ind) => {
                search.id = 'default-'+ ind
                search.icon ??= searchIcon()
            })
        }
        // check if there are saved searches in localStorage
        const data = this.cache('searches')
        if (Array.isArray(data)) {
            data.forEach(search => {
                this.savedSearches.push({
                    id: search.id ?? 'none',
                    text: search.text ?? 'none',
                    icon: searchIcon(),
                    remove: true,
                    logic: search.logic ?? 'AND',
                    data: search.data ?? []
                })
            })
        }
        // init toolbar
        this.initToolbar()
        // render if box specified
        if (typeof this.box == 'string') this.box = query(this.box).get(0)
        if (this.box) this.render(this.box)
    }

    add(record: TsGridRecord | TsGridRecord[], first?: boolean): number {
        return gridData.add(this, record, first)
    }

    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    find(obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[] {
        return gridData.find(this, obj, returnIndex, displayedOnly)
    }

    // does not delete existing, but overrides on top of it
    // Overload: set(recid, record, noRefresh?) or set(record, noRefresh?) — shifts args when recid is object
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(recid: any, record?: any, noRefresh?: boolean): boolean {
        return gridData.set(this, recid, record, noRefresh)
    }

    // replaces existing record
    replace(recid: string | number, record: TsGridRecord, noRefresh?: boolean): boolean {
        return gridData.replace(this, recid, record, noRefresh)
    }

    get(recid: (string | number)[], returnIndex?: boolean): (TsGridRecord | number)[]
    get(recid: string | number, returnIndex: true): number | null
    get(recid: string | number, returnIndex?: false): TsGridRecord | null
    get(recid: string | number | (string | number)[], returnIndex?: boolean): TsGridRecord | (TsGridRecord | number)[] | number | null {
        // any: forwarding overloaded args to delegator — overload resolution happens at the public surface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridData.get as any)(this, recid, returnIndex)
    }

    getFirst(offset?: number): TsGridRecord | null {
        if (this.records.length == 0) return null
        let rec: TsGridRecord | null = this.records[0] ?? null
        const tmp = this.last.searchIds
        if (this.searchData.length > 0) {
            if (Array.isArray(tmp) && tmp.length > 0) {
                rec = this.records[tmp[offset || 0]!] ?? null
            } else {
                rec = null
            }
        }
        return rec
    }

    remove(...recids: (string | number)[]): number {
        return gridData.remove(this, ...recids)
    }

    /**
     * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
     * needs to be cleared when record is cleared
     */
    processGroupBy(): void {
        return gridData.processGroupBy(this)
    }

    /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
    // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addColumn(before: any, columns?: any): number {
        return gridColumns.addColumn(this, before, columns)
    }

    removeColumn(...fields: string[]) {
        return gridColumns.removeColumn(this, ...fields)
    }

    getColumn(): string[]
    getColumn(field: string, returnIndex: true): number | null
    getColumn(field: string, returnIndex?: false): TsGridColumn | null
    getColumn(field?: string, returnIndex?: boolean): string[] | number | TsGridColumn | null {
        // any: forwarding overloaded args to delegator — overload resolution happens at the public surface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridColumns.getColumn as any)(this, field, returnIndex)
    }

    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateColumn(fields: string | string[], updates: Partial<TsGridColumn> | Record<string, any>) {
        return gridColumns.updateColumn(this, fields, updates)
    }

    toggleColumn(...fields: string[]) {
        return gridColumns.toggleColumn(this, ...fields)
    }

    showColumn(...fields: string[]) {
        return gridColumns.showColumn(this, ...fields)
    }

    hideColumn(...fields: string[]) {
        return gridColumns.hideColumn(this, ...fields)
    }

    /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
    // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addSearch(before: any, search?: any): number {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.addSearch as any)(this, before, search) // any: variadic overload pass-through
    }

    removeSearch(...fields: string[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.removeSearch as any)(this, ...fields) // any: variadic pass-through
    }

    getSearch(): string[]
    getSearch(field: string, returnIndex: true): number | null
    getSearch(field: string, returnIndex?: false): TsGridSearch | null
    getSearch(field?: string, returnIndex?: boolean): string[] | number | TsGridSearch | null {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.getSearch as any)(this, field, returnIndex) // any: overload narrowing bypass
    }

    toggleSearch(...fields: string[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.toggleSearch as any)(this, ...fields) // any: variadic pass-through
    }

    showSearch(...fields: string[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.showSearch as any)(this, ...fields) // any: variadic pass-through
    }

    hideSearch(...fields: string[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.hideSearch as any)(this, ...fields) // any: variadic pass-through
    }

    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSearchData(field: string): Record<string, any> | null {
        return gridSearch.getSearchData(this, field)
    }

    localSort(silent?: boolean, noResetRefresh?: boolean) {
        return gridData.localSort(this, silent, noResetRefresh)
    }

    localSearch(silent?: boolean) {
        return gridData.localSearch(this, silent)
    }

    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRangeData(range: [{ recid: string | number; column: number }, { recid: string | number; column: number }], extra?: boolean): any[] {
        return gridData.getRangeData(this, range, extra)
    }

    // any: addRange accepts string 'selection' shorthand, single range object, or array of ranges
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRange(rangesInput: TsGridRange | TsGridRange[] | string | Record<string, any>): number {
        return gridData.addRange(this, rangesInput)
    }

    removeRange(...names: string[]) {
        return gridData.removeRange(this, ...names)
    }

    refreshRanges() {
        return gridData.refreshRanges(this)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(...selectArgs: any[]) { // any: recid (string|number) or {recid, column} cell descriptor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSelection.select as any)(this, ...selectArgs) // any: variadic overload pass-through
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unselect(...unselectArgs: any[]): number { // any: recid (string|number) or {recid, column} cell descriptor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSelection.unselect as any)(this, ...unselectArgs) // any: variadic overload pass-through
    }

    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compareSelection(newSel: any[]): { select: any[]; unselect: any[] } {
        return gridSelection.compareSelection(this, newSel)
    }

    selectAll() {
        return gridSelection.selectAll(this)
    }

    selectNone(skipEvent?: boolean) {
        return gridSelection.selectNone(this, skipEvent)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateToolbar(sel?: any, _areAllSelected?: boolean) { // any: sel is selection object from last.selection
        return gridSelection.updateToolbar(this, sel, _areAllSelected)
    }

    /**
     * Row-mode selection. Returns the recids of selected records, or their indexes
     * when `returnIndex === true`. Unaffected by `selectType === 'cell'` — callers
     * should branch on `this.selectType` and use `getSelectionCells()` for cell mode.
     */
    getSelectionRows(returnIndex?: boolean): RecId[] | number[] {
        return gridSelection.getSelectionRows(this, returnIndex)
    }

    /**
     * Cell-mode selection. Returns one descriptor per selected cell. `returnIndex`
     * is intentionally not a parameter — it was ignored in cell mode by the legacy
     * `getSelection()` API.
     */
    getSelectionCells(): TsGridCellSelection[] {
        return gridSelection.getSelectionCells(this)
    }

    /**
     * Discriminated-union wrapper. The shape depends on `this.selectType`:
     *   - `'row'`  → `RecId[]` (or `number[]` if `returnIndex === true`)
     *   - `'cell'` → `TsGridCellSelection[]` (`returnIndex` is ignored)
     *
     * Prefer the typed split methods (`getSelectionRows` / `getSelectionCells`)
     * when the caller knows the mode statically. This wrapper is kept for back-
     * compat with the v2.0 API and for callers that genuinely handle both modes.
     */
    getSelection(returnIndex?: boolean): RecId[] | number[] | TsGridCellSelection[] {
        return gridSelection.getSelection(this, returnIndex)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search(field?: any, value?: any) { // any: field can be string or searchData array; value varies
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.search as any)(this, field, value) // any: variadic overload pass-through
    }

    // open advanced search popover
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchOpen(options: any = {}) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.searchOpen as any)(this, options) // any: variadic overload pass-through
    }

    searchClose() {
        return gridSearch.searchClose(this)
    }

    // if clicked on a field in the search strip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchFieldTooltip(ind: any, sd_ind: any, el: any) { // any: all params are loosely typed from DOM
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.searchFieldTooltip as any)(this, ind, sd_ind, el) // any: loosely-typed DOM params pass-through
    }

    // drop down with save searches
    searchSuggest(imediate?: boolean, forceHide?: boolean, anchor?: HTMLElement | Element) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.searchSuggest as any)(this, imediate, forceHide, anchor) // any: variadic pass-through
    }

    searchSave() {
        return gridSearch.searchSave(this)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cache(type: any) { // any: cache key is always string, loosely typed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.cache as any)(this, type) // any: cache key loosely typed
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cacheSave(type: any, value: any) { // any: cache key and value are dynamic
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.cacheSave as any)(this, type, value) // any: cache key and value are dynamic
    }

    searchReset(noReload?: boolean) {
        return gridSearch.searchReset(this, noReload)
    }

    searchShowFields(forceHide?: boolean) {
        return gridSearch.searchShowFields(this, forceHide)
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchInitInput(field: string, _value?: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.searchInitInput as any)(this, field, _value) // any: optional _value loosely typed
    }

    // clears records and related params
    clear(noRefresh?: boolean): void {
        return gridData.clear(this, noRefresh)
    }

    // clears scroll position, selection, ranges
    reset(noRefresh?: boolean): void {
        return gridData.reset(this, noRefresh)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skip(offset: any, callBack?: any) { // any: offset is number-like, callBack is optional function
        const url = this.url?.get ?? this.url
        if (url) {
            this.offset = parseInt(offset)
            if (this.offset > this.total) this.offset = this.total - this.limit
            if (this.offset < 0 || !TsUtils.isInt(this.offset)) this.offset = 0
            this.clear(true)
            this.reload(callBack)
        } else {
            console.log('ERROR: grid.skip() can only be called when you have remote data source.')
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(url: any, callBack?: any) { // any: url can be string or object with .get/.save
        return gridData.load(this, url, callBack)
    }

    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reload(callBack?: (...args: any[]) => void) {
        return gridData.reload(this, callBack)
    }

    // any: url can be string, { get, save, remove } object, URL instance, or null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request(action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any> {
        return gridData.request(this, action, postData, url, callBack)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestComplete(data: any, action: any, callBack: any, resolve: any, reject: any) { // any: all params vary by context
        let error = data.error ?? false
        if (data.error == null && data.status === 'error') error = true
        this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1000
        setTimeout(() => {
            if (this.show.statusResponse) {
                this.status(TsUtils.lang('Server Response ${count} seconds', { count: this.last.fetch.response }))
            }
        }, 10)
        this.last.vscroll.pull_more = false
        this.last.vscroll.pull_refresh = true

        // event before
        let event_name = 'load'
        if (this.last.fetch.action == 'save') event_name = 'save'
        if (this.last.fetch.action == 'delete') event_name = 'delete'
        const edata = this.trigger(event_name, { target: this.name, error, data, lastFetch: this.last.fetch })
        if (edata.isCancelled === true) {
            reject()
            return
        }
        // parse server response
        if (!error) {
            // default action
            if (typeof this.parser == 'function') {
                data = this.parser(data)
                if (typeof data != 'object') {
                    console.log('ERROR: Your parser did not return proper object')
                }
            } else {
                if (data == null) {
                    data = {
                        error: true,
                        message: TsUtils.lang(this.msgNotJSON),
                    }
                } else if (Array.isArray(data)) {
                    // if it is plain array, assume these are records
                    data = {
                        error,
                        records: data,
                        total: data.length
                    }
                }
            }
            if (action == 'load') {
                if (data.total == null) data.total = -1
                if (data.records == null) {
                    data.records = []
                    this.last.groupBy_links = {}
                }
                if (data.records.length == this.limit) {
                    const loaded = this.records.length + data.records.length
                    this.last.fetch.hasMore = (loaded == this.total ? false : true)
                } else {
                    this.last.fetch.hasMore = false
                    this.total = this.offset + (this.last.fetch.offset ?? 0) + data.records.length
                }
                if (!this.last.fetch.hasMore) {
                    // if no more records, then hide spinner
                    query(this.box).find('#grid_'+ this.name +'_rec_more, #grid_'+ this.name +'_frec_more').hide()
                }
                if (this.last.fetch.offset === 0) {
                    this.records = []
                    this.summary = []
                    this.last.groupBy_links = {}
                } else {
                    if (data.total != -1 && parseInt(String(data.total)) != this.total) {
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        const grid = this
                        // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ;(this.message(TsUtils.lang(this.msgNeedReload)) as any)
                            .ok(() => {
                                delete grid.last.fetch.offset
                                grid.reload()
                            })
                        return new Promise<void>(resolve => { resolve() })
                    }
                }
                if (TsUtils.isInt(data.total)) this.total = parseInt(data.total)
                // records
                if (data.records) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.records.forEach((rec: any) => { // any: record shape from server varies
                        if (this.recid) {
                            rec.recid = this.parseField(rec, this.recid)
                        }
                        if (rec.recid == null) {
                            rec.recid = 'recid-' + this.records.length
                        }
                        if (rec.TsUi?.summary === true) {
                            this.summary.push(rec)
                        } else {
                            this.records.push(rec)
                        }
                    })
                }
                if (data.groupBy != null) {
                    this.groupBy = data.groupBy
                }
                this.processGroupBy()
                // summary records (if any)
                if (data.summary) {
                    this.summary = [] // reset summary with each call
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.summary.forEach((rec: any) => { // any: summary record shape varies
                        if (this.recid) {
                            rec.recid = this.parseField(rec, this.recid)
                        }
                        if (rec.recid == null) {
                            rec.recid = 'recid-' + this.summary.length
                        }
                        this.summary.push(rec)
                    })
                }
            } else if (action == 'delete') {
                this.reset() // unselect old selections
                return this.reload()
            }
        } else {
            this.error(TsUtils.lang(data.message || this.msgServerError)) // || not ?? — empty string should also fall back
            reject(data)
        }
        // event after
        const url = this.url?.get ?? this.url
        if (!url) {
            this.localSort()
            this.localSearch()
        }
        this.total = parseInt(String(this.total))
        // do not refresh if loading on infinite scroll
        if (this.last.fetch.offset === 0) {
            this.refresh()
        } else {
            this.scroll()
            this.resize()
        }
        // call back
        if (typeof callBack == 'function') callBack(data) // need to be before event:after
        resolve(data)
        // after event
        edata.finish()
        this.last.fetch.loaded = true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(msg: any) { // any: error message can be string or object
        // let the management of the error outside of the grid
        const edata = this.trigger('error', { target: this.name, message: msg })
        if (edata.isCancelled === true) {
            return
        }
        this.message(msg)
        // event after
        edata.finish()
    }

    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getChanges(recordsBase?: TsGridRecord[]): Record<string, any>[] {
        const changes = []
        if (typeof recordsBase == 'undefined') {
            recordsBase = this.records
        }

        for (let r = 0; r < recordsBase.length; r++) {
            const rec = recordsBase[r]!
            if (rec?.TsUi) {
                if (rec.TsUi['changes'] != null) {
                    // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const obj: Record<string, any> = {}
                    obj[this.recid || 'recid'] = rec.recid
                    changes.push(TsUtils.extend(obj, rec.TsUi['changes']))
                }

                // recursively look for changes in non-expanded children
                if (rec.TsUi.expanded !== true && rec.TsUi.children && rec.TsUi.children.length) {
                    changes.push(...this.getChanges(rec.TsUi.children))
                }
            }
        }
        return changes
    }

    mergeChanges() {
        const changes = this.getChanges()
        for (let c = 0; c < changes.length; c++) {
            const change_c = changes[c]!
            const record = this.get(change_c[this.recid || 'recid'])
            if (record == null) continue
            for (const s in change_c) {
                if (s == 'recid' || (this.recid && s == this.recid)) continue // do not allow to change recid
                if (typeof change_c[s] === 'object') change_c[s] = change_c[s].text
                try {
                    _setValue(record, s, change_c[s])
                } catch (e) {
                    // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    console.log('ERROR: Cannot merge. ', (e as any)?.message || '', e)
                }
                if (record.TsUi) delete record.TsUi['changes']
            }
        }
        this.refresh()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _setValue(obj: any, field: any, value: any) { // any: record fields and values are dynamic
            const fld = field.split('.')
            if (fld.length == 1) {
                obj[field] = value
            } else {
                obj = obj[fld[0]]
                fld.shift()
                _setValue(obj, fld.join('.'), value)
            }
        }
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save(callBack?: (data: any) => void) {
        return gridData.save(this, callBack)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editField(recid: string | number, column: number, value: any, event?: any) { // any: can be KeyboardEvent, MouseEvent, or synthetic event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridEdit.editField as any)(this, recid, column, value, event) // any: variadic pass-through for optional event arg
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editChange(input?: any, index?: any, column?: any, event?: any) { // any: all params are optional grid-edit internals
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridEdit.editChange as any)(this, input, index, column, event) // any: variadic pass-through for all-optional params
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editDone(index?: any, column?: any, event?: any) { // any: all params are optional grid-edit internals
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridEdit.editDone as any)(this, index, column, event) // any: variadic pass-through for all-optional params
    }

    'delete'(force?: boolean) {
        // event before
        const edata = this.trigger('delete', { target: this.name, force: force })
        if (force) this.message() // close message
        if (edata.isCancelled === true) return
        force = edata.detail['force'] as boolean
        // default action
        const recs = this.getSelection()
        if (recs.length === 0) return
        if (this.msgDelete != '' && !force) {
            ;(this.confirm({
                text: TsUtils.lang(this.msgDelete, {
                    count: recs.length,
                    records: TsUtils.lang( recs.length == 1 ? 'record' : 'records')
                }),
                width: 380,
                height: 170,
                yes_text: TsUtils.lang('Delete'),
                yes_class: 'tsg-btn-red',
                no_text: TsUtils.lang('Cancel'),
            // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any)
                // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .yes((event: any) => {
                    event.detail.self.close()
                    this.delete(true)
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .no((event: any) => { // any: TsConfirm event shape
                    event.detail.self.close()
                })
            return
        }
        // call delete script
        const url = this.url?.remove ?? this.url
        if (url) {
            this.request('delete')
        } else {
            if (typeof recs[0] != 'object') {
                this.selectNone()
                this.remove(...(recs as Array<RecId | number>))
            } else {
                // clear cells
                const cellRecs = recs as TsGridCellSelection[]
                for (let r = 0; r < cellRecs.length; r++) {
                    const rr = cellRecs[r]!
                    const fld = this.columns[rr.column]!.field
                    const ind = this.get(rr.recid, true)
                    const rec = ind != null ? this.records[ind]! : null
                    if (ind != null && fld != 'recid' && rec != null) {
                        this.records[ind]![fld] = ''
                        if (rec.TsUi?.['changes']) delete rec.TsUi['changes'][fld]
                        // -- style should not be deleted
                        // if (rec.style != null && TsUtils.isPlainObject(rec.style) && rec.style[recs[r].column]) {
                        //     delete rec.style[recs[r].column];
                        // }
                    }
                }
                this.update()
            }
        }
        // event after
        edata.finish()
    }

    // any: recid can be string|number (row select) or {recid, column} object (cell select)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(recid: string | number | { recid: string | number; column?: number } | any, event?: MouseEvent | any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridInteraction.click as any)(this, recid, event) // any: variadic overload pass-through
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnClick(field: string, event?: MouseEvent | any) {
        return gridInteraction.columnClick(this, field, event)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnDblClick(field: any, event: any) { // any: field is string; event is MouseEvent or CustomEvent
        return gridInteraction.columnDblClick(this, field, event)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnContextMenu(field: any, event: any) { // any: field is string; event is MouseEvent
        return gridInteraction.columnContextMenu(this, field, event)
    }

    // if called w/o arguments, then will resize all columns
    columnAutoSize(colIndex?: number) {
        return gridInteraction.columnAutoSize(this, colIndex)
    }

    columnAutoSizeAll() {
        return gridInteraction.columnAutoSizeAll(this)
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus(event?: Event | any) {
        return gridInteraction.focus(this, event)
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blur(event?: Event | any) {
        return gridInteraction.blur(this, event)
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keydown(event: KeyboardEvent | any) {
        return gridInteraction.keydown(this, event)
    }

    scrollIntoView(ind?: number | null, column?: number, instant?: boolean, recTop?: boolean) {
        return gridInteraction.scrollIntoView(this, ind, column, instant, recTop)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollToColumn(field: any) { // any: field name is string
        return gridInteraction.scrollToColumn(this, field)
    }


    // any: recid can be string|number (row select) or {recid, column} object (cell select)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dblClick(recid: string | number | { recid: string | number; column?: number } | any, event?: MouseEvent | any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridInteraction.dblClick as any)(this, recid, event) // any: variadic overload pass-through
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showContextMenu(event: MouseEvent | any, options: { recid?: string | number; index?: number; column?: number }) {
        return gridInteraction.showContextMenu(this, event, options)
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenuClick(recid: string | number, column: number | null, event: any) {
        return gridInteraction.contextMenuClick(this, recid, column, event)
    }

    toggle(recid: string | number, _event?: Event) {
        return gridInteraction.toggle(this, recid, _event)
    }

    /**
     * When record is expaned, then TsUi.children of the record is copied into this.records and this.total is updated. It will
     * also set TsUi._copeid = true, so it would not copy it again.
     *
     * There is also updateExpaned() that is called in this.refresh()
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand(recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
        return gridInteraction.expand(this, recid, noRefresh)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collapse(recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
        return gridInteraction.collapse(this, recid, noRefresh)
    }

    updateExpanded() {
        return gridInteraction.updateExpanded(this)
    }

    sort(field?: string, direction?: 'asc' | 'desc' | '' | null, multiField?: boolean) { // if no params - clears sort
        return gridInteraction.sort(this, field, direction, multiField)
    }

    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copy(flag: any, oEvent?: ClipboardEvent | any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridInteraction.copy as any)(this, flag, oEvent) // any: variadic overload pass-through
    }

    /**
     * Gets value to be copied to the clipboard
     * @param ind index of the record
     * @param col_ind index of the column
     * @returns the displayed value of the field's record associated with the cell
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellCopy(ind: any, col_ind: any) { // any: record index and column index
        return gridInteraction.getCellCopy(this, ind, col_ind)
    }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paste(text: string, event?: ClipboardEvent | any) {
        return gridInteraction.paste(this, text, event)
    }

    // ==================================================
    // --- Common functions

    resize() { return gridRender.resize(this) }

    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update({ cells, fullCellRefresh, ignoreColumns }: any = {}) { return gridRender.update(this, { cells, fullCellRefresh, ignoreColumns }) }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refreshCell(recid: any, field: any) { return gridRender.refreshCell(this, recid, field) } // any: recid is string|number; field is string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refreshRow(recid: any, ind: any = null) { return gridRender.refreshRow(this, recid, ind) } // any: recid is string|number; ind is number

    refresh() { return gridRender.refresh(this) }

    refreshSearch() { return gridRender.refreshSearch(this) }

    refreshBody() { return gridRender.refreshBody(this) }

    override render(box?: HTMLElement | string | null) {
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj  = this
        if (typeof box == 'string') box = query(box).get(0)
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // default action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box as HTMLElement // any: string was converted to Element via query().get(0) above
        }
        if (!this.box) return
        const url = this.url?.get ?? this.url
        // reset needed if grid existed
        this.reset(true)
        // insert elements
        query(this.box)
            .attr('name', this.name)
            .addClass('tsg-reset tsg-grid tsg-inactive')
            .html('<div class="tsg-grid-box">'+
                  '    <div id="grid_'+ this.name +'_header" class="tsg-grid-header"></div>'+
                  '    <div id="grid_'+ this.name +'_toolbar" class="tsg-grid-toolbar"></div>'+
                  '    <div id="grid_'+ this.name +'_body" class="tsg-grid-body"></div>'+
                  '    <div id="grid_'+ this.name +'_fsummary" class="tsg-grid-body tsg-grid-summary"></div>'+
                  '    <div id="grid_'+ this.name +'_summary" class="tsg-grid-body tsg-grid-summary"></div>'+
                  '    <div id="grid_'+ this.name +'_footer" class="tsg-grid-footer"></div>'+
                  '    <textarea id="grid_'+ this.name +'_focus" class="tsg-grid-focus-input" '+
                            (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : '')+
                            (TsUtils.isMobile ? 'readonly' : '') +'></textarea>'+ // readonly needed on android not to open keyboard
                  '</div>')
        if (this.selectType != 'row') query(this.box).addClass('tsg-ss')
        if (query(this.box).length > 0) query(this.box)[0].style.cssText += this.style
        // render toolbar
        const tb_box = query(this.box).find(`#grid_${this.name}_toolbar`)
        if (this.toolbar != null) this.toolbar.render(tb_box[0])
        this.last.toolbar_height = tb_box.prop('offsetHeight')
        // re-init search_all
        if (this.last.field && this.last.field != 'all') {
            const sd = this.searchData
            setTimeout(() => { this.searchInitInput(this.last.field, (sd.length == 1 ? sd[0]!.value : null)) }, 1)
        }
        // init footer
        query(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML())
        // refresh
        if (!this.last.state) this.last.state = this.stateSave(true) // initial default state
        this.stateRestore()
        if (url) { this.clear(); this.refresh() } // show empty grid (need it) - should it be only for remote data source
        // if hidden searches - apply it
        let hasHiddenSearches = false
        for (let i = 0; i < this.searches.length; i++) {
            if (this.searches[i]!.hidden) { hasHiddenSearches = true; break }
        }
        if (hasHiddenSearches) {
            this.searchReset(false) // will call reload
            if (!url) setTimeout(() => { this.searchReset() }, 1)
        } else {
            this.reload()
        }
        // focus
        query(this.box).find(`#grid_${this.name}_focus`)
            .on('focus', (_event: Event) => {
                clearTimeout(this.last.kbd_timer ?? undefined)
                if (!this.hasFocus) this.focus()
            })
            .on('blur', (_event: Event) => {
                clearTimeout(this.last.kbd_timer ?? undefined)
                this.last.kbd_timer = setTimeout(() => {
                    if (this.hasFocus) { this.blur() }
                }, 100) // need this timer to be 100 ms
            })
            // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('paste', (event: any) => {
                const cd = (event.clipboardData ? event.clipboardData : null)
                if (cd) {
                    let items = cd.items
                    if (items.length == 2) {
                        if (items.length == 2 && items[1].kind == 'file') {
                            items = [items[1]]
                        }
                        if (items.length == 2 && items[0].type == 'text/plain' && items[1].type == 'text/html') {
                            items = [items[1]]
                        }
                    }
                    let items2send = []
                    // might contain data in different formats, but it is a single paste
                    for (const index in items) {
                        const item = items[index]
                        if (item.kind === 'file') {
                            const file = item.getAsFile()
                            items2send.push({ kind: 'file', data: file })
                        } else if (item.kind === 'string' && (item.type === 'text/plain' || item.type === 'text/html')) {
                            event.preventDefault()
                            let text = cd.getData('text/plain')
                            if (text.indexOf('\r') != -1 && text.indexOf('\n') == -1) {
                                text = text.replace(/\r/g, '\n')
                            }
                            items2send.push({ kind: (item.type == 'text/html' ? 'html' : 'text'), data: text })
                        }
                    }
                    if (items2send.length === 1 && items2send[0]!.kind != 'file') {
                        items2send = items2send[0]!.data
                    }
                    // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(TsUi[this.name] as any).paste(items2send, event)
                    event.preventDefault()
                }
            })
            .on('keydown', function (event: Event) {
                // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(TsUi[obj.name] as any).keydown.call(TsUi[obj.name], event)
            })
        // init mouse events for mouse selection
        // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edataCol: any // event for column select
        query(this.box).off('mousedown.mouseStart').on('mousedown.mouseStart', mouseStart)
        this.updateToolbar()
        // event after
        edata.finish()
        // observe div resize
        this.last['observeResize'] = new ResizeObserver(() => {
            this.resize()
            this.scroll()
        })
        this.last['observeResize'].observe(this.box)
        return Date.now() - time

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseStart(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            if (event.which != 1) return // if not left mouse button
            // restore css user-select
            if (obj.last.userSelect == 'text') {
                obj.last.userSelect = ''
                query(obj.box).find('.tsg-grid-body').css('user-select', 'none')
            }
            // regular record select
            if (obj.selectType == 'row' && (query(event.target).parents().hasClass('tsg-head') || query(event.target).hasClass('tsg-head'))) return
            if (obj.last.move && obj.last.move.type == 'expand') return
            // if altKey - alow text selection
            if (event.altKey) {
                query(obj.box).find('.tsg-grid-body').css('user-select', 'text')
                obj.selectNone()
                obj.last.move = { type: 'text-select' }
                obj.last.userSelect = 'text'
            } else {
                let tmp  = event.target
                const pos  = {
                    x: event.offsetX - 10,
                    y: event.offsetY - 10
                }
                let tmps = false
                while (tmp) {
                    if (tmp.classList && tmp.classList.contains('tsg-grid')) break
                    if (tmp.tagName && tmp.tagName.toUpperCase() == 'TD') tmps = true
                    if (tmp.tagName && tmp.tagName.toUpperCase() != 'TR' && tmps == true) {
                        pos.x += tmp.offsetLeft
                        pos.y += tmp.offsetTop
                    }
                    tmp = tmp.parentNode
                }
                const index = query(event.target).parents('tr').attr('index')
                const recid = obj.records[index]?.recid

                // if cell selection, on initial click start selection
                if (obj.selectType == 'cell' && !event.shiftKey) {
                    let column1 = parseInt(query(event.target).closest('td').attr('col'))
                    let column2 = column1
                    if (isNaN(column1)) {
                        column1 = 0
                        column2 = obj.columns.length - 1
                    }
                    obj.addRange({
                        name: 'selection-preview',
                        range: [{ recid, column: column1 }, { recid, column: column2 }],
                        class: 'tsg-selection-preview'
                    })
                }

                obj.last.move = {
                    x      : event.screenX,
                    y      : event.screenY,
                    divX   : 0,
                    divY   : 0,
                    focusX : pos.x,
                    focusY : pos.y,
                    recid  : recid,
                    column : parseInt(event.target.tagName.toUpperCase() == 'TD' ? query(event.target).attr('col') : query(event.target).parents('td').attr('col')),
                    type   : 'select',
                    ghost  : false,
                    start  : true
                }
                if (obj.last.move.recid == null && obj.records.length > 0) {
                    obj.last.move.type = 'select-column'
                    const column = parseInt(query(event.target).closest('td').attr('col'))
                    const start = obj.records[0]!.recid
                    const end = obj.records[obj.records.length - 1]!.recid
                    obj.addRange({
                        name: 'selection-preview',
                        range: [{ recid: start, column }, { recid: end, column }],
                        class: 'tsg-selection-preview'
                    })
                }
                // set focus to grid
                const target = event.target
                const $input = query(obj.box).find('#grid_'+ obj.name + '_focus')
                // move input next to cursor so screen does not jump
                if (obj.last.move) {
                    let sLeft  = obj.last.move.focusX
                    let sTop   = obj.last.move.focusY
                    const $owner = query(target).parents('table').parent()
                    if ($owner.hasClass('tsg-grid-records') || $owner.hasClass('tsg-grid-frecords')
                            || $owner.hasClass('tsg-grid-columns') || $owner.hasClass('tsg-grid-fcolumns')
                            || $owner.hasClass('tsg-grid-summary')) {
                        sLeft = obj.last.move.focusX - query(obj.box).find('#grid_'+ obj.name +'_records').prop('scrollLeft')
                        sTop  = obj.last.move.focusY - query(obj.box).find('#grid_'+ obj.name +'_records').prop('scrollTop')
                    }
                    if (query(target).hasClass('tsg-grid-footer') || query(target).parents('div.tsg-grid-footer').length > 0) {
                        sTop = query(obj.box).find('#grid_'+ obj.name +'_footer').get(0).offsetTop
                    }
                    // if clicked on toolbar
                    if ($owner.hasClass('tsg-scroll-wrapper') && $owner.parent().hasClass('tsg-toolbar')) {
                        sLeft = obj.last.move.focusX - $owner.prop('scrollLeft')
                    }
                    $input.css({
                        left: sLeft - 10,
                        top : sTop
                    })
                }
                // if toolbar input is clicked
                setTimeout(() => {
                    if (!obj.last.inEditMode) {
                        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
                            target.focus()
                        } else {
                            if ($input.get(0) !== document.activeElement) $input.get(0)?.focus({ preventScroll: true })
                        }
                    }
                }, 50)
                // disable click select for this condition
                if (!obj.multiSelect && !obj.reorderRows && obj.last.move.type == 'drag') {
                    delete obj.last.move
                }
            }
            if (obj.reorderRows == true) {
                let el = event.target
                if (el.tagName.toUpperCase() != 'TD') el = query(el).parents('td')[0]
                if (query(el).hasClass('tsg-col-number') || query(el).hasClass('tsg-col-order')) {
                    //multiple rows reordering
                    //obj.selectNone()
                    let sel: Array<RecId | number | string> = obj.getSelection() as Array<RecId | number | string>
                    if (sel.length > 0 && typeof sel[0] == 'object') {
                        const cellSel = sel as unknown as TsGridCellSelection[]
                        obj.select([...new Set(cellSel.map(r => r.recid))])
                        sel = [...new Set(obj.getSelectionCells().map(r => r.recid))]
                    }
                    if (sel.indexOf(obj.last.move.recid) == -1) {
                        obj.selectNone()
                        obj.select([obj.last.move.recid])
                        sel = [obj.last.move.recid]
                    }
                    //select children
                    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const new_sel: any[] = []
                    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const selectExpandedChildren = (recid: any) => {
                        const rec = obj.get(recid)
                        if (rec?.TsUi?.children) {
                            rec.TsUi.children.forEach(c => {
                                const child_rec = obj.get(c.recid)
                                if (!child_rec) return
                                new_sel.push(c.recid)
                                selectExpandedChildren(c.recid)
                            })
                        }
                    }
                    sel.forEach((recid) => selectExpandedChildren(recid))
                    sel = [...sel, ...new_sel]
                    obj.last.move.reorder = true
                    // suppress hover
                    const eColor = query(obj.box).find('.tsg-even.tsg-empty-record').css('background-color')
                    const oColor = query(obj.box).find('.tsg-odd.tsg-empty-record').css('background-color')
                    query(obj.box).find('.tsg-even td').filter(':not(.tsg-col-number)').css('background-color', eColor)
                    query(obj.box).find('.tsg-odd td').filter(':not(.tsg-col-number)').css('background-color', oColor)
                    // display empty record and ghost record
                    const mv = obj.last.move
                    const recs = query(obj.box).find('.tsg-grid-records')
                    if (!mv['ghost']) {
                        //multiple rows reordering
                        //let row = query(obj.box).find(`#grid_${obj.name}_rec_${mv.recid}`)
                        const rows = sel.map(r => query(obj.box).find(`#grid_${obj.name}_rec_${r}`))
                        const tmp = rows[0].parents('table').find('tr:first-child').get(0).cloneNode(true)
                        mv.offsetY = event.offsetY
                        //multiple rows reordering
                        //mv.from = mv.recid
                        mv.from = sel
                        //mv.pos = {top: row.get(0).offsetTop - 1, left: row.get(0).offsetLeft}
                        mv.pos = {top: rows[0].get(0).offsetTop - 1, left: rows[rows.length-1].get(0).offsetLeft}
                        //mv['ghost'] = query(row.get(0).cloneNode(true))
                        mv['ghost'] = query(rows.map(row => row.get(0).cloneNode(true)))
                        mv['ghost'].removeAttr('id')
                        mv['ghost'].find('td').css({
                            'border-top': '1px solid silver',
                            'border-bottom': '1px solid silver'
                        })
                        rows.forEach(row => {
                            row.find('td').remove()
                            row.append(`<td colspan="1000"><div class="tsg-reorder-empty" style="height: ${(obj.recordHeight - 2)}px"></div></td>`)
                        })
                        recs.append('<div id="grid_'+ obj.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>')
                        recs.append('<table id="grid_'+ obj.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>')
                        query(obj.box).find('#grid_'+ obj.name + '_ghost').append(tmp).append(mv['ghost'])
                    }
                    const ghost = query(obj.box).find('#grid_'+ obj.name + '_ghost')
                    ghost.css({
                        top  : mv.pos.top + 'px',
                        left : mv.pos.left + 'px'
                    })
                } else {
                    obj.last.move.reorder = false
                }
            }
            query(document)
                .on('mousemove.tsg-' + obj.name, mouseMove)
                .on('mouseup.tsg-' + obj.name, mouseStop)
            // needed when grid grids are nested, see issue #1275
            event.stopPropagation()
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseMove(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            if (!event.target.tagName) {
                // element has no tagName - most likely the target is the #document itself
                // this can happen is you click+drag and move the mouse out of the DOM area,
                // e.g. into the browser's toolbar area
                return
            }
            const mv = obj.last.move
            if (!mv || !['select', 'select-column'].includes(mv.type)) return
            mv.divX = (event.screenX - mv.x)
            mv.divY = (event.screenY - mv.y)
            if (Math.abs(mv.divX) <= 1 && Math.abs(mv.divY) <= 1) return // only if moved more then 1px
            obj.last.cancelClick = true
            if (obj.reorderRows == true && obj.last.move.reorder) {
                const tmp   = query(event.target).parents('tr')
                const ind  = tmp.attr('index')
                let recid = obj.records[ind]?.recid
                if (recid == '-none-' || recid == null) recid = 'bottom'
                if (mv.from.indexOf(recid) == -1) {
                    // let row1 = query(obj.box).find('#grid_'+ obj.name + '_rec_'+ mv.recid)
                    const row2 = query(obj.box).find('#grid_'+ obj.name + '_rec_'+ recid)
                    query(obj.box).find('.insert-before')
                    row2.addClass('insert-before')
                    // MOVABLE GHOST
                    // if (event.screenY - mv.lastY < 0) row1.after(row2); else row2.after(row1);
                    mv.lastY = event.screenY
                    mv.to = recid
                    // line to insert before
                    const pos = { top: row2.get(0)?.offsetTop, left: row2.get(0)?.offsetLeft }
                    const ghost_line = query(obj.box).find('#grid_'+ obj.name + '_ghost_line')
                    if (pos) {
                        ghost_line.css({
                            top  : pos.top + 'px',
                            left : mv.pos.left + 'px',
                            'border-top': '2px solid #769EFC'
                        })
                    } else {
                        ghost_line.css({
                            'border-top': '2px solid transparent'
                        })
                    }
                }
                const ghost = query(obj.box).find('#grid_'+ obj.name + '_ghost')
                ghost.css({
                    top  : (mv.pos.top + mv.divY) + 'px',
                    left : mv.pos.left + 'px'
                })
                return
            }
            if (obj.selectType == 'row' && mv.start && mv.recid) {
                obj.selectNone()
                mv.start = false
            }
            const newSel = []
            const ind = (event.target.tagName.toUpperCase() == 'TR' ? query(event.target).attr('index') : query(event.target).parents('tr').attr('index'))
            const recid = obj.records[ind]?.recid
            if (recid == null) {
                // select by dragging columns
                if (obj.selectType == 'row') return
                if (obj.last.move && obj.last.move.type == 'select') return
                const col = parseInt(query(event.target).parents('td').attr('col'))
                if (isNaN(col)) {
                    obj.removeRange('column-selection')
                    query(obj.box).find('.tsg-grid-columns .tsg-col-header, .tsg-grid-fcolumns .tsg-col-header').removeClass('tsg-col-selected')
                    query(obj.box).find('.tsg-col-number').removeClass('tsg-row-selected')
                    delete mv.colRange
                } else {
                    // add all columns in between
                    let newRange = col + '-' + col
                    if (mv.column < col) newRange = mv.column + '-' + col
                    if (mv.column > col) newRange = col + '-' + mv.column
                    // array of selected columns
                    const cols = []
                    const tmp  = newRange.split('-')
                    for (let ii = parseInt(tmp[0] ?? '0'); ii <= parseInt(tmp[1] ?? '0'); ii++) {
                        cols.push(ii)
                    }
                    if (mv.colRange != newRange && mv.type == 'select-column') {
                        edataCol = obj.trigger('columnSelect', { target: obj.name, columns: cols })
                        if (edataCol.isCancelled !== true) {
                            // show new range
                            mv.colRange = newRange
                            const start = obj.records[0]!.recid
                            const end = obj.records[obj.records.length - 1]!.recid
                            obj.addRange({
                                name: 'selection-preview',
                                range: [{ recid: start, column: tmp[0] }, { recid: end, column: tmp[1] }],
                                class: 'tsg-selection-preview'
                            })
                        }
                    }
                }

            } else { // regular selection

                let ind1 = obj.get(mv.recid, true)
                // this happens when selection is started on summary row
                if (ind1 == null || (obj.records[ind1] && obj.records[ind1]!.recid != mv.recid)) return
                let ind2 = obj.get(recid, true)
                // this happens when selection is extended into summary row (a good place to implement scrolling)
                if (ind2 == null) return
                let col1 = parseInt(mv.column)
                let col2 = parseInt(event.target.tagName.toUpperCase() == 'TD' ? query(event.target).attr('col') : query(event.target).parents('td').attr('col'))
                if (isNaN(col1) && isNaN(col2)) { // line number select entire record
                    col1 = 0
                    col2 = obj.columns.length-1
                }
                if (ind1 > ind2) { const tmp = ind1; ind1 = ind2; ind2 = tmp }
                // check if need to refresh
                const tmp = 'ind1:'+ ind1 +',ind2;'+ ind2 +',col1:'+ col1 +',col2:'+ col2
                if (mv.range == tmp) return
                mv.range = tmp
                for (let i = ind1; i <= ind2; i++) {
                    if (obj.last.searchIds.length > 0 && obj.last.searchIds.indexOf(i) == -1) continue
                    if (obj.selectType != 'row') {
                        if (col1 > col2) { const tmp = col1; col1 = col2; col2 = tmp }
                        for (let c = col1; c <= col2; c++) {
                            if (obj.columns[c]!.hidden) continue
                            newSel.push({ recid: obj.records[i]!.recid, column: c })
                        }
                    } else {
                        newSel.push(obj.records[i]!.recid)
                    }
                }
                if (obj.selectType != 'row') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const start = newSel[0] as any // any: newSel contains {recid,column} objects in non-row selectType
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const end = newSel[newSel.length - 1] as any // any: same
                    obj.addRange({
                        name: 'selection-preview',
                        range: [{ recid: start?.recid, column: start?.column }, { recid: end?.recid, column: end?.column }],
                        class: 'tsg-selection-preview'
                    })
                    mv.newRange = newSel
                } else {
                    if (obj.multiSelect) {
                        // any: range select handles row + cell selections via raw arrays;
                        // both sel and newSel carry mode-specific shapes that this method intentionally treats opaquely
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const sel = obj.getSelection() as any[]
                        for (let ns = 0; ns < newSel.length; ns++) {
                            if (sel.indexOf(newSel[ns]) == -1) obj.select(newSel[ns]) // add more items
                        }
                        for (let s = 0; s < sel.length; s++) {
                            if (newSel.indexOf(sel[s]) == -1) obj.unselect(sel[s]) // remove items
                        }
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseStop(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            const mv = obj.last.move
            setTimeout(() => {
                obj.last.cancelClick = null
            }, 1)
            if (query(event.target).parents().hasClass('.tsg-head') || query(event.target).hasClass('.tsg-head')) return
            obj.removeRange('selection-preview')
            if (mv && ['select', 'select-column'].includes(mv.type)) {
                if (mv.colRange != null && edataCol.isCancelled !== true) {
                    const tmp = mv.colRange.split('-')
                    const sel = []
                    for (let i = 0; i < obj.records.length; i++) {
                        const cols = []
                        for (let j = parseInt(tmp[0]); j <= parseInt(tmp[1]); j++) cols.push(j)
                        sel.push({ recid: obj.records[i]!.recid, column: cols })
                    }
                    edataCol.finish()
                    obj.selectNone(true)
                    obj.select(sel)
                } else if (mv.newRange != null) {
                    obj.selectNone(true)
                    obj.select(...mv.newRange)
                }
                if (obj.reorderRows == true && obj.last.move.reorder) {
                    if (mv.to != null) {
                        // event
                        const edata = obj.trigger('reorderRow', { target: obj.name, recid: mv.from, moveBefore: mv.to })
                        if (edata.isCancelled === true) {
                            resetRowReorder()
                            delete obj.last.move
                            return
                        }
                        // default behavior
                        // multiple rows reordering
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const ind1 = mv.from.map((recid: any) => obj.get(recid, true))
                        let ind2 = obj.get(mv.to, true)
                        if (mv.to == 'bottom') ind2 = obj.records.length // end of list
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const tmp = ind1.map((ind: any) => obj.records[ind])
                        // swap records
                        if (ind1 != null && ind2 != null) {
                            obj.records.splice(ind1[0], ind1.length)
                            if (ind1[0] > ind2) {
                                obj.records.splice(ind2, 0, ...tmp)
                            } else {
                                obj.records.splice(ind2 - 1, 0, ...tmp)
                            }
                        }
                        // clear sortData
                        obj.sortData = []
                        query(obj.box)
                            .find(`#grid_${obj.name}_columns .tsg-col-header`)
                            .removeClass('tsg-col-sorted')
                        resetRowReorder()
                        obj.selectNone(true)
                        obj.select(mv.from)
                        // event after
                        edata.finish()
                    } else {
                        resetRowReorder()
                    }
                }
            }
            delete obj.last.move
            query(document).off('.tsg-' + obj.name)
        }

        function resetRowReorder() {
            query(obj.box).find(`#grid_${obj.name}_ghost`).remove()
            query(obj.box).find(`#grid_${obj.name}_ghost_line`).remove()
            obj.refresh()
            delete obj.last.move
        }
    }

    override unmount() {
        super.unmount()
        this.toolbar?.unmount()
        this.last['observeResize']?.disconnect()
    }

    destroy() { return gridRender.destroy(this) }

    // ===========================================
    // --- Internal Functions

    initColumnOnOff() { return gridRender.initColumnOnOff(this) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initColumnDrag(_box?: any) { return gridRender.initColumnDrag(this, _box) }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnOnOff(event: MouseEvent | any, field: string) { return gridRender.columnOnOff(this, event, field) }

    initToolbar() { return gridRender.initToolbar(this) }

    initResize() { return gridRender.initResize(this) }

    resizeBoxes() { return gridRender.resizeBoxes(this) }

    resizeRecords() { return gridRender.resizeRecords(this) }

    getSearchesHTML() {
        return gridSearch.getSearchesHTML(this)
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOperators(type: any, opers: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.getOperators as any)(this, type, opers) // any: loosely-typed operator params pass-through
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initOperator(ind: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.initOperator as any)(this, ind) // any: ind is loosely typed from DOM
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initSearchLists(changedField?: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (gridSearch.initSearchLists as any)(this, changedField) // any: changedField loosely typed
    }

    initSearches() {
        return gridSearch.initSearches(this)
    }

    getColumnsHTML() { return gridRender.getColumnsHTML(this) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getColumnCellHTML(i: any) { return gridRender.getColumnCellHTML(this, i) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnTooltipShow(ind: any, _event: any) { return gridRender.columnTooltipShow(this, ind, _event) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnTooltipHide(_ind: any, _event: any) { return gridRender.columnTooltipHide(this, _ind, _event) }

    getRecordsHTML() { return gridRender.getRecordsHTML(this) }

    getSummaryHTML() { return gridRender.getSummaryHTML(this) }

    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scroll(event?: Event | any) { return gridRender.scroll(this, event) }

    getRecordHTML(ind: number, lineNum: number, summary?: boolean) { return gridRender.getRecordHTML(this, ind, lineNum, summary) }

    getLineHTML(lineNum: number): string { return gridRender.getLineHTML(this, lineNum) }

    getCellHTML(ind: number, col_ind: number, summary?: boolean, col_span?: number) { return gridRender.getCellHTML(this, ind, col_ind, summary, col_span) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clipboardCopy(ind: any, col_ind: any, summary: any) { return gridRender.clipboardCopy(this, ind, col_ind, summary) }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showBubble(ind: any, col_ind: any, summary: any) { return gridRender.showBubble(this, ind, col_ind, summary) }

    // return null or the editable object if the given cell is editable
    // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellEditable(ind: number, col_ind: number): any { return gridRender.getCellEditable(this, ind, col_ind) }

    // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellValue(ind: number, col_ind: number, summary?: boolean, extra?: boolean): any { return gridRender.getCellValue(this, ind, col_ind, summary, extra) }

    getFooterHTML() { return gridRender.getFooterHTML(this) }

    status(msg?: string) {
        return gridState.status(this, msg)
    }

    lock(msg?: string, showSpinner?: boolean) {
        return gridState.lock(this, msg, showSpinner)
    }

    unlock(speed?: number) {
        return gridState.unlock(this, speed)
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateSave(returnOnly: any) {
        return gridState.stateSave(this, returnOnly)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateRestore(newState?: any) { // any: state blob is serialized JSON
        return gridState.stateRestore(this, newState)
    }

    stateReset() {
        return gridState.stateReset(this)
    }

    // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseField(obj: TsGridRecord | null | undefined, field: string): any {
        return gridState.parseField(this, obj, field)
    }

    prepareData() {
        return gridState.prepareData(this)
    }

    nextCell(index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
        return gridState.nextCell(this, index, col_ind, editable)
    }

    prevCell(index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
        return gridState.prevCell(this, index, col_ind, editable)
    }

    nextRow(ind: number, col_ind?: number, numRows?: number): number | null {
        return gridState.nextRow(this, ind, col_ind, numRows)
    }

    prevRow(ind: number, col_ind?: number, numRows?: number): number | null {
        return gridState.prevRow(this, ind, col_ind, numRows)
    }

    selectionSave() {
        return gridState.selectionSave(this)
    }

    selectionRestore(noRefresh?: boolean) {
        return gridState.selectionRestore(this, noRefresh)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message(options?: any) { // any: message options vary by type (string, object)
        return gridState.message(this, options)
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confirm(options: any) {
        return gridState.confirm(this, options)
    }
}

export { TsGrid }
