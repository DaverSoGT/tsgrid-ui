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

### `splitting: false` per-export limitation

This project builds with `splitting: false` (no code-splitting). This means the esbuild metafile
produces a **single output chunk** (`dist/tsgrid-ui.es6.js`) containing all modules flattened together.

The `modules[].bytesInOutput` values represent each source module's **byte contribution to the single
output chunk** — not individual treeshakeable entry-point slices. As a result:

- You can see which `src/*.ts` files contribute the most bytes to the monolithic bundle.
- You CANNOT infer "what happens if I import only `TsGrid`" from these numbers alone — that measurement
  requires `splitting: true` and subpath exports (Phase 2+ work).

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
| `splitting` | All blocks (currently `false`) |

**You MUST manually mirror the change in `tsup.config.analyze.ts`.** Drift is silent — there is no
automation to detect it. Unmitigated drift manifests as `bytesInOutput` shifts in future baselines
that are not explained by source code changes.

---

## Known gaps

1. **CJS IIFE bytes not measured** — deferred to a future cycle (Phase 6+). Pre-wrap state ≠ shipped artifact.
2. **Minified bytes not measured** — Terser ratio is predictable but not captured here. Deferred.
3. **HTML treemap not generated** — For visual inspection, drag-and-drop `dist/metafile-esm.json`
   into [esbuild.github.io/analyze](https://esbuild.github.io/analyze/). No tooling installed locally.
4. **Per-export tree-shaking signal unavailable** — requires `splitting: true` and subpath exports
   (Phase 2+). The current numbers show monolithic contribution, not export-level isolation.
