/**
 * Shared branded primitive types for TsUi public API.
 *
 * Branded types prevent accidental cross-assignment of semantically different
 * string/number values (e.g. passing a FieldName where a RecId is expected).
 *
 * Usage:
 *   const id: RecId = 'row-1' as RecId
 *   const panel: LayoutPanelId = 'left' as LayoutPanelId
 *
 * @module types
 */

// ---------------------------------------------------------------------------
// Core brand utility
// ---------------------------------------------------------------------------

/**
 * Creates a branded (nominal) type from a base type K and brand tag T.
 *
 * @example
 *   type UserId = Brand<number, 'UserId'>
 *
 * v2.15.0: Made public (was previously utility-only) to enable re-export via
 * `tsgrid-ui/utils` (R-TG-1, R-TG-2). Consumers deriving their own branded types need it.
 * See design D-4 task 2.5 for rationale.
 */
export type Brand<K, T> = K & { readonly __brand: T }

// ---------------------------------------------------------------------------
// Public branded types
// ---------------------------------------------------------------------------

/**
 * A record identifier value — the `recid` field used across TsGrid records.
 * Can be either a string or a number at runtime; branded to prevent mixing
 * generic string/number primitives with record identifiers.
 *
 * @example
 *   const recid: RecId = 42 as RecId
 */
export type RecId = Brand<string | number, 'RecId'>

/**
 * A TsLayout panel identifier — one of the six panel slots.
 * Branded to distinguish from arbitrary strings.
 *
 * Valid runtime values: `'top' | 'left' | 'main' | 'preview' | 'right' | 'bottom'`
 *
 * @example
 *   const panel: LayoutPanelId = 'left' as LayoutPanelId
 */
export type LayoutPanelId = Brand<string, 'LayoutPanelId'>

/**
 * A TsForm / TsField field name string — the `field` property that maps a
 * form input to a record key.
 * Branded to prevent mixing with arbitrary display labels or column names.
 *
 * @example
 *   const field: FieldName = 'firstName' as FieldName
 */
export type FieldName = Brand<string, 'FieldName'>
