"use client";

import { themeColors } from "@/lib/theme-colors";

type TextSize = "xs" | "s" | "m" | "l";
type TextVariant = "body" | "label" | "muted";

const sizeClassMap: Record<TextSize, string> = {
  xs: "text-xs",
  s: "text-s",
  m: "text-m",
  l: "text-l",
};

export interface TextProps {
  children: React.ReactNode;
  /** Text size */
  size?: TextSize;
  /** Semantic variant — controls color */
  variant?: TextVariant;
  /** Theme for color derivation */
  theme?: string;
  /** Render as a different element (default: p) */
  as?: "p" | "span" | "li" | "div";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Text primitive. Maps size to CSS class and variant to theme color.
 *
 * - body: primary text color
 * - muted: secondary/muted color (default)
 * - label: eyebrow/label color, uppercase, small
 */
export function Text({
  children,
  size = "m",
  variant = "muted",
  theme,
  as: Tag = "p",
  className: classNameProp,
  style: styleProp,
}: TextProps) {
  const colors = themeColors(theme);

  const colorMap: Record<TextVariant, string> = {
    body: colors.text,
    muted: colors.muted,
    label: colors.label,
  };

  const sizeClass = variant === "label" ? "label-s" : sizeClassMap[size];
  const className = classNameProp ? `${sizeClass} ${classNameProp}` : sizeClass;

  return (
    <Tag className={className} style={{ color: colorMap[variant], ...styleProp }}>
      {children}
    </Tag>
  );
}
