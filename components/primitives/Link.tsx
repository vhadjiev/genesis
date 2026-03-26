"use client";

import NextLink from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LinkProps {
  href: string;
  /** Show underline (default: false) */
  underline?: boolean;
  /** Open in new tab */
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// ─── Link ────────────────────────────────────────────────────────────────────

/**
 * Link primitive using Next.js Link directly.
 *
 * - Internal links: NextLink for client-side navigation + prefetch
 * - External links: native <a> with target="_blank" and rel attributes
 * - No HeroUI render prop — avoids DOM element mismatch warnings
 */
export function Link({
  href,
  underline = false,
  external = false,
  className: classNameProp,
  style,
  children,
}: LinkProps) {
  const baseStyle: React.CSSProperties = {
    textDecoration: underline ? undefined : "none",
    color: "inherit",
    ...style,
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNameProp}
        style={baseStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={classNameProp}
      style={baseStyle}
    >
      {children}
    </NextLink>
  );
}
