"use client";

import { Chip } from "@heroui/react";

interface BadgeProps {
  text: string;
  /** Visual variant */
  variant?: "metric" | "label" | "tag";
  /** Color for tag variant */
  color?: "blue" | "green" | "gradient" | "coral" | "default";
  className?: string;
  style?: React.CSSProperties;
}

const tagColors: Record<string, React.CSSProperties> = {
  blue: { background: "var(--brand-blue-95)", color: "var(--brand-midnight)" },
  green: { background: "var(--mint)", color: "var(--brand-midnight)" },
  gradient: {
    background: "linear-gradient(135deg, var(--brand-blue-95), var(--mint))",
    color: "var(--brand-midnight)",
  },
  coral: { background: "var(--brand-coral)", color: "var(--neutral-white)" },
  default: { background: "var(--brand-blue-95)", color: "var(--brand-midnight)" },
};

/**
 * Badge/Pill atom. Three modes:
 * - metric: frosted pill for testimonial metrics (dark bg)
 * - label: small eyebrow-style label
 * - tag: colored pill for marquee tags
 */
export function Badge({
  text,
  variant = "metric",
  color = "default",
  className,
  style: styleProp,
}: BadgeProps) {
  if (variant === "tag") {
    const colors = tagColors[color] || tagColors.default;
    return (
      <Chip
        className={className}
        style={{
          ...colors,
          fontSize: "var(--text-s)",
          fontWeight: 500,
          ...styleProp,
        }}
      >
        {text}
      </Chip>
    );
  }

  if (variant === "metric") {
    return (
      <Chip
        variant="secondary"
        className={className}
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "var(--brand-blue-85)",
          fontSize: "var(--text-s)",
          fontWeight: 600,
          ...styleProp,
        }}
      >
        {text}
      </Chip>
    );
  }

  // label variant
  return (
    <Chip
      variant="tertiary"
      className={className}
      style={{
        fontSize: "var(--text-s)",
        fontWeight: 500,
        ...styleProp,
      }}
    >
      {text}
    </Chip>
  );
}
