/**
 * SEO-related type definitions
 */

/** Open Graph image data */
export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

/** Open Graph configuration */
export interface OpenGraphData {
  title?: string;
  description?: string;
  images?: OpenGraphImage[];
  type?: string;
  siteName?: string;
}

/** Twitter card configuration */
export interface TwitterCardData {
  card: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
}

/** Site-level SEO configuration */
export interface SiteSEO {
  titleTemplate: string;
  siteUrl: string;
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
}

/** Page-level SEO configuration (localized) */
export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: OpenGraphData;
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
}
