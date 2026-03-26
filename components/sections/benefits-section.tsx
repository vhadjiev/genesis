"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

interface Benefit {
  number: string;
  heading: string;
  description: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    number: "01",
    heading: "Built, not assembled",
    description:
      "Every Genesis system is designed, fabricated, and assembled in our own facility. From laser-cut metal to running firmware \u2014 controlled end-to-end.",
    image: "/images/universa/genesis-universa.jpg",
  },
  {
    number: "02",
    heading: "Software that thinks ahead",
    description:
      "Our AI operating system learns your patterns, predicts maintenance, and optimises recipes. Patent-registered intelligence, not a third-party licence.",
    image: "/images/alpha/genesis-alpha.png",
  },
  {
    number: "03",
    heading: "Service in under 4 hours",
    description:
      "Local technicians, local parts, local knowledge. Our service model is built around the reality that in hospitality, four hours is already too long.",
    image: "/images/eclipse/genesys-eclipse.jpg",
  },
  {
    number: "04",
    heading: "Your machine, your rules",
    description:
      "Programmable recipes, branded displays, custom LED lighting. Configure everything to match your operation \u2014 no compromises.",
    image: "/images/solaris/genesys-solaris2.jpg",
  },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function BenefitsSection() {
  const { ref: sectionRef, isVisible } = useInView(0.05);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const prevActiveRef = useRef(0);

  const setImageRef = useCallback((el: HTMLDivElement | null, index: number) => {
    imageRefs.current[index] = el;
  }, []);

  /* rAF-driven scroll logic: closest-to-viewport-center algorithm with smoothstep easing */
  useEffect(() => {
    const tick = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elCenter - viewportCenter);

        /* Scroll-driven opacity and scale via smoothstep */
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

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const active = benefits[activeIndex];

  return (
    <>
      {/* ====== DESKTOP ====== */}
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        className={`ben-desktop reveal${isVisible ? " visible" : ""}`}
        data-header-theme="light"
        style={{ backgroundColor: "var(--neutral-100)", position: "relative", zIndex: 2 }}
      >
        {/* Section header */}
        <div
          className="gc"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "var(--sp-4xl)",
            paddingBottom: "var(--sp-4xl)",
          }}
        >
          <span
            className="label-s"
            style={{ color: "var(--neutral-400)", marginBottom: "var(--sp-m)" }}
          >
            why genesis
          </span>
          <h2 className="jumbo-h" style={{ maxWidth: "50rem" }}>
            The <span className="text-gradient">unfair advantage</span> of vertical integration
          </h2>
        </div>

        {/* Two-column sticky layout */}
        <div
          className="gc"
          style={{
            display: "flex",
            gap: "var(--sp-3xl)",
            alignItems: "flex-start",
            paddingBottom: "var(--sp-4xl)",
          }}
        >
          {/* LEFT -- sticky text column (45%) */}
          <div style={{ width: "45%", flexShrink: 0, alignSelf: "stretch" }}>
            <div style={{ position: "sticky", top: "30vh" }}>
              {/* Big number */}
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

              {/* Heading */}
              <h3
                key={`h-${animKey}`}
                className="heading-h2"
                style={{
                  color: "var(--brand-midnight)",
                  marginBottom: "1.25rem",
                  animation: "benFadeIn 0.5s ease both",
                }}
              >
                {active.heading}
              </h3>

              {/* Description */}
              <p
                key={`p-${animKey}`}
                className="text-l"
                style={{
                  color: "var(--neutral-400)",
                  lineHeight: "var(--lh-xl)",
                  maxWidth: "28rem",
                  animation: "benFadeIn 0.5s ease 0.05s both",
                }}
              >
                {active.description}
              </p>

              {/* Progress dots */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--sp-2xs)",
                  alignItems: "center",
                  marginTop: "var(--sp-xl)",
                }}
              >
                {benefits.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === activeIndex ? "2rem" : "0.5rem",
                      height: "0.5rem",
                      borderRadius: "var(--radius-pill)",
                      backgroundColor:
                        i === activeIndex ? "var(--brand-blue)" : "var(--neutral-300)",
                      transition: "width 0.4s ease, background-color 0.4s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT -- scrolling images column (55%) */}
          <div
            style={{
              width: "55%",
              display: "flex",
              flexDirection: "column",
              gap: "40vh",
              paddingTop: "35vh",
              paddingBottom: "35vh",
            }}
          >
            {benefits.map((benefit, i) => (
              <div
                key={benefit.number}
                ref={(el) => setImageRef(el, i)}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: "var(--radius-l)",
                  overflow: "hidden",
                  willChange: "opacity, transform",
                }}
              >
                <Image
                  src={benefit.image}
                  alt={benefit.heading}
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MOBILE ====== */}
      <section
        className="ben-mobile"
        data-header-theme="light"
        style={{
          backgroundColor: "var(--neutral-100)",
          paddingTop: "var(--sp-4xl)",
          paddingBottom: "var(--sp-4xl)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="gc">
          {/* Mobile header */}
          <div style={{ textAlign: "center", marginBottom: "var(--sp-5xl)" }}>
            <span
              className="label-s"
              style={{
                color: "var(--neutral-400)",
                marginBottom: "var(--sp-m)",
                display: "block",
              }}
            >
              why genesis
            </span>
            <h2 className="jumbo-h" style={{ maxWidth: "50rem", margin: "0 auto" }}>
              The <span className="text-gradient">unfair advantage</span> of vertical integration
            </h2>
          </div>

          {/* Stacked vertical cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5xl)" }}>
            {benefits.map((benefit) => (
              <div key={benefit.number}>
                {/* 16:9 image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "var(--radius-l)",
                    overflow: "hidden",
                    marginBottom: "var(--sp-l)",
                  }}
                >
                  <Image
                    src={benefit.image}
                    alt={benefit.heading}
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Number */}
                <span
                  style={{
                    fontSize: "var(--jumbo-2)",
                    fontWeight: 600,
                    color: "var(--brand-blue)",
                    opacity: 0.25,
                    lineHeight: 1,
                    display: "block",
                    marginBottom: "var(--sp-xs)",
                  }}
                >
                  {benefit.number}
                </span>

                {/* Heading + description */}
                <h3
                  className="heading-h5"
                  style={{ color: "var(--brand-midnight)", marginBottom: "var(--sp-s)" }}
                >
                  {benefit.heading}
                </h3>
                <p className="text-l" style={{ color: "var(--neutral-400)" }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
