/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTabs, TsToolbar, TsTooltip, TsField
 *
 * T4.2: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 * Bug fix: line 1317 (original) `?? response.statusText` was unreachable
 * because string concat always produces non-null; fixed to `|| response.statusText`.
 *
 * == TODO ==
 *  - include delta on save
 *  - tabs below some fields (could already be implemented)
 *  - form with toolbar & tabs
 *  - promise for load, save, etc.
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - better groups support tabs now
 *  - form.confirm - refactored
 *  - form.message - refactored
 *  - observeResize for the box
 *  - removed msgNotJSON, msgAJAXerror
 *  - applyFocus -> setFocus
 *  - getFieldValue(fieldName) = returns { curent, previous, original }
 *  - setFieldVallue(fieldName, value)
 *  - getValue(..., original) -- return original if any
 *  - added .hideErrors()
 *  - reuqest, save, submit - return promises
 *  - this.recid = null if no record needs to be pulled
 *  - remove form.multiplart
 *  - this.method - for saving only
 *  - added field.html.class
 *  - setValue(..., noRefresh)
 *  - rememberOriginal()
 *  - saveCleanRecord
 *  - added options.itemMap = { id: 'id', text: 'text' } - to map id, text fields if needed
 *  - hideGroup/showGroup - new methods
 *  - getAction/actionHide/actionShow/actionDisable/actionEnable - new methods
 */

import { TsBase, TsEventPayload } from './tsbase.js'
import { TsUi, TsUtils } from './tsutils.js'
import { query as _queryRaw, Query } from './query.js'
import { TsTabs } from './tstabs.js'
import { TsToolbar } from './tstoolbar.js'
import { TsTooltip as _w2tooltip } from './tstooltip.js'
import { TsField } from './tsfield.js'

// any: TsTooltip has complex show/hide overloads; cast once for clean call sites
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsTooltip = _w2tooltip as any
// query() always returns Query at runtime; cast to remove void from union
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

