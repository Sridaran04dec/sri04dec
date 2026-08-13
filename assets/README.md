# Brand assets

Save the two brand images here. Only the **base name** matters — the page probes
`.png`, `.svg`, `.jpg`, `.jpeg`, `.webp` and `.ico` and uses whichever it finds.

| Base name | What it is | Recommended size |
|---|---|---|
| `logo` | Circular neon **SR** mark — navbar and footer brand | 256×256 square, transparent background |
| `favicon` | Rounded-square **SR** mark with the `< />` brackets — browser tab icon | 512×512 square |
| `profile` | Your photo — the About section avatar | 400×400 square, face centred |

So `logo.png`, `logo.svg` or `logo.webp` all work. Save the file, refresh — no code edits.

Detection lives in `js/main.js` (section 13, `findAsset`). Until a file is found:

- the brand shows a gradient **SR** letter mark
- the tab shows an inline SVG **SR** icon defined in `index.html`

so the page never renders broken.
