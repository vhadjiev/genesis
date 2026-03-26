"use client";

import { useInView } from "@/hooks/useInView";
import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

/**
 * Bento grid layout — 12-column grid with variable-span cards.
 * All visual config comes from ContentItem fields:
 * - colSpan: grid column span (default alternates 7/5)
 * - color: background color
 * - bgImage: background image (rendered with gradient overlay for readability)
 */
export default function BentoLayout({ items, itemLayout, theme }: LayoutProps) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="stats-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "var(--grid-gap)",
      }}
    >
      {items.map((item, i) => {
        const hasBgImage = !!item.bgImage?.src;

        return (
          <div
            key={item.id || i}
            className="stats-card"
            style={{
              gridColumn: `span ${item.colSpan || (i % 2 === 0 ? 7 : 5)}`,
              backgroundColor: item.color || "rgba(255,255,255,0.08)",
              color: "var(--neutral-white)",
              ...(hasBgImage
                ? {
                    backgroundImage: `linear-gradient(270deg, transparent, rgba(0,0,0,0.3) 60%), url(${item.bgImage!.src})`,
                    backgroundPosition: "0 0, 100% center",
                    backgroundRepeat: "repeat, no-repeat",
                    backgroundSize: "auto, cover",
                  }
                : {}),
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
            }}
          >
            <ItemRenderer item={item} layout={itemLayout} theme={theme} index={i} />
          </div>
        );
      })}
    </div>
  );
}
