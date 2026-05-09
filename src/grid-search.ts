/**
 * grid-search.ts — Search domain extracted from TsGrid (Phase 6 of v2.0 SDD).
 * All functions take (grid: TsGrid, ...args) and are delegated from TsGrid methods.
 * DAG: leaf module — imports only tsgrid (type), query, TsUtils, TsTooltip, TsMenu, TsField.
 * FORBIDDEN: do NOT import any other grid-*.ts module (R3).
 */

import type { TsGrid, TsGridSearch } from './tsgrid.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'
import { TsMenu as _w2menu, TsTooltip as _w2tooltip } from './tstooltip.js'
import { TsField } from './tsfield.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsMenu    = _w2menu as any    // any: menu overlay with dynamic option shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsTooltip = _w2tooltip as any // any: tooltip with flexible option shapes

/** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
// any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addSearch(grid: TsGrid, before: any, search?: any): number {
    let added = 0
    if (search === undefined) {
        search = before
        before = grid.searches.length
    } else {
        if (typeof before == 'string') before = grid.getSearch(before, true)
        if (before == null) before = grid.searches.length
    }
    if (!Array.isArray(search)) search = [search]
    for (let i = 0; i < search.length; i++) {
        grid.searches.splice(before, 0, search[i])
        before++
        added++
    }
    grid.searchClose()
    return added
}

export function removeSearch(grid: TsGrid, ...fields: string[]) {
    let removed = 0
    for (let a = 0; a < fields.length; a++) {
        const field_a = fields[a]!
        for (let r = grid.searches.length-1; r >= 0; r--) {
            if (grid.searches[r]!.field == field_a) { grid.searches.splice(r, 1); removed++ }
        }
    }
    grid.searchClose()
    return removed
}

export function getSearch(grid: TsGrid): string[]
export function getSearch(grid: TsGrid, field: string, returnIndex: true): number | null
export function getSearch(grid: TsGrid, field: string, returnIndex?: false): TsGridSearch | null
export function getSearch(grid: TsGrid, field?: string, returnIndex?: boolean): string[] | number | TsGridSearch | null {
    // no arguments - return fields of all searches
    if (field === undefined) {
        const ret = []
        for (let i = 0; i < grid.searches.length; i++) ret.push(grid.searches[i]!.field)
        return ret
    }
    // find search
    for (let i = 0; i < grid.searches.length; i++) {
        if (grid.searches[i]!.field == field) {
            if (returnIndex === true) return i; else return grid.searches[i]!
        }
    }
    return null
}

export function toggleSearch(grid: TsGrid, ...fields: string[]) {
    let effected = 0
    for (let a = 0; a < fields.length; a++) {
        const field_a = fields[a]!
        for (let r = grid.searches.length-1; r >= 0; r--) {
            if (grid.searches[r]!.field == field_a) {
                grid.searches[r]!.hidden = !grid.searches[r]!.hidden
                effected++
            }
        }
    }
    grid.searchClose()
    return effected
}

export function showSearch(grid: TsGrid, ...fields: string[]) {
    let shown = 0
    for (let a = 0; a < fields.length; a++) {
        const field_a = fields[a]!
        for (let r = grid.searches.length-1; r >= 0; r--) {
            if (grid.searches[r]!.field == field_a && grid.searches[r]!.hidden !== false) {
                grid.searches[r]!.hidden = false
                shown++
            }
        }
    }
    grid.searchClose()
    return shown
}

export function hideSearch(grid: TsGrid, ...fields: string[]) {
    let hidden = 0
    for (let a = 0; a < fields.length; a++) {
        const field_a = fields[a]!
        for (let r = grid.searches.length-1; r >= 0; r--) {
            if (grid.searches[r]!.field == field_a && grid.searches[r]!.hidden !== true) {
                grid.searches[r]!.hidden = true
                hidden++
            }
        }
    }
    grid.searchClose()
    return hidden
}

// any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSearchData(grid: TsGrid, field: string): Record<string, any> | null {
    for (let i = 0; i < grid.searchData.length; i++) {
        if (grid.searchData[i]!.field == field) return grid.searchData[i]!
    }
    return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function search(grid: TsGrid, field?: any, value?: any) { // any: field can be string or searchData array; value varies
    const url = grid.url?.get ?? grid.url
    const searchData = []
    let last_multi = grid.last.multi
    let last_logic = grid.last.logic
    let last_field = grid.last.field
    let last_search = grid.last.search
    let hasHiddenSearches = false
    const overlay = query(`#w2overlay-${grid.name}-search-overlay`)
    // if emty sting, same as no search
    if (value === '') value = null
    // add hidden searches
    for (let i = 0; i < grid.searches.length; i++) {
        const srch_i = grid.searches[i]!
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
        if (grid.multiSearch) {
            field = grid.searchData
            value = grid.last.logic
        } else {
            field = grid.last.field
            value = grid.last.search
        }
    }
    // 1: search() - advanced search (reads from popup)
    if (field === undefined && overlay.length !== 0) {
        grid.focus() // otherwise search drop down covers searches
        last_logic = overlay.find(`#grid_${grid.name}_logic`).val()
        last_search = ''
        // advanced search
        for (let i = 0; i < grid.searches.length; i++) {
            const srch   = grid.searches[i]!
            const operator = overlay.find('#grid_'+ grid.name + '_operator_'+ i).val()
            const field1   = overlay.find('#grid_'+ grid.name + '_field_'+ i)
            const field2   = overlay.find('#grid_'+ grid.name + '_field2_'+ i)
            let value1   = field1.val()
            let value2   = field2.val()
            let svalue   = null
            let text     = null

            if (['int', 'float', 'money', 'currency', 'percent'].indexOf(srch.type) != -1) {
                const fld1 = field1[0]._w2field
                const fld2 = field2[0]._w2field
                if (fld1) value1 = fld1.clean(value1)
                if (fld2) value2 = fld2.clean(value2)
            }
            if (['list', 'enum'].indexOf(srch.type) != -1 || ['in', 'not in'].indexOf(operator) != -1) {
                value1 = field1[0]._w2field.selected || {}
                if (Array.isArray(value1)) {
                    svalue = []
                    for (let j = 0; j < value1.length; j++) {
                        svalue.push(TsUtils.isFloat(value1[j].id) ? parseFloat(value1[j].id) : String(value1[j].id).toLowerCase())
                        delete value1[j].hidden
                    }
                    if (Object.keys(value1).length === 0) value1 = ''
                } else {
                    text   = value1.text || ''
                    value1 = value1.id || ''
                }
            }
            if ((value1 !== '' && value1 != null) || (value2 != null && value2 !== '')) {
                // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tmp: any = {
                    field    : srch.field,
                    type     : srch.type,
                    operator : operator
                }
                if (operator == 'between') {
                    TsUtils.extend(tmp, { value: [value1, value2] })
                } else if (operator == 'in' && typeof value1 == 'string') {
                    TsUtils.extend(tmp, { value: value1.split(',') })
                } else if (operator == 'not in' && typeof value1 == 'string') {
                    TsUtils.extend(tmp, { value: value1.split(',') })
                } else {
                    TsUtils.extend(tmp, { value: value1 })
                }
                if (svalue) TsUtils.extend(tmp, { svalue: svalue })
                if (text) TsUtils.extend(tmp, { text: text })

                // convert date to unix time
                try {
                    if (srch.type == 'date' && operator == 'between') {
                        tmp.value[0] = value1 // TsUtils.isDate(value1, TsUtils.settings.dateFormat, true).getTime();
                        tmp.value[1] = value2 // TsUtils.isDate(value2, TsUtils.settings.dateFormat, true).getTime();
                    }
                    if (srch.type == 'date' && operator == 'is') {
                        tmp.value = value1 // TsUtils.isDate(value1, TsUtils.settings.dateFormat, true).getTime();
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
                if (grid.searches.length > 0) {
                    for (let i = 0; i < grid.searches.length; i++) {
                        const srch = grid.searches[i]!
                        if (srch.type == 'text' || (srch.type == 'alphanumeric' && TsUtils.isAlphaNumeric(value))
                                || (srch.type == 'int' && TsUtils.isInt(value)) || (srch.type == 'float' && TsUtils.isFloat(value))
                                || (srch.type == 'percent' && TsUtils.isFloat(value)) || ((srch.type == 'hex' || srch.type == 'color') && TsUtils.isHex(value))
                                || (srch.type == 'currency' && TsUtils.isMoney(value)) || (srch.type == 'money' && TsUtils.isMoney(value))
                                || (srch.type == 'date' && TsUtils.isDate(value)) || (srch.type == 'time' && TsUtils.isTime(value))
                                || (srch.type == 'datetime' && TsUtils.isDateTime(value)) || (srch.type == 'datetime' && TsUtils.isDate(value))
                                || (srch.type == 'enum' && TsUtils.isAlphaNumeric(value)) || (srch.type == 'list' && TsUtils.isAlphaNumeric(value))
                        ) {
                            const def = grid.defaultOperator[grid.operatorsMap[srch.type]!]
                            const tmp = {
                                field    : srch.field,
                                type     : srch.type,
                                operator : (srch.operator != null ? srch.operator : def),
                                value    : value
                            }
                            if (String(value).trim() != '') searchData.push(tmp)
                        }
                        // range in global search box
                        if (['int', 'float', 'money', 'currency', 'percent'].indexOf(srch.type) != -1){
                            const t = String(value).trim().split('-').map(v => v.trim()).filter(v => TsUtils.isFloat(v))
                            if (t.length == 2) {
                                const tmp = {
                                    field    : srch.field,
                                    type     : srch.type,
                                    operator : 'between',
                                    value    : [t[0], t[1]]
                                }
                                searchData.push(tmp)
                            }
                        }
                        // lists fields
                        if (['list', 'enum'].indexOf(srch.type) != -1) {
                            const new_values = []
                            if (srch.options == null) srch.options = {}
                            if (!Array.isArray(srch.options['items'])) srch.options['items'] = []
                            for (let j = 0; j < srch.options['items']; j++) {
                                const tmp = srch.options['items'][j]
                                try {
                                    const re = new RegExp(value, 'i')
                                    if (re.test(tmp)) new_values.push(j)
                                    if (tmp.text && re.test(tmp.text)) new_values.push(tmp.id)
                                } catch (e) {}
                            }
                            if (new_values.length > 0) {
                                const tmp = {
                                    field    : srch.field,
                                    type     : srch.type,
                                    operator : (srch.operator != null ? srch.operator : 'in'),
                                    value    : new_values
                                }
                                searchData.push(tmp)
                            }
                        }
                    }
                } else {
                    // no search fields, loop thru columns
                    for (let i = 0; i < grid.columns.length; i++) {
                        const tmp = {
                            field    : grid.columns[i]!.field,
                            type     : 'text',
                            operator : grid.defaultOperator['text'],
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
                        operator: grid.defaultOperator['text'],
                        value: value
                    }
                    searchData.push(tmp)
                }
            } else {
                const el = overlay.find('#grid_'+ grid.name +'_search_all')
                let srch = grid.getSearch(field)
                if (srch == null) srch = { field: field, type: 'text' }
                if (srch.field == field) grid.last.label = srch.label ?? ''
                if (value !== '') {
                    let op  = grid.defaultOperator[grid.operatorsMap[srch.type]!]
                    let val = value
                    if (['date', 'time', 'datetime'].indexOf(srch.type) != -1) op = 'is'
                    if (['list', 'enum'].indexOf(srch.type) != -1) {
                        op = 'is'
                        const tmp = el._w2field?.get()
                        if (tmp && Object.keys(tmp).length > 0) val = tmp.id; else val = ''
                    }
                    if (srch.type == 'int' && value !== '') {
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
                    if (srch.operator != null) op = srch.operator
                    const tmp = {
                        field    : srch.field,
                        type     : srch.type,
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
            if (typeof data.value == 'number' && data.operator == null) data.operator = grid.defaultOperator['number']
            if (typeof data.value == 'string' && data.operator == null) data.operator = grid.defaultOperator['text']
            if (Array.isArray(data.value) && data.operator == null) data.operator = grid.defaultOperator['enum']
            if (TsUtils.isDate(data.value) && data.operator == null) data.operator = grid.defaultOperator['date']

            // merge current field and search if any
            searchData.push(data)
        }
    }
    // event before
    const edata = grid.trigger('search', {
        target: grid.name,
        multi: (field === undefined ? true : false),
        searchField: (field ? field : 'multi'),
        searchValue: (field ? value : 'multi'),
        searchData: searchData,
        searchLogic: last_logic
    })
    if (edata.isCancelled === true) return
    // default action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.searchData             = edata.detail['searchData'] as any[] // any: detail values are unknown from TsEventData
    grid.last.field             = last_field
    grid.last.search            = last_search
    grid.last.multi             = last_multi
    grid.last.logic             = edata.detail['searchLogic'] as 'AND' | 'OR'
    grid.last.vscroll.scrollTop = 0
    grid.last.vscroll.scrollLeft = 0
    grid.last.selection.indexes = []
    grid.last.selection.columns = {}
    // -- clear all search field
    grid.searchClose()
    // apply search
    if (url) {
        grid.last.fetch.offset = 0
        grid.reload()
    } else {
        // local search
        grid.localSearch()
        grid.refresh()
    }
    // event after
    edata.finish()
}

// open advanced search popover
// any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchOpen(grid: TsGrid, options: any = {}) {
    if (!grid.box) return
    if (grid.searches.length === 0) return
    // event before
    const edata = grid.trigger('searchOpen', { target: grid.name })
    if (edata.isCancelled === true) {
        return
    }
    const $btn = query(grid.toolbar.box).find('.tsg-grid-search-input .tsg-search-drop')
    $btn.addClass('checked')
    // show search
    TsTooltip.show({
        name: grid.name + '-search-overlay',
        anchor: query(grid.box).find('#grid_'+ grid.name +'_search_all').get(0),
        position: 'bottom|top',
        html: grid.getSearchesHTML(),
        align: 'left',
        arrowSize: 12,
        class: 'tsg-grid-search-advanced',
        hideOn: ['doc-click'],
        ...(options?.overlay ?? {})
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((_event: any) => { // any: TsMenu/TsTooltip event detail shape varies
        grid.initSearches()
        grid.last['search_opened'] = true
        const overlay = query(`#w2overlay-${grid.name}-search-overlay`)
        overlay
            .data('gridName', grid.name)
            .off('.grid-search')
            .on('click.grid-search', (event: Event) => {
                // hide any tooltip opened by searches
                overlay.find('input, select').each((el: Node) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const names: any[] = query(el).data('tooltipName') // any: tooltip name list shape varies
                    if (names) names.forEach((name: string) => {
                        TsTooltip.hide(name)
                    })
                })
                console.log(event.target)
                if (!query(event.target).hasClass('tsg-saved-searches')) {
                    TsTooltip.hide(grid.name + '-search-suggest')
                }
            })
        TsUtils.bindEvents(overlay.find('select, input, button'), grid)
        // init first field
        const sfields = query(`#w2overlay-${grid.name}-search-overlay *[rel=search]`)
        if (sfields.length > 0) sfields[0].focus()
        // event after
        edata.finish()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .hide((_event: any) => { // any: TsTooltip event shape varies
        const edata = grid.trigger('searchClose', { target: grid.name })
        if (edata.isCancelled === true) {
            return
        }
        $btn.removeClass('checked')
        grid.last['search_opened'] = false
        edata.finish()
    })
}

export function searchClose(grid: TsGrid) {
    TsTooltip.hide(grid.name + '-search-overlay')
}

// if clicked on a field in the search strip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchFieldTooltip(grid: TsGrid, ind: any, sd_ind: any, el: any) { // any: all params are loosely typed from DOM
    const sf = grid.searches[ind]
    const sd = grid.searchData[sd_ind]
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
                options += `<span class="value">${TsUtils.formatDate(opt)}</span>`
            })
        }
    } else {
        if (sd.type == 'date') {
            val = TsUtils.formatDateTime(val)
        }

    }
    TsTooltip.hide(grid.name + '-search-props')
    TsTooltip.show({
        name: grid.name + '-search-props',
        anchor: el,
        class: 'tsg-white',
        hideOn: 'doc-click',
        html: `
            <div class="tsg-grid-search-single">
                <span class="field">${sf.label ?? ''}</span>
                <span class="operator">${TsUtils.lang(oper)}</span>
                ${Array.isArray(sd.value)
                    ? `${options}`
                    : `<span class="value">${val}</span>`
                }
                <div class="buttons">
                    <button id="remove" class="tsg-btn">${TsUtils.lang('Remove This Field')}</button>
                </div>
            </div>`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((event: any) => { // any: TsMenu/TsTooltip event detail shape varies
        query(event.detail.overlay.box).find('#remove').on('click', () => {
            grid.searchData.splice(sd_ind, 1)
            grid.reload()
            grid.localSearch()
            TsTooltip.hide(grid.name + '-search-props')
        })
    })
}

// drop down with save searches
export function searchSuggest(grid: TsGrid, imediate?: boolean, forceHide?: boolean, anchor?: HTMLElement | Element) {
    clearTimeout(grid.last.kbd_timer ?? undefined)
    clearTimeout(grid.last['overlay_timer'])
    grid.searchShowFields(true)
    if (anchor == null) grid.searchClose()
    if (forceHide === true || (anchor != null && query(`#w2overlay-${grid.name}-search-suggest`).length > 0)) {
        TsTooltip.hide(grid.name + '-search-suggest')
        return
    }
    if (query(`#w2overlay-${grid.name}-search-suggest`).length > 0) {
        // already shown
        return
    }
    if (!imediate) {
        grid.last['overlay_timer'] = setTimeout(() => { grid.searchSuggest(true) }, 100)
        return
    }

    const el = anchor ?? query(grid.box).find(`#grid_${grid.name}_search_all`).get(0)
    const searches = [
        ...grid.defaultSearches ?? [],
        ...grid.defaultSearches?.length > 0 && grid.savedSearches?.length > 0 ? ['--'] : [],
        ...grid.savedSearches ?? []
    ]
    if (Array.isArray(searches) && searches.length > 0) {
        TsMenu.show({
            name: grid.name + '-search-suggest',
            anchor: el,
            align: anchor != null ? 'left' : 'both',
            items: searches,
            selected: false,
            filter: true,
            hideOn: ['doc-click', 'sleect', 'remove'],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render(item: any) { // any: TsMenu item shape varies
                let ret = item.text
                if (item.isDefault) ret = `<b>${ret}</b>`
                return ret
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select((event: any) => { // any: TsMenu event shape varies
            const edata = grid.trigger('searchSelect', {
                target: grid.name,
                index: event.detail.index,
                item: event.detail.item
            })
            if (edata.isCancelled === true) {
                event.preventDefault()
                return
            }
            event.detail.overlay.hide()
            grid.last.logic  = event.detail.item.logic || 'AND'
            grid.last.search = ''
            grid.last.label  = '[Multiple Fields]'
            grid.searchData  = TsUtils.clone(event.detail.item.data)
            grid['searchSelected'] = TsUtils.clone(event.detail.item, { exclude: ['icon', 'remove'] })
            grid.reload()
            edata.finish()
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .remove((event: any) => { // any: TsMenu event shape varies
            const item = event.detail.item
            const edata = grid.trigger('searchRemove', { target: grid.name, index: event.detail.index, item })
            if (edata.isCancelled === true) {
                event.preventDefault()
                return
            }
            queueMicrotask(() => event.detail.overlay.hide())
            TsTooltip.hide(grid.name + '-search-overlay')

            // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(grid.confirm(TsUtils.lang('Do you want to delete search "${item}"?', { item: item.text })) as any)
                // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .yes((evt: any) => {
                    // remove from searches
                    const srch = grid.savedSearches.findIndex((s) => s.id == item.id ? true : false)
                    if (srch !== -1) {
                        grid.savedSearches.splice(srch, 1)
                    }
                    grid.cacheSave('searches', grid.savedSearches.map(s => TsUtils.clone(s, { exclude: ['remove', 'icon'] })))
                    evt.detail.self.close()
                    // evt after
                    edata.finish()
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .no((evt: any) => { // any: TsConfirm evt shape
                    evt.detail.self.close()
                })
        })
    }
}

export function searchSave(grid: TsGrid) {
    let value = ''
    if (grid['searchSelected']) {
        value = grid['searchSelected'].text
    }
    const ind = grid.savedSearches.findIndex(s => { return s.id == grid['searchSelected']?.id ? true : false })
    // event before
    const edata = grid.trigger('searchSave', { target: grid.name, saveLocalStorage: true })
    if (edata.isCancelled === true) return

    grid.message({
        width: 350,
        height: 150,
        body: `<div class="tsg-grid-save-search">
                    <span>${TsUtils.lang(ind != -1 ? 'Update Search' : 'Save New Search')}</span>
                    <input class="search-name tsg-input" placeholder="${TsUtils.lang('Search name')}">
               </div>`,
        buttons: `
            <button id="grid-search-cancel" class="tsg-btn">${TsUtils.lang('Cancel')}</button>
            <button id="grid-search-save" class="tsg-btn tsg-btn-blue" ${String(value).trim() == '' ? 'disabled': ''}>${TsUtils.lang('Save')}</button>
        `
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })?.open(async (event: any) => { // any: TsEvent message open callback
        query(event.detail.box).find('input, button').eq(0).val(value)
        await event.complete
        query(event.detail.box).find('#grid-search-cancel').on('click', () => {
            grid.message()
        })
        query(event.detail.box).find('#grid-search-save').on('click', () => {
            const input = query(event.detail.box).find('.tsg-message .search-name')
            const name = input.val()
            // save in savedSearches
            if (grid['searchSelected'] && ind != -1) {
                Object.assign(grid.savedSearches[ind], {
                    id: name,
                    text: name,
                    logic: grid.last.logic,
                    data: TsUtils.clone(grid.searchData)
                })
            } else {
                grid.savedSearches.push({
                    id: name,
                    text: name,
                    icon: 'tsg-icon-search',
                    remove: true,
                    logic: grid.last.logic,
                    data: grid.searchData
                })
            }
            // save local storage
            grid.cacheSave('searches', grid.savedSearches.map(s => TsUtils.clone(s, { exclude: ['remove', 'icon'] })))
            grid.message()
            // update on screen
            if (grid['searchSelected']) {
                grid['searchSelected'].text = name
                query(grid.box).find(`#grid_${grid.name}_search_name .name-text`).html(name)
            } else {
                grid['searchSelected'] = {
                    text: name,
                    logic: grid.last.logic,
                    data: TsUtils.clone(grid.searchData)
                }
                query(event.detail.box).find(`#grid_${grid.name}_search_all`).val(' ').prop('readOnly', true)
                query(event.detail.box).find(`#grid_${grid.name}_search_name`).show().find('.name-text').html(name)
            }
            edata.finish({ name })
        })
        await TsUtils.wait(100) // need this for dialog to be ready (sliding down) for focus to work
        query(event.detail.box).find('input, button')
            .off('.message')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('keydown.message', (evt: any) => { // any: KeyboardEvent at runtime
                const val = String(query(event.detail.box).find('.tsg-message-body input').val()).trim()
                if (evt.keyCode == 13 && val != '') {
                    query(event.detail.box).find('#grid-search-save').trigger('click') // enter
                }
                if (evt.keyCode == 27) { // escape
                    grid.message()
                }
            })
            .eq(0)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('input.message', (_evt: any) => { // any: InputEvent at runtime
                const $save = query(event.detail.box).closest('.tsg-message').find('#grid-search-save')
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
export function cache(grid: TsGrid, type: any) { // any: cache key is always string, loosely typed
    if (TsUtils.hasLocalStorage && grid.useLocalStorage) {
        try {
            const data = JSON.parse(localStorage['TsUi'] || '{}')
            data[(grid.stateId || grid.name)] ??= {}
            return data[(grid.stateId || grid.name)][type]
        } catch (e) {
        }
    }
    return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheSave(grid: TsGrid, type: any, value: any) { // any: cache key and value are dynamic
    if (TsUtils.hasLocalStorage && grid.useLocalStorage) {
        try {
            const data = JSON.parse(localStorage['TsUi'] || '{}')
            data[(grid.stateId || grid.name)] ??= {}
            data[(grid.stateId || grid.name)][type] = value
            localStorage['TsUi'] = JSON.stringify(data)
            return true
        } catch (e) {
            delete localStorage['TsUi']
        }
    }
    return false
}

export function searchReset(grid: TsGrid, noReload?: boolean) {
    const searchData = []
    let hasHiddenSearches = false
    // add hidden searches
    for (let i = 0; i < grid.searches.length; i++) {
        const srch_r = grid.searches[i]!
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
    const edata = grid.trigger('search', { reset: true, target: grid.name, searchData: searchData })
    if (edata.isCancelled === true) return
    // default action
    const input = query(grid.box).find('#grid_'+ grid.name +'_search_all')
    // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.searchData = edata.detail['searchData'] as any[]
    grid['searchSelected'] = null
    grid.last.search = ''
    grid.last.logic = (hasHiddenSearches ? 'AND' : grid.last.logic)
    // advanced search button
    if (grid.multiSearch) {
        input.next().show()
    } else {
        input.next().hide()
    }
    grid.last.multi = false
    grid.last.fetch.offset = 0
    // reset scrolling position
    grid.last.vscroll.scrollTop = 0
    grid.last.vscroll.scrollLeft = 0
    grid.last.selection.indexes = []
    grid.last.selection.columns = {}
    // -- clear all search field
    grid.searchClose()
    const all = input.val('').get(0)
    if (all?._w2field) { all._w2field.reset() }
    // apply search
    if (!noReload) {
        grid.reload()
    }
    // event after
    edata.finish()
}

export function searchShowFields(grid: TsGrid, forceHide?: boolean) {
    if (forceHide === true) {
        TsTooltip.hide(grid.name + '-search-fields')
        return
    }
    const items = []
    for (let s = -1; s < grid.searches.length; s++) {
        let srch: TsGridSearch | undefined = grid.searches[s]
        const sField   = (srch ? srch.field : null)
        const column   = sField != null ? grid.getColumn(sField) : null
        let disabled = false
        let tooltip  = null
        if (grid.show.searchHiddenMsg == true && s != -1
                && (column == null || (column.hidden === true && column.hideable !== false))) {
            disabled = true
            tooltip = TsUtils.lang(`This column ${column == null ? 'does not exist' : 'is hidden'}`)
        }
        if (s == -1) { // -1 is All Fields search
            if (!grid.multiSearch || !grid.show.searchAll) continue
            srch = { field: 'all', label: 'All Fields', type: 'text' } as TsGridSearch
        } else {
            if (column != null && column.hideable === false) continue
            if (srch == null) continue
            if (srch.hidden === true) {
                tooltip = TsUtils.lang('This column is hidden')
                // don't show hidden (not simple) searches
                if (srch['simple'] === false) continue
            }
        }
        if (srch == null) continue
        if (srch.label == null && srch['caption'] != null) {
            console.log('NOTICE: grid search.caption property is deprecated, please use search.label. Search ->', srch)
            srch.label = srch['caption']
        }
        items.push({
            id: srch.field,
            text: TsUtils.lang(srch.label ?? ''),
            search: srch,
            tooltip,
            disabled,
            checked: (srch.field == grid.last.field)
        })
    }
    TsMenu.show({
        type: 'radio',
        name: grid.name + '-search-fields',
        anchor: query(grid.box).find('#grid_'+ grid.name +'_search_name').parent().find('.tsg-search-down').get(0),
        items,
        align: 'none',
        hideOn: ['doc-click', 'select']
    })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .select((event: any) => { // any: TsMenu event shape varies
            grid.searchInitInput(event.detail.item.search.field)
        })
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchInitInput(grid: TsGrid, field: string, _value?: any) {
    let srch
    const el = query(grid.box).find('#grid_'+ grid.name +'_search_all')
    if (field == 'all') {
        srch = { field: 'all', label: TsUtils.lang('All Fields') }
    } else {
        srch = grid.getSearch(field)
        if (srch == null) return
    }
    // update field
    if (grid.last.search != '') {
        grid.last.label = srch.label ?? ''
        grid.search(srch.field, grid.last.search)
    } else {
        grid.last.field = srch.field
        grid.last.label = srch.label ?? ''
    }
    el.attr('placeholder', TsUtils.lang('Search') + ' ' + TsUtils.lang(srch.label || srch['caption'] || srch.field, true))

    // if there is pre-selected search
    if (grid['searchSelected']) {
        query(grid.box).find(`#grid_${grid.name}_search_all`).val(' ').prop('readOnly', true)
        query(grid.box).find(`#grid_${grid.name}_search_name`).show().find('.name-text').html(grid['searchSelected'].text)
    } else {
        query(grid.box).find(`#grid_${grid.name}_search_all`).prop('readOnly', false)
        query(grid.box).find(`#grid_${grid.name}_search_name`).hide().find('.name-text').html('')
    }
}

export function getSearchesHTML(grid: TsGrid) {
    let html = `
        <div class="search-title">
            ${TsUtils.lang('Advanced Search')}
            ${grid.savedSearches?.length > 0
                ? `<button class="tsg-btn tsg-saved-searches" data-click="searchSuggest|true|false|this">Saved Searches (${grid.savedSearches?.length ?? 0})</button>`
                : ''
            }
            <span class="search-logic" style="${grid.show.searchLogic ? '' : 'display: none'}">
                <select id="grid_${grid.name}_logic" class="tsg-input">
                    <option value="AND" ${grid.last.logic == 'AND' ? 'selected' : ''}>${TsUtils.lang('All')}</option>
                    <option value="OR" ${grid.last.logic == 'OR' ? 'selected' : ''}>${TsUtils.lang('Any')}</option>
                </select>
            </span>
        </div>
    `
    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: any[] = []
    let col_ind = 0
    columns.push('<div><table cellspacing="0"><tbody>')
    for (let i = 0; i < grid.searches.length; i++) {
        const s  = grid.searches[i]!
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
            <select id="grid_${grid.name}_operator_${i}" class="tsg-input" data-change="initOperator|${i}">
                ${grid.getOperators(s.type, s.operators)}
            </select>
        `
        columns[col_ind] += `<tr>
                    <td class="caption">${(TsUtils.lang(s.label ?? s.field) || '')}</td>
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
                columns[col_ind] += `<input rel="search" type="text" id="grid_${grid.name}_field_${i}" name="${s.field}"
                           class="tsg-input" style="${tmpStyle + s.style}" ${s.attr}>`
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
                columns[col_ind] += `<input id="grid_${grid.name}_field_${i}" name="${s.field}" ${s.attr} rel="search" type="text"
                            class="tsg-input" style="${tmpStyle + s.style}">
                        <span id="grid_${grid.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                            <input rel="search" type="text" class="tsg-input" style="${tmpStyle + s.style}" id="grid_${grid.name}_field2_${i}" name="${s.field}" ${s.attr}>
                        </span>`
                break

            case 'select':
                columns[col_ind] += `<select rel="search" class="tsg-input" style="${s.style}" id="grid_${grid.name}_field_${i}"
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
            <button type="button" class="tsg-btn close-btn" data-click="searchClose">${TsUtils.lang('Close')}</button>
            <div style="float: right; display: inline">
                <button type="button" class="tsg-btn" data-click="searchReset">${TsUtils.lang('Reset')}</button>
                <button type="button" class="tsg-btn tsg-btn-blue" data-click="search">${TsUtils.lang('Search')}</button>
            </div>
        </div>
    `
    return html
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOperators(grid: TsGrid, type: any, opers: any) {
    let operators = grid.operators[grid.operatorsMap[type] ?? ''] || []
    if (opers != null && Array.isArray(opers)) {
        operators = opers
    }
    let html = ''
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operators.forEach((oper: any) => {
        let displayText = oper
        let operValue = oper
        if (Array.isArray(oper)) {
            displayText = oper[1]
            operValue = oper[0]
        } else if (TsUtils.isPlainObject(oper)) {
            displayText = oper.text
            operValue = oper.oper
        }
        if (displayText == null) displayText = oper
        html += `<option  value="${operValue}">${TsUtils.lang(displayText)}</option>\n`
    })
    return html
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initOperator(grid: TsGrid, ind: any) {
    let options
    const srch    = grid.searches[ind]!
    const sdata   = grid.getSearchData(srch.field)
    const overlay = query(`#w2overlay-${grid.name}-search-overlay`)
    const $rng    = overlay.find(`#grid_${grid.name}_range_${ind}`)
    const $fld1   = overlay.find(`#grid_${grid.name}_field_${ind}`)
    const $fld2   = overlay.find(`#grid_${grid.name}_field2_${ind}`)
    const $oper   = overlay.find(`#grid_${grid.name}_operator_${ind}`)
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
    switch (srch.type) {
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
                new TsField(srch.type, { el: $fld1[0], ...srch.options })
                new TsField(srch.type, { el: $fld2[0], ...srch.options })
                setTimeout(() => { // convert to date if it is number
                    $fld1.trigger('keydown')
                    $fld2.trigger('keydown')
                }, 1)
            }
            break

        case 'list':
        case 'combo':
        case 'enum':
            options = srch.options ?? {}
            if (srch.type == 'list') options['selected'] = {}
            if (srch.type == 'enum') options['selected'] = []
            if (sdata) options['selected'] = sdata['value']
            if (!$fld1[0]._w2field) {
                const fld = new TsField(srch.type, {
                    el: $fld1[0],
                    ...options,
                    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSelect: async (event: any) => {
                        await event.complete
                        grid.initSearchLists(srch.field)
                    },
                    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onRemove: async (event: any) => {
                        await event.complete
                        grid.initSearchLists(srch.field)
                    }
                })
                if (sdata && sdata['text'] != null) {
                    fld.set({ id: sdata['value'], text: sdata['text'] })
                }
                srch['_w2field'] = fld
            }
            break

        case 'select':
            // build options
            options = '<option value="">--</option>'
            const searchOpts = srch.options ?? {}
            for (let i = 0; i < searchOpts['items'].length; i++) {
                const si = searchOpts['items'][i]
                if (TsUtils.isPlainObject(searchOpts['items'][i])) {
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
    grid.initSearchLists()
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initSearchLists(grid: TsGrid, changedField?: any) {
    const fields = grid.getSearch()
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields.forEach((field: any) => {
        const srch = grid.getSearch(field)
        if (srch != null && srch.options?.['parentList'] != null) {
            const parent = grid.getSearch(srch.options['parentList'])
            if (parent == null) return
            let values = grid.getSearch(parent.field)?.['_w2field']?.get()
            if (Array.isArray(values)) {
                values = values.map(vv => vv.id)
            } else {
                values = values?.id != null ? [values.id] : []
            }
            // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            srch['_w2field']?.options?.items?.forEach?.((item: any) => {
                const parent = TsUtils.getNested(item, srch?.options?.['parentField'] ?? 'parentId')
                if (parent == null) {
                    return
                }
                const possible = TsUtils.clone(Array.isArray(parent) ? parent : [parent])
                possible.unshift('')
                // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
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
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields.forEach((field: any) => {
            const srch = grid.getSearch(field)
            if (srch != null && srch.options?.['parentList'] == changedField) {
                const fld = srch['_w2field']
                // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = fld.options.items.filter((it: any) => !it.hidden).map((it: any) => it.id)
                if (fld.type == 'list' && !items.includes(fld.get()?.id)) {
                    fld.set(null)
                }
                if (fld.type == 'enum') {
                    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const new_sel = fld.get()?.filter((it: any) => items.includes(it.id))
                    fld.set(new_sel || [])
                }
            }
        })
    }
}

export function initSearches(grid: TsGrid) {
    const overlay = query(`#w2overlay-${grid.name}-search-overlay`)
    // init searches
    for (let ind = 0; ind < grid.searches.length; ind++) {
        const srch    = grid.searches[ind]!
        const sdata   = grid.getSearchData(srch.field)
        srch.type = String(srch.type).toLowerCase()
        if (srch.type == 'new-column') {
            continue
        }
        if (typeof srch.options != 'object') srch.options = {}
        // operators
        let operator  = srch.operator
        let operators = [...(grid.operators[grid.operatorsMap[srch.type] ?? ''] ?? [])] // need a copy
        if (srch.operators) operators = [...srch.operators] // need a copy as this variable will be changed
        // normalize
        // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (TsUtils.isPlainObject(operator)) operator = (operator as any).oper
        operators.forEach((oper, ind) => {
            if (TsUtils.isPlainObject(oper)) operators[ind] = oper.oper
        })
        if (sdata && sdata['operator']) {
            operator = sdata['operator']
        }
        // default operator
        const def = grid.defaultOperator[grid.operatorsMap[srch.type] ?? '']
        if (operators.indexOf(operator) == -1) {
            operator = def
        }
        overlay.find(`#grid_${grid.name}_operator_${ind}`).val(operator)
        grid.initOperator(ind)
        // populate field value
        const $fld1 = overlay.find(`#grid_${grid.name}_field_${ind}`)
        const $fld2 = overlay.find(`#grid_${grid.name}_field2_${ind}`)
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
    overlay.find('.tsg-grid-search-advanced *[rel=search]')
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('keypress', (evnt: any) => {
            if (evnt.keyCode == 13) {
                grid.search()
                TsTooltip.hide(grid.name + '-search-overlay')
            }
        })
}
