import { TsBase, TsEventPayload } from './base.js';

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTabs, TsToolbar, TsTooltip, TsField
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

declare class TsForm extends TsBase {
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
    onRequest: ((event: TsEventPayload) => void) | null;
    onLoad: ((event: TsEventPayload) => void) | null;
    onValidate: ((event: TsEventPayload) => void) | null;
    onSubmit: ((event: TsEventPayload) => void) | null;
    onProgress: ((event: TsEventPayload) => void) | null;
    onSave: ((event: TsEventPayload) => void) | null;
    onChange: ((event: TsEventPayload) => void) | null;
    onInput: ((event: TsEventPayload) => void) | null;
    onRender: ((event: TsEventPayload) => void) | null;
    onRefresh: ((event: TsEventPayload) => void) | null;
    onResize: ((event: TsEventPayload) => void) | null;
    onDestroy: ((event: TsEventPayload) => void) | null;
    onAction: ((event: TsEventPayload) => void) | null;
    onToolbar: ((event: TsEventPayload) => void) | null;
    onError: ((event: TsEventPayload) => void) | null;
    msgRefresh: string;
    msgSaving: string;
    msgServerError: string;
    ALL_TYPES: string[];
    LIST_TYPES: string[];
    TsFIELD_TYPES: string[];
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

export { TsForm };
