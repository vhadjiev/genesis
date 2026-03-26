import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, localePath, type Locale } from "@/i18n/settings";
import { plusJakarta, inter, jetbrainsMono } from "@/lib/fonts";
import { getSiteConfig } from "@/lib/get-content";
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
  const site = await getSiteConfig();
  const isEn = locale === "en";

  return {
    title: {
      default: isEn
        ? "Genesis Technology — Professional Beverage Systems"
        : "Genesis Technology — Професионални напиткови системи",
      template: `%s | ${site.name}`,
    },
    description: isEn
      ? "European-engineered professional beverage systems for hotels, offices, and restaurant chains. Vertically integrated manufacturing, software, and service."
      : "Европейски професионални напиткови системи за хотели, офиси и ресторантски вериги. Вертикално интегрирано производство, софтуер и сервиз.",
    openGraph: {
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_US",
      url: site.domain,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
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

  if (!locales.includes(locale as Locale)) {
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
