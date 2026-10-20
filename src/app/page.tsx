import Link from "next/link";
import MainHeader from "@/components/MainHeader";
import { getBrowserBooks, getReadyTotals } from "@/lib/books-index";
import { getBook, getBookSlugs } from "@/lib/content";
import { GROUPS } from "@/lib/canon";

const START_HERE = ["ruth", "mark", "romans"];

const FEATURES = [
  {
    icon: "book",
    title: "Context before the text",
    text: "Every book opens with who wrote it, who it was for, and what was going on, with a “debated” flag wherever scholars disagree.",
    href: "/romans/",
    cta: "See an overview",
  },
  {
    icon: "scene",
    title: "Setting the scene, chapter by chapter",
    text: "A short strip tells you where you are and what is happening before you read. Then the summary, why the setting matters, and questions to talk about.",
    href: "/romans/1/",
    cta: "Open a chapter",
  },
  {
    icon: "map",
    title: "Maps drawn from real places",
    text: "Follow the story on a map built from real coordinates, with numbered stops you can tap for the verse and the story behind each place.",
    href: "/acts/context/",
    cta: "Follow Paul’s journeys",
  },
  {
    icon: "time",
    title: "Timelines, in order, not to scale",
    text: "See where each book sits next to Israel’s story and the wider empire, honest about dates that are still debated.",
    href: "/mark/context/",
    cta: "See a timeline",
  },
  {
    icon: "word",
    title: "Word studies in Greek and Hebrew",
    text: "Tap a key word to see how it sounds, its range of meaning, and every place it is used in the book and beyond.",
    href: "/romans/words/",
    cta: "Browse word studies",
  },
  {
    icon: "note",
    title: "Your own notes",
    text: "Write notes on any chapter. They stay on your device for now, and shared notes for the two of us are planned.",
    href: "/ruth/notes/",
    cta: "Try the notes",
  },
] as const;

function Icon({ name }: { name: (typeof FEATURES)[number]["icon"] }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };
  switch (name) {
    case "book":
      return <svg {...common}><path d="M3 5.5c3-1 6-.7 9 1v12c-3-1.7-6-2-9-1z" /><path d="M21 5.5c-3-1-6-.7-9 1v12c3-1.7 6-2 9-1z" /></svg>;
    case "scene":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M8 14h8" /></svg>;
    case "map":
      return <svg {...common}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></svg>;
    case "time":
      return <svg {...common}><path d="M3 12h18" /><circle cx="7" cy="12" r="2" /><circle cx="14" cy="12" r="2" /><path d="M7 7v3M14 14v3M19 12l-2-2m2 2-2 2" /></svg>;
    case "word":
      return <svg {...common}><path d="M4 18 9 6l5 12M5.8 14h6.4" /><path d="M16 9h5M18.5 9c0 4-1.5 6-3 7M18.5 11c.5 2 2 3.5 3 4" /></svg>;
    case "note":
      return <svg {...common}><path d="M5 4h11l3 3v13H5z" /><path d="M8 11h8M8 15h5" /></svg>;
  }
}

