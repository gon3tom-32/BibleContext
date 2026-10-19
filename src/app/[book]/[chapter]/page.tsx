import type { Metadata } from "next";
import Link from "next/link";
import Notes from "@/components/Notes";
import { getBook, getBookSlugs, getChapter, getPeople, getWords, scriptureUrl } from "@/lib/content";

type Params = { params: Promise<{ book: string; chapter: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBookSlugs().flatMap((book) =>
    Array.from({ length: getBook(book).chapterCount }, (_, i) => ({ book, chapter: String(i + 1) })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book, chapter } = await params;
  return { title: `${getBook(book).title} ${chapter}` };
}

export default async function ChapterPage({ params }: Params) {
  const { book: slug, chapter: chStr } = await params;
  const n = Number(chStr);
  const book = getBook(slug);
  const chapter = getChapter(slug, n);
  const people = getPeople(slug);
  const words = getWords(slug);
  const title = `${book.title} ${n}`;

  return (
    <main id="main" className="main" style={{ gap: 32 }}>
      <section className="stack gap-20">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${slug}/`}>{book.title}</Link> / Chapter {n}
        </nav>
        <div className="chapter-head">
          <h1 className="page-title">{title}</h1>
          <nav aria-label="Chapters">
            <ul className="switcher">
              {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map((c) => (
                <li key={c}>
                  <Link href={`/${slug}/${c}/`} aria-current={c === n ? "page" : undefined} aria-label={`Chapter ${c}`}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="band scene" aria-label="Setting the scene">
        <div className="eyebrow">Setting the scene</div>
        <dl className="scene-grid">
          <div><dt>Who wrote it</dt><dd>{book.scene.author}</dd></div>
          <div><dt>Who it was for</dt><dd>{book.scene.audience}</dd></div>
          <div><dt>What was happening</dt><dd>{chapter?.sceneHappening ?? book.scene.happening}</dd></div>
        </dl>
        <Link href={`/${slug}/`} className="smaller">Read the full background in the book overview</Link>
      </section>

      {!chapter ? (
        <section className="card unwritten">
          <h2>This chapter hasn&rsquo;t been written up yet</h2>
          <p className="muted">
            The context notes for {title} are still to come. You can{" "}
            <a href={scriptureUrl(title)} target="_blank" rel="noopener">read {title} in the World English Bible</a>{" "}
            in the meantime.
          </p>
          <div className="stack gap-12" style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 22 }}>Our notes</h3>
            <Notes book={slug} chapter={n} compact />
          </div>
        </section>
      ) : (
        <section className="two-col">
          <div className="col-main">
            <div className="card" style={{ gap: 14 }}>
              <h2>What&rsquo;s happening</h2>
              <p className="prose">{chapter.summary}</p>
              <div className="divider">
                <h3 className="label" style={{ fontFamily: "var(--sans)" }}>Why the setting matters</h3>
                <p className="small muted">{chapter.whySettingMatters}</p>
              </div>
              <a className="smaller" href={scriptureUrl(title)} target="_blank" rel="noopener">
                Read {title} (World English Bible)
              </a>
            </div>

            <div className="card">
              <h2>Who&rsquo;s in this chapter</h2>
              <div className="grid grid-220">
                {chapter.people.map((cp) => {
                  const p = people.find((x) => x.id === cp.id);
                  return (
                    <div key={cp.id} className="person-tile">
                      <h3>{p?.name ?? cp.id}</h3>
                      <p>{cp.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h2>Talk it through</h2>
              <ol className="questions">
                {chapter.questions.map((q) => <li key={q}>{q}</li>)}
              </ol>
            </div>
          </div>

          <aside className="col-side" aria-label="Study tools">
            <div className="card card--tight card--side" style={{ gap: 14 }}>
              <h2>Key words</h2>
              <ul className="word-list">
                {chapter.words.map(({ id, note }) => {
                  const w = words.find((x) => x.id === id);
                  if (!w) return null;
                  return (
                    <li key={id}>
                      <Link href={`/${slug}/words/${w.id}/`}>
                        <i>{w.transliteration}</i>
                      </Link>{" "}
                      <span className="gloss">· {w.gloss}</span>
                      <p>{note}</p>
                    </li>
                  );
                })}
              </ul>
              <Link href={`/${slug}/words/`} className="smaller">See all word studies</Link>
            </div>

            <div className="card card--tight card--side">
              <h2>Cross-references</h2>
              <ul className="refs">
                {chapter.crossRefs.map((r) => (
                  <li key={r.ref}>
                    <a href={scriptureUrl(r.ref)} target="_blank" rel="noopener">{r.ref}</a>, {r.note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card card--tight card--side">
              <h2>Our notes</h2>
              <Notes book={slug} chapter={n} />
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
