/**
 * TsUtils v2.1 — Data / Object helpers sub-module (Phase 3 of v2.1 SDD)
 *
 * Contains: TsCloneOptions, clone, extend
 * Phase 4 will append: naturalCompare, normMenu, getNested, encodeParams,
 *                       prepareParams, parseRoute, debounce, wait
 *
 * Rules:
 *  - No default export
 *  - No import from tsbase.ts (INV-4)
 *  - No this.-dispatch inside function bodies (INV-8)
 *  - 4-space indent
 */

import { isPlainObject } from './tsutils-type-guards.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Options for TsUtils.clone() */
export interface TsCloneOptions {
    functions?: boolean
    elements?: boolean
    events?: boolean
    exclude?: string[] | ((key: string, ctx: { obj: unknown; parent: string }) => boolean)
    parent?: string
}

// ---------------------------------------------------------------------------
// clone
// ---------------------------------------------------------------------------

/**
 * Deep copy of an object or an array. Functions, events and HTML elements will
 * not be cloned by default; use options to override.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clone(obj: unknown, options?: Partial<TsCloneOptions>): any {
    const opts: Required<TsCloneOptions> = Object.assign(
        { functions: true, elements: true, events: true, exclude: [] as TsCloneOptions['exclude'], parent: '' },
        options ?? {}
    ) as Required<TsCloneOptions>
    if (Array.isArray(obj)) {
        const arr: unknown[] = Array.from(obj)
        arr.forEach((value, ind) => {
            arr[ind] = clone(value, { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: (opts.parent) + '[]' })
        })
        return arr
    } else if (isPlainObject(obj)) {
        const ret: Record<string, unknown> = {}
        Object.assign(ret, obj)
        // delete excluded keys
        if (Array.isArray(opts.exclude)) {
            opts.exclude.forEach((key: string) => { delete ret[key] })
        }
        Object.keys(ret).forEach(key => {
            if (typeof opts.exclude == 'function' && opts.exclude(key, { obj, parent: opts.parent })) {
                ret[key] = undefined
            } else {
                ret[key] = clone(ret[key], { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: opts.parent + (opts.parent ? '.' : '') + key })
            }
            if (ret[key] === undefined) delete ret[key] // do not include undefined elements
        })
        return ret
    } else {
        if ((obj instanceof Function && !opts.functions)
                || (obj instanceof Node && !opts.elements)
                || (obj instanceof Event && !opts.events)
        ) {
            // do not include these objects, otherwise include them uncloned
            return undefined
        } else {
            // primitive variable or function, event, dom element, etc — not cloned
            return obj
        }
    }
}

// ---------------------------------------------------------------------------
// extend
// ---------------------------------------------------------------------------

/**
 * Deep extend an object; if an array, it overwrites it, cloning objects in the
 * process. Signature: extend(target, source1, source2, ...)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extend(target: any, source: any, ...rest: unknown[]): any { // any: generic deep-extend; arbitrary object shapes at runtime
    if (Array.isArray(target)) {
        if (Array.isArray(source)) {
            target.splice(0, target.length) // empty array but keep the reference
            source.forEach(s => { target.push(clone(s)) })
        } else {
            throw new Error('Arrays can be extended with arrays only')
        }
    } else if (target instanceof Node || target instanceof Event) {
        throw new Error('HTML elmenents and events cannot be extended')
    } else if (target && typeof target == 'object' && source != null) {
        if (typeof source != 'object') {
            throw new Error('Object can be extended with other objects only.')
        }
        Object.keys(source).forEach(key => {
            if (target[key] != null && typeof target[key] == 'object'
                    && source[key] != null && typeof source[key] == 'object') {
                const src = clone(source[key])
                // do not extend HTML elements and events, but overwrite them
                if (target[key] instanceof Node || target[key] instanceof Event) {
                    target[key] = src
                } else {
                    // if an array needs to be extended with an object, then convert it to empty object
                    if (Array.isArray(target[key]) && isPlainObject(src)) {
                        target[key] = {}
                    }
                    extend(target[key], src)
                }
            } else {
                target[key] = clone(source[key])
            }
        })
    } else if (source != null) {
        throw new Error('Object is not extendable, only {} or [] can be extended.')
    }
    // other arguments
    if (rest.length > 0) {
        for (let i = 0; i < rest.length; i++) {
            extend(target, rest[i])
        }
    }
    return target
}
