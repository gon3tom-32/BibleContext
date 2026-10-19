import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SourceNote from "@/components/SourceNote";
import { getBook, getBookSlugs, getChapters, getWord, getWordData, getWords, languageOf, scriptureUrl } from "@/lib/content";

type Params = { params: Promise<{ book: string; word: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBookSlugs().flatMap((book) => getWords(book).map((w) => ({ book, word: w.id })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book, word } = await params;
  return { title: `${getWord(book, word)?.transliteration ?? "Word"}: ${getBook(book).title}` };
}

export default async function WordStudyPage({ params }: Params) {
  const { book: slug, word: id } = await params;
  const book = getBook(slug);
  const word = getWord(slug, id);
  if (!word) notFound();
  const words = getWords(slug);
  const data = getWordData(slug, id);
  const lang = languageOf(data?.language ?? book.language);
  const uses = getChapters(slug).flatMap((c) =>
    c.words.filter((w) => w.id === id).map((w) => ({ chapter: c.number, note: w.note })),
  );
  const i = words.findIndex((w) => w.id === id);
  const prev = words[i - 1];
  const next = words[i + 1];

  return (
    <main id="main" className="main" style={{ gap: 32 }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/${slug}/`}>{book.title}</Link> / <Link href={`/${slug}/words/`}>Word studies</Link> /{" "}
        {word.transliteration}
      </nav>

      <section className="band word-hero" aria-labelledby="word-title">
        <div className="word-hero-text">
          <div className="eyebrow">Word study · {lang.name}</div>
          <h1 id="word-title" className="word-title"><i>{word.transliteration}</i></h1>
          <p className="word-gloss">{word.gloss}</p>
          <p className="word-say">Say it: <span>{word.pronunciation}</span> <span className="word-say-note">(approximate)</span></p>
        </div>
        <div className="word-hero-heb">
          <span className={lang.className} lang={lang.code} dir={lang.dir}>{word.original}</span>
        </div>
      </section>

      <section className="two-col">
        <div className="col-main">
          <div className="card" style={{ gap: 14 }}>
            <h2>What it means</h2>
            <p className="prose">{word.notes}</p>
            {word.uncertain && (
              <div className="divider">
                <h3 className="label" style={{ fontFamily: "var(--sans)" }}>
                  Open question <span className="debated">Debated</span>
                </h3>
                <p className="small muted">{word.uncertain}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2>Range of meaning</h2>
            <ul className="range-list">
              {word.range.map((r) => (
                <li key={r.sense}>
                  <strong>{r.sense}</strong>
                  <span>{r.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>In {book.title}</h2>
            {uses.length > 0 && (
              <ul className="uses-list">
                {uses.map((u) => (
                  <li key={u.chapter}>
                    <Link href={`/${slug}/${u.chapter}/`} className="uses-ch">Chapter {u.chapter}</Link>
                    <p>{u.note}</p>
                  </li>
                ))}
              </ul>
            )}
            {data && (
              <div className="stack gap-8">
                <h3 className="label" style={{ fontFamily: "var(--sans)" }}>
                  Every verse ({data.occurrencesInBook.length})
                </h3>
                <ul className="ref-chips">
                  {data.occurrencesInBook.map((r) => (
                    <li key={r}><a href={scriptureUrl(r)} target="_blank" rel="noopener">{r}</a></li>
                  ))}
                </ul>
                <SourceNote source={data.source} what={`Verses where ${data.strongs.join(" or ")} is tagged in the Hebrew text`} />
              </div>
            )}
          </div>
        </div>

        <aside className="col-side" aria-label="More about this word">
          {data && data.lexicon.length > 0 && (
            <div className="card card--tight card--side">
              <h2>From the lexicon</h2>
              {data.lexicon.map((e) => (
                <div key={e.strongs} className="lex-entry">
                  <div className="lex-head">
                    <span className={`${lang.className} lex-heb`} lang={lang.code} dir={lang.dir}>{e.original}</span>
                    <span className="lex-meta">{e.transliteration} · {e.strongs}</span>
                  </div>
                  <p className="lex-meaning">{e.meaning}</p>
                </div>
              ))}
              <p className="smaller muted">
                Used in {data.corpusCount} verse{data.corpusCount === 1 ? "" : "s"} of the {data.corpus}.
              </p>
              <SourceNote source={data.source} what="Brief lexicon entry and counts" />
            </div>
          )}

          <div className="card card--tight card--side">
            <h2>Elsewhere in the Bible</h2>
            <ul className="refs" style={{ gap: 12 }}>
              {word.elsewhere.map((e) => (
                <li key={e.ref}>
                  <a href={scriptureUrl(e.ref)} target="_blank" rel="noopener">{e.ref}</a>
                  <br />
                  <span className="smaller muted">{e.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--tight card--side">
            <h2>In English Bibles</h2>
            <p className="smaller muted">Common ways translations render it:</p>
            <ul className="chips chips--light">
              {word.translations.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          <nav className="card card--tight card--side" aria-label="Other words">
            <h2>Other words</h2>
            <ul className="word-list">
              {words.filter((w) => w.id !== id).map((w) => (
                <li key={w.id}>
                  <Link href={`/${slug}/words/${w.id}/`}><i>{w.transliteration}</i></Link>{" "}
                  <span className="gloss">· {w.gloss}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </section>

      <nav className="pager" aria-label="Previous and next word">
        {prev ? <Link href={`/${slug}/words/${prev.id}/`}>← <i>{prev.transliteration}</i></Link> : <span />}
        {next ? <Link href={`/${slug}/words/${next.id}/`}><i>{next.transliteration}</i> →</Link> : <span />}
      </nav>
    </main>
  );
}
