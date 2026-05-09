/**
 * Part of w2ui 2.0 library
 *  - Dependencies: w2utils
 *  - on/off/trigger methods id not showing in help
 *  - refactored with event object
 *
 * Chanes in 2.0.+
 * - added unmount that cleans up the box
 *
 */
interface W2EventData {
    type?: string | null;
    target?: unknown;
    phase?: string;
    object?: unknown;
    [key: string]: unknown;
}
interface W2EventListener {
    name: string;
    edata: {
        type: string | null;
        execute: string;
        onComplete: null;
        scope?: string;
        handler?: unknown;
        [key: string]: unknown;
    };
    handler: Function;
}
declare class w2event {
    type: string | null;
    detail: W2EventData;
    owner: w2base;
    target: unknown;
    phase: string;
    object: unknown;
    execute: null;
    isStopped: boolean;
    isCancelled: boolean;
    onComplete: ((edata: w2event) => void) | null;
    listeners: Array<(edata: w2event) => void>;
    complete: Promise<w2event>;
    _resolve: (value: w2event) => void;
    _reject: (reason?: unknown) => void;
    constructor(owner: w2base, edata: W2EventData);
    finish(detail?: Partial<W2EventData>): void;
    done(func: (edata: w2event) => void): void;
    preventDefault(): void;
    stopPropagation(): void;
}
declare class w2base {
    activeEvents: w2event[];
    listeners: W2EventListener[];
    debug: boolean;
    name?: string;
    box?: HTMLElement | null;
    [key: string]: unknown;
    /**
     * Initializes base object for w2ui, registers it with w2ui object
     *
     * @param {string} name  - name of the object
     * @returns
     */
    constructor(name?: string);
    /**
     * Adds event listener, supports event phase and event scoping
     *
     * @param {*} edata - an object or string, if string "eventName:phase.scope"
     * @param {*} handler
     * @returns itself
     */
    on(events: string | W2EventData | Array<string | W2EventData>, handler: Function): this;
    /**
     * Removes event listener, supports event phase and event scoping
     *
     * @param {*} edata - an object or string, if string "eventName:phase.scope"
     * @param {*} handler
     * @returns itself
     */
    off(events: string | W2EventData | Array<string | W2EventData>, handler?: Function): this;
    /**
     * Triggers even listeners for a specific event, loops through this.listeners
     *
     * @param {Object} edata - Object
     * @returns modified edata
     *
     * NOTE: `edata` is typed as `any` here intentionally. The method mutates the argument
     * from W2EventData into a w2event mid-execution. Runtime type mutation is inherent
     * to the event dispatch pattern. Phase 6 strict tighten will revisit this.
     */
    trigger(eventName: string | W2EventData | w2event, edataIn?: W2EventData): w2event;
    /**
     * This method renders component into the box. It is overwritten in descendents and in this base
     * component it is empty.
     */
    render(_box?: HTMLElement | string | null): void;
    /**
     * Removes all classes that start with w2ui-* and sets box to null. It is needed so that control will
     * release the box to be used for other widgets
     */
    unmount(): void;
}

type QuerySelector = string | Node | Window | Query | Array<Node | Element> | Iterable<Node | Element> | null | undefined;
type QueryContext = Document | Element | ShadowRoot | DocumentFragment;
interface EventRecord {
    event: string;
    scope: string | undefined;
    callback: EventListener;
    options: AddEventListenerOptions | boolean | undefined;
}
interface MQueryData {
    events?: EventRecord[];
    prevDisplay?: string;
    [key: string]: unknown;
}
declare global {
    interface Node {
        _mQuery?: MQueryData;
    }
}
declare class Query {
    static version: number;
    context: QueryContext;
    nodes: Node[];
    length: number;
    [index: number]: Node;
    constructor(selector: QuerySelector, context?: QueryContext);
    static _fragment(html: string): DocumentFragment;
    static _scriptConvert(node: Node): Node;
    static _fixProp(name: string): string;
    _insert(method: string, html: string | Query | Node): Query;
    _save(node: Node, name: string, value: unknown): void;
    get(index?: number): Node | Node[] | null;
    eq(index: number): Query;
    then(fun: (q: Query) => Query | null | undefined): Query;
    find(selector: string): Query;
    filter(selector: string | Node | ((node: Node) => boolean)): Query;
    next(): Query;
    prev(): Query;
    shadow(selector?: string): Query;
    closest(selector: string): Query;
    host(all?: boolean): Query;
    parent(selector?: string): Query;
    parents(selector?: string, firstOnly?: boolean): Query;
    add(more: Query | Node | Node[]): Query;
    each(func: (node: Node, ind: number, col: Query) => void): Query;
    append(html: string | Query | Node): Query;
    prepend(html: string | Query | Node): Query;
    after(html: string | Query | Node): Query;
    before(html: string | Query | Node): Query;
    replace(html: string | Query | Node): Query;
    remove(): Query;
    css(key?: string | Record<string, string | number>, value?: string | number): string | Record<string, string> | undefined | Query;
    addClass(classes: string): Query;
    removeClass(classes: string | string[] | null): Query;
    toggleClass(classes: string | string[] | null, force?: boolean): Query;
    hasClass(classes: string | string[] | null): boolean | string[];
    on(events: string, options: AddEventListenerOptions | EventListener | {
        delegate?: string;
    } | undefined, callback?: EventListener): Query;
    on(events: string, callback: EventListener): Query;
    off(events?: string, options?: AddEventListenerOptions | EventListener, callback?: EventListener): Query;
    trigger(name: string | Event | CustomEvent, options?: EventInit): Query;
    attr(name: string): string | undefined;
    attr(name: string | Record<string, string>, value?: string): Query;
    removeAttr(...attrs: string[]): Query;
    prop(name: string): unknown;
    prop(name: string | Record<string, unknown>, value?: unknown): Query;
    removeProp(...props: string[]): Query;
    data(key?: string | Record<string, unknown>, value?: unknown): unknown | Query;
    removeData(key: string | string[]): Query;
    show(): Query;
    hide(): Query;
    toggle(force?: boolean): Query;
    empty(): Query;
    html(html?: string | HTMLElement): string | Query | undefined;
    text(text?: string): unknown | Query;
    val(value?: string): unknown | Query;
    change(): Query;
    click(): Query;
}

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2locale
 *
 * T2.5: @ts-nocheck removed; file typed aggressively per typing_policy.
 * See commit body for targeted-any inventory.
 *
 * == TODO ==
 *  - add w2utils.lang wrap for all captions in all buttons.
 *  - check transition (also with layout)
 *  - deprecate w2utils.tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events (w2utils.tooltip still has it)
 *  - transition returns a promise
 *  - removed jQuery
 *  - refactores w2utils.message()
 *  - added w2utils.confirm()
 *  - added isPlainObject
 *  - added stripSpaces
 *  - implemented marker - can now take an element or just html
 *  - cssPrefix - deprecated
 *  - w2utils.debounce
 *  - w2utils.prepareParams
 *  - w2utils.getStrHeight
 *  - w2utils.getStrDimentions
 *  - w2utils.alrert() - same as w2utils.message()
 *  - w2utils.prompt() - similar to w2prompt
 *  - w2utils.normMenu(..., options) got options parameter that can have itemMap
 *  - w2utils.getNested()
 *  - w2utils.wait() - async timer
 */

