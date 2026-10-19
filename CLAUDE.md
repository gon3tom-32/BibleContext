# Passage Explorer

## Decisions made (Phase 1)

- **Stack:** Next.js 16 (App Router) + TypeScript, built as a fully static site (`output: "export"`). Plain CSS with design tokens in `src/app/globals.css`. Fonts via `next/font` (Fraunces, Inter).
- **Content:** JSON in `content/<slug>/` — `book.json`, `people.json`, `places.json`, `words.json`, `map.json`, `timeline.json`, `chapters/<n>.json`. Pages are generated for every book folder and every chapter up to `chapterCount`; a missing chapter file shows a "not written yet" page.
- **Scripture text:** not bundled. References link out to the World English Bible (public domain) on BibleGateway via `scriptureUrl()`.
- **Maps:** schematic SVG per book, drawn from `map.json` (water, rivers, routes, stops with coordinates).
- **Notes:** `src/lib/notes.ts` uses localStorage. Phase 2 replaces its internals with Supabase (`supabase/migrations/`), keeping the same functions.
- **Not a test:** the design's "Start the context check" button became "See the map and timeline".
- **Word studies:** a simple list page for now; the full screen is Phase 2.
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

**Phase 2: for the two of us** — sign-in for two users (Supabase), shared notes and "questions we're wrestling with", chapters 2 to 4 content, the full word study screen. Later words to add: *go'el* (redeemer), *chayil* ("worthy"/"noble").

**Later** — relationship web for people, more books, search across notes.

## Content review

All content is a first draft from general knowledge. Check authorship, dating, cultural notes, Hebrew words, and occurrences against solid commentaries and a lexicon before sharing widely.
