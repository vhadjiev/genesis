"use client";

import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

export default function StackLayout({ items, itemLayout, theme }: LayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xl)" }}>
      {items.map((item, i) => (
        <ItemRenderer key={item.id || i} item={item} layout={itemLayout} theme={theme} index={i} />
      ))}
    </div>
  );
}
