import Image from "next/image";
import type { ResolvedLogoData } from "@/lib/types";

export interface LogoProps {
  /** Server-resolved logo data (SVG content or image reference) */
  logo: ResolvedLogoData;
  alt?: string;
  /** Height in rem */
  height?: string;
  /** Color mode — controls currentColor for SVG or filter for raster images */
  theme?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Logo primitive — pure render, no client-side fetch.
 *
 * Receives server-resolved logo data:
 * - SVG: inlined for color control via currentColor
 * - Image: rendered via next/image with theme filter
 *
 * Resolution happens server-side in getHeader/getFooter via resolveLogo().
 */
export function Logo({
  logo,
  alt = "Logo",
  height = "1.375rem",
  theme = "dark",
  className,
  style,
}: LogoProps) {
  const color = theme === "dark" ? "var(--neutral-white)" : "var(--brand-midnight)";

  if (logo.type === "svg") {
    return (
      <span
        role="img"
        aria-label={alt}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height,
          color,
          ...style,
        }}
        dangerouslySetInnerHTML={{
          __html: logo.content.replace(
            /<svg/,
            `<svg style="height:${height};width:auto" aria-hidden="true"`
          ),
        }}
      />
    );
  }

  if (logo.type === "image") {
    return (
      <Image
        src={logo.src}
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

  // Fallback: text
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height,
        fontWeight: 600,
        fontSize: "var(--text-s)",
        color,
        ...style,
      }}
    >
      {alt}
    </span>
  );
}
