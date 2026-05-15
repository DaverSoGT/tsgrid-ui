/**
 * Part of TsUi 2.0 library
 *  - Dependencies: TsUtils
 *  - on/off/trigger methods id not showing in help
 *  - refactored with event object
 *
 * Chanes in 2.0.+
 * - added unmount that cleans up the box
 *
 */
/**
 * Payload object passed to handlers registered via `.on(eventName, handler)`.
 *
 * IMPORTANT — circular references:
 *   `event.owner` points back to the widget that triggered the event, and that
 *   widget keeps `activeEvents: TsEvent[]` referencing this same payload.
 *   Calling `JSON.stringify(event)` will throw "Converting circular structure
 *   to JSON". Use `toSafeEvent(event)` from `tsgrid-ui` to extract a
 *   serializable subset before storing in reactive state (Angular signals,
 *   React state, Pinia/Redux stores, etc.).
 *
 * Note: the per-class declarations like `onSelect: (event: CustomEvent) => void`
 * in TsGrid/TsForm/etc. are historical noise — the runtime always passes a
 * `TsEventPayload`, never a DOM `CustomEvent`. This will be corrected in v2.0.
 */
interface TsEventPayload<TDetail = unknown> {
    type: string | null;
    phase: 'before' | 'after' | string;
    detail: TDetail & TsEventData;
    target: unknown;
    object: unknown;
    isStopped: boolean;
    isCancelled: boolean;
    /** Reference to the widget that triggered this event. CIRCULAR — do not serialize. */
    owner: unknown;
}
interface TsEventData {
    type?: string | null;
    target?: unknown;
    phase?: string;
    object?: unknown;
    [key: string]: unknown;
}
interface TsEventListener {
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
declare class TsEvent {
    type: string | null;
    detail: TsEventData;
    owner: TsBase;
    target: unknown;
    phase: string;
    object: unknown;
    execute: null;
    isStopped: boolean;
    isCancelled: boolean;
    onComplete: ((edata: TsEvent) => void) | null;
    listeners: Array<(edata: TsEvent) => void>;
    complete: Promise<TsEvent>;
    _resolve: (value: TsEvent) => void;
    _reject: (reason?: unknown) => void;
    constructor(owner: TsBase, edata: TsEventData);
    finish(detail?: Partial<TsEventData>): void;
    done(func: (edata: TsEvent) => void): void;
    preventDefault(): void;
    stopPropagation(): void;
}
/**
 * Extract a JSON-serializable subset of a TsEvent payload, dropping the
 * circular `owner` and `complete` references. Use before storing in
 * Angular signals, React state, Pinia/Redux stores, or any DevTools that
 * snapshots state via JSON.
 *
 * @example
 *   grid.on('select', (event) => {
 *     this.lastSelection.set(toSafeEvent(event))
 *   })
 */
declare function toSafeEvent<TDetail = unknown>(event: unknown): {
    type: string | null;
    phase: string;
    detail: TDetail & TsEventData;
    isStopped: boolean;
    isCancelled: boolean;
};
declare class TsBase {
    activeEvents: TsEvent[];
    listeners: TsEventListener[];
    debug: boolean;
    name?: string;
    box?: HTMLElement | null;
    [key: string]: unknown;
    /**
     * Initializes base object for TsUi, registers it with TsUi object
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
    on(events: string | TsEventData | Array<string | TsEventData>, handler: Function): this;
    /**
     * Removes event listener, supports event phase and event scoping
     *
     * @param {*} edata - an object or string, if string "eventName:phase.scope"
     * @param {*} handler
     * @returns itself
     */
    off(events: string | TsEventData | Array<string | TsEventData>, handler?: Function): this;
    /**
     * Triggers even listeners for a specific event, loops through this.listeners
     *
     * @param {Object} edata - Object
     * @returns modified edata
     *
     * NOTE: `edata` is typed as `any` here intentionally. The method mutates the argument
     * from TsEventData into a TsEvent mid-execution. Runtime type mutation is inherent
     * to the event dispatch pattern. Phase 6 strict tighten will revisit this.
     */
    trigger(eventName: string | TsEventData | TsEvent, edataIn?: TsEventData): TsEvent;
    /**
     * This method renders component into the box. It is overwritten in descendents and in this base
     * component it is empty.
     */
    render(_box?: HTMLElement | string | null): void;
    /**
     * Removes all classes that start with tsg-* and sets box to null. It is needed so that control will
     * release the box to be used for other widgets
     */
    unmount(): void;
}

export { TsBase, TsEvent, type TsEventData, type TsEventListener, type TsEventPayload, toSafeEvent };
