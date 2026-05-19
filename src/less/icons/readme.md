## Icons (v3.0.0+)

All icons are inline SVG strings produced by named functions exported from
`src/icons.ts`. The SVG files in `src/less/icons/svg/` are **reference
artwork only** — they document the canonical shape for each icon but are
NOT part of the build graph and are NOT compiled by any pipeline.

The icon font pipeline was removed in **v2.14.0**. The
`background-image` data-URI fallback (the per-icon `.tsg-icon-{name}`
rules in `src/less/src/icons.less`) was removed in **v3.0.0** in favour
of inline SVG. The current `icons.less` retains only a small compat shim
(`[class^="tsg-icon-"]:before { content: "" }`) to suppress stale
`:before` pseudo-content in browsers; do not remove it.

### To add a new icon

1. Place the canonical SVG file in `src/less/icons/svg/<name>.svg`.
   This is reference-only artwork — for review and shape-diff tooling.
2. Add a `TsgIconName` union member in `src/icons.ts` (kebab-case name).
3. Hand-port the path/polygon data into a `const <NAME>_PATHS = '<path .../>'`
   string near the other path constants in `src/icons.ts`.
4. Export the icon function: `export const <name>Icon = (opts?: IconOpts):
   string => _renderSvg('<viewBox>', <NAME>_PATHS, opts)`.
5. Add the new icon name to:
   - `test/unit/icons-api.test.ts` (asserts every name has an export).
   - `test/unit/icons-a11y.test.ts` (asserts every export honours `label`).
6. Run `pnpm test` to ratify the additions.
7. Run `pnpm build` to regenerate `dist/`.

### To update an existing icon

1. Update the path/polygon constant in `src/icons.ts`.
2. Update the corresponding `.svg` file in `src/less/icons/svg/` so the
   reference artwork stays in sync.
3. Run `pnpm test` and `pnpm build`.

### Notes

- `empty.svg` must remain an empty SVG (no path/polygon elements) and the
  `EMPTY_PATHS` constant in `src/icons.ts` must remain `''` so it renders
  as a transparent placeholder.
- The compat shim `[class^="tsg-icon-"]:before { content: "" }` in
  `src/less/src/icons.less` must stay — see `test/unit/icons-css-shape.test.ts`
  (gate G-SCI-4) for the carry-forward rule.
