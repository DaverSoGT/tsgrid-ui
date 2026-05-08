## Road to 2.0
The `master` branch has a new, in-progress version of w2ui. You might want to consider [1.5 branch](https://github.com/vitmalina/w2ui/tree/w2ui-1.5) that is stable and supports older browsers. Here are the goals for the new version of w2ui.

[Road to 2.0 discussion](https://github.com/vitmalina/w2ui/discussions/1955)

**W2UI v.2 no longer requires jQuery as a dependency**. You can download it from the master branch and at the moment, it is stable enough to be considrered for a Release Candidate. All [demos](https://w2ui.com/web/demos) have been updated to work as ES6 modules without any dependencies.

## About W2UI

W2UI is a modern JavaScript UI library for building rich web applications. It aims to let you define your UI in a declarative way via JSON data structures.

The library has a small footprint (120KB gzipped) and has **NO DEPENDENCIES** (as of v2.0). W2UI can be used in Vanilla JS projects, ES6 modules, as well as in Angular, React, and Vue based projects.

The library implements the following UI controls:

* **[w2grid](http://w2ui.com/web/docs/1.5/layout/grid)** - an advanced Grid component - *[demo](http://w2ui.com/web/demos/#/grid/1)*
* **[w2toolbar](http://w2ui.com/web/docs/1.5/toolbar)** - a Toolbar component - *[demo](http://w2ui.com/web/demos/#/toolbar/1)*
* **[w2sidebar](http://w2ui.com/web/docs/1.5/sidebar)** - a Tree/Sidebar component - *[demo](http://w2ui.com/web/demos/#/sidebar/1)*
* **[w2tabs](http://w2ui.com/web/docs/1.5/tabs)** - Tabs - *[demo](http://w2ui.com/web/demos/#/tabs/1)*
* **[w2form](http://w2ui.com/web/docs/1.5/form)** - Forms - *[demo](http://w2ui.com/web/demos/#/form/1)*
* **[w2fields](http://w2ui.com/web/docs/1.5/fields)** - various Fields - *[demo](http://w2ui.com/web/demos/#/fields/1)*
* **[w2popup](http://w2ui.com/web/docs/1.5/popup)** - a Popup component - *[demo](http://w2ui.com/web/demos/#/popup/1)*
* **[w2layout](http://w2ui.com/web/docs/1.5/layout)** - a Layout component - *[demo](http://w2ui.com/web/demos/#/layout/1)*
* **[w2utils](http://w2ui.com/web/docs/1.5/utils)** - various utilities - *[demo](http://w2ui.com/web/demos/#/utils/1)*

The complete library is under **100Kb** (minified & gzipped).

## Quick Start

Current stable version is 1.5 (supports older browsers).
Current development version is 2.0.

[Getting Started Guide](http://w2ui.com/web/get-started)

You can download latest stable version here: [http://w2ui.com](http://w2ui.com). If you want to use the dev version, see the `dist/` folder in the master branch.

To start using the library you need to include into your page:

- w2ui.js (or w2ui.min.js)
- w2ui.css (or w2ui.min.css)

All the controls and their css classes are defined inside of these two files. There are no image dependencies. Some images and font icons are embedded into the CSS file.

There is no requirement for a server side language. Node, Java, PHP, ASP, Perl or .NET will all work, as long as you can
return JSON format from the server (or write a converter into JSON format on the client). Some server side example implementations
can be found [here](https://github.com/vitmalina/w2ui/tree/master/server).

## Documentation & Demos

You can find documentation and demos here:

* [http://w2ui.com/web/docs](http://w2ui.com/web/docs) - documentation
* [http://w2ui.com/web/demos](http://w2ui.com/web/demos) - detailed demos


## Bug Tracking

Have a bug or a feature request? Please open an issue here [https://github.com/vitmalina/w2ui/issues](https://github.com/vitmalina/w2ui/issues).
Please make sure that the same issue was not previously submitted by someone else.

## Building

This is a Node.js + pnpm repository. Install dependencies and run the build:

```
pnpm install
pnpm build
```

The build produces:

- `dist/w2ui.js` — IIFE/CJS/AMD bundle with global `window.w2ui` registration (legacy script-tag consumers and the jQuery `w2compat` shim)
- `dist/w2ui.es6.js` — pure ESM bundle for `import` consumers
- `dist/w2ui.d.ts` — TypeScript type declarations rolled up across all 23 public exports
- `dist/w2ui.css` / `dist/w2ui-dark.css` — compiled stylesheets (and `.min.css` variants)
- `dist/w2ui-font.woff` — embedded into the CSS via base64

JavaScript bundling is done by **tsup** (esbuild) and CSS/iconfont by **gulp**. The CSS-side Gulp tasks (`gulp` / `gulp less` / `gulp icons`) still work standalone if you only need to rebuild stylesheets; the v2.0 JS-bundling tasks (`pack` / `build` / `build_es6`) were removed in v2.1 — JS is now owned by tsup.

### Other scripts

- `pnpm test` — ESLint + `tsc --noEmit` (lint + typecheck)
- `pnpm smoke` — Playwright smoke harness for grid, form, layout, sidebar, popup, and tooltip widgets
- `pnpm verify` — `test` + `smoke` (use as your CI signal)
- `pnpm start` — local server on http://localhost:3500 to preview the demos

## TypeScript Support

Starting with v2.1.0, w2ui ships with full TypeScript type declarations.

```ts
import { w2grid, type W2GridColumn } from 'w2ui'
import 'w2ui/css'

const grid = new w2grid({
    name: 'myGrid',
    columns: [
        { field: 'recid', text: 'ID',   size: '10%' },
        { field: 'fname', text: 'Name', size: '50%' },
    ] satisfies W2GridColumn[],
    records: [
        { recid: 1, fname: 'Alice' },
        { recid: 2, fname: 'Bob' },
    ],
})
grid.render('#main')
```

All 23 public exports are typed, including widget classes (`w2grid`, `w2form`, `w2field`, `w2layout`, `w2sidebar`, `w2tabs`, `w2toolbar`, `w2popup`, `w2tooltip`), helper functions (`w2alert`, `w2confirm`, `w2prompt`, `w2menu`, `w2color`, `w2date`), utilities (`w2utils`, `w2locale`, `w2base`, `w2event`, `query`, `Tooltip`, `Dialog`), and domain interfaces (`W2GridColumn`, `W2GridSearch`, `W2GridSelection`, `W2MessageProm`, etc.).

The library is compiled under TypeScript strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` enabled. See [`CHANGELOG.md`](CHANGELOG.md) for the full v2.1.0 native-port history.

## File Structure

```
- demos       - all demos, same as on w2ui.com
- dist        - compiled JS and CSS files
- docs        - stand alone documentation, same as on w2ui.com
- es6mods     - ES6 modules playground
- libs        - external libs, some used in demos, etc.
- server      - server api samples (to get you started)
- specs       - test automation
- src         - source JS files
  - less      - LESS files (source for css)
  - locale    - int18n - translation to other languages
- test        - manual testing files
```

## Who Is Using W2UI

[List of projects that use **`w2ui`**](https://github.com/vitmalina/w2ui/wiki/Projects-that-use-w2ui)!

If you're using **`w2ui`**, I'd love to hear about it, please email to `vitmalina@gmail.com` the name of your project and a link to a public website or demo, and I will add it to the list.

## Contributing

Your contributions are welcome. However, a few things you need to know before contributing:

1. Please check out the latest code before changing anything. It is harder to merge if your changes will not merge cleanly.
2. If you are changing source files - do all changes in `/src` (TypeScript as of v2.1.0)
3. If you are changing CSS files - do all changes in LESS in /src/less/src
4. If you want to help with unit test - do all changes in /qa
5. If you want to change documentation - do all changes in /docs
6. If you want to add demos - do all changes in /demos
