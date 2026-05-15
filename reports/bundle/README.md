# reports/bundle — Bundle analysis artifacts

This directory contains committed bundle baseline snapshots and ephemeral advisory reports for **tsgrid-ui**.

---

## Directory contents

| File | Committed? | Description |
|------|-----------|-------------|
| `v{X.Y.Z}-baseline.json` | **YES** — one per release | Versioned ESM bundle composition snapshot. Phase 2+ acceptance testing reads this. |
| `latest.md` | NO — gitignored | Ephemeral per-module advisory table, regenerated on every `pnpm bundle:analyze` run. |

---

## Scope of measurement

### ESM non-minified only

The metafile analysis covers the **ESM non-minified** output only (`dist/tsgrid-ui.es6.js`).

**CJS analysis is out of scope** for this cycle. The CJS bundle (`dist/tsgrid-ui.js`) is post-processed by
`scripts/wrap-legacy.mjs` which splices an IIFE wrapper after tsup emits it. The pre-wrap byte counts in
the esbuild metafile are not representative of the shipped CJS artifact (the wrapper adds significant
overhead), making them non-comparable to ESM numbers without careful normalization. CJS analysis is
deferred to a future cycle.

### `splitting: true` — v2.8.1+ (Phase 4 / cycle 4)

As of v2.8.1, the ESM non-min block uses `splitting: true`. esbuild extracts shared code into
`dist/chunks/chunk-<8CHAR>.js` files. With 12 entry points, 10 chunks are produced.

The `modules[].bytesInOutput` values in `v2.8.1-baseline.json` now represent the monolith entry's
contribution (since the analyze config uses the same 12-entry setup as prod).

**v2.8.0 and earlier** used `splitting: false` — the `modules[]` array measured each module's
byte contribution to the single monolithic output. This measurement is preserved in
`v2.8.0-baseline.json` (schema v2, frozen per INV-BBI-5).

---

## Subpath semantics with `splitting: true` (v2.8.1+)

With `splitting: true`, each subpath dist file (`dist/{name}.es6.js`) is a **tiny import stub**
(118–371 B) that re-exports from shared chunks in `dist/chunks/`.

- A consumer importing two subpaths (e.g. `tsgrid-ui/popup` + `tsgrid-ui/form`) loads only
  the **union of their chunks** — shared chunks are loaded once, not duplicated.
- This produces measurable savings for multi-subpath consumers:
  - SC-A (popup + form): 19.8% reduction
  - SC-B (popup + tooltip + tabs): 54.9% reduction
  - See `reports/bundle/v2.8.1-splitting-savings.md` for full scenario table.

**Note**: `dist/{name}.es6.js` stub sizes in `v2.8.1-baseline.json` are very small (118–371 B)
because all module code moved to chunks. The `forecastBytes` values reflect stub sizes, NOT
effective consumer sizes. Effective consumer size = stub + transitive chunk union.

---

## Chunk `.d.ts` files (tsup-internal)

`dist/` may contain hash-suffixed `.d.ts` files such as `query-CKGg5Ugv.d.ts` or
`tsutils-message-CogFtVtO.d.ts`. These are tsup's internal chunks emitted when multiple
`dts: only` block entries reference shared TypeScript declarations.

- **Required**: yes — subpath `.d.ts` files (`popup.d.ts`, `field.d.ts`, etc.) `import` from these
  chunks. Removing them breaks consumer type resolution.
- **Deterministic**: yes — filenames and content are byte-stable across consecutive rebuilds of the
  same source.
- **Not stable across tsup upgrades**: the hash suffix depends on tsup's internal chunking algorithm.
  A future tsup major version may change the hash, requiring a `dist/` rebuild + commit. Document the
  new chunk names here when that happens.
- **Phase 3 forward note**: when `splitting: true` lands, these chunks become shared ESM chunks too
  (visible in `.es6.js` output files). Update this section then.

---

## Schema reference (`v{X.Y.Z}-baseline.json`)

