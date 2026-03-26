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

export default function MarqueeLayout({
  items,
  itemLayout,
  direction = "ltr",
  speed = 40,
}: MarqueeLayoutProps) {
  const isTagMode = itemLayout === "text-only";

  // Duplicate more for tags to fill wider viewport
  const dupeCount = isTagMode ? 4 : 2;
  const allItems = Array.from({ length: dupeCount }, () => items).flat();

  const animationName = isTagMode
    ? direction === "rtl"
      ? "scroll-tags-rtl"
      : "scroll-tags-ltr"
    : "scroll-logos";

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: isTagMode ? "var(--sp-s)" : "var(--sp-l)",
          width: "max-content",
          animation: `${animationName} ${speed}s linear infinite`,
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
