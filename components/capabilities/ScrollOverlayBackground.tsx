"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useScrollCallback } from "@/hooks/useScroll";
import type { CmsImage } from "@/lib/types";

interface Props {
  image: CmsImage;
  /** Color used for the scroll overlay, defaults to midnight */
  overlayColor?: string;
}

/**
 * Full-bleed background image with scroll-driven dark overlay.
 * As the user scrolls, the overlay opacity increases from 0 to 1 over 450px.
 * The image fades in via CSS animation on mount (no setState needed).
 *
 * Uses the shared scroll store — no private rAF loop.
 */
export function ScrollOverlayBackground({
  image,
  overlayColor = "var(--brand-midnight)",
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((scrollY: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(Math.min(scrollY / 450, 1));
    }
  }, []);

  useScrollCallback(handleScroll, [handleScroll]);

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
          opacity: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
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
          animation: "fadeIn 0.5s ease forwards",
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </>
  );
}
