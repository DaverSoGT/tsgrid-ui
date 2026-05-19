/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip, TsColor, TsMenu, TsDate
 *
 * T4.1: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 * Discriminated union on `type` property for per-type option shapes.
 *
 * == TODO ==
 *  - upload (regular files)
 *  - BUG with prefix/postfix and arrows (test in different contexts)
 *  - multiple date selection
 *  - month selection, year selections
 *  - MultiSelect - Allow Copy/Paste for single and multi values
 *  - add routeData to list/enum
 *  - ENUM, LIST: should have same as grid (limit, offset, search, sort)
 *  - ENUM, LIST: should support wild chars
 *  - add selection of predefined times (used for appointments)
 *  - options.items - can be an array
 *  - options.msgNoItems - can be a function
 *  - REMOTE fields
 *
 * == 2.0 changes
 *  - removed jQuery dependency
 *  - enum options.autoAdd
 *  - [numeric, date] - options.autoCorrect to enforce range and validity
 *  - remote source response items => records or just an array
 *  - deprecated "success" field for remote source response
 *  - CSP - fixed inline events
 *  - remove clear, use reset instead
 *  - options.msgSearch
 *  - options.msgNoItems
 */

import { isHTMLElement } from './tsutils-type-guards.js'
import { TsBase, TsEventPayload } from './tsbase.js'
import { TsUtils } from './tsutils.js'
import { TsTooltip as _w2tooltip, TsColor as _w2color, TsMenu as _w2menu, TsDate as _w2date } from './tstooltip.js'
import { query as _queryRaw, Query } from './query.js'
import { searchIcon } from './icons.js'

// any: query() returns Query|void; cast once here for clean chaining
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

// any: TsMenu/TsColor/TsDate/TsTooltip have rich return types with .select()/.hide()/.show()
// that are hard to match from external call sites; cast once here for clean usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsMenu    = _w2menu as any // any: overlay manager with .show()/.hide()/.get() returning dynamic overlay objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsColor   = _w2color as any // any: color picker with .show() returning AttachReturn with .select()/.liveUpdate()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsDate    = _w2date as any // any: date picker with .show()/.inRange()/.str2min()/.min2str() etc.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TsTooltip = _w2tooltip as any // any: tooltip manager with .show()/.hide() accepting flexible option shapes

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

/** Shared numeric-field options (int, float, money, currency, percent, alphanumeric, bin, hex, text) */
export interface TsFieldNumericOptions {
    type?: string
    min?: number | null
    max?: number | null
    step?: number
    autoFormat?: boolean
    autoCorrect?: boolean
    currency?: {
        prefix: string
        suffix: string
        precision: number
    }
    decimalSymbol?: string
    groupSymbol?: string
    arrows?: boolean
    keyboard?: boolean
    precision?: number | null
    prefix?: string
    suffix?: string
    // computed at init
    numberRE?: RegExp
    moneyRE?: RegExp
    percentRE?: RegExp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options extended dynamically in init()
}

/** Color-field options */
export interface TsFieldColorOptions {
    type?: string
    prefix?: string
    suffix?: string
    arrows?: boolean
    advanced?: boolean | null
    transparent?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** Date-field options */
export interface TsFieldDateOptions {
    type?: string
    format?: string
    keyboard?: boolean
    autoCorrect?: boolean
    start?: string | null
    end?: string | null
    blockDates?: string[]
    blockWeekdays?: number[]
    colored?: Record<string, string>
    btnNow?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** Time-field options */
export interface TsFieldTimeOptions {
    type?: string
    format?: string
    keyboard?: boolean
    autoCorrect?: boolean
    start?: string | null
    end?: string | null
    btnNow?: boolean
    noMinutes?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** DateTime-field options */
export interface TsFieldDateTimeOptions {
    type?: string
    format?: string
    keyboard?: boolean
    autoCorrect?: boolean
    start?: string | null
    end?: string | null
    startTime?: string | null
    endTime?: string | null
    blockDates?: string[]
    blockWeekdays?: number[]
    colored?: Record<string, string>
    btnNow?: boolean
    noMinutes?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** List/combo-field options */
export interface TsFieldListOptions {
    type?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: any[] // any: items can be strings, objects, or a function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _items_fun?: ((...args: any[]) => any) | null // any: function signature varies
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected?: Record<string, any> | null // any: selected item shape
    itemMap?: { id: string; text: string } | null
    match?: 'contains' | 'is' | 'begins' | 'ends'
    filter?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare?: ((...args: any[]) => any) | null // any: user-defined compare function
    prefix?: string
    suffix?: string
    icon?: string | null
    iconStyle?: string
    url?: string | null
    method?: string | null
    postData?: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recId?: string | ((item: any) => any) | null // any: mapping function result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recText?: string | ((item: any) => any) | null // any: mapping function result
    debounce?: number
    minLength?: number
    cacheMax?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderDrop?: ((...args: any[]) => string) | null // any: render function
    maxDropHeight?: number
    maxDropWidth?: number | null
    minDropWidth?: number | null
    markSearch?: boolean
    align?: 'left' | 'right' | 'both' | 'none'
    altRows?: boolean
    openOnFocus?: boolean
    hideSelected?: boolean
    msgNoItems?: string
    msgSearch?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRequest?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLoad?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: ((...args: any[]) => void) | null // any: event callback
    index?: number[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** Enum-field options */
export interface TsFieldEnumOptions {
    type?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: any[] // any: items can be strings, objects, or a function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _items_fun?: ((...args: any[]) => any) | null // any: function signature varies
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected?: any[] // any: array of selected items
    itemMap?: { id: string; text: string } | null
    max?: number
    match?: 'contains' | 'is' | 'begins' | 'ends'
    filter?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare?: ((...args: any[]) => any) | null // any: user-defined compare function
    url?: string | null
    method?: string | null
    postData?: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recId?: string | ((item: any) => any) | null // any: mapping function result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recText?: string | ((item: any) => any) | null // any: mapping function result
    debounce?: number
    minLength?: number
    cacheMax?: number
    maxItemWidth?: number
    maxDropHeight?: number
    maxDropWidth?: number | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderItem?: ((item: any, ind: number, removeBtn: string) => string) | null // any: render result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderDrop?: ((...args: any[]) => string) | null // any: render function
    style?: string
    openOnFocus?: boolean
    markSearch?: boolean
    align?: 'left' | 'right' | 'both' | 'none'
    altRows?: boolean
    hideSelected?: boolean
    msgNoItems?: string
    msgSearch?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onNew?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRequest?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLoad?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onScroll?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseEnter?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseLeave?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** File-field options */
export interface TsFieldFileOptions {
    type?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected?: any[] // any: array of file objects
    max?: number
    maxSize?: number
    maxFileSize?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderItem?: ((item: any, ind: number, removeBtn: string) => string) | null // any: render result
    maxItemWidth?: number
    maxDropHeight?: number
    maxDropWidth?: number | null
    readContent?: boolean
    showErrors?: boolean
    align?: 'left' | 'right' | 'both' | 'none'
    altRows?: boolean
    style?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseEnter?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseLeave?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options may be user-extended
}

/** Discriminated union: all possible options for a TsField instance */
export type TsFieldOptions =
    | TsFieldNumericOptions
    | TsFieldColorOptions
    | TsFieldDateOptions
    | TsFieldTimeOptions
    | TsFieldDateTimeOptions
    | TsFieldListOptions
    | TsFieldEnumOptions
    | TsFieldFileOptions

/** Constructor input — the type discriminant lives here */
interface TsFieldInput {
    type?: string
    el?: HTMLElement | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onNew?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseEnter?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseLeave?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onScroll?: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: options extended dynamically
}

/** Helper elements bag */
interface TsFieldHelpers {
    prefix?: HTMLElement | null
    suffix?: HTMLElement | null
    arrows?: HTMLElement | null
    search?: HTMLElement | null
    search_focus?: HTMLInputElement // input element for list type
    multi?: Query // Query wrapper for enum/file multi-container
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: helpers are added dynamically
}

/** Temp state bag */
interface TsFieldTmp {
    'old-padding-left'?: string | null
    'old-padding-right'?: string | null
    'old-background-color'?: string
    'old-border-color'?: string
    'old-tabIndex'?: number
    'min-height'?: number
    'max-height'?: number
    'current_width'?: number
    pholder?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overlay?: any // any: TsMenu overlay instance with dynamic .overlay sub-object
    openedOnFocus?: boolean
    sizeTimer?: ReturnType<typeof setInterval>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // any: temp state grows dynamically
}

// ---------------------------------------------------------------------------
// HTMLElement extension for TsField reference
// ---------------------------------------------------------------------------
declare global {
    interface HTMLElement {
        _w2field?: TsField
    }
    interface HTMLInputElement {
        _w2field?: TsField
    }
    interface HTMLTextAreaElement {
        _w2field?: TsField
    }
}

// TsField only supports INPUT and TEXTAREA elements (validated in init())
export type TsFieldElement = HTMLInputElement | HTMLTextAreaElement

class TsField extends TsBase {
    el: TsFieldElement | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected: any // any: can be null, an object (list), or an array (enum/file)
    helpers: TsFieldHelpers
    type: string
    options: TsFieldOptions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onNew: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseEnter: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseLeave: ((...args: any[]) => void) | null // any: event callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onScroll: ((...args: any[]) => void) | null // any: event callback
    tmp: TsFieldTmp

    constructor(type: string | TsFieldInput, options?: TsFieldInput) {
        super()
        // sanitization
        if (typeof type == 'string' && options == null) {
            options = { type: type }
        }
        if (typeof type == 'object' && options == null) {
            options = TsUtils.clone(type)
        }
        if (typeof type == 'string' && typeof options == 'object') {
            options.type = type
        }
        // options is always defined after the three branches above
        const opts = options! // non-null: all code paths above assign options
        opts.type = String(opts.type).toLowerCase()
        this.el          = (opts.el ?? null) as TsFieldElement | null
        this.selected    = null
        this.helpers     = {} // object or helper elements
        this.type        = opts.type ?? 'text'
        this.options     = TsUtils.clone(opts)
        this.onClick     = opts.onClick ?? null
        this.onAdd       = opts.onAdd ?? null
        this.onNew       = opts.onNew ?? null
        this.onRemove    = opts.onRemove ?? null
        this.onMouseEnter= opts.onMouseEnter ?? null
        this.onMouseLeave= opts.onMouseLeave ?? null
        this.onScroll    = opts.onScroll ?? null
        this.tmp         = {} // temp object
        // clean up some options
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this.options as any).type
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this.options as any).onClick
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this.options as any).onMouseEnter
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this.options as any).onMouseLeave
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this.options as any).onScroll

