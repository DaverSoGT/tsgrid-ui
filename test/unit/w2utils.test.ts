import { describe, expect, it, beforeEach } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'

// Snapshot of mutable settings — restore between tests so locale/grouping
// changes don't leak across cases.
const SETTINGS_SNAPSHOT = JSON.parse(JSON.stringify(TsUtils.settings))
beforeEach(() => {
    Object.assign(TsUtils.settings, SETTINGS_SNAPSHOT)
})

describe('TsUtils.isInt', () => {
    it('accepts positive integers', () => {
        expect(TsUtils.isInt(42)).toBe(true)
        expect(TsUtils.isInt('123')).toBe(true)
    })
    it('accepts signed integers', () => {
        expect(TsUtils.isInt('-7')).toBe(true)
        expect(TsUtils.isInt('+0')).toBe(true)
    })
    it('rejects floats and non-numeric strings', () => {
        expect(TsUtils.isInt(3.14)).toBe(false)
        expect(TsUtils.isInt('3.14')).toBe(false)
        expect(TsUtils.isInt('abc')).toBe(false)
        expect(TsUtils.isInt('')).toBe(false)
    })
    it('rejects null/undefined/objects', () => {
        expect(TsUtils.isInt(null)).toBe(false)
        expect(TsUtils.isInt(undefined)).toBe(false)
        expect(TsUtils.isInt({})).toBe(false)
    })
})

describe('TsUtils.isFloat', () => {
    it('accepts integers and decimals', () => {
        expect(TsUtils.isFloat(42)).toBe(true)
        expect(TsUtils.isFloat(3.14)).toBe(true)
        expect(TsUtils.isFloat('-2.5')).toBe(true)
    })
    it('respects locale decimal symbol', () => {
        TsUtils.settings.decimalSymbol = ','
        expect(TsUtils.isFloat('3,14')).toBe(true)
    })
    it('rejects empty strings and non-numeric values', () => {
        expect(TsUtils.isFloat('')).toBe(false)
        expect(TsUtils.isFloat('abc')).toBe(false)
        expect(TsUtils.isFloat(null)).toBe(false)
    })
})

describe('TsUtils.isMoney', () => {
    it('accepts plain numbers', () => {
        expect(TsUtils.isMoney(100)).toBe(true)
        expect(TsUtils.isMoney('99.99')).toBe(true)
    })
    it('accepts numbers with currency prefix when configured', () => {
        TsUtils.settings.currencyPrefix = '$'
        expect(TsUtils.isMoney('$100')).toBe(true)
    })
    it('rejects empty and objects', () => {
        expect(TsUtils.isMoney('')).toBe(false)
        expect(TsUtils.isMoney({})).toBe(false)
    })
})

describe('TsUtils.isHex', () => {
    it('accepts hex digits with or without 0x prefix', () => {
        expect(TsUtils.isHex('FF')).toBe(true)
        expect(TsUtils.isHex('0xff')).toBe(true)
        expect(TsUtils.isHex('a1b2c3')).toBe(true)
    })
    it('rejects non-hex chars', () => {
        expect(TsUtils.isHex('GZ')).toBe(false)
        expect(TsUtils.isHex('')).toBe(false)
    })
})

describe('TsUtils.isAlphaNumeric', () => {
    it('accepts letters, digits, underscore, dash', () => {
        expect(TsUtils.isAlphaNumeric('abc_123-XY')).toBe(true)
    })
    it('rejects whitespace and punctuation', () => {
        expect(TsUtils.isAlphaNumeric('hello world')).toBe(false)
        expect(TsUtils.isAlphaNumeric('a.b')).toBe(false)
        expect(TsUtils.isAlphaNumeric('')).toBe(false)
    })
})

describe('TsUtils.isEmail', () => {
    it('accepts standard email shapes', () => {
        expect(TsUtils.isEmail('user@example.com')).toBe(true)
        expect(TsUtils.isEmail('a.b+tag@sub.domain.io')).toBe(true)
    })
    it('accepts cyrillic domains (regex supports а-я)', () => {
        expect(TsUtils.isEmail('user@почта.рф')).toBe(true)
    })
    it('rejects malformed addresses', () => {
        expect(TsUtils.isEmail('plainstring')).toBe(false)
        expect(TsUtils.isEmail('@nouser.com')).toBe(false)
        expect(TsUtils.isEmail('no-at-sign.com')).toBe(false)
    })
})

describe('TsUtils.isIpAddress', () => {
    it('accepts valid IPv4', () => {
        expect(TsUtils.isIpAddress('127.0.0.1')).toBe(true)
        expect(TsUtils.isIpAddress('255.255.255.255')).toBe(true)
    })
    it('rejects out-of-range octets', () => {
        expect(TsUtils.isIpAddress('999.0.0.1')).toBe(false)
    })
    it('rejects non-IPv4 strings', () => {
        expect(TsUtils.isIpAddress('not-an-ip')).toBe(false)
    })
})