```jsonc
{
  "schemaVersion": 1,              // integer — bumped on breaking schema change
  "tsgridUiVersion": "2.7.1",      // matches release tag (without "v" prefix)
  "generatedAt": "<ISO-8601>",     // informational — excluded from diff equality
  "generator": {
    "tool": "tsup",                // bundler
    "toolVersion": "8.5.1",        // devDep version (tracks metafile schema drift)
    "esbuildMetafile": true
  },
  "scope": {
    "format": "esm",               // ESM only — CJS not measured (see above)
    "minified": false,             // non-minified ESM only
    "entry": "src/index.ts",
    "output": "dist/tsgrid-ui.es6.js",
    "splitting": false,            // single output chunk (see above)
    "sourcemap": true
  },
  "outputBundle": {
    "path": "dist/tsgrid-ui.es6.js",
    "totalBytes": 945470,          // actual on-disk file size in bytes
    "imports": []                  // always [] when splitting: false
  },
  "modules": [                     // sorted by path ASC for diff stability
    {
      "path": "src/tstooltip.ts",
      "bytes": 178240,             // source file size before bundling
      "bytesInOutput": 116932,     // bytes contributed to output after bundling
      "imports": ["src/query.ts", "src/tsbase.ts", "src/tsutils.ts"]
    }
    // ... one entry per src/*.ts contributing to the bundle
  ],
  "totals": {
    "modules": 33,
    "inputBytes": 1459638,         // sum of modules[].bytes
    "outputBytes": 945470          // equals outputBundle.totalBytes
  }
}
```

---

## Schema v3 — v2.8.1 additions (Opt-C deferral)

Schema v3 extends v2 with the following **sole additions**:

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | `3` | Bumped from 2 to signal splitting:true is active |
| `scope.splitting` | `true` | Honestly reflects the active config (`splitting: true` in ESM non-min block) |

**No chunks block in schema v3.** Chunk-level tracking (`chunks` dictionary, `chunkImports[]`
per subpath, `chunksTotalBytes`) was deferred to cycle 5+ per Amendment 1, Opt C decision.

**Reasons for deferral**:
1. esbuild's `[name]` token is hardcoded to `"chunk"` for all auto-generated shared chunks —
   no semantic names are available without a post-build rename script (Option W1, deferred).
2. Stable key normalization (strip hash suffix) produces collisions when all chunks are named
   `chunk-<HASH>` (every key would be `chunks/chunk.js`).
3. Singleton refactor (cycle 5) is the natural point to revisit: after refactoring the 3
   side-effectful singletons, chunk topology may change significantly, making cycle 5 the
   correct time to introduce chunk tracking alongside semantic naming.

**Implications for consumers of this JSON**:
- Code reading `v2.8.1-baseline.json` MUST check `schemaVersion` before assuming field presence.
- The `chunks` key is ABSENT at schema v3 — do not treat its absence as a parse error.
- The `subpaths` block is present (inherited from schema v2) and measures stub file sizes
  (118–371 B each), NOT the effective consumer size (stub + transitive chunks).

**Out-of-scope items** (context for future implementors):
- `OUT-CSSE-6`: Chunk-level tracking (stable keys, `chunks` block, `chunkImports[]`) — deferred to cycle 5+.
- `OUT-CSSE-7`: Semantic chunk naming via post-build rename script (Option W1) — deferred.

**Schema selection (β gate)**: `scripts/bundle-snapshot.mjs` emits schemaVersion 3 IFF
`pkg.version >= 2.8.1`. Versions in `[2.8.0, 2.8.1)` emit schemaVersion 2. Below 2.8.0: schema v1.

---

## Schema v2 — v2.8.0 additions

Schema v2 extends v1 with a top-level `subpaths` block keyed by subpath short name.

| Field | Type | Description |
|-------|------|-------------|
| `subpaths.{name}.totalBytes` | number | On-disk file size of `dist/{name}.es6.js` after build |
| `subpaths.{name}.sourceFile` | string | Source entry file (e.g. `"src/tslocale.ts"`) |
| `subpaths.{name}.outputFile` | string | Output file path |
| `subpaths.{name}.forecastBytes` | number | Analytical forecast from transitive closure analysis |
| `subpaths.{name}.forecastPct` | number | Forecast as % of monolith (informational) |

