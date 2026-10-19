# Passage Explorer

Study the Bible with context first and verses second: who wrote a book, who it was for, and what was going on in history. Prototype book: Ruth.

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
