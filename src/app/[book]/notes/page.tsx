import type { Metadata } from "next";
import Link from "next/link";
import Notes from "@/components/Notes";
import { getBook } from "@/lib/content";

type Params = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { book } = await params;
  return { title: `${getBook(book).title}: our notes` };
}

export default async function NotesPage({ params }: Params) {
  const { book: slug } = await params;
  const book = getBook(slug);
  return (
    <main id="main" className="main">
      <section className="stack gap-12">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${slug}/`}>{book.title}</Link> / Our notes
        </nav>
        <h1 className="page-title">Our notes</h1>
        <p className="lede lede--sm">Everything you&rsquo;ve written on {book.title}, newest first.</p>
      </section>
      <div className="card" style={{ maxWidth: 720 }}>
        <Notes book={slug} showChapter />
      </div>
    </main>
  );
}
