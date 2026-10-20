import type { Metadata } from "next";
import BookBrowser from "@/components/BookBrowser";
import MainHeader from "@/components/MainHeader";
import { getBrowserBooks } from "@/lib/books-index";

export const metadata: Metadata = {
  title: "All books",
  description: "Find a book of the Bible by testament, category, or name.",
};

export default function BooksPage() {
  return (
    <>
      <MainHeader
        label="Site sections"
        items={[
          { href: "/", label: "Home" },
          { href: "/books/", label: "All books", current: true },
          { href: "/sources/", label: "Sources" },
        ]}
      />
      <main id="main" className="main books-main">
        <div className="books-title">
          <h1 className="page-title">All books</h1>
          <p className="lede lede--sm muted">
            Find a book to study. Books marked &ldquo;coming soon&rdquo; are on the way, one at a time.
          </p>
        </div>
        <BookBrowser books={getBrowserBooks()} />
      </main>
    </>
  );
}
