"use client";

import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

export default function SingleLayout({ items, itemLayout, theme, blockId, sectionConfig }: LayoutProps) {
  if (!items.length) return null;
  return (
    <ItemRenderer
      item={items[0]}
      layout={itemLayout}
      theme={theme}
      index={0}
      headingLevel={sectionConfig.headingLevel}
      headingId={sectionConfig.sectionId ? `${blockId}-heading` : undefined}
    />
  );
}
