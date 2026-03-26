import type { SiteConfig } from "./types";

export async function getSiteConfig(): Promise<SiteConfig> {
  const config = await import("@/data/site.json");
  return config.default as SiteConfig;
}
