/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsLocale
 *
 * T2.5: @ts-nocheck removed; file typed aggressively per typing_policy.
 * See commit body for targeted-any inventory.
 *
 * == TODO ==
 *  - add TsUtils.lang wrap for all captions in all buttons.
 *  - check transition (also with layout)
 *  - deprecate TsUtils.tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events (TsUtils.tooltip still has it)
 *  - transition returns a promise
 *  - removed jQuery
 *  - refactores TsUtils.message()
 *  - added TsUtils.confirm()
 *  - added isPlainObject
 *  - added stripSpaces
 *  - implemented marker - can now take an element or just html
 *  - cssPrefix - deprecated
 *  - TsUtils.debounce
 *  - TsUtils.prepareParams
 *  - TsUtils.getStrHeight
 *  - TsUtils.getStrDimentions
 *  - TsUtils.alrert() - same as TsUtils.message()
 *  - TsUtils.prompt() - similar to TsPrompt
 *  - TsUtils.normMenu(..., options) got options parameter that can have itemMap
 *  - TsUtils.getNested()
 *  - TsUtils.wait() - async timer
 */

// TsBase import removed in Phase 3b — new TsBase() is now called in tsutils-message.ts only.
// Per design §J.9: tsutils.ts no longer needs TsBase after message() body extraction.
import { TsLocale } from './tslocale.js'
import { query as _query, Query } from './query.js'
import { isInt as _isInt, isHex as _isHex, isAlphaNumeric as _isAlphaNumeric, isEmail as _isEmail, isIpAddress as _isIpAddress, isPlainObject as _isPlainObject, isBin as _isBin, isFloat as _isFloat, isMoney as _isMoney } from './tsutils-type-guards.js'
import { parseColor as _parseColor, colorContrast as _colorContrast, colorContrastValue as _colorContrastValue, hsv2rgb as _hsv2rgb, rgb2hsv as _rgb2hsv } from './tsutils-color.js'
import type { TsColorRgb } from './tsutils-color.js'
import { clone as _clone, extend as _extend, naturalCompare as _naturalCompare, getNested as _getNested, normMenu as _normMenu, encodeParams as _encodeParams, prepareParams as _prepareParams, parseRoute as _parseRoute, debounce as _debounce, wait as _wait } from './tsutils-data.js'
import type { TsCloneOptions, TsNormMenuOptions } from './tsutils-data.js'
export type { TsNormMenuOptions } from './tsutils-data.js'
import { stripSpaces as _stripSpaces, stripTags as _stripTags, encodeTags as _encodeTags, decodeTags as _decodeTags, escapeId as _escapeId, unescapeId as _unescapeId, base64encode as _base64encode, base64decode as _base64decode, sha256 as _sha256, execTemplate as _execTemplate } from './tsutils-string.js'
import { marker as _marker } from './tsutils-marker.js'
import { TsUi, checkName as _checkName } from './tsutils-registry.js'
import { notify as _notify } from './tsutils-notify.js'
import { normButtons as _normButtons, _message as _messageFn, _alert as _alertFn, _confirm as _confirmFn, _prompt as _promptFn } from './tsutils-message.js'
import type { TsMessageProm, TsMessageWhere, TsMessageOptions, MessageDeps, ConfirmDeps, PromptDeps } from './tsutils-message.js'
export type { TsMessageProm, TsMessageWhere, TsMessageOptions } from './tsutils-message.js'
import { transition as _transition, lock as _lock, unlock as _unlock, getSize as _getSize, getStrDimentions as _getStrDimentions, getStrWidth as _getStrWidth, getStrHeight as _getStrHeight, bindEvents as _bindEvents } from './tsutils-dom.js'
import type { TsLockOptions } from './tsutils-dom.js'
export type { TsLockOptions } from './tsutils-dom.js'
import { _isDate, _isTime, _isDateTime, _age, _interval, _formatDate, _formatTime, _formatDateTime } from './tsutils-datetime.js'

// TsUtils always calls query() with a selector (never a callback) so the return is always Query.
// any: query() overload returns void|Query when called with a callback; we only use selector calls here
const query = _query as (selector: unknown, context?: unknown) => Query

