"use client";

import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";
import NextLink from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ButtonProps extends Omit<HeroButtonProps, "render"> {
  /** When provided, renders as a Next.js Link for client-side navigation */
  href?: string;
}

// ─── Button ──────────────────────────────────────────────────────────────────

/**
 * Button primitive wrapping HeroUI Button.
 *
 * - With `href`: renders as a Next.js Link (client-side navigation, prefetch)
 * - Without `href`: renders as a native button with `onPress`
 * - Icons: pass as children before/after the label text (HeroUI pattern)
 * - Icon-only: use `isIconOnly` prop
 * - All HeroUI variants: primary, secondary, tertiary, outline, ghost, danger
 * - All HeroUI sizes: sm, md, lg
 *
 * @example
 * // Link button with trailing icon
 * <Button href="/contact" variant="primary">
 *   Get in Touch
 *   <Icon name="lucide:arrow-right" size={16} />
 * </Button>
 *
 * @example
 * // Callback button
 * <Button variant="ghost" onPress={() => console.log("clicked")}>
 *   Cancel
 * </Button>
 *
 * @example
 * // Icon-only button
 * <Button isIconOnly variant="secondary" onPress={handleClick}>
 *   <ChevronLeft />
 * </Button>
 */
export function Button({ href, children, ...props }: ButtonProps) {
  if (href) {
    return (
      <HeroButton
        render={(renderProps) => (
          <NextLink
            {...(renderProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            href={href}
          />
        )}
        {...props}
      >
        {children}
      </HeroButton>
    );
  }

  return (
    <HeroButton {...props}>
      {children}
    </HeroButton>
  );
}
