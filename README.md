# jovian-explorer.github.io

Personal website of Keshav Aggarwal. Static HTML, CSS and JavaScript; no build step.

## Pages

| File | Content |
|---|---|
| `index.html` | Bio, profile links, recent papers, research interests, news |
| `research.html` | Research themes and missions |
| `publications.html` | Publications with tabs and search (rendered from `assets/js/data.js`) |
| `software.html` | VEDA, COSMIC2 Explorer, HELIOS and released code |
| `talks.html` | Conference talks and posters |
| `outreach.html` | Public events, National Space Day kit, mission explainers, school astronomy lab videos |
| `videos.html` | YouTube channel: featured player, searchable list (updated automatically) |
| `writing.html` | Medium articles with topic filters (updated automatically) |
| `travel.html` | India district map and world city map |
| `photography.html` | Sections (Night sky, Travel, Conferences) as tabs, albums with map or generated covers, album view, full-screen viewer |
| `cv.html` | Education, positions, fellowships, experience, publications, skills, contact; PDF in `assets/cv/` |
| `404.html` | Page shown for missing addresses |
| `design.html` | Colour, typeface and layout samples |

## Automatic YouTube and Medium lists

`.github/workflows/update-feeds.yml` runs `tools/update_feeds.py` every day at 03:17 UTC (and on demand from the Actions tab). It writes `assets/js/feed-videos.js`, `assets/js/feed-articles.js` and `assets/js/feed-metrics.js` (Google Scholar citations and h-index), commits only when something changed, and asks GitHub Pages to rebuild.

- Without an API key it reads the channel's RSS feed (latest 15 uploads) and keeps older entries it has already seen.
- For the full upload list with durations, add a YouTube Data API v3 key as the repository secret `YT_API_KEY` (Settings > Secrets and variables > Actions).
- In `feed-videos.js` you can add `"topic"`, `"featured": true`, `"hidden": true` or `"note"` to any video; these survive updates.
- Link a paper to its summary video with `video: "<id>"` on the publication in `data.js`; the paper then shows a Video link and the video shows the paper.

## CV PDF

`assets/cv/Keshav_Aggarwal_CV.pdf` is printed from `cv.html` (print styles are in `style.css`). After editing the CV or publications:

```
npm install playwright && npx playwright install chromium
node tools/cv_pdf.mjs
```

A browser's own Print > Save as PDF on `cv.html` gives the same layout.

## Editing content

All lists live in `assets/js/data.js`:

- **Publications**: add an object to `publications` with `role` (`first` or `co`) and `kind` (`journal`, `proceedings`, `chapter`, `whitepaper`, `preprint`). A book chapter uses `kind: "chapter"`, the book title as `venue` and a `publisher`.
- **Conferences**: add to `conferences`.
- **Videos**: add `{ id, title, date, note }` to `videos`. `id` is the 11-character code after `watch?v=`.
- **Albums**: `photography.sections` and `photography.albums` (id, section, title, place, date, `region` for the cover map) and `photography.kit`. Photos in `photos.js` name their album with `album: "<id>"`.

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

## Search engines

`index.html` carries schema.org Person data (affiliation, fellowship, profile links) so search engines can connect the site with the Scholar, ORCID and other profiles. `sitemap.xml` and `robots.txt` are generated with the pages.

## Previous version

The site as it was before the redesign is kept in `legacy/` (served at `/legacy/`, excluded from search engines).
