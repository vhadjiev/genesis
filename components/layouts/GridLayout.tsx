"use client";

import { useInView } from "@/hooks/useInView";
import { frost } from "@/lib/frost";
import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

interface GridLayoutProps extends LayoutProps {
  columns?: number;
}

/**
 * CSS Grid layout with configurable columns.
 * Entrance animation controlled by `animation` prop — off by default.
 */
export default function GridLayout({
  items,
  itemLayout,
  theme,
  animation,
  columns = 2,
}: GridLayoutProps) {
  const shouldAnimate = animation === "stagger";
  const { ref, isVisible } = useInView(shouldAnimate ? 0.1 : 1);
  const isDark = theme === "dark" || theme === "gradient";
  const show = shouldAnimate ? isVisible : true;

  return (
    <div
      ref={shouldAnimate ? ref as React.RefObject<HTMLDivElement> : undefined}
      style={{
        display: "grid",
        gridTemplateColumns: columns > 2
          ? `repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`
          : `repeat(${columns}, 1fr)`,
        gap: "var(--grid-gap)",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id || i}
          style={{
            ...(isDark ? frost : {}),
            padding: isDark ? "var(--sp-xl)" : undefined,
            ...(shouldAnimate
              ? {
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s`,
                }
              : {}),
          }}
        >
          <ItemRenderer item={item} layout={itemLayout} theme={theme} index={i} />
        </div>
      ))}
    </div>
  );
}
