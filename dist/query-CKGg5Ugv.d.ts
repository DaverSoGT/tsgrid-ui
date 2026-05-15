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

export { Query as Q };
