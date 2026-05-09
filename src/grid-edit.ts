/**
 * grid-edit.ts — Phase 5 of tsgrid-v2-core SDD
 *
 * Extracted edit domain: editField, editChange, editDone.
 * All functions take (grid: TsGrid, ...args) and delegate cross-domain
 * calls back through the TsGrid prototype (grid.X()).
 *
 * DAG: imports tsgrid (type), grid-state (runtime), query, TsUtils, TsField, TsTooltip.
 * FORBIDDEN imports: grid-columns, grid-data, grid-selection, grid-search,
 *                    grid-interaction, grid-render.
 */

import type { TsGrid } from './tsgrid.js'
import { TsUtils } from './tsutils.js'
import { query as _queryRaw } from './query.js'
import { TsField } from './tsfield.js'
import { TsTooltip as _w2tooltip } from './tstooltip.js'

// any: query() always returns Query at runtime; cast to any for clean duck-typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _queryRaw as (...args: any[]) => any // any: Query wrapper used as jQuery-like in grid-edit
// any: TsTooltip has complex show/hide overloads
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsTooltip = _w2tooltip as any // any: tooltip with flexible option shapes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editField(grid: TsGrid, recid: string | number, column: number, value: any, event?: any): void { // any: can be KeyboardEvent, MouseEvent, or synthetic event
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = grid
    if (grid.last.inEditMode === true) {
        // This is triggerign when user types fast
        if (event && event.keyCode == 13) {
            const { index, column, value } = grid.last._edit!
            grid.editChange({ type: 'custom', value }, index, column, event)
            grid.editDone(index, column, event)
        } else {
            // when 2 chars entered fast (spreadsheet)
            const input = query(grid.box).find('div.tsg-edit-box .tsg-input')
            if (input.length > 0) {
                if (input.get(0).tagName == 'DIV') {
                    input.text(input.text() + value)
                    TsUtils.setCursorPosition(input.get(0), input.text().length)
                } else {
                    input.val(input.val() + value)
                    TsUtils.setCursorPosition(input.get(0), input.val().length)
                }
            }
        }
        return
    }
    const index = grid.get(recid, true)
    if (index == null) return
    const edit = grid.getCellEditable(index, column)
    if (!edit || ['checkbox', 'check'].includes(edit.type)) return
    const rec = grid.records[index]!
    const col = grid.columns[column]!
    const prefix = (col.frozen === true ? '_f' : '_')
    if (['enum', 'file'].indexOf(edit.type) != -1) {
        console.log('ERROR: input types "enum" and "file" are not supported in inline editing.')
        return
    }
    // event before
    const edata = grid.trigger('editField', { target: grid.name, recid, column, value, index, originalEvent: event })
    if (edata.isCancelled === true) return
    value = edata.detail['value']
    // default behaviour
    grid.last.inEditMode = true
    grid.last['editColumn'] = column
    grid.last._edit = { value: value, index: index, column: column, recid: recid }
    grid.selectNone(true) // no need to trigger select event
    grid.select({ recid: recid, column: column })
    // create input element
    const tr = query(grid.box).find('#grid_'+ grid.name + prefix +'rec_' + TsUtils.escapeId(recid))
    let div = tr.find('[col="'+ column +'"] > div') // TD -> DIV
    grid.last._edit['tr'] = tr
    grid.last._edit['div'] = div
    // clear previous if any (spreadsheet)
    query(grid.box).find('div.tsg-edit-box').remove()
    // for spreadsheet - insert into selection
    if (grid.selectType != 'row') {
        query(grid.box).find('#grid_'+ grid.name + prefix + 'selection')
            .attr('id', 'grid_'+ grid.name + '_editable')
            .removeClass('tsg-selection')
            .addClass('tsg-edit-box')
            .prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>')
            .find('.tsg-selection-resizer')
            .remove()
        div = query(grid.box).find('#grid_'+ grid.name + '_editable > div:first-child')
    }
    edit.attr  = edit.attr ?? ''
    edit.text  = edit.text ?? ''
    edit.style = edit.style ?? ''
    edit.items = edit.items ?? []
    let val = (rec.TsUi?.['changes']?.[col.field] != null
        ? TsUtils.stripTags(rec.TsUi['changes'][col.field])
        : TsUtils.stripTags(self.parseField(rec, col.field)))
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
    if (edit.items.length > 0 && !TsUtils.isPlainObject(edit.items[0])) {
        edit.items = TsUtils.normMenu(edit.items, edit)
    }
    // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let input: any
    const dropTypes = ['date', 'time', 'datetime', 'color', 'list', 'combo']
    const styles = getComputedStyle(tr.find('[col="'+ column +'"] > div').get(0) as Element)
    const font = `font-family: ${styles.getPropertyValue('font-family')}; font-size: ${styles.getPropertyValue('font-size')};`
    switch (edit.type) {
        case 'div': {
            div.addClass('tsg-editable')
                .html(TsUtils.stripSpaces(`<div id="grid_${grid.name}_edit_${recid}_${column}" class="tsg-input tsg-focus"
                    contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                    style="${font + addStyle + edit.style}"
                    field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>
                </div>${edit.text}`))
            input = div.find('div.tsg-input').get(0)
            input.innerText = (typeof val != 'object' ? val : '')
            if (value != null) {
                TsUtils.setCursorPosition(input, input.innerText.length)
            } else {
                TsUtils.setCursorPosition(input, 0, input.innerText.length)
            }
            break
        }
        default: {
            div.addClass('tsg-editable')
                .html(TsUtils.stripSpaces(`<input id="grid_${grid.name}_edit_${recid}_${column}" class="tsg-input"
                    autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                    style="${font + addStyle + edit.style}"
                    field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>${edit.text}`))
            input = div.find('input').get(0)
            // issue #499
            if (edit.type == 'number') {
                val = TsUtils.formatNumber(val)
            }
            if (edit.type == 'date') {
                val = TsUtils.formatDate(TsUtils.isDate(val, edit.format, true) || new Date(), edit.format)
            }
            input.value = (typeof val != 'object' ? val : '')

            // init TsField, attached to input._w2field
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const doHide = (event: any) => { // any: could be KeyboardEvent or custom event
                const escKey = grid.last._edit?.['escKey']
                // check if any element is selected in drop down
                let selected = false
                const name = query(input).data('tooltipName')
                if (name && TsTooltip.get(name[0])?.selected != null) {
                    selected = true
                }
                // trigger change on new value if selected from overlay
                if (grid.last.inEditMode && !escKey && dropTypes.includes(edit.type) // drop down types
                        && (event.detail.overlay.anchor?.id == grid.last._edit?.['input']?.id || edit.type == 'list')) {
                    grid.editChange()
                    grid.editDone(undefined, undefined, { keyCode: selected ? 13 : 0 }) // advance on select
                }
            }
            new TsField(TsUtils.extend({}, edit, {
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
    Object.assign(grid.last._edit, { input, edit })
    query(input)
        .off('.tsg-editable')
        .on('blur.tsg-editable', (event: Event) => {
            if (grid.last.inEditMode) {
                const type = grid.last._edit?.['edit']?.type
                const name = query(input).data('tooltipName') // if popup is open
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const et = event.target as any // any: custom _keepOpen property on event target
                if ((name && dropTypes.includes(type)) || et?._keepOpen === true) {
                    delete et._keepOpen
                    // drop downs finish edit when popover is closed
                    return
                }
                grid.editChange(input, index, column, event)
                grid.editDone()
            }
        })
        .on('mousedown.tsg-editable', (event: Event) => {
            event.stopPropagation()
        })
        .on('click.tsg-editable', (event: Event) => {
            expand.call(input, event)
        })
        .on('paste.tsg-editable', (event: Event) => {
            // clean paste to be plain text
            event.preventDefault()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const text = (event as any as ClipboardEvent).clipboardData!.getData('text/plain') // any: typed as Event but is ClipboardEvent
            document.execCommand('insertHTML', false, text)
        })
        .on('keyup.tsg-editable', (event: Event) => {
            expand.call(input, event)
        })
        .on('keydown.tsg-editable', (event: Event) => {
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
                        if (grid.last._edit) grid.last._edit['escKey'] = true
                        TsTooltip.hide(name[0])
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
                            grid.editChange(input, index, column, event)
                            grid.editDone(index, column, event)
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
                        if (name && TsTooltip.get(name[0]).selected != null) {
                            selected = true
                        }
                        // if tooltip is not open or no element is selected
                        if ((!name || !selected) && input._keepOpen !== true) {
                            grid.editChange(input, index, column, event)
                            grid.editDone(index, column, event)
                        } else {
                            delete input._keepOpen
                        }
                        break
                    }

                    case 27: { // escape
                        if (grid.last._edit) grid.last._edit['escKey'] = false
                        let old = self.parseField(rec, col.field)
                        if (rec.TsUi?.['changes']?.[col.field] != null) old = rec.TsUi['changes'][col.field]
                        if (input._prevValue != null) old = input._prevValue
                        if (input.tagName == 'DIV') {
                            input.innerText = old != null ? old : ''
                        } else {
                            input.value = old != null ? old : ''
                        }
                        grid.editDone(index, column, event)
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
            if (!grid.last.inEditMode) return
            if (input) {
                input.focus()
                clearTimeout(grid.last.kbd_timer ?? undefined) // keep focus
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
            const width = TsUtils.getStrWidth(val, style)
            if (width + 20 > editBox.clientWidth) {
                query(editBox).css('width', width + 20 + 'px')
            }
        } catch (e) {
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function editChange(grid: TsGrid, input?: any, index?: any, column?: any, event?: any): void { // any: all params are optional grid-edit internals
    // if params are not specified
    input = input ?? grid.last._edit?.['input']
    index = index ?? grid.last._edit?.['index']
    column = column ?? grid.last._edit?.['column']
    event = event ?? {}
    // all other fields
    const summary = index < 0
    index       = index < 0 ? -index - 1 : index
    const records = summary ? grid.summary : grid.records
    const rec     = records[index]!
    const col     = grid.columns[column]!
    let new_val = (input?.tagName == 'DIV' ? input.innerText : input.value)
    const fld     = input._w2field
    if (fld) {
        if (fld.type == 'list') {
            new_val = fld.selected
        }
        if (new_val == null || Object.keys(new_val).length === 0) new_val = ''
        if (!TsUtils.isPlainObject(new_val)) new_val = fld.clean(new_val)
    }
    if (input.type == 'checkbox') {
        if (rec.TsUi?.['editable'] === false) input.checked = !input.checked
        new_val = input.checked
    }
    const old_val = grid.parseField(rec, col.field)
    const prev_val = (rec.TsUi?.['changes'] && rec.TsUi['changes'].hasOwnProperty(col.field) ? rec.TsUi['changes'][col.field]: old_val)
    // change/restore event
    // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edata: any = {
        target: grid.name, input,
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
            edata = grid.trigger('change', edata)
            if (edata.isCancelled !== true) {
                if (new_val !== edata.detail.value.new) {
                    // re-evaluate the type of change to be made
                    continue
                }
                // default action
                if ((edata.detail.value.new === '' || edata.detail.value.new == null) && (prev_val === '' || prev_val == null)) {
                    // value did not change, was empty is empty
                } else {
                    rec.TsUi = rec.TsUi ?? {}
                    rec.TsUi['changes'] = rec.TsUi['changes'] ?? {}
                    rec.TsUi['changes'][col.field] = edata.detail.value.new
                }
                // event after
                edata.finish()
            }
        } else {
            // restore event
            edata = grid.trigger('restore', edata)
            if (edata.isCancelled !== true) {
                if (new_val !== edata.detail.value.new) {
                    // re-evaluate the type of change to be made
                    continue
                }
                // default action
                if (rec.TsUi?.['changes']) {
                    delete rec.TsUi['changes'][col.field]
                    if (Object.keys(rec.TsUi['changes']).length === 0) {
                        delete rec.TsUi['changes']
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
export function editDone(grid: TsGrid, index?: any, column?: any, event?: any): void { // any: all params are optional grid-edit internals
    // if params are not specified
    index = index ?? grid.last._edit?.['index']
    column = column ?? grid.last._edit?.['column']
    event = event ?? {}
    // removal of input happens when TR is redrawn
    if (grid.advanceOnEdit && event.keyCode == 13) {
        const next: number = event.shiftKey ? (grid.prevRow(index, column, 1) ?? index) : (grid.nextRow(index, column, 1) ?? index)
        setTimeout(() => {
            if (grid.selectType != 'row') {
                grid.selectNone(true) // no need to trigger select event
                grid.select({ recid: grid.records[next]!.recid, column: column })
            } else {
                grid.editField(grid.records[next]!.recid, column, null, event)
            }
        }, 1)
    }
    const summary = index < 0
    const cell = query(grid.last._edit?.['tr']).find('[col="'+ column +'"]')
    const rec  = grid.records[index]!
    const col  = grid.columns[column]!
    // need to set before remove, as remove will trigger blur
    grid.last.inEditMode = false
    grid.last._edit = null
    // remove - by updating cell data
    if (!summary) {
        if (rec.TsUi?.['changes']?.[col.field] != null) {
            cell.addClass('tsg-changed')
        } else {
            cell.removeClass('tsg-changed')
        }
        cell.replace(grid.getCellHTML(index, column, summary))
    }
    // remove - spreadsheet
    query(grid.box).find('div.tsg-edit-box').remove()
    // update toolbar buttons
    grid.updateToolbar()
    // keep grid in focus if needed
    setTimeout(() => {
        const input = query(grid.box).find(`#grid_${grid.name}_focus`).get(0)
        if (document.activeElement !== input && !grid.last.inEditMode) {
            input.focus()
        }
    }, 10)
}
