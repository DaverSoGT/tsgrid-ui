/**
 * Part of w2ui 2.0 library
 *  - Dependencies: w2utils, w2base, w2toolbar, w2tooltip, w2field
 *
 * T5.1: Renamed src/w2grid.js → src/w2grid.ts.
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
 *  - allow enum in inline edit (see https://github.com/vitmalina/w2ui/issues/911#issuecomment-107341193)
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
 *  - added rec.w2ui.selectable
 *  - added rec.w2ui.styles
 *  - added grid.groupBy = {} and grid.last.groupBy_links = {}
 */

import { w2base } from './w2base.js'
import { w2ui, w2utils } from './w2utils.js'
import { query as _queryRaw } from './query.js'
import { w2toolbar } from './w2toolbar.js'
import { w2menu as _w2menu, w2tooltip as _w2tooltip } from './w2tooltip.js'
import { w2field } from './w2field.js'

// any: query() always returns Query at runtime; cast to any for clean duck-typing throughout w2grid
// (grid makes extensive use of .get(0) as HTMLElement and Node.style patterns)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like in w2grid
// any: w2menu/w2tooltip have complex show/hide overloads
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w2menu    = _w2menu as any    // any: menu overlay with dynamic option shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w2tooltip = _w2tooltip as any // any: tooltip with flexible option shapes

// ---------------------------------------------------------------------------
// Type definitions — T5.1 (skeleton + CRUD); T5.2 (column + search cluster)
//                    T5.4 (selection + ranges)
// Additional interfaces added in T5.3–T5.9 as clusters are typed
// ---------------------------------------------------------------------------

/** A single data record stored in the grid */
interface W2GridRecord {
    recid: string | number
    w2ui?: {
        summary?: boolean
        children?: W2GridRecord[]
        parent_recid?: string | number
        expanded?: boolean
        selectable?: boolean
        styles?: Record<string, string>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any // any: dynamic per-record w2ui metadata
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: user-defined field values
}

/** Sort descriptor used in grid.sortData */
interface W2GridSortData {
    field: string
    direction: 'asc' | 'desc'
    field_?: string // any: runtime-computed cached field name for date/time render types (localSort internal)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: runtime-assigned sort state properties
}

/** Virtual scroll state kept in grid.last.vscroll */
interface W2GridVScroll {
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
interface W2GridFetch {
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
interface W2GridColumn {
    field: string
    text: string | ((col: W2GridColumn) => string)
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
    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editable?: boolean | { type: string; [key: string]: any } | ((rec: W2GridRecord, cell: any) => any)
    render?: string | ((record: W2GridRecord, index: number, colIndex: number) => string)
    tooltip?: string              // tooltip shown on column header hover
    style?: string                // inline CSS for cells in this column
    attr?: string                 // HTML attributes for <td> elements
    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clipboardCopy?: boolean | ((record: W2GridRecord, cell: any) => string) // if true/function show clipboard copy icon in cells
    colspan?: Record<string, number> | ((record: W2GridRecord, index: number) => number)
    sizeCalculated?: string       // runtime-computed pixel width string (e.g. '120px')
    sizeOriginal?: string | number // original size before resize operations
    sizeType?: string             // 'px' or '%'
    gridMinWidth?: number         // minimum grid width for this column to be visible
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any            // any: custom per-column metadata
}

/** Search field definition — T5.2 */
interface W2GridSearch {
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
    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: Record<string, any> // extra options passed to w2field (list items, etc.)
    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any                   // current value of the search field (runtime)
    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svalue?: any                  // display value for enum/list searches (runtime)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any            // any: custom per-search metadata
}

/** Internal last-state object */
interface W2GridLast {
    field: string
    label: string
    logic: 'AND' | 'OR'
    search: string
    searchIds: number[]
    selection: W2GridSelection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saved_sel: any | null // any: complex selection restore payload
    multi: boolean
    fetch: W2GridFetch
    vscroll: W2GridVScroll
    sel_ind: number | null
    sel_col: number | null
    sel_type: string | null
    sel_recid: string | number | null
    idCache: Record<string | number, number>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    move: any | null // any: drag/move state object shape varies
    cancelClick: boolean | null
    inEditMode: boolean
    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
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
    copy_event: any | null // any: copy() returns a w2event with .detail.text, not a ClipboardEvent
    userSelect: string
    columnDrag: false | { remove(): void }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any | null // any: serialized grid state blob
    toolbar_height: number
    groupBy_links: Record<string, W2GridRecord>
    originalSort?: (string | number)[] // any: saved original record order for sort restore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: runtime-assigned transient last-state properties
}

/** Cell-level selection descriptor used in cell-select mode */
interface _W2GridCellSelection {
    recid: string | number
    index?: number
    column: number
}

/** Selection state — T5.4 */
interface W2GridSelection {
    indexes: number[]
    columns: Record<string | number, number[]>
}

/** Range endpoint (used in addRange / refreshRanges) */
interface W2GridRangeEndpoint {
    recid: string | number
    column: number
    index?: number  // runtime index (added by refreshRanges)
}

/** Range descriptor for addRange / refreshRanges */
interface W2GridRange {
    name: string
    range: W2GridRangeEndpoint[]  // [start, end] — 2-element in practice
    style?: string
    class?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: custom range metadata
}

/** Active search filter — one entry in grid.searchData — T5.5 */
interface W2GridSearchFilter {
    field: string
    type: string
    operator: string
    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any
    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svalue?: any // display values for enum/list searches
    text?: string // display text for list/enum
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: dynamic search filter props
}

/** GroupBy configuration object */
interface W2GridGroupBy {
    field: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: user can attach extra groupBy metadata
}

class w2grid extends w2base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: dynamic properties added via w2utils.extend and event handlers

