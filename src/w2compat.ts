/**
 * Part of w2ui 2.0 library
 *  - Dependencies: jQuery, w2ui.*
 *
 * T6.1: w2compat.js → w2compat.ts (last source port).
 * Typing strategy: AGGRESSIVE — no @ts-nocheck.
 *   - jQuery typed via minimal local interface (no @types/jquery; not installed).
 *   - Window augmentation for global registration block.
 *   - Targeted any count: 2
 *     (1) proc() options param — union of plain-object config and method-name string;
 *         dynamic method dispatch cannot be typed without overloads that conflict with `this`.
 *     (2) w2color.show() return — the Tooltip chain is not exposed as a separate named type.
 *
 * This file provided compatibility for projects that continue to use jQuery. It extends
 * jQuery with w2ui support, such as fn.w2grid, fn.w2form, fn.w2render, fn.w2destroy,
 * fn.w2tag, etc.
 *
 * It is not needed for projects that use ES6 module loading.
 *
 * == 2.0 changes
 *   - CSP - fixed inline events
 */

import { w2locale } from './w2locale.js'
import { w2event, w2base } from './w2base.js'
import { w2ui, w2utils } from './w2utils.js'
import { query } from './query.js'
import { w2popup, w2alert, w2confirm, w2prompt, Dialog } from './w2popup.js'
import { w2field } from './w2field.js'
import { w2form } from './w2form.js'
import { w2grid } from './w2grid.js'
import { w2layout } from './w2layout.js'
import { w2sidebar } from './w2sidebar.js'
import { w2tabs } from './w2tabs.js'
import { w2toolbar } from './w2toolbar.js'
import { w2tooltip, w2color, w2menu, w2date, Tooltip } from './w2tooltip.js'

// ---------------------------------------------------------------------------
// Minimal local jQuery interface — @types/jquery is NOT installed.
// We declare only what w2compat uses so TypeScript resolves without errors.
// ---------------------------------------------------------------------------
interface JQueryElement {
    length: number
    [index: number]: HTMLElement
    find(selector: string): JQueryElement
    html(): string
    html(value: string): JQueryElement
    attr(name: string): string | undefined
    each(callback: (index: number, el: HTMLElement) => void): JQueryElement
    data(key: string): unknown
    data(key: string, value: unknown): JQueryElement
}

interface JQueryFn {
    [name: string]: Function // eslint-disable-line @typescript-eslint/ban-types
}

interface JQueryStatic {
    fn: JQueryFn
    w2globals: () => void
    isPlainObject(obj: unknown): boolean
    (selector: string | HTMLElement): JQueryElement
}

// Minimal widget shape — w2base has render(); w2ui widgets also have destroy()
interface W2Widget extends w2base {
    destroy(): void
    formHTML?: string
}

// The registry w2ui typed as Record for dynamic key access
const w2uiRegistry = w2ui as Record<string, W2Widget>

