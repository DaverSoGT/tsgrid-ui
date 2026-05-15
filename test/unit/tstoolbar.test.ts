import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsToolbar } from '../../src/tstoolbar.js'

function mountBox(id = 'tb-host'): HTMLElement {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
    return el
}

beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

afterEach(() => {
    vi.useRealTimers()
})

// ── BUG-1 — hide() / disable() must propagate hideTooltip via debounce ──────
//
// refresh() unconditionally calls tooltipHide(id) once per refresh cycle (line 760).
// The BUG-1 fix adds a SECOND call via the `if (options.hideTooltip)` path (line 122).
// Therefore:
//   hide() / disable() → debounce fires → refresh calls tooltipHide ONCE +
//                        hideTooltip path calls tooltipHide AGAIN = 2 total
//   show() / enable()  → debounce fires → refresh calls tooltipHide ONCE (no extra) = 1 total
//
// Before the fix: hide() and disable() also produce only 1 call (hideTooltip is silently dropped).

describe('TsToolbar BUG-1 — hideTooltip forwarding', () => {
    it('calls tooltipHide twice when hide() fires (refresh + hideTooltip path)', () => {
        vi.useFakeTimers()
        const toolbar = new TsToolbar({ name: 'tb1', items: [{ id: 'foo', type: 'button', tooltip: 'Foo tip' }] })
        const spy = vi.spyOn(toolbar, 'tooltipHide')
        toolbar.hide('foo')
        vi.advanceTimersByTime(20) // flush 15ms debounce
        // 1st call: refresh() at line 760; 2nd call: if(options.hideTooltip) at line 122
        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('foo')
    })

    it('calls tooltipHide twice when disable() fires (refresh + hideTooltip path)', () => {
        vi.useFakeTimers()
        const toolbar = new TsToolbar({ name: 'tb2', items: [{ id: 'bar', type: 'button', tooltip: 'Bar tip' }] })
        const spy = vi.spyOn(toolbar, 'tooltipHide')
        toolbar.disable('bar')
        vi.advanceTimersByTime(20)
        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('bar')
    })

    it('calls tooltipHide exactly once when show() fires (refresh only, no hideTooltip path)', () => {
        vi.useFakeTimers()
        const toolbar = new TsToolbar({ name: 'tb3', items: [{ id: 'baz', type: 'button', hidden: true, tooltip: 'Baz tip' }] })
        const spy = vi.spyOn(toolbar, 'tooltipHide')
        toolbar.show('baz')
        vi.advanceTimersByTime(20)
        // Only 1 call: from refresh() at line 760 — NOT from the hideTooltip path
        expect(spy).toHaveBeenCalledTimes(1)
    })
})
