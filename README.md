# Sridaran — Web Developer Portfolio

A modern, fully responsive single-page portfolio: dark/light themes, smooth
scrolling, scroll-reveal animations and a filterable project grid.

**Live sections:** Home · About Us · Projects · Contact Us

## Built with

| Layer | Tech |
|---|---|
| Markup / styling | HTML5, CSS3 (custom properties, theme tokens) |
| Utility CSS | Tailwind CSS (Play CDN) |
| Components / grid | Bootstrap 5.3 |
| Scripting | Vanilla JS + jQuery 3.7 |
| Icons / type | Material Icons, Ant Design CSS, Poppins + Roboto |

## Features

- Sticky navbar with scroll-spy, smooth scrolling and a mobile burger menu
- Light / dark theme toggle, persisted in `localStorage`
- Scroll-to-top button with a circular page-progress ring
- Scroll-reveal animations via `IntersectionObserver`, plus animated counters
  and skill bars
- Typing effect in the hero and an infinite tech-stack marquee
- Project filtering by category (jQuery)
- Contact form with per-field validation and a simulated async send
- Fully responsive: mobile, tablet, laptop and desktop
- Honours `prefers-reduced-motion`

## Run locally

No build step and no dependencies — it's static.

```bash
node server.js 5180
```

Then open <http://localhost:5180>. Any static file server works just as well.

## Project structure

```
portfolio/
├── index.html          # all sections
├── css/style.css       # theme tokens, layout, animations
├── js/main.js          # interactions
├── assets/             # logo.png, favicon.png, optional profile.*
└── server.js           # zero-dependency static server
```

## Brand assets

`assets/` holds `logo`, `favicon` and an optional `profile` image. Only the base
name matters — the page probes `.png`, `.svg`, `.jpg`, `.jpeg`, `.webp` and
`.ico` and uses whichever it finds, falling back to a gradient letter mark if
none exist. See [assets/README.md](assets/README.md).

## Contact

- GitHub: <https://github.com/Sridaran04dec>
- Email: <sri04dec@gmail.com>
