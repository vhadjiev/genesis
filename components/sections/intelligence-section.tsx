"use client";

import { useInView } from "@/hooks/useInView";
import { frost } from "@/lib/frost";

interface Feature {
  id: string;
  title: string;
  description: string;
}

interface IntelligenceContent {
  label: string;
  headline: string;
  features: Feature[];
}

const featureIcons: Record<string, React.ReactNode> = {
  cloud: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  ai: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  ),
  mobile: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  ),
  ota: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
};

export function IntelligenceSection({ content }: { content: IntelligenceContent }) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="technology"
      data-header-theme="dark"
      className="g-section"
      style={{
        backgroundColor: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="gc" style={{ position: "relative" }}>
        {/* Label */}
        <p
          className="label-s"
          style={{
            color: "rgba(255,255,255,0.5)",
            marginBottom: "var(--sp-m)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {content.label}
        </p>

        {/* Jumbo headline */}
        <h2
          className="jumbo-h"
          style={{
            color: "var(--neutral-white)",
            maxWidth: "48rem",
            marginBottom: "var(--sp-3xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          {content.headline.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < content.headline.split("\n").length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* 2x2 feature cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--grid-gap)",
          }}
        >
          {content.features.map((feature, i) => (
            <div
              key={feature.id}
              style={{
                ...frost,
                padding: "var(--sp-xl)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s`,
              }}
            >
              {/* Icon */}
              <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: "var(--sp-m)" }}>
                {featureIcons[feature.id] || featureIcons.cloud}
              </div>

              {/* Title */}
              <h3
                className="heading-h5"
                style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-xs)" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-l"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
