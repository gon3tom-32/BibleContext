import type { Metadata } from "next";
import Link from "next/link";
import JourneyMap from "@/components/JourneyMap";
import Rich from "@/components/Rich";
import { getBook, getMap, getPeople, getTimeline } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: getBook(book).title };
}

export default async function Overview({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
  const people = getPeople(slug);
  const map = getMap(slug);
  const timeline = getTimeline(slug);
  const shown = book.overviewPeople
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const facts = [
    { label: "Who wrote it", title: book.author, note: book.authorNote, debated: book.authorDebated },
    { label: "Who it was for", title: book.audience, note: book.audienceNote },
    { label: "When it happens", title: book.setting, note: book.settingNote },
    { label: "How to read it", title: book.genre, note: book.genreNote },
  ];

  return (
    <main id="main" className="main main--overview">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">Before you read</div>
          <h1>{book.title}</h1>
          <p className="lede">{book.tagline}</p>
        </div>
        <div className="hero-actions">
          <Link className="btn btn--solid" href={`/${slug}/context/`}>See the map and timeline</Link>
          <Link className="btn btn--ghost" href={`/${slug}/1/`}>Jump to Chapter 1</Link>
        </div>
      </section>

      <section className="grid grid-240" aria-label="Context">
        {facts.map((f) => (
          <div key={f.label} className="card card--tight" style={{ gap: 8 }}>
            <h2 className="label" style={{ fontFamily: "var(--sans)", fontSize: 13 }}>{f.label}</h2>
            <div className="fact-title">
              {f.title}
              {f.debated && <span className="debated">Debated</span>}
            </div>
            <p className="small muted">{f.note}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-340" aria-label="Map and timeline">
        <div className="card">
          <div className="card-head">
            <h2>{book.mapTitle}</h2>
            <Link href={`/${slug}/context/`}>Open map</Link>
          </div>
          <JourneyMap map={map} compact />
          <p className="small muted">{book.mapSummary}</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Timeline</h2>
            <Link href={`/${slug}/context/#timeline-heading`}>Open timeline</Link>
          </div>
          <ol className="tl-teaser">
            {timeline.teaser.map((t, i) => (
              <li key={t.title}>
                <div className="tl-rail" aria-hidden="true">
                  <div className={`tl-dot tl-dot--${t.tone}`} />
                  {i < timeline.teaser.length - 1 && <div className="tl-line" />}
                </div>
                <div className="tl-body">
                  <strong>{t.title}</strong>
                  <span>{t.text}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="hint">In order, not to scale.</p>
        </div>
      </section>

      <section className="band" aria-label="Big idea and themes">
        <div className="stack gap-12" style={{ flex: "1 1 420px" }}>
          <div className="eyebrow">Big idea</div>
          <p className="big-idea"><Rich text={book.bigIdea} /></p>
        </div>
        <div className="stack gap-12" style={{ flex: "1 1 320px" }}>
          <div className="eyebrow">Key themes</div>
          <ul className="chips">
            {book.themes.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="stack gap-20" aria-labelledby="whos-who">
        <div className="card-head">
          <h2 id="whos-who" style={{ fontSize: 30 }}>Who&rsquo;s who</h2>
        </div>
        <div className="grid grid-200">
          {shown.map((p) => (
            <div key={p.id} className="card person-card">
              <h3>{p.name}</h3>
              <p>{p.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
