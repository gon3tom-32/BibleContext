import type { BrowserBook } from "@/components/BookBrowser";
import { CANON } from "@/lib/canon";
import { getBook, getBookSlugs, getChapters, getWords } from "@/lib/content";

/** Every book in the Bible, marked ready when its content folder exists. */
export function getBrowserBooks(): BrowserBook[] {
  const ready = new Map(getBookSlugs().map((slug) => [slug, getBook(slug)]));
  return CANON.map((c) => {
    const book = ready.get(c.slug);
    return {
      slug: c.slug,
      title: c.title,
      testament: c.testament,
      group: c.group,
      chapters: book ? book.chapterCount : c.chapters,
      ready: Boolean(book),
      tagline: book?.tagline,
      words: book ? getWords(c.slug).length : undefined,
    };
  });
}

/** Totals for the landing page. */
export function getReadyTotals() {
  const slugs = getBookSlugs();
  let chapters = 0;
  let words = 0;
  for (const slug of slugs) {
    chapters += getChapters(slug).length;
    words += getWords(slug).length;
  }
  return { books: slugs.length, chapters, words };
}
