import type { Metadata } from "next";
import Link from "next/link";
import { getBook, getWords, scriptureUrl } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: `${getBook(book).title}: word studies` };
}

// Simple first pass. The full word study screen is planned for Phase 2.
export default async function WordsPage({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
  const words = getWords(slug);
  return (
    <main id="main" className="main">
      <section className="stack gap-12">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${slug}/`}>{book.title}</Link> / Word studies
        </nav>
        <h1 className="page-title">Word studies</h1>
        <p className="lede lede--sm">The original-language word, its range of meaning, and where else it shows up.</p>
      </section>
      <div className="stack gap-16">
        {words.map((w) => (
          <section key={w.id} id={w.id} className="card word-card" aria-labelledby={`${w.id}-h`} style={{ scrollMarginTop: 24 }}>
            <div className="card-head">
              <h2 id={`${w.id}-h`}><i>{w.transliteration}</i> <span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 400 }}>· {w.gloss}</span></h2>
              <span className="word-original" lang="he" dir="rtl">{w.original}</span>
            </div>
            <p className="prose">{w.notes}</p>
            <div className="stack gap-8">
              <h3 className="label" style={{ fontFamily: "var(--sans)" }}>Where it shows up</h3>
              <ul className="refs">
                {w.occurrences.map((o) => (
                  <li key={o}><a href={scriptureUrl(o)} target="_blank" rel="noopener">{o}</a></li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
