"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { Card, Button, Heading, Icon } from "../primitives";
import { themeColors } from "@/lib/theme-colors";
import type { LayoutProps } from "./LayoutProps";

function ExpandIcon() {
  return (
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
  );
}

/** Collapsed accordion card — vertical text + expand icon */
function CollapsedCard({ title }: { title?: string }) {
  return (
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
        {title}
      </span>
      <ExpandIcon />
    </div>
  );
}

/** Active accordion card — full image + frosted panel overlay */
function ActiveCard({
  item,
  isPriority,
}: {
  item: LayoutProps["items"][0];
  isPriority: boolean;
}) {
  const colors = themeColors("dark");

  return (
    <>
      {/* Background image */}
      {item.image && (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          style={{ objectFit: "cover" }}
          priority={isPriority}
        />
      )}

      {/* Gradient overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
        }}
      />

      {/* Frosted info panel */}
      <Card
        variant="frosted-heavy"
        padding="var(--sp-xl)"
        style={{
          position: "absolute",
          top: "var(--sp-xl)",
          left: "var(--sp-xl)",
          bottom: "var(--sp-xl)",
          width: "17.3125rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: colors.text,
        }}
      >
        <div>
          <p
            className="label-s"
            style={{
              color: colors.accent,
              marginBottom: "var(--sp-xs)",
            }}
          >
            {item.number}
          </p>
          <Heading
            level={3}
            size="h5"
            theme="dark"
            style={{ marginBottom: "var(--sp-m)" }}
          >
            {item.title || ""}
          </Heading>
          <p className="text-l" style={{ color: colors.muted }}>
            {item.subtitle}
          </p>
        </div>
        {item.cta && <Button href={item.cta.href} variant="primary">{item.cta.label}{item.cta.icon && <Icon name={item.cta.icon} size={16} />}</Button>}
      </Card>
    </>
  );
}

/** Mobile product card — image bg + frosted panel at bottom */
function MobileCard({ item }: { item: LayoutProps["items"][0] }) {
  const colors = themeColors("dark");

  return (
    <div
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

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

      {/* Frosted info panel */}
      <Card
        variant="frosted-heavy"
        padding="var(--sp-l)"
        style={{
          position: "absolute",
          bottom: "var(--sp-l)",
          left: "var(--sp-l)",
          right: "var(--sp-l)",
          color: colors.text,
        }}
      >
        <p
          className="label-s"
          style={{ color: colors.accent, marginBottom: "var(--sp-3xs)" }}
        >
          {item.number}
        </p>
        <Heading
          level={3}
          size="h6"
          theme="dark"
          style={{ marginBottom: "var(--sp-2xs)" }}
        >
          {item.title || ""}
        </Heading>
        <p
          className="text-s"
          style={{ color: colors.muted, marginBottom: "var(--sp-m)" }}
        >
          {item.subtitle}
        </p>
        {item.cta && <Button href={item.cta.href} variant="primary">{item.cta.label}{item.cta.icon && <Icon name={item.cta.icon} size={16} />}</Button>}
      </Card>
    </div>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

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
                background: isActive
                  ? "var(--brand-midnight)"
                  : "var(--neutral-white)",
                border: isActive ? "none" : "1px solid var(--neutral-200)",
              }}
            >
              {isActive ? (
                <ActiveCard item={item} isPriority={i === 0} />
              ) : (
                <CollapsedCard title={item.title} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Stacked cards */}
      <div className="use-cases-mobile">
        {items.map((item) => (
          <MobileCard key={item.id || item.title} item={item} />
        ))}
      </div>
    </>
  );
}
