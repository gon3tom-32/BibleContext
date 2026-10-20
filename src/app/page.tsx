import Link from "next/link";
import BookBrowser, { type BrowserBook } from "@/components/BookBrowser";
import Logo from "@/components/Logo";
import { CANON } from "@/lib/canon";
import { getBook, getBookSlugs, getChapters, getWords } from "@/lib/content";

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

  let chapterTotal = 0;
  let wordTotal = 0;
  const wordsBySlug = new Map<string, number>();
  for (const { slug } of readyBooks) {
    chapterTotal += getChapters(slug).length;
    const n = getWords(slug).length;
    wordTotal += n;
    wordsBySlug.set(slug, n);
  }

  const browserBooks: BrowserBook[] = CANON.map((c) => {
    const book = bySlug.get(c.slug);
    return {
      slug: c.slug,
      title: c.title,
      testament: c.testament,
      group: c.group,
      chapters: book ? book.chapterCount : c.chapters,
      ready: Boolean(book),
      tagline: book?.tagline,
      words: wordsBySlug.get(c.slug),
    };
  });

  const romans = bySlug.get("romans");
  const starts = START_HERE.map((s) => bySlug.get(s)).filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <>
      <header className="site-header">
        <a className="skip" href="#main">Skip to content</a>
        <div className="site-header-inner">
          <Logo />
          <nav className="site-nav" aria-label="Home sections">
            <a href="#features">What you can do</a>
            <a href="#start" className="hide-sm">Start here</a>
            <a href="#books">All books</a>
            <Link href="/sources/">Sources</Link>
          </nav>
        </div>
      </header>

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
              <a className="btn btn--gold" href="#books">Browse the books</a>
              <a className="btn btn--outline-light" href="#features">See what you can do</a>
            </div>
            <ul className="stat-row" aria-label="What is ready now">
              <li><strong>{readyBooks.length}</strong><span>books ready</span></li>
              <li><strong>{chapterTotal}</strong><span>chapters</span></li>
              <li><strong>{wordTotal.toLocaleString("en-US")}</strong><span>word studies</span></li>
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
            <h2 id="books-title">Browse all 66 books</h2>
            <p className="lede lede--sm muted">
              Filter by Old or New Testament, or by kind of book. Books marked &ldquo;coming soon&rdquo; are on the way; we are
              working through them one at a time.
            </p>
          </div>
          <BookBrowser books={browserBooks} />
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