export default function Home() {
  const readyBooks = getBookSlugs().map((slug) => ({ slug, book: getBook(slug) }));
  const bySlug = new Map(readyBooks.map((r) => [r.slug, r.book]));
  const totals = getReadyTotals();
  const all = getBrowserBooks();
  const groupTiles = GROUPS.map((g) => {
    const inGroup = all.filter((b) => b.group === g.id);
    return { ...g, total: inGroup.length, ready: inGroup.filter((b) => b.ready).length };
  });

  const romans = bySlug.get("romans");
  const starts = START_HERE.map((s) => bySlug.get(s)).filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <>
      <MainHeader
        label="Home sections"
        items={[
          { href: "#features", label: "What you can do" },
          { href: "#start", label: "Start here", hideOnPhone: true },
          { href: "/books/", label: "All books" },
          { href: "/sources/", label: "Sources" },
        ]}
      />

      <main id="main" className="main landing">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-hero-text">
            <div className="eyebrow">Context first, verses second</div>
            <h1 id="hero-title">Know the world a passage came from, then read it.</h1>
            <p className="lede lede--light">
              Who wrote it, who it was written to, and what was happening around them. Explore books with maps, timelines,
              word studies, and questions to talk about together.
            </p>
            <div className="hero-buttons">
              <Link className="btn btn--gold" href="/books/">Browse the books</Link>
              <a className="btn btn--outline-light" href="#features">See what you can do</a>
            </div>
            <ul className="stat-row" aria-label="What is ready now">
              <li><strong>{totals.books}</strong><span>books ready</span></li>
              <li><strong>{totals.chapters}</strong><span>chapters</span></li>
              <li><strong>{totals.words.toLocaleString("en-US")}</strong><span>word studies</span></li>
            </ul>
          </div>
          {romans && (
            <figure className="peek">
              <div className="peek-card">
                <div className="eyebrow">Setting the scene</div>
                <dl>
                  <div><dt>Written by</dt><dd>{romans.scene.author}</dd></div>
                  <div><dt>Written to</dt><dd>{romans.scene.audience}</dd></div>
                  <div><dt>What was happening</dt><dd>{romans.scene.happening}</dd></div>
                </dl>
              </div>
              <figcaption className="smaller">A peek at the start of every book: Romans.</figcaption>
            </figure>
          )}
        </section>

        <section id="features" className="landing-section" aria-labelledby="features-title">
          <div className="section-head">
            <div className="eyebrow">What you can do</div>
            <h2 id="features-title">Everything is built around understanding the setting</h2>
          </div>
          <ul className="feature-grid">
            {FEATURES.map((f) => (
              <li key={f.title} className="card feature-card">
                <span className="feature-icon"><Icon name={f.icon} /></span>
                <h3>{f.title}</h3>
                <p className="small muted">{f.text}</p>
                <Link href={f.href} className="feature-link">{f.cta} &rarr;</Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="start" className="landing-section" aria-labelledby="start-title">
          <div className="section-head">
            <div className="eyebrow">Not sure where to begin?</div>
            <h2 id="start-title">Good places to start</h2>
          </div>
          <ul className="start-grid">
            {starts.map((b) => (
              <li key={b.slug}>
                <Link href={`/${b.slug}/`} className="start-card">
                  <span className="label">{b.testament === "NT" ? "New Testament" : "Old Testament"} · {b.chapterCount} chapters</span>
                  <span className="book-title">{b.title}</span>
                  <span className="small muted">{b.tagline}</span>
                  <span className="feature-link">Open {b.title} &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="books" className="landing-section" aria-labelledby="books-title">
          <div className="section-head">
            <div className="eyebrow">The whole Bible</div>
            <h2 id="books-title">Find a book</h2>
            <p className="lede lede--sm muted">
              All 66 books are listed. Jump straight to the kind of book you are after, or browse everything.
            </p>
          </div>
          <ul className="group-tiles">
            {groupTiles.map((g) => (
              <li key={g.id}>
                <Link href={`/books/?filter=${g.id}`} className="group-tile">
                  <span className="group-tile-name">{g.label}</span>
                  <span className="smaller muted">{g.ready} of {g.total} ready</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hero-buttons">
            <Link className="btn btn--solid" href="/books/">Browse all 66 books</Link>
            <Link className="btn btn--ghost" href="/books/?ready=1">Only books ready to read</Link>
          </div>
        </section>

        <section className="band honesty" aria-labelledby="honest-title">
          <div className="honesty-text">
            <div className="eyebrow">Honest about what we know</div>
            <h2 id="honest-title" className="big-idea">First drafts, with the debates left in.</h2>
            <p>
              Authorship, dates, and some words are genuinely debated, and the site says so. The notes are first drafts that
              still need checking against commentaries and lexicons. The data behind the maps, people, and words comes from
              open sources, credited in full.
            </p>
          </div>
          <Link className="btn btn--gold" href="/sources/">See sources and credits</Link>
        </section>
      </main>
    </>
  );
}
