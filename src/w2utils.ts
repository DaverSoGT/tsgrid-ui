/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2locale
 *
 * T2.5: @ts-nocheck removed; file typed aggressively per typing_policy.
 * See commit body for targeted-any inventory.
 *
 * == TODO ==
 *  - add w2utils.lang wrap for all captions in all buttons.
 *  - check transition (also with layout)
 *  - deprecate w2utils.tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events (w2utils.tooltip still has it)
 *  - transition returns a promise
 *  - removed jQuery
 *  - refactores w2utils.message()
 *  - added w2utils.confirm()
 *  - added isPlainObject
 *  - added stripSpaces
 *  - implemented marker - can now take an element or just html
 *  - cssPrefix - deprecated
 *  - w2utils.debounce
 *  - w2utils.prepareParams
 *  - w2utils.getStrHeight
 *  - w2utils.getStrDimentions
 *  - w2utils.alrert() - same as w2utils.message()
 *  - w2utils.prompt() - similar to w2prompt
 *  - w2utils.normMenu(..., options) got options parameter that can have itemMap
 *  - w2utils.getNested()
 *  - w2utils.wait() - async timer
 */

import { w2base } from './w2base.js'
import { w2locale } from './w2locale.js'
import { query as _query, Query } from './query.js'

// w2utils always calls query() with a selector (never a callback) so the return is always Query.
// any: query() overload returns void|Query when called with a callback; we only use selector calls here
const query = _query as (selector: unknown, context?: unknown) => Query

// variable that holds all w2ui objects
const w2ui: Record<string, unknown> = {}

// ---------------------------------------------------------------------------
// Public interfaces — exported via w2utils instance
// ---------------------------------------------------------------------------

/** Settings object merged from w2locale + user locale overrides */
interface W2UISettings {
    dataType: string
    dateFormat: string
    timeFormat: string
    datetimeFormat: string
    dateStartYear: number
    dateEndYear: number
    currencyPrefix: string
    currencySuffix: string
    currencyPrecision: number
    groupSymbol: string
    decimalSymbol: string
    shortmonths: string[]
    fullmonths: string[]
    shortdays: string[]
    fulldays: string[]
    weekStarts: string
    macButtonOrder: boolean
    warnNoPhrase: boolean
    phrases: Record<string, string> | null
    missing?: Record<string, string>
    locale?: string
    [key: string]: unknown   // locale files can add arbitrary keys; unknown forces cast at use-sites
}

/** Extra data passed to grid cell formatters */
interface W2FormatterExtra {
    value: unknown
    params?: unknown
    record?: unknown
    [key: string]: unknown
}

/** Signature of a grid-cell formatter function */
type W2Formatter = (record: W2FormatterExtra, extra?: W2FormatterExtra) => string

/** Options for w2utils.lock() */
interface W2LockOptions {
    msg?: string | number
    spinner?: boolean
    opacity?: number
    bgColor?: string
    onClick?: () => void
}

/** Return value from w2utils.isTime() when retTime === true */
interface W2TimeResult {
    hours: number
    minutes: number
    seconds: number
}

/** RGB(A) color as returned by w2utils.parseColor() */
interface W2Color {
    r: number
    g: number
    b: number
    a: number
}

/** Options for w2utils.marker() */
interface W2MarkerOptions {
    onlyFirst?: boolean
    wholeWord?: boolean
    isRegex?: boolean
    tag?: string
    class?: string
    raplace?: (matched: string) => string
}

/** Route parameter descriptor */
interface W2RouteKey {
    name: string
    optional: boolean
}

/** Parsed route as returned by w2utils.parseRoute() */
interface W2ParsedRoute {
    path: RegExp
    keys: W2RouteKey[]
}

/** A normalized menu item */
interface W2MenuItem {
    id: string | number | null
    text: string
    caption?: string
    class?: string
    style?: string
    attrs?: string
    [key: string]: unknown
}

/** Options for w2utils.normMenu() */
interface W2NormMenuOptions {
    itemMap?: { id: string; text: string }
    [key: string]: unknown
}

/** Options for w2utils.clone() */
interface W2CloneOptions {
    functions?: boolean
    elements?: boolean
    events?: boolean
    exclude?: string[] | ((key: string, ctx: { obj: unknown; parent: string }) => boolean)
    parent?: string
}

/** Promise-chain handle returned by w2utils.message() / .confirm() / .prompt() */
interface W2MessageProm {
    self: w2base
    action(callBack: (event: unknown) => void): W2MessageProm
    close(callBack: (event: unknown) => void): W2MessageProm
    open(callBack: (event: unknown) => void): W2MessageProm
    then(callBack: (event: unknown) => void): W2MessageProm
    change?: (callBack: (event: unknown) => void) => W2MessageProm
    [key: string]: unknown  // dynamic action keys (yes/no/ok/cancel) added at runtime
}

/** Where-descriptor for w2utils.message() */
interface W2MessageWhere {
    box: string | Element | null
    after?: string | Element | null
    owner?: { name?: string; lock?: (...args: unknown[]) => void; unlock?: (...args: unknown[]) => void; focus?: () => void }
    param?: unknown
}

/** Options for w2utils.message() */
interface W2MessageOptions {
    width?: number
    height?: number
    text?: string | null
    body?: string
    buttons?: string
    html?: string
    focus?: number | string | null
    hideOn?: string[]
    actions?: Record<string, unknown>
    cancelAction?: string
    on?: unknown
    onOpen?: unknown
    onClose?: unknown
    onAction?: unknown
    originalWidth?: number
    originalHeight?: number
    msgIndex?: number
    tmp?: { zIndex: string; overflow: string }
    input?: Element | null
    box?: Element | null
    trigger?: (event: string, data: Record<string, unknown>) => unknown
    // any: message mixes in w2base methods at runtime via extend(); typed loosely here
    [key: string]: unknown
}

class Utils {
    version: string
    tmp: Record<string, unknown>
    settings: W2UISettings
    i18nCompare: (a: string, b: string) => number
    hasLocalStorage: boolean
    isMac: boolean
    isMobile: boolean
    isIOS: boolean
    isAndroid: boolean
    isSafari: boolean
    isFirefox: boolean
    formatters: Record<string, W2Formatter>

    constructor () {
        this.version = '2.0.x'
        this.tmp = {}
        this.settings = this.extend({}, {
            'dataType'       : 'JSON', // can be HTTP, JSON, RESTFULL (case sensitive)
            'dateStartYear'  : 1950,  // start year for date-picker
            'dateEndYear'    : 2030,  // end year for date picker
            'macButtonOrder' : false, // if true, Yes on the right side
            'warnNoPhrase'   : false,  // call console.warn if lang() encounters a missing phrase
        }, w2locale, { phrases: null }), // if there are no phrases, then it is original language
        this.i18nCompare = Intl.Collator().compare
        this.hasLocalStorage = testLocalStorage()

        // some internal variables
        this.isMac = /Mac/i.test(navigator.platform)
        this.isMobile = /(iphone|ipod|mobile|android)/i.test(navigator.userAgent)
        this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform)
        this.isAndroid = /(android)/i.test(navigator.userAgent)
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        this.isFirefox = /(Firefox)/i.test(navigator.userAgent)

        // Formatters: Primarily used in grid
        this.formatters = {
            'number'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params
                if (parseInt(String(params)) > 20) params = 20
                if (parseInt(String(params)) < 0) params = 0
                if (value == null || value === '') return ''
                return w2utils.formatNumber(parseFloat(String(value)), params as number, true)
            },

