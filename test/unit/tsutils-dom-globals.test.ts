// @vitest-environment node
/**
 * tsutils-dom-globals.test.ts — node-env safety gate (R-DGS-3, R-DGS-8)
 *
 * Verifies that the 4 DOM type-guard helpers do NOT throw ReferenceError
 * when evaluated in a Node.js environment where DOM globals are undefined.
 * Each helper must return false for any input without throwing.
 *
 * RED at commit #1: helpers do not exist yet — import fails.
 * GREEN at commit #2: helpers are appended to tsutils-type-guards.ts.
 */
import { describe, it, expect } from 'vitest'
import { isDOMNode, isDOMEvent, isHTMLElement, isDOMWindow } from '../../src/tsutils-type-guards.js'

describe('DOM type-guards — node env (no DOM globals)', () => {
    it('isDOMNode(null) returns false without throwing', () => {
        expect(() => isDOMNode(null)).not.toThrow()
        expect(isDOMNode(null)).toBe(false)
    })

    it('isDOMNode({}) returns false without throwing', () => {
        expect(() => isDOMNode({})).not.toThrow()
        expect(isDOMNode({})).toBe(false)
    })

    it('isDOMEvent({}) returns false without throwing', () => {
        expect(() => isDOMEvent({})).not.toThrow()
        expect(isDOMEvent({})).toBe(false)
    })

    it('isDOMEvent(null) returns false without throwing', () => {
        expect(() => isDOMEvent(null)).not.toThrow()
        expect(isDOMEvent(null)).toBe(false)
    })

    it('isHTMLElement("x") returns false without throwing', () => {
        expect(() => isHTMLElement('x')).not.toThrow()
        expect(isHTMLElement('x')).toBe(false)
    })

    it('isHTMLElement(null) returns false without throwing', () => {
        expect(() => isHTMLElement(null)).not.toThrow()
        expect(isHTMLElement(null)).toBe(false)
    })

    it('isDOMWindow(undefined) returns false without throwing', () => {
        expect(() => isDOMWindow(undefined)).not.toThrow()
        expect(isDOMWindow(undefined)).toBe(false)
    })

    it('isDOMWindow({}) returns false without throwing', () => {
        expect(() => isDOMWindow({})).not.toThrow()
        expect(isDOMWindow({})).toBe(false)
    })
})
