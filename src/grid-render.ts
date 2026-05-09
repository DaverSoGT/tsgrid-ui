import type { TsGrid, TsGridRecord, TsGridColumn } from './tsgrid.js'
import { TsUi, TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'
import { TsToolbar } from './tstoolbar.js'
import { TsMenu as _w2menu, TsTooltip as _w2tooltip } from './tstooltip.js'

// any: query() always returns Query at runtime; cast to any for clean duck-typing throughout TsGrid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like in TsGrid
// any: TsMenu/TsTooltip have complex show/hide overloads
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsMenu    = _w2menu as any    // any: menu overlay with dynamic option shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsTooltip = _w2tooltip as any // any: tooltip with flexible option shapes

export function resize(grid: TsGrid) {
    const time = Date.now()
    // make sure the box is right
    if (!grid.box || query(grid.box).attr('name') != grid.name) return
    // event before
    const edata = grid.trigger('resize', { target: grid.name })
    if (edata.isCancelled === true) return
    // resize
    if (grid.box != null) {
        grid.resizeBoxes()
        grid.resizeRecords()
    }
    // event after
    edata.finish()
    return Date.now() - time
}

// any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function update(grid: TsGrid, { cells, fullCellRefresh, ignoreColumns }: any = {}) {
    const time = Date.now()
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    if (grid.box == null) return 0
    if (Array.isArray(cells)) {
        for (let i = 0; i < cells.length; i++) {
            const index  = cells[i].index
            const column = cells[i].column
            if (index < 0) continue
            if (index == null || column == null) {
                console.log('ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]')
                continue
            }
            const rec: TsGridRecord = grid.records[index] ?? {} as TsGridRecord
            rec.TsUi = rec.TsUi ?? {}
            rec.TsUi['_update'] = rec.TsUi['_update'] ?? { cells: [] }
            let row1 = rec.TsUi['_update'].row1
            let row2 = rec.TsUi['_update'].row2
            if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
                row1 = grid.box.querySelector(`#grid_${grid.name}_rec_${TsUtils.escapeId(rec.recid)}`)
                row2 = grid.box.querySelector(`#grid_${grid.name}_frec_${TsUtils.escapeId(rec.recid)}`)
                rec.TsUi['_update'].row1 = row1
                rec.TsUi['_update'].row2 = row2
            }
            _update(rec, row1, row2, index, column)
        }
    } else {
        for (let i = (grid.last.vscroll.recIndStart ?? 0) - 1; i <= (grid.last.vscroll.recIndEnd ?? 0); i++) {
            let index = i
            if (grid.last.searchIds.length > 0) { // if search is applied
                index = grid.last.searchIds[i] ?? i
            } else {
                index = i
            }
            const rec = grid.records[index]!
            if (index < 0 || rec == null) continue
            rec.TsUi = rec.TsUi ?? {}
            rec.TsUi['_update'] = rec.TsUi['_update'] ?? { cells: [] }
            let row1 = rec.TsUi['_update'].row1
            let row2 = rec.TsUi['_update'].row2
            if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
                row1 = grid.box.querySelector(`#grid_${grid.name}_rec_${TsUtils.escapeId(rec.recid)}`)
                row2 = grid.box.querySelector(`#grid_${grid.name}_frec_${TsUtils.escapeId(rec.recid)}`)
                rec.TsUi['_update'].row1 = row1
                rec.TsUi['_update'].row2 = row2
            }
            for (let column = 0; column < grid.columns.length; column++) {
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
        let cell = rec.TsUi['_update'].cells[column]
        if (cell == null || !cell.isConnected) {
            cell = self.box!.querySelector(`#grid_${self.name}_data_${index}_${column}`)
            rec.TsUi['_update'].cells[column] = cell
        }
        if (cell == null) return
        if (fullCellRefresh) {
            query(cell).replace(self.getCellHTML(index, column, false))
            // need to reselect as it was replaced
            cell = self.box!.querySelector(`#grid_${self.name}_data_${index}_${column}`)
            rec.TsUi['_update'].cells[column] = cell
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
                const ignore = ['tsg-grid-data']
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
        if (rec.TsUi.class != null) {
            if (typeof rec.TsUi.class == 'string') {
                const ignore = ['tsg-odd', 'tsg-even', 'tsg-record']
                const remove: string[] = []
                const add = rec['TsUi']['class'].split(' ').filter((cl: string) => !!cl) // remove empty
                if (row1 && row2) {
                    row1.classList.forEach((cl: string) => { if (!ignore.includes(cl)) remove.push(cl) })
                    row1.classList.remove(...remove)
                    row1.classList.add(...add)
                    row2.classList.remove(...remove)
                    row2.classList.add(...add)
                }
            }
            if (TsUtils.isPlainObject(rec.TsUi.class) && typeof rec.TsUi.class[pcol?.field ?? ''] == 'string') {
                const ignore = ['tsg-grid-data']
                const remove: string[] = []
                const add = rec['TsUi']['class'][pcol!.field].split(' ').filter((cl: string) => !!cl)
                cell.classList.forEach((cl: string) => { if (!ignore.includes(cl)) remove.push(cl) })
                cell.classList.remove(...remove)
                cell.classList.add(...add)
            }
        }
        // record styles if any
        if (rec.TsUi.style != null || rec.TsUi.styles != null) {
            if (row1 && row2 && typeof rec.TsUi.style == 'string' && row1.style.cssText !== rec.TsUi.style) {
                row1.style.cssText = 'height: '+ self.recordHeight + 'px;' + rec.TsUi.style
                row1.setAttribute('custom_style', rec.TsUi.style)
                row2.style.cssText = 'height: '+ self.recordHeight + 'px;' + rec.TsUi.style
                row2.setAttribute('custom_style', rec.TsUi.style)
            }
            if (rec.TsUi.styles == null) {
                rec.TsUi.styles = rec.TsUi.style
            }
            if (TsUtils.isPlainObject(rec.TsUi.styles) && typeof rec.TsUi.styles[pcol?.field ?? ''] == 'string'
                    && cell.style.cssText !== rec.TsUi.styles[pcol?.field ?? '']) {
                cell.style.cssText = rec.TsUi.styles[pcol!.field]
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function refreshCell(grid: TsGrid, recid: any, field: any) { // any: recid is string|number; field is string
    const index = grid.get(recid, true)
    const col_ind = grid.getColumn(field, true)
    if (index == null || col_ind == null) return false
    const isSummary = (grid.records[index] && grid.records[index]!.recid == recid ? false : true)
    const cell = query(grid.box).find(`${isSummary ? '.tsg-grid-summary ' : ''}#grid_${grid.name}_data_${index}_${col_ind}`)
    if (cell.length == 0) return false
    // set cell html and changed flag
    cell.replace(grid.getCellHTML(index, col_ind, isSummary))
    return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function refreshRow(grid: TsGrid, recid: any, ind: any = null) { // any: recid is string|number; ind is number
    let tr1 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid))
    let tr2 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(recid))
    if (tr1.length > 0) {
        if (ind == null) ind = grid.get(recid, true)
        const line = tr1.attr('line')
        const isSummary = (grid.records[ind] && grid.records[ind]!.recid == recid ? false : true)
        // if it is searched, find index in search array
        const url = grid.url?.get ?? grid.url
        if (grid.searchData.length > 0 && !url) for (let s = 0; s < grid.last.searchIds.length; s++) if (grid.last.searchIds[s] == ind) ind = s
        const rec_html = grid.getRecordHTML(ind, line, isSummary)
        tr1.replace(rec_html[0])
        tr2.replace(rec_html[1])
        // apply style to row if it was changed in render functions
        let st = (grid.records[ind]!.TsUi ? grid.records[ind]!.TsUi!['style'] : '')
        if (typeof st == 'string') {
            tr1 = query(grid.box).find('#grid_'+ grid.name +'_frec_'+ TsUtils.escapeId(recid))
            tr2 = query(grid.box).find('#grid_'+ grid.name +'_rec_'+ TsUtils.escapeId(recid))
            tr1.attr('custom_style', st)
            tr2.attr('custom_style', st)
            if (tr1.hasClass('tsg-selected')) {
                st = st.replace('background-color', 'none')
            }
            tr1[0].style.cssText = 'height: '+ grid.recordHeight + 'px;' + st
            tr2[0].style.cssText = 'height: '+ grid.recordHeight + 'px;' + st
        }
        if (isSummary) {
            grid.resize()
        }
        return true
    }
    return false
}

export function refresh(grid: TsGrid) {
    const time = Date.now()
    const url  = grid.url?.get ?? grid.url
    if (grid.total <= 0 && !url && grid.searchData.length === 0) {
        grid.total = grid.records.length
    }
    if (!grid.box) return
    // event before
    const edata = grid.trigger('refresh', { target: grid.name })
    if (edata.isCancelled === true) return
    // -- header
    if (grid.show.header) {
        query(grid.box).find(`#grid_${grid.name}_header`).html(TsUtils.lang(grid.header) +'&#160;').show()
    } else {
        query(grid.box).find(`#grid_${grid.name}_header`).hide()
    }
    // -- toolbar
    if (grid.show.toolbar) {
        query(grid.box).find('#grid_'+ grid.name +'_toolbar').show()
    } else {
        query(grid.box).find('#grid_'+ grid.name +'_toolbar').hide()
    }
    // -- make sure search is closed
    grid.searchClose()
    // --- default search field
    const getFirstSearchField = () => {
        let tmp = 0
        while (tmp < grid.searches.length && (grid.searches[tmp]!.hidden || grid.searches[tmp]!['simple'] === false)) {
            tmp++
        }
        if (tmp >= grid.searches.length) return { field: '', label: '' } // all searches are hidden or simple
        return grid.searches[tmp]!
    }
    if (!grid.multiSearch && grid.last.field == 'all') {
        const fld = getFirstSearchField()
        grid.last.field = fld.field
        grid.last.label = fld.label ?? ''
    }
    if (grid.last.field == 'all' && !grid.show.searchAll) {
        grid.last.field = ''
    }
    if (!grid.last.field) {
        if (grid.show.searchAll) {
            grid.last.field = 'all'
            grid.last.label = 'All Fields'
        } else {
            const fld = getFirstSearchField()
            grid.last.field = fld.field
            grid.last.label = fld.label ?? ''
        }
    }
    const sInput = query(grid.box).find('#grid_'+ grid.name +'_search_all')
    // find right search label
    for (let ss = 0; ss < grid.searches.length; ss++) {
        if (grid.searches[ss]!.field == grid.last.field) {
            grid.last.label = grid.searches[ss]!.label ?? ''
        }
    }
    if (grid.last.multi) {
        sInput.attr('placeholder', '[' + TsUtils.lang('Multiple Fields') + ']')
    } else {
        sInput.attr('placeholder', TsUtils.lang('Search') + ' ' + TsUtils.lang(grid.last.label, true))
    }
    if (sInput.val() != grid.last.search) {
        let val = grid.last.search
        const tmp = sInput._w2field
        if (tmp) val = tmp.format(val)
        sInput.val(val)
    }

    grid.refreshSearch()
    grid.refreshBody()

    // -- footer
    if (grid.show.footer) {
        query(grid.box).find(`#grid_${grid.name}_footer`).html(grid.getFooterHTML()).show()
    } else {
        query(grid.box).find(`#grid_${grid.name}_footer`).hide()
    }
    // all selected?
    const sel = grid.last.selection,
        areAllSelected = (grid.records.length > 0 && sel.indexes.length == grid.records.length),
        areAllSearchedSelected = (sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length)
    if (areAllSelected || areAllSearchedSelected) {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', true)
    } else {
        query(grid.box).find('#grid_'+ grid.name +'_check_all').prop('checked', false)
    }
    // show number of selected
    grid.status()
    // collapse all records
    const rows = grid.find({ 'TsUi.expanded': true }, true, true)
    for (let r = 0; r < rows.length; r++) {
        const tmp = grid.records[rows[r]! as number]!.TsUi
        if (tmp && !Array.isArray(tmp.children)) {
            tmp.expanded = false
        }
    }
    // mark selection
    if (grid.markSearch) {
        setTimeout(() => {
            // mark all search strings
            const search = []
            for (let s = 0; s < grid.searchData.length; s++) {
                const sdata = grid.searchData[s]!
                const fld   = grid.getSearch(sdata.field)
                if (!fld || fld.hidden) continue
                const ind = grid.getColumn(sdata.field, true)
                search.push({ field: sdata.field, search: sdata['value'], col: ind })
            }
            if (search.length > 0) {
                search.forEach((item) => {
                    const el = query(grid.box).find('td[col="'+ item.col +'"]:not(.tsg-head)')
                    TsUtils.marker(el, item.search)
                })
            }
        }, 50)
    }
    grid.updateToolbar(grid.last.selection)
    // event after
    edata.finish()
    grid.resize()
    grid.addRange('selection')
    setTimeout(() => { // allow to render first
        grid.resize() // needed for horizontal scroll to show (do not remove)
        grid.scroll()
    }, 1)

    if (grid.reorderColumns && !grid.last.columnDrag) {
        grid.last.columnDrag = grid.initColumnDrag()
    } else if (!grid.reorderColumns && grid.last.columnDrag) {
        grid.last.columnDrag.remove()
    }
    return Date.now() - time
}

export function refreshSearch(grid: TsGrid) {
    if (grid.multiSearch && grid.searchData.length > 0) {
        if (query(grid.box).find('.tsg-grid-searches').length == 0) {
            query(grid.box).find('.tsg-grid-toolbar')
                .css('height', (grid.last.toolbar_height + 35) + 'px')
                .append(`<div id="grid_${grid.name}_searches" class="tsg-grid-searches"></div>`)

        }
        let searches = `
            <span id="grid_${grid.name}_search_logic" class="tsg-grid-search-logic"></span>
            <div class="grid-search-line"></div>`
        grid.searchData.forEach((sd, sd_ind) => {
            const ind = grid.getSearch(sd.field, true)
            const sf = ind != null ? grid.searches[ind] : null
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
                        dsp1 = TsUtils.formatDate(dsp1)
                    }
                    if (Number(dsp2) === dsp2) {
                        dsp2 = TsUtils.formatDate(dsp2)
                    }
                    display = `: ${dsp1} - ${dsp2}`
                } else {
                    let dsp = sd.value
                    if (Number(dsp) == dsp) {
                        dsp = TsUtils.formatDate(dsp)
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
            searches += `<span class="tsg-action" data-click="searchFieldTooltip|${ind}|${sd_ind}|this">
                ${sf ? (sf.label ?? sf.field) : sd.field}
                ${display}
                <span class="icon-chevron-down"></span>
            </span>`
        })
        // clear and save
        searches += `
            ${grid.show.searchSave
                ? `<div class="grid-search-line"></div>
                   <button class="tsg-btn grid-search-btn" data-click="searchSave" type="button">${TsUtils.lang('Save')}</button>
                  `
                : ''
            }
            <button class="tsg-btn grid-search-btn btn-remove" type="button"
                data-click="searchReset">X</button>
        `
        query(grid.box).find(`#grid_${grid.name}_searches`).html(searches)
        query(grid.box).find(`#grid_${grid.name}_search_logic`).html(TsUtils.lang(grid.last.logic == 'AND' ? 'All' : 'Any'))
    } else {
        query(grid.box).find('.tsg-grid-toolbar')
            .css('height', grid.last.toolbar_height + 'px')
            .find('.tsg-grid-searches')
            .remove()
    }
    if (grid['searchSelected']) {
        query(grid.box).find(`#grid_${grid.name}_search_all`).val(' ').prop('readOnly', true)
        query(grid.box).find(`#grid_${grid.name}_search_name`).show().find('.name-text').html(grid['searchSelected'].text)
    } else {
        query(grid.box).find(`#grid_${grid.name}_search_all`).prop('readOnly', false)
        query(grid.box).find(`#grid_${grid.name}_search_name`).hide().find('.name-text').html('')
    }
    TsUtils.bindEvents(query(grid.box).find(`#grid_${grid.name}_searches .tsg-action, #grid_${grid.name}_searches button`), grid)
}

export function refreshBody(grid: TsGrid) {
    grid.updateExpanded()
    grid.scroll() // need to calculate virtual scrolling for columns
    const recHTML  = grid.getRecordsHTML()
    const colHTML  = grid.getColumnsHTML()
    const bodyHTML =
        '<div id="grid_'+ grid.name +'_frecords" class="tsg-grid-frecords" style="margin-bottom: '+ ((TsUtils.scrollBarSize() as number) - 1) +'px;">'+
            recHTML[0] +
        '</div>'+
        '<div id="grid_'+ grid.name +'_records" class="tsg-grid-records">' +
            recHTML[1] +
        '</div>'+
        '<div id="grid_'+ grid.name +'_scroll1" class="tsg-grid-scroll1" style="height: '+ TsUtils.scrollBarSize() +'px"></div>'+
        // Columns need to be after to be able to overlap
        '<div id="grid_'+ grid.name +'_fcolumns" class="tsg-grid-fcolumns">'+
        '    <table><tbody>'+ colHTML[0] +'</tbody></table>'+
        '</div>'+
        '<div id="grid_'+ grid.name +'_columns" class="tsg-grid-columns">'+
        '    <table><tbody>'+ colHTML[1] +'</tbody></table>'+
        '</div>'+
        `<div class="tsg-intersection-marker" style="display: none; height: ${grid.recordHeight - 5}px">
           <div class="top-marker"></div>
           <div class="bottom-marker"></div>
        </div>`

    const gridBody = query(grid.box).find(`#grid_${grid.name}_body`, grid.box).html(bodyHTML)
    const records  = query(grid.box).find(`#grid_${grid.name}_records`, grid.box)
    const frecords = query(grid.box).find(`#grid_${grid.name}_frecords`, grid.box)
    if (grid.selectType == 'row') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        records.on('mouseover mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
            const ind = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
            const recid = grid.records[ind]?.recid
            query(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)}`)
                .toggleClass('tsg-record-hover', event.type == 'mouseover')
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        frecords.on('mouseover mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
            const ind = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
            const recid = grid.records[ind]?.recid
            query(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)}`)
                .toggleClass('tsg-record-hover', event.type == 'mouseover')
        })
    }
    if (TsUtils.isMobile) {
        records.append(frecords)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                grid.click(recid, event)
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('touchstart', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension + TouchEvent props
                const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                // emulate double click
                if (grid.last['mobile_touch'] && Date.now() - grid.last['mobile_touch'] < 350) {
                    event.preventDefault()
                    grid.dblClick(recid, event)
                }
                grid.last['mobile_touch'] = Date.now()
                setTimeout(() => grid.last['mobile_touch'] = null, 350)
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('contextmenu', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                const index = parseInt(query(event.delegate).attr('index')) // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                const td = query(event.target).closest('td')
                const column = td.attr('col') ? parseInt(td.attr('col')) : undefined
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ctxOpts: any = { index } // any: exactOptionalPropertyTypes — build opts conditionally
                if (recid != null) ctxOpts.recid = recid
                if (column != null) ctxOpts.column = column
                grid.showContextMenu(event, ctxOpts)
            })
    } else {
        records.add(frecords)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click', { delegate: 'tr' }, (event: any) => { // any: event.delegate is a Query extension
                const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                // do not generate click if empty record is clicked
                if (recid != '-none-' && !grid.last.inEditMode) {
                    grid.click(recid, event)
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('contextmenu', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                const index = parseInt(query(event.delegate).attr('index')) // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                const td = query(event.target).closest('td')
                const column = td.attr('col') ? parseInt(td.attr('col')) : undefined
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ctxOpts: any = { index } // any: exactOptionalPropertyTypes — build opts conditionally
                if (recid != null) ctxOpts.recid = recid
                if (column != null) ctxOpts.column = column
                grid.showContextMenu(event, ctxOpts)
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseover', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                grid.last['rec_out'] = false
                const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                if (index !== grid.last['rec_over']) {
                    grid.last['rec_over'] = index
                    // setTimeout is needed for correct event order enter/leave
                    setTimeout(() => {
                        delete grid.last['rec_out']
                        const edata = grid.trigger('mouseEnter', { target: grid.name, originalEvent: event, index, recid })
                        edata.finish()
                    })
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('mouseout', { delegate: 'tr' }, (event: any) => { // any: event.delegate Query extension
                const index = query(event.delegate).attr('index') // don't read recid directly as it could be a number or a string
                const recid = grid.records[index]?.recid
                grid.last['rec_out'] = true
                // setTimeouts are needed for correct event order enter/leave
                setTimeout(() => {
                    const recLeave = () => {
                        const edata = grid.trigger('mouseLeave', { target: grid.name, originalEvent: event, index, recid })
                        edata.finish()
                    }
                    if (index !== grid.last['rec_over']) {
                        recLeave()
                    }
                    setTimeout(() => {
                        if (grid.last['rec_out']) {
                            delete grid.last['rec_out']
                            delete grid.last['rec_over']
                            recLeave()
                        }
                    })
                })
            })
    }

    // enable scrolling on frozen records,
    gridBody
        .data('scroll', { lastDelta: 0, lastTime: 0 })
        .find('.tsg-grid-frecords')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('mousewheel DOMMouseScroll ', (event: any) => { // any: WheelEvent or MouseEvent, browser-specific
            event.preventDefault()
            // TODO: improve, scroll is not smooth, if scrolled to the end, it takes a while to return
            const scroll = gridBody.data('scroll')
            const container = gridBody.find('.tsg-grid-records')
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
        .on('scroll.body-global', { delegate: '.tsg-grid-records' }, (event: any) => { // any: event.delegate Query extension
            grid.scroll(event)
        })

    query(grid.box).find('.tsg-grid-body') // gridBody
        .off('.body-global')
        // header column click
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('click.body-global dblclick.body-global contextmenu.body-global', { delegate: 'td.tsg-head' }, (event: any) => { // any: event.delegate Query extension
            const col_ind = parseInt(query(event.delegate).attr('col'))
            const col = grid.columns[col_ind] ?? { field: String(col_ind) } // it could be line number
            switch (event.type) {
                case 'click':
                    grid.columnClick(col.field, event)
                    break
                case 'dblclick':
                    grid.columnDblClick(col.field, event)
                    break
                case 'contextmenu':
                    if (grid.show.columnMenu) {
                        grid.columnContextMenu(col.field, event)
                    } else {
                        grid.showContextMenu(event, { column: col_ind ?? undefined })
                    }
                    break

            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('mouseover.body-global', { delegate: '.tsg-col-header' }, (event: any) => { // any: event.delegate Query extension
            const col = query(event.delegate).parent().attr('col')
            grid.columnTooltipShow(col, event)
            query(event.delegate)
                .off('.tooltip')
                .on('mouseleave.tooltip', () => {
                    grid.columnTooltipHide(col, event)
                })
        })
        // select all
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('click.body-global', { delegate: 'input.tsg-select-all' }, (event: any) => { // any: event.delegate Query extension
            if (event.delegate.checked) { grid.selectAll() } else { grid.selectNone() }
            event.stopPropagation()
            clearTimeout(grid.last.kbd_timer ?? undefined) // keep grid in focus
        })
        // tree-like grid (or expandable column) expand/collapse
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('click.body-global', { delegate: '.tsg-show-children, .tsg-col-expand' }, (event: any) => { // any: event.delegate Query extension
            event.stopPropagation()
            const ind = query(event.target).parents('tr').attr('index')
            grid.toggle(grid.records[ind]!.recid)
        })
        // info bubbles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('click.body-global mouseover.body-global', { delegate: '.tsg-info' }, (event: any) => { // any: event.delegate Query extension
            const td = query(event.delegate).closest('td')
            const tr = td.parent()
            const col = grid.columns[td.attr('col')]
            const isSummary = tr.parents('.tsg-grid-body').hasClass('tsg-grid-summary')
            if (['mouseenter', 'mouseover'].includes(col?.['info']?.showOn?.toLowerCase()) && event.type == 'mouseover') {
                grid.showBubble(parseInt(tr.attr('index')), parseInt(td.attr('col')), isSummary)
                    .then(() => {
                        query(event.delegate)
                            .off('.tooltip')
                            .on('mouseleave.tooltip', () => { TsTooltip.hide(grid.name + '-bubble') })
                    })
            } else if (event.type == 'click') {
                TsTooltip.hide(grid.name + '-bubble')
                grid.showBubble(parseInt(tr.attr('index')), parseInt(td.attr('col')), isSummary)
            }
        })
        // clipborad copy icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('mouseover.body-global', { delegate: '.tsg-clipboard-copy' }, (event: any) => { // any: event.delegate Query extension
            if (event.delegate._tooltipShow) return
            const td = query(event.delegate).parent()
            const tr = td.parent()
            const col = grid.columns[td.attr('col')]
            const isSummary = tr.parents('.tsg-grid-body').hasClass('tsg-grid-summary')

            TsTooltip.show({
                name: grid.name + '-bubble',
                anchor: event.delegate,
                html: TsUtils.lang(typeof col?.clipboardCopy == 'string' ? col.clipboardCopy : 'Copy to clipboard'),
                position: 'top|bottom',
                offsetY: -2
            })
            query(event.delegate)
                .off('.tooltip')
                .on('mouseleave.tooltip', (_evt: Event) => {
                    TsTooltip.hide(grid.name + '-bubble')
                })
                .on('click.tooltip', (evt: Event) => {
                    evt.stopPropagation()
                    TsTooltip.update(grid.name + '-bubble', TsUtils.lang('Copied'))
                    grid.clipboardCopy(tr.attr('index'), td.attr('col'), isSummary)
                })
            event.delegate._tooltipShow = true
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('click.body-global', { delegate: '.tsg-editable-checkbox' }, (event: any) => { // any: event.delegate Query extension
            const dt = query(event.delegate).data()
            grid.editChange.call(grid, event.delegate, dt.changeind, dt.colind, event)
            grid.updateToolbar()
        })

    // show empty message
    if (grid.records.length === 0 && grid.msgEmpty) {
        query(grid.box).find(`#grid_${grid.name}_body`)
            .append(`<div id="grid_${grid.name}_empty_msg" class="tsg-grid-empty-msg"><div>${TsUtils.lang(grid.msgEmpty)}</div></div>`)
    } else if (query(grid.box).find(`#grid_${grid.name}_empty_msg`).length > 0) {
        query(grid.box).find(`#grid_${grid.name}_empty_msg`).remove()
    }
    // show summary records
    if (grid.summary.length > 0) {
        const sumHTML = grid.getSummaryHTML()
        query(grid.box).find(`#grid_${grid.name}_fsummary`).html(sumHTML?.[0] ?? '').show()
        query(grid.box).find(`#grid_${grid.name}_summary`).html(sumHTML?.[1] ?? '').show()
    } else {
        query(grid.box).find(`#grid_${grid.name}_fsummary`).hide()
        query(grid.box).find(`#grid_${grid.name}_summary`).hide()
    }
}

export function destroy(grid: TsGrid) {
    // event before
    const edata = grid.trigger('destroy', { target: grid.name })
    if (edata.isCancelled === true) return
    // clean up
    grid.toolbar?.destroy?.()
    if (query(grid.box).find(`#grid_${grid.name}_body`).length > 0) {
        grid.unmount()
    }
    delete TsUi[grid.name]
    // event after
    edata.finish()
}

export function initColumnOnOff(grid: TsGrid) {
    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = [
        { id: 'line-numbers', text: 'Line #', checked: grid.show.lineNumbers }
    ]
    // columns
    for (let c = 0; c < grid.columns.length; c++) {
        const col = grid.columns[c]!
        let text = col.text
        if (col.hideable === false) continue
        if (!text && col.tooltip) text = col.tooltip
        if (!text) text = '- column '+ (c + 1) +' -'
        items.push({ id: col.field, text: TsUtils.stripTags(text as string), checked: !col.hidden })
    }
    const url = grid.url?.get ?? grid.url
    if ((url && grid.show.skipRecords) || grid.show.saveRestoreState) {
        items.push({ text: '--' })
    }
    // skip records
    if (grid.show.skipRecords) {
        const skip = TsUtils.lang('Skip') +
            `<input id="${grid.name}_skip" type="text" class="tsg-input tsg-grid-skip" value="${grid.offset}">` +
            TsUtils.lang('records')
        items.push({ id: 'tsg-skip', text: skip, group: false, icon: 'tsg-icon-empty' })
    }
    // save/restore state
    if (grid.show.saveRestoreState) {
        items.push(
            { id: 'tsg-stateSave', text: TsUtils.lang('Save Grid State'), icon: 'tsg-icon-empty', group: false },
            { id: 'tsg-stateReset', text: TsUtils.lang('Restore Default State'), icon: 'tsg-icon-empty', group: false }
        )
    }
    // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selected: any[] = []
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.forEach((item: any) => {
        item.text = TsUtils.lang(item.text) // translate
        if (item.checked) selected.push(item.id)
    })
    grid.toolbar.set('tsg-column-on-off', { selected, items })
    return items
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initColumnDrag(grid: TsGrid, _box?: any) {
    // throw error if using column groups
    if (grid.columnGroups && grid.columnGroups.length) {
        throw 'Draggable columns are not currently supported with column groups.'
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    let dragData: {
        // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pressed: boolean; targetPos: any; columnHead: any; [key: string]: any
    } = {
        pressed: false,
        targetPos: null,
        columnHead: null
    }
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasInvalidClass = (target: any, lastColumn?: any) => {
        const iClass = ['tsg-col-number', 'tsg-col-expand', 'tsg-col-select']
        if (lastColumn !== true) iClass.push('tsg-head-last')
        for (let i = 0; i < iClass.length; i++) {
            if (query(target).closest('.tsg-head').hasClass(iClass[i])) {
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

        const preColHeadersSelector = '.tsg-head.tsg-col-number, .tsg-head.tsg-col-expand, .tsg-head.tsg-col-select'

        // do nothing if it is not a header
        if (!query(event.target).parents().hasClass('tsg-head') || hasInvalidClass(event.target)) return

        dragData.pressed = true
        dragData['initialX'] = event.pageX
        dragData['initialY'] = event.pageY
        dragData['numberPreColumnsPresent'] = query(self.box).find(preColHeadersSelector).length

        // start event for drag start
        const origColumn = dragData.columnHead = query(event.target).closest('.tsg-head')
        const origColumnNumber = dragData['originalPos'] = parseInt(origColumn.attr('col'), 10)
        const edata = self.trigger('columnDragStart', { originalEvent: event, origColumnNumber, target: origColumn[0] })
        if (edata.isCancelled === true) return false

        const columns = dragData['columns'] = query(self.box).find('.tsg-head:not(.tsg-head-last)')

        // add events
        query(document).on('mouseup.colDrag', dragColEnd)
        query(document).on('mousemove.colDrag', dragColOver)

        const col = self.columns[dragData['originalPos']]!
        const colText = TsUtils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
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
            .addClass('.tsg-grid-ghost')

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
            const ghosts = query(self.box).find('.tsg-grid-ghost')
            query(self.box).find('.tsg-intersection-marker').hide()
            query(dragData['ghost']).remove()
            ghosts.remove()
            query(document).off('.colDrag')
            // any: cast-to-any for return-position narrowing; TsGrid record/cell shape is user-defined at runtime
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
            columnConfig.splice(dragData.targetPos, 0, TsUtils.clone(selected))
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
        const newPos = td.hasClass('tsg-head-last') ? self.columns.length : parseInt(td.attr('col'))
        if (dragData.targetPos != newPos) {
            // if mouse over invalid column
            const rect1 = query(self.box).find('.tsg-grid-body').get(0).getBoundingClientRect()
            const rect2 = query(event.target).closest('td').get(0).getBoundingClientRect()
            query(self.box).find('.tsg-intersection-marker')
                .show()
                .css({
                    left: (rect2.left - rect1.left) + 'px',
                    height:rect2.height + 'px'
                })
            dragData.targetPos = newPos
        }
        return
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
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

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnOnOff(grid: TsGrid, event: MouseEvent | any, field: string) {
    // event before
    const edata = grid.trigger('columnOnOff', { target: grid.name, field: field, originalEvent: event })
    if (edata.isCancelled === true) return
    // collapse expanded rows
    const rows = grid.find({ 'TsUi.expanded': true }, true)
    for (let r = 0; r < rows.length; r++) {
        const tmp = grid.records[r]!.TsUi
        if (tmp && !Array.isArray(tmp.children)) {
            grid.records[r]!.TsUi!.expanded = false
        }
    }
    // show/hide
    if (field == 'line-numbers') {
        grid.show.lineNumbers = !grid.show.lineNumbers
        grid.refresh()
    } else {
        const col = grid.getColumn(field)
        if (col != null && col.hidden) {
            grid.showColumn(col.field)
        } else if (col != null) {
            grid.hideColumn(col.field)
        }
    }
    // event after
    edata.finish()
}

export function initToolbar(grid: TsGrid) {
    // if it is already initiazlied
    if (grid.toolbar.render != null) {
        return
    }
    let tb_items = grid.toolbar.items || []
    grid.toolbar.items = []
    grid.toolbar = new TsToolbar(TsUtils.extend({}, grid.toolbar, { name: grid.name +'_toolbar', owner: grid }))
    if (grid.show.toolbarReload) {
        grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['reload']))
    }
    if (grid.show.toolbarColumns) {
        grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['columns']))
    }
    if (grid.show.toolbarSearch) {
        const html =`
            <div class="tsg-grid-search-input">
                ${grid.buttons['search'].html}
                <div id="grid_${grid.name}_search_name" class="tsg-grid-search-name">
                    <span class="name-icon tsg-icon-search"></span>
                    <span class="name-text"></span>
                    <span class="name-cross tsg-action" data-click="searchReset">x</span>
                </div>
                <input type="text" id="grid_${grid.name}_search_all" class="tsg-search-all" tabindex="-1"
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                    placeholder="${TsUtils.lang(grid.last.label, true)}" value="${grid.last.search}"
                    data-focus="searchSuggest" data-click="stop"
                >
                <div class="tsg-search-drop tsg-action" data-click="searchOpen"
                        style="${grid.multiSearch ? '' : 'display: none'}">
                    <span class="tsg-icon-drop"></span>
                </div>
            </div>`
        grid.toolbar.items.push({
            id: 'tsg-search',
            type: 'html',
            html,
            // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRefresh: async (event: any) => {
                await event.complete
                const input = query(grid.box).find(`#grid_${grid.name}_search_all`)
                TsUtils.bindEvents(query(grid.box).find(`#grid_${grid.name}_search_all, .tsg-action`), grid)
                // slow down live search calls
                // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const slowSearch = TsUtils.debounce((event: any) => {
                    const val = event.target.value
                    if (grid.liveSearch && grid.last['liveText'] != val) {
                        grid.last['liveText'] = val
                        grid.search(grid.last.field, val)
                    }
                }, 250)
                input
                    .on('blur', () => { grid.last['liveText'] = '' })
                    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .on('keyup', (event: any) => {
                        switch (event.keyCode) {
                            case 40: {
                                // show saved searches on arrow down
                                grid.searchSuggest(true)
                                break
                            }
                            case 38: {
                                // hide saved searches on arrow up
                                grid.searchSuggest(true, true)
                                break
                            }
                            case 13: {
                                // search on enter key
                                TsMenu.hide(grid.name + '-search-suggest')
                                grid.search(grid.last.field, event.target.value)
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
        if (grid.show.toolbarAdd && !ids.includes(grid.buttons['add'].id)) {
            grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['add']))
        }
        if (grid.show.toolbarEdit && !ids.includes(grid.buttons['edit'].id)) {
            grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['edit']))
        }
        if (grid.show.toolbarDelete && !ids.includes(grid.buttons['delete'].id)) {
            grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['delete']))
        }
        if (grid.show.toolbarSave && !ids.includes(grid.buttons['save'].id)) {
            if (grid.show.toolbarAdd || grid.show.toolbarDelete || grid.show.toolbarEdit) {
                grid.toolbar.items.push({ type: 'break', id: 'tsg-break2' })
            }
            grid.toolbar.items.push(TsUtils.extend({}, grid.buttons['save']))
        }
        tb_items = tb_items.map(item => grid.buttons[item.name]
                                        ? TsUtils.extend({}, grid.buttons[item.name], item) : item)
    }
    // add original buttons
    grid.toolbar.items.push(...tb_items)

    // =============================================
    // ------ Toolbar onClick processing

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.toolbar.on('click', (event: any) => {
        const edata = grid.trigger('toolbar', { target: event.target, originalEvent: event })
        if (edata.isCancelled === true) return
        let edata2
        switch (event.detail.item.id) {
            case 'tsg-reload':
                edata2 = grid.trigger('reload', { target: grid.name })
                if (edata2.isCancelled === true) return false
                grid.reload()
                edata2.finish()
                break
            case 'tsg-column-on-off':
                if (event.detail.subItem) {
                    const id = event.detail.subItem.id
                    if (['tsg-stateSave', 'tsg-stateReset'].includes(id)) {
                        grid[id.substring(5)]()
                    } else if (id == 'tsg-skip') {
                        // empty
                    } else {
                        grid.columnOnOff(event, event.detail.subItem.id)
                    }
                } else {
                    grid.initColumnOnOff()
                    setTimeout(() => {
                        query(`#w2overlay-${grid.name}_toolbar-drop .tsg-grid-skip`)
                            .off('.tsg-grid')
                            // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .on('click.tsg-grid', (evt: any) => {
                                evt.stopPropagation()
                            })
                            // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .on('keypress', (evt: any) => {
                                if (evt.keyCode == 13) {
                                    grid.skip(evt.target.value)
                                    grid.toolbar.click('tsg-column-on-off') // close menu
                                }
                            })
                    }, 100)
                }
                break
            case 'tsg-add':
                edata2 = grid.trigger('add', { target: grid.name, recid: null })
                if (edata2.isCancelled === true) return false
                edata2.finish()
                break
            case 'tsg-edit': {
                const sel   = grid.getSelection()
                let recid = null
                if (sel.length == 1) recid = sel[0]
                edata2 = grid.trigger('edit', { target: grid.name, recid: recid })
                if (edata2.isCancelled === true) return false
                edata2.finish()
                break
            }
            case 'tsg-delete':
                grid.delete()
                break
            case 'tsg-save':
                grid.save()
                break
        }
        // no default action
        edata.finish()
    })
    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.toolbar.on('refresh', (event: any) => {
        if (event.target == 'tsg-search') {
            const sd = grid.searchData
            setTimeout(() => {
                grid.searchInitInput(grid.last.field, (sd.length == 1 ? sd[0]!.value : null))
            }, 1)
        }
    })
}

export function initResize(grid: TsGrid) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    query(grid.box).find('.tsg-resizer')
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
            // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let timer: any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mouseMove = function(event: any) { // any: MouseEvent at runtime, passed as EventListener
                if (obj.last.colResizing != true) return
                if (!event) event = window.event
                const edata2 = obj.trigger('columnResizeMove', TsUtils.extend(edata.detail, { resizeBy: (event.screenX - obj.last.tmp.gx), originalEvent: event }))
                if (edata2.isCancelled === true) { return }
                obj.last.tmp.x = (event.screenX - obj.last.tmp.x)
                obj.last.tmp.y = (event.screenY - obj.last.tmp.y)
                const newWidth   = (parseInt(String(obj.columns[obj.last.tmp.col]!.size ?? 0)) + obj.last.tmp.x) + 'px'
                obj.columns[obj.last.tmp.col]!.size = newWidth
                if (timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    obj.resizeRecords()
                    obj.scroll()
                }, 100)
                obj.last.tmp.tds.css({ width: newWidth })
                obj.last.tmp.x = event.screenX
                obj.last.tmp.y = event.screenY
                edata2.finish()
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mouseUp = function(event: any) { // any: MouseEvent at runtime, passed as EventListener
                query(document).off('.grid-col-resize')
                obj.resizeRecords()
                obj.scroll()
                edata.finish({ originalEvent: event })
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
            event.stopPropagation()
            event.preventDefault()
        })
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .each((el: any) => {
            const td = query(el).get(0).parentNode
            query(el).css({
                'height'      : td.clientHeight + 'px',
                'margin-left' : (td.clientWidth - 3) + 'px'
            })
        })
}