describe('TsUtils.isDate', () => {
    it('accepts ISO date string with default format', () => {
        expect(TsUtils.isDate('1/15/2024', 'm/d/yyyy')).toBe(true)
    })
    it('rejects invalid date strings', () => {
        expect(TsUtils.isDate('not a date')).toBe(false)
        expect(TsUtils.isDate('')).toBe(false)
    })
    it('returns Date object when retDate=true and valid', () => {
        const result = TsUtils.isDate('1/15/2024', 'm/d/yyyy', true)
        expect(result instanceof Date).toBe(true)
    })
})

describe('TsUtils.isTime', () => {
    it('accepts HH:MM and HH:MM am/pm formats', () => {
        expect(TsUtils.isTime('14:30')).toBe(true)
        expect(TsUtils.isTime('2:30 pm')).toBe(true)
    })
    it('rejects invalid time strings', () => {
        expect(TsUtils.isTime('25:00')).toBe(false)
        expect(TsUtils.isTime('not a time')).toBe(false)
    })
})

describe('TsUtils.isPlainObject', () => {
    it('accepts object literals', () => {
        expect(TsUtils.isPlainObject({})).toBe(true)
        expect(TsUtils.isPlainObject({ a: 1 })).toBe(true)
    })
    it('rejects arrays, null, primitives, class instances', () => {
        expect(TsUtils.isPlainObject([])).toBe(false)
        expect(TsUtils.isPlainObject(null)).toBe(false)
        expect(TsUtils.isPlainObject(42)).toBe(false)
        expect(TsUtils.isPlainObject(new Date())).toBe(false)
    })
})

