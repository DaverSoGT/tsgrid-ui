// @vitest-environment jsdom
/**
 * Test suite for TsUtils DOM cluster — Phase 4 (TDD safety-net) of v2.4 SDD.
 *
 * Phase 4 framing:
 *   Tests are written against the CURRENT TsUtils inline implementations and are GREEN
 *   throughout Phase 4. They serve as safety nets: if Phase 5b extraction breaks any
 *   behavior, a test catches it. This is the strict-TDD interpretation for extraction
 *   refactors (same pattern used in v2.3 notify / v2.1 string-helpers clusters).
 *
 * Infrastructure:
 *   - jsdom environment (vitest.config.ts: testEnvironment: 'jsdom')
 *   - Fake timers: vi.useFakeTimers() per test that needs setTimeout paths
 *   - Reset: document.body.innerHTML = '' in beforeEach
 *   - vi.spyOn(window, 'getComputedStyle') for layout-dependent paths (getSize)
 *   - Object.defineProperty on clientWidth/clientHeight for getStrDimentions
 *
 * Out-of-scope for unit tests:
 *   - TsUtils.transition: relies on CSS transitions + real layout; jsdom cannot
 *     observe transform/opacity changes reliably. Covered by playwright smoke only.
 *
 * INV-TDD: These tests are committed before Phase 5b extraction bodies land,
 *   satisfying the pre-commit test requirement.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'
import { query } from '../../src/query.js'

// ── helpers ────────────────────────────────────────────────────────────────

/** Create a simple div fixture attached to document.body */
function makeBox(id = 'test-box'): HTMLElement {
    const el = document.createElement('div')
    el.id = id
    el.style.width = '200px'
    el.style.height = '100px'
    document.body.appendChild(el)
    return el
}

/** Return the .tsg-lock overlay inside an element (or null if absent) */
function lockOverlay(el: HTMLElement): Element | null {
    return el.querySelector('.tsg-lock')
}

/** Return the .tsg-lock-msg element inside an element (or null if absent) */
function lockMsg(el: HTMLElement): Element | null {
    return el.querySelector('.tsg-lock-msg')
}

// ── setup / teardown ───────────────────────────────────────────────────────

beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

afterEach(() => {
    vi.useRealTimers()
})

// ── lock ───────────────────────────────────────────────────────────────────

describe('TsUtils.lock — overlay creation', () => {
    it('inserts .tsg-lock element inside the target box', () => {
        const box = makeBox()
        TsUtils.lock(box)
        expect(lockOverlay(box)).not.toBeNull()
    })

    it('does NOT insert .tsg-lock when box is null', () => {
        // should be a no-op — no throw, no DOM mutation
        expect(() => TsUtils.lock(null)).not.toThrow()
        expect(document.querySelectorAll('.tsg-lock').length).toBe(0)
    })

    it('inserts a .tsg-lock-msg element when msg option is provided', () => {
        const box = makeBox()
        TsUtils.lock(box, { msg: 'Loading…' })
        const msg = lockMsg(box)
        expect(msg).not.toBeNull()
        expect(msg?.textContent).toContain('Loading…')
    })

    it('accepts a plain string shorthand for the msg option', () => {
        const box = makeBox()
        TsUtils.lock(box, 'Saving')
        expect(lockMsg(box)?.textContent).toContain('Saving')
    })

    it('removes an existing lock before adding a new one (no duplicate overlays)', () => {
        const box = makeBox()
        TsUtils.lock(box)
        TsUtils.lock(box)
        expect(box.querySelectorAll('.tsg-lock').length).toBe(1)
    })
})

// ── unlock ─────────────────────────────────────────────────────────────────

