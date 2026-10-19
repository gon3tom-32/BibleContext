import type { Metadata } from "next";
import Link from "next/link";
import { getBook, getChapters, getWords, languageOf } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: `${getBook(book).title}: word studies` };
}

export default async function WordsPage({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
  const words = getWords(slug);
  const chapters = getChapters(slug);
  const lang = languageOf(book.language);
  const chaptersFor = (id: string) => chapters.filter((c) => c.words.some((w) => w.id === id)).map((c) => c.number);

  return (
    <main id="main" className="main">
      <section className="stack gap-12">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${slug}/`}>{book.title}</Link> / Word studies
        </nav>
        <h1 className="page-title">Word studies</h1>
        <p className="lede lede--sm">
          Key words from the original language. Tap one to see its range of meaning and where else it shows up.
        </p>
      </section>
      <ul className="word-grid" aria-label="Words">
        {words.map((w) => {
          const chs = chaptersFor(w.id);
          return (
            <li key={w.id}>
              <Link className="word-tile" href={`/${slug}/words/${w.id}/`}>
                <span className="word-tile-top">
                  <span className="word-tile-name"><i>{w.transliteration}</i></span>
                  <span className={`${lang.className} word-tile-heb`} lang={lang.code} dir={lang.dir}>{w.original}</span>
                </span>
                <span className="word-tile-gloss">{w.gloss}</span>
                {chs.length > 0 && (
                  <span className="word-tile-meta">Chapter{chs.length > 1 ? "s" : ""} {chs.join(", ")}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
