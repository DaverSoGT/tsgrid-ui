/**
 * Part of TsUi 2.1 library
 *
 * String-helpers sub-module — extracted from TsUtils (Phase 5 of v2.1 SDD).
 * Pure functions only. No default export.
 *
 * N2 fix applied: all this.extend(...) → extend(...) (imported ref)
 *                 all recursive this.X(...) → X(...) (local function ref)
 */

import { extend } from './tsutils-data.js'

export function stripSpaces(html: unknown): unknown {
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
                const arr = extend([], html) as unknown[]
                arr.forEach((key, ind) => { arr[ind] = stripSpaces(key) })
                return arr
            } else {
                const obj = extend({}, html) as Record<string, unknown>
                Object.keys(obj).forEach(key => { obj[key] = stripSpaces(obj[key]) })
                return obj
            }
    }
    return html
}

export function stripTags(html: unknown): unknown {
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
                const arr = extend([], html) as unknown[]
                arr.forEach((key, ind) => { arr[ind] = stripTags(key) })
                return arr
            } else {
                const obj = extend({}, html) as Record<string, unknown>
                Object.keys(obj).forEach(key => { obj[key] = stripTags(obj[key]) })
                return obj
            }
    }
    return html
}

export function encodeTags(html: unknown): unknown {
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
                const arr = extend([], html) as unknown[]
                arr.forEach((key, ind) => { arr[ind] = encodeTags(key) })
                return arr
            } else {
                const obj = extend({}, html) as Record<string, unknown>
                Object.keys(obj).forEach(key => { obj[key] = encodeTags(obj[key]) })
                return obj
            }
    }
    return html
}

export function decodeTags(html: unknown): unknown {
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
                const arr = extend([], html) as unknown[]
                arr.forEach((key, ind) => { arr[ind] = decodeTags(key) })
                return arr
            } else {
                const obj = extend({}, html) as Record<string, unknown>
                Object.keys(obj).forEach(key => { obj[key] = decodeTags(obj[key]) })
                return obj
            }
    }
    return html
}

export function escapeId(id: unknown): string {
    // This logic is borrowed from jQuery
    if (id === '' || id == null) return ''
    const re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-￿\w-]/g
    return (id + '').replace(re, (ch, asCodePoint) => {
        if (asCodePoint) {
            if (ch === '\0') return '�'
            return ch.slice( 0, -1 ) + '\\' + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + ' '
        }
        return '\\' + ch
    })
}

export function unescapeId(id: string | null | undefined): string {
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

export function base64encode(str: string): string {
    // Fast Native support in Chrome since 2010
    const utf8Bytes = new TextEncoder().encode(str)
    let binaryString = ''
    for (const byte of utf8Bytes) {
        binaryString += String.fromCharCode(byte)
    }
    return btoa(binaryString)
}

export function base64decode(encodedStr: string): string {
    // Fast Native support in Chrome since 2010
    const binaryString = atob(encodedStr)
    const utf8Bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        utf8Bytes[i] = binaryString.charCodeAt(i)
    }
    return new TextDecoder().decode(utf8Bytes)
}

export async function sha256(str: string): Promise<string> {
    const utf8 = new TextEncoder().encode(str)
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')
    })
}

export function execTemplate(
    // any: str and replace_obj are dynamic template params; types vary by caller
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    str: any,
    // any: targeted-any per typing_policy; TsUtils helper accepts heterogeneous runtime input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replace_obj: any
// any: return type any — caller narrows by code path; TsUtils helper accepts heterogeneous runtime input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    if (typeof str !== 'string' || !replace_obj || typeof replace_obj !== 'object') {
        return str
    }
    // any: $2 is the matched key from template literal, replace_obj[$2] is dynamic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return str.replace(/\${([^}]+)?}/g, function(_$1: any, $2: any) { return replace_obj[$2]||$2 })
}
