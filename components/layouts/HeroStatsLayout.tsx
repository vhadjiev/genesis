"use client";

import { useInView } from "@/hooks/useInView";
import { frost } from "@/lib/frost";
import type { LayoutProps } from "./LayoutProps";

const stripStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  ...frost,
  marginTop: "var(--sp-3xl)",
  overflow: "hidden",
};

const statStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "var(--sp-xl) var(--sp-l)",
  position: "relative",
};

const dividerStyle: React.CSSProperties = {
  content: '""',
  position: "absolute",
  left: 0,
  top: "20%",
  bottom: "20%",
  width: "1px",
  background: "rgba(255, 255, 255, 0.08)",
};

const numberStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--h4)",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  lineHeight: 1,
  color: "var(--brand-blue-75)",
  marginBottom: "var(--sp-xs)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "var(--text-s)",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.85)",
  lineHeight: "var(--lh-m)",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.4)",
  lineHeight: "var(--lh-l)",
  marginTop: "var(--sp-3xs)",
};

/**
 * Compact frosted stat strip for the hero section.
 * Uses the same frost style as the logo marquee cards.
 * All styles inline to avoid Turbopack CSS cache issues.
 */
export default function HeroStatsLayout({ items }: LayoutProps) {
  const { ref, isVisible } = useInView(0.05);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="gc"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div style={stripStyle}>
        {items.map((item, i) => (
          <div
            key={item.id || i}
            style={{
              ...statStyle,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s`,
            }}
          >
            {i > 0 && <div style={dividerStyle} />}
            <span style={numberStyle}>{item.number}</span>
            <span style={titleStyle}>{item.title}</span>
            {item.content && <span style={descStyle}>{item.content}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