        if (this.el) {
            this.render(this.el)
        }
    }

    override render(el: HTMLElement): void {
        if (!isHTMLElement(el)) {
            console.log('ERROR: Cannot init TsField on empty subject')
            return
        }
        // after init() validates INPUT/TEXTAREA, el is safe to treat as TsFieldElement
        const fieldEl = el as TsFieldElement
        fieldEl._w2field?.reset?.() // will remove all previous events
        fieldEl._w2field = this
        this.el = fieldEl
        this.init()
    }

    init(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let options = this.options as any // any: options shape depends on type; accessed via key-lookup below
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let defaults: Record<string, any> // any: defaults are type-specific bags assembled per switch case

        // only for INPUT or TEXTAREA
        if (this.el == null || !['INPUT', 'TEXTAREA'].includes(this.el.tagName.toUpperCase())) {
            console.log('ERROR: TsField could only be applied to INPUT or TEXTAREA.', this.el)
            return
        }
        // non-null: guarded above; use local alias so TypeScript tracks narrowing
        const _fieldEl = this.el

        switch (this.type) {
            case 'text':
            case 'int':
            case 'float':
            case 'money':
            case 'currency':
            case 'percent':
            case 'alphanumeric':
            case 'bin':
            case 'hex': {
                defaults = {
                    min: null,
                    max: null,
                    step: 1,
                    autoFormat: true,
                    autoCorrect: true,
                    currency: {
                        prefix: TsUtils.settings.currencyPrefix,
                        suffix: TsUtils.settings.currencySuffix,
                        precision: TsUtils.settings.currencyPrecision
                    },
                    decimalSymbol: TsUtils.settings.decimalSymbol,
                    groupSymbol: TsUtils.settings.groupSymbol,
                    arrows: false,
                    keyboard: true,
                    precision: null,
                    prefix: '',
                    suffix: ''
                }
                this.options = TsUtils.extend({}, defaults, options)
                options = this.options // since object is re-created, need to re-assign
                options.numberRE  = new RegExp('['+ options.groupSymbol + ']', 'g')
                options.moneyRE   = new RegExp('['+ options.currency.prefix + options.currency.suffix + options.groupSymbol +']', 'g')
                options.percentRE = new RegExp('['+ options.groupSymbol + '%]', 'g')
                // no keyboard support needed
                if (['text', 'alphanumeric', 'hex', 'bin'].includes(this.type)) {
                    options.arrows   = false
                    options.keyboard = false
                }
                break
            }
            case 'color': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const size = parseInt((getComputedStyle(this.el!) as any)['font-size'] ?? '12') || 12 // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
                defaults = {
                    prefix      : '#',
                    suffix      : `<div style="width: ${size}px; height: ${size}px; margin-top: -2px;
                                    position: relative; top: 50%; transform: translateY(-50%);">&#160;</div>`,
                    arrows      : false,
                    advanced    : null, // open advanced by default
                    transparent : true
                }
                this.options = TsUtils.extend({}, defaults, options)
                options = this.options // since object is re-created, need to re-assign
                break
            }
            case 'date': {
                defaults = {
                    format        : TsUtils.settings.dateFormat, // date format
                    keyboard      : true,   // if true, allows to select date with format
                    autoCorrect   : true,   // correc date or shows the error
                    start         : null,   // first date allowed to select
                    end           : null,   // last date allowed to select
                    blockDates    : [],     // array of blocked dates
                    blockWeekdays : [],     // blocked weekdays 0 - sunday, 1 - monday, etc
                    colored       : {},     // ex: { '3/13/2022': 'bg-color|text-color' }
                    btnNow        : true    // if true, displays Now button
                }
                this.options = TsUtils.extend({ type: 'date' }, defaults, options)
                options = this.options // since object is re-created, need to re-assign
                if (query(this.el).attr('placeholder') == null) {
                    query(this.el).attr('placeholder', options.format)
                }
                break
            }
            case 'time': {
                defaults = {
                    format      : TsUtils.settings.timeFormat,
                    keyboard    : true,
                    autoCorrect : true,
                    start       : null,
                    end         : null,
                    btnNow      : true,
                    noMinutes   : false
                }
                this.options = TsUtils.extend({ type: 'time' }, defaults, options)
                options = this.options // since object is re-created, need to re-assign
                if (query(this.el).attr('placeholder') == null) {
                    query(this.el).attr('placeholder', options.format)
                }
                break
            }
            case 'datetime': {
                defaults = {
                    format        : TsUtils.settings.dateFormat + '|' + TsUtils.settings.timeFormat,
                    keyboard      : true,
                    autoCorrect   : true,
                    start         : null,
                    end           : null,
                    startTime     : null,
                    endTime       : null,
                    blockDates    : [], // array of blocked dates
                    blockWeekdays : [], // blocked weekdays 0 - sunday, 1 - monday, etc
                    colored       : {}, // ex: { '3/13/2022': 'bg-color|text-color' }
                    btnNow        : true,
                    noMinutes     : false
                }
                this.options = TsUtils.extend({ type: 'datetime' }, defaults, options)
                options = this.options // since object is re-created, need to re-assign
                if (query(this.el).attr('placeholder') == null) {
                    query(this.el).attr('placeholder', options.placeholder || options.format)
                }
                break
            }
            case 'list':
            case 'combo': {
                defaults = {
                    items           : [],       // array of items, can be a function
                    selected        : {},       // selected item
                    itemMap         : null,     // can be { id: 'id', text: 'text' } to specify field mapping for an item
                    match           : 'begins', // ['contains', 'is', 'begins', 'ends']
                    filter          : true,     // weather to filter at all
                    compare         : null,     // compare function for filtering
                    prefix          : '',       // prefix for input
                    suffix          : '',       // sufix for input
                    icon            : null,     // icon class for selected item
                    iconStyle       : '',       // icon style for selected item
                    // -- remote items --
                    url             : null,     // remove data source for items
                    method          : null,     // default comes from TsUtils.settings.dataType
                    postData        : {},       // additional data to submit to URL
                    recId           : null,     // map retrieved data from url to id, can be string or function
                    recText         : null,     // map retrieved data from url to text, can be string or function
                    debounce        : 250,      // number of ms to wait before sending server call on search
                    minLength       : 1,        // min number of chars when trigger search
                    cacheMax        : 250,
                    // -- drop items --
                    renderDrop      : null,     // render function for drop down item
                    maxDropHeight   : 350,      // max height for drop down menu
                    maxDropWidth    : null,     // if null then auto set
                    minDropWidth    : null,     // if null then auto set
                    // -- misc --
                    markSearch      : false,    // if true, highlights search phrase
                    align           : 'both',   // align with the input ['left', 'right', 'both', 'none']
                    altRows         : true,     // alternate row color for drop itesm
                    openOnFocus     : false,    // if true, shows drop items on focus
                    hideSelected    : false,    // hide selected item from drop down
                    msgNoItems      : 'No matches',
                    msgSearch       : 'Type to search...',
                    // -- events --
                    onSearch        : null,     // when search needs to be performed
                    onRequest       : null,     // when request is submitted
                    onLoad          : null,     // when data is received
                    onError         : null,     // when data fails to load due to server error
                }
                if (typeof options.items == 'function') {
                    options._items_fun = options.items
                }
                // need to be first
                options.items = TsUtils.normMenu.call(this, options.items, options)
                if (this.type === 'list') {
                    // defaults.search = (options.items && options.items.length >= 10 ? true : false);
                    query(this.el).addClass('tsg-select')
                    // if simple value - look it up
                    if (!TsUtils.isPlainObject(options.selected) && Array.isArray(options.items)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        options.items.forEach((item: any) => { // any: item in items array
                            if (item && item.id === options.selected) {
                                options.selected = TsUtils.clone(item)
                            }
                        })
                    }
                }
                options = TsUtils.extend({}, defaults, options)
                // validate match
                const valid = ['is', 'begins', 'contains', 'ends']
                if (!valid.includes(options.match)) {
                    console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(', ')}.`)
                }
                this.options = options
                if (!TsUtils.isPlainObject(options.selected)) options.selected = {}
                this.selected = options.selected
                query(this.el)
                    .attr('autocapitalize', 'off')
                    .attr('autocomplete', 'off')
                    .attr('autocorrect', 'off')
                    .attr('spellcheck', 'false')
                if (options.selected.text != null) {
                    query(this.el).val(options.selected.text)
                }
                break
            }
            case 'enum': {
                defaults = {
                    items           : [],    // id, text, tooltip, icon
                    selected        : [],
                    itemMap         : null,     // can be { id: 'id', text: 'text' } to specify field mapping for an item
                    max             : 0,     // max number of selected items, 0 - unlimited
                    match           : 'begins', // ['contains', 'is', 'begins', 'ends']
                    filter          : true,  // if true, will apply filtering
                    compare         : null,  // compare function for filtering
                    // -- remote items --
                    url             : null,  // remove source for items
                    method          : null,  // default httpMethod
                    postData        : {},
                    recId           : null,  // map retrieved data from url to id, can be string or function
                    recText         : null,  // map retrieved data from url to text, can be string or function
                    debounce        : 250,   // number of ms to wait before sending server call on search
                    minLength       : 1,     // min number of chars when trigger search
                    cacheMax        : 250,
                    // -- item and drop items --
                    maxItemWidth    : 250,   // max width for a single item
                    maxDropHeight   : 350,   // max height for drop down menu
                    maxDropWidth    : null,  // if null then auto set
                    renderItem      : null,  // render selected item
                    renderDrop      : null,  // render function for drop down item
                    // -- misc --
                    style           : '',    // style for container div
                    openOnFocus     : false, // if true, opens drop down on focus
                    markSearch      : false, // if true, highlights search phrase
                    align           : 'both',// align with the input ['left', 'right', 'both', 'none']
                    altRows         : true,  // if ture, will use alternate row colors
                    hideSelected    : true,  // hide selected items from drop down
                    msgNoItems      : 'No matches',
                    msgSearch       : 'Type to search...',
                    // -- events --
                    onAdd           : null,  // when item is selected from drop down
                    onNew           : null,  // when new item should be added
                    onRemove        : null,  // when item is removed
                    onSearch        : null,  // when search is triggered
                    onClick         : null,  // when item is clicked
                    onRequest       : null,  // when data is requested
                    onLoad          : null,  // when data is received
                    onError         : null,  // when data fails to load due to server error
                    onScroll        : null,  // when div with selected items is scrolled
                    onMouseEnter    : null,  // when mouse enters item
                    onMouseLeave    : null,  // when mouse leaves item
                }
                options  = TsUtils.extend({}, defaults, options, { suffix: '' })
                if (typeof options.items == 'function') {
                    options._items_fun = options.items
                }
                // validate match
                const valid = ['is', 'begins', 'contains', 'ends']
                if (!valid.includes(options.match)) {
                    console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(', ')}.`)
                }
                options.items    = TsUtils.normMenu.call(this, options.items, options)
                options.selected = TsUtils.normMenu.call(this, options.selected, options)
                this.options     = options
                if (!Array.isArray(options.selected)) options.selected = []
                this.selected = options.selected
                break
            }
            case 'file': {
                defaults = {
                    selected      : [],     // array of selected files
                    max           : 0,      // max number of selected files, 0 - unlim
                    maxSize       : 0,      // max size of all files, 0 - unlimited
                    maxFileSize   : 0,      // max size of a single file, 0 -unlimited
                    renderItem    : null,   // render function fo the selected item
                    // -- misc --
                    maxItemWidth  : 250,    // max width for a single item
                    maxDropHeight : 350,    // max height for drop down menu
                    maxDropWidth  : null,   // if null then auto set
                    readContent   : true,   // if true, it will readAsDataURL content of the file
                    showErrors    : true,   // if not true, will show errors
                    align         : 'both', // align with the input ['left', 'right', 'both', 'none']
                    altRows       : true,   // alternate row color for drop itesm
                    style         : '',     // style for container div
                    // -- events --
                    onClick       : null,   // when item is clicked
                    onAdd         : null,   // when item is added
                    onRemove      : null,   // when item is removed
                    onMouseEnter  : null,   // when item is mouse over
                    onMouseLeave  : null    // when item is mouse out
                }
                options = TsUtils.extend({}, defaults, options)
                this.options = options
                if (!Array.isArray(options.selected)) options.selected = []
                this.selected = options.selected
                if (query(this.el).attr('placeholder') == null) {
                    query(this.el).attr('placeholder', TsUtils.lang('Attach files by dragging and dropping or Click to Select'))
                }
                break
            }
            default: {
                console.log(`ERROR: field type "${this.type}" is not supported.`)
                break
            }
        }
        // attach events
        const $elInit = query(this.el)
        $elInit.css('box-sizing', 'border-box')
        $elInit.addClass('TsField tsg-input')
            .off('.TsField')
            .on('change.TsField', (event: Event) => { this.change(event) })
            .on('click.TsField', (event: Event) => { this.click(event as MouseEvent) })
            .on('focus.TsField', (event: Event) => { this.focus(event as FocusEvent) })
            .on('blur.TsField', (event: Event) => { if (this.type !== 'list') this.blur(event as FocusEvent) })
            .on('keydown.TsField', (event: Event) => { this.keyDown(event as KeyboardEvent) })
            .on('keyup.TsField', (event: Event) => { this.keyUp(event as KeyboardEvent) })
        // suffix and prefix need to be after styles
        this.addPrefix() // only will add if needed
        this.addSuffix() // only will add if needed
        this.addSearch()
        this.addMultiSearch()
        // this.refresh() // do not call refresh, on change will trigger refresh (for list at list)
        // format initial value
        this.change(new Event('change'))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(): any { // any: return varies by type (string for text, array for enum/file, object for list)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ret: any // any: return type varies by field type
        if (['list', 'enum', 'file'].indexOf(this.type) !== -1) {
            ret = this.selected
        } else {
            ret = query(this.el).val()
        }
        return ret
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(val: any, append?: boolean): void { // any: val can be string, object, array depending on type
        if (['list', 'enum', 'file'].indexOf(this.type) !== -1) {
            const overlay = TsMenu.get(this.el!.id + '_menu')
            overlay?.hide()
            if (this.type !== 'list' && append) {
                if (!Array.isArray(this.selected)) this.selected = []
                this.selected.push(val)
                // update selected array in overlay
                if (overlay) overlay.options.selected = this.selected
                query(this.el).trigger('input').trigger('change')
            } else {
                if (val == null) val = []
                const it = (this.type === 'enum' && !Array.isArray(val) ? [val] : val)
                this.selected = it
                query(this.el).trigger('input').trigger('change')
            }
            this.refresh()
        } else {
            query(this.el).val(val)
        }
    }

    setIndex(ind: number, append?: boolean): boolean {
        if (['list', 'enum'].indexOf(this.type) !== -1) {
            const overlay = TsMenu.get(this.el!.id + '_menu')
            overlay?.hide()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items = (this.options as any).items // any: items array is type-specific
            if (items && items[ind]) {
                if (this.type == 'list') {
                    this.selected = items[ind]
                }
                if (this.type == 'enum') {
                    if (!append) this.selected = []
                    this.selected.push(items[ind])
                }
                if (overlay) overlay.options.selected = this.selected
                query(this.el).trigger('input').trigger('change')
                this.refresh()
                return true
            }
        }
        return false
    }

    refresh(): number {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type
        const time    = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles  = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
        // update color
        if (this.type == 'color') {
            let color = this.el!.value
            if (color.substr(0, 1) != '#' && color.substr(0, 3) != 'rgb') {
                color = '#' + color
            }
            query(this.helpers.suffix).find(':scope > div').css('background-color', color)
        }
        // enum
        if (this.type == 'list') {
            // next line will not work in a form with span: -1
            // query(this.el).parent().css('white-space', 'nowrap') // needs this for arrow always to appear on the right side
            // hide focus and show text
            if (this.helpers.prefix) query(this.helpers.prefix).hide()
            if (!this.helpers.search) return Date.now() - time
            // if empty show no icon
            if (this.selected == null && options.icon) {
                options.prefix = `
                    <span class="tsg-icon ${options.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${options.iconStyle}">
                    </span>`
                this.addPrefix()
            } else {
                options.prefix = ''
                this.addPrefix()
            }
            // focus helper
            const focus = query(this.helpers.search_focus)
            const icon = query((focus.get(0) as Element).previousElementSibling)
            focus.css({ outline: 'none' })
            if (focus.val() === '') {
                focus.css('opacity', 0)
                icon.css('opacity', 0)
                if (this.selected?.id != null) { // id could be "", then it is valid
                    const text = this.selected.text
                    const ind = this.findItemIndex(options.items, this.selected.id)
                    if (text != null) {
                        ;(query(this.el).val(TsUtils.lang(text)) as Query)
                            .data({
                                selected: text,
                                selectedIndex: ind[0]
                            })
                    }
                } else {
                    this.el!.value = ''
                    query(this.el).removeData('selected selectedIndex')
                }
            } else {
                focus.css('opacity', 1)
                icon.css('opacity', 1)
                query(this.el).val('')
                setTimeout(() => {
                    if (this.helpers.prefix) query(this.helpers.prefix).hide()
                    if (options.icon) {
                        focus.css('margin-left', '17px')
                        query(this.helpers.search).find('[data-icon="search"]')
                            .addClass('show-search')
                    } else {
                        focus.css('margin-left', '0px')
                        query(this.helpers.search).find('[data-icon="search"]')
                            .removeClass('show-search')
                    }
                }, 1)
            }
            // if readonly or disabled
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) {
                setTimeout(() => {
                    if (this.helpers.prefix) query(this.helpers.prefix).css('opacity', '0.6')
                    if (this.helpers.suffix) query(this.helpers.suffix).css('opacity', '0.6')
                }, 1)
            } else {
                setTimeout(() => {
                    if (this.helpers.prefix) query(this.helpers.prefix).css('opacity', '1')
                    if (this.helpers.suffix) query(this.helpers.suffix).css('opacity', '1')
                }, 1)
            }
        }
        // multi select control
        const div = this.helpers.multi
        if (['enum', 'file'].includes(this.type) && div) {
            let html = ''
            if (Array.isArray(this.selected)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.selected.forEach((it: any, ind: number) => { // any: selected item shape varies by type
                    if (it == null) return
                    html += `
                        <div class="li-item" index="${ind}" style="max-width: ${parseInt(options.maxItemWidth)}px; ${it.style ? it.style : ''}">
                        ${
                            typeof options.renderItem === 'function'
                            ? options.renderItem(it, ind, `<div class="tsg-list-remove" index="${ind}">&#160;&#160;</div>`)
                            : `
                               ${it.icon ? `<span class="tsg-icon ${it.icon}"></span>` : ''}
                               <div class="tsg-list-remove" index="${ind}">&#160;&#160;</div>
                               ${(this.type === 'enum' ? it.text : it.name) ?? it.id ?? it }
                               ${it.size ? `<span class="file-size"> - ${TsUtils.formatSize(it.size)}</span>` : ''}
                            `
                        }
                        </div>`
                })
            }
            const ul  = div.find('.tsg-multi-items')
            if (options.style) {
                div.attr('style', div.attr('style') + ';' + options.style)
            }
            query(this.el).css('z-index', '-1')
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) {
                setTimeout(() => {
                    (div.get(0) as HTMLElement).scrollTop = 0 // scroll to the top
                    div.addClass('tsg-readonly')
                        .find('.li-item').css('opacity', '0.9')
                    ;(div.find('.li-item') as Query).parent().find('.li-search').hide()
                        .find('input').prop('readOnly', true)
                        .closest('.tsg-multi-items')
                        .find('.tsg-list-remove').hide()
                }, 1)
            } else {
                setTimeout(() => {
                    div.removeClass('tsg-readonly')
                        .find('.li-item').css('opacity', '1')
                    ;(div.find('.li-item') as Query).parent().find('.li-search').show()
                        .find('input').prop('readOnly', false)
                        .closest('.tsg-multi-items')
                        .find('.tsg-list-remove').show()
                }, 1)
            }

            // clean
            if (this.selected?.length > 0) {
                query(this.el).attr('placeholder', '')
            }
            div.find('.tsg-enum-placeholder').remove()
            ul.find('.li-item').remove()

            // add new list
            if (html !== '') {
                ul.prepend(html)
            } else if (query(this.el).attr('placeholder') != null && div.find('input').val() === '') {
                const style = TsUtils.stripSpaces(`
                    padding-top: ${styles['padding-top']};
                    padding-left: ${styles['padding-left']};
                    box-sizing: ${styles['box-sizing']};
                    line-height: ${styles['line-height']};
                    font-size: ${styles['font-size']};
                    font-family: ${styles['font-family']};
                `)
                div.prepend(`<div class="tsg-enum-placeholder" style="${style}">${query(this.el).attr('placeholder')}</div>`)
            }
            // ITEMS events
            div.off('.w2item')
                .on('scroll.w2item', (event: Event) => {
                    const edata = this.trigger('scroll', { target: this.el, originalEvent: event })
                    if (edata.isCancelled === true) return
                    // hide tooltip if any
                    TsTooltip.hide(this.el!.id + '_preview')
                    // event after
                    edata.finish()
                })
                .find('.li-item')
                .on('click.w2item', (event: Event) => {
                    const mouseEvent = event as MouseEvent
                    const target = query(mouseEvent.target).closest('.li-item')
                    const index  = target.attr('index')
                    // any: selected is dynamic array; index from attr() may be undefined
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const item   = index != null ? (this.selected as any[])[Number(index)] : undefined
                    if (query(target).hasClass('li-search')) return
                    mouseEvent.stopPropagation()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let edata: any // any: trigger() returns an event-data object with dynamic properties
                    // default behavior
                    if (query(mouseEvent.target).hasClass('tsg-list-remove')) {
                        if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
                        // trigger event
                        edata = this.trigger('remove', { target: this.el, originalEvent: mouseEvent, item })
                        if (edata.isCancelled === true) return
                        // remove file from input element
                        const transfer = new DataTransfer()
                        const input = query(mouseEvent.target).closest('.tsg-list').find('input.file-input').get(0) as HTMLInputElement
                        if (input) {
                            Array.from(input.files ?? [])
                                .filter((f: File) => f.name != item.name)
                                .forEach((f: File) => transfer.items.add(f))
                            input.files = transfer.files
                        }
                        // remove placeholder in the field
                        if (index != null) this.selected.splice(Number(index), 1)
                        query(this.el).trigger('input').trigger('change')
                        query(mouseEvent.target).remove()
                    } else {
                        // trigger event
                        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        edata = this.trigger('click', { target: this.el, originalEvent: (mouseEvent as any).originalEvent, item })
                        if (edata.isCancelled === true) return
                        // if file - show image preview
                        let preview = item.tooltip
                        if (this.type === 'file') {
                            if ((/image/i).test(item.type)) { // image
                                preview = `
                                    <div class="tsg-file-preview">
                                        <img src="${(item.content ? 'data:'+ item.type +';base64,'+ item.content : '')}"
                                            style="max-width: 300px">
                                    </div>`
                            }
                            preview += `
                                <div class="tsg-file-info">
                                    <div class="file-caption">${TsUtils.lang('Name')}:</div>
                                    <div class="file-value">${item.name}</div>
                                    <div class="file-caption">${TsUtils.lang('Size')}:</div>
                                    <div class="file-value">${TsUtils.formatSize(item.size)}</div>
                                    <div class="file-caption">${TsUtils.lang('Type')}:</div>
                                    <div class="file-value file-type">${item.type}</div>
                                    <div class="file-caption">${TsUtils.lang('Modified')}:</div>
                                    <div class="file-value">${TsUtils.date(item.modified)}</div>
                                </div>`
                        }
                        if (preview) {
                            const name = this.el!.id + '_preview'
                            TsTooltip.show({
                                name,
                                anchor: target.get(0),
                                html: preview,
                                hideOn: ['doc-click'],
                                class: ''
                            })
                            .show((_event: Event) => {
                                const $img = query(`#w2overlay-${name} img`)
                                $img.on('load', function (this: HTMLImageElement, _event: Event) {
                                    const w = this.clientWidth
                                    const h = this.clientHeight
                                    if (w < 300 && h < 300) return
                                    if (w >= h && w > 300) query(this).css('width', '300px')
                                    if (w < h && h > 300) query(this).css('height', '300px')
                                })
                                .on('error', function (this: HTMLElement, _event: Event) {
                                    this.style.display = 'none'
                                })

                            })
                        }
                    }
                    edata.finish()
                })
                .on('mouseenter.w2item', (event: Event) => {
                    const mouseEvent = event as MouseEvent
                    const target = query(mouseEvent.target).closest('.li-item')
                    if (query(target).hasClass('li-search')) return
                    const idx = query(mouseEvent.target).attr('index')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const item = idx != null ? (this.selected as any[])[Number(idx)] : undefined // any: selected is a dynamic array
                    // trigger event
                    const edata = this.trigger('mouseEnter', { target: this.el, originalEvent: mouseEvent, item })
                    if (edata.isCancelled === true) return
                    // event after
                    edata.finish()
                })
                .on('mouseleave.w2item', (event: Event) => {
                    const mouseEvent = event as MouseEvent
                    const target = query(mouseEvent.target).closest('.li-item')
                    if (query(target).hasClass('li-search')) return
                    const idx = query(mouseEvent.target).attr('index')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const item = idx != null ? (this.selected as any[])[Number(idx)] : undefined // any: selected is a dynamic array
                    // trigger event
                    const edata = this.trigger('mouseLeave', { target: this.el, originalEvent: mouseEvent, item })
                    if (edata.isCancelled === true) return
                    // event after
                    edata.finish()
                })

            // update size for enum, hide for file
            if (this.type === 'enum') {
                const search = this.helpers.multi?.find('input')
                search?.css({ width: '15px' })
            } else {
                this.helpers.multi?.find('.li-search').hide()
            }
            this.resize()
        }
        return Date.now() - time
    }

    // resizing width of list, enum, file controls
    resize(): void {
        const width = this.el!.clientWidth
        // let height = this.el!.clientHeight
        // if (this.tmp.current_width == width && height > 0) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access

        const focus  = this.helpers.search
        const multi  = this.helpers.multi
        const suffix = this.helpers.suffix
        const prefix = this.helpers.prefix

        // resize helpers
        if (focus) {
            query(focus).css('width', width)
        }
        if (multi) {
            query(multi).css('width', width - parseInt(styles['margin-left'], 10) - parseInt(styles['margin-right'], 10))
        }
        if (suffix) {
            this.addSuffix()
        }
        if (prefix) {
            this.addPrefix()
        }
        // enum or file
        const div = this.helpers.multi
        if (['enum', 'file'].includes(this.type) && div) {
            // adjust height
            query(this.el).css('height', '')
            let cntHeight = (query(div).find(':scope div.tsg-multi-items').get(0) as HTMLElement).clientHeight + 5
            if (cntHeight < 20) cntHeight = 20
            // max height
            if (this.tmp['max-height'] != null && cntHeight > this.tmp['max-height']) {
                cntHeight = this.tmp['max-height'] ?? cntHeight
            }
            // min height
            if (this.tmp['min-height'] != null && cntHeight < this.tmp['min-height']) {
                cntHeight = this.tmp['min-height'] ?? cntHeight
            }
            const inpHeight = TsUtils.getSize(this.el, 'height') - 2
            if (inpHeight > cntHeight) cntHeight = inpHeight
            query(div).css({
                'height': cntHeight + 'px',
                overflow: (cntHeight == this.tmp['max-height'] ? 'auto' : 'hidden')
            })
            query(div).css('height', cntHeight + 'px')
            query(this.el).css({ 'height': cntHeight + 'px' })
        }
        // remember width
        this.tmp.current_width = width
    }

    reset(): void {
        // restore paddings
        if (this.tmp != null) {
            query(this.el).css('height', '')
            ;['padding-left', 'padding-right', 'background-color', 'border-color'].forEach((prop: string) => {
                if (this.tmp && this.tmp['old-'+ prop] != null) {
                    query(this.el).css(prop, this.tmp['old-' + prop])
                    delete this.tmp['old-' + prop]
                }
            })
            // remove resize watcher
            clearInterval(this.tmp.sizeTimer)
        }
        // remove events and (data)
        ;(query(this.el).val(this.clean(query(this.el).val())) as Query)
            .removeClass('TsField tsg-input')
            .removeData('selected selectedIndex')
            .off('.TsField') // remove only events added by TsField
        // remove helpers
        Object.keys(this.helpers).forEach((key: string) => {
            query(this.helpers[key]).remove()
        })
        this.helpers = {}
        delete this.el!._w2field
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clean(val: any): any { // any: val can be string or number; returns cleaned string or number
        // issue #499
        if (typeof val === 'number'){
            return val
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type
        val = String(val).trim()
        // clean
        if (['int', 'float', 'money', 'currency', 'percent'].includes(this.type)) {
            if (typeof val === 'string') {
                if (options.autoFormat) {
                    if (['money', 'currency'].includes(this.type)) {
                        val = String(val).replace(options.moneyRE, '')
                    }
                    if (this.type === 'percent') {
                        val = String(val).replace(options.percentRE, '')
                    }
                    if (['int', 'float'].includes(this.type)) {
                        val = String(val).replace(options.numberRE, '')
                    }
                }
                // escape group symbol for regex as it could be a ., which is wild card in regex
                const esc_gsroupSymbol = options.groupSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                const esc_decimalSymbol = options.decimalSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                val = val.replace(/\s+/g, '')
                        .replace(new RegExp(esc_gsroupSymbol, 'g'), '')
                        .replace(new RegExp(esc_decimalSymbol, 'g'), '.')
            }
            if (val !== '' && TsUtils.isFloat(val)) val = Number(val); else val = ''
        }
        return val
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format(val: any): any { // any: val is the raw field value; return is the formatted display string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type
        // auto format numbers or money
        if (options.autoFormat && val !== '') {
            switch (this.type) {
                case 'money':
                case 'currency':
                    val = TsUtils.formatNumber(val, options.currency.precision, true)
                    if (val !== '') val = options.currency.prefix + val + options.currency.suffix
                    break
                case 'percent':
                    val = TsUtils.formatNumber(val, options.precision, true)
                    if (val !== '') val += '%'
                    break
                case 'float':
                    val = TsUtils.formatNumber(val, options.precision, true)
                    break
                case 'int':
                    val = TsUtils.formatNumber(val, 0, true)
                    break
            }
            // if default group symbol does not match - replase it
            const group = (1000).toLocaleString(TsUtils.settings.locale, { useGrouping: true }).slice(1, 2)
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (group !== (this.options as any).groupSymbol) {
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                val = val.replaceAll(group, (this.options as any).groupSymbol)
            }
        }
        return val
    }

    change(event: Event): false | void {
        // numeric
        if (['int', 'float', 'money', 'currency', 'percent'].indexOf(this.type) !== -1) {
            // check max/min
            const val = query(this.el).val()
            const new_val = this.format(this.clean(query(this.el).val()))
            // if was modified
            if (val !== '' && val != new_val) {
                query(this.el).val(new_val)
                // cancel event
                event.stopPropagation()
                event.preventDefault()
                return false
            }
        }
        // color
        if (this.type === 'color') {
            let color = query(this.el).val() as string
            if (color.substr(0, 3).toLowerCase() !== 'rgb') {
                color   = '#' + color
                const len = (query(this.el).val() as string).length
                if (len !== 8 && len !== 6 && len !== 3) color = ''
            }
            const next = (query(this.el).get(0) as Element).nextElementSibling
            query(next).find('div').css('background-color', color)
            if (query(this.el).hasClass('has-focus')) {
                this.updateOverlay()
            }
        }
        // list, enum
        if (['list', 'enum', 'file'].indexOf(this.type) !== -1) {
            this.refresh()
        }
        // date, time
        if (['date', 'time', 'datetime'].indexOf(this.type) !== -1) {
            // convert linux timestamps
            let tmp = parseInt(this.el!.value)
            if (TsUtils.isInt(this.el!.value) && tmp > 3000) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (this.type === 'time') tmp = TsUtils.formatTime(new Date(tmp), (this.options as any).format) as any // any: formatTime returns string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (this.type === 'date') tmp = TsUtils.formatDate(new Date(tmp), (this.options as any).format) as any // any: formatDate returns string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (this.type === 'datetime') tmp = TsUtils.formatDateTime(new Date(tmp), (this.options as any).format) as any // any: formatDateTime returns string
                ;(query(this.el).val(String(tmp)) as Query).trigger('input').trigger('change')
            }
        }
    }

    click(event: MouseEvent): void {
        // lists
        if (['list', 'combo', 'enum'].includes(this.type)) {
            if (!query(this.el).hasClass('has-focus')) {
                this.focus(event as unknown as FocusEvent)
            }
            if (this.type == 'list' || this.type == 'combo') {
                // if overlay is already open (and not just opened on focus event) then hide it
                if (!this.tmp.openedOnFocus) {
                    const name = this.el!.id + '_menu'
                    const overlay = TsMenu.get(name)
                    if (overlay?.displayed) {
                        TsMenu.hide(name)
                    } else {
                        this.updateOverlay()
                    }
                }
                delete this.tmp.openedOnFocus
                if (this.type == 'list') {
                    // since list has separate search input, in order to keep the overlay open, need to stop
                    event.stopPropagation()
                }
            }
            if (this.type == 'enum') {
                this.updateOverlay()
            }
        }
        // other fields with drops
        if (['date', 'time', 'datetime', 'color'].includes(this.type)) {
            this.updateOverlay()
        }
    }

    focus(event: FocusEvent & { showMenu?: boolean }): void {
        if (this.type == 'list' && document.activeElement == this.el) {
            this.helpers.search_focus?.focus()
            // update overlay if needed
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (event.showMenu !== false && (this.options as any).openOnFocus !== false && query(this.el).hasClass('has-focus')
                    && !this.tmp.overlay?.overlay?.displayed) {
                setTimeout(() => {
                    this.tmp.openedOnFocus = true
                    this.updateOverlay()
                }, 0) // execute at the end of event loop
            }
            return
        }
        // color, date, time
        if (['color', 'date', 'time', 'datetime'].indexOf(this.type) !== -1) {
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            this.updateOverlay()
        }
        // menu
        if (['list', 'combo', 'enum'].indexOf(this.type) !== -1) {
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) {
                // still add focus
                query(this.el).addClass('has-focus')
                return
            }
            // regenerate items
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (this.options as any)._items_fun == 'function') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this.options as any).items = TsUtils.normMenu.call(this, (this.options as any)._items_fun, this.options as any) // any: options is TsFieldOptions which is a superset of TsNormMenuOptions
            }
            if (this.helpers.search) {
                const search = this.helpers.search_focus
                if (search) {
                    search.value = ''
                    search.select()
                }
            }
            if (this.type == 'enum') {
                // file control in particular need to receive focus after file select
                const search = query(this.el!.previousElementSibling).find('.li-search input').get(0) as HTMLInputElement
                if (document.activeElement !== search) {
                    search.focus()
                }
            }
            this.resize()
            // update overlay if needed
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (event.showMenu !== false && (this.options as any).openOnFocus !== false && query(this.el).hasClass('has-focus')
                    && !this.tmp.overlay?.overlay?.displayed) {
                setTimeout(() => {
                    this.tmp.openedOnFocus = true
                    this.updateOverlay()
                }, 0) // execute at the end of event loop
            }
        }
        if (this.type == 'file') {
            const prev = (query(this.el).get(0) as Element).previousElementSibling
            query(prev).addClass('has-focus')
        }
        query(this.el).addClass('has-focus')
    }

    blur(_event: FocusEvent): void {
        const val = (query(this.el).val() as string).trim()
        query(this.el).removeClass('has-focus')

        if (['int', 'float', 'money', 'currency', 'percent'].includes(this.type)) {
            if (val !== '') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let newVal: any = val // any: newVal may be string or number after clean()
                let error = ''
                if (!this.isStrValid(val)) { // validity is also checked in blur
                    newVal = ''
                } else {
                    const rVal = this.clean(val)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const options = this.options as any // any: options shape depends on type
                    if (options.min != null && rVal < options.min) {
                        newVal = options.min
                        error = `Should be >= ${options.min}`
                    }
                    if (options.max != null && rVal > options.max) {
                        newVal = options.max
                        error = `Should be <= ${options.max}`
                    }
                }
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((this.options as any).autoCorrect) {
                    ;(query(this.el).val(newVal) as Query).trigger('input').trigger('change')
                    if (error) {
                        TsTooltip.show({
                            name: this.el!.id + '_error',
                            anchor: this.el,
                            html: error
                        })
                        setTimeout(() => { TsTooltip.hide(this.el!.id + '_error') }, 3000)
                    }
                }
            }
        }
        // date or time
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (['date', 'time', 'datetime'].includes(this.type) && (this.options as any).autoCorrect) {
            if (val !== '') {
                const check = this.type == 'date' ? TsUtils.isDate :
                    (this.type == 'time' ? TsUtils.isTime : TsUtils.isDateTime)
                if (!TsDate.inRange(this.el!.value, this.options)
                        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        || !check.bind(TsUtils)(this.el!.value, (this.options as any).format)) {
                    // if not in range or wrong value - clear it
                    ;(query(this.el).val('') as Query).trigger('input').trigger('change')
                }
            }
        }
        // clear search input
        if (this.type === 'enum') {
            ;(query(this.helpers.multi).find('input').val('') as Query).css('width', '15px')
            // don't hide menu on blur, it should be hidden on tab key up instead, or it will not alow select with click
            // TsMenu.hide(this.el!.id + '_menu')
        }
        if (this.type == 'file') {
            const prev = this.el!.previousElementSibling
            query(prev).removeClass('has-focus')
        }
        if (this.type === 'list') {
            this.el!.value = this.selected?.text ?? ''
            // don't hide menu on blur, it should be hidden on tab key up instead, or it will not alow select with click
            // TsMenu.hide(this.el!.id + '_menu')
        }
    }

    keyDown(event: KeyboardEvent, extra?: { keyCode?: number }): false | void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type
        const key     = event.keyCode || (extra && extra.keyCode)
        let cancel  = false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let val: any, inc: number, daymil: number, dt: Date | boolean, newValue: number, newDT: string // any: val holds current field value (string or number)
        // ignore wrong pressed key
        if (['int', 'float', 'money', 'currency', 'percent', 'hex', 'bin', 'color', 'alphanumeric'].includes(this.type)) {
            if (!event.metaKey && !event.ctrlKey && !event.altKey) {
                if (!this.isStrValid(event.key ?? '1', true) && // valid & is not arrows, dot, comma, etc keys
                        ![9, 8, 13, 27, 37, 38, 39, 40, 46].includes(event.keyCode)) {
                    event.preventDefault()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (event.stopPropagation) event.stopPropagation(); else (event as any).cancelBubble = true // any: cancelBubble is legacy IE
                    return false
                }
            }
        }
        // numeric
        if (['int', 'float', 'money', 'currency', 'percent'].includes(this.type)) {
            if (!options.keyboard || query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            val = parseFloat((query(this.el).val() as string).replace(options.moneyRE, '')) || 0
            inc = options.step
            if (event.ctrlKey || event.metaKey) inc = options.step * 10
            switch (key) {
                case 38: // up
                    if (event.shiftKey) break // no action if shift key is pressed
                    newValue = (val + inc <= options.max || options.max == null ? Number((val + inc).toFixed(12)) : options.max)
                    ;(query(this.el).val(String(newValue)) as Query).trigger('input').trigger('change')
                    cancel = true
                    break
                case 40: // down
                    if (event.shiftKey) break // no action if shift key is pressed
                    newValue = (val - inc >= options.min || options.min == null ? Number((val - inc).toFixed(12)) : options.min)
                    ;(query(this.el).val(String(newValue)) as Query).trigger('input').trigger('change')
                    cancel = true
                    break
            }
            if (cancel) {
                event.preventDefault()
                this.moveCaret2end()
            }
        }
        // date/datetime
        if (['date', 'datetime'].includes(this.type)) {
            if (!options.keyboard || query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            const is = (this.type == 'date' ? TsUtils.isDate : TsUtils.isDateTime).bind(TsUtils) as (val: string, format: string, returnDate: boolean) => Date | boolean
            const format = (this.type == 'date' ? TsUtils.formatDate : TsUtils.formatDateTime).bind(TsUtils) as (time: number, format: string) => string

            daymil = 24*60*60*1000
            inc = 1
            if (event.ctrlKey || event.metaKey) inc = 10 // by month
            dt = is(query(this.el).val() as string, options.format, true)
            if (!dt) { dt = new Date(); daymil = 0 }
            switch (key) {
                case 38: // up
                    if (event.shiftKey) break // no action if shift key is pressed
                    if (inc == 10) {
                        (dt as Date).setMonth((dt as Date).getMonth() + 1)
                    } else {
                        (dt as Date).setTime((dt as Date).getTime() + daymil)
                    }
                    newDT = format((dt as Date).getTime(), options.format)
                    ;(query(this.el).val(newDT) as Query).trigger('input').trigger('change')
                    cancel = true
                    break
                case 40: // down
                    if (event.shiftKey) break // no action if shift key is pressed
                    if (inc == 10) {
                        (dt as Date).setMonth((dt as Date).getMonth() - 1)
                    } else {
                        (dt as Date).setTime((dt as Date).getTime() - daymil)
                    }
                    newDT = format((dt as Date).getTime(), options.format)
                    ;(query(this.el).val(newDT) as Query).trigger('input').trigger('change')
                    cancel = true
                    break
            }
            if (cancel) {
                event.preventDefault()
                this.moveCaret2end()
                this.updateOverlay()
            }
        }
        // time
        if (this.type === 'time') {
            if (!options.keyboard || query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            inc = (event.ctrlKey || event.metaKey ? 60 : 1)
            val = query(this.el).val()
            let time = TsDate.str2min(val as string) || TsDate.str2min((new Date()).getHours() + ':' + ((new Date()).getMinutes() - 1))
            switch (key) {
                case 38: // up
                    if (event.shiftKey) break // no action if shift key is pressed
                    time  += inc
                    cancel = true
                    break
                case 40: // down
                    if (event.shiftKey) break // no action if shift key is pressed
                    time  -= inc
                    cancel = true
                    break
            }
            if (cancel) {
                event.preventDefault()
                ;(query(this.el).val(TsDate.min2str(time)) as Query).trigger('input').trigger('change')
                this.moveCaret2end()
            }
        }
        // list/enum
        if (['list', 'enum'].includes(this.type)) {
            switch (key) {
                case 8: // delete
                case 46: // backspace
                    if (this.type == 'list') {
                        const search = query(this.helpers.search_focus)
                        if (search.val() == '') {
                            const edata = this.trigger('remove', { target: this.el, originalEvent: event, item: this.selected })
                            if (edata.isCancelled === true) return
                            this.selected = null
                            TsMenu.hide(this.el!.id + '_menu')
                            ;(query(this.el).val('') as Query).trigger('input').trigger('change')
                            edata.finish()
                        }
                    } else {
                        const search = query(this.helpers.multi).find('input')
                        if (search.val() == '') {
                            const edata = this.trigger('remove', { target: this.el, originalEvent: event, item: this.selected[this.selected.length - 1] })
                            if (edata.isCancelled === true) return

                            TsMenu.hide(this.el!.id + '_menu')
                            this.selected.pop()
                            // update selected array in overlay
                            const overlay = TsMenu.get(this.el!.id + '_menu')
                            if (overlay) overlay.options.selected = this.selected
                            this.refresh()
                            edata.finish()
                        }
                    }
                    break
                case 9: // tab key
                case 16: // shift key (when shift+tab)
                    TsMenu.hide(this.el!.id + '_menu')
                    break
                case 27: // escape
                    TsMenu.hide(this.el!.id + '_menu')
                    this.refresh()
                    break
                default: {
                    // intentionally blank
                }
            }
        }
    }

    keyUp(event: KeyboardEvent): void {
        if (this.type == 'list') {
            const search = query(this.helpers.search_focus)
            if (search.val() !== '') {
                query(this.el).attr('placeholder', '')
            } else {
                query(this.el).attr('placeholder', this.tmp.pholder)
            }
            if (event.keyCode == 13) {
                setTimeout(() => {
                    search.val('')
                    TsMenu.hide(this.el!.id + '_menu')
                    this.refresh()
                }, 1)
            }
            // if arrows are clicked, it will show overlay
            if ([38, 40].includes(event.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
                this.updateOverlay()
            }
            this.refresh()
        }
        if (this.type == 'combo') {
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (![9, 16, 27].includes(event.keyCode) && (this.options as any).openOnFocus !== true) {
                // do not show when receives focus on tab or shift + tab or on esc
                this.updateOverlay()
            }
            // if arrows are clicked, it will show overlay
            if ([38, 40].includes(event.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
                this.updateOverlay()
            }
        }
        if (this.type == 'enum') {
            const search = this.helpers.multi?.find('input')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const styles = getComputedStyle(search?.get(0) as HTMLElement) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
            const width = TsUtils.getStrWidth(search?.val() as string,
                `font-family: ${styles['font-family']}; font-size: ${styles['font-size']};`, undefined)
            search?.css({ width: (width + 15) + 'px' })
            this.resize()
            // if delete, backspace, tab, shift, escape - hide menu
            if ([8, 46, 9, 16, 27].includes(event.keyCode)) {
                if (this.tmp.overlay?.overlay?.displayed) {
                    TsMenu.hide(this.el!.id + '_menu')
                }
            } else {
                this.updateOverlay()
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findItemIndex(items: any[], id: any, parents?: number[]): number[] { // any: items/id vary by field type
        let inds: number[] = []
        if (!parents) parents = []
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (['list', 'combo', 'enum'].includes(this.type) && (this.options as any).url) {
            // remove source, so get it from overlay
            const overlay = TsMenu.get(this.el!.id + '_menu')
            if (overlay) {
                items = overlay.options.items
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this.options as any).items = items
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any, ind: number) => { // any: item shape varies by field type
            if (item.id === id) {
                inds = parents.concat([ind])
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this.options as any).index = [ind]
            }
            if (inds.length == 0 && item.items && item.items.length > 0) {
                parents.push(ind)
                inds = this.findItemIndex(item.items, id, parents)
                parents.pop()
            }
        })
        return inds
    }

    updateOverlay(_indexOnly?: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let params: any // any: params object is assembled per-type and passed to TsMenu/TsColor/TsDate
        // color
        if (this.type === 'color') {
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            TsColor.show(TsUtils.extend({
                name: this.el!.id + '_color',
                anchor: this.el,
                transparent: options.transparent,
                advanced: options.advanced,
                color: this.el!.value,
                liveUpdate: true
            }, this.options))
            .select((event: TsEventPayload) => {
                const color = event.detail['color'] as string // any: detail shape determined by TsColor overlay
                ;(query(this.el).val(color) as Query).trigger('input').trigger('change')
            })
            .liveUpdate((event: TsEventPayload) => {
                const color = event.detail['color'] as string // any: detail shape determined by TsColor overlay
                query(this.helpers.suffix).find(':scope > div').css('background-color', '#' + color)
            })
        }
        // list
        if (['list', 'combo', 'enum'].includes(this.type)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let el: any = this.el // any: el is TsFieldElement|HTMLElement depending on type
            let input: HTMLElement = this.el!
            if (this.type === 'enum') {
                el = this.helpers.multi?.get(0) as TsFieldElement ?? this.el
                input = query(el).find('input').get(0) as HTMLElement ?? this.el
            }
            if (this.type === 'list') {
                const sel = this.selected
                if (TsUtils.isPlainObject(sel) && Object.keys(sel).length > 0) {
                    const ind = this.findItemIndex(options.items, sel.id)
                    if (ind.length > 0) {
                        options.index = ind
                    }
                }
                input = this.helpers.search_focus ?? this.el!
            }
            if (query(this.el).hasClass('has-focus') && !this.el!.readOnly && !this.el!.disabled) {
                params = TsUtils.extend({}, options, {
                    name: this.el!.id + '_menu',
                    anchor: input,
                    selected: this.selected,
                    search: false,
                    render: options.renderDrop,
                    anchorClass: '',
                    offsetY: 5,
                    maxHeight: options.maxDropHeight, // TODO: check
                    maxWidth: options.maxDropWidth,  // TODO: check
                    minWidth: options.minDropWidth   // TODO: check
                })
                this.tmp.overlay = TsMenu.show(params)
                    .select((event: TsEventPayload) => {
                        if (['list', 'combo'].includes(this.type)) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            this.selected = event.detail['item'] as any // any: detail shape determined by TsMenu overlay
                            query(input).val('')
                            ;(query(this.el).val(this.selected.text) as Query).trigger('input').trigger('change')
                            this.focus({ showMenu: false } as FocusEvent & { showMenu?: boolean })
                        } else {
                            const selected = this.selected
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const newItem = event.detail?.['item'] as any // any: detail shape determined by TsMenu overlay
                            if (newItem) {
                                // trigger event
                                const edata = this.trigger('add', { target: this.el, item: newItem, originalEvent: event })
                                if (edata.isCancelled === true) return
                                // default behavior
                                if (selected.length >= options.max && options.max > 0) selected.pop()
                                delete newItem.hidden
                                selected.push(newItem)
                                query(this.el).trigger('input').trigger('change')
                                query(this.helpers.multi).find('input').val('')
                                // updaet selected array in overlays
                                const overlay = TsMenu.get(this.el!.id + '_menu')
                                if (overlay) overlay.options.selected = this.selected
                                // event after
                                edata.finish()
                            }
                        }
                    })
            }
        }
        // date
        if (['date', 'time', 'datetime'].includes(this.type)) {
            if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
            TsDate.show(TsUtils.extend({
                name: this.el!.id + '_date',
                anchor: this.el,
                value: this.el!.value,
            }, this.options))
            .select((event: TsEventPayload) => {
                const date = event.detail['date'] as string | null | undefined // any: detail shape determined by TsDate overlay
                if (date != null) {
                    ;(query(this.el).val(date) as Query).trigger('input').trigger('change')
                }
            })
        }
    }

    /*
    *  INTERNAL FUNCTIONS
    */

    isStrValid(ch: string, loose?: boolean): boolean {
        let isValid = true
        switch (this.type) {
            case 'int':
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (loose && ['-', (this.options as any).groupSymbol].includes(ch)) {
                    isValid = true
                } else {
                    // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    isValid = TsUtils.isInt(ch.replace((this.options as any).numberRE, ''))
                }
                break
            case 'percent':
                ch = ch.replace(/%/g, '')
            // falls through to float
            case 'float':
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (loose && ['-', '', (this.options as any).decimalSymbol, (this.options as any).groupSymbol].includes(ch)) {
                    isValid = true
                } else {
                    // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    isValid = TsUtils.isFloat(ch.replace((this.options as any).numberRE, ''))
                }
                break
            case 'money':
            case 'currency':
                // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (loose && ['-', (this.options as any).decimalSymbol, (this.options as any).groupSymbol, (this.options as any).currency.prefix,
                    // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.options as any).currency.suffix].includes(ch)) {
                    isValid = true
                } else {
                    // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    isValid = TsUtils.isFloat(ch.replace((this.options as any).moneyRE, ''))
                }
                break
            case 'bin':
                isValid = TsUtils.isBin(ch)
                break
            case 'color':
            case 'hex':
                isValid = TsUtils.isHex(ch)
                break
            case 'alphanumeric':
                isValid = TsUtils.isAlphaNumeric(ch)
                break
        }
        return isValid
    }

    addPrefix(): void {
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this.options as any).prefix) {
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
        if (this.tmp['old-padding-left'] == null) {
            this.tmp['old-padding-left'] = styles['padding-left']
        }
        // remove if already displayed
        if (this.helpers.prefix) query(this.helpers.prefix).remove()
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query(this.el).before(`<div class="tsg-field-helper">${(this.options as any).prefix}</div>`)
        const helper = (query(this.el).get(0) as Element).previousElementSibling as HTMLElement
        query(helper)
            .css({
                'color'          : styles['color'],
                'font-family'    : styles['font-family'],
                'font-size'      : styles['font-size'],
                'height'         : this.el!.clientHeight + 'px',
                'padding-top'    : parseInt(styles['padding-top'], 10) + 1 + 'px',
                'padding-bottom' : parseInt(styles['padding-bottom'], 10) - 1 + 'px',
                'padding-left'   : this.tmp['old-padding-left'] ?? '',
                'padding-right'  : 0,
                'margin-top'     : (parseInt(styles['margin-top'], 10)) + 'px',
                'margin-bottom'  : (parseInt(styles['margin-bottom'], 10)) + 'px',
                'margin-left'    : styles['margin-left'],
                'margin-right'   : 0,
                'z-index'        : 1,
                'display'        : 'inline-flex',
                'align-items'    : 'center'
            })
        // only if visible
        query(this.el).css('padding-left', helper.clientWidth + 'px !important')
        // remember helper
        this.helpers.prefix = helper
    }

    addSuffix(): void {
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(this.options as any).suffix && !(this.options as any).arrows) {
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
        if (this.tmp['old-padding-right'] == null) {
            this.tmp['old-padding-right'] = styles['padding-right']
        }
        let pr = parseInt(styles['padding-right'] || '0')
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.options as any).arrows) {
            // remove if already displayed
            if (this.helpers.arrows) query(this.helpers.arrows).remove()
            // add fresh
            query(this.el).after(
                '<div class="tsg-field-helper" style="border: 1px solid transparent">&#160;'+
                '    <div class="tsg-field-up" type="up">'+
                '        <div class="arrow-up" type="up"></div>'+
                '    </div>'+
                '    <div class="tsg-field-down" type="down">'+
                '        <div class="arrow-down" type="down"></div>'+
                '    </div>'+
                '</div>')
            const arrowHelper = (query(this.el).get(0) as Element).nextElementSibling as HTMLElement
            const $arrowHelper = query(arrowHelper)
            $arrowHelper.css({
                'color'         : styles['color'],
                'font-family'   : styles['font-family'],
                'font-size'     : styles['font-size'],
                'height'        : this.el!.clientHeight + 'px',
                'padding'       : 0,
                'margin-top'    : (parseInt(styles['margin-top'], 10) + 1) + 'px',
                'margin-bottom' : 0,
                'border-left'   : '1px solid silver',
                'width'         : '16px',
                'transform'     : 'translateX(-100%)'
            })
            $arrowHelper.on('mousedown', (event: Event) => {
                const mouseEvent = event as MouseEvent
                if (query(mouseEvent.target).hasClass('arrow-up')) {
                    this.keyDown(mouseEvent as unknown as KeyboardEvent, { keyCode: 38 })
                }
                if (query(mouseEvent.target).hasClass('arrow-down')) {
                    this.keyDown(mouseEvent as unknown as KeyboardEvent, { keyCode: 40 })
                }
            })
            pr += arrowHelper.clientWidth // width of the control
            query(this.el).css('padding-right', pr + 'px !important')
            this.helpers.arrows = arrowHelper
        }
        // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.options as any).suffix !== '') {
            // remove if already displayed
            if (this.helpers.suffix) query(this.helpers.suffix).remove()
            // add fresh
            // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query(this.el).after(`<div class="tsg-field-helper">${(this.options as any).suffix}</div>`)
            const suffixHelper = (query(this.el).get(0) as Element).nextElementSibling as HTMLElement
            query(suffixHelper)
                .css({
                    'color'          : styles['color'],
                    'font-family'    : styles['font-family'],
                    'font-size'      : styles['font-size'],
                    'height'        : this.el!.clientHeight + 'px',
                    'padding-top'    : styles['padding-top'],
                    'padding-bottom' : styles['padding-bottom'],
                    'padding-left'   : 0,
                    'padding-right'  : styles['padding-right'],
                    'margin-top'     : (parseInt(styles['margin-top'], 10) + 2) + 'px',
                    'margin-bottom'  : (parseInt(styles['margin-bottom'], 10) + 1) + 'px',
                    'transform'      : 'translateX(-100%)'
                })

            query(this.el).css('padding-right', suffixHelper.clientWidth + 'px !important')
            this.helpers.suffix = suffixHelper
        }
    }

    // Only used for list
    addSearch(): void {
        if (this.type !== 'list') return
        // clean up & init
        if (this.helpers.search) query(this.helpers.search).remove()
        // remember original tabindex
        let tabIndex = parseInt(query(this.el).attr('tabIndex') as string)
        if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp['old-tabIndex'] = tabIndex
        if (this.tmp['old-tabIndex']) tabIndex = this.tmp['old-tabIndex']
        if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0
        // if there is id, add to search with "_search"
        let searchId = ''
        if (query(this.el).attr('id') != null) {
            searchId = 'id="' + query(this.el).attr('id') + '_search"'
        }
        // build helper
        const html = `
            <div class="tsg-field-helper">
                <span class="tsg-icon" data-icon="search">${searchIcon()}</span>
                <input ${searchId} type="text" tabIndex="${tabIndex}" ${query(this.el).prop('readOnly') ? 'readonly' : ''}
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`
        query(this.el).attr('tabindex', String(-1)).before(html)
        const helper = (query(this.el).get(0) as Element).previousElementSibling as HTMLElement
        this.helpers.search = helper
        this.helpers.search_focus = query(helper).find('input').get(0) as HTMLInputElement
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
        const $helperSearch = query(helper)
        $helperSearch.css({
            width           : this.el!.clientWidth + 'px',
            'margin-top'    : styles['margin-top'],
            'margin-left'   : styles['margin-left'],
            'margin-bottom' : styles['margin-bottom'],
            'margin-right'  : styles['margin-right']
        })
        $helperSearch.find('input')
            .css({
                cursor   : 'default',
                width    : '100%',
                opacity  : 1,
                padding  : styles['padding'],
                margin   : styles['margin'],
                border   : '1px solid transparent',
                'background-color' : 'transparent'
            })
        // INPUT events
        query(helper).find('input')
            .off('.tsg-helper')
            .on('focus.tsg-helper', (event: Event) => {
                const focusEvent = event as FocusEvent
                query(focusEvent.target).val('')
                this.tmp.pholder = query(this.el).attr('placeholder') ?? ''
                this.focus(focusEvent)
                focusEvent.stopPropagation()
            })
            .on('blur.tsg-helper', (event: Event) => {
                const focusEvent = event as FocusEvent
                query(focusEvent.target).val('')
                if (this.tmp.pholder != null) query(this.el).attr('placeholder', this.tmp.pholder)
                this.blur(focusEvent)
                focusEvent.stopPropagation()
            })
            .on('keydown.tsg-helper', (event: Event) => { this.keyDown(event as KeyboardEvent) })
            .on('keyup.tsg-helper', (event: Event) => { this.keyUp(event as KeyboardEvent) })
        // MAIN div
        query(helper)
            .off('.tsg-helper')
            .on('click.tsg-helper', (_event: Event) => {
                (query(helper).find('input').get(0) as HTMLInputElement).focus()
            })
    }

    // Used in enum/file
    addMultiSearch(): void {
        if (!['enum', 'file'].includes(this.type)) {
            return
        }
        // clean up & init
        query(this.helpers.multi).remove()
        // build helper
        let html   = ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styles = getComputedStyle(this.el!) as any // any: CSSStyleDeclaration has numeric-only index; cast for hyphenated key access
        const margin = TsUtils.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${styles['margin-left']};
            margin-right: ${styles['margin-right']};
            width: ${(TsUtils.getSize(this.el, 'width') - parseInt(styles['margin-left'], 10)
                                - parseInt(styles['margin-right'], 10))}px;
        `)
        if (this.tmp['min-height'] == null) {
            const min = this.tmp['min-height'] = parseInt((styles['min-height'] != 'none' ? styles['min-height'] : '0') || '0')
            const current = parseInt(styles['height'])
            this.tmp['min-height'] = Math.max(min, current)
        }
        if (this.tmp['max-height'] == null && styles['max-height'] != 'none') {
            this.tmp['max-height'] = parseInt(styles['max-height'])
        }

        // if there is id, add to search with "_search"
        let searchId = ''
        if (query(this.el).attr('id') != null) {
            searchId = `id="${query(this.el).attr('id')}_search"`
        }
        // remember original tabindex
        let tabIndex = parseInt(query(this.el).attr('tabIndex') as string)
        if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp['old-tabIndex'] = tabIndex
        if (this.tmp['old-tabIndex']) tabIndex = this.tmp['old-tabIndex']
        if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0

        if (this.type === 'enum') {
            html = `
            <div class="tsg-field-helper tsg-list" style="${margin}">
                <div class="tsg-multi-items">
                    <div class="li-search">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query(this.el).prop('readOnly') ? 'readonly': '' }
                            ${query(this.el).prop('disabled') ? 'disabled': '' }>
                    </div>
                </div>
            </div>`
        }
        if (this.type === 'file') {
            html = `
            <div class="tsg-field-helper tsg-list" style="${margin}">
                <div class="tsg-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${(this.options as { max?: number }).max !== 1 ? 'multiple' : ''}
                        ${query(this.el).prop('readOnly') || query(this.el).prop('disabled') ? 'disabled': ''}
                        ${query(this.el).attr('accept') ? ' accept="'+ query(this.el).attr('accept') +'"': ''}>
                </div>
                <div class="tsg-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query(this.el).prop('readOnly') ? 'readonly': '' }
                            ${query(this.el).prop('disabled') ? 'disabled': '' }>
                    </div>
                </div>
            </div>`
        }
        // old bg and border
        this.tmp['old-background-color'] = styles['background-color']
        this.tmp['old-border-color']     = styles['border-color']

        query(this.el)
            .before(html)
            .css({
                'border-color': 'transparent',
                'background-color': 'transparent'
            })

        const div = query(this.el!.previousElementSibling)
        this.helpers.multi = div
        query(this.el).attr('tabindex', String(-1))
        // click anywhere on the field
        div.on('mousedown', (event: Event) => { query(event.target).addClass('has-focus') })  // this is needed so that visually focus is there
            .on('mouseup', (event: Event) => { query(event.target).removeClass('has-focus') })
            .on('click', (event: Event) => { this.focus(event as unknown as FocusEvent); this.updateOverlay() })

        // search field (small and growing one)
        div.find('input:not(.file-input)')
            .on('click', (event: Event) => { this.click(event as MouseEvent) })
            .on('focus', (event: Event) => { this.focus(event as FocusEvent) })
            .on('blur', (event: Event) => { this.blur(event as FocusEvent) })
            .on('keydown', (event: Event) => { this.keyDown(event as KeyboardEvent) })
            .on('keyup', (event: Event) => { this.keyUp(event as KeyboardEvent) })

        // file input
        if (this.type === 'file') {
            div.find('input.file-input')
                .off('.drag')
                .on('click.drag', (event: Event) => {
                    const mouseEvent = event as MouseEvent
                    mouseEvent.stopPropagation()
                    if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
                    this.focus(mouseEvent as unknown as FocusEvent)
                })
                .on('dragenter.drag', (_event: Event) => {
                    if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
                    div.addClass('tsg-file-dragover')
                })
                .on('dragleave.drag', (_event: Event) => {
                    if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
                    div.removeClass('tsg-file-dragover')
                })
                .on('drop.drag', (event: Event) => {
                    const dragEvent = event as DragEvent
                    if (query(this.el).prop('readOnly') || query(this.el).prop('disabled')) return
                    div.removeClass('tsg-file-dragover')
                    const files = Array.from(dragEvent.dataTransfer?.files ?? [])
                    files.forEach((file: File) => { this.addFile(file) })
                    this.focus(dragEvent as unknown as FocusEvent)
                    // cancel to stop browser behaviour
                    dragEvent.preventDefault()
                    dragEvent.stopPropagation()
                })
                .on('dragover.drag', (event: Event) => {
                    const dragEvent = event as DragEvent
                    // cancel to stop browser behaviour
                    dragEvent.preventDefault()
                    dragEvent.stopPropagation()
                })
                .on('change.drag', (event: Event) => {
                    const target = event.target as HTMLInputElement
                    if (target.files != null) {
                        Array.from(target.files).forEach((file: File) => { this.addFile(file) })
                    }
                    this.focus(event as unknown as FocusEvent)
                })
        }
        this.refresh()
    }

    addFile(file: File): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = this.options as any // any: options shape depends on type (file-specific here)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selected = this.selected as any[] // any: selected is array of file-like objects
        const newItem: {
            name: string
            type: string
            modified: Date
            size: number
            content: string | null
            file: File
        } = {
            name     : file.name,
            type     : file.type,
            modified : new Date(file.lastModified),
            size     : file.size,
            content  : null,
            file     : file
        }
        let size = 0
        let cnt = 0
        const errors: string[] = []
        if (Array.isArray(selected)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            selected.forEach((item: any) => { // any: item is a file-like object
                if (item.name == file.name && item.size == file.size) {
                    errors.push(TsUtils.lang('The file "${name}" (${size}) is already added.', {
                        name: file.name, size: String(TsUtils.formatSize(file.size)) }))
                }
                size += item.size
                cnt++
            })
        }
        if (options.maxFileSize !== 0 && newItem.size > options.maxFileSize) {
            errors.push(TsUtils.lang('Maximum file size is ${size}', { size: String(TsUtils.formatSize(options.maxFileSize)) }))
        }
        if (options.maxSize !== 0 && size + newItem.size > options.maxSize) {
            errors.push(TsUtils.lang('Maximum total size is ${size}', { size: String(TsUtils.formatSize(options.maxSize)) }))
        }
        if (options.max !== 0 && cnt >= options.max) {
            errors.push(TsUtils.lang('Maximum number of files is ${count}', { count: options.max }))
        }

        // trigger event
        const edata = this.trigger('add', { target: this.el, file: newItem, total: cnt, totalSize: size, errors })
        if (edata.isCancelled === true) return
        // if errors
        if (errors.length > 0) {
            if (options.showErrors) {
                TsTooltip.show({
                    anchor: this.el,
                    html: 'Errors: ' + errors.join('<br>'),
                    hideOn: ['input', 'doc-click']
                })
            }
            console.log('ERRORS (while adding files): ', errors)
            return
        }
        // check params
        selected.push(newItem)
        // read file as base64
        if (typeof FileReader !== 'undefined' && options.readContent === true) {
            const reader = new FileReader()
            // need a closure — use arrow function to avoid no-this-alias
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const fl = event.target?.result as string ?? ''
                const ind = fl.indexOf(',')
                newItem.content = fl.substr(ind + 1)
                this.refresh()
                query(this.el).trigger('input').trigger('change')
                // event after
                edata.finish()
            }
            reader.readAsDataURL(file)
        } else {
            this.refresh()
            query(this.el).trigger('input').trigger('change')
            edata.finish()
        }
    }

    // move cursror to end
    moveCaret2end(): void {
        setTimeout(() => {
            this.el!.setSelectionRange(this.el!.value.length, this.el!.value.length)
        }, 0)
    }
}

export { TsField }
