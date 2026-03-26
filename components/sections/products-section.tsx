"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { frostHeavy } from "@/lib/frost";

interface Product {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  specs: string[];
  audience: string;
}

interface ProductsContent {
  label: string;
  headline: string;
  items: Product[];
}

export function ProductsSection({ content }: { content: ProductsContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, isVisible } = useInView(0.1);

  const handleCardClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  /* Split headline to apply gradient to last word(s) */
  const headlineParts = content.headline.split(" ");
  const gradientWord = headlineParts.pop();
  const plainHeadline = headlineParts.join(" ");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="machines"
      className={`g-section reveal${isVisible ? " visible" : ""}`}
      style={{ background: "var(--neutral-white)" }}
    >
      <div className="gc" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2xl)" }}>
        {/* Section header */}
        <div>
          <p className="label-s" style={{ color: "var(--brand-blue)", marginBottom: "var(--sp-s)" }}>
            {content.label}
          </p>
          <h2 className="jumbo-h">
            {plainHeadline}{" "}
            <span className="text-gradient">{gradientWord}</span>
          </h2>
        </div>

        {/* Desktop: Horizontal accordion */}
        <div
          className="use-cases-row"
          style={{
            height: "33.75rem",
            gap: "var(--sp-xs)",
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          }}
        >
          {content.items.map((product, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(i);
                  }
                }}
                style={{
                  flex: isActive ? "1 1 0%" : "0 0 7%",
                  height: "100%",
                  borderRadius: "var(--radius-l)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isActive ? "var(--brand-midnight)" : "var(--neutral-white)",
                  border: isActive ? "none" : "1px solid var(--neutral-200)",
                }}
              >
                {/* Collapsed state: vertical text */}
                {!isActive && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--sp-l) 0",
                    }}
                  >
                    <span
                      className="vertical-rl"
                      style={{
                        fontWeight: 500,
                        fontSize: "var(--text-s)",
                        letterSpacing: "0.04em",
                        color: "var(--brand-midnight)",
                        whiteSpace: "nowrap",
                        flex: 1,
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      {product.name}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ marginBottom: "var(--sp-xs)", flexShrink: 0 }}
                    >
                      <path
                        d="M10 4v12M4 10l6 6 6-6"
                        stroke="var(--brand-midnight)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* Active state: image + frosted panel */}
                {isActive && (
                  <>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      style={{ objectFit: "cover" }}
                      priority={i === 0}
                    />
                    {/* Dark overlay for readability */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                      }}
                    />
                    {/* Frosted glass panel */}
                    <div
                      style={{
                        ...frostHeavy,
                        position: "absolute",
                        top: "var(--sp-xl)",
                        left: "var(--sp-xl)",
                        bottom: "var(--sp-xl)",
                        width: "17.3125rem",
                        padding: "var(--sp-xl)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        color: "var(--neutral-white)",
                      }}
                    >
                      <div>
                        <p
                          className="label-s"
                          style={{
                            color: "var(--brand-blue-85)",
                            marginBottom: "var(--sp-xs)",
                          }}
                        >
                          {product.number}
                        </p>
                        <h3 className="heading-h5" style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-m)" }}>
                          {product.name}
                        </h3>
                        <p className="text-l" style={{ color: "rgba(255,255,255,0.8)" }}>
                          {product.tagline}
                        </p>
                      </div>
                      <a
                        href={`#${product.id}`}
                        className="g-button"
                        style={{
                          background: "linear-gradient(135deg, var(--brand-blue), var(--brand-blue-75))",
                          color: "var(--neutral-white)",
                          textAlign: "center",
                          justifyContent: "center",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "var(--radius-pill)",
                          fontSize: "var(--text-s)",
                          fontWeight: 500,
                          textDecoration: "none",
                          border: "none",
                        }}
                      >
                        Learn More
                      </a>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: Stacked cards */}
        <div className="use-cases-mobile">
          {content.items.map((product) => (
            <div
              key={product.id}
              style={{
                position: "relative",
                height: "24rem",
                borderRadius: "var(--radius-l)",
                overflow: "hidden",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                }}
              />
              {/* Frosted panel */}
              <div
                style={{
                  ...frostHeavy,
                  position: "absolute",
                  bottom: "var(--sp-l)",
                  left: "var(--sp-l)",
                  right: "var(--sp-l)",
                  padding: "var(--sp-l)",
                  color: "var(--neutral-white)",
                }}
              >
                <p
                  className="label-s"
                  style={{ color: "var(--brand-blue-85)", marginBottom: "var(--sp-3xs)" }}
                >
                  {product.number}
                </p>
                <h3 className="heading-h6" style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-2xs)" }}>
                  {product.name}
                </h3>
                <p className="text-s" style={{ color: "rgba(255,255,255,0.8)", marginBottom: "var(--sp-m)" }}>
                  {product.tagline}
                </p>
                <a
                  href={`#${product.id}`}
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, var(--brand-blue), var(--brand-blue-75))",
                    color: "var(--neutral-white)",
                    padding: "0.625rem 1.25rem",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "var(--text-s)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
