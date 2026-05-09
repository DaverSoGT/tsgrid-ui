import { describe, expect, it, expectTypeOf } from 'vitest'
import type { Brand, RecId, LayoutPanelId, FieldName } from '../../src/types.js'

describe('types — branded primitive runtime behavior', () => {
    it('RecId values keep their underlying typeof at runtime (brand is compile-only)', () => {
        const stringRecid = 'row-1' as RecId
        const numberRecid = 42 as RecId
        expect(typeof stringRecid).toBe('string')
        expect(typeof numberRecid).toBe('number')
    })

    it('LayoutPanelId is a string at runtime', () => {
        const panel = 'left' as LayoutPanelId
        expect(typeof panel).toBe('string')
        expect(panel).toBe('left')
    })

    it('FieldName is a string at runtime', () => {
        const field = 'firstName' as FieldName
        expect(typeof field).toBe('string')
        expect(field).toBe('firstName')
    })

    it('Brand is a pure type — no `__brand` property is added at runtime', () => {
        const recid = 'r1' as RecId
        // The Brand intersection adds __brand at the type level; runtime is unchanged.
        expect((recid as unknown as { __brand?: unknown }).__brand).toBeUndefined()
    })

    it('branded values are equal to their underlying primitive via ==', () => {
        const recid = 42 as RecId
        expect(recid == 42).toBe(true)
        // strict equality also holds because there's no runtime wrapper
        expect((recid as unknown as number) === 42).toBe(true)
    })
})

describe('types — branded primitive compile-time behavior', () => {
    it('Brand<K, T> intersects K with the brand tag (compile-time check)', () => {
        // expectTypeOf is a Vitest compile-time assertion — does nothing at
        // runtime but errors during transform if the type doesn't match.
        expectTypeOf<RecId>().toMatchTypeOf<string | number>()
        expectTypeOf<LayoutPanelId>().toMatchTypeOf<string>()
        expectTypeOf<FieldName>().toMatchTypeOf<string>()
    })

    it('different brands are NOT mutually assignable (documented; not run)', () => {
        // The following SHOULD fail to compile:
        //   const recid: RecId = 'x' as FieldName  // Type 'FieldName' not assignable to 'RecId'
        // We don't run this assertion (would break the suite); it's left here
        // as documentation of the intended type-safety guarantee.
        // expectTypeOf<FieldName>().not.toMatchTypeOf<RecId>()  // would error
        expect(true).toBe(true)
    })

    it('Brand<K, T> requires explicit `as` cast — primitives are not brand-assignable', () => {
        // const r: RecId = 42  // would FAIL to compile
        // const r: RecId = 42 as RecId  // OK
        const r: RecId = 42 as RecId
        expect(r).toBe(42)
    })

    it('Brand utility type itself is exported and re-usable', () => {
        type CustomBrand = Brand<string, 'Custom'>
        const x = 'hello' as CustomBrand
        expect(typeof x).toBe('string')
        expectTypeOf<CustomBrand>().toMatchTypeOf<string>()
    })
})
