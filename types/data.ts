/**
 * Data structure type definitions
 */

import type { PageSEO, SiteSEO, TwitterCardData, OpenGraphData } from "./seo";

/** Generic localized content wrapper */
export type LocalizedContent<T> = {
  [locale: string]: T;
};

/** Contact information */
export interface ContactInfo {
  phone: string;
  email: string;
  address: LocalizedContent<string>;
  mapUrl: string;
  mapEmbed: string;
}

/** Navigation item (supports nested dropdown children) */
export interface NavigationItem {
  id: string;
  labelKey: string;
  children?: NavigationItem[];
}

/** Navigation configuration */
export interface Navigation {
  main: NavigationItem[];
}

/** Site configuration */
export interface SiteConfig {
  id: string;
  name: string;
  tagline: LocalizedContent<string>;
  defaultLocale: string;
  locales: string[];
  seo: SiteSEO;
  contact: ContactInfo;
}

/** Page manifest item (lightweight, in index.json) */
export interface PageManifestItem {
  id: string;
  slug: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
}

/** Index data structure (site config + page manifest) */
export interface IndexData {
  site: SiteConfig;
  navigation: Navigation;
  pages: PageManifestItem[];
}

/** Section base interface */
export interface Section {
  type: string;
  [key: string]: unknown;
}

/** Full page data (in pages/*.json) */
export interface PageData {
  id: string;
  slug: string;
  seo: LocalizedContent<PageSEO>;
  sections: Section[];
}

// Re-export SEO types for convenience
export type { PageSEO, SiteSEO, TwitterCardData, OpenGraphData };
