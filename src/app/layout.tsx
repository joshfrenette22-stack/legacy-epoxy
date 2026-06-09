import type { Metadata } from "next";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-instrument",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legacy Epoxy | Premium Epoxy Floors — Northern Colorado",
  description:
    "Northern Colorado's only certified ChemTec installer. Mirror-gloss epoxy floors for garages, basements, pool decks & sidewalks. 10-year warranty. Get a free quote.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Legacy Epoxy | Premium Epoxy Floors",
    description:
      "The only certified ChemTec installer in Northern Colorado. 10-year warranty on every install.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
