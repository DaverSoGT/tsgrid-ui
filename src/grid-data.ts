/**
 * grid-data.ts — Data management sub-module for TsGrid (v2.0)
 *
 * Extracted from src/tsgrid.ts as part of the tsgrid-v2-core structural refactor.
 * Strategy D — Hybrid sibling files: plain functions taking `grid: TsGrid` as first parameter.
 * All method bodies lifted verbatim from TsGrid; `this.X` → `grid.X` (or `self.X`/`obj.X`) mechanically.
 *
 * Design R13: No per-module unit tests. Sub-modules require a full TsGrid instance.
 * Design R3:  FORBIDDEN to import grid-search.ts — cross-domain calls go through grid.X() delegators.
 */

import type { TsGrid } from './tsgrid.js'
import type { TsGridRecord, TsGridColumn, TsGridSearch, TsGridRange } from './tsgrid.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'

// any: Query wrapper used as jQuery-like in TsGrid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any

export function add(grid: TsGrid, record: TsGridRecord | TsGridRecord[], first?: boolean): number {
    if (!Array.isArray(record)) record = [record]
    let added = 0
    for (let i = 0; i < record.length; i++) {
        const rec = record[i]!
        if (grid.recid != null && rec[grid.recid] != null) {
            rec.recid = rec[grid.recid!]
        }
        if (rec.recid == null) {
            console.log('ERROR: Cannot add record without recid. (obj: '+ grid.name +')')
            continue
        }
        if (rec.TsUi?.summary === true) {
            if (first) grid.summary.unshift(rec); else grid.summary.push(rec)
        } else {
            if (first) grid.records.unshift(rec); else grid.records.push(rec)
        }
        added++
    }
    grid.processGroupBy()
    const url = grid.url?.get ?? grid.url
    if (!url) {
        grid.total = grid.records.length
        grid.localSort(false, true)
        grid.localSearch()
        // only refresh if it is in virtual view
        const indStart = grid.records.length - record.length
        const indEnd  = indStart + record.length
        if ((grid.last.vscroll.recIndStart ?? 0) <= indEnd && (grid.last.vscroll.recIndEnd ?? 0) >= indStart) {
            grid.refresh()
        } else {
            // just update total if it it there
            query(grid.box)
                .find('#grid_'+ grid.name + '_footer .tsg-footer-right .tsg-total')
                .html(TsUtils.formatNumber(grid.total))
        }
    } else {
        grid.refresh()
    }
    return added
}

