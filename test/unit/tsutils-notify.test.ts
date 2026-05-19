// @vitest-environment jsdom
/**
 * Test suite for TsUtils.notify — Phase 1 of v2.3 SDD (message-cluster-extraction).
 *
 * Infrastructure:
 * - jsdom environment configured globally in vitest.config.ts (testEnvironment: 'jsdom')
 * - Fake timers: vi.useFakeTimers() per test that needs timeout paths
 * - Reset pattern: document.body.innerHTML = '' + TsUtils.tmp = {} in beforeEach
 *   (notify stores its state on TsUtils.tmp; must be cleared between tests)
 * - query('#tsg-notify') works in jsdom — no layout-dependent calls needed
 *
 * TDD: Safety-net variant (existing code extraction):
 * - Tests are written against the CURRENT TsUtils.notify first (they pass)
 * - The notify body is then moved to tsutils-notify.ts with a delegator replacing it
 * - Tests MUST still pass after extraction — any deviation = regression
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'
import { query } from '../../src/query.js'

// ── helpers ────────────────────────────────────────────────────────────────

function notifyEl(): Element | null {
    return document.body.querySelector('#tsg-notify')
}

// ── setup / teardown ───────────────────────────────────────────────────────

beforeEach(() => {
    document.body.innerHTML = ''
    TsUtils.tmp = {}
})

afterEach(() => {
    vi.useRealTimers()
})

// ── tests ──────────────────────────────────────────────────────────────────

describe('TsUtils.notify — DOM creation', () => {
    it('renders #tsg-notify element in document.body when called with a string', async () => {
        TsUtils.notify('Hello world')
        expect(notifyEl()).not.toBeNull()
    })

    it('includes the message text inside #tsg-notify', async () => {
        TsUtils.notify('Document saved')
        expect(notifyEl()?.textContent).toContain('Document saved')
    })

    it('uses position:fixed when target is document.body (default)', () => {
        TsUtils.notify('Fixed position test')
        const el = notifyEl() as HTMLElement
        expect(el.style.position).toBe('fixed')
    })

    it('does NOT use position:fixed when a custom container is given', () => {
        const container = document.createElement('div')
        container.id = 'custom-host'
        document.body.appendChild(container)

        TsUtils.notify('Custom host', { where: '#custom-host' })

        const el = container.querySelector('#tsg-notify') as HTMLElement
        expect(el).not.toBeNull()
        expect(el.style.position).not.toBe('fixed')
    })
})

describe('TsUtils.notify — object-form input', () => {
    it('accepts an options object as the first argument', () => {
        TsUtils.notify({ text: 'Object form', timeout: 0 })
        expect(notifyEl()?.textContent).toContain('Object form')
    })
})

describe('TsUtils.notify — second call replaces the first', () => {
    it('removes the previous #tsg-notify before rendering a new one', () => {
        TsUtils.notify('First', { timeout: 0 })
        TsUtils.notify('Second', { timeout: 0 })
        const all = document.querySelectorAll('#tsg-notify')
        expect(all.length).toBe(1)
        expect(all[0].textContent).toContain('Second')
    })

    it('resolves the previous promise when a new notify call replaces it', async () => {
        let firstResolved = false
        const first = TsUtils.notify('First', { timeout: 0 })
        first.then(() => { firstResolved = true })

        TsUtils.notify('Second', { timeout: 0 })
        await Promise.resolve() // flush microtasks
        expect(firstResolved).toBe(true)
    })
})

describe('TsUtils.notify — close button', () => {
    it('clicking .tsg-notify-close removes #tsg-notify', async () => {
        const p = TsUtils.notify('Click to close', { timeout: 0 })
        const btn = notifyEl()?.querySelector('.tsg-notify-close') as HTMLElement
        expect(btn).not.toBeNull()
        btn.click()
        await p
        expect(notifyEl()).toBeNull()
    })

    it('clicking .tsg-notify-close resolves the returned promise', async () => {
        const p = TsUtils.notify('Resolve on close', { timeout: 0 })
        const btn = notifyEl()?.querySelector('.tsg-notify-close') as HTMLElement
        btn.click()
        await expect(p).resolves.toBeUndefined()
    })
})

describe('TsUtils.notify — timeout', () => {
    it('removes #tsg-notify after the timeout elapses', async () => {
        vi.useFakeTimers()
        TsUtils.notify('Timeout test', { timeout: 2000 })
        expect(notifyEl()).not.toBeNull()
        vi.advanceTimersByTime(2001)
        await Promise.resolve()
        expect(notifyEl()).toBeNull()
    })

    it('does NOT auto-remove when timeout is 0', async () => {
        vi.useFakeTimers()
        TsUtils.notify('No auto-remove', { timeout: 0 })
        vi.advanceTimersByTime(30_000)
        await Promise.resolve()
        expect(notifyEl()).not.toBeNull()
    })
})

describe('TsUtils.notify — actions', () => {
    it('renders .tsg-notify-link elements for each action key', () => {
        TsUtils.notify('Message ${undo}', {
            timeout: 0,
            actions: { undo: () => {} }
        })
        const links = notifyEl()?.querySelectorAll('.tsg-notify-link')
        expect(links?.length).toBeGreaterThan(0)
    })

    it('invokes the action callback when the link is clicked', async () => {
        const undoCb = vi.fn()
        const p = TsUtils.notify('Message ${undo}', {
            timeout: 0,
            actions: { undo: undoCb }
        })
        const link = notifyEl()?.querySelector('.tsg-notify-link') as HTMLElement
        expect(link).not.toBeNull()
        link.click()
        await p
        expect(undoCb).toHaveBeenCalledOnce()
    })

    it('clicking an action link removes #tsg-notify and resolves the promise', async () => {
        const p = TsUtils.notify('Message ${undo}', {
            timeout: 0,
            actions: { undo: () => {} }
        })
        const link = notifyEl()?.querySelector('.tsg-notify-link') as HTMLElement
        link.click()
        await expect(p).resolves.toBeUndefined()
        expect(notifyEl()).toBeNull()
    })
})

describe('TsUtils.notify — CSS class options', () => {
    it('applies tsg-notify-error class when error option is truthy', () => {
        TsUtils.notify('Error!', { timeout: 0, error: true })
        const inner = notifyEl()?.firstElementChild
        expect(inner?.className).toContain('tsg-notify-error')
    })

    it('applies tsg-notify-success class when success option is truthy', () => {
        TsUtils.notify('Done!', { timeout: 0, success: true })
        const inner = notifyEl()?.firstElementChild
        expect(inner?.className).toContain('tsg-notify-success')
    })

    it('applies custom class string when class option is given', () => {
        TsUtils.notify('Styled!', { timeout: 0, class: 'my-custom-class' })
        const inner = notifyEl()?.firstElementChild
        expect(inner?.className).toContain('my-custom-class')
    })
})
