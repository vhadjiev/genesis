export async function getSiteConfig() {
  const config = await import("@/data/site.json");
  return config.default;
}
