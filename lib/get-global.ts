import type { Locale } from "@/i18n/settings";
import type { HeaderGlobal, FooterGlobal } from "./types";

/**
 * Fetches a CMS global by slug and locale.
 * Phase 1: reads from static JSON files.
 * Phase 2: will become fetch("/api/cms/globals/{slug}?locale={locale}").
 */
export async function getGlobal<T>(slug: string, locale: Locale): Promise<T> {
  const data = await import(`@/data/globals/${slug}.${locale}.json`);
  return data.default as T;
}

export async function getHeader(locale: Locale): Promise<HeaderGlobal> {
  return getGlobal<HeaderGlobal>("header", locale);
}

export async function getFooter(locale: Locale): Promise<FooterGlobal> {
  return getGlobal<FooterGlobal>("footer", locale);
}
