import type { CmsPage, SectionBlock } from "@/lib/cms/types";
import { isCompositeBlock, isSectionBlock } from "@/lib/cms/types";
import { PRESETS } from "@/lib/cms/presets";
import { BlockRenderer, Section } from "./Section";
import { SectionRefRegistrar } from "./SectionRefRegistrar";
import { Fragment } from "react";

/**
 * Renders a CMS page from its block array.
 * All blocks go through the generic pipeline — no switch cases.
 * mergeNextPreset is handled generically.
 * Registers the first section with PageContext for header scroll tracking.
 */
export function PageRenderer({ page }: { page: CmsPage }) {
  const skipIndices = new Set<number>();
  // Find the sectionId of the first rendered block for header registration
  const firstBlock = page.blocks[0];
  const firstSectionId = firstBlock && isSectionBlock(firstBlock)
    ? firstBlock.sectionConfig?.sectionId
    : firstBlock?.sectionConfig?.sectionId;

  return (
    <>
      <SectionRefRegistrar sectionId={firstSectionId} />
      {page.blocks.map((block, i) => {
        if (skipIndices.has(i)) return null;

        if (isSectionBlock(block)) {
          const preset = PRESETS[block.preset];

          let mergedBlock: SectionBlock | undefined;
          if (preset?.capabilities?.mergeNextPreset) {
            const nextBlock = page.blocks[i + 1];
            if (
              nextBlock &&
              isSectionBlock(nextBlock) &&
              nextBlock.preset === preset.capabilities.mergeNextPreset
            ) {
              mergedBlock = nextBlock;
              skipIndices.add(i + 1);
            }
          }

          return (
            <Section
              key={block.id}
              block={block}
              mergedBlock={mergedBlock}
            />
          );
        }

        return <BlockRenderer key={block.id} block={block} />;
      })}
    </>
  );
}
