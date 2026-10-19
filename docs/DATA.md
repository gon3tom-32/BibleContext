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

## Things to know

- **Blocked sources:** the HelloAO Free Use Bible API and openbible.info weren't reachable from the build environment, so the WEB text comes from github.com/TehShrike/world-english-bible and the cross-reference file from github.com/scrollmapper/bible_databases (a copy of OpenBible's file dated 2024-11-04).
- **Share-alike:** `generated/people.json` is derived from a CC BY-SA dataset, so if this repo or that file is published, it must stay under CC BY-SA 4.0 with credit. The rest of the site isn't affected by that, as long as we keep the derived data in its own file.
- **Not used:** Theographic's dates and its Easton's Bible Dictionary text (1897, with known errors).
- **Before going public** (sharing beyond the two of us, ads, or paid access): re-check every license and any API terms. See `docs/passage-explorer-data-sources.md`.
