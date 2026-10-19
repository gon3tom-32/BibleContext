import Link from "next/link";
import { getBook, getBookSlugs } from "@/lib/content";

export default function Home() {
  const books = getBookSlugs().map(getBook);
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <span className="brand">Passage Explorer</span>
        </div>
      </header>
      <main id="main" className="main main--overview">
        <section className="hero-text" style={{ flex: "none" }}>
          <div className="eyebrow">Context first, verses second</div>
          <h1 className="page-title">Pick a book</h1>
          <p className="lede">Who wrote it, who it was for, and what was going on in history.</p>
        </section>
        <section className="grid grid-240" aria-label="Books">
          {books.map((b) => (
            <Link key={b.slug} href={`/${b.slug}/`} className="card card--tight" style={{ color: "inherit", fontWeight: 400, textDecoration: "none" }}>
              <div className="label">
                {b.testament === "NT" ? "New Testament" : "Old Testament"} · {b.chapterCount} chapters
              </div>
              <h2 style={{ fontSize: 28 }}>{b.title}</h2>
              <p className="small muted">{b.tagline}</p>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
