/**
 * grid-selection.ts — Selection management sub-module for TsGrid (v2.0)
 *
 * Extracted from src/tsgrid.ts as part of the tsgrid-v2-core structural refactor.
 * Strategy D — Hybrid sibling files: plain functions taking `grid: TsGrid` as first parameter.
 * All method bodies lifted verbatim from TsGrid; `this.X` → `grid.X` (or `self.X`/`obj.X`) mechanically.
 *
 * Design R13: No per-module unit tests. Sub-modules require a full TsGrid instance.
 * Design R3:  FORBIDDEN to import grid-search, grid-edit, grid-interaction, grid-render.
 *             Cross-domain calls go through grid.X() delegators.
 */

import type { TsGrid } from './tsgrid.js'
import type { TsGridCellSelection } from './tsgrid.js'
import type { RecId } from './types.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'

// any: Query wrapper used as jQuery-like in TsGrid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function select(grid: TsGrid, ...selectArgs: any[]): number | undefined { // any: recid (string|number) or {recid, column} cell descriptor
    if (selectArgs.length === 0) return 0
    let selected = 0
    const sel = grid.last.selection
    if (!grid.multiSelect) grid.selectNone(true)
    // if too many arguments > 150k, then it errors off
    let args = selectArgs.slice()
    if (Array.isArray(args[0])) args = args[0]
    // filter unselectable records
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args = args.filter((aa: any) => { // any: recid or cell descriptor
        const recid = aa?.recid ?? aa
        const index = aa?.index ?? grid.get(recid, true)
        const rec = grid.records[index]!
        if (rec?.TsUi?.selectable === false) {
            return false
        }
        if (typeof aa === 'object') {
            aa.index ??= index
        }
        return true
    })

    // event before
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmp: any = { target: grid.name } // any: dynamic event payload built incrementally
    if (args.length == 1) {
        tmp.multiple = false
        if (TsUtils.isPlainObject(args[0])) {
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
    if (grid.compareSelection(args).select.length == 0) {
        // if all needed records are already selected
        return
    }
    const edata = grid.trigger('select', tmp)
    if (edata.isCancelled === true) return 0

    // default action
    if (grid.selectType == 'row') {
        for (let a = 0; a < args.length; a++) {
            const recid = typeof args[a] == 'object' ? args[a].recid : args[a]
            const index = grid.get(recid, true)
            if (index == null) continue
            let recEl1 = null
            let recEl2 = null
            if (grid.searchData.length !== 0 || (index + 1 >= (grid.last.vscroll.recIndStart ?? 0) && index + 1 <= (grid.last.vscroll.recIndEnd ?? 0))) {
                recEl1 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid))
                recEl2 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(recid))
            }
            if (grid.selectType == 'row') {
                if (sel.indexes.indexOf(index) != -1) continue
                sel.indexes.push(index)
                if (recEl1 && recEl2) {
                    recEl1.addClass('tsg-selected').find('.tsg-col-number').addClass('tsg-row-selected')
                    recEl2.addClass('tsg-selected').find('.tsg-col-number').addClass('tsg-row-selected')
                    recEl1.find('.tsg-grid-select-check').prop('checked', true)
                }
                selected++
            }
        }
    } else {
        // normalize for performance
        // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const new_sel: Record<string, any[]> = {}
        for (let a = 0; a < args.length; a++) {
            const recid      = typeof args[a] == 'object' ? args[a].recid : args[a]
            const column     = typeof args[a] == 'object' ? args[a].column : null
            new_sel[recid] = new_sel[recid] || []
            if (Array.isArray(column)) {
                new_sel[recid] = column
            } else if (TsUtils.isInt(column)) {
                new_sel[recid].push(column)
            } else {
                for (let i = 0; i < grid.columns.length; i++) { if (grid.columns[i]!.hidden) continue; new_sel[recid]!.push(i) }
            }
        }
        // add all
        const col_sel = []
        for (const recid in new_sel) {
            const index = grid.get(recid, true)
            if (index == null) continue
            let recEl1 = null
            let recEl2 = null
            if (index + 1 >= (grid.last.vscroll.recIndStart ?? 0) && index + 1 <= (grid.last.vscroll.recIndEnd ?? 0)) {
                recEl1 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(recid))
                recEl2 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid))
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
            s.sort((a: number, b: number) => { return a-b }) // sort function must be for numerical sort
            for (let t = 0; t < new_sel_recid.length; t++) {
                const col = new_sel_recid[t]
                if (col_sel.indexOf(col) == -1) col_sel.push(col)
                if (recEl1) {
                    recEl1.find('#grid_'+ grid.name +'_data_'+ index +'_'+ col).addClass('tsg-selected')
                    recEl1.find('.tsg-col-number').addClass('tsg-row-selected')
                    recEl1.find('.tsg-grid-select-check').prop('checked', true)
                }
                if (recEl2) {
                    recEl2.find('#grid_'+ grid.name +'_data_'+ index +'_'+ col).addClass('tsg-selected')
                    recEl2.find('.tsg-col-number').addClass('tsg-row-selected')
                    recEl2.find('.tsg-grid-select-check').prop('checked', true)
                }
                selected++
            }
            // save back to selection object
            sel.columns[index] = s
        }
        // select columns (need here for speed)
        for (let c = 0; c < col_sel.length; c++) {
            query(grid.box).find('#grid_'+ grid.name +'_column_'+ col_sel[c] +' .tsg-col-header').addClass('tsg-col-selected')
        }
    }
    // need to sort new selection for speed
    sel.indexes.sort((a: number, b: number) => { return a-b })
    // all selected?
    const areAllSelected = (grid.records.length > 0 && sel.indexes.length == grid.records.length),
        areAllSearchedSelected = (sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length)
    if (areAllSelected || areAllSearchedSelected) {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', true)
    } else {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', false)
    }
    grid.status()
    grid.addRange('selection')
    grid.updateToolbar(sel, areAllSelected)
    // event after
    edata.finish()
    return selected
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unselect(grid: TsGrid, ...unselectArgs: any[]): number { // any: recid (string|number) or {recid, column} cell descriptor
    let unselected = 0
    const sel = grid.last.selection
    // if too many arguments > 150k, then it errors off
    let args = unselectArgs.slice()
    if (Array.isArray(args[0])) args = args[0]
    // event before
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tmp: any = { target: grid.name } // any: dynamic event payload built incrementally
    if (args.length == 1) {
        tmp.multiple = false
        if (TsUtils.isPlainObject(args[0])) {
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
    if (grid.compareSelection(args).unselect.length == 0) {
        // if all needed records are already unselected
        return 0
    }
    const edata = grid.trigger('select', tmp)
    if (edata.isCancelled === true) return 0

    for (let a = 0; a < args.length; a++) {
        const recid  = typeof args[a] == 'object' ? args[a].recid : args[a]
        const record = grid.get(recid)
        if (record == null) continue
        const index  = grid.get(record.recid, true) ?? -1
        const recEl1 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid))
        const recEl2 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(recid))
        if (grid.selectType == 'row') {
            if (sel.indexes.indexOf(index) == -1) continue
            // default action
            sel.indexes.splice(sel.indexes.indexOf(index), 1)
            recEl1.removeClass('tsg-selected tsg-inactive').find('.tsg-col-number').removeClass('tsg-row-selected')
            recEl2.removeClass('tsg-selected tsg-inactive').find('.tsg-col-number').removeClass('tsg-row-selected')
            if (recEl1.length != 0) {
                recEl1[0].style.cssText = 'height: '+ grid.recordHeight +'px; ' + recEl1.attr('custom_style')
                recEl2[0].style.cssText = 'height: '+ grid.recordHeight +'px; ' + recEl2.attr('custom_style')
            }
            recEl1.find('.tsg-grid-select-check').prop('checked', false)
            unselected++
        } else {
            const col = args[a].column
            if (!TsUtils.isInt(col)) { // unselect all columns
                const cols = []
                for (let i = 0; i < grid.columns.length; i++) { if (grid.columns[i]!.hidden) continue; cols.push({ recid: recid, column: i }) }
                return grid.unselect(cols)
            }
            const s = sel.columns[index]
            if (!Array.isArray(s) || s.indexOf(col) == -1) continue
            // default action
            s.splice(s.indexOf(col), 1)
            query(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass('tsg-selected tsg-inactive')
            query(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass('tsg-selected tsg-inactive')
            // check if any row/column still selected
            let isColSelected = false
            let isRowSelected = false
            const tmp           = grid.getSelectionCells()
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i]!.column == col) isColSelected = true
                if (tmp[i]!.recid == recid) isRowSelected = true
            }
            if (!isColSelected) {
                query(grid.box).find(`.tsg-grid-columns td[col="${col}"] .tsg-col-header, .tsg-grid-fcolumns td[col="${col}"] .tsg-col-header`).removeClass('tsg-col-selected')
            }
            if (!isRowSelected) {
                query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid)).find('.tsg-col-number').removeClass('tsg-row-selected')
            }
            unselected++
            if (s.length === 0) {
                delete sel.columns[index]
                sel.indexes.splice(sel.indexes.indexOf(index), 1)
                recEl1.find('.tsg-grid-select-check').prop('checked', false)
            }
        }
    }
    // all selected?
    const areAllSelected = (grid.records.length > 0 && sel.indexes.length == grid.records.length),
        areAllSearchedSelected = (sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length)
    if (areAllSelected || areAllSearchedSelected) {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', true)
    } else {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', false)
    }
    // show number of selected
    grid.status()
    grid.addRange('selection')
    grid.updateToolbar(sel, areAllSelected)
    // event after
    edata.finish()
    return unselected
}

