export const defaultLocale = 'en';
export const locales = ['en', 'bg'] as const;
export type Locale = (typeof locales)[number];

export function getDirection(locale: Locale) {
  return 'ltr';
}
