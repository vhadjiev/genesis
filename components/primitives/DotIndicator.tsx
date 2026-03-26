"use client";

import { themeColors } from "@/lib/theme-colors";

export interface DotIndicatorProps {
  /** Total number of dots */
  count: number;
  /** Active dot index */
  active: number;
  /** Theme for colors */
  theme?: string;
  /** Callback when a dot is clicked */
  onSelect?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Dot indicator primitive.
 * Active dot stretches into a pill shape, inactive dots are small circles.
 * Matches the StickyScrollLayout progress indicator style.
 */
export function DotIndicator({
  count,
  active,
  theme,
  onSelect,
  className,
  style,
}: DotIndicatorProps) {
  const colors = themeColors(theme);
  const isDark = theme === "dark" || theme === "gradient";
  const activeColor = isDark ? "var(--neutral-white)" : "var(--brand-blue)";
  const inactiveColor = isDark ? "rgba(255,255,255,0.3)" : "var(--neutral-300)";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: "var(--sp-2xs)",
        alignItems: "center",
        ...style,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={onSelect ? () => onSelect(i) : undefined}
          aria-label={`Go to item ${i + 1}`}
          style={{
            width: i === active ? "2rem" : "0.5rem",
            height: "0.5rem",
            borderRadius: "var(--radius-pill)",
            backgroundColor: i === active ? activeColor : inactiveColor,
            border: "none",
            padding: 0,
            cursor: onSelect ? "pointer" : "default",
            transition: "width 0.4s ease, background-color 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}
