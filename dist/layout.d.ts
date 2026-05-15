import { T as TsMessageProm } from './tsutils-message-CogFtVtO.js';
import { TsBase } from './base.js';
import { TsTabs } from './tabs.js';
import { TsToolbar } from './toolbar.js';
import './query-CKGg5Ugv.js';

/** Valid panel type names in a layout */
type TsPanelType = 'top' | 'left' | 'main' | 'preview' | 'right' | 'bottom';
/** Content that can be placed in a layout panel */
type TsPanelContent = string | {
    render: (box?: HTMLElement) => void;
    unmount?: () => void;
    box?: HTMLElement | null;
    [key: string]: unknown;
};
/** Individual panel configuration and runtime state */
interface TsLayoutPanel {
    type: TsPanelType | null;
    title: string;
    size: number | string;
    minSize: number;
    maxSize: number | boolean;
    hidden: boolean;
    resizable: boolean;
    overflow: string;
    style: string;
    html: TsPanelContent;
    tabs: TsTabs | Record<string, unknown> | null;
    toolbar: TsToolbar | Record<string, unknown> | null;
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
        html: TsPanelContent;
        html_new: TsPanelContent;
        transition: string;
    }) => void) | null;
    onRefresh: ((event: unknown) => void) | null;
    onShow: ((event: unknown) => void) | null;
    onHide: ((event: unknown) => void) | null;
}
/** Options for the html() method return promise-like */
interface TsHtmlResult {
    panel: string;
    html: TsPanelContent;
    error: boolean;
    cancelled: boolean;
    status?: boolean;
    removed: (cb: () => void) => void;
}
declare class TsLayout extends TsBase {
    box: HTMLElement | null;
    name: string;
    panels: TsLayoutPanel[];
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
    panel_template: TsLayoutPanel;
    [key: string]: any;
    constructor(options: any);
    html(panel: string, data: TsPanelContent, transition?: string): TsHtmlResult;
    message(panel: string, options: unknown): TsMessageProm | undefined;
    confirm(panel: string, options: unknown): TsMessageProm | undefined;
    load(panel: string, url: string, transition?: string): Promise<void | TsHtmlResult>;
    sizeTo(panel: string, size: number | string, instant?: boolean): boolean;
    show(panel: string, immediate?: boolean): boolean | undefined;
    hide(panel: string, immediate?: boolean): boolean | undefined;
    toggle(panel: string, immediate?: boolean): boolean | undefined;
    set(panel: string, options: Partial<TsLayoutPanel>): boolean;
    get(panel: string, returnIndex?: boolean): any;
    el(panel: string): HTMLElement | null;
    hideToolbar(panel: string): void;
    showToolbar(panel: string): void;
    toggleToolbar(panel: string): void;
    assignToolbar(panel: string, toolbar: TsToolbar | string | null): void;
    hideTabs(panel: string): void;
    showTabs(panel: string): void;
    toggleTabs(panel: string): void;
    assignTabs(panel: string, tabs: TsTabs | string | null): void;
    render(box?: HTMLElement | string): number | false | undefined;
    unmount(): void;
    destroy(): boolean | undefined;
    refresh(panel?: string): number | undefined;
    resize(): number | false | undefined;
    resizeBoxes(panel?: string): void;
    lock(panel: string, msg: unknown, showSpinner?: boolean): void;
    unlock(panel: string, speed?: number): void;
}

export { TsLayout, type TsLayoutPanel, type TsPanelContent, type TsPanelType };