// any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareSelection(grid: TsGrid, newSel: any[]): { select: any[]; unselect: any[] } {
    const select = []
    const unselect = []
    if (grid.selectType == 'row') {
        const sel = grid.getSelectionRows() as Array<RecId | number>
        // normalize
        newSel.forEach((sel, ind) => {
            if (typeof sel == 'object') newSel[ind] = sel.recid
        })
        // add items
        for (let i = 0; i < newSel.length; i++) {
            if (!(sel as Array<RecId | number>).includes(newSel[i])) {
                select.push(newSel[i])
            }
        }
        // remove items
        for (let i = 0; i < newSel.length; i++) {
            if ((sel as Array<RecId | number>).includes(newSel[i])) {
                unselect.push(newSel[i])
            }
        }
    } else {
        const sel = grid.getSelectionCells()
        // add more items
        for (let ns = 0; ns < newSel.length; ns++) {
            let flag = false
            for (let s = 0; s < sel.length; s++) if (newSel[ns].recid == sel[s]!.recid && newSel[ns].column == sel[s]!.column) flag = true
            if (!flag) select.push({ recid: newSel[ns].recid, column: newSel[ns].column })
        }
        // remove items
        for (let s = 0; s < sel.length; s++) {
            let flag = false
            for (let ns = 0; ns < newSel.length; ns++) if (newSel[ns].recid == sel[s]!.recid && newSel[ns].column == sel[s]!.column) flag = true
            if (!flag) unselect.push({ recid: sel[s]!.recid, column: sel[s]!.column })
        }
    }
    return { select, unselect }
}

