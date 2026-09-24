# jovian-explorer.github.io

Personal website of Keshav Aggarwal. Static HTML, CSS and JavaScript; no build step.

## Pages

| File | Content |
|---|---|
| `index.html` | Bio, profile links, recent papers, research interests, news |
| `research.html` | Research themes and missions |
| `publications.html` | Publications with tabs and search (rendered from `assets/js/data.js`) |
| `software.html` | VEDA, COSMIC2 Explorer, HELIOS and released code |
| `talks.html` | Conferences, YouTube videos, writing and outreach |
| `travel.html` | India district map and world city map |
| `photography.html` | Collections, justified photo grid, full-screen viewer |
| `cv.html` | Education, positions, fellowships, experience, skills, contact |
| `design.html` | Colour, typeface and layout samples |

## Editing content

All lists live in `assets/js/data.js`:

- **Publications**: add an object to `publications` (`type` is `first`, `collab` or `whitepaper`).
- **Conferences**: add to `conferences`.
- **Videos**: add `{ id, title, date, note }` to `videos`. `id` is the 11-character code after `watch?v=`.
- **Albums**: `photography.albums` (id, title, description) and `photography.kit`.

## Travel maps

Open `travel.html#edit` (for example `https://jovian-explorer.github.io/travel.html#edit`):

- India tab: click districts to mark or unmark them, or type a district name in the search box.
- World tab: click a location to add a city pin; click a pin to edit or delete it.
- Press **Copy data** and replace the `travel: { ... }` block in `assets/js/data.js`. Commit to publish.

Edits are kept in that browser until copied; visitors never see edit controls unless they open `#edit`, and their edits go nowhere.

Map data: India districts and states from [vardhan-maps](https://www.npmjs.com/package/vardhan-maps) (MIT; boundaries derived from OpenStreetMap, © OpenStreetMap contributors, ODbL), aligned to the Government of India depiction, including Pakistan-occupied Kashmir, Gilgit-Baltistan and Aksai Chin. World countries from Natural Earth via world-atlas, with India's outline substituted. Rendering uses d3 v7 and topojson-client, stored in `assets/vendor/`.

## Photographs

```
pip install pillow
# put full-size images in assets/photos/originals/<album-id>/
python3 tools/photos.py
```

The script writes 2400 px and 800 px copies to `assets/photos/web/` and `assets/photos/thumbs/`, strips all metadata (including GPS) from them, and updates `assets/js/photos.js` with size, date, camera, lens and exposure. Edit titles, places, descriptions and `"cover": true` in `photos.js`; the script keeps these on later runs. `assets/photos/originals/` is git-ignored. `photography.html#demo` previews the layout with generated sample tiles.

## Changing the design

Each page's `<html>` tag sets the defaults:

```html
<html lang="en" data-palette="prussian" data-font="source" data-layout="topbar">
```

- `data-palette`: `prussian`, `graphite`, `heliosphere`, `moss`, `oxford`, `ink`
- `data-font`: `source`, `plex`, `newsreader`, `garamond`
- `data-layout`: `topbar`, `sidebar`, `centered`

A non-default font also needs its Google Fonts `<link>` in each page head (see `assets/js/prefs.js` for the URLs). `design.html` previews every combination in the browser without editing files.
