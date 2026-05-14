/**
 * Test suite for TsUtils date-time cluster — Phase 4 (TDD safety-net) of v2.5 SDD.
 *
 * Phase 4 framing:
 *   Tests are written against the CURRENT TsUtils inline implementations and are GREEN
 *   throughout Phase 4. They serve as safety nets: if Phase 5b extraction breaks any
 *   behavior, a test catches it. This is the strict-TDD interpretation for extraction
 *   refactors (same pattern used in v2.4 DOM / v2.3 message clusters).
 *
 * Infrastructure:
 *   - jsdom environment (vitest.config.ts: testEnvironment: 'jsdom')
 *   - SETTINGS_SNAPSHOT / beforeEach restore pattern (prevents locale-mutation leaks)
 *
 * INV-BAILOUT checkpoint:
 *   All 8 methods (isDate, isTime, isDateTime, age, interval, formatDate, formatTime,
 *   formatDateTime) are pure logic with zero DOM dependencies. 100% jsdom-viable.
 *   No playwright-only paths in this cluster.
 *
 * INV-TDD: These tests are committed before Phase 5b extraction bodies land,
 *   satisfying the pre-commit test requirement.
 *
 * OQ-5 note: The delegation spy test (T-4.10) asserts OBSERVABLE behavior from
 *   the public TsUtils.isDateTime() call, not internal routing. After P5b,
 *   intra-cluster calls become module-local (_isDate, _isTime), so the spy on
 *   TsUtils.isDate will NOT fire for internal calls — this is expected and
 *   consistent with the v2.4 grid-data test pattern.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'

// Snapshot of mutable settings — restore between tests so locale/grouping
// changes don't leak across cases. Pattern from w2utils.test.ts lines 6-9.
const SETTINGS_SNAPSHOT = JSON.parse(JSON.stringify(TsUtils.settings))
beforeEach(() => {
    Object.assign(TsUtils.settings, SETTINGS_SNAPSHOT)
    // Deep-restore arrays (JSON.parse doesn't deep-clone nested refs on TsUtils.settings directly)
    TsUtils.settings.fullmonths = [...(SETTINGS_SNAPSHOT.fullmonths as string[])]
    TsUtils.settings.shortmonths = [...(SETTINGS_SNAPSHOT.shortmonths as string[])]
})

// ---------------------------------------------------------------------------
// isDate
// ---------------------------------------------------------------------------

describe('TsUtils.isDate', () => {
    it('accepts date in default m/d/yyyy format', () => {
        // Default dateFormat is 'm/d/yyyy' per tslocale.ts
        expect(TsUtils.isDate('5/13/2026')).toBe(true)
    })

    it('accepts ISO date with explicit yyyy/mm/dd format', () => {
        expect(TsUtils.isDate('2026/05/13', 'yyyy/mm/dd')).toBe(true)
    })

    it('returns Date object when retDate=true', () => {
        const result = TsUtils.isDate('5/13/2026', null, true)
        expect(result).toBeInstanceOf(Date)
        const dt = result as Date
        expect(dt.getFullYear()).toBe(2026)
        expect(dt.getMonth()).toBe(4)  // 0-indexed May
        expect(dt.getDate()).toBe(13)
    })

    it('accepts mm/dd/yyyy format', () => {
        expect(TsUtils.isDate('05/13/2026', 'mm/dd/yyyy')).toBe(true)
    })

    it('accepts dd/mm/yyyy format', () => {
        expect(TsUtils.isDate('13/05/2026', 'dd/mm/yyyy')).toBe(true)
    })

    it('accepts fullmonths locale string (English default)', () => {
        // default fullmonths includes 'May' at index 4
        expect(TsUtils.isDate('May 13, 2026', 'month dd, yyyy')).toBe(true)
    })

    it('accepts fullmonths locale string (Spanish settings mutation)', () => {
        const spanish = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
        TsUtils.settings.fullmonths = spanish
        expect(TsUtils.isDate('Mayo 13, 2026', 'month dd, yyyy')).toBe(true)
    })

    it('rejects non-leap Feb 29 (2026 is not a leap year)', () => {
        // Use explicit format so parsing is unambiguous
        expect(TsUtils.isDate('02/29/2026', 'mm/dd/yyyy')).toBe(false)
    })

    it('accepts leap Feb 29 (2024 is a leap year)', () => {
        expect(TsUtils.isDate('02/29/2024', 'mm/dd/yyyy')).toBe(true)
    })

    it('rejects null', () => {
        expect(TsUtils.isDate(null)).toBe(false)
    })

    it('rejects undefined', () => {
        expect(TsUtils.isDate(undefined)).toBe(false)
    })

    it('rejects empty string', () => {
        expect(TsUtils.isDate('')).toBe(false)
    })

    it('accepts Date object and returns it when retDate=true', () => {
        const d = new Date(2026, 4, 13)
        const result = TsUtils.isDate(d, null, true)
        expect(result).toBeInstanceOf(Date)
        const dt = result as Date
        expect(dt.getFullYear()).toBe(2026)
    })

    it('accepts numeric timestamp string', () => {
        const ts = String(new Date(2026, 4, 13).getTime())
        expect(TsUtils.isDate(ts)).toBe(true)
    })
})

// ---------------------------------------------------------------------------
// isTime
// ---------------------------------------------------------------------------

describe('TsUtils.isTime', () => {
    it('accepts 24h time HH:MM', () => {
        expect(TsUtils.isTime('14:30')).toBe(true)
    })

    it('returns time object when retTime=true (HH:MM)', () => {
        const result = TsUtils.isTime('14:30', true)
        expect(result).toEqual({ hours: 14, minutes: 30, seconds: 0 })
    })

    it('returns full object when retTime=true (HH:MM:SS)', () => {
        const result = TsUtils.isTime('14:30:45', true)
        expect(result).toEqual({ hours: 14, minutes: 30, seconds: 45 })
    })

    it('accepts 12h AM/PM format', () => {
        expect(TsUtils.isTime('2:30 pm')).toBe(true)
    })

    it('rejects invalid time 99:99', () => {
        expect(TsUtils.isTime('99:99')).toBe(false)
    })

    it('rejects null', () => {
        expect(TsUtils.isTime(null)).toBe(false)
    })

    it('rejects undefined', () => {
        expect(TsUtils.isTime(undefined)).toBe(false)
    })

    it('accepts midnight 00:00', () => {
        expect(TsUtils.isTime('00:00')).toBe(true)
    })
})

// ---------------------------------------------------------------------------
// isDateTime
// ---------------------------------------------------------------------------

describe('TsUtils.isDateTime', () => {
    it('accepts datetime with explicit format matching default (m/d/yyyy|hh:mi pm)', () => {
        // Use a datetime that matches 'm/d/yyyy|hh:mi pm'
        expect(TsUtils.isDateTime('5/13/2026 2:30 pm', 'm/d/yyyy|hh:mi pm')).toBe(true)
    })

    it('accepts datetime with explicit yyyy/mm/dd|h24:mi format', () => {
        expect(TsUtils.isDateTime('2026/05/13 14:30', 'yyyy/mm/dd|h24:mi')).toBe(true)
    })

    it('returns Date when retDate=true', () => {
        const result = TsUtils.isDateTime('5/13/2026 2:30 pm', 'm/d/yyyy|hh:mi pm', true)
        expect(result).toBeInstanceOf(Date)
    })

    it('rejects string with valid date but invalid time part', () => {
        expect(TsUtils.isDateTime('5/13/2026 99:99', 'm/d/yyyy|hh:mi pm')).toBe(false)
    })

    it('rejects null', () => {
        expect(TsUtils.isDateTime(null)).toBe(false)
    })

    it('rejects empty string', () => {
        expect(TsUtils.isDateTime('')).toBe(false)
    })

    it('accepts Date object directly', () => {
        expect(TsUtils.isDateTime(new Date())).toBe(true)
    })
})

// ---------------------------------------------------------------------------
// age
// ---------------------------------------------------------------------------

describe('TsUtils.age', () => {
    it('returns same-day string for today date', () => {
        const today = new Date()
        const result = TsUtils.age(today.toISOString())
        // today means 0 secs or very small secs; just check it returns a non-empty string
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
        expect(result).toMatch(/sec/)
    })

    it('returns string containing "day" for yesterday', () => {
        const yesterday = new Date(Date.now() - 86400000 * 1.5) // 1.5 days ago
        const result = TsUtils.age(yesterday.toISOString())
        expect(result).toMatch(/day/)
    })

    it('returns string containing "day" for 30 days ago', () => {
        const thirtyDaysAgo = new Date(Date.now() - 86400000 * 30)
        const result = TsUtils.age(thirtyDaysAgo.toISOString())
        expect(result).toMatch(/day|month/)
    })

    it('returns string containing "month" for 3 months ago', () => {
        const threeMonthsAgo = new Date(Date.now() - 86400000 * 90)
        const result = TsUtils.age(threeMonthsAgo.toISOString())
        expect(result).toMatch(/month/)
    })

    it('returns string containing "year" for 2 years ago', () => {
        const twoYearsAgo = new Date(Date.now() - 86400000 * 730)
        const result = TsUtils.age(twoYearsAgo.toISOString())
        expect(result).toMatch(/year/)
    })

    it('returns empty string for invalid input', () => {
        expect(TsUtils.age('not-a-date')).toBe('')
    })

    it('returns empty string for null', () => {
        expect(TsUtils.age(null)).toBe('')
    })

    it('returns empty string for empty string', () => {
        expect(TsUtils.age('')).toBe('')
    })
})

// ---------------------------------------------------------------------------
// interval
// ---------------------------------------------------------------------------

describe('TsUtils.interval', () => {
    it('returns "< 0.01 sec" for 50ms', () => {
        expect(TsUtils.interval(50)).toBe('< 0.01 sec')
    })

    it('returns seconds string for 45000ms', () => {
        const result = TsUtils.interval(45000)
        expect(result).toMatch(/sec/)
        expect(result).toContain('45')
    })

    it('returns hours string for 3600000ms (1h)', () => {
        const result = TsUtils.interval(3600000)
        expect(result).toMatch(/hour/)
    })

    it('returns days string for 2 days in ms', () => {
        const result = TsUtils.interval(86400000 * 2)
        expect(result).toMatch(/day/)
    })

    it('returns months string for 3 months in ms', () => {
        const result = TsUtils.interval(2628000000 * 3)
        expect(result).toMatch(/month/)
    })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('TsUtils.formatDate', () => {
    it('formats date in local-time-safe format with default settings', () => {
        // Use US-style string so new Date() parses in local time (no timezone shift)
        const result = TsUtils.formatDate('5/13/2026')
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('formats with explicit mm/dd/yyyy format using local-time-safe string', () => {
        // '5/13/2026' parsed by new Date() in local time → no day-shift
        expect(TsUtils.formatDate('5/13/2026', 'mm/dd/yyyy')).toBe('05/13/2026')
    })

    it('formats with Spanish fullmonths after settings mutation', () => {
        const spanish = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
        TsUtils.settings.fullmonths = spanish
        const result = TsUtils.formatDate('5/13/2026', 'month dd, yyyy')
        expect(result).toContain('Mayo')
    })

    it('returns empty string for invalid date string', () => {
        expect(TsUtils.formatDate('not-a-date')).toBe('')
    })

    it('returns empty string for null', () => {
        expect(TsUtils.formatDate(null)).toBe('')
    })
})

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------

describe('TsUtils.formatTime', () => {
    it('formats time string with default settings timeFormat', () => {
        const result = TsUtils.formatTime('14:30')
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('formats with explicit 12h format "hh:mi pm"', () => {
        const result = TsUtils.formatTime('14:30', 'hh:mi pm')
        expect(result).toBe('2:30 pm')
    })

    it('returns empty string for invalid time string', () => {
        expect(TsUtils.formatTime('not-a-time')).toBe('')
    })

    it('returns empty string for null', () => {
        expect(TsUtils.formatTime(null)).toBe('')
    })
})

// ---------------------------------------------------------------------------
// formatDateTime
// ---------------------------------------------------------------------------

describe('TsUtils.formatDateTime', () => {
    it('formats datetime string with no format (uses settings defaults)', () => {
        // Use local-time-safe date + time format matching 'm/d/yyyy|hh:mi pm'
        const result = TsUtils.formatDateTime('5/13/2026 2:30 pm')
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('returns a space-separated string for invalid parts (formatDate+formatTime each return empty)', () => {
        // formatDateTime('not-a-datetime') = formatDate('not-a-datetime') + ' ' + formatTime('not-a-datetime')
        // = '' + ' ' + '' = ' ' — actual behavior of the current implementation
        const result = TsUtils.formatDateTime('not-a-datetime')
        expect(result.trim()).toBe('')
    })

    it('reflects settings mutation between calls (proves reference not clone)', () => {
        const original = TsUtils.formatDate('5/13/2026', 'mm/dd/yyyy')
        expect(original).toBe('05/13/2026')
        // Mutate settings.dateFormat and verify the change propagates
        TsUtils.settings.dateFormat = 'dd/mm/yyyy'
        // Now formatDateTime uses the mutated dateFormat for the date part
        const result = TsUtils.formatDateTime('5/13/2026 2:30 pm')
        // Should reflect the mutated format: dd/mm/yyyy → '13/05/2026'
        expect(result).toContain('13')
        expect(result).toContain('05')
    })
})

// ---------------------------------------------------------------------------
// Delegation spy — isDateTime → isDate (T-4.10 / OQ-5)
// ---------------------------------------------------------------------------

describe('delegation spy — isDateTime → isDate (OQ-5 / INV-SPY pre-P5b)', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('TsUtils.isDateTime returns expected truthy for valid input (spy compatible)', () => {
        // After P5b, intra-cluster _isDateTime calls _isDate directly (not via prototype),
        // so vi.spyOn(TsUtils, 'isDate') will NOT intercept the internal call.
        // This test asserts OBSERVABLE behavior: the public call returns the correct result.
        // Pattern consistent with v2.4 grid-data OQ-5 precedent.
        // Using explicit format to match the date/time portions correctly.
        const spy = vi.spyOn(TsUtils, 'isDate')
        const result = TsUtils.isDateTime('1/15/2024 10:30 am', 'm/d/yyyy|hh:mi pm')
        expect(result).toBe(true)
        // spy.mock.calls.length may be 1 (pre-P5b, via this.isDate) or 0 (post-P5b, via _isDate)
        // We only assert the observable output, not internal routing
        spy.mockRestore()
    })

    it('vi.spyOn(TsUtils, isDate) does not error', () => {
        const spy = vi.spyOn(TsUtils, 'isDate')
        expect(() => TsUtils.isDate('5/13/2026')).not.toThrow()
        spy.mockRestore()
    })
})
