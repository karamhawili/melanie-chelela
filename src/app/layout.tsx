import type { Metadata } from "next";
import { Italiana, Space_Grotesk } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Melanie Chlela — Interior Architecture",
  description:
    "Studio Melanie Chlela, an interior-architecture practice based in Beirut, Lebanon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${italiana.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
