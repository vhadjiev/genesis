"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { frost } from "@/lib/frost";

/* v4 pattern: hero uses heading-h1 size instead of jumbo-h for a tighter feel */
const heroHeadingStyle: React.CSSProperties = {
  fontSize: "var(--h1)",
  lineHeight: "var(--lh)",
  fontWeight: 600,
  letterSpacing: "var(--ls-m)",
  color: "var(--neutral-white)",
  maxWidth: "56rem",
};

interface HeroContent {
  label: string;
  headline: string;
  subheading: string;
  cta_primary: string;
  cta_secondary: string;
  counter_value: string;
  counter_label: string;
}

interface TrustContent {
  label: string;
  logos: string[];
}

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  },
});

export function HeroSection({
  hero,
  trust,
}: {
  hero: HeroContent;
  trust: TrustContent;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  /* Scroll-driven dark overlay via requestAnimationFrame */
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (overlayRef.current) {
      const opacity = Math.min(window.scrollY / 450, 1);
      overlayRef.current.style.opacity = String(opacity);
    }
    rafId.current = requestAnimationFrame(handleScroll);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId.current);
  }, [handleScroll]);

  /* Duplicate logos for infinite scroll */
  const allLogos = [...trust.logos, ...trust.logos];

  return (
    <>
      {/* ── Hero wrapper ── */}
      <div
        className="hero-section-wrapper"
        data-header-theme="dark"
        style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "var(--brand-midnight)",
        }}
      >
        {/* ── Centered text content ── */}
        <div
          className="gc"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "12rem",
            paddingBottom: "var(--sp-4xl)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Headline — h1 size, not jumbo (tighter, more refined) */}
          <motion.h1
            variants={fadeUp(0)}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            style={heroHeadingStyle}
          >
            {hero.headline}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-l"
            variants={fadeUp(0.15)}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            style={{
              color: "var(--neutral-300)",
              maxWidth: "38rem",
              marginTop: "var(--sp-l)",
            }}
          >
            {hero.subheading}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            style={{ marginTop: "var(--sp-xl)" }}
          >
            <a href="#contact" className="g-button variant">
              <span>{hero.cta_primary}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* ── Logo carousel ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            paddingBottom: "var(--sp-4xl)",
          }}
        >
          {/* Label */}
          <p
            className="label-s"
            style={{
              textAlign: "center",
              color: "var(--neutral-400)",
              marginBottom: "var(--sp-xl)",
            }}
          >
            {trust.label}
          </p>

          {/* Scrolling logos */}
          <div style={{ overflow: "hidden" }}>
            <div
              className="logo-scroll"
              style={{
                display: "flex",
                gap: "var(--sp-l)",
                width: "max-content",
              }}
            >
              {allLogos.map((logo, i) => (
                <div
                  key={`${logo}-${i}`}
                  style={{
                    ...frost,
                    width: "18.75rem",
                    height: "6.875rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    borderRadius: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--neutral-white)",
                      fontWeight: 500,
                      fontSize: "var(--text-s)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      opacity: 0.7,
                    }}
                  >
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer — extra vertical space so the gradient has room */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "var(--sp-4xl)",
            paddingBottom: "var(--sp-4xl)",
          }}
        />

        {/* ── Bottom gradient overlay ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "300px",
            background:
              "linear-gradient(180deg, transparent, var(--brand-midnight) 68%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ── Scroll-driven dark overlay ── */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--brand-midnight)",
            opacity: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ── Background image (lowest layer) — fades in + scales down on load ── */}
        <Image
          src="/images/hero/coffee-beans-dark.jpg"
          alt=""
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
      </div>

      {/* ── Fade-out strip below hero ──
          Sits ABOVE the story section's sticky image (z:2 > story's z:0).
          Gradient from midnight (top) to transparent (bottom) reveals
          the sticky image as user scrolls through. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "80vh",
          background:
            "linear-gradient(180deg, var(--brand-midnight) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
