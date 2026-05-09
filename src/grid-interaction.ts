/**
 * grid-interaction.ts — Interaction domain extracted from TsGrid (Phase 7 of v2.0 SDD).
 * All functions take (grid: TsGrid, ...args) and are delegated from TsGrid methods.
 * DAG: leaf module — imports only tsgrid (type), query, TsUtils, TsMenu, TsTooltip.
 * FORBIDDEN: do NOT import any other grid-*.ts module (R3).
 * Cross-domain calls (refresh, localSort, localSearch, editField, select, etc.) go through grid.X() delegators.
 */

import type { TsGrid, TsGridCellSelection, TsGridRecord } from './tsgrid.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'
import { TsMenu as _w2menu } from './tstooltip.js'
import type { RecId } from './types.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsMenu = _w2menu as any // any: menu overlay with dynamic option shapes

// any: recid can be string|number (row select) or {recid, column} object (cell select)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function click(grid: TsGrid, recid: string | number | { recid: string | number; column?: number } | any, event?: MouseEvent | any) {
    const time = Date.now()
    let column = null
    if (grid.last.cancelClick == true || (event && event.altKey)) return
    if ((typeof recid == 'object') && (recid !== null)) {
        column = recid.column
        recid  = recid.recid
    }
    if (event == null) event = {}
    // check for double click
    if (time - (grid.last.click_time as number) < 350 && grid.last.click_recid == recid && event.type == 'click') {
        grid.dblClick(recid, event)
        return
    }
    // hide bubble
    if (grid.last.bubbleEl) {
        grid.last.bubbleEl = null
    }
    grid.last.click_time  = time
    const last_recid = grid.last.click_recid
    grid.last.click_recid = recid
    // column user clicked on
    if (column == null && event.target) {
        let trg = event.target
        if (trg.tagName != 'TD') trg = query(trg).closest('td')[0]
        if (query(trg).attr('col') != null) column = parseInt(query(trg).attr('col'))
    }
    // check if record is selectable
    const index = grid.get(recid, true)
    const rec = index != null ? grid.records[index]! : null
    if (rec?.TsUi?.selectable === false && (rec?.TsUi?.children?.length ?? 0) > 0) {
        // if not a show-children button, then toggle
        if (!query(event.target).hasClass('tsg-show-children')) {
            grid.toggle(recid)
            return
        }
    }
    // event before
    const edata = grid.trigger('click', { target: grid.name, recid, column, originalEvent: event })
    if (edata.isCancelled === true) return
    // default action
    const sel = grid.getSelection()
    query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', false)
    const ind = grid.get(recid, true)
    const selectColumns   = []
    grid.last.sel_ind   = ind
    grid.last.sel_col   = column
    grid.last.sel_recid = recid
    grid.last.sel_type  = 'click'
    // multi select with shift key
    let start: number = 0, end: number = 0, t1: number = 0, t2: number = 0
    if (event.shiftKey && sel.length > 0 && grid.multiSelect) {
        const cellSel = sel as TsGridCellSelection[]
        if (typeof sel[0] === 'object' && cellSel[0]!.recid != null) {
            start = grid.get(cellSel[0]!.recid, true) ?? 0
            end   = grid.get(recid, true) ?? 0
            if (column > cellSel[0]!.column) {
                t1 = cellSel[0]!.column
                t2 = column
            } else {
                t1 = column
                t2 = cellSel[0]!.column
            }
            for (let c = t1; c <= t2; c++) selectColumns.push(c)
        } else {
            start = last_recid != null ? (grid.get(last_recid, true) ?? 0) : 0
            end   = grid.get(recid, true) ?? 0
        }
        const sel_add = []
        if (start > end) { const tmp = start; start = end; end = tmp }
        const url = grid.url?.get ?? grid.url
        for (let i = start; i <= end; i++) {
            if (grid.searchData.length > 0 && !url && !grid.last.searchIds.includes(i)) continue
            if (grid.selectType == 'row') {
                sel_add.push(grid.records[i]!.recid)
            } else {
                for (let sc = 0; sc < selectColumns.length; sc++) {
                    sel_add.push({ recid: grid.records[i]!.recid, column: selectColumns[sc] })
                }
            }
            //sel.push(grid.records[i]!.recid);
        }
        grid.select(sel_add)
    } else {
        const last = grid.last.selection
        let flag = (last.indexes.indexOf(ind ?? -1) != -1 ? true : false)
        let fselect = false
        // if clicked on the checkbox
        if (query(event.target).closest('td').hasClass('tsg-col-select')) fselect = true
        // clear other if necessary
        if (((!event.ctrlKey && !event.shiftKey && !event.metaKey && !fselect) || !grid.multiSelect) && !grid['showSelectColumn']) {
            if (grid.selectType != 'row' && !last.columns[ind ?? -1]?.includes(column)) {
                flag = false
            }
            if (flag === true && sel.length == 1) {
                grid.unselect({ recid: recid, column: column })
            } else {
                grid.selectNone(true) // no need to trigger select event
                grid.select({ recid: recid, column: column })
            }
        } else {
            if (grid.selectType != 'row') flag = false
            if (flag === true) {
                grid.unselect({ recid: recid, column: column })
            } else {
                grid.select({ recid: recid, column: column })
            }
        }
    }
    grid.status()
    grid.initResize()
    // event after
    edata.finish()
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnClick(grid: TsGrid, field: string, event?: MouseEvent | any) {
    // ignore click if column was resized
    if (grid.last.colResizing === true) {
        return
    }
    // event before
    let edata = grid.trigger('columnClick', { target: grid.name, field: field, originalEvent: event })
    if (edata.isCancelled === true) return
    // default behaviour
    if (grid.selectType == 'row') {
        const column = grid.getColumn(field)
        if (column && column.sortable) grid.sort(field, null, (event && (event.ctrlKey || event.metaKey || event.shiftKey) ? true : false))
        if (edata.detail['field'] == 'line-number') {
            if (grid.getSelection().length >= grid.records.length) {
                grid.selectNone()
            } else {
                grid.selectAll()
            }
        }
    } else {
        if (event.altKey){
            const column = grid.getColumn(field)
            if (column && column.sortable) grid.sort(field, null, (event && (event.ctrlKey || event.metaKey || event.shiftKey) ? true : false))
        }
        // select entire column
        if (edata.detail['field'] == 'line-number') {
            if (grid.getSelection().length >= grid.records.length) {
                grid.selectNone()
            } else {
                grid.selectAll()
            }
        } else {
            if (!event.shiftKey && !event.metaKey && !event.ctrlKey) {
                grid.selectNone(true)
            }
            const tmp    = grid.getSelectionCells()
            const column = grid.getColumn(edata.detail['field'] as string, true) ?? 0
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
            edata = grid.trigger('columnSelect', { target: grid.name, columns: cols })
            if (edata.isCancelled !== true) {
                for (let i = 0; i < grid.records.length; i++) {
                    sel.push({ recid: grid.records[i]!.recid, column: cols })
                }
                grid.select(sel)
            }
            edata.finish()
        }
    }
    // event after
    edata.finish()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnDblClick(grid: TsGrid, field: any, event: any) { // any: field is string; event is MouseEvent or CustomEvent
    // event before
    const edata = grid.trigger('columnDblClick', { target: grid.name, field: field, originalEvent: event })
    if (edata.isCancelled === true) return
    // event after
    edata.finish()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnContextMenu(grid: TsGrid, field: any, event: any) { // any: field is string; event is MouseEvent
    const edata = grid.trigger('columnContextMenu', { target: grid.name, field: field, originalEvent: event })
    if (edata.isCancelled === true) return
    // show menu
    TsMenu.show({
        type: 'check',
        contextMenu: true,
        originalEvent: event,
        items: grid.initColumnOnOff()
    })
    .then(() => {
        query('#w2overlay-context-menu .tsg-grid-skip')
            .off('.tsg-grid')
            .on('click.tsg-grid', (evt: Event) => {
                evt.stopPropagation()
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('keypress', (evt: any) => { // any: KeyboardEvent at runtime; typed loosely
                if (evt.keyCode == 13) {
                    grid.skip(evt.target.value)
                    grid.toolbar.click('tsg-column-on-off') // close menu
                }
            })
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .select((event: any) => { // any: TsMenu select event shape varies
        const id = event.detail.item.id
        if (['tsg-stateSave', 'tsg-stateReset'].includes(id)) {
            grid[id.substring(5)]()
        } else if (id == 'tsg-skip') {
            // empty
        } else {
            grid.columnOnOff(event, event.detail.item.id)
        }
        clearTimeout(grid.last.kbd_timer ?? undefined) // keep grid in focus
    })
    clearTimeout(grid.last.kbd_timer ?? undefined) // keep grid in focus
    // cancel default
    event.preventDefault()
    edata.finish()
}

// if called w/o arguments, then will resize all columns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnAutoSize(grid: TsGrid, colIndex?: number) {
    if (colIndex === undefined) {
        // autoSize all columns
        grid.columns.forEach((col, i) => grid.columnAutoSize(i))
        return
    }
    const col = grid.columns[colIndex]!
    const el = query(`#grid_${grid.name}_column_${colIndex} .tsg-col-header`)[0]
    if (col['autoResize'] === false || col.hidden === true || !el) {
        return true
    }
    const style = getComputedStyle(el)
    let maxWidth = TsUtils.getStrWidth(el.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true)
        + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4

    query(grid.box).find(`.tsg-grid-records td[col="${colIndex}"] > div`, grid.box).each((el: Node) => {
        const htmlEl = el as HTMLElement // cast: query().each() passes Element but typed as Node
        const style = getComputedStyle(htmlEl)
        const width = TsUtils.getStrWidth(htmlEl.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true)
            + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4 // add some extra because of the border
        if (maxWidth < width) {
            maxWidth = width
        }
    })

    // event before
    const edata = grid.trigger('columnAutoResize', { maxWidth, originalEvent: event, target: grid.name, column: col })
    if (edata.isCancelled === true) { return }

    if (maxWidth > 0) {
        if (col.sizeOriginal == null) col.sizeOriginal = col.size ?? ''
        col.size = Math.min(Math.abs(maxWidth), col.max || Infinity) + 'px'
        grid.resizeRecords()
        grid.resizeRecords() // Why do we have to call it twice in order to show the scrollbar?
        grid.scroll()
    }
    // event after
    edata.finish()
}

export function columnAutoSizeAll(grid: TsGrid) {
    grid.columns.forEach((col, ind) => grid.columnAutoSize(ind))
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function focus(grid: TsGrid, event?: Event | any) {
    // event before
    const edata = grid.trigger('focus', { target: grid.name, originalEvent: event })
    if (edata.isCancelled === true) return false
    // default behaviour
    grid.hasFocus = true
    query(grid.box).removeClass('tsg-inactive').find('.tsg-inactive').removeClass('tsg-inactive')
    setTimeout(() => {
        const txt = query(grid.box).find(`#grid_${grid.name}_focus`).get(0)
        if (txt && document.activeElement != txt) {
            txt.focus()
        }
    }, 10)
    // event after
    edata.finish()
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blur(grid: TsGrid, event?: Event | any) {
    // event before
    const edata = grid.trigger('blur', { target: grid.name, originalEvent: event })
    if (edata.isCancelled === true) return false
    // default behaviour
    grid.hasFocus = false
    query(grid.box).addClass('tsg-inactive').find('.tsg-selected').addClass('tsg-inactive')
    query(grid.box).find('.tsg-selection').addClass('tsg-inactive')
    // event after
    edata.finish()
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function keydown(grid: TsGrid, event: KeyboardEvent | any) {
    // this method is called from TsUtils
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    const url = grid.url?.get ?? grid.url
    if (obj.keyboard !== true) return
    // trigger event
    const edata = obj.trigger('keydown', { target: obj.name, originalEvent: event })
    if (edata.isCancelled === true) return
    // default behavior
    if (query(grid.box).find('.tsg-message').length > 0) {
        // if there are messages
        if (event.keyCode == 27) grid.message()
        return
    }
    let empty   = false
    const records = query(obj.box).find('#grid_'+ obj.name +'_records')
    const sel     = obj.getSelection()
    if (sel.length === 0) empty = true
    // any: keyboard nav handles row/cell modes inline; recid is narrowed by `typeof recid == 'object'` runtime guard below
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recid: any = sel[0] || null
    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let columns: any[] = []
    // any: same as recid above; runtime-narrowed below
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recid2: any = sel[sel.length-1]
    // Cell-mode alias used by sub-functions (moveLeft/Right/Up/Down) when selectType !== 'row'.
    // Same data as `sel`, narrowed to TsGridCellSelection[]; safe to read inside the
    // selectType-checked branches below.
    const cellSel = sel as TsGridCellSelection[]
    if (typeof recid == 'object' && recid != null) {
        const cellSel = sel as TsGridCellSelection[]
        recid   = cellSel[0]!.recid
        columns = []
        let ii  = 0
        while (true) {
            if (!cellSel[ii] || cellSel[ii]!.recid != recid) break
            columns.push(cellSel[ii]!.column)
            ii++
        }
        recid2 = cellSel[cellSel.length-1]!.recid
    }
    const ind      = obj.get(recid, true) ?? -1
    const ind2     = obj.get(recid2, true) ?? -1
    const recEL    = query(obj.box).find(`#grid_${obj.name}_rec_${(ind >= 0 ? TsUtils.escapeId(obj.records[ind]!.recid) : 'none')}`)
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
            if (grid.selectType == 'row' && obj.show.expandColumn === true) {
                if (recEL.length <= 0) break
                obj.toggle(recid, event)
                cancel = true
            } else { // or enter edit
                for (let c = 0; c < grid.columns.length; c++) {
                    const edit = grid.getCellEditable(ind, c)
                    if (edit) {
                        columns.push(c)
                        break
                    }
                }
                // edit last column that was edited
                if (grid.selectType == 'row' && grid.last._edit && grid.last._edit['column']) {
                    columns = [grid.last._edit['column']]
                }
                if (columns.length > 0) {
                    obj.editField(recid, columns[0] ?? grid.last['editColumn'], null, event)
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
            if (TsUtils.isSafari) {
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
                if (TsUtils.isSafari) {
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
                if (TsUtils.isSafari) {
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
            const tmp = obj.records[ind]!.TsUi || {}
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
                            if (tmp.indexOf(cellSel[i]!.recid) == -1) tmp.push(cellSel[i]!.recid)
                            unSel.push({ recid: cellSel[i]!.recid, column: columns[columns.length-1]! })
                        }
                        obj.unselect(unSel)
                        obj.scrollIntoView(ind, columns[columns.length-1]!, true)
                    } else {
                        for (let i = 0; i < sel.length; i++) {
                            if (tmp.indexOf(cellSel[i]!.recid) == -1) tmp.push(cellSel[i]!.recid)
                            newSel.push({ recid: cellSel[i]!.recid, column: prevCol })
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
                            if (tmp.indexOf(cellSel[i]!.recid) == -1) tmp.push(cellSel[i]!.recid)
                            unSel.push({ recid: cellSel[i]!.recid, column: columns[0]! })
                        }
                        obj.unselect(unSel)
                        obj.scrollIntoView(ind, columns[0]!, true)
                    } else {
                        for (let i = 0; i < sel.length; i++) {
                            if (tmp.indexOf(cellSel[i]!.recid) == -1) tmp.push(cellSel[i]!.recid)
                            newSel.push({ recid: cellSel[i]!.recid, column: nextCol })
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
        let prev = obj.prevRow(ind, obj.selectType == 'row' ? 0 : cellSel[0]!.column, numRows)
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
        let next = obj.nextRow(ind2, obj.selectType == 'row' ? 0 : cellSel[0]!.column, numRows)
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
                    if (cellSel[s]!.recid == obj.last.sel_recid && cellSel[s]!.column == obj.last.sel_col) {
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
                // tmpUnselect runs in row mode here (cell-mode early-returns above)
                const rowSel = sel as Array<RecId | number>
                rowSel.splice(rowSel.indexOf(obj.records[obj.last.sel_ind ?? 0]!.recid as RecId), 1)
                obj.unselect(rowSel)
                return true
            }
            return false
        }
    }
}

export function scrollIntoView(grid: TsGrid, ind?: number | null, column?: number, instant?: boolean, recTop?: boolean) {
    let buffered = grid.records.length
    if (grid.searchData.length != 0 && !grid.url) buffered = grid.last.searchIds.length
    if (buffered === 0) return
    if (ind == null) {
        const sel = grid.getSelection()
        if (sel.length === 0) return
        if (TsUtils.isPlainObject(sel[0])) {
            const cellSel = sel as TsGridCellSelection[]
            ind    = cellSel[0]!.index
            column = cellSel[0]!.column
        } else {
            ind = grid.get(sel[0] as RecId | number, true)
        }
    }
    const records = query(grid.box).find(`#grid_${grid.name}_records`)
    const recWidth  = records[0].clientWidth
    const recHeight = records[0].clientHeight
    const recSTop   = records[0].scrollTop
    const recSLeft  = records[0].scrollLeft
    // if all records in view
    const len = grid.last.searchIds.length
    if (len > 0) ind = grid.last.searchIds.indexOf(ind ?? 0) // if search is applied
    // smooth or instant
    records.css({ 'scroll-behavior': instant ? 'auto' : 'smooth' })

    // vertical
    if (recHeight < grid.recordHeight * (len > 0 ? len : buffered) && records.length > 0) {
        // scroll to correct one
        const t1 = Math.floor(recSTop / grid.recordHeight)
        const t2 = t1 + Math.floor(recHeight / grid.recordHeight)
        if (ind == t1) {
            records.prop('scrollTop', recSTop - recHeight / 1.3)
        }
        if (ind == t2) {
            records.prop('scrollTop', recSTop + recHeight / 1.3)
        }
        if ((ind ?? 0) < t1 || (ind ?? 0) > t2) {
            records.prop('scrollTop', ((ind ?? 0) - 1) * grid.recordHeight)
        }
        if (recTop === true) {
            records.prop('scrollTop', (ind ?? 0) * grid.recordHeight)
        }
    }

    // horizontal
    if (column != null) {
        let x1 = 0
        let x2 = 0
        const sb = TsUtils.scrollBarSize() as number
        for (let i = 0; i <= column; i++) {
            const col = grid.columns[i]!
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
export function scrollToColumn(grid: TsGrid, field: any) { // any: field name is string
    if (field == null)
        return
    let sWidth = 0
    let found  = false
    for (let i = 0; i < grid.columns.length; i++) {
        const col = grid.columns[i]!
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
    grid.last.vscroll.scrollLeft = sWidth + 1
    grid.scroll()
}

// any: recid can be string|number (row select) or {recid, column} object (cell select)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dblClick(grid: TsGrid, recid: string | number | { recid: string | number; column?: number } | any, event?: MouseEvent | any) {
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
    const index = grid.get(recid, true)
    const rec   = index != null ? grid.records[index] : null
    // event before
    const edata = grid.trigger('dblClick', { target: grid.name, recid: recid, column: column, originalEvent: event })
    if (edata.isCancelled === true) return
    // default action
    grid.selectNone(true) // no need to trigger select event
    const edit = index != null ? grid.getCellEditable(index, column) : null
    if (edit) {
        grid.editField(recid, column, null, event)
    } else {
        grid.select({ recid: recid, column: column })
        if (grid.show.expandColumn || (rec && rec.TsUi && Array.isArray(rec.TsUi.children))) grid.toggle(recid)
    }
    // event after
    edata.finish()
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showContextMenu(grid: TsGrid, event: MouseEvent | any, options: { recid?: string | number; index?: number; column?: number }) {
    const { recid, index, column } = options
    if (grid.last.userSelect == 'text') return
    if (event == null) {
        event = { offsetX: 0, offsetY: 0, target: query(grid.box).find(`#grid_${grid.name}_rec_${recid}`)[0] }
    }
    if (event.offsetX == null) {
        event.offsetX = event.layerX - event.target.offsetLeft
        event.offsetY = event.layerY - event.target.offsetTop
    }
    // if (TsUtils.isFloat(recid)) recid = parseFloat(recid)
    if (grid.selectType == 'row') {
        const sel = grid.getSelectionRows() as Array<RecId | number>
        if (recid != null && sel.indexOf(recid as RecId) == -1) {
            grid.click(recid)
        }
    } else {
        const sel = grid.getSelectionCells()
        let sel_col = false  // any cell in a column
        let sel_row = false  // any cell in a row
        let sel_cell = false // this exact cell
        sel.forEach(rec => {
            if (rec.recid == recid) sel_row = true
            if (rec.column == column) sel_col = true
            if (rec.recid == recid && rec.column == column) sel_cell = true
        })
        if (!sel_row && recid != null && column === null) grid.click({ recid })  // select entire row
        if (!sel_col && recid === null && column != null) grid.columnClick(grid.columns[column]!.field, event)
        if (!sel_cell && recid != null && column != null) grid.click({ recid, column }) // select a cell
    }
    // event before
    const edata = grid.trigger('contextMenu', { target: grid.name, originalEvent: event, recid, index, column })
    if (edata.isCancelled === true) return
    // default action
    if (grid.contextMenu?.length > 0) {
        TsMenu.show({
            contextMenu: true,
            originalEvent: event,
            items: grid.contextMenu
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select((event: any) => { // any: TsMenu select event shape varies
            clearTimeout(grid.last.kbd_timer ?? undefined) // keep grid in focus
            grid.contextMenuClick(recid ?? '', column ?? null, event)
        })
    }
    // cancel browser context menu
    event.preventDefault()
    clearTimeout(grid.last.kbd_timer ?? undefined) // keep grid in focus
    // event after
    edata.finish()
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function contextMenuClick(grid: TsGrid, recid: string | number, column: number | null, event: any) {
    // event before
    const edata = grid.trigger('contextMenuClick', {
        target: grid.name, recid, column, originalEvent: event.detail.originalEvent,
        menuEvent: event, menuIndex: event.detail.index, menuItem: event.detail.item
    })
    if (edata.isCancelled === true) return
    // no default action
    edata.finish()
}

export function toggle(grid: TsGrid, recid: string | number, _event?: Event) {
    const rec  = grid.get(recid)
    if (rec == null) return
    rec.TsUi = rec.TsUi ?? {}
    if (rec.TsUi.expanded === true) {
        return grid.collapse(recid)
    } else {
        return grid.expand(recid)
    }
}

/**
 * When record is expaned, then TsUi.children of the record is copied into grid.records and grid.total is updated. It will
 * also set TsUi._copeid = true, so it would not copy it again.
 *
 * There is also updateExpaned() that is called in grid.refresh()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expand(grid: TsGrid, recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
    const ind  = grid.get(recid, true)
    if (ind == null) return false
    const rec  = grid.records[ind]!
    rec.TsUi = rec.TsUi ?? {}
    const id   = TsUtils.escapeId(recid)
    const children = rec.TsUi.children
    let edata
    if (Array.isArray(children)) {
        if (rec.TsUi.expanded === true || children.length === 0) return false // already shown
        edata = grid.trigger('expand', { target: grid.name, recid: recid })
        if (edata.isCancelled === true) return false
        rec.TsUi.expanded = true
        rec.TsUi['_copied'] = true
        children.forEach((child) => {
            child.TsUi = child.TsUi ?? {}
            child.TsUi.parent_recid = rec.recid
            if (child.TsUi.children == null) child.TsUi.children = []
        })
        grid.records.splice(ind + 1, 0, ...children)
        if (grid.total !== -1) {
            grid.total += children.length
        }
        const url = grid.url?.get ?? grid.url
        if (!url) {
            grid.localSort(true, true)
            if (grid.searchData.length > 0) {
                grid.localSearch(true)
            }
        }
        if (noRefresh !== true) grid.refresh()
        edata.finish()
    } else {
        if (query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id +'_expanded_row').length > 0 || grid.show.expandColumn !== true) return false
        // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((rec.TsUi.expanded as any) == 'none') return false
        // insert expand row
        query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id).after(
            `<tr id="grid_${grid.name}_rec_${recid}_expanded_row" class="tsg-expanded-row">
                <td colspan="100" class="tsg-expanded2">
                    <div id="grid_${grid.name}_rec_${recid}_expanded"></div>
                </td>
                <td class="tsg-grid-data-last"></td>
            </tr>`)

        query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id).after(
            `<tr id="grid_${grid.name}_frec_${recid}_expanded_row" class="tsg-expanded-row">
                ${grid.show.lineNumbers ? '<td class="tsg-col-number"></td>' : ''}
                <td class="tsg-grid-data tsg-expanded1" colspan="100">
                   <div id="grid_${grid.name}_frec_${recid}_expanded"></div>
                </td>
            </tr>`)

        // event before
        edata = grid.trigger('expand', { target: grid.name, recid: recid,
            box_id: 'grid_'+ grid.name +'_rec_'+ recid +'_expanded', fbox_id: 'grid_'+ grid.name +'_frec_'+ recid +'_expanded' })
        if (edata.isCancelled === true) {
            query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id +'_expanded_row').remove()
            query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id +'_expanded_row').remove()
            return false
        }
        // expand column
        const row1 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ recid +'_expanded')
        const row2 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ recid +'_expanded')
        const innerHeight = row1.find(':scope div:first-child')[0]?.clientHeight ?? 50
        if (row1[0].clientHeight < innerHeight) {
            row1.css({ height: innerHeight + 'px' })
        }
        if (row2[0].clientHeight < innerHeight) {
            row2.css({ height: innerHeight + 'px' })
        }
        // default action
        query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id).attr('expanded', 'yes').addClass('tsg-expanded')
        query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id).attr('expanded', 'yes').addClass('tsg-expanded')
        query(grid.box).find('#grid_'+ grid.name +'_cell_'+ grid.get(recid, true) +'_expand div').html('-')
        rec.TsUi.expanded = true
        // event after
        edata.finish()
        grid.resizeRecords()
    }
    grid.selectNone() // or selection is messed up
    return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function collapse(grid: TsGrid, recid: any, noRefresh?: any) { // any: recid is string|number; noRefresh is boolean
    const ind      = grid.get(recid, true)
    if (ind == null) return false
    const rec      = grid.records[ind]!
    rec.TsUi     = rec.TsUi || {}
    const id       = TsUtils.escapeId(recid)
    const children = rec.TsUi.children
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edata: any
    if (Array.isArray(children)) {
        if (rec.TsUi.expanded !== true) return false // already hidden
        edata = grid.trigger('collapse', { target: grid.name, recid: recid })
        if (edata.isCancelled === true) return false
        clearExpanded(rec)
        const stops = []
        for (let r: TsGridRecord | null = rec; r != null; r = (r.TsUi?.parent_recid != null ? grid.get(r.TsUi.parent_recid) : null))
            stops.push(r.TsUi?.parent_recid)
        // stops contains 'undefined' plus the ID of all nodes in the path from 'rec' to the tree root
        const start = ind + 1
        let end   = start
        while (true) {
            if (grid.records.length <= end + 1 || grid.records[end+1]!.TsUi == null ||
                stops.indexOf(grid.records[end+1]!.TsUi!.parent_recid) >= 0) {
                break
            }
            end++
        }
        grid.records.splice(start, end - start + 1)
        if (grid.total !== -1) {
            grid.total -= end - start + 1
        }
        const url     = grid.url?.get ?? grid.url
        if (!url) {
            if (grid.searchData.length > 0) {
                grid.localSearch(true)
            }
        }
        if (noRefresh !== true) grid.refresh()
        edata.finish()
    } else {
        if (query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id +'_expanded_row').length === 0 || grid.show.expandColumn !== true) return false
        // event before
        edata = grid.trigger('collapse', { target: grid.name, recid: recid,
            box_id: 'grid_'+ grid.name +'_rec_'+ recid +'_expanded', fbox_id: 'grid_'+ grid.name +'_frec_'+ recid +'_expanded' })
        if (edata.isCancelled === true) return false
        // default action
        query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id).removeAttr('expanded').removeClass('tsg-expanded')
        query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id).removeAttr('expanded').removeClass('tsg-expanded')
        query(grid.box).find('#grid_'+ grid.name +'_cell_'+ grid.get(recid, true) +'_expand div').html('+')
        query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id +'_expanded').css('height', '0px')
        query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id +'_expanded').css('height', '0px')
        setTimeout(() => {
            query(grid.box).find('#grid_'+ grid.name +'_rec_'+ id +'_expanded_row').remove()
            query(grid.box).find('#grid_'+ grid.name +'_frec_'+ id +'_expanded_row').remove()
            if (rec.TsUi) rec.TsUi.expanded = false
            // event after
            edata.finish()
            grid.resizeRecords()
        }, 300)
    }
    grid.selectNone() // or selection is messed up
    return true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function clearExpanded(rec: any) { // any: TsGridRecord
        rec.TsUi.expanded = false
        rec.TsUi['_copied'] = false
        for (let i = 0; i < rec.TsUi.children.length; i++) {
            const subRec = rec.TsUi.children[i]
            if (subRec.TsUi?.expanded) {
                clearExpanded(subRec)
            }
        }
    }
}

export function updateExpanded(grid: TsGrid) {
    let updated = false
    for (let ind = grid.records.length - 1; ind >= 0; ind--) {
        const rec = grid.records[ind]!
        const children = rec.TsUi?.children
        if (rec.TsUi?.expanded === true && (children?.length ?? 0) > 0 && !rec.TsUi['_copied']) {
            rec.TsUi['_copied'] = true
            children!.forEach((child) => {
                child.TsUi ??= {}
                child.TsUi.parent_recid = rec.recid
                child.TsUi.children ??= []
            })
            grid.records.splice(ind + 1, 0, ...children!)
            if (grid.total !== -1) {
                grid.total += children!.length
            }
            updated = true
        }
    }
    if (updated) {
        const url = grid.url?.get ?? grid.url
        if (!url) {
            grid.localSort(true, true)
            if (grid.searchData.length > 0) {
                grid.localSearch(true)
            }
        }
    }
}

export function sort(grid: TsGrid, field?: string, direction?: 'asc' | 'desc' | '' | null, multiField?: boolean) { // if no params - clears sort
    // event before
    const edata = grid.trigger('sort', { target: grid.name, field, direction, multiField })
    if (edata.isCancelled === true) return
    // check if needed to quit
    if (field != null) {
        // default action
        let sortIndex = grid.sortData.length
        for (let s = 0; s < grid.sortData.length; s++) {
            if (grid.sortData[s]!.field == field) {
                sortIndex = s
                break
            }
        }
        if (direction == null) {
            direction = grid.sortData[sortIndex]?.direction
            if (direction == null) {
                // save original sort, so it can be restored
                if (grid.last.originalSort == null) {
                    grid.last.originalSort = grid.records.map(rec => rec.recid)
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
            grid.sortData = []
            sortIndex = 0
        }
        if (direction === '') {
            grid.sortData.splice(sortIndex, 1)
        } else {
            // set new sort
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            grid.sortData[sortIndex] ??= {} as any // any: TsGridSortData partial init
            Object.assign(grid.sortData[sortIndex]!, { field, direction })
        }
    } else {
        grid.sortData = []
    }
    // if local
    const url = grid.url?.get ?? grid.url
    if (!url) {
        grid.localSort(false, true)
        if (grid.searchData.length > 0) grid.localSearch(true)
        // reset vertical scroll
        grid.last.vscroll.scrollTop = 0
        query(grid.box).find(`#grid_${grid.name}_records`).prop('scrollTop', 0)
        // event after
        edata.finish({ direction })
        grid.refresh()
    } else {
        // event after
        edata.finish({ direction })
        grid.last.fetch.offset = 0
        grid.reload()
    }
}

// any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function copy(grid: TsGrid, flag: any, oEvent?: ClipboardEvent | any) {
    if (TsUtils.isPlainObject(flag)) {
        // event after
        flag.finish()
        return flag.text
    }
    // generate text to copy
    const sel = grid.getSelection()
    if (sel.length === 0) return ''
    let text = ''
    if (typeof sel[0] == 'object') { // cell copy
        const cellSel = sel as TsGridCellSelection[]
        // find min/max column
        let minCol = cellSel[0]!.column
        let maxCol = cellSel[0]!.column
        const recs   = []
        for (let s = 0; s < cellSel.length; s++) {
            if (cellSel[s]!.column < minCol) minCol = cellSel[s]!.column
            if (cellSel[s]!.column > maxCol) maxCol = cellSel[s]!.column
            if (recs.indexOf(cellSel[s]!.index) == -1) recs.push(cellSel[s]!.index)
        }
        recs.sort((a, b) => { return a-b }) // sort function must be for numerical sort
        for (let r = 0 ; r < recs.length; r++) {
            const ind = recs[r]
            for (let c = minCol; c <= maxCol; c++) {
                const col = grid.columns[c]!
                if (col.hidden === true) continue
                text += grid.getCellCopy(ind, c) + '\t'
            }
            text  = text.substr(0, text.length-1) // remove last \t
            text += '\n'
        }
    } else { // row copy
        // copy headers
        for (let c = 0; c < grid.columns.length; c++) {
            const col = grid.columns[c]!
            if (col.hidden === true) continue
            let colName = (col.text ? col.text : col.field)
            if (col.text && col.text.length < 3 && col.tooltip) colName = col.tooltip // if column name is less then 3 char and there is tooltip - use it
            text += '"' + TsUtils.stripTags(colName) + '"\t'
        }
        text  = text.substr(0, text.length-1) // remove last \t
        text += '\n'
        // copy selected text — row branch, sel[s] is RecId | number
        for (let s = 0; s < sel.length; s++) {
            const ind = grid.get(sel[s] as RecId | number, true)
            for (let c = 0; c < grid.columns.length; c++) {
                const col = grid.columns[c]!
                if (col.hidden === true) continue
                text += '"' + grid.getCellCopy(ind, c) + '"\t'
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
        edata = grid.trigger('copy', { target: grid.name, text: text,
            cut: (oEvent.keyCode == 88 ? true : false), originalEvent: oEvent })
        if (edata.isCancelled === true) return ''
        text = edata.detail['text'] as string
        // event after
        edata.finish()
        return text
    } else if (flag === false) { // only before event
        // before event
        edata = grid.trigger('copy', { target: grid.name, text: text,
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
export function getCellCopy(grid: TsGrid, ind: any, col_ind: any) { // any: record index and column index
    return TsUtils.stripTags(grid.getCellHTML(ind, col_ind))
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paste(grid: TsGrid, text: string, event?: ClipboardEvent | any) {
    const sel = grid.getSelectionCells()
    let ind: number = grid.get(sel[0]!.recid, true) ?? 0
    const col = sel[0]!.column
    // before event
    const edata = grid.trigger('paste', { target: grid.name, text: text, index: ind, column: col, originalEvent: event })
    if (edata.isCancelled === true) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pasteText: any = edata.detail['text'] // any: reassigned from string to string[] after .split()
    // default action
    if (grid.selectType == 'row' || sel.length === 0) {
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
            const rec  = grid.records[ind]!
            const cols = []
            if (rec == null) continue
            for (let dt = 0; dt < tmp.length; dt++) {
                if (!grid.columns[col + cnt]) continue
                setCellPaste(rec, grid.columns[col + cnt]!.field, tmp[dt])
                cols.push(col + cnt)
                cnt++
            }
            for (let c = 0; c < cols.length; c++) newSel.push({ recid: rec.recid, column: cols[c] })
            ind++
        }
        grid.selectNone(true) // no need to trigger select event
        grid.select(newSel)
    } else {
        grid.selectNone(true) // no need to trigger select event
        grid.select([{ recid: grid.records[ind]!.recid, column: col }])
    }
    grid.refresh()
    // event after
    edata.finish()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function setCellPaste(rec: any, field: any, paste: any) { // any: record, field name, paste value
        rec.TsUi = rec.TsUi ?? {}
        rec.TsUi['changes'] = rec.TsUi['changes'] || {}
        rec.TsUi['changes'][field] = paste
    }
}
