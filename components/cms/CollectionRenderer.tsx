"use client";

import dynamic from "next/dynamic";
import type {
  CollectionConfig,
  ContentItem,
  ItemLayout,
  SectionConfig,
} from "@/lib/cms/types";

// Dynamic imports for code splitting — only load the layouts used on the page
const GridLayout = dynamic(() => import("./layouts/GridLayout"));
const BentoLayout = dynamic(() => import("./layouts/BentoLayout"));
const CarouselLayout = dynamic(() => import("./layouts/CarouselLayout"));
const AccordionHorizontalLayout = dynamic(
  () => import("./layouts/AccordionHorizontalLayout")
);
const AccordionVerticalLayout = dynamic(
  () => import("./layouts/AccordionVerticalLayout")
);
const TabsLayout = dynamic(() => import("./layouts/TabsLayout"));
const StickyScrollLayout = dynamic(() => import("./layouts/StickyScrollLayout"));
const MarqueeLayout = dynamic(() => import("./layouts/MarqueeLayout"));
const SingleLayout = dynamic(() => import("./layouts/SingleLayout"));
const StackLayout = dynamic(() => import("./layouts/StackLayout"));

export interface CollectionRendererProps {
  blockId: string;
  collection: CollectionConfig;
  itemLayout: ItemLayout;
  items: ContentItem[];
  theme: string;
  animation: string;
  sectionConfig: SectionConfig;
}

export function CollectionRenderer({
  blockId,
  collection,
  itemLayout,
  items,
  theme,
  animation,
  sectionConfig,
}: CollectionRendererProps) {
  const commonProps = { items, itemLayout, theme, animation, blockId, sectionConfig };

  switch (collection.layout) {
    case "grid":
      return <GridLayout {...commonProps} columns={collection.columns} />;
    case "bento":
      return <BentoLayout {...commonProps} />;
    case "carousel":
      return <CarouselLayout {...commonProps} />;
    case "accordion":
      if (collection.orientation === "horizontal") {
        return <AccordionHorizontalLayout {...commonProps} />;
      }
      return <AccordionVerticalLayout {...commonProps} />;
    case "tabs":
      return (
        <TabsLayout
          {...commonProps}
          orientation={collection.orientation}
        />
      );
    case "sticky-scroll":
      return <StickyScrollLayout {...commonProps} />;
    case "marquee":
      return (
        <MarqueeLayout
          {...commonProps}
          direction={collection.direction}
          speed={collection.speed}
        />
      );
    case "single":
      return <SingleLayout {...commonProps} />;
    case "stack":
      return <StackLayout {...commonProps} />;
    default:
      return null;
  }
}
