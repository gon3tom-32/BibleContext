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
- **Landing page and the whole Bible (decided):** `/` is a landing page: hero with live counts, six "what you can do" cards, "good places to start", and a "Find a book" strip of category tiles that link into the finder. Finding a book lives on its own page, `/books/`: a search box and one scrolling row of filter chips (Ready to read, All / Old / New Testament, then ten categories) stay pinned at the top while results scroll underneath, as two-column compact tiles on phones. Filters are shareable through the address (`?filter=gospels&q=jo&ready=1`). The full book list, in canonical order with categories, lives in `src/lib/canon.ts`; a book is "ready" when `content/<slug>/` exists, so a new book's folder name must match its slug there. The logo (`src/components/Logo.tsx`, also `src/app/icon.svg`) sits top left in every header, and book pages have an "All books" link first in their nav.
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

**Books:** Ruth (done), Matthew (done), Acts (done: overview, context, map, timeline, 104 word studies, and all 28 chapters, as first drafts needing review), John (done: overview, context, map, timeline, 90 word studies, and all 21 chapters, as first drafts needing review), Luke (done: overview, context, map, timeline, 80 word studies, and all 24 chapters, as first drafts needing review), Philemon (done: overview, context, map, timeline, 56 word studies, and its single chapter, as first drafts needing review; where Paul was imprisoned, why Onesimus left, and what "more than a slave" asks of Philemon are flagged as debated), Titus (done: overview, context, map, timeline, 176 word studies, and all 3 chapters, as first drafts needing review; Paul's authorship, a mission to Crete outside Acts, "husband of one wife" in 1:6, whether 2:13 calls Jesus "our great God and Savior," and the "washing of regeneration" in 3:5 are flagged as debated), 2 Timothy (done: overview, context, map, timeline, 247 word studies, and all 4 chapters, as first drafts needing review; Paul's authorship and a possible second Roman imprisonment, "every Scripture is God-breathed" (3:16), the claim that "the resurrection is already past" (2:18), and "the mouth of the lion" (4:17) are flagged as debated), 1 Timothy (done: overview, context, map, timeline, 266 word studies, and all 6 chapters, as first drafts needing review; Paul's authorship of the Pastoral Epistles, the passage on women teaching in 2:11-15, "husband of one wife" and "the women" in 3:2 and 3:11, and the meaning of "saved through childbearing" are flagged as debated), 2 Thessalonians (done: overview, context, map, timeline, 120 word studies, and all 3 chapters, as first drafts needing review; Paul's authorship, the "man of lawlessness" and "what restrains him," and "eternal destruction" are flagged as debated), 1 Thessalonians (done: overview, context, map, timeline, 172 word studies, and all 5 chapters, as first drafts needing review; 2:13-16, the meaning of "his own vessel" in 4:4, and how 4:13-18 fits with other teaching on the end are flagged as debated), Colossians (done: overview, context, map, timeline, 214 word studies, and all 4 chapters, as first drafts needing review; Paul's authorship, the unnamed teaching he opposes, "firstborn of all creation," and "worship of angels" are flagged as debated), Philippians (done: overview, context, map, timeline, 150 word studies, and all 4 chapters, as first drafts needing review; where Paul wrote from, the Christ hymn's key words, and the meaning of "faith in Christ" in 3:9 are flagged as debated), Ephesians (done: overview, context, map, timeline, 202 word studies, and all 6 chapters, as first drafts needing review; Paul's authorship and the original destination of the letter are flagged as debated), Galatians (done: overview, context, map, timeline, 142 word studies, and all 6 chapters, as first drafts needing review; the letter's date and destination, the "Israel of God," and the Hagar and Sarah allegory are flagged as debated), 2 Corinthians (done: overview, context, map, timeline, 188 word studies, and all 13 chapters, as first drafts needing review; how chapters 10 to 13 fit with 1 to 9, the "thorn in the flesh," and the veil of Moses are flagged as debated), 1 Corinthians (done: overview, context, map, timeline, 151 word studies, and all 16 chapters, as first drafts needing review; the head-covering passage, 14:34-35, and "baptized for the dead" are flagged as debated), Romans (done: overview, context, map, timeline, 85 word studies, and all 16 chapters, as first drafts needing review), and Mark (done: overview, context, map, timeline, 48 word studies, and all 16 chapters, as first drafts needing review; the longer ending of chapter 16 is flagged as debated). Working through the New Testament one book at a time; the next book will follow the same steps in `docs/DATA.md`.

**Later** — relationship web for people, search across notes.

## Content review

All content is a first draft from general knowledge. Check authorship, dating, cultural notes, Hebrew words, and occurrences against solid commentaries and a lexicon before sharing widely.
