import SiteHeader from "@/components/SiteHeader";
import { getBookSlugs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBookSlugs().map((book) => ({ book }));
}

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  return (
    <>
      <SiteHeader slug={book} />
      {children}
    </>
  );
}
