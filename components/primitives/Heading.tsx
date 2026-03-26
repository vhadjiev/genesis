"use client";

import { parseHeadline } from "@/lib/parse-headline";
import { themeColors } from "@/lib/theme-colors";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Maps heading level to the design system's CSS class.
 * Supports a "jumbo" variant for display-size headings.
 */
type HeadingSize = "jumbo" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const sizeClassMap: Record<HeadingSize, string> = {
  jumbo: "jumbo-h",
  h1: "heading-h1",
  h2: "heading-h2",
  h3: "heading-h3",
  h4: "heading-h4",
  h5: "heading-h5",
  h6: "heading-h6",
};

export interface HeadingProps {
  children: string;
  /** Semantic heading level (h1-h6) */
  level?: HeadingLevel;
  /** Visual size (can differ from level for a11y vs visual hierarchy) */
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
 * - Design system size classes (jumbo, h1-h6)
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
  const sizeClass = size ? sizeClassMap[size] : sizeClassMap[`h${level}`];
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