describe('TsUtils.unlock — overlay removal', () => {
    it('removes .tsg-lock and .tsg-lock-msg from the target box', () => {
        const box = makeBox()
        TsUtils.lock(box, { msg: 'Wait' })
        expect(lockOverlay(box)).not.toBeNull()
        TsUtils.unlock(box)
        expect(lockOverlay(box)).toBeNull()
        expect(lockMsg(box)).toBeNull()
    })

    it('is a no-op when the box has no lock overlay', () => {
        const box = makeBox()
        expect(() => TsUtils.unlock(box)).not.toThrow()
        expect(lockOverlay(box)).toBeNull()
    })

    it('is a no-op when box is null', () => {
        expect(() => TsUtils.unlock(null)).not.toThrow()
    })

    it('schedules removal via setTimeout when speed is provided', () => {
        vi.useFakeTimers()
        const box = makeBox()
        TsUtils.lock(box)
        TsUtils.unlock(box, 500)
        // .tsg-lock-msg removed immediately; .tsg-lock still present before timer fires
        expect(lockMsg(box)).toBeNull()
        expect(lockOverlay(box)).not.toBeNull()
        vi.advanceTimersByTime(501)
        expect(lockOverlay(box)).toBeNull()
    })
})

// ── getSize ────────────────────────────────────────────────────────────────

describe('TsUtils.getSize — computed style measurement', () => {
    it('returns the numeric width from getComputedStyle', () => {
        const el = makeBox()
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            width: '200px',
            height: '100px',
        } as unknown as CSSStyleDeclaration)

        expect(TsUtils.getSize(el, 'width')).toBe(200)
    })

    it('returns the numeric height from getComputedStyle', () => {
        const el = makeBox()
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            width: '200px',
            height: '100px',
        } as unknown as CSSStyleDeclaration)

        expect(TsUtils.getSize(el, 'height')).toBe(100)
    })

    it('returns 0 when width is "auto"', () => {
        const el = makeBox()
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            width: 'auto',
            height: '0px',
        } as unknown as CSSStyleDeclaration)

        expect(TsUtils.getSize(el, 'width')).toBe(0)
    })

    it('returns 0 when height is "auto"', () => {
        const el = makeBox()
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            width: '0px',
            height: 'auto',
        } as unknown as CSSStyleDeclaration)

        expect(TsUtils.getSize(el, 'height')).toBe(0)
    })

    it('returns a numeric value for arbitrary CSS properties (e.g. paddingLeft)', () => {
        const el = makeBox()
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            paddingLeft: '16px',
        } as unknown as CSSStyleDeclaration)

        expect(TsUtils.getSize(el, 'paddingLeft')).toBe(16)
    })
})

// ── getStrDimentions ───────────────────────────────────────────────────────

describe('TsUtils.getStrDimentions — string measurement', () => {
    beforeEach(() => {
        // jsdom does not compute real layout; stub clientWidth/clientHeight
        // on the #_tmp_width div that getStrDimentions creates internally
        const originalAppend = document.body.append.bind(document.body)
        vi.spyOn(document.body, 'append').mockImplementation((...args) => {
            originalAppend(...args)
            const tmp = document.body.querySelector('#_tmp_width')
            if (tmp) {
                Object.defineProperty(tmp, 'clientWidth', { get: () => 120, configurable: true })
                Object.defineProperty(tmp, 'clientHeight', { get: () => 20, configurable: true })
            }
        })
    })

    it('returns an object with numeric width and height properties', () => {
        const result = TsUtils.getStrDimentions('Hello')
        expect(typeof result.width).toBe('number')
        expect(typeof result.height).toBe('number')
    })

    it('returns non-zero values for a non-empty string (stubbed dimensions)', () => {
        const result = TsUtils.getStrDimentions('Test string')
        expect(result.width).toBe(120)
        expect(result.height).toBe(20)
    })

    it('accepts a styles argument and applies it to the measurement element', () => {
        // Just verify no throw — style string is forwarded to the div
        expect(() => TsUtils.getStrDimentions('Styled', 'font-size: 16px;')).not.toThrow()
    })
})

// ── getStrWidth / getStrHeight ─────────────────────────────────────────────

describe('TsUtils.getStrWidth — thin wrapper over getStrDimentions', () => {
    it('returns a number', () => {
        vi.spyOn(TsUtils, 'getStrDimentions').mockReturnValue({ width: 88, height: 14 })
        expect(TsUtils.getStrWidth('Hello')).toBe(88)
    })

    it('delegates to getStrDimentions with the same arguments', () => {
        const spy = vi.spyOn(TsUtils, 'getStrDimentions').mockReturnValue({ width: 50, height: 10 })
        TsUtils.getStrWidth('Hello', 'font-size:12px', true)
        expect(spy).toHaveBeenCalledWith('Hello', 'font-size:12px', true)
    })
})

