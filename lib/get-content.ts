import type { Locale } from "@/i18n/settings";

export async function getContent(locale: Locale) {
  const content = await import(`@/data/locales/${locale}/common.json`);
  return content.default;
}

export async function getSiteConfig() {
  const config = await import("@/data/site.json");
  return config.default;
}

export async function getNavigation() {
  const nav = await import("@/data/navigation.json");
  return nav.default;
}
