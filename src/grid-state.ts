/**
 * grid-state.ts — State management sub-module for TsGrid (v2.0)
 *
 * Extracted from src/tsgrid.ts as part of the tsgrid-v2-core structural refactor.
 * Strategy D — Hybrid sibling files: plain functions taking `grid: TsGrid` as first parameter.
 * All method bodies lifted verbatim from TsGrid; `this.X` → `grid.X` mechanically.
 *
 * Design R13: No per-module unit tests. Sub-modules require a full TsGrid instance.
 * Design R8:  Lowest shared DAG node — imports NOTHING from other extracted modules.
 */

import type { TsGrid } from './tsgrid.js'
import type { TsGridRecord } from './tsgrid.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'

// any: Query wrapper used as jQuery-like in TsGrid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any

export function status(grid: TsGrid, msg?: string) {
    if (msg != null) {
        query(grid.box).find(`#grid_${grid.name}_footer`).find('.tsg-footer-left').html(msg)
    } else {
        // show number of selected
        let msgLeft = ''
        const sel     = grid.getSelection()
        if (sel.length > 0) {
            if (grid.show.statusSelection && sel.length > 1) {
                msgLeft = String(sel.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + TsUtils.settings.groupSymbol) + ' ' + TsUtils.lang('selected')
            }
            if (grid.show.statusRecordID && sel.length == 1) {
                // any: status bar widens recid display to include column for cell mode; mode is detected by typeof
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let tmp: any = sel[0]
                if (typeof tmp == 'object') tmp = tmp.recid + ', '+ TsUtils.lang('Column') +': '+ tmp.column
                msgLeft = TsUtils.lang('Record ID') + ': '+ tmp + ' '
            }
        }
        query(grid.box).find('#grid_'+ grid.name +'_footer .tsg-footer-left').html(msgLeft)
    }
}

export function lock(grid: TsGrid, msg?: string, showSpinner?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any[] = [grid.box, msg, showSpinner] // any: TsUtils.lock accepts mixed args
    setTimeout(() => {
        // hide empty msg if any
        query(grid.box).find('#grid_'+ grid.name +'_empty_msg').remove()
        // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(TsUtils.lock as any)(...args)
    }, 10)
}

export function unlock(grid: TsGrid, speed?: number) {
    setTimeout(() => {
        // do not unlock if there is a message
        if (query(grid.box).find('.tsg-message').hasClass('tsg-closing')) return
        TsUtils.unlock(grid.box, speed)
    }, 25) // needed timer so if server fast, it will not flash
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stateSave(grid: TsGrid, returnOnly: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: { columns: Record<string, any>[]; show: any; last: any; sortData: any[]; searchData: any[] } = { // any: state blob is serialized JSON
        columns: [],
        show: TsUtils.clone(grid.show),
        last: {
            search: grid.last.search,
            multi : grid.last.multi,
            logic : grid.last.logic,
            label : grid.last.label,
            field : grid.last.field,
            scrollTop : grid.last.vscroll.scrollTop,
            scrollLeft: grid.last.vscroll.scrollLeft
        },
        sortData  : [],
        searchData: []
    }
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prop_val: any
    for (let i = 0; i < grid.columns.length; i++) {
        const col          = grid.columns[i]
        // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const col_save_obj: Record<string, any> = {}
        // iterate properties to save
        Object.keys(grid.stateColProps).forEach((prop, _idx) => {
            // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((grid.stateColProps as any)[prop]){
                // check if the property is defined on the column
                // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((col as any)[prop] !== undefined){
                    // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    prop_val = (col as any)[prop]
                } else {
                    // use fallback or null
                    // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    prop_val = (grid.colTemplate as any)[prop] || null
                }
                col_save_obj[prop] = prop_val
            }
        })
        state.columns.push(col_save_obj)
    }
    for (let i = 0; i < grid.sortData.length; i++) state.sortData.push(TsUtils.clone(grid.sortData[i]))
    for (let i = 0; i < grid.searchData.length; i++) state.searchData.push(TsUtils.clone(grid.searchData[i]))
    // event before
    const edata = grid.trigger('stateSave', { target: grid.name, state: state })
    if (edata.isCancelled === true) {
        return
    }
    // save into local storage
    if (returnOnly !== true) {
        grid.cacheSave('state', state)
    }
    // event after
    edata.finish()
    return state
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stateRestore(grid: TsGrid, newState?: any) { // any: state blob is serialized JSON
    const url = grid.url?.get ?? grid.url
    if (!newState) {
        newState = grid.cache('state')
    }
    // event before
    const edata = grid.trigger('stateRestore', { target: grid.name, state: newState })
    if (edata.isCancelled === true) {
        return
    }
    // default behavior
    if (TsUtils.isPlainObject(newState)) {
        TsUtils.extend(grid.show, newState.show ?? {})
        TsUtils.extend(grid.last, newState.last ?? {})
        const sTop  = grid.last.vscroll.scrollTop
        const sLeft = grid.last.vscroll.scrollLeft
        for (let c = 0; c < newState.columns?.length; c++) {
            const tmp       = newState.columns[c]
            const col_index = grid.getColumn(tmp.field, true)
            if (col_index !== null) {
                TsUtils.extend(grid.columns[col_index]!, tmp)
                // restore column order from saved state
                if (c !== col_index) grid.columns.splice(c, 0, grid.columns.splice(col_index, 1)[0]!)
            }
        }
        grid.sortData.splice(0, grid.sortData.length)
        for (let c = 0; c < newState.sortData?.length; c++) {
            grid.sortData.push(newState.sortData[c])
        }
        grid.searchData.splice(0, grid.searchData.length)
        for (let c = 0; c < newState.searchData?.length; c++) {
            grid.searchData.push(newState.searchData[c])
        }
        // apply sort and search
        setTimeout(() => {
            // needs timeout as records need to be populated
            // ez 10.09.2014 this -->
            if (!url) {
                if (grid.sortData.length > 0) grid.localSort()
                if (grid.searchData.length > 0) grid.localSearch()
            }
            grid.last.vscroll.scrollTop = sTop
            grid.last.vscroll.scrollLeft = sLeft
            grid.refresh()
        }, 1)
        console.log(`INFO (TsUi): state restored for "${grid.name}"`)
    }
    // event after
    edata.finish()
    return true
}

