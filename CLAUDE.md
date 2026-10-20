# Passage Explorer

## Decisions made (Phase 1)

- **Stack:** Next.js 16 (App Router) + TypeScript, built as a fully static site (`output: "export"`). Plain CSS with design tokens in `src/app/globals.css`. Fonts via `next/font` (Fraunces, Inter).
- **Content:** JSON in `content/<slug>/` — `book.json`, `people.json`, `places.json`, `words.json`, `map.json`, `timeline.json`, `chapters/<n>.json`. Pages are generated for every book folder and every chapter up to `chapterCount`; a missing chapter file shows a "not written yet" page.
- **Scripture text:** not bundled. References link out to the World English Bible (public domain) on BibleGateway via `scriptureUrl()`.
- **Maps:** drawn from real coordinates at build time (`buildRealMap` in `src/lib/content.ts`): outlines and points from `generated/places.json`, projected into an SVG. `map.json`'s `real` section sets the map bounds, the route (hand-picked, marked needs-review because the text doesn't name it), stop positions, and label tweaks. Without a `real` section, the hand-drawn schematic in `map.json` is used.
- **Notes:** `src/lib/notes.ts` uses localStorage. Phase 2 replaces its internals with Supabase (`supabase/migrations/`), keeping the same functions.
- **Not a test:** the design's "Start the context check" button became "See the map and timeline".
- **Word studies:** `/ruth/words` lists every word; `/ruth/words/<id>` shows the Hebrew, pronunciation, meaning, range of meaning, uses chapter by chapter (pulled from each chapter's `words` notes), every verse in the book, other places it's used, and common English renderings. `uncertain` adds a "Debated" note.
- **Data sources:** open datasets are pulled at build time by `npm run data` into `content/<book>/generated/` with a `source` on every item; hand-written content is marked `needs-review`. Credits are on `/sources`. Details and gaps: `docs/DATA.md`.
- **Public repo and share-alike (decided):** the repo stays public. `generated/people.json` is published under CC BY-SA 4.0 with credit; keep share-alike data in its own files so it doesn't spread to the rest of the content. See `content/ruth/generated/LICENSES.md`.
- **Isolation:** own GitHub repo and own Supabase project. See `docs/SETUP.md`.

## What this is

A website for studying the Bible with context first and verses second. For each book it answers: who wrote it, who was it to, and what was going on in history. The two users are a married couple who love talking about context. Prototype with **one book: Ruth**, but structure everything so adding a book means adding data, not code.

## Principles

- **Context first, verses second.** The context comes before the text.
- **Not a test.** No quizzes, scores, or graded checks anywhere. Context is shown plainly (the "Setting the scene" strip), never asked for.
- **Honest about uncertainty.** Dates and authorship are often debated. Show "debated" where it is, and label timelines "in order, not to scale."
- **Calm and readable.** Serif headlines, generous spacing, no clutter.
- **Phone and desktop equally.** Stack to one column on phones. Touch targets at least 44px. Textareas use 16px text so iOS doesn't zoom.
- **Accessible.** Real buttons, links, and labeled inputs. Text contrast at least 4.5:1.

## Screens

Design canvas (desktop and phone for each): https://claude.ai/artifact/MaCB3Dg8VmugZY2YgNv634

1. **Book overview** (`/ruth`): hero, four context cards, map teaser, timeline teaser, big idea and themes band, who's who cards.
2. **Chapter view** (`/ruth/1`): chapter switcher, "Setting the scene" strip, "What's happening" plus "Why the setting matters", who's in this chapter, discussion questions. Sidebar: key words, cross-references, shared notes.
3. **Map and timeline** (`/ruth/context`): schematic map with numbered stops and a detail card, plus a lane timeline (Israel, Neighbors, This book) across eras.
4. **Word study** (not designed yet): original-language word, range of meaning, other places it's used.

Navigation: Overview, Context, Chapters, Word studies, Our notes ("Words" on phones).

## Design tokens

| Token | Value |
| --- | --- |
| Background | `#F6F5F1` |
| Card | `#FFFFFF`, border `#DDD9CF`, radius 12px |
| Ink | `#1C2333` |
| Secondary text | `#3A4256`, muted `#4A5266` |
| Accent (gold) | `#E9C46A` (on dark), `#B7791F` (rings), `#8A5A12` (text on light) |
| Green | `#2F5D48` |
| Dark band | `#1C2333`, chips `#2D3850` |
| Fonts | Fraunces 500/600 headlines, Inter 400/500/600 body |
| Layout | max width 1200px, 32px side padding (20px on phones) |

## Phases

**Phase 1 (done): read-only prototype** — static pages driven by data files, notes in local storage, responsive.

**Chapters 2–4 (done, first draft)** — each chapter can set `sceneHappening` for its own "Setting the scene" fact, and lists key words as `{ id, note }` so the note says what the word is doing in that chapter.

**Phase 2: for the two of us** — sign-in for two users (Supabase), shared notes and "questions we're wrestling with".

**Books:** Ruth (done). Working through the New Testament one book at a time: Matthew has the overview, context, map, timeline, word studies, and chapters 1–24 written; chapters 25–28 show text and dataset facts until their notes are written (in batches).

**Later** — relationship web for people, search across notes.

## Content review

All content is a first draft from general knowledge. Check authorship, dating, cultural notes, Hebrew words, and occurrences against solid commentaries and a lexicon before sharing widely.
