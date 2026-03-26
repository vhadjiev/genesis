export const defaultLocale = 'en';
export const locales = ['en', 'bg'] as const;
export type Locale = (typeof locales)[number];

export function getDirection(locale: Locale) {
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
