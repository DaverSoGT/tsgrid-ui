/**
 * TsUtils date-time sub-module — Phase 5a stub scaffold of v2.5 SDD.
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
// Exported stubs — Phase 5a (bodies throw 'not implemented'; Phase 5b fills them)
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
    void _isInt // suppress unused import error in 5a; used in Phase 5b bodies
    void settings
    throw new Error('_isDate: not implemented in 5a')
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
    void retTime
    throw new Error('_isTime: not implemented in 5a')
}

/**
 * Check if val is a valid date-time string. Optionally return the Date object.
 * @param val - value to check
 * @param format - datetime format string (pipe-separated date|time); defaults to settings.datetimeFormat
 * @param retDate - if true, return the Date object
 * @param settings - TsUISettings reference (datetimeFormat, dateFormat, timeFormat)
 */
export function _isDateTime(
    val: unknown,
    format: string | null | undefined,
    retDate: boolean | undefined,
    settings: TsUISettings
): boolean | Date {
    void settings
    void format
    void retDate
    throw new Error('_isDateTime: not implemented in 5a')
}

/**
 * Return a human-readable age string for a date (e.g. '5 mins', '2 years').
 * Stateless — no settings dependency (OQ-6: all output strings are hardcoded English).
 * @param dateStr - date value (Date, number timestamp, or date string)
 */
export function _age(dateStr: unknown): string {
    void dateStr
    throw new Error('_age: not implemented in 5a')
}

/**
 * Return a human-readable duration string for a millisecond value (e.g. '45 secs', '2.3 hours').
 * Stateless — no settings dependency.
 * @param value - duration in milliseconds
 */
export function _interval(value: number): string {
    void value
    throw new Error('_interval: not implemented in 5a')
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
): string {
    void format
    void settings
    throw new Error('_formatDate: not implemented in 5a')
}

/**
 * Format a time value as a string using the given format and settings.
 * @param dateStr - time value (time string or full date string)
 * @param format - time format string (e.g. 'hh:mi pm'); defaults to settings.timeFormat
 * @param settings - TsUISettings reference (timeFormat)
 */
export function _formatTime(
    dateStr: unknown,
    format: string | null | undefined,
    settings: TsUISettings
): string {
    void format
    void settings
    throw new Error('_formatTime: not implemented in 5a')
}

/**
 * Format a date-time value as a combined date+time string.
 * @param dateStr - datetime value
 * @param format - pipe-separated date|time format; defaults to settings.dateFormat + settings.timeFormat
 * @param settings - TsUISettings reference (dateFormat, timeFormat)
 */
export function _formatDateTime(
    dateStr: unknown,
    format: string | null | undefined,
    settings: TsUISettings
): string {
    void format
    void settings
    throw new Error('_formatDateTime: not implemented in 5a')
}
