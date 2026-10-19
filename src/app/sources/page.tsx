import type { Metadata } from "next";
import Link from "next/link";
import { getSources } from "@/lib/content";

export const metadata: Metadata = { title: "Sources and credits" };

export default function SourcesPage() {
  const { fetched, sources } = getSources();
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" href="/">Passage Explorer</Link>
        </div>
      </header>
      <main id="main" className="main">
        <section className="stack gap-12">
          <h1 className="page-title">Sources and credits</h1>
          <p className="lede lede--sm">
            The open datasets behind this site, what we use each one for, and how we changed it. Data was fetched on{" "}
            {new Date(fetched + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
          </p>
        </section>

        <ul className="source-list">
          {sources.map((s) => (
            <li key={s.id} className="card card--tight">
              <div className="card-head">
                <h2 style={{ fontSize: 22 }}>
                  <a className="source-name" href={s.homepage} target="_blank" rel="noopener">{s.name}</a>
                </h2>
                <a className="license-chip" href={s.licenseUrl} target="_blank" rel="noopener">{s.license}</a>
              </div>
              <dl className="source-facts">
                <div><dt>Used for</dt><dd>{s.provides}</dd></div>
                {s.modifications && <div><dt>Changes we made</dt><dd>{s.modifications}</dd></div>}
                {s.notes && <div><dt>Note</dt><dd>{s.notes}</dd></div>}
                {s.repo && (
                  <div>
                    <dt>Version used</dt>
                    <dd>
                      <a href={`${s.repo}/tree/${s.commit}`} target="_blank" rel="noopener">{s.repo.replace("https://github.com/", "")}</a>
                      {s.commit && <span className="muted"> at {s.commit.slice(0, 7)}</span>}
                    </dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>

        <section className="card" aria-labelledby="not-from-data">
          <h2 id="not-from-data">Written by us, not from these sources</h2>
          <p className="prose">
            Authorship, dating, audience, historical setting, cultural notes, chapter summaries, discussion questions, map
            stops, the timeline, and the notes on each word are written for this site. None of it is copied from
            commentaries. It&rsquo;s all marked as a draft until it has been checked.
          </p>
          <p className="small muted">
            The map on the Context page is a hand-drawn sketch, not drawn to scale. Some outlines in the place data are
            © OpenStreetMap contributors, ODbL 1.0.
          </p>
        </section>
      </main>
    </>
  );
}