export function selectAll(grid: TsGrid): number | undefined {
    const time = Date.now()
    if (grid.multiSelect === false) return
    // default action
    const url = grid.url?.get ?? grid.url
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sel: any = TsUtils.clone(grid.last.selection) // any: TsUtils.clone returns unknown; selection shape is TsGridLast['selection']
    const cols = []
    for (let i = 0; i < grid.columns.length; i++) cols.push(i)
    // if local data source and searched
    sel.indexes = []
    if (!url && grid.searchData.length !== 0) {
        // local search applied
        for (let i = 0; i < grid.last.searchIds.length; i++) {
            sel.indexes.push(grid.last.searchIds[i]!)
            if (grid.selectType != 'row') sel.columns[grid.last.searchIds[i]!] = cols.slice() // .slice makes copy of the array
        }
    } else {
        let buffered = grid.records.length
        if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length
        for (let i = 0; i < buffered; i++) {
            sel.indexes.push(i)
            if (grid.selectType != 'row') sel.columns[i] = cols.slice() // .slice makes copy of the array
        }
    }
    // event before
    const edata = grid.trigger('select', { target: grid.name, multiple: true, all: true, clicked: sel })
    if (edata.isCancelled === true) return

    grid.last.selection = sel
    // add selected class
    if (grid.selectType == 'row') {
        query(grid.box).find('.tsg-grid-records tr:not(.tsg-empty-record)')
            .addClass('tsg-selected').find('.tsg-col-number').addClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-frecords tr:not(.tsg-empty-record)')
            .addClass('tsg-selected').find('.tsg-col-number').addClass('tsg-row-selected')
        query(grid.box).find('input.tsg-grid-select-check').prop('checked', true)
    } else {
        query(grid.box).find('.tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header').addClass('tsg-col-selected')
        query(grid.box).find('.tsg-grid-records tr .tsg-col-number').addClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-records tr:not(.tsg-empty-record)')
            .find('.tsg-grid-data:not(.tsg-col-select)').addClass('tsg-selected')
        query(grid.box).find('.tsg-grid-frecords tr .tsg-col-number').addClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-frecords tr:not(.tsg-empty-record)')
            .find('.tsg-grid-data:not(.tsg-col-select)').addClass('tsg-selected')
        query(grid.box).find('input.tsg-grid-select-check').prop('checked', true)
    }
    // enable/disable toolbar buttons
    sel = grid.getSelectionRows(true) as number[]
    grid.addRange('selection')
    query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', true)
    grid.status()
    grid.updateToolbar({ indexes: sel }, true)
    // event after
    edata.finish()
    return Date.now() - time
}

