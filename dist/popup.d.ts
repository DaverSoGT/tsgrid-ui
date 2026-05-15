import { T as TsMessageProm } from './tsutils-message-CogFtVtO.js';
import { TsBase } from './base.js';
import './query-CKGg5Ugv.js';

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
declare class TsDialog extends TsBase {
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
     * - TsPopup.open('ddd').ok(() => { TsPopup.close() })
     * - TsPopup.open('ddd', { height: 120 }).ok(() => { TsPopup.close() })
     * - TsPopup.open({ body: 'text', title: 'caption', actions: ["Close"] }).close(() => { TsPopup.close() })
     * - TsPopup.open({ body: 'text', title: 'caption', actions: { Close() { TsPopup.close() }} })
     */
    open(options?: any, extraOptions?: any): (Record<string, unknown> & {
        self: TsDialog;
        action(callBack: any): Record<string, unknown> & /*elided*/ any;
        close(callBack: any): Record<string, unknown> & /*elided*/ any;
        then(callBack: any): Record<string, unknown> & /*elided*/ any;
    }) | undefined;
    load(options: any): Promise<unknown>;
    template(data: any, id: any, options?: any): (Record<string, unknown> & {
        self: TsDialog;
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
    message(options: any): TsMessageProm | undefined;
    confirm(options: any): TsMessageProm | undefined;
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
declare function TsAlert(msg: any, title?: any, callBack?: any): any;
declare function TsConfirm(msg: any, title?: any, callBack?: any): any;
declare function TsPrompt(label: any, title?: any, callBack?: any): any;
declare const TsPopup: TsDialog;

export { TsAlert, TsConfirm, TsDialog, TsPopup, TsPrompt };
