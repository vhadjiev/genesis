import type { Locale } from "@/i18n/settings";
import type { HeaderGlobal, FooterGlobal } from "./types";
import { resolveLogo } from "./resolve-logo";

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
  const data = await getGlobal<HeaderGlobal>("header", locale);
  data.resolvedLogo = await resolveLogo(data.logo);
  return data;
}

export async function getFooter(locale: Locale): Promise<FooterGlobal> {
  const data = await getGlobal<FooterGlobal>("footer", locale);
  data.resolvedLogo = await resolveLogo(data.logo);
  return data;
}
