import { TsBase } from './base.js';
import './query-CKGg5Ugv.js';

/**
 * TsUtils message cluster (message/alert/confirm/prompt/normButtons + types)
 * — Phase 2-4 of v2.3 SDD (message-cluster-extraction).
 *
 * IMPORTANT: This module imports TsBase from tsbase.ts — the only carve-out
 * to INV-4. Rationale: message() does `new TsBase()` to mix events into msgBase.
 * This exception is documented here and whitelisted in the INV-4 grep policy.
 *
 * Exports (Phase 2):
 *   normButtons — standalone pure helper; no DOM, no timers
 *
 * Exports (Phase 3a):
 *   TsMessageProm, TsMessageWhere, TsMessageOptions (types)
 *   MessageDeps (deps interface for _message — scaffold for Phase 3b)
 *   _message (stub — body lands in Phase 3b)
 *
 * Exports (Phase 3b+):
 *   _message (full body), _alert, _confirm, _prompt (Phase 4)
 *
 * Imports: TsBase from tsbase.ts (INV-4 carve-out, see above)
 *          TsUISettings type from tsutils.ts (type-only, no runtime dep)
 *          query from query.js (DOM helper)
 */

/** Promise-chain handle returned by message() / confirm() / prompt() */
interface TsMessageProm {
    self: TsBase;
    action(callBack: (event: unknown) => void): TsMessageProm;
    close(callBack: (event: unknown) => void): TsMessageProm;
    open(callBack: (event: unknown) => void): TsMessageProm;
    then(callBack: (event: unknown) => void): TsMessageProm;
    change?: (callBack: (event: unknown) => void) => TsMessageProm;
    [key: string]: unknown;
}
/** Where-descriptor for message() */
interface TsMessageWhere {
    box: string | Element | null;
    after?: string | Element | null;
    owner?: {
        name?: string;
        lock?: (...args: unknown[]) => void;
        unlock?: (...args: unknown[]) => void;
        focus?: () => void;
    };
    param?: unknown;
}
/** Options for message() */
interface TsMessageOptions {
    width?: number;
    height?: number;
    text?: string | null;
    body?: string;
    buttons?: string;
    html?: string;
    focus?: number | string | null;
    hideOn?: string[];
    actions?: Record<string, unknown>;
    cancelAction?: string;
    on?: unknown;
    onOpen?: unknown;
    onClose?: unknown;
    onAction?: unknown;
    originalWidth?: number;
    originalHeight?: number;
    msgIndex?: number;
    tmp?: {
        zIndex: string;
        overflow: string;
    };
    input?: Element | null;
    box?: Element | null;
    trigger?: (event: string, data: Record<string, unknown>) => unknown;
    close?: () => void;
    setFocus?: (focus: number | string | null | undefined) => void;
    action?: (action: string, event: unknown) => void;
    [key: string]: unknown;
}

export type { TsMessageProm as T, TsMessageOptions as a, TsMessageWhere as b };
