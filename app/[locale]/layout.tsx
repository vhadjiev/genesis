import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, defaultLocale, isValidLocale, localePath, type Locale } from "@/i18n/settings";
import { plusJakarta, inter, jetbrainsMono } from "@/lib/fonts";
import { getSiteConfig } from "@/lib/get-content";
import { getCmsPage, findFirstBlockImage } from "@/lib/get-page";
import { getHeader, getFooter } from "@/lib/get-global";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData } from "./structured-data";
import { PageContextProvider } from "@/lib/page-context";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [site, page] = await Promise.all([
    getSiteConfig(),
    getCmsPage("home", locale as Locale),
  ]);

  // Resolve OG image: page meta → first image from blocks
  const ogImagePath = page.meta.ogImage || findFirstBlockImage(page.blocks);
  const ogImageUrl = ogImagePath
    ? `${site.domain}${ogImagePath.startsWith("/") ? "" : "/"}${ogImagePath}`
    : undefined;

  return {
    title: {
      default: page.meta.title,
      template: `%s | ${site.name}`,
    },
    description: page.meta.description,
    openGraph: {
      type: "website",
      locale: locale === defaultLocale ? "en_US" : `${locale}_${locale.toUpperCase()}`,
      url: site.domain,
      siteName: site.name,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: page.meta.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    alternates: {
      canonical: `${site.domain}${localePath(locale)}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${site.domain}${localePath(l)}`])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [headerData, footerData] = await Promise.all([
    getHeader(locale as Locale),
    getFooter(locale as Locale),
  ]);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <StructuredData locale={locale} />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-[family-name:var(--font-body)] antialiased">
        <PageContextProvider>
          <Header data={headerData} locale={locale as Locale} />
          <main>{children}</main>
          <Footer data={footerData} locale={locale as Locale} />
        </PageContextProvider>
      </body>
    </html>
  );
}
