"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useScrollCallback } from "@/hooks/useScroll";
import { Heading } from "../primitives";
import type { ContentItem } from "@/lib/cms/types";
import type { LayoutProps } from "./LayoutProps";

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function MobileView({ items }: { items: ContentItem[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5xl)" }}>
      {items.map((item) => (
        <div key={item.id || item.number}>
          {item.image && (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--radius-l)", overflow: "hidden", marginBottom: "var(--sp-l)" }}>
              <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" style={{ objectFit: "cover" }} />
            </div>
          )}
          <span style={{ fontSize: "var(--jumbo-2)", fontWeight: 600, color: "var(--brand-blue)", opacity: 0.25, lineHeight: 1, display: "block", marginBottom: "var(--sp-xs)" }}>
            {item.number}
          </span>
          <Heading level={3} size="h5" theme="light" style={{ marginBottom: "var(--sp-s)" }}>
            {item.title || ""}
          </Heading>
          <p className="text-l" style={{ color: "var(--neutral-400)" }}>
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function DesktopView({ items }: { items: ContentItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef(0);

  const setImageRef = useCallback((el: HTMLDivElement | null, index: number) => {
    imageRefs.current[index] = el;
  }, []);

  // Uses shared scroll store — no private rAF loop
  const handleScrollTick = useCallback(() => {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elCenter - viewportCenter);

      const normalised = (elCenter - viewportCenter) / window.innerHeight;
      const opacity = 0.15 + 0.85 * smoothstep(0, 1, 1 - Math.abs(normalised) * 1.2);
      const scale = 0.88 + 0.12 * smoothstep(0, 1, 1 - Math.abs(normalised));
      el.style.opacity = String(opacity);
      el.style.transform = `scale(${scale})`;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== prevActiveRef.current) {
      prevActiveRef.current = closestIndex;
      setActiveIndex(closestIndex);
      setAnimKey((k) => k + 1);
    }
  }, []);

  useScrollCallback(handleScrollTick, [handleScrollTick]);

  const active = items[activeIndex];

  return (
    <div style={{ display: "flex", gap: "var(--sp-3xl)", alignItems: "flex-start", paddingBottom: "var(--sp-4xl)" }}>
      {/* LEFT — sticky text */}
      <div style={{ width: "45%", flexShrink: 0, alignSelf: "stretch" }}>
        <div style={{ position: "sticky", top: "30vh" }}>
          <span
            key={`num-${animKey}`}
            style={{
              fontSize: "var(--jumbo-2)",
              fontWeight: 600,
              letterSpacing: "var(--ls-l)",
              lineHeight: "var(--lh)",
              color: "var(--brand-blue)",
              opacity: 0.25,
              display: "block",
              marginBottom: "1.25rem",
              animation: "benFadeIn 0.5s ease forwards",
            }}
          >
            {active.number}
          </span>
          <Heading
            key={`h-${animKey}`}
            level={3}
            size="h2"
            theme="light"
            style={{ marginBottom: "1.25rem", animation: "benFadeIn 0.5s ease both" }}
          >
            {active.title || ""}
          </Heading>
          <p
            key={`p-${animKey}`}
            className="text-l"
            style={{ color: "var(--neutral-400)", lineHeight: "var(--lh-xl)", maxWidth: "28rem", animation: "benFadeIn 0.5s ease 0.05s both" }}
          >
            {active.content}
          </p>
          <div style={{ display: "flex", gap: "var(--sp-2xs)", alignItems: "center", marginTop: "var(--sp-xl)" }}>
            {items.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeIndex ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: i === activeIndex ? "var(--brand-blue)" : "var(--neutral-300)",
                  transition: "width 0.4s ease, background-color 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — scrolling images */}
      <div style={{ width: "55%", display: "flex", flexDirection: "column", gap: "40vh", paddingTop: "35vh", paddingBottom: "35vh" }}>
        {items.map((item, i) => (
          <div
            key={item.id || i}
            ref={(el) => setImageRef(el, i)}
            style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: "var(--radius-l)", overflow: "hidden", willChange: "opacity, transform" }}
          >
            {item.image && (
              <Image src={item.image.src} alt={item.image.alt} fill sizes="50vw" style={{ objectFit: "cover" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Sticky scroll layout — desktop shows dual-pane (sticky text + scrolling images),
 * mobile shows stacked cards. Handles its own responsive split via CSS visibility.
 */
export default function StickyScrollLayout({ items }: LayoutProps) {
  return (
    <>
      <div className="ben-desktop">
        <DesktopView items={items} />
      </div>
      <div className="ben-mobile">
        <MobileView items={items} />
      </div>
    </>
  );
}