export function resizeBoxes(grid: TsGrid) {
    // elements
    const header   = query(grid.box).find(`#grid_${grid.name}_header`)
    const toolbar  = query(grid.box).find(`#grid_${grid.name}_toolbar`)
    const fsummary = query(grid.box).find(`#grid_${grid.name}_fsummary`)
    const summary  = query(grid.box).find(`#grid_${grid.name}_summary`)
    const footer   = query(grid.box).find(`#grid_${grid.name}_footer`)
    const body     = query(grid.box).find(`#grid_${grid.name}_body`)

    if (grid.show.header) {
        header.css({ top: '0px', left: '0px', right: '0px' })
    }
    if (grid.show.toolbar) {
        toolbar.css({
            top:   (0 + (grid.show.header ? TsUtils.getSize(header, 'height') : 0)) + 'px',
            left:  '0px',
            right: '0px'
        })
    }
    if (grid.summary.length > 0) {
        fsummary.css({
            bottom: (0 + (grid.show.footer ? TsUtils.getSize(footer, 'height') : 0)) + 'px'
        })
        summary.css({
            bottom: (0 + (grid.show.footer ? TsUtils.getSize(footer, 'height') : 0)) + 'px',
            right: '0px'
        })
    }
    if (grid.show.footer) {
        footer.css({ bottom: '0px', left: '0px', right: '0px' })
    }
    body.css({
        top: (0 + (grid.show.header ? TsUtils.getSize(header, 'height') : 0) + (grid.show.toolbar ? TsUtils.getSize(toolbar, 'height') : 0)) + 'px',
        bottom: (0 + (grid.show.footer ? TsUtils.getSize(footer, 'height') : 0) + (grid.summary.length > 0 ? TsUtils.getSize(summary, 'height') : 0)) + 'px',
        left:   '0px',
        right:  '0px'
    })
}

