// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('singleton-lazy-init (R-SLI-15..18)', () => {
    beforeEach(() => { vi.resetModules() })

    // T-LAZY-1: TsPopup — Construction is deferred on import
    it('T-LAZY-1: importing tspopup does NOT construct TsDialog', async () => {
        const m = await import('../../src/tspopup.js')
        expect(m.__test_internals.tsDialogCtorCount).toBe(0)
    })

    // T-LAZY-2: TsPopup — First access constructs exactly once
    it('T-LAZY-2: first TsPopup access constructs exactly once', async () => {
        const m = await import('../../src/tspopup.js')
        void m.TsPopup.status
        void m.TsPopup.status
        expect(m.__test_internals.tsDialogCtorCount).toBe(1)
    })

    // T-LAZY-3: TsPopup — Singleton identity preserved across accesses
    it('T-LAZY-3: subsequent TsPopup accesses target the same backing instance', async () => {
        const m = await import('../../src/tspopup.js')
        ;(m.TsPopup as Record<string, unknown>).tmp = { marker: 'singleton-test' }
        const tmp = (m.TsPopup as Record<string, unknown>).tmp as { marker: string }
        expect(tmp.marker).toBe('singleton-test')
        expect(m.__test_internals.tsDialogCtorCount).toBe(1)
    })

    // T-LAZY-4: TsTooltip — Construction is deferred on import
    it('T-LAZY-4: importing tstooltip does NOT construct any tooltip class', async () => {
        const m = await import('../../src/tstooltip.js')
        expect(m.__test_internals.tooltipCtorCount).toBe(0)
        expect(m.__test_internals.menuCtorCount).toBe(0)
        expect(m.__test_internals.colorCtorCount).toBe(0)
        expect(m.__test_internals.dateCtorCount).toBe(0)
    })

    // T-LAZY-5: TsTooltip — First access constructs exactly once, sibling independence
    it('T-LAZY-5: first TsTooltip access constructs Tooltip once and no siblings', async () => {
        const m = await import('../../src/tstooltip.js')
        void m.TsTooltip.active
        expect(m.__test_internals.tooltipCtorCount).toBe(1)
        expect(m.__test_internals.menuCtorCount).toBe(0)
    })

    // T-LAZY-6: TsTooltip — vi.spyOn works after first access
    it('T-LAZY-6: vi.spyOn(TsTooltip, "hide") works after first access', async () => {
        const m = await import('../../src/tstooltip.js')
        void m.TsTooltip.active
        const spy = vi.spyOn(m.TsTooltip, 'hide').mockImplementation(() => {})
        m.TsTooltip.hide('x')
        expect(spy).toHaveBeenCalledTimes(1)
        expect(() => spy.mockRestore()).not.toThrow()
    })

    // T-LAZY-7: TsMenu — TsUtils.lang('No items found') succeeds at first use
    it('T-LAZY-7: TsMenu construction calls TsUtils.lang("No items found") without error', async () => {
        const tsutils = await import('../../src/tsutils.js')
        const langSpy = vi.spyOn(tsutils.TsUtils, 'lang')
        const m = await import('../../src/tstooltip.js')
        void m.TsMenu.defaults
        expect(langSpy).toHaveBeenCalledWith('No items found')
    })

    // T-LAZY-8: instanceof invariant — TsPopup and TsTooltip
    it('T-LAZY-8: TsPopup instanceof TsDialog and TsTooltip instanceof Tooltip are true', async () => {
        const popup = await import('../../src/tspopup.js')
        const tooltip = await import('../../src/tstooltip.js')
        void popup.TsPopup.status
        void tooltip.TsTooltip.active
        expect(popup.TsPopup instanceof popup.TsDialog).toBe(true)
        expect(tooltip.TsTooltip instanceof tooltip.Tooltip).toBe(true)
    })
})
