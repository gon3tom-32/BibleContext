"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

type Props = { slug: string };

export default function SiteHeader({ slug }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/${slug}`;
  const items = [
    { href: "/books/", label: "All books", short: "Books", match: () => false },
    { href: `${base}/`, label: "Overview", match: (p: string) => p === base || p === `${base}/` },
    { href: `${base}/context/`, label: "Context", match: (p: string) => p.startsWith(`${base}/context`) },
    { href: `${base}/1/`, label: "Chapters", match: (p: string) => /^\/[^/]+\/\d+\/?$/.test(p) },
    { href: `${base}/words/`, label: "Word studies", short: "Words", match: (p: string) => p.startsWith(`${base}/words`) },
    { href: `${base}/notes/`, label: "Our notes", match: (p: string) => p.startsWith(`${base}/notes`) },
  ];

  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="site-header-inner">
        <Logo />
        <nav className="site-nav" aria-label="Book sections">
          {items.map((item) => (
            <Link key={item.label} href={item.href} aria-current={item.match(pathname) ? "page" : undefined}>
              {item.short ? (
                <>
                  <span className="nav-long">{item.label}</span>
                  <span className="nav-short">{item.short}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
