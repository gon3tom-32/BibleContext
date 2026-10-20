# Passage Explorer

Study the Bible with context first and verses second: who wrote a book, who it was for, and what was going on in history. Prototype book: Ruth.

**Live site:** https://bible.tomggonzalez.com/ (republished automatically when `main` changes)

- `content/<book>/` — all book content (JSON). Adding a book means adding a folder.
- `src/app/` — pages: overview `/ruth`, chapter `/ruth/1`, map and timeline `/ruth/context`, word studies `/ruth/words`, notes `/ruth/notes`.
- `src/lib/notes.ts` — notes storage (browser only in Phase 1; Supabase in Phase 2).
- `supabase/` — database migration for Phase 2.
- `docs/SETUP.md` — GitHub, Supabase, and hosting setup.
- `CLAUDE.md` — the build brief and decisions so far.

```
npm install
npm run dev
```

## Licenses

Data pulled from open datasets lives in `content/<book>/generated/` and keeps each source's license. See `content/ruth/generated/LICENSES.md`. In short: the Bible text is public domain; places, words, and cross-references are CC BY; `people.json` is CC BY-SA 4.0 because it's adapted from Theographic Bible Metadata. Credits are also on the site's Sources page.
