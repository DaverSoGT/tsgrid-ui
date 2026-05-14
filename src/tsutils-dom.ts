/**
 * TsUtils DOM sub-module — scaffold (Phase 5a of v2.4 SDD).
 * DAG position: leaf module (no tsbase/tsutils imports).
 * Phase 5b will replace each stub body with the real extracted implementation.
 *
 * Imports: ./tsutils-string.js (_encodeTags) + DOM globals only.
 * 4-space indent convention.
 *
 * INV-4: MUST NOT import from tsbase.ts or tsutils.ts.
 * INV-8: No arguments.length usage.
 * INV-9: No this.X in exported function bodies.
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Options for TsUtils.lock() — moved from tsutils.ts (Phase 5a of v2.4 SDD) */
export interface TsLockOptions {
    msg?: string | number
    spinner?: boolean
    opacity?: number
    bgColor?: string
    onClick?: () => void
}

// ---------------------------------------------------------------------------
// Stub exports — Phase 5a
// Each function will be replaced with its real body in Phase 5b.
// Stubs throw so that any direct call (not via TsUtils class delegators)
// is a hard failure rather than silent misbehaviour.
// ---------------------------------------------------------------------------

/**
 * Renders a lock overlay on top of a DOM element.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function transition(
    divOld: HTMLElement,
    divNew: HTMLElement,
    type: string,
    callBack?: () => void
): Promise<void> {
    void divOld; void divNew; void type; void callBack
    throw new Error('not implemented in 5a')
}

/**
 * Locks a DOM element with an optional overlay message.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function lock(
    box: unknown,
    options: TsLockOptions | string = {},
    ...rest: unknown[]
): void {
    void box; void options; void rest
    throw new Error('not implemented in 5a')
}

/**
 * Removes the lock overlay from a DOM element.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function unlock(box: unknown, speed?: number): void {
    void box; void speed
    throw new Error('not implemented in 5a')
}

/**
 * Returns a numeric CSS size measurement for a DOM element.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function getSize(el: unknown, type: string): number {
    void el; void type
    throw new Error('not implemented in 5a')
}

/**
 * Measures the pixel dimensions of a string rendered with given styles.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function getStrDimentions(
    str: string,
    styles?: string,
    raw?: boolean
): { width: number; height: number } {
    void str; void styles; void raw
    throw new Error('not implemented in 5a')
}

/**
 * Returns the pixel width of a string rendered with given styles.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function getStrWidth(str: string, styles?: string, raw?: boolean): number {
    void str; void styles; void raw
    throw new Error('not implemented in 5a')
}

/**
 * Returns the pixel height of a string rendered with given styles.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function getStrHeight(str: string, styles?: string, raw?: boolean): number {
    void str; void styles; void raw
    throw new Error('not implemented in 5a')
}

/**
 * Binds DOM events from a subject map to matching child elements.
 * @stub Phase 5a — body lands in Phase 5b
 */
export function bindEvents(
    elements: unknown,
    subject: Record<string, unknown>
): void {
    void elements; void subject
    throw new Error('not implemented in 5a')
}
