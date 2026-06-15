import type { Metadata } from "next";
import Script from "next/script";
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
  title: "Legacy Epoxy | Premium Epoxy Floors — Colorado & New Mexico",
  description:
    "The only certified ChemTec installer in Colorado and New Mexico. Mirror-gloss epoxy floors for garages, basements, pool decks & sidewalks. 10-year warranty. Get a free quote.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Legacy Epoxy | Premium Epoxy Floors",
    description:
      "The only certified ChemTec installer in Colorado and New Mexico. 10-year warranty on every install.",
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
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KRB4R89C');
      `}</Script>
      <body className="min-h-dvh font-sans">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KRB4R89C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
