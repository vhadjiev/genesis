"use client";

import Image from "next/image";
import { Link } from "./Link";
import { frost, frostHeavy, frostLight } from "@/lib/frost";
import type { CmsImage } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ImagePosition = "top" | "left" | "right" | "bottom" | "background" | "none";
export type CardVariant = "default" | "frosted" | "frosted-heavy" | "frosted-light" | "glass" | "flat" | "outlined";

export interface CardProps {
  children: React.ReactNode;
  /** Image to display */
  image?: CmsImage;
  /** Where to position the image relative to content */
  imagePosition?: ImagePosition;
  /** Aspect ratio for the image container */
  imageAspectRatio?: string;
  /** Responsive sizes hint for next/image */
  imageSizes?: string;
  /** Visual variant */
  variant?: CardVariant;
  /** Make the entire card a link */
  href?: string;
  /** Padding inside the card body */
  padding?: string;
  /** Extra class name */
  className?: string;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

// ─── Variant styles ──────────────────────────────────────────────────────────

function variantStyles(variant: CardVariant): React.CSSProperties {
  switch (variant) {
    case "frosted":
      return frost;
    case "frosted-heavy":
      return frostHeavy;
    case "frosted-light":
      return frostLight;
    case "glass":
      return {
        background: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "1.5rem",
      };
    case "outlined":
      return {
        border: "1px solid var(--neutral-200)",
        borderRadius: "var(--radius-l)",
        background: "var(--neutral-white)",
      };
    case "flat":
      return {};
    case "default":
    default:
      return { borderRadius: "var(--radius-l)" };
  }
}

// ─── Card Image ──────────────────────────────────────────────────────────────

function CardImage({
  image,
  position,
  aspectRatio,
  sizes,
}: {
  image: CmsImage;
  position: ImagePosition;
  aspectRatio?: string;
  sizes?: string;
}) {
  const defaultAspectRatio =
    position === "top" || position === "bottom"
      ? "16 / 9"
      : position === "left" || position === "right"
        ? "4 / 3"
        : undefined;

  return (
    <div
      style={{
        position: position === "background" ? "absolute" : "relative",
        inset: position === "background" ? 0 : undefined,
        width: position === "left" || position === "right" ? "45%" : "100%",
        flexShrink: 0,
        aspectRatio: aspectRatio || defaultAspectRatio,
        borderRadius: position === "background" ? undefined : "var(--radius-l)",
        overflow: "hidden",
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        style={{ objectFit: "cover", objectPosition: image.objectPosition }}
      />
    </div>
  );
}

// ─── Card component ──────────────────────────────────────────────────────────

export function Card({
  children,
  image,
  imagePosition = "none",
  imageAspectRatio,
  imageSizes,
  variant = "default",
  href,
  padding,
  className,
  style: styleProp,
}: CardProps) {
  const vStyles = variantStyles(variant);
  const isHorizontal = imagePosition === "left" || imagePosition === "right";
  const imageFirst = imagePosition === "top" || imagePosition === "left";
  const hasImage = image && imagePosition !== "none";

  // Body wrapper
  const body = (
    <div style={{ flex: isHorizontal ? 1 : undefined, minWidth: 0, padding }}>
      {children}
    </div>
  );

  // Image element
  const imageEl = hasImage ? (
    <CardImage
      image={image}
      position={imagePosition}
      aspectRatio={imageAspectRatio}
      sizes={imageSizes}
    />
  ) : null;

  // Background image mode
  if (imagePosition === "background" && hasImage) {
    const content = (
      <div
        className={className}
        style={{
          position: "relative",
          overflow: "hidden",
          ...vStyles,
          ...styleProp,
        }}
      >
        {imageEl}
        <div style={{ position: "relative", zIndex: 1, padding }}>{children}</div>
      </div>
    );
    return href ? <Link href={href} style={{ display: "block" }}>{content}</Link> : content;
  }

  // Horizontal layout
  if (isHorizontal) {
    const content = (
      <div
        className={className}
        style={{
          display: "flex",
          gap: "var(--sp-xl)",
          alignItems: "flex-start",
          ...vStyles,
          ...styleProp,
        }}
      >
        {imageFirst ? <>{imageEl}{body}</> : <>{body}{imageEl}</>}
      </div>
    );
    return href ? <Link href={href} style={{ display: "block" }}>{content}</Link> : content;
  }

  // Vertical layout (top, bottom, none)
  const content = (
    <div
      className={className}
      style={{ ...vStyles, ...styleProp }}
    >
      {imageFirst && imageEl && (
        <div style={{ marginBottom: padding ? undefined : "var(--sp-l)" }}>{imageEl}</div>
      )}
      {body}
      {!imageFirst && imagePosition === "bottom" && imageEl && (
        <div style={{ marginTop: padding ? undefined : "var(--sp-l)" }}>{imageEl}</div>
      )}
    </div>
  );
  return href ? <Link href={href} style={{ display: "block" }}>{content}</Link> : content;
}
