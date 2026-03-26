"use client";

import Image from "next/image";
import { frost } from "@/lib/frost";

interface StoryContent {
  label: string;
  headline: string;
  body: string;
  body2: string;
  badge: string;
  points: Array<{ label: string; detail: string }>;
}

/* Assign a visual variant to each tag for colour variety */
type TagVariant = "blue" | "green" | "gradient";
const variants: TagVariant[] = ["blue", "green", "gradient"];

function tagStyle(variant: TagVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.5rem 1.25rem",
    borderRadius: "var(--radius-pill)",
    fontSize: "var(--text-s)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    flexShrink: 0,
    color: "var(--brand-midnight)",
  };
  switch (variant) {
    case "blue":
      return { ...base, background: "var(--brand-blue-95)" };
    case "green":
      return { ...base, background: "var(--mint)" };
    case "gradient":
      return {
        ...base,
        background: "linear-gradient(135deg, var(--brand-blue-95), var(--mint))",
      };
  }
}

export function StorySection({ content }: { content: StoryContent }) {
  /* Build tag labels from points (duplicated for seamless scrolling) */
  const tagLabels = content.points.map((p) => p.label);
  const row1 = [...tagLabels, ...tagLabels, ...tagLabels, ...tagLabels];
  const row2 = [...tagLabels.reverse(), ...tagLabels, ...tagLabels, ...tagLabels];

  return (
    <section
      data-header-theme="dark"
      style={{
        position: "relative",
        marginTop: "-80vh",
      }}
    >
      {/* ── Sticky background image — z:0 so hero's fade strip (z:2) covers it ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/IMG_2199.jpg"
          alt="Genesis machine in a premium café environment"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
          }}
        />
      </div>

      {/* ── Content overlay (pulled up over sticky bg) ── */}
      <div style={{ marginTop: "-100vh", position: "relative", zIndex: 1 }}>
        {/* First screen: centered heading */}
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--sp-xl)",
          }}
        >
          <div
            style={{
              ...frost,
              padding: "var(--sp-3xl)",
              maxWidth: "52rem",
            }}
          >
            <h2
              className="heading-h3"
              style={{
                color: "var(--neutral-white)",
                textAlign: "center",
              }}
            >
              {content.headline.split("\n").map((line, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <span key={i}>
                    {isLast ? (
                      <span className="text-gradient-v2">{line}</span>
                    ) : (
                      line
                    )}
                    {i < arr.length - 1 && <br />}
                  </span>
                );
              })}
            </h2>
          </div>
        </div>

        {/* Second screen: short heading + body paragraph + tag carousels */}
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 0 var(--sp-4xl)",
            overflow: "hidden",
          }}
        >
          {/* Short punchy heading + supporting paragraph */}
          <div className="gc" style={{ marginBottom: "var(--sp-3xl)" }}>
            <h3
              className="jumbo-h"
              style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-xl)" }}
            >
              Your new{" "}
              <span className="text-gradient">engineering</span>
              <br />
              partner
            </h3>
            <p
              className="text-l"
              style={{
                color: "rgba(255,255,255,0.65)",
                maxWidth: "36rem",
                lineHeight: "var(--lh-xl)",
              }}
            >
              {content.body}
            </p>
          </div>

          {/* Tag carousel row 1 — LTR */}
          <div style={{ overflow: "hidden", marginBottom: "var(--sp-s)" }}>
            <div
              style={{
                display: "flex",
                gap: "var(--sp-s)",
                width: "max-content",
                animation: "scroll-tags-ltr 30s linear infinite",
              }}
            >
              {row1.map((label, i) => (
                <span key={`ltr-${i}`} style={tagStyle(variants[i % 3])}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Tag carousel row 2 — RTL */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                gap: "var(--sp-s)",
                width: "max-content",
                animation: "scroll-tags-rtl 30s linear infinite",
              }}
            >
              {row2.map((label, i) => (
                <span key={`rtl-${i}`} style={tagStyle(variants[(i + 1) % 3])}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
