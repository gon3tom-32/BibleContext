"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

type TestamentFilter = "all" | Testament;

export default function BookBrowser({ books }: { books: BrowserBook[] }) {
  const [testament, setTestament] = useState<TestamentFilter>("all");
  const [group, setGroup] = useState<"all" | GroupId>("all");
  const [query, setQuery] = useState("");
  const [readyOnly, setReadyOnly] = useState(false);

  const groups = GROUPS.filter((g) => testament === "all" || g.testament === testament);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        (testament === "all" || b.testament === testament) &&
        (group === "all" || b.group === group) &&
        (!readyOnly || b.ready) &&
        (!q || b.title.toLowerCase().includes(q)),
    );
  }, [books, testament, group, query, readyOnly]);

  const filtered = testament !== "all" || group !== "all" || query.trim() !== "" || readyOnly;
  const readyCount = visible.filter((b) => b.ready).length;

  function pickTestament(t: TestamentFilter) {
    setTestament(t);
    setGroup("all");
  }
  function clear() {
    setTestament("all");
    setGroup("all");
    setQuery("");
    setReadyOnly(false);
  }

  return (
    <div className="browser">
      <div className="browser-controls">
        <div className="seg" role="group" aria-label="Testament">
          {([["all", "Whole Bible"], ["OT", "Old Testament"], ["NT", "New Testament"]] as const).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={testament === id} onClick={() => pickTestament(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="chip-row" role="group" aria-label="Category">
          <button type="button" className="filter-chip" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
            All categories
          </button>
          {groups.map((g) => (
            <button key={g.id} type="button" className="filter-chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>

        <div className="browser-row">
          <div className="search-field">
            <label className="field-label" htmlFor="book-search">Search books</label>
            <input
              id="book-search"
              type="text"
              inputMode="search"
              autoComplete="off"
              placeholder="Try “Romans” or “John”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="check">
            <input type="checkbox" checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} />
            <span>Only books I can read now</span>
          </label>
        </div>
      </div>

      <p className="browser-count" role="status" aria-live="polite">
        Showing {visible.length} of {books.length} books · {readyCount} ready to read
        {filtered && (
          <>
            {" "}
            <button type="button" className="text-btn" onClick={clear}>Clear filters</button>
          </>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="card">
          <h3>No books match</h3>
          <p className="muted">Try a different search, or clear the filters to see the whole Bible.</p>
        </div>
      ) : (
        GROUPS.filter((g) => visible.some((b) => b.group === g.id)).map((g) => {
          const inGroup = visible.filter((b) => b.group === g.id);
          return (
            <section key={g.id} className="book-group" aria-labelledby={`group-${g.id}`}>
              <div className="book-group-head">
                <h3 id={`group-${g.id}`}>{g.label}</h3>
                <span className="label">{g.testament === "OT" ? "Old Testament" : "New Testament"}</span>
              </div>
              <p className="small muted">{g.blurb}</p>
              <ul className="book-grid">
                {inGroup.map((b) =>
                  b.ready ? (
                    <li key={b.slug}>
                      <Link href={`/${b.slug}/`} className="book-card">
                        <span className="label book-status book-status--ready">Ready to read</span>
                        <span className="book-title">{b.title}</span>
                        {b.tagline && <span className="small muted">{b.tagline}</span>}
                        <span className="smaller muted">
                          {b.chapters} chapters{b.words ? ` · ${b.words} word studies` : ""}
                        </span>
                      </Link>
                    </li>
                  ) : (
                    <li key={b.slug}>
                      <div className="book-card book-card--soon">
                        <span className="label book-status">Coming soon</span>
                        <span className="book-title">{b.title}</span>
                        <span className="smaller muted">{b.chapters} chapters</span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
