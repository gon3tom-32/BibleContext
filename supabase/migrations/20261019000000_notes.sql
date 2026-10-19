-- Phase 2: shared notes for the two of us.
-- Run in the Passage Explorer Supabase project only (SQL editor, or `supabase db push`).

create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  book        text not null,
  chapter     int,
  author_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null default '',
  text        text not null check (char_length(text) between 1 and 5000),
  created_at  timestamptz not null default now()
);

create index if not exists notes_book_chapter_idx on public.notes (book, chapter, created_at desc);

alter table public.notes enable row level security;

-- Signed-in users can read every note (it's a shared notebook for two people).
-- Turn OFF public sign-ups in Auth settings and invite just the two accounts.
create policy "signed-in users read notes"
  on public.notes for select to authenticated using (true);

create policy "users add their own notes"
  on public.notes for insert to authenticated with check (author_id = auth.uid());

create policy "users edit their own notes"
  on public.notes for update to authenticated using (author_id = auth.uid());

create policy "users delete their own notes"
  on public.notes for delete to authenticated using (author_id = auth.uid());
