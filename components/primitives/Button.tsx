"use client";

import {
  Button as HeroButton,
  buttonVariants,
  type ButtonProps as HeroButtonProps,
} from "@heroui/react";
import NextLink from "next/link";
import type { VariantProps } from "tailwind-variants";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonSize = "sm" | "md" | "lg" | "xl";

type HeroVariant = VariantProps<typeof buttonVariants>["variant"];
type HeroSize = VariantProps<typeof buttonVariants>["size"];

export interface ButtonProps extends Omit<HeroButtonProps, "render" | "size"> {
  /** When provided, renders as a styled NextLink (<a>) instead of <button> */
  href?: string;
  /** Sizes: sm, md, lg (HeroUI native) + xl (custom extension) */
  size?: ButtonSize;
}

// ─── Button ──────────────────────────────────────────────────────────────────

/**
 * Button primitive.
 *
 * - With `href`: renders as NextLink styled with buttonVariants (proper <a>)
 * - Without `href`: renders as HeroUI Button (proper <button>)
 * - No render prop, no nested interactive elements
 *
 * Uses buttonVariants from HeroUI for consistent styling across both modes.
 */
export function Button({
  href,
  size = "md",
  variant = "primary",
  className,
  children,
  style,
  ...props
}: ButtonProps) {
  const isXl = size === "xl";
  const heroSize: HeroSize = isXl ? "lg" : size;

  if (href) {
    // Link mode — <a> with button styling via buttonVariants
    const classes = buttonVariants({
      variant: variant as HeroVariant,
      size: heroSize,
    });
    const merged = [classes, isXl && "button--xl", className]
      .filter(Boolean)
      .join(" ");

    return (
      <NextLink
        href={href}
        className={merged}
        style={style as React.CSSProperties}
      >
        {children as React.ReactNode}
      </NextLink>
    );
  }

  // Button mode — native <button> via HeroUI Button
  const merged = [isXl && "button--xl", className]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <HeroButton
      size={heroSize}
      variant={variant}
      className={merged}
      style={style}
      {...props}
    >
      {children}
    </HeroButton>
  );
}
