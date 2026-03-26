"use client";

import { frost } from "@/lib/frost";
import type { LayoutProps } from "./LayoutProps";

interface MarqueeLayoutProps extends LayoutProps {
  direction?: "ltr" | "rtl";
  speed?: number;
}

type TagVariant = "blue" | "green" | "gradient";

function tagStyle(variant: TagVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.5rem 1.25rem",
    borderRadius: "var(--radius-pill)",
    fontSize: "var(--text-s)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    flexShrink: 0,
    color: "var(--brand-midnight)",
  };
  switch (variant) {
    case "blue":
      return { ...base, background: "var(--brand-blue-95)" };
    case "green":
      return { ...base, background: "var(--mint)" };
    case "gradient":
      return { ...base, background: "linear-gradient(135deg, var(--brand-blue-95), var(--mint))" };
    default:
      return { ...base, background: "var(--brand-blue-95)" };
  }
}

/**
 * Seamless infinite marquee.
 *
 * Uses the same proven approach as the original hero:
 * - Duplicate the items array so the total list is 2x
 * - All items sit in a single flex row
 * - CSS keyframe scrolls translateX from 0 to -50%
 * - Since the second half is identical to the first, the loop is seamless
 * - No JS measurement, no will-change, no compositing conflicts
 * - backdrop-filter works because no parent creates a compositing layer
 */
export default function MarqueeLayout({
  items,
  itemLayout,
  direction = "ltr",
  speed = 40,
}: MarqueeLayoutProps) {
  const isTagMode = itemLayout === "text-only";
  const gap = isTagMode ? "var(--sp-s)" : "var(--sp-l)";

  // Triple items — first two sets are the scroll distance, third ensures
  // the viewport is always filled. Animation scrolls -33.33% (one set width).
  const allItems = [...items, ...items, ...items];

  const animationName = isTagMode
    ? direction === "rtl" ? "scroll-tags-rtl" : "scroll-tags-ltr"
    : "scroll-logos";

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        className="logo-scroll"
        style={{
          display: "flex",
          gap,
          width: "max-content",
          animationName,
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: direction === "rtl" ? "reverse" : "normal",
        }}
      >
        {allItems.map((item, i) =>
          isTagMode ? (
            <span
              key={`${item.label}-${i}`}
              style={tagStyle((item.color as TagVariant) || "blue")}
            >
              {item.label}
            </span>
          ) : (
            <div
              key={`${item.label}-${i}`}
              style={{
                ...frost,
                width: "18.75rem",
                height: "6.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                borderRadius: "0.75rem",
              }}
            >
              <span
                style={{
                  color: "var(--neutral-white)",
                  fontWeight: 500,
                  fontSize: "var(--text-s)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                {item.label}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
