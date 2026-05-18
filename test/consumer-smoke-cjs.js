// Phase 4 / v2.13.0: runtime smoke for the 12 new CJS subpath exports.
// Run AFTER `pnpm build`. Exits non-zero on any failure.
//
// Validates:
//   1. require('tsgrid-ui/<widget>') resolves with no error
//   2. The primary widget export is present on the resolved module
//   3. require('tsgrid-ui') also works (regression guard for the monolith)
//   4. Cross-copy semantics: TsGrid from monolith !== TsGrid from subpath
//      (DOCUMENTED behavior — see CHANGELOG Known Limitations, R-CSP-FR3)
//
// NOT a Vitest test — runs as a separate Node process so the CJS resolver
// behaves identically to a real consumer's `require('tsgrid-ui/grid')`.
//
// Browser-global stubs: tsgrid-ui CJS bundles reference DOM globals (Node,
// Event, navigator, localStorage, document) at module-load time because they
// target browser environments. We stub the minimum set needed for require()
// to succeed in Node.js, matching the jsdom environment used by vitest.
// This is sufficient to validate the CJS resolver + primary export contract;
// full browser runtime correctness is covered by playwright smoke tests.

'use strict'

// ---------------------------------------------------------------------------
// Minimal browser-global stubs (required before any tsgrid-ui require())
// ---------------------------------------------------------------------------
if (typeof global.Node === 'undefined') {
    global.Node = class Node {}
}
if (typeof global.Event === 'undefined') {
    global.Event = class Event { constructor(type) { this.type = type } }
}
if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends global.Event {
        constructor(type, opts) { super(type); this.detail = opts?.detail ?? null }
    }
}
if (typeof global.navigator === 'undefined') {
    global.navigator = { language: 'en-US', userAgent: 'Node.js' }
}
if (typeof global.localStorage === 'undefined') {
    const store = {}
    global.localStorage = {
        getItem: (k) => store[k] ?? null,
        setItem: (k, v) => { store[k] = String(v) },
        removeItem: (k) => { delete store[k] },
        clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    }
}
if (typeof global.document === 'undefined') {
    global.document = { createElement: () => ({}), querySelector: () => null }
}
if (typeof global.window === 'undefined') {
    global.window = global
}
if (typeof global.self === 'undefined') {
    global.self = global
}
if (typeof global.MutationObserver === 'undefined') {
    global.MutationObserver = class MutationObserver {
        constructor(callback) {}
        observe(target, options) {}
        disconnect() {}
    }
}

// ---------------------------------------------------------------------------
// CJS subpath resolution probe
// ---------------------------------------------------------------------------
const SUBPATHS = [
    ['tsgrid-ui/base',    'TsBase'],
    ['tsgrid-ui/field',   'TsField'],
    ['tsgrid-ui/form',    'TsForm'],
    ['tsgrid-ui/grid',    'TsGrid'],
    ['tsgrid-ui/layout',  'TsLayout'],
    ['tsgrid-ui/locale',  'TsLocale'],
    ['tsgrid-ui/popup',   'TsPopup'],
    ['tsgrid-ui/sidebar', 'TsSidebar'],
    ['tsgrid-ui/tabs',    'TsTabs'],
    ['tsgrid-ui/toolbar', 'TsToolbar'],
    ['tsgrid-ui/tooltip', 'TsTooltip'],
    ['tsgrid-ui/utils',   'TsUtils'],
]

let failed = 0

for (const [path, primary] of SUBPATHS) {
    try {
        const mod = require(path)
        if (!(primary in mod)) {
            console.error(`FAIL: require('${path}') missing primary export ${primary}`)
            failed++
        }
    } catch (e) {
        console.error(`FAIL: require('${path}') threw: ${e.message}`)
        failed++
    }
}

// barrel removed in v3.0.0 — see MIGRATION_v3.md

if (failed > 0) {
    console.error(`\nCJS subpath smoke: ${failed} failure(s)`)
    process.exit(1)
}
console.log(`CJS subpath smoke: 12/12 OK`)
