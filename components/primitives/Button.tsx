"use client";

import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";
import NextLink from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends Omit<HeroButtonProps, "render" | "size"> {
  /** When provided, renders as a Next.js Link for client-side navigation */
  href?: string;
  /** Sizes: sm, md, lg (HeroUI native) + xl (custom extension) */
  size?: ButtonSize;
}

// ─── Button ──────────────────────────────────────────────────────────────────

/**
 * Button primitive wrapping HeroUI Button.
 *
 * - With `href`: renders as a Next.js Link (client-side navigation, prefetch)
 * - Without `href`: renders as a native button with `onPress`
 * - Icons: pass as children before/after the label text (HeroUI pattern)
 * - Icon-only: use `isIconOnly` prop
 * - Variants: primary, secondary, tertiary, outline, ghost, danger
 * - Sizes: sm, md, lg (HeroUI native) + xl (custom CSS extension)
 */
export function Button({ href, size = "md", className, children, ...props }: ButtonProps) {
  // xl is a custom size — pass lg to HeroUI and add the button--xl CSS class
  const isXl = size === "xl";
  const heroSize = isXl ? "lg" : size;
  const mergedClassName = isXl
    ? className ? `button--xl ${className}` : "button--xl"
    : className;

  if (href) {
    return (
      <HeroButton
        render={(renderProps) => (
          <NextLink
            {...(renderProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            href={href}
          />
        )}
        size={heroSize}
        className={mergedClassName}
        {...props}
      >
        {children}
      </HeroButton>
    );
  }

  return (
    <HeroButton size={heroSize} className={mergedClassName} {...props}>
      {children}
    </HeroButton>
  );
}
