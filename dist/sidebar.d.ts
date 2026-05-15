import { TsBase } from './base.js';

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip, TsMenu
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
interface TsSidebarRefreshOptions {
    recursive?: boolean;
}
/** Options accepted by update() — mirrors node property names that can be updated in-place */
interface TsSidebarUpdateOptions {
    icon?: string | ((nd: unknown, level: number) => string) | null;
    class?: string | null;
    style?: string | null;
    text?: string | ((nd: unknown, level: number) => string) | null;
    count?: number | string | null;
    [key: string]: unknown;
}
/** Options accepted by setCount() */
interface TsSidebarSetCountOptions {
    className?: string;
    style?: string;
    noRepeat?: boolean;
}
/** Options for find() */
interface TsSidebarFindOptions {
    returnDisabled?: boolean;
    returnGroups?: boolean;
    [key: string]: unknown;
}
/** Options for sort() */
interface TsSidebarSortOptions {
    foldersFirst?: boolean;
    caseSensitive?: boolean;
    reverse?: boolean;
    [key: string]: unknown;
}
declare class TsSidebar extends TsBase {
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
    setCount(id: any, count: any, options?: TsSidebarSetCountOptions): void;
    find(parent?: any, params?: any, results?: any): any;
    sort(options: TsSidebarSortOptions | null | undefined, nodes?: any): void;
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
    getChain(nodes?: any, options?: TsSidebarFindOptions): any[];
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
    update(id: any, options?: TsSidebarUpdateOptions): TsSidebarUpdateOptions;
    refresh(id?: any, options?: TsSidebarRefreshOptions): number | undefined;
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

export { TsSidebar, type TsSidebarFindOptions, type TsSidebarRefreshOptions, type TsSidebarSetCountOptions, type TsSidebarSortOptions, type TsSidebarUpdateOptions };
