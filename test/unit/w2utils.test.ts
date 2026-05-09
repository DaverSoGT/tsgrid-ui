import { describe, expect, it, beforeEach } from 'vitest'
import { w2utils } from '../../src/tsutils.js'

// Snapshot of mutable settings — restore between tests so locale/grouping
// changes don't leak across cases.
const SETTINGS_SNAPSHOT = JSON.parse(JSON.stringify(w2utils.settings))
beforeEach(() => {
    Object.assign(w2utils.settings, SETTINGS_SNAPSHOT)
})

describe('w2utils.isInt', () => {
    it('accepts positive integers', () => {
        expect(w2utils.isInt(42)).toBe(true)
        expect(w2utils.isInt('123')).toBe(true)
    })
    it('accepts signed integers', () => {
        expect(w2utils.isInt('-7')).toBe(true)
        expect(w2utils.isInt('+0')).toBe(true)
    })
    it('rejects floats and non-numeric strings', () => {
        expect(w2utils.isInt(3.14)).toBe(false)
        expect(w2utils.isInt('3.14')).toBe(false)
        expect(w2utils.isInt('abc')).toBe(false)
        expect(w2utils.isInt('')).toBe(false)
    })
    it('rejects null/undefined/objects', () => {
        expect(w2utils.isInt(null)).toBe(false)
        expect(w2utils.isInt(undefined)).toBe(false)
        expect(w2utils.isInt({})).toBe(false)
    })
})

describe('w2utils.isFloat', () => {
    it('accepts integers and decimals', () => {
        expect(w2utils.isFloat(42)).toBe(true)
        expect(w2utils.isFloat(3.14)).toBe(true)
        expect(w2utils.isFloat('-2.5')).toBe(true)
    })
    it('respects locale decimal symbol', () => {
        w2utils.settings.decimalSymbol = ','
        expect(w2utils.isFloat('3,14')).toBe(true)
    })
    it('rejects empty strings and non-numeric values', () => {
        expect(w2utils.isFloat('')).toBe(false)
        expect(w2utils.isFloat('abc')).toBe(false)
        expect(w2utils.isFloat(null)).toBe(false)
    })
})

describe('w2utils.isMoney', () => {
    it('accepts plain numbers', () => {
        expect(w2utils.isMoney(100)).toBe(true)
        expect(w2utils.isMoney('99.99')).toBe(true)
    })
    it('accepts numbers with currency prefix when configured', () => {
        w2utils.settings.currencyPrefix = '$'
        expect(w2utils.isMoney('$100')).toBe(true)
    })
    it('rejects empty and objects', () => {
        expect(w2utils.isMoney('')).toBe(false)
        expect(w2utils.isMoney({})).toBe(false)
    })
})

describe('w2utils.isHex', () => {
    it('accepts hex digits with or without 0x prefix', () => {
        expect(w2utils.isHex('FF')).toBe(true)
        expect(w2utils.isHex('0xff')).toBe(true)
        expect(w2utils.isHex('a1b2c3')).toBe(true)
    })
    it('rejects non-hex chars', () => {
        expect(w2utils.isHex('GZ')).toBe(false)
        expect(w2utils.isHex('')).toBe(false)
    })
})

describe('w2utils.isAlphaNumeric', () => {
    it('accepts letters, digits, underscore, dash', () => {
        expect(w2utils.isAlphaNumeric('abc_123-XY')).toBe(true)
    })
    it('rejects whitespace and punctuation', () => {
        expect(w2utils.isAlphaNumeric('hello world')).toBe(false)
        expect(w2utils.isAlphaNumeric('a.b')).toBe(false)
        expect(w2utils.isAlphaNumeric('')).toBe(false)
    })
})

describe('w2utils.isEmail', () => {
    it('accepts standard email shapes', () => {
        expect(w2utils.isEmail('user@example.com')).toBe(true)
        expect(w2utils.isEmail('a.b+tag@sub.domain.io')).toBe(true)
    })
    it('accepts cyrillic domains (regex supports а-я)', () => {
        expect(w2utils.isEmail('user@почта.рф')).toBe(true)
    })
    it('rejects malformed addresses', () => {
        expect(w2utils.isEmail('plainstring')).toBe(false)
        expect(w2utils.isEmail('@nouser.com')).toBe(false)
        expect(w2utils.isEmail('no-at-sign.com')).toBe(false)
    })
})

describe('w2utils.isIpAddress', () => {
    it('accepts valid IPv4', () => {
        expect(w2utils.isIpAddress('127.0.0.1')).toBe(true)
        expect(w2utils.isIpAddress('255.255.255.255')).toBe(true)
    })
    it('rejects out-of-range octets', () => {
        expect(w2utils.isIpAddress('999.0.0.1')).toBe(false)
    })
    it('rejects non-IPv4 strings', () => {
        expect(w2utils.isIpAddress('not-an-ip')).toBe(false)
    })
})

