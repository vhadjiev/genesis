"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { frostHeavy } from "@/lib/frost";
import type { LayoutProps } from "./LayoutProps";

export default function AccordionHorizontalLayout({ items }: LayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, isVisible } = useInView(0.1);

  const handleCardClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <>
      {/* Desktop: Horizontal accordion */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`use-cases-row reveal${isVisible ? " visible" : ""}`}
        style={{
          height: "33.75rem",
          gap: "var(--sp-xs)",
          borderRadius: "var(--radius-l)",
          overflow: "hidden",
        }}
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={item.id || i}
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
                    {item.title}
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
                  {item.image && (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      style={{ objectFit: "cover" }}
                      priority={i === 0}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                    }}
                  />
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
                      <p className="label-s" style={{ color: "var(--brand-blue-85)", marginBottom: "var(--sp-xs)" }}>
                        {item.number}
                      </p>
                      <h3 className="heading-h5" style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-m)" }}>
                        {item.title}
                      </h3>
                      <p className="text-l" style={{ color: "rgba(255,255,255,0.8)" }}>
                        {item.subtitle}
                      </p>
                    </div>
                    {item.cta && (
                      <a
                        href={item.cta.href}
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
                        {item.cta.label}
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Stacked cards */}
      <div className="use-cases-mobile">
        {items.map((item) => (
          <div
            key={item.id || item.title}
            style={{
              position: "relative",
              height: "24rem",
              borderRadius: "var(--radius-l)",
              overflow: "hidden",
            }}
          >
            {item.image && (
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
              }}
            />
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
              <p className="label-s" style={{ color: "var(--brand-blue-85)", marginBottom: "var(--sp-3xs)" }}>
                {item.number}
              </p>
              <h3 className="heading-h6" style={{ color: "var(--neutral-white)", marginBottom: "var(--sp-2xs)" }}>
                {item.title}
              </h3>
              <p className="text-s" style={{ color: "rgba(255,255,255,0.8)", marginBottom: "var(--sp-m)" }}>
                {item.subtitle}
              </p>
              {item.cta && (
                <a
                  href={item.cta.href}
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
                  {item.cta.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