// ---------------------------------------------------------------------------
// Register jQuery plugins
// ---------------------------------------------------------------------------
;(function($: JQueryStatic | undefined) {

    // register globals if needed
    const w2globals = function(): void {
        const exports: Record<string, unknown> = {
            w2ui: w2ui as Record<string, unknown>, w2utils, query, w2locale, w2event, w2base,
            w2popup, w2alert, w2confirm, w2prompt, Dialog,
            w2tooltip, w2menu, w2color, w2date, Tooltip,
            w2toolbar, w2sidebar, w2tabs, w2layout, w2grid, w2form, w2field
        }
        Object.keys(exports).forEach(key => {
            // any: dynamic assignment to window via string key — runtime-validated by w2globals() caller contract
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any)[key] = exports[key]
        })
    }

    // if url has globals at the end, then register globals
    // param typed as string — String(import.meta.url) always returns a string
    const param: string = String(import.meta.url).split('?')[1] || ''
    if (param == 'globals' || param.substr(0, 8) == 'globals=') {
        w2globals()
    }

    // if jQuery is not defined, then exit
    if (!$) return
    $.w2globals = w2globals

    $.fn['w2render'] = function(this: JQueryElement, name: string | W2Widget): void {
        if (this.length > 0) {
            if (typeof name === 'string' && w2uiRegistry[name]) w2uiRegistry[name].render(this[0])
            if (typeof name === 'object') name.render(this[0])
        }
    }

    $.fn['w2destroy'] = function(this: JQueryElement, name?: string | W2Widget): void {
        if (!name && this.length > 0) name = this.attr('name')
        if (typeof name === 'string' && w2uiRegistry[name] != null) w2uiRegistry[name]!.destroy()
        if (typeof name === 'object') name.destroy()
    }

    $.fn['w2field'] = function(this: JQueryElement, type?: string, options?: Record<string, unknown>): w2field | JQueryElement | undefined {
        // if without arguments - return the object
        if (arguments.length === 0) {
            return this.data('w2field') as w2field | undefined
        }
        return this.each((_index: number, el: HTMLElement) => {
            let obj = ($ as JQueryStatic)(el).data('w2field') as w2field | null
            // if object is not defined, define it; otherwise fully re-init
            if (obj == null) {
                obj = new w2field(type as string, options)
                obj.render(el)
            } else {
                obj = new w2field(type as string, options)
                obj.render(el)
            }
        })
    }

    $.fn['w2form']    = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2form', ...args) }
    $.fn['w2grid']    = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2grid', ...args) }
    $.fn['w2layout']  = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2layout', ...args) }
    $.fn['w2sidebar'] = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2sidebar', ...args) }
    $.fn['w2tabs']    = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2tabs', ...args) }
    $.fn['w2toolbar'] = function(this: JQueryElement, options: Record<string, unknown> | string, ...args: unknown[]) { return proc.call(this, options, 'w2toolbar', ...args) }

    // any: options is a union of plain-object config and method-name string; dynamic method
    // dispatch cannot be typed without overloads that conflict with the `this` type binding.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function proc(this: JQueryElement, options: any, type: string, ...args: unknown[]): W2Widget | JQueryElement | null {
        if ($!.isPlainObject(options)) {
            let obj: W2Widget | null = null
            if (type == 'w2form') {
                obj = new w2form(options) as W2Widget
                if (this.find('.w2ui-field').length > 0) {
                    (obj as w2form).formHTML = this.html()
                }
            }
            if (type == 'w2grid') obj = new w2grid(options) as W2Widget
            if (type == 'w2layout') obj = new w2layout(options) as W2Widget
            if (type == 'w2sidebar') obj = new w2sidebar(options) as W2Widget
            if (type == 'w2tabs') obj = new w2tabs(options) as W2Widget
            if (type == 'w2toolbar') obj = new w2toolbar(options) as W2Widget
            if (this.length !== 0 && obj) {
                obj.render(this[0])
            }
            return obj
        } else {
            const widgetName = this.attr('name') ?? ''
            const obj: W2Widget | undefined = w2uiRegistry[widgetName]
            if (!obj) return null
            if (args.length > 0 || typeof options === 'string') {
                // any: dynamic method dispatch — method name is a runtime string on a w2ui widget
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (options && (obj as any)[options]) (obj as any)[options].apply(obj, args)
                return this
            } else {
                return obj
            }
        }
    }

    $.fn['w2popup'] = function(this: JQueryElement, options: { url?: string; [key: string]: unknown }): void {
        if (this.length > 0) {
            w2popup.template(this[0], null, options)
        } else if (options.url) {
            w2popup.load(options)
        }
    }

    $.fn['w2marker'] = function(this: JQueryElement, ...args: (string | string[])[]): JQueryElement {
        let str: string[] = Array.from(args) as string[]
        if (Array.isArray(str[0])) str = str[0] as string[]
        return this.each((_index: number, el: HTMLElement) => {
            w2utils.marker(el, str)
        })
    }

    $.fn['w2tag'] = function(
        this: JQueryElement,
        text?: string | Record<string, unknown> | null,
        options?: Record<string, unknown> | null
    ): JQueryElement {
        return this.each((_index: number, el: HTMLElement) => {
            if (text == null && options == null) {
                w2tooltip.hide()
                return
            }
            let mergedOptions: Record<string, unknown> = {}
            if (typeof text == 'object' && text != null) {
                mergedOptions = text as Record<string, unknown>
            } else {
                mergedOptions = options ?? {}
                mergedOptions['html'] = text
            }
            w2tooltip.show({ anchor: el, ...mergedOptions })
        })
    }

    $.fn['w2overlay'] = function(
        this: JQueryElement,
        html?: string | Record<string, unknown> | null,
        options?: Record<string, unknown>
    ): JQueryElement {
        return this.each((_index: number, el: HTMLElement) => {
            if (html == null && options == null) {
                w2tooltip.hide()
                return
            }
            let mergedOptions: Record<string, unknown> = options ?? {}
            if (typeof html == 'object' && html != null) {
                mergedOptions = html as Record<string, unknown>
            } else {
                mergedOptions['html'] = html
            }
            Object.assign(mergedOptions, {
                class: 'w2ui-white',
                hideOn: ['doc-click']
            })
            w2tooltip.show({ anchor: el, ...mergedOptions })
        })
    }

    $.fn['w2menu'] = function(
        this: JQueryElement,
        menu: unknown[] | Record<string, unknown>,
        options?: Record<string, unknown>
    ): JQueryElement {
        return this.each((_index: number, el: HTMLElement) => {
            let mergedOptions: Record<string, unknown> = options ?? {}
            if (typeof menu == 'object' && !Array.isArray(menu)) {
                mergedOptions = menu as Record<string, unknown>
            } else {
                mergedOptions['items'] = menu
            }
            w2menu.show({ anchor: el, ...mergedOptions })
        })
    }

    $.fn['w2color'] = function(
        this: JQueryElement,
        options: Record<string, unknown>,
        callBack?: (color: string) => void
    ): JQueryElement {
        return this.each((_index: number, el: HTMLElement) => {
            // any: w2color.show() returns the Tooltip chain instance; no separate named interface
            // is exported for the return type without a circular reference to w2tooltip internals.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tooltip = w2color.show({ anchor: el, ...options }) as any
            if (typeof callBack == 'function') {
                tooltip.select(callBack)
            }
        })
    }

// any: window.jQuery is not typed in lib.dom.d.ts (no @types/jquery); runtime presence checked by `if (!$)` guard
// eslint-disable-next-line @typescript-eslint/no-explicit-any
})(( window as any)['jQuery'] as JQueryStatic | undefined)

export {
    w2ui, w2utils, query, w2locale, w2event, w2base,
    w2popup, w2alert, w2confirm, w2prompt, Dialog,
    w2tooltip, w2menu, w2color, w2date, Tooltip,
    w2toolbar, w2sidebar, w2tabs, w2layout, w2grid, w2form, w2field
}
