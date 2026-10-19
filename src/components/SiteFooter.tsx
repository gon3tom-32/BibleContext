import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>
          Context notes, summaries, and questions are first drafts and haven&rsquo;t been checked against commentaries yet.
        </p>
        <p>
          Bible text: World English Bible (public domain). Places, people, words, and cross-references come from open
          datasets. <Link href="/sources/">Sources and credits</Link>
        </p>
      </div>
    </footer>
  );
}
