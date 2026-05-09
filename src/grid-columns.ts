/**
 * grid-columns.ts — Column management sub-module for TsGrid (v2.0)
 *
 * Extracted from src/tsgrid.ts as part of the tsgrid-v2-core structural refactor.
 * Strategy D — Hybrid sibling files: plain functions taking `grid: TsGrid` as first parameter.
 * All method bodies lifted verbatim from TsGrid; `this.X` → `grid.X` mechanically.
 *
 * Design R13: No per-module unit tests. Sub-modules require a full TsGrid instance.
 * Design R8:  No helper closures promoted to top-level exports.
 */

import type { TsGrid } from './tsgrid.js'
import type { TsGridColumn } from './tsgrid.js'
import { TsUtils } from './tsutils.js'

/** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
// any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addColumn(grid: TsGrid, before: any, columns?: any): number {
    let added = 0
    if (columns === undefined) {
        columns = before
        before  = grid.columns.length
    } else {
        if (typeof before == 'string') before = grid.getColumn(before, true)
        if (before == null) before = grid.columns.length
    }
    if (!Array.isArray(columns)) columns = [columns]
    for (let i = 0; i < columns.length; i++) {
        const col = TsUtils.extend({}, grid.colTemplate, columns[i])
        grid.columns.splice(before, 0, col)
        // if column is searchable, add search field
        if (columns[i].searchable) {
            let stype = columns[i].searchable
            let attr  = ''
            if (columns[i].searchable === true) { stype = 'text'; attr = 'size="20"' }
            grid.addSearch({ field: columns[i].field, label: columns[i].text, type: stype, attr: attr })
        }
        before++
        added++
    }
    grid.refresh()
    return added
}

export function removeColumn(grid: TsGrid, ...fields: string[]) {
    let removed = 0
    for (let a = 0; a < fields.length; a++) {
        const field_a = fields[a]!
        for (let r = grid.columns.length-1; r >= 0; r--) {
            if (grid.columns[r]!.field == field_a) {
                if (grid.columns[r]!.searchable) grid.removeSearch(field_a)
                grid.columns.splice(r, 1)
                removed++
            }
        }
    }
    grid.refresh()
    return removed
}

export function getColumn(grid: TsGrid): string[]
export function getColumn(grid: TsGrid, field: string, returnIndex: true): number | null
export function getColumn(grid: TsGrid, field: string, returnIndex?: false): TsGridColumn | null
export function getColumn(grid: TsGrid, field?: string, returnIndex?: boolean): string[] | number | TsGridColumn | null {
    // no arguments - return fields of all columns
    if (field === undefined) {
        const ret = []
        for (let i = 0; i < grid.columns.length; i++) ret.push(grid.columns[i]!.field)
        return ret
    }
    // find column
    for (let i = 0; i < grid.columns.length; i++) {
        if (grid.columns[i]!.field == field) {
            if (returnIndex === true) return i; else return grid.columns[i]!
        }
    }
    return null
}

// any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateColumn(grid: TsGrid, fields: string | string[], updates: Partial<TsGridColumn> | Record<string, any>) {
    let effected = 0
    fields = (Array.isArray(fields) ? fields : [fields])
    fields.forEach((colName) => {
        grid.columns.forEach((col) => {
            if (col.field == colName) {
                const _updates = TsUtils.clone(updates)
                Object.keys(_updates).forEach((key) => {
                    // if it is a function
                    if (typeof _updates[key] == 'function') {
                        _updates[key] = _updates[key](col)
                    }
                    if (col[key] != _updates[key]) effected++
                })
                TsUtils.extend(col, _updates)
            }
        })
    })
    if (effected > 0) {
        grid.refresh() // need full refresh due to colgroups not reassigning properly
    }
    return effected
}

export function toggleColumn(grid: TsGrid, ...fields: string[]) {
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return grid.updateColumn(fields, { hidden(col: any) { return !col.hidden } })
}

export function showColumn(grid: TsGrid, ...fields: string[]) {
    return grid.updateColumn(fields, { hidden: false })
}

export function hideColumn(grid: TsGrid, ...fields: string[]) {
    return grid.updateColumn(fields, { hidden: true })
}
