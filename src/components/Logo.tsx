import Link from "next/link";

/** The mark: an open book with a map pin rising from its spine. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#E9C46A" />
      <path d="M7 17.5c4.5-1.3 9-.9 13 1.7v13.3c-4-2.3-8.5-2.6-13-1.4z" fill="#1C2333" />
      <path d="M33 17.5c-4.5-1.3-9-.9-13 1.7v13.3c4-2.3 8.5-2.6 13-1.4z" fill="#1C2333" fillOpacity=".88" />
      <path d="M20 5.5a5 5 0 0 1 5 5c0 3.6-5 8.5-5 8.5s-5-4.9-5-8.5a5 5 0 0 1 5-5z" fill="#1C2333" />
      <circle cx="20" cy="10.5" r="1.9" fill="#E9C46A" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Passage Explorer home">
      <LogoMark />
      <span className="brand-name">Passage Explorer</span>
    </Link>
  );
}
