import type { Metadata } from "next";
import Link from "next/link";
import ContextExplorer from "@/components/ContextExplorer";
import LaneTimeline from "@/components/LaneTimeline";
import SourceNote from "@/components/SourceNote";
import { getBook, getMap, getPlaceData, getTimeline } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: `${getBook(book).title}: map and timeline` };
}

export default async function ContextPage({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
  const places = getPlaceData(slug);
  const osm = places.some((p) => p.outline?.osm);
  return (
    <main id="main" className="main">
      <section className="stack gap-12">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${slug}/`}>{book.title}</Link> / Context
        </nav>
        <h1 className="page-title">Map and timeline</h1>
        <p className="lede lede--sm">Where the story moves, and where it sits in Israel&rsquo;s history.</p>
      </section>
      <ContextExplorer map={getMap(slug)} slug={slug} />
      {places.length > 0 && (
        <section className="card" aria-labelledby="places-heading" style={{ padding: 24 }}>
          <div className="card-head">
            <h2 id="places-heading">Places in the story</h2>
            <div className="smaller" style={{ color: "var(--muted)" }}>How sure scholars are of each location</div>
          </div>
          <ul className="place-list">
            {places.map((p) => (
              <li key={p.id}>
                <div className="place-top">
                  <strong>{p.mapOnly && p.modernLocation ? p.modernLocation : p.name}</strong>
                  <span className={`conf conf--${p.confidence.label.toLowerCase()}`}>{p.confidence.label} confidence</span>
                </div>
                <p className="smaller muted">
                  {p.mapOnly
                    ? `Shown for orientation; not named in ${book.title}.`
                    : [
                        p.modernLocation && p.modernLocation !== p.name ? `Today: ${p.modernLocation}.` : p.type === "region" ? "A region." : "",
                        `Named in ${p.mentionedIn.length} verse${p.mentionedIn.length === 1 ? "" : "s"}: ${p.mentionedIn.slice(0, 4).join(", ")}${p.mentionedIn.length > 4 ? ", …" : ""}`,
                      ].filter(Boolean).join(" ")}
                </p>
                {p.lonlat && <p className="coords">{p.lonlat[1].toFixed(3)}° N, {p.lonlat[0].toFixed(3)}° E</p>}
              </li>
            ))}
          </ul>
          <SourceNote source={places[0].source} what="Locations and confidence" />
          {osm && <p className="source-note">Some outlines © OpenStreetMap contributors, ODbL 1.0.</p>}
        </section>
      )}
      <LaneTimeline timeline={getTimeline(slug)} />
    </main>
  );
}
