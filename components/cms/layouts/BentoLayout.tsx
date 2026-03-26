"use client";

import { useInView } from "@/hooks/useInView";
import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

const cardConfigs = [
  {
    backgroundImage: "linear-gradient(270deg, transparent, rgba(0,0,0,0.3) 70%), url(/images/stats-dots-map.svg)",
    backgroundPosition: "0 0, 100% center",
    backgroundRepeat: "repeat, no-repeat",
    backgroundSize: "auto, cover",
    bg: "rgba(255,255,255,0.06)",
  },
  {
    bg: "rgba(255,255,255,0.08)",
  },
  {
    bg: "rgba(177,239,213,0.1)",
  },
  {
    backgroundImage: "linear-gradient(270deg, transparent, rgba(0,0,0,0.3) 52%), url(/images/stats-chart.svg)",
    backgroundPosition: "0 0, 100% center",
    backgroundRepeat: "repeat, no-repeat",
    backgroundSize: "auto, contain",
    bg: "rgba(255,255,255,0.06)",
  },
];

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
        const cfg = cardConfigs[i % cardConfigs.length];
        return (
          <div
            key={item.id || i}
            className="stats-card"
            style={{
              gridColumn: `span ${item.colSpan || (i % 2 === 0 ? 7 : 5)}`,
              backgroundColor: cfg.bg,
              color: "var(--neutral-white)",
              backgroundImage: cfg.backgroundImage,
              backgroundPosition: cfg.backgroundPosition,
              backgroundRepeat: cfg.backgroundRepeat,
              backgroundSize: cfg.backgroundSize,
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