    declare name: string
    declare box: HTMLElement | null
    columns: W2GridColumn[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnGroups: any[]   // any: column group shapes — span/text/main/style; minimal typing for T5.2
    records: W2GridRecord[]
    summary: W2GridRecord[]
    searches: W2GridSearch[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolbar: any          // any: w2toolbar instance or config object
    ranges: W2GridRange[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenu: any[]    // any: context menu item shapes
    searchMap: Record<string, string>
    searchData: W2GridSearchFilter[]
    sortMap: Record<string, string>
    sortData: W2GridSortData[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    savedSearches: any[]  // any: saved search objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultSearches: any[] // any: default search objects
    groupBy: W2GridGroupBy | null
    total: number
    recid: string | null
    hierarchyColumn: number
    last: W2GridLast
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
    onAdd: ((event: CustomEvent) => void) | null
    onEdit: ((event: CustomEvent) => void) | null
    onRequest: ((event: CustomEvent) => void) | null
    onLoad: ((event: CustomEvent) => void) | null
    onDelete: ((event: CustomEvent) => void) | null
    onSave: ((event: CustomEvent) => void) | null
    onSelect: ((event: CustomEvent) => void) | null
    onClick: ((event: CustomEvent) => void) | null
    onDblClick: ((event: CustomEvent) => void) | null
    onContextMenu: ((event: CustomEvent) => void) | null
    onContextMenuClick: ((event: CustomEvent) => void) | null
    onColumnClick: ((event: CustomEvent) => void) | null
    onColumnDblClick: ((event: CustomEvent) => void) | null
    onColumnContextMenu: ((event: CustomEvent) => void) | null
    onColumnResize: ((event: CustomEvent) => void) | null
    onColumnAutoResize: ((event: CustomEvent) => void) | null
    onSort: ((event: CustomEvent) => void) | null
    onSearch: ((event: CustomEvent) => void) | null
    onSearchOpen: ((event: CustomEvent) => void) | null
    onSearchClose: ((event: CustomEvent) => void) | null
    onChange: ((event: CustomEvent) => void) | null
    onRestore: ((event: CustomEvent) => void) | null
    onExpand: ((event: CustomEvent) => void) | null
    onCollapse: ((event: CustomEvent) => void) | null
    onError: ((event: CustomEvent) => void) | null
    onKeydown: ((event: CustomEvent) => void) | null
    onToolbar: ((event: CustomEvent) => void) | null
    onColumnOnOff: ((event: CustomEvent) => void) | null
    onCopy: ((event: CustomEvent) => void) | null
    onPaste: ((event: CustomEvent) => void) | null
    onSelectionExtend: ((event: CustomEvent) => void) | null
    onEditField: ((event: CustomEvent) => void) | null
    onRender: ((event: CustomEvent) => void) | null
    onRefresh: ((event: CustomEvent) => void) | null
    onReload: ((event: CustomEvent) => void) | null
    onResize: ((event: CustomEvent) => void) | null
    onDestroy: ((event: CustomEvent) => void) | null
    onStateSave: ((event: CustomEvent) => void) | null
    onStateRestore: ((event: CustomEvent) => void) | null
    onFocus: ((event: CustomEvent) => void) | null
    onBlur: ((event: CustomEvent) => void) | null
    onReorderRow: ((event: CustomEvent) => void) | null
    onSearchSave: ((event: CustomEvent) => void) | null
    onSearchRemove: ((event: CustomEvent) => void) | null
    onSearchSelect: ((event: CustomEvent) => void) | null
    onColumnSelect: ((event: CustomEvent) => void) | null
    onColumnDragStart: ((event: CustomEvent) => void) | null
    onColumnDragEnd: ((event: CustomEvent) => void) | null
    onResizerDblClick: ((event: CustomEvent) => void) | null
    onMouseEnter: ((event: CustomEvent) => void) | null
    onMouseLeave: ((event: CustomEvent) => void) | null

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
        this.recordHeight      = (w2utils.settings?.['recordHeight'] as number) ?? 32
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
        this.dataType          = null // if defined, then overwrites w2utils.settings.dataType
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
            'reload'   : { type: 'button', id: 'w2ui-reload', icon: 'w2ui-icon-reload', tooltip: w2utils.lang('Reload data in the list') },
            'columns'  : { type: 'menu-check', id: 'w2ui-column-on-off', icon: 'w2ui-icon-columns', tooltip: w2utils.lang('Show/hide columns'),
                overlay: { align: 'none' }
            },
            'search'   : { type: 'html', id: 'w2ui-search',
                html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>'
            },
            'add'      : { type: 'button', id: 'w2ui-add', text: 'Add New', tooltip: w2utils.lang('Add new record'), icon: 'w2ui-icon-plus' },
            'edit'     : { type: 'button', id: 'w2ui-edit', text: 'Edit', tooltip: w2utils.lang('Edit selected record'), icon: 'w2ui-icon-pencil', batch: 1, disabled: true },
            'delete'   : { type: 'button', id: 'w2ui-delete', text: 'Delete', tooltip: w2utils.lang('Delete selected records'), icon: 'w2ui-icon-cross', batch: true, disabled: true },
            'save'     : { type: 'button', id: 'w2ui-save', text: 'Save', tooltip: w2utils.lang('Save changed records'), icon: 'w2ui-icon-check' }
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
        w2utils.extend(this, options)

        // check if there are records without recid
        if (Array.isArray(this.records)) {
            // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const remove: any[] = [] // remove from records as they are summary
            this.records.forEach((rec, ind) => {
                if (this.recid != null && rec[this.recid] != null) {
                    rec.recid = rec[this.recid!]
                }
                if (rec.recid == null) {
                    console.log('ERROR: Cannot add records without recid. (obj: '+ this.name +')')
                }
                if (rec.w2ui?.summary === true) {
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
                col = w2utils.extend({}, this.colTemplate, col)
                this.columns[ind] = col
                const search = col.searchable
                if (search == null || search === false || this.getSearch(col.field) != null) return
                if (w2utils.isPlainObject(search)) {
                    this.addSearch(w2utils.extend({ field: col.field, label: col.text, type: 'text' }, search))
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
                search.icon ??= 'w2ui-icon-search'
            })
        }
        // check if there are saved searches in localStorage
        const data = this.cache('searches')
        if (Array.isArray(data)) {
            data.forEach(search => {
                this.savedSearches.push({
                    id: search.id ?? 'none',
                    text: search.text ?? 'none',
                    icon: 'w2ui-icon-search',
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

    add(record: W2GridRecord | W2GridRecord[], first?: boolean): number {
        if (!Array.isArray(record)) record = [record]
        let added = 0
        for (let i = 0; i < record.length; i++) {
            const rec = record[i]!
            if (this.recid != null && rec[this.recid] != null) {
                rec.recid = rec[this.recid!]
            }
            if (rec.recid == null) {
                console.log('ERROR: Cannot add record without recid. (obj: '+ this.name +')')
                continue
            }
            if (rec.w2ui?.summary === true) {
                if (first) this.summary.unshift(rec); else this.summary.push(rec)
            } else {
                if (first) this.records.unshift(rec); else this.records.push(rec)
            }
            added++
        }
        this.processGroupBy()
        const url = this.url?.get ?? this.url
        if (!url) {
            this.total = this.records.length
            this.localSort(false, true)
            this.localSearch()
            // only refresh if it is in virtual view
            const indStart = this.records.length - record.length
            const indEnd  = indStart + record.length
            if ((this.last.vscroll.recIndStart ?? 0) <= indEnd && (this.last.vscroll.recIndEnd ?? 0) >= indStart) {
                this.refresh()
            } else {
                // just update total if it it there
                query(this.box)
                    .find('#grid_'+ this.name + '_footer .w2ui-footer-right .w2ui-total')
                    .html(w2utils.formatNumber(this.total))
            }
        } else {
            this.refresh()
        }
        return added
    }

    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    find(obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[] {
        // any: obj values are user-supplied record field values for matching
        if (obj == null) obj = {}
        const recs    = []
        let hasDots = false
        // check if property is nested - needed for speed
        for (const o in obj) if (String(o).indexOf('.') != -1) hasDots = true
        // look for an item
        const start = displayedOnly ? (this.last.vscroll.recIndStart ?? 0) : 0
        let end   = displayedOnly ? (this.last.vscroll.recIndEnd ?? this.records.length) + 1: this.records.length
        if (end > this.records.length) end = this.records.length
        for (let i = start; i < end; i++) {
            const rec_i = this.records[i]!
            let match = true
            for (const o in obj) {
                let val = rec_i[o]
                if (hasDots && String(o).indexOf('.') != -1) val = this.parseField(rec_i, o)
                if (obj[o] == 'not-null') {
                    if (val == null || val === '') match = false
                } else {
                    if (obj[o] != val) match = false
                }
            }
            if (match && returnIndex !== true) recs.push(rec_i.recid)
            if (match && returnIndex === true) recs.push(i)
        }
        return recs
    }

    // does not delete existing, but overrides on top of it
    // Overload: set(recid, record, noRefresh?) or set(record, noRefresh?) — shifts args when recid is object
    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(recid: any, record?: any, noRefresh?: boolean): boolean {
        if ((typeof recid == 'object') && (recid !== null)) {
            noRefresh = record
            record    = recid
            recid     = null
        }
        // update all records
        if (recid == null) {
            for (let i = 0; i < this.records.length; i++) {
                w2utils.extend(this.records[i], record) // recid is the whole record
            }
            if (noRefresh !== true) this.refresh()
        } else { // find record to update
            const ind = this.get(recid, true)
            if (ind == null) return false
            const isSummary = (this.records[ind]?.recid == recid ? false : true)
            if (isSummary) {
                w2utils.extend(this.summary[ind], record)
            } else {
                w2utils.extend(this.records[ind], record)
            }
            if (noRefresh !== true) this.refreshRow(recid, ind) // refresh only that record
        }
        this.processGroupBy()
        return true
    }

    // replaces existing record
    replace(recid: string | number, record: W2GridRecord, noRefresh?: boolean): boolean {
        const ind = this.get(recid, true)
        if (ind == null) return false
        const isSummary = (this.records[ind]?.recid == recid ? false : true)
        if (isSummary) {
            this.summary[ind] = record
        } else {
            this.records[ind] = record
        }
        if (noRefresh !== true) this.refreshRow(recid, ind) // refresh only that record
        this.processGroupBy()
        return true
    }

    get(recid: (string | number)[], returnIndex?: boolean): (W2GridRecord | number)[]
    get(recid: string | number, returnIndex: true): number | null
    get(recid: string | number, returnIndex?: false): W2GridRecord | null
    get(recid: string | number | (string | number)[], returnIndex?: boolean): W2GridRecord | (W2GridRecord | number)[] | number | null {
        // search records
        if (Array.isArray(recid)) {
            const recs = []
            for (let i = 0; i < recid.length; i++) {
                // any: this-cast for legacy widget self-reference; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const v = (this as any).get(recid[i], returnIndex)
                if (v !== null)
                    recs.push(v)
            }
            return recs
        } else {
            // get() must be fast, implements a cache to bypass loop over all records
            // most of the time.
            let idCache = this.last.idCache
            if (!idCache) {
                this.last.idCache = idCache = {}
            }
            let i = idCache[recid]
            if (typeof(i) === 'number') {
                if (i >= 0 && i < this.records.length && this.records[i]!.recid == recid) {
                    if (returnIndex === true) return i; else return this.records[i]!
                }
                // summary indexes are stored as negative numbers, try them now.
                i = ~i
                if (i >= 0 && i < this.summary.length && this.summary[i]!.recid == recid) {
                    if (returnIndex === true) return i; else return this.summary[i]!
                }
                // wrong index returned, clear cache
                this.last.idCache = idCache = {}
            }
            for (let i = 0; i < this.records.length; i++) {
                if (this.records[i]!.recid == recid) {
                    idCache[recid] = i
                    if (returnIndex === true) return i; else return this.records[i]!
                }
            }
            // search summary
            for (let i = 0; i < this.summary.length; i++) {
                if (this.summary[i]!.recid == recid) {
                    idCache[recid] = ~i
                    if (returnIndex === true) return i; else return this.summary[i]!
                }
            }
            return null
        }
    }

    getFirst(offset?: number): W2GridRecord | null {
        if (this.records.length == 0) return null
        let rec: W2GridRecord | null = this.records[0] ?? null
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
        let removed = 0
        for (let a = 0; a < recids.length; a++) {
            for (let r = this.records.length-1; r >= 0; r--) {
                if (this.records[r]!.recid == recids[a]) { this.records.splice(r, 1); removed++ }
            }
            for (let r = this.summary.length-1; r >= 0; r--) {
                if (this.summary[r]!.recid == recids[a]) { this.summary.splice(r, 1); removed++ }
            }
        }
        const url = this.url?.get ?? this.url
        if (!url) {
            this.localSort(false, true)
            this.localSearch()
            this.total = this.records.length
        }
        this.refresh()
        return removed
    }

    /**
     * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
     * needs to be cleared when record is cleared
     */
    processGroupBy(): void {
        if (this.groupBy == null) return
        const groupBy = this.groupBy
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const new_records: any[] = []
        this.records.forEach(rec => {
            const group = rec[groupBy.field]
            if (group != null) {
                if (this.last.groupBy_links[group] == null) {
                    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const gr: any = { recid: 'group-'+ group, group, w2ui: { ...groupBy, children: [] } }
                    this.last.groupBy_links[group] = gr
                    delete gr.w2ui!['field'] // no need for this field
                    new_records.push(gr)
                }
                rec[groupBy.field] = ''
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this.last.groupBy_links[group] as any).w2ui.children.push(rec) // any: groupBy_links values are W2GridRecord with w2ui.children
            }
        })
        this.records = new_records
        if (this.total !== -1) {
            this.total = this.records.length
        }
    }

    /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
    // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addColumn(before: any, columns?: any): number {
        let added = 0
        if (columns === undefined) {
            columns = before
            before  = this.columns.length
        } else {
            if (typeof before == 'string') before = this.getColumn(before, true)
            if (before == null) before = this.columns.length
        }
        if (!Array.isArray(columns)) columns = [columns]
        for (let i = 0; i < columns.length; i++) {
            const col = w2utils.extend({}, this.colTemplate, columns[i])
            this.columns.splice(before, 0, col)
            // if column is searchable, add search field
            if (columns[i].searchable) {
                let stype = columns[i].searchable
                let attr  = ''
                if (columns[i].searchable === true) { stype = 'text'; attr = 'size="20"' }
                this.addSearch({ field: columns[i].field, label: columns[i].text, type: stype, attr: attr })
            }
            before++
            added++
        }
        this.refresh()
        return added
    }

    removeColumn(...fields: string[]) {
        let removed = 0
        for (let a = 0; a < fields.length; a++) {
            const field_a = fields[a]!
            for (let r = this.columns.length-1; r >= 0; r--) {
                if (this.columns[r]!.field == field_a) {
                    if (this.columns[r]!.searchable) this.removeSearch(field_a)
                    this.columns.splice(r, 1)
                    removed++
                }
            }
        }
        this.refresh()
        return removed
    }

    getColumn(): string[]
    getColumn(field: string, returnIndex: true): number | null
    getColumn(field: string, returnIndex?: false): W2GridColumn | null
    getColumn(field?: string, returnIndex?: boolean): string[] | number | W2GridColumn | null {
        // no arguments - return fields of all columns
        if (field === undefined) {
            const ret = []
            for (let i = 0; i < this.columns.length; i++) ret.push(this.columns[i]!.field)
            return ret
        }
        // find column
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i]!.field == field) {
                if (returnIndex === true) return i; else return this.columns[i]!
            }
        }
        return null
    }

    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateColumn(fields: string | string[], updates: Partial<W2GridColumn> | Record<string, any>) {
        let effected = 0
        fields = (Array.isArray(fields) ? fields : [fields])
        fields.forEach((colName) => {
            this.columns.forEach((col) => {
                if (col.field == colName) {
                    const _updates = w2utils.clone(updates)
                    Object.keys(_updates).forEach((key) => {
                        // if it is a function
                        if (typeof _updates[key] == 'function') {
                            _updates[key] = _updates[key](col)
                        }
                        if (col[key] != _updates[key]) effected++
                    })
                    w2utils.extend(col, _updates)
                }
            })
        })
        if (effected > 0) {
            this.refresh() // need full refresh due to colgroups not reassigning properly
        }
        return effected
    }

    toggleColumn(...fields: string[]) {
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.updateColumn(fields, { hidden(col: any) { return !col.hidden } })
    }

    showColumn(...fields: string[]) {
        return this.updateColumn(fields, { hidden: false })
    }

    hideColumn(...fields: string[]) {
        return this.updateColumn(fields, { hidden: true })
    }

    /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
    // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addSearch(before: any, search?: any): number {
        let added = 0
        if (search === undefined) {
            search = before
            before = this.searches.length
        } else {
            if (typeof before == 'string') before = this.getSearch(before, true)
            if (before == null) before = this.searches.length
        }
        if (!Array.isArray(search)) search = [search]
        for (let i = 0; i < search.length; i++) {
            this.searches.splice(before, 0, search[i])
            before++
            added++
        }
        this.searchClose()
        return added
    }

    removeSearch(...fields: string[]) {
        let removed = 0
        for (let a = 0; a < fields.length; a++) {
            const field_a = fields[a]!
            for (let r = this.searches.length-1; r >= 0; r--) {
                if (this.searches[r]!.field == field_a) { this.searches.splice(r, 1); removed++ }
            }
        }
        this.searchClose()
        return removed
    }

    getSearch(): string[]
    getSearch(field: string, returnIndex: true): number | null
    getSearch(field: string, returnIndex?: false): W2GridSearch | null
    getSearch(field?: string, returnIndex?: boolean): string[] | number | W2GridSearch | null {
        // no arguments - return fields of all searches
        if (field === undefined) {
            const ret = []
            for (let i = 0; i < this.searches.length; i++) ret.push(this.searches[i]!.field)
            return ret
        }
        // find search
        for (let i = 0; i < this.searches.length; i++) {
            if (this.searches[i]!.field == field) {
                if (returnIndex === true) return i; else return this.searches[i]!
            }
        }
        return null
    }

    toggleSearch(...fields: string[]) {
        let effected = 0
        for (let a = 0; a < fields.length; a++) {
            const field_a = fields[a]!
            for (let r = this.searches.length-1; r >= 0; r--) {
                if (this.searches[r]!.field == field_a) {
                    this.searches[r]!.hidden = !this.searches[r]!.hidden
                    effected++
                }
            }
        }
        this.searchClose()
        return effected
    }

    showSearch(...fields: string[]) {
        let shown = 0
        for (let a = 0; a < fields.length; a++) {
            const field_a = fields[a]!
            for (let r = this.searches.length-1; r >= 0; r--) {
                if (this.searches[r]!.field == field_a && this.searches[r]!.hidden !== false) {
                    this.searches[r]!.hidden = false
                    shown++
                }
            }
        }
        this.searchClose()
        return shown
    }

    hideSearch(...fields: string[]) {
        let hidden = 0
        for (let a = 0; a < fields.length; a++) {
            const field_a = fields[a]!
            for (let r = this.searches.length-1; r >= 0; r--) {
                if (this.searches[r]!.field == field_a && this.searches[r]!.hidden !== true) {
                    this.searches[r]!.hidden = true
                    hidden++
                }
            }
        }
        this.searchClose()
        return hidden
    }

    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSearchData(field: string): Record<string, any> | null {
        for (let i = 0; i < this.searchData.length; i++) {
            if (this.searchData[i]!.field == field) return this.searchData[i]!
        }
        return null
    }

    localSort(silent?: boolean, noResetRefresh?: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        const url = this.url?.get ?? this.url
        if (url) {
            console.log('ERROR: grid.localSort can only be used on local data source, grid.url should be empty.')
            return 0 // time it took
        }
        if (Object.keys(this.sortData).length === 0) {
            // restore original sorting
            const os = this.last.originalSort
            if (os) {
                this.records.sort((a, b) => {
                    const aInd = os.indexOf(a.recid)
                    const bInd = os.indexOf(b.recid)
                    // order cann be equal, so, no need to return 0
                    return aInd > bInd ? 1 : -1
                })
            }
            return 0 // time it took
        }
        let time = Date.now()
        // process date fields
        this.selectionSave()
        this.prepareData()
        if (!noResetRefresh) {
            this.reset()
        }
        // process sortData
        for (let i = 0; i < this.sortData.length; i++) {
            const sortItem = this.sortData[i]!
            const column = this.getColumn(sortItem.field) as W2GridColumn | null
            if (!column) return // TODO: ability to sort columns when they are not part of colums array
            if (typeof column.render == 'string') {
                const renderType = column.render.split(':')[0] ?? ''
                if (['date', 'age'].indexOf(renderType) != -1) {
                    sortItem.field_ = column.field + '_'
                }
                if (['time'].indexOf(renderType) != -1) {
                    sortItem.field_ = column.field + '_'
                }
            }
        }

        // prepare paths and process sort
        preparePaths()
        this.records.sort((a, b) => {
            return compareRecordPaths(a, b)
        })
        cleanupPaths()

        this.selectionRestore(noResetRefresh)
        time = Date.now() - time
        if (silent !== true && this.show.statusSort) {
            setTimeout(() => {
                this.status(w2utils.lang('Sorting took ${count} seconds', { count: time/1000 }))
            }, 10)
        }
        return time

        // grab paths before sorting for efficiency and because calling obj.get()
        // while sorting 'obj.records' is unsafe, at least on webkit
        function preparePaths(): void {
            for (let i = 0; i < obj.records.length; i++) {
                const rec = obj.records[i]!
                if (rec.w2ui?.parent_recid != null) {
                    rec.w2ui['_path'] = getRecordPath(rec)
                }
            }
        }

        // cleanup and release memory allocated by preparePaths()
        function cleanupPaths(): void {
            for (let i = 0; i < obj.records.length; i++) {
                const rec = obj.records[i]!
                if (rec.w2ui?.parent_recid != null) {
                    rec.w2ui['_path'] = null
                }
            }
        }

        // compare two paths, from root of tree to given records
        function compareRecordPaths(a: W2GridRecord, b: W2GridRecord): number {
            if ((!a.w2ui || a.w2ui.parent_recid == null) && (!b.w2ui || b.w2ui.parent_recid == null)) {
                return compareRecords(a, b) // no tree, fast path
            }
            const pa = getRecordPath(a)
            const pb = getRecordPath(b)
            for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
                const diff = compareRecords(pa[i]!, pb[i]!)
                if (diff !== 0) return diff // different subpath
            }
            if (pa.length > pb.length) return 1
            if (pa.length < pb.length) return -1
            console.log('ERROR: two paths should not be equal.')
            return 0
        }

        // return an array of all records from root to and including 'rec'
        function getRecordPath(rec: W2GridRecord): W2GridRecord[] {
            if (!rec.w2ui || rec.w2ui.parent_recid == null) return [rec]
            if (rec.w2ui['_path'])
                return rec.w2ui['_path'] as W2GridRecord[]
            // during actual sort, we should never reach this point
            const subrec = obj.get(rec.w2ui.parent_recid)
            if (!subrec) {
                console.log('ERROR: no parent record: ' + rec.w2ui.parent_recid)
                return [rec]
            }
            return (getRecordPath(subrec).concat(rec))
        }

        // compare two records according to sortData and finally recid
        function compareRecords(a: W2GridRecord, b: W2GridRecord): number {
            if (a === b) return 0 // optimize, same object
            for (let i = 0; i < obj.sortData.length; i++) {
                const sortItem = obj.sortData[i]!
                const fld     = sortItem.field
                const sortFld = sortItem.field_ ? sortItem.field_! : fld
                // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let aa: any = a[sortFld]
                // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let bb: any = b[sortFld]
                if (String(fld).indexOf('.') != -1) {
                    aa = obj.parseField(a, sortFld)
                    bb = obj.parseField(b, sortFld)
                }
                const col = obj.getColumn(fld) as W2GridColumn | null
                if (col && col['editable'] && Object.keys(col['editable']).length > 0) { // for drop editable fields and drop downs
                    if (w2utils.isPlainObject(aa) && aa.text) aa = aa.text
                    if (w2utils.isPlainObject(bb) && bb.text) bb = bb.text
                }
                const ret = compareCells(aa, bb, i, sortItem.direction, col?.sortMode || 'default')
                if (ret !== 0) return ret
            }
            // break tie for similar records,
            // required to have consistent ordering for tree paths
            const ret = compareCells(a.recid, b.recid, -1, 'asc')
            return ret
        }

        // compare two values, aa and bb, producing consistent ordering
        // any: aa/bb are record field values — dynamic types (string | number | Date | object)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function compareCells(aa: any, bb: any, i: number, direction: string, sortMode?: string | ((a: any, b: any) => number)) {
            // if both objects are strictly equal, we're done
            if (aa === bb)
                return 0
            const dir = (direction.toLowerCase() === 'asc') ? 1 : -1

            // if we have comparison callback, let it make all decisions,
            // including how nulls sort
            if (typeof sortMode == 'function') {
                return sortMode(aa, bb) * dir
            }

            // all nulls, empty and undefined on bottom
            if ((aa == null || aa === '') && (bb != null && bb !== ''))
                return 1
            if ((aa != null && aa !== '') && (bb == null || bb === ''))
                return -1
            // for different kind of objects, sort by object type
            if (typeof aa != typeof bb)
                return (typeof aa > typeof bb) ? dir : -dir
            // for different kind of classes, sort by classes
            if (aa.constructor.name != bb.constructor.name)
                return (aa.constructor.name > bb.constructor.name) ? dir : -dir
            // if we're dealing with non-null objects, call valueOf().
            // this mean that Date() or custom objects will compare properly.
            if (aa && typeof aa == 'object')
                aa = aa.valueOf()
            if (bb && typeof bb == 'object')
                bb = bb.valueOf()
            // if we're still dealing with non-null objects that have
            // a useful Object => String conversion, convert to string.
            const defaultToString = {}.toString
            if (aa && typeof aa == 'object' && aa.toString != defaultToString)
                aa = String(aa)
            if (bb && typeof bb == 'object' && bb.toString != defaultToString)
                bb = String(bb)
            // do case-insensitive string comparison
            if (typeof aa == 'string')
                aa = aa.toLowerCase().trim()
            if (typeof bb == 'string')
                bb = bb.toLowerCase().trim()

            switch (sortMode) {
                case 'natural':
                    sortMode = w2utils.naturalCompare
                    break
                case 'i18n':
                    sortMode = w2utils.i18nCompare
                    break
            }

            if (typeof sortMode == 'function') {
                return sortMode(aa,bb) * dir
            }

            // compare both objects
            if (aa > bb)
                return dir
            if (aa < bb)
                return -dir
            return 0
        }
    }

    localSearch(silent?: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        const url = this.url?.get ?? this.url
        if (url) {
            console.log('ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.')
            return
        }
        let time            = Date.now()
        const defaultToString = {}.toString
        const duplicateMap: Record<string | number, boolean> = {}
        this.total          = this.records.length
        // mark all records as shown
        this.last.searchIds = []
        // prepare date/time fields
        this.prepareData()
        // hide records that did not match
        if (this.searchData.length > 0 && !url) {
            this.total = 0
            for (let i = 0; i < this.records.length; i++) {
                const rec = this.records[i]!
                const match = searchRecord(rec)
                if (match) {
                    if (rec?.w2ui) addParent(rec.w2ui.parent_recid ?? null)
                    if (this.showExtraOnSearch > 0) {
                        let before = this.showExtraOnSearch
                        let after  = this.showExtraOnSearch
                        if (i < before) before = i
                        if (i + after > this.records.length) after = this.records.length - i
                        if (before > 0) {
                            for (let j = i - before; j < i; j++) {
                                if (this.last.searchIds.indexOf(j) < 0)
                                    this.last.searchIds.push(j)
                            }
                        }
                        if (this.last.searchIds.indexOf(i) < 0) this.last.searchIds.push(i)
                        if (after > 0) {
                            for (let j = (i + 1) ; j <= (i + after) ; j++) {
                                if (this.last.searchIds.indexOf(j) < 0) this.last.searchIds.push(j)
                            }
                        }
                    } else {
                        this.last.searchIds.push(i)
                    }
                }
            }
            this.total = this.last.searchIds.length
        }
        time = Date.now() - time
        if (silent !== true && this.show.statusSearch) {
            setTimeout(() => {
                this.status(w2utils.lang('Search took ${count} seconds', { count: time/1000 }))
            }, 10)
        }
        return time

        // check if a record (or one of its closed children) matches the search data
        function searchRecord(rec: W2GridRecord): boolean {
            let fl = 0, val1, val2, val3, tmp
            let orEqual = false
            for (let j = 0; j < obj.searchData.length; j++) {
                const sdata = obj.searchData[j]
                if (sdata == null) continue
                let search = obj.getSearch(sdata.field) as W2GridSearch | null
                if (search == null) search = { field: sdata.field, type: sdata.type } as W2GridSearch
                // поиск среди изменений
                const val1b = rec.w2ui?.['changes']?.[search.field] ?? obj.parseField(rec, search.field)
                val1 = (val1b != null && (typeof val1b != 'object' || val1b.toString != defaultToString))
                    ? String(val1b).toLowerCase()
                    : '' // do not match a bogus string
                if (sdata['value'] != null) {
                    if (!Array.isArray(sdata['value'])) {
                        val2 = String(sdata['value']).toLowerCase()
                    } else {
                        val2 = sdata['value'][0]
                        val3 = sdata['value'][1]
                    }
                }
                switch (sdata['operator']) {
                    case '=':
                    case 'is':
                        if (val1b == sdata['value'] || String(val1b) == sdata['value']) fl++ // do not hide record
                        else if (search.type == 'date') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatDate(tmp, 'yyyy-mm-dd')
                            val2 = w2utils.formatDate(w2utils.isDate(val2, w2utils.settings.dateFormat, true), 'yyyy-mm-dd')
                            if (val1 == val2) fl++
                        }
                        else if (search.type == 'time') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatTime(tmp, 'hh24:mi')
                            val2 = w2utils.formatTime(val2, 'hh24:mi')
                            if (val1 == val2) fl++
                        }
                        else if (search.type == 'datetime') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                            val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
                            if (val1 == val2) fl++
                        }
                        break
                    case 'is not':
                    case '!=':
                        if (val1b != sdata['value'] && String(val1b) != sdata['value']) fl++
                        break
                    case 'between':
                        if (['int', 'float', 'money', 'currency', 'percent'].indexOf(search.type) != -1) {
                            if (parseFloat(obj.parseField(rec, search.field)) >= parseFloat(val2) && parseFloat(obj.parseField(rec, search.field)) <= parseFloat(val3)) fl++
                        }
                        else if (search.type == 'date') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true)
                            val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true)
                            val3 = w2utils.isDate(val3, w2utils.settings.dateFormat, true)
                            if (val3 instanceof Date) val3 = new Date((val3 as Date).getTime() + 86400000) // 1 day
                            if (val1 >= val2 && val1 < val3) fl++
                        }
                        else if (search.type == 'time') {
                            val1 = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val2 = w2utils.isTime(val2, true)
                            val3 = w2utils.isTime(val3, true)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const t2 = val2 as any // any: isTime(,true) returns W2TimeResult but union type is bool|W2TimeResult
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const t3 = val3 as any // any: isTime(,true) returns W2TimeResult but union type is bool|W2TimeResult
                            val2 = (new Date()).setHours(t2.hours, t2.minutes, t2.seconds ? t2.seconds : 0, 0)
                            val3 = (new Date()).setHours(t3.hours, t3.minutes, t3.seconds ? t3.seconds : 0, 0)
                            if (val1 >= val2 && val1 < val3) fl++
                        }
                        else if (search.type == 'datetime') {
                            val1 = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val2 = w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true)
                            val3 = w2utils.isDateTime(val3, w2utils.settings.datetimeFormat, true)
                            if (val3 instanceof Date) val3 = new Date((val3 as Date).getTime() + 86400000) // 1 day
                            if (val1 >= val2 && val1 < val3) fl++
                        }
                        break
                    case '<=':
                        orEqual = true
                    case '<':
                    case 'less':
                        if (['int', 'float', 'money', 'currency', 'percent'].indexOf(search.type) != -1) {
                            val1 = parseFloat(obj.parseField(rec, search.field))
                            val2 = parseFloat(sdata['value'])
                            if (val1 < val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'date') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true)
                            val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true)
                            if (val1 < val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'time') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatTime(tmp, 'hh24:mi')
                            val2 = w2utils.formatTime(val2, 'hh24:mi')
                            if (val1 < val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'datetime') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                            val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
                            if (val1.length == val2.length && (val1 < val2 || (orEqual && val1 === val2))) fl++
                        }
                        break
                    case '>=':
                        orEqual = true
                    case '>':
                    case 'more':
                        if (['int', 'float', 'money', 'currency', 'percent'].indexOf(search.type) != -1) {
                            val1 = parseFloat(obj.parseField(rec, search.field))
                            val2 = parseFloat(sdata['value'])
                            if (val1 > val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'date') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true)
                            val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true)
                            if (val1 > val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'time') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatTime(tmp, 'hh24:mi')
                            val2 = w2utils.formatTime(val2, 'hh24:mi')
                            if (val1 > val2 || (orEqual && val1 === val2)) fl++
                        }
                        else if (search.type == 'datetime') {
                            tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                            val1 = w2utils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                            val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
                            if (val1.length == val2.length && (val1 > val2 || (orEqual && val1 === val2))) fl++
                        }
                        break
                    case 'in':
                        tmp = sdata['value']
                        if (sdata['svalue']) tmp = sdata['svalue']
                        if ((tmp.indexOf(w2utils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1) || (tmp.indexOf(val1) !== -1 && val1 !== '')) fl++
                        break
                    case 'not in':
                        tmp = sdata['value']
                        if (sdata['svalue']) tmp = sdata['svalue']
                        if (!((tmp.indexOf(w2utils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1) || (tmp.indexOf(val1) !== -1 && val1 !== ''))) fl++
                        break
                    case 'begins':
                    case 'begins with': // need for back compatibility
                        if (val1.indexOf(val2) === 0) fl++ // do not hide record
                        break
                    case 'contains':
                        if (val1.indexOf(val2) >= 0) fl++ // do not hide record
                        break
                    case 'null':
                        if (obj.parseField(rec, search.field) == null) fl++ // do not hide record
                        break
                    case 'not null':
                        if (obj.parseField(rec, search.field) != null) fl++ // do not hide record
                        break
                    case 'ends':
                    case 'ends with': // need for back compatibility
                        const lastIndex = val1.lastIndexOf(val2)
                        if (lastIndex !== -1 && lastIndex == val1.length - val2.length) fl++ // do not hide record
                        break
                }
            }
            if ((obj.last.logic == 'OR' && fl !== 0) || (obj.last.logic == 'AND' && fl == obj.searchData.length)) {
                return true
            }
            if (rec.w2ui?.children && rec.w2ui?.expanded !== true) {
                // there are closed children, search them too.
                for (let r = 0; r < rec.w2ui.children.length; r++) {
                    const subRec = rec.w2ui.children[r]!
                    if (searchRecord(subRec)) {
                        return true
                    }
                }
            }
            return false
        }

        // add parents nodes recursively
        function addParent(recid: string | number | null): void {
            if (recid == null) return
            const i = obj.get(recid, true)
            if (i == null || duplicateMap[recid] || obj.last.searchIds.includes(i)) {
                return
            }
            duplicateMap[recid] = true
            const rec = obj.records[i]!
            if (rec?.w2ui) {
                addParent(rec.w2ui.parent_recid ?? null)
            }
            obj.last.searchIds.push(i)
        }
    }

    // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRangeData(range: [{ recid: string | number; column: number }, { recid: string | number; column: number }], extra?: boolean): any[] {
        const rec1 = this.get(range[0]!.recid, true) ?? 0
        const rec2 = this.get(range[1]!.recid, true) ?? 0
        const col1 = range[0]!.column
        const col2 = range[1]!.column

        const res = []
        if (col1 == col2) { // one column
            for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
                const record = this.records[r]!
                const dt     = record[this.columns[col1]!.field] || null
                if (extra !== true) {
                    res.push(dt)
                } else {
                    res.push({ data: dt, column: col1, index: r, record: record })
                }
            }
        } else if (rec1 == rec2) { // one row
            const record = this.records[rec1]!
            for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
                const dt = record[this.columns[i]!.field] || null
                if (extra !== true) {
                    res.push(dt)
                } else {
                    res.push({ data: dt, column: i, index: rec1, record: record })
                }
            }
        } else {
            for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
                const record = this.records[r]!
                // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rowData: any[] = []
                res.push(rowData)
                for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
                    const dt = record[this.columns[i]!.field]
                    if (extra !== true) {
                        rowData.push(dt)
                    } else {
                        rowData.push({ data: dt, column: i, index: r, record: record })
                    }
                }
            }
        }
        return res
    }

    // any: addRange accepts string 'selection' shorthand, single range object, or array of ranges
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRange(rangesInput: W2GridRange | W2GridRange[] | string | Record<string, any>): number {
        let added = 0, first, last
        if (this.selectType == 'row') return added
        // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ranges: any[] = !Array.isArray(rangesInput) ? [rangesInput] : rangesInput as any[]
        // if it is selection
        for (let i = 0; i < ranges.length; i++) {
            if (typeof ranges[i] != 'object') ranges[i] = { name: 'selection' }
            if (ranges[i].name == 'selection') {
                if (this.show.selectionBorder === false) continue
                const sel = this.getSelection()
                if (sel.length === 0) {
                    this.removeRange('selection')
                    continue
                } else {
                    first = sel[0]
                    last  = sel[sel.length-1]
                }
            } else { // other range
                first = ranges[i].range[0]
                last  = ranges[i].range[1]
            }
            if (first) {
                const rg = {
                    name: ranges[i].name,
                    range: [{ recid: first.recid, column: first.column }, { recid: last.recid, column: last.column }],
                    style: ranges[i].style || '',
                    class: ranges[i].class
                }
                // add range
                let ind: number | false = false
                for (let j = 0; j < this.ranges.length; j++) if (this.ranges[j]!.name == ranges[i]!.name) { ind = j; break }
                if (ind !== false) {
                    this.ranges[ind] = rg
                } else {
                    this.ranges.push(rg)
                }
                added++
            }
        }
        this.refreshRanges()
        return added
    }

    removeRange(...names: string[]) {
        let removed = 0
        for (let a = 0; a < names.length; a++) {
            const name = names[a]
            query(this.box).find('#grid_'+ this.name +'_'+ name).remove()
            query(this.box).find('#grid_'+ this.name +'_f'+ name).remove()
            for (let r = this.ranges.length-1; r >= 0; r--) {
                if (this.ranges[r]!.name == name) {
                    this.ranges.splice(r, 1)
                    removed++
                }
            }
        }
        return removed
    }

    refreshRanges() {
        if (this.ranges.length === 0) return
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        let range
        const time = Date.now()
        const rec1 = query(this.box).find(`#grid_${this.name}_frecords`)
        const rec2 = query(this.box).find(`#grid_${this.name}_records`)
        for (let i = 0; i < this.ranges.length; i++) {
            const rg    = this.ranges[i]!
            let first = rg.range[0]!
            let last  = rg.range[1]!
            if (first.index == null) {
                const fi = this.get(first.recid, true)
                if (fi != null) first.index = fi
            }
            if (last.index == null) {
                const li = this.get(last.recid, true)
                if (li != null) last.index = li
            }
            if (first.index!= null && last.index!=null && first.index > last.index) {
                const tmp = first
                first = last
                last = tmp
            }
            let td1  = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(first.recid) + ' td[col="'+ first.column +'"]')
            let td2  = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(last.recid) + ' td[col="'+ last.column +'"]')
            let td1f = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(first.recid) + ' td[col="'+ first.column +'"]')
            let td2f = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(last.recid) + ' td[col="'+ last.column +'"]')
            let _lastColumn: number | string = last.column // any: sentinel 'end'/'start' used for virtual scroll boundary cols
            // adjustment due to column virtual scroll
            if (first.column < this.last.vscroll.colIndStart && last.column > this.last.vscroll.colIndStart) {
                td1 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(first.recid) + ' td[col="start"]')
            }
            if (first.column < this.last.vscroll.colIndEnd && last.column > this.last.vscroll.colIndEnd) {
                td2 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(last.recid) + ' td[col="end"]')
                _lastColumn = 'end'
                //_lastColumn = '"end"' // cause error
            }
            // if virtual scrolling kicked in
            const index_top     = parseInt(query(this.box).find('#grid_'+ this.name +'_rec_top').next().attr('index'))
            const index_bottom  = parseInt(query(this.box).find('#grid_'+ this.name +'_rec_bottom').prev().attr('index'))
            const index_ftop    = parseInt(query(this.box).find('#grid_'+ this.name +'_frec_top').next().attr('index'))
            const index_fbottom = parseInt(query(this.box).find('#grid_'+ this.name +'_frec_bottom').prev().attr('index'))
            if (td1.length === 0 && first.index! < index_top && last.index! > index_top) {
                td1 = query(this.box).find('#grid_'+ this.name +'_rec_top').next().find('td[col="'+ first.column +'"]')
            }
            if (td2.length === 0 && last.index! > index_bottom && first.index! < index_bottom) {
                td2 = query(this.box).find('#grid_'+ this.name +'_rec_bottom').prev().find('td[col="'+ _lastColumn +'"]')
            }
            if (td1f.length === 0 && first.index! < index_ftop && last.index! > index_ftop) { // frozen
                td1f = query(this.box).find('#grid_'+ this.name +'_frec_top').next().find('td[col="'+ first.column +'"]')
            }
            if (td2f.length === 0 && last.index! > index_fbottom && first.index! < index_fbottom) { // frozen
                td2f = query(this.box).find('#grid_'+ this.name +'_frec_bottom').prev().find('td[col="'+ last.column +'"]')
            }

            // do not show selection cell if it is editable
            const edit = query(this.box).find('#grid_'+ this.name + '_editable')
            const tmp  = edit.find('.w2ui-input')
            const tmp_ind = tmp.attr('index')
            const tmp1 = this.records[tmp_ind]?.recid
            const tmp2 = tmp.attr('column')
            if (rg.name == 'selection' && rg.range[0]!.recid == tmp1 && rg.range[0]!.column == tmp2) continue

            // frozen regular columns range
            range = query(this.box).find('#grid_'+ this.name +'_f'+ rg.name)
            if (td1f.length > 0 || td2f.length > 0) {
                if (range.length === 0) {
                    rec1.append('<div id="grid_'+ this.name +'_f' + rg.name +'" class="w2ui-selection" style="'+ rg.style +'">'+
                                    (rg.name == 'selection' && this.show.selectionResizer ? '<div id="grid_'+ this.name +'_resizer" class="w2ui-selection-resizer"></div>' : '')+
                                '</div>')
                    range = query(this.box).find('#grid_'+ this.name +'_f'+ rg.name)
                } else {
                    range.attr('style', rg.style)
                    range.find('.w2ui-selection-resizer').show()
                }
                if (td2f.length === 0) {
                    td2f = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(last.recid) +' td:last-child')
                    if (td2f.length === 0) td2f = query(this.box).find('#grid_'+ this.name +'_frec_bottom td:first-child')
                    range.css('border-right', '0px')
                    range.find('.w2ui-selection-resizer').hide()
                }
                if (first.recid != null && last.recid != null && td1f.length > 0 && td2f.length > 0) {
                    const style = getComputedStyle(td2f[0])
                    const top1  = (td1f.prop('offsetTop') - td1f.prop('scrollTop'))
                    const left1 = (td1f.prop('offsetLeft') + td1f.prop('scrollLeft'))
                    const top2  = (td2f.prop('offsetTop') - td2f.prop('scrollTop'))
                    const left2 = (td2f.prop('offsetLeft') + td2f.prop('scrollLeft'))
                    range.show().css({
                        top     : (top1 > 0 ? top1 : 0) + 'px',
                        left    : (left1 > 0 ? left1 : 0) + 'px',
                        width   : (left2 - left1 + parseFloat(style.width) - 1) + 'px',
                        height  : (top2 - top1 + parseFloat(style.height) - 1) + 'px'
                    })
                } else {
                    range.hide()
                }
            } else {
                range.hide()
            }
            // regular columns range
            range = query(this.box).find('#grid_'+ this.name +'_'+ rg.name)
            if (td1.length > 0 || td2.length > 0) {
                if (range.length === 0) {
                    rec2.append(`
                        <div id="grid_${this.name}_${rg.name}" class="w2ui-selection ${rg.class ?? ''}" style="${rg.style}">
                            ${rg.name == 'selection' && this.show.selectionResizer
                                ? `<div id="grid_${this.name}_resizer" class="w2ui-selection-resizer"></div>`
                                : ''
                            }
                        </div>
                    `)
                    range = query(this.box).find('#grid_'+ this.name +'_'+ rg.name)
                } else {
                    range.attr('style', rg.style)
                }
                if (td1.length === 0) {
                    td1 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(first.recid) +' td:first-child')
                    if (td1.length === 0) td1 = query(this.box).find('#grid_'+ this.name +'_rec_top td:first-child')
                }
                if (td2f.length !== 0) {
                    range.css('border-left', '0px')
                }
                if (first.recid != null && last.recid != null && td1.length > 0 && td2.length > 0) {
                    const style = getComputedStyle(td2[0])
                    const top1  = (td1.prop('offsetTop') - td1.prop('scrollTop'))
                    const left1 = (td1.prop('offsetLeft') + td1.prop('scrollLeft'))
                    const top2  = (td2.prop('offsetTop') - td2.prop('scrollTop'))
                    const left2 = (td2.prop('offsetLeft') + td2.prop('scrollLeft'))
                    range.show().css({
                        top     : (top1 > 0 ? top1 : 0) + 'px',
                        left    : (left1 > 0 ? left1 : 0) + 'px',
                        width   : (left2 - left1 + parseFloat(style.width) - 1) + 'px',
                        height  : (top2 - top1 + parseFloat(style.height) - 1) + 'px'
                    })
                } else {
                    range.hide()
                }
            } else {
                range.hide()
            }
        }

        // add resizer events
        query(this.box).find('.w2ui-selection-resizer')
            .off('.resizer')
            .on('mousedown.resizer', mouseStart)
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('dblclick.resizer', (event: any) => {
                const edata = this.trigger('resizerDblClick', { target: this.name, originalEvent: event })
                if (edata.isCancelled === true) return
                edata.finish()
            })
        // this variables are needed for selection expantion
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any
        // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detail: any = { target: this.name, originalRange: null, newRange: null }
        const letters = 'abcdefghijklmnopqrstuvwxyz'

        return Date.now() - time

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseStart(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            const sel = self.getSelection()
            const first = sel[0]
            const last = sel[sel.length-1]
            self.last.move = {
                type   : 'expand',
                x      : event.screenX,
                y      : event.screenY,
                divX   : 0,
                divY   : 0,
                index  : first.index,
                recid  : first.recid,
                column : first.column,
                name   : letters[first.column] + (first.index + 1) + ':' + letters[last.column] + (last.index + 1),
                originalRange : [w2utils.clone(first), w2utils.clone(last) ],
                newRange      : [w2utils.clone(first), w2utils.clone(last) ]
            }
            detail.originalName  = self.last.move.name
            detail.originalRange = self.last.move.originalRange
            query('body')
                .off('.w2ui-' + self.name)
                .on('mousemove.w2ui-' + self.name, mouseMove)
                .on('mouseup.w2ui-' + self.name, mouseStop)
            // do not blur grid
            event.preventDefault()
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseMove(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            const mv = self.last.move
            if (!mv || mv.type != 'expand') return
            mv.divX = (event.screenX - mv.x)
            mv.divY = (event.screenY - mv.y)
            // find new cell
            let column: number | undefined
            let tmp = event.target
            if (tmp.tagName.toUpperCase() != 'TD') tmp = query(tmp).closest('td')[0]
            if (query(tmp).attr('col') != null) column = parseInt(query(tmp).attr('col'))
            if (column == null) {
                return
            }
            tmp = query(tmp).closest('tr')[0]
            const index = parseInt(query(tmp).attr('index'))
            const recid = self.records[index]?.recid
            // new range
            if (mv.newRange[1].recid == recid && mv.newRange[1].column == column) {
                // if range did not change
                return
            }
            const prevNewRange = w2utils.clone(mv.newRange)
            mv.newRange = [{ recid: mv.recid, index: mv.index, column: mv.column }, { recid, index, column }]
            // remember update ranges
            detail.newName = letters[mv.column] + (mv.index + 1) + ':' + letters[column] + (index + 1)
            detail.newRange = w2utils.clone(mv.newRange)
            // event before
            edata = self.trigger('selectionExtend', detail)
            if (edata.isCancelled === true) {
                mv.newRange = prevNewRange
                detail.newRange = prevNewRange
                return
            } else {
                // default behavior
                self.addRange({
                    name: 'selection-expand',
                    range: mv.newRange,
                    class: 'w2ui-selection-expand'
                })
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function mouseStop(_event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
            // default behavior
            self.removeRange('selection-expand')
            query('body').off('.w2ui-' + self.name)
            // event after
            if (self.last.move?.type == 'expand' && edata.finish) {
                edata.finish()
            }
            delete self.last.move
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(...selectArgs: any[]) { // any: recid (string|number) or {recid, column} cell descriptor
        if (selectArgs.length === 0) return 0
        let selected = 0
        const sel = this.last.selection
        if (!this.multiSelect) this.selectNone(true)
        // if too many arguments > 150k, then it errors off
        let args = selectArgs.slice()
        if (Array.isArray(args[0])) args = args[0]
        // filter unselectable records
        args = args.filter(aa => {
            const recid = aa?.recid ?? aa
            const index = aa?.index ?? this.get(recid, true)
            const rec = this.records[index]!
            if (rec?.w2ui?.selectable === false) {
                return false
            }
            if (typeof aa === 'object') {
                aa.index ??= index
            }
            return true
        })

        // event before
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tmp: any = { target: this.name } // any: dynamic event payload built incrementally
        if (args.length == 1) {
            tmp.multiple = false
            if (w2utils.isPlainObject(args[0])) {
                tmp.clicked = {
                    recid: args[0].recid,
                    column: args[0].column
                }
            } else {
                tmp.recid = args[0]
            }
        } else {
            tmp.multiple = true
            tmp.clicked = { recids:  args }
        }
        if (this.compareSelection(args).select.length == 0) {
            // if all needed records are already selected
            return
        }
        const edata = this.trigger('select', tmp)
        if (edata.isCancelled === true) return 0

        // default action
        if (this.selectType == 'row') {
            for (let a = 0; a < args.length; a++) {
                const recid = typeof args[a] == 'object' ? args[a].recid : args[a]
                const index = this.get(recid, true)
                if (index == null) continue
                let recEl1 = null
                let recEl2 = null
                if (this.searchData.length !== 0 || (index + 1 >= (this.last.vscroll.recIndStart ?? 0) && index + 1 <= (this.last.vscroll.recIndEnd ?? 0))) {
                    recEl1 = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid))
                    recEl2 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(recid))
                }
                if (this.selectType == 'row') {
                    if (sel.indexes.indexOf(index) != -1) continue
                    sel.indexes.push(index)
                    if (recEl1 && recEl2) {
                        recEl1.addClass('w2ui-selected').find('.w2ui-col-number').addClass('w2ui-row-selected')
                        recEl2.addClass('w2ui-selected').find('.w2ui-col-number').addClass('w2ui-row-selected')
                        recEl1.find('.w2ui-grid-select-check').prop('checked', true)
                    }
                    selected++
                }
            }
        } else {
            // normalize for performance
            // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const new_sel: Record<string, any[]> = {}
            for (let a = 0; a < args.length; a++) {
                const recid      = typeof args[a] == 'object' ? args[a].recid : args[a]
                const column     = typeof args[a] == 'object' ? args[a].column : null
                new_sel[recid] = new_sel[recid] || []
                if (Array.isArray(column)) {
                    new_sel[recid] = column
                } else if (w2utils.isInt(column)) {
                    new_sel[recid].push(column)
                } else {
                    for (let i = 0; i < this.columns.length; i++) { if (this.columns[i]!.hidden) continue; new_sel[recid]!.push(i) }
                }
            }
            // add all
            const col_sel = []
            for (const recid in new_sel) {
                const index = this.get(recid, true)
                if (index == null) continue
                let recEl1 = null
                let recEl2 = null
                if (index + 1 >= (this.last.vscroll.recIndStart ?? 0) && index + 1 <= (this.last.vscroll.recIndEnd ?? 0)) {
                    recEl1 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(recid))
                    recEl2 = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid))
                }
                const s = sel.columns[index] || []
                // default action
                if (sel.indexes.indexOf(index) == -1) {
                    sel.indexes.push(index)
                }
                const new_sel_recid = new_sel[recid]!
                // only only those that are new
                for (let t = 0; t < new_sel_recid.length; t++) {
                    if (s.indexOf(new_sel_recid[t]) == -1) s.push(new_sel_recid[t])
                }
                s.sort((a, b) => { return a-b }) // sort function must be for numerical sort
                for (let t = 0; t < new_sel_recid.length; t++) {
                    const col = new_sel_recid[t]
                    if (col_sel.indexOf(col) == -1) col_sel.push(col)
                    if (recEl1) {
                        recEl1.find('#grid_'+ this.name +'_data_'+ index +'_'+ col).addClass('w2ui-selected')
                        recEl1.find('.w2ui-col-number').addClass('w2ui-row-selected')
                        recEl1.find('.w2ui-grid-select-check').prop('checked', true)
                    }
                    if (recEl2) {
                        recEl2.find('#grid_'+ this.name +'_data_'+ index +'_'+ col).addClass('w2ui-selected')
                        recEl2.find('.w2ui-col-number').addClass('w2ui-row-selected')
                        recEl2.find('.w2ui-grid-select-check').prop('checked', true)
                    }
                    selected++
                }
                // save back to selection object
                sel.columns[index] = s
            }
            // select columns (need here for speed)
            for (let c = 0; c < col_sel.length; c++) {
                query(this.box).find('#grid_'+ this.name +'_column_'+ col_sel[c] +' .w2ui-col-header').addClass('w2ui-col-selected')
            }
        }
        // need to sort new selection for speed
        sel.indexes.sort((a, b) => { return a-b })
        // all selected?
        const areAllSelected = (this.records.length > 0 && sel.indexes.length == this.records.length),
            areAllSearchedSelected = (sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length)
        if (areAllSelected || areAllSearchedSelected) {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', true)
        } else {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', false)
        }
        this.status()
        this.addRange('selection')
        this.updateToolbar(sel, areAllSelected)
        // event after
        edata.finish()
        return selected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unselect(...unselectArgs: any[]): number { // any: recid (string|number) or {recid, column} cell descriptor
        let unselected = 0
        const sel = this.last.selection
        // if too many arguments > 150k, then it errors off
        let args = unselectArgs.slice()
        if (Array.isArray(args[0])) args = args[0]
        // event before
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tmp: any = { target: this.name } // any: dynamic event payload built incrementally
        if (args.length == 1) {
            tmp.multiple = false
            if (w2utils.isPlainObject(args[0])) {
                tmp.clicked = {
                    recid: args[0].recid,
                    column: args[0].column
                }
            } else {
                tmp.clicked = { recid: args[0] }
            }
        } else {
            tmp.multiple = true
            tmp.recids   = args
        }
        if (this.compareSelection(args).unselect.length == 0) {
            // if all needed records are already unselected
            return 0
        }
        const edata = this.trigger('select', tmp)
        if (edata.isCancelled === true) return 0

        for (let a = 0; a < args.length; a++) {
            const recid  = typeof args[a] == 'object' ? args[a].recid : args[a]
            const record = this.get(recid)
            if (record == null) continue
            const index  = this.get(record.recid, true) ?? -1
            const recEl1 = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid))
            const recEl2 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(recid))
            if (this.selectType == 'row') {
                if (sel.indexes.indexOf(index) == -1) continue
                // default action
                sel.indexes.splice(sel.indexes.indexOf(index), 1)
                recEl1.removeClass('w2ui-selected w2ui-inactive').find('.w2ui-col-number').removeClass('w2ui-row-selected')
                recEl2.removeClass('w2ui-selected w2ui-inactive').find('.w2ui-col-number').removeClass('w2ui-row-selected')
                if (recEl1.length != 0) {
                    recEl1[0].style.cssText = 'height: '+ this.recordHeight +'px; ' + recEl1.attr('custom_style')
                    recEl2[0].style.cssText = 'height: '+ this.recordHeight +'px; ' + recEl2.attr('custom_style')
                }
                recEl1.find('.w2ui-grid-select-check').prop('checked', false)
                unselected++
            } else {
                const col = args[a].column
                if (!w2utils.isInt(col)) { // unselect all columns
                    const cols = []
                    for (let i = 0; i < this.columns.length; i++) { if (this.columns[i]!.hidden) continue; cols.push({ recid: recid, column: i }) }
                    return this.unselect(cols)
                }
                const s = sel.columns[index]
                if (!Array.isArray(s) || s.indexOf(col) == -1) continue
                // default action
                s.splice(s.indexOf(col), 1)
                query(this.box).find(`#grid_${this.name}_rec_${w2utils.escapeId(recid)} > td[col="${col}"]`).removeClass('w2ui-selected w2ui-inactive')
                query(this.box).find(`#grid_${this.name}_frec_${w2utils.escapeId(recid)} > td[col="${col}"]`).removeClass('w2ui-selected w2ui-inactive')
                // check if any row/column still selected
                let isColSelected = false
                let isRowSelected = false
                const tmp           = this.getSelection()
                for (let i = 0; i < tmp.length; i++) {
                    if (tmp[i].column == col) isColSelected = true
                    if (tmp[i].recid == recid) isRowSelected = true
                }
                if (!isColSelected) {
                    query(this.box).find(`.w2ui-grid-columns td[col="${col}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${col}"] .w2ui-col-header`).removeClass('w2ui-col-selected')
                }
                if (!isRowSelected) {
                    query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid)).find('.w2ui-col-number').removeClass('w2ui-row-selected')
                }
                unselected++
                if (s.length === 0) {
                    delete sel.columns[index]
                    sel.indexes.splice(sel.indexes.indexOf(index), 1)
                    recEl1.find('.w2ui-grid-select-check').prop('checked', false)
                }
            }
        }
        // all selected?
        const areAllSelected = (this.records.length > 0 && sel.indexes.length == this.records.length),
            areAllSearchedSelected = (sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length)
        if (areAllSelected || areAllSearchedSelected) {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', true)
        } else {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', false)
        }
        // show number of selected
        this.status()
        this.addRange('selection')
        this.updateToolbar(sel, areAllSelected)
        // event after
        edata.finish()
        return unselected
    }

    // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compareSelection(newSel: any[]): { select: any[]; unselect: any[] } {
        const sel = this.getSelection()
        const select = []
        const unselect = []
        if (this.selectType == 'row') {
            // normalize
            newSel.forEach((sel, ind) => {
                if (typeof sel == 'object') newSel[ind] = sel.recid
            })
            // add items
            for (let i = 0; i < newSel.length; i++) {
                if (!sel.includes(newSel[i])) {
                    select.push(newSel[i])
                }
            }
            // remove items
            for (let i = 0; i < newSel.length; i++) {
                if (sel.includes(newSel[i])) {
                    unselect.push(newSel[i])
                }
            }
        } else {
            // add more items
            for (let ns = 0; ns < newSel.length; ns++) {
                let flag = false
                for (let s = 0; s < sel.length; s++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true
                if (!flag) select.push({ recid: newSel[ns].recid, column: newSel[ns].column })
            }
            // remove items
            for (let s = 0; s < sel.length; s++) {
                let flag = false
                for (let ns = 0; ns < newSel.length; ns++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true
                if (!flag) unselect.push({ recid: sel[s].recid, column: sel[s].column })
            }
        }
        return { select, unselect }
    }

    selectAll() {
        const time = Date.now()
        if (this.multiSelect === false) return
        // default action
        const url = this.url?.get ?? this.url
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sel: any = w2utils.clone(this.last.selection) // any: w2utils.clone returns unknown; selection shape is W2GridLast['selection']
        const cols = []
        for (let i = 0; i < this.columns.length; i++) cols.push(i)
        // if local data source and searched
        sel.indexes = []
        if (!url && this.searchData.length !== 0) {
            // local search applied
            for (let i = 0; i < this.last.searchIds.length; i++) {
                sel.indexes.push(this.last.searchIds[i]!)
                if (this.selectType != 'row') sel.columns[this.last.searchIds[i]!] = cols.slice() // .slice makes copy of the array
            }
        } else {
            let buffered = this.records.length
            if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length
            for (let i = 0; i < buffered; i++) {
                sel.indexes.push(i)
                if (this.selectType != 'row') sel.columns[i] = cols.slice() // .slice makes copy of the array
            }
        }
        // event before
        const edata = this.trigger('select', { target: this.name, multiple: true, all: true, clicked: sel })
        if (edata.isCancelled === true) return

        this.last.selection = sel
        // add selected class
        if (this.selectType == 'row') {
            query(this.box).find('.w2ui-grid-records tr:not(.w2ui-empty-record)')
                .addClass('w2ui-selected').find('.w2ui-col-number').addClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-frecords tr:not(.w2ui-empty-record)')
                .addClass('w2ui-selected').find('.w2ui-col-number').addClass('w2ui-row-selected')
            query(this.box).find('input.w2ui-grid-select-check').prop('checked', true)
        } else {
            query(this.box).find('.w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header').addClass('w2ui-col-selected')
            query(this.box).find('.w2ui-grid-records tr .w2ui-col-number').addClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-records tr:not(.w2ui-empty-record)')
                .find('.w2ui-grid-data:not(.w2ui-col-select)').addClass('w2ui-selected')
            query(this.box).find('.w2ui-grid-frecords tr .w2ui-col-number').addClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-frecords tr:not(.w2ui-empty-record)')
                .find('.w2ui-grid-data:not(.w2ui-col-select)').addClass('w2ui-selected')
            query(this.box).find('input.w2ui-grid-select-check').prop('checked', true)
        }
        // enable/disable toolbar buttons
        sel = this.getSelection(true)
        this.addRange('selection')
        query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', true)
        this.status()
        this.updateToolbar({ indexes: sel }, true)
        // event after
        edata.finish()
        return Date.now() - time
    }

    selectNone(skipEvent?: boolean) {
        const time = Date.now()
        // event before
        let edata
        if (!skipEvent) {
            edata = this.trigger('select', { target: this.name, clicked: [] })
            if (edata.isCancelled === true) return
        }
        // default action
        const sel = this.last.selection
        // remove selected class
        if (this.selectType == 'row') {
            query(this.box).find('.w2ui-grid-records tr.w2ui-selected').removeClass('w2ui-selected w2ui-inactive')
                .find('.w2ui-col-number').removeClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-frecords tr.w2ui-selected').removeClass('w2ui-selected w2ui-inactive')
                .find('.w2ui-col-number').removeClass('w2ui-row-selected')
            query(this.box).find('input.w2ui-grid-select-check').prop('checked', false)
        } else {
            query(this.box).find('.w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header').removeClass('w2ui-col-selected')
            query(this.box).find('.w2ui-grid-records tr .w2ui-col-number').removeClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-frecords tr .w2ui-col-number').removeClass('w2ui-row-selected')
            query(this.box).find('.w2ui-grid-data.w2ui-selected').removeClass('w2ui-selected w2ui-inactive')
            query(this.box).find('input.w2ui-grid-select-check').prop('checked', false)
        }
        sel.indexes = []
        sel.columns = {}
        this.removeRange('selection')
        query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', false)
        this.status()
        this.updateToolbar(sel, false)
        // event after
        if (!skipEvent) {
            edata!.finish()
        }
        return Date.now() - time
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateToolbar(sel?: any, _areAllSelected?: boolean) { // any: sel is selection object from last.selection
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        const cnt = sel && sel.indexes ? sel.indexes.length : 0
        // if there is no toolbar
        if (!this.toolbar.render) {
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.toolbar.items.forEach((item: any) => { // any: toolbar item shape varies
            _checkItem(item, '')
            if (Array.isArray(item.items)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item.items.forEach((it: any) => { // any: toolbar item shape varies
                    _checkItem(it, item.id + ':')
                })
            }
        })
        // enable/disable toolbar search button
        if (this.show.toolbarSave) {
            if (this.getChanges().length > 0) {
                this.toolbar.enable('w2ui-save')
            } else {
                this.toolbar.disable('w2ui-save')
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _checkItem(item: any, prefix: any) { // any: toolbar item and prefix vary
            if (item.batch != null) {
                let enabled = false
                if (item.batch === true) {
                    if (cnt > 0) enabled = true
                } else if (typeof item.batch == 'number') {
                    if (cnt === item.batch) enabled = true
                } else if (typeof item.batch == 'function') {
                    enabled = item.batch({ cnt, sel })
                }
                if (enabled) {
                    obj.toolbar.enable(prefix + item.id)
                } else {
                    obj.toolbar.disable(prefix + item.id)
                }
            }
        }
    }

    // any: row-select returns (string|number)[], cell-select returns W2GridCellSelection[] — runtime branching
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSelection(returnIndex?: boolean): any[] {
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ret: any[] = []
        const sel = this.last.selection
        if (this.selectType == 'row') {
            for (let i = 0; i < sel.indexes.length; i++) {
                const idx = sel.indexes[i]!
                if (!this.records[idx]) continue
                if (returnIndex === true) ret.push(idx); else ret.push(this.records[idx]!.recid)
            }
            return ret
        } else {
            for (let i = 0; i < sel.indexes.length; i++) {
                const idx = sel.indexes[i]!
                const cols = sel.columns[idx] ?? []
                if (!this.records[idx]) continue
                for (let j = 0; j < cols.length; j++) {
                    ret.push({ recid: this.records[idx]!.recid, index: idx, column: cols[j]! })
                }
            }
            return ret
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search(field?: any, value?: any) { // any: field can be string or searchData array; value varies
        const url = this.url?.get ?? this.url
        const searchData = []
        let last_multi = this.last.multi
        let last_logic = this.last.logic
        let last_field = this.last.field
        let last_search = this.last.search
        let hasHiddenSearches = false
        const overlay = query(`#w2overlay-${this.name}-search-overlay`)
        // if emty sting, same as no search
        if (value === '') value = null
        // add hidden searches
        for (let i = 0; i < this.searches.length; i++) {
            const srch_i = this.searches[i]!
            if (!srch_i.hidden || srch_i.value == null) continue
            searchData.push({
                field    : srch_i.field,
                operator : srch_i.operator || 'is',
                type     : srch_i.type,
                value    : srch_i.value || ''
            })
            hasHiddenSearches = true
        }
        if (field === undefined && overlay.length === 0) {
            if (this.multiSearch) {
                field = this.searchData
                value = this.last.logic
            } else {
                field = this.last.field
                value = this.last.search
            }
        }
        // 1: search() - advanced search (reads from popup)
        if (field === undefined && overlay.length !== 0) {
            this.focus() // otherwise search drop down covers searches
            last_logic = overlay.find(`#grid_${this.name}_logic`).val()
            last_search = ''
            // advanced search
            for (let i = 0; i < this.searches.length; i++) {
                const search   = this.searches[i]!
                const operator = overlay.find('#grid_'+ this.name + '_operator_'+ i).val()
                const field1   = overlay.find('#grid_'+ this.name + '_field_'+ i)
                const field2   = overlay.find('#grid_'+ this.name + '_field2_'+ i)
                let value1   = field1.val()
                let value2   = field2.val()
                let svalue   = null
                let text     = null

                if (['int', 'float', 'money', 'currency', 'percent'].indexOf(search.type) != -1) {
                    const fld1 = field1[0]._w2field
                    const fld2 = field2[0]._w2field
                    if (fld1) value1 = fld1.clean(value1)
                    if (fld2) value2 = fld2.clean(value2)
                }
                if (['list', 'enum'].indexOf(search.type) != -1 || ['in', 'not in'].indexOf(operator) != -1) {
                    value1 = field1[0]._w2field.selected || {}
                    if (Array.isArray(value1)) {
                        svalue = []
                        for (let j = 0; j < value1.length; j++) {
                            svalue.push(w2utils.isFloat(value1[j].id) ? parseFloat(value1[j].id) : String(value1[j].id).toLowerCase())
                            delete value1[j].hidden
                        }
                        if (Object.keys(value1).length === 0) value1 = ''
                    } else {
                        text   = value1.text || ''
                        value1 = value1.id || ''
                    }
                }
                if ((value1 !== '' && value1 != null) || (value2 != null && value2 !== '')) {
                    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const tmp: any = {
                        field    : search.field,
                        type     : search.type,
                        operator : operator
                    }
                    if (operator == 'between') {
                        w2utils.extend(tmp, { value: [value1, value2] })
                    } else if (operator == 'in' && typeof value1 == 'string') {
                        w2utils.extend(tmp, { value: value1.split(',') })
                    } else if (operator == 'not in' && typeof value1 == 'string') {
                        w2utils.extend(tmp, { value: value1.split(',') })
                    } else {
                        w2utils.extend(tmp, { value: value1 })
                    }
                    if (svalue) w2utils.extend(tmp, { svalue: svalue })
                    if (text) w2utils.extend(tmp, { text: text })

                    // convert date to unix time
                    try {
                        if (search.type == 'date' && operator == 'between') {
                            tmp.value[0] = value1 // w2utils.isDate(value1, w2utils.settings.dateFormat, true).getTime();
                            tmp.value[1] = value2 // w2utils.isDate(value2, w2utils.settings.dateFormat, true).getTime();
                        }
                        if (search.type == 'date' && operator == 'is') {
                            tmp.value = value1 // w2utils.isDate(value1, w2utils.settings.dateFormat, true).getTime();
                        }
                    } catch (e) {

                    }
                    searchData.push(tmp)
                    last_multi = true // if only hidden searches, then do not set
                }
            }
        }
        // 2: search(field, value) - regular search
        if (typeof field == 'string') {
            // if only one argument - search all
            if (value === undefined) {
                value = field
                field = 'all'
            }
            last_field  = field
            last_search = value
            last_multi  = false
            last_logic  = (hasHiddenSearches ? 'AND' : 'OR')
            // loop through all searches and see if it applies
            if (value != null) {
                if (field.toLowerCase() == 'all') {
                    // if there are search fields loop thru them
                    if (this.searches.length > 0) {
                        for (let i = 0; i < this.searches.length; i++) {
                            const search = this.searches[i]!
                            if (search.type == 'text' || (search.type == 'alphanumeric' && w2utils.isAlphaNumeric(value))
                                    || (search.type == 'int' && w2utils.isInt(value)) || (search.type == 'float' && w2utils.isFloat(value))
                                    || (search.type == 'percent' && w2utils.isFloat(value)) || ((search.type == 'hex' || search.type == 'color') && w2utils.isHex(value))
                                    || (search.type == 'currency' && w2utils.isMoney(value)) || (search.type == 'money' && w2utils.isMoney(value))
                                    || (search.type == 'date' && w2utils.isDate(value)) || (search.type == 'time' && w2utils.isTime(value))
                                    || (search.type == 'datetime' && w2utils.isDateTime(value)) || (search.type == 'datetime' && w2utils.isDate(value))
                                    || (search.type == 'enum' && w2utils.isAlphaNumeric(value)) || (search.type == 'list' && w2utils.isAlphaNumeric(value))
                            ) {
                                const def = this.defaultOperator[this.operatorsMap[search.type]!]
                                const tmp = {
                                    field    : search.field,
                                    type     : search.type,
                                    operator : (search.operator != null ? search.operator : def),
                                    value    : value
                                }
                                if (String(value).trim() != '') searchData.push(tmp)
                            }
                            // range in global search box
                            if (['int', 'float', 'money', 'currency', 'percent'].indexOf(search.type) != -1){
                                const t = String(value).trim().split('-').map(v => v.trim()).filter(v => w2utils.isFloat(v))
                                if (t.length == 2) {
                                    const tmp = {
                                        field    : search.field,
                                        type     : search.type,
                                        operator : 'between',
                                        value    : [t[0], t[1]]
                                    }
                                    searchData.push(tmp)
                                }
                            }
                            // lists fields
                            if (['list', 'enum'].indexOf(search.type) != -1) {
                                const new_values = []
                                if (search.options == null) search.options = {}
                                if (!Array.isArray(search.options['items'])) search.options['items'] = []
                                for (let j = 0; j < search.options['items']; j++) {
                                    const tmp = search.options['items'][j]
                                    try {
                                        const re = new RegExp(value, 'i')
                                        if (re.test(tmp)) new_values.push(j)
                                        if (tmp.text && re.test(tmp.text)) new_values.push(tmp.id)
                                    } catch (e) {}
                                }
                                if (new_values.length > 0) {
                                    const tmp = {
                                        field    : search.field,
                                        type     : search.type,
                                        operator : (search.operator != null ? search.operator : 'in'),
                                        value    : new_values
                                    }
                                    searchData.push(tmp)
                                }
                            }
                        }
                    } else {
                        // no search fields, loop thru columns
                        for (let i = 0; i < this.columns.length; i++) {
                            const tmp = {
                                field    : this.columns[i]!.field,
                                type     : 'text',
                                operator : this.defaultOperator['text'],
                                value    : value
                            }
                            searchData.push(tmp)
                        }
                    }
                    /**
                     * If user searched ALL field and there was no matching searches then add a bogus field, so that no result will be
                     * shown. Otherwise search string is not empty, but no fields is actually applied and all fields are shown
                     */
                    if (searchData.length == 0) {
                        const tmp = {
                            field: 'All',
                            type: 'text',
                            operator: this.defaultOperator['text'],
                            value: value
                        }
                        searchData.push(tmp)
                    }
                } else {
                    const el = overlay.find('#grid_'+ this.name +'_search_all')
                    let search = this.getSearch(field)
                    if (search == null) search = { field: field, type: 'text' }
                    if (search.field == field) this.last.label = search.label ?? ''
                    if (value !== '') {
                        let op  = this.defaultOperator[this.operatorsMap[search.type]!]
                        let val = value
                        if (['date', 'time', 'datetime'].indexOf(search.type) != -1) op = 'is'
                        if (['list', 'enum'].indexOf(search.type) != -1) {
                            op = 'is'
                            const tmp = el._w2field?.get()
                            if (tmp && Object.keys(tmp).length > 0) val = tmp.id; else val = ''
                        }
                        if (search.type == 'int' && value !== '') {
                            op = 'is'
                            if (String(value).indexOf('-') != -1) {
                                const tmp = value.split('-')
                                if (tmp.length == 2) {
                                    op  = 'between'
                                    val = [parseInt(tmp[0]), parseInt(tmp[1])]
                                }
                            }
                            if (String(value).indexOf(',') != -1) {
                                const tmp = value.split(',')
                                op      = 'in'
                                val     = []
                                for (let i = 0; i < tmp.length; i++) val.push(tmp[i])
                            }
                        }
                        if (search.operator != null) op = search.operator
                        const tmp = {
                            field    : search.field,
                            type     : search.type,
                            operator : op,
                            value    : val
                        }
                        searchData.push(tmp)
                    }
                }
            }
        }
        // 3: search([{ field, value, [operator,] [type] }, { field, value, [operator,] [type] } ], logic) - submit whole structure
        if (Array.isArray(field)) {
            let logic: 'AND' | 'OR' = 'AND'
            if (typeof value == 'string') {
                const upperLogic = value.toUpperCase()
                if (upperLogic === 'OR' || upperLogic === 'AND') logic = upperLogic
            }
            last_search = ''
            last_multi  = true
            last_logic  = logic
            for (let i = 0; i < field.length; i++) {
                const data = field[i]
                if (typeof data.value == 'number' && data.operator == null) data.operator = this.defaultOperator['number']
                if (typeof data.value == 'string' && data.operator == null) data.operator = this.defaultOperator['text']
                if (Array.isArray(data.value) && data.operator == null) data.operator = this.defaultOperator['enum']
                if (w2utils.isDate(data.value) && data.operator == null) data.operator = this.defaultOperator['date']

                // merge current field and search if any
                searchData.push(data)
            }
        }
        // event before
        const edata = this.trigger('search', {
            target: this.name,
            multi: (field === undefined ? true : false),
            searchField: (field ? field : 'multi'),
            searchValue: (field ? value : 'multi'),
            searchData: searchData,
            searchLogic: last_logic
        })
        if (edata.isCancelled === true) return
        // default action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.searchData             = edata.detail['searchData'] as any[] // any: detail values are unknown from W2EventData
        this.last.field             = last_field
        this.last.search            = last_search
        this.last.multi             = last_multi
        this.last.logic             = edata.detail['searchLogic'] as 'AND' | 'OR'
        this.last.vscroll.scrollTop = 0
        this.last.vscroll.scrollLeft = 0
        this.last.selection.indexes = []
        this.last.selection.columns = {}
        // -- clear all search field
        this.searchClose()
        // apply search
        if (url) {
            this.last.fetch.offset = 0
            this.reload()
        } else {
            // local search
            this.localSearch()
            this.refresh()
        }
        // event after
        edata.finish()
    }

    // open advanced search popover
    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchOpen(options: any = {}) {
        if (!this.box) return
        if (this.searches.length === 0) return
        // event before
        const edata = this.trigger('searchOpen', { target: this.name })
        if (edata.isCancelled === true) {
            return
        }
        const $btn = query(this.toolbar.box).find('.w2ui-grid-search-input .w2ui-search-drop')
        $btn.addClass('checked')
        // show search
        w2tooltip.show({
            name: this.name + '-search-overlay',
            anchor: query(this.box).find('#grid_'+ this.name +'_search_all').get(0),
            position: 'bottom|top',
            html: this.getSearchesHTML(),
            align: 'left',
            arrowSize: 12,
            class: 'w2ui-grid-search-advanced',
            hideOn: ['doc-click'],
            ...(options?.overlay ?? {})
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((_event: any) => { // any: w2menu/w2tooltip event detail shape varies
            this.initSearches()
            this.last['search_opened'] = true
            const overlay = query(`#w2overlay-${this.name}-search-overlay`)
            overlay
                .data('gridName', this.name)
                .off('.grid-search')
                .on('click.grid-search', (event: Event) => {
                    // hide any tooltip opened by searches
                    overlay.find('input, select').each((el: Node) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const names: any[] = query(el).data('tooltipName') // any: tooltip name list shape varies
                        if (names) names.forEach((name: string) => {
                            w2tooltip.hide(name)
                        })
                    })
                    console.log(event.target)
                    if (!query(event.target).hasClass('w2ui-saved-searches')) {
                        w2tooltip.hide(this.name + '-search-suggest')
                    }
                })
            w2utils.bindEvents(overlay.find('select, input, button'), this)
            // init first field
            const sfields = query(`#w2overlay-${this.name}-search-overlay *[rel=search]`)
            if (sfields.length > 0) sfields[0].focus()
            // event after
            edata.finish()
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .hide((_event: any) => { // any: w2tooltip event shape varies
            const edata = this.trigger('searchClose', { target: this.name })
            if (edata.isCancelled === true) {
                return
            }
            $btn.removeClass('checked')
            this.last['search_opened'] = false
            edata.finish()
        })
    }

    searchClose() {
        w2tooltip.hide(this.name + '-search-overlay')
    }

    // if clicked on a field in the search strip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchFieldTooltip(ind: any, sd_ind: any, el: any) { // any: all params are loosely typed from DOM
        const sf = this.searches[ind]
        const sd = this.searchData[sd_ind]
        if (sd == null || sf == null) return
        let oper = sd.operator
        if (oper == 'more' && sd.type == 'date') oper = 'since'
        if (oper == 'less' && sd.type == 'date') oper = 'before'
        let options = ''
        let val = sd.value
        if (Array.isArray(sd.value)) { // && Array.isArray(sf.options.items)) {
            sd.value.forEach(opt => {
                options += `<span class="value">${opt.text || opt}</span>`
            })
            if (sd.type == 'date') {
                options = ''
                sd.value.forEach(opt => {
                    options += `<span class="value">${w2utils.formatDate(opt)}</span>`
                })
            }
        } else {
            if (sd.type == 'date') {
                val = w2utils.formatDateTime(val)
            }

        }
        w2tooltip.hide(this.name + '-search-props')
        w2tooltip.show({
            name: this.name + '-search-props',
            anchor: el,
            class: 'w2ui-white',
            hideOn: 'doc-click',
            html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${sf.label ?? ''}</span>
                    <span class="operator">${w2utils.lang(oper)}</span>
                    ${Array.isArray(sd.value)
                        ? `${options}`
                        : `<span class="value">${val}</span>`
                    }
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${w2utils.lang('Remove This Field')}</button>
                    </div>
                </div>`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).then((event: any) => { // any: w2menu/w2tooltip event detail shape varies
            query(event.detail.overlay.box).find('#remove').on('click', () => {
                this.searchData.splice(sd_ind, 1)
                this.reload()
                this.localSearch()
                w2tooltip.hide(this.name + '-search-props')
            })
        })
    }

    // drop down with save searches
    searchSuggest(imediate?: boolean, forceHide?: boolean, anchor?: HTMLElement | Element) {
        clearTimeout(this.last.kbd_timer ?? undefined)
        clearTimeout(this.last['overlay_timer'])
        this.searchShowFields(true)
        if (anchor == null) this.searchClose()
        if (forceHide === true || (anchor != null && query(`#w2overlay-${this.name}-search-suggest`).length > 0)) {
            w2tooltip.hide(this.name + '-search-suggest')
            return
        }
        if (query(`#w2overlay-${this.name}-search-suggest`).length > 0) {
            // already shown
            return
        }
        if (!imediate) {
            this.last['overlay_timer'] = setTimeout(() => { this.searchSuggest(true) }, 100)
            return
        }

        const el = anchor ?? query(this.box).find(`#grid_${this.name}_search_all`).get(0)
        const searches = [
            ...this.defaultSearches ?? [],
            ...this.defaultSearches?.length > 0 && this.savedSearches?.length > 0 ? ['--'] : [],
            ...this.savedSearches ?? []
        ]
        if (Array.isArray(searches) && searches.length > 0) {
            w2menu.show({
                name: this.name + '-search-suggest',
                anchor: el,
                align: anchor != null ? 'left' : 'both',
                items: searches,
                selected: false,
                filter: true,
                hideOn: ['doc-click', 'sleect', 'remove'],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render(item: any) { // any: w2menu item shape varies
                    let ret = item.text
                    if (item.isDefault) ret = `<b>${ret}</b>`
                    return ret
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .select((event: any) => { // any: w2menu event shape varies
                const edata = this.trigger('searchSelect', {
                    target: this.name,
                    index: event.detail.index,
                    item: event.detail.item
                })
                if (edata.isCancelled === true) {
                    event.preventDefault()
                    return
                }
                event.detail.overlay.hide()
                this.last.logic  = event.detail.item.logic || 'AND'
                this.last.search = ''
                this.last.label  = '[Multiple Fields]'
                this.searchData  = w2utils.clone(event.detail.item.data)
                this['searchSelected'] = w2utils.clone(event.detail.item, { exclude: ['icon', 'remove'] })
                this.reload()
                edata.finish()
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .remove((event: any) => { // any: w2menu event shape varies
                const item = event.detail.item
                const edata = this.trigger('searchRemove', { target: this.name, index: event.detail.index, item })
                if (edata.isCancelled === true) {
                    event.preventDefault()
                    return
                }
                queueMicrotask(() => event.detail.overlay.hide())
                w2tooltip.hide(this.name + '-search-overlay')

                // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this.confirm(w2utils.lang('Do you want to delete search "${item}"?', { item: item.text })) as any)
                    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .yes((evt: any) => {
                        // remove from searches
                        const search = this.savedSearches.findIndex((s) => s.id == item.id ? true : false)
                        if (search !== -1) {
                            this.savedSearches.splice(search, 1)
                        }
                        this.cacheSave('searches', this.savedSearches.map(s => w2utils.clone(s, { exclude: ['remove', 'icon'] })))
                        evt.detail.self.close()
                        // evt after
                        edata.finish()
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .no((evt: any) => { // any: w2confirm evt shape
                        evt.detail.self.close()
                    })
            })
        }
    }

    searchSave() {
        let value = ''
        if (this['searchSelected']) {
            value = this['searchSelected'].text
        }
        const ind = this.savedSearches.findIndex(s => { return s.id == this['searchSelected']?.id ? true : false })
        // event before
        const edata = this.trigger('searchSave', { target: this.name, saveLocalStorage: true })
        if (edata.isCancelled === true) return

        this.message({
            width: 350,
            height: 150,
            body: `<div class="w2ui-grid-save-search">
                        <span>${w2utils.lang(ind != -1 ? 'Update Search' : 'Save New Search')}</span>
                        <input class="search-name w2ui-input" placeholder="${w2utils.lang('Search name')}">
                   </div>`,
            buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${w2utils.lang('Cancel')}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(value).trim() == '' ? 'disabled': ''}>${w2utils.lang('Save')}</button>
            `
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })?.open(async (event: any) => { // any: w2event message open callback
            query(event.detail.box).find('input, button').eq(0).val(value)
            await event.complete
            query(event.detail.box).find('#grid-search-cancel').on('click', () => {
                this.message()
            })
            query(event.detail.box).find('#grid-search-save').on('click', () => {
                const input = query(event.detail.box).find('.w2ui-message .search-name')
                const name = input.val()
                // save in savedSearches
                if (this['searchSelected'] && ind != -1) {
                    Object.assign(this.savedSearches[ind], {
                        id: name,
                        text: name,
                        logic: this.last.logic,
                        data: w2utils.clone(this.searchData)
                    })
                } else {
                    this.savedSearches.push({
                        id: name,
                        text: name,
                        icon: 'w2ui-icon-search',
                        remove: true,
                        logic: this.last.logic,
                        data: this.searchData
                    })
                }
                // save local storage
                this.cacheSave('searches', this.savedSearches.map(s => w2utils.clone(s, { exclude: ['remove', 'icon'] })))
                this.message()
                // update on screen
                if (this['searchSelected']) {
                    this['searchSelected'].text = name
                    query(this.box).find(`#grid_${this.name}_search_name .name-text`).html(name)
                } else {
                    this['searchSelected'] = {
                        text: name,
                        logic: this.last.logic,
                        data: w2utils.clone(this.searchData)
                    }
                    query(event.detail.box).find(`#grid_${this.name}_search_all`).val(' ').prop('readOnly', true)
                    query(event.detail.box).find(`#grid_${this.name}_search_name`).show().find('.name-text').html(name)
                }
                edata.finish({ name })
            })
            await w2utils.wait(100) // need this for dialog to be ready (sliding down) for focus to work
            query(event.detail.box).find('input, button')
                .off('.message')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('keydown.message', (evt: any) => { // any: KeyboardEvent at runtime
                    const val = String(query(event.detail.box).find('.w2ui-message-body input').val()).trim()
                    if (evt.keyCode == 13 && val != '') {
                        query(event.detail.box).find('#grid-search-save').trigger('click') // enter
                    }
                    if (evt.keyCode == 27) { // escape
                        this.message()
                    }
                })
                .eq(0)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('input.message', (_evt: any) => { // any: InputEvent at runtime
                    const $save = query(event.detail.box).closest('.w2ui-message').find('#grid-search-save')
                    if (String(query(event.detail.box).val()).trim() === '') {
                        $save.prop('disabled', true)
                    } else {
                        $save.prop('disabled', false)
                    }
                })
                .get(0)
                .focus()
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cache(type: any) { // any: cache key is always string, loosely typed
        if (w2utils.hasLocalStorage && this.useLocalStorage) {
            try {
                const data = JSON.parse(localStorage['w2ui'] || '{}')
                data[(this.stateId || this.name)] ??= {}
                return data[(this.stateId || this.name)][type]
            } catch (e) {
            }
        }
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cacheSave(type: any, value: any) { // any: cache key and value are dynamic
        if (w2utils.hasLocalStorage && this.useLocalStorage) {
            try {
                const data = JSON.parse(localStorage['w2ui'] || '{}')
                data[(this.stateId || this.name)] ??= {}
                data[(this.stateId || this.name)][type] = value
                localStorage['w2ui'] = JSON.stringify(data)
                return true
            } catch (e) {
                delete localStorage['w2ui']
            }
        }
        return false
    }

    searchReset(noReload?: boolean) {
        const searchData = []
        let hasHiddenSearches = false
        // add hidden searches
        for (let i = 0; i < this.searches.length; i++) {
            const srch_r = this.searches[i]!
            if (!srch_r.hidden || srch_r.value == null) continue
            searchData.push({
                field    : srch_r.field,
                operator : srch_r.operator || 'is',
                type     : srch_r.type,
                value    : srch_r.value || ''
            })
            hasHiddenSearches = true
        }
        // event before
        const edata = this.trigger('search', { reset: true, target: this.name, searchData: searchData })
        if (edata.isCancelled === true) return
        // default action
        const input = query(this.box).find('#grid_'+ this.name +'_search_all')
        // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.searchData = edata.detail['searchData'] as any[]
        this['searchSelected'] = null
        this.last.search = ''
        this.last.logic = (hasHiddenSearches ? 'AND' : this.last.logic)
        // advanced search button
        if (this.multiSearch) {
            input.next().show()
        } else {
            input.next().hide()
        }
        this.last.multi = false
        this.last.fetch.offset = 0
        // reset scrolling position
        this.last.vscroll.scrollTop = 0
        this.last.vscroll.scrollLeft = 0
        this.last.selection.indexes = []
        this.last.selection.columns = {}
        // -- clear all search field
        this.searchClose()
        const all = input.val('').get(0)
        if (all?._w2field) { all._w2field.reset() }
        // apply search
        if (!noReload) {
            this.reload()
        }
        // event after
        edata.finish()
    }

    searchShowFields(forceHide?: boolean) {
        if (forceHide === true) {
            w2tooltip.hide(this.name + '-search-fields')
            return
        }
        const items = []
        for (let s = -1; s < this.searches.length; s++) {
            let search: W2GridSearch | undefined = this.searches[s]
            const sField   = (search ? search.field : null)
            const column   = sField != null ? this.getColumn(sField) : null
            let disabled = false
            let tooltip  = null
            if (this.show.searchHiddenMsg == true && s != -1
                    && (column == null || (column.hidden === true && column.hideable !== false))) {
                disabled = true
                tooltip = w2utils.lang(`This column ${column == null ? 'does not exist' : 'is hidden'}`)
            }
            if (s == -1) { // -1 is All Fields search
                if (!this.multiSearch || !this.show.searchAll) continue
                search = { field: 'all', label: 'All Fields', type: 'text' } as W2GridSearch
            } else {
                if (column != null && column.hideable === false) continue
                if (search == null) continue
                if (search.hidden === true) {
                    tooltip = w2utils.lang('This column is hidden')
                    // don't show hidden (not simple) searches
                    if (search['simple'] === false) continue
                }
            }
            if (search == null) continue
            if (search.label == null && search['caption'] != null) {
                console.log('NOTICE: grid search.caption property is deprecated, please use search.label. Search ->', search)
                search.label = search['caption']
            }
            items.push({
                id: search.field,
                text: w2utils.lang(search.label ?? ''),
                search,
                tooltip,
                disabled,
                checked: (search.field == this.last.field)
            })
        }
        w2menu.show({
            type: 'radio',
            name: this.name + '-search-fields',
            anchor: query(this.box).find('#grid_'+ this.name +'_search_name').parent().find('.w2ui-search-down').get(0),
            items,
            align: 'none',
            hideOn: ['doc-click', 'select']
        })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .select((event: any) => { // any: w2menu event shape varies
                this.searchInitInput(event.detail.item.search.field)
            })
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchInitInput(field: string, _value?: any) {
        let search
        const el = query(this.box).find('#grid_'+ this.name +'_search_all')
        if (field == 'all') {
            search = { field: 'all', label: w2utils.lang('All Fields') }
        } else {
            search = this.getSearch(field)
            if (search == null) return
        }
        // update field
        if (this.last.search != '') {
            this.last.label = search.label ?? ''
            this.search(search.field, this.last.search)
        } else {
            this.last.field = search.field
            this.last.label = search.label ?? ''
        }
        el.attr('placeholder', w2utils.lang('Search') + ' ' + w2utils.lang(search.label || search['caption'] || search.field, true))

        // if there is pre-selected search
        if (this['searchSelected']) {
            query(this.box).find(`#grid_${this.name}_search_all`).val(' ').prop('readOnly', true)
            query(this.box).find(`#grid_${this.name}_search_name`).show().find('.name-text').html(this['searchSelected'].text)
        } else {
            query(this.box).find(`#grid_${this.name}_search_all`).prop('readOnly', false)
            query(this.box).find(`#grid_${this.name}_search_name`).hide().find('.name-text').html('')
        }
    }

    // clears records and related params
    clear(noRefresh?: boolean): void {
        this.total   = 0
        this.records = []
        this.summary = []
        this.last.fetch.offset = 0 // need this for reload button to work on remote data set
        this.last.idCache   = {} // optimization to free memory
        this.last.selection = { indexes: [], columns: {} }
        this.last.groupBy_links = {}
        this.reset(true)
        // refresh
        if (!noRefresh) this.refresh()
    }

    // clears scroll position, selection, ranges
    reset(noRefresh?: boolean): void {
        // position
        this.last.vscroll.scrollTop = 0
        this.last.vscroll.scrollLeft = 0
        this.last.vscroll.recIndStart = null
        this.last.vscroll.recIndEnd = null
        // additional
        query(this.box).find(`#grid_${this.name}_records`).prop('scrollTop', 0)
        // refresh
        if (!noRefresh) this.refresh()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skip(offset: any, callBack?: any) { // any: offset is number-like, callBack is optional function
        const url = this.url?.get ?? this.url
        if (url) {
            this.offset = parseInt(offset)
            if (this.offset > this.total) this.offset = this.total - this.limit
            if (this.offset < 0 || !w2utils.isInt(this.offset)) this.offset = 0
            this.clear(true)
            this.reload(callBack)
        } else {
            console.log('ERROR: grid.skip() can only be called when you have remote data source.')
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(url: any, callBack?: any) { // any: url can be string or object with .get/.save
        if (url == null) {
            console.log('ERROR: You need to provide url argument when calling .load() method of "'+ this.name +'" object.')
            return new Promise((resolve, reject) => { reject() })
        }
        // default action
        this.clear(true)
        return this.request('load', {}, url, callBack)
    }

    // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reload(callBack?: (...args: any[]) => void) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const grid = this
        const url = this.url?.get ?? this.url
        grid.selectionSave()
        if (url) {
            // need to remember selection (not just last.selection object)
            return this.load(url, () => {
                grid.selectionRestore()
                if (typeof callBack == 'function') callBack()
            })
        } else {
            this.reset(true)
            this.localSearch()
            this.selectionRestore()
            if (typeof callBack == 'function') callBack({ status: 'success' })
            return new Promise<void>(resolve => { resolve() })
        }
    }

    // any: url can be string, { get, save, remove } object, URL instance, or null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request(action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolve: any, reject: any
        const requestProm = new Promise((res, rej) => { resolve = res; reject = rej })
        if (postData == null) postData = {}
        if (!url) url = this.url
        if (!url) return new Promise((resolve, reject) => { reject() })
        // build parameters list
        if (!w2utils.isInt(this.offset)) this.offset = 0
        if (!w2utils.isInt(this.last.fetch.offset)) this.last.fetch.offset = 0
        // add list params
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any
        // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
            limit: this.limit,
            offset: (this.offset as number) + (this.last.fetch.offset as number),
            searchLogic: this.last.logic,
            search: this.searchData.map((search) => {
                const _search = w2utils.clone(search)
                if (this.searchMap && this.searchMap[_search.field]) _search.field = this.searchMap[_search.field]
                return _search
            }),
            sort: this.sortData.map((sort) => {
                const _sort = w2utils.clone(sort)
                if (this.sortMap && this.sortMap[_sort.field]) _sort.field = this.sortMap[_sort.field]
                return _sort
            })
        }
        if (this.searchData.length === 0) {
            delete params.search
            delete params.searchLogic
        }
        if (this.sortData.length === 0) {
            delete params.sort
        }
        // append other params
        w2utils.extend(params, this.postData)
        w2utils.extend(params, postData)
        // other actions
        if (action == 'delete' || action == 'save') {
            delete params.limit
            delete params.offset
            params.action = action
            if (action == 'delete') {
                params[this.recid || 'recid'] = this.getSelection()
            }
        }
        // event before
        if (action == 'load') {
            edata = this.trigger('request', { target: this.name, url, postData: params, httpMethod: 'GET',
                httpHeaders: this.httpHeaders })
            if (edata.isCancelled === true) return new Promise((resolve, reject) => { reject() })
        } else {
            edata = { detail: {
                url,
                postData: params,
                httpMethod: action == 'save' ? 'PUT' : 'DELETE',
                httpHeaders: this.httpHeaders
            }}
        }
        // call server to get data
        if (this.last.fetch.offset === 0) {
            this.lock(w2utils.lang(this.msgRefresh), true)
        }
        if (this.last.fetch.controller) try { this.last.fetch.controller.abort() } catch (e) {}
        // URL
        url = edata.detail.url
        switch (action) {
            case 'save':
                if (url?.save) url = url.save
                break
            case 'delete':
                if (url?.remove) url = url.remove
                break
            default:
                url = url?.get ?? url
        }
        // process url with routeData
        if (Object.keys(this.routeData).length > 0) {
            const info = w2utils.parseRoute(url)
            if (info.keys.length > 0) {
                for (let k = 0; k < info.keys.length; k++) {
                    const key_k = info.keys[k]!
                    if (this.routeData[key_k.name] == null) continue
                    url = url.replace((new RegExp(':'+ key_k.name, 'g')), this.routeData[key_k.name])
                }
            }
        }
        url = new URL(url, location.href)
        // ajax options
        const fetchOptions = w2utils.prepareParams(url, {
            method: edata.detail.httpMethod,
            headers: edata.detail.httpHeaders,
            body: edata.detail.postData
        }, { dataType: this.dataType, caller: this, action })
        Object.assign(this.last.fetch, {
            action: action,
            options: fetchOptions,
            controller: new AbortController(),
            start: Date.now(),
            loaded: false
        })
        fetchOptions['signal'] = this.last.fetch.controller!.signal
        fetch(url, fetchOptions)
            .catch(processError)
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((resp: any) => {
                if (resp == null) return // request aborted
                if (resp?.status != 200) {
                    processError(resp ?? {})
                    return
                }
                resp.json()
                    .catch(processError)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((data: any) => { // any: server response shape varies by API
                        this.requestComplete(data ?? {}, action, callBack, resolve, reject)
                    })
                    .finally(() => self.unlock())
            })
        if (action == 'load') {
            // event after
            edata.finish()
        }
        return requestProm

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function processError(response: any) { // any: could be Response or Error
            if (response?.name === 'AbortError') {
                // request was aborted by the grid
                return
            }
            self.unlock()
            // trigger event
            const edata2 = self.trigger('error', { response, lastFetch: self.last.fetch })
            if (edata2.isCancelled === true) return
            // default behavior
            if (response.status && response.status != 200) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response.json().then((data: any) => { // any: error response body shape varies
                    self.error(response.status + ': ' + (data.message || response.statusText))
                }).catch(() => {
                    self.error(response.status + ': ' + response.statusText)
                })
            } else {
                console.log('ERROR: Server communication failed.',
                    '\n   EXPECTED:', { total: 5, records: [{ recid: 1, field: 'value' }] },
                    '\n         OR:', { error: true, message: 'error message' })
                self.requestComplete({ error: true, message: w2utils.lang(self.msgHTTPError), response }, action, callBack, resolve, reject)
            }
            // event after
            edata2.finish()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestComplete(data: any, action: any, callBack: any, resolve: any, reject: any) { // any: all params vary by context
        let error = data.error ?? false
        if (data.error == null && data.status === 'error') error = true
        this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1000
        setTimeout(() => {
            if (this.show.statusResponse) {
                this.status(w2utils.lang('Server Response ${count} seconds', { count: this.last.fetch.response }))
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
                        message: w2utils.lang(this.msgNotJSON),
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
                        // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ;(this.message(w2utils.lang(this.msgNeedReload)) as any)
                            .ok(() => {
                                delete grid.last.fetch.offset
                                grid.reload()
                            })
                        return new Promise<void>(resolve => { resolve() })
                    }
                }
                if (w2utils.isInt(data.total)) this.total = parseInt(data.total)
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
                        if (rec.w2ui?.summary === true) {
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
            this.error(w2utils.lang(data.message || this.msgServerError)) // || not ?? — empty string should also fall back
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

    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getChanges(recordsBase?: W2GridRecord[]): Record<string, any>[] {
        const changes = []
        if (typeof recordsBase == 'undefined') {
            recordsBase = this.records
        }

        for (let r = 0; r < recordsBase.length; r++) {
            const rec = recordsBase[r]!
            if (rec?.w2ui) {
                if (rec.w2ui['changes'] != null) {
                    // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const obj: Record<string, any> = {}
                    obj[this.recid || 'recid'] = rec.recid
                    changes.push(w2utils.extend(obj, rec.w2ui['changes']))
                }

                // recursively look for changes in non-expanded children
                if (rec.w2ui.expanded !== true && rec.w2ui.children && rec.w2ui.children.length) {
                    changes.push(...this.getChanges(rec.w2ui.children))
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
                    // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    console.log('ERROR: Cannot merge. ', (e as any)?.message || '', e)
                }
                if (record.w2ui) delete record.w2ui['changes']
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

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save(callBack?: (data: any) => void) {
        const changes = this.getChanges()
        const url = this.url?.save ?? this.url
        // event before
        const edata = this.trigger('save', { target: this.name, changes: changes })
        if (edata.isCancelled === true) return
        if (url) {
            this.request('save', { 'changes' : edata.detail['changes'] }, null,
                (data) => {
                    if (!data.error) {
                        // only merge changes, if save was successful
                        this.mergeChanges()
                    }
                    // event after
                    edata.finish()
                    // call back
                    if (typeof callBack == 'function') callBack(data)
                }
            )
        } else {
            this.mergeChanges()
            // event after
            edata.finish()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editField(recid: string | number, column: number, value: any, event?: any) { // any: can be KeyboardEvent, MouseEvent, or synthetic event
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        if (this.last.inEditMode === true) {
            // This is triggerign when user types fast
            if (event && event.keyCode == 13) {
                const { index, column, value } = this.last._edit!
                this.editChange({ type: 'custom', value }, index, column, event)
                this.editDone(index, column, event)
            } else {
                // when 2 chars entered fast (spreadsheet)
                const input = query(this.box).find('div.w2ui-edit-box .w2ui-input')
                if (input.length > 0) {
                    if (input.get(0).tagName == 'DIV') {
                        input.text(input.text() + value)
                        w2utils.setCursorPosition(input.get(0), input.text().length)
                    } else {
                        input.val(input.val() + value)
                        w2utils.setCursorPosition(input.get(0), input.val().length)
                    }
                }
            }
            return
        }
        const index = this.get(recid, true)
        if (index == null) return
        const edit = this.getCellEditable(index, column)
        if (!edit || ['checkbox', 'check'].includes(edit.type)) return
        const rec = this.records[index]!
        const col = this.columns[column]!
        const prefix = (col.frozen === true ? '_f' : '_')
        if (['enum', 'file'].indexOf(edit.type) != -1) {
            console.log('ERROR: input types "enum" and "file" are not supported in inline editing.')
            return
        }
        // event before
        const edata = this.trigger('editField', { target: this.name, recid, column, value, index, originalEvent: event })
        if (edata.isCancelled === true) return
        value = edata.detail['value']
        // default behaviour
        this.last.inEditMode = true
        this.last['editColumn'] = column
        this.last._edit = { value: value, index: index, column: column, recid: recid }
        this.selectNone(true) // no need to trigger select event
        this.select({ recid: recid, column: column })
        // create input element
        const tr = query(this.box).find('#grid_'+ this.name + prefix +'rec_' + w2utils.escapeId(recid))
        let div = tr.find('[col="'+ column +'"] > div') // TD -> DIV
        this.last._edit['tr'] = tr
        this.last._edit['div'] = div
        // clear previous if any (spreadsheet)
        query(this.box).find('div.w2ui-edit-box').remove()
        // for spreadsheet - insert into selection
        if (this.selectType != 'row') {
            query(this.box).find('#grid_'+ this.name + prefix + 'selection')
                .attr('id', 'grid_'+ this.name + '_editable')
                .removeClass('w2ui-selection')
                .addClass('w2ui-edit-box')
                .prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>')
                .find('.w2ui-selection-resizer')
                .remove()
            div = query(this.box).find('#grid_'+ this.name + '_editable > div:first-child')
        }
        edit.attr  = edit.attr ?? ''
        edit.text  = edit.text ?? ''
        edit.style = edit.style ?? ''
        edit.items = edit.items ?? []
        let val = (rec.w2ui?.['changes']?.[col.field] != null
            ? w2utils.stripTags(rec.w2ui['changes'][col.field])
            : w2utils.stripTags(self.parseField(rec, col.field)))
        if (val == null) val = ''
        let prevValue = (typeof val != 'object' ? val : '')
        if (edata.detail['prevValue'] != null) prevValue = edata.detail['prevValue']
        if (value != null) val = value
        let addStyle = (col.style != null ? col.style + ';' : '')
        if (typeof col.render == 'string') {
            const tmp = col.render.replace('|', ':').split(':')
            if (['number', 'int', 'float', 'money', 'currency', 'percent', 'size'].includes(tmp[0] ?? '')) {
                addStyle += 'text-align: right;'
            }
        }
        // normalize items, if not yet normlized
        if (edit.items.length > 0 && !w2utils.isPlainObject(edit.items[0])) {
            edit.items = w2utils.normMenu(edit.items, edit)
        }
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let input: any
        const dropTypes = ['date', 'time', 'datetime', 'color', 'list', 'combo']
        const styles = getComputedStyle(tr.find('[col="'+ column +'"] > div').get(0) as Element)
        const font = `font-family: ${styles.getPropertyValue('font-family')}; font-size: ${styles.getPropertyValue('font-size')};`
        switch (edit.type) {
            case 'div': {
                div.addClass('w2ui-editable')
                    .html(w2utils.stripSpaces(`<div id="grid_${this.name}_edit_${recid}_${column}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${font + addStyle + edit.style}"
                        field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>
                    </div>${edit.text}`))
                input = div.find('div.w2ui-input').get(0)
                input.innerText = (typeof val != 'object' ? val : '')
                if (value != null) {
                    w2utils.setCursorPosition(input, input.innerText.length)
                } else {
                    w2utils.setCursorPosition(input, 0, input.innerText.length)
                }
                break
            }
            default: {
                div.addClass('w2ui-editable')
                    .html(w2utils.stripSpaces(`<input id="grid_${this.name}_edit_${recid}_${column}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${font + addStyle + edit.style}"
                        field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>${edit.text}`))
                input = div.find('input').get(0)
                // issue #499
                if (edit.type == 'number') {
                    val = w2utils.formatNumber(val)
                }
                if (edit.type == 'date') {
                    val = w2utils.formatDate(w2utils.isDate(val, edit.format, true) || new Date(), edit.format)
                }
                input.value = (typeof val != 'object' ? val : '')

                // init w2field, attached to input._w2field
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const doHide = (event: any) => { // any: could be KeyboardEvent or custom event
                    const escKey = this.last._edit?.['escKey']
                    // check if any element is selected in drop down
                    let selected = false
                    const name = query(input).data('tooltipName')
                    if (name && w2tooltip.get(name[0])?.selected != null) {
                        selected = true
                    }
                    // trigger change on new value if selected from overlay
                    if (this.last.inEditMode && !escKey && dropTypes.includes(edit.type) // drop down types
                            && (event.detail.overlay.anchor?.id == this.last._edit?.['input']?.id || edit.type == 'list')) {
                        this.editChange()
                        this.editDone(undefined, undefined, { keyCode: selected ? 13 : 0 }) // advance on select
                    }
                }
                new w2field(w2utils.extend({}, edit, {
                    el: input,
                    selected: val,
                    onSelect: doHide,
                    onHide: doHide
                }))
                if (value == null && input) {
                    // if no new value, then select content
                    input.select()
                }
            }
        }
        Object.assign(this.last._edit, { input, edit })
        query(input)
            .off('.w2ui-editable')
            .on('blur.w2ui-editable', (event: Event) => {
                if (this.last.inEditMode) {
                    const type = this.last._edit?.['edit']?.type
                    const name = query(input).data('tooltipName') // if popup is open
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const et = event.target as any // any: custom _keepOpen property on event target
                    if ((name && dropTypes.includes(type)) || et?._keepOpen === true) {
                        delete et._keepOpen
                        // drop downs finish edit when popover is closed
                        return
                    }
                    this.editChange(input, index, column, event)
                    this.editDone()
                }
            })
            .on('mousedown.w2ui-editable', (event: Event) => {
                event.stopPropagation()
            })
            .on('click.w2ui-editable', (event: Event) => {
                expand.call(input, event)
            })
            .on('paste.w2ui-editable', (event: Event) => {
                // clean paste to be plain text
                event.preventDefault()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const text = (event as any as ClipboardEvent).clipboardData!.getData('text/plain') // any: typed as Event but is ClipboardEvent
                document.execCommand('insertHTML', false, text)
            })
            .on('keyup.w2ui-editable', (event: Event) => {
                expand.call(input, event)
            })
            .on('keydown.w2ui-editable', (event: Event) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const kev = event as any as KeyboardEvent // any: typed as Event but is KeyboardEvent
                switch (kev.keyCode) {
                    case 8: // backspace;
                        if (edit.type == 'list' && !input._w2field) { // cancel backspace when deleting element
                            kev.preventDefault()
                        }
                        break
                    case 9:
                    case 13:
                        kev.preventDefault()
                        break
                    case 27: // esc button exits edit mode, but if in a popup, it will also close the popup, hence
                        // if tooltip is open - hide it
                        const name = query(input).data('tooltipName')
                        if (name && name.length > 0) {
                            if (this.last._edit) this.last._edit['escKey'] = true
                            w2tooltip.hide(name[0])
                            kev.preventDefault()
                            return // keep input editable just close tooltip
                        }
                        kev.stopPropagation()
                        break
                }
                // need timeout so, this handler is executed after key is processed by browser
                setTimeout(() => {
                    switch (kev.keyCode) {
                        case 9: { // tab
                            const next = kev.shiftKey
                                ? self.prevCell(index, column, true)
                                : self.nextCell(index, column, true)
                            if (next != null) {
                                const recid = self.records[next.index]!.recid
                                this.editChange(input, index, column, event)
                                this.editDone(index, column, event)
                                if (self.selectType != 'row') {
                                    self.selectNone(true) // no need to trigger select event
                                    self.select({ recid, column: next.colIndex })
                                } else {
                                    self.editField(recid, next.colIndex, null, event)
                                }
                                if (event.preventDefault) event.preventDefault()
                            }
                            break
                        }
                        case 13: { // enter
                            // check if any element is selected in drop down
                            let selected = false
                            const name = query(input).data('tooltipName')
                            if (name && w2tooltip.get(name[0]).selected != null) {
                                selected = true
                            }
                            // if tooltip is not open or no element is selected
                            if ((!name || !selected) && input._keepOpen !== true) {
                                this.editChange(input, index, column, event)
                                this.editDone(index, column, event)
                            } else {
                                delete input._keepOpen
                            }
                            break
                        }

                        case 27: { // escape
                            if (this.last._edit) this.last._edit['escKey'] = false
                            let old = self.parseField(rec, col.field)
                            if (rec.w2ui?.['changes']?.[col.field] != null) old = rec.w2ui['changes'][col.field]
                            if (input._prevValue != null) old = input._prevValue
                            if (input.tagName == 'DIV') {
                                input.innerText = old != null ? old : ''
                            } else {
                                input.value = old != null ? old : ''
                            }
                            this.editDone(index, column, event)
                            setTimeout(() => { self.select({ recid: recid, column: column }) }, 1)
                            break
                        }
                    }
                    // if input too small - expand
                    expand(input)
                }, 1)
            })
        // save previous value
        if (input) input._prevValue = prevValue
        // focus and select
        if (edit.type != 'list') {
            setTimeout(() => {
                if (!this.last.inEditMode) return
                if (input) {
                    input.focus()
                    clearTimeout(this.last.kbd_timer ?? undefined) // keep focus
                    input.resize = expand
                    expand(input)
                }
            }, 50)
        }
        // event after
        edata.finish({ input })
        return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function expand(input: any) { // any: input is HTMLInputElement or HTMLDivElement
            try {
                const styles = getComputedStyle(input)
                const val = (input.tagName.toUpperCase() == 'DIV' ? input.innerText : input.value)
                const editBox = query(self.box).find('#grid_'+ self.name + '_editable').get(0)
                const style = `font-family: ${styles.getPropertyValue('font-family')}; font-size: ${styles.getPropertyValue('font-size')}; white-space: no-wrap;`
                const width = w2utils.getStrWidth(val, style)
                if (width + 20 > editBox.clientWidth) {
                    query(editBox).css('width', width + 20 + 'px')
                }
            } catch (e) {
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editChange(input?: any, index?: any, column?: any, event?: any) { // any: all params are optional grid-edit internals
        // if params are not specified
        input = input ?? this.last._edit?.['input']
        index = index ?? this.last._edit?.['index']
        column = column ?? this.last._edit?.['column']
        event = event ?? {}
        // all other fields
        const summary = index < 0
        index       = index < 0 ? -index - 1 : index
        const records = summary ? this.summary : this.records
        const rec     = records[index]!
        const col     = this.columns[column]!
        let new_val = (input?.tagName == 'DIV' ? input.innerText : input.value)
        const fld     = input._w2field
        if (fld) {
            if (fld.type == 'list') {
                new_val = fld.selected
            }
            if (new_val == null || Object.keys(new_val).length === 0) new_val = ''
            if (!w2utils.isPlainObject(new_val)) new_val = fld.clean(new_val)
        }
        if (input.type == 'checkbox') {
            if (rec.w2ui?.['editable'] === false) input.checked = !input.checked
            new_val = input.checked
        }
        const old_val = this.parseField(rec, col.field)
        const prev_val = (rec.w2ui?.['changes'] && rec.w2ui['changes'].hasOwnProperty(col.field) ? rec.w2ui['changes'][col.field]: old_val)
        // change/restore event
        // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any = {
            target: this.name, input,
            recid: rec.recid, index, column,
            originalEvent: event,
            value: {
                new: new_val,
                previous: prev_val,
                original: old_val,
            }
        }
        if (event.target?._prevValue != null) edata.value.previous = event.target._prevValue
        let count = 0 // just in case to avoid infinite loop
        while (count < 20) {
            count++
            new_val = edata.value.new
            if ((typeof new_val != 'object' && String(old_val) != String(new_val)) ||
                (typeof new_val == 'object' && new_val && new_val.id != old_val
                    && (typeof old_val != 'object' || old_val == null || new_val.id != old_val.id))) {
                // change event
                edata = this.trigger('change', edata)
                if (edata.isCancelled !== true) {
                    if (new_val !== edata.detail.value.new) {
                        // re-evaluate the type of change to be made
                        continue
                    }
                    // default action
                    if ((edata.detail.value.new === '' || edata.detail.value.new == null) && (prev_val === '' || prev_val == null)) {
                        // value did not change, was empty is empty
                    } else {
                        rec.w2ui = rec.w2ui ?? {}
                        rec.w2ui['changes'] = rec.w2ui['changes'] ?? {}
                        rec.w2ui['changes'][col.field] = edata.detail.value.new
                    }
                    // event after
                    edata.finish()
                }
            } else {
                // restore event
                edata = this.trigger('restore', edata)
                if (edata.isCancelled !== true) {
                    if (new_val !== edata.detail.value.new) {
                        // re-evaluate the type of change to be made
                        continue
                    }
                    // default action
                    if (rec.w2ui?.['changes']) {
                        delete rec.w2ui['changes'][col.field]
                        if (Object.keys(rec.w2ui['changes']).length === 0) {
                            delete rec.w2ui['changes']
                        }
                    }
                    // event after
                    edata.finish()
                }
            }
            break
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editDone(index?: any, column?: any, event?: any) { // any: all params are optional grid-edit internals
        // if params are not specified
        index = index ?? this.last._edit?.['index']
        column = column ?? this.last._edit?.['column']
        event = event ?? {}
        // removal of input happens when TR is redrawn
        if (this.advanceOnEdit && event.keyCode == 13) {
            const next: number = event.shiftKey ? (this.prevRow(index, column, 1) ?? index) : (this.nextRow(index, column, 1) ?? index)
            setTimeout(() => {
                if (this.selectType != 'row') {
                    this.selectNone(true) // no need to trigger select event
                    this.select({ recid: this.records[next]!.recid, column: column })
                } else {
                    this.editField(this.records[next]!.recid, column, null, event)
                }
            }, 1)
        }
        const summary = index < 0
        const cell = query(this.last._edit?.['tr']).find('[col="'+ column +'"]')
        const rec  = this.records[index]!
        const col  = this.columns[column]!
        // need to set before remove, as remove will trigger blur
        this.last.inEditMode = false
        this.last._edit = null
        // remove - by updating cell data
        if (!summary) {
            if (rec.w2ui?.['changes']?.[col.field] != null) {
                cell.addClass('w2ui-changed')
            } else {
                cell.removeClass('w2ui-changed')
            }
            cell.replace(this.getCellHTML(index, column, summary))
        }
        // remove - spreadsheet
        query(this.box).find('div.w2ui-edit-box').remove()
        // update toolbar buttons
        this.updateToolbar()
        // keep grid in focus if needed
        setTimeout(() => {
            const input = query(this.box).find(`#grid_${this.name}_focus`).get(0)
            if (document.activeElement !== input && !this.last.inEditMode) {
                input.focus()
            }
        }, 10)
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
                text: w2utils.lang(this.msgDelete, {
                    count: recs.length,
                    records: w2utils.lang( recs.length == 1 ? 'record' : 'records')
                }),
                width: 380,
                height: 170,
                yes_text: w2utils.lang('Delete'),
                yes_class: 'w2ui-btn-red',
                no_text: w2utils.lang('Cancel'),
            // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any)
                // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .yes((event: any) => {
                    event.detail.self.close()
                    this.delete(true)
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .no((event: any) => { // any: w2confirm event shape
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
                this.remove(...recs)
            } else {
                // clear cells
                for (let r = 0; r < recs.length; r++) {
                    const rr = recs[r]!
                    const fld = this.columns[rr.column]!.field
                    const ind = this.get(rr.recid, true)
                    const rec = ind != null ? this.records[ind]! : null
                    if (ind != null && fld != 'recid' && rec != null) {
                        this.records[ind]![fld] = ''
                        if (rec.w2ui?.['changes']) delete rec.w2ui['changes'][fld]
                        // -- style should not be deleted
                        // if (rec.style != null && w2utils.isPlainObject(rec.style) && rec.style[recs[r].column]) {
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
        const time = Date.now()
        let column = null
        if (this.last.cancelClick == true || (event && event.altKey)) return
        if ((typeof recid == 'object') && (recid !== null)) {
            column = recid.column
            recid  = recid.recid
        }
        if (event == null) event = {}
        // check for double click
        if (time - (this.last.click_time as number) < 350 && this.last.click_recid == recid && event.type == 'click') {
            this.dblClick(recid, event)
            return
        }
        // hide bubble
        if (this.last.bubbleEl) {
            this.last.bubbleEl = null
        }
        this.last.click_time  = time
        const last_recid = this.last.click_recid
        this.last.click_recid = recid
        // column user clicked on
        if (column == null && event.target) {
            let trg = event.target
            if (trg.tagName != 'TD') trg = query(trg).closest('td')[0]
            if (query(trg).attr('col') != null) column = parseInt(query(trg).attr('col'))
        }
        // check if record is selectable
        const index = this.get(recid, true)
        const rec = index != null ? this.records[index]! : null
        if (rec?.w2ui?.selectable === false && (rec?.w2ui?.children?.length ?? 0) > 0) {
            // if not a show-children button, then toggle
            if (!query(event.target).hasClass('w2ui-show-children')) {
                this.toggle(recid)
                return
            }
        }
        // event before
        const edata = this.trigger('click', { target: this.name, recid, column, originalEvent: event })
        if (edata.isCancelled === true) return
        // default action
        const sel = this.getSelection()
        query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', false)
        const ind = this.get(recid, true)
        const selectColumns   = []
        this.last.sel_ind   = ind
        this.last.sel_col   = column
        this.last.sel_recid = recid
        this.last.sel_type  = 'click'
        // multi select with shift key
        let start: number = 0, end: number = 0, t1: number = 0, t2: number = 0
        if (event.shiftKey && sel.length > 0 && this.multiSelect) {
            if (sel[0].recid) {
                start = this.get(sel[0].recid, true) ?? 0
                end   = this.get(recid, true) ?? 0
                if (column > sel[0].column) {
                    t1 = sel[0].column
                    t2 = column
                } else {
                    t1 = column
                    t2 = sel[0].column
                }
                for (let c = t1; c <= t2; c++) selectColumns.push(c)
            } else {
                start = last_recid != null ? (this.get(last_recid, true) ?? 0) : 0
                end   = this.get(recid, true) ?? 0
            }
            const sel_add = []
            if (start > end) { const tmp = start; start = end; end = tmp }
            const url = this.url?.get ?? this.url
            for (let i = start; i <= end; i++) {
                if (this.searchData.length > 0 && !url && !this.last.searchIds.includes(i)) continue
                if (this.selectType == 'row') {
                    sel_add.push(this.records[i]!.recid)
                } else {
                    for (let sc = 0; sc < selectColumns.length; sc++) {
                        sel_add.push({ recid: this.records[i]!.recid, column: selectColumns[sc] })
                    }
                }
                //sel.push(this.records[i]!.recid);
            }
            this.select(sel_add)
        } else {
            const last = this.last.selection
            let flag = (last.indexes.indexOf(ind ?? -1) != -1 ? true : false)
            let fselect = false
            // if clicked on the checkbox
            if (query(event.target).closest('td').hasClass('w2ui-col-select')) fselect = true
            // clear other if necessary
            if (((!event.ctrlKey && !event.shiftKey && !event.metaKey && !fselect) || !this.multiSelect) && !this['showSelectColumn']) {
                if (this.selectType != 'row' && !last.columns[ind ?? -1]?.includes(column)) {
                    flag = false
                }
                if (flag === true && sel.length == 1) {
                    this.unselect({ recid: recid, column: column })
                } else {
                    this.selectNone(true) // no need to trigger select event
                    this.select({ recid: recid, column: column })
                }
            } else {
                if (this.selectType != 'row') flag = false
                if (flag === true) {
                    this.unselect({ recid: recid, column: column })
                } else {
                    this.select({ recid: recid, column: column })
                }
            }
        }
        this.status()
        this.initResize()
        // event after
        edata.finish()
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnClick(field: string, event?: MouseEvent | any) {
        // ignore click if column was resized
        if (this.last.colResizing === true) {
            return
        }
        // event before
        let edata = this.trigger('columnClick', { target: this.name, field: field, originalEvent: event })
        if (edata.isCancelled === true) return
        // default behaviour
        if (this.selectType == 'row') {
            const column = this.getColumn(field)
            if (column && column.sortable) this.sort(field, null, (event && (event.ctrlKey || event.metaKey || event.shiftKey) ? true : false))
            if (edata.detail['field'] == 'line-number') {
                if (this.getSelection().length >= this.records.length) {
                    this.selectNone()
                } else {
                    this.selectAll()
                }
            }
        } else {
            if (event.altKey){
                const column = this.getColumn(field)
                if (column && column.sortable) this.sort(field, null, (event && (event.ctrlKey || event.metaKey || event.shiftKey) ? true : false))
            }
            // select entire column
            if (edata.detail['field'] == 'line-number') {
                if (this.getSelection().length >= this.records.length) {
                    this.selectNone()
                } else {
                    this.selectAll()
                }
            } else {
                if (!event.shiftKey && !event.metaKey && !event.ctrlKey) {
                    this.selectNone(true)
                }
                const tmp    = this.getSelection()
                const column = this.getColumn(edata.detail['field'] as string, true) ?? 0
                const sel    = []
                const cols   = []
                // check if there was a selection before
                if (tmp.length != 0 && event.shiftKey) {
                    let start = column
                    let end   = tmp[0]!.column
                    if (start > end) {
                        start = tmp[0]!.column
                        end   = column
                    }
                    for (let i = start; i<=end; i++) cols.push(i)
                } else {
                    cols.push(column)
                }
                edata = this.trigger('columnSelect', { target: this.name, columns: cols })
                if (edata.isCancelled !== true) {
                    for (let i = 0; i < this.records.length; i++) {
                        sel.push({ recid: this.records[i]!.recid, column: cols })
                    }
                    this.select(sel)
                }
                edata.finish()
            }
        }
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnDblClick(field: any, event: any) { // any: field is string; event is MouseEvent or CustomEvent
        // event before
        const edata = this.trigger('columnDblClick', { target: this.name, field: field, originalEvent: event })
        if (edata.isCancelled === true) return
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnContextMenu(field: any, event: any) { // any: field is string; event is MouseEvent
        const edata = this.trigger('columnContextMenu', { target: this.name, field: field, originalEvent: event })
        if (edata.isCancelled === true) return
        // show menu
        w2menu.show({
            type: 'check',
            contextMenu: true,
            originalEvent: event,
            items: this.initColumnOnOff()
        })
        .then(() => {
            query('#w2overlay-context-menu .w2ui-grid-skip')
                .off('.w2ui-grid')
                .on('click.w2ui-grid', (evt: Event) => {
                    evt.stopPropagation()
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('keypress', (evt: any) => { // any: KeyboardEvent at runtime; typed loosely
                    if (evt.keyCode == 13) {
                        this.skip(evt.target.value)
                        this.toolbar.click('w2ui-column-on-off') // close menu
                    }
                })
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select((event: any) => { // any: w2menu select event shape varies
            const id = event.detail.item.id
            if (['w2ui-stateSave', 'w2ui-stateReset'].includes(id)) {
                this[id.substring(5)]()
            } else if (id == 'w2ui-skip') {
                // empty
            } else {
                this.columnOnOff(event, event.detail.item.id)
            }
            clearTimeout(this.last.kbd_timer ?? undefined) // keep grid in focus
        })
        clearTimeout(this.last.kbd_timer ?? undefined) // keep grid in focus
        // cancel default
        event.preventDefault()
        edata.finish()
    }

    // if called w/o arguments, then will resize all columns
    columnAutoSize(colIndex?: number) {
        if (colIndex === undefined) {
            // autoSize all columns
            this.columns.forEach((col, i) => this.columnAutoSize(i))
            return
        }
        const col = this.columns[colIndex]!
        const el = query(`#grid_${this.name}_column_${colIndex} .w2ui-col-header`)[0]
        if (col['autoResize'] === false || col.hidden === true || !el) {
            return true
        }
        const style = getComputedStyle(el)
        let maxWidth = w2utils.getStrWidth(el.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true)
            + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4

        query(this.box).find(`.w2ui-grid-records td[col="${colIndex}"] > div`, this.box).each((el: Node) => {
            const htmlEl = el as HTMLElement // cast: query().each() passes Element but typed as Node
            const style = getComputedStyle(htmlEl)
            const width = w2utils.getStrWidth(htmlEl.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true)
                + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4 // add some extra because of the border
            if (maxWidth < width) {
                maxWidth = width
            }
        })

        // event before
        const edata = this.trigger('columnAutoResize', { maxWidth, originalEvent: event, target: this.name, column: col })
        if (edata.isCancelled === true) { return }

        if (maxWidth > 0) {
            if (col.sizeOriginal == null) col.sizeOriginal = col.size ?? ''
            col.size = Math.min(Math.abs(maxWidth), col.max || Infinity) + 'px'
            this.resizeRecords()
            this.resizeRecords() // Why do we have to call it twice in order to show the scrollbar?
            this.scroll()
        }
        // event after
        edata.finish()
    }

    columnAutoSizeAll() {
        this.columns.forEach((col, ind) => this.columnAutoSize(ind))
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus(event?: Event | any) {
        // event before
        const edata = this.trigger('focus', { target: this.name, originalEvent: event })
        if (edata.isCancelled === true) return false
        // default behaviour
        this.hasFocus = true
        query(this.box).removeClass('w2ui-inactive').find('.w2ui-inactive').removeClass('w2ui-inactive')
        setTimeout(() => {
            const txt = query(this.box).find(`#grid_${this.name}_focus`).get(0)
            if (txt && document.activeElement != txt) {
                txt.focus()
            }
        }, 10)
        // event after
        edata.finish()
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blur(event?: Event | any) {
        // event before
        const edata = this.trigger('blur', { target: this.name, originalEvent: event })
        if (edata.isCancelled === true) return false
        // default behaviour
        this.hasFocus = false
        query(this.box).addClass('w2ui-inactive').find('.w2ui-selected').addClass('w2ui-inactive')
        query(this.box).find('.w2ui-selection').addClass('w2ui-inactive')
        // event after
        edata.finish()
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keydown(event: KeyboardEvent | any) {
        // this method is called from w2utils
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        const url = this.url?.get ?? this.url
        if (obj.keyboard !== true) return
        // trigger event
        const edata = obj.trigger('keydown', { target: obj.name, originalEvent: event })
        if (edata.isCancelled === true) return
        // default behavior
        if (query(this.box).find('.w2ui-message').length > 0) {
            // if there are messages
            if (event.keyCode == 27) this.message()
            return
        }
        let empty   = false
        const records = query(obj.box).find('#grid_'+ obj.name +'_records')
        const sel     = obj.getSelection()
        if (sel.length === 0) empty = true
        let recid   = sel[0] || null
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let columns: any[] = []
        let recid2  = sel[sel.length-1]
        if (typeof recid == 'object' && recid != null) {
            recid   = sel[0].recid
            columns = []
            let ii  = 0
            while (true) {
                if (!sel[ii] || sel[ii].recid != recid) break
                columns.push(sel[ii].column)
                ii++
            }
            recid2 = sel[sel.length-1].recid
        }
        const ind      = obj.get(recid, true) ?? -1
        const ind2     = obj.get(recid2, true) ?? -1
        const recEL    = query(obj.box).find(`#grid_${obj.name}_rec_${(ind >= 0 ? w2utils.escapeId(obj.records[ind]!.recid) : 'none')}`)
        const pageSize = Math.floor(records[0].clientHeight / obj.recordHeight)
        let cancel   = false
        const key      = event.keyCode
        const shiftKey = event.shiftKey

        switch (key) {
            case 8: // backspace
            case 46: { // delete
                // delete if button is visible
                obj.delete()
                cancel = true
                event.stopPropagation()
                break
            }
            case 27: { // escape
                if (obj.last.move?.type) {
                    delete obj.last.move
                    obj.removeRange('selection-preview')
                    obj.removeRange('selection-expand')
                    cancel = true
                } else {
                    obj.selectNone()
                    cancel = true
                }
                break
            }
            case 65: { // cmd + A
                if (!event.metaKey && !event.ctrlKey) break
                obj.selectAll()
                cancel = true
                break
            }
            case 13: { // enter
                // if expandable columns - expand it
                if (this.selectType == 'row' && obj.show.expandColumn === true) {
                    if (recEL.length <= 0) break
                    obj.toggle(recid, event)
                    cancel = true
                } else { // or enter edit
                    for (let c = 0; c < this.columns.length; c++) {
                        const edit = this.getCellEditable(ind, c)
                        if (edit) {
                            columns.push(c)
                            break
                        }
                    }
                    // edit last column that was edited
                    if (this.selectType == 'row' && this.last._edit && this.last._edit['column']) {
                        columns = [this.last._edit['column']]
                    }
                    if (columns.length > 0) {
                        obj.editField(recid, columns[0] ?? this.last['editColumn'], null, event)
                        cancel = true
                    }
                }
                break
            }
            case 37: { // left
                moveLeft()
                break
            }
            case 39: { // right
                moveRight()
                break
            }
            case 33: { // <PgUp>
                moveUp(pageSize)
                break
            }
            case 34: { // <PgDn>
                moveDown(pageSize)
                break
            }
            case 35: { // <End>
                moveDown(-1)
                break
            }
            case 36: { // <Home>
                moveUp(-1)
                break
            }
            case 38: { // up
                // ctrl (or cmd) + up -> same as home
                moveUp(event.metaKey || event.ctrlKey ? -1 : 1)
                break
            }
            case 40: { // down
                // ctrl (or cmd) + up -> same as end
                moveDown(event.metaKey || event.ctrlKey ? -1 : 1)
                break
            }
            // copy & paste
            case 17: // ctrl key
            case 91: { // cmd key
                // SLOW: 10k records take 7.0
                if (empty) break
                // in Safari need to copy to buffer on cmd or ctrl key (otherwise does not work)
                if (w2utils.isSafari) {
                    obj.last.copy_event = obj.copy(false, event)
                    const focus = query(obj.box).find('#grid_'+ obj.name + '_focus')
                    focus.val(obj.last.copy_event.detail.text)
                    focus[0].select()
                }
                break
            }
            case 67: { // - c
                // this fill trigger event.onComplete
                if (event.metaKey || event.ctrlKey) {
                    if (w2utils.isSafari) {
                        obj.copy(obj.last.copy_event, event)
                    } else {
                        obj.last.copy_event = obj.copy(false, event)
                        const focus = query(obj.box).find('#grid_'+ obj.name + '_focus')
                        focus.val(obj.last.copy_event.detail.text)
                        focus[0].select()
                        obj.copy(obj.last.copy_event, event)
                    }
                }
                break
            }
            case 88: { // x - cut
                if (empty) break
                if (event.ctrlKey || event.metaKey) {
                    if (w2utils.isSafari) {
                        obj.copy(obj.last.copy_event, event)
                    } else {
                        obj.last.copy_event = obj.copy(false, event)
                        const focus = query(obj.box).find('#grid_'+ obj.name + '_focus')
                        focus.val(obj.last.copy_event.detail.text)
                        focus[0].select()
                        obj.copy(obj.last.copy_event, event)
                    }
                }
                break
            }
        }
        const tmp = [32, 187, 189, 192, 219, 220, 221, 186, 222, 188, 190, 191] // other typeable chars
        for (let i = 48; i <= 111; i++) tmp.push(i) // 0-9,a-z,A-Z,numpad
        if (tmp.indexOf(key) != -1 && !event.ctrlKey && !event.metaKey && !cancel) {
            if (columns.length === 0) columns.push(0)
            cancel = false
            // move typed key into edit
            setTimeout(() => {
                const focus = query(obj.box).find('#grid_'+ obj.name + '_focus')
                const key = focus.val()
                focus.val('')
                obj.editField(recid, columns[0], key, event)
            }, 1)
        }
        if (cancel) { // cancel default behaviour
            if (event.preventDefault) event.preventDefault()
        }
        // event after
        edata.finish()

        function moveLeft() {
            if (empty) { // no selection
                selectTopRecord()
                return
            }
            if (obj.selectType == 'row') {
                if (recEL.length <= 0) return
                const tmp = obj.records[ind]!.w2ui || {}
                if (tmp && tmp.parent_recid != null && (!Array.isArray(tmp.children) || tmp.children.length === 0 || !tmp.expanded)) {
                    obj.unselect(recid)
                    obj.collapse(tmp.parent_recid, event)
                    obj.select(tmp.parent_recid)
                } else {
                    obj.collapse(recid, event)
                }
            } else {
                const prevCell = obj.prevCell(ind, columns[0]!)
                let prevCol: number | null = (prevCell?.index != ind) ? null : (prevCell?.colIndex ?? null)
                if (!shiftKey && prevCol == null) {
                    obj.selectNone(true)
                    prevCol = 0
                }
                if (prevCol != null) {
                    if (shiftKey && obj.multiSelect) {
                        if (tmpUnselect()) return
                        const tmp    = []
                        const newSel = []
                        const unSel  = []
                        if (columns.indexOf(obj.last.sel_col) === 0 && columns.length > 1) {
                            for (let i = 0; i < sel.length; i++) {
                                if (tmp.indexOf(sel[i].recid) == -1) tmp.push(sel[i].recid)
                                unSel.push({ recid: sel[i].recid, column: columns[columns.length-1]! })
                            }
                            obj.unselect(unSel)
                            obj.scrollIntoView(ind, columns[columns.length-1]!, true)
                        } else {
                            for (let i = 0; i < sel.length; i++) {
                                if (tmp.indexOf(sel[i].recid) == -1) tmp.push(sel[i].recid)
                                newSel.push({ recid: sel[i].recid, column: prevCol })
                            }
                            obj.select(newSel)
                            obj.scrollIntoView(ind, prevCol, true)
                        }
                    } else {
                        obj.click({ recid: recid, column: prevCol }, event)
                        obj.scrollIntoView(ind, prevCol, true)
                    }
                } else {
                    // if selected more then one, then select first
                    if (!shiftKey) {
                        obj.selectNone(true)
                    }
                }
            }
            cancel = true
        }

        function moveRight() {
            if (empty) {
                selectTopRecord()
                return
            }
            if (obj.selectType == 'row') {
                if (recEL.length <= 0) return
                obj.expand(recid, event)
            } else {
                const nextCell = obj.nextCell(ind, columns[columns.length-1]!) // columns is an array of selected columns
                let nextCol: number | null = (nextCell?.index != ind) ? null : (nextCell?.colIndex ?? null)
                if (!shiftKey && nextCol == null) {
                    obj.selectNone(true)
                    nextCol = obj.columns.length-1
                }
                if (nextCol != null) {
                    if (shiftKey && key == 39 && obj.multiSelect) {
                        if (tmpUnselect()) return
                        const tmp    = []
                        const newSel = []
                        const unSel  = []
                        if (columns.indexOf(obj.last.sel_col) == columns.length-1 && columns.length > 1) {
                            for (let i = 0; i < sel.length; i++) {
                                if (tmp.indexOf(sel[i].recid) == -1) tmp.push(sel[i].recid)
                                unSel.push({ recid: sel[i].recid, column: columns[0]! })
                            }
                            obj.unselect(unSel)
                            obj.scrollIntoView(ind, columns[0]!, true)
                        } else {
                            for (let i = 0; i < sel.length; i++) {
                                if (tmp.indexOf(sel[i].recid) == -1) tmp.push(sel[i].recid)
                                newSel.push({ recid: sel[i].recid, column: nextCol })
                            }
                            obj.select(newSel)
                            obj.scrollIntoView(ind, nextCol, true)
                        }
                    } else {
                        obj.click({ recid: recid, column: nextCol }, event)
                        obj.scrollIntoView(ind, nextCol, true)
                    }
                } else {
                    // if selected more then one, then select first
                    if (!shiftKey) {
                        obj.selectNone(true)
                    }
                }
            }
            cancel = true
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function moveUp(numRows: any) { // any: number of rows to scroll
            if (empty) selectTopRecord()
            if (recEL.length <= 0) return
            // move to the previous record
            let prev = obj.prevRow(ind, obj.selectType == 'row' ? 0 : sel[0].column, numRows)
            if (!shiftKey && prev == null) {
                if (obj.searchData.length != 0 && !url) {
                    prev = obj.last.searchIds[0] ?? null
                } else {
                    prev = 0
                }
            }
            if (prev != null) {
                if (shiftKey && obj.multiSelect) { // expand selection
                    if (tmpUnselect()) return
                    const sel_ind = obj.last.sel_ind ?? -1
                    if (obj.selectType == 'row') {
                        if (sel_ind > prev && sel_ind != ind2) {
                            obj.unselect(obj.records[ind2]!.recid)
                        } else {
                            obj.select(obj.records[prev]!.recid)
                        }
                    } else {
                        if (sel_ind > prev && sel_ind != ind2) {
                            prev    = ind2
                            const tmp = []
                            for (let c = 0; c < columns.length; c++) tmp.push({ recid: obj.records[prev]!.recid, column: columns[c]! })
                            obj.unselect(tmp)
                        } else {
                            const tmp = []
                            for (let c = 0; c < columns.length; c++) tmp.push({ recid: obj.records[prev]!.recid, column: columns[c]! })
                            obj.select(tmp)
                        }
                    }
                } else { // move selected record
                    obj.selectNone(true) // no need to trigger select event
                    obj.click({ recid: obj.records[prev]!.recid, column: columns[0]! }, event)
                }
                obj.scrollIntoView(prev, undefined, true, numRows != 1) // top align record
                if (event.preventDefault) event.preventDefault()
            } else {
                // if selected more then one, then select first
                if (!shiftKey) {
                    obj.selectNone(true)
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function moveDown(numRows: any) { // any: number of rows to scroll
            if (empty) selectTopRecord()
            if (recEL.length <= 0) return
            // move to the next record
            let next = obj.nextRow(ind2, obj.selectType == 'row' ? 0 : sel[0].column, numRows)
            if (!shiftKey && next == null) {
                if (obj.searchData.length != 0 && !url) {
                    next = obj.last.searchIds[obj.last.searchIds.length - 1] ?? null
                } else {
                    next = obj.records.length - 1
                }
            }
            if (next != null) {
                if (shiftKey && obj.multiSelect) { // expand selection
                    if (tmpUnselect()) return
                    const sel_ind = obj.last.sel_ind ?? -1
                    if (obj.selectType == 'row') {
                        if (sel_ind < next && sel_ind != ind) {
                            obj.unselect(obj.records[ind]!.recid)
                        } else {
                            obj.select(obj.records[next]!.recid)
                        }
                    } else {
                        if (sel_ind < next && sel_ind != ind) {
                            next    = ind
                            const tmp = []
                            for (let c = 0; c < columns.length; c++) tmp.push({ recid: obj.records[next]!.recid, column: columns[c]! })
                            obj.unselect(tmp)
                        } else {
                            const tmp = []
                            for (let c = 0; c < columns.length; c++) tmp.push({ recid: obj.records[next]!.recid, column: columns[c]! })
                            obj.select(tmp)
                        }
                    }
                } else { // move selected record
                    obj.selectNone(true) // no need to trigger select event
                    obj.click({ recid: obj.records[next]!.recid, column: columns[0]! }, event)
                }
                obj.scrollIntoView(next, undefined, true, numRows != 1) // top align record
                cancel = true
            } else {
                // if selected more then one, then select first
                if (!shiftKey) {
                    obj.selectNone(true) // no need to trigger select event
                }
            }
        }

        function selectTopRecord() {
            if (!obj.records || obj.records.length === 0) return
            let ind = Math.floor(records[0].scrollTop / obj.recordHeight) + 1
            if (!obj.records[ind] || ind < 2) ind = 0
            if (typeof obj.records[ind] === 'undefined') return
            obj.select({ recid: obj.records[ind]!.recid, column: 0})
        }

        function tmpUnselect () {
            if (obj.last.sel_type != 'click') return false
            if (obj.selectType != 'row') {
                obj.last.sel_type = 'key'
                if (sel.length > 1) {
                    for (let s = 0; s < sel.length; s++) {
                        if (sel[s].recid == obj.last.sel_recid && sel[s].column == obj.last.sel_col) {
                            sel.splice(s, 1)
                            break
                        }
                    }
                    obj.unselect(sel)
                    return true
                }
                return false
            } else {
                obj.last.sel_type = 'key'
                if (sel.length > 1) {
                    sel.splice(sel.indexOf(obj.records[obj.last.sel_ind ?? 0]!.recid), 1)
                    obj.unselect(sel)
                    return true
                }
                return false
            }
        }
    }

    scrollIntoView(ind?: number | null, column?: number, instant?: boolean, recTop?: boolean) {
        let buffered = this.records.length
        if (this.searchData.length != 0 && !this.url) buffered = this.last.searchIds.length
        if (buffered === 0) return
        if (ind == null) {
            const sel = this.getSelection()
            if (sel.length === 0) return
            if (w2utils.isPlainObject(sel[0])) {
                ind    = sel[0].index
                column = sel[0].column
            } else {
                ind = this.get(sel[0], true)
            }
        }
        const records = query(this.box).find(`#grid_${this.name}_records`)
        const recWidth  = records[0].clientWidth
        const recHeight = records[0].clientHeight
        const recSTop   = records[0].scrollTop
        const recSLeft  = records[0].scrollLeft
        // if all records in view
        const len = this.last.searchIds.length
        if (len > 0) ind = this.last.searchIds.indexOf(ind ?? 0) // if search is applied
        // smooth or instant
        records.css({ 'scroll-behavior': instant ? 'auto' : 'smooth' })

        // vertical
        if (recHeight < this.recordHeight * (len > 0 ? len : buffered) && records.length > 0) {
            // scroll to correct one
            const t1 = Math.floor(recSTop / this.recordHeight)
            const t2 = t1 + Math.floor(recHeight / this.recordHeight)
            if (ind == t1) {
                records.prop('scrollTop', recSTop - recHeight / 1.3)
            }
            if (ind == t2) {
                records.prop('scrollTop', recSTop + recHeight / 1.3)
            }
            if ((ind ?? 0) < t1 || (ind ?? 0) > t2) {
                records.prop('scrollTop', ((ind ?? 0) - 1) * this.recordHeight)
            }
            if (recTop === true) {
                records.prop('scrollTop', (ind ?? 0) * this.recordHeight)
            }
        }

        // horizontal
        if (column != null) {
            let x1 = 0
            let x2 = 0
            const sb = w2utils.scrollBarSize() as number
            for (let i = 0; i <= column; i++) {
                const col = this.columns[i]!
                if (col.frozen || col.hidden) continue
                x1  = x2
                x2 += parseInt(col.sizeCalculated ?? '0')
            }
            if (recWidth < x2 - recSLeft) { // right
                records.prop('scrollLeft', x1 - sb)
            } else if (x1 < recSLeft) { // left
                records.prop('scrollLeft', x2 - recWidth + sb * 2)
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollToColumn(field: any) { // any: field name is string
        if (field == null)
            return
        let sWidth = 0
        let found  = false
        for (let i = 0; i < this.columns.length; i++) {
            const col = this.columns[i]!
            if (col.field == field) {
                found = true
                break
            }
            if (col.frozen || col.hidden)
                continue
            const cSize = parseInt(col.sizeCalculated ? col.sizeCalculated : String(col.size ?? 0))
            sWidth   += cSize
        }
        if (!found)
            return
        this.last.vscroll.scrollLeft = sWidth + 1
        this.scroll()
    }


    // any: recid can be string|number (row select) or {recid, column} object (cell select)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dblClick(recid: string | number | { recid: string | number; column?: number } | any, event?: MouseEvent | any) {
        // find columns
        let column = null
        if ((typeof recid == 'object') && (recid !== null)) {
            column = recid.column
            recid  = recid.recid
        }
        if (event == null) event = {}
        // column user clicked on
        if (column == null && event.target) {
            let tmp = event.target
            if (tmp.tagName.toUpperCase() != 'TD') tmp = query(tmp).closest('td')[0]
            column = parseInt(query(tmp).attr('col'))
        }
        const index = this.get(recid, true)
        const rec   = index != null ? this.records[index] : null
        // event before
        const edata = this.trigger('dblClick', { target: this.name, recid: recid, column: column, originalEvent: event })
        if (edata.isCancelled === true) return
        // default action
        this.selectNone(true) // no need to trigger select event
        const edit = index != null ? this.getCellEditable(index, column) : null
        if (edit) {
            this.editField(recid, column, null, event)
        } else {
            this.select({ recid: recid, column: column })
            if (this.show.expandColumn || (rec && rec.w2ui && Array.isArray(rec.w2ui.children))) this.toggle(recid)
        }
        // event after
        edata.finish()
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showContextMenu(event: MouseEvent | any, options: { recid?: string | number; index?: number; column?: number }) {
        const { recid, index, column } = options
        if (this.last.userSelect == 'text') return
        if (event == null) {
            event = { offsetX: 0, offsetY: 0, target: query(this.box).find(`#grid_${this.name}_rec_${recid}`)[0] }
        }
        if (event.offsetX == null) {
            event.offsetX = event.layerX - event.target.offsetLeft
            event.offsetY = event.layerY - event.target.offsetTop
        }
        // if (w2utils.isFloat(recid)) recid = parseFloat(recid)
        const sel = this.getSelection()
        if (this.selectType == 'row') {
            if (recid != null && sel.indexOf(recid) == -1) {
                this.click(recid)
            }
        } else {
            let sel_col = false  // any cell in a column
            let sel_row = false  // any cell in a row
            let sel_cell = false // this exact cell
            sel.forEach(rec => {
                if (rec.recid == recid) sel_row = true
                if (rec.column == column) sel_col = true
                if (rec.recid == recid && rec.column == column) sel_cell = true
            })
            if (!sel_row && recid != null && column === null) this.click({ recid })  // select entire row
            if (!sel_col && recid === null && column != null) this.columnClick(this.columns[column]!.field, event)
            if (!sel_cell && recid != null && column != null) this.click({ recid, column }) // select a cell
        }
        // event before
        const edata = this.trigger('contextMenu', { target: this.name, originalEvent: event, recid, index, column })
        if (edata.isCancelled === true) return
        // default action
        if (this.contextMenu?.length > 0) {
            w2menu.show({
                contextMenu: true,
                originalEvent: event,
                items: this.contextMenu
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .select((event: any) => { // any: w2menu select event shape varies
                clearTimeout(this.last.kbd_timer ?? undefined) // keep grid in focus
                this.contextMenuClick(recid ?? '', column ?? null, event)
            })
        }
        // cancel browser context menu
        event.preventDefault()
        clearTimeout(this.last.kbd_timer ?? undefined) // keep grid in focus
        // event after
        edata.finish()
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenuClick(recid: string | number, column: number | null, event: any) {
        // event before
        const edata = this.trigger('contextMenuClick', {
            target: this.name, recid, column, originalEvent: event.detail.originalEvent,
            menuEvent: event, menuIndex: event.detail.index, menuItem: event.detail.item
        })
        if (edata.isCancelled === true) return
        // no default action
        edata.finish()
    }

    toggle(recid: string | number, _event?: Event) {
        const rec  = this.get(recid)
        if (rec == null) return
        rec.w2ui = rec.w2ui ?? {}
        if (rec.w2ui.expanded === true) {
            return this.collapse(recid)
        } else {
            return this.expand(recid)
        }
    }

    /**
     * When record is expaned, then w2ui.children of the record is copied into this.records and this.total is updated. It will
     * also set w2ui._copeid = true, so it would not copy it again.
     *
     * There is also updateExpaned() that is called in this.refresh()
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand(recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
        const ind  = this.get(recid, true)
        if (ind == null) return false
        const rec  = this.records[ind]!
        rec.w2ui = rec.w2ui ?? {}
        const id   = w2utils.escapeId(recid)
        const children = rec.w2ui.children
        let edata
        if (Array.isArray(children)) {
            if (rec.w2ui.expanded === true || children.length === 0) return false // already shown
            edata = this.trigger('expand', { target: this.name, recid: recid })
            if (edata.isCancelled === true) return false
            rec.w2ui.expanded = true
            rec.w2ui['_copied'] = true
            children.forEach((child) => {
                child.w2ui = child.w2ui ?? {}
                child.w2ui.parent_recid = rec.recid
                if (child.w2ui.children == null) child.w2ui.children = []
            })
            this.records.splice(ind + 1, 0, ...children)
            if (this.total !== -1) {
                this.total += children.length
            }
            const url = this.url?.get ?? this.url
            if (!url) {
                this.localSort(true, true)
                if (this.searchData.length > 0) {
                    this.localSearch(true)
                }
            }
            if (noRefresh !== true) this.refresh()
            edata.finish()
        } else {
            if (query(this.box).find('#grid_'+ this.name +'_rec_'+ id +'_expanded_row').length > 0 || this.show.expandColumn !== true) return false
            // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((rec.w2ui.expanded as any) == 'none') return false
            // insert expand row
            query(this.box).find('#grid_'+ this.name +'_rec_'+ id).after(
                `<tr id="grid_${this.name}_rec_${recid}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${recid}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`)

            query(this.box).find('#grid_'+ this.name +'_frec_'+ id).after(
                `<tr id="grid_${this.name}_frec_${recid}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ''}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${recid}_expanded"></div>
                    </td>
                </tr>`)

            // event before
            edata = this.trigger('expand', { target: this.name, recid: recid,
                box_id: 'grid_'+ this.name +'_rec_'+ recid +'_expanded', fbox_id: 'grid_'+ this.name +'_frec_'+ recid +'_expanded' })
            if (edata.isCancelled === true) {
                query(this.box).find('#grid_'+ this.name +'_rec_'+ id +'_expanded_row').remove()
                query(this.box).find('#grid_'+ this.name +'_frec_'+ id +'_expanded_row').remove()
                return false
            }
            // expand column
            const row1 = query(this.box).find('#grid_'+ this.name +'_rec_'+ recid +'_expanded')
            const row2 = query(this.box).find('#grid_'+ this.name +'_frec_'+ recid +'_expanded')
            const innerHeight = row1.find(':scope div:first-child')[0]?.clientHeight ?? 50
            if (row1[0].clientHeight < innerHeight) {
                row1.css({ height: innerHeight + 'px' })
            }
            if (row2[0].clientHeight < innerHeight) {
                row2.css({ height: innerHeight + 'px' })
            }
            // default action
            query(this.box).find('#grid_'+ this.name +'_rec_'+ id).attr('expanded', 'yes').addClass('w2ui-expanded')
            query(this.box).find('#grid_'+ this.name +'_frec_'+ id).attr('expanded', 'yes').addClass('w2ui-expanded')
            query(this.box).find('#grid_'+ this.name +'_cell_'+ this.get(recid, true) +'_expand div').html('-')
            rec.w2ui.expanded = true
            // event after
            edata.finish()
            this.resizeRecords()
        }
        this.selectNone() // or selection is messed up
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collapse(recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
        const ind      = this.get(recid, true)
        if (ind == null) return false
        const rec      = this.records[ind]!
        rec.w2ui     = rec.w2ui || {}
        const id       = w2utils.escapeId(recid)
        const children = rec.w2ui.children
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any
        if (Array.isArray(children)) {
            if (rec.w2ui.expanded !== true) return false // already hidden
            edata = this.trigger('collapse', { target: this.name, recid: recid })
            if (edata.isCancelled === true) return false
            clearExpanded(rec)
            const stops = []
            for (let r: W2GridRecord | null = rec; r != null; r = (r.w2ui?.parent_recid != null ? this.get(r.w2ui.parent_recid) : null))
                stops.push(r.w2ui?.parent_recid)
            // stops contains 'undefined' plus the ID of all nodes in the path from 'rec' to the tree root
            const start = ind + 1
            let end   = start
            while (true) {
                if (this.records.length <= end + 1 || this.records[end+1]!.w2ui == null ||
                    stops.indexOf(this.records[end+1]!.w2ui!.parent_recid) >= 0) {
                    break
                }
                end++
            }
            this.records.splice(start, end - start + 1)
            if (this.total !== -1) {
                this.total -= end - start + 1
            }
            const url     = this.url?.get ?? this.url
            if (!url) {
                if (this.searchData.length > 0) {
                    this.localSearch(true)
                }
            }
            if (noRefresh !== true) this.refresh()
            edata.finish()
        } else {
            if (query(this.box).find('#grid_'+ this.name +'_rec_'+ id +'_expanded_row').length === 0 || this.show.expandColumn !== true) return false
            // event before
            edata = this.trigger('collapse', { target: this.name, recid: recid,
                box_id: 'grid_'+ this.name +'_rec_'+ recid +'_expanded', fbox_id: 'grid_'+ this.name +'_frec_'+ recid +'_expanded' })
            if (edata.isCancelled === true) return false
            // default action
            query(this.box).find('#grid_'+ this.name +'_rec_'+ id).removeAttr('expanded').removeClass('w2ui-expanded')
            query(this.box).find('#grid_'+ this.name +'_frec_'+ id).removeAttr('expanded').removeClass('w2ui-expanded')
            query(this.box).find('#grid_'+ this.name +'_cell_'+ this.get(recid, true) +'_expand div').html('+')
            query(this.box).find('#grid_'+ this.name +'_rec_'+ id +'_expanded').css('height', '0px')
            query(this.box).find('#grid_'+ this.name +'_frec_'+ id +'_expanded').css('height', '0px')
            setTimeout(() => {
                query(this.box).find('#grid_'+ this.name +'_rec_'+ id +'_expanded_row').remove()
                query(this.box).find('#grid_'+ this.name +'_frec_'+ id +'_expanded_row').remove()
                if (rec.w2ui) rec.w2ui.expanded = false
                // event after
                edata.finish()
                this.resizeRecords()
            }, 300)
        }
        this.selectNone() // or selection is messed up
        return true

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function clearExpanded(rec: any) { // any: W2GridRecord
            rec.w2ui.expanded = false
            rec.w2ui['_copied'] = false
            for (let i = 0; i < rec.w2ui.children.length; i++) {
                const subRec = rec.w2ui.children[i]
                if (subRec.w2ui?.expanded) {
                    clearExpanded(subRec)
                }
            }
        }
    }

    updateExpanded() {
        let updated = false
        for (let ind = this.records.length - 1; ind >= 0; ind--) {
            const rec = this.records[ind]!
            const children = rec.w2ui?.children
            if (rec.w2ui?.expanded === true && (children?.length ?? 0) > 0 && !rec.w2ui['_copied']) {
                rec.w2ui['_copied'] = true
                children!.forEach((child) => {
                    child.w2ui ??= {}
                    child.w2ui.parent_recid = rec.recid
                    child.w2ui.children ??= []
                })
                this.records.splice(ind + 1, 0, ...children!)
                if (this.total !== -1) {
                    this.total += children!.length
                }
                updated = true
            }
        }
        if (updated) {
            const url = this.url?.get ?? this.url
            if (!url) {
                this.localSort(true, true)
                if (this.searchData.length > 0) {
                    this.localSearch(true)
                }
            }
        }
    }

    sort(field?: string, direction?: 'asc' | 'desc' | '' | null, multiField?: boolean) { // if no params - clears sort
        // event before
        const edata = this.trigger('sort', { target: this.name, field, direction, multiField })
        if (edata.isCancelled === true) return
        // check if needed to quit
        if (field != null) {
            // default action
            let sortIndex = this.sortData.length
            for (let s = 0; s < this.sortData.length; s++) {
                if (this.sortData[s]!.field == field) {
                    sortIndex = s
                    break
                }
            }
            if (direction == null) {
                direction = this.sortData[sortIndex]?.direction
                if (direction == null) {
                    // save original sort, so it can be restored
                    if (this.last.originalSort == null) {
                        this.last.originalSort = this.records.map(rec => rec.recid)
                    }
                    direction = 'asc'
                } else {
                    switch (direction.toLowerCase()) {
                        case 'asc': {
                            direction = 'desc'
                            break
                        }
                        case 'desc': {
                            direction = ''
                            break
                        }
                        default: {
                            direction = 'asc'
                            break
                        }
                    }
                }
            }
            if (multiField != true) {
                this.sortData = []
                sortIndex = 0
            }
            if (direction === '') {
                this.sortData.splice(sortIndex, 1)
            } else {
                // set new sort
                this.sortData[sortIndex] ??= {} as W2GridSortData
                Object.assign(this.sortData[sortIndex]!, { field, direction })
            }
        } else {
            this.sortData = []
        }
        // if local
        const url = this.url?.get ?? this.url
        if (!url) {
            this.localSort(false, true)
            if (this.searchData.length > 0) this.localSearch(true)
            // reset vertical scroll
            this.last.vscroll.scrollTop = 0
            query(this.box).find(`#grid_${this.name}_records`).prop('scrollTop', 0)
            // event after
            edata.finish({ direction })
            this.refresh()
        } else {
            // event after
            edata.finish({ direction })
            this.last.fetch.offset = 0
            this.reload()
        }
    }

    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copy(flag: any, oEvent?: ClipboardEvent | any) {
        if (w2utils.isPlainObject(flag)) {
            // event after
            flag.finish()
            return flag.text
        }
        // generate text to copy
        const sel = this.getSelection()
        if (sel.length === 0) return ''
        let text = ''
        if (typeof sel[0] == 'object') { // cell copy
            // find min/max column
            let minCol = sel[0].column
            let maxCol = sel[0].column
            const recs   = []
            for (let s = 0; s < sel.length; s++) {
                if (sel[s].column < minCol) minCol = sel[s].column
                if (sel[s].column > maxCol) maxCol = sel[s].column
                if (recs.indexOf(sel[s].index) == -1) recs.push(sel[s].index)
            }
            recs.sort((a, b) => { return a-b }) // sort function must be for numerical sort
            for (let r = 0 ; r < recs.length; r++) {
                const ind = recs[r]
                for (let c = minCol; c <= maxCol; c++) {
                    const col = this.columns[c]!
                    if (col.hidden === true) continue
                    text += this.getCellCopy(ind, c) + '\t'
                }
                text  = text.substr(0, text.length-1) // remove last \t
                text += '\n'
            }
        } else { // row copy
            // copy headers
            for (let c = 0; c < this.columns.length; c++) {
                const col = this.columns[c]!
                if (col.hidden === true) continue
                let colName = (col.text ? col.text : col.field)
                if (col.text && col.text.length < 3 && col.tooltip) colName = col.tooltip // if column name is less then 3 char and there is tooltip - use it
                text += '"' + w2utils.stripTags(colName) + '"\t'
            }
            text  = text.substr(0, text.length-1) // remove last \t
            text += '\n'
            // copy selected text
            for (let s = 0; s < sel.length; s++) {
                const ind = this.get(sel[s], true)
                for (let c = 0; c < this.columns.length; c++) {
                    const col = this.columns[c]!
                    if (col.hidden === true) continue
                    text += '"' + this.getCellCopy(ind, c) + '"\t'
                }
                text  = text.substr(0, text.length-1) // remove last \t
                text += '\n'
            }
        }
        text = text.substr(0, text.length - 1)

        // if called without params
        let edata
        if (flag == null) {
            // before event
            edata = this.trigger('copy', { target: this.name, text: text,
                cut: (oEvent.keyCode == 88 ? true : false), originalEvent: oEvent })
            if (edata.isCancelled === true) return ''
            text = edata.detail['text'] as string
            // event after
            edata.finish()
            return text
        } else if (flag === false) { // only before event
            // before event
            edata = this.trigger('copy', { target: this.name, text: text,
                cut: (oEvent.keyCode == 88 ? true : false), originalEvent: oEvent })
            if (edata.isCancelled === true) return ''
            text = edata.detail['text'] as string
            return edata
        }
    }

    /**
     * Gets value to be copied to the clipboard
     * @param ind index of the record
     * @param col_ind index of the column
     * @returns the displayed value of the field's record associated with the cell
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellCopy(ind: any, col_ind: any) { // any: record index and column index
        return w2utils.stripTags(this.getCellHTML(ind, col_ind))
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paste(text: string, event?: ClipboardEvent | any) {
        const sel = this.getSelection()
        let ind: number = this.get(sel[0].recid, true) ?? 0
        const col = sel[0].column
        // before event
        const edata = this.trigger('paste', { target: this.name, text: text, index: ind, column: col, originalEvent: event })
        if (edata.isCancelled === true) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pasteText: any = edata.detail['text'] // any: reassigned from string to string[] after .split()
        // default action
        if (this.selectType == 'row' || sel.length === 0) {
            console.log('ERROR: You can paste only if grid.selectType = \'cell\' and when at least one cell selected.')
            // event after
            edata.finish()
            return
        }
        if (typeof pasteText !== 'object') {
            const newSel = []
            pasteText = pasteText.split('\n')
            for (let t = 0; t < pasteText.length; t++) {
                const tmp  = pasteText[t].split('\t')
                let cnt  = 0
                const rec  = this.records[ind]!
                const cols = []
                if (rec == null) continue
                for (let dt = 0; dt < tmp.length; dt++) {
                    if (!this.columns[col + cnt]) continue
                    setCellPaste(rec, this.columns[col + cnt]!.field, tmp[dt])
                    cols.push(col + cnt)
                    cnt++
                }
                for (let c = 0; c < cols.length; c++) newSel.push({ recid: rec.recid, column: cols[c] })
                ind++
            }
            this.selectNone(true) // no need to trigger select event
            this.select(newSel)
        } else {
            this.selectNone(true) // no need to trigger select event
            this.select([{ recid: this.records[ind]!.recid, column: col }])
        }
        this.refresh()
        // event after
        edata.finish()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function setCellPaste(rec: any, field: any, paste: any) { // any: record, field name, paste value
            rec.w2ui = rec.w2ui ?? {}
            rec.w2ui['changes'] = rec.w2ui['changes'] || {}
            rec.w2ui['changes'][field] = paste
        }
    }

    // ==================================================
    // --- Common functions

    resize() {
        const time = Date.now()
        // make sure the box is right
        if (!this.box || query(this.box).attr('name') != this.name) return
        // event before
        const edata = this.trigger('resize', { target: this.name })
        if (edata.isCancelled === true) return
        // resize
        if (this.box != null) {
            this.resizeBoxes()
            this.resizeRecords()
        }
        // event after
        edata.finish()
        return Date.now() - time
    }

    // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update({ cells, fullCellRefresh, ignoreColumns }: any = {}) {
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        if (this.box == null) return 0
        if (Array.isArray(cells)) {
            for (let i = 0; i < cells.length; i++) {
                const index  = cells[i].index
                const column = cells[i].column
                if (index < 0) continue
                if (index == null || column == null) {
                    console.log('ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]')
                    continue
                }
                const rec: W2GridRecord = this.records[index] ?? {} as W2GridRecord
                rec.w2ui = rec.w2ui ?? {}
                rec.w2ui['_update'] = rec.w2ui['_update'] ?? { cells: [] }
                let row1 = rec.w2ui['_update'].row1
                let row2 = rec.w2ui['_update'].row2
                if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
                    row1 = this.box.querySelector(`#grid_${this.name}_rec_${w2utils.escapeId(rec.recid)}`)
                    row2 = this.box.querySelector(`#grid_${this.name}_frec_${w2utils.escapeId(rec.recid)}`)
                    rec.w2ui['_update'].row1 = row1
                    rec.w2ui['_update'].row2 = row2
                }
                _update(rec, row1, row2, index, column)
            }
        } else {
            for (let i = (this.last.vscroll.recIndStart ?? 0) - 1; i <= (this.last.vscroll.recIndEnd ?? 0); i++) {
                let index = i
                if (this.last.searchIds.length > 0) { // if search is applied
                    index = this.last.searchIds[i] ?? i
                } else {
                    index = i
                }
                const rec = this.records[index]!
                if (index < 0 || rec == null) continue
                rec.w2ui = rec.w2ui ?? {}
                rec.w2ui['_update'] = rec.w2ui['_update'] ?? { cells: [] }
                let row1 = rec.w2ui['_update'].row1
                let row2 = rec.w2ui['_update'].row2
                if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
                    row1 = this.box.querySelector(`#grid_${this.name}_rec_${w2utils.escapeId(rec.recid)}`)
                    row2 = this.box.querySelector(`#grid_${this.name}_frec_${w2utils.escapeId(rec.recid)}`)
                    rec.w2ui['_update'].row1 = row1
                    rec.w2ui['_update'].row2 = row2
                }
                for (let column = 0; column < this.columns.length; column++) {
                    _update(rec, row1, row2, index, column)
                }
            }
        }
        return Date.now() - time

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _update(rec: any, row1: any, row2: any, index: any, column: any) { // any: selection update params
            const pcol = self.columns[column]
            if (Array.isArray(ignoreColumns) && (ignoreColumns.includes(column) || ignoreColumns.includes(pcol?.field))) {
                return
            }
            let cell = rec.w2ui['_update'].cells[column]
            if (cell == null || !cell.isConnected) {
                cell = self.box!.querySelector(`#grid_${self.name}_data_${index}_${column}`)
                rec.w2ui['_update'].cells[column] = cell
            }
            if (cell == null) return
            if (fullCellRefresh) {
                query(cell).replace(self.getCellHTML(index, column, false))
                // need to reselect as it was replaced
                cell = self.box!.querySelector(`#grid_${self.name}_data_${index}_${column}`)
                rec.w2ui['_update'].cells[column] = cell
            } else {
                const div = cell.children[0] // there is always a div inside a cell
                // value, attr, style, className, divAttr -- all on TD level except divAttr
                const { value, style, className } = self.getCellValue(index, column, false, true)
                if (div.innerHTML != value) {
                    div.innerHTML = value
                }
                if (style != '' && cell.style.cssText != style) {
                    cell.style.cssText = style
                }
                if (className != '') {
                    const ignore = ['w2ui-grid-data']
                    const remove: string[] = []
                    const add = className.split(' ').filter((cl: string) => !!cl) // remove empty
                    cell.classList.forEach((cl: string) => { if (!ignore.includes(cl)) remove.push(cl) })
                    cell.classList.remove(...remove)
                    cell.classList.add(...add)
                }
            }
            // column styles if any (lower priority)
            if (self.columns[column]?.style && self.columns[column]?.style != cell.style.cssText) {
                cell.style.cssText = self.columns[column]?.style ?? ''
            }
            // record class if any
            if (rec.w2ui.class != null) {
                if (typeof rec.w2ui.class == 'string') {
                    const ignore = ['w2ui-odd', 'w2ui-even', 'w2ui-record']
                    const remove: string[] = []
                    const add = rec['w2ui']['class'].split(' ').filter((cl: string) => !!cl) // remove empty
                    if (row1 && row2) {
                        row1.classList.forEach((cl: string) => { if (!ignore.includes(cl)) remove.push(cl) })
                        row1.classList.remove(...remove)
                        row1.classList.add(...add)
                        row2.classList.remove(...remove)
                        row2.classList.add(...add)
                    }
                }
                if (w2utils.isPlainObject(rec.w2ui.class) && typeof rec.w2ui.class[pcol?.field ?? ''] == 'string') {
                    const ignore = ['w2ui-grid-data']
                    const remove: string[] = []
                    const add = rec['w2ui']['class'][pcol!.field].split(' ').filter((cl: string) => !!cl)
                    cell.classList.forEach((cl: string) => { if (!ignore.includes(cl)) remove.push(cl) })
                    cell.classList.remove(...remove)
                    cell.classList.add(...add)
                }
            }
            // record styles if any
            if (rec.w2ui.style != null || rec.w2ui.styles != null) {
                if (row1 && row2 && typeof rec.w2ui.style == 'string' && row1.style.cssText !== rec.w2ui.style) {
                    row1.style.cssText = 'height: '+ self.recordHeight + 'px;' + rec.w2ui.style
                    row1.setAttribute('custom_style', rec.w2ui.style)
                    row2.style.cssText = 'height: '+ self.recordHeight + 'px;' + rec.w2ui.style
                    row2.setAttribute('custom_style', rec.w2ui.style)
                }
                if (rec.w2ui.styles == null) {
                    rec.w2ui.styles = rec.w2ui.style
                }
                if (w2utils.isPlainObject(rec.w2ui.styles) && typeof rec.w2ui.styles[pcol?.field ?? ''] == 'string'
                        && cell.style.cssText !== rec.w2ui.styles[pcol?.field ?? '']) {
                    cell.style.cssText = rec.w2ui.styles[pcol!.field]
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refreshCell(recid: any, field: any) { // any: recid is string|number; field is string
        const index = this.get(recid, true)
        const col_ind = this.getColumn(field, true)
        if (index == null || col_ind == null) return false
        const isSummary = (this.records[index] && this.records[index]!.recid == recid ? false : true)
        const cell = query(this.box).find(`${isSummary ? '.w2ui-grid-summary ' : ''}#grid_${this.name}_data_${index}_${col_ind}`)
        if (cell.length == 0) return false
        // set cell html and changed flag
        cell.replace(this.getCellHTML(index, col_ind, isSummary))
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refreshRow(recid: any, ind: any = null) { // any: recid is string|number; ind is number
        let tr1 = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid))
        let tr2 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(recid))
        if (tr1.length > 0) {
            if (ind == null) ind = this.get(recid, true)
            const line = tr1.attr('line')
            const isSummary = (this.records[ind] && this.records[ind]!.recid == recid ? false : true)
            // if it is searched, find index in search array
            const url = this.url?.get ?? this.url
            if (this.searchData.length > 0 && !url) for (let s = 0; s < this.last.searchIds.length; s++) if (this.last.searchIds[s] == ind) ind = s
            const rec_html = this.getRecordHTML(ind, line, isSummary)
            tr1.replace(rec_html[0])
            tr2.replace(rec_html[1])
            // apply style to row if it was changed in render functions
            let st = (this.records[ind]!.w2ui ? this.records[ind]!.w2ui!['style'] : '')
            if (typeof st == 'string') {
                tr1 = query(this.box).find('#grid_'+ this.name +'_frec_'+ w2utils.escapeId(recid))
                tr2 = query(this.box).find('#grid_'+ this.name +'_rec_'+ w2utils.escapeId(recid))
                tr1.attr('custom_style', st)
                tr2.attr('custom_style', st)
                if (tr1.hasClass('w2ui-selected')) {
                    st = st.replace('background-color', 'none')
                }
                tr1[0].style.cssText = 'height: '+ this.recordHeight + 'px;' + st
                tr2[0].style.cssText = 'height: '+ this.recordHeight + 'px;' + st
            }
            if (isSummary) {
                this.resize()
            }
            return true
        }
        return false
    }

    refresh() {
        const time = Date.now()
        const url  = this.url?.get ?? this.url
        if (this.total <= 0 && !url && this.searchData.length === 0) {
            this.total = this.records.length
        }
        if (!this.box) return
        // event before
        const edata = this.trigger('refresh', { target: this.name })
        if (edata.isCancelled === true) return
        // -- header
        if (this.show.header) {
            query(this.box).find(`#grid_${this.name}_header`).html(w2utils.lang(this.header) +'&#160;').show()
        } else {
            query(this.box).find(`#grid_${this.name}_header`).hide()
        }
        // -- toolbar
        if (this.show.toolbar) {
            query(this.box).find('#grid_'+ this.name +'_toolbar').show()
        } else {
            query(this.box).find('#grid_'+ this.name +'_toolbar').hide()
        }
        // -- make sure search is closed
        this.searchClose()
        // --- default search field
        const getFirstSearchField = () => {
            let tmp = 0
            while (tmp < this.searches.length && (this.searches[tmp]!.hidden || this.searches[tmp]!['simple'] === false)) {
                tmp++
            }
            if (tmp >= this.searches.length) return { field: '', label: '' } // all searches are hidden or simple
            return this.searches[tmp]!
        }
        if (!this.multiSearch && this.last.field == 'all') {
            const fld = getFirstSearchField()
            this.last.field = fld.field
            this.last.label = fld.label ?? ''
        }
        if (this.last.field == 'all' && !this.show.searchAll) {
            this.last.field = ''
        }
        if (!this.last.field) {
            if (this.show.searchAll) {
                this.last.field = 'all'
                this.last.label = 'All Fields'
            } else {
                const fld = getFirstSearchField()
                this.last.field = fld.field
                this.last.label = fld.label ?? ''
            }
        }
        const sInput = query(this.box).find('#grid_'+ this.name +'_search_all')
        // find right search label
        for (let ss = 0; ss < this.searches.length; ss++) {
            if (this.searches[ss]!.field == this.last.field) {
                this.last.label = this.searches[ss]!.label ?? ''
            }
        }
        if (this.last.multi) {
            sInput.attr('placeholder', '[' + w2utils.lang('Multiple Fields') + ']')
        } else {
            sInput.attr('placeholder', w2utils.lang('Search') + ' ' + w2utils.lang(this.last.label, true))
        }
        if (sInput.val() != this.last.search) {
            let val = this.last.search
            const tmp = sInput._w2field
            if (tmp) val = tmp.format(val)
            sInput.val(val)
        }

        this.refreshSearch()
        this.refreshBody()

        // -- footer
        if (this.show.footer) {
            query(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show()
        } else {
            query(this.box).find(`#grid_${this.name}_footer`).hide()
        }
        // all selected?
        const sel = this.last.selection,
            areAllSelected = (this.records.length > 0 && sel.indexes.length == this.records.length),
            areAllSearchedSelected = (sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length)
        if (areAllSelected || areAllSearchedSelected) {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', true)
        } else {
            query(this.box).find('#grid_'+ this.name +'_check_all').prop('checked', false)
        }
        // show number of selected
        this.status()
        // collapse all records
        const rows = this.find({ 'w2ui.expanded': true }, true, true)
        for (let r = 0; r < rows.length; r++) {
            const tmp = this.records[rows[r]! as number]!.w2ui
            if (tmp && !Array.isArray(tmp.children)) {
                tmp.expanded = false
            }
        }
        // mark selection
        if (this.markSearch) {
            setTimeout(() => {
                // mark all search strings
                const search = []
                for (let s = 0; s < this.searchData.length; s++) {
                    const sdata = this.searchData[s]!
                    const fld   = this.getSearch(sdata.field)
                    if (!fld || fld.hidden) continue
                    const ind = this.getColumn(sdata.field, true)
                    search.push({ field: sdata.field, search: sdata['value'], col: ind })
                }
                if (search.length > 0) {
                    search.forEach((item) => {
                        const el = query(this.box).find('td[col="'+ item.col +'"]:not(.w2ui-head)')
                        w2utils.marker(el, item.search)
                    })
                }
            }, 50)
        }
        this.updateToolbar(this.last.selection)
        // event after
        edata.finish()
        this.resize()
        this.addRange('selection')
        setTimeout(() => { // allow to render first
            this.resize() // needed for horizontal scroll to show (do not remove)
            this.scroll()
        }, 1)

        if (this.reorderColumns && !this.last.columnDrag) {
            this.last.columnDrag = this.initColumnDrag()
        } else if (!this.reorderColumns && this.last.columnDrag) {
            this.last.columnDrag.remove()
        }
        return Date.now() - time
    }

    refreshSearch() {
        if (this.multiSearch && this.searchData.length > 0) {
            if (query(this.box).find('.w2ui-grid-searches').length == 0) {
                query(this.box).find('.w2ui-grid-toolbar')
                    .css('height', (this.last.toolbar_height + 35) + 'px')
                    .append(`<div id="grid_${this.name}_searches" class="w2ui-grid-searches"></div>`)

            }
            let searches = `
                <span id="grid_${this.name}_search_logic" class="w2ui-grid-search-logic"></span>
                <div class="grid-search-line"></div>`
            this.searchData.forEach((sd, sd_ind) => {
                const ind = this.getSearch(sd.field, true)
                const sf = ind != null ? this.searches[ind] : null
                let display
                if (sf?.type == 'enum' && Array.isArray(sd.value)) {
                    display = `<span class="grid-search-count">${sd.value.length}</span>`
                } else if (sf?.type == 'list') {
                    display = !!sd.text && sd.text !== sd.value ? `: ${sd.text}` : `: ${sd.value}`
                } else {
                    display = `: ${sd.value}`
                }
                if (sf && sf.type == 'date') {
                    if (sd.operator == 'between') {
                        let dsp1 = sd.value[0]
                        let dsp2 = sd.value[1]
                        if (Number(dsp1) === dsp1) {
                            dsp1 = w2utils.formatDate(dsp1)
                        }
                        if (Number(dsp2) === dsp2) {
                            dsp2 = w2utils.formatDate(dsp2)
                        }
                        display = `: ${dsp1} - ${dsp2}`
                    } else {
                        let dsp = sd.value
                        if (Number(dsp) == dsp) {
                            dsp = w2utils.formatDate(dsp)
                        }
                        let oper = sd.operator
                        if (oper == 'more') oper = 'since'
                        if (oper == 'less') oper = 'before'
                        if (oper.substr(0, 5) == 'more:') {
                            oper = 'since'
                        }
                        if (oper == 'null') dsp = ''
                        if (oper == 'not null') dsp = ''
                        display = `: ${oper} ${dsp}`
                    }
                }
                searches += `<span class="w2ui-action" data-click="searchFieldTooltip|${ind}|${sd_ind}|this">
                    ${sf ? (sf.label ?? sf.field) : sd.field}
                    ${display}
                    <span class="icon-chevron-down"></span>
                </span>`
            })
            // clear and save
            searches += `
                ${this.show.searchSave
                    ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave" type="button">${w2utils.lang('Save')}</button>
                      `
                    : ''
                }
                <button class="w2ui-btn grid-search-btn btn-remove" type="button"
                    data-click="searchReset">X</button>
            `
            query(this.box).find(`#grid_${this.name}_searches`).html(searches)
            query(this.box).find(`#grid_${this.name}_search_logic`).html(w2utils.lang(this.last.logic == 'AND' ? 'All' : 'Any'))
        } else {
            query(this.box).find('.w2ui-grid-toolbar')
                .css('height', this.last.toolbar_height + 'px')
                .find('.w2ui-grid-searches')
                .remove()
        }
        if (this['searchSelected']) {
            query(this.box).find(`#grid_${this.name}_search_all`).val(' ').prop('readOnly', true)
            query(this.box).find(`#grid_${this.name}_search_name`).show().find('.name-text').html(this['searchSelected'].text)
        } else {
            query(this.box).find(`#grid_${this.name}_search_all`).prop('readOnly', false)
            query(this.box).find(`#grid_${this.name}_search_name`).hide().find('.name-text').html('')
        }
        w2utils.bindEvents(query(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this)
    }

    refreshBody() {
        this.updateExpanded()
        this.scroll() // need to calculate virtual scrolling for columns
        const recHTML  = this.getRecordsHTML()
        const colHTML  = this.getColumnsHTML()
        const bodyHTML =
            '<div id="grid_'+ this.name +'_frecords" class="w2ui-grid-frecords" style="margin-bottom: '+ ((w2utils.scrollBarSize() as number) - 1) +'px;">'+
                recHTML[0] +
            '</div>'+
            '<div id="grid_'+ this.name +'_records" class="w2ui-grid-records">' +
                recHTML[1] +
            '</div>'+
            '<div id="grid_'+ this.name +'_scroll1" class="w2ui-grid-scroll1" style="height: '+ w2utils.scrollBarSize() +'px"></div>'+
            // Columns need to be after to be able to overlap
            '<div id="grid_'+ this.name +'_fcolumns" class="w2ui-grid-fcolumns">'+
            '    <table><tbody>'+ colHTML[0] +'</tbody></table>'+
            '</div>'+
            '<div id="grid_'+ this.name +'_columns" class="w2ui-grid-columns">'+
            '    <table><tbody>'+ colHTML[1] +'</tbody></table>'+
            '</div>'+
            `<div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`

        const gridBody = query(this.box).find(`#grid_${this.name}_body`, this.box).html(bodyHTML)
        const records  = query(this.box).find(`#grid_${this.name}_records`, this.box)
        const frecords = query(this.box).find(`#grid_${this.name}_frecords`, this.box)
        if (this.selectType == 'row') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            records.on('mouseover mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                const ind = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = this.records[ind]?.recid
                query(this.box).find(`#grid_${this.name}_frec_${w2utils.escapeId(recid)}`)
                    .toggleClass('w2ui-record-hover', event.type == 'mouseover')
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            frecords.on('mouseover mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                const ind = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = this.records[ind]?.recid
                query(this.box).find(`#grid_${this.name}_rec_${w2utils.escapeId(recid)}`)
                    .toggleClass('w2ui-record-hover', event.type == 'mouseover')
            })
        }
        if (w2utils.isMobile) {
            records.append(frecords)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('click', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                    const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    this.click(recid, event)
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('touchstart', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension + TouchEvent props
                    const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    // emulate double click
                    if (this.last['mobile_touch'] && Date.now() - this.last['mobile_touch'] < 350) {
                        event.preventDefault()
                        this.dblClick(recid, event)
                    }
                    this.last['mobile_touch'] = Date.now()
                    setTimeout(() => this.last['mobile_touch'] = null, 350)
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('contextmenu', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                    const index = parseInt(query(event.delegate).attr('index')) // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    const td = query(event.target).closest('td')
                    const column = td.attr('col') ? parseInt(td.attr('col')) : undefined
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ctxOpts: any = { index } // any: exactOptionalPropertyTypes — build opts conditionally
                    if (recid != null) ctxOpts.recid = recid
                    if (column != null) ctxOpts.column = column
                    this.showContextMenu(event, ctxOpts)
                })
        } else {
            records.add(frecords)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('click', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                    const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    // do not generate click if empty record is clicked
                    if (recid != '-none-' && !this.last.inEditMode) {
                        this.click(recid, event)
                    }
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('contextmenu', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                    const index = parseInt(query(event.delegate).attr('index')) // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    const td = query(event.target).closest('td')
                    const column = td.attr('col') ? parseInt(td.attr('col')) : undefined
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ctxOpts: any = { index } // any: exactOptionalPropertyTypes — build opts conditionally
                    if (recid != null) ctxOpts.recid = recid
                    if (column != null) ctxOpts.column = column
                    this.showContextMenu(event, ctxOpts)
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('mouseover', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                    this.last['rec_out'] = false
                    const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    if (index !== this.last['rec_over']) {
                        this.last['rec_over'] = index
                        // setTimeout is needed for correct event order enter/leave
                        setTimeout(() => {
                            delete this.last['rec_out']
                            const edata = this.trigger('mouseEnter', { target: this.name, originalEvent: event, index, recid })
                            edata.finish()
                        })
                    }
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                    const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                    const recid = this.records[index]?.recid
                    this.last['rec_out'] = true
                    // setTimeouts are needed for correct event order enter/leave
                    setTimeout(() => {
                        const recLeave = () => {
                            const edata = this.trigger('mouseLeave', { target: this.name, originalEvent: event, index, recid })
                            edata.finish()
                        }
                        if (index !== this.last['rec_over']) {
                            recLeave()
                        }
                        setTimeout(() => {
                            if (this.last['rec_out']) {
                                delete this.last['rec_out']
                                delete this.last['rec_over']
                                recLeave()
                            }
                        })
                    })
                })
        }

        // enable scrolling on frozen records,
        gridBody
            .data('scroll', { lastDelta: 0, lastTime: 0 })
            .find('.w2ui-grid-frecords')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mousewheel DOMMouseScroll ', (event: any) => { // any: WheelEvent or MouseEvent, browser-specific
                event.preventDefault()
                // TODO: improve, scroll is not smooth, if scrolled to the end, it takes a while to return
                const scroll = gridBody.data('scroll')
                const container = gridBody.find('.w2ui-grid-records')
                let amount = typeof event.wheelDelta != 'undefined' ? -event.wheelDelta : (event.detail || event.deltaY)
                const newScrollTop = container.prop('scrollTop')

                scroll.lastDelta += amount
                amount = Math.round(scroll.lastDelta)
                gridBody.data('scroll', scroll)

                // make scroll amount dependent on visible rows
                // amount *= (Math.round(records.prop('clientHeight') / self.recordHeight) - 1) * self.recordHeight / 4
                container.get(0).scroll({ top: newScrollTop + amount, behavior: 'smooth' })
            })
        // scroll on records (and frozen records)
        records.off('.body-global')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('scroll.body-global', { delegate: '.w2ui-grid-records' }, (event: any) => { // any: event.delegate Query extension
                this.scroll(event)
            })

        query(this.box).find('.w2ui-grid-body') // gridBody
            .off('.body-global')
            // header column click
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.body-global dblclick.body-global contextmenu.body-global', { delegate: 'td.w2ui-head' }, (event: any) => { // any: event.delegate Query extension
                const col_ind = parseInt(query(event.delegate).attr('col'))
                const col = this.columns[col_ind] ?? { field: String(col_ind) } // it could be line number
                switch (event.type) {
                    case 'click':
                        this.columnClick(col.field, event)
                        break
                    case 'dblclick':
                        this.columnDblClick(col.field, event)
                        break
                    case 'contextmenu':
                        if (this.show.columnMenu) {
                            this.columnContextMenu(col.field, event)
                        } else {
                            this.showContextMenu(event, { column: col_ind ?? undefined })
                        }
                        break

                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseover.body-global', { delegate: '.w2ui-col-header' }, (event: any) => { // any: event.delegate Query extension
                const col = query(event.delegate).parent().attr('col')
                this.columnTooltipShow(col, event)
                query(event.delegate)
                    .off('.tooltip')
                    .on('mouseleave.tooltip', () => {
                        this.columnTooltipHide(col, event)
                    })
            })
            // select all
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.body-global', { delegate: 'input.w2ui-select-all' }, (event: any) => { // any: event.delegate Query extension
                if (event.delegate.checked) { this.selectAll() } else { this.selectNone() }
                event.stopPropagation()
                clearTimeout(this.last.kbd_timer ?? undefined) // keep grid in focus
            })
            // tree-like grid (or expandable column) expand/collapse
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.body-global', { delegate: '.w2ui-show-children, .w2ui-col-expand' }, (event: any) => { // any: event.delegate Query extension
                event.stopPropagation()
                const ind = query(event.target).parents('tr').attr('index')
                this.toggle(this.records[ind]!.recid)
            })
            // info bubbles
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.body-global mouseover.body-global', { delegate: '.w2ui-info' }, (event: any) => { // any: event.delegate Query extension
                const td = query(event.delegate).closest('td')
                const tr = td.parent()
                const col = this.columns[td.attr('col')]
                const isSummary = tr.parents('.w2ui-grid-body').hasClass('w2ui-grid-summary')
                if (['mouseenter', 'mouseover'].includes(col?.['info']?.showOn?.toLowerCase()) && event.type == 'mouseover') {
                    this.showBubble(parseInt(tr.attr('index')), parseInt(td.attr('col')), isSummary)
                        .then(() => {
                            query(event.delegate)
                                .off('.tooltip')
                                .on('mouseleave.tooltip', () => { w2tooltip.hide(this.name + '-bubble') })
                        })
                } else if (event.type == 'click') {
                    w2tooltip.hide(this.name + '-bubble')
                    this.showBubble(parseInt(tr.attr('index')), parseInt(td.attr('col')), isSummary)
                }
            })
            // clipborad copy icon
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseover.body-global', { delegate: '.w2ui-clipboard-copy' }, (event: any) => { // any: event.delegate Query extension
                if (event.delegate._tooltipShow) return
                const td = query(event.delegate).parent()
                const tr = td.parent()
                const col = this.columns[td.attr('col')]
                const isSummary = tr.parents('.w2ui-grid-body').hasClass('w2ui-grid-summary')

                w2tooltip.show({
                    name: this.name + '-bubble',
                    anchor: event.delegate,
                    html: w2utils.lang(typeof col?.clipboardCopy == 'string' ? col.clipboardCopy : 'Copy to clipboard'),
                    position: 'top|bottom',
                    offsetY: -2
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .hide((_evt: any) => { // any: w2tooltip hide event
                    event.delegate._tooltipShow = false
                    query(event.delegate).off('.tooltip')
                })

                query(event.delegate)
                    .off('.tooltip')
                    .on('mouseleave.tooltip', (_evt: Event) => {
                        w2tooltip.hide(this.name + '-bubble')
                    })
                    .on('click.tooltip', (evt: Event) => {
                        evt.stopPropagation()
                        w2tooltip.update(this.name + '-bubble', w2utils.lang('Copied'))
                        this.clipboardCopy(tr.attr('index'), td.attr('col'), isSummary)
                    })
                event.delegate._tooltipShow = true
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click.body-global', { delegate: '.w2ui-editable-checkbox' }, (event: any) => { // any: event.delegate Query extension
                const dt = query(event.delegate).data()
                this.editChange.call(this, event.delegate, dt.changeind, dt.colind, event)
                this.updateToolbar()
            })

        // show empty message
        if (this.records.length === 0 && this.msgEmpty) {
            query(this.box).find(`#grid_${this.name}_body`)
                .append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${w2utils.lang(this.msgEmpty)}</div></div>`)
        } else if (query(this.box).find(`#grid_${this.name}_empty_msg`).length > 0) {
            query(this.box).find(`#grid_${this.name}_empty_msg`).remove()
        }
        // show summary records
        if (this.summary.length > 0) {
            const sumHTML = this.getSummaryHTML()
            query(this.box).find(`#grid_${this.name}_fsummary`).html(sumHTML?.[0] ?? '').show()
            query(this.box).find(`#grid_${this.name}_summary`).html(sumHTML?.[1] ?? '').show()
        } else {
            query(this.box).find(`#grid_${this.name}_fsummary`).hide()
            query(this.box).find(`#grid_${this.name}_summary`).hide()
        }
    }

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
            .addClass('w2ui-reset w2ui-grid w2ui-inactive')
            .html('<div class="w2ui-grid-box">'+
                  '    <div id="grid_'+ this.name +'_header" class="w2ui-grid-header"></div>'+
                  '    <div id="grid_'+ this.name +'_toolbar" class="w2ui-grid-toolbar"></div>'+
                  '    <div id="grid_'+ this.name +'_body" class="w2ui-grid-body"></div>'+
                  '    <div id="grid_'+ this.name +'_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>'+
                  '    <div id="grid_'+ this.name +'_summary" class="w2ui-grid-body w2ui-grid-summary"></div>'+
                  '    <div id="grid_'+ this.name +'_footer" class="w2ui-grid-footer"></div>'+
                  '    <textarea id="grid_'+ this.name +'_focus" class="w2ui-grid-focus-input" '+
                            (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : '')+
                            (w2utils.isMobile ? 'readonly' : '') +'></textarea>'+ // readonly needed on android not to open keyboard
                  '</div>')
        if (this.selectType != 'row') query(this.box).addClass('w2ui-ss')
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
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
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
                    // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(w2ui[this.name] as any).paste(items2send, event)
                    event.preventDefault()
                }
            })
            .on('keydown', function (event: Event) {
                // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(w2ui[obj.name] as any).keydown.call(w2ui[obj.name], event)
            })
        // init mouse events for mouse selection
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
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
                query(obj.box).find('.w2ui-grid-body').css('user-select', 'none')
            }
            // regular record select
            if (obj.selectType == 'row' && (query(event.target).parents().hasClass('w2ui-head') || query(event.target).hasClass('w2ui-head'))) return
            if (obj.last.move && obj.last.move.type == 'expand') return
            // if altKey - alow text selection
            if (event.altKey) {
                query(obj.box).find('.w2ui-grid-body').css('user-select', 'text')
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
                    if (tmp.classList && tmp.classList.contains('w2ui-grid')) break
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
                        class: 'w2ui-selection-preview'
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
                        class: 'w2ui-selection-preview'
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
                    if ($owner.hasClass('w2ui-grid-records') || $owner.hasClass('w2ui-grid-frecords')
                            || $owner.hasClass('w2ui-grid-columns') || $owner.hasClass('w2ui-grid-fcolumns')
                            || $owner.hasClass('w2ui-grid-summary')) {
                        sLeft = obj.last.move.focusX - query(obj.box).find('#grid_'+ obj.name +'_records').prop('scrollLeft')
                        sTop  = obj.last.move.focusY - query(obj.box).find('#grid_'+ obj.name +'_records').prop('scrollTop')
                    }
                    if (query(target).hasClass('w2ui-grid-footer') || query(target).parents('div.w2ui-grid-footer').length > 0) {
                        sTop = query(obj.box).find('#grid_'+ obj.name +'_footer').get(0).offsetTop
                    }
                    // if clicked on toolbar
                    if ($owner.hasClass('w2ui-scroll-wrapper') && $owner.parent().hasClass('w2ui-toolbar')) {
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
                if (query(el).hasClass('w2ui-col-number') || query(el).hasClass('w2ui-col-order')) {
                    //multiple rows reordering
                    //obj.selectNone()
                    let sel = obj.getSelection()
                    if (sel.length > 0 && typeof sel[0] == 'object') {
                        obj.select([...new Set(sel.map(r => r.recid))])
                        sel = [...new Set(obj.getSelection().map(r => r.recid))]
                    }
                    if (sel.indexOf(obj.last.move.recid) == -1) {
                        obj.selectNone()
                        obj.select([obj.last.move.recid])
                        sel = [obj.last.move.recid]
                    }
                    //select children
                    // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const new_sel: any[] = []
                    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const selectExpandedChildren = (recid: any) => {
                        const rec = obj.get(recid)
                        if (rec?.w2ui?.children) {
                            rec.w2ui.children.forEach(c => {
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
                    const eColor = query(obj.box).find('.w2ui-even.w2ui-empty-record').css('background-color')
                    const oColor = query(obj.box).find('.w2ui-odd.w2ui-empty-record').css('background-color')
                    query(obj.box).find('.w2ui-even td').filter(':not(.w2ui-col-number)').css('background-color', eColor)
                    query(obj.box).find('.w2ui-odd td').filter(':not(.w2ui-col-number)').css('background-color', oColor)
                    // display empty record and ghost record
                    const mv = obj.last.move
                    const recs = query(obj.box).find('.w2ui-grid-records')
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
                            row.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${(obj.recordHeight - 2)}px"></div></td>`)
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
                .on('mousemove.w2ui-' + obj.name, mouseMove)
                .on('mouseup.w2ui-' + obj.name, mouseStop)
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
                    query(obj.box).find('.w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header').removeClass('w2ui-col-selected')
                    query(obj.box).find('.w2ui-col-number').removeClass('w2ui-row-selected')
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
                                class: 'w2ui-selection-preview'
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
                        class: 'w2ui-selection-preview'
                    })
                    mv.newRange = newSel
                } else {
                    if (obj.multiSelect) {
                        const sel = obj.getSelection()
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
            if (query(event.target).parents().hasClass('.w2ui-head') || query(event.target).hasClass('.w2ui-head')) return
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
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const ind1 = mv.from.map((recid: any) => obj.get(recid, true))
                        let ind2 = obj.get(mv.to, true)
                        if (mv.to == 'bottom') ind2 = obj.records.length // end of list
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
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
                            .find(`#grid_${obj.name}_columns .w2ui-col-header`)
                            .removeClass('w2ui-col-sorted')
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
            query(document).off('.w2ui-' + obj.name)
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

    destroy() {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        // clean up
        this.toolbar?.destroy?.()
        if (query(this.box).find(`#grid_${this.name}_body`).length > 0) {
            this.unmount()
        }
        delete w2ui[this.name]
        // event after
        edata.finish()
    }

    // ===========================================
    // --- Internal Functions

    initColumnOnOff() {
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = [
            { id: 'line-numbers', text: 'Line #', checked: this.show.lineNumbers }
        ]
        // columns
        for (let c = 0; c < this.columns.length; c++) {
            const col = this.columns[c]!
            let text = col.text
            if (col.hideable === false) continue
            if (!text && col.tooltip) text = col.tooltip
            if (!text) text = '- column '+ (c + 1) +' -'
            items.push({ id: col.field, text: w2utils.stripTags(text as string), checked: !col.hidden })
        }
        const url = this.url?.get ?? this.url
        if ((url && this.show.skipRecords) || this.show.saveRestoreState) {
            items.push({ text: '--' })
        }
        // skip records
        if (this.show.skipRecords) {
            const skip = w2utils.lang('Skip') +
                `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` +
                w2utils.lang('records')
            items.push({ id: 'w2ui-skip', text: skip, group: false, icon: 'w2ui-icon-empty' })
        }
        // save/restore state
        if (this.show.saveRestoreState) {
            items.push(
                { id: 'w2ui-stateSave', text: w2utils.lang('Save Grid State'), icon: 'w2ui-icon-empty', group: false },
                { id: 'w2ui-stateReset', text: w2utils.lang('Restore Default State'), icon: 'w2ui-icon-empty', group: false }
            )
        }
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selected: any[] = []
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any) => {
            item.text = w2utils.lang(item.text) // translate
            if (item.checked) selected.push(item.id)
        })
        this.toolbar.set('w2ui-column-on-off', { selected, items })
        return items
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initColumnDrag(_box?: any) {
        // throw error if using column groups
        if (this.columnGroups && this.columnGroups.length) {
            throw 'Draggable columns are not currently supported with column groups.'
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        let dragData: {
            // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pressed: boolean; targetPos: any; columnHead: any; [key: string]: any
        } = {
            pressed: false,
            targetPos: null,
            columnHead: null
        }
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasInvalidClass = (target: any, lastColumn?: any) => {
            const iClass = ['w2ui-col-number', 'w2ui-col-expand', 'w2ui-col-select']
            if (lastColumn !== true) iClass.push('w2ui-head-last')
            for (let i = 0; i < iClass.length; i++) {
                if (query(target).closest('.w2ui-head').hasClass(iClass[i])) {
                    return true
                }
            }
            return false
        }

        // attach original event listener
        query(self.box)
            .off('.colDrag')
            .on('mousedown.colDrag', dragColStart)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function dragColStart(event: any) { // any: DragEvent at runtime
            if (dragData.pressed || dragData['numberPreColumnsPresent'] === 0 || event.button !== 0) return

            const preColHeadersSelector = '.w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select'

            // do nothing if it is not a header
            if (!query(event.target).parents().hasClass('w2ui-head') || hasInvalidClass(event.target)) return

            dragData.pressed = true
            dragData['initialX'] = event.pageX
            dragData['initialY'] = event.pageY
            dragData['numberPreColumnsPresent'] = query(self.box).find(preColHeadersSelector).length

            // start event for drag start
            const origColumn = dragData.columnHead = query(event.target).closest('.w2ui-head')
            const origColumnNumber = dragData['originalPos'] = parseInt(origColumn.attr('col'), 10)
            const edata = self.trigger('columnDragStart', { originalEvent: event, origColumnNumber, target: origColumn[0] })
            if (edata.isCancelled === true) return false

            const columns = dragData['columns'] = query(self.box).find('.w2ui-head:not(.w2ui-head-last)')

            // add events
            query(document).on('mouseup.colDrag', dragColEnd)
            query(document).on('mousemove.colDrag', dragColOver)

            const col = self.columns[dragData['originalPos']]!
            const colText = w2utils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
            dragData['ghost'] = _queryRaw.html(`<span col="${dragData['originalPos']}">${colText}</span>`)[0]

            query(document.body).append(dragData['ghost'])
            query(dragData['ghost'])
                .css({
                    display: 'none',
                    left: event.pageX,
                    top: event.pageY,
                    opacity: 1,
                    margin: '3px 0 0 20px',
                    padding: '3px',
                    'background-color': 'white',
                    position: 'fixed',
                    'z-index': 999999,
                })
                .addClass('.w2ui-grid-ghost')


            // establish current offsets
            dragData['offsets'] = []
            for (let i = 0, l = columns.length; i < l; i++) {
                const rect = columns[i].getBoundingClientRect()
                dragData['offsets'].push(rect.left)
            }
            // conclude event
            edata.finish()
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function dragColOver(event: any) { // any: DragEvent at runtime
            if (!dragData.pressed || !dragData.columnHead) return
            const cursorX = event.pageX
            const cursorY = event.pageY
            if (!hasInvalidClass(event.target, true)) {
                markIntersection(event)
            }
            trackGhost(cursorX, cursorY)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function dragColEnd(event: any) { // any: DragEvent at runtime
            if (!dragData.pressed || !dragData.columnHead) return
            dragData.pressed = false

            let target
            const finish = () => {
                const ghosts = query(self.box).find('.w2ui-grid-ghost')
                query(self.box).find('.w2ui-intersection-marker').hide()
                query(dragData['ghost']).remove()
                ghosts.remove()

                // dragData.columns.css({ overflow: '' }).children('div').css({ overflow: '' });
                query(document).off('.colDrag')
                // any: cast-to-any for return-position narrowing; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dragData = {} as any
            }

            // if no move, then click event for sorting
            if (event.pageX == dragData['initialX'] && event.pageY == dragData['initialY']) {
                self.columnClick(self.columns[dragData['originalPos']]!.field, event)
                finish()
                return
            }

            // start event for drag start
            const edata = self.trigger('columnDragEnd', { originalEvent: event, target: dragData.columnHead[0], dragData })
            if (edata.isCancelled === true) return false

            const selected = self.columns[dragData['originalPos']]!
            const columnConfig = self.columns

            if (dragData['originalPos'] != dragData.targetPos && dragData.targetPos != null) {
                columnConfig.splice(dragData.targetPos, 0, w2utils.clone(selected))
                columnConfig.splice(columnConfig.indexOf(selected), 1)
            }
            finish()

            self.refresh()
            edata.finish({ targetColumn: (target ?? 1) - 1 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function markIntersection(event: any) { // any: MouseEvent at runtime
            // if mouse over is not over table
            if (query(event.target).closest('td').length == 0) {
                return
            }
            const td = query(event.target).closest('td')
            const newPos = td.hasClass('w2ui-head-last') ? self.columns.length : parseInt(td.attr('col'))
            if (dragData.targetPos != newPos) {
                // if mouse over invalid column
                const rect1 = query(self.box).find('.w2ui-grid-body').get(0).getBoundingClientRect()
                const rect2 = query(event.target).closest('td').get(0).getBoundingClientRect()
                query(self.box).find('.w2ui-intersection-marker')
                    .show()
                    .css({
                        left: (rect2.left - rect1.left) + 'px',
                        height:rect2.height + 'px'
                    })
                dragData.targetPos = newPos
            }
            return
        }

        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function trackGhost(cursorX: any, cursorY: any){
            query(dragData['ghost'])
                .css({
                    left : (cursorX - 10) + 'px',
                    top  : (cursorY - 10) + 'px'
                })
                .show()
        }

        // return an object to remove drag if it has ever been enabled
        return {
            remove() {
                query(self.box).off('.colDrag')
                self.last.columnDrag = false
            }
        }
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnOnOff(event: MouseEvent | any, field: string) {
        // event before
        const edata = this.trigger('columnOnOff', { target: this.name, field: field, originalEvent: event })
        if (edata.isCancelled === true) return
        // collapse expanded rows
        const rows = this.find({ 'w2ui.expanded': true }, true)
        for (let r = 0; r < rows.length; r++) {
            const tmp = this.records[r]!.w2ui
            if (tmp && !Array.isArray(tmp.children)) {
                this.records[r]!.w2ui!.expanded = false
            }
        }
        // show/hide
        if (field == 'line-numbers') {
            this.show.lineNumbers = !this.show.lineNumbers
            this.refresh()
        } else {
            const col = this.getColumn(field)
            if (col != null && col.hidden) {
                this.showColumn(col.field)
            } else if (col != null) {
                this.hideColumn(col.field)
            }
        }
        // event after
        edata.finish()
    }

    initToolbar() {
        // if it is already initiazlied
        if (this.toolbar.render != null) {
            return
        }
        let tb_items = this.toolbar.items || []
        this.toolbar.items = []
        this.toolbar = new w2toolbar(w2utils.extend({}, this.toolbar, { name: this.name +'_toolbar', owner: this }))
        if (this.show.toolbarReload) {
            this.toolbar.items.push(w2utils.extend({}, this.buttons['reload']))
        }
        if (this.show.toolbarColumns) {
            this.toolbar.items.push(w2utils.extend({}, this.buttons['columns']))
        }
        if (this.show.toolbarSearch) {
            const html =`
                <div class="w2ui-grid-search-input">
                    ${this.buttons['search'].html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${w2utils.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? '' : 'display: none'}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`
            this.toolbar.items.push({
                id: 'w2ui-search',
                type: 'html',
                html,
                // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onRefresh: async (event: any) => {
                    await event.complete
                    const input = query(this.box).find(`#grid_${this.name}_search_all`)
                    w2utils.bindEvents(query(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this)
                    // slow down live search calls
                    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const slowSearch = w2utils.debounce((event: any) => {
                        const val = event.target.value
                        if (this.liveSearch && this.last['liveText'] != val) {
                            this.last['liveText'] = val
                            this.search(this.last.field, val)
                        }
                    }, 250)
                    input
                        .on('blur', () => { this.last['liveText'] = '' })
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .on('keyup', (event: any) => {
                            switch (event.keyCode) {
                                case 40: {
                                    // show saved searches on arrow down
                                    this.searchSuggest(true)
                                    break
                                }
                                case 38: {
                                    // hide saved searches on arrow up
                                    this.searchSuggest(true, true)
                                    break
                                }
                                case 13: {
                                    // search on enter key
                                    w2menu.hide(this.name + '-search-suggest')
                                    this.search(this.last.field, event.target.value)
                                    break
                                }
                                default: {
                                    // live search (if enabled)
                                    slowSearch(event)
                                    break
                                }
                            }
                        })
                }
            })
        }
        if (Array.isArray(tb_items)) {
            const ids = tb_items.map(item => item.id)
            if (this.show.toolbarAdd && !ids.includes(this.buttons['add'].id)) {
                this.toolbar.items.push(w2utils.extend({}, this.buttons['add']))
            }
            if (this.show.toolbarEdit && !ids.includes(this.buttons['edit'].id)) {
                this.toolbar.items.push(w2utils.extend({}, this.buttons['edit']))
            }
            if (this.show.toolbarDelete && !ids.includes(this.buttons['delete'].id)) {
                this.toolbar.items.push(w2utils.extend({}, this.buttons['delete']))
            }
            if (this.show.toolbarSave && !ids.includes(this.buttons['save'].id)) {
                if (this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) {
                    this.toolbar.items.push({ type: 'break', id: 'w2ui-break2' })
                }
                this.toolbar.items.push(w2utils.extend({}, this.buttons['save']))
            }
            // fill in overwritten items with default buttons
            // ids are w2ui-* but in this.buttons the map is just [add, edit, delete]
            // must specify at least {id, name} in this.toolbar.items if you want to keep order
            tb_items = tb_items.map(item => this.buttons[item.name]
                                            ? w2utils.extend({}, this.buttons[item.name], item) : item)
        }
        // add original buttons
        this.toolbar.items.push(...tb_items)

        // =============================================
        // ------ Toolbar onClick processing

        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.toolbar.on('click', (event: any) => {
            const edata = this.trigger('toolbar', { target: event.target, originalEvent: event })
            if (edata.isCancelled === true) return
            let edata2
            switch (event.detail.item.id) {
                case 'w2ui-reload':
                    edata2 = this.trigger('reload', { target: this.name })
                    if (edata2.isCancelled === true) return false
                    this.reload()
                    edata2.finish()
                    break
                case 'w2ui-column-on-off':
                    // TODO: tap on columns will hide menu before opening, only in grid not in toolbar
                    if (event.detail.subItem) {
                        const id = event.detail.subItem.id
                        if (['w2ui-stateSave', 'w2ui-stateReset'].includes(id)) {
                            this[id.substring(5)]()
                        } else if (id == 'w2ui-skip') {
                            // empty
                        } else {
                            this.columnOnOff(event, event.detail.subItem.id)
                        }
                    } else {
                        this.initColumnOnOff()
                        // init input control with records to skip
                        setTimeout(() => {
                            query(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`)
                                .off('.w2ui-grid')
                                // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .on('click.w2ui-grid', (evt: any) => {
                                    evt.stopPropagation()
                                })
                                // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .on('keypress', (evt: any) => {
                                    if (evt.keyCode == 13) {
                                        this.skip(evt.target.value)
                                        this.toolbar.click('w2ui-column-on-off') // close menu
                                    }
                                })
                        }, 100)
                    }
                    break
                case 'w2ui-add':
                    // events
                    edata2 = this.trigger('add', { target: this.name, recid: null })
                    if (edata2.isCancelled === true) return false
                    edata2.finish()
                    break
                case 'w2ui-edit': {
                    const sel   = this.getSelection()
                    let recid = null
                    if (sel.length == 1) recid = sel[0]
                    // events
                    edata2 = this.trigger('edit', { target: this.name, recid: recid })
                    if (edata2.isCancelled === true) return false
                    edata2.finish()
                    break
                }
                case 'w2ui-delete':
                    this.delete()
                    break
                case 'w2ui-save':
                    this.save()
                    break
            }
            // no default action
            edata.finish()
        })
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.toolbar.on('refresh', (event: any) => {
            if (event.target == 'w2ui-search') {
                const sd = this.searchData
                setTimeout(() => {
                    this.searchInitInput(this.last.field, (sd.length == 1 ? sd[0]!.value : null))
                }, 1)
            }
        })
    }

    initResize() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        query(this.box).find('.w2ui-resizer')
            .off('.grid-col-resize')
            .on('click.grid-col-resize', function(event: Event) {
                event.stopPropagation()
                event.preventDefault()
            })
            .on('mousedown.grid-col-resize', function(this: Element, event: Event) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mev = event as any as MouseEvent // any: typed as Event but is MouseEvent
                if (!mev) return
                obj.last.colResizing = true
                obj.last.tmp         = {
                    x   : mev.screenX,
                    y   : mev.screenY,
                    gx  : mev.screenX,
                    gy  : mev.screenY,
                    col : parseInt(query(this).attr('name')) // 'this' is the DOM element
                }
                // find tds that will be resized
                obj.last.tmp.tds = query(obj.box).find('#grid_'+ obj.name +'_body table tr:first-child td[col="'+ obj.last.tmp.col +'"]')

                mev.stopPropagation()
                mev.preventDefault()
                // fix sizes
                for (let c = 0; c < obj.columns.length; c++) {
                    if (obj.columns[c]!.hidden) continue
                    if (obj.columns[c]!.sizeOriginal == null) obj.columns[c]!.sizeOriginal = obj.columns[c]!.size ?? ''
                    obj.columns[c]!.size = obj.columns[c]!.sizeCalculated ?? ''
                }
                const edata = obj.trigger('columnResize', {
                    target: obj.name, resizeBy: 0, originalEvent: mev,
                    column: obj.last.tmp.col, field: obj.columns[obj.last.tmp.col]!.field
                })
                // set move event
                // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let timer: any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mouseMove = function(event: any) { // any: MouseEvent at runtime, passed as EventListener
                    if (obj.last.colResizing != true) return
                    if (!event) event = window.event
                    // event before
                    const edata2 = obj.trigger('columnResizeMove', w2utils.extend(edata.detail, { resizeBy: (event.screenX - obj.last.tmp.gx), originalEvent: event }))
                    if (edata2.isCancelled === true) { return }
                    // default action
                    obj.last.tmp.x = (event.screenX - obj.last.tmp.x)
                    obj.last.tmp.y = (event.screenY - obj.last.tmp.y)
                    const newWidth   = (parseInt(String(obj.columns[obj.last.tmp.col]!.size ?? 0)) + obj.last.tmp.x) + 'px'
                    obj.columns[obj.last.tmp.col]!.size = newWidth
                    if (timer) clearTimeout(timer)
                    timer = setTimeout(() => {
                        obj.resizeRecords()
                        obj.scroll()
                    }, 100)
                    // quick resize
                    obj.last.tmp.tds.css({ width: newWidth })
                    // reset
                    obj.last.tmp.x = event.screenX
                    obj.last.tmp.y = event.screenY
                    // event after
                    edata2.finish()
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mouseUp = function(event: any) { // any: MouseEvent at runtime, passed as EventListener
                    query(document).off('.grid-col-resize')
                    obj.resizeRecords()
                    obj.scroll()
                    // event after
                    edata.finish({ originalEvent: event })
                    // need timeout to finish processing events
                    setTimeout(() => { obj.last.colResizing = false }, 1)
                }

                query(document)
                    .off('.grid-col-resize')
                    .on('mousemove.grid-col-resize', mouseMove)
                    .on('mouseup.grid-col-resize', mouseUp)
            })
            .on('dblclick.grid-col-resize', function(this: Element, event: Event) {
                const ind = parseInt(query(this).attr('name'))
                obj.columnAutoSize(ind)
                // prevent default
                event.stopPropagation()
                event.preventDefault()
            })
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .each((el: any) => {
                const td = query(el).get(0).parentNode
                query(el).css({
                    'height'      : td.clientHeight + 'px',
                    'margin-left' : (td.clientWidth - 3) + 'px'
                })
            })
    }

    resizeBoxes() {
        // elements
        const header   = query(this.box).find(`#grid_${this.name}_header`)
        const toolbar  = query(this.box).find(`#grid_${this.name}_toolbar`)
        const fsummary = query(this.box).find(`#grid_${this.name}_fsummary`)
        const summary  = query(this.box).find(`#grid_${this.name}_summary`)
        const footer   = query(this.box).find(`#grid_${this.name}_footer`)
        const body     = query(this.box).find(`#grid_${this.name}_body`)

        if (this.show.header) {
            header.css({
                top:   '0px',
                left:  '0px',
                right: '0px'
            })
        }

        if (this.show.toolbar) {
            toolbar.css({
                top:   (0 + (this.show.header ? w2utils.getSize(header, 'height') : 0)) + 'px',
                left:  '0px',
                right: '0px'
            })
        }
        if (this.summary.length > 0) {
            fsummary.css({
                bottom: (0 + (this.show.footer ? w2utils.getSize(footer, 'height') : 0)) + 'px'
            })
            summary.css({
                bottom: (0 + (this.show.footer ? w2utils.getSize(footer, 'height') : 0)) + 'px',
                right: '0px'
            })
        }
        if (this.show.footer) {
            footer.css({
                bottom: '0px',
                left:  '0px',
                right: '0px'
            })
        }
        body.css({
            top: (0 + (this.show.header ? w2utils.getSize(header, 'height') : 0) + (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0)) + 'px',
            bottom: (0 + (this.show.footer ? w2utils.getSize(footer, 'height') : 0) + (this.summary.length > 0 ? w2utils.getSize(summary, 'height') : 0)) + 'px',
            left:   '0px',
            right:  '0px'
        })
    }

    resizeRecords() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        // remove empty records
        query(this.box).find('.w2ui-empty-record').remove()
        // -- Calculate Column size in PX
        const box             = query(this.box)
        const grid            = query(this.box).find(':scope > div.w2ui-grid-box')
        const header          = query(this.box).find(`#grid_${this.name}_header`)
        const toolbar         = query(this.box).find(`#grid_${this.name}_toolbar`)
        const summary         = query(this.box).find(`#grid_${this.name}_summary`)
        const fsummary        = query(this.box).find(`#grid_${this.name}_fsummary`)
        const footer          = query(this.box).find(`#grid_${this.name}_footer`)
        const body            = query(this.box).find(`#grid_${this.name}_body`)
        const columns         = query(this.box).find(`#grid_${this.name}_columns`)
        const fcolumns        = query(this.box).find(`#grid_${this.name}_fcolumns`)
        const records         = query(this.box).find(`#grid_${this.name}_records`)
        const frecords        = query(this.box).find(`#grid_${this.name}_frecords`)
        const scroll1         = query(this.box).find(`#grid_${this.name}_scroll1`)
        let lineNumberWidth = String(this.total).length * 8 + 10
        if (lineNumberWidth < 34) lineNumberWidth = 34 // 3 digit width
        if (this.lineNumberWidth != null) lineNumberWidth = this.lineNumberWidth

        let bodyOverflowX = false
        let bodyOverflowY = false
        let sWidth = 0
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i]!.frozen || this.columns[i]!.hidden) continue
            const cSize = parseInt(this.columns[i]!.sizeCalculated ? this.columns[i]!.sizeCalculated! : String(this.columns[i]!.size ?? 0))
            sWidth += cSize
        }
        if (records[0]?.clientWidth < sWidth) bodyOverflowX = true
        if (body[0]?.clientHeight - (columns[0]?.clientHeight ?? 0)
                < (query(records).find(':scope > table')[0]?.clientHeight ?? 0) + (bodyOverflowX ? w2utils.scrollBarSize() : 0)) {
            bodyOverflowY = true
        }

        // body might be expanded by data
        if (!this.fixedBody) {
            // allow it to render records, then resize
            const bodyHeight = (w2utils.getSize(columns, 'height') as number)
                + (w2utils.getSize(query(this.box).find('#grid_'+ this.name +'_records table'), 'height') as number)
                + (bodyOverflowX ? (w2utils.scrollBarSize() as number) : 0)
            const calculatedHeight = bodyHeight
                + (this.show.header ? w2utils.getSize(header, 'height') : 0)
                + (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0)
                + (summary.css('display') != 'none' ? w2utils.getSize(summary, 'height') : 0)
                + (this.show.footer ? w2utils.getSize(footer, 'height') : 0)
            grid.css('height', calculatedHeight + 'px')
            body.css('height', bodyHeight + 'px')
            box.css('height', w2utils.getSize(grid, 'height') + 'px')
        } else {
            // fixed body height
            const calculatedHeight = grid[0]?.clientHeight
                - (this.show.header ? w2utils.getSize(header, 'height') : 0)
                - (this.show.toolbar ? w2utils.getSize(toolbar, 'height') : 0)
                - (summary.css('display') != 'none' ? w2utils.getSize(summary, 'height') : 0)
                - (this.show.footer ? w2utils.getSize(footer, 'height') : 0)
            body.css('height', calculatedHeight + 'px')
        }

        let buffered = this.records.length
        const url = this.url?.get ?? this.url
        if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length
        // apply overflow
        if (!this.fixedBody) { bodyOverflowY = false }
        if (bodyOverflowX || bodyOverflowY) {
            columns.find(':scope > table > tbody > tr:nth-child(1) td.w2ui-head-last')
                .css('width', w2utils.scrollBarSize() + 'px')
                .show()
            records.css({
                top: ((this.columnGroups.length > 0 && this.show.columns ? 1 : 0) + (w2utils.getSize(columns, 'height') as number)) +'px',
                '-webkit-overflow-scrolling': 'touch',
                'overflow-x': (bodyOverflowX ? 'auto' : 'hidden'),
                'overflow-y': (bodyOverflowY ? 'auto' : 'hidden')
            })
        } else {
            columns.find(':scope > table > tbody > tr:nth-child(1) td.w2ui-head-last').hide()
            records.css({
                top: ((this.columnGroups.length > 0 && this.show.columns ? 1 : 0) + (w2utils.getSize(columns, 'height') as number)) +'px',
                overflow: 'hidden'
            })
            if (records.length > 0) { this.last.vscroll.scrollTop = 0; this.last.vscroll.scrollLeft = 0 } // if no scrollbars, always show top
        }
        if (bodyOverflowX) {
            frecords.css('margin-bottom', w2utils.scrollBarSize() + 'px')
            scroll1.show()
        } else {
            frecords.css('margin-bottom', 0)
            scroll1.hide()
        }
        frecords.css({ overflow: 'hidden', top: records.css('top') })
        if (this.show.emptyRecords && !bodyOverflowY) {
            let max = Math.floor((records[0]?.clientHeight ?? 0) / this.recordHeight) - 1
            let leftover = 0
            if (records[0]) leftover = records[0].scrollHeight - max * this.recordHeight
            if (leftover >= this.recordHeight) {
                leftover -= this.recordHeight
                max++
            }
            if (this.fixedBody) {
                for (let di = buffered; di < max; di++) {
                    addEmptyRow(di, this.recordHeight, this)
                }
                addEmptyRow(max, leftover, this)
            }
        }

        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function addEmptyRow(row: any, height: any, grid: any) {
            let html1 = ''
            let html2 = ''
            let htmlp = ''
            html1    += '<tr class="'+ (row % 2 ? 'w2ui-even' : 'w2ui-odd') + ' w2ui-empty-record" recid="-none-" style="height: '+ height +'px">'
            html2    += '<tr class="'+ (row % 2 ? 'w2ui-even' : 'w2ui-odd') + ' w2ui-empty-record" recid="-none-" style="height: '+ height +'px">'
            if (grid.show.lineNumbers) html1 += '<td class="w2ui-col-number"></td>'
            if (grid.show.selectColumn) html1 += '<td class="w2ui-grid-data w2ui-col-select"></td>'
            if (grid.show.expandColumn) html1 += '<td class="w2ui-grid-data w2ui-col-expand"></td>'
            html2 += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>'
            if (grid.reorderRows) html2 += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>'
            for (let j = 0; j < grid.columns.length; j++) {
                const col = grid.columns[j]
                if ((col.hidden || j < grid.last.vscroll.colIndStart || j > grid.last.vscroll.colIndEnd) && !col.frozen) continue
                htmlp = '<td class="w2ui-grid-data" '+ (col.attr != null ? col.attr : '') +' col="'+ j +'"></td>'
                if (col.frozen) html1 += htmlp; else html2 += htmlp
            }
            html1 += '<td class="w2ui-grid-data-last"></td> </tr>'
            html2 += '<td class="w2ui-grid-data-last" col="end"></td> </tr>'
            query(grid.box).find('#grid_'+ grid.name +'_frecords > table').append(html1)
            query(grid.box).find('#grid_'+ grid.name +'_records > table').append(html2)
        }
        // any: parameter typed any — runtime dispatch by call site; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let width_box: any, percent: any
        if (body.length > 0) {
            let width_max = parseInt(body[0].clientWidth)
                - (bodyOverflowY ? (w2utils.scrollBarSize() as number) : 0)
                - (this.show.lineNumbers ? lineNumberWidth : 0)
                - (this.reorderRows ? 26 : 0)
                - (this.show.selectColumn ? 26 : 0)
                - (this.show.expandColumn ? 26 : 0)
                - 1 // left is 1px due to border width
            width_box = width_max
            percent   = 0
            // gridMinWidth processing
            let restart = false
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i]!
                if ((col.gridMinWidth ?? 0) > 0) {
                    if ((col.gridMinWidth ?? 0) > width_box && col.hidden !== true) {
                        col.hidden = true
                        restart    = true
                    }
                    if ((col.gridMinWidth ?? 0) < width_box && col.hidden === true) {
                        col.hidden = false
                        restart    = true
                    }
                }
            }
            if (restart === true) {
                this.refresh()
                return
            }
            // assign PX column s
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i]!
                if (col.hidden) continue
                const sizeStr = String(col.size ?? 0)
                if (sizeStr.substr(sizeStr.length-2).toLowerCase() == 'px') {
                    width_max -= parseFloat(sizeStr)
                    col.sizeCalculated = sizeStr
                    col.sizeType = 'px'
                } else {
                    percent += parseFloat(sizeStr)
                    col.sizeType = '%'
                    delete col['sizeCorrected']
                }
            }
            // if sum != 100% -- reassign proportionally
            if (percent != 100 && percent > 0) {
                for (let i = 0; i < this.columns.length; i++) {
                    const col = this.columns[i]!
                    if (col.hidden) continue
                    if (col.sizeType == '%') {
                        col['sizeCorrected'] = Math.round(parseFloat(String(col.size ?? 0)) * 100 * 100 / percent) / 100 + '%'
                    }
                }
            }
            // calculate % columns
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i]!
                if (col.hidden) continue
                if (col.sizeType == '%') {
                    if (col['sizeCorrected'] != null) {
                        // make it 1px smaller, so margin of error can be calculated correctly
                        col.sizeCalculated = Math.floor(width_max * parseFloat(String(col['sizeCorrected'])) / 100) - 1 + 'px'
                    } else {
                        // make it 1px smaller, so margin of error can be calculated correctly
                        col.sizeCalculated = Math.floor(width_max * parseFloat(String(col.size ?? 0)) / 100) - 1 + 'px'
                    }
                }
            }
        }
        // fix margin of error that is due percentage calculations
        let width_cols = 0
        for (let i = 0; i < this.columns.length; i++) {
            const col = this.columns[i]!
            if (col.hidden) continue
            if (col.min == null) col.min = 20
            if (parseInt(col.sizeCalculated ?? '0') < (col.min as number)) col.sizeCalculated = col.min + 'px'
            if (col.max != null && parseInt(col.sizeCalculated ?? '0') > (col.max as number)) col.sizeCalculated = col.max + 'px'
            width_cols += parseInt(col.sizeCalculated ?? '0')
        }
        let width_diff = parseInt(width_box) - width_cols
        if (width_diff > 0 && percent > 0) {
            let i = 0
            while (true) {
                const col = this.columns[i]!
                if (col == null) { i = 0; continue }
                if (col.hidden || col.sizeType == 'px') { i++; continue }
                col.sizeCalculated = (parseInt(col.sizeCalculated ?? '0') + 1) + 'px'
                width_diff--
                if (width_diff === 0) break
                i++
            }
        } else if (width_diff > 0) {
            columns.find(':scope > table > tbody > tr:nth-child(1) td.w2ui-head-last')
                .css('width', w2utils.scrollBarSize() + 'px')
                .show()
        }

        // find width of frozen columns
        let fwidth = 1
        if (this.show.lineNumbers) fwidth += lineNumberWidth
        if (this.show.selectColumn) fwidth += 26
        // if (this.reorderRows) fwidth += 26;
        if (this.show.expandColumn) fwidth += 26
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i]!.hidden) continue
            if (this.columns[i]!.frozen) fwidth += parseInt(this.columns[i]!.sizeCalculated ?? '0')
        }
        fcolumns.css('width', fwidth + 'px')
        frecords.css('width', fwidth + 'px')
        fsummary.css('width', fwidth + 'px')
        scroll1.css('width', fwidth + 'px')
        /**
         * 0.5 is needed due to imperfection of table layout. There was a very small shift between right border of the column headers
         * and records. I checked it had exact same offset, but still felt like 1px off. This adjustment fixes it.
         */
        columns.css({ left: fwidth + 'px', 'padding-left': '0.5px' })
        records.css({ left: fwidth + 'px' })
        summary.css({ left: fwidth + 'px' })

        // resize columns
        columns.find(':scope > table > tbody > tr:nth-child(1) td')
            .add(fcolumns.find(':scope > table > tbody > tr:nth-child(1) td'))
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .each((el: any) => {
                // line numbers
                if (query(el).hasClass('w2ui-col-number')) {
                    query(el).css('width', lineNumberWidth + 'px')
                }
                // records
                const ind = query(el).attr('col')
                if (ind != null) {
                    if (ind == 'start') {
                        let width = 0
                        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
                            if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                            width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                        }
                        query(el).css('width', width + 'px')
                    }
                    if (obj.columns[ind]) query(el).css('width', obj.columns[ind]!.sizeCalculated ?? '') // already has px
                }
                // last column
                if (query(el).hasClass('w2ui-head-last')) {
                    if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
                        let width = 0
                        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
                            if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                            width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                        }
                        query(el).css('width', width + 'px')
                    } else {
                        query(el).css('width', (w2utils.scrollBarSize() as number) + (width_diff > 0 && percent === 0 ? width_diff : 0) + 'px')
                    }
                }
            })
        // if there are column groups - hide first row (needed for sizing)
        if (columns.find(':scope > table > tbody > tr').length == 3) {
            columns.find(':scope > table > tbody > tr:nth-child(1) td')
                .add(fcolumns.find(':scope > table > tbody > tr:nth-child(1) td'))
                .html('').css({
                    'height' : '0',
                    'border' : '0',
                    'padding': '0',
                    'margin' : '0'
                })
        }
        // resize records
        records.find(':scope > table > tbody > tr:nth-child(1) td')
            .add(frecords.find(':scope > table > tbody > tr:nth-child(1) td'))
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .each((el: any) => {
                // line numbers
                if (query(el).hasClass('w2ui-col-number')) {
                    query(el).css('width', lineNumberWidth + 'px')
                }
                // records
                const ind = query(el).attr('col')
                if (ind != null) {
                    if (ind == 'start') {
                        let width = 0
                        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
                            if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                            width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                        }
                        query(el).css('width', width + 'px')
                    }
                    if (obj.columns[ind]) query(el).css('width', obj.columns[ind]!.sizeCalculated ?? '')
                }
                // last column
                if (query(el).hasClass('w2ui-grid-data-last') && query(el).parents('.w2ui-grid-frecords').length === 0) { // not in frecords
                    if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
                        let width = 0
                        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
                            if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                            width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                        }
                        query(el).css('width', width + 'px')
                    } else {
                        query(el).css('width', (width_diff > 0 && percent === 0 ? width_diff : 0) + 'px')
                    }
                }
            })
        // resize summary
        summary.find(':scope > table > tbody > tr:nth-child(1) td')
            .add(fsummary.find(':scope > table > tbody > tr:nth-child(1) td'))
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .each((el: any) => {
                // line numbers
                if (query(el).hasClass('w2ui-col-number')) {
                    query(el).css('width', lineNumberWidth + 'px')
                }
                // records
                const ind = query(el).attr('col')
                if (ind != null) {
                    if (ind == 'start') {
                        let width = 0
                        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
                            if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                            width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                        }
                        query(el).css('width', width + 'px')
                    }
                    if (obj.columns[ind]) query(el).css('width', obj.columns[ind]!.sizeCalculated ?? '')
                }
                // last column
                if (query(el).hasClass('w2ui-grid-data-last') && query(el).parents('.w2ui-grid-frecords').length === 0) { // not in frecords
                    query(el).css('width', (w2utils.scrollBarSize() as number) + (width_diff > 0 && percent === 0 ? width_diff : 0) + 'px')
                }
            })
        this.initResize()
        this.refreshRanges()
        // apply last scroll if any
        if ((this.last.vscroll.scrollTop || this.last.vscroll.scrollLeft) && records.length > 0) {
            columns.prop('scrollLeft', this.last.vscroll.scrollLeft)
            records.prop('scrollTop', this.last.vscroll.scrollTop)
            records.prop('scrollLeft', this.last.vscroll.scrollLeft)
        }
        // Improved performance when scrolling through tables
        columns.css('will-change', 'scroll-position')
    }

    getSearchesHTML() {
        let html = `
            <div class="search-title">
                ${w2utils.lang('Advanced Search')}
                ${this.savedSearches?.length > 0
                    ? `<button class="w2ui-btn w2ui-saved-searches" data-click="searchSuggest|true|false|this">Saved Searches (${this.savedSearches?.length ?? 0})</button>`
                    : ''
                }
                <span class="search-logic" style="${this.show.searchLogic ? '' : 'display: none'}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == 'AND' ? 'selected' : ''}>${w2utils.lang('All')}</option>
                        <option value="OR" ${this.last.logic == 'OR' ? 'selected' : ''}>${w2utils.lang('Any')}</option>
                    </select>
                </span>
            </div>
        `
        // any: array of heterogeneous runtime values; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const columns: any[] = []
        let col_ind = 0
        columns.push('<div><table cellspacing="0"><tbody>')
        for (let i = 0; i < this.searches.length; i++) {
            const s  = this.searches[i]!
            s.type = String(s.type).toLowerCase()
            if (s.hidden) continue

            if (s.type == 'new-column') {
                columns[col_ind] += '</tbody></table></div>'
                columns.push('<div><table cellspacing="0"><tbody>')
                col_ind++
                continue
            }
            if (s.attr == null) s.attr = ''
            if (s.text == null) s.text = ''
            if (s.style == null) s.style = ''
            if (s.type == null) s.type = 'text'
            if (s.label == null && s['caption'] != null) {
                console.log('NOTICE: grid search.caption property is deprecated, please use search.label. Search ->', s)
                s.label = s['caption']
            }
            const operator =`
                <select id="grid_${this.name}_operator_${i}" class="w2ui-input" data-change="initOperator|${i}">
                    ${this.getOperators(s.type, s.operators)}
                </select>
            `
            columns[col_ind] += `<tr>
                        <td class="caption">${(w2utils.lang(s.label ?? s.field) || '')}</td>
                        <td class="operator">${operator}</td>
                        <td class="value">`

            let tmpStyle
            switch (s.type) {
                case 'text':
                case 'alphanumeric':
                case 'hex':
                case 'color':
                case 'list':
                case 'combo':
                case 'enum':
                    tmpStyle = 'width: 250px;'
                    if (['hex', 'color'].indexOf(s.type) != -1) tmpStyle = 'width: 90px;'
                    columns[col_ind] += `<input rel="search" type="text" id="grid_${this.name}_field_${i}" name="${s.field}"
                               class="w2ui-input" style="${tmpStyle + s.style}" ${s.attr}>`
                    break

                case 'int':
                case 'float':
                case 'money':
                case 'currency':
                case 'percent':
                case 'date':
                case 'time':
                case 'datetime':
                    tmpStyle = 'width: 90px;'
                    if (s.type == 'datetime') tmpStyle = 'width: 140px;'
                    columns[col_ind] += `<input id="grid_${this.name}_field_${i}" name="${s.field}" ${s.attr} rel="search" type="text"
                                class="w2ui-input" style="${tmpStyle + s.style}">
                            <span id="grid_${this.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${tmpStyle + s.style}" id="grid_${this.name}_field2_${i}" name="${s.field}" ${s.attr}>
                            </span>`
                    break

                case 'select':
                    columns[col_ind] += `<select rel="search" class="w2ui-input" style="${s.style}" id="grid_${this.name}_field_${i}"
                                name="${s.field}" ${s.attr}></select>`
                    break

            }
            columns[col_ind] += s.text +
                    '    </td>' +
                    '</tr>'
        }
        columns[col_ind] += '</tbody></table></div>'

        html += `
            <div class="search-body">
                ${columns.join('')}
            </div>
            <div class="search-bottom actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${w2utils.lang('Close')}</button>
                <div style="float: right; display: inline">
                    <button type="button" class="w2ui-btn" data-click="searchReset">${w2utils.lang('Reset')}</button>
                    <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${w2utils.lang('Search')}</button>
                </div>
            </div>
        `
        return html
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOperators(type: any, opers: any) {
        let operators = this.operators[this.operatorsMap[type] ?? ''] || []
        if (opers != null && Array.isArray(opers)) {
            operators = opers
        }
        let html = ''
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operators.forEach((oper: any) => {
            let displayText = oper
            let operValue = oper
            if (Array.isArray(oper)) {
                displayText = oper[1]
                operValue = oper[0]
            } else if (w2utils.isPlainObject(oper)) {
                displayText = oper.text
                operValue = oper.oper
            }
            if (displayText == null) displayText = oper
            html += `<option  value="${operValue}">${w2utils.lang(displayText)}</option>\n`
        })
        return html
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initOperator(ind: any) {
        let options
        const search  = this.searches[ind]!
        const sdata   = this.getSearchData(search.field)
        const overlay = query(`#w2overlay-${this.name}-search-overlay`)
        const $rng    = overlay.find(`#grid_${this.name}_range_${ind}`)
        const $fld1   = overlay.find(`#grid_${this.name}_field_${ind}`)
        const $fld2   = overlay.find(`#grid_${this.name}_field2_${ind}`)
        const $oper   = overlay.find(`#grid_${this.name}_operator_${ind}`)
        const oper    = $oper.val()
        $fld1.show()
        $rng.hide()
        // init based on operator value
        switch (oper) {
            case 'between':
                $rng.css('display', 'inline')
                break
            case 'null':
            case 'not null':
                $fld1.hide()
                $fld1.val(oper) // need to insert something for search to activate
                $fld1.trigger('change')
                break
        }

        // init based on search type
        switch (search.type) {
            case 'text':
            case 'alphanumeric':
                const fld = $fld1[0]._w2field
                if (fld) { fld.reset() }
                break

            case 'int':
            case 'float':
            case 'hex':
            case 'color':
            case 'money':
            case 'currency':
            case 'percent':
            case 'date':
            case 'time':
            case 'datetime':
                if (!$fld1[0]._w2field) {
                    // init fields
                    new w2field(search.type, { el: $fld1[0], ...search.options })
                    new w2field(search.type, { el: $fld2[0], ...search.options })
                    setTimeout(() => { // convert to date if it is number
                        $fld1.trigger('keydown')
                        $fld2.trigger('keydown')
                    }, 1)
                }
                break

            case 'list':
            case 'combo':
            case 'enum':
                options = search.options ?? {}
                if (search.type == 'list') options['selected'] = {}
                if (search.type == 'enum') options['selected'] = []
                if (sdata) options['selected'] = sdata['value']
                if (!$fld1[0]._w2field) {
                    const fld = new w2field(search.type, {
                        el: $fld1[0],
                        ...options,
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onSelect: async (event: any) => {
                            await event.complete
                            this.initSearchLists(search.field)
                        },
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onRemove: async (event: any) => {
                            await event.complete
                            this.initSearchLists(search.field)
                        }
                    })
                    if (sdata && sdata['text'] != null) {
                        fld.set({ id: sdata['value'], text: sdata['text'] })
                    }
                    search['_w2field'] = fld
                }
                break

            case 'select':
                // build options
                options = '<option value="">--</option>'
                const searchOpts = search.options ?? {}
                for (let i = 0; i < searchOpts['items'].length; i++) {
                    const si = searchOpts['items'][i]
                    if (w2utils.isPlainObject(searchOpts['items'][i])) {
                        let val = si.id
                        let txt = si.text
                        if (val == null && si.value != null) val = si.value
                        if (txt == null && si.text != null) txt = si.text
                        if (val == null) val = ''
                        options += '<option value="'+ val +'">'+ txt +'</option>'
                    } else {
                        options += '<option value="'+ si +'">'+ si +'</option>'
                    }
                }
                $fld1.html(options)
                break
        }
        this.initSearchLists()
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initSearchLists(changedField?: any) {
        const fields = this.getSearch()
        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields.forEach((field: any) => {
            const search = this.getSearch(field)
            if (search != null && search.options?.['parentList'] != null) {
                const parent = this.getSearch(search.options['parentList'])
                if (parent == null) return
                let values = this.getSearch(parent.field)?.['_w2field']?.get()
                if (Array.isArray(values)) {
                    values = values.map(vv => vv.id)
                } else {
                    values = values?.id != null ? [values.id] : []
                }
                // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                search['_w2field']?.options?.items?.forEach?.((item: any) => {
                    const parent = w2utils.getNested(item, search?.options?.['parentField'] ?? 'parentId')
                    if (parent == null) {
                        return
                    }
                    const possible = w2utils.clone(Array.isArray(parent) ? parent : [parent])
                    possible.unshift('')
                    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const includes = values.some((item: any) => possible.includes(item))
                    if (includes && item.hidden === true) {
                        item.hidden = false
                    } else if (!includes && item.hidden !== true) {
                        item.hidden = true
                    }
                })
            }
        })
        // set all fields that refer to changed one to blank
        if (changedField != null) {
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fields.forEach((field: any) => {
                const search = this.getSearch(field)
                if (search != null && search.options?.['parentList'] == changedField) {
                    const fld = search['_w2field']
                    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const items = fld.options.items.filter((it: any) => !it.hidden).map((it: any) => it.id)
                    if (fld.type == 'list' && !items.includes(fld.get()?.id)) {
                        fld.set(null)
                    }
                    if (fld.type == 'enum') {
                        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const new_sel = fld.get()?.filter((it: any) => items.includes(it.id))
                        fld.set(new_sel || [])
                    }
                }
            })
        }
    }

    initSearches() {
        const overlay = query(`#w2overlay-${this.name}-search-overlay`)
        // init searches
        for (let ind = 0; ind < this.searches.length; ind++) {
            const search  = this.searches[ind]!
            const sdata   = this.getSearchData(search.field)
            search.type = String(search.type).toLowerCase()
            if (search.type == 'new-column') {
                continue
            }
            if (typeof search.options != 'object') search.options = {}
            // operators
            let operator  = search.operator
            let operators = [...(this.operators[this.operatorsMap[search.type] ?? ''] ?? [])] // need a copy
            if (search.operators) operators = [...search.operators] // need a copy as this variable will be changed
            // normalize
            // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (w2utils.isPlainObject(operator)) operator = (operator as any).oper
            operators.forEach((oper, ind) => {
                if (w2utils.isPlainObject(oper)) operators[ind] = oper.oper
            })
            if (sdata && sdata['operator']) {
                operator = sdata['operator']
            }
            // default operator
            const def = this.defaultOperator[this.operatorsMap[search.type] ?? '']
            if (operators.indexOf(operator) == -1) {
                operator = def
            }
            overlay.find(`#grid_${this.name}_operator_${ind}`).val(operator)
            this.initOperator(ind)
            // populate field value
            const $fld1 = overlay.find(`#grid_${this.name}_field_${ind}`)
            const $fld2 = overlay.find(`#grid_${this.name}_field2_${ind}`)
            if (sdata != null) {
                if (!Array.isArray(sdata['value'])) {
                    if (sdata['value'] != null) $fld1.val(sdata['value']).trigger('change')
                } else {
                    if (['in', 'not in'].includes(sdata['operator'])) {
                        $fld1[0]._w2field.set(sdata['value'])
                    } else {
                        $fld1.val(sdata['value'][0]).trigger('change')
                        $fld2.val(sdata['value'][1]).trigger('change')
                    }
                }
            }
        }
        // add on change event
        overlay.find('.w2ui-grid-search-advanced *[rel=search]')
            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('keypress', (evnt: any) => {
                if (evnt.keyCode == 13) {
                    this.search()
                    w2tooltip.hide(this.name + '-search-overlay')
                }
            })
    }

    getColumnsHTML() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        let html1 = ''
        let html2 = ''
        if (this.show.columnHeaders) {
            if (this.columnGroups.length > 0) {
                const tmp1 = getColumns(true)
                const tmp2 = getGroups()
                const tmp3 = getColumns(false)
                html1    = (tmp1[0] ?? '') + (tmp2[0] ?? '') + (tmp3[0] ?? '')
                html2    = (tmp1[1] ?? '') + (tmp2[1] ?? '') + (tmp3[1] ?? '')
            } else {
                const tmp = getColumns(true)
                html1   = tmp[0] ?? ''
                html2   = tmp[1] ?? ''
            }
        }
        return [html1, html2]

        function getGroups() {
            let html1 = '<tr>'
            let html2 = '<tr>'
            let tmpf  = ''
            // add empty group at the end
            const tmp = self.columnGroups.length - 1
            if (self.columnGroups[tmp].text == null && self.columnGroups[tmp]['caption'] != null) {
                console.log('NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ', self.columnGroups[tmp])
                self.columnGroups[tmp].text = self.columnGroups[tmp]['caption']
            }
            if (self.columnGroups[self.columnGroups.length-1].text != '') self.columnGroups.push({ text: '' })

            if (self.show.lineNumbers) {
                html1 += '<td class="w2ui-head w2ui-col-number" col="line-number">' +
                         '    <div>&#160;</div>' +
                         '</td>'
            }
            if (self.show.selectColumn) {
                html1 += '<td class="w2ui-head w2ui-col-select" col="select">' +
                         '    <div style="height: 25px">&#160;</div>' +
                         '</td>'
            }
            if (self.show.expandColumn) {
                html1 += '<td class="w2ui-head w2ui-col-expand" col="expand">' +
                         '    <div style="height: 25px">&#160;</div>' +
                         '</td>'
            }
            let ii = 0
            html2 += `<td id="grid_${self.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`
            if (self.reorderRows) {
                html2 += '<td class="w2ui-head w2ui-col-order" col="order">' +
                         '    <div style="height: 25px">&#160;</div>' +
                         '</td>'
            }
            for (let i = 0; i < self.columnGroups.length; i++) {
                const colg = self.columnGroups[i]
                const col: W2GridColumn = self.columns[ii] ?? {} as W2GridColumn
                if (colg.colspan != null) colg.span = colg.colspan
                if (colg.span == null || colg.span != parseInt(colg.span)) colg.span = 1
                if (col.text == null && col['caption'] != null) {
                    console.log('NOTICE: grid column.caption property is deprecated, please use column.text. Column ->', col)
                    col.text = col['caption']
                }
                let colspan = 0
                for (let jj = ii; jj < ii + colg.span; jj++) {
                    if (self.columns[jj] && !self.columns[jj]!.hidden) {
                        colspan++
                    }
                }
                if (i == self.columnGroups.length-1) {
                    colspan = 100 // last column
                }
                if (colspan <= 0) {
                    // do nothing here, all columns in the group are hidden.
                } else if (colg.main === true) {
                    let sortStyle = ''
                    for (let si = 0; si < self.sortData.length; si++) {
                        if (self.sortData[si]!.field == col.field) {
                            if ((self.sortData[si]!.direction || '').toLowerCase() === 'asc') sortStyle = 'w2ui-sort-up'
                            if ((self.sortData[si]!.direction || '').toLowerCase() === 'desc') sortStyle = 'w2ui-sort-down'
                        }
                    }
                    let resizer = ''
                    if (col.resizable !== false) {
                        resizer = `<div class="w2ui-resizer" name="${ii}"></div>`
                    }
                    const text = w2utils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
                    tmpf = `<td id="grid_${self.name}_column_${ii}" class="w2ui-head ${sortStyle}" col="${ii}" `+
                           `    rowspan="2" colspan="${colspan}">`+ resizer +
                           `    <div class="w2ui-col-group w2ui-col-header ${sortStyle ? 'w2ui-col-sorted' : ''}">` +
                           `        <div class="${sortStyle}"></div>` + (!text ? '&#160;' : text) +
                           '    </div>'+
                           '</td>'
                    if (col && col.frozen) html1 += tmpf; else html2 += tmpf
                } else {
                    const gText = w2utils.lang(typeof colg.text == 'function' ? colg.text(colg) : colg.text)
                    tmpf = `<td id="grid_${self.name}_column_${ii}" class="w2ui-head" col="${ii}" colspan="${colspan}">` +
                           `    <div class="w2ui-col-group" style="${colg.style ?? ''}">${!gText ? '&#160;' : gText}</div>` +
                           '</td>'
                    if (col && col.frozen) html1 += tmpf; else html2 += tmpf
                }
                ii += colg.span
            }
            html1 += '<td></td></tr>' // need empty column for border-right
            html2 += `<td id="grid_${self.name}_column_end" class="w2ui-head" col="end"></td></tr>`
            return [html1, html2]
        }

        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getColumns(main: any) {
            let html1 = '<tr>'
            let html2 = '<tr>'
            if (self.show.lineNumbers) {
                html1 += '<td class="w2ui-head w2ui-col-number" col="line-number">' +
                        '    <div>#</div>' +
                        '</td>'
            }
            if (self.show.selectColumn) {
                html1 += '<td class="w2ui-head w2ui-col-select" col="select">' +
                        '    <div>' +
                        `        <input type="checkbox" id="grid_${self.name}_check_all" class="w2ui-select-all" tabindex="-1"` +
                        `            style="${self.multiSelect == false ? 'display: none;' : ''}"` +
                        '        >' +
                        '    </div>' +
                        '</td>'
            }
            if (self.show.expandColumn) {
                html1 += '<td class="w2ui-head w2ui-col-expand" col="expand">' +
                        '    <div>&#160;</div>' +
                        '</td>'
            }
            let ii = 0
            let id = 0
            let colg
            html2 += `<td id="grid_${self.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`
            if (self.reorderRows) {
                html2 += '<td class="w2ui-head w2ui-col-order" col="order">'+
                        '    <div>&#160;</div>'+
                        '</td>'
            }
            for (let i = 0; i < self.columns.length; i++) {
                const col = self.columns[i]!
                if (col.text == null && col['caption'] != null) {
                    console.log('NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ', col)
                    col.text = col['caption']
                }
                if (col.size == null) col.size = '100%'
                if (i == id) { // always true on first iteration
                    colg = self.columnGroups[ii++] || {}
                    id   = id + colg.span
                }
                if ((i < (self.last.vscroll.colIndStart ?? 0) || i > (self.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen)
                    continue
                if (col.hidden)
                    continue
                if (colg.main !== true || main) { // grouping of columns
                    const colCellHTML = self.getColumnCellHTML(i)
                    if (col && col.frozen) html1 += colCellHTML; else html2 += colCellHTML
                }
            }
            html1 += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>'
            html2 += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>'
            html1 += '</tr>'
            html2 += '</tr>'
            return [html1, html2]
        }
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getColumnCellHTML(i: any) {
        const col = this.columns[i]!
        if (col == null) return ''
        // reorder style
        const reorderCols = (this.reorderColumns && (!this.columnGroups || !this.columnGroups.length)) ? ' w2ui-col-reorderable ' : ''
        // sort style
        let sortStyle = ''
        for (let si = 0; si < this.sortData.length; si++) {
            if (this.sortData[si]!.field == col.field) {
                if ((this.sortData[si]!.direction || '').toLowerCase() === 'asc') sortStyle = 'w2ui-sort-up'
                if ((this.sortData[si]!.direction || '').toLowerCase() === 'desc') sortStyle = 'w2ui-sort-down'
            }
        }
        // col selected
        const tmp      = this.last.selection.columns
        let selected = false
        for (const t in tmp) {
            for (let si = 0; si < tmp[t]!.length; si++) {
                if (tmp[t]![si] == i) selected = true
            }
        }
        const text = w2utils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
        const html = '<td id="grid_'+ this.name + '_column_' + i +'" col="'+ i +'" class="w2ui-head '+ sortStyle + reorderCols + '">' +
                         (col.resizable !== false ? '<div class="w2ui-resizer" name="'+ i +'"></div>' : '') +
                    '    <div class="w2ui-col-header '+ (sortStyle ? 'w2ui-col-sorted' : '') +' '+ (selected ? 'w2ui-col-selected' : '') +'">'+
                    '        <div class="'+ sortStyle +'"></div>'+
                            (!text ? '&#160;' : text) +
                    '    </div>'+
                    '</td>'

        return html
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnTooltipShow(ind: any, _event: any) {
        const $el  = query(this.box).find('#grid_'+ this.name + '_column_'+ ind)
        const item = this.columns[ind]
        const pos  = this.columnTooltip
        w2tooltip.show({
            name: this.name + '-column-tooltip',
            anchor: $el.get(0),
            html: item?.tooltip,
            position: pos,
        })
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnTooltipHide(_ind: any, _event: any) {
        w2tooltip.hide(this.name + '-column-tooltip')
    }

    getRecordsHTML() {
        let buffered = this.records.length
        const url      = this.url?.get ?? this.url
        if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length
        // larger number works better with chrome, smaller with FF.
        if (buffered > this.vs_start) this.last.vscroll.show_extra = this.vs_extra; else this.last.vscroll.show_extra = this.vs_start
        const records = query(this.box).find(`#grid_${this.name}_records`)
        let limit   = Math.floor((records.get(0)?.clientHeight || 0) / this.recordHeight) + this.last.vscroll.show_extra + 1
        if (limit < this.vs_start) {
            limit = this.vs_start
        }
        if (!this.fixedBody || limit > buffered) limit = buffered
        // always need first record for resizing purposes
        let rec_html = this.getRecordHTML(-1, 0)
        let html1    = '<table><tbody>' + rec_html[0]
        let html2    = '<table><tbody>' + rec_html[1]
        // first empty row with height
        html1 += '<tr id="grid_'+ this.name + '_frec_top" line="top" style="height: '+ 0 +'px">'+
                 '    <td colspan="2000"></td>'+
                 '</tr>'
        html2 += '<tr id="grid_'+ this.name + '_rec_top" line="top" style="height: '+ 0 +'px">'+
                 '    <td colspan="2000"></td>'+
                 '</tr>'
        for (let i = 0; i < limit; i++) {
            rec_html = this.getRecordHTML(i, i+1)
            html1   += rec_html[0]
            html2   += rec_html[1]
        }
        const h2 = (buffered - limit) * this.recordHeight
        html1 += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">' +
                '    <td colspan="2000" style="border: 0"></td>'+
                '</tr>'+
                '<tr id="grid_'+ this.name +'_frec_more" style="display: none; ">'+
                '    <td colspan="2000" class="w2ui-load-more"></td>'+
                '</tr>'+
                '</tbody></table>'
        html2 += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">' +
                '    <td colspan="2000" style="border: 0"></td>'+
                '</tr>'+
                '<tr id="grid_'+ this.name +'_rec_more" style="display: none">'+
                '    <td colspan="2000" class="w2ui-load-more"></td>'+
                '</tr>'+
                '</tbody></table>'
        this.last.vscroll.recIndStart = 0
        this.last.vscroll.recIndEnd   = limit
        return [html1, html2]
    }

    getSummaryHTML() {
        if (this.summary.length === 0) return
        let rec_html = this.getRecordHTML(-1, 0) // need this in summary too for colspan to work properly
        let html1    = '<table><tbody>' + rec_html[0]
        let html2    = '<table><tbody>' + rec_html[1]
        for (let i = 0; i < this.summary.length; i++) {
            rec_html = this.getRecordHTML(i, i+1, true)
            html1   += rec_html[0]
            html2   += rec_html[1]
        }
        html1 += '</tbody></table>'
        html2 += '</tbody></table>'
        return [html1, html2]
    }

    // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scroll(event?: Event | any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj      = this
        const url      = this.url?.get ?? this.url

        const records  = query(this.box).find(`#grid_${this.name}_records`)
        const frecords = query(this.box).find(`#grid_${this.name}_frecords`)
        // sync scroll positions
        if (event) {
            const sTop  = event.target.scrollTop
            const sLeft = event.target.scrollLeft
            this.last.vscroll.scrollTop  = sTop
            this.last.vscroll.scrollLeft = sLeft
            const cols = query(this.box).find(`#grid_${this.name}_columns`)[0]
            const summary = query(this.box).find(`#grid_${this.name}_summary`)[0]
            if (cols) cols.scrollLeft = sLeft
            if (summary) summary.scrollLeft = sLeft
            if (frecords[0]) frecords[0].scrollTop = sTop
        }
        // hide bubble
        if (this.last.bubbleEl) {
            w2tooltip.hide(this.name + '-bubble')
            this.last.bubbleEl = null
        }
        // column virtual scroll
        let colStart = null
        let colEnd   = null
        if (this.disableCVS || this.columnGroups.length > 0) {
            // disable virtual scroll
            colStart = 0
            colEnd   = this.columns.length - 1
        } else {
            const sWidth = records.prop('clientWidth')
            let cLeft  = 0
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i]!.frozen || this.columns[i]!.hidden) continue
                const cSize = parseInt(this.columns[i]!.sizeCalculated ? this.columns[i]!.sizeCalculated! : String(this.columns[i]!.size ?? 0))
                if (cLeft + cSize + 30 > this.last.vscroll.scrollLeft && colStart == null) colStart = i
                if (cLeft + cSize - 30 > this.last.vscroll.scrollLeft + sWidth && colEnd == null) colEnd = i
                cLeft += cSize
            }
            if (colEnd == null) colEnd = this.columns.length - 1
        }
        if (colStart != null) {
            if (colStart < 0) colStart = 0
            if (colEnd < 0) colEnd = 0
            if (colStart == colEnd) {
                if (colStart > 0) colStart--; else colEnd++ // show at least one column
            }
            // ---------
            if (colStart != this.last.vscroll.colIndStart || colEnd != this.last.vscroll.colIndEnd) {
                const $box = query(this.box)
                const deltaStart = Math.abs(colStart - this.last.vscroll.colIndStart)
                const deltaEnd   = Math.abs(colEnd - this.last.vscroll.colIndEnd)
                // add/remove columns for small jumps
                if (deltaStart < 5 && deltaEnd < 5) {
                    const $cfirst = $box.find(`.w2ui-grid-columns #grid_${this.name}_column_start`)
                    const $clast  = $box.find('.w2ui-grid-columns .w2ui-head-last')
                    const $rfirst = $box.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`)
                    const $rlast  = $box.find(`#grid_${this.name}_records .w2ui-grid-data-last`)
                    const $sfirst = $box.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`)
                    const $slast  = $box.find(`#grid_${this.name}_summary .w2ui-grid-data-last`)
                    // remove on left
                    if (colStart > this.last.vscroll.colIndStart) {
                        for (let i = this.last.vscroll.colIndStart; i < colStart; i++) {
                            $box.find('#grid_'+ this.name +'_columns #grid_'+ this.name +'_column_'+ i).remove() // column
                            $box.find('#grid_'+ this.name +'_records td[col="'+ i +'"]').remove() // record
                            $box.find('#grid_'+ this.name +'_summary td[col="'+ i +'"]').remove() // summary
                        }
                    }
                    // remove on right
                    if (colEnd < this.last.vscroll.colIndEnd) {
                        for (let i = this.last.vscroll.colIndEnd; i > colEnd; i--) {
                            $box.find('#grid_'+ this.name +'_columns #grid_'+ this.name +'_column_'+ i).remove() // column
                            $box.find('#grid_'+ this.name +'_records td[col="'+ i +'"]').remove() // record
                            $box.find('#grid_'+ this.name +'_summary td[col="'+ i +'"]').remove() // summary
                        }
                    }
                    // add on left
                    if (colStart < this.last.vscroll.colIndStart) {
                        for (let i = (this.last.vscroll.colIndStart ?? 0) - 1; i >= colStart; i--) {
                            if (this.columns[i] && (this.columns[i]!.frozen || this.columns[i]!.hidden)) continue
                            $cfirst.after(this.getColumnCellHTML(i)) // column
                            // record
                            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            $rfirst.each((el: any) => {
                                const index = query(el).parent().attr('index')
                                let td    = '<td class="w2ui-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                                if (index != null) td = this.getCellHTML(parseInt(index), i, false)
                                query(el).after(td)
                            })
                            // summary
                            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            $sfirst.each((el: any) => {
                                const index = query(el).parent().attr('index')
                                let td    = '<td class="w2ui-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                                if (index != null) td = this.getCellHTML(parseInt(index), i, true)
                                query(el).after(td)
                            })
                        }
                    }
                    // add on right
                    if (colEnd > this.last.vscroll.colIndEnd) {
                        for (let i = (this.last.vscroll.colIndEnd ?? 0) + 1; i <= colEnd; i++) {
                            if (this.columns[i] && (this.columns[i]!.frozen || this.columns[i]!.hidden)) continue
                            $clast.before(this.getColumnCellHTML(i)) // column
                            // record
                            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            $rlast.each((el: any) => {
                                const index = query(el).parent().attr('index')
                                let td    = '<td class="w2ui-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                                if (index != null) td = this.getCellHTML(parseInt(index), i, false)
                                query(el).before(td)
                            })
                            // summary
                            // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            $slast.each((el: any) => {
                                const index = query(el).parent().attr('index') || -1
                                const td    = this.getCellHTML(parseInt(index), i, true)
                                query(el).before(td)
                            })
                        }
                    }
                    this.last.vscroll.colIndStart = colStart
                    this.last.vscroll.colIndEnd   = colEnd
                    this.resizeRecords()
                } else {
                    this.last.vscroll.colIndStart = colStart
                    this.last.vscroll.colIndEnd   = colEnd
                    // dot not just call this.refresh();
                    const colHTML   = this.getColumnsHTML()
                    const recHTML   = this.getRecordsHTML()
                    const sumHTML   = this.getSummaryHTML()
                    const $columns  = $box.find(`#grid_${this.name}_columns`)
                    const $records  = $box.find(`#grid_${this.name}_records`)
                    const $frecords = $box.find(`#grid_${this.name}_frecords`)
                    const $summary  = $box.find(`#grid_${this.name}_summary`)
                    $columns.find('tbody').html(colHTML[1])
                    $frecords.html(recHTML[0])
                    $records.prepend(recHTML[1])
                    if (sumHTML != null) $summary.html(sumHTML[1])
                    // need timeout to clean up (otherwise scroll problem)
                    setTimeout(() => {
                        $records.find(':scope > table').filter(':not(table:first-child)').remove()
                        if ($summary[0]) $summary[0].scrollLeft = this.last.vscroll.scrollLeft
                    }, 1)
                    this.resizeRecords()
                }
            }
        }
        // perform virtual scroll
        let buffered = this.records.length
        if (buffered > this.total && this.total !== -1) buffered = this.total
        if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length
        if (buffered === 0 || records.length === 0 || records.prop('clientHeight') === 0) return
        if (buffered > this.vs_start) this.last.vscroll.show_extra = this.vs_extra; else this.last.vscroll.show_extra = this.vs_start
        // update footer
        let t1 = Math.round(records.prop('scrollTop') / this.recordHeight + 1)
        let t2 = t1 + (Math.round(records.prop('clientHeight') / this.recordHeight) - 1)
        if (t1 > buffered) t1 = buffered
        if (t2 >= buffered - 1) t2 = buffered
        query(this.box).find('#grid_'+ this.name + '_footer .w2ui-footer-right').html(
            (this.show.statusRange
                ? w2utils.formatNumber(this.offset + t1) + '-' + w2utils.formatNumber(this.offset + t2) +
                    (this.total != -1 ? ' ' + w2utils.lang('of') + ' <span class="w2ui-total">' + w2utils.formatNumber(this.total) + '</span>' : '')
                    : '') +
            (url && this.show.statusBuffered ? ' ('+ w2utils.lang('buffered') + ' <span class="w2ui-buffered">'+ w2utils.formatNumber(buffered) + '</span>' +
                    (this.offset > 0 ? ', skip <span class="w2ui-skip">' + w2utils.formatNumber(this.offset) : '') + '</span>)' : '')
        )
        // only for local data source, else no extra records loaded
        if (!url && (!this.fixedBody || (this.total != -1 && this.total <= this.vs_start))) return
        // regular processing
        let start = Math.floor(records.prop('scrollTop') / this.recordHeight) - this.last.vscroll.show_extra
        let end   = start + Math.floor(records.prop('clientHeight') / this.recordHeight) + this.last.vscroll.show_extra * 2 + 1
        // let div  = start - this.last.vscroll.recIndStart;
        if (start < 1) start = 1
        if (end > this.total && this.total != -1) end = this.total
        const tr1  = records.find('#grid_'+ this.name +'_rec_top')
        const tr2  = records.find('#grid_'+ this.name +'_rec_bottom')
        const tr1f = frecords.find('#grid_'+ this.name +'_frec_top')
        const tr2f = frecords.find('#grid_'+ this.name +'_frec_bottom')
        // if row is expanded
        if (String(tr1.next().prop('id')).indexOf('_expanded_row') != -1) {
            tr1.next().remove()
            tr1f.next().remove()
        }
        if (this.total > end && String(tr2.prev().prop('id')).indexOf('_expanded_row') != -1) {
            tr2.prev().remove()
            tr2f.prev().remove()
        }
        const first = parseInt(tr1.next().attr('line'))
        const last  = parseInt(tr2.prev().attr('line'))
        let tmp, tmp1, tmp2, rec_start, rec_html
        if (first <= start || first == 1 || this.last.vscroll.pull_refresh) { // scroll down
            if (end <= last + this.last.vscroll.show_extra - 2 && end != this.total) return
            this.last.vscroll.pull_refresh = false
            // remove from top
            while (true) {
                tmp1 = frecords.find('#grid_'+ this.name +'_frec_top').next()
                tmp2 = records.find('#grid_'+ this.name +'_rec_top').next()
                if (tmp2.attr('line') == 'bottom') break
                if (parseInt(tmp2.attr('line')) < start) {
                    tmp1.remove()
                    tmp2.remove()
                } else {
                    break
                }
            }
            // add at bottom
            tmp = records.find('#grid_'+ this.name +'_rec_bottom').prev()
            rec_start = tmp.attr('line')
            if (rec_start == 'top') rec_start = start
            for (let i = parseInt(rec_start) + 1; i <= end; i++) {
                if (!this.records[i-1]) continue
                tmp2 = this.records[i-1]!.w2ui
                if (tmp2 && !Array.isArray(tmp2.children)) {
                    tmp2.expanded = false
                }
                rec_html = this.getRecordHTML(i-1, i)
                tr2.before(rec_html[1])
                tr2f.before(rec_html[0])
            }
            markSearch()
            setTimeout(() => { this.refreshRanges() }, 0)
        } else { // scroll up
            if (start >= first - this.last.vscroll.show_extra + 2 && start > 1) return
            // remove from bottom
            while (true) {
                tmp1 = frecords.find('#grid_'+ this.name +'_frec_bottom').prev()
                tmp2 = records.find('#grid_'+ this.name +'_rec_bottom').prev()
                if (tmp2.attr('line') == 'top') break
                if (parseInt(tmp2.attr('line')) > end) {
                    tmp1.remove()
                    tmp2.remove()
                } else {
                    break
                }
            }
            // add at top
            tmp       = records.find('#grid_'+ this.name +'_rec_top').next()
            rec_start = tmp.attr('line')
            if (rec_start == 'bottom') rec_start = end
            for (let i = parseInt(rec_start) - 1; i >= start; i--) {
                if (!this.records[i-1]) continue
                tmp2 = this.records[i-1]!.w2ui
                if (tmp2 && !Array.isArray(tmp2.children)) {
                    tmp2.expanded = false
                }
                rec_html = this.getRecordHTML(i-1, i)
                tr1.after(rec_html[1])
                tr1f.after(rec_html[0])
            }
            markSearch()
            setTimeout(() => { this.refreshRanges() }, 0)
        }
        // first/last row size
        const h1 = (start - 1) * this.recordHeight
        let h2 = (buffered - end) * this.recordHeight
        if (h2 < 0) h2 = 0
        tr1.css('height', h1 + 'px')
        tr1f.css('height', h1 + 'px')
        tr2.css('height', h2 + 'px')
        tr2f.css('height', h2 + 'px')
        this.last.vscroll.recIndStart = start
        this.last.vscroll.recIndEnd   = end
        // load more if needed
        const s = Math.floor(records.prop('scrollTop') / this.recordHeight)
        const e = s + Math.floor(records.prop('clientHeight') / this.recordHeight)
        if (e + 10 > buffered && this.last.vscroll.pull_more !== true && (buffered < this.total - this.offset || (this.total == -1 && this.last.fetch.hasMore))) {
            if (this.autoLoad === true) {
                this.last.vscroll.pull_more   = true
                this.last.fetch.offset = (this.last.fetch.offset ?? 0) + this.limit
                this.request('load')
            }
            // scroll function
            const more = query(this.box).find('#grid_'+ this.name +'_rec_more, #grid_'+ this.name +'_frec_more')
            more.show()
                .eq(1) // only main table
                .off('.load-more')
                .on('click.load-more', function(this: Element) {
                    // show spinner
                    query(this).find('td').html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>')
                    // load more
                    obj.last.vscroll.pull_more   = true
                    obj.last.fetch.offset = (obj.last.fetch.offset ?? 0) + obj.limit
                    obj.request('load')
                })
                .find('td')
                .html(obj.autoLoad
                    ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'
                    : '<div style="padding-top: 15px">'+ w2utils.lang('Load ${count} more...', { count: obj.limit }) + '</div>'
                )
        }

        function markSearch() {
            // mark search
            if (!obj.markSearch) return
            clearTimeout(obj.last.marker_timer ?? undefined)
            obj.last.marker_timer = setTimeout(() => {
                // mark all search strings
                const search = []
                for (let s = 0; s < obj.searchData.length; s++) {
                    const sdata = obj.searchData[s]!
                    const fld   = obj.getSearch(sdata.field)
                    if (!fld || fld.hidden) continue
                    const ind = obj.getColumn(sdata.field, true)
                    search.push({ field: sdata.field, search: sdata['value'], col: ind })
                }
                if (search.length > 0) {
                    search.forEach((item) => {
                        const el = query(obj.box).find('td[col="'+ item.col +'"]:not(.w2ui-head)')
                        w2utils.marker(el, item.search)
                    })
                }
            }, 50)
        }
    }

    getRecordHTML(ind: number, lineNum: number, summary?: boolean) {
        let tmph      = ''
        let rec_html1 = ''
        let rec_html2 = ''
        const sel       = this.last.selection
        let record
        // first record needs for resize purposes
        if (ind == -1) {
            rec_html1 += '<tr line="0">'
            rec_html2 += '<tr line="0">'
            if (this.show.lineNumbers) rec_html1 += '<td class="w2ui-col-number" style="height: 0px"></td>'
            if (this.show.selectColumn) rec_html1 += '<td class="w2ui-col-select" style="height: 0px"></td>'
            if (this.show.expandColumn) rec_html1 += '<td class="w2ui-col-expand" style="height: 0px"></td>'
            rec_html2 += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>'
            if (this.reorderRows) rec_html2 += '<td class="w2ui-col-order" style="height: 0px"></td>'
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i]!
                tmph    = '<td class="w2ui-grid-data" col="'+ i +'" style="height: 0px;"></td>'
                if (col.frozen && !col.hidden) {
                    rec_html1 += tmph
                } else {
                    if (col.hidden || i < this.last.vscroll.colIndStart || i > this.last.vscroll.colIndEnd) continue
                    rec_html2 += tmph
                }
            }
            rec_html1 += '<td class="w2ui-grid-data-last" style="height: 0px"></td>'
            rec_html2 += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>'
            rec_html1 += '</tr>'
            rec_html2 += '</tr>'
            return [rec_html1, rec_html2]
        }
        // regular record
        const url = this.url?.get ?? this.url
        if (summary !== true) {
            if (this.searchData.length > 0 && !url) {
                if (ind >= this.last.searchIds.length) return ''
                ind    = this.last.searchIds[ind] ?? ind
                record = this.records[ind]
            } else {
                if (ind >= this.records.length) return ''
                record = this.records[ind]
            }
        } else {
            if (ind >= this.summary.length) return ''
            record = this.summary[ind]
        }
        if (!record) return ''
        if (record.recid == null && this.recid != null) {
            const rid = this.parseField(record, this.recid)
            if (rid != null) record.recid = rid
        }
        let isRowSelected = false
        if (sel.indexes.indexOf(ind) != -1) isRowSelected = true
        let rec_style = (record.w2ui ? record.w2ui['style'] : '')
        if (rec_style == null || typeof rec_style != 'string') rec_style = ''
        let rec_class = (record.w2ui ? record.w2ui['class'] : '')
        if (rec_class == null || typeof rec_class != 'string') rec_class = ''
        // render TR
        rec_html1 += '<tr id="grid_'+ this.name +'_frec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ lineNum +'" index="'+ ind +'" '+
            ' class="'+ (lineNum % 2 === 0 ? 'w2ui-even' : 'w2ui-odd') + ' w2ui-record ' + rec_class +
                (isRowSelected && this.selectType == 'row' ? ' w2ui-selected' : '') +
                (record.w2ui && record.w2ui['editable'] === false ? ' w2ui-no-edit' : '') +
                (record.w2ui && record.w2ui.expanded === true ? ' w2ui-expanded' : '') + '" ' +
            ' style="height: '+ this.recordHeight +'px; '+ (!isRowSelected && rec_style != '' ? rec_style : rec_style.replace('background-color', 'none')) +'" '+
                (rec_style != '' ? 'custom_style="'+ rec_style +'"' : '') +
            '>'
        rec_html2 += '<tr id="grid_'+ this.name +'_rec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ lineNum +'" index="'+ ind +'" '+
            ' class="'+ (lineNum % 2 === 0 ? 'w2ui-even' : 'w2ui-odd') + ' w2ui-record ' + rec_class +
                (isRowSelected && this.selectType == 'row' ? ' w2ui-selected' : '') +
                (record.w2ui && record.w2ui['editable'] === false ? ' w2ui-no-edit' : '') +
                (record.w2ui && record.w2ui.expanded === true ? ' w2ui-expanded' : '') + '" ' +
            ' style="height: '+ this.recordHeight +'px; '+ (!isRowSelected && rec_style != '' ? rec_style : rec_style.replace('background-color', 'none')) +'" '+
                (rec_style != '' ? 'custom_style="'+ rec_style +'"' : '') +
            '>'
        if (this.show.lineNumbers) {
            rec_html1 += '<td id="grid_'+ this.name +'_cell_'+ ind +'_number' + (summary ? '_s' : '') + '" '+
                        '   class="w2ui-col-number '+ (isRowSelected ? ' w2ui-row-selected' : '') +'"'+
                            (this.reorderRows ? ' style="cursor: move"' : '') + '>'+
                            (summary !== true ? this.getLineHTML(lineNum) : '') +
                        '</td>'
        }
        if (this.show.selectColumn) {
            rec_html1 +=
                    '<td id="grid_'+ this.name +'_cell_'+ ind +'_select' + (summary ? '_s' : '') + '" class="w2ui-grid-data w2ui-col-select">'+
                        (summary !== true && !(record.w2ui && record.w2ui['hideCheckBox'] === true) ?
                        '    <div>'+
                        '        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" '+
                                    (isRowSelected ? 'checked="checked"' : '') + ' style="pointer-events: none"/>'+
                        '    </div>'
                        :
                        '' ) +
                    '</td>'
        }
        if (this.show.expandColumn) {
            let tmp_img = ''
            if (record.w2ui?.expanded === true) tmp_img = '-'; else tmp_img = '+'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (((record.w2ui?.expanded as any) == 'none' || !Array.isArray(record.w2ui?.children) || !record.w2ui?.children.length)) tmp_img = '+' // any: expanded is bool but runtime uses string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((record.w2ui?.expanded as any) == 'spinner') tmp_img = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>' // any: same
            rec_html1 +=
                    '<td id="grid_'+ this.name +'_cell_'+ ind +'_expand' + (summary ? '_s' : '') + '" class="w2ui-grid-data w2ui-col-expand">'+
                        (summary !== true ? `<div>${tmp_img}</div>` : '' ) +
                    '</td>'
        }
        // insert empty first column
        rec_html2 += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>'
        if (this.reorderRows) {
            rec_html2 +=
                    '<td id="grid_'+ this.name +'_cell_'+ ind +'_order' + (summary ? '_s' : '') + '" class="w2ui-grid-data w2ui-col-order" col="order">'+
                        (summary !== true ? '<div title="Drag to reorder">&nbsp;</div>' : '' ) +
                    '</td>'
        }
        let col_ind  = 0
        let col_skip = 0
        while (true) {
            let col_span = 1
            const col      = this.columns[col_ind]
            if (col == null) break
            if (col.hidden) {
                col_ind++
                if (col_skip > 0) col_skip--
                continue
            }
            if (col_skip > 0) {
                col_ind++
                if (this.columns[col_ind] == null) break
                record.w2ui!['colspan'][this.columns[col_ind-1]!.field] = 0 // need it for other methods
                col_skip--
                continue
            } else if (record.w2ui) {
                const tmp1 = record.w2ui['colspan']
                const tmp2 = this.columns[col_ind]!.field
                if (tmp1 && tmp1[tmp2] === 0) {
                    delete tmp1[tmp2] // if no longer colspan then remove 0
                }
            }
            // column virtual scroll
            if ((col_ind < (this.last.vscroll.colIndStart ?? 0) || col_ind > (this.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen) {
                col_ind++
                continue
            }
            if (record.w2ui) {
                if (typeof record.w2ui['colspan'] == 'object') {
                    const span = parseInt(record.w2ui['colspan'][col.field]) || null
                    if (span != null && span > 1) {
                        // if there are hidden columns, then no colspan on them
                        let hcnt = 0
                        for (let i = col_ind; i < col_ind + span; i++) {
                            if (i >= this.columns.length) break
                            if (this.columns[i]!.hidden) hcnt++
                        }
                        col_span = span - hcnt
                        col_skip = span - 1
                    }
                }
            }
            const rec_cell = this.getCellHTML(ind, col_ind, summary, col_span)
            if (col.frozen) rec_html1 += rec_cell; else rec_html2 += rec_cell
            col_ind++
        }
        rec_html1 += '<td class="w2ui-grid-data-last"></td>'
        rec_html2 += '<td class="w2ui-grid-data-last" col="end"></td>'
        rec_html1 += '</tr>'
        rec_html2 += '</tr>'
        return [rec_html1, rec_html2]
    }

    getLineHTML(lineNum: number): string {
        return '<div>' + lineNum + '</div>'
    }

    getCellHTML(ind: number, col_ind: number, summary?: boolean, col_span?: number) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        const col = this.columns[col_ind]!
        if (col == null) return ''
        const record  = (summary !== true ? this.records[ind] : this.summary[ind])
        // value, attr, style, className, divAttr — style/className/title reassigned below; keep let
        // eslint-disable-next-line prefer-const
        let { value, style, className, attr, divAttr, title } = this.getCellValue(ind, col_ind, summary, true)
        const edit = (ind !== -1 ? this.getCellEditable(ind, col_ind) : '')
        let divStyle = 'max-height: '+ this.recordHeight +'px;' + (col.clipboardCopy ? 'margin-right: 20px' : '')
        const isChanged = !summary && record?.w2ui?.['changes'] && record.w2ui['changes'][col.field] != null
        const sel = this.last.selection
        let isRowSelected = false
        let infoBubble    = ''
        if (sel.indexes.indexOf(ind) != -1) isRowSelected = true
        if (col_span == null) {
            if (record?.w2ui?.['colspan'] && record.w2ui['colspan'][col.field]) {
                col_span = record.w2ui['colspan'][col.field]
            } else {
                col_span = 1
            }
        }
        // expand icon
        if (col_ind === this.hierarchyColumn && Array.isArray(record?.w2ui?.children)) {
            let level  = 0
            let subrec = record.w2ui.parent_recid != null ? this.get(record.w2ui.parent_recid, true) : null
            while (true) {
                if (subrec != null) {
                    level++
                    const tmp = this.records[subrec]!.w2ui
                    if (tmp != null && tmp.parent_recid != null) {
                        subrec = this.get(tmp.parent_recid, true)
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            if (record.w2ui.parent_recid) {
                for (let i = 0; i < level; i++) {
                    infoBubble += '<span class="w2ui-show-children w2ui-icon-empty"></span>'
                }
            }
            const className = record.w2ui?.children?.length > 0
                ? (record.w2ui.expanded ? 'w2ui-icon-collapse' : 'w2ui-icon-expand')
                : 'w2ui-icon-empty'
            if (record.w2ui?.children?.length > 0) {
                infoBubble += `<span class="w2ui-show-children ${className}"></span>`
            }
        }
        // info bubble
        if (col['info'] === true) col['info'] = {}
        if (col['info'] != null) {
            let infoIcon = 'w2ui-icon-info'
            if (typeof col['info'].icon == 'function') {
                infoIcon = col['info'].icon(record, { self: this, index: ind, colIndex: col_ind, summary: !!summary })
            } else if (typeof col['info'].icon == 'object') {
                infoIcon = col['info'].icon[this.parseField(record, col.field)] || ''
            } else if (typeof col['info'].icon == 'string') {
                infoIcon = col['info'].icon
            }
            let infoStyle = col['info'].style || ''
            if (typeof col['info'].style == 'function') {
                infoStyle = col['info'].style(record, { self: this, index: ind, colIndex: col_ind, summary: !!summary })
            } else if (typeof col['info'].style == 'object') {
                infoStyle = col['info'].style[this.parseField(record, col.field)] || ''
            } else if (typeof col['info'].style == 'string') {
                infoStyle = col['info'].style
            }
            infoBubble += `<span class="w2ui-info ${infoIcon}" style="${infoStyle}"></span>`
        }
        let data = value
        // if editable checkbox
        if (edit && ['checkbox', 'check'].indexOf(edit.type) != -1) {
            const changeInd = summary ? -(ind + 1) : ind
            divStyle += 'text-align: center;'
            data  = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${changeInd}" data-colInd="${col_ind}" ${data ? 'checked="checked"' : ''}>`
            infoBubble    = ''
        }
        // if renderer returned title it will have priority
        data = `<div style="${divStyle}" ${getTitle(data, title)} ${divAttr}>${infoBubble}${String(data)}</div>`
        if (data == null) data = ''
        // --> cell TD
        if (typeof col.render == 'string') {
            const tmp = col.render.replace('|', ':').split(':')
            if (['number', 'int', 'float', 'money', 'currency', 'percent', 'size'].includes(tmp[0]!)) {
                style += 'text-align: right;'
            }
        }
        if (record?.w2ui) {
            if (record.w2ui.styles == null) {
                record.w2ui.styles = record.w2ui['style']
            }
            if (typeof record.w2ui.styles == 'object') {
                if (typeof record.w2ui.styles[col_ind] == 'string') style += record.w2ui.styles[col_ind] + ';'
                if (typeof record.w2ui.styles[col.field] == 'string') style += record.w2ui.styles[col.field] + ';'
            }
            if (typeof record.w2ui['class'] == 'object') {
                if (typeof record.w2ui['class'][col_ind] == 'string') className += record.w2ui['class'][col_ind] + ' '
                if (typeof record.w2ui['class'][col.field] == 'string') className += record.w2ui['class'][col.field] + ' '
            }
        }
        let isCellSelected = false
        if (isRowSelected && sel.columns[ind]?.includes(col_ind)) isCellSelected = true
        // clipboardCopy
        let clipboardIcon
        if (col.clipboardCopy){
            clipboardIcon = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>'
        }
        // data
        data = '<td class="w2ui-grid-data'+ (isCellSelected ? ' w2ui-selected' : '') + ' ' + className +
                    (isChanged ? ' w2ui-changed' : '') + '" '+
                '   id="grid_'+ this.name +'_data_'+ ind +'_'+ col_ind +'" col="'+ col_ind +'" '+
                '   style="'+ style + (col.style != null ? col.style : '') +'" '+
                    (col.attr != null ? col.attr : '') + attr +
                    ((col_span ?? 0) > 1 ? 'colspan="'+ col_span + '"' : '') +
                '>' + data + (clipboardIcon && w2utils.stripTags(data) ? clipboardIcon : '') +'</td>'
        // summary top row
        if (ind === -1 && summary === true) {
            data = '<td class="w2ui-grid-data" col="'+ col_ind +'" style="height: 0px; '+ style + '" '+
                        ((col_span ?? 0) > 1 ? 'colspan="'+ col_span + '"' : '') +
                    '></td>'
        }
        return data

        // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getTitle(cellData: any, title: any){
            if (title === undefined && obj.show.recordTitles) {
                if (col['title'] != null) {
                    if (typeof col['title'] == 'function') {
                        title = col['title'].call(obj, record, { self: obj, index: ind, colIndex: col_ind, summary: !!summary })
                    }
                    if (typeof col['title'] == 'string') title = col['title']
                } else {
                    title = w2utils.stripTags(String(cellData).replace(/"/g, '\'\''))
                }
            }
            return (title != null) ? 'title="' + String(title) + '"' : ''
        }
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clipboardCopy(ind: any, col_ind: any, summary: any) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const rec = (summary ? this.summary[ind] : this.records[ind])!
        const col = this.columns[col_ind]
        let txt = (col ? this.parseField(rec, col.field) : '')
        if (col && typeof col.clipboardCopy == 'function') {
            txt = col.clipboardCopy(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary })
        }
        query(this.box).find('#grid_' + this.name + '_focus').text(txt).get(0).select()
        document.execCommand('copy')
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showBubble(ind: any, col_ind: any, summary: any) {
        const info = this.columns[col_ind]?.['info']
        if (!info) return
        let html = ''
        const rec  = this.records[ind]
        const el   = query(this.box).find(`${summary ? '.w2ui-grid-summary' : ''} #grid_${this.name}_data_${ind}_${col_ind} .w2ui-info`)
        if (this.last.bubbleEl) {
            w2tooltip.hide(this.name + '-bubble')
        }
        this.last.bubbleEl = el
        // if no fields defined - show all
        if (info.fields == null) {
            info.fields = []
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i]!
                info.fields.push(col.field + (typeof col.render == 'string' ? ':' + col.render : ''))
            }
        }
        let fields = info.fields
        if (typeof fields == 'function') {
            fields = fields(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary }) // custom renderer
        }
        // generate html
        if (typeof info.render == 'function') {
            html = info.render(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary })

        } else if (Array.isArray(fields)) {
            // display mentioned fields
            html = '<table cellpadding="0" cellspacing="0">'
            for (let i = 0; i < fields.length; i++) {
                const tmp = String(fields[i]).split(':')
                if (tmp[0] == '' || tmp[0] == '-' || tmp[0] == '--' || tmp[0] == '---') {
                    html += '<tr><td colspan=2><div style="border-top: '+ (tmp[0] == '' ? '0' : '1') +'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>'
                    continue
                }
                let col = this.getColumn(tmp[0] ?? '')
                if (col == null) col = { field: tmp[0] ?? '', text: tmp[0] ?? '', caption: tmp[0] } as W2GridColumn // if not found in columns
                let val = (col ? this.parseField(rec, col.field) : '')
                // if change by inline editing
                if (rec?.w2ui?.['changes']?.[col.field] != null) {
                    val = rec.w2ui['changes'][col.field]
                }
                if (tmp.length > 1) {
                    if (w2utils.formatters[tmp[1] ?? '']) {
                        const extra = {
                            self: this,
                            value: val,
                            params: tmp[2] || null,
                            field: this.columns[col_ind]!.field,
                            index: ind,
                            colIndex: col_ind,
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        val = (w2utils.formatters[tmp[1]!] as any).call(this, rec, extra) // any: formatter this-binding mismatch
                    } else {
                        console.log('ERROR: w2utils.formatters["'+ tmp[1] + '"] does not exists.')
                    }
                }
                if (typeof val == 'object' && val.text != null) val = val.text
                if (info.showEmpty !== true && (val == null || val == '')) continue
                if (info.maxLength != null && typeof val == 'string' && val.length > info.maxLength) val = val.substr(0, info.maxLength) + '...'
                html += '<tr><td>' + col.text + '</td><td>' + ((val === 0 ? '0' : val) || '') + '</td></tr>'
            }
            html += '</table>'
        } else if (w2utils.isPlainObject(fields)) {
            // display some fields
            html = '<table cellpadding="0" cellspacing="0">'
            for (const caption in fields) {
                const fld = fields[caption]
                if (fld == '' || fld == '-' || fld == '--' || fld == '---') {
                    html += '<tr><td colspan=2><div style="border-top: '+ (fld == '' ? '0' : '1') +'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>'
                    continue
                }
                const tmp = String(fld).split(':')
                let col = this.getColumn(tmp[0] ?? '')
                if (col == null) col = { field: tmp[0] ?? '', text: tmp[0] ?? '', caption: tmp[0] } as W2GridColumn // if not found in columns
                let val = (col ? this.parseField(rec, col.field) : '')
                // if change by inline editing
                if (rec?.w2ui?.['changes']?.[col.field] != null) {
                    val = rec.w2ui['changes'][col.field]
                }
                if (tmp.length > 1) {
                    if (w2utils.formatters[tmp[1] ?? '']) {
                        const extra = {
                            self: this,
                            value: val,
                            params: tmp[2] || null,
                            field: this.columns[col_ind]!.field,
                            index: ind,
                            colIndex: col_ind,
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        val = (w2utils.formatters[tmp[1]!] as any).call(this, rec, extra) // any: formatter this-binding mismatch
                    } else {
                        console.log('ERROR: w2utils.formatters["'+ tmp[1] + '"] does not exists.')
                    }
                }
                if (typeof fld == 'function') {
                    val = fld(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary })
                }
                if (val?.text != null) val = val.text
                if (info.showEmpty !== true && (val == null || val == '')) continue
                if (info.maxLength != null && typeof val == 'string' && val.length > info.maxLength) val = val.substr(0, info.maxLength) + '...'
                html += '<tr><td>' + caption + '</td><td>' + ((val === 0 ? '0' : val) || '') + '</td></tr>'
            }
            html += '</table>'
        }
        return w2tooltip.show(w2utils.extend({
            name: this.name + '-bubble',
            html,
            anchor: el.get(0),
            position: 'top|bottom',
            class: 'w2ui-info-bubble',
            style: '',
            hideOn: ['doc-click']
        }, info.options ?? {}))
            .hide(() => [
                this.last.bubbleEl = null
            ])
    }

    // return null or the editable object if the given cell is editable
    // any: return type any — caller narrows by code path; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellEditable(ind: number, col_ind: number): any {
        const col = this.columns[col_ind]
        const rec = this.records[ind]!
        if (!rec || !col) return null
        let edit = (rec.w2ui ? rec.w2ui['editable'] : null)
        if (edit === false) return null
        if (edit == null || edit === true) {
            edit = (Object.keys(col['editable'] ?? {}).length > 0 ? col['editable'] : null)
            if (typeof col['editable'] === 'function') {
                const value = this.getCellValue(ind, col_ind, false)
                // same arguments as col.render()
                edit = col['editable'].call(this, rec, { self: this, value, index: ind, colIndex: col_ind })
            }
        }
        return edit
    }

    // any: return type any — caller narrows by code path; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellValue(ind: number, col_ind: number, summary?: boolean, extra?: boolean): any {
        const col = this.columns[col_ind]!
        const record = (summary !== true ? this.records[ind] : this.summary[ind])
        let value = this.parseField(record, col.field)
        let className = '', style = '', attr = '', divAttr = ''
        let title
        // if change by inline editing
        if (record?.w2ui?.['changes']?.[col.field] != null) {
            value = record.w2ui['changes'][col.field]
        }
        // if there is a cell renderer
        if (col.render != null && ind !== -1) {
            let render = col.render
            let params
            // predefined formatters
            if (typeof render == 'string') {
                const tmp = render.toLowerCase().replace('|', ':').split(':')
                // formatters
                let func = w2utils.formatters[tmp[0] ?? '']
                if (col['options'] && col['options'].autoFormat === false) {
                    func = undefined
                }
                // any: cast-to-any for return-position narrowing; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render = func as any
                params = tmp[1]
            }
            if (typeof render == 'function' && record != null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let html: any // any: render can be W2Formatter or column render, shapes differ
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    html = (render as any).call(this, record, { // any: unified call for both formatter and column render
                        self: this,
                        value, params,
                        field: this.columns[col_ind]!.field,
                        index: ind,
                        colIndex: col_ind,
                        summary: !!summary
                    })
                } catch (e) {
                    throw new Error(`Render function for column "${col.field}" in grid "${this.name}": -- ` + (e as Error).message)
                }
                if (html != null && typeof html == 'object' && typeof html != 'function') {
                    if (html.id != null && html.text != null) {
                        // normalized menu kind of return
                        value = html.text
                    } else if (typeof html.html == 'string' || typeof html.html == 'number') {
                        value = String(html.html ?? '').trim()
                    } else {
                        value = ''
                        console.log('ERROR: render function should return a primitive or an object of the following structure.',
                            { html: '', attr: '', style: '', class: '', divAttr: '' }, '... but it returned:', html)
                    }
                    attr = html.attr ?? ''
                    style = html.style ?? ''
                    className = html.class ?? ''
                    divAttr = html.divAttr ?? ''
                    // pass undefined up
                    title = html.title
                } else {
                    value = String(html || '').trim()
                }
            }
            // if it is an object
            if (typeof render == 'object') {
                // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tmp = (render as any)[value]
                if (tmp != null && tmp !== '') {
                    value = tmp
                }
            }
        }
        if (value == null) value = ''
        return !extra ? value : { value, attr, style, className, divAttr, title }
    }

    getFooterHTML() {
        return '<div>'+
            '    <div class="w2ui-footer-left"></div>'+
            '    <div class="w2ui-footer-right"></div>'+
            '    <div class="w2ui-footer-center"></div>'+
            '</div>'
    }

    status(msg?: string) {
        if (msg != null) {
            query(this.box).find(`#grid_${this.name}_footer`).find('.w2ui-footer-left').html(msg)
        } else {
            // show number of selected
            let msgLeft = ''
            const sel     = this.getSelection()
            if (sel.length > 0) {
                if (this.show.statusSelection && sel.length > 1) {
                    msgLeft = String(sel.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + w2utils.settings.groupSymbol) + ' ' + w2utils.lang('selected')
                }
                if (this.show.statusRecordID && sel.length == 1) {
                    let tmp = sel[0]
                    if (typeof tmp == 'object') tmp = tmp.recid + ', '+ w2utils.lang('Column') +': '+ tmp.column
                    msgLeft = w2utils.lang('Record ID') + ': '+ tmp + ' '
                }
            }
            query(this.box).find('#grid_'+ this.name +'_footer .w2ui-footer-left').html(msgLeft)
        }
    }

    lock(msg?: string, showSpinner?: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const args: any[] = [this.box, msg, showSpinner] // any: w2utils.lock accepts mixed args
        setTimeout(() => {
            // hide empty msg if any
            query(this.box).find('#grid_'+ this.name +'_empty_msg').remove()
            // any: cast-to-any for dynamic dispatch; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(w2utils.lock as any)(...args)
        }, 10)
    }

    unlock(speed?: number) {
        setTimeout(() => {
            // do not unlock if there is a message
            if (query(this.box).find('.w2ui-message').hasClass('w2ui-closing')) return
            w2utils.unlock(this.box, speed)
        }, 25) // needed timer so if server fast, it will not flash
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateSave(returnOnly: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state: { columns: Record<string, any>[]; show: any; last: any; sortData: any[]; searchData: any[] } = { // any: state blob is serialized JSON
            columns: [],
            show: w2utils.clone(this.show),
            last: {
                search: this.last.search,
                multi : this.last.multi,
                logic : this.last.logic,
                label : this.last.label,
                field : this.last.field,
                scrollTop : this.last.vscroll.scrollTop,
                scrollLeft: this.last.vscroll.scrollLeft
            },
            sortData  : [],
            searchData: []
        }
        // any: targeted-any per typing_policy; w2grid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let prop_val: any
        for (let i = 0; i < this.columns.length; i++) {
            const col          = this.columns[i]
            // any: Record<string, any> — dynamic property bag; w2grid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const col_save_obj: Record<string, any> = {}
            // iterate properties to save
            Object.keys(this.stateColProps).forEach((prop, _idx) => {
                // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((this.stateColProps as any)[prop]){
                    // check if the property is defined on the column
                    // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((col as any)[prop] !== undefined){
                        // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        prop_val = (col as any)[prop]
                    } else {
                        // use fallback or null
                        // any: cast-then-index for dynamic property access; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        prop_val = (this.colTemplate as any)[prop] || null
                    }
                    col_save_obj[prop] = prop_val
                }
            })
            state.columns.push(col_save_obj)
        }
        for (let i = 0; i < this.sortData.length; i++) state.sortData.push(w2utils.clone(this.sortData[i]))
        for (let i = 0; i < this.searchData.length; i++) state.searchData.push(w2utils.clone(this.searchData[i]))
        // event before
        const edata = this.trigger('stateSave', { target: this.name, state: state })
        if (edata.isCancelled === true) {
            return
        }
        // save into local storage
        if (returnOnly !== true) {
            this.cacheSave('state', state)
        }
        // event after
        edata.finish()
        return state
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stateRestore(newState?: any) { // any: state blob is serialized JSON
        const url = this.url?.get ?? this.url
        if (!newState) {
            newState = this.cache('state')
        }
        // event before
        const edata = this.trigger('stateRestore', { target: this.name, state: newState })
        if (edata.isCancelled === true) {
            return
        }
        // default behavior
        if (w2utils.isPlainObject(newState)) {
            w2utils.extend(this.show, newState.show ?? {})
            w2utils.extend(this.last, newState.last ?? {})
            const sTop  = this.last.vscroll.scrollTop
            const sLeft = this.last.vscroll.scrollLeft
            for (let c = 0; c < newState.columns?.length; c++) {
                const tmp       = newState.columns[c]
                const col_index = this.getColumn(tmp.field, true)
                if (col_index !== null) {
                    w2utils.extend(this.columns[col_index]!, tmp)
                    // restore column order from saved state
                    if (c !== col_index) this.columns.splice(c, 0, this.columns.splice(col_index, 1)[0]!)
                }
            }
            this.sortData.splice(0, this.sortData.length)
            for (let c = 0; c < newState.sortData?.length; c++) {
                this.sortData.push(newState.sortData[c])
            }
            this.searchData.splice(0, this.searchData.length)
            for (let c = 0; c < newState.searchData?.length; c++) {
                this.searchData.push(newState.searchData[c])
            }
            // apply sort and search
            setTimeout(() => {
                // needs timeout as records need to be populated
                // ez 10.09.2014 this -->
                if (!url) {
                    if (this.sortData.length > 0) this.localSort()
                    if (this.searchData.length > 0) this.localSearch()
                }
                this.last.vscroll.scrollTop = sTop
                this.last.vscroll.scrollLeft = sLeft
                this.refresh()
            }, 1)
            console.log(`INFO (w2ui): state restored for "${this.name}"`)
        }
        // event after
        edata.finish()
        return true
    }

    stateReset() {
        this.stateRestore(this.last.state)
        this.cacheSave('state', null)
    }

    // any: return type any — caller narrows by code path; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseField(obj: W2GridRecord | null | undefined, field: string): any {
        let val
        if (this.nestedFields) {
            val = w2utils.getNested(obj, field)
        } else {
            val = obj?.[field]
        }
        return (val != null ? val : '')
    }

    prepareData() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this

        // loops thru records and prepares date and time objects
        for (let r = 0; r < this.records.length; r++) {
            const rec = this.records[r]!
            prepareRecord(rec)
        }

        // prepare date and time objects for the 'rec' record and its closed children
        function prepareRecord(rec: W2GridRecord): void {
            for (let c = 0; c < obj.columns.length; c++) {
                const column = obj.columns[c]!
                if (rec[column.field] == null || typeof column.render != 'string') continue
                // number
                if (['number', 'int', 'float', 'money', 'currency', 'percent'].indexOf(column.render.split(':')[0] ?? '') != -1) {
                    if (typeof rec[column.field] != 'number') rec[column.field] = parseFloat(rec[column.field])
                }
                // date
                if (['date', 'age'].indexOf(column.render.split(':')[0] ?? '') != -1) {
                    if (!rec[column.field + '_']) {
                        let dt = rec[column.field]
                        if (w2utils.isInt(dt)) dt = parseInt(dt)
                        rec[column.field + '_'] = new Date(dt)
                    }
                }
                // time
                if (['time'].indexOf(column.render) != -1) {
                    if (w2utils.isTime(rec[column.field])) { // if string
                        // any: cast-to-any for return-position narrowing; w2grid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const tmp = w2utils.isTime(rec[column.field], true) as any
                        const dt  = new Date()
                        dt.setHours(tmp.hours, tmp.minutes, (tmp.seconds ? tmp.seconds : 0), 0) // sets hours, min, sec, mills
                        if (!rec[column.field + '_']) rec[column.field + '_'] = dt
                    } else { // if date object
                        let tmp = rec[column.field]
                        if (w2utils.isInt(tmp)) tmp = parseInt(tmp)
                        tmp    = (tmp != null ? new Date(tmp) : new Date())
                        const dt = new Date()
                        dt.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), 0) // sets hours, min, sec, mills
                        if (!rec[column.field + '_']) rec[column.field + '_'] = dt
                    }
                }
            }

            if (rec.w2ui?.children && rec.w2ui?.expanded !== true) {
                // there are closed children, prepare them too.
                for (let r = 0; r < rec.w2ui.children.length; r++) {
                    const subRec = rec.w2ui.children[r]!
                    prepareRecord(subRec)
                }
            }
        }
    }

    nextCell(index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
        const check = col_ind + 1
        if (check >= this.columns.length) {
            const nextIdx = this.nextRow(index)
            return nextIdx == null ? null : this.nextCell(nextIdx, -1, editable)
        }
        const tmp = this.records[index]?.w2ui
        const col = this.columns[check]
        const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
        if (col == null) return null
        if (col && col.hidden || span === 0) return this.nextCell(index, check, editable)
        if (editable) {
            const edit = this.getCellEditable(index, check)
            if (edit == null || ['checkbox', 'check'].indexOf(edit.type) != -1) {
                return this.nextCell(index, check, editable)
            }
        }
        return { index, colIndex: check }
    }

    prevCell(index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
        const check = col_ind - 1
        if (check < 0) {
            const prevIdx = this.prevRow(index)
            return prevIdx == null ? null : this.prevCell(prevIdx, this.columns.length, editable)
        }
        if (check < 0) return null
        const tmp = this.records[index]?.w2ui
        const col = this.columns[check]
        const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
        if (col == null) return null
        if (col && col.hidden || span === 0) return this.prevCell(index, check, editable)
        if (editable) {
            const edit = this.getCellEditable(index, check)
            if (edit == null || ['checkbox', 'check'].indexOf(edit.type) != -1) {
                return this.prevCell(index, check, editable)
            }
        }
        return { index, colIndex: check }
    }

    nextRow(ind: number, col_ind?: number, numRows?: number): number | null {
        const sids = this.last.searchIds
        let ret  = null
        if (numRows == null) numRows = 1
        if (numRows == -1) {
            return this.records.length-1
        }
        if ((ind + numRows < this.records.length && sids.length === 0) // if there are more records
                || (sids.length > 0 && ind < (sids[sids.length-numRows] ?? 0))) {
            ind += numRows
            if (sids.length > 0) while (true) {
                if (sids.includes(ind) || ind > this.records.length) break
                ind += numRows
            }
            // colspan
            const tmp  = this.records[ind]?.w2ui
            const col  = col_ind != null ? this.columns[col_ind] : undefined
            const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
            if (span === 0 || tmp?.selectable === false) {
                ret = this.nextRow(ind, col_ind, numRows)
            } else {
                ret = ind
            }
        }
        return ret
    }

    prevRow(ind: number, col_ind?: number, numRows?: number): number | null {
        const sids = this.last.searchIds
        let ret  = null
        if (numRows == null) numRows = 1
        if (numRows == -1) {
            return 0
        }
        if ((ind - numRows >= 0 && sids.length === 0) // if there are more records
                || (sids.length > 0 && ind > (sids[0] ?? 0))) {
            ind -= numRows
            if (sids.length > 0) while (true) {
                if (sids.includes(ind) || ind < 0) break
                ind -= numRows
            }
            // colspan
            const tmp  = this.records[ind]?.w2ui
            const col  = col_ind != null ? this.columns[col_ind] : undefined
            const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
            if (span === 0 || tmp?.selectable === false) {
                ret = this.prevRow(ind, col_ind, numRows)
                if (ret == null) ret = ind
            } else {
                ret = ind
            }
        }
        return ret
    }

    selectionSave() {
        this.last.saved_sel = this.getSelection()
        return this.last.saved_sel
    }

    selectionRestore(noRefresh?: boolean) {
        const time = Date.now()
        this.last.selection = { indexes: [], columns: {} }
        const sel = this.last.selection
        const lst = this.last.saved_sel
        if (lst) for (let i = 0; i < lst.length; i++) {
            if (w2utils.isPlainObject(lst[i])) {
                // selectType: cell
                const tmp = this.get(lst[i].recid, true)
                if (tmp != null) {
                    if (sel.indexes.indexOf(tmp) == -1) sel.indexes.push(tmp)
                    if (!sel.columns[tmp]) sel.columns[tmp] = []
                    sel.columns[tmp].push(lst[i].column)
                }
            } else {
                // selectType: row
                const tmp = this.get(lst[i], true)
                if (tmp != null) sel.indexes.push(tmp)
            }
        }
        delete this.last.saved_sel
        if (noRefresh !== true) this.refresh()
        return Date.now() - time
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message(options?: any) { // any: message options vary by type (string, object)
        return w2utils.message({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            owner: this as any, // any: w2grid.lock signature differs from owner.lock type
            box  : this.box,
            after: '.w2ui-grid-header'
        }, options)
    }

    // any: callback parameter — caller signature varies; w2grid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confirm(options: any) {
        return w2utils.confirm({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            owner: this as any, // any: w2grid.lock signature differs from owner.lock type
            box  : this.box,
            after: '.w2ui-grid-header'
        }, options)
    }
}

export { w2grid }
