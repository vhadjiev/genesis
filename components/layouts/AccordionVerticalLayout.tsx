"use client";

import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

export default function AccordionVerticalLayout({ items, itemLayout, theme }: LayoutProps) {
  // TODO: Implement with HeroUI DisclosureGroup when needed for FAQ sections
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-s)" }}>
      {items.map((item, i) => (
        <ItemRenderer key={item.id || i} item={item} layout={itemLayout} theme={theme} index={i} />
      ))}
    </div>
  );
}
