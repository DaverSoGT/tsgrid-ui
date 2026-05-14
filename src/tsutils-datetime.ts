/**
 * TsUtils date-time sub-module — Phase 5b of v2.5 SDD.
 * DAG position: leaf module (no tsbase/tsutils imports).
 *
 * Imports:
 *   ./tsutils-type-guards.js — isInt as _isInt (needed by isDate, isTime, formatDate, formatTime)
 *   ./tsutils.js             — type-only import type { TsUISettings } (TS erases at emit)
 *                              Precedent: tsutils-type-guards.ts:9, tsutils-message.ts:26
 *
 * INV-4: MUST NOT import from tsbase.ts or tsutils.ts at runtime.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 *
 * 4-space indent convention.
 *
 * OQ-2 (TsTimeResult): local non-exported interface `TsTimeResult` defined inline
 *   here (structurally identical to tsutils.ts copy). Avoids back-import of a
 *   non-exported type; the class delegator in tsutils.ts casts via `as boolean | TsTimeResult`.
 *
 * R-DT-3 (settings reference): `settings` is passed as a reference to `this.settings`
 *   from delegators — never cloned. TsLocale mutations to fullmonths/shortmonths/dateFormat
 *   etc. flow through without restart.
 *
 * R-DT-2 / R-DT-8 (intra-cluster calls): _isDateTime calls _isDate + _isTime directly
 *   as module-level function refs. _formatDateTime calls _formatDate + _formatTime directly.
 *   _formatTime calls _isTime directly. Zero this.X inside any extracted body.
 */

import type { TsUISettings } from './tsutils.js'
import { isInt as _isInt } from './tsutils-type-guards.js'

// ---------------------------------------------------------------------------
// Local types (non-exported — structurally identical to tsutils.ts TsTimeResult)
// ---------------------------------------------------------------------------

/** Return value from _isTime() when retTime === true (OQ-2: inline literal, not re-imported) */
interface TsTimeResult {
    hours: number
    minutes: number
    seconds: number
}

// ---------------------------------------------------------------------------
// Locale-injection interface — v2.6 DateDeps pattern (mirrors MessageDeps/NotifyDeps)
// ---------------------------------------------------------------------------

/**
 * Locale dependencies injected into _date() by the TsUtils.date() delegator.
 * Follows the v2.3 MessageDeps / NotifyDeps single-field deps-injection pattern.
 * A-1: exported so callers can type their own deps objects.
 * A-2: only `lang` field — no other locale surface in v2.6.
 */
export interface DateDeps {
    lang: (phrase: string) => string
}

// ---------------------------------------------------------------------------
// Exported functions — Phase 5b (real bodies)
// ---------------------------------------------------------------------------

/**
 * Check if val is a valid date. Optionally return the Date object.
 * @param val - value to check
 * @param format - date format string (e.g. 'mm/dd/yyyy'); defaults to settings.dateFormat
 * @param retDate - if true, return the Date object instead of boolean
 * @param settings - TsUISettings reference (TsLocale fields: fullmonths, dateFormat)
 */
