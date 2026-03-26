"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useScrollCallback } from "@/hooks/useScroll";
import { getReducedMotion } from "@/lib/scroll-store";
import type { CmsImage } from "@/lib/types";

interface Props {
  image: CmsImage;
  /** Color used for the scroll overlay, defaults to midnight */
  overlayColor?: string;
  /** Base overlay opacity before any scroll (0-1), defaults to 0.4 */
  baseOverlay?: number;
}

/**
 * Full-bleed background image with layered dark overlays:
 * 1. Base overlay — constant dim for readability (works with image or future video)
 * 2. Scroll overlay — opacity increases from 0 to 1 over 450px scroll
 *
 * Uses the shared scroll store — no private rAF loop.
 */
export function ScrollOverlayBackground({
  image,
  overlayColor = "var(--brand-midnight)",
  baseOverlay = 0.4,
}: Props) {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((scrollY: number) => {
    if (scrollOverlayRef.current) {
      const opacity = getReducedMotion()
        ? (scrollY > 10 ? 1 : 0)
        : Math.min(scrollY / 450, 1);
      scrollOverlayRef.current.style.opacity = String(opacity);
    }
  }, []);

  useScrollCallback(handleScroll, [handleScroll]);

  return (
    <>
      {/* Background image — full quality, future-ready for <video> swap */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        quality={100}
        style={{
          objectFit: "cover",
          position: "absolute",
          inset: 0,
          opacity: 0,
          transform: "scale(1.06)",
          animation: "heroImageReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      />

      {/* Base overlay — constant dim for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
          opacity: baseOverlay,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Scroll overlay — progressive darkening as user scrolls */}
      <div
        ref={scrollOverlayRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
          opacity: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
