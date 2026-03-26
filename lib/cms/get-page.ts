import type { Locale } from "@/i18n/settings";
import type { CmsPage } from "./types";

/**
 * Fetches a CMS page by slug and locale.
 * Phase 1: reads from static JSON files.
 * Phase 2: will become an API call to the CMS.
 */
export async function getCmsPage(slug: string, locale: Locale): Promise<CmsPage> {
  // For now, all pages map to the home.json file
  const content = await import(`@/data/locales/${locale}/home.json`);
  return content.default as CmsPage;
}