**Schema selection (β gate)**: `scripts/bundle-snapshot.mjs` emits schemaVersion 2 IFF
`pkg.version >= 2.8.0`. Lower versions emit schemaVersion 1 unchanged (SC-SX-18).

Phase 3+ scripts MUST check `schemaVersion` before reading the `subpaths` block.

---

## How to regenerate

### Advisory summary (ephemeral, NOT committed)

```bash
pnpm bundle:analyze
# → writes reports/bundle/latest.md (gitignored)
```

### Versioned committed snapshot

```bash
pnpm bundle:snapshot -- --version=vX.Y.Z
# → writes reports/bundle/vX.Y.Z-baseline.json (commit this file)
```

The double-dash (`--`) is required — pnpm uses `--` to separate its own flags from script arguments.

---

## Hard-gate role (INV-CYCLE-1-HARD-GATE)

`reports/bundle/v2.7.1-baseline.json` is a **prerequisite for Phase 2 (subpath exports) launch**.

Phase 2's acceptance criterion is "subpath bundle floor < X% of monolith baseline". Without the v2.7.1
baseline JSON on `master`, the X value is undefined and Phase 2 has no measurable acceptance target.

**Phase 2 MUST NOT start until `git show HEAD:reports/bundle/v2.7.1-baseline.json` exits 0 on `master`.**

---

## Maintenance

`tsup.config.analyze.ts` is a standalone copy of the ESM non-min block from `tsup.config.ts`
(with `metafile: true` added). This is intentional — it ensures the analyze pipeline has zero
shared code with the production pipeline, making byte-identical production builds provable by inspection.

**If the ESM non-min block in `tsup.config.ts` changes any of these settings:**

| Setting | Location in tsup.config.ts |
|---------|---------------------------|
| `target` | ESM non-min block (currently `es2022`) |
| `outDir` | All blocks (currently `dist`) |
| `sourcemap` | ESM non-min block (currently `true`) |
| `outExtension` | ESM non-min block (returns `{ js: '.js' }`) |
| `splitting` | ESM non-min block (currently `true`); CJS blocks remain `false` |
| `esbuildOptions.chunkNames` | ESM non-min block (`'chunks/[name]-[hash]'`; must NOT use `[hash:8]`) |

**You MUST manually mirror the change in `tsup.config.analyze.ts`.** Drift is detected at snapshot
regen time by the Q5 assertion in `bundle-snapshot.mjs` (exit code 5 on mismatch), but NOT at
build time. Fix any drift before running `pnpm bundle:snapshot`.

### Phase 3+ schema bumps

`scripts/bundle-snapshot.mjs` will emit schemaVersion 3 for v2.8.1+ (done — see schema v3 section below).
Phase 4+ may introduce schemaVersion 4 if chunk-level tracking lands (OUT-CSSE-6, deferred to cycle 5+).

---

> **Update (post wrap-legacy-determinism cycle)**: CJS SHAs
> (`dist/tsgrid-ui.js`, `dist/tsgrid-ui.min.js`) are now strictly comparable
> across rebuilds. The Option-B Relaxed-Intent waiver recorded in the
> bundle-baseline-instrumentation cycle (INV-BBI-1) no longer applies.

## Known gaps

1. **CJS IIFE bytes not measured** — deferred to a future cycle (Phase 6+). Pre-wrap state ≠ shipped artifact.
2. **Minified bytes not measured** — Terser ratio is predictable but not captured here. Deferred.
3. **HTML treemap not generated** — For visual inspection, drag-and-drop `dist/metafile-esm.json`
   into [esbuild.github.io/analyze](https://esbuild.github.io/analyze/). No tooling installed locally.
4. **Per-export tree-shaking signal unavailable** — requires `splitting: true` and subpath exports
   (Phase 2+). The current numbers show monolithic contribution, not export-level isolation.
