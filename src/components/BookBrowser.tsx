"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, type GroupId, type Testament } from "@/lib/canon";

export type BrowserBook = {
  slug: string;
  title: string;
  testament: Testament;
  group: GroupId;
  chapters: number;
  ready: boolean;
  tagline?: string;
  words?: number;
};

type Filter = "all" | Testament | GroupId;

const TESTAMENT_CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "OT", label: "Old Testament" },
  { id: "NT", label: "New Testament" },
];

function isFilter(v: string | null): v is Filter {
  return v === "all" || v === "OT" || v === "NT" || GROUPS.some((g) => g.id === v);
}

export default function BookBrowser({ books }: { books: BrowserBook[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [readyOnly, setReadyOnly] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Pick up a filter from the link that brought the reader here, e.g. /books/?filter=gospels
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("filter");
    if (isFilter(f)) setFilter(f);
    setQuery(params.get("q") ?? "");
    setReadyOnly(params.get("ready") === "1");
    setLoaded(true);
  }, []);

  // Keep the address in step with the filters so a view can be shared or bookmarked.
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (query.trim()) params.set("q", query.trim());
    if (readyOnly) params.set("ready", "1");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [filter, query, readyOnly, loaded]);

  // Bring the chosen chip into view in the scrolling row.
  useEffect(() => {
    rowRef.current?.querySelector<HTMLElement>('[aria-pressed="true"][data-chip="filter"]')?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [filter, loaded]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (filter === "OT" || filter === "NT") {
        if (b.testament !== filter) return false;
      } else if (filter !== "all" && b.group !== filter) return false;
      if (readyOnly && !b.ready) return false;
      return !q || b.title.toLowerCase().includes(q);
    });
  }, [books, filter, query, readyOnly]);

  const filtered = filter !== "all" || query.trim() !== "" || readyOnly;
  const readyCount = visible.filter((b) => b.ready).length;

  function clear() {
    setFilter("all");
    setQuery("");
    setReadyOnly(false);
  }

  const chip = (id: Filter, label: string) => (
    <button key={id} type="button" data-chip="filter" className="filter-chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
      {label}
    </button>
  );

  return (
    <div className="finder">
      <div className="finder-bar">
        <div className="finder-search">
          <label className="sr-only" htmlFor="book-search">Search books</label>
          <input
            id="book-search"
            type="search"
            autoComplete="off"
            placeholder="Search books, like “Romans”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="chip-scroll" role="group" aria-label="Filter books" ref={rowRef}>
          <button type="button" className="filter-chip filter-chip--ready" aria-pressed={readyOnly} onClick={() => setReadyOnly((v) => !v)}>
            Ready to read
          </button>
          <span className="chip-divider" aria-hidden="true" />
          {TESTAMENT_CHIPS.map((c) => chip(c.id, c.label))}
          <span className="chip-divider" aria-hidden="true" />
          {GROUPS.map((g) => chip(g.id, g.label))}
        </div>
      </div>

      <p className="finder-count" role="status" aria-live="polite">
        {filtered ? `Showing ${visible.length} of ${books.length} books` : `${books.length} books`} · {readyCount} ready to read
        {filtered && (
          <>
            {" "}
            <button type="button" className="text-btn" onClick={clear}>Clear</button>
          </>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="card">
          <h2>No books match</h2>
          <p className="muted">Try a different search, or clear the filters to see the whole Bible.</p>
          <div><button type="button" className="btn btn--ghost btn--sm" onClick={clear}>Clear filters</button></div>
        </div>
      ) : (
        GROUPS.filter((g) => visible.some((b) => b.group === g.id)).map((g) => {
          const inGroup = visible.filter((b) => b.group === g.id);
          const ready = inGroup.filter((b) => b.ready).length;
          return (
            <section key={g.id} className="book-group" aria-labelledby={`group-${g.id}`}>
              <div className="book-group-head">
                <h2 id={`group-${g.id}`}>{g.label}</h2>
                <span className="label">{g.testament === "OT" ? "Old Testament" : "New Testament"} · {ready} of {inGroup.length} ready</span>
              </div>
              <ul className="book-grid">
                {inGroup.map((b) => (
                  <li key={b.slug}>
                    {b.ready ? (
                      <Link href={`/${b.slug}/`} className="book-card">
                        <span className="book-title">{b.title}</span>
                        <span className="book-meta">{b.chapters} chapters{b.words ? ` · ${b.words} word studies` : ""}</span>
                        {b.tagline && <span className="book-tagline">{b.tagline}</span>}
                      </Link>
                    ) : (
                      <div className="book-card book-card--soon">
                        <span className="book-title">{b.title}</span>
                        <span className="book-meta">Coming soon</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
