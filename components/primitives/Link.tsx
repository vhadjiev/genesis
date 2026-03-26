"use client";

import { Link as HeroLink } from "@heroui/react";
import NextLink from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LinkProps {
  href: string;
  /** Show the arrow icon */
  showIcon?: boolean;
  /** Show underline (default: false) */
  underline?: boolean;
  /** Open in new tab */
  external?: boolean;
  isDisabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// ─── Link ────────────────────────────────────────────────────────────────────

/**
 * Link primitive wrapping HeroUI Link with Next.js client-side navigation.
 *
 * - Internal links use Next.js Link for prefetching + client nav
 * - External links (`external` prop) open in new tab with proper rel attributes
 * - Optional arrow icon via `showIcon`
 */
export function Link({
  href,
  showIcon = false,
  underline = false,
  external = false,
  isDisabled,
  className: classNameProp,
  style,
  children,
}: LinkProps) {
  const className = underline
    ? classNameProp
    : classNameProp
      ? `no-underline ${classNameProp}`
      : "no-underline";

  if (external) {
    return (
      <HeroLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        isDisabled={isDisabled}
        className={className}
        style={style}
      >
        {children}
        {showIcon && <HeroLink.Icon />}
      </HeroLink>
    );
  }

  return (
    <HeroLink
      render={(props) => (
        <NextLink
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          href={href}
        />
      )}
      isDisabled={isDisabled}
      className={className}
      style={style}
    >
      {children}
      {showIcon && <HeroLink.Icon />}
    </HeroLink>
  );
}