describe('w2utils.isDate', () => {
    it('accepts ISO date string with default format', () => {
        expect(w2utils.isDate('1/15/2024', 'm/d/yyyy')).toBe(true)
    })
    it('rejects invalid date strings', () => {
        expect(w2utils.isDate('not a date')).toBe(false)
        expect(w2utils.isDate('')).toBe(false)
    })
    it('returns Date object when retDate=true and valid', () => {
        const result = w2utils.isDate('1/15/2024', 'm/d/yyyy', true)
        expect(result instanceof Date).toBe(true)
    })
})

describe('w2utils.isTime', () => {
    it('accepts HH:MM and HH:MM am/pm formats', () => {
        expect(w2utils.isTime('14:30')).toBe(true)
        expect(w2utils.isTime('2:30 pm')).toBe(true)
    })
    it('rejects invalid time strings', () => {
        expect(w2utils.isTime('25:00')).toBe(false)
        expect(w2utils.isTime('not a time')).toBe(false)
    })
})

describe('w2utils.isPlainObject', () => {
    it('accepts object literals', () => {
        expect(w2utils.isPlainObject({})).toBe(true)
        expect(w2utils.isPlainObject({ a: 1 })).toBe(true)
    })
    it('rejects arrays, null, primitives, class instances', () => {
        expect(w2utils.isPlainObject([])).toBe(false)
        expect(w2utils.isPlainObject(null)).toBe(false)
        expect(w2utils.isPlainObject(42)).toBe(false)
        expect(w2utils.isPlainObject(new Date())).toBe(false)
    })
})

