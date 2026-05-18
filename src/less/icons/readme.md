## Icons (v2.14.0+)

All icons are SVG files located in `src/less/icons/svg/`. They serve as the canonical
artwork reference but are **NOT** compiled by the build pipeline — icons are inlined
directly in `src/less/src/icons.less` as percent-encoded data URIs.

### To add a new icon

1. Place your SVG file in `src/less/icons/svg/<name>.svg`.
2. Percent-encode the SVG content. Recommended approach:
   - Use an online tool such as [URL-encoder for SVG](https://yoksel.github.io/url-encoder/)
   - Or run in Node: `encodeURIComponent(svgString).replace(/'/g, '%27')`
   - Required encodings: `<` → `%3C`, `>` → `%3E`, `#` → `%23`, `"` → `'` (use single quotes in SVG attributes)
3. Add a new rule to `src/less/src/icons.less` in **alphabetical order** by icon name:
   ```less
   .tsg-icon-<name> { background-image: url("data:image/svg+xml;utf8,<encoded-svg>"); }
   ```
4. Run `pnpm build` to regenerate `dist/`.

### To update an existing icon

Edit the corresponding rule in `src/less/src/icons.less` directly. Update the SVG file
in `src/less/icons/svg/` to keep the source in sync.

### Notes

- SVG source files in `svg/` are reference-only and are NOT part of the build graph.
- The `drop-inverted.svg` is the white-fill variant of `drop.svg` used for the hover
  state in grid.less — both the SVG file and the inline URI in grid.less must be kept
  in sync if the icon shape changes.
- `empty.svg` must remain an empty SVG (no path/polygon elements) to render as a
  transparent placeholder.
- The compat shim at the bottom of `icons.less` (`[class^="tsg-icon-"]:before { content: "" }`)
  prevents stale `:before` pseudo-content from rendering in browsers. Do not remove it.
