/**
 * Dynamic Sitemap Generation
 * Auto-generates sitemap from page manifest with hreflang support
 */

import { getIndex } from "@/utils/data";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await getIndex();
  const { siteUrl } = index.site.seo;
  const { defaultLocale } = index.site;
  const entries: MetadataRoute.Sitemap = [];

  // Helper to build locale-aware URLs (no prefix for default locale)
  const buildUrl = (locale: string, pagePath: string) => {
    const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
    return `${siteUrl}${localePrefix}${pagePath}`;
  };

  for (const page of index.pages) {
    for (const locale of index.site.locales) {
      const pagePath = page.slug ? `/${page.slug}` : "";

      entries.push({
        url: buildUrl(locale, pagePath),
        lastModified: new Date(),
        changeFrequency: page.slug === "" ? "weekly" : "monthly",
        priority: page.slug === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries([
            ...index.site.locales.map((l) => [l, buildUrl(l, pagePath)]),
            ["x-default", buildUrl(defaultLocale, pagePath)],
          ]),
        },
      });
    }
  }

  return entries;
}