describe('TsUtils.getStrHeight — thin wrapper over getStrDimentions', () => {
    it('returns a number', () => {
        vi.spyOn(TsUtils, 'getStrDimentions').mockReturnValue({ width: 88, height: 14 })
        expect(TsUtils.getStrHeight('Hello')).toBe(14)
    })

    it('delegates to getStrDimentions with the same arguments', () => {
        const spy = vi.spyOn(TsUtils, 'getStrDimentions').mockReturnValue({ width: 50, height: 10 })
        TsUtils.getStrHeight('World', 'font-size:14px', false)
        expect(spy).toHaveBeenCalledWith('World', 'font-size:14px', false)
    })
})

// ── bindEvents ─────────────────────────────────────────────────────────────

describe('TsUtils.bindEvents — event delegation via data-attributes', () => {
    it('binds a click handler to an element with data-click attribute', () => {
        const el = document.createElement('div')
        el.dataset['click'] = 'doSomething'
        document.body.appendChild(el)

        const subject: Record<string, unknown> = { doSomething: vi.fn() }
        TsUtils.bindEvents(el, subject)

        el.dispatchEvent(new Event('click', { bubbles: true }))
        expect(subject['doSomething']).toHaveBeenCalledTimes(1)
    })

    it('binds a mouseenter handler and fires it on mouseenter', () => {
        const el = document.createElement('div')
        el.dataset['mouseenter'] = 'onEnter'
        document.body.appendChild(el)

        const subject: Record<string, unknown> = { onEnter: vi.fn() }
        TsUtils.bindEvents(el, subject)

        el.dispatchEvent(new Event('mouseenter'))
        expect(subject['onEnter']).toHaveBeenCalledTimes(1)
    })

    it('binds a mouseleave handler and fires it on mouseleave', () => {
        const el = document.createElement('div')
        el.dataset['mouseleave'] = 'onLeave'
        document.body.appendChild(el)

        const subject: Record<string, unknown> = { onLeave: vi.fn() }
        TsUtils.bindEvents(el, subject)

        el.dispatchEvent(new Event('mouseleave'))
        expect(subject['onLeave']).toHaveBeenCalledTimes(1)
    })

    it('supports pipe-separated param syntax for method name extraction', () => {
        const el = document.createElement('div')
        el.dataset['click'] = 'handleClick|param1'
        document.body.appendChild(el)

        const subject: Record<string, unknown> = { handleClick: vi.fn() }
        TsUtils.bindEvents(el, subject)

        el.dispatchEvent(new Event('click', { bubbles: true }))
        expect(subject['handleClick']).toHaveBeenCalledTimes(1)
        expect(subject['handleClick']).toHaveBeenCalledWith('param1')
    })

    it('throws when the dispatched method does not exist in the subject', () => {
        const el = document.createElement('div')
        el.dataset['click'] = 'nonExistentMethod'
        document.body.appendChild(el)

        const subject: Record<string, unknown> = {}
        TsUtils.bindEvents(el, subject)

        // jsdom dispatches the event inside an event listener; the error is thrown
        // synchronously in the handler but propagated as an uncaught exception by
        // jsdom's event machinery. Capture it via a window error listener instead.
        let caughtMessage = ''
        const onError = (e: ErrorEvent) => { caughtMessage = e.message; e.preventDefault() }
        window.addEventListener('error', onError)
        el.dispatchEvent(new Event('click', { bubbles: true }))
        window.removeEventListener('error', onError)
        expect(caughtMessage).toMatch(/nonExistentMethod/)
    })

    it('is a no-op for a selector with length 0', () => {
        // query() on an empty NodeList returns length=0; bindEvents should return early
        const emptyList = query('#this-id-does-not-exist-in-dom')
        expect(() => TsUtils.bindEvents(emptyList, {})).not.toThrow()
    })
})

// ── transition ─────────────────────────────────────────────────────────────

// NOTE: TsUtils.transition relies on CSS transitions and real layout rendering.
// jsdom cannot observe transform/opacity changes applied via cssText.
// Transition behavior is covered by playwright smoke tests only.
// See design §K (OQ-DESIGN-3) and spec Phase 4 "Out-of-scope for Phase 4".
