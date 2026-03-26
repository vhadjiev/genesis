"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface LogoProps {
  /** URL to logo file (SVG or image) */
  src: string;
  alt?: string;
  /** Height in rem */
  height?: string;
  /** Color mode — inverts logo for dark backgrounds */
  theme?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Logo primitive.
 * - SVG files: fetches and inlines the SVG content for color control via currentColor
 * - Image files: renders via next/image with filter for dark/light mode
 */
export function Logo({
  src,
  alt = "Logo",
  height = "1.375rem",
  theme = "dark",
  className,
  style,
}: LogoProps) {
  const isSvg = src.endsWith(".svg");
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!isSvg) return;
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        // Remove XML declaration and add currentColor fill
        const cleaned = text
          .replace(/<\?xml[^?]*\?>/g, "")
          .replace(/<!DOCTYPE[^>]*>/g, "");
        setSvgContent(cleaned);
      })
      .catch(() => setSvgContent(null));
  }, [src, isSvg]);

  const color = theme === "dark" ? "var(--neutral-white)" : "var(--brand-midnight)";

  // SVG: inline for color control
  if (isSvg && svgContent) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height,
          color,
          ...style,
        }}
        dangerouslySetInnerHTML={{
          __html: svgContent.replace(
            /<svg/,
            `<svg style="height:${height};width:auto"`
          ),
        }}
      />
    );
  }

  // Fallback: image with filter
  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={22}
      className={className}
      style={{
        height,
        width: "auto",
        filter: theme === "dark" ? "brightness(0) invert(1)" : "none",
        ...style,
      }}
      priority
    />
  );
}