describe('TsUtils.formatSize', () => {
    it('returns bytes for 0', () => {
        expect(TsUtils.formatSize(0)).toBe(0)
    })
    it('formats KB / MB / GB with one decimal', () => {
        expect(TsUtils.formatSize(1024)).toBe('1.0 KB')
        expect(TsUtils.formatSize(1024 * 1024)).toBe('1.0 MB')
        expect(TsUtils.formatSize(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB')
    })
    it('returns empty for invalid input', () => {
        expect(TsUtils.formatSize('not-a-size')).toBe('')
        expect(TsUtils.formatSize('')).toBe('')
    })
})

describe('TsUtils.formatNumber', () => {
    it('formats with default fraction', () => {
        expect(TsUtils.formatNumber(1234.5)).toMatch(/1\D?234\.5/) // locale-dependent grouping
    })
    it('respects fixed fraction digits', () => {
        expect(TsUtils.formatNumber(1.5, 2)).toBe('1.50')
    })
    it('handles useGrouping toggle', () => {
        const grouped = TsUtils.formatNumber(1234567, 0, true)
        const flat = TsUtils.formatNumber(1234567, 0, false)
        expect(grouped.length).toBeGreaterThan(flat.length)
    })
    it('returns empty string for null/undefined/object', () => {
        expect(TsUtils.formatNumber(null)).toBe('')
        expect(TsUtils.formatNumber(undefined)).toBe('')
        expect(TsUtils.formatNumber({})).toBe('')
    })
})

describe('TsUtils.escapeId', () => {
    it('escapes CSS-meta characters in IDs', () => {
        const out = TsUtils.escapeId('user.name#42')
        expect(out).toContain('\\.')
        expect(out).toContain('\\#')
    })
    it('returns empty string for null/undefined', () => {
        expect(TsUtils.escapeId(null)).toBe('')
        expect(TsUtils.escapeId(undefined)).toBe('')
    })
})

describe('TsUtils.stripTags', () => {
    it('removes simple HTML tags from string', () => {
        expect(TsUtils.stripTags('<b>hello</b>')).toBe('hello')
        expect(TsUtils.stripTags('<a href="x">link</a>')).toBe('link')
    })
    it('returns numbers unchanged', () => {
        expect(TsUtils.stripTags(42)).toBe(42)
    })
    it('strips tags inside arrays recursively', () => {
        expect(TsUtils.stripTags(['<b>a</b>', '<i>b</i>'])).toEqual(['a', 'b'])
    })
    it('strips tags inside object values recursively', () => {
        expect(TsUtils.stripTags({ name: '<b>x</b>', tag: '<i>y</i>' }))
            .toEqual({ name: 'x', tag: 'y' })
    })
    it('passes through null/undefined', () => {
        expect(TsUtils.stripTags(null)).toBe(null)
        expect(TsUtils.stripTags(undefined)).toBe(undefined)
    })
})

describe('TsUtils.encodeTags', () => {
    it('escapes < and > to entities in strings', () => {
        const out = TsUtils.encodeTags('<b>hi</b>') as string
        expect(out).not.toContain('<')
        expect(out).toContain('&lt;')
    })
})

describe('TsUtils.encodeParams', () => {
    it('serializes flat object as query string', () => {
        expect(TsUtils.encodeParams({ a: 1, b: 'two' })).toBe('a=1&b=two')
    })
    it('handles nested objects with bracket notation', () => {
        const out = TsUtils.encodeParams({ user: { id: 5 } })
        expect(out).toContain('user')
        expect(out).toContain('5')
    })
})

describe('TsUtils.naturalCompare', () => {
    it('orders numeric suffixes naturally (file2 < file10)', () => {
        const arr = ['file10', 'file2', 'file1']
        arr.sort((a, b) => TsUtils.naturalCompare(a, b))
        expect(arr).toEqual(['file1', 'file2', 'file10'])
    })
    it('returns 0 for equal strings', () => {
        expect(TsUtils.naturalCompare('abc', 'abc')).toBe(0)
    })
})

describe('TsUtils.parseRoute', () => {
    it('builds matching RegExp and key list for a parametric route', () => {
        const r = TsUtils.parseRoute('/user/:id')
        expect(r.keys).toEqual([{ name: 'id', optional: false }])
        expect(r.path.test('/user/42')).toBe(true)
        expect(r.path.test('/user/')).toBe(false)
    })
    it('marks optional keys', () => {
        const r = TsUtils.parseRoute('/user/:id?')
        const idKey = r.keys.find(k => k.name === 'id')
        expect(idKey?.optional).toBe(true)
    })
})

describe('TsUtils.clone', () => {
    it('deep-clones objects so mutations don\'t leak to source', () => {
        const src = { a: 1, nested: { b: 2 } }
        const copy = TsUtils.clone(src) as { a: number; nested: { b: number } }
        copy.nested.b = 99
        expect(src.nested.b).toBe(2)
    })
    it('clones arrays', () => {
        const src = [1, [2, 3]]
        const copy = TsUtils.clone(src) as Array<number | number[]>
        ;(copy[1] as number[])[0] = 99
        expect((src[1] as number[])[0]).toBe(2)
    })
})

describe('TsUtils.extend', () => {
    it('deep-merges source into target', () => {
        const target: Record<string, unknown> = { a: 1, nested: { x: 1 } }
        TsUtils.extend(target, { b: 2, nested: { y: 2 } })
        expect(target).toEqual({ a: 1, b: 2, nested: { x: 1, y: 2 } })
    })
    it('overwrites scalar values', () => {
        const target: Record<string, unknown> = { a: 1 }
        TsUtils.extend(target, { a: 99 })
        expect(target['a']).toBe(99)
    })
    it('handles multiple sources', () => {
        const target: Record<string, unknown> = {}
        TsUtils.extend(target, { a: 1 }, { b: 2 }, { c: 3 })
        expect(target).toEqual({ a: 1, b: 2, c: 3 })
    })
})

describe('TsUtils.prepareParams', () => {
    it('handles HTTP dataType GET by appending body keys to searchParams', () => {
        // HTTP path appends each body key directly. JSON path wraps body in
        // { request: ... } before serializing — covered separately below.
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'get', headers: {}, body: { q: 'hello' } }
        TsUtils.prepareParams(url, fetchOptions, { dataType: 'HTTP' })
        expect(url.searchParams.get('q')).toBe('hello')
        expect(fetchOptions['body']).toBeUndefined()
    })

    it('handles JSON dataType GET by wrapping body under `request` searchParam', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'get', headers: {}, body: { q: 'hello' } }
        TsUtils.prepareParams(url, fetchOptions, { dataType: 'JSON' })
        const request = url.searchParams.get('request')
        expect(request).not.toBeNull()
        expect(request).toContain('hello')
    })

    it('handles JSON dataType POST by setting Content-Type and stringifying body', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'post', headers: {}, body: { q: 'hello' } }
        TsUtils.prepareParams(url, fetchOptions, { dataType: 'JSON' })
        expect((fetchOptions['headers'] as Record<string, string>)['Content-Type']).toBe('application/json')
        expect(typeof fetchOptions['body']).toBe('string')
        expect(fetchOptions['body']).toContain('hello')
    })

    it('handles RESTFULL dataType POST with JSON content type', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'post', headers: {}, body: { q: 'x' } }
        TsUtils.prepareParams(url, fetchOptions, { dataType: 'RESTFULL' })
        expect((fetchOptions['headers'] as Record<string, string>)['Content-Type']).toBe('application/json')
    })

    // Regression: T2c.2 typo fix — typeof dataType == 'fuction' → 'function'.
    // Without this fix, custom function dataType silently fell through to the
    // ERROR console.log instead of running the user's handler.
    it('regression — function dataType is invoked, not ignored (T2c.2 typo fix)', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'get', headers: {}, body: {} }
        let called = false
        const customDataType = (u: URL, f: Record<string, unknown>, o: Record<string, unknown>) => {
            called = true
            f['__custom'] = true
            return f
        }
        TsUtils.prepareParams(url, fetchOptions, { dataType: customDataType })
        expect(called).toBe(true)
        expect(fetchOptions['__custom']).toBe(true)
    })
})