describe('w2utils.formatSize', () => {
    it('returns bytes for 0', () => {
        expect(w2utils.formatSize(0)).toBe(0)
    })
    it('formats KB / MB / GB with one decimal', () => {
        expect(w2utils.formatSize(1024)).toBe('1.0 KB')
        expect(w2utils.formatSize(1024 * 1024)).toBe('1.0 MB')
        expect(w2utils.formatSize(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB')
    })
    it('returns empty for invalid input', () => {
        expect(w2utils.formatSize('not-a-size')).toBe('')
        expect(w2utils.formatSize('')).toBe('')
    })
})

describe('w2utils.formatNumber', () => {
    it('formats with default fraction', () => {
        expect(w2utils.formatNumber(1234.5)).toMatch(/1\D?234\.5/) // locale-dependent grouping
    })
    it('respects fixed fraction digits', () => {
        expect(w2utils.formatNumber(1.5, 2)).toBe('1.50')
    })
    it('handles useGrouping toggle', () => {
        const grouped = w2utils.formatNumber(1234567, 0, true)
        const flat = w2utils.formatNumber(1234567, 0, false)
        expect(grouped.length).toBeGreaterThan(flat.length)
    })
    it('returns empty string for null/undefined/object', () => {
        expect(w2utils.formatNumber(null)).toBe('')
        expect(w2utils.formatNumber(undefined)).toBe('')
        expect(w2utils.formatNumber({})).toBe('')
    })
})

describe('w2utils.escapeId', () => {
    it('escapes CSS-meta characters in IDs', () => {
        const out = w2utils.escapeId('user.name#42')
        expect(out).toContain('\\.')
        expect(out).toContain('\\#')
    })
    it('returns empty string for null/undefined', () => {
        expect(w2utils.escapeId(null)).toBe('')
        expect(w2utils.escapeId(undefined)).toBe('')
    })
})

describe('w2utils.stripTags', () => {
    it('removes simple HTML tags from string', () => {
        expect(w2utils.stripTags('<b>hello</b>')).toBe('hello')
        expect(w2utils.stripTags('<a href="x">link</a>')).toBe('link')
    })
    it('returns numbers unchanged', () => {
        expect(w2utils.stripTags(42)).toBe(42)
    })
    it('strips tags inside arrays recursively', () => {
        expect(w2utils.stripTags(['<b>a</b>', '<i>b</i>'])).toEqual(['a', 'b'])
    })
    it('strips tags inside object values recursively', () => {
        expect(w2utils.stripTags({ name: '<b>x</b>', tag: '<i>y</i>' }))
            .toEqual({ name: 'x', tag: 'y' })
    })
    it('passes through null/undefined', () => {
        expect(w2utils.stripTags(null)).toBe(null)
        expect(w2utils.stripTags(undefined)).toBe(undefined)
    })
})

describe('w2utils.encodeTags', () => {
    it('escapes < and > to entities in strings', () => {
        const out = w2utils.encodeTags('<b>hi</b>') as string
        expect(out).not.toContain('<')
        expect(out).toContain('&lt;')
    })
})

describe('w2utils.encodeParams', () => {
    it('serializes flat object as query string', () => {
        expect(w2utils.encodeParams({ a: 1, b: 'two' })).toBe('a=1&b=two')
    })
    it('handles nested objects with bracket notation', () => {
        const out = w2utils.encodeParams({ user: { id: 5 } })
        expect(out).toContain('user')
        expect(out).toContain('5')
    })
})

describe('w2utils.naturalCompare', () => {
    it('orders numeric suffixes naturally (file2 < file10)', () => {
        const arr = ['file10', 'file2', 'file1']
        arr.sort((a, b) => w2utils.naturalCompare(a, b))
        expect(arr).toEqual(['file1', 'file2', 'file10'])
    })
    it('returns 0 for equal strings', () => {
        expect(w2utils.naturalCompare('abc', 'abc')).toBe(0)
    })
})

describe('w2utils.parseRoute', () => {
    it('builds matching RegExp and key list for a parametric route', () => {
        const r = w2utils.parseRoute('/user/:id')
        expect(r.keys).toEqual([{ name: 'id', optional: false }])
        expect(r.path.test('/user/42')).toBe(true)
        expect(r.path.test('/user/')).toBe(false)
    })
    it('marks optional keys', () => {
        const r = w2utils.parseRoute('/user/:id?')
        const idKey = r.keys.find(k => k.name === 'id')
        expect(idKey?.optional).toBe(true)
    })
})

describe('w2utils.clone', () => {
    it('deep-clones objects so mutations don\'t leak to source', () => {
        const src = { a: 1, nested: { b: 2 } }
        const copy = w2utils.clone(src) as { a: number; nested: { b: number } }
        copy.nested.b = 99
        expect(src.nested.b).toBe(2)
    })
    it('clones arrays', () => {
        const src = [1, [2, 3]]
        const copy = w2utils.clone(src) as Array<number | number[]>
        ;(copy[1] as number[])[0] = 99
        expect((src[1] as number[])[0]).toBe(2)
    })
})

describe('w2utils.extend', () => {
    it('deep-merges source into target', () => {
        const target: Record<string, unknown> = { a: 1, nested: { x: 1 } }
        w2utils.extend(target, { b: 2, nested: { y: 2 } })
        expect(target).toEqual({ a: 1, b: 2, nested: { x: 1, y: 2 } })
    })
    it('overwrites scalar values', () => {
        const target: Record<string, unknown> = { a: 1 }
        w2utils.extend(target, { a: 99 })
        expect(target['a']).toBe(99)
    })
    it('handles multiple sources', () => {
        const target: Record<string, unknown> = {}
        w2utils.extend(target, { a: 1 }, { b: 2 }, { c: 3 })
        expect(target).toEqual({ a: 1, b: 2, c: 3 })
    })
})

describe('w2utils.prepareParams', () => {
    it('handles HTTP dataType GET by appending body keys to searchParams', () => {
        // HTTP path appends each body key directly. JSON path wraps body in
        // { request: ... } before serializing — covered separately below.
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'get', headers: {}, body: { q: 'hello' } }
        w2utils.prepareParams(url, fetchOptions, { dataType: 'HTTP' })
        expect(url.searchParams.get('q')).toBe('hello')
        expect(fetchOptions['body']).toBeUndefined()
    })

    it('handles JSON dataType GET by wrapping body under `request` searchParam', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'get', headers: {}, body: { q: 'hello' } }
        w2utils.prepareParams(url, fetchOptions, { dataType: 'JSON' })
        const request = url.searchParams.get('request')
        expect(request).not.toBeNull()
        expect(request).toContain('hello')
    })

    it('handles JSON dataType POST by setting Content-Type and stringifying body', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'post', headers: {}, body: { q: 'hello' } }
        w2utils.prepareParams(url, fetchOptions, { dataType: 'JSON' })
        expect((fetchOptions['headers'] as Record<string, string>)['Content-Type']).toBe('application/json')
        expect(typeof fetchOptions['body']).toBe('string')
        expect(fetchOptions['body']).toContain('hello')
    })

    it('handles RESTFULL dataType POST with JSON content type', () => {
        const url = new URL('https://example.com/api')
        const fetchOptions: Record<string, unknown> = { method: 'post', headers: {}, body: { q: 'x' } }
        w2utils.prepareParams(url, fetchOptions, { dataType: 'RESTFULL' })
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
        w2utils.prepareParams(url, fetchOptions, { dataType: customDataType })
        expect(called).toBe(true)
        expect(fetchOptions['__custom']).toBe(true)
    })
})
