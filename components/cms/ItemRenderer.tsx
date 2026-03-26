"use client";

import type { ContentItem, ItemLayout } from "@/lib/cms/types";
import { ContentCard } from "./items/ContentCard";

export interface ItemRendererProps {
  item: ContentItem;
  layout: ItemLayout;
  theme?: string;
  index?: number;
}

/**
 * Dispatches item rendering — all layouts go through the unified ContentCard.
 */
export function ItemRenderer({ item, layout, theme, index }: ItemRendererProps) {
  return <ContentCard item={item} layout={layout} theme={theme} index={index} />;
}
