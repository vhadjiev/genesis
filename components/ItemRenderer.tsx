"use client";

import type { ContentItem, ItemLayout } from "@/lib/types";
import { Content } from "./Content";
import type { CardVariant } from "./primitives";

export interface ItemRendererProps {
  item: ContentItem;
  layout: ItemLayout;
  theme?: string;
  index?: number;
  /** Override card variant (passed from layout components) */
  cardVariant?: CardVariant;
  /** Heading level from sectionConfig (data-driven) */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Dispatches item rendering — all layouts go through the unified Content component.
 */
export function ItemRenderer({ item, layout, theme, index, cardVariant, headingLevel }: ItemRendererProps) {
  return (
    <Content
      item={item}
      layout={layout}
      theme={theme}
      index={index}
      cardVariant={cardVariant}
      headingLevel={headingLevel}
    />
  );
}
