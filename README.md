# jovian-explorer.github.io

Personal website of Keshav Aggarwal. Static HTML, CSS and JavaScript; no build step.

## Pages

| File | Content |
|---|---|
| `index.html` | Bio, profile links, recent papers, research interests, news |
| `research.html` | Research themes and missions |
| `publications.html` | Publications with tabs and search (rendered from `assets/js/data.js`) |
| `software.html` | VEDA, COSMIC2 Explorer, HELIOS and released code |
| `talks.html` | Conferences and travel, YouTube videos, writing and outreach |
| `photography.html` | Photograph gallery with category filters and lightbox |
| `cv.html` | Education, positions, fellowships, experience, skills, contact |
| `design.html` | Colour, typeface and layout samples |

## Editing content

All lists live in `assets/js/data.js`:

- **Publications**: add an object to `publications` (`type` is `first`, `collab` or `whitepaper`).
- **Conferences**: add to `conferences`.
- **Videos**: add `{ id, title, date, note }` to `videos`. `id` is the 11-character code after `watch?v=`.
- **Photographs**: copy the image into `assets/photos/` and add `{ src, title, place, date, category }` to `photos`.

## Changing the design

Each page's `<html>` tag sets the defaults:

```html
<html lang="en" data-palette="prussian" data-font="source" data-layout="topbar">
```

- `data-palette`: `prussian`, `graphite`, `heliosphere`, `moss`, `oxford`, `ink`
- `data-font`: `source`, `plex`, `newsreader`, `garamond`
- `data-layout`: `topbar`, `sidebar`, `centered`

A non-default font also needs its Google Fonts `<link>` in each page head (see `assets/js/prefs.js` for the URLs). `design.html` previews every combination in the browser without editing files.
