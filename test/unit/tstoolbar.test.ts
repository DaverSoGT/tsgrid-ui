import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsToolbar } from '../../src/tstoolbar.js'

function mountBox(id = 'tb-host'): HTMLElement {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
    return el
}

// jsdom does not implement ResizeObserver — provide a no-op stub so render() doesn't throw
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() { /* no-op */ }
        unobserve() { /* no-op */ }
        disconnect() { /* no-op */ }
    } as unknown as typeof ResizeObserver
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

// ── BUG-3 — close malformed nth-child selector ───────────────────────────────
//
// refresh() uses `.tsg-tb-line:nth-child(${it.line}` (missing closing paren).
// When adding a new item that is the last on a line, $next.length === 0 and the code
// falls into the malformed selector path — the item is never inserted in the DOM.
// After the fix the selector becomes `.tsg-tb-line:nth-child(${it.line})`.

describe('TsToolbar BUG-3 — insert appends to end-of-line', () => {
    it('renders a newly added item in the DOM when it is last on the line', () => {
        const box = mountBox('tb-bug3a')
        // Render toolbar with the box — first item creates the line container
        const toolbar = new TsToolbar({ name: 'bug3a', box, items: [{ id: 'first', type: 'button', text: 'A' }] })
        // Add a second item — it will be the last on line 1, triggering the nth-child path
        toolbar.add({ id: 'second', type: 'button', text: 'B' })
        const node = document.querySelector('#tb_bug3a_item_second')
        expect(node).not.toBeNull()
    })

    it('renders an item inserted before an existing sibling in the DOM', () => {
        const box = mountBox('tb-bug3b')
        const toolbar = new TsToolbar({ name: 'bug3b', box, items: [
            { id: 'a', type: 'button', text: 'A' },
            { id: 'b', type: 'button', text: 'B' },
        ] })
        // Insert before 'b' — 'mid' has a next sibling, so uses the normal path
        toolbar.insert('b', { id: 'mid', type: 'button', text: 'M' })
        const node = document.querySelector('#tb_bug3b_item_mid')
        expect(node).not.toBeNull()
    })
})

// ── BUG-4 — mouseAction must call edata.finish() on early return ─────────────
//
// Before the fix: btn.disabled causes an early return at line 1265.
// edata.finish() at line 1290 is never reached.
// Each mouseAction call on a disabled item pushes one TsEvent to activeEvents and
// never removes it → activeEvents grows indefinitely.

describe('TsToolbar BUG-4 — activeEvents lifecycle', () => {
    it('activeEvents is empty after 100 Enter/Leave cycles on a disabled item', () => {
        const toolbar = new TsToolbar({ name: 'tb4a', items: [{ id: 'dis', type: 'button', disabled: true }] })
        const fakeEvent = new MouseEvent('mouseenter')
        const fakeTarget = document.createElement('div')
        for (let i = 0; i < 100; i++) {
            toolbar.mouseAction(fakeEvent, fakeTarget, 'Enter', 'dis')
            toolbar.mouseAction(fakeEvent, fakeTarget, 'Leave', 'dis')
        }
        expect(toolbar.activeEvents.length).toBe(0)
    })

    it('activeEvents is empty after Enter/Leave on an enabled item', () => {
        const toolbar = new TsToolbar({ name: 'tb4b', items: [{ id: 'en', type: 'button' }] })
        const fakeEvent = new MouseEvent('mouseenter')
        const fakeTarget = document.createElement('div')
        toolbar.mouseAction(fakeEvent, fakeTarget, 'Enter', 'en')
        toolbar.mouseAction(fakeEvent, fakeTarget, 'Leave', 'en')
        expect(toolbar.activeEvents.length).toBe(0)
    })
})
