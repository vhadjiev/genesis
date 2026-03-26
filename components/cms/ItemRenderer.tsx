"use client";

import type { ContentItem, ItemLayout } from "@/lib/cms/types";
import { Content } from "./Content";
import type { CardVariant } from "./primitives";

export interface ItemRendererProps {
  item: ContentItem;
  layout: ItemLayout;
  theme?: string;
  index?: number;
  /** Override card variant (passed from layout components) */
  cardVariant?: CardVariant;
}

/**
 * Dispatches item rendering — all layouts go through the unified Content component.
 */
export function ItemRenderer({ item, layout, theme, index, cardVariant }: ItemRendererProps) {
  return (
    <Content
      item={item}
      layout={layout}
      theme={theme}
      index={index}
      cardVariant={cardVariant}
    />
  );
}