// any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function find(grid: TsGrid, obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[] {
    // any: obj values are user-supplied record field values for matching
    if (obj == null) obj = {}
    const recs    = []
    let hasDots = false
    // check if property is nested - needed for speed
    for (const o in obj) if (String(o).indexOf('.') != -1) hasDots = true
    // look for an item
    const start = displayedOnly ? (grid.last.vscroll.recIndStart ?? 0) : 0
    let end   = displayedOnly ? (grid.last.vscroll.recIndEnd ?? grid.records.length) + 1: grid.records.length
    if (end > grid.records.length) end = grid.records.length
    for (let i = start; i < end; i++) {
        const rec_i = grid.records[i]!
        let match = true
        for (const o in obj) {
            let val = rec_i[o]
            if (hasDots && String(o).indexOf('.') != -1) val = grid.parseField(rec_i, o)
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
// any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function set(grid: TsGrid, recid: any, record?: any, noRefresh?: boolean): boolean {
    if ((typeof recid == 'object') && (recid !== null)) {
        noRefresh = record
        record    = recid
        recid     = null
    }
    // update all records
    if (recid == null) {
        for (let i = 0; i < grid.records.length; i++) {
            TsUtils.extend(grid.records[i], record) // recid is the whole record
        }
        if (noRefresh !== true) grid.refresh()
    } else { // find record to update
        const ind = grid.get(recid, true)
        if (ind == null) return false
        const isSummary = (grid.records[ind]?.recid == recid ? false : true)
        if (isSummary) {
            TsUtils.extend(grid.summary[ind], record)
        } else {
            TsUtils.extend(grid.records[ind], record)
        }
        if (noRefresh !== true) grid.refreshRow(recid, ind) // refresh only that record
    }
    grid.processGroupBy()
    return true
}

// replaces existing record
export function replace(grid: TsGrid, recid: string | number, record: TsGridRecord, noRefresh?: boolean): boolean {
    const ind = grid.get(recid, true)
    if (ind == null) return false
    const isSummary = (grid.records[ind]?.recid == recid ? false : true)
    if (isSummary) {
        grid.summary[ind] = record
    } else {
        grid.records[ind] = record
    }
    if (noRefresh !== true) grid.refreshRow(recid, ind) // refresh only that record
    grid.processGroupBy()
    return true
}

export function get(grid: TsGrid, recid: (string | number)[], returnIndex?: boolean): (TsGridRecord | number)[]
export function get(grid: TsGrid, recid: string | number, returnIndex: true): number | null
export function get(grid: TsGrid, recid: string | number, returnIndex?: false): TsGridRecord | null
export function get(grid: TsGrid, recid: string | number | (string | number)[], returnIndex?: boolean): TsGridRecord | (TsGridRecord | number)[] | number | null {
    // search records
    if (Array.isArray(recid)) {
        const recs = []
        for (let i = 0; i < recid.length; i++) {
            // any: this-cast for legacy widget self-reference; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const v = (grid as any).get(recid[i], returnIndex)
            if (v !== null)
                recs.push(v)
        }
        return recs
    } else {
        // get() must be fast, implements a cache to bypass loop over all records
        // most of the time.
        let idCache = grid.last.idCache
        if (!idCache) {
            grid.last.idCache = idCache = {}
        }
        let i = idCache[recid]
        if (typeof(i) === 'number') {
            if (i >= 0 && i < grid.records.length && grid.records[i]!.recid == recid) {
                if (returnIndex === true) return i; else return grid.records[i]!
            }
            // summary indexes are stored as negative numbers, try them now.
            i = ~i
            if (i >= 0 && i < grid.summary.length && grid.summary[i]!.recid == recid) {
                if (returnIndex === true) return i; else return grid.summary[i]!
            }
            // wrong index returned, clear cache
            grid.last.idCache = idCache = {}
        }
        for (let i = 0; i < grid.records.length; i++) {
            if (grid.records[i]!.recid == recid) {
                idCache[recid] = i
                if (returnIndex === true) return i; else return grid.records[i]!
            }
        }
        // search summary
        for (let i = 0; i < grid.summary.length; i++) {
            if (grid.summary[i]!.recid == recid) {
                idCache[recid] = ~i
                if (returnIndex === true) return i; else return grid.summary[i]!
            }
        }
        return null
    }
}

export function remove(grid: TsGrid, ...recids: (string | number)[]): number {
    let removed = 0
    for (let a = 0; a < recids.length; a++) {
        for (let r = grid.records.length-1; r >= 0; r--) {
            if (grid.records[r]!.recid == recids[a]) { grid.records.splice(r, 1); removed++ }
        }
        for (let r = grid.summary.length-1; r >= 0; r--) {
            if (grid.summary[r]!.recid == recids[a]) { grid.summary.splice(r, 1); removed++ }
        }
    }
    const url = grid.url?.get ?? grid.url
    if (!url) {
        grid.localSort(false, true)
        grid.localSearch()
        grid.total = grid.records.length
    }
    grid.refresh()
    return removed
}

/**
 * If there is a grid.groupBy, then process all records with that in mind. It will remember groups in grid.last.groupBy_links, that
 * needs to be cleared when record is cleared
 */
export function processGroupBy(grid: TsGrid): void {
    if (grid.groupBy == null) return
    const groupBy = grid.groupBy
    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const new_records: any[] = []
    grid.records.forEach(rec => {
        const group = rec[groupBy.field]
        if (group != null) {
            if (grid.last.groupBy_links[group] == null) {
                // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const gr: any = { recid: 'group-'+ group, group, TsUi: { ...groupBy, children: [] } }
                grid.last.groupBy_links[group] = gr
                delete gr.TsUi!['field'] // no need for this field
                new_records.push(gr)
            }
            rec[groupBy.field] = ''
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(grid.last.groupBy_links[group] as any).TsUi.children.push(rec) // any: groupBy_links values are TsGridRecord with TsUi.children
        }
    })
    grid.records = new_records
    if (grid.total !== -1) {
        grid.total = grid.records.length
    }
}

export function localSort(grid: TsGrid, silent?: boolean, noResetRefresh?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    const url = grid.url?.get ?? grid.url
    if (url) {
        console.log('ERROR: grid.localSort can only be used on local data source, grid.url should be empty.')
        return 0 // time it took
    }
    if (Object.keys(grid.sortData).length === 0) {
        // restore original sorting
        const os = grid.last.originalSort
        if (os) {
            grid.records.sort((a, b) => {
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
    grid.selectionSave()
    grid.prepareData()
    if (!noResetRefresh) {
        grid.reset()
    }
    // process sortData
    for (let i = 0; i < grid.sortData.length; i++) {
        const sortItem = grid.sortData[i]!
        const column = grid.getColumn(sortItem.field) as TsGridColumn | null
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
    grid.records.sort((a, b) => {
        return compareRecordPaths(a, b)
    })
    cleanupPaths()

    grid.selectionRestore(noResetRefresh)
    time = Date.now() - time
    if (silent !== true && grid.show.statusSort) {
        setTimeout(() => {
            grid.status(TsUtils.lang('Sorting took ${count} seconds', { count: time/1000 }))
        }, 10)
    }
    return time

    // grab paths before sorting for efficiency and because calling obj.get()
    // while sorting 'obj.records' is unsafe, at least on webkit
    function preparePaths(): void {
        for (let i = 0; i < obj.records.length; i++) {
            const rec = obj.records[i]!
            if (rec.TsUi?.parent_recid != null) {
                rec.TsUi['_path'] = getRecordPath(rec)
            }
        }
    }

    // cleanup and release memory allocated by preparePaths()
    function cleanupPaths(): void {
        for (let i = 0; i < obj.records.length; i++) {
            const rec = obj.records[i]!
            if (rec.TsUi?.parent_recid != null) {
                rec.TsUi['_path'] = null
            }
        }
    }

    // compare two paths, from root of tree to given records
    function compareRecordPaths(a: TsGridRecord, b: TsGridRecord): number {
        if ((!a.TsUi || a.TsUi.parent_recid == null) && (!b.TsUi || b.TsUi.parent_recid == null)) {
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
    function getRecordPath(rec: TsGridRecord): TsGridRecord[] {
        if (!rec.TsUi || rec.TsUi.parent_recid == null) return [rec]
        if (rec.TsUi['_path'])
            return rec.TsUi['_path'] as TsGridRecord[]
        // during actual sort, we should never reach this point
        const subrec = obj.get(rec.TsUi.parent_recid)
        if (!subrec) {
            console.log('ERROR: no parent record: ' + rec.TsUi.parent_recid)
            return [rec]
        }
        return (getRecordPath(subrec).concat(rec))
    }

    // compare two records according to sortData and finally recid
    function compareRecords(a: TsGridRecord, b: TsGridRecord): number {
        if (a === b) return 0 // optimize, same object
        for (let i = 0; i < obj.sortData.length; i++) {
            const sortItem = obj.sortData[i]!
            const fld     = sortItem.field
            const sortFld = sortItem.field_ ? sortItem.field_! : fld
            // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let aa: any = a[sortFld]
            // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let bb: any = b[sortFld]
            if (String(fld).indexOf('.') != -1) {
                aa = obj.parseField(a, sortFld)
                bb = obj.parseField(b, sortFld)
            }
            const col = obj.getColumn(fld) as TsGridColumn | null
            if (col && col['editable'] && Object.keys(col['editable']).length > 0) { // for drop editable fields and drop downs
                if (TsUtils.isPlainObject(aa) && aa.text) aa = aa.text
                if (TsUtils.isPlainObject(bb) && bb.text) bb = bb.text
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
                sortMode = TsUtils.naturalCompare
                break
            case 'i18n':
                sortMode = TsUtils.i18nCompare
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

export function localSearch(grid: TsGrid, silent?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    const url = grid.url?.get ?? grid.url
    if (url) {
        console.log('ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.')
        return
    }
    let time            = Date.now()
    const defaultToString = {}.toString
    const duplicateMap: Record<string | number, boolean> = {}
    grid.total          = grid.records.length
    // mark all records as shown
    grid.last.searchIds = []
    // prepare date/time fields
    grid.prepareData()
    // hide records that did not match
    if (grid.searchData.length > 0 && !url) {
        grid.total = 0
        for (let i = 0; i < grid.records.length; i++) {
            const rec = grid.records[i]!
            const match = searchRecord(rec)
            if (match) {
                if (rec?.TsUi) addParent(rec.TsUi.parent_recid ?? null)
                if (grid.showExtraOnSearch > 0) {
                    let before = grid.showExtraOnSearch
                    let after  = grid.showExtraOnSearch
                    if (i < before) before = i
                    if (i + after > grid.records.length) after = grid.records.length - i
                    if (before > 0) {
                        for (let j = i - before; j < i; j++) {
                            if (grid.last.searchIds.indexOf(j) < 0)
                                grid.last.searchIds.push(j)
                        }
                    }
                    if (grid.last.searchIds.indexOf(i) < 0) grid.last.searchIds.push(i)
                    if (after > 0) {
                        for (let j = (i + 1) ; j <= (i + after) ; j++) {
                            if (grid.last.searchIds.indexOf(j) < 0) grid.last.searchIds.push(j)
                        }
                    }
                } else {
                    grid.last.searchIds.push(i)
                }
            }
        }
        grid.total = grid.last.searchIds.length
    }
    time = Date.now() - time
    if (silent !== true && grid.show.statusSearch) {
        setTimeout(() => {
            grid.status(TsUtils.lang('Search took ${count} seconds', { count: time/1000 }))
        }, 10)
    }
    return time

    // check if a record (or one of its closed children) matches the search data
    function searchRecord(rec: TsGridRecord): boolean {
        let fl = 0, val1, val2, val3, tmp
        let orEqual = false
        for (let j = 0; j < obj.searchData.length; j++) {
            const sdata = obj.searchData[j]
            if (sdata == null) continue
            let search = obj.getSearch(sdata.field) as TsGridSearch | null
            if (search == null) search = { field: sdata.field, type: sdata.type } as TsGridSearch
            // поиск среди изменений
            const val1b = rec.TsUi?.['changes']?.[search.field] ?? obj.parseField(rec, search.field)
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
                        val1 = TsUtils.formatDate(tmp, 'yyyy-mm-dd')
                        val2 = TsUtils.formatDate(TsUtils.isDate(val2, TsUtils.settings.dateFormat, true), 'yyyy-mm-dd')
                        if (val1 == val2) fl++
                    }
                    else if (search.type == 'time') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatTime(tmp, 'hh24:mi')
                        val2 = TsUtils.formatTime(val2, 'hh24:mi')
                        if (val1 == val2) fl++
                    }
                    else if (search.type == 'datetime') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                        val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
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
                        val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true)
                        val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true)
                        val3 = TsUtils.isDate(val3, TsUtils.settings.dateFormat, true)
                        if (val3 instanceof Date) val3 = new Date((val3 as Date).getTime() + 86400000) // 1 day
                        if (val1 >= val2 && val1 < val3) fl++
                    }
                    else if (search.type == 'time') {
                        val1 = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val2 = TsUtils.isTime(val2, true)
                        val3 = TsUtils.isTime(val3, true)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const t2 = val2 as any // any: isTime(,true) returns TsTimeResult but union type is bool|TsTimeResult
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const t3 = val3 as any // any: isTime(,true) returns TsTimeResult but union type is bool|TsTimeResult
                        val2 = (new Date()).setHours(t2.hours, t2.minutes, t2.seconds ? t2.seconds : 0, 0)
                        val3 = (new Date()).setHours(t3.hours, t3.minutes, t3.seconds ? t3.seconds : 0, 0)
                        if (val1 >= val2 && val1 < val3) fl++
                    }
                    else if (search.type == 'datetime') {
                        val1 = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val2 = TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true)
                        val3 = TsUtils.isDateTime(val3, TsUtils.settings.datetimeFormat, true)
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
                        val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true)
                        val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true)
                        if (val1 < val2 || (orEqual && val1 === val2)) fl++
                    }
                    else if (search.type == 'time') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatTime(tmp, 'hh24:mi')
                        val2 = TsUtils.formatTime(val2, 'hh24:mi')
                        if (val1 < val2 || (orEqual && val1 === val2)) fl++
                    }
                    else if (search.type == 'datetime') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                        val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
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
                        val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true)
                        val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true)
                        if (val1 > val2 || (orEqual && val1 === val2)) fl++
                    }
                    else if (search.type == 'time') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatTime(tmp, 'hh24:mi')
                        val2 = TsUtils.formatTime(val2, 'hh24:mi')
                        if (val1 > val2 || (orEqual && val1 === val2)) fl++
                    }
                    else if (search.type == 'datetime') {
                        tmp  = (obj.parseField(rec, search.field + '_') instanceof Date ? obj.parseField(rec, search.field + '_') : obj.parseField(rec, search.field))
                        val1 = TsUtils.formatDateTime(tmp, 'yyyy-mm-dd|hh24:mm:ss')
                        val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), 'yyyy-mm-dd|hh24:mm:ss')
                        if (val1.length == val2.length && (val1 > val2 || (orEqual && val1 === val2))) fl++
                    }
                    break
                case 'in':
                    tmp = sdata['value']
                    if (sdata['svalue']) tmp = sdata['svalue']
                    if ((tmp.indexOf(TsUtils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1) || (tmp.indexOf(val1) !== -1 && val1 !== '')) fl++
                    break
                case 'not in':
                    tmp = sdata['value']
                    if (sdata['svalue']) tmp = sdata['svalue']
                    if (!((tmp.indexOf(TsUtils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1) || (tmp.indexOf(val1) !== -1 && val1 !== ''))) fl++
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
        if (rec.TsUi?.children && rec.TsUi?.expanded !== true) {
            // there are closed children, search them too.
            for (let r = 0; r < rec.TsUi.children.length; r++) {
                const subRec = rec.TsUi.children[r]!
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
        if (rec?.TsUi) {
            addParent(rec.TsUi.parent_recid ?? null)
        }
        obj.last.searchIds.push(i)
    }
}

// any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRangeData(grid: TsGrid, range: [{ recid: string | number; column: number }, { recid: string | number; column: number }], extra?: boolean): any[] {
    const rec1 = grid.get(range[0]!.recid, true) ?? 0
    const rec2 = grid.get(range[1]!.recid, true) ?? 0
    const col1 = range[0]!.column
    const col2 = range[1]!.column

    const res = []
    if (col1 == col2) { // one column
        for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
            const record = grid.records[r]!
            const dt     = record[grid.columns[col1]!.field] || null
            if (extra !== true) {
                res.push(dt)
            } else {
                res.push({ data: dt, column: col1, index: r, record: record })
            }
        }
    } else if (rec1 == rec2) { // one row
        const record = grid.records[rec1]!
        for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
            const dt = record[grid.columns[i]!.field] || null
            if (extra !== true) {
                res.push(dt)
            } else {
                res.push({ data: dt, column: i, index: rec1, record: record })
            }
        }
    } else {
        for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
            const record = grid.records[r]!
            // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rowData: any[] = []
            res.push(rowData)
            for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
                const dt = record[grid.columns[i]!.field]
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
export function addRange(grid: TsGrid, rangesInput: TsGridRange | TsGridRange[] | string | Record<string, any>): number {
    let added = 0, first, last
    if (grid.selectType == 'row') return added
    // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ranges: any[] = !Array.isArray(rangesInput) ? [rangesInput] : rangesInput as any[]
    // if it is selection
    for (let i = 0; i < ranges.length; i++) {
        if (typeof ranges[i] != 'object') ranges[i] = { name: 'selection' }
        if (ranges[i].name == 'selection') {
            if (grid.show.selectionBorder === false) continue
            const sel = grid.getSelection()
            if (sel.length === 0) {
                grid.removeRange('selection')
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
            for (let j = 0; j < grid.ranges.length; j++) if (grid.ranges[j]!.name == ranges[i]!.name) { ind = j; break }
            if (ind !== false) {
                grid.ranges[ind] = rg
            } else {
                grid.ranges.push(rg)
            }
            added++
        }
    }
    grid.refreshRanges()
    return added
}

export function removeRange(grid: TsGrid, ...names: string[]) {
    let removed = 0
    for (let a = 0; a < names.length; a++) {
        const name = names[a]
        query(grid.box).find('#grid_'+ grid.name +'_'+ name).remove()
        query(grid.box).find('#grid_'+ grid.name +'_f'+ name).remove()
        for (let r = grid.ranges.length-1; r >= 0; r--) {
            if (grid.ranges[r]!.name == name) {
                grid.ranges.splice(r, 1)
                removed++
            }
        }
    }
    return removed
}

export function refreshRanges(grid: TsGrid) {
    if (grid.ranges.length === 0) return
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    let range
    const time = Date.now()
    const rec1 = query(grid.box).find(`#grid_${grid.name}_frecords`)
    const rec2 = query(grid.box).find(`#grid_${grid.name}_records`)
    for (let i = 0; i < grid.ranges.length; i++) {
        const rg    = grid.ranges[i]!
        let first = rg.range[0]!
        let last  = rg.range[1]!
        if (first.index == null) {
            const fi = grid.get(first.recid, true)
            if (fi != null) first.index = fi
        }
        if (last.index == null) {
            const li = grid.get(last.recid, true)
            if (li != null) last.index = li
        }
        if (first.index!= null && last.index!=null && first.index > last.index) {
            const tmp = first
            first = last
            last = tmp
        }
        let td1  = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(first.recid) + ' td[col="'+ first.column +'"]')
        let td2  = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(last.recid) + ' td[col="'+ last.column +'"]')
        let td1f = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(first.recid) + ' td[col="'+ first.column +'"]')
        let td2f = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(last.recid) + ' td[col="'+ last.column +'"]')
        let _lastColumn: number | string = last.column // any: sentinel 'end'/'start' used for virtual scroll boundary cols
        // adjustment due to column virtual scroll
        if (first.column < grid.last.vscroll.colIndStart && last.column > grid.last.vscroll.colIndStart) {
            td1 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(first.recid) + ' td[col="start"]')
        }
        if (first.column < grid.last.vscroll.colIndEnd && last.column > grid.last.vscroll.colIndEnd) {
            td2 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(last.recid) + ' td[col="end"]')
            _lastColumn = 'end'
            //_lastColumn = '"end"' // cause error
        }
        // if virtual scrolling kicked in
        const index_top     = parseInt(query(grid.box).find('#grid_'+ grid.name +'_rec_top').next().attr('index'))
        const index_bottom  = parseInt(query(grid.box).find('#grid_'+ grid.name +'_rec_bottom').prev().attr('index'))
        const index_ftop    = parseInt(query(grid.box).find('#grid_'+ grid.name +'_frec_top').next().attr('index'))
        const index_fbottom = parseInt(query(grid.box).find('#grid_'+ grid.name +'_frec_bottom').prev().attr('index'))
        if (td1.length === 0 && first.index! < index_top && last.index! > index_top) {
            td1 = query(grid.box).find('#grid_'+ grid.name +'_rec_top').next().find('td[col="'+ first.column +'"]')
        }
        if (td2.length === 0 && last.index! > index_bottom && first.index! < index_bottom) {
            td2 = query(grid.box).find('#grid_'+ grid.name +'_rec_bottom').prev().find('td[col="'+ _lastColumn +'"]')
        }
        if (td1f.length === 0 && first.index! < index_ftop && last.index! > index_ftop) { // frozen
            td1f = query(grid.box).find('#grid_'+ grid.name +'_frec_top').next().find('td[col="'+ first.column +'"]')
        }
        if (td2f.length === 0 && last.index! > index_fbottom && first.index! < index_fbottom) { // frozen
            td2f = query(grid.box).find('#grid_'+ grid.name +'_frec_bottom').prev().find('td[col="'+ last.column +'"]')
        }

        // do not show selection cell if it is editable
        const edit = query(grid.box).find('#grid_'+ grid.name + '_editable')
        const tmp  = edit.find('.tsg-input')
        const tmp_ind = tmp.attr('index')
        const tmp1 = grid.records[tmp_ind]?.recid
        const tmp2 = tmp.attr('column')
        if (rg.name == 'selection' && rg.range[0]!.recid == tmp1 && rg.range[0]!.column == tmp2) continue

        // frozen regular columns range
        range = query(grid.box).find('#grid_'+ grid.name +'_f'+ rg.name)
        if (td1f.length > 0 || td2f.length > 0) {
            if (range.length === 0) {
                rec1.append('<div id="grid_'+ grid.name +'_f' + rg.name +'" class="tsg-selection" style="'+ rg.style +'">'+
                                (rg.name == 'selection' && grid.show.selectionResizer ? '<div id="grid_'+ grid.name +'_resizer" class="tsg-selection-resizer"></div>' : '')+
                            '</div>')
                range = query(grid.box).find('#grid_'+ grid.name +'_f'+ rg.name)
            } else {
                range.attr('style', rg.style)
                range.find('.tsg-selection-resizer').show()
            }
            if (td2f.length === 0) {
                td2f = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(last.recid) +' td:last-child')
                if (td2f.length === 0) td2f = query(grid.box).find('#grid_'+ grid.name +'_frec_bottom td:first-child')
                range.css('border-right', '0px')
                range.find('.tsg-selection-resizer').hide()
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
        range = query(grid.box).find('#grid_'+ grid.name +'_'+ rg.name)
        if (td1.length > 0 || td2.length > 0) {
            if (range.length === 0) {
                rec2.append(`
                    <div id="grid_${grid.name}_${rg.name}" class="tsg-selection ${rg.class ?? ''}" style="${rg.style}">
                        ${rg.name == 'selection' && grid.show.selectionResizer
                            ? `<div id="grid_${grid.name}_resizer" class="tsg-selection-resizer"></div>`
                            : ''
                        }
                    </div>
                `)
                range = query(grid.box).find('#grid_'+ grid.name +'_'+ rg.name)
            } else {
                range.attr('style', rg.style)
            }
            if (td1.length === 0) {
                td1 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(first.recid) +' td:first-child')
                if (td1.length === 0) td1 = query(grid.box).find('#grid_'+ grid.name +'_rec_top td:first-child')
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
    query(grid.box).find('.tsg-selection-resizer')
        .off('.resizer')
        .on('mousedown.resizer', mouseStart)
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('dblclick.resizer', (event: any) => {
            const edata = self.trigger('resizerDblClick', { target: self.name, originalEvent: event })
            if (edata.isCancelled === true) return
            edata.finish()
        })
    // this variables are needed for selection expantion
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edata: any
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail: any = { target: self.name, originalRange: null, newRange: null }
    const letters = 'abcdefghijklmnopqrstuvwxyz'

    return Date.now() - time

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function mouseStart(event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
        const sel = self.getSelectionCells()
        const first = sel[0]!
        const last = sel[sel.length-1]!
        self.last.move = {
            type   : 'expand',
            x      : event.screenX,
            y      : event.screenY,
            divX   : 0,
            divY   : 0,
            index  : first.index,
            recid  : first.recid,
            column : first.column,
            name   : letters[first.column]! + (first.index + 1) + ':' + letters[last.column]! + (last.index + 1),
            originalRange : [TsUtils.clone(first), TsUtils.clone(last) ],
            newRange      : [TsUtils.clone(first), TsUtils.clone(last) ]
        }
        detail.originalName  = self.last.move.name
        detail.originalRange = self.last.move.originalRange
        query('body')
            .off('.tsg-' + self.name)
            .on('mousemove.tsg-' + self.name, mouseMove)
            .on('mouseup.tsg-' + self.name, mouseStop)
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
        const prevNewRange = TsUtils.clone(mv.newRange)
        mv.newRange = [{ recid: mv.recid, index: mv.index, column: mv.column }, { recid, index, column }]
        // remember update ranges
        detail.newName = letters[mv.column] + (mv.index + 1) + ':' + letters[column] + (index + 1)
        detail.newRange = TsUtils.clone(mv.newRange)
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
                class: 'tsg-selection-expand'
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function mouseStop(_event: any) { // any: event is MouseEvent at runtime; typed loosely to avoid EventListener mismatch
        // default behavior
        self.removeRange('selection-expand')
        query('body').off('.tsg-' + self.name)
        // event after
        if (self.last.move?.type == 'expand' && edata.finish) {
            edata.finish()
        }
        delete self.last.move
    }
}

// clears records and related params
export function clear(grid: TsGrid, noRefresh?: boolean): void {
    grid.total   = 0
    grid.records = []
    grid.summary = []
    grid.last.fetch.offset = 0 // need this for reload button to work on remote data set
    grid.last.idCache   = {} // optimization to free memory
    grid.last.selection = { indexes: [], columns: {} }
    grid.last.groupBy_links = {}
    grid.reset(true)
    // refresh
    if (!noRefresh) grid.refresh()
}

// clears scroll position, selection, ranges
export function reset(grid: TsGrid, noRefresh?: boolean): void {
    // position
    grid.last.vscroll.scrollTop = 0
    grid.last.vscroll.scrollLeft = 0
    grid.last.vscroll.recIndStart = null
    grid.last.vscroll.recIndEnd = null
    // additional
    query(grid.box).find(`#grid_${grid.name}_records`).prop('scrollTop', 0)
    // refresh
    if (!noRefresh) grid.refresh()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function load(grid: TsGrid, url: any, callBack?: any) { // any: url can be string or object with .get/.save
    if (url == null) {
        console.log('ERROR: You need to provide url argument when calling .load() method of "'+ grid.name +'" object.')
        return new Promise((resolve, reject) => { reject() })
    }
    // default action
    grid.clear(true)
    return grid.request('load', {}, url, callBack)
}

// any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reload(grid: TsGrid, callBack?: (...args: any[]) => void) {
    const url = grid.url?.get ?? grid.url
    grid.selectionSave()
    if (url) {
        // need to remember selection (not just last.selection object)
        return grid.load(url, () => {
            grid.selectionRestore()
            if (typeof callBack == 'function') callBack()
        })
    } else {
        grid.reset(true)
        grid.localSearch()
        grid.selectionRestore()
        if (typeof callBack == 'function') callBack({ status: 'success' })
        return new Promise<void>(resolve => { resolve() })
    }
}

// any: url can be string, { get, save, remove } object, URL instance, or null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function request(grid: TsGrid, action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolve: any, reject: any
    const requestProm = new Promise((res, rej) => { resolve = res; reject = rej })
    if (postData == null) postData = {}
    if (!url) url = grid.url
    if (!url) return new Promise((resolve, reject) => { reject() })
    // build parameters list
    if (!TsUtils.isInt(grid.offset)) grid.offset = 0
    if (!TsUtils.isInt(grid.last.fetch.offset)) grid.last.fetch.offset = 0
    // add list params
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edata: any
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
        limit: grid.limit,
        offset: (grid.offset as number) + (grid.last.fetch.offset as number),
        searchLogic: grid.last.logic,
        search: grid.searchData.map((search) => {
            const _search = TsUtils.clone(search)
            if (grid.searchMap && grid.searchMap[_search.field]) _search.field = grid.searchMap[_search.field]
            return _search
        }),
        sort: grid.sortData.map((sort) => {
            const _sort = TsUtils.clone(sort)
            if (grid.sortMap && grid.sortMap[_sort.field]) _sort.field = grid.sortMap[_sort.field]
            return _sort
        })
    }
    if (grid.searchData.length === 0) {
        delete params.search
        delete params.searchLogic
    }
    if (grid.sortData.length === 0) {
        delete params.sort
    }
    // append other params
    TsUtils.extend(params, grid.postData)
    TsUtils.extend(params, postData)
    // other actions
    if (action == 'delete' || action == 'save') {
        delete params.limit
        delete params.offset
        params.action = action
        if (action == 'delete') {
            params[grid.recid || 'recid'] = grid.getSelection()
        }
    }
    // event before
    if (action == 'load') {
        edata = grid.trigger('request', { target: grid.name, url, postData: params, httpMethod: 'GET',
            httpHeaders: grid.httpHeaders })
        if (edata.isCancelled === true) return new Promise((resolve, reject) => { reject() })
    } else {
        edata = { detail: {
            url,
            postData: params,
            httpMethod: action == 'save' ? 'PUT' : 'DELETE',
            httpHeaders: grid.httpHeaders
        }}
    }
    // call server to get data
    if (grid.last.fetch.offset === 0) {
        grid.lock(TsUtils.lang(grid.msgRefresh), true)
    }
    if (grid.last.fetch.controller) try { grid.last.fetch.controller.abort() } catch (e) {}
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
    if (Object.keys(grid.routeData).length > 0) {
        const info = TsUtils.parseRoute(url)
        if (info.keys.length > 0) {
            for (let k = 0; k < info.keys.length; k++) {
                const key_k = info.keys[k]!
                if (grid.routeData[key_k.name] == null) continue
                url = url.replace((new RegExp(':'+ key_k.name, 'g')), grid.routeData[key_k.name])
            }
        }
    }
    url = new URL(url, location.href)
    // ajax options
    const fetchOptions = TsUtils.prepareParams(url, {
        method: edata.detail.httpMethod,
        headers: edata.detail.httpHeaders,
        body: edata.detail.postData
    }, { dataType: grid.dataType, caller: grid, action })
    Object.assign(grid.last.fetch, {
        action: action,
        options: fetchOptions,
        controller: new AbortController(),
        start: Date.now(),
        loaded: false
    })
    fetchOptions['signal'] = grid.last.fetch.controller!.signal
    fetch(url, fetchOptions)
        .catch(processError)
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
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
                    grid.requestComplete(data ?? {}, action, callBack, resolve, reject)
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
            self.requestComplete({ error: true, message: TsUtils.lang(self.msgHTTPError), response }, action, callBack, resolve, reject)
        }
        // event after
        edata2.finish()
    }
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function save(grid: TsGrid, callBack?: (data: any) => void) {
    const changes = grid.getChanges()
    const url = grid.url?.save ?? grid.url
    // event before
    const edata = grid.trigger('save', { target: grid.name, changes: changes })
    if (edata.isCancelled === true) return
    if (url) {
        grid.request('save', { 'changes' : edata.detail['changes'] }, null,
            (data) => {
                if (!data.error) {
                    // only merge changes, if save was successful
                    grid.mergeChanges()
                }
                // event after
                edata.finish()
                // call back
                if (typeof callBack == 'function') callBack(data)
            }
        )
    } else {
        grid.mergeChanges()
        // event after
        edata.finish()
    }
}
