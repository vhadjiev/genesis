import "../app.css";

import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/providers/Providers";
import initTranslations from "@/app/i18n";
import { getIndex } from "@/utils/data";
import { SpeedInsights } from "@vercel/speed-insights/next"

const GTM_ID = "GTM-MFZNM4LN";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-mono",
});

/**
 * Generate metadata from site config
 * This provides default metadata that can be overridden by individual pages
 */
export async function generateMetadata(): Promise<Metadata> {
  const index = await getIndex();
  const { site } = index;
  const { seo } = site;

  return {
    title: {
      default: site.name,
      template: seo.titleTemplate,
    },
    description: site.tagline.en,
    keywords: [
      "coffee machines",
      "automatic coffee machines",
      "genesis technology",
      "beverage equipment",
      "bar systems",
      "HoReCa",
      "Plovdiv",
      "Bulgaria",
    ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    metadataBase: new URL(seo.siteUrl),
    openGraph: {
      title: site.name,
      description: site.tagline.en,
      type: seo.openGraph.type as "website",
      siteName: seo.openGraph.siteName,
      images: seo.openGraph.images,
    },
    twitter: {
      card: seo.twitter.card,
      site: seo.twitter.site,
      title: site.name,
      description: site.tagline.en,
      images: seo.openGraph.images,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

/**
 * Generate static pages for all locales at build time
 */
export async function generateStaticParams() {
  const index = await getIndex();
  return index.site.locales.map((locale) => ({ locale }));
}

// Enable ISR - regenerate pages every 60 seconds when requested
export const revalidate = 60;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>) {
  const { locale } = await params;

  // Initialize translations with revalidation enabled
  const { resources } = await initTranslations(locale, undefined, undefined, {
    revalidate: true,
  });

  return (
    <html lang={locale} className={`dark ${dmSans.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="GenTech" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${dmSans.className} antialiased min-h-screen bg-background text-foreground`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers locale={locale} resources={resources}>
          {children}
        </Providers>
        <SpeedInsights/>
      </body>
    </html>
  );
}
