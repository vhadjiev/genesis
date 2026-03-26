import type { ContentItem, ItemLayout, SectionConfig } from "@/lib/cms/types";

export interface LayoutProps {
  items: ContentItem[];
  itemLayout: ItemLayout;
  theme: string;
  animation: string;
  blockId: string;
  sectionConfig: SectionConfig;
}