            'float'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                return w2utils.formatters.number(record, extra)
            },

            'int'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                return w2utils.formatters.number(record, extra)
            },

            'money'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                if (value == null || value === '') return ''
                const data = w2utils.formatNumber(Number(value), w2utils.settings.currencyPrecision, true)
                return (w2utils.settings.currencyPrefix || '') + data + (w2utils.settings.currencySuffix || '')
            },

            'currency'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                return w2utils.formatters.money(record, extra)
            },

            'percent'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === '') return ''
                return w2utils.formatNumber(value, (params as number) || 1) + '%'
            },

            'size'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                if (value == null || value === '') return ''
                return String(w2utils.formatSize(parseInt(String(value))))
            },

            'date'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = w2utils.settings.dateFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + w2utils.formatDate(dt instanceof Date ? dt : undefined, params) + '</span>'
            },

            'datetime'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = w2utils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + w2utils.formatDateTime(dt instanceof Date ? dt : undefined, params) + '</span>'
            },

            'time'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = w2utils.settings.timeFormat
                if (params === 'h12') params = 'hh:mi pm'
                if (params === 'h24') params = 'h24:mi'
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + w2utils.formatTime(value, params) + '</span>'
            },

            'timestamp'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = w2utils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, params ?? null, true) as boolean | Date
                return dt instanceof Date ? dt.toString() : ''
            },

            'gmt'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = w2utils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, params ?? null, true) as boolean | Date
                return dt instanceof Date ? dt.toUTCString() : ''
            },

            'age'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = w2utils.isDateTime(value, null, true) as boolean | Date
                if (dt === false) dt = w2utils.isDate(value, null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + w2utils.age(value) + (params ? (' ' + params) : '') + '</span>'
            },

            'interval'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === 0 || value === '') return ''
                return w2utils.interval(Number(value)) + (params ? (' ' + params) : '')
            },

            'toggle'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                return (value ? w2utils.lang('Yes') : '')
            },

            'password'(record: W2FormatterExtra, extra?: W2FormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let ret = ''
                if (!value) return ret
                const strVal = String(value)
                for (let i = 0; i < strVal.length; i++) {
                    ret += '*'
                }
                return ret
            }
        }
        return

        function testLocalStorage() {
            // test if localStorage is available, see issue #1282
            const str = 'w2ui_test'
            try {
                localStorage.setItem(str, str)
                localStorage.removeItem(str)
                return true
            } catch (e) {
                return false
            }
        }
    }

    isBin(val: unknown): boolean {
        const re = /^[0-1]+$/
        return re.test(String(val))
    }

    isInt(val: unknown): boolean {
        const re = /^[-+]?[0-9]+$/
        return re.test(String(val))
    }

    isFloat(val: unknown): boolean {
        if (typeof val === 'string') {
            val = val.replace(new RegExp(this.settings.groupSymbol, 'g'), '')
                .replace(this.settings.decimalSymbol, '.')
        }
        return (typeof val === 'number' || (typeof val === 'string' && val !== '')) && !isNaN(Number(val))
    }

    isMoney(val: unknown): boolean {
        if (typeof val === 'object' || val === '') return false
        if (this.isFloat(val)) return true
        const se = this.settings
        const re = new RegExp('^'+ (se.currencyPrefix ? '\\' + se.currencyPrefix + '?' : '') +
                            '[-+]?'+ (se.currencyPrefix ? '\\' + se.currencyPrefix + '?' : '') +
                            '[0-9]*[\\'+ se.decimalSymbol +']?[0-9]+'+ (se.currencySuffix ? '\\' + se.currencySuffix + '?' : '') +'$', 'i')
        if (typeof val === 'string') {
            val = val.replace(new RegExp(se.groupSymbol, 'g'), '')
        }
        return re.test(String(val))
    }

    isHex(val: unknown): boolean {
        const re = /^(0x)?[0-9a-fA-F]+$/
        return re.test(String(val))
    }

    isAlphaNumeric(val: unknown): boolean {
        const re = /^[a-zA-Z0-9_-]+$/
        return re.test(String(val))
    }

    isEmail(val: unknown): boolean {
        const email = /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/
        return email.test(String(val))
    }

    isIpAddress(val: unknown): boolean {
        const re = new RegExp('^' +
            '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}' +
            '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' +
            '$')
        return re.test(String(val))
    }

    isDate(val: unknown, format?: string | null, retDate?: boolean): boolean | Date {
        if (!val) return false

        let dt: Date | string = 'Invalid Date'
        let month: number | string | undefined, day: number | string | undefined, year: number | string | undefined

        if (format == null) format = this.settings.dateFormat

        if (val instanceof Date) { // date object
            year  = val.getFullYear()
            month = val.getMonth() + 1
            day   = val.getDate()
        } else if (typeof val === 'number' || (typeof val === 'string' && parseInt(val) == (val as unknown as number) && parseInt(val) > 0)) {
            const d = new Date(parseInt(String(val)))
            year  = d.getFullYear()
            month = d.getMonth() + 1
            day   = d.getDate()
        } else {
            let strVal = String(val)
            // convert month formats
            if (new RegExp('mon', 'ig').test(format)) {
                format = format.replace(/month/ig, 'm').replace(/mon/ig, 'm').replace(/dd/ig, 'd').replace(/[, ]/ig, '/').replace(/\/\//g, '/').toLowerCase()
                strVal = strVal.replace(/[, ]/ig, '/').replace(/\/\//g, '/').toLowerCase()
                for (let m = 0, len = this.settings.fullmonths.length; m < len; m++) {
                    const t = this.settings.fullmonths[m]
                    strVal = strVal.replace(new RegExp(t, 'ig'), String(m + 1)).replace(new RegExp(t.substr(0, 3), 'ig'), String(m + 1))
                }
            }
            // format date
            const tmp  = strVal.replace(/-/g, '/').replace(/\./g, '/').toLowerCase().split('/')
            const tmp2 = format.replace(/-/g, '/').replace(/\./g, '/').toLowerCase()
            if (tmp2 === 'mm/dd/yyyy') { month = tmp[0]; day = tmp[1]; year = tmp[2] }
            if (tmp2 === 'm/d/yyyy') { month = tmp[0]; day = tmp[1]; year = tmp[2] }
            if (tmp2 === 'dd/mm/yyyy') { month = tmp[1]; day = tmp[0]; year = tmp[2] }
            if (tmp2 === 'd/m/yyyy') { month = tmp[1]; day = tmp[0]; year = tmp[2] }
            if (tmp2 === 'yyyy/dd/mm') { month = tmp[2]; day = tmp[1]; year = tmp[0] }
            if (tmp2 === 'yyyy/d/m') { month = tmp[2]; day = tmp[1]; year = tmp[0] }
            if (tmp2 === 'yyyy/mm/dd') { month = tmp[1]; day = tmp[2]; year = tmp[0] }
            if (tmp2 === 'yyyy/m/d') { month = tmp[1]; day = tmp[2]; year = tmp[0] }
            if (tmp2 === 'mm/dd/yy') { month = tmp[0]; day = tmp[1]; year = tmp[2] }
            if (tmp2 === 'm/d/yy') { month = tmp[0]; day = tmp[1]; year = parseInt(tmp[2]) + 1900 }
            if (tmp2 === 'dd/mm/yy') { month = tmp[1]; day = tmp[0]; year = parseInt(tmp[2]) + 1900 }
            if (tmp2 === 'd/m/yy') { month = tmp[1]; day = tmp[0]; year = parseInt(tmp[2]) + 1900 }
            if (tmp2 === 'yy/dd/mm') { month = tmp[2]; day = tmp[1]; year = parseInt(tmp[0]) + 1900 }
            if (tmp2 === 'yy/d/m') { month = tmp[2]; day = tmp[1]; year = parseInt(tmp[0]) + 1900 }
            if (tmp2 === 'yy/mm/dd') { month = tmp[1]; day = tmp[2]; year = parseInt(tmp[0]) + 1900 }
            if (tmp2 === 'yy/m/d') { month = tmp[1]; day = tmp[2]; year = parseInt(tmp[0]) + 1900 }
        }
        if (!this.isInt(year)) return false
        if (!this.isInt(month)) return false
        if (!this.isInt(day)) return false
        const numYear  = +year
        const numMonth = +month
        const numDay   = +day
        dt    = new Date(numYear, numMonth - 1, numDay)
        dt.setFullYear(numYear)
        // do checks
        if (numMonth == null) return false
        if (String(dt) === 'Invalid Date') return false
        if ((dt.getMonth() + 1 !== numMonth) || (dt.getDate() !== numDay) || (dt.getFullYear() !== numYear)) return false
        if (retDate === true) return dt; else return true
    }

    isTime(val: unknown, retTime?: boolean): boolean | W2TimeResult {
        // Both formats 10:20pm and 22:20
        if (val == null) return false
        let max: number
        // -- process american format
        let strVal = String(val).toUpperCase()
        const am       = strVal.indexOf('AM') >= 0
        const pm       = strVal.indexOf('PM') >= 0
        const ampm = (pm || am)
        if (ampm) max = 12; else max = 24
        strVal = strVal.replace('AM', '').replace('PM', '').trim()
        // ---
        const tmp = strVal.split(':')
        let h   = parseInt(tmp[0] || '0')
        const m = parseInt(tmp[1] || '0'), s = parseInt(tmp[2] || '0')
        // accept edge case: 3PM is a good timestamp, but 3 (without AM or PM) is NOT:
        if ((!ampm || tmp.length !== 1) && tmp.length !== 2 && tmp.length !== 3) { return false }
        if (tmp[0] === '' || h < 0 || h > max || !this.isInt(tmp[0]) || tmp[0].length > 2) { return false }
        if (tmp.length > 1 && (tmp[1] === '' || m < 0 || m > 59 || !this.isInt(tmp[1]) || tmp[1].length !== 2)) { return false }
        if (tmp.length > 2 && (tmp[2] === '' || s < 0 || s > 59 || !this.isInt(tmp[2]) || tmp[2].length !== 2)) { return false }
        // check the edge cases: 12:01AM is ok, as is 12:01PM, but 24:01 is NOT ok while 24:00 is (midnight; equivalent to 00:00).
        // meanwhile, there is 00:00 which is ok, but 0AM nor 0PM are okay, while 0:01AM and 0:00AM are.
        if (!ampm && max === h && (m !== 0 || s !== 0)) { return false }
        if (ampm && tmp.length === 1 && h === 0) { return false }

        if (retTime === true) {
            if (pm && h !== 12) h += 12 // 12:00pm - is noon
            if (am && h === 12) h += 12 // 12:00am - is midnight
            return {
                hours: h,
                minutes: m,
                seconds: s
            }
        }
        return true
    }

    isDateTime(val: unknown, format?: string | null, retDate?: boolean): boolean | Date {
        if (val instanceof Date) { // date object
            if (retDate !== true) return true
            return val
        }
        const intVal = parseInt(String(val))
        if (intVal === (val as number)) {
            if (intVal < 0) return false
            else if (retDate !== true) return true
            else return new Date(intVal)
        }
        const strVal = String(val)
        const tmp = strVal.indexOf(' ')
        if (tmp < 0) {
            if (strVal.indexOf('T') < 0 || String(new Date(strVal)) == 'Invalid Date') return false
            else if (retDate !== true) return true
            else return new Date(strVal)
        } else {
            if (format == null) format = this.settings.datetimeFormat
            const formats = format.split('|')
            const values  = [strVal.substr(0, tmp), strVal.substr(tmp).trim()]
            formats[0]  = formats[0].trim()
            if (formats[1]) formats[1] = formats[1].trim()
            // check
            const tmp1 = this.isDate(values[0], formats[0], true)
            const tmp2 = this.isTime(values[1], true)
            if (tmp1 !== false && tmp2 !== false) {
                if (retDate !== true) return true
                const dt1 = tmp1 as Date
                const t2  = tmp2 as W2TimeResult
                dt1.setHours(t2.hours)
                dt1.setMinutes(t2.minutes)
                dt1.setSeconds(t2.seconds)
                return dt1
            } else {
                return false
            }
        }
    }

    age(dateStr: unknown): string {
        let d1: Date
        if (dateStr === '' || dateStr == null) return ''
        if (dateStr instanceof Date) { // date object
            d1 = dateStr
        } else if (typeof dateStr === 'number' || (typeof dateStr === 'string' && parseInt(dateStr) == (dateStr as unknown as number) && parseInt(dateStr) > 0)) {
            d1 = new Date(parseInt(String(dateStr)))
        } else {
            d1 = new Date(String(dateStr))
        }
        if (String(d1) === 'Invalid Date') return ''

        const d2     = new Date()
        const sec    = (d2.getTime() - d1.getTime()) / 1000
        let amount: number = 0
        let type   = ''
        if (sec < 0) {
            amount = 0
            type   = 'sec'
        } else if (sec < 60) {
            amount = Math.floor(sec)
            type   = 'sec'
            if (sec < 0) { amount = 0; type = 'sec' }
        } else if (sec < 60*60) {
            amount = Math.floor(sec/60)
            type   = 'min'
        } else if (sec < 24*60*60) {
            amount = Math.floor(sec/60/60)
            type   = 'hour'
        } else if (sec < 30*24*60*60) {
            amount = Math.floor(sec/24/60/60)
            type   = 'day'
        } else if (sec < 365*24*60*60) {
            amount = Math.floor(sec/30/24/60/60*10)/10
            type   = 'month'
        } else if (sec < 365*4*24*60*60) {
            amount = Math.floor(sec/365/24/60/60*10)/10
            type   = 'year'
        } else if (sec >= 365*4*24*60*60) {
            // factor in leap year shift (only older then 4 years)
            amount = Math.floor(sec/365.25/24/60/60*10)/10
            type   = 'year'
        }
        return amount + ' ' + type + (amount > 1 ? 's' : '')
    }

    interval(value: number): string {
        let ret = ''
        if (value < 100) {
            ret = '< 0.01 sec'
        } else if (value < 1000) {
            ret = (Math.floor(value / 10) / 100) + ' sec'
        } else if (value < 10000) {
            ret = (Math.floor(value / 100) / 10) + ' sec'
        } else if (value < 60000) {
            ret = Math.floor(value / 1000) + ' secs'
        } else if (value < 3600000) {
            ret = Math.floor(value / 60000) + ' mins'
        } else if (value < 86400000) {
            ret = Math.floor(value / 3600000 * 10) / 10 + ' hours'
        } else if (value < 2628000000) {
            ret = Math.floor(value / 86400000 * 10) / 10 + ' days'
        } else if (value < 3.1536e+10) {
            ret = Math.floor(value / 2628000000 * 10) / 10 + ' months'
        } else {
            ret = Math.floor(value / 3.1536e+9) / 10 + ' years'
        }
        return ret
    }

    date(dateStr: unknown): string {
        if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''
        let d1 = new Date(dateStr as string | number)
        if (this.isInt(dateStr)) d1 = new Date(Number(dateStr)) // for unix timestamps
        if (String(d1) === 'Invalid Date') return ''

        const months = this.settings.shortmonths
        const d2     = new Date() // today
        const d3     = new Date()
        d3.setTime(d3.getTime() - 86400000) // yesterday

        const dd1 = months[d1.getMonth()] + ' ' + d1.getDate() + ', ' + d1.getFullYear()
        const dd2 = months[d2.getMonth()] + ' ' + d2.getDate() + ', ' + d2.getFullYear()
        const dd3 = months[d3.getMonth()] + ' ' + d3.getDate() + ', ' + d3.getFullYear()

        const time  = (d1.getHours() - (d1.getHours() > 12 ? 12 :0)) + ':' + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ' ' + (d1.getHours() >= 12 ? 'pm' : 'am')
        const time2 = (d1.getHours() - (d1.getHours() > 12 ? 12 :0)) + ':' + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ':' + (d1.getSeconds() < 10 ? '0' : '') + d1.getSeconds() + ' ' + (d1.getHours() >= 12 ? 'pm' : 'am')
        let dsp   = dd1
        if (dd1 === dd2) dsp = time
        if (dd1 === dd3) dsp = this.lang('Yesterday')

        return '<span title="'+ dd1 +' ' + time2 +'">'+ dsp +'</span>'
    }

    formatSize(sizeStr: unknown): string | number {
        if (!this.isFloat(sizeStr) || sizeStr === '') return ''
        const num = parseFloat(String(sizeStr))
        if (num === 0) return 0
        const sizes = ['Bt', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB']
        const i     = parseInt(String(Math.floor( Math.log(num) / Math.log(1024) )))
        return (Math.floor(num / Math.pow(1024, i) * 10) / 10).toFixed(i === 0 ? 0 : 1) + ' ' + (sizes[i] || '??')
    }

    formatNumber(val: unknown, fraction?: number | string | null, useGrouping?: boolean): string {
        if (val == null || val === '' || typeof val === 'object') return ''
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: fraction != null ? parseInt(String(fraction)) : undefined,
            maximumFractionDigits: fraction != null ? parseInt(String(fraction)) : undefined,
            useGrouping: !!useGrouping
        }
        if (fraction == null || Number(fraction) < 0) {
            options.minimumFractionDigits = 0
            options.maximumFractionDigits = 20
        }
        return parseFloat(String(val)).toLocaleString(this.settings.locale, options)
    }

    formatDate(dateStr: unknown, format?: string | null): string { // IMPORTANT dateStr HAS TO BE valid JavaScript Date String
        if (!format) format = this.settings.dateFormat
        if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''

        let dt = new Date(dateStr as string | number)
        if (this.isInt(dateStr)) dt = new Date(Number(dateStr)) // for unix timestamps
        if (String(dt) === 'Invalid Date') return ''

        const year  = dt.getFullYear()
        const month = dt.getMonth()
        const date  = dt.getDate()
        return format.toLowerCase()
            .replace('month', this.settings.fullmonths[month])
            .replace('mon', this.settings.shortmonths[month])
            .replace(/yyyy/g, ('000' + year).slice(-4))
            .replace(/yyy/g, ('000' + year).slice(-4))
            .replace(/yy/g, ('0' + year).slice(-2))
            .replace(/(^|[^a-z$])y/g, '$1' + year) // only y's that are not preceded by a letter
            .replace(/mm/g, ('0' + (month + 1)).slice(-2))
            .replace(/dd/g, ('0' + date).slice(-2))
            .replace(/th/g, (date == 1 ? 'st' : 'th'))
            .replace(/th/g, (date == 2 ? 'nd' : 'th'))
            .replace(/th/g, (date == 3 ? 'rd' : 'th'))
            .replace(/(^|[^a-z$])m/g, '$1' + (month + 1)) // only y's that are not preceded by a letter
            .replace(/(^|[^a-z$])d/g, '$1' + date) // only y's that are not preceded by a letter
    }

    formatTime(dateStr: unknown, format?: string | null): string { // IMPORTANT dateStr HAS TO BE valid JavaScript Date String
        if (!format) format = this.settings.timeFormat
        if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''

        let dt = new Date(dateStr as string | number)
        if (this.isInt(dateStr)) dt = new Date(Number(dateStr)) // for unix timestamps
        if (this.isTime(dateStr)) {
            const tmp = this.isTime(dateStr, true) as W2TimeResult
            dt = new Date()
            dt.setHours(tmp.hours)
            dt.setMinutes(tmp.minutes)
        }
        if (String(dt) === 'Invalid Date') return ''
        if (format == 'h12') format = 'hh:mi pm'

        let type = 'am'
        let hour: string | number = dt.getHours()
        const h24  = dt.getHours()
        let min: string | number  = dt.getMinutes()
        let sec: string | number  = dt.getSeconds()
        if (min < 10) min = '0' + min
        if (sec < 10) sec = '0' + sec
        if (format.indexOf('am') !== -1 || format.indexOf('pm') !== -1) {
            if (hour >= 12) type = 'pm'
            if (hour > 12) hour = hour - 12
            if (hour === 0) hour = 12
        }
        const hourStr = String(hour)
        const minStr  = String(min)
        const secStr  = String(sec)
        const h24Str  = String(h24)
        return format.toLowerCase()
            .replace('am', type)
            .replace('pm', type)
            .replace('hhh', (Number(hour) < 10 ? '0' + hourStr : hourStr))
            .replace('hh24', (h24 < 10 ? '0' + h24Str : h24Str))
            .replace('h24', h24Str)
            .replace('hh', hourStr)
            .replace('mm', minStr)
            .replace('mi', minStr)
            .replace('ss', secStr)
            .replace(/(^|[^a-z$])h/g, '$1' + hourStr) // only y's that are not preceded by a letter
            .replace(/(^|[^a-z$])m/g, '$1' + minStr) // only y's that are not preceded by a letter
            .replace(/(^|[^a-z$])s/g, '$1' + secStr) // only y's that are not preceded by a letter
    }

    formatDateTime(dateStr: unknown, format?: string | null): string {
        let fmt: string[]
        if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''
        if (typeof format !== 'string') {
            fmt = [this.settings.dateFormat, this.settings.timeFormat]
        } else {
            fmt    = format.split('|')
            fmt[0] = fmt[0].trim()
            fmt[1] = (fmt.length > 1 ? fmt[1].trim() : this.settings.timeFormat)
        }
        // older formats support
        if (fmt[1] === 'h12') fmt[1] = 'h:m pm'
        if (fmt[1] === 'h24') fmt[1] = 'h24:m'
        return this.formatDate(dateStr, fmt[0]) + ' ' + this.formatTime(dateStr, fmt[1])
    }

    stripSpaces(html: unknown): unknown {
        if (html == null) return html
        switch (typeof html) {
            case 'number':
                break
            case 'string':
                html = String(html).replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s\s+/g, ' ').trim()
                break
            case 'object':
                // does not modify original object, but creates a copy
                if (Array.isArray(html)) {
                    const arr = this.extend([], html) as unknown[]
                    arr.forEach((key, ind) => { arr[ind] = this.stripSpaces(key) })
                    return arr
                } else {
                    const obj = this.extend({}, html) as Record<string, unknown>
                    Object.keys(obj).forEach(key => { obj[key] = this.stripSpaces(obj[key]) })
                    return obj
                }
        }
        return html
    }

    stripTags(html: unknown): unknown {
        if (html == null) return html
        switch (typeof html) {
            case 'number':
                break
            case 'string':
                html = String(html).replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/ig, '')
                break
            case 'object':
                // does not modify original object, but creates a copy
                if (Array.isArray(html)) {
                    const arr = this.extend([], html) as unknown[]
                    arr.forEach((key, ind) => { arr[ind] = this.stripTags(key) })
                    return arr
                } else {
                    const obj = this.extend({}, html) as Record<string, unknown>
                    Object.keys(obj).forEach(key => { obj[key] = this.stripTags(obj[key]) })
                    return obj
                }
        }
        return html
    }

    encodeTags(html: unknown): unknown {
        if (html == null) return html
        switch (typeof html) {
            case 'number':
                break
            case 'string':
                html = String(html).replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
                break
            case 'object':
                // does not modify original object, but creates a copy
                if (Array.isArray(html)) {
                    const arr = this.extend([], html) as unknown[]
                    arr.forEach((key, ind) => { arr[ind] = this.encodeTags(key) })
                    return arr
                } else {
                    const obj = this.extend({}, html) as Record<string, unknown>
                    Object.keys(obj).forEach(key => { obj[key] = this.encodeTags(obj[key]) })
                    return obj
                }
        }
        return html
    }

    decodeTags(html: unknown): unknown {
        if (html == null) return html
        switch (typeof html) {
            case 'number':
                break
            case 'string':
                html = String(html).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
                break
            case 'object':
                // does not modify original object, but creates a copy
                if (Array.isArray(html)) {
                    const arr = this.extend([], html) as unknown[]
                    arr.forEach((key, ind) => { arr[ind] = this.decodeTags(key) })
                    return arr
                } else {
                    const obj = this.extend({}, html) as Record<string, unknown>
                    Object.keys(obj).forEach(key => { obj[key] = this.decodeTags(obj[key]) })
                    return obj
                }
        }
        return html
    }

    escapeId(id: unknown): string {
        // This logic is borrowed from jQuery
        if (id === '' || id == null) return ''
        const re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g
        return (id + '').replace(re, (ch, asCodePoint) => {
            if (asCodePoint) {
                if (ch === '\0') return '\uFFFD'
                return ch.slice( 0, -1 ) + '\\' + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + ' '
            }
            return '\\' + ch
        })
    }

    unescapeId(id: string | null | undefined): string {
        // This logic is borrowed from jQuery
        if (id === '' || id == null) return ''
        const re = /\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g
        return id.replace(re, (escape, nonHex) => {
            const high = (parseInt('0x' + escape.slice(1), 16)) - 0x10000
            return nonHex ? nonHex : high < 0
                    ? String.fromCharCode(high + 0x10000 )
                    : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00)
        })
    }

    base64encode(str: string): string {
        // Fast Native support in Chrome since 2010
        const utf8Bytes = new TextEncoder().encode(str)
        let binaryString = ''
        for (const byte of utf8Bytes) {
            binaryString += String.fromCharCode(byte)
        }
        return btoa(binaryString)
    }

    base64decode(encodedStr: string): string {
        // Fast Native support in Chrome since 2010
        const binaryString = atob(encodedStr)
        const utf8Bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            utf8Bytes[i] = binaryString.charCodeAt(i)
        }
        return new TextDecoder().decode(utf8Bytes)
    }

    async sha256(str: string): Promise<string> {
        const utf8 = new TextEncoder().encode(str)
        return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')
        })
    }

    transition(div_old: HTMLElement, div_new: HTMLElement, type: string, callBack?: () => void): Promise<void> {
        return new Promise<void>((resolve, _reject) => {
            const styles = getComputedStyle(div_old)
            const width  = parseInt(styles.width)
            const height = parseInt(styles.height)
            const time   = 0.5

            if (!div_old || !div_new) {
                console.log('ERROR: Cannot do transition when one of the divs is null')
                return
            }

            // any: parentNode is ParentNode | null; for transition usage it's always an HTMLElement
            ;(div_old.parentNode as HTMLElement).style.cssText += 'perspective: 900px; overflow: hidden;'
            div_old.style.cssText            += '; position: absolute; z-index: 1019; backface-visibility: hidden'
            div_new.style.cssText            += '; position: absolute; z-index: 1020; backface-visibility: hidden'

            switch (type) {
                case 'slide-left':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; transform: translate3d('+ width + 'px, 0, 0)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: translate3d(-'+ width +'px, 0, 0)'
                    }, 1)
                    break

                case 'slide-right':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; transform: translate3d(-'+ width +'px, 0, 0)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: translate3d(0px, 0, 0)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: translate3d('+ width +'px, 0, 0)'
                    }, 1)
                    break

                case 'slide-down':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, '+ height +'px, 0)'
                    }, 1)
                    break

                case 'slide-up':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; transform: translate3d(0, '+ height +'px, 0)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: translate3d(0, 0, 0)'
                    }, 1)
                    break

                case 'flip-left':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: rotateY(0deg)'
                    div_new.style.cssText += 'overflow: hidden; transform: rotateY(-180deg)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: rotateY(0deg)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: rotateY(180deg)'
                    }, 1)
                    break

                case 'flip-right':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: rotateY(0deg)'
                    div_new.style.cssText += 'overflow: hidden; transform: rotateY(180deg)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: rotateY(0deg)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: rotateY(-180deg)'
                    }, 1)
                    break

                case 'flip-down':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: rotateX(0deg)'
                    div_new.style.cssText += 'overflow: hidden; transform: rotateX(180deg)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: rotateX(0deg)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: rotateX(-180deg)'
                    }, 1)
                    break

                case 'flip-up':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: rotateX(0deg)'
                    div_new.style.cssText += 'overflow: hidden; transform: rotateX(-180deg)'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: rotateX(0deg)'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: rotateX(180deg)'
                    }, 1)
                    break

                case 'pop-in':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; transform: scale(1); opacity: 1;'
                        div_old.style.cssText += 'transition: '+ time +'s;'
                    }, 1)
                    break

                case 'pop-out':
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;'
                    div_new.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; opacity: 1;'
                        div_old.style.cssText += 'transition: '+ time +'s; transform: scale(1.7); opacity: 0;'
                    }, 1)
                    break

                default:
                    // init divs
                    div_old.style.cssText += 'overflow: hidden; transform: translate3d(0, 0, 0)'
                    div_new.style.cssText += 'overflow: hidden; translate3d(0, 0, 0); opacity: 0;'
                    query(div_new).show()
                    // -- need a timing function because otherwise not working
                    setTimeout(() => {
                        div_new.style.cssText += 'transition: '+ time +'s; opacity: 1;'
                        div_old.style.cssText += 'transition: '+ time +'s'
                    }, 1)
                    break
            }

            setTimeout(() => {
                if (type === 'slide-down') {
                    query(div_old).css('z-index', '1019')
                    query(div_new).css('z-index', '1020')
                }
                if (div_new) {
                    // any: .css({...}) returns Query when called with object arg; chain cast needed
                    ;(query(div_new).css({ 'opacity': '1' }) as Query).css({ 'transition': '', 'transform' : '' })
                }
                if (div_old) {
                    ;(query(div_old).css({ 'opacity': '1' }) as Query).css({ 'transition': '', 'transform' : '' })
                }
                if (typeof callBack === 'function') callBack()
                resolve()
            }, time * 1000)
        })
    }

    lock(box: unknown, options: W2LockOptions | string = {}, ...rest: unknown[]): void {
        if (box == null) return
        // Normalise: string shorthand → { msg }
        let opts: W2LockOptions = typeof options === 'string' ? { msg: options } : { ...options }
        if (rest[0] != null) {
            opts.spinner = rest[0] as boolean
        }
        opts = this.extend({ spinner: false }, opts) as W2LockOptions
        // for backward compatibility: unwrap jQuery-like array wrappers
        // any: box may be a legacy jQuery wrapper with [0] and .get(); normalise to a plain selector
        let boxSel: unknown = box
        if ((box as Record<string, unknown>)?.[0] instanceof Node) {
            boxSel = Array.isArray(box) ? box : (box as { get(): unknown[] }).get()
        }
        if (!opts.msg && opts.msg !== 0) opts.msg = ''
        this.unlock(boxSel)
        // any: Query.get(0) returns Element|null; HTMLElement is needed for scrollWidth/scrollHeight
        const el = query(boxSel).get(0) as HTMLElement
        const pWidth = el.scrollWidth
        const pHeight = el.scrollHeight
        // if it is body and only has absolute elements, its height will be 0, need to lock entire window
        let style = `height: ${pHeight}px; width: ${pWidth}px`
        if (el.tagName == 'BODY') {
            style = 'position: fixed; right: 0; bottom: 0;'
        }
        query(boxSel).prepend(
            `<div class="w2ui-lock" style="${style}"></div>` +
            '<div class="w2ui-lock-msg"></div>'
        )
        const $lock = query(boxSel).find('.w2ui-lock')
        const $mess = query(boxSel).find('.w2ui-lock-msg')
        if (!opts.msg) {
            $mess.css({
                'background-color': 'transparent',
                'background-image': 'none',
                'border': '0px',
                'box-shadow': 'none'
            })
        }
        if (opts.spinner === true) {
            opts.msg = `<div class="w2ui-spinner" ${(!opts.msg ? 'style="width: 35px; height: 35px"' : '')}></div>`
                + opts.msg
        }
        if (opts.msg) {
            // any: .html(str) returns Query when setting content; cast needed for chaining
            ;($mess.html(String(opts.msg)) as Query).css('display', 'block')
        } else {
            $mess.remove()
        }
        if (opts.opacity != null) {
            $lock.css('opacity', String(opts.opacity))
        }
        $lock.css({ display: 'block' })
        if (opts.bgColor) {
            $lock.css({ 'background-color': opts.bgColor })
        }
        const styles = getComputedStyle($lock.get(0) as Element)
        const opacity = styles.opacity ?? 0.15
        $lock
            .on('mousedown', function() {
                if (typeof opts.onClick == 'function') {
                    opts.onClick()
                } else {
                    $lock.css({
                        'transition': '.2s',
                        'opacity': String(Number(opacity) * 1.5)
                    })
                }
            })
            .on('mouseup', function() {
                if (typeof opts.onClick !== 'function') {
                    $lock.css({
                        'transition': '.2s',
                        'opacity': String(opacity)
                    })
                }
            })
            .on('mousewheel', function(event) {
                if (event) {
                    event.stopPropagation()
                    event.preventDefault()
                }
            })
    }

    unlock(box: unknown, speed?: number): void {
        if (box == null) return
        // any: box may store a _prevUnlock timer id on the element; dynamic property on Element
        const prevBox = box as Record<string, unknown>
        clearTimeout(prevBox['_prevUnlock'] as number)
        // for backward compatibility
        let boxSel: unknown = box
        if ((box as Record<string, unknown>)?.[0] instanceof Node) {
            boxSel = Array.isArray(box) ? box : (box as { get(): unknown[] }).get()
        }
        if (this.isInt(speed) && (speed ?? 0) > 0) {
            query(boxSel).find('.w2ui-lock').css({
                transition: ((speed ?? 0)/1000) + 's',
                opacity: 0,
            })
            // any: Element may have a dynamic _prevUnlock property used for timer management
            const _box = query(boxSel).get(0) as unknown as Record<string, unknown>
            clearTimeout(_box['_prevUnlock'] as number)
            _box['_prevUnlock'] = setTimeout(() => {
                query(boxSel).find('.w2ui-lock').remove()
            }, speed)
            query(boxSel).find('.w2ui-lock-msg').remove()
        } else {
            query(boxSel).find('.w2ui-lock').remove()
            query(boxSel).find('.w2ui-lock-msg').remove()
        }
    }

    /**
     * Opens a context message, similar in parameters as w2popup.open()
     *
     * Sample Calls
     * w2utils.message({ box: '#div', text: 'message' }).ok(() => {})
     * w2utils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
     * w2utils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
     *
     * Used in w2grid, w2form, w2layout (should be in w2popup too)
     * should be called with .call(...) method
     *
     * @param where = {
     *      box,     // where to open
     *      after,   // title if any, adds title heights
     *      param    // additional parameters, used in layouts for panel
     * }
     * @param options {
     *      width,      // (int), width in px, if negative, then it is maxWidth - width
     *      height,     // (int), height in px, if negative, then it is maxHeight - height
     *      text,       // centered text
     *      body,       // body of the message
     *      buttons,    // buttons of the message
     *      html,       // if body & buttons are not defined, then html is the entire message
     *      focus,      // int or id with a selector, default is 0
     *      hideOn,     // ['esc', 'click'], default is ['esc']
     *      actions,    // array of actions (only if buttons is not defined)
     *      onOpen,     // event when opened
     *      onClose,    // event when closed
     *      onAction,   // event on action
     * }
     */
    message(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined {
        let closeTimer: ReturnType<typeof setTimeout>,
            openTimer: ReturnType<typeof setTimeout>,
            edata: unknown
        // any: msgBase is the live W2MessageOptions reference shared across all closures
        let msgBase: W2MessageOptions = {}
        const removeLast = () => {
            const msgs = query(where?.box).find('.w2ui-message')
            if (msgs.length == 0) return // no messages already
            // any: DOM element has _msg_options stored dynamically at open time
            msgBase = (msgs.get(0) as unknown as Record<string, unknown>)['_msg_options'] as W2MessageOptions || {}
            if (typeof msgBase?.close == 'function') {
                msgBase.close!()
            }
        }
        // any: options is morphed into a w2base instance mid-function; the full shape is known only at runtime
        const closeComplete = (options: Record<string, unknown>) => {
            // any: DOM element has _msg_prevFocus stored dynamically at open time
            const msgBoxEl = options['box'] as Record<string, unknown> | null
            const focus = msgBoxEl?.['_msg_prevFocus'] as Element | undefined
            if (query(where.box).find('.w2ui-message').length <= 1) {
                if (where.owner) {
                    where.owner.unlock?.(where.param, 150)
                } else {
                    this.unlock(where.box, 150)
                }
            } else {
                query(where.box).find(`#w2ui-message-${where.owner?.name}-${(options['msgIndex'] as number)-1}`).css('z-index', '1500')
            }
            if (focus) {
                const msg = query(focus).closest('.w2ui-message')
                if (msg.length > 0) {
                    // any: DOM element has _msg_options + setFocus stored dynamically at open time
                    const opt = (msg.get(0) as unknown as Record<string, unknown>)['_msg_options'] as Record<string, unknown>
                    ;(opt['setFocus'] as (f: Element) => void)(focus)
                } else {
                    (focus as HTMLElement).focus()
                }
            } else {
                if (typeof where.owner?.focus == 'function') where.owner.focus()
            }
            query(options['box'] as unknown).remove()
            if (options['msgIndex'] === 0) {
                const tmp = options['tmp'] as { zIndex: string; overflow: string }
                head.css('z-index', tmp.zIndex)
                query(where.box).css('overflow', tmp.overflow)
            }
            // event after
            if (options['trigger']) {
                // any: edata is a w2event whose finish() is called after close; runtime-owned by options.trigger
                ;((edata as Record<string, unknown>)?.['finish'] as (() => void) | undefined)?.()
            }
        }

        if (typeof options == 'string' || typeof options == 'number') {
            msgBase = {
                width : (String(options).length < 300 ? 350 : 550),
                height: (String(options).length < 300 ? 170: 250),
                text  : String(options),
            }
        } else if (arguments.length == 1 || options == null) {
            msgBase = where as unknown as W2MessageOptions
        } else {
            msgBase = options ?? {}
        }
        if ((msgBase.text === '' || msgBase.text == null) && (msgBase.body === '' || msgBase.body == null)) {
            removeLast()
            return
        }
        if (msgBase.text != null) msgBase.body = `<div class="w2ui-centered w2ui-msg-text">${msgBase.text}</div>`
        if (msgBase.width == null) msgBase.width = 350
        if (msgBase.height == null) msgBase.height = 170
        if (msgBase.hideOn == null) msgBase.hideOn = ['esc']
        msgBase.cancelAction ??= 'Ok'
        // mix in events
        // any: msgBase is coerced into a w2base instance here so that .on/.off/.trigger work;
        // the resulting shape is a hybrid W2MessageOptions + w2base that TS cannot express statically
        if (msgBase.on == null) {
            const opts = msgBase
            msgBase = new w2base() as unknown as W2MessageOptions
            w2utils.extend(msgBase, opts) // needs to be w2utils
        }
        // any: at this point msgBase has both W2MessageOptions fields AND w2base event methods (on/off/trigger)
        const msgOpts = msgBase as unknown as Record<string, unknown>
        ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open', (event: Record<string, unknown>) => {
            w2utils.bindEvents(query(msgOpts['box'] as unknown).find('.w2ui-eaction'), msgOpts) // msgOpts is w2base object
            const detail = event['detail'] as Record<string, unknown>
            query(detail['box'] as unknown).find('button, input, textarea, [name=hidden-first]')
                .off('.message')
                .on('keydown.message', function(evt: Event) {
                    const keyEvt = evt as KeyboardEvent
                    if (keyEvt.keyCode == 27 && (msgOpts['hideOn'] as string[]).includes('esc')) {
                        if (msgOpts['cancelAction']) {
                            ;(msgOpts['action'] as (..._a: unknown[]) => unknown)(msgOpts['cancelAction'])
                        } else {
                            ;(msgOpts['close'] as (..._a: unknown[]) => unknown)()
                        }
                    }
                })
            // timeout is needed because messages opens over 0.3 seconds
            setTimeout(() => (msgOpts['setFocus'] as (..._a: unknown[]) => unknown)(msgOpts['focus']), 300)
        })
        ;(msgOpts['off'] as (..._a: unknown[]) => unknown)('.prom')
        const prom: W2MessageProm = {
            self: msgBase as unknown as w2base,
            action(callBack: (event: unknown) => void) {
                ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('action.prom', callBack)
                return prom
            },
            close(callBack: (event: unknown) => void) {
                ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('close.prom', callBack)
                return prom
            },
            open(callBack: (event: unknown) => void) {
                ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open.prom', callBack)
                return prom
            },
            then(callBack: (event: unknown) => void) {
                ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('open:after.prom', callBack)
                return prom
            }
        }
        if (msgBase.actions == null && msgBase.buttons == null && msgBase.html == null) {
            msgBase.actions = { Ok(event: Record<string, unknown>) { (event['detail'] as Record<string, unknown>)?.['self']?.['close']?.() }}
        }
        ;(msgOpts['off'] as (..._a: unknown[]) => unknown)('.buttons')
        if (msgBase.actions != null) {
            msgBase.buttons = ''
            Object.keys(msgBase.actions).forEach((action) => {
                const handler = msgBase.actions![action]
                let btnAction: string = action
                if (typeof handler == 'function') {
                    msgBase.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${action}","event"]' name="${action}">${action}</button>`
                }
                if (typeof handler == 'object' && handler !== null) {
                    const h = handler as Record<string, unknown>
                    msgBase.buttons += `<button class="w2ui-btn w2ui-eaction ${h['class'] || ''}" name="${action}" data-click='["action","${action}","event"]'
                        style="${h['style'] ?? ''}" ${h['attrs'] ?? ''}>${h['text'] || action}</button>`
                    btnAction = Array.isArray(msgBase.actions) ? String(h['text']) : action
                }
                if (typeof handler == 'string') {
                    msgBase.buttons += `<button class="w2ui-btn w2ui-eaction" name="${handler}" data-click='["action","${handler}","event"]'>${handler}</button>`
                    btnAction = handler
                }
                if (typeof btnAction == 'string') {
                    btnAction = btnAction[0].toLowerCase() + btnAction.substr(1).replace(/\s+/g, '')
                }
                prom[btnAction] = function (callBack: (event: unknown) => void) {
                    ;(msgOpts['on'] as (..._a: unknown[]) => unknown)('action.buttons', (event: Record<string, unknown>) => {
                        const detail = event['detail'] as Record<string, unknown>
                        const act = String(detail['action'])
                        const target = act[0].toLowerCase() + act.substr(1).replace(/\s+/g, '')
                        if (target == btnAction) callBack(event)
                    })
                    return prom
                }
            })
        }
        // trim if any
        ;(['html', 'body', 'buttons'] as const).forEach(param => {
            msgBase[param] = String(msgBase[param] ?? '').trim()
        })
        if (msgBase.body !== '' || msgBase.buttons !== '') {
            msgBase.html = `
                <div class="w2ui-message-body">${msgBase.body || ''}</div>
                <div class="w2ui-message-buttons">${msgBase.buttons || ''}</div>
            `
        }
        let styles  = getComputedStyle(query(where.box).get(0) as Element)
        const pWidth  = parseFloat(styles.width)
        const pHeight = parseFloat(styles.height)
        let titleHeight = 0
        if (query(where.after).length > 0) {
            styles = getComputedStyle(query(where.after).get(0) as Element)
            titleHeight = parseInt(styles.display != 'none' ? styles.height : '0')
        }
        if ((msgBase.width ?? 0) > pWidth) msgBase.width = pWidth - 10
        if ((msgBase.height ?? 0) > pHeight - titleHeight) msgBase.height = pHeight - 10 - titleHeight
        msgBase.originalWidth  = msgBase.width
        msgBase.originalHeight = msgBase.height
        if (parseInt(String(msgBase.width)) < 0) msgBase.width = pWidth + (msgBase.width ?? 0)
        if (parseInt(String(msgBase.width)) < 10) msgBase.width = 10
        if (parseInt(String(msgBase.height)) < 0) msgBase.height = pHeight + (msgBase.height ?? 0) - titleHeight
        if (parseInt(String(msgBase.height)) < 10) msgBase.height = 10
        // negative value means margin
        if ((msgBase.originalHeight ?? 0) < 0) msgBase.height = pHeight + (msgBase.originalHeight ?? 0) - titleHeight
        if ((msgBase.originalWidth ?? 0) < 0) msgBase.width = pWidth + (msgBase.originalWidth ?? 0) * 2 // x 2 because there is left and right margin
        const head = query(where.box).find(where.after as string) // needed for z-index manipulations
        if (!msgBase.tmp) {
            msgBase.tmp = {
                zIndex: String(head.css('z-index')),
                overflow: styles.overflow
            }
        }
        // remove message
        if (msgBase.html === '' && msgBase.body === '' && msgBase.buttons === '') {
            removeLast()
        } else {
            msgBase.msgIndex = query(where.box).find('.w2ui-message').length
            if (msgBase.msgIndex === 0 && typeof this.lock == 'function') {
                query(where.box).css('overflow', 'hidden')
                if (where.owner) { // where.praram is used in the panel
                    where.owner.lock(where.param)
                } else {
                    this.lock(where.box)
                }
            }
            // send back previous messages
            query(where.box).find('.w2ui-message').css('z-index', '1390')
            head.css('z-index', '1501')
            // add message
            const content = `
                <div id="w2ui-message-${where.owner?.name}-${msgBase.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${((pWidth - (msgBase.width ?? 0)) / 2)}px; top: ${titleHeight}px;
                        width: ${msgBase.width}px; height: ${msgBase.height}px; transform: translateY(-${msgBase.height}px)"
                    ${(msgBase.hideOn ?? []).includes('click')
                        ? where.param
                            ? `data-click='["message", "${where.param}"]`
                            : 'data-click="message"'
                        : ''}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${msgBase.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`
            if (query(where.after).length > 0) {
                query(where.box).find(where.after as string).after(content)
            } else {
                query(where.box).prepend(content)
            }
            // any: DOM elements get _msg_options + _msg_prevFocus dynamic properties at open time
            msgBase.box = query(where.box).find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`)[0] as Element
            w2utils.bindEvents(msgBase.box, this as unknown as Record<string, unknown>)
            query(msgBase.box)
                .addClass('animating')
            // remember options and prev focus
            ;(msgBase.box as unknown as Record<string, unknown>)['_msg_options'] = msgBase
            ;(msgBase.box as unknown as Record<string, unknown>)['_msg_prevFocus'] = document.activeElement
            // timeout is needs so that callBacks are setup
            setTimeout(() => {
                // before event
                // any: trigger is mixed in from w2base; edata is a w2event with isCancelled + finish()
                edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('open', { target: (this as unknown as Record<string, unknown>)['name'], box: msgBase.box, self: msgBase })
                const edataR = edata as Record<string, unknown>
                if (edataR['isCancelled'] === true) {
                    query(where.box).find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`).remove()
                    if (msgBase.msgIndex === 0) {
                        head.css('z-index', msgBase.tmp!.zIndex)
                        query(where.box).css('overflow', msgBase.tmp!.overflow)
                    }
                    return
                }
                // slide down
                query(msgBase.box).css({
                    transition: '0.3s',
                    transform: 'translateY(0px)'
                })
            }, 0)
            // timeout is needed so that animation can finish
            openTimer = setTimeout(() => {
                // has to be on top of lock
                query(where.box)
                    .find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`)
                    .removeClass('animating')
                    .css({ 'transition': '0s' })
                // event after
                ;((edata as Record<string, unknown>)?.['finish'] as (() => void) | undefined)?.()
            }, 300)
        }
        // action handler
        msgBase.action = (action: string, event: unknown) => {
            let click = msgBase.actions?.[action]
            if (click instanceof Object && (click as Record<string, unknown>)['onClick']) click = (click as Record<string, unknown>)['onClick'] as unknown
            // event before
            // any: trigger is mixed in from w2base
            const edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('action', { target: (this as unknown as Record<string, unknown>)['name'], action, self: msgBase,
                originalEvent: event, value: msgBase.input ? (msgBase.input as HTMLInputElement).value : null })
            const edataR = edata as Record<string, unknown>
            if (edataR['isCancelled'] === true) return
            // default actions
            if (typeof click === 'function') click(edata)
            // event after
            ;(edataR['finish'] as (() => void) | undefined)?.()
        }
        msgBase.close = () => {
            // any: trigger is mixed in from w2base
            edata = (msgOpts['trigger'] as (..._a: unknown[]) => unknown)('close', { target: 'self', box: msgBase.box, self: msgBase })
            const edataR = edata as Record<string, unknown>
            if (edataR['isCancelled'] === true) return
            clearTimeout(openTimer)
            if (query(msgBase.box).hasClass('animating')) {
                clearTimeout(closeTimer)
                closeComplete(msgOpts)
                return
            }
            // default behavior
            query(msgBase.box)
                .addClass('w2ui-closing animating')
                .css({
                    'transition': '0.15s',
                    'transform': 'translateY(-' + msgBase.height + 'px)'
                })
            if ((msgBase.msgIndex ?? 0) !== 0) {
                // previous message
                query(where.box).find(`#w2ui-message-${where.owner?.name}-${(msgBase.msgIndex ?? 1)-1}`).css('z-index', '1499')
            }
            closeTimer = setTimeout(() => { closeComplete(msgOpts) }, 150)
        }
        msgBase.setFocus = (focus: number | string | null | undefined) => {
            // in message or popup
            const cnt = query(where.box).find('.w2ui-message').length - 1
            const box = query(where.box).find(`#w2ui-message-${where.owner?.name}-${cnt}`)
            const sel = 'input, button, select, textarea, [contentEditable], .w2ui-input'
            if (focus != null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const el: any = typeof focus === 'string'
                    ? box.find(sel).filter(focus).get(0)
                    : box.find(sel).get(focus as number)
                el?.focus()
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (box.find('[name=hidden-first]').get(0) as any)?.focus()
            }

            // clear focus if there are other messages
            query(where.box)
                .find('.w2ui-message')
                .find(sel + ',[name=hidden-first],[name=hidden-last]')
                .off('.keep-focus')

            // keep focus/blur inside popup
            query(box)
                .find(sel + ',[name=hidden-first],[name=hidden-last]')
                .on('blur.keep-focus', function (event) {
                    setTimeout(() => {
                        const focus = document.activeElement
                        const inside = query(box).find(sel).filter(focus).length > 0
                        const name = query(focus).attr('name')
                        if (!inside && focus && focus !== document.body) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (query(box).find(sel).get(0) as any)?.focus()
                        }
                        if (name == 'hidden-last') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (query(box).find(sel).get(0) as any)?.focus()
                        }
                        if (name == 'hidden-first') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (query(box).find(sel).get(-1) as any)?.focus()
                        }
                    }, 1)
                })
        }
        return prom
    }

    alert(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined {
        return this.message(where, options)
    }

    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
     * but it will have options similar to w2prompt dialog
     *
     * Example:
     *  - w2utils.conrirm({
     *       box: '#custom',
     *       text: 'Some message'
     *    })
     *    .yes(event => console.log(event))
     */
    confirm(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined {
        // any: options is normalized in-place; shape is W2MessageOptions at runtime
        let msgOpts: Record<string, unknown> = {}
        if (['string', 'number'].includes(typeof options)) {
            msgOpts = { text: options }
        } else if (arguments.length == 1) {
            msgOpts = where as unknown as Record<string, unknown>
        } else {
            msgOpts = (options ?? {}) as unknown as Record<string, unknown>
        }
        w2utils.normButtons(msgOpts, { yes: 'Yes', no: 'No' })
        msgOpts['cancelAction'] ??= 'No'
        const prom = w2utils.message(where, msgOpts as unknown as W2MessageOptions)
        if (prom) {
            prom.action((event: unknown) => {
                const d = (event as Record<string, unknown>)['detail'] as Record<string, unknown>
                const self = d?.['self'] as Record<string, unknown>
                ;(self?.['close'] as (() => void) | undefined)?.()
            })
        }
        return prom
    }

    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
     * but it will have options similar to w2prompt dialog
     *
     * Example:
     *  - w2utils.prompt({
     *       box: '#custom',
     *       label: 'Enter Name',
     *       textarea: false,
     *       attrs: 'style="border: 1px solid red"'
     *    })
     *    .ok(event => console.log(event))
     */
    prompt(where: W2MessageWhere, options?: W2MessageOptions | string | number) {
        // any: options is normalized in-place; shape is W2MessageOptions at runtime
        let msgOpts: Record<string, unknown> = {}
        if (['string', 'number'].includes(typeof options)) {
            msgOpts = { label: options }
        } else if (arguments.length == 1) {
            msgOpts = where as unknown as Record<string, unknown>
        } else {
            msgOpts = (options ?? {}) as unknown as Record<string, unknown>
        }
        msgOpts['cancelAction'] ??= 'Cancel'
        if (msgOpts['label']) {
            msgOpts['focus'] = 0 // the input should be in focus, which is first in the popup
            msgOpts['body'] = (msgOpts['textarea']
                ? `<div class="w2ui-prompt textarea">
                     <div>${msgOpts['label']}</div>
                     <textarea id="w2prompt" class="w2ui-input" ${msgOpts['attrs'] ?? ''}
                        data-keydown="keydown|event" data-keyup="change|event"></textarea>
                   </div>`
                : `<div class="w2ui-prompt w2ui-centered">
                     <label>${msgOpts['label']}&nbsp;</label>
                     <input id="w2prompt" class="w2ui-input" ${msgOpts['attrs'] ?? ''}
                        data-keydown="keydown|event" data-keyup="change|event">
                   </div>`
            )
        }
        w2utils.normButtons(msgOpts, { ok: w2utils.lang('Ok'), cancel: w2utils.lang('Cancel') })
        const prom = w2utils.message(where, msgOpts as unknown as W2MessageOptions)
        if (prom) {
            prom.change = function(callBack: (event: unknown) => void) {
                const selfR = prom.self as unknown as Record<string, unknown>
                ;(selfR?.['on'] as ((ev: string, cb: (event: unknown) => void) => void) | undefined)?.('change.prom', callBack)
                return prom
            }
            prom
                .action((event: unknown) => {
                    const d = (event as Record<string, unknown>)['detail'] as Record<string, unknown>
                    const self = d?.['self'] as Record<string, unknown>
                    ;(self?.['close'] as (() => void) | undefined)?.()
                })
                .then((event: unknown) => {
                    const d = (event as Record<string, unknown>)['detail'] as Record<string, unknown>
                    ;(d?.['self'] as Record<string, unknown>)['input'] = query(d?.['box']).find('#w2prompt').get(0)
                    query(d?.['box'])
                        .find('#w2prompt')
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .on('keydown', (evt: any) => {
                            if (evt.keyCode == 13 && evt.shiftKey === false) {
                                evt.preventDefault()
                            }
                        })
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .on('keyup', (evt: any) => {
                            const self = d?.['self'] as Record<string, unknown>
                            // any: trigger is mixed in from w2base
                            const edata = (self?.['trigger'] as (..._a: unknown[]) => unknown)?.('change', { value: evt.target.value, input: evt.target, originalEvent: evt })
                            if (evt.keyCode == 13 && evt.shiftKey === false) {
                                ;(self?.['action'] as (..._a: unknown[]) => unknown)?.('Ok', evt)
                            }
                            ;((edata as Record<string, unknown>)?.['finish'] as (() => void) | undefined)?.()
                        })
                })
        }
        return prom
    }

    /**
     * Normalizes yes, no buttons for confirmation dialog
     *
     * @param {*} options
     * @returns  options
     */
    normButtons(options: Record<string, unknown>, btn: Record<string, unknown>): Record<string, unknown> {
        options['actions'] = options['actions'] ?? {}
        const btns = Object.keys(btn)
        btns.forEach(name => {
            const action = options['btn_' + name] as Record<string, unknown> | undefined
            if (action) {
                btn[name] = {
                    text: w2utils.lang(String(action['text'] ?? btn[name] ?? '')),
                    class: action['class'] ?? '',
                    style: action['style'] ?? '',
                    attrs: action['attrs'] ?? ''
                }
                delete options['btn_' + name]
            }
            ;['text', 'class', 'style', 'attrs'].forEach(suffix => {
                if (options[name + '_' + suffix]) {
                    if (typeof btn[name] == 'string') {
                        btn[name] = { text: btn[name] }
                    }
                    ;(btn[name] as Record<string, unknown>)[suffix] = options[name + '_' + suffix]
                    delete options[name + '_' + suffix]
                }
            })
        })
        if (btns.includes('yes') && btns.includes('no')) {
            if (w2utils.settings.macButtonOrder) {
                w2utils.extend(options['actions'], { no: btn['no'], yes: btn['yes'] })
            } else {
                w2utils.extend(options['actions'], { yes: btn['yes'], no: btn['no'] })
            }
        }
        if (btns.includes('ok') && btns.includes('cancel')) {
            if (w2utils.settings.macButtonOrder) {
                w2utils.extend(options['actions'], { cancel: btn['cancel'], ok: btn['ok'] })
            } else {
                w2utils.extend(options['actions'], { ok: btn['ok'], cancel: btn['cancel'] })
            }
        }
        return options
    }

    /**
     * Shows small notification message at the bottom of the page, or containter that you specify
     * in options.where (could be element or a selector)
     *
     * w2utils.notify('Document saved')
     * w2utils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
     *
     * @param {String/Object} options can be {
     *      text: string,       // message, can be html
     *      where: el/selector, // element or selector where to show, default is document.body
     *      timeout: int,       // timeout when to hide, if 0 - indefinite
     *      error: boolean,     // add error clases
     *      class: string,      // additional class strings
     *      actions: object     // object with action functions, it should correspot to templated text: '... ${action} ...'
     *  }
     * @returns promise
     */
    notify(text: string | Record<string, unknown>, options?: Record<string, unknown>): Promise<void> {
        return new Promise<void>(resolve => {
            // any: text can be an options object; normalize in-place
            let opts: Record<string, unknown> = options ?? {}
            let textStr: string = ''
            if (typeof text == 'object') {
                opts = text
                textStr = String(opts['text'] ?? '')
            } else {
                textStr = String(text ?? '')
            }
            opts['where'] ??= document.body
            opts['timeout'] ??= 15_000 // 15 seconds or will be hidden on route change
            if (typeof this.tmp.notify_resolve == 'function') {
                ;(this.tmp.notify_resolve as () => void)()
                query(this.tmp.notify_where).find('#w2ui-notify').remove()
            }
            this.tmp.notify_resolve = resolve
            this.tmp.notify_where = opts['where']
            clearTimeout(this.tmp.notify_timer as number)
            if (textStr) {
                if (typeof opts['actions'] == 'object') {
                    const actions: Record<string, string> = {}
                    Object.keys(opts['actions'] as Record<string, unknown>).forEach(action => {
                        actions[action] = `<a class="w2ui-notify-link" value="${action}">${action}</a>`
                    })
                    textStr = this.execTemplate(textStr, actions)
                }
                const html = `
                    <div id="w2ui-notify" style="${opts['where'] == document.body ? 'position: fixed' : ''}">
                        <div class="${opts['class'] ?? ''} ${opts['error'] ? 'w2ui-notify-error' : ''} ${opts['success'] ? 'w2ui-notify-success' : ''}">
                            ${textStr}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`
                query(opts['where']).append(html)
                query(opts['where']).find('#w2ui-notify').find('.w2ui-notify-close')
                    .on('click', _event => {
                        query(opts['where']).find('#w2ui-notify').remove()
                        resolve()
                    })
                if (opts['actions']) {
                    query(opts['where']).find('#w2ui-notify .w2ui-notify-link')
                        .on('click', event => {
                            const value = query((event as Event).target).attr('value')
                            ;((opts['actions'] as Record<string, unknown>)[value] as () => void)()
                            query(opts['where']).find('#w2ui-notify').remove()
                            resolve()
                        })
                }
                if ((opts['timeout'] as number) > 0) {
                    this.tmp.notify_timer = setTimeout(() => {
                        query(opts['where']).find('#w2ui-notify').remove()
                        resolve()
                    }, opts['timeout'] as number)
                }
            }
        })
    }

    getSize(el: unknown, type: string): number {
        const $el = query(el) // for backward compatibility
        let ret = 0
        if ($el.length > 0) {
            const styles = getComputedStyle($el[0] as Element)
            switch (type) {
                case 'width' :
                    ret = parseFloat(styles.width)
                    if (styles.width === 'auto') ret = 0
                    break
                case 'height' :
                    ret = parseFloat(styles.height)
                    if (styles.height === 'auto') ret = 0
                    break
                default:
                    // any: type is a CSS property name; CSSStyleDeclaration is indexable by string
                    ret = parseFloat(String(styles[type as keyof CSSStyleDeclaration] ?? '')) || 0
                    break
            }
        }
        return ret
    }

    getStrDimentions(str, styles, raw) {
        let div = query('body > #_tmp_width')
        if (div.length === 0) {
            query('body').append('<div id="_tmp_width" style="position: absolute; top: -9000px;"></div>')
            div = query('body > #_tmp_width')
        }
        if (raw === undefined && str.trim().startsWith('<') && str.trim().endsWith('>')) {
            raw = true
        }
        ;(div.html(raw ? str : this.encodeTags(str ?? '')) as Query).attr('style', `position: absolute; top: -9000px; ${styles || ''}`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const width = (div[0] as any).clientWidth
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const height = (div[0] as any).clientHeight
        div.html('')
        return { width, height }
    }

    getStrWidth(str, styles, raw) {
        return this.getStrDimentions(str, styles, raw).width
    }

    getStrHeight(str, styles, raw) {
        return this.getStrDimentions(str, styles, raw).height
    }

    execTemplate(str, replace_obj) {
        if (typeof str !== 'string' || !replace_obj || typeof replace_obj !== 'object') {
            return str
        }
        return str.replace(/\${([^}]+)?}/g, function($1, $2) { return replace_obj[$2]||$2 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    marker(el: any, items: any, options: any = { onlyFirst: false, wholeWord: false, isRegex: false}) {
        options.tag ??= 'span'
        options.class ??= 'w2ui-marker'
        options.raplace = (matched) => `<${options.tag} class="${options.class}">${matched}</${options.tag}>`

        const isRegexSearch = options.isRegex || false
        if (!Array.isArray(items)) {
            if (items != null && items !== '') {
                items = [items]
            } else {
                items = []
            }
        }
        if (typeof el == 'string') {
            _clearMerkers(el)
            items.forEach(item => {
                if (isRegexSearch) {
                    // For regex searches with string elements
                    try {
                        const flags = 'i' + (!options.onlyFirst ? 'g' : '')
                        const regex = new RegExp(item, flags)
                        el = el.replace(regex, options.raplace)
                    } catch (e) {
                        console.error('Invalid regular expression:', e)
                        // Fallback to standard replace
                        el = _replace(el, item, options.raplace)
                    }
                } else {
                    // Standard string replace
                    el = _replace(el, item, options.raplace)
                }
            })
        } else {
            query(el).each(el => {
                _clearMerkers(el)
                if (isRegexSearch) {
                    // For regex searches, use DOM traversal approach
                    items.forEach(pattern => {
                        try {
                            let flags = 'i' // Always case-insensitive
                            if (!options.onlyFirst) {
                                flags += 'g' // Add 'g' for global unless onlyFirst is true
                            }
                            if (options.wholeWord) {
                                // If wholeWord is true, wrap the pattern with word boundary markers
                                pattern = '\b' + pattern + '\b'
                            }

                            const regex = new RegExp(pattern, flags)

                            // Get all text nodes
                            const textNodes = []
                            function getTextNodes(node) {
                                if (node.nodeType === 3) { // Text node
                                    textNodes.push(node)
                                } else if (node.nodeType === 1) { // Element node
                                    // Skip script and style tags
                                    if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                                        for (let i = 0; i < node.childNodes.length; i++) {
                                            getTextNodes(node.childNodes[i])
                                        }
                                    }
                                }
                            }

                            getTextNodes(el)

                            // Process each text node
                            textNodes.forEach(textNode => {
                                const text = textNode.nodeValue
                                const matches = []
                                let match

                                // Find all matches
                                if (options.onlyFirst) {
                                    match = regex.exec(text)
                                    if (match) matches.push({
                                        index: match.index,
                                        text: match[0]
                                    })
                                } else {
                                    while ((match = regex.exec(text)) !== null) {
                                        matches.push({
                                            index: match.index,
                                            text: match[0]
                                        })
                                    }
                                }

                                // Apply highlighting
                                if (matches.length > 0) {
                                    const parent = textNode.parentNode
                                    const fragment = document.createDocumentFragment()
                                    let lastIndex = 0

                                    matches.forEach(match => {
                                        // Add text before match
                                        if (match.index > lastIndex) {
                                            fragment.appendChild(document.createTextNode(
                                                text.substring(lastIndex, match.index)
                                            ))
                                        }

                                        // Add highlighted match
                                        const span = document.createElement(options.tag)
                                        span.className = options.class
                                        span.appendChild(document.createTextNode(match.text))
                                        fragment.appendChild(span)

                                        lastIndex = match.index + match.text.length
                                    })

                                    // Add remaining text
                                    if (lastIndex < text.length) {
                                        fragment.appendChild(document.createTextNode(
                                            text.substring(lastIndex)
                                        ))
                                    }

                                    // Replace the text node with our fragment
                                    parent.replaceChild(fragment, textNode)
                                }
                            })
                        } catch (e) {
                            console.error('Invalid regular expression:', e)
                            // Fallback to standard innerHTML replace
                            // any: el from query.each() is Node; cast to HTMLElement for innerHTML
                            ;(el as HTMLElement).innerHTML = _replace((el as HTMLElement).innerHTML, pattern, options.raplace)
                        }
                    })
                } else {
                    // Standard innerHTML replace for non-regex
                    items.forEach(item => {
                        ;(el as HTMLElement).innerHTML = _replace((el as HTMLElement).innerHTML, item, options.raplace)
                    })
                }
            })
        }
        return el

        function _replace(html, term, replaceWith) {
            const ww = options.wholeWord
            if (typeof term !== 'string') term = String(term)
            // escape regex special chars
            term = term
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&gt;')
                .replace(/>/g, '&lt;')
            // only outside tags
            // and only outside of quotes
            // let regex = new RegExp((ww ? '\\b' : '') + term + (ww ? '\\b' : '') + '(?=([a-z-0-9]+="[^"]*")*?[^"]+$)' + '(?!([^<]+)?>)', 'i' + (!options.onlyFirst ? 'g' : ''))
            // -- the one above would not match inside html tags
            const regex = new RegExp((ww ? '\\b' : '') + term + (ww ? '\\b' : '') + '(?![^<]*>)', 'i' + (!options.onlyFirst ? 'g' : ''))
            return html = html.replace(regex, replaceWith)
        }

        function _clearMerkers(el) {
            const markerRE = new RegExp(`<${options.tag}[^>]*class=["']${options.class.replace(/-/g, '\\-')}["'][^>]*>([\\s\\S]*?)<\\/${options.tag}>`, 'ig')
            if (typeof el == 'string') {
                while (el.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
                    el = el.replace(markerRE, '$1') // unmark
                }
            } else {
                while (el.innerHTML.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
                    el.innerHTML = el.innerHTML.replace(markerRE, '$1') // unmark
                }
            }
        }
    }

    lang(phrase: string, params?: Record<string, string>): string {
        if (!phrase || this.settings.phrases == null // if no phrases at all
                || typeof phrase !== 'string' || '<=>='.includes(phrase)) {
            return this.execTemplate(phrase, params)
        }
        let translation = this.settings.phrases[phrase]
        if (translation == null) {
            translation = phrase
            if (this.settings.warnNoPhrase) {
                if (!this.settings.missing) {
                    this.settings.missing = {}
                }
                this.settings.missing[phrase] = '---' // collect phrases for translation, warn once
                this.settings.phrases[phrase] = '---'
                console.log(`Missing translation for "%c${phrase}%c", see %c w2utils.settings.phrases %c with value "---"`,
                    'color: orange', '',
                    'color: #999', '')
            }
        } else if (translation === '---' && !this.settings.warnNoPhrase) {
            translation = phrase
        }
        if (translation === '---') {
            translation = `<span ${this.tooltip(phrase)}>---</span>`
        }
        return this.execTemplate(translation, params)
    }

    locale(locale: string | string[] | Record<string, unknown>, keepPhrases?: boolean, noMerge?: boolean): Promise<{ file: string; data: unknown } | void> {
        return new Promise<{ file: string; data: unknown } | void>((resolve, reject) => {
            // if locale is an array we call this function recursively and merge the results
            if (Array.isArray(locale)) {
                this.settings.phrases = {}
                const proms: Array<Promise<unknown>> = []
                const files: Record<string, unknown> = {}
                const localeArr = locale as string[]
                localeArr.forEach((file, ind) => {
                    if (file.length === 5) {
                        file = 'locale/'+ file.toLowerCase() +'.json'
                        localeArr[ind] = file
                    }
                    proms.push(this.locale(file, true, false))
                })
                Promise.allSettled(proms)
                    .then(res => {
                        // order of files is important to merge
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        res.forEach((r: any) => { if (r.value) files[r.value.file] = r.value.data })
                        localeArr.forEach(file => {
                            this.settings = this.extend({}, this.settings, files[file])
                        })
                        resolve()
                    })
                return
            }
            if (!locale) locale = 'en-us'

            // if locale is an object, then merge it with w2utils.settings
            if (typeof locale === 'object') {
                this.settings = this.extend({}, this.settings, w2locale, locale)
                return
            }

            let localeStr = locale as string
            if (localeStr.length === 5) {
                localeStr = 'locale/'+ localeStr.toLowerCase() +'.json'
            }

            // load from the file
            fetch(localeStr, { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    if (noMerge !== true) {
                        if (keepPhrases) {
                            // keep phrases, useful for recursive calls
                            this.settings = this.extend({}, this.settings, data)
                        } else {
                            // clear phrases from language before merging
                            this.settings = this.extend({}, this.settings, w2locale, { phrases: {} }, data)
                        }
                    }
                    resolve({ file: localeStr, data })
                })
                .catch((err) => {
                    console.log('ERROR: Cannot load locale '+ localeStr)
                    reject(err)
                })
        })
    }

    scrollBarSize() {
        if (this.tmp.scrollBarSize) return this.tmp.scrollBarSize
        const html = `
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `
        query('body').append(html)
        this.tmp.scrollBarSize = 100 - (query('#_scrollbar_width > div')[0] as HTMLElement).clientWidth
        query('#_scrollbar_width').remove()
        return this.tmp.scrollBarSize
    }

    checkName(name) {
        if (name == null) {
            console.log('ERROR: Property "name" is required but not supplied.')
            return false
        }
        if (w2ui[name] != null) {
            console.log(`ERROR: Object named "${name}" is already registered as w2ui.${name}.`)
            return false
        }
        if (!this.isAlphaNumeric(name)) {
            console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).')
            return false
        }
        return true
    }

    checkUniqueId(id, items, desc, obj) {
        if (!Array.isArray(items)) items = [items]
        let isUnique = true
        items.forEach(item => {
            if (item.id === id) {
                console.log(`ERROR: The item id="${id}" is not unique within the ${desc} "${obj}".`, items)
                isUnique = false
            }
        })
        return isUnique
    }

    /**
     * Takes an object and encodes it into params string to be passed as a url
     * { a: 1, b: 'str'}                => "a=1&b=str"
     * { a: 1, b: { c: 2 }}             => "a=1&b[c]=2"
     * { a: 1, b: {c: { k: 'dfdf' } } } => "a=1&b[c][k]=dfdf"
     */
    encodeParams(obj, prefix = '') {
        let str = ''
        Object.keys(obj).forEach(key => {
            if (str != '') str += '&'
            if (typeof obj[key] == 'object') {
                str += this.encodeParams(obj[key], prefix + key + (prefix ? ']' : '') + '[')
            } else {
                str += `${prefix}${key}${prefix ? ']' : ''}=${obj[key]}`
            }
        })
        return str
    }

    parseRoute(route) {
        const keys = []
        const path = route
            .replace(/\/\(/g, '(?:/')
            .replace(/\+/g, '__plus__')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_, slash, format, key, capture, optional) => {
                keys.push({ name: key, optional: !! optional })
                slash = slash || ''
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '')
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/__plus__/g, '(.+)')
            .replace(/\*/g, '(.*)')
        return {
            path  : new RegExp('^' + path + '$', 'i'),
            keys  : keys
        }
    }

    getCursorPosition(input) {
        if (input == null) return null
        let caretOffset = 0
        const doc = input.ownerDocument || input.document
        const win = doc.defaultView || doc.parentWindow
        let sel
        if (['INPUT', 'TEXTAREA'].includes(input.tagName)) {
            caretOffset = input.selectionStart
        } else {
            if (win.getSelection) {
                sel = win.getSelection()
                if (sel.rangeCount > 0) {
                    const range         = sel.getRangeAt(0)
                    const preCaretRange = range.cloneRange()
                    preCaretRange.selectNodeContents(input)
                    preCaretRange.setEnd(range.endContainer, range.endOffset)
                    caretOffset = preCaretRange.toString().length
                }
            } else if ( (sel = doc.selection) && sel.type !== 'Control') {
                const textRange         = sel.createRange()
                const preCaretTextRange = doc.body.createTextRange()
                preCaretTextRange.moveToElementText(input)
                preCaretTextRange.setEndPoint('EndToEnd', textRange)
                caretOffset = preCaretTextRange.text.length
            }
        }
        return caretOffset
    }

    setCursorPosition(input: HTMLElement | null, pos: number, posEnd?: number): void {
        if (input == null) return
        const range   = document.createRange()
        let el: Node | null = null
        const sel = window.getSelection()
        if (['INPUT', 'TEXTAREA'].includes(input.tagName)) {
            ;(input as HTMLInputElement).setSelectionRange(pos, posEnd ?? pos)
        } else {
            for (let i = 0; i < input.childNodes.length; i++) {
                // any: query().text() / .html() returns string|Query; cast to string
                let tmp = String(query(input.childNodes[i]).text())
                if ((input.childNodes[i] as HTMLElement).tagName) {
                    tmp = String(query(input.childNodes[i]).html())
                    tmp = tmp.replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .replace(/&nbsp;/g, ' ')
                }
                if (pos <= tmp.length) {
                    el = input.childNodes[i]
                    if (el.childNodes && el.childNodes.length > 0) el = el.childNodes[0]
                    if (el.childNodes && el.childNodes.length > 0) el = el.childNodes[0]
                    break
                } else {
                    pos -= tmp.length
                }
            }
            if (el == null) return
            // any: el is a Text node at this point; cast to access .length
            const elLen = (el as Text).length ?? 0
            if (pos > elLen) pos = elLen
            range.setStart(el, pos)
            if (posEnd) {
                range.setEnd(el, posEnd)
            } else {
                range.collapse(true)
            }
            sel.removeAllRanges()
            sel.addRange(range)
        }
    }

    parseColor(str: string | null | undefined): W2Color | null {
        if (typeof str !== 'string') return null; else str = str.trim().toUpperCase()
        if (str[0] === '#') str = str.substr(1)
        let color: W2Color = { r: 0, g: 0, b: 0, a: 1 }
        if (str.length === 3) {
            color = {
                r: parseInt(str[0] + str[0], 16),
                g: parseInt(str[1] + str[1], 16),
                b: parseInt(str[2] + str[2], 16),
                a: 1
            }
        } else if (str.length === 6) {
            color = {
                r: parseInt(str.substr(0, 2), 16),
                g: parseInt(str.substr(2, 2), 16),
                b: parseInt(str.substr(4, 2), 16),
                a: 1
            }
        } else if (str.length === 8) {
            color = {
                r: parseInt(str.substr(0, 2), 16),
                g: parseInt(str.substr(2, 2), 16),
                b: parseInt(str.substr(4, 2), 16),
                a: Math.round(parseInt(str.substr(6, 2), 16) / 255 * 100) / 100 // alpha channel 0-1
            }
        } else if (str.length > 4 && str.substr(0, 4) === 'RGB(') {
            const tmp = str.replace('RGB', '').replace(/\(/g, '').replace(/\)/g, '').split(',')
            color   = {
                r: parseInt(tmp[0], 10),
                g: parseInt(tmp[1], 10),
                b: parseInt(tmp[2], 10),
                a: 1
            }
        } else if (str.length > 5 && str.substr(0, 5) === 'RGBA(') {
            const tmp = str.replace('RGBA', '').replace(/\(/g, '').replace(/\)/g, '').split(',')
            color   = {
                r: parseInt(tmp[0], 10),
                g: parseInt(tmp[1], 10),
                b: parseInt(tmp[2], 10),
                a: parseFloat(tmp[3])
            }
        } else {
            // word color
            return null
        }
        return color
    }

    colorContrast(color1: string, color2: string): string {
        const lum1 = calcLumens(color1)
        const lum2 = calcLumens(color2)
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
        return ratio.toFixed(2)

        function calcLumens(color: string): number {
            const { r, g, b } = w2utils.parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 }
            const gamma = 2.2
            const normR = r / 255
            const normG = g / 255
            const normB = b / 255
            const sR = (normR <= 0.03928) ? normR / 12.92 : Math.pow((normR + 0.055) / 1.055, gamma)
            const sG = (normG <= 0.03928) ? normG / 12.92 : Math.pow((normG + 0.055) / 1.055, gamma)
            const sB = (normB <= 0.03928) ? normB / 12.92 : Math.pow((normB + 0.055) / 1.055, gamma)
            return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB
        }
    }

    // h=0..360, s=0..100, v=0..100
    hsv2rgb(h, s, v, a) {
        let r, g, b
        if (arguments.length === 1) {
            s = h.s; v = h.v; a = h.a; h = h.h
        }
        h = h / 360
        s = s / 100
        v = v / 100
        const i = Math.floor(h * 6)
        const f = h * 6 - i
        const p = v * (1 - s)
        const q = v * (1 - f * s)
        const t = v * (1 - (1 - f) * s)
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break
            case 1: r = q, g = v, b = p; break
            case 2: r = p, g = v, b = t; break
            case 3: r = p, g = q, b = v; break
            case 4: r = t, g = p, b = v; break
            case 5: r = v, g = p, b = q; break
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a: (a != null ? a : 1)
        }
    }

    // r=0..255, g=0..255, b=0..255
    rgb2hsv(r, g, b, a) {
        if (arguments.length === 1) {
            g = r.g; b = r.b; a = r.a; r = r.r
        }
        const max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min
        let h
        const s = (max === 0 ? 0 : d / max),
            v = max / 255
        switch (max) {
            case min: h = 0; break
            case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break
            case g: h = (b - r) + d * 2; h /= 6 * d; break
            case b: h = (r - g) + d * 4; h /= 6 * d; break
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100),
            a: (a != null ? a : 1)
        }
    }

    tooltip(html: string | Record<string, unknown>, options?: Record<string, unknown>): string {
        let showOn = 'mouseenter'
        let hideOn = 'mouseleave'
        let opts: Record<string, unknown> = options ?? {}
        if (typeof html == 'object') {
            opts = html
        }
        if (typeof html == 'string') {
            opts = { ...opts, html }
        }
        if (opts['showOn']) {
            showOn = opts['showOn'] as string
            delete opts['showOn']
        }
        if (opts['hideOn']) {
            hideOn = opts['hideOn'] as string
            delete opts['hideOn']
        }
        if (!opts['name']) opts['name'] = 'no-name'
        // base64 is needed to avoid '"<> and other special chars conflicts
        const actions = ` on${showOn}="w2tooltip.show(this, `
                + `JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(opts))}')))" `
                + `on${hideOn}="w2tooltip.hide('${opts['name']}')"`
        return actions
    }

    // determins if it is plain Object, not DOM element, nor a function, event, etc.
    isPlainObject(value: unknown): boolean {
        if (value == null) { // null or undefined
            return false
        }
        if (Object.prototype.toString.call(value) !== '[object Object]') {
            return false
        }
        if (value.constructor === undefined) {
            return true
        }
        const proto = Object.getPrototypeOf(value)
        return proto === null || proto === Object.prototype
    }

    /**
     * Deep copy of an object or an array. Function, events and HTML elements will not be cloned,
     * you can choose to include them or not, by default they are included.
     * You can also exclude certain elements from final object if used with options: { exclude }
     */
    clone(obj: unknown, options?: Partial<W2CloneOptions>): unknown {
        const opts = Object.assign({ functions: true, elements: true, events: true, exclude: [] as W2CloneOptions['exclude'], parent: '' }, options ?? {})
        if (Array.isArray(obj)) {
            const arr: unknown[] = Array.from(obj)
            arr.forEach((value, ind) => {
                arr[ind] = this.clone(value, { ...opts, parent: (opts.parent ?? '') + '[]' })
            })
            return arr
        } else if (this.isPlainObject(obj)) {
            const ret: Record<string, unknown> = {}
            Object.assign(ret, obj)
            // delete excluded keys
            if (Array.isArray(opts.exclude)) {
                opts.exclude.forEach((key: string) => { delete ret[key] })
            }
            Object.keys(ret).forEach(key => {
                if (typeof opts.exclude == 'function' && opts.exclude(key, { obj, parent: opts.parent ?? '' })) {
                    ret[key] = undefined
                } else {
                    ret[key] = this.clone(ret[key], { ...opts, parent: (opts.parent ?? '') + (opts.parent != null ? '.' : '') + key })
                }
                if (ret[key] === undefined) delete ret[key] // do not include undefined elements
            })
            return ret
        } else {
            if ((obj instanceof Function && !opts.functions)
                    || (obj instanceof Node && !opts.elements)
                    || (obj instanceof Event && !opts.events)
            ) {
                // do not include these objects, otherwise include them uncloned
                return undefined
            } else {
                // primitive variable or function, event, dom element, etc, -  all these are not cloned
                return obj
            }
        }
    }

    /**
     * Deep extend an object, if an array, it overwrrites it, cloning objects in the process
     * target, source1, source2, ...
     */
    extend(target, source, ...rest: unknown[]) {
        if (Array.isArray(target)) {
            if (Array.isArray(source)) {
                target.splice(0, target.length) // empty array but keep the reference
                source.forEach(s => { target.push(this.clone(s)) })
            } else {
                throw new Error('Arrays can be extended with arrays only')
            }
        } else if (target instanceof Node || target instanceof Event) {
            throw new Error('HTML elmenents and events cannot be extended')
        } else if (target && typeof target == 'object' && source != null) {
            if (typeof source != 'object') {
                throw new Error('Object can be extended with other objects only.')
            }
            Object.keys(source).forEach(key => {
                if (target[key] != null && typeof target[key] == 'object'
                        && source[key] != null && typeof source[key] == 'object') {
                    const src = this.clone(source[key])
                    // do not extend HTML elements and events, but overwrite them
                    if (target[key] instanceof Node || target[key] instanceof Event) {
                        target[key] = src
                    } else {
                        // if an array needs to be extended with an object, then convert it to empty object
                        if (Array.isArray(target[key]) && this.isPlainObject(src)) {
                            target[key] = {}
                        }
                        this.extend(target[key], src)
                    }
                } else {
                    target[key] = this.clone(source[key])
                }
            })
        } else if (source != null) {
            throw new Error('Object is not extendable, only {} or [] can be extended.')
        }
        // other arguments
        if (rest.length > 0) {
            for (let i = 0; i < rest.length; i++) {
                this.extend(target, rest[i])
            }
        }
        return target
    }

    /*
     * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
     * @license    MIT License
     */
    naturalCompare(a: unknown, b: unknown): number {
        let i: number, codeA: number, codeB = 1, posA = 0, posB = 0
        // any: String.alphabet is an optional user-defined extension for custom sort order (non-standard)
        const alphabet = (String as unknown as Record<string, unknown>)['alphabet'] as string | undefined

        function getCode(str: string, pos: number, code?: number): number {
            if (code) {
                for (i = pos; (code = getCode(str, i)) , code < 76 && code > 65;) ++i
                return +str.slice(pos - 1, i)
            }
            let c: number = alphabet ? alphabet.indexOf(str.charAt(pos)) : -1
            return c > -1 ? c + 76 : ((c = str.charCodeAt(pos) || 0), c < 45 || c > 127) ? c
                : c < 46 ? 65 // -
                : c < 48 ? c - 1
                : c < 58 ? c + 18 // 0-9
                : c < 65 ? c - 11
                : c < 91 ? c + 11 // A-Z
                : c < 97 ? c - 37
                : c < 123 ? c + 5 // a-z
                : c - 63
        }

        const aStr = '' + a, bStr = '' + b
        if (aStr != bStr) for (;codeB;) {
            codeA = getCode(aStr, posA++)
            codeB = getCode(bStr, posB++)

            if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
                codeA = getCode(aStr, posA, posA)
                codeB = getCode(bStr, posB, posA = i)
                posB  = i
            }

            if (codeA != codeB) return (codeA < codeB) ? -1 : 1
        }
        return 0
    }

    /**
     * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
     * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
     * to find out id and text fields.
     */
    normMenu(menu: unknown, options: W2NormMenuOptions = {}): W2MenuItem[] | undefined {
        if (Array.isArray(menu)) {
            menu.forEach((it, m) => {
                if (typeof it === 'string' || typeof it === 'number') {
                    menu[m] = { id: it, text: String(it) }
                } else if (it != null) {
                    if (options.itemMap != null) {
                        let val = w2utils.getNested(it, options.itemMap.id)
                        if (options.itemMap.id != null && val != null) {
                            it.id = val
                        }
                        val = w2utils.getNested(it, options.itemMap.text)
                        if (options.itemMap.text != null && val) {
                            it.text = val
                        }
                    }
                    if (it.caption != null && it.text == null) it.text = it.caption
                    if (it.text != null && it.id == null) it.id = it.text
                    if (it.text == null && it.id != null) it.text = it.id
                } else {
                    menu[m] = { id: null, text: 'null' }
                }
            })
            return menu
        } else if (typeof menu === 'function') {
            const newMenu = menu.call(this, menu, options)
            return w2utils.normMenu.call(this, newMenu, options)
        } else if (typeof menu === 'object') {
            return Object.keys(menu).map(key => { return { id: key, text: menu[key] } })
        }
    }

    /**
     * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
     * dataType is in w2utils. This method is used in grid, form and tooltip to prepare fetch parameters
     */
    prepareParams(url: URL, fetchOptions: Record<string, unknown>, options: Record<string, unknown> = {}): Record<string, unknown> {
        const dataType = (options?.['dataType'] as string | undefined) ?? w2utils.settings.dataType
        let postParams = fetchOptions.body
        fetchOptions.method = String(fetchOptions.method).toUpperCase()
        switch (dataType) {
            /**
             * Will submit GET, POST, PUT, DELETE
             * - if GET - it will be in URL
             * - if POST, PUT, DELETE it will be JSON encoded
             */
            case 'RESTFULL':
            case 'RESTFULJSON': {
                if (['POST', 'PUT', 'DELETE'].includes(String(fetchOptions['method']))) {
                    ;(fetchOptions['headers'] as Record<string, string>)['Content-Type'] = 'application/json'
                }
                if (String(fetchOptions['method']) == 'GET') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((dataType as any) == 'RESTFULLJSON') { // note: pre-existing typo in original code (RESTFULLJSON vs RESTFULJSON)
                        postParams = { request: postParams }
                    }
                    body2params()
                }
                break
            }
            /**
             * Will submit either GET or POST and
             * - if POST it will be JSON encoded
             * - if GET it will be in URL
             * - if HTTPJSON and GET then it will be JSON encoded
             */
            case 'HTTP':
            case 'HTTPJSON':
            case 'JSON': {
                if (String(fetchOptions['method']) == 'GET') {
                    if (dataType == 'JSON' || dataType === 'HTTPJSON') {
                        postParams = { request: postParams }
                    }
                    body2params()
                } else {
                    ;(fetchOptions['headers'] as Record<string, string>)['Content-Type'] = 'application/json'
                    fetchOptions['method'] = 'POST'
                }
                break
            }
            default: {
                if (typeof dataType == 'function') {
                    // do nothing, it is custom function that will handle everything
                    fetchOptions = (dataType as unknown as (u: URL, f: Record<string, unknown>, o: Record<string, unknown>) => Record<string, unknown>)(url, fetchOptions, options)
                } else {
                    console.log(`ERROR: Unsupported dataType "${dataType}". Supported types are JSON (default), HTTP, RESTFULL. For backward compatibility HTTPJSON is same as JSON. RESTULFLJSON will encode GET request as JSON.`)
                }
            }
        }
        if (fetchOptions.body != null) {
            fetchOptions.body = typeof fetchOptions.body == 'string' ? fetchOptions.body : JSON.stringify(fetchOptions.body)
        }
        return fetchOptions

        function body2params() {
            const pp = postParams as Record<string, unknown>
            Object.keys(pp).forEach(key => {
                let param: unknown = pp[key]
                if (typeof param == 'object') param = JSON.stringify(param)
                url.searchParams.append(key, String(param ?? ''))
            })
            delete fetchOptions['body']
        }
    }

    bindEvents(selector: unknown, subject: Record<string, unknown>): void {
        // format is
        // <div ... data-<event>='["<method>","param1","param2",...]'> -- should be valid JSON (no undefined)
        // <div ... data-<event>="<method>|param1|param2">
        // -- can have "event", "this", "stop", "stopPrevent", "alert" - as predefined objects
        // any: selector can be Element, Node[], Query, or string; normalize via query()
        const selectorR = selector as Record<string, unknown>
        if ((selectorR?.['length'] as number) == 0) return
        // for backward compatibility
        let normalizedSelector = selector
        if (selectorR?.[0] instanceof Node) {
            normalizedSelector = Array.isArray(selector) ? selector : (selector as { get(): unknown[] }).get()
        }
        query(normalizedSelector).each((el) => {
            const actions = query(el).data()
            Object.keys(actions).forEach(name => {
                const events = ['click', 'dblclick', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mousedown', 'mousemove', 'mouseup',
                    'contextmenu', 'focus', 'focusin', 'focusout', 'blur', 'input', 'change', 'keydown', 'keyup', 'keypress']
                if (events.indexOf(String(name).toLowerCase()) == -1) {
                    return
                }
                let params: unknown[] = Array.isArray(actions[name]) ? actions[name] as unknown[] : [actions[name]]
                if (typeof actions[name] == 'string') {
                    params = (actions[name] as string).split('|').map(key => {
                        // any: key is progressively coerced from string to typed value
                        let val: unknown = key
                        if (key === 'true') val = true
                        if (key === 'false') val = false
                        if (key === 'undefined') val = undefined
                        if (key === 'null') val = null
                        if (typeof val === 'string' && parseFloat(val) == (val as unknown as number)) val = parseFloat(val)
                        const quotes = ['\'', '"', '`']
                        if (typeof val == 'string' && quotes.includes(val[0]) && quotes.includes(val[val.length-1])) {
                            val = val.substring(1, val.length-1)
                        }
                        return val
                    })
                }
                const method = String(params[0]) // params[0] is the method name
                params = params.slice(1) // should be new array
                query(el)
                    .off(name + '.w2utils-bind')
                    .on(name + '.w2utils-bind', function(event) {
                        switch (method) {
                            case 'alert':
                                alert(params[0]) // for testing purposes
                                break
                            case 'stop':
                                event.stopPropagation()
                                break
                            case 'prevent':
                                event.preventDefault()
                                break
                            case 'stopPrevent':
                                event.stopPropagation()
                                event.preventDefault()
                                return false
                                break
                            default:
                                if (subject[method] == null) {
                                    throw new Error(`Cannot dispatch event as the method "${method}" does not exist.`)
                                }
                                // any: subject[method] is a function mixed in at runtime; cast required
                                ;(subject[method] as (...args: unknown[]) => void)(...params.map((key, _ind) => {
                                    switch (String(key).toLowerCase()) {
                                        case 'event':
                                            return event
                                        case 'this':
                                            return this
                                        default:
                                            return key
                                    }
                                }))
                        }
                    })
            })
        })
    }

    debounce(func, wait = 250) {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => { func(...args) }, wait)
        }
    }

    async wait(time = 0) {
        return new Promise<void>(resolve => {
            setTimeout(() => resolve(), time)
        })
    }

    getNested(obj, prop) {
        let val
        try { // need this to make sure no error in props
            val = obj
            const tmp = String(prop).split('.')
            for (let i = 0; i < tmp.length; i++) {
                val = val[tmp[i]]
            }
        } catch (event) {
            val = undefined
        }
        return val

    }
}
var w2utils = new Utils() // eslint-disable-line -- needs to be functional/module scope variable
export { w2ui, w2utils, query }
