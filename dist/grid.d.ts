import { b as TsMessageProm } from './tsutils-message-NW-eqnQ1.js';
import { TsBase, TsEventPayload } from './base.js';
import { R as RecId } from './types-CaAxK51B.js';
import './query-CKGg5Ugv.js';

/** A single data record stored in the grid */
interface TsGridRecord {
    recid: string | number;
    TsUi?: {
        summary?: boolean;
        children?: TsGridRecord[];
        parent_recid?: string | number;
        expanded?: boolean;
        selectable?: boolean;
        styles?: Record<string, string>;
        [key: string]: any;
    };
    [key: string]: any;
}
/** Sort descriptor used in grid.sortData */
interface TsGridSortData {
    field: string;
    direction: 'asc' | 'desc';
    field_?: string;
    [key: string]: any;
}
/** Virtual scroll state kept in grid.last.vscroll */
interface TsGridVScroll {
    scrollTop: number;
    scrollLeft: number;
    recIndStart: number | null;
    recIndEnd: number | null;
    colIndStart: number;
    colIndEnd: number;
    pull_more: boolean;
    pull_refresh: boolean;
    show_extra: number;
}
/** Fetch state kept in grid.last.fetch */
interface TsGridFetch {
    action: string;
    offset?: number | null;
    start: number;
    response: number;
    options: RequestInit | null;
    controller: AbortController | null;
    loaded: boolean;
    hasMore: boolean;
}
/** Column definition — T5.2 */
interface TsGridColumn {
    field: string;
    text: string | ((col: TsGridColumn) => string);
    size?: string | number;
    min?: number;
    max?: number;
    frozen?: boolean;
    hidden?: boolean;
    hideable?: boolean;
    resizable?: boolean;
    sortable?: boolean;
    searchable?: boolean | string;
    sortMode?: string;
    editable?: boolean | {
        type: string;
        [key: string]: any;
    } | ((rec: TsGridRecord, cell: any) => any);
    render?: string | ((record: TsGridRecord, index: number, colIndex: number) => string);
    tooltip?: string;
    style?: string;
    attr?: string;
    clipboardCopy?: boolean | ((record: TsGridRecord, cell: any) => string);
    colspan?: Record<string, number> | ((record: TsGridRecord, index: number) => number);
    sizeCalculated?: string;
    sizeOriginal?: string | number;
    sizeType?: string;
    gridMinWidth?: number;
    [key: string]: any;
}
/** Search field definition — T5.2 */
interface TsGridSearch {
    field: string;
    label?: string;
    caption?: string;
    type: string;
    hidden?: boolean;
    attr?: string;
    text?: string;
    style?: string;
    operator?: string;
    operators?: string[];
    options?: Record<string, any>;
    value?: any;
    svalue?: any;
    [key: string]: any;
}
/** Internal last-state object */
interface TsGridLast {
    field: string;
    label: string;
    logic: 'AND' | 'OR';
    search: string;
    searchIds: number[];
    selection: TsGridSelection;
    saved_sel: any | null;
    multi: boolean;
    fetch: TsGridFetch;
    vscroll: TsGridVScroll;
    sel_ind: number | null;
    sel_col: number | null;
    sel_type: string | null;
    sel_recid: string | number | null;
    idCache: Record<string | number, number>;
    move: any | null;
    cancelClick: boolean | null;
    inEditMode: boolean;
    _edit: {
        value: any;
        index: number;
        column: number;
        recid: string | number;
        [key: string]: any;
    } | null;
    kbd_timer: ReturnType<typeof setTimeout> | null;
    marker_timer: ReturnType<typeof setTimeout> | null;
    click_time: number | null;
    click_recid: string | number | null;
    bubbleEl: HTMLElement | null;
    colResizing: boolean;
    tmp: any | null;
    copy_event: any | null;
    userSelect: string;
    columnDrag: false | {
        remove(): void;
    };
    state: any | null;
    toolbar_height: number;
    groupBy_links: Record<string, TsGridRecord>;
    originalSort?: (string | number)[];
    [key: string]: any;
}
/** Cell-level selection descriptor returned by `getSelectionCells()` (and by `getSelection()` when `selectType === 'cell'`). */
interface TsGridCellSelection {
    recid: string | number;
    index: number;
    column: number;
}
/** Selection state — T5.4 */
interface TsGridSelection {
    indexes: number[];
    columns: Record<string | number, number[]>;
}
/** Range endpoint (used in addRange / refreshRanges) */
interface TsGridRangeEndpoint {
    recid: string | number;
    column: number;
    index?: number;
}
/** Range descriptor for addRange / refreshRanges */
interface TsGridRange {
    name: string;
    range: TsGridRangeEndpoint[];
    style?: string;
    class?: string;
    [key: string]: any;
}
/** Active search filter — one entry in grid.searchData — T5.5 */
interface TsGridSearchFilter {
    field: string;
    type: string;
    operator: string;
    value?: any;
    svalue?: any;
    text?: string;
    [key: string]: any;
}
/** GroupBy configuration object */
interface TsGridGroupBy {
    field: string;
    [key: string]: any;
}
declare class TsGrid extends TsBase {
    [key: string]: any;
    name: string;
    box: HTMLElement | null;
    columns: TsGridColumn[];
    columnGroups: any[];
    records: TsGridRecord[];
    summary: TsGridRecord[];
    searches: TsGridSearch[];
    toolbar: any;
    ranges: TsGridRange[];
    contextMenu: any[];
    searchMap: Record<string, string>;
    searchData: TsGridSearchFilter[];
    sortMap: Record<string, string>;
    sortData: TsGridSortData[];
    savedSearches: any[];
    defaultSearches: any[];
    groupBy: TsGridGroupBy | null;
    total: number;
    recid: string | null;
    hierarchyColumn: number;
    last: TsGridLast;
    header: string;
    url: any;
    limit: number;
    offset: number;
    postData: Record<string, any>;
    routeData: Record<string, any>;
    httpHeaders: Record<string, string>;
    show: {
        header: boolean;
        toolbar: boolean;
        footer: boolean;
        columnMenu: boolean;
        columnHeaders: boolean;
        lineNumbers: boolean;
        expandColumn: boolean;
        selectColumn: boolean;
        emptyRecords: boolean;
        toolbarReload: boolean;
        toolbarColumns: boolean;
        toolbarSearch: boolean;
        toolbarAdd: boolean;
        toolbarEdit: boolean;
        toolbarDelete: boolean;
        toolbarSave: boolean;
        searchAll: boolean;
        searchLogic: boolean;
        searchHiddenMsg: boolean;
        searchSave: boolean;
        statusRange: boolean;
        statusBuffered: boolean;
        statusRecordID: boolean;
        statusSelection: boolean;
        statusResponse: boolean;
        statusSort: boolean;
        statusSearch: boolean;
        recordTitles: boolean;
        selectionBorder: boolean;
        selectionResizer: boolean;
        skipRecords: boolean;
        saveRestoreState: boolean;
        columns?: boolean;
    };
    stateId: string | null;
    hasFocus: boolean;
    autoLoad: boolean;
    fixedBody: boolean;
    recordHeight: number;
    lineNumberWidth: number;
    keyboard: boolean;
    selectType: 'row' | 'cell';
    liveSearch: boolean;
    multiSearch: boolean;
    multiSelect: boolean;
    multiSort: boolean;
    reorderColumns: boolean;
    reorderRows: boolean;
    showExtraOnSearch: number;
    markSearch: boolean;
    columnTooltip: string;
    disableCVS: boolean;
    nestedFields: boolean;
    vs_start: number;
    vs_extra: number;
    style: string;
    tabIndex: number | null;
    dataType: string | null;
    parser: ((data: any) => any) | null;
    advanceOnEdit: boolean;
    useLocalStorage: boolean;
    colTemplate: Record<string, any>;
    stateColProps: Record<string, boolean>;
    msgDelete: string;
    msgNotJSON: string;
    msgHTTPError: string;
    msgServerError: string;
    msgRefresh: string;
    msgNeedReload: string;
    msgEmpty: string;
    buttons: Record<string, any>;
    operators: Record<string, any[]>;
    defaultOperator: Record<string, string>;
    operatorsMap: Record<string, string>;
    onAdd: ((event: TsEventPayload) => void) | null;
    onEdit: ((event: TsEventPayload) => void) | null;
    onRequest: ((event: TsEventPayload) => void) | null;
    onLoad: ((event: TsEventPayload) => void) | null;
    onDelete: ((event: TsEventPayload) => void) | null;
    onSave: ((event: TsEventPayload) => void) | null;
    onSelect: ((event: TsEventPayload) => void) | null;
    onClick: ((event: TsEventPayload) => void) | null;
    onDblClick: ((event: TsEventPayload) => void) | null;
    onContextMenu: ((event: TsEventPayload) => void) | null;
    onContextMenuClick: ((event: TsEventPayload) => void) | null;
    onColumnClick: ((event: TsEventPayload) => void) | null;
    onColumnDblClick: ((event: TsEventPayload) => void) | null;
    onColumnContextMenu: ((event: TsEventPayload) => void) | null;
    onColumnResize: ((event: TsEventPayload) => void) | null;
    onColumnAutoResize: ((event: TsEventPayload) => void) | null;
    onSort: ((event: TsEventPayload) => void) | null;
    onSearch: ((event: TsEventPayload) => void) | null;
    onSearchOpen: ((event: TsEventPayload) => void) | null;
    onSearchClose: ((event: TsEventPayload) => void) | null;
    onChange: ((event: TsEventPayload) => void) | null;
    onRestore: ((event: TsEventPayload) => void) | null;
    onExpand: ((event: TsEventPayload) => void) | null;
    onCollapse: ((event: TsEventPayload) => void) | null;
    onError: ((event: TsEventPayload) => void) | null;
    onKeydown: ((event: TsEventPayload) => void) | null;
    onToolbar: ((event: TsEventPayload) => void) | null;
    onColumnOnOff: ((event: TsEventPayload) => void) | null;
    onCopy: ((event: TsEventPayload) => void) | null;
    onPaste: ((event: TsEventPayload) => void) | null;
    onSelectionExtend: ((event: TsEventPayload) => void) | null;
    onEditField: ((event: TsEventPayload) => void) | null;
    onRender: ((event: TsEventPayload) => void) | null;
    onRefresh: ((event: TsEventPayload) => void) | null;
    onReload: ((event: TsEventPayload) => void) | null;
    onResize: ((event: TsEventPayload) => void) | null;
    onDestroy: ((event: TsEventPayload) => void) | null;
    onStateSave: ((event: TsEventPayload) => void) | null;
    onStateRestore: ((event: TsEventPayload) => void) | null;
    onFocus: ((event: TsEventPayload) => void) | null;
    onBlur: ((event: TsEventPayload) => void) | null;
    onReorderRow: ((event: TsEventPayload) => void) | null;
    onSearchSave: ((event: TsEventPayload) => void) | null;
    onSearchRemove: ((event: TsEventPayload) => void) | null;
    onSearchSelect: ((event: TsEventPayload) => void) | null;
    onColumnSelect: ((event: TsEventPayload) => void) | null;
    onColumnDragStart: ((event: TsEventPayload) => void) | null;
    onColumnDragEnd: ((event: TsEventPayload) => void) | null;
    onResizerDblClick: ((event: TsEventPayload) => void) | null;
    onMouseEnter: ((event: TsEventPayload) => void) | null;
    onMouseLeave: ((event: TsEventPayload) => void) | null;
    constructor(options: Record<string, any>);
    add(record: TsGridRecord | TsGridRecord[], first?: boolean): number;
    find(obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[];
    set(recid: any, record?: any, noRefresh?: boolean): boolean;
    replace(recid: string | number, record: TsGridRecord, noRefresh?: boolean): boolean;
    get(recid: (string | number)[], returnIndex?: boolean): (TsGridRecord | number)[];
    get(recid: string | number, returnIndex: true): number | null;
    get(recid: string | number, returnIndex?: false): TsGridRecord | null;
    getFirst(offset?: number): TsGridRecord | null;
    remove(...recids: (string | number)[]): number;
    /**
     * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
     * needs to be cleared when record is cleared
     */
    processGroupBy(): void;
    /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
    addColumn(before: any, columns?: any): number;
    removeColumn(...fields: string[]): number;
    getColumn(): string[];
    getColumn(field: string, returnIndex: true): number | null;
    getColumn(field: string, returnIndex?: false): TsGridColumn | null;
    updateColumn(fields: string | string[], updates: Partial<TsGridColumn> | Record<string, any>): number;
    toggleColumn(...fields: string[]): number;
    showColumn(...fields: string[]): number;
    hideColumn(...fields: string[]): number;
    /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
    addSearch(before: any, search?: any): number;
    removeSearch(...fields: string[]): any;
    getSearch(): string[];
    getSearch(field: string, returnIndex: true): number | null;
    getSearch(field: string, returnIndex?: false): TsGridSearch | null;
    toggleSearch(...fields: string[]): any;
    showSearch(...fields: string[]): any;
    hideSearch(...fields: string[]): any;
    getSearchData(field: string): Record<string, any> | null;
    localSort(silent?: boolean, noResetRefresh?: boolean): number | undefined;
    localSearch(silent?: boolean): number | undefined;
    getRangeData(range: [{
        recid: string | number;
        column: number;
    }, {
        recid: string | number;
        column: number;
    }], extra?: boolean): any[];
    addRange(rangesInput: TsGridRange | TsGridRange[] | string | Record<string, any>): number;
    removeRange(...names: string[]): number;
    refreshRanges(): number | undefined;
    select(...selectArgs: any[]): any;
    unselect(...unselectArgs: any[]): number;
    compareSelection(newSel: any[]): {
        select: any[];
        unselect: any[];
    };
    selectAll(): number | undefined;
    selectNone(skipEvent?: boolean): number | undefined;
    updateToolbar(sel?: any, _areAllSelected?: boolean): void;
    /**
     * Row-mode selection. Returns the recids of selected records, or their indexes
     * when `returnIndex === true`. Unaffected by `selectType === 'cell'` — callers
     * should branch on `this.selectType` and use `getSelectionCells()` for cell mode.
     */
    getSelectionRows(returnIndex?: boolean): RecId[] | number[];
    /**
     * Cell-mode selection. Returns one descriptor per selected cell. `returnIndex`
     * is intentionally not a parameter — it was ignored in cell mode by the legacy
     * `getSelection()` API.
     */
    getSelectionCells(): TsGridCellSelection[];
    /**
     * Discriminated-union wrapper. The shape depends on `this.selectType`:
     *   - `'row'`  → `RecId[]` (or `number[]` if `returnIndex === true`)
     *   - `'cell'` → `TsGridCellSelection[]` (`returnIndex` is ignored)
     *
     * Prefer the typed split methods (`getSelectionRows` / `getSelectionCells`)
     * when the caller knows the mode statically. This wrapper is kept for back-
     * compat with the v2.0 API and for callers that genuinely handle both modes.
     */
    getSelection(returnIndex?: boolean): RecId[] | number[] | TsGridCellSelection[];
    search(field?: any, value?: any): any;
    searchOpen(options?: any): any;
    searchClose(): void;
    searchFieldTooltip(ind: any, sd_ind: any, el: any): any;
    searchSuggest(imediate?: boolean, forceHide?: boolean, anchor?: HTMLElement | Element): any;
    searchSave(): void;
    cache(type: any): any;
    cacheSave(type: any, value: any): any;
    searchReset(noReload?: boolean): void;
    searchShowFields(forceHide?: boolean): void;
    searchInitInput(field: string, _value?: any): any;
    clear(noRefresh?: boolean): void;
    reset(noRefresh?: boolean): void;
    skip(offset: any, callBack?: any): void;
    load(url: any, callBack?: any): Promise<any>;
    reload(callBack?: (...args: any[]) => void): Promise<any>;
    request(action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any>;
    requestComplete(data: any, action: any, callBack: any, resolve: any, reject: any): Promise<any> | undefined;
    error(msg: any): void;
    getChanges(recordsBase?: TsGridRecord[]): Record<string, any>[];
    mergeChanges(): void;
    save(callBack?: (data: any) => void): void;
    editField(recid: string | number, column: number, value: any, event?: any): any;
    editChange(input?: any, index?: any, column?: any, event?: any): any;
    editDone(index?: any, column?: any, event?: any): any;
    'delete'(force?: boolean): void;
    click(recid: string | number | {
        recid: string | number;
        column?: number;
    } | any, event?: MouseEvent | any): any;
    columnClick(field: string, event?: MouseEvent | any): void;
    columnDblClick(field: any, event: any): void;
    columnContextMenu(field: any, event: any): void;
    columnAutoSize(colIndex?: number): true | undefined;
    columnAutoSizeAll(): void;
    focus(event?: Event | any): false | undefined;
    blur(event?: Event | any): false | undefined;
    keydown(event: KeyboardEvent | any): void;
    scrollIntoView(ind?: number | null, column?: number, instant?: boolean, recTop?: boolean): void;
    scrollToColumn(field: any): void;
    dblClick(recid: string | number | {
        recid: string | number;
        column?: number;
    } | any, event?: MouseEvent | any): any;
    showContextMenu(event: MouseEvent | any, options: {
        recid?: string | number;
        index?: number;
        column?: number;
    }): void;
    contextMenuClick(recid: string | number, column: number | null, event: any): void;
    toggle(recid: string | number, _event?: Event): boolean | undefined;
    /**
     * When record is expaned, then TsUi.children of the record is copied into this.records and this.total is updated. It will
     * also set TsUi._copeid = true, so it would not copy it again.
     *
     * There is also updateExpaned() that is called in this.refresh()
     */
    expand(recid: any, noRefresh?: any): boolean;
    collapse(recid: any, noRefresh?: any): boolean;
    updateExpanded(): void;
    sort(field?: string, direction?: 'asc' | 'desc' | '' | null, multiField?: boolean): void;
    copy(flag: any, oEvent?: ClipboardEvent | any): any;
    /**
     * Gets value to be copied to the clipboard
     * @param ind index of the record
     * @param col_ind index of the column
     * @returns the displayed value of the field's record associated with the cell
     */
    getCellCopy(ind: any, col_ind: any): unknown;
    paste(text: string, event?: ClipboardEvent | any): void;
    resize(): number | undefined;
    update({ cells, fullCellRefresh, ignoreColumns }?: any): number;
    refreshCell(recid: any, field: any): boolean;
    refreshRow(recid: any, ind?: any): boolean;
    refresh(): number | undefined;
    refreshSearch(): void;
    refreshBody(): void;
    render(box?: HTMLElement | string | null): number | undefined;
    unmount(): void;
    destroy(): void;
    initColumnOnOff(): any[];
    initColumnDrag(_box?: any): {
        remove(): void;
    };
    columnOnOff(event: MouseEvent | any, field: string): void;
    initToolbar(): void;
    initResize(): void;
    resizeBoxes(): void;
    resizeRecords(): void;
    getSearchesHTML(): string;
    getOperators(type: any, opers: any): any;
    initOperator(ind: any): any;
    initSearchLists(changedField?: any): any;
    initSearches(): void;
    getColumnsHTML(): string[];
    getColumnCellHTML(i: any): string;
    columnTooltipShow(ind: any, _event: any): void;
    columnTooltipHide(_ind: any, _event: any): void;
    getRecordsHTML(): string[];
    getSummaryHTML(): string[] | undefined;
    scroll(event?: Event | any): void;
    getRecordHTML(ind: number, lineNum: number, summary?: boolean): string[] | "";
    getLineHTML(lineNum: number): string;
    getCellHTML(ind: number, col_ind: number, summary?: boolean, col_span?: number): any;
    clipboardCopy(ind: any, col_ind: any, summary: any): void;
    showBubble(ind: any, col_ind: any, summary: any): any;
    getCellEditable(ind: number, col_ind: number): any;
    getCellValue(ind: number, col_ind: number, summary?: boolean, extra?: boolean): any;
    getFooterHTML(): string;
    status(msg?: string): void;
    lock(msg?: string, showSpinner?: boolean): void;
    unlock(speed?: number): void;
    stateSave(returnOnly: any): {
        columns: Record<string, any>[];
        show: any;
        last: any;
        sortData: any[];
        searchData: any[];
    } | undefined;
    stateRestore(newState?: any): true | undefined;
    stateReset(): void;
    parseField(obj: TsGridRecord | null | undefined, field: string): any;
    prepareData(): void;
    nextCell(index: number, col_ind: number, editable?: boolean): {
        index: number;
        colIndex: number;
    } | null;
    prevCell(index: number, col_ind: number, editable?: boolean): {
        index: number;
        colIndex: number;
    } | null;
    nextRow(ind: number, col_ind?: number, numRows?: number): number | null;
    prevRow(ind: number, col_ind?: number, numRows?: number): number | null;
    selectionSave(): any;
    selectionRestore(noRefresh?: boolean): number;
    message(options?: any): TsMessageProm | undefined;
    confirm(options: any): TsMessageProm | undefined;
}

export { TsGrid, type TsGridCellSelection, type TsGridColumn, type TsGridGroupBy, type TsGridRange, type TsGridRangeEndpoint, type TsGridRecord, type TsGridSearch, type TsGridSelection, type TsGridSortData };
