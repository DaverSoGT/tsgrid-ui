/**
 * Test suite for TsUtils.normButtons — Phase 2 of v2.3 SDD (message-cluster-extraction).
 *
 * Infrastructure:
 * - No jsdom needed — normButtons is a pure function (no DOM access)
 * - No fake timers needed
 * - Tests written against the CURRENT TsUtils.normButtons first (safety-net variant)
 *   After extraction to tsutils-message.ts, tests MUST still pass.
 *
 * TDD: Safety-net variant (existing code extraction):
 * - Tests pass on existing class method before extraction
 * - Extraction moves the body to normButtons() in tsutils-message.ts
 * - Class delegator wires deps from `this`
 * - Tests still green = safe move
 *
 * Design ref: engram #879 §E Phase 2, §C.1 (normButtons deps: extend, lang, settings)
 */
import { describe, expect, it, vi } from 'vitest'
import { TsUtils } from '../../src/tsutils.js'

// ── helpers ────────────────────────────────────────────────────────────────

/** Build a fresh copy of options + btn for each test (normButtons mutates both). */
function makeYesNo(overrides?: Record<string, unknown>): {
    options: Record<string, unknown>
    btn: Record<string, unknown>
} {
    return {
        options: { ...overrides },
        btn: { yes: TsUtils.lang('Yes'), no: TsUtils.lang('No') }
    }
}

function makeOkCancel(overrides?: Record<string, unknown>): {
    options: Record<string, unknown>
    btn: Record<string, unknown>
} {
    return {
        options: { ...overrides },
        btn: { ok: TsUtils.lang('Ok'), cancel: TsUtils.lang('Cancel') }
    }
}

// ── tests ──────────────────────────────────────────────────────────────────

describe('TsUtils.normButtons — basic button initialization', () => {
    it('returns an options object (not undefined)', () => {
        const { options, btn } = makeYesNo()
        const result = TsUtils.normButtons(options, btn)
        expect(result).toBeDefined()
        expect(typeof result).toBe('object')
    })

    it('initializes options.actions to {} if not set', () => {
        const { options, btn } = makeYesNo()
        const result = TsUtils.normButtons(options, btn)
        expect(result['actions']).toBeDefined()
        expect(typeof result['actions']).toBe('object')
    })

    it('preserves pre-existing options.actions entries', () => {
        const { btn } = makeYesNo()
        const options: Record<string, unknown> = { actions: { custom: 'fn' } }
        TsUtils.normButtons(options, btn)
        expect((options['actions'] as Record<string, unknown>)['custom']).toBe('fn')
    })
})

describe('TsUtils.normButtons — yes/no button order (macButtonOrder)', () => {
    it('with macButtonOrder=false: yes comes before no in actions keys', () => {
        TsUtils.settings.macButtonOrder = false
        const { options, btn } = makeYesNo()
        TsUtils.normButtons(options, btn)
        const keys = Object.keys(options['actions'] as Record<string, unknown>)
        expect(keys.indexOf('yes')).toBeLessThan(keys.indexOf('no'))
    })

    it('with macButtonOrder=true: no comes before yes in actions keys', () => {
        TsUtils.settings.macButtonOrder = true
        const { options, btn } = makeYesNo()
        TsUtils.normButtons(options, btn)
        const keys = Object.keys(options['actions'] as Record<string, unknown>)
        expect(keys.indexOf('no')).toBeLessThan(keys.indexOf('yes'))
        // restore
        TsUtils.settings.macButtonOrder = false
    })
})

describe('TsUtils.normButtons — ok/cancel button order (macButtonOrder)', () => {
    it('with macButtonOrder=false: ok comes before cancel in actions keys', () => {
        TsUtils.settings.macButtonOrder = false
        const { options, btn } = makeOkCancel()
        TsUtils.normButtons(options, btn)
        const keys = Object.keys(options['actions'] as Record<string, unknown>)
        expect(keys.indexOf('ok')).toBeLessThan(keys.indexOf('cancel'))
    })

    it('with macButtonOrder=true: cancel comes before ok in actions keys', () => {
        TsUtils.settings.macButtonOrder = true
        const { options, btn } = makeOkCancel()
        TsUtils.normButtons(options, btn)
        const keys = Object.keys(options['actions'] as Record<string, unknown>)
        expect(keys.indexOf('cancel')).toBeLessThan(keys.indexOf('ok'))
        // restore
        TsUtils.settings.macButtonOrder = false
    })
})

describe('TsUtils.normButtons — btn_<name> structured override', () => {
    it('btn_yes object replaces yes button definition', () => {
        const { options, btn } = makeYesNo({
            btn_yes: { text: 'Confirm', class: 'primary', style: 'color:red', attrs: 'data-x="1"' }
        })
        TsUtils.normButtons(options, btn)
        const actions = options['actions'] as Record<string, unknown>
        const yes = actions['yes'] as Record<string, unknown>
        expect(yes['class']).toBe('primary')
        expect(yes['style']).toBe('color:red')
        expect(yes['attrs']).toBe('data-x="1"')
    })

    it('btn_yes key is deleted from options after consumption', () => {
        const { options, btn } = makeYesNo({
            btn_yes: { text: 'OK', class: '', style: '', attrs: '' }
        })
        TsUtils.normButtons(options, btn)
        expect(options['btn_yes']).toBeUndefined()
    })
})

describe('TsUtils.normButtons — <name>_<suffix> flat override paths', () => {
    it('yes_text override sets yes button text', () => {
        const { options, btn } = makeYesNo({ yes_text: 'Accept' })
        TsUtils.normButtons(options, btn)
        const actions = options['actions'] as Record<string, unknown>
        const yes = actions['yes'] as Record<string, unknown>
        expect(yes['text']).toBe('Accept')
    })

    it('yes_class override sets yes button class', () => {
        const { options, btn } = makeYesNo({ yes_class: 'btn-danger' })
        TsUtils.normButtons(options, btn)
        const actions = options['actions'] as Record<string, unknown>
        const yes = actions['yes'] as Record<string, unknown>
        expect(yes['class']).toBe('btn-danger')
    })

    it('<name>_<suffix> key is deleted from options after consumption', () => {
        const { options, btn } = makeYesNo({ yes_text: 'Accept' })
        TsUtils.normButtons(options, btn)
        expect(options['yes_text']).toBeUndefined()
    })
})

describe('TsUtils.normButtons — empty and edge cases', () => {
    it('empty btn object produces options.actions = {}', () => {
        const options: Record<string, unknown> = {}
        const btn: Record<string, unknown> = {}
        const result = TsUtils.normButtons(options, btn)
        expect(result['actions']).toEqual({})
    })

    it('does not throw on empty options and empty btn', () => {
        expect(() => {
            TsUtils.normButtons({}, {})
        }).not.toThrow()
    })

    it('btn with only yes (no "no" key) does not populate actions from yes/no branch', () => {
        const options: Record<string, unknown> = {}
        const btn: Record<string, unknown> = { yes: 'Yes' }
        TsUtils.normButtons(options, btn)
        const actions = options['actions'] as Record<string, unknown>
        // yes/no branch only fires when BOTH yes and no are present
        expect(actions['yes']).toBeUndefined()
    })
})
