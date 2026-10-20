# Data pipeline

Where the content comes from and how to refresh it. The sources, their licenses, and what we use each for are listed in `scripts/data/sources.json` and shown on the site at `/sources`.

## Commands

```
npm run data:fetch   # download each source at its pinned commit into .cache/sources (git-ignored)
npm run data:pull    # rebuild content/ruth/generated/*.json from the cache
npm run data         # both
```

Fetching uses `git` against GitHub only, so it works without API keys. To update a source, change its `commit` in `scripts/data/sources.json`, run `npm run data`, and review the diff in `content/ruth/generated/`.

## What's generated vs. hand-written

| File | Comes from | License |
| --- | --- | --- |
| `generated/text.json` | World English Bible | Public domain |
| `generated/places.json` | OpenBible.info Geocoding Data (Jordan outline via OpenStreetMap) | CC BY 4.0 (+ ODbL for OSM outlines) |
| `generated/people.json` | Theographic Bible Metadata | **CC BY-SA 4.0** (share-alike) |
| `generated/words.json` | STEPBible Data | CC BY 4.0 |
| `generated/crossrefs.json` | OpenBible.info Cross References | CC BY |
| `generated/gaps.json` | The pull script's own report | n/a |

Every generated item has a `source` field (name, URL, license, date fetched, and the item's ID in the source).

Everything else in `content/ruth/` is hand-written and carries `"review": { "status": "needs-review" }` until someone checks it against commentaries and a lexicon. Change it to `"reviewed"` once checked.

`content/ruth/sources.config.json` says which records to pull for the book (place IDs, person IDs, Strong's numbers). Adding a book means adding that file for the new book.

## How the Strong's numbers were found

They were read from STEPBible's tagged Hebrew text at a verse where each word appears, not from memory (the verse is in `foundAt` in the config). Note that STEPBible files *go'el* under the verb *ga'al* (H1350A), since *go'el* is its participle, and splits *chayil* into senses H2428G/H/I.

## The map

The journey map is projected from `generated/places.json` (Dead Sea outline, Jordan course, Moab's confidence bands, town points). The route and stop 3's position are hand-picked in `map.json` (`real.route`, `real.stops`) because Ruth doesn't say which road was taken; the page says so.

## Adding a book

0. Use the slug from `src/lib/canon.ts` for the folder name (for example `colossians`, `1-thessalonians`), so the landing page marks the book as ready.
1. Create `content/<slug>/` with `book.json` (set `order`, `testament`, `language`), `people.json`, `places.json`, `words.json`, `map.json`, `timeline.json`, and `chapters/<n>.json` for each chapter you've written up. Chapters without a file still get a page with the text and what the datasets know.
2. Add `content/<slug>/sources.config.json`: the OSIS and STEPBible book codes, the WEB file name, `language` ("Hebrew" or "Greek"), and the place, person, and word IDs to pull. Find Strong's numbers by reading STEPBible's tagged text at a verse where the word appears (record it in `foundAt`).
3. Run `npm run data:fetch` and `node scripts/pull-sources.mjs <slug>`, then read `generated/gaps.json`.
4. In `map.json`'s `real` section, set the bounds and stops. Use `labelAt` to move or hide (`null`) crowded labels, `scaleCorner` to move the scale bar, and leave out `route` when the book doesn't follow one road.

## Things to know

- **Blocked sources:** the HelloAO Free Use Bible API and openbible.info weren't reachable from the build environment, so the WEB text comes from github.com/TehShrike/world-english-bible and the cross-reference file from github.com/scrollmapper/bible_databases (a copy of OpenBible's file dated 2024-11-04).
- **Share-alike (decided: repo stays public):** `generated/people.json` is derived from a CC BY-SA dataset, so it's published under CC BY-SA 4.0 with credit (see `generated/LICENSES.md`). The rest of the site isn't affected, as long as share-alike data stays in its own file.
- **Not used:** Theographic's dates and its Easton's Bible Dictionary text (1897, with known errors).
- **Before going public** (sharing beyond the two of us, ads, or paid access): re-check every license and any API terms. See `docs/passage-explorer-data-sources.md`.
- **Deploy hiccups:** the Pages build fetches Google Fonts at build time. If it fails with "next/font/google queries have exactly one entry", it is usually a one-off fetch failure. The deploy workflow now retries the build up to 3 times; if it still fails, re-run the failed job or merge a small commit to trigger a new run.
