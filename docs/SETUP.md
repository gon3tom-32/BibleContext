# Setup: keeping this project separate

Passage Explorer has its own GitHub repo and its own Supabase project, so nothing here touches your other projects.

## GitHub

This repo (`gon3tom-32/BibleContext`) is the project's own repo. Nothing else is linked to it.

## Supabase (needed for Phase 2, not Phase 1)

Phase 1 keeps notes in the browser, so the site runs without Supabase. When you're ready for sign-in and shared notes:

1. Go to https://supabase.com/dashboard.
2. For full separation, create a **new organization** (top-left org menu > New organization), e.g. "Passage Explorer". Billing, members, and limits then stay apart from your other projects. A new project inside an existing org is also isolated at the data level; a new org just separates billing and access too.
3. In that org, click **New project**. Name: `passage-explorer`. Save the database password somewhere safe.
4. Project Settings > API: copy the **Project URL** and **anon public key** into `.env.local` (see `.env.example`). Never commit `.env.local`; it's git-ignored.
5. SQL Editor: paste and run `supabase/migrations/20261019000000_notes.sql`.
6. Authentication > Sign In / Providers: turn **off** "Allow new users to sign up", then invite the two of you from Authentication > Users.

If you use the Supabase CLI: run `supabase link --project-ref <new-ref>` from inside this folder only. The link is stored in this folder's `supabase/.temp`, so other projects stay linked to their own.

## Running locally

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Hosting

`npm run build` produces a plain static site in `out/`. Vercel, Netlify, or Cloudflare Pages all work: import this repo as a new project there. Add the two Supabase env vars in that host's settings when Phase 2 lands.
