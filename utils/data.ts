/**
 * Data fetching utilities with React.cache() for per-request deduplication
 * Vercel best practice 3.4: Per-Request Deduplication with React.cache()
 */

import { cache } from "react";
import type {
  IndexData,
  PageData,
  SiteConfig,
  PageManifestItem,
  LocalizedContent,
} from "@/types";

// Import static data (will be replaced with API calls in future CMS)
import indexData from "@/data/index.json";

/**
 * Cached index fetch - deduplicated within single request
 * Multiple calls to getIndex() within the same request will only execute once
 */
export const getIndex = cache(async (): Promise<IndexData> => {
  // Future CMS integration:
  // return fetch(`${process.env.CMS_URL}/api/index`, {
  //   next: { revalidate: 60 }
  // }).then(r => r.json())
  return indexData as IndexData;
});

/**
 * Cached page fetch - deduplicated within single request
 * @param pageId - The page ID to fetch (e.g., "home", "gallery")
 */
export const getPageData = cache(
  async (pageId: string): Promise<PageData> => {
    // Future CMS integration:
    // return fetch(`${process.env.CMS_URL}/api/pages/${pageId}`, {
    //   next: { revalidate: 60 }
    // }).then(r => r.json())
    const page = await import(`@/data/pages/${pageId}.json`);
    return page.default as PageData;
  }
);

/**
 * Parallel fetch helper - eliminates waterfall
 * Vercel best practice 1.4: Promise.all() for Independent Operations
 * @param pageId - The page ID to fetch
 */
export async function getPageWithIndex(pageId: string) {
  const [index, page] = await Promise.all([getIndex(), getPageData(pageId)]);
  return { index, page };
}

/**
 * Get site configuration from index
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const index = await getIndex();
  return index.site;
}

/**
 * Get page manifest (list of all pages) from index
 */
export async function getPageManifest(): Promise<PageManifestItem[]> {
  const index = await getIndex();
  return index.pages;
}

/**
 * Find page by slug from the manifest
 * @param slug - The page slug (empty string for home page)
 */
export async function getPageBySlug(
  slug: string
): Promise<PageManifestItem | undefined> {
  const index = await getIndex();
  return index.pages.find((p) => p.slug === slug);
}

/**
 * Get localized content helper
 * Falls back to English if the requested locale is not available
 * @param content - The localized content object
 * @param locale - The locale to get (e.g., "en", "bg")
 */
export function getLocalizedContent<T>(
  content: LocalizedContent<T>,
  locale: string
): T {
  return content[locale] || content["en"];
}

/**
 * Get all page IDs for static generation
 */
export async function getAllPageIds(): Promise<string[]> {
  const index = await getIndex();
  return index.pages.map((p) => p.id);
}

/**
 * Generate static params for all pages and locales
 * Used by generateStaticParams in dynamic page route
 */
export async function generateAllStaticParams() {
  const index = await getIndex();
  const params: { locale: string; slug: string[] }[] = [];

  for (const locale of index.site.locales) {
    for (const page of index.pages) {
      params.push({
        locale,
        slug: page.slug ? page.slug.split("/") : [],
      });
    }
  }

  return params;
}
