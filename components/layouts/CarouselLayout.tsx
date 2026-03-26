"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, Heading } from "../primitives";
import { themeColors } from "@/lib/theme-colors";
import type { LayoutProps } from "./LayoutProps";

/** Testimonial-style carousel: image left + content right with prev/next navigation */

const testimonialImages = [
  "/images/universa/genesis-universa.jpg",
  "/images/alpha/genesis-alpha.png",
  "/images/eclipse/genesys-eclipse.jpg",
];

export default function CarouselLayout({ items, theme }: LayoutProps) {
  const [active, setActive] = useState(0);
  const t = items[active];

  const goTo = (i: number) => {
    setActive(((i % items.length) + items.length) % items.length);
  };

  return (
    <div>
      <div
        className="testimonial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--sp-3xl)",
          alignItems: "stretch",
        }}
      >
        {/* Left: image */}
        <div
          style={{
            aspectRatio: "1",
            borderRadius: "1.25rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={testimonialImages[active % testimonialImages.length]}
            alt={t.company || "Testimonial"}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right: content + navigation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-xl)",
            }}
          >
            {/* Metric pill */}
            {t.metric && <Badge text={t.metric} variant="metric" />}

            {/* Quote */}
            <blockquote style={{ fontStyle: "normal", fontWeight: 500, margin: 0 }}>
              <Heading level={4} size="h4" theme="dark">
                {`\u201C${t.quote}\u201D`}
              </Heading>
            </blockquote>

            {/* Author */}
            <div>
              <p
                style={{
                  color: "var(--neutral-white)",
                  fontWeight: 600,
                  fontSize: "var(--text-m)",
                  marginBottom: "0.25rem",
                }}
              >
                {t.author}
              </p>
              <p style={{ color: "var(--neutral-300)", fontSize: "var(--text-s)" }}>
                {t.company}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "var(--sp-2xl)",
            }}
          >
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "var(--neutral-white)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-midnight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  style={{
                    width: active === i ? "0.625rem" : "0.5rem",
                    height: active === i ? "0.625rem" : "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: active === i ? "var(--neutral-white)" : "rgba(255,255,255,0.3)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "var(--neutral-white)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-midnight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 767px) {
          .testimonial-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonial-grid > div:first-child {
            aspect-ratio: 4/3 !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