export function stateReset(grid: TsGrid) {
    grid.stateRestore(grid.last.state)
    grid.cacheSave('state', null)
}

// any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseField(grid: TsGrid, obj: TsGridRecord | null | undefined, field: string): any {
    let val
    if (grid.nestedFields) {
        val = TsUtils.getNested(obj, field)
    } else {
        val = obj?.[field]
    }
    return (val != null ? val : '')
}

export function prepareData(grid: TsGrid) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid

    // loops thru records and prepares date and time objects
    for (let r = 0; r < grid.records.length; r++) {
        const rec = grid.records[r]!
        prepareRecord(rec)
    }

    // prepare date and time objects for the 'rec' record and its closed children
    function prepareRecord(rec: TsGridRecord): void {
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
                    if (TsUtils.isInt(dt)) dt = parseInt(dt)
                    rec[column.field + '_'] = new Date(dt)
                }
            }
            // time
            if (['time'].indexOf(column.render) != -1) {
                if (TsUtils.isTime(rec[column.field])) { // if string
                    // any: cast-to-any for return-position narrowing; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const tmp = TsUtils.isTime(rec[column.field], true) as any
                    const dt  = new Date()
                    dt.setHours(tmp.hours, tmp.minutes, (tmp.seconds ? tmp.seconds : 0), 0) // sets hours, min, sec, mills
                    if (!rec[column.field + '_']) rec[column.field + '_'] = dt
                } else { // if date object
                    let tmp = rec[column.field]
                    if (TsUtils.isInt(tmp)) tmp = parseInt(tmp)
                    tmp    = (tmp != null ? new Date(tmp) : new Date())
                    const dt = new Date()
                    dt.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), 0) // sets hours, min, sec, mills
                    if (!rec[column.field + '_']) rec[column.field + '_'] = dt
                }
            }
        }

        if (rec.TsUi?.children && rec.TsUi?.expanded !== true) {
            // there are closed children, prepare them too.
            for (let r = 0; r < rec.TsUi.children.length; r++) {
                const subRec = rec.TsUi.children[r]!
                prepareRecord(subRec)
            }
        }
    }
}