export function resizeRecords(grid: TsGrid) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    // remove empty records
    query(grid.box).find('.tsg-empty-record').remove()
    const box             = query(grid.box)
    const gridEl          = query(grid.box).find(':scope > div.tsg-grid-box')
    const header          = query(grid.box).find(`#grid_${grid.name}_header`)
    const toolbar         = query(grid.box).find(`#grid_${grid.name}_toolbar`)
    const summary         = query(grid.box).find(`#grid_${grid.name}_summary`)
    const fsummary        = query(grid.box).find(`#grid_${grid.name}_fsummary`)
    const footer          = query(grid.box).find(`#grid_${grid.name}_footer`)
    const body            = query(grid.box).find(`#grid_${grid.name}_body`)
    const columns         = query(grid.box).find(`#grid_${grid.name}_columns`)
    const fcolumns        = query(grid.box).find(`#grid_${grid.name}_fcolumns`)
    const records         = query(grid.box).find(`#grid_${grid.name}_records`)
    const frecords        = query(grid.box).find(`#grid_${grid.name}_frecords`)
    const scroll1         = query(grid.box).find(`#grid_${grid.name}_scroll1`)
    let lineNumberWidth = String(grid.total).length * 8 + 10
    if (lineNumberWidth < 34) lineNumberWidth = 34 // 3 digit width
    if (grid.lineNumberWidth != null) lineNumberWidth = grid.lineNumberWidth

    let bodyOverflowX = false
    let bodyOverflowY = false
    let sWidth = 0
    for (let i = 0; i < grid.columns.length; i++) {
        if (grid.columns[i]!.frozen || grid.columns[i]!.hidden) continue
        const cSize = parseInt(grid.columns[i]!.sizeCalculated ? grid.columns[i]!.sizeCalculated! : String(grid.columns[i]!.size ?? 0))
        sWidth += cSize
    }
    if (records[0]?.clientWidth < sWidth) bodyOverflowX = true
    if (body[0]?.clientHeight - (columns[0]?.clientHeight ?? 0)
            < (query(records).find(':scope > table')[0]?.clientHeight ?? 0) + (bodyOverflowX ? TsUtils.scrollBarSize() : 0)) {
        bodyOverflowY = true
    }

    if (!grid.fixedBody) {
        const bodyHeight = (TsUtils.getSize(columns, 'height') as number)
            + (TsUtils.getSize(query(grid.box).find('#grid_'+ grid.name +'_records table'), 'height') as number)
            + (bodyOverflowX ? (TsUtils.scrollBarSize() as number) : 0)
        const calculatedHeight = bodyHeight
            + (grid.show.header ? TsUtils.getSize(header, 'height') : 0)
            + (grid.show.toolbar ? TsUtils.getSize(toolbar, 'height') : 0)
            + (summary.css('display') != 'none' ? TsUtils.getSize(summary, 'height') : 0)
            + (grid.show.footer ? TsUtils.getSize(footer, 'height') : 0)
        gridEl.css('height', calculatedHeight + 'px')
        body.css('height', bodyHeight + 'px')
        box.css('height', TsUtils.getSize(gridEl, 'height') + 'px')
    } else {
        const calculatedHeight = gridEl[0]?.clientHeight
            - (grid.show.header ? TsUtils.getSize(header, 'height') : 0)
            - (grid.show.toolbar ? TsUtils.getSize(toolbar, 'height') : 0)
            - (summary.css('display') != 'none' ? TsUtils.getSize(summary, 'height') : 0)
            - (grid.show.footer ? TsUtils.getSize(footer, 'height') : 0)
        body.css('height', calculatedHeight + 'px')
    }

    let buffered = grid.records.length
    const url = grid.url?.get ?? grid.url
    if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length
    if (!grid.fixedBody) { bodyOverflowY = false }
    if (bodyOverflowX || bodyOverflowY) {
        columns.find(':scope > table > tbody > tr:nth-child(1) td.tsg-head-last')
            .css('width', TsUtils.scrollBarSize() + 'px')
            .show()
        records.css({
            top: ((grid.columnGroups.length > 0 && grid.show.columns ? 1 : 0) + (TsUtils.getSize(columns, 'height') as number)) +'px',
            '-webkit-overflow-scrolling': 'touch',
            'overflow-x': (bodyOverflowX ? 'auto' : 'hidden'),
            'overflow-y': (bodyOverflowY ? 'auto' : 'hidden')
        })
    } else {
        columns.find(':scope > table > tbody > tr:nth-child(1) td.tsg-head-last').hide()
        records.css({
            top: ((grid.columnGroups.length > 0 && grid.show.columns ? 1 : 0) + (TsUtils.getSize(columns, 'height') as number)) +'px',
            overflow: 'hidden'
        })
        if (records.length > 0) { grid.last.vscroll.scrollTop = 0; grid.last.vscroll.scrollLeft = 0 }
    }
    if (bodyOverflowX) {
        frecords.css('margin-bottom', TsUtils.scrollBarSize() + 'px')
        scroll1.show()
    } else {
        frecords.css('margin-bottom', 0)
        scroll1.hide()
    }
    frecords.css({ overflow: 'hidden', top: records.css('top') })
    if (grid.show.emptyRecords && !bodyOverflowY) {
        let max = Math.floor((records[0]?.clientHeight ?? 0) / grid.recordHeight) - 1
        let leftover = 0
        if (records[0]) leftover = records[0].scrollHeight - max * grid.recordHeight
        if (leftover >= grid.recordHeight) {
            leftover -= grid.recordHeight
            max++
        }
        if (grid.fixedBody) {
            for (let di = buffered; di < max; di++) {
                addEmptyRow(di, grid.recordHeight, grid)
            }
            addEmptyRow(max, leftover, grid)
        }
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function addEmptyRow(row: any, height: any, grid: any) {
        let html1 = ''
        let html2 = ''
        let htmlp = ''
        html1    += '<tr class="'+ (row % 2 ? 'tsg-even' : 'tsg-odd') + ' tsg-empty-record" recid="-none-" style="height: '+ height +'px">'
        html2    += '<tr class="'+ (row % 2 ? 'tsg-even' : 'tsg-odd') + ' tsg-empty-record" recid="-none-" style="height: '+ height +'px">'
        if (grid.show.lineNumbers) html1 += '<td class="tsg-col-number"></td>'
        if (grid.show.selectColumn) html1 += '<td class="tsg-grid-data tsg-col-select"></td>'
        if (grid.show.expandColumn) html1 += '<td class="tsg-grid-data tsg-col-expand"></td>'
        html2 += '<td class="tsg-grid-data-spacer" col="start" style="border-right: 0"></td>'
        if (grid.reorderRows) html2 += '<td class="tsg-grid-data tsg-col-order" col="order"></td>'
        for (let j = 0; j < grid.columns.length; j++) {
            const col = grid.columns[j]
            if ((col.hidden || j < grid.last.vscroll.colIndStart || j > grid.last.vscroll.colIndEnd) && !col.frozen) continue
            htmlp = '<td class="tsg-grid-data" '+ (col.attr != null ? col.attr : '') +' col="'+ j +'"></td>'
            if (col.frozen) html1 += htmlp; else html2 += htmlp
        }
        html1 += '<td class="tsg-grid-data-last"></td> </tr>'
        html2 += '<td class="tsg-grid-data-last" col="end"></td> </tr>'
        query(grid.box).find('#grid_'+ grid.name +'_frecords > table').append(html1)
        query(grid.box).find('#grid_'+ grid.name +'_records > table').append(html2)
    }
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let width_box: any, percent: any
    if (body.length > 0) {
        let width_max = parseInt(body[0].clientWidth)
            - (bodyOverflowY ? (TsUtils.scrollBarSize() as number) : 0)
            - (grid.show.lineNumbers ? lineNumberWidth : 0)
            - (grid.reorderRows ? 26 : 0)
            - (grid.show.selectColumn ? 26 : 0)
            - (grid.show.expandColumn ? 26 : 0)
            - 1
        width_box = width_max
        percent   = 0
        let restart = false
        for (let i = 0; i < grid.columns.length; i++) {
            const col = grid.columns[i]!
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
            grid.refresh()
            return
        }
        for (let i = 0; i < grid.columns.length; i++) {
            const col = grid.columns[i]!
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
        if (percent != 100 && percent > 0) {
            for (let i = 0; i < grid.columns.length; i++) {
                const col = grid.columns[i]!
                if (col.hidden) continue
                if (col.sizeType == '%') {
                    col['sizeCorrected'] = Math.round(parseFloat(String(col.size ?? 0)) * 100 * 100 / percent) / 100 + '%'
                }
            }
        }
        for (let i = 0; i < grid.columns.length; i++) {
            const col = grid.columns[i]!
            if (col.hidden) continue
            if (col.sizeType == '%') {
                if (col['sizeCorrected'] != null) {
                    col.sizeCalculated = Math.floor(width_max * parseFloat(String(col['sizeCorrected'])) / 100) - 1 + 'px'
                } else {
                    col.sizeCalculated = Math.floor(width_max * parseFloat(String(col.size ?? 0)) / 100) - 1 + 'px'
                }
            }
        }
    }
    let width_cols = 0
    for (let i = 0; i < grid.columns.length; i++) {
        const col = grid.columns[i]!
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
            const col = grid.columns[i]!
            if (col == null) { i = 0; continue }
            if (col.hidden || col.sizeType == 'px') { i++; continue }
            col.sizeCalculated = (parseInt(col.sizeCalculated ?? '0') + 1) + 'px'
            width_diff--
            if (width_diff === 0) break
            i++
        }
    } else if (width_diff > 0) {
        columns.find(':scope > table > tbody > tr:nth-child(1) td.tsg-head-last')
            .css('width', TsUtils.scrollBarSize() + 'px')
            .show()
    }

    let fwidth = 1
    if (grid.show.lineNumbers) fwidth += lineNumberWidth
    if (grid.show.selectColumn) fwidth += 26
    if (grid.show.expandColumn) fwidth += 26
    for (let i = 0; i < grid.columns.length; i++) {
        if (grid.columns[i]!.hidden) continue
        if (grid.columns[i]!.frozen) fwidth += parseInt(grid.columns[i]!.sizeCalculated ?? '0')
    }
    fcolumns.css('width', fwidth + 'px')
    frecords.css('width', fwidth + 'px')
    fsummary.css('width', fwidth + 'px')
    scroll1.css('width', fwidth + 'px')
    columns.css({ left: fwidth + 'px', 'padding-left': '0.5px' })
    records.css({ left: fwidth + 'px' })
    summary.css({ left: fwidth + 'px' })

    // resize columns
    columns.find(':scope > table > tbody > tr:nth-child(1) td')
        .add(fcolumns.find(':scope > table > tbody > tr:nth-child(1) td'))
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .each((el: any) => {
            if (query(el).hasClass('tsg-col-number')) {
                query(el).css('width', lineNumberWidth + 'px')
            }
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
            if (query(el).hasClass('tsg-head-last')) {
                if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
                    let width = 0
                    for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
                        if (!obj.columns[i] || obj.columns[i]!.frozen || obj.columns[i]!.hidden) continue
                        width += parseInt(obj.columns[i]!.sizeCalculated ?? '0')
                    }
                    query(el).css('width', width + 'px')
                } else {
                    query(el).css('width', (TsUtils.scrollBarSize() as number) + (width_diff > 0 && percent === 0 ? width_diff : 0) + 'px')
                }
            }
        })
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
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .each((el: any) => {
            if (query(el).hasClass('tsg-col-number')) {
                query(el).css('width', lineNumberWidth + 'px')
            }
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
            if (query(el).hasClass('tsg-grid-data-last') && query(el).parents('.tsg-grid-frecords').length === 0) {
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
        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .each((el: any) => {
            if (query(el).hasClass('tsg-col-number')) {
                query(el).css('width', lineNumberWidth + 'px')
            }
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
            if (query(el).hasClass('tsg-grid-data-last') && query(el).parents('.tsg-grid-frecords').length === 0) {
                query(el).css('width', (TsUtils.scrollBarSize() as number) + (width_diff > 0 && percent === 0 ? width_diff : 0) + 'px')
            }
        })
    grid.initResize()
    grid.refreshRanges()
    if ((grid.last.vscroll.scrollTop || grid.last.vscroll.scrollLeft) && records.length > 0) {
        columns.prop('scrollLeft', grid.last.vscroll.scrollLeft)
        records.prop('scrollTop', grid.last.vscroll.scrollTop)
        records.prop('scrollLeft', grid.last.vscroll.scrollLeft)
    }
    columns.css('will-change', 'scroll-position')
}

export function getColumnsHTML(grid: TsGrid) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    let html1 = ''
    let html2 = ''
    if (grid.show.columnHeaders) {
        if (grid.columnGroups.length > 0) {
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
            html1 += '<td class="tsg-head tsg-col-number" col="line-number">' +
                     '    <div>&#160;</div>' +
                     '</td>'
        }
        if (self.show.selectColumn) {
            html1 += '<td class="tsg-head tsg-col-select" col="select">' +
                     '    <div style="height: 25px">&#160;</div>' +
                     '</td>'
        }
        if (self.show.expandColumn) {
            html1 += '<td class="tsg-head tsg-col-expand" col="expand">' +
                     '    <div style="height: 25px">&#160;</div>' +
                     '</td>'
        }
        let ii = 0
        html2 += `<td id="grid_${self.name}_column_start" class="tsg-head" col="start" style="border-right: 0"></td>`
        if (self.reorderRows) {
            html2 += '<td class="tsg-head tsg-col-order" col="order">' +
                     '    <div style="height: 25px">&#160;</div>' +
                     '</td>'
        }
        for (let i = 0; i < self.columnGroups.length; i++) {
            const colg = self.columnGroups[i]
            const col: TsGridColumn = self.columns[ii] ?? {} as TsGridColumn
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
                        if ((self.sortData[si]!.direction || '').toLowerCase() === 'asc') sortStyle = 'tsg-sort-up'
                        if ((self.sortData[si]!.direction || '').toLowerCase() === 'desc') sortStyle = 'tsg-sort-down'
                    }
                }
                let resizer = ''
                if (col.resizable !== false) {
                    resizer = `<div class="tsg-resizer" name="${ii}"></div>`
                }
                const text = TsUtils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
                tmpf = `<td id="grid_${self.name}_column_${ii}" class="tsg-head ${sortStyle}" col="${ii}" `+
                       `    rowspan="2" colspan="${colspan}">`+ resizer +
                       `    <div class="tsg-col-group tsg-col-header ${sortStyle ? 'tsg-col-sorted' : ''}">` +
                       `        <div class="${sortStyle}"></div>` + (!text ? '&#160;' : text) +
                       '    </div>'+
                       '</td>'
                if (col && col.frozen) html1 += tmpf; else html2 += tmpf
            } else {
                const gText = TsUtils.lang(typeof colg.text == 'function' ? colg.text(colg) : colg.text)
                tmpf = `<td id="grid_${self.name}_column_${ii}" class="tsg-head" col="${ii}" colspan="${colspan}">` +
                       `    <div class="tsg-col-group" style="${colg.style ?? ''}">${!gText ? '&#160;' : gText}</div>` +
                       '</td>'
                if (col && col.frozen) html1 += tmpf; else html2 += tmpf
            }
            ii += colg.span
        }
        html1 += '<td></td></tr>' // need empty column for border-right
        html2 += `<td id="grid_${self.name}_column_end" class="tsg-head" col="end"></td></tr>`
        return [html1, html2]
    }

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getColumns(main: any) {
        let html1 = '<tr>'
        let html2 = '<tr>'
        if (self.show.lineNumbers) {
            html1 += '<td class="tsg-head tsg-col-number" col="line-number">' +
                    '    <div>#</div>' +
                    '</td>'
        }
        if (self.show.selectColumn) {
            html1 += '<td class="tsg-head tsg-col-select" col="select">' +
                    '    <div>' +
                    `        <input type="checkbox" id="grid_${self.name}_check_all" class="tsg-select-all" tabindex="-1"` +
                    `            style="${self.multiSelect == false ? 'display: none;' : ''}"` +
                    '        >' +
                    '    </div>' +
                    '</td>'
        }
        if (self.show.expandColumn) {
            html1 += '<td class="tsg-head tsg-col-expand" col="expand">' +
                    '    <div>&#160;</div>' +
                    '</td>'
        }
        let ii = 0
        let id = 0
        let colg
        html2 += `<td id="grid_${self.name}_column_start" class="tsg-head" col="start" style="border-right: 0"></td>`
        if (self.reorderRows) {
            html2 += '<td class="tsg-head tsg-col-order" col="order">'+
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
        html1 += '<td class="tsg-head tsg-head-last"><div>&#160;</div></td>'
        html2 += '<td class="tsg-head tsg-head-last" col="end"><div>&#160;</div></td>'
        html1 += '</tr>'
        html2 += '</tr>'
        return [html1, html2]
    }
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getColumnCellHTML(grid: TsGrid, i: any) {
    const col = grid.columns[i]!
    if (col == null) return ''
    // reorder style
    const reorderCols = (grid.reorderColumns && (!grid.columnGroups || !grid.columnGroups.length)) ? ' tsg-col-reorderable ' : ''
    // sort style
    let sortStyle = ''
    for (let si = 0; si < grid.sortData.length; si++) {
        if (grid.sortData[si]!.field == col.field) {
            if ((grid.sortData[si]!.direction || '').toLowerCase() === 'asc') sortStyle = 'tsg-sort-up'
            if ((grid.sortData[si]!.direction || '').toLowerCase() === 'desc') sortStyle = 'tsg-sort-down'
        }
    }
    // col selected
    const tmp      = grid.last.selection.columns
    let selected = false
    for (const t in tmp) {
        for (let si = 0; si < tmp[t]!.length; si++) {
            if (tmp[t]![si] == i) selected = true
        }
    }
    const text = TsUtils.lang(typeof col.text == 'function' ? col.text(col) : col.text)
    const html = '<td id="grid_'+ grid.name + '_column_' + i +'" col="'+ i +'" class="tsg-head '+ sortStyle + reorderCols + '">' +
                     (col.resizable !== false ? '<div class="tsg-resizer" name="'+ i +'"></div>' : '') +
                '    <div class="tsg-col-header '+ (sortStyle ? 'tsg-col-sorted' : '') +' '+ (selected ? 'tsg-col-selected' : '') +'">'+
                '        <div class="'+ sortStyle +'"></div>'+
                        (!text ? '&#160;' : text) +
                '    </div>'+
                '</td>'

    return html
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnTooltipShow(grid: TsGrid, ind: any, _event: any) {
    const $el  = query(grid.box).find('#grid_'+ grid.name + '_column_'+ ind)
    const item = grid.columns[ind]
    const pos  = grid.columnTooltip
    TsTooltip.show({
        name: grid.name + '-column-tooltip',
        anchor: $el.get(0),
        html: item?.tooltip,
        position: pos,
    })
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function columnTooltipHide(grid: TsGrid, _ind: any, _event: any) {
    TsTooltip.hide(grid.name + '-column-tooltip')
}

export function getRecordsHTML(grid: TsGrid) {
    let buffered = grid.records.length
    const url      = grid.url?.get ?? grid.url
    if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length
    // larger number works better with chrome, smaller with FF.
    if (buffered > grid.vs_start) grid.last.vscroll.show_extra = grid.vs_extra; else grid.last.vscroll.show_extra = grid.vs_start
    const records = query(grid.box).find(`#grid_${grid.name}_records`)
    let limit   = Math.floor((records.get(0)?.clientHeight || 0) / grid.recordHeight) + grid.last.vscroll.show_extra + 1
    if (limit < grid.vs_start) {
        limit = grid.vs_start
    }
    if (!grid.fixedBody || limit > buffered) limit = buffered
    // always need first record for resizing purposes
    let rec_html = grid.getRecordHTML(-1, 0)
    let html1    = '<table><tbody>' + rec_html[0]
    let html2    = '<table><tbody>' + rec_html[1]
    // first empty row with height
    html1 += '<tr id="grid_'+ grid.name + '_frec_top" line="top" style="height: '+ 0 +'px">'+
             '    <td colspan="2000"></td>'+
             '</tr>'
    html2 += '<tr id="grid_'+ grid.name + '_rec_top" line="top" style="height: '+ 0 +'px">'+
             '    <td colspan="2000"></td>'+
             '</tr>'
    for (let i = 0; i < limit; i++) {
        rec_html = grid.getRecordHTML(i, i+1)
        html1   += rec_html[0]
        html2   += rec_html[1]
    }
    const h2 = (buffered - limit) * grid.recordHeight
    html1 += '<tr id="grid_' + grid.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">' +
            '    <td colspan="2000" style="border: 0"></td>'+
            '</tr>'+
            '<tr id="grid_'+ grid.name +'_frec_more" style="display: none; ">'+
            '    <td colspan="2000" class="tsg-load-more"></td>'+
            '</tr>'+
            '</tbody></table>'
    html2 += '<tr id="grid_' + grid.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">' +
            '    <td colspan="2000" style="border: 0"></td>'+
            '</tr>'+
            '<tr id="grid_'+ grid.name +'_rec_more" style="display: none">'+
            '    <td colspan="2000" class="tsg-load-more"></td>'+
            '</tr>'+
            '</tbody></table>'
    grid.last.vscroll.recIndStart = 0
    grid.last.vscroll.recIndEnd   = limit
    return [html1, html2]
}

export function getSummaryHTML(grid: TsGrid) {
    if (grid.summary.length === 0) return
    let rec_html = grid.getRecordHTML(-1, 0) // need this in summary too for colspan to work properly
    let html1    = '<table><tbody>' + rec_html[0]
    let html2    = '<table><tbody>' + rec_html[1]
    for (let i = 0; i < grid.summary.length; i++) {
        rec_html = grid.getRecordHTML(i, i+1, true)
        html1   += rec_html[0]
        html2   += rec_html[1]
    }
    html1 += '</tbody></table>'
    html2 += '</tbody></table>'
    return [html1, html2]
}

export function getRecordHTML(grid: TsGrid, ind: number, lineNum: number, summary?: boolean) {
    let tmph      = ''
    let rec_html1 = ''
    let rec_html2 = ''
    const sel       = grid.last.selection
    let record
    // first record needs for resize purposes
    if (ind == -1) {
        rec_html1 += '<tr line="0">'
        rec_html2 += '<tr line="0">'
        if (grid.show.lineNumbers) rec_html1 += '<td class="tsg-col-number" style="height: 0px"></td>'
        if (grid.show.selectColumn) rec_html1 += '<td class="tsg-col-select" style="height: 0px"></td>'
        if (grid.show.expandColumn) rec_html1 += '<td class="tsg-col-expand" style="height: 0px"></td>'
        rec_html2 += '<td class="tsg-grid-data tsg-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>'
        if (grid.reorderRows) rec_html2 += '<td class="tsg-col-order" style="height: 0px"></td>'
        for (let i = 0; i < grid.columns.length; i++) {
            const col = grid.columns[i]!
            tmph    = '<td class="tsg-grid-data" col="'+ i +'" style="height: 0px;"></td>'
            if (col.frozen && !col.hidden) {
                rec_html1 += tmph
            } else {
                if (col.hidden || i < grid.last.vscroll.colIndStart || i > grid.last.vscroll.colIndEnd) continue
                rec_html2 += tmph
            }
        }
        rec_html1 += '<td class="tsg-grid-data-last" style="height: 0px"></td>'
        rec_html2 += '<td class="tsg-grid-data-last" col="end" style="height: 0px"></td>'
        rec_html1 += '</tr>'
        rec_html2 += '</tr>'
        return [rec_html1, rec_html2]
    }
    // regular record
    const url = grid.url?.get ?? grid.url
    if (summary !== true) {
        if (grid.searchData.length > 0 && !url) {
            if (ind >= grid.last.searchIds.length) return ''
            ind    = grid.last.searchIds[ind] ?? ind
            record = grid.records[ind]
        } else {
            if (ind >= grid.records.length) return ''
            record = grid.records[ind]
        }
    } else {
        if (ind >= grid.summary.length) return ''
        record = grid.summary[ind]
    }
    if (!record) return ''
    if (record.recid == null && grid.recid != null) {
        const rid = grid.parseField(record, grid.recid)
        if (rid != null) record.recid = rid
    }
    let isRowSelected = false
    if (sel.indexes.indexOf(ind) != -1) isRowSelected = true
    let rec_style = (record.TsUi ? record.TsUi['style'] : '')
    if (rec_style == null || typeof rec_style != 'string') rec_style = ''
    let rec_class = (record.TsUi ? record.TsUi['class'] : '')
    if (rec_class == null || typeof rec_class != 'string') rec_class = ''
    // render TR
    rec_html1 += '<tr id="grid_'+ grid.name +'_frec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ lineNum +'" index="'+ ind +'" '+
        ' class="'+ (lineNum % 2 === 0 ? 'tsg-even' : 'tsg-odd') + ' tsg-record ' + rec_class +
            (isRowSelected && grid.selectType == 'row' ? ' tsg-selected' : '') +
            (record.TsUi && record.TsUi['editable'] === false ? ' tsg-no-edit' : '') +
            (record.TsUi && record.TsUi.expanded === true ? ' tsg-expanded' : '') + '" ' +
        ' style="height: '+ grid.recordHeight +'px; '+ (!isRowSelected && rec_style != '' ? rec_style : rec_style.replace('background-color', 'none')) +'" '+
            (rec_style != '' ? 'custom_style="'+ rec_style +'"' : '') +
        '>'
    rec_html2 += '<tr id="grid_'+ grid.name +'_rec_'+ record.recid +'" recid="'+ record.recid +'" line="'+ lineNum +'" index="'+ ind +'" '+
        ' class="'+ (lineNum % 2 === 0 ? 'tsg-even' : 'tsg-odd') + ' tsg-record ' + rec_class +
            (isRowSelected && grid.selectType == 'row' ? ' tsg-selected' : '') +
            (record.TsUi && record.TsUi['editable'] === false ? ' tsg-no-edit' : '') +
            (record.TsUi && record.TsUi.expanded === true ? ' tsg-expanded' : '') + '" ' +
        ' style="height: '+ grid.recordHeight +'px; '+ (!isRowSelected && rec_style != '' ? rec_style : rec_style.replace('background-color', 'none')) +'" '+
            (rec_style != '' ? 'custom_style="'+ rec_style +'"' : '') +
        '>'
    if (grid.show.lineNumbers) {
        rec_html1 += '<td id="grid_'+ grid.name +'_cell_'+ ind +'_number' + (summary ? '_s' : '') + '" '+
                    '   class="tsg-col-number '+ (isRowSelected ? ' tsg-row-selected' : '') +'"'+
                        (grid.reorderRows ? ' style="cursor: move"' : '') + '>'+
                        (summary !== true ? grid.getLineHTML(lineNum) : '') +
                    '</td>'
    }
    if (grid.show.selectColumn) {
        rec_html1 +=
                '<td id="grid_'+ grid.name +'_cell_'+ ind +'_select' + (summary ? '_s' : '') + '" class="tsg-grid-data tsg-col-select">'+
                    (summary !== true && !(record.TsUi && record.TsUi['hideCheckBox'] === true) ?
                    '    <div>'+
                    '        <input class="tsg-grid-select-check" type="checkbox" tabindex="-1" '+
                                (isRowSelected ? 'checked="checked"' : '') + ' style="pointer-events: none"/>'+
                    '    </div>'
                    :
                    '' ) +
                '</td>'
    }
    if (grid.show.expandColumn) {
        let tmp_img = ''
        if (record.TsUi?.expanded === true) tmp_img = '-'; else tmp_img = '+'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (((record.TsUi?.expanded as any) == 'none' || !Array.isArray(record.TsUi?.children) || !record.TsUi?.children.length)) tmp_img = '+' // any: expanded is bool but runtime uses string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((record.TsUi?.expanded as any) == 'spinner') tmp_img = '<div class="tsg-spinner" style="width: 16px; margin: -2px 2px;"></div>' // any: same
        rec_html1 +=
                '<td id="grid_'+ grid.name +'_cell_'+ ind +'_expand' + (summary ? '_s' : '') + '" class="tsg-grid-data tsg-col-expand">'+
                    (summary !== true ? `<div>${tmp_img}</div>` : '' ) +
                '</td>'
    }
    // insert empty first column
    rec_html2 += '<td class="tsg-grid-data-spacer" col="start" style="border-right: 0"></td>'
    if (grid.reorderRows) {
        rec_html2 +=
                '<td id="grid_'+ grid.name +'_cell_'+ ind +'_order' + (summary ? '_s' : '') + '" class="tsg-grid-data tsg-col-order" col="order">'+
                    (summary !== true ? '<div title="Drag to reorder">&nbsp;</div>' : '' ) +
                '</td>'
    }
    let col_ind  = 0
    let col_skip = 0
    while (true) {
        let col_span = 1
        const col      = grid.columns[col_ind]
        if (col == null) break
        if (col.hidden) {
            col_ind++
            if (col_skip > 0) col_skip--
            continue
        }
        if (col_skip > 0) {
            col_ind++
            if (grid.columns[col_ind] == null) break
            record.TsUi!['colspan'][grid.columns[col_ind-1]!.field] = 0 // need it for other methods
            col_skip--
            continue
        } else if (record.TsUi) {
            const tmp1 = record.TsUi['colspan']
            const tmp2 = grid.columns[col_ind]!.field
            if (tmp1 && tmp1[tmp2] === 0) {
                delete tmp1[tmp2] // if no longer colspan then remove 0
            }
        }
        // column virtual scroll
        if ((col_ind < (grid.last.vscroll.colIndStart ?? 0) || col_ind > (grid.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen) {
            col_ind++
            continue
        }
        if (record.TsUi) {
            if (typeof record.TsUi['colspan'] == 'object') {
                const span = parseInt(record.TsUi['colspan'][col.field]) || null
                if (span != null && span > 1) {
                    // if there are hidden columns, then no colspan on them
                    let hcnt = 0
                    for (let i = col_ind; i < col_ind + span; i++) {
                        if (i >= grid.columns.length) break
                        if (grid.columns[i]!.hidden) hcnt++
                    }
                    col_span = span - hcnt
                    col_skip = span - 1
                }
            }
        }
        const rec_cell = grid.getCellHTML(ind, col_ind, summary, col_span)
        if (col.frozen) rec_html1 += rec_cell; else rec_html2 += rec_cell
        col_ind++
    }
    rec_html1 += '<td class="tsg-grid-data-last"></td>'
    rec_html2 += '<td class="tsg-grid-data-last" col="end"></td>'
    rec_html1 += '</tr>'
    rec_html2 += '</tr>'
    return [rec_html1, rec_html2]
}

export function getLineHTML(_grid: TsGrid, lineNum: number): string {
    return '<div>' + lineNum + '</div>'
}

export function getCellHTML(grid: TsGrid, ind: number, col_ind: number, summary?: boolean, col_span?: number) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj = grid
    const col = grid.columns[col_ind]!
    if (col == null) return ''
    const record  = (summary !== true ? grid.records[ind] : grid.summary[ind])
    // value, attr, style, className, divAttr — style/className/title reassigned below; keep let
    // eslint-disable-next-line prefer-const
    let { value, style, className, attr, divAttr, title } = grid.getCellValue(ind, col_ind, summary, true)
    const edit = (ind !== -1 ? grid.getCellEditable(ind, col_ind) : '')
    let divStyle = 'max-height: '+ grid.recordHeight +'px;' + (col.clipboardCopy ? 'margin-right: 20px' : '')
    const isChanged = !summary && record?.TsUi?.['changes'] && record.TsUi['changes'][col.field] != null
    const sel = grid.last.selection
    let isRowSelected = false
    let infoBubble    = ''
    if (sel.indexes.indexOf(ind) != -1) isRowSelected = true
    if (col_span == null) {
        if (record?.TsUi?.['colspan'] && record.TsUi['colspan'][col.field]) {
            col_span = record.TsUi['colspan'][col.field]
        } else {
            col_span = 1
        }
    }
    // expand icon
    if (col_ind === grid.hierarchyColumn && Array.isArray(record?.TsUi?.children)) {
        let level  = 0
        let subrec = record.TsUi.parent_recid != null ? grid.get(record.TsUi.parent_recid, true) : null
        while (true) {
            if (subrec != null) {
                level++
                const tmp = grid.records[subrec]!.TsUi
                if (tmp != null && tmp.parent_recid != null) {
                    subrec = grid.get(tmp.parent_recid, true)
                } else {
                    break
                }
            } else {
                break
            }
        }
        if (record.TsUi.parent_recid) {
            for (let i = 0; i < level; i++) {
                infoBubble += '<span class="tsg-show-children tsg-icon-empty"></span>'
            }
        }
        const className = record.TsUi?.children?.length > 0
            ? (record.TsUi.expanded ? 'tsg-icon-collapse' : 'tsg-icon-expand')
            : 'tsg-icon-empty'
        if (record.TsUi?.children?.length > 0) {
            infoBubble += `<span class="tsg-show-children ${className}"></span>`
        }
    }
    // info bubble
    if (col['info'] === true) col['info'] = {}
    if (col['info'] != null) {
        let infoIcon = 'tsg-icon-info'
        if (typeof col['info'].icon == 'function') {
            infoIcon = col['info'].icon(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary })
        } else if (typeof col['info'].icon == 'object') {
            infoIcon = col['info'].icon[grid.parseField(record, col.field)] || ''
        } else if (typeof col['info'].icon == 'string') {
            infoIcon = col['info'].icon
        }
        let infoStyle = col['info'].style || ''
        if (typeof col['info'].style == 'function') {
            infoStyle = col['info'].style(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary })
        } else if (typeof col['info'].style == 'object') {
            infoStyle = col['info'].style[grid.parseField(record, col.field)] || ''
        } else if (typeof col['info'].style == 'string') {
            infoStyle = col['info'].style
        }
        infoBubble += `<span class="tsg-info ${infoIcon}" style="${infoStyle}"></span>`
    }
    let data = value
    // if editable checkbox
    if (edit && ['checkbox', 'check'].indexOf(edit.type) != -1) {
        const changeInd = summary ? -(ind + 1) : ind
        divStyle += 'text-align: center;'
        data  = `<input tabindex="-1" type="checkbox" class="tsg-editable-checkbox"
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
    if (record?.TsUi) {
        if (record.TsUi.styles == null) {
            record.TsUi.styles = record.TsUi['style']
        }
        if (typeof record.TsUi.styles == 'object') {
            if (typeof record.TsUi.styles[col_ind] == 'string') style += record.TsUi.styles[col_ind] + ';'
            if (typeof record.TsUi.styles[col.field] == 'string') style += record.TsUi.styles[col.field] + ';'
        }
        if (typeof record.TsUi['class'] == 'object') {
            if (typeof record.TsUi['class'][col_ind] == 'string') className += record.TsUi['class'][col_ind] + ' '
            if (typeof record.TsUi['class'][col.field] == 'string') className += record.TsUi['class'][col.field] + ' '
        }
    }
    let isCellSelected = false
    if (isRowSelected && sel.columns[ind]?.includes(col_ind)) isCellSelected = true
    // clipboardCopy
    let clipboardIcon
    if (col.clipboardCopy){
        clipboardIcon = '<span class="tsg-clipboard-copy tsg-icon-paste"></span>'
    }
    // data
    data = '<td class="tsg-grid-data'+ (isCellSelected ? ' tsg-selected' : '') + ' ' + className +
                (isChanged ? ' tsg-changed' : '') + '" '+
            '   id="grid_'+ grid.name +'_data_'+ ind +'_'+ col_ind +'" col="'+ col_ind +'" '+
            '   style="'+ style + (col.style != null ? col.style : '') +'" '+
                (col.attr != null ? col.attr : '') + attr +
                ((col_span ?? 0) > 1 ? 'colspan="'+ col_span + '"' : '') +
            '>' + data + (clipboardIcon && TsUtils.stripTags(data) ? clipboardIcon : '') +'</td>'
    // summary top row
    if (ind === -1 && summary === true) {
        data = '<td class="tsg-grid-data" col="'+ col_ind +'" style="height: 0px; '+ style + '" '+
                    ((col_span ?? 0) > 1 ? 'colspan="'+ col_span + '"' : '') +
                '></td>'
    }
    return data

    // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getTitle(cellData: any, title: any){
        if (title === undefined && obj.show.recordTitles) {
            if (col['title'] != null) {
                if (typeof col['title'] == 'function') {
                    title = col['title'].call(obj, record, { self: obj, index: ind, colIndex: col_ind, summary: !!summary })
                }
                if (typeof col['title'] == 'string') title = col['title']
            } else {
                title = TsUtils.stripTags(String(cellData).replace(/"/g, '\'\''))
            }
        }
        return (title != null) ? 'title="' + String(title) + '"' : ''
    }
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clipboardCopy(grid: TsGrid, ind: any, col_ind: any, summary: any) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rec = (summary ? grid.summary[ind] : grid.records[ind])!
    const col = grid.columns[col_ind]
    let txt = (col ? grid.parseField(rec, col.field) : '')
    if (col && typeof col.clipboardCopy == 'function') {
        txt = col.clipboardCopy(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary })
    }
    query(grid.box).find('#grid_' + grid.name + '_focus').text(txt).get(0).select()
    document.execCommand('copy')
}

// any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function showBubble(grid: TsGrid, ind: any, col_ind: any, summary: any) {
    const info = grid.columns[col_ind]?.['info']
    if (!info) return
    let html = ''
    const rec  = grid.records[ind]
    const el   = query(grid.box).find(`${summary ? '.tsg-grid-summary' : ''} #grid_${grid.name}_data_${ind}_${col_ind} .tsg-info`)
    if (grid.last.bubbleEl) {
        TsTooltip.hide(grid.name + '-bubble')
    }
    grid.last.bubbleEl = el
    // if no fields defined - show all
    if (info.fields == null) {
        info.fields = []
        for (let i = 0; i < grid.columns.length; i++) {
            const col = grid.columns[i]!
            info.fields.push(col.field + (typeof col.render == 'string' ? ':' + col.render : ''))
        }
    }
    let fields = info.fields
    if (typeof fields == 'function') {
        fields = fields(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary }) // custom renderer
    }
    // generate html
    if (typeof info.render == 'function') {
        html = info.render(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary })

    } else if (Array.isArray(fields)) {
        // display mentioned fields
        html = '<table cellpadding="0" cellspacing="0">'
        for (let i = 0; i < fields.length; i++) {
            const tmp = String(fields[i]).split(':')
            if (tmp[0] == '' || tmp[0] == '-' || tmp[0] == '--' || tmp[0] == '---') {
                html += '<tr><td colspan=2><div style="border-top: '+ (tmp[0] == '' ? '0' : '1') +'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>'
                continue
            }
            let col = grid.getColumn(tmp[0] ?? '')
            if (col == null) col = { field: tmp[0] ?? '', text: tmp[0] ?? '', caption: tmp[0] } as TsGridColumn // if not found in columns
            let val = (col ? grid.parseField(rec, col.field) : '')
            // if change by inline editing
            if (rec?.TsUi?.['changes']?.[col.field] != null) {
                val = rec.TsUi['changes'][col.field]
            }
            if (tmp.length > 1) {
                if (TsUtils.formatters[tmp[1] ?? '']) {
                    const extra = {
                        self: grid,
                        value: val,
                        params: tmp[2] || null,
                        field: grid.columns[col_ind]!.field,
                        index: ind,
                        colIndex: col_ind,
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    val = (TsUtils.formatters[tmp[1]!] as any).call(grid, rec, extra) // any: formatter this-binding mismatch
                } else {
                    console.log('ERROR: TsUtils.formatters["'+ tmp[1] + '"] does not exists.')
                }
            }
            if (typeof val == 'object' && val.text != null) val = val.text
            if (info.showEmpty !== true && (val == null || val == '')) continue
            if (info.maxLength != null && typeof val == 'string' && val.length > info.maxLength) val = val.substr(0, info.maxLength) + '...'
            html += '<tr><td>' + col.text + '</td><td>' + ((val === 0 ? '0' : val) || '') + '</td></tr>'
        }
        html += '</table>'
    } else if (TsUtils.isPlainObject(fields)) {
        // display some fields
        html = '<table cellpadding="0" cellspacing="0">'
        for (const caption in fields) {
            const fld = fields[caption]
            if (fld == '' || fld == '-' || fld == '--' || fld == '---') {
                html += '<tr><td colspan=2><div style="border-top: '+ (fld == '' ? '0' : '1') +'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>'
                continue
            }
            const tmp = String(fld).split(':')
            let col = grid.getColumn(tmp[0] ?? '')
            if (col == null) col = { field: tmp[0] ?? '', text: tmp[0] ?? '', caption: tmp[0] } as TsGridColumn // if not found in columns
            let val = (col ? grid.parseField(rec, col.field) : '')
            // if change by inline editing
            if (rec?.TsUi?.['changes']?.[col.field] != null) {
                val = rec.TsUi['changes'][col.field]
            }
            if (tmp.length > 1) {
                if (TsUtils.formatters[tmp[1] ?? '']) {
                    const extra = {
                        self: grid,
                        value: val,
                        params: tmp[2] || null,
                        field: grid.columns[col_ind]!.field,
                        index: ind,
                        colIndex: col_ind,
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    val = (TsUtils.formatters[tmp[1]!] as any).call(grid, rec, extra) // any: formatter this-binding mismatch
                } else {
                    console.log('ERROR: TsUtils.formatters["'+ tmp[1] + '"] does not exists.')
                }
            }
            if (typeof fld == 'function') {
                val = fld(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary })
            }
            if (val?.text != null) val = val.text
            if (info.showEmpty !== true && (val == null || val == '')) continue
            if (info.maxLength != null && typeof val == 'string' && val.length > info.maxLength) val = val.substr(0, info.maxLength) + '...'
            html += '<tr><td>' + caption + '</td><td>' + ((val === 0 ? '0' : val) || '') + '</td></tr>'
        }
        html += '</table>'
    }
    return TsTooltip.show(TsUtils.extend({
        name: grid.name + '-bubble',
        html,
        anchor: el.get(0),
        position: 'top|bottom',
        class: 'tsg-info-bubble',
        style: '',
        hideOn: ['doc-click']
    }, info.options ?? {}))
        .hide(() => [
            grid.last.bubbleEl = null
        ])
}

// return null or the editable object if the given cell is editable
// any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCellEditable(grid: TsGrid, ind: number, col_ind: number): any {
    const col = grid.columns[col_ind]
    const rec = grid.records[ind]!
    if (!rec || !col) return null
    let edit = (rec.TsUi ? rec.TsUi['editable'] : null)
    if (edit === false) return null
    if (edit == null || edit === true) {
        edit = (Object.keys(col['editable'] ?? {}).length > 0 ? col['editable'] : null)
        if (typeof col['editable'] === 'function') {
            const value = grid.getCellValue(ind, col_ind, false)
            // same arguments as col.render()
            edit = col['editable'].call(grid, rec, { self: grid, value, index: ind, colIndex: col_ind })
        }
    }
    return edit
}

// any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCellValue(grid: TsGrid, ind: number, col_ind: number, summary?: boolean, extra?: boolean): any {
    const col = grid.columns[col_ind]!
    const record = (summary !== true ? grid.records[ind] : grid.summary[ind])
    let value = grid.parseField(record, col.field)
    let className = '', style = '', attr = '', divAttr = ''
    let title
    // if change by inline editing
    if (record?.TsUi?.['changes']?.[col.field] != null) {
        value = record.TsUi['changes'][col.field]
    }
    // if there is a cell renderer
    if (col.render != null && ind !== -1) {
        let render = col.render
        let params
        // predefined formatters
        if (typeof render == 'string') {
            const tmp = render.toLowerCase().replace('|', ':').split(':')
            // formatters
            let func = TsUtils.formatters[tmp[0] ?? '']
            if (col['options'] && col['options'].autoFormat === false) {
                func = undefined
            }
            // any: cast-to-any for return-position narrowing; TsGrid record/cell shape is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render = func as any
            params = tmp[1]
        }
        if (typeof render == 'function' && record != null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let html: any // any: render can be TsFormatter or column render, shapes differ
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                html = (render as any).call(grid, record, { // any: unified call for both formatter and column render
                    self: grid,
                    value, params,
                    field: grid.columns[col_ind]!.field,
                    index: ind,
                    colIndex: col_ind,
                    summary: !!summary
                })
            } catch (e) {
                throw new Error(`Render function for column "${col.field}" in grid "${grid.name}": -- ` + (e as Error).message)
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
            // any: cast-then-index for dynamic property access; TsGrid record/cell shape is user-defined at runtime
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

export function getFooterHTML(_grid: TsGrid) {
    return '<div>'+
        '    <div class="tsg-footer-left"></div>'+
        '    <div class="tsg-footer-right"></div>'+
        '    <div class="tsg-footer-center"></div>'+
        '</div>'
}

// any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scroll(grid: TsGrid, event?: Event | any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const obj      = grid
    const url      = grid.url?.get ?? grid.url

    const records  = query(grid.box).find(`#grid_${grid.name}_records`)
    const frecords = query(grid.box).find(`#grid_${grid.name}_frecords`)
    // sync scroll positions
    if (event) {
        const sTop  = event.target.scrollTop
        const sLeft = event.target.scrollLeft
        grid.last.vscroll.scrollTop  = sTop
        grid.last.vscroll.scrollLeft = sLeft
        const cols = query(grid.box).find(`#grid_${grid.name}_columns`)[0]
        const summary = query(grid.box).find(`#grid_${grid.name}_summary`)[0]
        if (cols) cols.scrollLeft = sLeft
        if (summary) summary.scrollLeft = sLeft
        if (frecords[0]) frecords[0].scrollTop = sTop
    }
    // hide bubble
    if (grid.last.bubbleEl) {
        TsTooltip.hide(grid.name + '-bubble')
        grid.last.bubbleEl = null
    }
    // column virtual scroll
    let colStart = null
    let colEnd   = null
    if (grid.disableCVS || grid.columnGroups.length > 0) {
        // disable virtual scroll
        colStart = 0
        colEnd   = grid.columns.length - 1
    } else {
        const sWidth = records.prop('clientWidth')
        let cLeft  = 0
        for (let i = 0; i < grid.columns.length; i++) {
            if (grid.columns[i]!.frozen || grid.columns[i]!.hidden) continue
            const cSize = parseInt(grid.columns[i]!.sizeCalculated ? grid.columns[i]!.sizeCalculated! : String(grid.columns[i]!.size ?? 0))
            if (cLeft + cSize + 30 > grid.last.vscroll.scrollLeft && colStart == null) colStart = i
            if (cLeft + cSize - 30 > grid.last.vscroll.scrollLeft + sWidth && colEnd == null) colEnd = i
            cLeft += cSize
        }
        if (colEnd == null) colEnd = grid.columns.length - 1
    }
    if (colStart != null) {
        if (colStart < 0) colStart = 0
        if (colEnd < 0) colEnd = 0
        if (colStart == colEnd) {
            if (colStart > 0) colStart--; else colEnd++ // show at least one column
        }
        // ---------
        if (colStart != grid.last.vscroll.colIndStart || colEnd != grid.last.vscroll.colIndEnd) {
            const $box = query(grid.box)
            const deltaStart = Math.abs(colStart - grid.last.vscroll.colIndStart)
            const deltaEnd   = Math.abs(colEnd - grid.last.vscroll.colIndEnd)
            // add/remove columns for small jumps
            if (deltaStart < 5 && deltaEnd < 5) {
                const $cfirst = $box.find(`.tsg-grid-columns #grid_${grid.name}_column_start`)
                const $clast  = $box.find('.tsg-grid-columns .tsg-head-last')
                const $rfirst = $box.find(`#grid_${grid.name}_records .tsg-grid-data-spacer`)
                const $rlast  = $box.find(`#grid_${grid.name}_records .tsg-grid-data-last`)
                const $sfirst = $box.find(`#grid_${grid.name}_summary .tsg-grid-data-spacer`)
                const $slast  = $box.find(`#grid_${grid.name}_summary .tsg-grid-data-last`)
                // remove on left
                if (colStart > grid.last.vscroll.colIndStart) {
                    for (let i = grid.last.vscroll.colIndStart; i < colStart; i++) {
                        $box.find('#grid_'+ grid.name +'_columns #grid_'+ grid.name +'_column_'+ i).remove() // column
                        $box.find('#grid_'+ grid.name +'_records td[col="'+ i +'"]').remove() // record
                        $box.find('#grid_'+ grid.name +'_summary td[col="'+ i +'"]').remove() // summary
                    }
                }
                // remove on right
                if (colEnd < grid.last.vscroll.colIndEnd) {
                    for (let i = grid.last.vscroll.colIndEnd; i > colEnd; i--) {
                        $box.find('#grid_'+ grid.name +'_columns #grid_'+ grid.name +'_column_'+ i).remove() // column
                        $box.find('#grid_'+ grid.name +'_records td[col="'+ i +'"]').remove() // record
                        $box.find('#grid_'+ grid.name +'_summary td[col="'+ i +'"]').remove() // summary
                    }
                }
                // add on left
                if (colStart < grid.last.vscroll.colIndStart) {
                    for (let i = (grid.last.vscroll.colIndStart ?? 0) - 1; i >= colStart; i--) {
                        if (grid.columns[i] && (grid.columns[i]!.frozen || grid.columns[i]!.hidden)) continue
                        $cfirst.after(grid.getColumnCellHTML(i)) // column
                        // record
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        $rfirst.each((el: any) => {
                            const index = query(el).parent().attr('index')
                            let td    = '<td class="tsg-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                            if (index != null) td = grid.getCellHTML(parseInt(index), i, false)
                            query(el).after(td)
                        })
                        // summary
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        $sfirst.each((el: any) => {
                            const index = query(el).parent().attr('index')
                            let td    = '<td class="tsg-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                            if (index != null) td = grid.getCellHTML(parseInt(index), i, true)
                            query(el).after(td)
                        })
                    }
                }
                // add on right
                if (colEnd > grid.last.vscroll.colIndEnd) {
                    for (let i = (grid.last.vscroll.colIndEnd ?? 0) + 1; i <= colEnd; i++) {
                        if (grid.columns[i] && (grid.columns[i]!.frozen || grid.columns[i]!.hidden)) continue
                        $clast.before(grid.getColumnCellHTML(i)) // column
                        // record
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        $rlast.each((el: any) => {
                            const index = query(el).parent().attr('index')
                            let td    = '<td class="tsg-grid-data" col="'+ i +'" style="height: 0px"></td>' // width column
                            if (index != null) td = grid.getCellHTML(parseInt(index), i, false)
                            query(el).before(td)
                        })
                        // summary
                        // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        $slast.each((el: any) => {
                            const index = query(el).parent().attr('index') || -1
                            const td    = grid.getCellHTML(parseInt(index), i, true)
                            query(el).before(td)
                        })
                    }
                }
                grid.last.vscroll.colIndStart = colStart
                grid.last.vscroll.colIndEnd   = colEnd
                grid.resizeRecords()
            } else {
                grid.last.vscroll.colIndStart = colStart
                grid.last.vscroll.colIndEnd   = colEnd
                // dot not just call grid.refresh();
                const colHTML   = grid.getColumnsHTML()
                const recHTML   = grid.getRecordsHTML()
                const sumHTML   = grid.getSummaryHTML()
                const $columns  = $box.find(`#grid_${grid.name}_columns`)
                const $records  = $box.find(`#grid_${grid.name}_records`)
                const $frecords = $box.find(`#grid_${grid.name}_frecords`)
                const $summary  = $box.find(`#grid_${grid.name}_summary`)
                $columns.find('tbody').html(colHTML[1])
                $frecords.html(recHTML[0])
                $records.prepend(recHTML[1])
                if (sumHTML != null) $summary.html(sumHTML[1])
                // need timeout to clean up (otherwise scroll problem)
                setTimeout(() => {
                    $records.find(':scope > table').filter(':not(table:first-child)').remove()
                    if ($summary[0]) $summary[0].scrollLeft = grid.last.vscroll.scrollLeft
                }, 1)
                grid.resizeRecords()
            }
        }
    }
    // perform virtual scroll
    let buffered = grid.records.length
    if (buffered > grid.total && grid.total !== -1) buffered = grid.total
    if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length
    if (buffered === 0 || records.length === 0 || records.prop('clientHeight') === 0) return
    if (buffered > grid.vs_start) grid.last.vscroll.show_extra = grid.vs_extra; else grid.last.vscroll.show_extra = grid.vs_start
    // update footer
    let t1 = Math.round(records.prop('scrollTop') / grid.recordHeight + 1)
    let t2 = t1 + (Math.round(records.prop('clientHeight') / grid.recordHeight) - 1)
    if (t1 > buffered) t1 = buffered
    if (t2 >= buffered - 1) t2 = buffered
    query(grid.box).find('#grid_'+ grid.name + '_footer .tsg-footer-right').html(
        (grid.show.statusRange
            ? TsUtils.formatNumber(grid.offset + t1) + '-' + TsUtils.formatNumber(grid.offset + t2) +
                (grid.total != -1 ? ' ' + TsUtils.lang('of') + ' <span class="tsg-total">' + TsUtils.formatNumber(grid.total) + '</span>' : '')
                : '') +
        (url && grid.show.statusBuffered ? ' ('+ TsUtils.lang('buffered') + ' <span class="tsg-buffered">'+ TsUtils.formatNumber(buffered) + '</span>' +
                (grid.offset > 0 ? ', skip <span class="tsg-skip">' + TsUtils.formatNumber(grid.offset) : '') + '</span>)' : '')
    )
    // only for local data source, else no extra records loaded
    if (!url && (!grid.fixedBody || (grid.total != -1 && grid.total <= grid.vs_start))) return
    // regular processing
    let start = Math.floor(records.prop('scrollTop') / grid.recordHeight) - grid.last.vscroll.show_extra
    let end   = start + Math.floor(records.prop('clientHeight') / grid.recordHeight) + grid.last.vscroll.show_extra * 2 + 1
    // let div  = start - grid.last.vscroll.recIndStart;
    if (start < 1) start = 1
    if (end > grid.total && grid.total != -1) end = grid.total
    const tr1  = records.find('#grid_'+ grid.name +'_rec_top')
    const tr2  = records.find('#grid_'+ grid.name +'_rec_bottom')
    const tr1f = frecords.find('#grid_'+ grid.name +'_frec_top')
    const tr2f = frecords.find('#grid_'+ grid.name +'_frec_bottom')
    // if row is expanded
    if (String(tr1.next().prop('id')).indexOf('_expanded_row') != -1) {
        tr1.next().remove()
        tr1f.next().remove()
    }
    if (grid.total > end && String(tr2.prev().prop('id')).indexOf('_expanded_row') != -1) {
        tr2.prev().remove()
        tr2f.prev().remove()
    }
    const first = parseInt(tr1.next().attr('line'))
    const last  = parseInt(tr2.prev().attr('line'))
    let tmp, tmp1, tmp2, rec_start, rec_html
    if (first <= start || first == 1 || grid.last.vscroll.pull_refresh) { // scroll down
        if (end <= last + grid.last.vscroll.show_extra - 2 && end != grid.total) return
        grid.last.vscroll.pull_refresh = false
        // remove from top
        while (true) {
            tmp1 = frecords.find('#grid_'+ grid.name +'_frec_top').next()
            tmp2 = records.find('#grid_'+ grid.name +'_rec_top').next()
            if (tmp2.attr('line') == 'bottom') break
            if (parseInt(tmp2.attr('line')) < start) {
                tmp1.remove()
                tmp2.remove()
            } else {
                break
            }
        }
        // add at bottom
        tmp = records.find('#grid_'+ grid.name +'_rec_bottom').prev()
        rec_start = tmp.attr('line')
        if (rec_start == 'top') rec_start = start
        for (let i = parseInt(rec_start) + 1; i <= end; i++) {
            if (!grid.records[i-1]) continue
            tmp2 = grid.records[i-1]!.TsUi
            if (tmp2 && !Array.isArray(tmp2.children)) {
                tmp2.expanded = false
            }
            rec_html = grid.getRecordHTML(i-1, i)
            tr2.before(rec_html[1])
            tr2f.before(rec_html[0])
        }
        markSearch()
        setTimeout(() => { grid.refreshRanges() }, 0)
    } else { // scroll up
        if (start >= first - grid.last.vscroll.show_extra + 2 && start > 1) return
        // remove from bottom
        while (true) {
            tmp1 = frecords.find('#grid_'+ grid.name +'_frec_bottom').prev()
            tmp2 = records.find('#grid_'+ grid.name +'_rec_bottom').prev()
            if (tmp2.attr('line') == 'top') break
            if (parseInt(tmp2.attr('line')) > end) {
                tmp1.remove()
                tmp2.remove()
            } else {
                break
            }
        }
        // add at top
        tmp       = records.find('#grid_'+ grid.name +'_rec_top').next()
        rec_start = tmp.attr('line')
        if (rec_start == 'bottom') rec_start = end
        for (let i = parseInt(rec_start) - 1; i >= start; i--) {
            if (!grid.records[i-1]) continue
            tmp2 = grid.records[i-1]!.TsUi
            if (tmp2 && !Array.isArray(tmp2.children)) {
                tmp2.expanded = false
            }
            rec_html = grid.getRecordHTML(i-1, i)
            tr1.after(rec_html[1])
            tr1f.after(rec_html[0])
        }
        markSearch()
        setTimeout(() => { grid.refreshRanges() }, 0)
    }
    // first/last row size
    const h1 = (start - 1) * grid.recordHeight
    let h2 = (buffered - end) * grid.recordHeight
    if (h2 < 0) h2 = 0
    tr1.css('height', h1 + 'px')
    tr1f.css('height', h1 + 'px')
    tr2.css('height', h2 + 'px')
    tr2f.css('height', h2 + 'px')
    grid.last.vscroll.recIndStart = start
    grid.last.vscroll.recIndEnd   = end
    // load more if needed
    const s = Math.floor(records.prop('scrollTop') / grid.recordHeight)
    const e = s + Math.floor(records.prop('clientHeight') / grid.recordHeight)
    if (e + 10 > buffered && grid.last.vscroll.pull_more !== true && (buffered < grid.total - grid.offset || (grid.total == -1 && grid.last.fetch.hasMore))) {
        if (grid.autoLoad === true) {
            grid.last.vscroll.pull_more   = true
            grid.last.fetch.offset = (grid.last.fetch.offset ?? 0) + grid.limit
            grid.request('load')
        }
        // scroll function
        const more = query(grid.box).find('#grid_'+ grid.name +'_rec_more, #grid_'+ grid.name +'_frec_more')
        more.show()
            .eq(1) // only main table
            .off('.load-more')
            .on('click.load-more', function(this: Element) {
                // show spinner
                query(this).find('td').html('<div><div style="width: 20px; height: 20px;" class="tsg-spinner"></div></div>')
                // load more
                obj.last.vscroll.pull_more   = true
                obj.last.fetch.offset = (obj.last.fetch.offset ?? 0) + obj.limit
                obj.request('load')
            })
            .find('td')
            .html(obj.autoLoad
                ? '<div><div style="width: 20px; height: 20px;" class="tsg-spinner"></div></div>'
                : '<div style="padding-top: 15px">'+ TsUtils.lang('Load ${count} more...', { count: obj.limit }) + '</div>'
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
                    const el = query(obj.box).find('td[col="'+ item.col +'"]:not(.tsg-head)')
                    TsUtils.marker(el, item.search)
                })
            }
        }, 50)
    }
}
