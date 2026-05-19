/**
 * TsUtils v2.1 — Data / Object helpers sub-module (Phase 3+4 of v2.1 SDD)
 *
 * Contains: TsCloneOptions, clone, extend,
 *           naturalCompare, normMenu, getNested, encodeParams,
 *           prepareParams, parseRoute, debounce, wait
 *
 * Rules:
 *  - No default export
 *  - No import from tsbase.ts (INV-4)
 *  - No this.-dispatch inside function bodies (INV-8)
 *  - 4-space indent
 */

import { isPlainObject, isDOMNode, isDOMEvent } from './tsutils-type-guards.js'

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
                || (isDOMNode(obj) && !opts.elements)
                || (isDOMEvent(obj) && !opts.events)
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
    } else if (isDOMNode(target) || isDOMEvent(target)) {
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
                if (isDOMNode(target[key]) || isDOMEvent(target[key])) {
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

// ---------------------------------------------------------------------------
// Types — Phase 4
// ---------------------------------------------------------------------------

/** Options for TsUtils.normMenu() */
export interface TsNormMenuOptions {
    itemMap?: { id: string; text: string }
    [key: string]: unknown
}

// ---------------------------------------------------------------------------
// naturalCompare
// ---------------------------------------------------------------------------

/*
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
export function naturalCompare(a: unknown, b: unknown): number {
    let i: number = 0, codeA: number = 0, codeB = 1, posA = 0, posB = 0
    // any: String.alphabet is an optional user-defined extension for custom sort order (non-standard)
    const alphabet = (String as unknown as Record<string, unknown>)['alphabet'] as string | undefined

    function getCode(str: string, pos: number, code?: number): number {
        if (code) {
            for (i = pos; (code = getCode(str, i)) , code < 76 && code > 65;) ++i
            return +str.slice(pos - 1, i)
        }
        let c: number = alphabet ? alphabet.indexOf(str.charAt(pos)) : -1
        return c > -1 ? c + 76 : ((c = str.charCodeAt(pos) || 0), c < 45 || c > 127) ? c
            : c < 46 ? 65 // -
            : c < 48 ? c - 1
            : c < 58 ? c + 18 // 0-9
            : c < 65 ? c - 11
            : c < 91 ? c + 11 // A-Z
            : c < 97 ? c - 37
            : c < 123 ? c + 5 // a-z
            : c - 63
    }

    const aStr = '' + a, bStr = '' + b
    if (aStr != bStr) for (;codeB;) {
        codeA = getCode(aStr, posA++)
        codeB = getCode(bStr, posB++)

        if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
            codeA = getCode(aStr, posA, posA)
            codeB = getCode(bStr, posB, posA = i)
            posB  = i
        }

        if (codeA != codeB) return (codeA < codeB) ? -1 : 1
    }
    return 0
}

// ---------------------------------------------------------------------------
// getNested
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNested(obj: any, prop: any): unknown { // any: traverses arbitrary nested objects via dot-path string
    let val: unknown
    try { // need this to make sure no error in props
        val = obj
        const tmp = String(prop).split('.')
        for (let i = 0; i < tmp.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            val = (val as any)[tmp[i] ?? ''] // any: dynamic property access on unknown nested object
        }
    } catch (event) {
        val = undefined
    }
    return val
}

// ---------------------------------------------------------------------------
// normMenu
// ---------------------------------------------------------------------------

/**
 * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
 * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
 * to find out id and text fields.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normMenu(menu: unknown, options: TsNormMenuOptions = {}): any[] | undefined {
    if (Array.isArray(menu)) {
        menu.forEach((it, m) => {
            if (typeof it === 'string' || typeof it === 'number') {
                menu[m] = { id: it, text: String(it) }
            } else if (it != null) {
                if (options.itemMap != null) {
                    let val = getNested(it, options.itemMap.id)
                    if (options.itemMap.id != null && val != null) {
                        it.id = val
                    }
                    val = getNested(it, options.itemMap.text)
                    if (options.itemMap.text != null && val) {
                        it.text = val
                    }
                }
                if (it.caption != null && it.text == null) it.text = it.caption
                if (it.text != null && it.id == null) it.id = it.text
                if (it.text == null && it.id != null) it.text = it.id
            } else {
                menu[m] = { id: null, text: 'null' }
            }
        })
        return menu
    } else if (typeof menu === 'function') {
        // N4 fix: was TsUtils.normMenu.call(this, newMenu, options) — drop .call(this, ...) chain
        const newMenu = menu(menu, options)
        return normMenu(newMenu, options)
    } else if (typeof menu === 'object' && menu !== null) {
        const menuObj = menu as Record<string, unknown>
        return Object.keys(menuObj).map(key => { return { id: key, text: String(menuObj[key] ?? '') } })
    }
}

// ---------------------------------------------------------------------------
// encodeParams
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeParams(obj: any, prefix = ''): string { // any: arbitrary nested object from user code
    let str = ''
    Object.keys(obj).forEach(key => {
        if (str != '') str += '&'
        if (typeof obj[key] == 'object') {
            str += encodeParams(obj[key], prefix + key + (prefix ? ']' : '') + '[')
        } else {
            str += `${prefix}${key}${prefix ? ']' : ''}=${obj[key]}`
        }
    })
    return str
}

// ---------------------------------------------------------------------------
// prepareParams
// ---------------------------------------------------------------------------

/**
 * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
 * dataType is in TsUtils. This method is used in grid, form and tooltip to prepare fetch parameters.
 * The `defaultDataType` parameter replaces TsUtils.settings.dataType (stateful trio pattern).
 */
export function prepareParams(url: URL, fetchOptions: Record<string, unknown>, options: Record<string, unknown>, defaultDataType: string): Record<string, unknown> {
    const dataType = (options?.['dataType'] as string | undefined) ?? defaultDataType
    let postParams = fetchOptions['body']
    fetchOptions['method'] = String(fetchOptions['method']).toUpperCase()
    switch (dataType) {
        /**
         * Will submit GET, POST, PUT, DELETE
         * - if GET - it will be in URL
         * - if POST, PUT, DELETE it will be JSON encoded
         */
        case 'RESTFULL':
        case 'RESTFULJSON': {
            if (['POST', 'PUT', 'DELETE'].includes(String(fetchOptions['method']))) {
                ;(fetchOptions['headers'] as Record<string, string>)['Content-Type'] = 'application/json'
            }
            if (String(fetchOptions['method']) == 'GET') {
                // any: cast-to-any for dynamic dispatch; TsUtils helper accepts heterogeneous runtime input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((dataType as any) == 'RESTFULLJSON') { // note: pre-existing typo in original code (RESTFULLJSON vs RESTFULJSON)
                    postParams = { request: postParams }
                }
                body2params()
            }
            break
        }
        /**
         * Will submit either GET or POST and
         * - if POST it will be JSON encoded
         * - if GET it will be in URL
         * - if HTTPJSON and GET then it will be JSON encoded
         */
        case 'HTTP':
        case 'HTTPJSON':
        case 'JSON': {
            if (String(fetchOptions['method']) == 'GET') {
                if (dataType == 'JSON' || dataType === 'HTTPJSON') {
                    postParams = { request: postParams }
                }
                body2params()
            } else {
                ;(fetchOptions['headers'] as Record<string, string>)['Content-Type'] = 'application/json'
                fetchOptions['method'] = 'POST'
            }
            break
        }
        default: {
            if (typeof dataType == 'function') {
                // do nothing, it is custom function that will handle everything
                fetchOptions = (dataType as unknown as (u: URL, f: Record<string, unknown>, o: Record<string, unknown>) => Record<string, unknown>)(url, fetchOptions, options)
            } else {
                console.log(`ERROR: Unsupported dataType "${dataType}". Supported types are JSON (default), HTTP, RESTFULL. For backward compatibility HTTPJSON is same as JSON. RESTULFLJSON will encode GET request as JSON.`)
            }
        }
    }
    if (fetchOptions['body'] != null) {
        fetchOptions['body'] = typeof fetchOptions['body'] == 'string' ? fetchOptions['body'] : JSON.stringify(fetchOptions['body'])
    }
    return fetchOptions

    function body2params() {
        const pp = postParams as Record<string, unknown>
        Object.keys(pp).forEach(key => {
            let param: unknown = pp[key]
            if (typeof param == 'object') param = JSON.stringify(param)
            url.searchParams.append(key, String(param ?? ''))
        })
        delete fetchOptions['body']
    }
}

// ---------------------------------------------------------------------------
// parseRoute
// ---------------------------------------------------------------------------

export function parseRoute(route: string): { path: RegExp; keys: { name: string; optional: boolean }[] } {
    const keys: { name: string; optional: boolean }[] = []
    const path = route
        .replace(/\/\(/g, '(?:/')
        .replace(/\+/g, '__plus__')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_: any, slash: any, format: any, key: any, capture: any, optional: any) => { // any: regex replace callback; args are untyped capture groups
            keys.push({ name: key, optional: !! optional })
            slash = slash || ''
            return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '')
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/__plus__/g, '(.+)')
        .replace(/\*/g, '(.*)')
    return {
        path  : new RegExp('^' + path + '$', 'i'),
        keys  : keys
    }
}

// ---------------------------------------------------------------------------
// debounce
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce(func: (...args: any[]) => void, wait = 250): (...args: any[]) => void { // any: debounce wraps arbitrary functions
    let timeout: ReturnType<typeof setTimeout> | undefined
    return (...args: unknown[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => { func(...args) }, wait)
    }
}

// ---------------------------------------------------------------------------
// wait
// ---------------------------------------------------------------------------

export async function wait(time = 0): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), time)
    })
}
