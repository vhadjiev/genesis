import type { MetadataRoute } from "next";
import { locales, localePath } from "@/i18n/settings";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gentech.bg";
  const now = new Date();

  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}${localePath(locale, page.path)}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
}
