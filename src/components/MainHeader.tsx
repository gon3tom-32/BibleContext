import Link from "next/link";
import Logo from "./Logo";

export type MainNavItem = { href: string; label: string; current?: boolean; hideOnPhone?: boolean };

export default function MainHeader({ items, label }: { items: MainNavItem[]; label: string }) {
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="site-header-inner">
        <Logo />
        <nav className="site-nav" aria-label={label}>
          {items.map((i) => (
            <Link key={i.label} href={i.href} className={i.hideOnPhone ? "hide-sm" : undefined} aria-current={i.current ? "page" : undefined}>
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
