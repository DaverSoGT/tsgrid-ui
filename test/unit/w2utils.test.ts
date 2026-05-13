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

// ─── Phase 0: Color cluster unit tests (safety net before Phase 2 extraction) ───

describe('TsUtils.parseColor', () => {
    it('T-C1: parses 6-char hex #ff8000 into r=255 g=128 b=0 a=1', () => {
        const c = TsUtils.parseColor('#ff8000')
        expect(c).not.toBeNull()
        expect(c!.r).toBe(255)
        expect(c!.g).toBe(128)
        expect(c!.b).toBe(0)
        expect(c!.a).toBe(1)
    })
    it('T-C10: parses #000000 into r=0 g=0 b=0 a=1', () => {
        const c = TsUtils.parseColor('#000000')
        expect(c).not.toBeNull()
        expect(c!.r).toBe(0)
        expect(c!.g).toBe(0)
        expect(c!.b).toBe(0)
        expect(c!.a).toBe(1)
    })
    it('T-C2: invalid input returns null without throwing', () => {
        expect(TsUtils.parseColor('not-a-color')).toBeNull()
        expect(TsUtils.parseColor('')).toBeNull()
        expect(TsUtils.parseColor(null)).toBeNull()
    })
    it('supports 3-char hex #FFF → r=255 g=255 b=255 a=1', () => {
        const c = TsUtils.parseColor('#FFF')
        expect(c).not.toBeNull()
        expect(c!.r).toBe(255)
        expect(c!.g).toBe(255)
        expect(c!.b).toBe(255)
        expect(c!.a).toBe(1)
    })
    it('supports RGB(10, 20, 30) form', () => {
        const c = TsUtils.parseColor('RGB(10, 20, 30)')
        expect(c).not.toBeNull()
        expect(c!.r).toBe(10)
        expect(c!.g).toBe(20)
        expect(c!.b).toBe(30)
        expect(c!.a).toBe(1)
    })
    it('supports RGBA(10, 20, 30, 0.5) form', () => {
        const c = TsUtils.parseColor('RGBA(10, 20, 30, 0.5)')
        expect(c).not.toBeNull()
        expect(c!.r).toBe(10)
        expect(c!.g).toBe(20)
        expect(c!.b).toBe(30)
        expect(c!.a).toBe(0.5)
    })
})

describe('TsUtils.hsv2rgb', () => {
    // NOTE: implementation uses h=0..360, s=0..100, v=0..100 (not 0..1)
    it('T-C3: hsv2rgb(0, 100, 100) → pure red {r:255, g:0, b:0, a:1}', () => {
        const c = TsUtils.hsv2rgb(0, 100, 100)
        expect(c.r).toBe(255)
        expect(c.g).toBe(0)
        expect(c.b).toBe(0)
        expect(c.a).toBe(1)
    })
    it('boundary: hsv2rgb(0, 0, 0) → black {r:0, g:0, b:0}', () => {
        const c = TsUtils.hsv2rgb(0, 0, 0)
        expect(c.r).toBe(0)
        expect(c.g).toBe(0)
        expect(c.b).toBe(0)
    })
    it('boundary: hsv2rgb(0, 0, 100) → white {r:255, g:255, b:255}', () => {
        const c = TsUtils.hsv2rgb(0, 0, 100)
        expect(c.r).toBe(255)
        expect(c.g).toBe(255)
        expect(c.b).toBe(255)
    })
})

describe('TsUtils.rgb2hsv', () => {
    // NOTE: implementation returns h=0..360, s=0..100, v=0..100 (not 0..1)
    it('T-C4: rgb2hsv(255, 0, 0) → pure red {h:0, s:100, v:100}', () => {
        const c = TsUtils.rgb2hsv(255, 0, 0)
        expect(c.h).toBe(0)
        expect(c.s).toBe(100)
        expect(c.v).toBe(100)
    })
    it('T-C6: rgb2hsv(0, 0, 0) → black {h:0, s:0, v:0}', () => {
        const c = TsUtils.rgb2hsv(0, 0, 0)
        expect(c.h).toBe(0)
        expect(c.s).toBe(0)
        expect(c.v).toBe(0)
    })
    it('T-C7: rgb2hsv(255, 255, 255) → white {h:0, s:0, v:100}', () => {
        const c = TsUtils.rgb2hsv(255, 255, 255)
        expect(c.h).toBe(0)
        expect(c.s).toBe(0)
        expect(c.v).toBe(100)
    })
    it('T-C5: round-trip hsv2rgb → rgb2hsv within tolerance (±1 hue, ±1 s/v)', () => {
        const hIn = 120, sIn = 75, vIn = 90
        const rgb = TsUtils.hsv2rgb(hIn, sIn, vIn)
        const hsv = TsUtils.rgb2hsv(rgb.r, rgb.g, rgb.b)
        expect(Math.abs(hsv.h - hIn)).toBeLessThanOrEqual(1)
        expect(Math.abs(hsv.s - sIn)).toBeLessThanOrEqual(1)
        expect(Math.abs(hsv.v - vIn)).toBeLessThanOrEqual(1)
    })
})

describe('TsUtils.colorContrast', () => {
    // NOTE: implementation returns a string (ratio.toFixed(2)), not a number
    it('T-C8: colorContrast white vs black → string value >= "21.00" (max WCAG)', () => {
        const ratio = TsUtils.colorContrast('#ffffff', '#000000')
        expect(parseFloat(ratio)).toBeGreaterThanOrEqual(21)
    })
    it('T-C9: colorContrast identical colors → "1.00" (no contrast)', () => {
        const ratio = TsUtils.colorContrast('#000000', '#000000')
        expect(parseFloat(ratio)).toBe(1)
    })
})

describe('TsUtils.isBin', () => {
    it('returns true for binary strings', () => {
        expect(TsUtils.isBin('1010')).toBe(true)
    })
    it('returns false for non-binary strings', () => {
        expect(TsUtils.isBin('102')).toBe(false)
    })
})
