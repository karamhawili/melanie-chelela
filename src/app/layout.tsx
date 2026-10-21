import type { Metadata } from "next";
import { Italiana, Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

// Italiana has no italic, and a browser-slanted Italiana looks wrong at
// display size. Cormorant's true italic shares its hairline weight and
// takes over for every italic title line.
const cormorantItalic = Cormorant_Garamond({
  variable: "--font-cormorant-italic",
  weight: "500",
  style: "italic",
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
  title: "Melanie Chelela — Interior Designer",
  description:
    "Studio Melanie Chelela, an interior design practice based in Beirut, Lebanon.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${italiana.variable} ${cormorantItalic.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
