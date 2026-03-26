"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { frostHeavy } from "@/lib/frost";
import { themeColors } from "@/lib/theme-colors";
import { Heading, Text, Button, Icon } from "../primitives";
import { ItemRenderer } from "../ItemRenderer";
import type { LayoutProps } from "./LayoutProps";

/**
 * Frosted panel over a background image — left-aligned on wide tiles, bottom on narrow.
 */
function FrostedImageCard({
  item,
  isWide,
}: {
  item: LayoutProps["items"][0];
  isWide: boolean;
}) {
  const colors = themeColors("dark");

  return (
    <>
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isWide
            ? "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

      {/* Frosted info panel — left on wide, bottom on narrow */}
      <div
        style={{
          ...frostHeavy,
          position: "absolute",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: colors.text,
          ...(isWide
            ? {
                top: "var(--sp-xl)",
                left: "var(--sp-xl)",
                bottom: "var(--sp-xl)",
                width: "17.3125rem",
                padding: "var(--sp-xl)",
              }
            : {
                bottom: "var(--sp-l)",
                left: "var(--sp-l)",
                right: "var(--sp-l)",
                padding: "var(--sp-l)",
              }),
        }}
      >
        <div>
          {item.label && (
            <Text variant="label" theme="dark" style={{ color: colors.accent, marginBottom: "var(--sp-xs)" }}>
              {item.label}
            </Text>
          )}
          {item.title && (
            <Heading level={3} theme="dark">
              {item.title}
            </Heading>
          )}
          {isWide && item.content && (
            <Text size="s" theme="dark">
              {item.content}
            </Text>
          )}
        </div>
        {item.cta && (
          <Button variant="primary" style={{ marginTop: "var(--sp-m)" }}>
            {item.cta.label}
            {item.cta.icon && <Icon name={item.cta.icon} size={16} />}
          </Button>
        )}
      </div>
    </>
  );
}

/**
 * Bento grid layout — 12-column grid with variable-span cards.
 * Entrance animation controlled by `animation` prop — off by default.
 */
export default function BentoLayout({ items, itemLayout, theme, animation }: LayoutProps) {
  const shouldAnimate = animation === "stagger";
  const { ref, isVisible } = useInView(shouldAnimate ? 0.1 : 1);
  const isDark = theme === "dark" || theme === "gradient";
  const show = shouldAnimate ? isVisible : true;

  return (
    <div
      ref={shouldAnimate ? ref as React.RefObject<HTMLDivElement> : undefined}
      className="stats-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "var(--grid-gap)",
      }}
    >
      {items.map((item, i) => {
        const hasBgImage = !!item.bgImage?.src;
        const colSpan = item.colSpan || (i % 2 === 0 ? 7 : 5);
        const isWide = colSpan >= 7;
        const href = item.cta?.href;

        const cardStyle: React.CSSProperties = {
          gridColumn: `span ${colSpan}`,
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-l)",
          color: isDark ? "var(--neutral-white)" : "var(--brand-midnight)",
          cursor: href ? "pointer" : undefined,
          ...(shouldAnimate
            ? {
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, box-shadow 0.3s ease`,
              }
            : {}),
          ...(hasBgImage
            ? {
                backgroundImage: `url(${item.bgImage!.src})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                minHeight: isWide ? "22rem" : "18rem",
              }
            : {
                backgroundColor: item.color || (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)"),
                ...(isDark
                  ? {
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
                  : {
                      border: "1px solid rgba(0,0,0,0.06)",
                    }),
              }),
        };

        const content = hasBgImage ? (
          <FrostedImageCard item={item} isWide={isWide} />
        ) : (
          <ItemRenderer item={item} layout={itemLayout} theme={theme} index={i} />
        );

        if (href) {
          return (
            <Link
              key={item.id || i}
              href={href}
              className="bento-tile"
              style={{
                ...cardStyle,
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {content}
            </Link>
          );
        }

        return (
          <div key={item.id || i} className="stats-card" style={cardStyle}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
