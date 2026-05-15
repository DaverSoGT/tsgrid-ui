import { TsBase } from './base.js';

/**
 * Part of TsUi 2.0 library
 *  - Dependencies: mQuery, TsUtils, TsBase, TsTooltip, TsColor, TsMenu
 *
 * == TODO ==
 *  - tab navigation (index state)
 *  - vertical toolbar
 *  - TsMenu on second click of tb button should hide
 *  - button display groups for each show/hide, possibly add state: { single: t/f, multiple: t/f, type: 'font' }
 *  - item.count - should just support html, so a custom block can be created, such as a colored line
 *
 * == 2.0 changes
 *  - CSP - fixed inline events
 *  - removed jQuery dependency
 *  - item.icon - can be class or <custom-icon-component> or <svg>
 *  - new w2tooltips and TsMenu
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

declare class TsToolbar extends TsBase {
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

export { TsToolbar };
