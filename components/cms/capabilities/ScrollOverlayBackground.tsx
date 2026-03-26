"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useScrollCallback } from "@/hooks/useScroll";
import type { CmsImage } from "@/lib/cms/types";

interface Props {
  image: CmsImage;
  /** Color used for the scroll overlay, defaults to midnight */
  overlayColor?: string;
}

/**
 * Full-bleed background image with scroll-driven dark overlay.
 * As the user scrolls, the overlay opacity increases from 0 to 1 over 450px.
 * The image fades in and scales down on mount.
 *
 * Uses the shared scroll store — no private rAF loop.
 */
export function ScrollOverlayBackground({
  image,
  overlayColor = "var(--brand-midnight)",
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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
        quality={85}
        style={{
          objectFit: "cover",
          position: "absolute",
          inset: 0,
          opacity: ready ? 0.4 : 0,
          transform: ready ? "scale(1)" : "scale(1.08)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      />
    </>
  );
}