// ---------------------------------------------------------------------------
// Public interfaces — exported via TsUtils instance
// ---------------------------------------------------------------------------

/** Settings object merged from TsLocale + user locale overrides */
export interface TsUISettings {
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
interface TsFormatterExtra {
    value: unknown
    params?: unknown
    record?: unknown
    [key: string]: unknown
}

/** Signature of a grid-cell formatter function */
type TsFormatter = (record: TsFormatterExtra, extra?: TsFormatterExtra) => string


/** Return value from TsUtils.isTime() when retTime === true */
interface TsTimeResult {
    hours: number
    minutes: number
    seconds: number
}

/** RGB(A) color as returned by TsUtils.parseColor() — defined in tsutils-color, re-exported here for barrel compatibility */
export type { TsColorRgb } from './tsutils-color.js'

/** Options for TsUtils.clone() — defined in tsutils-data, re-exported here for barrel compatibility */
export type { TsCloneOptions } from './tsutils-data.js'

/** Route parameter descriptor */
interface TsRouteKey {
    name: string
    optional: boolean
}

/** Parsed route as returned by TsUtils.parseRoute() */
interface _W2ParsedRoute {
    path: RegExp
    keys: TsRouteKey[]
}

/** A normalized menu item */
export interface TsMenuItem {
    id: string | number | null
    text: string
    caption?: string
    class?: string
    style?: string
    attrs?: string
    [key: string]: unknown
}

// TsMessageProm, TsMessageWhere, TsMessageOptions — moved to tsutils-message.ts (Phase 3a of v2.3 SDD).
// Re-exported above via: export type { TsMessageProm, TsMessageWhere, TsMessageOptions } from './tsutils-message.js'

class Utils {
    version: string
    tmp: Record<string, unknown>
    settings: TsUISettings
    i18nCompare: (a: string, b: string) => number
    hasLocalStorage: boolean
    isMac: boolean
    isMobile: boolean
    isIOS: boolean
    isAndroid: boolean
    isSafari: boolean
    isFirefox: boolean
    formatters: Record<string, TsFormatter>

    constructor () {
        this.version = '2.0.x'
        this.tmp = {}
        this.settings = this.extend({}, {
            'dataType'       : 'JSON', // can be HTTP, JSON, RESTFULL (case sensitive)
            'dateStartYear'  : 1950,  // start year for date-picker
            'dateEndYear'    : 2030,  // end year for date picker
            'macButtonOrder' : false, // if true, Yes on the right side
            'warnNoPhrase'   : false,  // call console.warn if lang() encounters a missing phrase
        }, TsLocale, { phrases: null }), // if there are no phrases, then it is original language
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
            'number'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params
                if (parseInt(String(params)) > 20) params = 20
                if (parseInt(String(params)) < 0) params = 0
                if (value == null || value === '') return ''
                return TsUtils.formatNumber(parseFloat(String(value)), params as number, true)
            },

            'float'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                return TsUtils.formatters['number']?.(record, extra) ?? ''
            },

