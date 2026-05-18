import { Q as Query } from './query-CKGg5Ugv.js';
import { T as TsMessageWhere, a as TsMessageOptions, b as TsMessageProm } from './tsutils-message-NW-eqnQ1.js';
export { B as Brand, F as FieldName, L as LayoutPanelId, R as RecId } from './types-CaAxK51B.js';
import './base.js';

/**
 * Part of TsUi 2.0 library — color cluster sub-module
 *  - Extracted from src/tsutils.ts by v2.1 SDD refactor (Phase 2)
 *  - No dependencies on TsBase, TsUtils, or any other sub-module (L1 DAG leaf)
 *  - All exports are plain functions — no default export
 *
 * 4-space indent (project convention for sub-modules).
 */
/** RGB(A) color as returned by parseColor() */
interface TsColorRgb {
    r: number;
    g: number;
    b: number;
    a: number;
}

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
/** Options for TsUtils.clone() */
interface TsCloneOptions {
    functions?: boolean;
    elements?: boolean;
    events?: boolean;
    exclude?: string[] | ((key: string, ctx: {
        obj: unknown;
        parent: string;
    }) => boolean);
    parent?: string;
}
/** Options for TsUtils.normMenu() */
interface TsNormMenuOptions {
    itemMap?: {
        id: string;
        text: string;
    };
    [key: string]: unknown;
}

/**
 * TsUi registry + checkName — Phase 0 of v2.3 SDD.
 * DEPENDENCY-FREE: zero imports from tsutils/tsbase family.
 *
 * Hosts the mutable widget registry object (TsUi) and the name-validation
 * helper (checkName) that were previously coupled to tsbase.ts via tsutils.ts,
 * creating a tsbase ↔ tsutils import cycle. Moving them here breaks that cycle:
 *
 *   tsbase.ts → tsutils-registry.ts → tsutils-type-guards.ts → (leaf)
 *
 * tsutils.ts re-exports TsUi from this module (does NOT re-declare it) to
 * preserve the single-object identity required by INV-12 (referential equality
 * across all import paths).
 *
 * Imports: only isAlphaNumeric from ./tsutils-type-guards.js
 * Exports: TsUi, checkName
 */
/** Widget registry — widgets register here when constructed with a `name`. */
declare const TsUi: Record<string, unknown>;

/**
 * TsUtils DOM sub-module — Phase 5b of v2.4 SDD.
 * DAG position: leaf module (no tsbase/tsutils imports).
 *
 * Imports: ./tsutils-string.js (_encodeTags), ./tsutils-type-guards.js (_isInt),
 *          ./tsutils-data.js (_extend), ./query.js (query, Query), DOM globals only.
 * 4-space indent convention.
 *
 * INV-4: MUST NOT import from tsbase.ts or tsutils.ts.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 */
/** Options for TsUtils.lock() — moved from tsutils.ts (Phase 5a of v2.4 SDD) */
interface TsLockOptions {
    msg?: string | number;
    spinner?: boolean;
    opacity?: number;
    bgColor?: string;
    onClick?: () => void;
}

/**
 * TsUtils date-time sub-module — Phase 5b of v2.5 SDD.
 * DAG position: leaf module (no tsbase/tsutils imports).
 *
 * Imports:
 *   ./tsutils-type-guards.js — isInt as _isInt (needed by isDate, isTime, formatDate, formatTime)
 *   ./tsutils.js             — type-only import type { TsUISettings } (TS erases at emit)
 *                              Precedent: tsutils-type-guards.ts:9, tsutils-message.ts:26
 *
 * INV-4: MUST NOT import from tsbase.ts or tsutils.ts at runtime.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 *
 * 4-space indent convention.
 *
 * OQ-2 (TsTimeResult): local non-exported interface `TsTimeResult` defined inline
 *   here (structurally identical to tsutils.ts copy). Avoids back-import of a
 *   non-exported type; the class delegator in tsutils.ts casts via `as boolean | TsTimeResult`.
 *
 * R-DT-3 (settings reference): `settings` is passed as a reference to `this.settings`
 *   from delegators — never cloned. TsLocale mutations to fullmonths/shortmonths/dateFormat
 *   etc. flow through without restart.
 *
 * R-DT-2 / R-DT-8 (intra-cluster calls): _isDateTime calls _isDate + _isTime directly
 *   as module-level function refs. _formatDateTime calls _formatDate + _formatTime directly.
 *   _formatTime calls _isTime directly. Zero this.X inside any extracted body.
 */

