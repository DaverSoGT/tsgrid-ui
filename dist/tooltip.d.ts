import { TsBase } from './base.js';

/**
 * Part of TsUi 2.0 library
 * - Dependencies: mQuery, TsUtils, TsBase
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
 * - options.prefilter - if true, it will show prefiltered items for TsMenu, otherwise all
 * - menu.item.help, menu.item.hotkey, menu.item.extra
 * - options.selected -> for TsMenu
 * - options.tooltip => {}
 * - TsMenu event onTooltip
 * - added onMouseEnter and onMouseLeave for TsMenu
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
/** Options for TsMenu (MenuTooltip) */
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
/** Options for TsColor (ColorTooltip) */
interface ColorOptions extends TooltipOptions {
    advanced?: boolean;
    transparent?: boolean;
    color?: string;
    updateInput?: boolean;
    onSelect?: ((event: unknown) => void) | null;
    onLiveUpdate?: ((event: unknown) => void) | null;
}
/** Options for TsDate (DateTooltip) */
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
/** The overlay object — a TsBase instance extended at runtime with many dynamic props */
type TooltipOverlay = // any: dynamic TsBase extension
InstanceType<typeof TsBase> & {
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
     * Move overlay node to the end of its parent (typically body) so it stacks above other .tsg-overlay siblings
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
declare const TsTooltip: Tooltip;
declare const TsMenu: MenuTooltip;
declare const TsColor: ColorTooltip;
declare const TsDate: DateTooltip;

export { Tooltip, TsColor, TsDate, TsMenu, TsTooltip };
