# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

No build step. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Architecture

Single-page marketing site for the Wallet Guardian Chrome extension. Three files do all the work:

| File | Role |
|------|------|
| `css/style.css` | All styles. Design tokens live in `:root` at the top — edit tokens for global changes |
| `js/main.js` | All JavaScript: i18n, mobile menu, carousel, form submissions, toast |
| `images/` | All images and future videos. Every `<img>` and media tag must reference a file here |

## i18n

Two locales: `zh-TW` (default) and `en`. Translation strings are in the `translations` object at the top of `main.js`. To add a translated string:

1. Add the key/value to both locale objects in `main.js`
2. Add `data-i18n="key"` to the HTML element (or `data-i18n-placeholder="key"` for `placeholder` attributes)

## Carousel

Infinite rightward loop — slide 3 flows into slide 1 without jumping back. Implementation: the JS clones slide 1 and appends it after slide 3. On `transitionend`, if `currentIndex === totalSlides`, it silently snaps to index 0 (`transition: none` + force reflow + restore). The carousel runs continuously with no hover-pause.

Left/right edges fade via `mask-image` gradient on `.carousel` — adjust the `12%` stops to widen or narrow the fade zone.

## Responsive breakpoints

Mobile-first with three breakpoints defined in both CSS and used in layout decisions:
- `640px` — tablet
- `1024px` — desktop (nav switches from hamburger to inline)
- `1280px` — large desktop