            'int'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                return TsUtils.formatters['number']?.(record, extra) ?? ''
            },

            'money'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                if (value == null || value === '') return ''
                const data = TsUtils.formatNumber(Number(value), TsUtils.settings.currencyPrecision, true)
                return (TsUtils.settings.currencyPrefix || '') + data + (TsUtils.settings.currencySuffix || '')
            },

            'currency'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                return TsUtils.formatters['money']?.(record, extra) ?? ''
            },

            'percent'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === '') return ''
                return TsUtils.formatNumber(value, (params as number) || 1) + '%'
            },

            'size'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                if (value == null || value === '') return ''
                return String(TsUtils.formatSize(parseInt(String(value))))
            },

            'date'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = TsUtils.settings.dateFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + TsUtils.formatDate(dt instanceof Date ? dt : undefined, params) + '</span>'
            },

            'datetime'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = TsUtils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + TsUtils.formatDateTime(dt instanceof Date ? dt : undefined, params) + '</span>'
            },

            'time'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = TsUtils.settings.timeFormat
                if (params === 'h12') params = 'hh:mi pm'
                if (params === 'h24') params = 'h24:mi'
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, params ?? null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + TsUtils.formatTime(value, params) + '</span>'
            },

            'timestamp'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = TsUtils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, params ?? null, true) as boolean | Date
                return dt instanceof Date ? dt.toString() : ''
            },

            'gmt'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                let params = extra.params as string | undefined
                if (params === '') params = TsUtils.settings.datetimeFormat
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, params ?? null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, params ?? null, true) as boolean | Date
                return dt instanceof Date ? dt.toUTCString() : ''
            },

            'age'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === 0 || value === '') return ''
                let dt: boolean | Date = TsUtils.isDateTime(value, null, true) as boolean | Date
                if (dt === false) dt = TsUtils.isDate(value, null, true) as boolean | Date
                const dtStr = dt instanceof Date ? dt : ''
                return '<span title="'+ dtStr +'">' + TsUtils.age(value) + (params ? (' ' + params) : '') + '</span>'
            },

            'interval'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value, params } = extra
                if (value == null || value === 0 || value === '') return ''
                return TsUtils.interval(Number(value)) + (params ? (' ' + params) : '')
            },

            'toggle'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
                if (extra == undefined) extra = record
                const { value } = extra
                return (value ? TsUtils.lang('Yes') : '')
            },

            'password'(record: TsFormatterExtra, extra?: TsFormatterExtra): string {
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

    isBin(val: unknown): boolean { return _isBin(val) }

    isInt(val: unknown): boolean { return _isInt(val) }

    isFloat(val: unknown): boolean { return _isFloat(val, this.settings) }

    isMoney(val: unknown): boolean { return _isMoney(val, this.settings) }

    isHex(val: unknown): boolean { return _isHex(val) }

    isAlphaNumeric(val: unknown): boolean { return _isAlphaNumeric(val) }

    isEmail(val: unknown): boolean { return _isEmail(val) }

    isIpAddress(val: unknown): boolean { return _isIpAddress(val) }

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
                    const t = this.settings.fullmonths[m] ?? ''
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
            if (tmp2 === 'm/d/yy') { month = tmp[0]; day = tmp[1]; year = parseInt(tmp[2] ?? '0') + 1900 }
            if (tmp2 === 'dd/mm/yy') { month = tmp[1]; day = tmp[0]; year = parseInt(tmp[2] ?? '0') + 1900 }
            if (tmp2 === 'd/m/yy') { month = tmp[1]; day = tmp[0]; year = parseInt(tmp[2] ?? '0') + 1900 }
            if (tmp2 === 'yy/dd/mm') { month = tmp[2]; day = tmp[1]; year = parseInt(tmp[0] ?? '0') + 1900 }
            if (tmp2 === 'yy/d/m') { month = tmp[2]; day = tmp[1]; year = parseInt(tmp[0] ?? '0') + 1900 }
            if (tmp2 === 'yy/mm/dd') { month = tmp[1]; day = tmp[2]; year = parseInt(tmp[0] ?? '0') + 1900 }
            if (tmp2 === 'yy/m/d') { month = tmp[1]; day = tmp[2]; year = parseInt(tmp[0] ?? '0') + 1900 }
        }
        if (!this.isInt(year)) return false
        if (!this.isInt(month)) return false
        if (!this.isInt(day)) return false
        // year/month/day are string|number after isInt guards above; the checks ensure they are defined
        const numYear  = +(year ?? 0)
        const numMonth = +(month ?? 0)
        const numDay   = +(day ?? 0)
        dt    = new Date(numYear, numMonth - 1, numDay)
        dt.setFullYear(numYear)
        // do checks
        if (numMonth == null) return false
        if (String(dt) === 'Invalid Date') return false
        if ((dt.getMonth() + 1 !== numMonth) || (dt.getDate() !== numDay) || (dt.getFullYear() !== numYear)) return false
        if (retDate === true) return dt; else return true
    }

    isTime(val: unknown, retTime?: boolean): boolean | TsTimeResult {
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
        const tmp0 = tmp[0] ?? '', tmp1 = tmp[1] ?? '', tmp2 = tmp[2] ?? ''
        let h   = parseInt(tmp0 || '0')
        const m = parseInt(tmp1 || '0'), s = parseInt(tmp2 || '0')
        // accept edge case: 3PM is a good timestamp, but 3 (without AM or PM) is NOT:
        if ((!ampm || tmp.length !== 1) && tmp.length !== 2 && tmp.length !== 3) { return false }
        if (tmp0 === '' || h < 0 || h > max || !this.isInt(tmp0) || tmp0.length > 2) { return false }
        if (tmp.length > 1 && (tmp1 === '' || m < 0 || m > 59 || !this.isInt(tmp1) || tmp1.length !== 2)) { return false }
        if (tmp.length > 2 && (tmp2 === '' || s < 0 || s > 59 || !this.isInt(tmp2) || tmp2.length !== 2)) { return false }
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
            if (formats[0] != null) formats[0] = formats[0].trim()
            if (formats[1]) formats[1] = formats[1].trim()
            // check
            const tmp1 = this.isDate(values[0], formats[0], true)
            const tmp2 = this.isTime(values[1], true)
            if (tmp1 !== false && tmp2 !== false) {
                if (retDate !== true) return true
                const dt1 = tmp1 as Date
                const t2  = tmp2 as TsTimeResult
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
            .replace('month', this.settings.fullmonths[month] ?? '')
            .replace('mon', this.settings.shortmonths[month] ?? '')
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
            const tmp = this.isTime(dateStr, true) as TsTimeResult
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
            if (fmt[0] != null) fmt[0] = fmt[0].trim()
            fmt[1] = (fmt.length > 1 ? (fmt[1] ?? '').trim() : this.settings.timeFormat)
        }
        // older formats support
        if (fmt[1] === 'h12') fmt[1] = 'h:m pm'
        if (fmt[1] === 'h24') fmt[1] = 'h24:m'
        return this.formatDate(dateStr, fmt[0]) + ' ' + this.formatTime(dateStr, fmt[1])
    }

    stripSpaces(html: unknown): unknown { return _stripSpaces(html) }

    stripTags(html: unknown): unknown { return _stripTags(html) }

    encodeTags(html: unknown): unknown { return _encodeTags(html) }

    decodeTags(html: unknown): unknown { return _decodeTags(html) }

    escapeId(id: unknown): string { return _escapeId(id) }

    unescapeId(id: string | null | undefined): string { return _unescapeId(id) }

    base64encode(str: string): string { return _base64encode(str) }

    base64decode(encodedStr: string): string { return _base64decode(encodedStr) }

    sha256(str: string): Promise<string> { return _sha256(str) }

    transition(div_old: HTMLElement, div_new: HTMLElement, type: string, callBack?: () => void): Promise<void> { return _transition(div_old, div_new, type, callBack) }

    lock(box: unknown, options: TsLockOptions | string = {}, ...rest: unknown[]): void { return _lock(box, options, ...rest) }

    unlock(box: unknown, speed?: number): void { return _unlock(box, speed) }

    /**
     * Constructs the MessageDeps object for the _message() delegator.
     * Called once per message() invocation — captures `this` at call time.
     * Per design §C.5 / §C.2.
     * @internal
     */
    private _msgDeps(): MessageDeps {
        return {
            extend: _extend,
            bindEvents: (s, subj) => this.bindEvents(s, subj),
            lock: (box, opts) => this.lock(box, opts as never),
            unlock: (box, speed) => this.unlock(box, speed),
            // any: 'name' is set dynamically on widget instances (TsGrid, TsForm, etc.) at runtime
            ownerName: (this as unknown as Record<string, unknown>)['name'] as string | undefined,
            self: this as unknown as Record<string, unknown>
        }
    }

    /**
     * Constructs the ConfirmDeps object for the _confirm() delegator.
     * Per design §C.3.
     * normButtons closure: uses inline lambda that binds this.lang and this.settings
     * at call time — preserving the call-time timing semantics (design §C.3 caveat).
     * @internal
     */
    private _confirmDeps(): ConfirmDeps {
        return {
            extend: _extend,
            normButtons: (opts, btn) => _normButtons(opts, btn, { extend: _extend, lang: this.lang.bind(this), settings: this.settings }),
            message: (w, o) => this.message(w, o),
            settings: this.settings,
            lang: this.lang.bind(this)
        }
    }

    /**
     * Constructs the PromptDeps object for the _prompt() delegator.
     * Per design §C.3.
     * lang is bound at call time so deps.lang('Ok') uses current locale.
     * @internal
     */
    private _promptDeps(): PromptDeps {
        return {
            extend: _extend,
            normButtons: (opts, btn) => _normButtons(opts, btn, { extend: _extend, lang: this.lang.bind(this), settings: this.settings }),
            message: (w, o) => this.message(w, o),
            settings: this.settings,
            lang: this.lang.bind(this)
        }
    }

    /**
     * Opens a context message, similar in parameters as TsPopup.open()
     *
     * Sample Calls
     * TsUtils.message({ box: '#div', text: 'message' }).ok(() => {})
     * TsUtils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
     * TsUtils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
     *
     * Used in TsGrid, TsForm, TsLayout (should be in TsPopup too)
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
    message(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined {
        return _messageFn(where, options, this._msgDeps())
    }

    alert(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined {
        return _alertFn(where, options, this._msgDeps())
    }

    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
     * but it will have options similar to TsPrompt dialog
     *
     * Example:
     *  - TsUtils.conrirm({
     *       box: '#custom',
     *       text: 'Some message'
     *    })
     *    .yes(event => console.log(event))
     */
    confirm(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined {
        return _confirmFn(where, options, this._confirmDeps())
    }

    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
     * but it will have options similar to TsPrompt dialog
     *
     * Example:
     *  - TsUtils.prompt({
     *       box: '#custom',
     *       label: 'Enter Name',
     *       textarea: false,
     *       attrs: 'style="border: 1px solid red"'
     *    })
     *    .ok(event => console.log(event))
     */
    prompt(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined {
        return _promptFn(where, options, this._promptDeps())
    }

    /**
     * Normalizes yes, no buttons for confirmation dialog
     *
     * @param {*} options
     * @returns  options
     */
    normButtons(options: Record<string, unknown>, btn: Record<string, unknown>): Record<string, unknown> {
        return _normButtons(options, btn, {
            extend: _extend,
            lang: this.lang.bind(this),
            settings: this.settings
        })
    }

    /**
     * Shows small notification message at the bottom of the page, or containter that you specify
     * in options.where (could be element or a selector)
     *
     * TsUtils.notify('Document saved')
     * TsUtils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
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
        return _notify(text, options, { execTemplate: this.execTemplate.bind(this), tmpSlot: this.tmp })
    }

    getSize(el: unknown, type: string): number { return _getSize(el, type) }

    getStrDimentions(str: string, styles?: string, raw?: boolean) { return _getStrDimentions(str, styles, raw) }

    getStrWidth(str: string, styles?: string, raw?: boolean) { return this.getStrDimentions(str, styles, raw).width }

    getStrHeight(str: string, styles?: string, raw?: boolean) { return this.getStrDimentions(str, styles, raw).height }

    // any: targeted-any per typing_policy; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execTemplate(str: any, replace_obj: any): any { return _execTemplate(str, replace_obj) }

    // any: parameter typed any — runtime dispatch by call site; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    marker(el: any, items: any, options?: any): unknown { return _marker(el, items, options) }


    lang(phrase: string, params?: Record<string, string | number> | boolean): string {
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
                console.log(`Missing translation for "%c${phrase}%c", see %c TsUtils.settings.phrases %c with value "---"`,
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
                        // any: callback parameter — caller signature varies; TsUtils helper accepts heterogeneous runtime input
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

            // if locale is an object, then merge it with TsUtils.settings
            if (typeof locale === 'object') {
                this.settings = this.extend({}, this.settings, TsLocale, locale)
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
                            this.settings = this.extend({}, this.settings, TsLocale, { phrases: {} }, data)
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
        if (this.tmp['scrollBarSize']) return this.tmp['scrollBarSize']
        const html = `
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `
        query('body').append(html)
        this.tmp['scrollBarSize'] = 100 - (query('#_scrollbar_width > div')[0] as HTMLElement).clientWidth
        query('#_scrollbar_width').remove()
        return this.tmp['scrollBarSize']
    }

    checkName(name: string): boolean {
        return _checkName(name)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkUniqueId(id: any, items: any, desc: any, obj: any): boolean { // any: generic runtime utility; callers pass heterogeneous types
        if (!Array.isArray(items)) items = [items]
        let isUnique = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any) => { // any: item is an arbitrary menu/record object
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encodeParams(obj: any, prefix = ''): string { // any: arbitrary nested object from user code
        return _encodeParams(obj, prefix)
    }

    parseRoute(route: string): { path: RegExp; keys: { name: string; optional: boolean }[] } {
        return _parseRoute(route)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCursorPosition(input: any): number | null { // any: accepts HTMLInputElement, HTMLTextAreaElement, contenteditable div, etc.
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
                    el = input.childNodes[i] ?? null
                    if (el != null && el.childNodes && el.childNodes.length > 0) el = el.childNodes[0] ?? null
                    if (el != null && el.childNodes && el.childNodes.length > 0) el = el.childNodes[0] ?? null
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
            sel?.removeAllRanges()
            sel?.addRange(range)
        }
    }

    parseColor(str: string | null | undefined): TsColorRgb | null { return _parseColor(str) }

    colorContrast(color1: string, color2: string): string { return _colorContrast(color1, color2) }

    colorContrastValue(color1: string, color2: string): number { return _colorContrastValue(color1, color2) }

    // h=0..360, s=0..100, v=0..100
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hsv2rgb(h: any, s?: any, v?: any, a?: any): { r: number; g: number; b: number; a: number } { return (_hsv2rgb as any)(h, s, v, a) } // any: overloaded dual-form delegator

    // r=0..255, g=0..255, b=0..255
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rgb2hsv(r: any, g?: any, b?: any, a?: any): { h: number; s: number; v: number; a: number } { return (_rgb2hsv as any)(r, g, b, a) } // any: overloaded dual-form delegator

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
        const actions = ` on${showOn}="TsTooltip.show(this, `
                + `JSON.parse(TsUtils.base64decode('${this.base64encode(JSON.stringify(opts))}')))" `
                + `on${hideOn}="TsTooltip.hide('${opts['name']}')"`
        return actions
    }

    // determins if it is plain Object, not DOM element, nor a function, event, etc.
    isPlainObject(value: unknown): boolean { return _isPlainObject(value) }

    /**
     * Deep copy of an object or an array. Function, events and HTML elements will not be cloned,
     * you can choose to include them or not, by default they are included.
     * You can also exclude certain elements from final object if used with options: { exclude }
     */
    // any: return type any — caller narrows by code path; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clone(obj: unknown, options?: Partial<TsCloneOptions>): any { return _clone(obj, options) }

    /**
     * Deep extend an object, if an array, it overwrrites it, cloning objects in the process
     * target, source1, source2, ...
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extend(target: any, source: any, ...rest: unknown[]): any { return _extend(target, source, ...rest) } // any: generic deep-extend; arbitrary object shapes at runtime

    /*
     * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
     * @license    MIT License
     */
    naturalCompare(a: unknown, b: unknown): number {
        return _naturalCompare(a, b)
    }

    /**
     * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
     * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
     * to find out id and text fields.
     */
    normMenu(menu: unknown, options: TsNormMenuOptions = {}): TsMenuItem[] | undefined {
        return _normMenu(menu, options) as TsMenuItem[] | undefined
    }

    /**
     * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
     * dataType is in TsUtils. This method is used in grid, form and tooltip to prepare fetch parameters
     */
    prepareParams(url: URL, fetchOptions: Record<string, unknown>, options: Record<string, unknown> = {}): Record<string, unknown> {
        return _prepareParams(url, fetchOptions, options, TsUtils.settings.dataType)
    }

    bindEvents(selector: unknown, subject: Record<string, unknown>): void { return _bindEvents(selector, subject) }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounce(func: (...args: any[]) => void, wait = 250): (...args: any[]) => void { // any: debounce wraps arbitrary functions
        return _debounce(func, wait)
    }

    async wait(time = 0): Promise<void> {
        return _wait(time)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNested(obj: any, prop: any): unknown { // any: traverses arbitrary nested objects via dot-path string
        return _getNested(obj, prop)
    }
}
var TsUtils = new Utils() // eslint-disable-line -- needs to be functional/module scope variable
export { TsUi, TsUtils, query }
