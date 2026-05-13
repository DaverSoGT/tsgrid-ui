/**
 * TsUtils type-guard cluster — Phase 1 of v2.1 SDD
 *
 * Stateless pure functions extracted from src/tsutils.ts.
 * TsUtils delegates to these; do NOT import from tsbase.ts.
 * 4-space indent. Named exports only (no default export).
 */

import type { TsUISettings } from './tsutils.js'

export function isBin(val: unknown): boolean {
    const re = /^[0-1]+$/
    return re.test(String(val))
}

export function isInt(val: unknown): boolean {
    const re = /^[-+]?[0-9]+$/
    return re.test(String(val))
}

export function isFloat(val: unknown, settings: Pick<TsUISettings, 'groupSymbol' | 'decimalSymbol'>): boolean {
    if (typeof val === 'string') {
        val = val.replace(new RegExp(settings.groupSymbol, 'g'), '')
            .replace(settings.decimalSymbol, '.')
    }
    return (typeof val === 'number' || (typeof val === 'string' && val !== '')) && !isNaN(Number(val))
}

export function isMoney(val: unknown, settings: Pick<TsUISettings, 'groupSymbol' | 'decimalSymbol' | 'currencyPrefix' | 'currencySuffix'>): boolean {
    if (typeof val === 'object' || val === '') return false
    if (isFloat(val, settings)) return true
    const se = settings
    const re = new RegExp('^'+ (se.currencyPrefix ? '\\' + se.currencyPrefix + '?' : '') +
                        '[-+]?'+ (se.currencyPrefix ? '\\' + se.currencyPrefix + '?' : '') +
                        '[0-9]*[\\'+ se.decimalSymbol +']?[0-9]+'+ (se.currencySuffix ? '\\' + se.currencySuffix + '?' : '') +'$', 'i')
    if (typeof val === 'string') {
        val = val.replace(new RegExp(se.groupSymbol, 'g'), '')
    }
    return re.test(String(val))
}

export function isHex(val: unknown): boolean {
    const re = /^(0x)?[0-9a-fA-F]+$/
    return re.test(String(val))
}

export function isAlphaNumeric(val: unknown): boolean {
    const re = /^[a-zA-Z0-9_-]+$/
    return re.test(String(val))
}

export function isEmail(val: unknown): boolean {
    const email = /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/
    return email.test(String(val))
}

export function isIpAddress(val: unknown): boolean {
    const re = new RegExp('^' +
        '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}' +
        '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' +
        '$')
    return re.test(String(val))
}

export function isPlainObject(value: unknown): boolean {
    if (value == null) { // null or undefined
        return false
    }
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false
    }
    if ((value as Record<string, unknown>).constructor === undefined) {
        return true
    }
    const proto = Object.getPrototypeOf(value) as unknown
    return proto === null || proto === Object.prototype
}