/** Return value from _isTime() / TsUtils.isTime() when retTime === true — single canonical declaration (v2.6 dedup) */
interface TsTimeResult {
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsLocale
 *
 * T2.5: @ts-nocheck removed; file typed aggressively per typing_policy.
 * See commit body for targeted-any inventory.
 *
 * == TODO ==
 *  - add TsUtils.lang wrap for all captions in all buttons.
 *  - check transition (also with layout)
 *  - deprecate TsUtils.tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events (TsUtils.tooltip still has it)
 *  - transition returns a promise
 *  - removed jQuery
 *  - refactores TsUtils.message()
 *  - added TsUtils.confirm()
 *  - added isPlainObject
 *  - added stripSpaces
 *  - implemented marker - can now take an element or just html
 *  - cssPrefix - deprecated
 *  - TsUtils.debounce
 *  - TsUtils.prepareParams
 *  - TsUtils.getStrHeight
 *  - TsUtils.getStrDimentions
 *  - TsUtils.alrert() - same as TsUtils.message()
 *  - TsUtils.prompt() - similar to TsPrompt
 *  - TsUtils.normMenu(..., options) got options parameter that can have itemMap
 *  - TsUtils.getNested()
 *  - TsUtils.wait() - async timer
 */

declare const query: (selector: unknown, context?: unknown) => Query;
/** Settings object merged from TsLocale + user locale overrides */
interface TsUISettings {
    dataType: string;
    dateFormat: string;
    timeFormat: string;
    datetimeFormat: string;
    dateStartYear: number;
    dateEndYear: number;
    currencyPrefix: string;
    currencySuffix: string;
    currencyPrecision: number;
    groupSymbol: string;
    decimalSymbol: string;
    shortmonths: string[];
    fullmonths: string[];
    shortdays: string[];
    fulldays: string[];
    weekStarts: string;
    macButtonOrder: boolean;
    warnNoPhrase: boolean;
    phrases: Record<string, string> | null;
    missing?: Record<string, string>;
    locale?: string;
    [key: string]: unknown;
}
/** Extra data passed to grid cell formatters */
interface TsFormatterExtra {
    value: unknown;
    params?: unknown;
    record?: unknown;
    [key: string]: unknown;
}
/** Signature of a grid-cell formatter function */
type TsFormatter = (record: TsFormatterExtra, extra?: TsFormatterExtra) => string;

/** A normalized menu item */
interface TsMenuItem {
    id: string | number | null;
    text: string;
    caption?: string;
    class?: string;
    style?: string;
    attrs?: string;
    [key: string]: unknown;
}
declare class Utils {
    version: string;
    tmp: Record<string, unknown>;
    settings: TsUISettings;
    i18nCompare: (a: string, b: string) => number;
    hasLocalStorage: boolean;
    isMac: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    formatters: Record<string, TsFormatter>;
    constructor();
    isBin(val: unknown): boolean;
    isInt(val: unknown): boolean;
    isFloat(val: unknown): boolean;
    isMoney(val: unknown): boolean;
    isHex(val: unknown): boolean;
    isAlphaNumeric(val: unknown): boolean;
    isEmail(val: unknown): boolean;
    isIpAddress(val: unknown): boolean;
    isDate(val: unknown, format?: string | null, retDate?: boolean): boolean | Date;
    isTime(val: unknown, retTime?: boolean): boolean | TsTimeResult;
    isDateTime(val: unknown, format?: string | null, retDate?: boolean): boolean | Date;
    age(dateStr: unknown): string;
    interval(value: number): string;
    date(dateStr: unknown): string;
    formatSize(sizeStr: unknown): string | number;
    formatNumber(val: unknown, fraction?: number | string | null, useGrouping?: boolean): string;
    formatDate(dateStr: unknown, format?: string | null): string;
    formatTime(dateStr: unknown, format?: string | null): string;
    formatDateTime(dateStr: unknown, format?: string | null): string;
    stripSpaces(html: unknown): unknown;
    stripTags(html: unknown): unknown;
    encodeTags(html: unknown): unknown;
    decodeTags(html: unknown): unknown;
    escapeId(id: unknown): string;
    unescapeId(id: string | null | undefined): string;
    base64encode(str: string): string;
    base64decode(encodedStr: string): string;
    sha256(str: string): Promise<string>;
    transition(div_old: HTMLElement, div_new: HTMLElement, type: string, callBack?: () => void): Promise<void>;
    lock(box: unknown, options?: TsLockOptions | string, ...rest: unknown[]): void;
    unlock(box: unknown, speed?: number): void;
    /**
     * Opens a context message, similar in parameters as TsPopup.open()
     *
     * Sample Calls
     * TsUtils.message({ box: '#div', text: 'message' }).ok(() => {})
     * TsUtils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
     * TsUtils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
     *
     * Used in TsGrid, TsForm, TsLayout (should be in TsPopup too)
     * should be called with .call(...) method
     *
     * @param where = {
     *      box,     // where to open
     *      after,   // title if any, adds title heights
     *      param    // additional parameters, used in layouts for panel
     * }
     * @param options {
     *      width,      // (int), width in px, if negative, then it is maxWidth - width
     *      height,     // (int), height in px, if negative, then it is maxHeight - height
     *      text,       // centered text
     *      body,       // body of the message
     *      buttons,    // buttons of the message
     *      html,       // if body & buttons are not defined, then html is the entire message
     *      focus,      // int or id with a selector, default is 0
     *      hideOn,     // ['esc', 'click'], default is ['esc']
     *      actions,    // array of actions (only if buttons is not defined)
     *      onOpen,     // event when opened
     *      onClose,    // event when closed
     *      onAction,   // event on action
     * }
     */
    message(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined;
    alert(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined;
    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
     * but it will have options similar to TsPrompt dialog
     *
     * Example:
     *  - TsUtils.conrirm({
     *       box: '#custom',
     *       text: 'Some message'
     *    })
     *    .yes(event => console.log(event))
     */
    confirm(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined;
    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
     * but it will have options similar to TsPrompt dialog
     *
     * Example:
     *  - TsUtils.prompt({
     *       box: '#custom',
     *       label: 'Enter Name',
     *       textarea: false,
     *       attrs: 'style="border: 1px solid red"'
     *    })
     *    .ok(event => console.log(event))
     */
    prompt(where: TsMessageWhere, options?: TsMessageOptions | string | number): TsMessageProm | undefined;
    /**
     * Normalizes yes, no buttons for confirmation dialog
     *
     * @param {*} options
     * @returns  options
     */
    normButtons(options: Record<string, unknown>, btn: Record<string, unknown>): Record<string, unknown>;
    /**
     * Shows small notification message at the bottom of the page, or containter that you specify
     * in options.where (could be element or a selector)
     *
     * TsUtils.notify('Document saved')
     * TsUtils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
     *
     * @param {String/Object} options can be {
     *      text: string,       // message, can be html
     *      where: el/selector, // element or selector where to show, default is document.body
     *      timeout: int,       // timeout when to hide, if 0 - indefinite
     *      error: boolean,     // add error clases
     *      class: string,      // additional class strings
     *      actions: object     // object with action functions, it should correspot to templated text: '... ${action} ...'
     *  }
     * @returns promise
     */
    notify(text: string | Record<string, unknown>, options?: Record<string, unknown>): Promise<void>;
    getSize(el: unknown, type: string): number;
    getStrDimentions(str: string, styles?: string, raw?: boolean): {
        width: number;
        height: number;
    };
    getStrWidth(str: string, styles?: string, raw?: boolean): number;
    getStrHeight(str: string, styles?: string, raw?: boolean): number;
    execTemplate(str: any, replace_obj: any): any;
    marker(el: any, items: any, options?: any): unknown;
    lang(phrase: string, params?: Record<string, string | number> | boolean): string;
    locale(locale: string | string[] | Record<string, unknown>, keepPhrases?: boolean, noMerge?: boolean): Promise<{
        file: string;
        data: unknown;
    } | void>;
    scrollBarSize(): unknown;
    checkName(name: string): boolean;
    checkUniqueId(id: any, items: any, desc: any, obj: any): boolean;
    /**
     * Takes an object and encodes it into params string to be passed as a url
     * { a: 1, b: 'str'}                => "a=1&b=str"
     * { a: 1, b: { c: 2 }}             => "a=1&b[c]=2"
     * { a: 1, b: {c: { k: 'dfdf' } } } => "a=1&b[c][k]=dfdf"
     */
    encodeParams(obj: any, prefix?: string): string;
    parseRoute(route: string): {
        path: RegExp;
        keys: {
            name: string;
            optional: boolean;
        }[];
    };
    getCursorPosition(input: any): number | null;
    setCursorPosition(input: HTMLElement | null, pos: number, posEnd?: number): void;
    parseColor(str: string | null | undefined): TsColorRgb | null;
    colorContrast(color1: string, color2: string): string;
    colorContrastValue(color1: string, color2: string): number;
    hsv2rgb(h: any, s?: any, v?: any, a?: any): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    rgb2hsv(r: any, g?: any, b?: any, a?: any): {
        h: number;
        s: number;
        v: number;
        a: number;
    };
    tooltip(html: string | Record<string, unknown>, options?: Record<string, unknown>): string;
    isPlainObject(value: unknown): boolean;
    /**
     * Deep copy of an object or an array. Function, events and HTML elements will not be cloned,
     * you can choose to include them or not, by default they are included.
     * You can also exclude certain elements from final object if used with options: { exclude }
     */
    clone(obj: unknown, options?: Partial<TsCloneOptions>): any;
    /**
     * Deep extend an object, if an array, it overwrrites it, cloning objects in the process
     * target, source1, source2, ...
     */
    extend(target: any, source: any, ...rest: unknown[]): any;
    naturalCompare(a: unknown, b: unknown): number;
    /**
     * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
     * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
     * to find out id and text fields.
     */
    normMenu(menu: unknown, options?: TsNormMenuOptions): TsMenuItem[] | undefined;
    /**
     * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
     * dataType is in TsUtils. This method is used in grid, form and tooltip to prepare fetch parameters
     */
    prepareParams(url: URL, fetchOptions: Record<string, unknown>, options?: Record<string, unknown>): Record<string, unknown>;
    bindEvents(selector: unknown, subject: Record<string, unknown>): void;
    debounce(func: (...args: any[]) => void, wait?: number): (...args: any[]) => void;
    wait(time?: number): Promise<void>;
    getNested(obj: any, prop: any): unknown;
}
declare var TsUtils: Utils;

export { type TsCloneOptions, type TsColorRgb, type TsLockOptions, type TsMenuItem, TsMessageOptions, TsMessageProm, TsMessageWhere, type TsNormMenuOptions, type TsTimeResult, type TsUISettings, TsUi, TsUtils, query };
