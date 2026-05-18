# tsgrid-ui — SDD Project Context

> Mirror of the engram artifact `sdd-init/tsgrid-ui` (#722). Hybrid storage: this file is committable, the engram observation is searchable across sessions.

## Type
TypeScript-native UI component library, ESM-first, dual ESM/CJS bundle, zero runtime dependencies.

## Repository
- GitHub: https://github.com/DaverSoGT/tsgrid-ui (master)
- npm: https://www.npmjs.com/package/tsgrid-ui (`latest = 1.0.1`)
- Demo: https://github.com/DaverSoGT/tsgrid-angular-example

## Stack
| Tool | Version | Role |
| --- | --- | --- |
| TypeScript | 5.9.3 | Source language. Strict mode + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `noImplicitOverride` + `noPropertyAccessFromIndexSignature` |
| tsup | 8.5.1 | JS bundler (esbuild). 3 entries today: ESM, CJS legacy, `.d.ts` rollup |
| Gulp | 4 | CSS/icons. `gulp-less` + `gulp-iconfont` |
| ESLint | 8 | `@typescript-eslint/parser` + `align-assignments`. 4-space indent enforced |
| Vitest | 4.1.5 | Unit tests (84) |
| Playwright | 1.59.1 | Smoke E2E (38, chromium-only) |
| pnpm | 10.29.2 | Package manager |
| Node | 22.16.0 | Runtime; build target `es2022` |

## Testing capabilities (TDD-ready)
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test:unit` — Vitest (watch: `pnpm test:unit:watch`)
- `pnpm consumer-smoke` — independent typecheck of public API
- `pnpm smoke` — Playwright (requires `pnpm build` first; webServer is `python -m http.server 3500`)
- `pnpm verify` — lint + typecheck + consumer-smoke + test:unit + smoke
- `pnpm test` — lint + typecheck (pre-commit chain)

`strict_tdd = true` — watchable unit tests + isolated typecheck + integration smoke is feasible per phase.

## Build pipeline
- `pnpm build:css` = gulp less + gulp icons
- `pnpm build:js` = tsup + `node scripts/wrap-legacy.mjs` (IIFE wrapper for AMD/CommonJS/globals)
- `pnpm build` = both

**Important**: `dist/` is versioned in git deliberately for traceability. Building regenerates `dist/tsgrid-ui.{js,es6.js,d.ts,css,min.css}` + iconfont. `gulp icons` is non-deterministic in woff metadata (~2 bytes change per run) — accepted noise.

## Source layout
```
src/
├── index.ts                   ESM barrel (entry for dist/tsgrid-ui.es6.js)
├── index-legacy.ts            CJS legacy entry (entry for dist/tsgrid-ui.js)
├── ts{base,utils,locale,event}.ts   foundational classes
├── ts{grid,form,field,layout,sidebar,tabs,toolbar,popup,tooltip}.ts  widgets
├── query.ts                   internal jQuery-like wrapper
├── types.ts                   branded primitives (RecId, etc.)
└── less/                      Gulp-compiled stylesheets + iconfont sources
```

## Conventions
- **Commits**: conventional commits with scope. **NEVER** add `Co-Authored-By` or AI attribution
- **Naming**: `Ts*` for classes, `Ts*Foo` for types/interfaces, files `ts*.ts` (lowercase, no separator)
- **No build after changes** unless user explicitly authorizes
- **Indent**: 4 spaces (ESLint enforced)
- **Branch flow**: master is mainline, tags `v*` for releases, `origin` = DaverSoGT/tsgrid-ui, `upstream` = vitmalina/w2ui (preserved for cherry-picks)
- **CHANGELOG — additive-with-caveat pattern**: when a release is SemVer MINOR/PATCH ("purely additive", no breaking changes) but a consumer who adopts the new feature in isolation may experience a non-obvious consequence (a subset import missing functionality, a smaller artifact lacking a dependency, an optional behavior that needs extra setup), the entry MUST include a **Known Limitations** section that documents the caveat with: (a) what the consumer literally sees when they hit the limitation, (b) the workaround or fallback path, (c) the tracker for future resolution if any. Mirror the limitation to `README.md` and `MIGRATION_v2.md` for the same release. Template reference: v2.12.0 icon-glyph entry (`CHANGELOG.md` L49-60) — the per-widget CSS subpaths ship without OpenSans, so icon glyphs render as empty boxes unless the consumer also imports the monolith. Do NOT bury the caveat under generic notes; surface it at the top of Known Limitations.
- **`package.json#sideEffects` — pairing-by-name ordering**: when a subpath ships in BOTH ESM and CJS format (e.g. `./dist/utils.es6.js` + `./dist/utils.js`), the two entries MUST appear adjacent in the `sideEffects[]` array — ESM first, CJS immediately after — and not be split across the array. This overrides the older "appended alphabetically" rule that only governed first-time per-format additions (v2.12.0 CSS entries follow alphabetic-append because there is only one format). Rationale: a future reader scanning `sideEffects[]` should see the dual-format pair as a single unit; splitting them creates misleading distance and invites accidental removal of one side. Template reference: `package.json` L7-8 (utils ESM + CJS pair, after v2.13.0 cjs-subpath-parity cycle). When other subpaths gain CJS counterparts in future cycles, follow the same pairing rule; do NOT alphabetize the CJS entries separately.

## Active session preferences
- Mode: **automatic** — chain phases back-to-back, show only final result per phase
- Artifact store: **hybrid** — engram + openspec/ files
- Delivery strategy: **ask-on-risk** — pause if review budget exceeds 400 LOC

## SDD topic key format
`sdd/{change-name}/{phase}` (e.g. `sdd/tsgrid-multi-entry/proposal`)

## Strategic backlog (informational; not all in-flight)
- v1.1.0 multi-entry exports — IN FLIGHT, this SDD cycle
- v2.0 breaking — correct event handler signatures `CustomEvent` → `TsEventPayload`
- GitHub Release notes for v1.0.0 and v1.0.1 from CHANGELOG.md
- Repo discoverability (Topics, description) on tsgrid-ui main repo
