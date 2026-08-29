import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { StoreProvider } from "../src/context/StoreContext";
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "TT オンラインコンビニ",
    description: "毎日の便利を、もっと身近に。",
    openGraph: {
      title: "TT オンラインコンビニ",
      description: "毎日の便利を、もっと身近に。",
      images: [new URL("/og.png", base).toString()],
    },
    twitter: {
      card: "summary_large_image",
      title: "TT オンラインコンビニ",
      description: "毎日の便利を、もっと身近に。",
      images: [new URL("/og.png", base).toString()],
    },
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