export function _isDate(
    val: unknown,
    format: string | null | undefined,
    retDate: boolean | undefined,
    settings: TsUISettings
): boolean | Date {
    if (!val) return false

    let dt: Date | string = 'Invalid Date'
    let month: number | string | undefined, day: number | string | undefined, year: number | string | undefined

    if (format == null) format = settings.dateFormat

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
            for (let m = 0, len = settings.fullmonths.length; m < len; m++) {
                const t = settings.fullmonths[m] ?? ''
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
    if (!_isInt(year)) return false
    if (!_isInt(month)) return false
    if (!_isInt(day)) return false
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

/**
 * Check if val is a valid time string. Optionally return { hours, minutes, seconds }.
 * @param val - value to check (e.g. '14:30', '2:30 pm')
 * @param retTime - if true, return the TsTimeResult object
 */
export function _isTime(
    val: unknown,
    retTime?: boolean
): boolean | TsTimeResult {
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
    if (tmp0 === '' || h < 0 || h > max || !_isInt(tmp0) || tmp0.length > 2) { return false }
    if (tmp.length > 1 && (tmp1 === '' || m < 0 || m > 59 || !_isInt(tmp1) || tmp1.length !== 2)) { return false }
    if (tmp.length > 2 && (tmp2 === '' || s < 0 || s > 59 || !_isInt(tmp2) || tmp2.length !== 2)) { return false }
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

/**
 * Check if val is a valid date-time string. Optionally return the Date object.
 * @param val - value to check
 * @param format - datetime format string (pipe-separated date|time); defaults to settings.datetimeFormat
 * @param retDate - if true, return the Date object
 * @param settings - TsUISettings reference (datetimeFormat, dateFormat, timeFormat)
 *
 * R-DT-11: settings is threaded through the full function body even though it is only
 *   consumed in the `tmp >= 0` branch (split-datetime path). Required for _isDate call.
 */
export function _isDateTime(
    val: unknown,
    format: string | null | undefined,
    retDate: boolean | undefined,
    settings: TsUISettings
): boolean | Date {
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
        if (format == null) format = settings.datetimeFormat
        const formats = format.split('|')
        const values  = [strVal.substr(0, tmp), strVal.substr(tmp).trim()]
        if (formats[0] != null) formats[0] = formats[0].trim()
        if (formats[1]) formats[1] = formats[1].trim()
        // check — R-DT-2: intra-cluster calls use module-level function refs (no this.X)
        const tmp1 = _isDate(values[0], formats[0], true, settings)
        const tmp2 = _isTime(values[1], true)
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

/**
 * Return a human-readable age string for a date (e.g. '5 mins', '2 years').
 * Stateless — no settings dependency (OQ-6: all output strings are hardcoded English).
 * @param dateStr - date value (Date, number timestamp, or date string)
 */
export function _age(dateStr: unknown): string {
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

/**
 * Return a human-readable duration string for a millisecond value (e.g. '45 secs', '2.3 hours').
 * Stateless — no settings dependency.
 * @param value - duration in milliseconds
 */
export function _interval(value: number): string {
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

/**
 * Format a date value as a string using the given format and settings.
 * @param dateStr - date value (Date, number timestamp, or date string)
 * @param format - date format string; defaults to settings.dateFormat
 * @param settings - TsUISettings reference (dateFormat, fullmonths, shortmonths)
 */
export function _formatDate(
    dateStr: unknown,
    format: string | null | undefined,
    settings: TsUISettings
): string { // IMPORTANT dateStr HAS TO BE valid JavaScript Date String
    if (!format) format = settings.dateFormat
    if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''

    let dt = new Date(dateStr as string | number)
    if (_isInt(dateStr)) dt = new Date(Number(dateStr)) // for unix timestamps
    if (String(dt) === 'Invalid Date') return ''

    const year  = dt.getFullYear()
    const month = dt.getMonth()
    const date  = dt.getDate()
    return format.toLowerCase()
        .replace('month', settings.fullmonths[month] ?? '')
        .replace('mon', settings.shortmonths[month] ?? '')
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

/**
 * Format a time value as a string using the given format and settings.
 * @param dateStr - time value (time string or full date string)
 * @param format - time format string (e.g. 'hh:mi pm'); defaults to settings.timeFormat
 * @param settings - TsUISettings reference (timeFormat)
 *
 * R-DT-8: intra-cluster calls to _isTime use module-level function refs (no this.X).
 */
export function _formatTime(
    dateStr: unknown,
    format: string | null | undefined,
    settings: TsUISettings
): string { // IMPORTANT dateStr HAS TO BE valid JavaScript Date String
    if (!format) format = settings.timeFormat
    if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''

    let dt = new Date(dateStr as string | number)
    if (_isInt(dateStr)) dt = new Date(Number(dateStr)) // for unix timestamps
    // R-DT-8: both isTime calls become intra-module refs
    if (_isTime(dateStr)) {
        const tmp = _isTime(dateStr, true) as TsTimeResult
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

/**
 * Format a date-time value as a combined date+time string.
 * @param dateStr - datetime value
 * @param format - pipe-separated date|time format; defaults to settings.dateFormat + settings.timeFormat
 * @param settings - TsUISettings reference (dateFormat, timeFormat)
 *
 * R-DT-2: intra-cluster calls _formatDate + _formatTime use module-level function refs.
 */
export function _formatDateTime(
    dateStr: unknown,
    format: string | null | undefined,
    settings: TsUISettings
): string {
    let fmt: string[]
    if (dateStr === '' || dateStr == null || (typeof dateStr === 'object' && !(dateStr as Date).getMonth)) return ''
    if (typeof format !== 'string') {
        fmt = [settings.dateFormat, settings.timeFormat]
    } else {
        fmt    = format.split('|')
        if (fmt[0] != null) fmt[0] = fmt[0].trim()
        fmt[1] = (fmt.length > 1 ? (fmt[1] ?? '').trim() : settings.timeFormat)
    }
    // older formats support
    if (fmt[1] === 'h12') fmt[1] = 'h:m pm'
    if (fmt[1] === 'h24') fmt[1] = 'h24:m'
    // R-DT-2: both intra-cluster calls become module-level function refs
    return _formatDate(dateStr, fmt[0], settings) + ' ' + _formatTime(dateStr, fmt[1], settings)
}

/**
 * Return an HTML `<span>` string representing a date value relative to today.
 * Today's date returns a time-of-day string; yesterday returns the locale phrase;
 * older dates return the formatted month-day-year string.
 *
 * @param dateStr - date value (string, number timestamp, null, or undefined)
 * @param settings - TsUISettings reference (shortmonths, passed by reference — R-DT-3)
 * @param deps - DateDeps locale callbacks (lang for 'Yesterday' lookup — INV-DATE-LOCALE)
 *
 * Phase 5a stub — body filled at Phase 5b.
 * B-1: exact parameter order: dateStr, settings, deps.
 */
export function _date(
    _dateStr: unknown,
    _settings: TsUISettings,
    _deps: DateDeps
): string {
    throw new Error('_date not implemented — Phase 5a stub')
}
