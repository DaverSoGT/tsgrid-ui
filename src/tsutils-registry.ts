/**
 * TsUi registry + checkName — Phase 0 of v2.3 SDD.
 * DEPENDENCY-FREE: zero imports from tsutils/tsbase family.
 *
 * Hosts the mutable widget registry object (TsUi) and the name-validation
 * helper (checkName) that were previously coupled to tsbase.ts via tsutils.ts,
 * creating a tsbase ↔ tsutils import cycle. Moving them here breaks that cycle:
 *
 *   tsbase.ts → tsutils-registry.ts → tsutils-type-guards.ts → (leaf)
 *
 * tsutils.ts re-exports TsUi from this module (does NOT re-declare it) to
 * preserve the single-object identity required by INV-12 (referential equality
 * across all import paths).
 *
 * Imports: only isAlphaNumeric from ./tsutils-type-guards.js
 * Exports: TsUi, checkName
 */

import { isAlphaNumeric } from './tsutils-type-guards.js'

/** Widget registry — widgets register here when constructed with a `name`. */
export const TsUi: Record<string, unknown> = {}

/**
 * Validates a widget name and ensures it is not already registered in TsUi.
 * Returns false (with console.log) on invalid or duplicate names.
 * Behavior is byte-identical to former TsUtils.checkName (tsutils.ts:1842-1856).
 */
export function checkName(name: string): boolean {
    if (name == null) {
        console.log('ERROR: Property "name" is required but not supplied.')
        return false
    }
    if (TsUi[name] != null) {
        console.log(`ERROR: Object named "${name}" is already registered as TsUi.${name}.`)
        return false
    }
    if (!isAlphaNumeric(name)) {
        console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).')
        return false
    }
    return true
}
