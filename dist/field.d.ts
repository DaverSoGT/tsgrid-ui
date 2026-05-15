import { TsBase } from './base.js';
import { Q as Query } from './query-CKGg5Ugv.js';

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip, TsColor, TsMenu, TsDate
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
interface TsFieldNumericOptions {
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
interface TsFieldColorOptions {
    type?: string;
    prefix?: string;
    suffix?: string;
    arrows?: boolean;
    advanced?: boolean | null;
    transparent?: boolean;
    [key: string]: any;
}
/** Date-field options */
interface TsFieldDateOptions {
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
interface TsFieldTimeOptions {
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
interface TsFieldDateTimeOptions {
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
interface TsFieldListOptions {
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
interface TsFieldEnumOptions {
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
interface TsFieldFileOptions {
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
/** Discriminated union: all possible options for a TsField instance */
type TsFieldOptions = TsFieldNumericOptions | TsFieldColorOptions | TsFieldDateOptions | TsFieldTimeOptions | TsFieldDateTimeOptions | TsFieldListOptions | TsFieldEnumOptions | TsFieldFileOptions;
/** Constructor input — the type discriminant lives here */
interface TsFieldInput {
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
interface TsFieldHelpers {
    prefix?: HTMLElement | null;
    suffix?: HTMLElement | null;
    arrows?: HTMLElement | null;
    search?: HTMLElement | null;
    search_focus?: HTMLInputElement;
    multi?: Query;
    [key: string]: any;
}
/** Temp state bag */
interface TsFieldTmp {
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
        _w2field?: TsField;
    }
    interface HTMLInputElement {
        _w2field?: TsField;
    }
    interface HTMLTextAreaElement {
        _w2field?: TsField;
    }
}
type TsFieldElement = HTMLInputElement | HTMLTextAreaElement;
declare class TsField extends TsBase {
    el: TsFieldElement | null;
    selected: any;
    helpers: TsFieldHelpers;
    type: string;
    options: TsFieldOptions;
    onClick: ((...args: any[]) => void) | null;
    onAdd: ((...args: any[]) => void) | null;
    onNew: ((...args: any[]) => void) | null;
    onRemove: ((...args: any[]) => void) | null;
    onMouseEnter: ((...args: any[]) => void) | null;
    onMouseLeave: ((...args: any[]) => void) | null;
    onScroll: ((...args: any[]) => void) | null;
    tmp: TsFieldTmp;
    constructor(type: string | TsFieldInput, options?: TsFieldInput);
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

export { TsField, type TsFieldColorOptions, type TsFieldDateOptions, type TsFieldDateTimeOptions, type TsFieldElement, type TsFieldEnumOptions, type TsFieldFileOptions, type TsFieldListOptions, type TsFieldNumericOptions, type TsFieldOptions, type TsFieldTimeOptions };