export function nextCell(grid: TsGrid, index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
    const check = col_ind + 1
    if (check >= grid.columns.length) {
        const nextIdx = grid.nextRow(index)
        return nextIdx == null ? null : grid.nextCell(nextIdx, -1, editable)
    }
    const tmp = grid.records[index]?.TsUi
    const col = grid.columns[check]
    const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
    if (col == null) return null
    if (col && col.hidden || span === 0) return grid.nextCell(index, check, editable)
    if (editable) {
        const edit = grid.getCellEditable(index, check)
        if (edit == null || ['checkbox', 'check'].indexOf(edit.type) != -1) {
            return grid.nextCell(index, check, editable)
        }
    }
    return { index, colIndex: check }
}

export function prevCell(grid: TsGrid, index: number, col_ind: number, editable?: boolean): { index: number; colIndex: number } | null {
    const check = col_ind - 1
    if (check < 0) {
        const prevIdx = grid.prevRow(index)
        return prevIdx == null ? null : grid.prevCell(prevIdx, grid.columns.length, editable)
    }
    if (check < 0) return null
    const tmp = grid.records[index]?.TsUi
    const col = grid.columns[check]
    const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
    if (col == null) return null
    if (col && col.hidden || span === 0) return grid.prevCell(index, check, editable)
    if (editable) {
        const edit = grid.getCellEditable(index, check)
        if (edit == null || ['checkbox', 'check'].indexOf(edit.type) != -1) {
            return grid.prevCell(index, check, editable)
        }
    }
    return { index, colIndex: check }
}

export function nextRow(grid: TsGrid, ind: number, col_ind?: number, numRows?: number): number | null {
    const sids = grid.last.searchIds
    let ret  = null
    if (numRows == null) numRows = 1
    if (numRows == -1) {
        return grid.records.length-1
    }
    if ((ind + numRows < grid.records.length && sids.length === 0) // if there are more records
            || (sids.length > 0 && ind < (sids[sids.length-numRows] ?? 0))) {
        ind += numRows
        if (sids.length > 0) while (true) {
            if (sids.includes(ind) || ind > grid.records.length) break
            ind += numRows
        }
        // colspan
        const tmp  = grid.records[ind]?.TsUi
        const col  = col_ind != null ? grid.columns[col_ind] : undefined
        const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
        if (span === 0 || tmp?.selectable === false) {
            ret = grid.nextRow(ind, col_ind, numRows)
        } else {
            ret = ind
        }
    }
    return ret
}

export function prevRow(grid: TsGrid, ind: number, col_ind?: number, numRows?: number): number | null {
    const sids = grid.last.searchIds
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
        const tmp  = grid.records[ind]?.TsUi
        const col  = col_ind != null ? grid.columns[col_ind] : undefined
        const span = (tmp && tmp['colspan'] && col != null && !isNaN(tmp['colspan'][col.field]) ? parseInt(tmp['colspan'][col.field]) : 1)
        if (span === 0 || tmp?.selectable === false) {
            ret = grid.prevRow(ind, col_ind, numRows)
            if (ret == null) ret = ind
        } else {
            ret = ind
        }
    }
    return ret
}

export function selectionSave(grid: TsGrid) {
    grid.last.saved_sel = grid.getSelection()
    return grid.last.saved_sel
}

export function selectionRestore(grid: TsGrid, noRefresh?: boolean) {
    const time = Date.now()
    grid.last.selection = { indexes: [], columns: {} }
    const sel = grid.last.selection
    const lst = grid.last.saved_sel
    if (lst) for (let i = 0; i < lst.length; i++) {
        if (TsUtils.isPlainObject(lst[i])) {
            // selectType: cell
            const tmp = grid.get(lst[i].recid, true)
            if (tmp != null) {
                if (sel.indexes.indexOf(tmp) == -1) sel.indexes.push(tmp)
                if (!sel.columns[tmp]) sel.columns[tmp] = []
                sel.columns[tmp].push(lst[i].column)
            }
        } else {
            // selectType: row
            const tmp = grid.get(lst[i], true)
            if (tmp != null) sel.indexes.push(tmp)
        }
    }
    delete grid.last.saved_sel
    if (noRefresh !== true) grid.refresh()
    return Date.now() - time
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function message(grid: TsGrid, options?: any) { // any: message options vary by type (string, object)
    return TsUtils.message({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: grid as any, // any: TsGrid.lock signature differs from owner.lock type
        box  : grid.box,
        after: '.tsg-grid-header'
    }, options)
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function confirm(grid: TsGrid, options: any) {
    return TsUtils.confirm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: grid as any, // any: TsGrid.lock signature differs from owner.lock type
        box  : grid.box,
        after: '.tsg-grid-header'
    }, options)
}