export function selectNone(grid: TsGrid, skipEvent?: boolean): number | undefined {
    const time = Date.now()
    // event before
    let edata
    if (!skipEvent) {
        edata = grid.trigger('select', { target: grid.name, clicked: [] })
        if (edata.isCancelled === true) return
    }
    // default action
    const sel = grid.last.selection
    // remove selected class
    if (grid.selectType == 'row') {
        query(grid.box).find('.tsg-grid-records tr.tsg-selected').removeClass('tsg-selected tsg-inactive')
            .find('.tsg-col-number').removeClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-frecords tr.tsg-selected').removeClass('tsg-selected tsg-inactive')
            .find('.tsg-col-number').removeClass('tsg-row-selected')
        query(grid.box).find('input.tsg-grid-select-check').prop('checked', false)
    } else {
        query(grid.box).find('.tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header').removeClass('tsg-col-selected')
        query(grid.box).find('.tsg-grid-records tr .tsg-col-number').removeClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-frecords tr .tsg-col-number').removeClass('tsg-row-selected')
        query(grid.box).find('.tsg-grid-data.tsg-selected').removeClass('tsg-selected tsg-inactive')
        query(grid.box).find('input.tsg-grid-select-check').prop('checked', false)
    }
    sel.indexes = []
    sel.columns = {}
    grid.removeRange('selection')
    query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', false)
    grid.status()
    grid.updateToolbar(sel, false)
    // event after
    if (!skipEvent) {
        edata!.finish()
    }
    return Date.now() - time
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateToolbar(grid: TsGrid, sel?: any, _areAllSelected?: boolean): void { // any: sel is selection object from last.selection
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    const cnt = sel && sel.indexes ? sel.indexes.length : 0
    // if there is no toolbar
    if (!grid.toolbar.render) {
        return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.toolbar.items.forEach((item: any) => { // any: toolbar item shape varies
        _checkItem(item, '')
        if (Array.isArray(item.items)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item.items.forEach((it: any) => { // any: toolbar item shape varies
                _checkItem(it, item.id + ':')
            })
        }
    })
    // enable/disable toolbar search button
    if (grid.show.toolbarSave) {
        if (grid.getChanges().length > 0) {
            grid.toolbar.enable('tsg-save')
        } else {
            grid.toolbar.disable('tsg-save')
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

/**
 * Row-mode selection. Returns the recids of selected records, or their indexes
 * when `returnIndex === true`. Unaffected by `selectType === 'cell'` — callers
 * should branch on `grid.selectType` and use `getSelectionCells()` for cell mode.
 */
export function getSelectionRows(grid: TsGrid, returnIndex?: boolean): RecId[] | number[] {
    const ret: Array<RecId | number> = []
    const sel = grid.last.selection
    for (let i = 0; i < sel.indexes.length; i++) {
        const idx = sel.indexes[i]!
        if (!grid.records[idx]) continue
        if (returnIndex === true) ret.push(idx); else ret.push(grid.records[idx]!.recid as RecId)
    }
    return ret as RecId[] | number[]
}

/**
 * Cell-mode selection. Returns one descriptor per selected cell. `returnIndex`
 * is intentionally not a parameter — it was ignored in cell mode by the legacy
 * `getSelection()` API.
 */
export function getSelectionCells(grid: TsGrid): TsGridCellSelection[] {
    const ret: TsGridCellSelection[] = []
    const sel = grid.last.selection
    for (let i = 0; i < sel.indexes.length; i++) {
        const idx = sel.indexes[i]!
        const cols = sel.columns[idx] ?? []
        if (!grid.records[idx]) continue
        for (let j = 0; j < cols.length; j++) {
            ret.push({ recid: grid.records[idx]!.recid, index: idx, column: cols[j]! })
        }
    }
    return ret
}

/**
 * Discriminated-union wrapper. The shape depends on `grid.selectType`:
 *   - `'row'`  → `RecId[]` (or `number[]` if `returnIndex === true`)
 *   - `'cell'` → `TsGridCellSelection[]` (`returnIndex` is ignored)
 *
 * Prefer the typed split methods (`getSelectionRows` / `getSelectionCells`)
 * when the caller knows the mode statically. This wrapper is kept for back-
 * compat with the v2.0 API and for callers that genuinely handle both modes.
 */
export function getSelection(grid: TsGrid, returnIndex?: boolean): RecId[] | number[] | TsGridCellSelection[] {
    return grid.selectType === 'row'
        ? grid.getSelectionRows(returnIndex)
        : grid.getSelectionCells()
}
