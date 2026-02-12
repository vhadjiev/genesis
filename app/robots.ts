/**
 * Dynamic robots.txt Generation
 * Configurable crawl rules with sitemap reference
 */

import { getIndex } from "@/utils/data";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const index = await getIndex();
  const { siteUrl } = index.site.seo;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
