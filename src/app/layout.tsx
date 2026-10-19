import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Serif, Noto_Serif_Hebrew } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-fraunces", display: "swap" });
const hebrew = Noto_Serif_Hebrew({ subsets: ["hebrew"], weight: ["400", "500"], variable: "--font-hebrew", display: "swap" });
const greek = Noto_Serif({ subsets: ["greek"], weight: ["400", "500"], variable: "--font-greek", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Passage Explorer", template: "%s · Passage Explorer" },
  description: "Study the Bible with context first: who wrote it, who it was for, and what was going on.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1C2333" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${hebrew.variable} ${greek.variable}`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
