"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  metric: string;
}

interface ProofContent {
  label: string;
  headline: string;
  stats: Array<{ value: string; label: string; description: string }>;
  testimonials: Testimonial[];
  illy_badge: string;
}

/* ── V4-style testimonial carousel ── */
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  const goTo = (i: number) => {
    setActive(((i % testimonials.length) + testimonials.length) % testimonials.length);
  };

  // Use existing product images as testimonial backgrounds
  const images = [
    "/images/universa/genesis-universa.jpg",
    "/images/alpha/genesis-alpha.png",
    "/images/eclipse/genesys-eclipse.jpg",
  ];

  return (
    <div className="gc">
      <div className="testimonial-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--sp-3xl)",
        alignItems: "stretch",
      }}>
        {/* Left: image */}
        <div style={{
          aspectRatio: "1",
          borderRadius: "1.25rem",
          overflow: "hidden",
          position: "relative",
        }}>
          <Image
            src={images[active % images.length]}
            alt={t.company}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right: content + navigation */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-xl)",
          }}>
            {/* Metric pill */}
            <span
              style={{
                display: "inline-block",
                width: "fit-content",
                padding: "var(--sp-2xs) var(--sp-s)",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--brand-blue-85)",
                fontSize: "var(--text-s)",
                fontWeight: 600,
              }}
            >
              {t.metric}
            </span>

            {/* Quote */}
            <blockquote
              className="heading-h4"
              style={{
                color: "var(--neutral-white)",
                fontStyle: "normal",
                fontWeight: 500,
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div>
              <p style={{
                color: "var(--neutral-white)",
                fontWeight: 600,
                fontSize: "var(--text-m)",
                marginBottom: "0.25rem",
              }}>
                {t.author}
              </p>
              <p style={{ color: "var(--neutral-300)", fontSize: "var(--text-s)" }}>
                {t.company}
              </p>
            </div>
          </div>

          {/* Navigation — prev, dots, next */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "var(--sp-2xl)",
          }}>
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
              {testimonials.map((_, i) => (
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .testimonial-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonial-grid > div:first-child {
            aspect-ratio: 4/3 !important;
          }
        }
      ` }} />
    </div>
  );
}

/* ── Stats bento card configs ── */
const cardConfigs = [
  {
    // 3,000+ Locations — frosted glass + world map dots
    span: 7,
    color: "var(--neutral-white)",
    descColor: "rgba(255,255,255,0.6)",
    backgroundImage: "linear-gradient(270deg, transparent, rgba(0,0,0,0.3) 70%), url(/images/stats-dots-map.svg)",
    backgroundPosition: "0 0, 100% center",
    backgroundRepeat: "repeat, no-repeat",
    backgroundSize: "auto, cover",
    bg: "rgba(255,255,255,0.06)",
    frost: true,
  },
  {
    // 99.2% Uptime — frosted light
    span: 5,
    bg: "rgba(255,255,255,0.08)",
    color: "var(--neutral-white)",
    descColor: "rgba(255,255,255,0.5)",
    frost: true,
  },
  {
    // 15+ Years — frosted with mint tint
    span: 5,
    bg: "rgba(177,239,213,0.1)",
    color: "var(--neutral-white)",
    descColor: "rgba(255,255,255,0.5)",
    frost: true,
  },
  {
    // < 4h Response — frosted glass + chart
    span: 7,
    color: "var(--neutral-white)",
    descColor: "rgba(255,255,255,0.6)",
    backgroundImage: "linear-gradient(270deg, transparent, rgba(0,0,0,0.3) 52%), url(/images/stats-chart.svg)",
    backgroundPosition: "0 0, 100% center",
    backgroundRepeat: "repeat, no-repeat",
    backgroundSize: "auto, contain",
    bg: "rgba(255,255,255,0.06)",
    frost: true,
  },
];

export function ProofSection({ content }: { content: ProofContent }) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <>
      {/* Testimonial carousel */}
      <section
        className="g-section"
        style={{
          paddingTop: "var(--sp-6xl)",
          paddingBottom: "var(--sp-6xl)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TestimonialCarousel testimonials={content.testimonials} />
      </section>

      {/* Stats bento grid */}
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="g-section"
        style={{ paddingTop: 0, paddingBottom: "var(--sp-4xl)", position: "relative" }}
      >
        <div className="gc grid-12 stats-grid">
          {content.stats.slice(0, 4).map((stat, i) => {
            const cfg = cardConfigs[i];
            return (
              <div
                key={stat.label}
                className="stats-card"
                style={{
                  gridColumn: `span ${cfg.span}`,
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  backgroundImage: cfg.backgroundImage,
                  backgroundPosition: cfg.backgroundPosition,
                  backgroundRepeat: cfg.backgroundRepeat,
                  backgroundSize: cfg.backgroundSize,
                  backdropFilter: cfg.frost ? "blur(24px)" : undefined,
                  WebkitBackdropFilter: cfg.frost ? "blur(24px)" : undefined,
                  border: cfg.frost ? "1px solid rgba(255,255,255,0.08)" : undefined,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                }}
              >
                <div>
                  <h4 className="jumbo-h" style={{ color: "inherit", marginBottom: "var(--sp-s)" }}>
                    {stat.value}
                  </h4>
                  <div className="heading-h6" style={{ color: "inherit" }}>
                    {stat.label}
                  </div>
                </div>
                <p className="text-l" style={{ maxWidth: "23rem", color: cfg.descColor }}>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