class TsForm extends TsBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: dynamic properties added via TsUtils.extend and field access

    declare name: string
    header: string
    declare box: HTMLElement | null
    url: string | { get?: string; save?: string }
    method: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeData: Record<string, any> // any: route params are user-supplied
    formURL: string
    formHTML: string
    page: number
    pageStyle: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recid: any // any: recid can be string, number, or null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[] // any: field definitions vary by type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: Record<string, any> // any: action can be function or object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    record: Record<string, any> // any: record values depend on field definitions
    // any: Record<string, any> — dynamic property bag; TsForm field schema is user-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    original: Record<string, any> | null
    dataType: string | null
    saveCleanRecord: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postData: Record<string, any> // any: user-defined post data
    httpHeaders: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolbar: any // any: TsToolbar instance or config object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabs: any // any: TsTabs instance or config object
    style: string
    focus: number | string
    autosize: boolean
    nestedFields: boolean
    tabindexBase: number
    isGenerated: boolean
    last: {
        fetchCtrl: AbortController | null
        fetchOptions: RequestInit | null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors: any[] // any: error objects vary by validation type
        errorsShown?: boolean
        observeResize?: ResizeObserver
    }
    onRequest: ((event: TsEventPayload) => void) | null
    onLoad: ((event: TsEventPayload) => void) | null
    onValidate: ((event: TsEventPayload) => void) | null
    onSubmit: ((event: TsEventPayload) => void) | null
    onProgress: ((event: TsEventPayload) => void) | null
    onSave: ((event: TsEventPayload) => void) | null
    onChange: ((event: TsEventPayload) => void) | null
    onInput: ((event: TsEventPayload) => void) | null
    onRender: ((event: TsEventPayload) => void) | null
    onRefresh: ((event: TsEventPayload) => void) | null
    onResize: ((event: TsEventPayload) => void) | null
    onDestroy: ((event: TsEventPayload) => void) | null
    onAction: ((event: TsEventPayload) => void) | null
    onToolbar: ((event: TsEventPayload) => void) | null
    onError: ((event: TsEventPayload) => void) | null
    msgRefresh: string
    msgSaving: string
    msgServerError: string
    ALL_TYPES: string[]
    LIST_TYPES: string[]
    TsFIELD_TYPES: string[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: Record<string, any>) { // any: options bag is user-supplied
        super(options['name'])
        this.name         = ''
        this.header       = ''
        this.box          = null // HTML element that hold this element
        this.url          = ''
        this.method       = null // if defined, it will be http method when saving
        this.routeData    = {} // data for dynamic routes
        this.formURL      = '' // url where to get form HTML
        this.formHTML     = '' // form HTML (might be loaded from the url)
        this.page         = 0 // current page
        this.pageStyle    = ''
        this.recid        = null // if not null, then load record
        this.fields       = []
        this.actions      = {}
        this.record       = {}
        this.original     = null
        this.dataType     = null // only used when not null, otherwise from TsUtils.settings.dataType
        this.saveCleanRecord = true // if true, it will submit clean record when saving
        this.postData     = {}
        this.httpHeaders  = {}
        this['toolbar']   = {} // if not empty, then it is toolbar
        this['tabs']      = {} // if not empty, then it is tabs object
        this.style        = ''
        this.focus        = 0 // focus first or other element
        this.autosize     = true // autosize, if false the container must have a height set
        this.nestedFields = true // use field name containing dots as separator to look into object
        this.tabindexBase = 0 // this will be added to the auto numbering
        this.isGenerated  = false
        this.last         = {
            fetchCtrl: null,    // last fetch AbortController
            fetchOptions: null, // last fetch options
            errors: []
        }
        this.onRequest    = null
        this.onLoad       = null
        this.onValidate   = null
        this.onSubmit     = null
        this.onProgress   = null
        this.onSave       = null
        this.onChange     = null
        this.onInput      = null
        this.onRender     = null
        this.onRefresh    = null
        this.onResize     = null
        this.onDestroy    = null
        this.onAction     = null
        this.onToolbar    = null
        this.onError      = null
        this.msgRefresh   = 'Loading...'
        this.msgSaving    = 'Saving...'
        this.msgServerError = 'Server error'
        this.ALL_TYPES    = [ 'text', 'textarea', 'email', 'pass', 'password', 'int', 'float', 'money', 'currency',
            'percent', 'hex', 'alphanumeric', 'color', 'date', 'time', 'datetime', 'toggle', 'checkbox', 'radio',
            'check', 'checks', 'list', 'combo', 'enum', 'file', 'select', 'switch', 'map', 'array', 'div', 'custom', 'html',
            'empty', 'columns']
        this.LIST_TYPES = ['select', 'radio', 'check', 'checks', 'list', 'combo', 'enum', 'switch']
        this.TsFIELD_TYPES = ['int', 'float', 'money', 'currency', 'percent', 'hex', 'alphanumeric', 'color',
            'date', 'time', 'datetime', 'list', 'combo', 'enum', 'file']
        // mix in options
        TsUtils.extend(this, options)

        // remember items
        const record   = options['record']
        const original = options['original']
        const fields   = options['fields']
        const toolbar  = options['toolbar']
        let tabs       = options['tabs']
        // extend items
        Object.assign(this, { record: {}, original: null, fields: [], tabs: {}, toolbar: {}, handlers: [] })
        // preprocess fields
        if (fields) {
            const sub = _processFields(fields)
            this.fields = sub.fields
            if (!tabs && sub.tabs.length > 0) {
                tabs = sub.tabs
            }
        }
        // prepare tabs
        if (Array.isArray(tabs)) {
            TsUtils.extend(this.tabs, { tabs: [] })
            for (let t = 0; t < tabs.length; t++) {
                const tmp = tabs[t]
                if (typeof tmp === 'object') {
                    this.tabs.tabs.push(tmp)
                    if (tmp.active === true) {
                        this.tabs.active = tmp.id
                    }
                } else {
                    this.tabs.tabs.push({ id: tmp, text: tmp })
                }
            }
        } else {
            TsUtils.extend(this.tabs, tabs)
        }
        TsUtils.extend(this.toolbar, toolbar)
        for (const p in record) { // it is an object
            if (TsUtils.isPlainObject(record[p])) {
                this.record[p] = TsUtils.clone(record[p])
            } else {
                this.record[p] = record[p]
            }
        }
        for (const p in original) { // it is an object
            if (this.original == null) this.original = {}
            if (TsUtils.isPlainObject(original[p])) {
                this.original[p] = TsUtils.clone(original[p])
            } else {
                this.original[p] = original[p]
            }
        }
        // generate html if necessary
        if (this.formURL !== '') {
            fetch(this.formURL)
                .then(resp => resp.text())
                .then(text => {
                    this.formHTML = text
                    this.isGenerated = true
                    if (this.box) this.render(this.box)
                })
        } else if (!this.formURL && !this.formHTML) {
            this.formHTML    = this.generateHTML() as string
            this.isGenerated = true
        } else if (this.formHTML) {
            this.isGenerated = true
        }

        // render if box specified
        if (typeof this.box == 'string') this.box = query(this.box).get(0) as HTMLElement
        if (this.box) this.render(this.box)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _processFields(fields: any): { fields: any[]; tabs: any[] } { // any: field definitions vary widely
            // any: array of heterogeneous runtime values; TsForm field schema is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newFields: any[] = []
            // any: array of heterogeneous runtime values; TsForm field schema is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tabs: any[] = []
            // if it is an object
            if (TsUtils.isPlainObject(fields)) {
                const tmp = fields
                fields = []
                Object.keys(tmp).forEach((key) => {
                    const fld = tmp[key]
                    if (fld.type == 'group') {
                        fld.text = key
                        if (TsUtils.isPlainObject(fld.fields)) {
                            const tmp2 = fld.fields
                            fld.fields = []
                            Object.keys(tmp2).forEach((key2) => {
                                const fld2 = tmp2[key2]
                                fld2.field = key2
                                fld.fields.push(_process(fld2))

                            })
                        }
                        fields.push(fld)
                    } else if (fld.type == 'tab') {
                        // add tab
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const tab: any = { id: key, text: key } // any: tab shape is dynamic
                        if (fld.style) {
                            tab.style = fld.style
                        }
                        tabs.push(tab)
                        // add page to fields
                        const sub = _processFields(fld.fields).fields
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        sub.forEach((fld2: any) => {
                            fld2.html = fld2.html || {}
                            fld2.html.page = tabs.length -1
                            _process2(fld, fld2)
                        })
                        fields.push(...sub)
                    } else {
                        fld.field = key
                        fields.push(_process(fld))
                    }
                })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function _process(fld: any): any { // any: field shapes vary
                    const ignore = ['html']
                    if (fld.html == null) fld.html = {}
                    Object.keys(fld).forEach((key => {
                        if (ignore.includes(key)) return
                        if (['label', 'attr', 'style', 'text', 'span', 'page', 'column', 'anchor',
                            'group', 'groupStyle', 'groupTitleStyle', 'groupCollapsible'].includes(key)) {
                            fld.html[key] = fld[key]
                            delete fld[key]
                        }
                    }))
                    return fld
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function _process2(fld: any, fld2: any): void { // any: field shapes vary
                    const ignore = ['style', 'html']
                    Object.keys(fld).forEach((key => {
                        if (ignore.includes(key)) return
                        if (['span', 'column', 'attr', 'text', 'label'].includes(key)) {
                            if (fld[key] && !fld2.html[key]) {
                                fld2.html[key] = fld[key]
                            }
                        }
                    }))
                }
            }
            // process groups
            // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fields.forEach((field: any) => {
                if (field.type == 'group') {
                    // group properties
                    const group = {
                        group: field.text || '',
                        groupStyle: field.style || '',
                        groupTitleStyle: field.titleStyle || '',
                        groupCollapsible: field.collapsible === true ? true : false,
                    }
                    // loop through fields
                    if (Array.isArray(field.fields)) {
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        field.fields.forEach((gfield: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const fld = TsUtils.clone(gfield) as any // any: clone returns unknown; field defs are dynamic
                            if (fld.html == null) fld.html = {}
                            TsUtils.extend(fld.html, group)
                            ;['span', 'column', 'attr', 'label', 'page'].forEach((key: string) => {
                                if (fld.html[key] == null && field[key] != null) {
                                    fld.html[key] = field[key]
                                }
                            })
                            if (fld.field == null && fld.name != null) {
                                console.log('NOTICE: form field.name property is deprecated, please use field.field. Field ->', field)
                                fld.field = fld.name
                            }
                            newFields.push(fld)
                        })
                    }
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const fld = TsUtils.clone(field) as any // any: clone returns unknown; field defs are dynamic
                    if (fld.field == null && fld.name != null) {
                        console.log('NOTICE: form field.name property is deprecated, please use field.field. Field ->', field)
                        fld.field = fld.name
                    }
                    newFields.push(fld)
                }
            })
            return { fields: newFields, tabs }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(field?: string, returnIndex?: boolean): any { // any: returns field object or index or array of names
        if (arguments.length === 0) {
            const all: string[] = []
            for (let f1 = 0; f1 < this.fields.length; f1++) {
                if (this.fields[f1].field != null) all.push(this.fields[f1].field)
            }
            return all
        } else {
            for (let f2 = 0; f2 < this.fields.length; f2++) {
                if (this.fields[f2].field == field) {
                    if (returnIndex === true) return f2; else return this.fields[f2]
                }
            }
            return null
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(field: string, obj: Record<string, any>): boolean { // any: obj extends field definition
        for (let f = 0; f < this.fields.length; f++) {
            if (this.fields[f].field == field) {
                TsUtils.extend(this.fields[f] , obj)
                delete this.fields[f].TsField // otherwise options are not updates
                this.refresh(field)
                return true
            }
        }
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValue(field: string, original?: boolean): any { // any: record values vary by field type
        if (this.nestedFields) {
            let val = undefined
            try { // need this to make sure no error in fields
                const rec = original === true ? this.original : this.record
                // any: parameter typed any — runtime dispatch by call site; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                val = String(field).split('.').reduce((rec: any, i: string) => { return rec[i] }, rec)
            } catch (_event) {
            }
            return val
        } else {
            return this.record[field]
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(field: string, value: any, noRefresh?: boolean): boolean { // any: value varies by field type
        // will not refresh the form!
        if (value === '' || value == null
                || (Array.isArray(value) && value.length === 0)
                || (TsUtils.isPlainObject(value) && Object.keys(value).length == 0)) {
            value = null
        }
        if (this.nestedFields) {
            try { // need this to make sure no error in fields
                let rec = this.record
                String(field).split('.').map((fld: string, i: number, arr: string[]) => {
                    if (arr.length - 1 !== i) {
                        if (rec[fld]) rec = rec[fld]; else { rec[fld] = {}; rec = rec[fld] }
                    } else {
                        rec[fld] = value
                    }
                })
                if (!noRefresh) this.setFieldValue(field, value)
                return true
            } catch (_event) {
                return false
            }
        } else {
            this.record[field] = value
            if (!noRefresh) this.setFieldValue(field, value)
            return true
        }
    }

    rememberOriginal(): void {
        // remember original
        if (this.original == null) {
            if (Object.keys(this.record).length > 0) {
                this.original = TsUtils.clone(this.record)
            } else {
                this.original = {}
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFieldValue(name: string): { current: any; previous: any; original: any } | undefined { // any: values vary by field type
        const field = this.get(name)
        if (field == null) return undefined
        const el = field.el
        let previous = this.getValue(name)
        const original = this.getValue(name, true)
        // ordinary input control
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = el.value // any: current value type depends on field type
        // should not be set to '', incosistent logic
        // if (previous == null) previous = ''

        // clean extra chars
        if (['int', 'float', 'percent', 'money', 'currency'].includes(field.type)) {
            current = field.TsField.clean(current)
        }
        // radio list
        if (['radio'].includes(field.type)) {
            const selected = query(el).closest('.tsg-field-group').find('input:checked').get(0)
            if (selected) {
                const item = field.options.items[query(selected).data('index') as number]
                current = item.id
            } else {
                current = null
            }
        }
        // single checkbox
        if (['toggle', 'checkbox'].includes(field.type)) {
            current = (el as HTMLInputElement).checked
        }
        // check list
        if (['check', 'checks'].includes(field.type)) {
            current = []
            const selected = query(el).closest('.tsg-field-group').find('input:checked')
            if (selected.length > 0) {
                selected.each((node: Node) => {
                    const el = node as HTMLElement
                    const item = field.options.items[query(el).data('index') as number]
                    current.push(item.id)
                })
            }
            if (!Array.isArray(previous)) previous = []
        }
        // lists
        const selected = field.TsField?.selected // drop downs and other TsField objects
        if (['list', 'enum', 'file'].includes(field.type) && selected) {
            const nv = selected
            const cv = previous
            if (Array.isArray(nv)) {
                current = []
                for (let i = 0; i < nv.length; i++) current[i] = TsUtils.clone(nv[i]) // clone array
            }
            if (Array.isArray(cv)) {
                previous = []
                for (let i = 0; i < cv.length; i++) previous[i] = TsUtils.clone(cv[i]) // clone array
            }
            if (TsUtils.isPlainObject(nv)) {
                current = TsUtils.clone(nv) // clone object
            }
            if (TsUtils.isPlainObject(cv)) {
                previous = TsUtils.clone(cv) // clone object
            }
        }
        // map, array
        if (['map', 'array'].includes(field.type)) {
            current = (field.type == 'map' ? {} : [])
            field.$el.parent().find('.tsg-map-field').each((div: HTMLElement, _ind: number) => {
                const key = query(div).find('.tsg-map.key').val() as string
                const value = query(div).find('.tsg-map.value').val()
                if (typeof field.html?.render == 'function') {
                    current[_ind] ??= {}
                    query(div).find('input, textarea').each((node: Node) => {
                        const inp = node as HTMLInputElement
                        const name = inp.dataset['name'] ?? inp['name']
                        if (name != null && name != '') {
                            current[_ind][name] = ['checkbox', 'radio'].includes(inp.type) ? inp.checked : inp.value
                        }
                    })
                } else if (field.type == 'map') {
                    current[key] = value
                } else {
                    current.push(value)
                }
            })
        }
        return { current, previous, original } // current - in input, previous - in form.record, original - before form change
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findItem(item: any, items: any[]): any { // any: item and items shapes vary by field type
        return items.find(it => (it.id === item || it.id === item?.id))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue(name: string, value: any): void { // any: value varies by field type
        const field = this.get(name)
        if (field == null) return
        const el = field.el
        switch (field.type) {
            case 'toggle':
            case 'checkbox': {
                (el as HTMLInputElement).checked = value ? true : false
                break
            }
            case 'radio': {
                value = value?.id ?? value
                const inputs = query(el).closest('.tsg-field-group').find('input')
                const items  = field.options.items
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((it: any, ind: number) => { // any: item shapes vary by field
                    const input = inputs.filter(`[data-index="${ind}"]`)
                    if (it.id === value) { // need exact match so to match empty string and 0
                        input.prop('checked', true)
                    } else {
                        input.prop('checked', false)
                    }
                    // show or hide the whole line
                    if (it.hidden === true) {
                        input.closest('.tsg-field-item').hide()
                    } else {
                        input.closest('.tsg-field-item').show()
                    }
                })
                break
            }
            case 'check':
            case 'checks': {
                if (!Array.isArray(value)) {
                    if (value != null) {
                        value = [value]
                    } else {
                        value = []
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value = value.map((val: any) => val?.id ?? val) // any: val can be object or primitive
                const inputs = query(el).closest('div.tsg-field-group').find('input')
                const items  = field.options.items
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((it: any, ind: number) => { // any: item shapes vary
                    const input = inputs.filter(`[data-index="${ind}"]`)
                    input.prop('checked', value.includes(it.id) ? true : false)
                    // show or hide the whole line
                    if (it.hidden === true) {
                        input.closest('.tsg-field-item').hide()
                    } else {
                        input.closest('.tsg-field-item').show()
                    }
                })
                break
            }
            case 'list':
            case 'combo': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let item: any = value // any: list item is { id, text, ... }
                const map = field.options?.itemMap
                /**
                 * if it is a "simple" value, then find item in options.items
                 */
                if (item?.id == null && Array.isArray(field.options?.items)) {
                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    field.options.items.forEach((it: any) => {
                        const val = TsUtils.getNested(it, map?.id ?? 'id')
                        if (val === value) item = it
                    })
                }
                /**
                 * If item.id is there, but item.text is not there, then look up item.text in options.items
                 */
                if (item?.id != null && item?.text == null && Array.isArray(field.options?.items)) {
                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    field.options.items.forEach((it: any) => {
                        const id = TsUtils.getNested(it, map?.id ?? 'id')
                        if (id === item.id) {
                            item.text = TsUtils.getNested(it, map.text ?? 'text')
                        }
                    })
                }
                // if item is found in field.options, update it in the this.records
                if (item != value) {
                    this.setValue(field.name, item, true)
                }
                if (field.type == 'list') {
                    field.TsField.selected = item
                    field.TsField.refresh()
                } else {
                    el.value = item?.text ?? value
                }
                break
            }
            case 'switch': {
                el.value = value
                field.toolbar.uncheck(...field.toolbar.get())
                field.toolbar.check(value)
                break
            }
            case 'enum':
            case 'file': {
                if (!Array.isArray(value)) {
                    value = value != null ? [value] : []
                }
                const items = [...value]
                // find item in options.items, if any
                let updated = false
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((item: any, ind: number) => { // any: item can be primitive or object
                    if (item?.id == null && Array.isArray(field.options.items)) {
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        field.options.items.forEach((it: any) => {
                            if (it.id == item) {
                                items[ind] = it
                                updated = true
                            }
                        })
                    }
                })
                if (updated) {
                    this.setValue(field.name, items, true)
                }
                field.TsField.selected = items
                field.TsField.refresh()
                break
            }
            case 'map':
            case 'array': {
                // init map
                if (field.type == 'map' && (value == null || !TsUtils.isPlainObject(value))) {
                    this.setValue(field.field, {}, true)
                    value = this.getValue(field.field)
                }
                if (field.type == 'array' && (value == null || !Array.isArray(value))) {
                    this.setValue(field.field, [], true)
                    value = this.getValue(field.field)
                }
                const container = query(field.el).parent().find('.tsg-map-container')
                field.el.mapRefresh(value, container)
                break
            }
            case 'div':
            case 'custom': {
                query(el).html(value)
                break
            }
            case 'color': {
                el.value = value ?? ''
                field.TsField.refresh()
                break
            }
            case 'html':
            case 'empty':
                break
            default:
                // all other fields, text, int, float
                if (value != null && el._w2field?.format) {
                    const obj = el._w2field
                    value = obj.format(obj.clean(value))
                }
                el.value = value ?? ''
                break
        }
        // now go through all fields and see if there is a dependent field
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.fields.forEach((fld: any) => { // any: field definition shape
            if (fld?.options?.parentList != null) {
                let updated: boolean | undefined
                let values = this.getValue(fld.options.parentList)
                if (Array.isArray(values)) {
                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    values = values.map((vv: any) => vv.id)
                } else {
                    values = values?.id != null ? [values.id] : []
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fld.options?.items?.forEach?.((item: any) => { // any: item shape varies
                    const parent = TsUtils.getNested(item, fld.options.parentField ?? 'parentId')
                    if (parent == null) {
                        return
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const possible = TsUtils.clone(Array.isArray(parent) ? parent : [parent]) as any[] // any: clone returns unknown; items are dynamic
                    possible.unshift('')
                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const includes = values.some((item: any) => possible.includes(item))
                    if (includes && item.hidden === true) {
                        item.hidden = false
                        updated = true
                    } else if (!includes && item.hidden !== true) {
                        item.hidden = true
                        updated = true
                    }
                })
                if (updated) {
                    let value = this.getValue(fld.field)
                    if (value?.id != null) value = value.id
                    // if item is not visible, then clear its field
                    if (fld.type == 'enum') {
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const valid = fld.options.items.filter((it: any) => !it.hidden).map((it: any) => it.id)
                        let values = this.getValue(fld.field)
                        if (!Array.isArray(values)) values = [values]
                        // make sure they are objects
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        values = values.map((it: any) => {
                            if (typeof it == 'string' || typeof it == 'number') {
                                // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                it = fld.options.items.find((ii: any) => ii.id == it)
                            }
                            return it
                        })
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const new_values = values.filter((it: any) => valid.includes(it.id))
                        this.setValue(fld.field, new_values, true)
                    } else {
                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        fld.options.items.forEach((it: any) => {
                            if (it.id == value && it.hidden) {
                                this.setValue(fld.field, null, true)
                            }
                        })
                    }
                    // set new items
                    this.set(fld.field, { items: fld.options.items })
                }
            }
        })
    }

    show(...args: string[]): string[] {
        const effected: string[] = []
        for (let a = 0; a < args.length; a++) {
            const fld = this.get(args[a])
            if (fld && fld.hidden) {
                fld.hidden = false
                effected.push(fld.field)
            }
        }
        if (effected.length > 0) this.refresh(...effected)
        this.updateEmptyGroups()
        return effected
    }

    hide(...args: string[]): string[] {
        const effected: string[] = []
        for (let a = 0; a < args.length; a++) {
            const fld = this.get(args[a])
            if (fld && !fld.hidden) {
                fld.hidden = true
                effected.push(fld.field)
            }
        }
        if (effected.length > 0) this.refresh(...effected)
        this.updateEmptyGroups()
        return effected
    }

    enable(...args: string[]): string[] {
        const effected: string[] = []
        for (let a = 0; a < args.length; a++) {
            const fld = this.get(args[a])
            if (fld && fld.disabled) {
                fld.disabled = false
                effected.push(fld.field)
            }
        }
        if (effected.length > 0) this.refresh(...effected)
        return effected
    }

    disable(...args: string[]): string[] {
        const effected: string[] = []
        for (let a = 0; a < args.length; a++) {
            const fld = this.get(args[a])
            if (fld && !fld.disabled) {
                fld.disabled = true
                effected.push(fld.field)
            }
        }
        if (effected.length > 0) this.refresh(...effected)
        return effected
    }

    updateEmptyGroups(): void {
        // hide empty groups
        query(this.box).find('.tsg-group').each((node: Node) =>{
            const group = node as HTMLElement
            if (isHidden(query(group).find('.tsg-field'))) {
                query(group).hide()
            } else {
                query(group).show()
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function isHidden($els: any): boolean { // any: $els is a Query object
            let flag = true
            $els.each((node: Node) => {
                const el = node as HTMLElement
                if (el.style.display != 'none') flag = false
            })
            return flag
        }
    }

    hideGroup(groupName: string): void {
        const fields: string[] = []
        let current = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.fields.forEach((fld: any) => { // any: field definition
            if (fld.html.group != null && fld.html.group !== '') {
                current = String(fld.html.group).toLowerCase()
            }
            if (groupName.toLowerCase() == current) {
                fields.push(fld.field)
            }
        })
        this.hide(...fields)
        this.resize()
    }

    showGroup(groupName: string): void {
        const fields: string[] = []
        let current = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.fields.forEach((fld: any) => { // any: field definition
            if (fld.html.group != null && fld.html.group !== '') {
                current = String(fld.html.group).toLowerCase()
            }
            if (groupName.toLowerCase() == current) {
                fields.push(fld.field)
            }
        })
        this.show(...fields)
        this.resize()
    }

    /**
     * When user clicks on group title, it will toggle the group (collapse or expand it).
     */
    toggleGroup(groupName: string, show?: boolean): void {
        const el = query(this.box).find('.tsg-group-title[data-group="' + TsUtils.base64encode(groupName) + '"]')
        if (el.length === 0) return
        const el_next = query(el.prop('nextElementSibling'))
        if (typeof show === 'undefined') {
            show = (el_next.css('display') == 'none')
        }
        if (show) {
            el_next.show()
            el.find('span').addClass('tsg-icon-collapse').removeClass('tsg-icon-expand')
        } else {
            el_next.hide()
            el.find('span').addClass('tsg-icon-expand').removeClass('tsg-icon-collapse')
        }
    }

    change(...args: string[]): void {
        args.forEach((field) => {
            const tmp = this.get(field)
            if (tmp.$el) tmp.$el.change()
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reload(callBack?: (() => void)): Promise<any> { // any: promise resolves with server data
        const url = (typeof this.url !== 'object' ? this.url : this.url.get)
        if (url && this.recid != null) {
            // this.clear();
            // any: generic any — runtime polymorphic; TsForm field schema is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return this.request(callBack) as Promise<any> // request() is void | Promise; url+recid guarantee it returns Promise
        } else {
            // this.refresh(); // no need to refresh
            if (typeof callBack === 'function') callBack()
            return new Promise(resolve => { resolve(undefined) }) // resolved promise
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clear(...args: any[]): void { // any: args are field names or nothing
        if (args.length != 0) {
            args.forEach((field) => {
                let rec = this.record
                String(field).split('.').map((fld: string, i: number, arr: string[]) => {
                    if (arr.length - 1 !== i) rec = rec[fld]; else delete rec[fld]
                })
                this.refresh(field)
            })
        } else {
            this.recid = null
            this.record = {}
            this.original = null
            this.refresh()
            this.hideErrors()
        }
    }

    error(msg: string): void {
        // let the management of the error outside of the form
        const edata = this.trigger('error', {
            target: this.name,
            message: msg,
            fetchCtrl: this.last.fetchCtrl,
            fetchOptions: this.last.fetchOptions
        })
        if (edata.isCancelled === true) return
        // need a time out because message might be already up)
        setTimeout(() => { this.message(msg) }, 1)
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message(options: any): any { // any: options is a TsUtils.message config object
        return TsUtils.message({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            owner: this as any, // any: TsForm has [key:string]:any but TS can't verify lock/unlock signature match
            box  : this.box,
            after: '.tsg-form-header'
        }, options)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confirm(options: any): any { // any: options is a TsUtils.confirm config object
        return TsUtils.confirm({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            owner: this as any, // any: same as message() above
            box  : this.box,
            after: '.tsg-form-header'
        }, options)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(showErrors?: boolean): any[] | undefined { // any: error objects vary by field type
        if (showErrors == null) showErrors = true
        // validate before saving
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: any[] = [] // any: error shape varies by validation
        for (let f = 0; f < this.fields.length; f++) {
            const field = this.fields[f]
            if (field.type == 'columns' || field.field == null) {
                continue
            }
            if (this.getValue(field.field) == null) this.setValue(field.field, '')
            if (['int', 'float', 'currency', 'money'].includes(field.type)) {
                const val = this.getValue(field.field)
                const min = field.options.min
                const max = field.options.max
                if (min != null && val != null && val < min) {
                    errors.push({ field: field, error: TsUtils.lang('Should be more than ${min}', { min }) })
                }
                if (max != null && val != null && val > max) {
                    errors.push({ field: field, error: TsUtils.lang('Should be less than ${max}', { max }) })
                }
            }
            switch (field.type) {
                case 'alphanumeric':
                    if (this.getValue(field.field) && !TsUtils.isAlphaNumeric(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not alpha-numeric') })
                    }
                    break
                case 'int':
                    if (this.getValue(field.field) && !TsUtils.isInt(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not an integer') })
                    }
                    break
                case 'percent':
                case 'float':
                    if (this.getValue(field.field) && !TsUtils.isFloat(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not a float') })
                    }
                    break
                case 'currency':
                case 'money':
                    if (this.getValue(field.field) && !TsUtils.isMoney(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not in money format') })
                    }
                    break
                case 'color':
                case 'hex':
                    if (this.getValue(field.field) && !TsUtils.isHex(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not a hex number') })
                    }
                    break
                case 'email':
                    if (this.getValue(field.field) && !TsUtils.isEmail(this.getValue(field.field))) {
                        errors.push({ field: field, error: TsUtils.lang('Not a valid email') })
                    }
                    break
                case 'checkbox':
                    // convert true/false
                    if (this.getValue(field.field) == true) {
                        this.setValue(field.field, true)
                    } else {
                        this.setValue(field.field, false)
                    }
                    break
                case 'date':
                    // format date before submit
                    if (!field.options.format) field.options.format = TsUtils.settings.dateFormat
                    if (this.getValue(field.field) && !TsUtils.isDate(this.getValue(field.field), field.options.format)) {
                        errors.push({ field: field, error: TsUtils.lang('Not a valid date') + ': ' + field.options.format })
                    }
                    break
                case 'list':
                case 'combo':
                case 'switch':
                    break
                case 'enum':
                    break
            }
            // === check required - if field is '0' it should be considered not empty
            const val = this.getValue(field.field)
            if (field.hidden !== true && field.required
                    && !['div', 'custom', 'html', 'empty'].includes(field.type)
                    && (val == null || val === '' || (Array.isArray(val) && val.length === 0)
                        || (TsUtils.isPlainObject(val) && Object.keys(val).length == 0))) {
                errors.push({ field: field, error: TsUtils.lang('Required field') })
            }
            if (field.hidden !== true && field.options?.minLength > 0
                    && !['enum', 'list', 'combo'].includes(field.type) // since minLength is used there for other purpose
                    && (val == null || val.length < field.options.minLength)) {
                errors.push({ field: field, error: TsUtils.lang('Field should be at least ${count} characters.',
                    { count: field.options.minLength })})
            }
        }
        // event before
        const edata = this.trigger('validate', { target: this.name, errors: errors })
        if (edata.isCancelled === true) return
        // show error
        this.last.errors = errors
        if (showErrors) this.showErrors()
        // event after
        edata.finish()
        return errors
    }

    showErrors(): void {
        // TODO: check edge cases
        // -- invisible pages
        // -- form refresh
        const errors = this.last.errors
        if (errors.length <= 0) return
        // show errors
        this.goto(errors[0].field.page)
        ;(query(errors[0].field.$el).parents('.tsg-field').get(0) as Element).scrollIntoView({ block: 'nearest', inline: 'nearest' })
        // show errors
        // show only for visible controls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors.forEach((error: any) => { // any: error shape varies
            const opt = TsUtils.extend({
                anchorClass: 'tsg-error',
                class: 'tsg-light',
                position: 'right|left',
                hideOn: ['input', 'tooltip-click']
            }, error.options)
            if (error.field == null) return
            let anchor = error.field.el
            if (error.field.type === 'radio') { // for radio and checkboxes
                anchor = query(error.field.el).closest('div').get(0)
            } else if (['enum', 'file'].includes(error.field.type)) {
                // TODO: check
                // anchor = (error.field.el).data('TsField').helpers.multi
                // $(fld).addClass('tsg-error')
            }
            TsTooltip.show(TsUtils.extend({
                anchor,
                name: `${this.name}-${error.field.field}-error`,
                html: error.error
            }, opt))
        })
        // on scroll update errors so they will appear in correct places
        this.last.errorsShown = true
        query(errors[0].field.$el).parents('.tsg-page')
            .off('.hideErrors')
            .on('scroll.hideErrors', (_evt: Event) => {
                if (this.last.errorsShown) {
                    this.showErrors()
                }
            })
    }

    hideErrors(): void {
        this.last.errorsShown = false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.fields.forEach((field: any) => { // any: field definition
            TsTooltip.hide(`${this.name}-${field.field}-error`)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getChanges(): Record<string, any> | null { // any: diff values vary by field type
        // TODO: not working on nested structures
        // any: Record<string, any> — dynamic property bag; TsForm field schema is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let diff: Record<string, any> = {}
        if (this.original != null && typeof this.original == 'object' && Object.keys(this.record).length !== 0) {
            diff = doDiff(this.record, this.original, {})
        }
        return diff

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function doDiff(record: any, original: any, result: any): any { // any: record/original/result shapes vary
            if (Array.isArray(record) && Array.isArray(original)) {
                while (record.length < original.length) {
                    record.push(null)
                }
            }
            for (const i in record) {
                if (record[i] != null && typeof record[i] === 'object') {
                    result[i] = doDiff(record[i], original[i] || {}, {})
                    if (!result[i] || (Object.keys(result[i]).length == 0 && Object.keys(original[i].length == 0))) delete result[i]
                } else if (record[i] != original[i] || (record[i] == null && original[i] != null)) { // also catch field clear
                    result[i] = record[i]
                }
            }
            return Object.keys(result).length != 0 ? result : null
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCleanRecord(strict?: boolean): Record<string, any> { // any: record values vary by field type
        const data = TsUtils.clone(this.record)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.fields.forEach((fld: any) => { // any: field definition
            if (fld.type == 'columns' || fld.field == null) {
                return
            }
            if (['list', 'combo', 'enum'].includes(fld.type)) {
                const tmp = { nestedFields: true, record: data }
                const val = this.getValue.call(tmp, fld.field)
                if (TsUtils.isPlainObject(val) && val.id != null) { // should be true if val.id === ''
                    this.setValue.call(tmp, fld.field, val.id)
                }
                if (Array.isArray(val)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    val.forEach((item: any, ind: number) => { // any: item shape varies
                        if (TsUtils.isPlainObject(item) && item.id) {
                            val[ind] = item.id
                        }
                    })
                }
            }
            if (fld.type == 'map') {
                const tmp = { nestedFields: true, record: data }
                const val = this.getValue.call(tmp, fld.field)
                if (val._order) delete val._order
            }
            if (fld.type == 'file') {
                const tmp = { nestedFields: true, record: data }
                const val = this.getValue.call(tmp, fld.field) ?? []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                val.forEach((v: any) => { // any: file item shape
                    delete v.file
                    delete v.modified
                })
                this.setValue.call(tmp, fld.field, val)
            }
        })
        // return only records present in fields
        if (strict === true) {
            Object.keys(data).forEach((key) => {
                if (!this.get(key)) delete data[key]
            })
        }
        return data
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request(postData?: any, callBack?: (data: any) => void): Promise<any> | void { // any: postData/data shapes vary by server API
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this // no-this-alias: used in nested function processError() which is a regular function declaration (rebinds `this`)
        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolve: (value: any) => void, reject: (reason?: any) => void
        const responseProm = new Promise((res, rej) => { resolve = res; reject = rej })
        // check for multiple params
        if (typeof postData === 'function') {
            callBack = postData
            postData = null
        }
        if (postData == null) postData = {}
        if (!this.url || (typeof this.url === 'object' && !this.url.get)) return
        // build parameters list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {} // any: params bag is built dynamically
        // add list params
        params.action = 'get'
        params.recid = this.recid
        params.name  = this.name
        // append other params
        TsUtils.extend(params, this.postData)
        TsUtils.extend(params, postData)
        // event before
        const edata = this.trigger('request', { target: this.name, url: this.url, httpMethod: 'GET',
            postData: params, httpHeaders: this.httpHeaders })
        if (edata.isCancelled === true) return
        // default action
        this.record = {}
        this.original = null
        // call server to get data
        this.lock(TsUtils.lang(this.msgRefresh))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let url: any = edata.detail['url'] // any: url can be string or object with .get/.save
        if (typeof url === 'object' && url.get) url = url.get
        if (this.last.fetchCtrl) try { this.last.fetchCtrl.abort() } catch (_e) {}
        // process url with routeData
        if (Object.keys(this.routeData).length != 0) {
            const info = TsUtils.parseRoute(url)
            if (info.keys.length > 0) {
                for (let k = 0; k < info.keys.length; k++) {
                    const routeKey = info.keys[k]
                    if (routeKey == null || this.routeData[routeKey.name] == null) continue
                    url = url.replace((new RegExp(':'+ routeKey.name, 'g')), this.routeData[routeKey.name])
                }
            }
        }
        url = new URL(url, location.href)
        const fetchOptions = TsUtils.prepareParams(url, {
            method: edata.detail['httpMethod'],
            headers: edata.detail['httpHeaders'],
            body: edata.detail['postData']
        }, { dataType: this.dataType, caller: this, action: 'request' })
        this.last.fetchCtrl = new AbortController()
        fetchOptions['signal'] = this.last.fetchCtrl.signal
        this.last.fetchOptions = fetchOptions
        fetch(url, fetchOptions)
            .catch(processError)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((resp: any) => { // any: after .catch(), type is void|Response; cast to any to access status/json safely
                if (resp?.status != 200) {
                    // if resp is undefined, it means request was aborted
                    if (resp) processError(resp)
                    return
                }
                resp.json()
                    .catch(processError)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((data: any) => { // any: server response shape varies by API
                        // event before
                        const edata = self.trigger('load', {
                            target: self.name,
                            fetchCtrl: self.last.fetchCtrl,
                            fetchOptions: self.last.fetchOptions,
                            data
                        })
                        if (edata.isCancelled === true) return
                        // for backward compatibility
                        if (data.error == null && data.status === 'error') {
                            data.error = true
                        }
                        // if data.record is not present, then assume that entire response is the record
                        if (!data.record) {
                            Object.assign(data, { record: TsUtils.clone(data) })
                        }
                        // server response error, not due to network issues
                        if (data.error === true) {
                            self.error(TsUtils.lang(data.message ?? self.msgServerError))
                        } else {
                            self.record = TsUtils.clone(data.record)
                        }
                        // event after
                        self.unlock()
                        edata.finish()
                        self.refresh()
                        self.setFocus()
                        // call back
                        if (typeof callBack === 'function') callBack(data)
                        resolve(data)
                    })
            })
        // event after
        edata.finish()
        return responseProm

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function processError(response: any): void { // any: response is Response or Error depending on failure mode
            if (response.name === 'AbortError') {
                // request was aborted by the form
                return
            }
            self.unlock()
            // trigger event
            const edata2 = self.trigger('error', { response, fetchCtrl: self.last.fetchCtrl, fetchOptions: self.last.fetchOptions })
            if (edata2.isCancelled === true) return
            // default behavior
            if (response.status && response.status != 200) {
                self.error(response.status + ': ' + response.statusText)
            } else {
                console.log('ERROR: Server request failed.', response, '. ',
                    'Expected Response:', { error: false, record: { field1: 1, field2: 'item' }},
                    'OR:', { error: true, message: 'Error description' })
                self.error(String(response))
            }
            // event after
            edata2.finish()
            reject(response)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submit(postData?: any, callBack?: (data: any) => void): Promise<any> | void { // any: matches save()
        return this.save(postData, callBack)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save(postData?: any, callBack?: (data: any) => void): Promise<any> | void { // any: postData/data shapes vary
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this // no-this-alias: used in nested function processError() which is a regular function declaration (rebinds `this`)
        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resolve: (value: any) => void, reject: (reason?: any) => void
        const saveProm = new Promise((res, rej) => { resolve = res; reject = rej })
        // check for multiple params
        if (typeof postData === 'function') {
            callBack = postData
            postData = null
        }
        // validation
        const errors = self.validate(true)
        if ((errors?.length ?? 0) !== 0) return
        // submit save
        if (postData == null) postData = {}
        if (!self.url || (typeof self.url === 'object' && !self.url.save)) {
            console.log('ERROR: Form cannot be saved because no url is defined.')
            return
        }
        self.lock(TsUtils.lang(self.msgSaving) + ' <span id="'+ self.name +'_progress"></span>')
        // build parameters list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {} // any: params bag built dynamically
        // add list params
        params.action = 'save'
        params.recid = self.recid
        params.name = self.name
        // append other params
        TsUtils.extend(params, self.postData)
        TsUtils.extend(params, postData)
        params.record = TsUtils.clone(self.saveCleanRecord ? self.getCleanRecord() : self.record)
        // event before
        const edata = self.trigger('submit', { target: self.name, url: self.url, httpMethod: this.method ?? 'POST',
            postData: params, httpHeaders: self.httpHeaders })
        if (edata.isCancelled === true) return
        // default action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let url: any = edata.detail['url'] // any: url can be string or object
        if (typeof url === 'object' && url.save) url = url.save
        if (self.last.fetchCtrl) self.last.fetchCtrl.abort()
        // process url with routeData
        if (Object.keys(self.routeData).length > 0) {
            const info = TsUtils.parseRoute(url)
            if (info.keys.length > 0) {
                for (let k = 0; k < info.keys.length; k++) {
                    const routeKey = info.keys[k]
                    if (routeKey == null || self.routeData[routeKey.name] == null) continue
                    url = url.replace((new RegExp(':'+ routeKey.name, 'g')), self.routeData[routeKey.name])
                }
            }
        }
        url = new URL(url, location.href)
        const fetchOptions = TsUtils.prepareParams(url, {
            method: edata.detail['httpMethod'],
            headers: edata.detail['httpHeaders'],
            body: edata.detail['postData']
        }, { dataType: this.dataType, caller: this, action: 'save' })
        this.last.fetchCtrl = new AbortController()
        fetchOptions['signal'] = this.last.fetchCtrl.signal
        this.last.fetchOptions = fetchOptions
        fetch(url, fetchOptions)
            .catch(processError)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((resp: any) => { // any: after .catch(), type is void|Response; cast to any for safe access
                self.unlock()
                if (resp?.status != 200) {
                    processError(resp ?? {})
                    return
                }
                // parse server response
                resp.json()
                    .catch(processError)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((data: any) => { // any: server response shape varies
                        // event before
                        const edata = self.trigger('save', {
                            target: self.name,
                            fetchCtrl: self.last.fetchCtrl,
                            fetchOptions: self.last.fetchOptions,
                            data
                        })
                        if (edata.isCancelled === true) return
                        // server error, not due to network issues
                        if (data.error === true) {
                            self.error(TsUtils.lang(data.message ?? self.msgServerError))
                        } else {
                            self.original = null
                        }
                        // event after
                        edata.finish()
                        self.refresh()
                        // call back
                        if (typeof callBack === 'function') callBack(data)
                        resolve(data)
                    })
            })
        // event after
        edata.finish()
        return saveProm

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function processError(response: any): void { // any: response is Response or Error
            if (response?.name === 'AbortError') {
                // request was aborted by the form
                return
            }
            self.unlock()
            // trigger event
            const edata2 = self.trigger('error', { response, fetchCtrl: self.last.fetchCtrl, fetchOptions: self.last.fetchOptions })
            if (edata2.isCancelled === true) return
            // default behavior
            if (response.status && response.status != 200) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response.json().then((data: any) => { // any: error response body
                    // BUG FIX: original code used `?? response.statusText` which was unreachable
                    // because string concatenation (response.status + ': ' + data.message) always
                    // produces a non-null string even when data.message is undefined/null.
                    // Fixed: use `|| response.statusText` to fall back when data.message is falsy.
                    self.error(response.status + ': ' + (data.message || response.statusText))
                }).catch(() => {
                    self.error(response.status + ': ' + response.statusText)
                })
            } else {
                console.log('ERROR: Server request failed.', response, '. ',
                    'Expected Response:', { error: false, record: { field1: 1, field2: 'item' }},
                    'OR:', { error: true, message: 'Error description' })
                self.error(String(response))
            }
            // event after
            edata2.finish()
            reject()
        }
    }

    lock(msg: string, showSpinner?: boolean): void {
        TsUtils.lock(this.box, msg, showSpinner)
    }

    unlock(speed?: number): void {
        const box = this.box
        TsUtils.unlock(box, speed)
    }

    lockPage(page: number, msg?: string, spinner?: boolean): boolean {
        const $page = query(this.box).find('.page-' + page)
        if ($page.length){
            // page found
            TsUtils.lock($page, msg, spinner)
            return true
        }
        // page with this id not found!
        return false
    }

    unlockPage(page: number, speed?: number): boolean {
        const $page = query(this.box).find('.page-' + page)
        if ($page.length) {
            // page found
            TsUtils.unlock($page, speed)
            return true
        }
        // page with this id not found!
        return false
    }

    goto(page: number): void {
        if (this.page === page) return // already on this page
        if (page != null) this.page = page
        // if it was auto size, resize it
        if (query(this.box).data('autoSize') === true) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (query(this.box).get(0) as any).clientHeight = 0 // any: clientHeight is read-only but set for autosize
        }
        this.refresh()
    }

    generateHTML(): string | false {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pages: any[] = [] // any: page structure is built dynamically
        let group = ''
        let page: number | undefined
        let column: number | undefined
        let tabindex: number
        let tabindex_str: string
        for (let f = 0; f < this.fields.length; f++) {
            let html = ''
            tabindex = this.tabindexBase + f + 1
            tabindex_str = ' tabindex="'+ tabindex +'"'
            const field = this.fields[f]
            if (field.html == null) field.html = {}
            if (typeof field.html == 'string') {
                field.html = {
                    html: field.html,
                    span: 0,
                    attr: 'tabindex'
                }
                tabindex_str = ''
            }
            if (field.options == null) field.options = {}
            if (field.html.caption != null && field.html.label == null) {
                console.log('NOTICE: form field.html.caption property is deprecated, please use field.html.label. Field ->', field)
                field.html.label = field.html.caption
            }
            if (field.html.label == null) field.html.label = field.field
            if (field.html.anchor != null && field.html.span == null) {
                field.html.span = ''
            }
            field.html = TsUtils.extend({ label: '', span: 6, attr: '', text: '', style: '', page: 0, column: 0 }, field.html)
            if (page == null) page = field.html.page
            if (column == null) column = field.html.column
            // input control
            let input = `<input id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" type="text" ${field.html.attr + tabindex_str}>`
            switch (field.type) {
                case 'pass':
                case 'password':
                    input = input.replace('type="text"', 'type="password"')
                    break
                case 'checkbox': {
                    input = `
                        <label class="tsg-box-label">
                            <input id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" type="checkbox" ${field.html.attr + tabindex_str}>
                            <span>${field.html.label}</span>
                        </label>`
                    break
                }
                case 'check':
                case 'checks': {
                    if (field.options.items == null && field.html.items != null) field.options.items = field.html.items
                    let items = field.options.items
                    input = `<div class="tsg-field-group" ${field.html.attr}>`
                    // normalized options
                    if (!Array.isArray(items)) items = []
                    if (items.length > 0) {
                        items = TsUtils.normMenu.call(this, items, field.options)
                    }
                    // generate
                    for (let i = 0; i < items.length; i++) {
                        input += `
                            <div class="tsg-field-item">
                                <label class="tsg-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" type="checkbox"
                                        ${tabindex_str} data-value="${items[i].id}" data-index="${i}">
                                    <span>&#160;${items[i].text}</span>
                                </label>
                            </div>`
                    }
                    input += '</div>'
                    break
                }
                case 'radio': {
                    input = `<div class="tsg-field-group"${field.html.attr}>`
                    // normalized options
                    if (field.options.items == null && field.html.items != null) field.options.items = field.html.items
                    let items = field.options.items
                    if (!Array.isArray(items)) items = []
                    if (items.length > 0) {
                        items = TsUtils.normMenu.call(this, items, field.options)
                    }
                    // generate
                    for (let i = 0; i < items.length; i++) {
                        input += `
                            <div class="tsg-field-item">
                                <label class="tsg-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" type="radio"
                                        ${(i === 0 ? tabindex_str : '')}
                                        data-value="${items[i].id}" data-index="${i}">
                                    <span>&#160;${items[i].text}</span>
                                </label>
                            </div>`
                    }
                    input += '</div>'
                    break
                }
                case 'select': {
                    input = `<select id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" ${field.html.attr + tabindex_str}>`
                    // normalized options
                    if (field.options.items == null && field.html.items != null) field.options.items = field.html.items
                    let items = field.options.items
                    if (!Array.isArray(items)) items = []
                    if (items.length > 0) {
                        items = TsUtils.normMenu.call(this, items, field.options)
                    }
                    // generate
                    for (let i = 0; i < items.length; i++) {
                        input += `<option value="${items[i].id}">${items[i].text}</option>`
                    }
                    input += '</select>'
                    break
                }
                case 'switch': {
                    input = `
                        <div>
                            <div id="${field.field}-tb" class="tsg-form-switch ${field.html.class ?? ''}" ${field.html.attr}></div>
                            <input id="${field.field}" name="${field.field}" ${tabindex_str} class="tsg-input"
                                style="position: absolute; right: 0px; margin-top: -30px; width: 1px; padding: 0; opacity: 0">
                            <span style="position: absolute; margin-top: -2px;">${field.html.text ?? ''}</span>
                        </div>
                        `
                    break
                }
                case 'textarea':
                    input = `<textarea id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ''}" ${field.html.attr + tabindex_str}></textarea>`
                    break
                case 'toggle':
                    input = `<input id="${field.field}" name="${field.field}" class="tsg-input tsg-toggle  ${field.html.class ?? ''}"
                                type="checkbox" ${field.html.attr + tabindex_str}>
                            <div><div></div></div>`
                    break
                case 'map':
                case 'array':
                    field.html.key = field.html.key || {}
                    field.html.value = field.html.value || {}
                    field.html.tabindex = tabindex
                    field.html.tabindex_str = tabindex_str
                    input = '<span style="float: right">' + (field.html.text || '') + '</span>' +
                            '<input id="'+ field.field +'" name="'+ field.field +'" type="hidden" '+ field.html.attr + tabindex_str + '>'+
                            '<div class="tsg-map-container"></div>'
                    break
                case 'div':
                case 'custom':
                    input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="tsg-input ${field.html.class ?? ''}">`+
                                (field && field.html && field.html.html ? field.html.html : '') +
                            '</div>'
                    break
                case 'html':
                case 'empty':
                    input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="tsg-input ${field.html.class ?? ''}">`+
                                (field && field.html ? (field.html.html || '') + (field.html.text || '') : '') +
                            '</div>'
                    break
            }
            if (group !== '') {
                if (page != field.html.page || column != field.html.column || (field.html.group && (group != field.html.group))) {
                    pages[page!][column!] += '\n   </div>\n  </div>'
                    group                = ''
                }
            }
            if (field.html.group && (group != field.html.group)) {
                let collapsible = ''
                if (field.html.groupCollapsible) {
                    collapsible = '<span class="tsg-icon-collapse" style="width: 15px; display: inline-block; position: relative; top: -2px;"></span>'
                }
                html += '\n <div class="tsg-group">'
                    + '\n   <div class="tsg-group-title tsg-eaction" style="'+ (field.html.groupTitleStyle || '') + '; '
                                    + (collapsible != '' ? 'cursor: pointer; user-select: none' : '') + '"'
                    + (collapsible != '' ? 'data-group="' + TsUtils.base64encode(field.html.group) + '"' : '')
                    + (collapsible != ''
                        ? 'data-click="toggleGroup|' + field.html.group + '"'
                        : '')
                    + '>'
                    + collapsible + TsUtils.lang(field.html.group) + '</div>\n'
                    + '   <div class="tsg-group-fields" style="'+ (field.html.groupStyle || '') +'">'
                group = field.html.group
            }
            if (field.type == 'columns') {
                html += `<div class="tsg-field-columns" style="${field.style ?? ''}">`
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                field.columns.forEach((col: any) => { // any: column definition varies
                    html += `<div style="${col.style}"> ${col.content} </div>`
                })
                html += '</div>'
            } else if (field.html.col_anchor != null) {
                let span = (field.html.span != null ? 'tsg-span'+ field.html.span : '')
                if (field.html.span == -1) span = 'tsg-span-none'
                let label = `
                    <label ${span == 'none' ? ' style="display: none"' : ''}>
                        ${TsUtils.lang(field.type != 'checkbox' ? field.html.label : field.html.text)}
                    </label>`
                if (!field.html.label) label = ''
                const text = (field.type != 'array' && field.type != 'map' ? TsUtils.lang(field.type != 'checkbox' ? field.html.text : '') : '')
                pages[field.html.page].anchors ??= {}
                pages[field.html.page].anchors[field.html.col_anchor] =`
                    <div class="tsg-field ${span}" style="${(field.hidden ? 'display: none;' : '') + field.html.style}">
                        ${label}
                        ${['empty', 'switch', 'radio', 'check', 'checks'].includes(field.type)
                            ? input
                            : `<div>${input + text}</div>`
                        }
                    </div>`
            } else if (field.html.anchor != null) {
                const span = (field.html.span != null ? 'tsg-span'+ field.html.span : 'tsg-span0')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let label = TsUtils.lang(field.type != 'checkbox' ? field.html.label : field.html.text, true as any) // any: second arg is suppress-warning flag in runtime JS but typed as Record
                const text = TsUtils.lang(field.type != 'checkbox' ? field.html.text : '')
                if (field.html.span == -1) {
                    label = `<span style="position: absolute"> <span class="tsg-anchor-span-none tsg-inline-label"> ${label} </span> </span>`
                } else {
                    label = `<span class="tsg-inline-label"> ${label} </span>`
                }
                pages[field.html.page].anchors ??= {}
                pages[field.html.page].anchors[field.html.anchor] = `
                    <div class="tsg-field tsg-field-inline ${span}" style="${(field.hidden ? 'display: none;' : '') + field.html.style}">
                        ${((field.type === 'empty' || field.type == 'switch')
                            ? input
                            : ` <div>
                                    ${label} ${input} ${text}
                                </div>`
    )}
                    </div>`
            } else {
                let span = (field.html.span != null ? 'tsg-span'+ field.html.span : '')
                if (field.html.span == -1) span = 'tsg-span-none'
                let label = `
                    <label ${span == 'none' ? ' style="display: none"' : ''}>
                        ${TsUtils.lang(field.type != 'checkbox' ? field.html.label : field.html.text)}
                    </label>`
                if (!field.html.label) label = ''
                const text = (field.type != 'array' && field.type != 'map' ? TsUtils.lang(field.type != 'checkbox' ? field.html.text : '') : '')
                html += `
                    <div class="tsg-field ${span}" style="${(field.hidden ? 'display: none;' : '') + field.html.style}">
                        ${label}
                        ${['empty', 'switch', 'radio', 'check', 'checks'].includes(field.type)
                            ? input
                            : `<div>${input + text}</div>`
                        }
                    </div>`
            }
            if (pages[field.html.page] == null) pages[field.html.page] = {}
            if (pages[field.html.page][field.html.column] == null) pages[field.html.page][field.html.column] = ''
            pages[field.html.page][field.html.column] += html
            page   = field.html.page
            column = field.html.column
        }
        if (group !== '') pages[page!][column!] += '\n   </div>\n  </div>'
        if (this.tabs.tabs) {
            for (let i = 0; i < this.tabs.tabs.length; i++) if (pages[i] == null) pages[i] = []
        }
        // buttons if any
        let buttons = ''
        if (Object.keys(this.actions).length > 0) {
            buttons += '\n<div class="tsg-buttons">'
            tabindex = this.tabindexBase + this.fields.length + 1

            for (const a in this.actions) { // it is an object
                const act  = this.actions[a]
                const info: { text: string; style: string; class: string } = { text: '', style: '', 'class': '' }
                if (TsUtils.isPlainObject(act)) {
                    if (act.text == null && act.caption != null) {
                        console.log('NOTICE: form action.caption property is deprecated, please use action.text. Action ->', act)
                        act.text = act.caption
                    }
                    if (act.text) info.text = act.text
                    if (act.style) info.style = act.style
                    if (act.class) info.class = act.class
                } else {
                    info.text = a
                    if (['save', 'update', 'create'].includes(a.toLowerCase())) info.class = 'tsg-btn-blue'; else info.class = ''
                }
                buttons += '\n    <button name="'+ a +'" class="tsg-btn '+ info.class +'" style="'+ info.style +'" tabindex="'+ tabindex +'">'+
                                        TsUtils.lang(info.text) +'</button>'
                tabindex++
            }
            buttons += '\n</div>'
        }
        let html = ''
        for (let p = 0; p < pages.length; p++){
            html += '<div class="tsg-page page-'+ p +'" style="' + (p !== 0 ? 'display: none;' : '') + this.pageStyle + '">'
            if (!pages[p]) {
                console.log(`ERROR: Page ${p} does not exist`)
                return false
            }
            if (pages[p].before) {
                html += pages[p].before
            }
            html += '<div class="tsg-column-container">'
            Object.keys(pages[p]).sort().forEach((c: string, _ind: number) => {
                if (c == String(parseInt(c))) {
                    html += '<div class="tsg-column col-'+ c +'">' + (pages[p][c] || '') + '\n</div>'
                }
            })
            html += '\n</div>'
            if (pages[p].after) {
                html += pages[p].after
            }
            html += '\n</div>'
            // process page anchors
            if (pages[p].anchors) {
                Object.keys(pages[p].anchors).forEach((key: string, _ind: number) => {
                    html = html.replace(key, pages[p].anchors[key])
                })
            }
        }
        html += buttons
        return html
    }

    action(action: string, event: Event): void {
        const act   = this.actions[action]
        let click = act
        if (TsUtils.isPlainObject(act) && act.onClick) click = act.onClick
        // event before
        const edata = this.trigger('action', { target: action, action: act, originalEvent: event })
        if (edata.isCancelled === true) return
        // default actions
        if (typeof click === 'function') click.call(this, event)
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAction(action: string): any { // any: returns Query object
        const ret = query(this.box).find('.tsg-buttons button[name="' + action + '"]')
        if (ret.length === 0) {
            console.log('ERROR: Action "' + action + '" not found. Valid actions are: ' + Object.keys(this.actions).join(', '))
        }
        return ret
    }

    actionHide(action: string): void {
        this.getAction(action).hide()
    }

    actionShow(action: string): void {
        this.getAction(action).show()
    }

    actionDisable(action: string): void {
        this.getAction(action).prop('disabled', true)
    }

    actionEnable(action: string): void {
        this.getAction(action).prop('disabled', false)
    }

    resize(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this // no-this-alias: used in nested function resizeElements() which is a regular function declaration (rebinds `this`)
        // event before
        const edata = this.trigger('resize', { target: this.name })
        if (edata.isCancelled === true) return
        // default behaviour
        if (this.box != null) {
            const header  = query(this.box).find(':scope > div .tsg-form-header')
            const toolbar = query(this.box).find(':scope > div .tsg-form-toolbar')
            const tabs    = query(this.box).find(':scope > div .tsg-form-tabs')
            const page    = query(this.box).find(':scope > div .tsg-page')
            const dpage   = query(this.box).find(':scope > div .tsg-page.page-'+ this.page + ' > div')
            const buttons = query(this.box).find(':scope > div .tsg-buttons')
            // if no height, calculate it
            const { headerHeight, tbHeight, tabsHeight } = resizeElements()
            if (this.autosize) { // we don't need autosize every time
                const cHeight = (query(this.box).get(0) as HTMLElement).clientHeight
                if (cHeight === 0 || query(this.box).data('autosize') == 'yes') {
                    query(this.box).css({
                        height: headerHeight + tbHeight + tabsHeight + 15 // 15 is extra height
                            + (page.length > 0 ? TsUtils.getSize(dpage, 'height') : 0)
                            + (buttons.length > 0 ? TsUtils.getSize(buttons, 'height') : 0)
                            + 'px'
                    })
                    query(this.box).data('autosize', 'yes')
                }
                resizeElements()
            }
            // resize tabs and toolbar if any
            this.tabs?.resize?.()
            this.toolbar?.resize?.()
            // resize switch fields
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.fields.forEach((field: any) => { // any: field definition
                if (field.type == 'switch') {
                    field.toolbar?.resize?.()
                }
            })

            function resizeElements(): { headerHeight: number; tbHeight: number; tabsHeight: number } {
                const headerHeight = (self.header !== '' ? TsUtils.getSize(header, 'height') : 0)
                const tbHeight = (Array.isArray(self.toolbar?.items) && self.toolbar?.items?.length > 0)
                    ? TsUtils.getSize(toolbar, 'height')
                    : 0
                const tabsHeight = (Array.isArray(self.tabs?.tabs) && self.tabs?.tabs?.length > 0)
                    ? TsUtils.getSize(tabs, 'height')
                    : 0
                // resize elements
                toolbar.css({ top: headerHeight + 'px' })
                tabs.css({ top: headerHeight + tbHeight + 'px' })
                page.css({
                    top: headerHeight + tbHeight + tabsHeight + 'px',
                    bottom: (buttons.length > 0 ? TsUtils.getSize(buttons, 'height') : 0) + 'px'
                })
                // return some params
                return { headerHeight, tbHeight, tabsHeight }
            }
        }
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refresh(...args: any[]): number { // any: args are optional field names
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this // no-this-alias: needed for nested function declarations (resizeElements, event handlers) that rebind `this`
        if (!this.box) return 0
        if (!this.isGenerated || !query(this.box).html()) return 0
        // event before
        const edata = this.trigger('refresh', { target: this.name, page: this.page, field: args[0], fields: args })
        if (edata.isCancelled === true) return 0
        let fields = Array.from(this.fields.keys())
        if (args.length > 0) {
            fields = args
                // any: parameter typed any — runtime dispatch by call site; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((fld: any, _ind: number) => {
                    if (typeof fld != 'string') console.log('ERROR: Arguments in refresh functions should be field names')
                    return this.get(fld, true) // get index of field
                })
                // any: parameter typed any — runtime dispatch by call site; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((fld: any, _ind: number) => {
                    if (fld != null) return true; else return false
                })
        } else {
            // update field.page with page it belongs too
            query(this.box).find('input, textarea, select').each((node: Node) => {
                const el = node as HTMLElement
                const name = (query(el).attr('name') != null ? query(el).attr('name') : query(el).attr('id'))
                const field = this.get(name)
                if (field) {
                    // find page
                    const div = query(el).closest('.tsg-page')
                    if (div.length > 0) {
                        for (let i = 0; i < 100; i++) {
                            if (div.hasClass('page-'+i)) { field.page = i; break }
                        }
                    }
                }
            })
            // default action
            query(this.box).find('.tsg-page').hide()
            query(this.box).find('.tsg-page.page-' + this.page).show()
            query(this.box).find('.tsg-form-header').html(TsUtils.lang(this.header))
            // refresh tabs if needed
            if (typeof this.tabs === 'object' && Array.isArray(this.tabs.tabs) && this.tabs.tabs.length > 0) {
                query(this.box).find('#form_'+ this.name +'_tabs').show()
                this.tabs.active = this.tabs.tabs[this.page].id
                this.tabs.refresh()
            } else {
                query(this.box).find('#form_'+ this.name +'_tabs').hide()
            }
            // refresh tabs if needed
            if (typeof this.toolbar === 'object' && Array.isArray(this.toolbar.items) && this.toolbar.items.length > 0) {
                query(this.box).find('#form_'+ this.name +'_toolbar').show()
                this.toolbar.refresh()
            } else {
                query(this.box).find('#form_'+ this.name +'_toolbar').hide()
            }
        }
        // refresh values of fields
        for (let f = 0; f < fields.length; f++) {
            const fieldIdx = fields[f]
            if (fieldIdx == null) continue
            const field = this.fields[fieldIdx]
            if (field == null) continue
            if (field.name == null && field.field != null) field.name = field.field
            if (field.field == null && field.name != null) field.field = field.name
            field.$el = query(this.box).find(`[name='${String(field.name).replace(/\\/g, '\\\\')}']`)
            field.el  = field.$el.get(0)
            if (field.el) field.el.id = field.name
            if (field.TsField) {
                field.TsField.reset()
            }
            field.$el
                .off('.TsForm')
                // any: targeted-any per typing_policy; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('change.TsForm', function(this: HTMLInputElement & { _previous?: any }, event: Event) {
                    const value = self.getFieldValue(field.field)
                    if (value == null) return
                    // clear error class
                    if (['enum', 'file'].includes(field.type)) {
                        const helper = field.TsField?.helpers?.multi
                        query(helper).removeClass('tsg-error')
                    }
                    if (this._previous != null) {
                        value.previous = this._previous
                        delete this._previous
                    }
                    // event before
                    const edata2 = self.trigger('change', { target: this.name, field: this.name, value, originalEvent: event })
                    if (edata2.isCancelled === true) return
                    // default behavior
                    self.setValue(this.name, value.current)
                    // event after
                    edata2.finish()
                })
                // any: targeted-any per typing_policy; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('input.TsForm', function(this: HTMLInputElement & { _previous?: any }, event: Event) {
                    self.rememberOriginal()
                    const value = self.getFieldValue(field.field)
                    if (value == null) return
                    // save previous for change event
                    if (this._previous == null) {
                        this._previous = value.previous
                    }
                    // event before
                    const edata2 = self.trigger('input', { target: self.name, field, value, originalEvent: event })
                    if (edata2.isCancelled === true) return
                    // default action
                    self.setValue(this.name, value.current, true)
                    // event after
                    edata2.finish()
                })
            // required
            if (field.required) {
                field.$el.closest('.tsg-field').addClass('tsg-required')
            } else {
                field.$el.closest('.tsg-field').removeClass('tsg-required')
            }
            // disabled
            if (field.disabled != null) {
                if (field.disabled) {
                    if (field.$el.data('tabIndex') == null) {
                        field.$el.data('tabIndex', field.$el.prop('tabIndex'))
                    }
                    field.$el
                        .prop('disabled', true)
                        .prop('tabIndex', -1)
                        .closest('.tsg-field')
                        .addClass('tsg-disabled')
                } else {
                    field.$el
                        .prop('disabled', false)
                        .prop('tabIndex', field.$el.data('tabIndex') ?? field.$el.prop('tabIndex') ?? 0)
                        .closest('.tsg-field')
                        .removeClass('tsg-disabled')
                }
            }
            // hidden
            let tmp = field.el
            if (!tmp) tmp = query(this.box).find('#' + field.field)
            if (field.hidden) {
                query(tmp).closest('.tsg-field').hide()
            } else {
                query(tmp).closest('.tsg-field').show()
            }
        }
        // attach actions on buttons
        query(this.box).find('button, input[type=button]').each((node: Node) => {
            const el = node as HTMLElement
            query(el).off('click').on('click', function(this: HTMLElement & { value: string; id: string; name: string }, event: Event) {
                let action = this.value
                if (this.id) action = this.id
                if (this['name']) action = this['name']
                self.action(action, event)
            })
        })
        // init controls with record
        for (let f = 0; f < fields.length; f++) {
            const fieldIdx2 = fields[f]
            if (fieldIdx2 == null) continue
            const field = this.fields[fieldIdx2]
            if (field == null) continue
            if (!field.el) continue
            if (!field.$el.hasClass('tsg-input')) field.$el.addClass('tsg-input')
            field.type = String(field.type).toLowerCase()
            if (!field.options) field.options = {}
            // list type
            if (this.LIST_TYPES.includes(field.type)) {
                const items = field.options.items
                if (items == null) field.options.items = []
                if (field.type == 'switch') {
                    // should not have .text if it is not explicitly set, or toolbar will have text
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items.forEach((item: any, ind: number) => { // any: item varies
                        return items[ind] = typeof item != 'object'
                            ? { id: item, text: item }
                            : item
                    })
                } else {
                    field.options.items = TsUtils.normMenu.call(this, items ?? [], field.options)
                }
            }
            // switch
            if (field.type == 'switch') {
                if (field.toolbar) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(TsUi[this.name + '_' + field.name + '_tb'] as any).destroy() // any: TsUi registry returns unknown
                }
                // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                field.options?.items?.forEach?.((it: any) => it.text == null ? it.text = '' : '')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items: any[] = TsUtils.normMenu.call(this, field.options.items, field.options) ?? [] // any: toolbar item shape varies
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((item: any) => item.type ??= 'radio') // any: toolbar item shape
                field.toolbar = new TsToolbar({
                    box: field.$el.prev().get(0),
                    name: this.name + '_' + field.name + '_tb',
                    items,
                    onClick(event: CustomEvent) {
                        self.rememberOriginal()
                        const value = self.getFieldValue(field.name)
                        if (value == null) return
                        value.current = event.detail['item'].id
                        const edata = self.trigger('change', { target: field.name, field: field.name, value, originalEvent: event })
                        if (edata.isCancelled === true) {
                            return
                        }
                        self.record[field.name] = value.current
                        self.setFieldValue(field.name, value.current)
                        edata.finish()
                    }
                })
                field.$el.prev().addClass('tsg-form-switch') // need to add this class, as toolbar render will remove all tsg-* classes
                field.toolbar.resize()
                field.$el
                    .off('.form-input')
                    .on('focus.form-input', (event: FocusEvent) => {
                        const ind = field.toolbar.get(field.$el.val(), true)
                        query(event.target).prop('_index', ind)
                        query(field.toolbar.box).addClass('tsg-tb-focus')
                    })
                    .on('blur.form-input', (event: FocusEvent) => {
                        query(event.target).removeProp('_index')
                        query(`#${field.name}-tb .tsg-tb-button`).removeClass('over')
                        query(field.toolbar.box).removeClass('tsg-tb-focus')
                    })
                    .on('keydown.form-input', (event: KeyboardEvent) => {
                        let ind = query(event.target).prop('_index') as number // prop returns unknown; index is always number
                        switch (event.key) {
                            case 'ArrowLeft': {
                                if (ind > 0) ind--
                                query(`#${field.name}-tb .tsg-tb-button`)
                                    .removeClass('over')
                                    .eq(ind)
                                    .addClass('over')
                                query(event.target).prop('_index', ind)
                                break
                            }
                            case 'ArrowRight': {
                                if (ind < field.toolbar.items.length -1) ind++
                                query(`#${field.name}-tb .tsg-tb-button`)
                                    .removeClass('over')
                                    .eq(ind)
                                    .addClass('over')
                                query(event.target).prop('_index', ind)
                                break
                            }
                        }
                        if (event.keyCode == 32 || event.keyCode == 13) {
                            // space or enter - apply selected
                            self.rememberOriginal()
                            const value = self.getFieldValue(field.name)
                            if (value == null) return
                            // any: cast-then-index for dynamic property access; TsForm field schema is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const tbItem = (field.toolbar.items as any[])[ind]
                            value.current = tbItem?.id
                            const edata = self.trigger('change', { target: field.name, field: field.name, value, originalEvent: event })
                            if (edata.isCancelled === true) {
                                return
                            }
                            self.record[field.name] = value.current
                            self.setFieldValue(field.name, value.current)
                            edata.finish()
                            query(`#${field.name}-tb .tsg-tb-button`).removeClass('over')
                        }
                        // do not allow any input, besides a tab
                        if (!event.metaKey && !event.ctrlKey && event.keyCode != 9) {
                            event.preventDefault()
                        }
                    })
            }

            // HTML select
            if (field.type == 'select') {
                // generate options
                const items = field.options.items
                let options = ''
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((item: any) => { // any: select item shape
                    options += `<option value="${item.id}">${item.text}</option>`
                })
                field.$el.html(options)
            }
            // w2fields
            if (this.TsFIELD_TYPES.includes(field.type)) {
                field.TsField = field.TsField
                    ?? new TsField(TsUtils.extend({}, field.options, { type: field.type }))
                field.TsField.render(field.el)
            }
            // map and arrays
            if (['map', 'array'].includes(field.type)) {
                // need closure
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (function (obj: TsForm, field: any) { // any: field definition
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    field.el.mapAdd = function(field: any, div: any, cnt: number, empty?: boolean) { // any: field/div shapes
                        const attr = (field.disabled ? ' readOnly ' : '') + (field.html.tabindex_str || '')
                        let html = `<input type="text" ${(field.html.value.attr ?? '') + attr} class="tsg-input ${field.html.class ?? ''} tsg-map value">`
                            + `${field.html.value.text || ''}`

                        if (typeof field.html.render == 'function') {
                            html = field.html.render.call(self, { empty: empty === true, ind: cnt, field, div })
                            // make sure all inputs have names as it is important for array objects
                            if (!field.el._errorDisplayed) {
                                // any: cast-to-any for dynamic dispatch; TsForm field schema is user-defined at runtime
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (_queryRaw as any).html(html).filter('input, textarea').each((node: Node) => {
                                    const inp = node as HTMLInputElement
                                    const name = inp.dataset['name'] ?? inp['name']
                                    if (name == null || name == '') {
                                        console.log(`ERROR: All inputs of the field %c"${field.name}"%c must have name attribute defined. No name for %c${inp.outerHTML}`,
                                            'color: blue', '', 'color: red')
                                    }
                                })
                                field.el._errorDisplayed = true
                            }
                        } else if (field.type == 'map') {
                            // has key input in front
                            html = `<input type="text" ${(field.html.key.attr ?? '') + attr} class="tsg-input ${field.html.class ?? ''} tsg-map key">
                                ${field.html.key.text || ''}
                            ` + html
                        }
                        div.append(`<div class="tsg-map-field" style="margin-bottom: 5px" data-index="${cnt}">${html}</div>`)
                        if (typeof field.html.render == 'function') {
                            const box = div.find(`[data-index="${cnt}"]`)
                            box.find('input, textarea').each((el: HTMLElement) => {
                                // set only if it is not defined in the HTML
                                if (query(el).attr('tabindex') == null) {
                                    query(el).attr('tabindex', field.html.tabindex)
                                }
                            })
                            if (typeof field.html.onRefresh == 'function') {
                                field.html.onRefresh.call(self, { index: cnt, empty, box: box.get(0) })
                            }
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    field.el.mapRefresh = function(map: any, div: any): void { // any: map can be object or array
                        // generate options
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let keys: any[] = [], $k: any, $v: any // any: query objects for key/value inputs
                        if (field.type == 'map') {
                            if (!TsUtils.isPlainObject(map)) map = {}
                            if (map._order == null) map._order = Object.keys(map)
                            keys = map._order
                        }
                        if (field.type == 'array') {
                            if (!Array.isArray(map)) map = []
                            // any: parameter typed any — runtime dispatch by call site; TsForm field schema is user-defined at runtime
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            keys = map.map((item: any, ind: number) => { return ind })
                        }
                        // delete fields (including empty one)
                        div.find('.tsg-map-field').remove()
                        for (let ind = 0; ind < keys.length; ind++) {
                            const key = keys[ind]
                            let fld = div.find(`div[data-index='${ind}']`)
                            // add if does not exists
                            if (fld.length == 0) {
                                field.el.mapAdd(field, div, ind)
                                fld = div.find(`div[data-index='${ind}']`)
                            }
                            fld.attr('data-key', key)
                            if (typeof field.html?.render == 'function') {
                                const val = map[key]
                                fld.find('input, textarea').each((node: Node) => {
                                    const inp = node as HTMLInputElement
                                    const name = inp.dataset['name'] ?? inp['name'] // <input data-name="higher priority" name="then">
                                    if (inp.type == 'checkbox') {
                                        inp.checked = val[name] ?? false
                                    } else if (inp.type == 'radio') {
                                        inp.checked = val[name] ?? false
                                    } else {
                                        inp.value = val[name] ?? ''
                                    }
                                })
                            } else {
                                $k = fld.find('.tsg-map.key')
                                $v = fld.find('.tsg-map.value')
                                let val = map[key]
                                if (field.type == 'array') {
                                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const tmp = map.filter((it: any) => { return it?.key == key ? true : false})
                                    if (tmp.length > 0) val = tmp[0].value
                                }
                                $k.val(key)
                                $v.val(val)
                                if (field.disabled === true || field.disabled === false) {
                                    $k.prop('readOnly', field.disabled ? true : false)
                                    $v.prop('readOnly', field.disabled ? true : false)
                                }
                            }
                            // call refresh
                            if (typeof field.html.onRefresh == 'function') {
                                field.html.onRefresh.call(self, { index: ind, box: div.find(`[data-index="${ind}"]`).get(0) })
                            }
                        }
                        if (typeof field.html.render == 'function') {
                            $v = div.find('.tsg-map-field:last-child input:first-child')
                        }
                        const cnt = keys.length
                        const curr = div.find(`div[data-index='${cnt}']`)
                        // if not disabled - add next if needed
                        if (curr.length === 0 && (!$k || $k.val() != '' || $v.val() != '')
                            && !($k && ($k.prop('readOnly') === true || $k.prop('disabled') === true))
                        ) {
                            field.el.mapAdd(field, div, cnt, true)
                        }
                        if (field.disabled === true || field.disabled === false) {
                            curr.find('.key').prop('readOnly', field.disabled ? true : false)
                            curr.find('.value').prop('readOnly', field.disabled ? true : false)
                        }
                        // attach events
                        let lastKey: string | null = null
                        const container = (query(field.el).get(0) as Node)?.nextSibling // should be div
                        query(container)
                            .off('.mapChange')
                            .on('mouseup.mapChange', { delegate: 'input, textarea' }, function (this: HTMLElement, event: Event) {
                                /***
                                 * This hack is needed for the cases when this field is refreshed and focus in bettween of mousedown and mouse up.
                                 * In such a case, the field will not get focused, but should be as there was mouse click.
                                 */
                                if (document.activeElement != event.target) {
                                    (event.target as HTMLElement).focus()
                                }
                            })
                            .on('keyup.mapChange', { delegate: 'input, textarea' }, function(this: HTMLElement, event: Event) {
                                const kbdEvent = event as KeyboardEvent
                                const $div = query(kbdEvent.target).closest('.tsg-map-field')
                                const next = ($div.get(0) as Element).nextElementSibling
                                const prev = ($div.get(0) as Element).previousElementSibling
                                const className = query(kbdEvent.target).hasClass('key') ? 'key' : 'value'
                                if (kbdEvent.keyCode == 38 && prev) { // up key
                                    (query(prev).find(`input.${className}, textarea.${className}, input[name="${(kbdEvent.target as HTMLInputElement)['name']}"] textarea[name="${(kbdEvent.target as HTMLInputElement)['name']}"]`).get(0) as HTMLInputElement | undefined)?.select()
                                    kbdEvent.preventDefault()
                                }
                                if (kbdEvent.keyCode == 40 && next) { // down key
                                    ;(kbdEvent.target as HTMLElement).blur() // blur is needed because it will trigger change which will re-render fields
                                    const next = ($div.get(0) as Element).nextElementSibling // need to query it again because it was re-rendered
                                    ;(query(next).find(`input.${className}, textarea.${className}, input[name="${(kbdEvent.target as HTMLInputElement)['name']}"] textarea[name="${(kbdEvent.target as HTMLInputElement)['name']}"]`).get(0) as HTMLInputElement | undefined)?.select()
                                    kbdEvent.preventDefault()
                                }
                            })
                            .on('keydown.mapChange', { delegate: 'input, textarea' }, function(this: HTMLElement, _event: Event) {
                                const event = _event as KeyboardEvent
                                lastKey = null
                                if (event.keyCode == 9) { // tab
                                    lastKey = 'tab'
                                }
                                if (event.keyCode == 13) { // enter
                                    lastKey = 'enter'
                                }
                                if (event.keyCode == 38 || event.keyCode == 40) {
                                    lastKey = event.keyCode == 38 ? 'up' : 'down'
                                    event.preventDefault()
                                }
                            })
                            .on('input.mapChange', { delegate: 'input, textarea' }, function(this: HTMLElement, event: Event) {
                                const fld = query(event.target).closest('div.tsg-map-field')
                                const cnt = fld.data('index')
                                const next = (fld.get(0) as Element).nextElementSibling
                                // if last one, add new empty
                                let isEmpty = true
                                query(fld).find('input, textarea').each((node: Node) => {
                                    const el = node as HTMLInputElement
                                    if (!['checkbox', 'button'].includes(el.type) && el.value != '') isEmpty = false
                                })
                                let isNextEmpty = true
                                query(next).find('input, textarea').each((node: Node) => {
                                    const el = node as HTMLInputElement
                                    if (!['checkbox', 'button'].includes(el.type) && el.value != '') isNextEmpty = false
                                })
                                if (!isEmpty && !next) {
                                    field.el.mapAdd(field, div, parseInt(cnt as string) + 1, true)
                                } else if (isEmpty && next && isNextEmpty) {
                                    query(next).remove()
                                }
                            })
                            .on('change.mapChange', { delegate: 'input, textarea' }, function(this: HTMLElement, _event: Event) {
                                const event = _event as KeyboardEvent
                                self.rememberOriginal()
                                // event before
                                const _fieldValue = self.getFieldValue(field.field)
                                if (_fieldValue == null) return
                                // eslint-disable-next-line prefer-const
                                let { current, previous, original } = _fieldValue
                                const $cnt = query(event.target).closest('.tsg-map-container')
                                // delete empty
                                if (typeof field.html?.render == 'function') {
                                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    current = current.filter((kk: any) => {
                                        // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const val = [...(new Set(Object.values(kk).filter((vv: any) => typeof vv != 'boolean')))]
                                        return !(val.length == 0 || (val.length == 1 && val[0] === ''))
                                    })
                                } else if (field.type == 'map') {
                                    current._order = []
                                    $cnt.find('.tsg-map.key').each((node: Node) => { current._order.push((node as HTMLInputElement).value) })
                                    current._order = current._order.filter((k: string) => k !== '')
                                    delete current['']
                                } else if (field.type == 'array') {
                                    // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    current = current.filter((k: any) => k !== '')
                                }
                                const edata = self.trigger('change', { target: field.field, field: field.field, originalEvent: event,
                                    value: { current, previous, original }
                                })
                                if (edata.isCancelled === true) {
                                    return
                                }

                                /**
                                 * Finds what input had focus so that it can focus next element, as entire map of fields will be
                                 * re-created and focus will be lost. It will also take care of up/down keys.
                                 */
                                let index: number | undefined
                                let className = ''
                                const cnt = query(event.target).closest('.tsg-map-container')
                                if (field.type == 'array' || lastKey == 'tab') {
                                    cnt.find('input, textarea').each((node: Node, ind: number) => { if (node == event.target) index = ind })
                                } else {
                                    className = query(event.target).hasClass('key') ? '.key' : '.value'
                                    cnt.find('input'+ className + ', textarea'+ className).each((node: Node, ind: number) => { if (node == event.target) index = ind })
                                }

                                // set value to the field
                                self.setValue(field.field, current) // will call field.el.mapRefresh

                                // set focus to the next input
                                let el: HTMLElement | undefined
                                const safeIdx = index ?? 0
                                if (lastKey == 'tab') {
                                    el = cnt.find('input, textarea').get(safeIdx + 1) as HTMLElement
                                } else if (lastKey == 'enter' && cnt.find('input.value, textarea.value').length > 0) {
                                    if (className == '.key') {
                                        el = cnt.find('input.key, textarea.key').get(safeIdx + 1) as HTMLElement
                                    } else {
                                        el = cnt.find('input.value, textarea.value').get(safeIdx + 1) as HTMLElement
                                    }
                                    if (el == null) {
                                        el = cnt.find('input, textarea').get(safeIdx + (event.shiftKey ? -1 : 1)) as HTMLElement
                                    }
                                } else {
                                    el = cnt.find('input'+ className + ', textarea'+ className).eq(safeIdx + (lastKey == 'up' ? -1 : 1)).get(0) as HTMLElement
                                }
                                if (el) {
                                    el.focus()
                                    ;(el as HTMLInputElement).select()
                                }
                                // event after
                                edata.finish()
                            })
                    }
                })(this, field)
            }
            // set value to HTML input field
            this.setFieldValue(field.field, this.getValue(field.name))
        }
        // event after
        edata.finish()
        this.resize()
        return Date.now() - time
    }

    override render(box?: HTMLElement | string): number | void {
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this // no-this-alias: used in nested function callbacks where `this` is rebound (toolbar, tabs click handlers)
        if (typeof box == 'string') box = query(box).get(0) as HTMLElement
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // default action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box
        }
        if (!this.isGenerated && !this.formHTML) return
        if (!this.box) return
        // render form
        const html = '<div class="tsg-form-box">' +
                    (this.header !== '' ? '<div class="tsg-form-header">' + TsUtils.lang(this.header) + '</div>' : '') +
                    '    <div id="form_'+ this.name +'_toolbar" class="tsg-form-toolbar" style="display: none"></div>' +
                    '    <div id="form_'+ this.name +'_tabs" class="tsg-form-tabs" style="display: none"></div>' +
                        this.formHTML +
                    '</div>'
        query(this.box).attr('name', this.name)
            .addClass('tsg-reset tsg-form')
            .html(html)
        if (query(this.box).length > 0) (query(this.box).get(0) as HTMLElement).style.cssText += this.style
        TsUtils.bindEvents(query(this.box).find('.tsg-eaction'), this)

        // init toolbar regardless it is defined or not
        if (typeof this.toolbar.render !== 'function') {
            this.toolbar = new TsToolbar(TsUtils.extend({}, this.toolbar, { name: this.name +'_toolbar', owner: this }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.toolbar.on('click', function(this: any, event: CustomEvent) { // any: toolbar context
                const edata = self.trigger('toolbar', { target: event.target, originalEvent: event })
                if (edata.isCancelled === true) return
                // no default action
                edata.finish()
            })
        }
        if (typeof this.toolbar === 'object' && typeof this.toolbar.render === 'function') {
            this.toolbar.render(query(this.box).find('#form_'+ this.name +'_toolbar').get(0))
        }
        // init tabs regardless it is defined or not
        if (typeof this.tabs.render !== 'function') {
            this.tabs = new TsTabs(TsUtils.extend({}, this.tabs, { name: this.name +'_tabs', owner: this, active: this.tabs.active }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.tabs.on('click', function(this: any, event: CustomEvent) { // any: tabs context
                self.goto(this.get(event.target, true))
            })
        }
        if (typeof this.tabs === 'object' && typeof this.tabs.render === 'function') {
            this.tabs.render(query(this.box).find('#form_'+ this.name +'_tabs').get(0))
            if (this.tabs.active) this.tabs.click(this.tabs.active)
        }
        // event after
        edata.finish()
        // after render actions
        this.resize()
        const url = (typeof this.url !== 'object' ? this.url : this.url.get)
        if (url && this.recid != null) {
            // any: callback parameter — caller signature varies; TsForm field schema is user-defined at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(this.request() as Promise<any>).catch((_error: any) => this.refresh()) // request() is void|Promise; url+recid guarantee it returns Promise
        } else {
            this.refresh()
        }
        // observe div resize
        this.last.observeResize = new ResizeObserver(() => { this.resize() })
        this.last.observeResize.observe(this.box)
        // focus on load
        if (this.focus != -1) {
            let setCount = 0
            const setFocus = () => {
                if (query(self.box).find('input, select, textarea').length > 0) {
                    self.setFocus()
                } else {
                    setCount++
                    if (setCount < 20) setTimeout(setFocus, 50) // 1 sec max
                }
            }
            setFocus()
        }
        return Date.now() - time
    }

    override unmount(): void {
        super.unmount()
        this.tabs?.unmount?.()
        this.toolbar?.unmount?.()
        this.last.observeResize?.disconnect()
    }

    destroy(): void {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        // clean up
        this.tabs?.destroy?.()
        this.toolbar?.destroy?.()
        if (query(this.box).find('#form_'+ this.name +'_tabs').length > 0) {
            this.unmount()
        }
        this.last.observeResize?.disconnect()
        delete TsUi[this.name]
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFocus(focus?: number | string): any { // any: returns Query object with focused element
        if (typeof focus === 'undefined'){
            // no argument - use form's focus property
            focus = this.focus
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let $input: any // any: Query object or undefined
        // focus field by index
        if (TsUtils.isInt(focus)){
            if ((focus as number) < 0) {
                return
            }
            const inputs = query(this.box)
                .find('div:not(.tsg-field-helper) > input, select, textarea, div > label:nth-child(1) > [type=radio]')
                .filter(':not(.file-input)')
            // find visible (offsetParent == null for any element is not visible)
            while ((inputs.get(focus as number) as HTMLElement)?.offsetParent == null && inputs.length > (focus as number)) {
                (focus as number)++
            }
            if (inputs.get(focus as number)) {
                $input = query(inputs.get(focus as number))
            }
        } else if (typeof focus === 'string') {
            // focus field by name
            $input = query(this.box).find(`[name='${focus}']`)
        }
        if ($input?.length > 0){
            ($input.get(0) as HTMLElement).focus()
        }
        return $input
    }
}
export { TsForm }
