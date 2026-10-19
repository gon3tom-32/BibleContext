import type { Metadata } from "next";
import Link from "next/link";
import ContextExplorer from "@/components/ContextExplorer";
import LaneTimeline from "@/components/LaneTimeline";
import { getBook, getMap, getTimeline } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: `${getBook(book).title}: map and timeline` };
}

export default async function ContextPage({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
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
      <LaneTimeline timeline={getTimeline(slug)} />
    </main>
  );
}
