import Link from "next/link";
import type { Source } from "@/lib/content";

// Small credit line under data that came from an outside source.
export default function SourceNote({ source, what }: { source: Source; what?: string }) {
  return (
    <p className="source-note">
      {what ? `${what}: ` : "Source: "}
      <a href={source.url} target="_blank" rel="noopener">{source.name}</a>, {source.license}.{" "}
      <Link href="/sources/">About our sources</Link>
    </p>
  );
}
