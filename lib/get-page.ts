import type { Locale } from "@/i18n/settings";
import type { CmsPage, PageBlock } from "./types";
import { isSectionBlock, isCompositeBlock } from "./types";

/**
 * Fetches a CMS page by slug and locale.
 * Phase 1: reads from static JSON files.
 * Phase 2: will become an API call to the CMS.
 */
export async function getCmsPage(slug: string, locale: Locale): Promise<CmsPage> {
  // For now, all pages map to the home.json file
  const content = await import(`@/data/locales/${locale}/home.json`);
  return content.default as CmsPage;
}

/**
 * Finds the first image from page blocks, scanning top-down.
 * Checks: item.image, item.bgImage, sectionConfig.bgImage, stickyBgSrc.
 * Returns the image path or undefined.
 */
export function findFirstBlockImage(blocks: PageBlock[]): string | undefined {
  for (const block of blocks) {
    if (isCompositeBlock(block)) {
      // Check composite stickyBg
      if (block.sectionConfig?.stickyBgSrc) return block.sectionConfig.stickyBgSrc;
      // Check sub-blocks
      const found = findFirstBlockImage(block.blocks);
      if (found) return found;
      continue;
    }

    if (isSectionBlock(block)) {
      // Check section bgImage
      if (block.sectionConfig?.bgImage) return block.sectionConfig.bgImage;
      // Check items
      for (const item of block.items) {
        if (item.bgImage?.src) return item.bgImage.src;
        if (item.image?.src) return item.image.src;
      }
    }
  }
  return undefined;
}
