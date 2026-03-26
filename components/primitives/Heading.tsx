"use client";

import { parseHeadline } from "@/lib/parse-headline";
import { themeColors } from "@/lib/theme-colors";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * T-shirt size scale for visual heading size.
 * Maps to CSS classes: .heading-xs through .heading-3xl
 *
 * | Size | Font size       | Use case                     |
 * |------|-----------------|------------------------------|
 * | 3xl  | var(--jumbo-2)  | Hero headlines, display text  |
 * | 2xl  | var(--h1)       | Page titles                  |
 * | xl   | var(--h2)       | Section headlines             |
 * | lg   | var(--h3)       | Sub-section titles            |
 * | md   | var(--h4)       | Card titles, quote text       |
 * | sm   | var(--h5)       | Item titles, small headings   |
 * | xs   | var(--h6)       | Labels, compact card titles   |
 */
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const sizeClassMap: Record<HeadingSize, string> = {
  "3xl": "heading-3xl",
  "2xl": "heading-2xl",
  xl: "heading-xl",
  lg: "heading-lg",
  md: "heading-md",
  sm: "heading-sm",
  xs: "heading-xs",
};

/** Default visual size for each semantic level */
const levelDefaults: Record<HeadingLevel, HeadingSize> = {
  1: "2xl",
  2: "2xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "xs",
};

export interface HeadingProps {
  children: string;
  /** Semantic heading level (h1-h6) */
  level?: HeadingLevel;
  /** Visual size override — defaults based on level */
  size?: HeadingSize;
  /** Substring to highlight with gradient (alternative to *asterisk* syntax) */
  gradient?: string;
  /** Theme for color */
  theme?: string;
  /** ID for aria-labelledby */
  id?: string;
  /** Max width constraint */
  maxWidth?: string;
  /** Extra class name */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

/**
 * Heading atom. Supports:
 * - Semantic level (h1-h6) independent of visual size
 * - T-shirt sizes (xs-3xl) with level-based defaults
 * - Built-in margin-bottom per size (via CSS classes)
 * - Gradient text via *asterisk* syntax in children or gradient prop
 * - Theme-aware colors
 * - Line break support (\n in text)
 */
export function Heading({
  children,
  level = 2,
  size,
  gradient,
  theme,
  id,
  maxWidth,
  className: classNameProp,
  style: styleProp,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolvedSize = size || levelDefaults[level];
  const sizeClass = sizeClassMap[resolvedSize];
  const colors = themeColors(theme);

  const className = classNameProp
    ? `${sizeClass} ${classNameProp}`
    : sizeClass;

  return (
    <Tag
      id={id}
      className={className}
      style={{
        color: colors.text,
        maxWidth,
        ...styleProp,
      }}
    >
      {parseHeadline(children, gradient)}
    </Tag>
  );
}
