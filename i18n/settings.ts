import siteConfig from "@/data/site.json";

// ─── Source of truth: site.json ─────────────────────────────────────────────
// The i18n module re-exports locale config for synchronous access everywhere
// (middleware, client components, utilities). No async needed.

export const defaultLocale = siteConfig.defaultLocale;
export const locales = siteConfig.locales as readonly string[];
export type Locale = string;

export function isValidLocale(value: string): boolean {
  return locales.includes(value);
}

export function getDirection(_locale: Locale) {
  return 'ltr';
}

/**
 * Build a path for a given locale.
 * Default locale has no prefix: localePath("en", "/about") → "/about"
 * Other locales get prefixed: localePath("bg", "/about") → "/bg/about"
 */
export function localePath(locale: string, path: string = "/"): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

/**
 * Extract the locale from a pathname and return both.
 * "/bg/about" → { locale: "bg", pathWithoutLocale: "/about" }
 * "/about"    → { locale: "en", pathWithoutLocale: "/about" }
 */
export function parseLocalePath(pathname: string): { locale: Locale; pathWithoutLocale: string } {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      const pathWithoutLocale = pathname.slice(`/${locale}`.length) || "/";
      return { locale, pathWithoutLocale };
    }
  }
  return { locale: defaultLocale, pathWithoutLocale: pathname };
}
