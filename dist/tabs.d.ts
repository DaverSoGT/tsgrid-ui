import { TsBase } from './base.js';

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip
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

declare class TsTabs extends TsBase {
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

export { TsTabs };
