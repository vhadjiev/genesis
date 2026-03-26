"use client";

import { useInView } from "@/hooks/useInView";
import { frost } from "@/lib/frost";
import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

interface GridLayoutProps extends LayoutProps {
  columns?: number;
}

export default function GridLayout({
  items,
  itemLayout,
  theme,
  animation,
  columns = 2,
}: GridLayoutProps) {
  const { ref, isVisible } = useInView(0.1);
  const isDark = theme === "dark" || theme === "gradient";

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "var(--grid-gap)",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id || i}
          style={{
            ...(isDark ? frost : {}),
            padding: isDark ? "var(--sp-xl)" : undefined,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s`,
          }}
        >
          <ItemRenderer item={item} layout={itemLayout} theme={theme} index={i} />
        </div>
      ))}
    </div>
  );
}