declare const query: (selector: unknown, context?: unknown) => Query;
declare const w2ui: Record<string, unknown>;
/** Settings object merged from w2locale + user locale overrides */
interface W2UISettings {
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
interface W2FormatterExtra {
    value: unknown;
    params?: unknown;
    record?: unknown;
    [key: string]: unknown;
}
/** Signature of a grid-cell formatter function */
type W2Formatter = (record: W2FormatterExtra, extra?: W2FormatterExtra) => string;
/** Options for w2utils.lock() */
interface W2LockOptions {
    msg?: string | number;
    spinner?: boolean;
    opacity?: number;
    bgColor?: string;
    onClick?: () => void;
}
/** Return value from w2utils.isTime() when retTime === true */
interface W2TimeResult {
    hours: number;
    minutes: number;
    seconds: number;
}
/** RGB(A) color as returned by w2utils.parseColor() */
interface W2Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
/** A normalized menu item */
interface W2MenuItem {
    id: string | number | null;
    text: string;
    caption?: string;
    class?: string;
    style?: string;
    attrs?: string;
    [key: string]: unknown;
}
/** Options for w2utils.normMenu() */
interface W2NormMenuOptions {
    itemMap?: {
        id: string;
        text: string;
    };
    [key: string]: unknown;
}
/** Options for w2utils.clone() */
interface W2CloneOptions {
    functions?: boolean;
    elements?: boolean;
    events?: boolean;
    exclude?: string[] | ((key: string, ctx: {
        obj: unknown;
        parent: string;
    }) => boolean);
    parent?: string;
}
/** Promise-chain handle returned by w2utils.message() / .confirm() / .prompt() */
interface W2MessageProm {
    self: w2base;
    action(callBack: (event: unknown) => void): W2MessageProm;
    close(callBack: (event: unknown) => void): W2MessageProm;
    open(callBack: (event: unknown) => void): W2MessageProm;
    then(callBack: (event: unknown) => void): W2MessageProm;
    change?: (callBack: (event: unknown) => void) => W2MessageProm;
    [key: string]: unknown;
}
/** Where-descriptor for w2utils.message() */
interface W2MessageWhere {
    box: string | Element | null;
    after?: string | Element | null;
    owner?: {
        name?: string;
        lock?: (...args: unknown[]) => void;
        unlock?: (...args: unknown[]) => void;
        focus?: () => void;
    };
    param?: unknown;
}
/** Options for w2utils.message() */
interface W2MessageOptions {
    width?: number;
    height?: number;
    text?: string | null;
    body?: string;
    buttons?: string;
    html?: string;
    focus?: number | string | null;
    hideOn?: string[];
    actions?: Record<string, unknown>;
    cancelAction?: string;
    on?: unknown;
    onOpen?: unknown;
    onClose?: unknown;
    onAction?: unknown;
    originalWidth?: number;
    originalHeight?: number;
    msgIndex?: number;
    tmp?: {
        zIndex: string;
        overflow: string;
    };
    input?: Element | null;
    box?: Element | null;
    trigger?: (event: string, data: Record<string, unknown>) => unknown;
    close?: () => void;
    setFocus?: (focus: number | string | null | undefined) => void;
    action?: (action: string, event: unknown) => void;
    [key: string]: unknown;
}
declare class Utils {
    version: string;
    tmp: Record<string, unknown>;
    settings: W2UISettings;
    i18nCompare: (a: string, b: string) => number;
    hasLocalStorage: boolean;
    isMac: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    formatters: Record<string, W2Formatter>;
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
    isTime(val: unknown, retTime?: boolean): boolean | W2TimeResult;
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
    lock(box: unknown, options?: W2LockOptions | string, ...rest: unknown[]): void;
    unlock(box: unknown, speed?: number): void;
    /**
     * Opens a context message, similar in parameters as w2popup.open()
     *
     * Sample Calls
     * w2utils.message({ box: '#div', text: 'message' }).ok(() => {})
     * w2utils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
     * w2utils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
     *
     * Used in w2grid, w2form, w2layout (should be in w2popup too)
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
    message(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined;
    alert(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined;
    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
     * but it will have options similar to w2prompt dialog
     *
     * Example:
     *  - w2utils.conrirm({
     *       box: '#custom',
     *       text: 'Some message'
     *    })
     *    .yes(event => console.log(event))
     */
    confirm(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined;
    /**
     * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
     * but it will have options similar to w2prompt dialog
     *
     * Example:
     *  - w2utils.prompt({
     *       box: '#custom',
     *       label: 'Enter Name',
     *       textarea: false,
     *       attrs: 'style="border: 1px solid red"'
     *    })
     *    .ok(event => console.log(event))
     */
    prompt(where: W2MessageWhere, options?: W2MessageOptions | string | number): W2MessageProm | undefined;
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
     * w2utils.notify('Document saved')
     * w2utils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
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
        width: any;
        height: any;
    };
    getStrWidth(str: string, styles?: string, raw?: boolean): any;
    getStrHeight(str: string, styles?: string, raw?: boolean): any;
    execTemplate(str: any, replace_obj: any): any;
    marker(el: any, items: any, options?: any): any;
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
    parseColor(str: string | null | undefined): W2Color | null;
    colorContrast(color1: string, color2: string): string;
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
    clone(obj: unknown, options?: Partial<W2CloneOptions>): any;
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
    normMenu(menu: unknown, options?: W2NormMenuOptions): W2MenuItem[] | undefined;
    /**
     * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
     * dataType is in w2utils. This method is used in grid, form and tooltip to prepare fetch parameters
     */
    prepareParams(url: URL, fetchOptions: Record<string, unknown>, options?: Record<string, unknown>): Record<string, unknown>;
    bindEvents(selector: unknown, subject: Record<string, unknown>): void;
    debounce(func: (...args: any[]) => void, wait?: number): (...args: any[]) => void;
    wait(time?: number): Promise<void>;
    getNested(obj: any, prop: any): unknown;
}
declare var w2utils: Utils;

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: none
 *
 * These are the master locale settings that will be used by w2utils
 *
 * "locale" should be the IETF language tag in the form xx-YY,
 * where xx is the ISO 639-1 language code ( see https://en.wikipedia.org/wiki/ISO_639-1 ) and
 * YY is the ISO 3166-1 alpha-2 country code ( see https://en.wikipedia.org/wiki/ISO_3166-2 )
 */
interface W2Locale {
    locale: string;
    dateFormat: string;
    timeFormat: string;
    datetimeFormat: string;
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
    phrases: Record<string, string> | null;
}
declare const w2locale: W2Locale;

interface DialogOptions {
    title?: string;
    text?: string;
    body?: string;
    buttons?: string;
    width?: number;
    height?: number;
    focus?: number | string | null;
    actions?: Record<string, unknown> | null;
    style?: string;
    speed?: number;
    blockPage?: boolean;
    modal?: boolean;
    maximized?: boolean;
    keyboard?: boolean;
    showClose?: boolean;
    showMax?: boolean;
    resizable?: boolean;
    transition?: unknown;
    openMaximized?: boolean;
    moved?: boolean;
    prevSize?: string | null;
    cancelAction?: string;
    closingTimer?: ReturnType<typeof setTimeout>;
    _last_focus?: HTMLElement | null;
    [key: string]: unknown;
}
declare class Dialog extends w2base {
    defaults: DialogOptions;
    options: DialogOptions;
    name: string;
    status: string;
    tmp: Record<string, unknown>;
    handleResize: (event?: any) => void;
    _promCreated: (value?: unknown) => void;
    _promOpened: (value?: unknown) => void;
    _promClosing: (value?: unknown) => void;
    _promClosed: (value?: unknown) => void;
    _timer?: ReturnType<typeof setTimeout>;
    constructor();
    /**
     * Sample calls
     * - w2popup.open('ddd').ok(() => { w2popup.close() })
     * - w2popup.open('ddd', { height: 120 }).ok(() => { w2popup.close() })
     * - w2popup.open({ body: 'text', title: 'caption', actions: ["Close"] }).close(() => { w2popup.close() })
     * - w2popup.open({ body: 'text', title: 'caption', actions: { Close() { w2popup.close() }} })
     */
    open(options?: any, extraOptions?: any): (Record<string, unknown> & {
        self: Dialog;
        action(callBack: any): Record<string, unknown> & /*elided*/ any;
        close(callBack: any): Record<string, unknown> & /*elided*/ any;
        then(callBack: any): Record<string, unknown> & /*elided*/ any;
    }) | undefined;
    load(options: any): Promise<unknown>;
    template(data: any, id: any, options?: any): (Record<string, unknown> & {
        self: Dialog;
        action(callBack: any): Record<string, unknown> & /*elided*/ any;
        close(callBack: any): Record<string, unknown> & /*elided*/ any;
        then(callBack: any): Record<string, unknown> & /*elided*/ any;
    }) | undefined;
    action(action: any, event?: any): void;
    keydown(event: any): void;
    close(immediate?: any): void;
    toggle(): void;
    max(): void;
    min(): void;
    clear(): void;
    reset(): void;
    message(options: any): W2MessageProm | undefined;
    confirm(options: any): W2MessageProm | undefined;
    setFocus(focus?: any): void;
    lock(msg?: any, showSpinner?: any): void;
    unlock(speed?: any): void;
    center(width?: any, height?: any, force?: any): {
        top: number;
        left: number;
        width: any;
        height: any;
    };
    resize(newWidth: any, newHeight: any, callBack?: any): Promise<unknown>;
    resizeMessages(): void;
}
declare function w2alert(msg: any, title?: any, callBack?: any): any;
declare function w2confirm(msg: any, title?: any, callBack?: any): any;
declare function w2prompt(label: any, title?: any, callBack?: any): any;
declare const w2popup: Dialog;

/**
 * Part of w2ui 2.0 library
 * - Dependencies: mQuery, w2utils, w2base
 *
 * T3.1: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 *
 * TODO:
 * - need help pages
 *
 * 2.0 Changes
 * - multiple tooltips to the same anchor
 * - options.contextMenu
 * - options.prefilter - if true, it will show prefiltered items for w2menu, otherwise all
 * - menu.item.help, menu.item.hotkey, menu.item.extra
 * - options.selected -> for w2menu
 * - options.tooltip => {}
 * - w2menu event onTooltip
 * - added onMouseEnter and onMouseLeave for w2menu
 */

/** Base options shared by all tooltip variants */
interface TooltipOptions {
    name?: string | null;
    html?: string;
    style?: string;
    class?: string;
    position?: string | string[];
    draggable?: boolean;
    align?: string;
    anchor?: HTMLElement | null;
    contextMenu?: boolean;
    anchorClass?: string;
    anchorStyle?: string;
    autoShow?: boolean;
    autoShowOn?: string | null;
    autoHideOn?: string | null;
    arrowSize?: number;
    screenMargin?: number;
    autoResize?: boolean;
    margin?: number;
    offsetX?: number;
    offsetY?: number;
    maxWidth?: number | null;
    maxHeight?: number | null;
    hideOn?: string | string[] | null;
    onThen?: ((event: unknown) => void) | null;
    onShow?: ((event: unknown) => void) | null;
    onHide?: ((event: unknown) => void) | null;
    onUpdate?: ((event: unknown) => void) | null;
    onMove?: ((event: unknown) => void) | null;
    _keep?: boolean;
    text?: string;
    [key: string]: unknown;
}
/** A single menu item */
interface MenuItem {
    id?: string | number | null;
    text?: string | null | ((item: MenuItem, options: MenuOptions) => string);
    style?: string;
    icon?: string | null;
    count?: string | number | null;
    tooltip?: string | {
        html?: string;
        [key: string]: unknown;
    } | null;
    hint?: string | null;
    hotkey?: string | null;
    removable?: boolean | null;
    remove?: boolean | null;
    help?: string | null;
    items?: MenuItem[] | ((item: MenuItem) => MenuItem[]) | null;
    indent?: number;
    type?: 'check' | 'radio' | 'break' | null;
    group?: string | boolean | null;
    expanded?: boolean;
    hidden?: boolean;
    checked?: boolean | null;
    disabled?: boolean;
    keepOpen?: boolean | null;
    extra?: string;
    _noSearchInside?: boolean;
    [key: string]: unknown;
}
/** Options for w2menu (MenuTooltip) */
interface MenuOptions extends TooltipOptions {
    type?: 'normal' | 'radio' | 'check';
    items?: MenuItem[];
    selected?: null | string | number | MenuItem | Array<string | number | MenuItem>;
    render?: ((item: MenuItem, options: MenuOptions) => string) | null;
    spinner?: boolean;
    msgNoItems?: string;
    msgSearch?: string;
    topHTML?: string;
    menuStyle?: string;
    search?: boolean;
    filter?: boolean;
    match?: 'contains' | 'is' | 'begins' | 'begins with' | 'ends' | 'ends with' | 'regexp';
    markSearch?: boolean;
    prefilter?: boolean;
    altRows?: boolean;
    url?: string;
    postData?: Record<string, unknown>;
    method?: string;
    recId?: string | ((item: Record<string, unknown>) => unknown) | null;
    recid?: string | null;
    recText?: string | ((item: Record<string, unknown>) => unknown) | null;
    cacheMax?: number;
    minLength?: number;
    debounce?: number;
    hideSelected?: boolean;
    parentOverlay?: TooltipOverlay | null;
    parents?: number[];
    onSelect?: ((event: unknown) => void) | null;
    onSubMenu?: ((event: unknown) => void) | null;
    onRemove?: ((event: unknown) => void) | null;
    onTooltip?: ((event: unknown) => void) | null;
    onMouseEnter?: ((event: unknown) => void) | null;
    onMouseLeave?: ((event: unknown) => void) | null;
}
/** Options for w2color (ColorTooltip) */
interface ColorOptions extends TooltipOptions {
    advanced?: boolean;
    transparent?: boolean;
    color?: string;
    updateInput?: boolean;
    onSelect?: ((event: unknown) => void) | null;
    onLiveUpdate?: ((event: unknown) => void) | null;
}
/** Options for w2date (DateTooltip) */
interface DateOptions extends TooltipOptions {
    type?: 'date' | 'time' | 'datetime';
    value?: string;
    format?: string;
    start?: string | HTMLElement | null;
    end?: string | HTMLElement | null;
    btnNow?: boolean;
    blockDates?: string[];
    blockWeekdays?: number[];
    colored?: Record<string, string>;
    noMinutes?: boolean;
    startTime?: string;
    endTime?: string;
    onSelect?: ((event: unknown) => void) | null;
}
/** The overlay object — a w2base instance extended at runtime with many dynamic props */
type TooltipOverlay = // any: dynamic w2base extension
InstanceType<typeof w2base> & {
    id: string;
    name: string;
    options: TooltipOptions & MenuOptions & ColorOptions & DateOptions;
    anchor: HTMLElement;
    self: Tooltip;
    displayed: boolean;
    box: HTMLElement & {
        overlay?: TooltipOverlay;
    } | null;
    needsUpdate?: boolean;
    prevOptions?: TooltipOptions;
    tmp: Record<string, unknown>;
    selected?: string | number | null;
    newColor?: string;
    newValue?: string;
    newDate?: string;
    next?: () => void;
    prev?: () => void;
    click?: () => void;
    hide: () => void;
};
/** Return value of Tooltip.attach() */
interface AttachReturn {
    overlay: TooltipOverlay;
    then: (callback: (event: unknown) => void) => AttachReturn;
    show: (callback: (event: unknown) => void) => AttachReturn;
    hide: (callback: (event: unknown) => void) => AttachReturn;
    update: (callback: (event: unknown) => void) => AttachReturn;
    move: (callback: (event: unknown) => void) => AttachReturn;
    liveUpdate?: (callback: (event: unknown) => void) => AttachReturn;
    select?: (callback: (event: unknown) => void) => AttachReturn;
    remove?: (callback: (event: unknown) => void) => AttachReturn;
    subMenu?: (callback: (event: unknown) => void) => AttachReturn;
}
/** Position calculation result */
interface TooltipPosition {
    left: number;
    top: number;
    arrow: {
        offset: number;
        class: string;
        style: string;
    };
    adjust: {
        left: number;
        top: number;
    };
    width?: number;
    height?: number;
    pos: string;
}
declare class Tooltip {
    static active: Record<string, TooltipOverlay>;
    defaults: TooltipOptions;
    setColor?: (color: Partial<{
        h: number;
        s: number;
        v: number;
        a: number;
    }>, fullUpdate?: boolean, initial?: string) => void;
    initControls(_overlay: any): void;
    constructor();
    static observeRemove: MutationObserver;
    trigger(event: any, data?: any): {
        isCancelled?: boolean;
        finish: () => void;
        detail?: Record<string, unknown>;
    };
    get(name?: string | true): string[] | Record<string, TooltipOverlay> | TooltipOverlay | undefined;
    attach(anchorArg?: HTMLElement | TooltipOptions | null, textArg?: string | TooltipOptions): AttachReturn | undefined;
    update(name: string, html: string): void;
    show(name?: string | HTMLElement | TooltipOptions, extraOptions?: TooltipOptions): AttachReturn | {
        overlay: TooltipOverlay;
    } | undefined;
    hide(name?: string | HTMLElement): void;
    resize(name?: string): {
        moved: boolean;
        resize: boolean;
    } | {
        multiple: boolean;
    } | void;
    getPosition(name: string): TooltipPosition | undefined;
    /**
     * Move overlay node to the end of its parent (typically body) so it stacks above other .w2ui-overlay siblings
     * without relying on z-index. No-op if it is already the last element child.
     */
    bringOverlayToFront(overlay: TooltipOverlay): void;
    startDrag(event: MouseEvent & {
        target: EventTarget & {
            _lastBoundingRect?: DOMRect;
        };
    }): void;
}
declare class ColorTooltip extends Tooltip {
    static custom_colors: string[];
    palette: string[][];
    index: [number, number];
    constructor();
    attach(anchor: any, text?: any): AttachReturn | undefined;
    select(color: any, name: any): void;
    nextColor(direction: string): string | undefined;
    tabClick(index: any, name: any): void;
    getColorHTML(name: any, options: any): string;
    getCustomColorsHTML(name: string): string;
    initControls(overlay: TooltipOverlay): void;
    addCustomColor(color: any, _name: any): any;
    pickAndSelect(name: string, event: any): Promise<void>;
    pickAndUse(_name: string): Promise<void>;
    pickColor(): Promise<string | undefined>;
}
declare class MenuTooltip extends Tooltip {
    constructor();
    attach(anchor: any, text?: any): AttachReturn | undefined;
    update(name: any, items: any): void;
    initControls(overlay: any): void;
    getCurrent(name: string, id?: any): {
        last: number;
        index: any;
        items: any;
        item: any;
        parents: string;
    };
    getMenuHTML(options: any): string;
    openSubMenu(event: any): void;
    closeSubMenu(event: any): void;
    refreshIndex(name: string, instant?: boolean): void;
    showTooltip(name: string, options?: any): void;
    refreshSearch(name: string): void;
    /**
     * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
     * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
     */
    applyFilter(name: string, items: any, search: any, debounce?: any): Promise<any>;
    request(overlay: any, search: any, debounce: any): Promise<any>;
    /**
     * Builds an array of item ids that sequencial order for navigation with up/down keys. Skips hidden and disabled items
     * and goes into nested structures. It will remember last active chain in 'overlay.tmp.activeChain'
     */
    getActiveChain(name: string, items?: any, parents?: any[], res?: any[], noSave?: boolean): any[];
    menuDown(overlay: any, event: any, index: any, parents: any): void;
    menuClick(overlay: any, event: any, index: any, parents: any): void;
    findChecked(items: any): any[];
    keyUp(overlay: any, event: any): void;
}
declare class DateTooltip extends Tooltip {
    daysCount: number[];
    today: string;
    constructor();
    attach(anchor: any, text?: any): AttachReturn | undefined;
    initControls(overlay: any): void;
    getMonthHTML(options: any, month?: any, year?: any): {
        html: string;
        month: any;
        year: any;
    };
    getYearHTML(): string;
    getHourHTML(options: any): {
        html: string;
    };
    getMinHTML(hour: any, options: any): {
        html: string;
    };
    inRange(str: any, options: any, dateOnly?: boolean): boolean;
    str2min(str: any): number | null;
    min2str(time: number, format?: any): string;
}
declare const w2tooltip: Tooltip;
declare const w2menu: MenuTooltip;
declare const w2color: ColorTooltip;
declare const w2date: DateTooltip;

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip, w2color, w2menu
 *
 * == TODO ==
 *  - tab navigation (index state)
 *  - vertical toolbar
 *  - w2menu on second click of tb button should hide
 *  - button display groups for each show/hide, possibly add state: { single: t/f, multiple: t/f, type: 'font' }
 *  - item.count - should just support html, so a custom block can be created, such as a colored line
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - item.icon - can be class or <custom-icon-component> or <svg>
 *  - new w2tooltips and w2menu
 *  - scroll returns promise
 *  - added onMouseEntter, onMouseLeave, onMouseDown, onMouseUp events
 *  - add(..., skipRefresh), insert(..., skipRefresh)
 *  - item.items can be a function
 *  - item.icon_style - style for the icon
 *  - item.icon - can be a function
 *  - item.type = 'label', item.type = 'input'
 *  - item.placeholder
 *  - item.input: { spinner, style, min, max, step, precision, suffix }
 *  - item.backColor
 *  - onLiveUpdate - for colors
 */

declare class w2toolbar extends w2base {
    box: HTMLElement | null;
    name: string;
    routeData: Record<string, unknown>;
    items: any[];
    right: string | string[];
    tooltip: string;
    item_template: Record<string, unknown>;
    last: any;
    _refresh: (opts: any) => void;
    _refreshDebounced: () => void;
    [key: string]: any;
    constructor(options: any);
    add(items: any, skipRefresh?: any): void;
    insert(id: any, items: any, skipRefresh?: any): void;
    remove(...args: any[]): number;
    set(id: any, newOptions: any): boolean;
    get(id?: any, returnIndex?: boolean, items?: any[]): any;
    setCount(id: any, count: any, className?: any, style?: any): void;
    show(...args: any[]): any[];
    hide(...args: any[]): any[];
    enable(...args: any[]): any[];
    disable(...args: any[]): any[];
    check(...args: any[]): any[];
    uncheck(...args: any[]): any[];
    click(id: any, event?: any): void;
    scroll(direction?: any, line?: any, instant?: any): Promise<void>;
    render(box?: any): number | undefined;
    refresh(id?: any): number | false | undefined;
    resize(): number | undefined;
    destroy(): void;
    unmount(): void;
    getItemHTML(item: any): string;
    spinner(id: any, action: any, event?: any): void;
    change(id?: any, value?: any, dynamic?: any): void;
    tooltipShow(id: any): void;
    tooltipHide(_id: any): void;
    menuClick(event: any): void;
    colorClick(event: any): void;
    mouseAction(event: any, target: any, action: any, id: any): void;
}

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip, w2menu
 *
 * == TODO ==
 *  - dbl click should be like it is in grid (with timer not HTML dbl click event)
 *  - node.style is misleading - should be there to apply color for example
 *  - node.plus - is not working
 *
 * == 2.0 changes
 *  - remove jQuery dependency
 *  - deprecarted obj.img, node.img
 *  - CSP - fixed inline events
 *  - observeResize for the box
 *  - search(..., compare) - comparison function
 *  - editable = true
 *  - edit(id) - new method
 *  - onEdit, onRename - new events
 *  - reorder = true - to allow reorder
 *  - mouseDown - for reorder
 *  - onReorder, onDragStart, onDragOver - events
 *  - this.mutlti - for multi select (ctrl for one at a time and shift for range)
 *  - onSelect, onUnselect - new events
 *  - prev(), next(), getChain()
 */

/** Options accepted by refresh() */
interface W2SidebarRefreshOptions {
    recursive?: boolean;
}
/** Options accepted by update() — mirrors node property names that can be updated in-place */
interface W2SidebarUpdateOptions {
    icon?: string | ((nd: unknown, level: number) => string) | null;
    class?: string | null;
    style?: string | null;
    text?: string | ((nd: unknown, level: number) => string) | null;
    count?: number | string | null;
    [key: string]: unknown;
}
/** Options accepted by setCount() */
interface W2SidebarSetCountOptions {
    className?: string;
    style?: string;
    noRepeat?: boolean;
}
/** Options for find() */
interface W2SidebarFindOptions {
    returnDisabled?: boolean;
    returnGroups?: boolean;
    [key: string]: unknown;
}
/** Options for sort() */
interface W2SidebarSortOptions {
    foldersFirst?: boolean;
    caseSensitive?: boolean;
    reverse?: boolean;
    [key: string]: unknown;
}
declare class w2sidebar extends w2base {
    box: HTMLElement | null;
    name: string;
    nodes: any[];
    selected: any;
    img: any;
    icon: any;
    style: string;
    hasFocus: boolean;
    flat: boolean;
    flatButton: boolean;
    keyboard: boolean;
    editable: boolean;
    reorder: boolean;
    tabIndex: number | null;
    routeData: Record<string, unknown>;
    multi: boolean;
    skipRefresh: boolean;
    last: any;
    node_template: Record<string, unknown>;
    [key: string]: any;
    constructor(options: any);
    add(parent?: any, nodes?: any): any;
    insert(parent?: any, before?: any, nodes?: any): any;
    remove(...args: any[]): number;
    set(parent?: any, id?: any, node?: any): boolean | null;
    get(parent?: any, id?: any, returnIndex?: any): any;
    setCount(id: any, count: any, options?: W2SidebarSetCountOptions): void;
    find(parent?: any, params?: any, results?: any): any;
    sort(options: W2SidebarSortOptions | null | undefined, nodes?: any): void;
    each(fn: any, nodes?: any): void;
    search(str: any, compare?: any): number;
    show(...args: any[]): any[];
    hide(...args: any[]): any[];
    enable(...args: any[]): any[];
    disable(...args: any[]): any[];
    select(id: any): boolean | undefined;
    unselect(id?: any): boolean | undefined;
    toggle(id: any): boolean | undefined;
    collapse(id: any): boolean | undefined;
    expand(id: any): true | undefined;
    collapseAll(parent?: any): boolean;
    expandAll(parent?: any): false | undefined;
    expandParents(id: any): boolean;
    click(id: any, event?: any): void;
    flatMenu(el: any, items: any): void;
    focus(event?: any): false | undefined;
    blur(event: any): false | undefined;
    next(node: any, noSubs?: any): any;
    prev(node: any): any;
    getChain(nodes?: any, options?: W2SidebarFindOptions): any[];
    keydown(event: any): void;
    inView(id: any): boolean;
    scrollIntoView(id?: any, instant?: any): Promise<void>;
    dblClick(id: any, event: any): void;
    /**
     * This is needed for not reorder
     */
    mouseDown(id: any, event: any): void;
    edit(id: any): Node | Node[] | null | undefined;
    contextMenu(id: any, event: any): void;
    menuClick(itemId: any, detail?: any): void;
    goFlat(): void;
    render(box?: any): number | undefined;
    update(id: any, options?: W2SidebarUpdateOptions): W2SidebarUpdateOptions;
    refresh(id?: any, options?: W2SidebarRefreshOptions): number | undefined;
    mouseAction(action: any, anchor: any, nodeId: any, event: any, type: any): void;
    tooltip(el: any, text: any): void;
    otherTooltip(el: any, text: any): void;
    showPlus(el: any, color: any): void;
    resize(): number | undefined;
    destroy(): void;
    unmount(): void;
    lock(msg?: any, showSpinner?: any): void;
    unlock(speed: any): void;
}

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - observeResize for the box
 *  - refactored w2events
 *  - scrollIntoView - removed callback
 *  - scroll, scrollIntoView return promise
 *  - animateInsert, animateClose - returns a promise
 *  - add, insert return a promise
 *  - onMouseEnter, onMouseLeave, onMouseDown, onMouseUp
 */

declare class w2tabs extends w2base {
    box: HTMLElement | null;
    name: string;
    active: any;
    reorder: boolean;
    flow: string;
    tooltip: string;
    tabs: any[];
    routeData: Record<string, unknown>;
    last: any;
    right: string;
    style: string;
    tab_template: Record<string, unknown>;
    [key: string]: any;
    constructor(options: any);
    add(tab: any): Promise<any>;
    insert(id: any, tabs: any): Promise<any>;
    remove(...ids: any[]): number;
    select(id: any): boolean;
    set(id: any, tab: any): boolean;
    get(id?: any, returnIndex?: boolean): any;
    show(...ids: any[]): any[];
    hide(...ids: any[]): any[];
    enable(...ids: any[]): any[];
    disable(...ids: any[]): any[];
    dragMove(event: MouseEvent): void;
    mouseAction(action: string, id: any, event: MouseEvent): void;
    tooltipShow(id: any): void;
    tooltipHide(_id: any): void;
    getTabHTML(id: any): string | false;
    refresh(id?: any): number | undefined;
    render(box?: any): number | false | undefined;
    initReorder(id: any, event: MouseEvent): void;
    scroll(direction?: any, instant?: any): Promise<void>;
    scrollIntoView(id?: any, instant?: any): Promise<void>;
    resize(): number | undefined;
    destroy(): void;
    unmount(): void;
    click(id: any, event?: MouseEvent): false | void;
    clickClose(id: any, event?: MouseEvent): false | void;
    animateClose(id?: any): Promise<void>;
    animateInsert(id: any, tab: any): Promise<void>;
}

/** Valid panel type names in a layout */
type W2PanelType = 'top' | 'left' | 'main' | 'preview' | 'right' | 'bottom';
/** Content that can be placed in a layout panel */
type W2PanelContent = string | {
    render: (box?: HTMLElement) => void;
    unmount?: () => void;
    box?: HTMLElement | null;
    [key: string]: unknown;
};
/** Individual panel configuration and runtime state */
interface W2LayoutPanel {
    type: W2PanelType | null;
    title: string;
    size: number | string;
    minSize: number;
    maxSize: number | boolean;
    hidden: boolean;
    resizable: boolean;
    overflow: string;
    style: string;
    html: W2PanelContent;
    tabs: w2tabs | Record<string, unknown> | null;
    toolbar: w2toolbar | Record<string, unknown> | null;
    /** Runtime-computed width (read-only after resize) */
    width: number | null;
    /** Runtime-computed height (read-only after resize) */
    height: number | null;
    /** Runtime-computed size in pixels */
    sizeCalculated?: number;
    show: {
        toolbar: boolean;
        tabs: boolean;
    };
    removed: ((info: {
        panel: string;
        html: W2PanelContent;
        html_new: W2PanelContent;
        transition: string;
    }) => void) | null;
    onRefresh: ((event: unknown) => void) | null;
    onShow: ((event: unknown) => void) | null;
    onHide: ((event: unknown) => void) | null;
}
/** Options for the html() method return promise-like */
interface W2HtmlResult {
    panel: string;
    html: W2PanelContent;
    error: boolean;
    cancelled: boolean;
    status?: boolean;
    removed: (cb: () => void) => void;
}
declare class w2layout extends w2base {
    box: HTMLElement | null;
    name: string;
    panels: W2LayoutPanel[];
    last: Record<string, any>;
    padding: number;
    resizer: number;
    style: string;
    onShow: ((event: unknown) => void) | null;
    onHide: ((event: unknown) => void) | null;
    onResizing: ((event: unknown) => void) | null;
    onResizerClick: ((event: unknown) => void) | null;
    onRender: ((event: unknown) => void) | null;
    onRefresh: ((event: unknown) => void) | null;
    onChange: ((event: unknown) => void) | null;
    onResize: ((event: unknown) => void) | null;
    onDestroy: ((event: unknown) => void) | null;
    panel_template: W2LayoutPanel;
    [key: string]: any;
    constructor(options: any);
    html(panel: string, data: W2PanelContent, transition?: string): W2HtmlResult;
    message(panel: string, options: unknown): W2MessageProm | undefined;
    confirm(panel: string, options: unknown): W2MessageProm | undefined;
    load(panel: string, url: string, transition?: string): Promise<void | W2HtmlResult>;
    sizeTo(panel: string, size: number | string, instant?: boolean): boolean;
    show(panel: string, immediate?: boolean): boolean | undefined;
    hide(panel: string, immediate?: boolean): boolean | undefined;
    toggle(panel: string, immediate?: boolean): boolean | undefined;
    set(panel: string, options: Partial<W2LayoutPanel>): boolean;
    get(panel: string, returnIndex?: boolean): any;
    el(panel: string): HTMLElement | null;
    hideToolbar(panel: string): void;
    showToolbar(panel: string): void;
    toggleToolbar(panel: string): void;
    assignToolbar(panel: string, toolbar: w2toolbar | string | null): void;
    hideTabs(panel: string): void;
    showTabs(panel: string): void;
    toggleTabs(panel: string): void;
    assignTabs(panel: string, tabs: w2tabs | string | null): void;
    render(box?: HTMLElement | string): number | false | undefined;
    unmount(): void;
    destroy(): boolean | undefined;
    refresh(panel?: string): number | undefined;
    resize(): number | false | undefined;
    resizeBoxes(panel?: string): void;
    lock(panel: string, msg: unknown, showSpinner?: boolean): void;
    unlock(panel: string, speed?: number): void;
}

/** A single data record stored in the grid */
interface W2GridRecord {
    recid: string | number;
    w2ui?: {
        summary?: boolean;
        children?: W2GridRecord[];
        parent_recid?: string | number;
        expanded?: boolean;
        selectable?: boolean;
        styles?: Record<string, string>;
        [key: string]: any;
    };
    [key: string]: any;
}
/** Sort descriptor used in grid.sortData */
interface W2GridSortData {
    field: string;
    direction: 'asc' | 'desc';
    field_?: string;
    [key: string]: any;
}
/** Virtual scroll state kept in grid.last.vscroll */
interface W2GridVScroll {
    scrollTop: number;
    scrollLeft: number;
    recIndStart: number | null;
    recIndEnd: number | null;
    colIndStart: number;
    colIndEnd: number;
    pull_more: boolean;
    pull_refresh: boolean;
    show_extra: number;
}
/** Fetch state kept in grid.last.fetch */
interface W2GridFetch {
    action: string;
    offset?: number | null;
    start: number;
    response: number;
    options: RequestInit | null;
    controller: AbortController | null;
    loaded: boolean;
    hasMore: boolean;
}
/** Column definition — T5.2 */
interface W2GridColumn {
    field: string;
    text: string | ((col: W2GridColumn) => string);
    size?: string | number;
    min?: number;
    max?: number;
    frozen?: boolean;
    hidden?: boolean;
    hideable?: boolean;
    resizable?: boolean;
    sortable?: boolean;
    searchable?: boolean | string;
    sortMode?: string;
    editable?: boolean | {
        type: string;
        [key: string]: any;
    } | ((rec: W2GridRecord, cell: any) => any);
    render?: string | ((record: W2GridRecord, index: number, colIndex: number) => string);
    tooltip?: string;
    style?: string;
    attr?: string;
    clipboardCopy?: boolean | ((record: W2GridRecord, cell: any) => string);
    colspan?: Record<string, number> | ((record: W2GridRecord, index: number) => number);
    sizeCalculated?: string;
    sizeOriginal?: string | number;
    sizeType?: string;
    gridMinWidth?: number;
    [key: string]: any;
}
/** Search field definition — T5.2 */
interface W2GridSearch {
    field: string;
    label?: string;
    caption?: string;
    type: string;
    hidden?: boolean;
    attr?: string;
    text?: string;
    style?: string;
    operator?: string;
    operators?: string[];
    options?: Record<string, any>;
    value?: any;
    svalue?: any;
    [key: string]: any;
}
/** Internal last-state object */
interface W2GridLast {
    field: string;
    label: string;
    logic: 'AND' | 'OR';
    search: string;
    searchIds: number[];
    selection: W2GridSelection;
    saved_sel: any | null;
    multi: boolean;
    fetch: W2GridFetch;
    vscroll: W2GridVScroll;
    sel_ind: number | null;
    sel_col: number | null;
    sel_type: string | null;
    sel_recid: string | number | null;
    idCache: Record<string | number, number>;
    move: any | null;
    cancelClick: boolean | null;
    inEditMode: boolean;
    _edit: {
        value: any;
        index: number;
        column: number;
        recid: string | number;
        [key: string]: any;
    } | null;
    kbd_timer: ReturnType<typeof setTimeout> | null;
    marker_timer: ReturnType<typeof setTimeout> | null;
    click_time: number | null;
    click_recid: string | number | null;
    bubbleEl: HTMLElement | null;
    colResizing: boolean;
    tmp: any | null;
    copy_event: any | null;
    userSelect: string;
    columnDrag: false | {
        remove(): void;
    };
    state: any | null;
    toolbar_height: number;
    groupBy_links: Record<string, W2GridRecord>;
    originalSort?: (string | number)[];
    [key: string]: any;
}
/** Selection state — T5.4 */
interface W2GridSelection {
    indexes: number[];
    columns: Record<string | number, number[]>;
}
/** Range endpoint (used in addRange / refreshRanges) */
interface W2GridRangeEndpoint {
    recid: string | number;
    column: number;
    index?: number;
}
/** Range descriptor for addRange / refreshRanges */
interface W2GridRange {
    name: string;
    range: W2GridRangeEndpoint[];
    style?: string;
    class?: string;
    [key: string]: any;
}
/** Active search filter — one entry in grid.searchData — T5.5 */
interface W2GridSearchFilter {
    field: string;
    type: string;
    operator: string;
    value?: any;
    svalue?: any;
    text?: string;
    [key: string]: any;
}
/** GroupBy configuration object */
interface W2GridGroupBy {
    field: string;
    [key: string]: any;
}
declare class w2grid extends w2base {
    [key: string]: any;
    name: string;
    box: HTMLElement | null;
    columns: W2GridColumn[];
    columnGroups: any[];
    records: W2GridRecord[];
    summary: W2GridRecord[];
    searches: W2GridSearch[];
    toolbar: any;
    ranges: W2GridRange[];
    contextMenu: any[];
    searchMap: Record<string, string>;
    searchData: W2GridSearchFilter[];
    sortMap: Record<string, string>;
    sortData: W2GridSortData[];
    savedSearches: any[];
    defaultSearches: any[];
    groupBy: W2GridGroupBy | null;
    total: number;
    recid: string | null;
    hierarchyColumn: number;
    last: W2GridLast;
    header: string;
    url: any;
    limit: number;
    offset: number;
    postData: Record<string, any>;
    routeData: Record<string, any>;
    httpHeaders: Record<string, string>;
    show: {
        header: boolean;
        toolbar: boolean;
        footer: boolean;
        columnMenu: boolean;
        columnHeaders: boolean;
        lineNumbers: boolean;
        expandColumn: boolean;
        selectColumn: boolean;
        emptyRecords: boolean;
        toolbarReload: boolean;
        toolbarColumns: boolean;
        toolbarSearch: boolean;
        toolbarAdd: boolean;
        toolbarEdit: boolean;
        toolbarDelete: boolean;
        toolbarSave: boolean;
        searchAll: boolean;
        searchLogic: boolean;
        searchHiddenMsg: boolean;
        searchSave: boolean;
        statusRange: boolean;
        statusBuffered: boolean;
        statusRecordID: boolean;
        statusSelection: boolean;
        statusResponse: boolean;
        statusSort: boolean;
        statusSearch: boolean;
        recordTitles: boolean;
        selectionBorder: boolean;
        selectionResizer: boolean;
        skipRecords: boolean;
        saveRestoreState: boolean;
        columns?: boolean;
    };
    stateId: string | null;
    hasFocus: boolean;
    autoLoad: boolean;
    fixedBody: boolean;
    recordHeight: number;
    lineNumberWidth: number;
    keyboard: boolean;
    selectType: 'row' | 'cell';
    liveSearch: boolean;
    multiSearch: boolean;
    multiSelect: boolean;
    multiSort: boolean;
    reorderColumns: boolean;
    reorderRows: boolean;
    showExtraOnSearch: number;
    markSearch: boolean;
    columnTooltip: string;
    disableCVS: boolean;
    nestedFields: boolean;
    vs_start: number;
    vs_extra: number;
    style: string;
    tabIndex: number | null;
    dataType: string | null;
    parser: ((data: any) => any) | null;
    advanceOnEdit: boolean;
    useLocalStorage: boolean;
    colTemplate: Record<string, any>;
    stateColProps: Record<string, boolean>;
    msgDelete: string;
    msgNotJSON: string;
    msgHTTPError: string;
    msgServerError: string;
    msgRefresh: string;
    msgNeedReload: string;
    msgEmpty: string;
    buttons: Record<string, any>;
    operators: Record<string, any[]>;
    defaultOperator: Record<string, string>;
    operatorsMap: Record<string, string>;
    onAdd: ((event: CustomEvent) => void) | null;
    onEdit: ((event: CustomEvent) => void) | null;
    onRequest: ((event: CustomEvent) => void) | null;
    onLoad: ((event: CustomEvent) => void) | null;
    onDelete: ((event: CustomEvent) => void) | null;
    onSave: ((event: CustomEvent) => void) | null;
    onSelect: ((event: CustomEvent) => void) | null;
    onClick: ((event: CustomEvent) => void) | null;
    onDblClick: ((event: CustomEvent) => void) | null;
    onContextMenu: ((event: CustomEvent) => void) | null;
    onContextMenuClick: ((event: CustomEvent) => void) | null;
    onColumnClick: ((event: CustomEvent) => void) | null;
    onColumnDblClick: ((event: CustomEvent) => void) | null;
    onColumnContextMenu: ((event: CustomEvent) => void) | null;
    onColumnResize: ((event: CustomEvent) => void) | null;
    onColumnAutoResize: ((event: CustomEvent) => void) | null;
    onSort: ((event: CustomEvent) => void) | null;
    onSearch: ((event: CustomEvent) => void) | null;
    onSearchOpen: ((event: CustomEvent) => void) | null;
    onSearchClose: ((event: CustomEvent) => void) | null;
    onChange: ((event: CustomEvent) => void) | null;
    onRestore: ((event: CustomEvent) => void) | null;
    onExpand: ((event: CustomEvent) => void) | null;
    onCollapse: ((event: CustomEvent) => void) | null;
    onError: ((event: CustomEvent) => void) | null;
    onKeydown: ((event: CustomEvent) => void) | null;
    onToolbar: ((event: CustomEvent) => void) | null;
    onColumnOnOff: ((event: CustomEvent) => void) | null;
    onCopy: ((event: CustomEvent) => void) | null;
    onPaste: ((event: CustomEvent) => void) | null;
    onSelectionExtend: ((event: CustomEvent) => void) | null;
    onEditField: ((event: CustomEvent) => void) | null;
    onRender: ((event: CustomEvent) => void) | null;
    onRefresh: ((event: CustomEvent) => void) | null;
    onReload: ((event: CustomEvent) => void) | null;
    onResize: ((event: CustomEvent) => void) | null;
    onDestroy: ((event: CustomEvent) => void) | null;
    onStateSave: ((event: CustomEvent) => void) | null;
    onStateRestore: ((event: CustomEvent) => void) | null;
    onFocus: ((event: CustomEvent) => void) | null;
    onBlur: ((event: CustomEvent) => void) | null;
    onReorderRow: ((event: CustomEvent) => void) | null;
    onSearchSave: ((event: CustomEvent) => void) | null;
    onSearchRemove: ((event: CustomEvent) => void) | null;
    onSearchSelect: ((event: CustomEvent) => void) | null;
    onColumnSelect: ((event: CustomEvent) => void) | null;
    onColumnDragStart: ((event: CustomEvent) => void) | null;
    onColumnDragEnd: ((event: CustomEvent) => void) | null;
    onResizerDblClick: ((event: CustomEvent) => void) | null;
    onMouseEnter: ((event: CustomEvent) => void) | null;
    onMouseLeave: ((event: CustomEvent) => void) | null;
    constructor(options: Record<string, any>);
    add(record: W2GridRecord | W2GridRecord[], first?: boolean): number;
    find(obj?: Record<string, any>, returnIndex?: boolean, displayedOnly?: boolean): (string | number)[];
    set(recid: any, record?: any, noRefresh?: boolean): boolean;
    replace(recid: string | number, record: W2GridRecord, noRefresh?: boolean): boolean;
    get(recid: (string | number)[], returnIndex?: boolean): (W2GridRecord | number)[];
    get(recid: string | number, returnIndex: true): number | null;
    get(recid: string | number, returnIndex?: false): W2GridRecord | null;
    getFirst(offset?: number): W2GridRecord | null;
    remove(...recids: (string | number)[]): number;
    /**
     * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
     * needs to be cleared when record is cleared
     */
    processGroupBy(): void;
    /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
    addColumn(before: any, columns?: any): number;
    removeColumn(...fields: string[]): number;
    getColumn(): string[];
    getColumn(field: string, returnIndex: true): number | null;
    getColumn(field: string, returnIndex?: false): W2GridColumn | null;
    updateColumn(fields: string | string[], updates: Partial<W2GridColumn> | Record<string, any>): number;
    toggleColumn(...fields: string[]): number;
    showColumn(...fields: string[]): number;
    hideColumn(...fields: string[]): number;
    /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
    addSearch(before: any, search?: any): number;
    removeSearch(...fields: string[]): number;
    getSearch(): string[];
    getSearch(field: string, returnIndex: true): number | null;
    getSearch(field: string, returnIndex?: false): W2GridSearch | null;
    toggleSearch(...fields: string[]): number;
    showSearch(...fields: string[]): number;
    hideSearch(...fields: string[]): number;
    getSearchData(field: string): Record<string, any> | null;
    localSort(silent?: boolean, noResetRefresh?: boolean): number | undefined;
    localSearch(silent?: boolean): number | undefined;
    getRangeData(range: [{
        recid: string | number;
        column: number;
    }, {
        recid: string | number;
        column: number;
    }], extra?: boolean): any[];
    addRange(rangesInput: W2GridRange | W2GridRange[] | string | Record<string, any>): number;
    removeRange(...names: string[]): number;
    refreshRanges(): number | undefined;
    select(...selectArgs: any[]): number | undefined;
    unselect(...unselectArgs: any[]): number;
    compareSelection(newSel: any[]): {
        select: any[];
        unselect: any[];
    };
    selectAll(): number | undefined;
    selectNone(skipEvent?: boolean): number | undefined;
    updateToolbar(sel?: any, _areAllSelected?: boolean): void;
    getSelection(returnIndex?: boolean): any[];
    search(field?: any, value?: any): void;
    searchOpen(options?: any): void;
    searchClose(): void;
    searchFieldTooltip(ind: any, sd_ind: any, el: any): void;
    searchSuggest(imediate?: boolean, forceHide?: boolean, anchor?: HTMLElement | Element): void;
    searchSave(): void;
    cache(type: any): any;
    cacheSave(type: any, value: any): boolean;
    searchReset(noReload?: boolean): void;
    searchShowFields(forceHide?: boolean): void;
    searchInitInput(field: string, _value?: any): void;
    clear(noRefresh?: boolean): void;
    reset(noRefresh?: boolean): void;
    skip(offset: any, callBack?: any): void;
    load(url: any, callBack?: any): Promise<any>;
    reload(callBack?: (...args: any[]) => void): Promise<any>;
    request(action: string, postData?: Record<string, any>, url?: any, callBack?: (...args: any[]) => void): Promise<any>;
    requestComplete(data: any, action: any, callBack: any, resolve: any, reject: any): Promise<any> | undefined;
    error(msg: any): void;
    getChanges(recordsBase?: W2GridRecord[]): Record<string, any>[];
    mergeChanges(): void;
    save(callBack?: (data: any) => void): void;
    editField(recid: string | number, column: number, value: any, event?: any): void;
    editChange(input?: any, index?: any, column?: any, event?: any): void;
    editDone(index?: any, column?: any, event?: any): void;
    'delete'(force?: boolean): void;
    click(recid: string | number | {
        recid: string | number;
        column?: number;
    } | any, event?: MouseEvent | any): void;
    columnClick(field: string, event?: MouseEvent | any): void;
    columnDblClick(field: any, event: any): void;
    columnContextMenu(field: any, event: any): void;
    columnAutoSize(colIndex?: number): true | undefined;
    columnAutoSizeAll(): void;
    focus(event?: Event | any): false | undefined;
    blur(event?: Event | any): false | undefined;
    keydown(event: KeyboardEvent | any): void;
    scrollIntoView(ind?: number | null, column?: number, instant?: boolean, recTop?: boolean): void;
    scrollToColumn(field: any): void;
    dblClick(recid: string | number | {
        recid: string | number;
        column?: number;
    } | any, event?: MouseEvent | any): void;
    showContextMenu(event: MouseEvent | any, options: {
        recid?: string | number;
        index?: number;
        column?: number;
    }): void;
    contextMenuClick(recid: string | number, column: number | null, event: any): void;
    toggle(recid: string | number, _event?: Event): boolean | undefined;
    /**
     * When record is expaned, then w2ui.children of the record is copied into this.records and this.total is updated. It will
     * also set w2ui._copeid = true, so it would not copy it again.
     *
     * There is also updateExpaned() that is called in this.refresh()
     */
    expand(recid: any, noRefresh?: any): boolean;
    collapse(recid: any, noRefresh?: any): boolean;
    updateExpanded(): void;
    sort(field?: string, direction?: 'asc' | 'desc' | '' | null, multiField?: boolean): void;
    copy(flag: any, oEvent?: ClipboardEvent | any): any;
    /**
     * Gets value to be copied to the clipboard
     * @param ind index of the record
     * @param col_ind index of the column
     * @returns the displayed value of the field's record associated with the cell
     */
    getCellCopy(ind: any, col_ind: any): unknown;
    paste(text: string, event?: ClipboardEvent | any): void;
    resize(): number | undefined;
    update({ cells, fullCellRefresh, ignoreColumns }?: any): number;
    refreshCell(recid: any, field: any): boolean;
    refreshRow(recid: any, ind?: any): boolean;
    refresh(): number | undefined;
    refreshSearch(): void;
    refreshBody(): void;
    render(box?: HTMLElement | string | null): number | undefined;
    unmount(): void;
    destroy(): void;
    initColumnOnOff(): any[];
    initColumnDrag(_box?: any): {
        remove(): void;
    };
    columnOnOff(event: MouseEvent | any, field: string): void;
    initToolbar(): void;
    initResize(): void;
    resizeBoxes(): void;
    resizeRecords(): void;
    getSearchesHTML(): string;
    getOperators(type: any, opers: any): string;
    initOperator(ind: any): void;
    initSearchLists(changedField?: any): void;
    initSearches(): void;
    getColumnsHTML(): string[];
    getColumnCellHTML(i: any): string;
    columnTooltipShow(ind: any, _event: any): void;
    columnTooltipHide(_ind: any, _event: any): void;
    getRecordsHTML(): string[];
    getSummaryHTML(): string[] | undefined;
    scroll(event?: Event | any): void;
    getRecordHTML(ind: number, lineNum: number, summary?: boolean): string[] | "";
    getLineHTML(lineNum: number): string;
    getCellHTML(ind: number, col_ind: number, summary?: boolean, col_span?: number): any;
    clipboardCopy(ind: any, col_ind: any, summary: any): void;
    showBubble(ind: any, col_ind: any, summary: any): any;
    getCellEditable(ind: number, col_ind: number): any;
    getCellValue(ind: number, col_ind: number, summary?: boolean, extra?: boolean): any;
    getFooterHTML(): string;
    status(msg?: string): void;
    lock(msg?: string, showSpinner?: boolean): void;
    unlock(speed?: number): void;
    stateSave(returnOnly: any): {
        columns: Record<string, any>[];
        show: any;
        last: any;
        sortData: any[];
        searchData: any[];
    } | undefined;
    stateRestore(newState?: any): true | undefined;
    stateReset(): void;
    parseField(obj: W2GridRecord | null | undefined, field: string): any;
    prepareData(): void;
    nextCell(index: number, col_ind: number, editable?: boolean): {
        index: number;
        colIndex: number;
    } | null;
    prevCell(index: number, col_ind: number, editable?: boolean): {
        index: number;
        colIndex: number;
    } | null;
    nextRow(ind: number, col_ind?: number, numRows?: number): number | null;
    prevRow(ind: number, col_ind?: number, numRows?: number): number | null;
    selectionSave(): any;
    selectionRestore(noRefresh?: boolean): number;
    message(options?: any): W2MessageProm | undefined;
    confirm(options: any): W2MessageProm | undefined;
}

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tabs, w2toolbar, w2tooltip, w2field
 *
 * T4.2: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 * Bug fix: line 1317 (original) `?? response.statusText` was unreachable
 * because string concat always produces non-null; fixed to `|| response.statusText`.
 *
 * == TODO ==
 *  - include delta on save
 *  - tabs below some fields (could already be implemented)
 *  - form with toolbar & tabs
 *  - promise for load, save, etc.
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - better groups support tabs now
 *  - form.confirm - refactored
 *  - form.message - refactored
 *  - observeResize for the box
 *  - removed msgNotJSON, msgAJAXerror
 *  - applyFocus -> setFocus
 *  - getFieldValue(fieldName) = returns { curent, previous, original }
 *  - setFieldVallue(fieldName, value)
 *  - getValue(..., original) -- return original if any
 *  - added .hideErrors()
 *  - reuqest, save, submit - return promises
 *  - this.recid = null if no record needs to be pulled
 *  - remove form.multiplart
 *  - this.method - for saving only
 *  - added field.html.class
 *  - setValue(..., noRefresh)
 *  - rememberOriginal()
 *  - saveCleanRecord
 *  - added options.itemMap = { id: 'id', text: 'text' } - to map id, text fields if needed
 *  - hideGroup/showGroup - new methods
 *  - getAction/actionHide/actionShow/actionDisable/actionEnable - new methods
 */

declare class w2form extends w2base {
    [key: string]: any;
    name: string;
    header: string;
    box: HTMLElement | null;
    url: string | {
        get?: string;
        save?: string;
    };
    method: string | null;
    routeData: Record<string, any>;
    formURL: string;
    formHTML: string;
    page: number;
    pageStyle: string;
    recid: any;
    fields: any[];
    actions: Record<string, any>;
    record: Record<string, any>;
    original: Record<string, any> | null;
    dataType: string | null;
    saveCleanRecord: boolean;
    postData: Record<string, any>;
    httpHeaders: Record<string, string>;
    toolbar: any;
    tabs: any;
    style: string;
    focus: number | string;
    autosize: boolean;
    nestedFields: boolean;
    tabindexBase: number;
    isGenerated: boolean;
    last: {
        fetchCtrl: AbortController | null;
        fetchOptions: RequestInit | null;
        errors: any[];
        errorsShown?: boolean;
        observeResize?: ResizeObserver;
    };
    onRequest: ((event: CustomEvent) => void) | null;
    onLoad: ((event: CustomEvent) => void) | null;
    onValidate: ((event: CustomEvent) => void) | null;
    onSubmit: ((event: CustomEvent) => void) | null;
    onProgress: ((event: CustomEvent) => void) | null;
    onSave: ((event: CustomEvent) => void) | null;
    onChange: ((event: CustomEvent) => void) | null;
    onInput: ((event: CustomEvent) => void) | null;
    onRender: ((event: CustomEvent) => void) | null;
    onRefresh: ((event: CustomEvent) => void) | null;
    onResize: ((event: CustomEvent) => void) | null;
    onDestroy: ((event: CustomEvent) => void) | null;
    onAction: ((event: CustomEvent) => void) | null;
    onToolbar: ((event: CustomEvent) => void) | null;
    onError: ((event: CustomEvent) => void) | null;
    msgRefresh: string;
    msgSaving: string;
    msgServerError: string;
    ALL_TYPES: string[];
    LIST_TYPES: string[];
    W2FIELD_TYPES: string[];
    constructor(options: Record<string, any>);
    get(field?: string, returnIndex?: boolean): any;
    set(field: string, obj: Record<string, any>): boolean;
    getValue(field: string, original?: boolean): any;
    setValue(field: string, value: any, noRefresh?: boolean): boolean;
    rememberOriginal(): void;
    getFieldValue(name: string): {
        current: any;
        previous: any;
        original: any;
    } | undefined;
    findItem(item: any, items: any[]): any;
    setFieldValue(name: string, value: any): void;
    show(...args: string[]): string[];
    hide(...args: string[]): string[];
    enable(...args: string[]): string[];
    disable(...args: string[]): string[];
    updateEmptyGroups(): void;
    hideGroup(groupName: string): void;
    showGroup(groupName: string): void;
    /**
     * When user clicks on group title, it will toggle the group (collapse or expand it).
     */
    toggleGroup(groupName: string, show?: boolean): void;
    change(...args: string[]): void;
    reload(callBack?: (() => void)): Promise<any>;
    clear(...args: any[]): void;
    error(msg: string): void;
    message(options: any): any;
    confirm(options: any): any;
    validate(showErrors?: boolean): any[] | undefined;
    showErrors(): void;
    hideErrors(): void;
    getChanges(): Record<string, any> | null;
    getCleanRecord(strict?: boolean): Record<string, any>;
    request(postData?: any, callBack?: (data: any) => void): Promise<any> | void;
    submit(postData?: any, callBack?: (data: any) => void): Promise<any> | void;
    save(postData?: any, callBack?: (data: any) => void): Promise<any> | void;
    lock(msg: string, showSpinner?: boolean): void;
    unlock(speed?: number): void;
    lockPage(page: number, msg?: string, spinner?: boolean): boolean;
    unlockPage(page: number, speed?: number): boolean;
    goto(page: number): void;
    generateHTML(): string | false;
    action(action: string, event: Event): void;
    getAction(action: string): any;
    actionHide(action: string): void;
    actionShow(action: string): void;
    actionDisable(action: string): void;
    actionEnable(action: string): void;
    resize(): void;
    refresh(...args: any[]): number;
    render(box?: HTMLElement | string): number | void;
    unmount(): void;
    destroy(): void;
    setFocus(focus?: number | string): any;
}

/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip, w2color, w2menu, w2date
 *
 * T4.1: Ported to TypeScript with aggressive typing per typing_policy.
 * No @ts-nocheck. Targeted `any` sites documented with // any: comments.
 * Discriminated union on `type` property for per-type option shapes.
 *
 * == TODO ==
 *  - upload (regular files)
 *  - BUG with prefix/postfix and arrows (test in different contexts)
 *  - multiple date selection
 *  - month selection, year selections
 *  - MultiSelect - Allow Copy/Paste for single and multi values
 *  - add routeData to list/enum
 *  - ENUM, LIST: should have same as grid (limit, offset, search, sort)
 *  - ENUM, LIST: should support wild chars
 *  - add selection of predefined times (used for appointments)
 *  - options.items - can be an array
 *  - options.msgNoItems - can be a function
 *  - REMOTE fields
 *
 * == 2.0 changes
 *  - removed jQuery dependency
 *  - enum options.autoAdd
 *  - [numeric, date] - options.autoCorrect to enforce range and validity
 *  - remote source response items => records or just an array
 *  - deprecated "success" field for remote source response
 *  - CSP - fixed inline events
 *  - remove clear, use reset instead
 *  - options.msgSearch
 *  - options.msgNoItems
 */

/** Shared numeric-field options (int, float, money, currency, percent, alphanumeric, bin, hex, text) */
interface W2FieldNumericOptions {
    type?: string;
    min?: number | null;
    max?: number | null;
    step?: number;
    autoFormat?: boolean;
    autoCorrect?: boolean;
    currency?: {
        prefix: string;
        suffix: string;
        precision: number;
    };
    decimalSymbol?: string;
    groupSymbol?: string;
    arrows?: boolean;
    keyboard?: boolean;
    precision?: number | null;
    prefix?: string;
    suffix?: string;
    numberRE?: RegExp;
    moneyRE?: RegExp;
    percentRE?: RegExp;
    [key: string]: any;
}
/** Color-field options */
interface W2FieldColorOptions {
    type?: string;
    prefix?: string;
    suffix?: string;
    arrows?: boolean;
    advanced?: boolean | null;
    transparent?: boolean;
    [key: string]: any;
}
/** Date-field options */
interface W2FieldDateOptions {
    type?: string;
    format?: string;
    keyboard?: boolean;
    autoCorrect?: boolean;
    start?: string | null;
    end?: string | null;
    blockDates?: string[];
    blockWeekdays?: number[];
    colored?: Record<string, string>;
    btnNow?: boolean;
    [key: string]: any;
}
/** Time-field options */
interface W2FieldTimeOptions {
    type?: string;
    format?: string;
    keyboard?: boolean;
    autoCorrect?: boolean;
    start?: string | null;
    end?: string | null;
    btnNow?: boolean;
    noMinutes?: boolean;
    [key: string]: any;
}
/** DateTime-field options */
interface W2FieldDateTimeOptions {
    type?: string;
    format?: string;
    keyboard?: boolean;
    autoCorrect?: boolean;
    start?: string | null;
    end?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    blockDates?: string[];
    blockWeekdays?: number[];
    colored?: Record<string, string>;
    btnNow?: boolean;
    noMinutes?: boolean;
    [key: string]: any;
}
/** List/combo-field options */
interface W2FieldListOptions {
    type?: string;
    items?: any[];
    _items_fun?: ((...args: any[]) => any) | null;
    selected?: Record<string, any> | null;
    itemMap?: {
        id: string;
        text: string;
    } | null;
    match?: 'contains' | 'is' | 'begins' | 'ends';
    filter?: boolean;
    compare?: ((...args: any[]) => any) | null;
    prefix?: string;
    suffix?: string;
    icon?: string | null;
    iconStyle?: string;
    url?: string | null;
    method?: string | null;
    postData?: Record<string, unknown>;
    recId?: string | ((item: any) => any) | null;
    recText?: string | ((item: any) => any) | null;
    debounce?: number;
    minLength?: number;
    cacheMax?: number;
    renderDrop?: ((...args: any[]) => string) | null;
    maxDropHeight?: number;
    maxDropWidth?: number | null;
    minDropWidth?: number | null;
    markSearch?: boolean;
    align?: 'left' | 'right' | 'both' | 'none';
    altRows?: boolean;
    openOnFocus?: boolean;
    hideSelected?: boolean;
    msgNoItems?: string;
    msgSearch?: string;
    onSearch?: ((...args: any[]) => void) | null;
    onRequest?: ((...args: any[]) => void) | null;
    onLoad?: ((...args: any[]) => void) | null;
    onError?: ((...args: any[]) => void) | null;
    index?: number[];
    [key: string]: any;
}
/** Enum-field options */
interface W2FieldEnumOptions {
    type?: string;
    items?: any[];
    _items_fun?: ((...args: any[]) => any) | null;
    selected?: any[];
    itemMap?: {
        id: string;
        text: string;
    } | null;
    max?: number;
    match?: 'contains' | 'is' | 'begins' | 'ends';
    filter?: boolean;
    compare?: ((...args: any[]) => any) | null;
    url?: string | null;
    method?: string | null;
    postData?: Record<string, unknown>;
    recId?: string | ((item: any) => any) | null;
    recText?: string | ((item: any) => any) | null;
    debounce?: number;
    minLength?: number;
    cacheMax?: number;
    maxItemWidth?: number;
    maxDropHeight?: number;
    maxDropWidth?: number | null;
    renderItem?: ((item: any, ind: number, removeBtn: string) => string) | null;
    renderDrop?: ((...args: any[]) => string) | null;
    style?: string;
    openOnFocus?: boolean;
    markSearch?: boolean;
    align?: 'left' | 'right' | 'both' | 'none';
    altRows?: boolean;
    hideSelected?: boolean;
    msgNoItems?: string;
    msgSearch?: string;
    onAdd?: ((...args: any[]) => void) | null;
    onNew?: ((...args: any[]) => void) | null;
    onRemove?: ((...args: any[]) => void) | null;
    onSearch?: ((...args: any[]) => void) | null;
    onClick?: ((...args: any[]) => void) | null;
    onRequest?: ((...args: any[]) => void) | null;
    onLoad?: ((...args: any[]) => void) | null;
    onError?: ((...args: any[]) => void) | null;
    onScroll?: ((...args: any[]) => void) | null;
    onMouseEnter?: ((...args: any[]) => void) | null;
    onMouseLeave?: ((...args: any[]) => void) | null;
    [key: string]: any;
}
/** File-field options */
interface W2FieldFileOptions {
    type?: string;
    selected?: any[];
    max?: number;
    maxSize?: number;
    maxFileSize?: number;
    renderItem?: ((item: any, ind: number, removeBtn: string) => string) | null;
    maxItemWidth?: number;
    maxDropHeight?: number;
    maxDropWidth?: number | null;
    readContent?: boolean;
    showErrors?: boolean;
    align?: 'left' | 'right' | 'both' | 'none';
    altRows?: boolean;
    style?: string;
    onClick?: ((...args: any[]) => void) | null;
    onAdd?: ((...args: any[]) => void) | null;
    onRemove?: ((...args: any[]) => void) | null;
    onMouseEnter?: ((...args: any[]) => void) | null;
    onMouseLeave?: ((...args: any[]) => void) | null;
    [key: string]: any;
}
/** Discriminated union: all possible options for a w2field instance */
type W2FieldOptions = W2FieldNumericOptions | W2FieldColorOptions | W2FieldDateOptions | W2FieldTimeOptions | W2FieldDateTimeOptions | W2FieldListOptions | W2FieldEnumOptions | W2FieldFileOptions;
/** Constructor input — the type discriminant lives here */
interface W2FieldInput {
    type?: string;
    el?: HTMLElement | null;
    onClick?: ((...args: any[]) => void) | null;
    onAdd?: ((...args: any[]) => void) | null;
    onNew?: ((...args: any[]) => void) | null;
    onRemove?: ((...args: any[]) => void) | null;
    onMouseEnter?: ((...args: any[]) => void) | null;
    onMouseLeave?: ((...args: any[]) => void) | null;
    onScroll?: ((...args: any[]) => void) | null;
    [key: string]: any;
}
/** Helper elements bag */
interface W2FieldHelpers {
    prefix?: HTMLElement | null;
    suffix?: HTMLElement | null;
    arrows?: HTMLElement | null;
    search?: HTMLElement | null;
    search_focus?: HTMLInputElement;
    multi?: Query;
    [key: string]: any;
}
/** Temp state bag */
interface W2FieldTmp {
    'old-padding-left'?: string | null;
    'old-padding-right'?: string | null;
    'old-background-color'?: string;
    'old-border-color'?: string;
    'old-tabIndex'?: number;
    'min-height'?: number;
    'max-height'?: number;
    'current_width'?: number;
    pholder?: string;
    overlay?: any;
    openedOnFocus?: boolean;
    sizeTimer?: ReturnType<typeof setInterval>;
    [key: string]: any;
}
declare global {
    interface HTMLElement {
        _w2field?: w2field;
    }
    interface HTMLInputElement {
        _w2field?: w2field;
    }
    interface HTMLTextAreaElement {
        _w2field?: w2field;
    }
}
type W2FieldElement = HTMLInputElement | HTMLTextAreaElement;
declare class w2field extends w2base {
    el: W2FieldElement | null;
    selected: any;
    helpers: W2FieldHelpers;
    type: string;
    options: W2FieldOptions;
    onClick: ((...args: any[]) => void) | null;
    onAdd: ((...args: any[]) => void) | null;
    onNew: ((...args: any[]) => void) | null;
    onRemove: ((...args: any[]) => void) | null;
    onMouseEnter: ((...args: any[]) => void) | null;
    onMouseLeave: ((...args: any[]) => void) | null;
    onScroll: ((...args: any[]) => void) | null;
    tmp: W2FieldTmp;
    constructor(type: string | W2FieldInput, options?: W2FieldInput);
    render(el: HTMLElement): void;
    init(): void;
    get(): any;
    set(val: any, append?: boolean): void;
    setIndex(ind: number, append?: boolean): boolean;
    refresh(): number;
    resize(): void;
    reset(): void;
    clean(val: any): any;
    format(val: any): any;
    change(event: Event): false | void;
    click(event: MouseEvent): void;
    focus(event: FocusEvent & {
        showMenu?: boolean;
    }): void;
    blur(_event: FocusEvent): void;
    keyDown(event: KeyboardEvent, extra?: {
        keyCode?: number;
    }): false | void;
    keyUp(event: KeyboardEvent): void;
    findItemIndex(items: any[], id: any, parents?: number[]): number[];
    updateOverlay(_indexOnly?: boolean): void;
    isStrValid(ch: string, loose?: boolean): boolean;
    addPrefix(): void;
    addSuffix(): void;
    addSearch(): void;
    addMultiSearch(): void;
    addFile(file: File): void;
    moveCaret2end(): void;
}

export { Dialog, Tooltip, query, w2alert, w2base, w2color, w2confirm, w2date, w2event, w2field, w2form, w2grid, w2layout, w2locale, w2menu, w2popup, w2prompt, w2sidebar, w2tabs, w2toolbar, w2tooltip, w2ui, w2utils };
