"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { parseHeadline } from "@/lib/cms/parse-headline";
import type { ContentItem, ItemLayout } from "@/lib/cms/types";

// ─── Icon registry ───────────────────────────────────────────────────────────

const icons: Record<string, React.ReactNode> = {
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

// ─── Layout config derived from ItemLayout ───────────────────────────────────

type ImagePosition = "top" | "left" | "right" | "bottom" | "background" | "none";

interface CardConfig {
  imagePosition: ImagePosition;
  isQuote: boolean;
  isStat: boolean;
  isCentered: boolean;
}

function getCardConfig(layout: ItemLayout): CardConfig {
  switch (layout) {
    case "image-top":
      return { imagePosition: "top", isQuote: false, isStat: false, isCentered: false };
    case "image-left":
      return { imagePosition: "left", isQuote: false, isStat: false, isCentered: false };
    case "image-right":
      return { imagePosition: "right", isQuote: false, isStat: false, isCentered: false };
    case "overlay":
      return { imagePosition: "background", isQuote: false, isStat: false, isCentered: false };
    case "icon-card":
      return { imagePosition: "none", isQuote: false, isStat: false, isCentered: false };
    case "stat-card":
      return { imagePosition: "none", isQuote: false, isStat: true, isCentered: false };
    case "quote-card":
      return { imagePosition: "none", isQuote: true, isStat: false, isCentered: false };
    case "cta-centered":
    case "hero-full":
      return { imagePosition: "none", isQuote: false, isStat: false, isCentered: true };
    case "text-only":
    default:
      return { imagePosition: "none", isQuote: false, isStat: false, isCentered: false };
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CardImage({
  image,
  position,
  sizes,
}: {
  image: ContentItem["image"];
  position: ImagePosition;
  sizes?: string;
}) {
  if (!image || position === "none") return null;

  const aspectRatio =
    position === "top" || position === "bottom"
      ? "16 / 9"
      : position === "left" || position === "right"
        ? "4 / 3"
        : undefined;

  return (
    <div
      style={{
        position: position === "background" ? "absolute" : "relative",
        inset: position === "background" ? 0 : undefined,
        width: position === "left" || position === "right" ? "45%" : "100%",
        flexShrink: 0,
        aspectRatio,
        borderRadius: position === "background" ? undefined : "var(--radius-l)",
        overflow: "hidden",
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        style={{
          objectFit: "cover",
          objectPosition: image.objectPosition,
        }}
      />
    </div>
  );
}

function CardBody({
  item,
  config,
  isDark,
}: {
  item: ContentItem;
  config: CardConfig;
  isDark: boolean;
}) {
  const textColor = isDark ? "var(--neutral-white)" : "var(--brand-midnight)";
  const mutedColor = isDark ? "rgba(255,255,255,0.7)" : "var(--neutral-400)";
  const labelColor = isDark ? "rgba(255,255,255,0.5)" : "var(--neutral-400)";

  // ── Stat mode: jumbo number + title + description ──
  if (config.isStat) {
    return (
      <>
        <div>
          <h4
            className="jumbo-h"
            style={{ color: "inherit", marginBottom: "var(--sp-s)" }}
          >
            {item.number}
          </h4>
          <div className="heading-h6" style={{ color: "inherit" }}>
            {item.title}
          </div>
        </div>
        {item.content && (
          <p
            className="text-l"
            style={{ maxWidth: "23rem", color: "rgba(255,255,255,0.6)" }}
          >
            {item.content}
          </p>
        )}
      </>
    );
  }

  // ── Quote mode: metric + blockquote + author ──
  if (config.isQuote) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-xl)",
        }}
      >
        {item.metric && (
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
            {item.metric}
          </span>
        )}
        {item.quote && (
          <blockquote
            className="heading-h4"
            style={{
              color: textColor,
              fontStyle: "normal",
              fontWeight: 500,
            }}
          >
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        )}
        <div>
          {item.author && (
            <p
              style={{
                color: textColor,
                fontWeight: 600,
                fontSize: "var(--text-m)",
                marginBottom: "0.25rem",
              }}
            >
              {item.author}
            </p>
          )}
          {item.company && (
            <p style={{ color: "var(--neutral-300)", fontSize: "var(--text-s)" }}>
              {item.company}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Centered mode: jumbo headline + subtitle + CTAs (hero, CTA sections) ──
  if (config.isCentered) {
    return <CenteredBody item={item} />;
  }

  // ── Standard mode: icon + number + label + title + content + features + cta ──
  return (
    <>
      {/* Icon */}
      {item.icon && icons[item.icon] && (
        <div style={{ color: mutedColor, marginBottom: "var(--sp-m)" }}>
          {icons[item.icon]}
        </div>
      )}

      {/* Large decorative number */}
      {item.number && (
        <span
          style={{
            fontSize: "var(--jumbo-2)",
            fontWeight: 600,
            letterSpacing: "var(--ls-l)",
            lineHeight: "var(--lh)",
            color: isDark ? "rgba(255,255,255,0.15)" : "var(--brand-blue)",
            opacity: isDark ? 1 : 0.25,
            display: "block",
            marginBottom: "var(--sp-xs)",
          }}
        >
          {item.number}
        </span>
      )}

      {/* Label / eyebrow */}
      {item.label && (
        <p
          className="label-s"
          style={{ color: labelColor, marginBottom: "var(--sp-xs)" }}
        >
          {item.label}
        </p>
      )}

      {/* Title */}
      {item.title && (
        <h3
          className="heading-h5"
          style={{ color: textColor, marginBottom: "var(--sp-s)" }}
        >
          {item.title}
        </h3>
      )}

      {/* Subtitle */}
      {item.subtitle && (
        <p
          className="text-l"
          style={{ color: mutedColor, marginBottom: "var(--sp-s)" }}
        >
          {item.subtitle}
        </p>
      )}

      {/* Content / description */}
      {item.content && (
        <p className="text-l" style={{ color: mutedColor }}>
          {item.content}
        </p>
      )}

      {/* Features list */}
      {item.features && item.features.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "var(--sp-m) 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-xs)",
          }}
        >
          {item.features.map((f, i) => (
            <li
              key={i}
              className="text-m"
              style={{ color: mutedColor, paddingLeft: "1rem", position: "relative" }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: "var(--brand-blue)",
                }}
              >
                ·
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {item.cta && (
        <a
          href={item.cta.href}
          className="underline-link"
          style={{ marginTop: "var(--sp-m)", display: "inline-block" }}
        >
          {item.cta.label}
        </a>
      )}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export interface ContentCardProps {
  item: ContentItem;
  layout: ItemLayout;
  theme?: string;
  index?: number;
}

function CenteredBody({ item }: { item: ContentItem }) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {item.title && (
        <h2
          style={{
            fontSize: "var(--jumbo-1)",
            lineHeight: "var(--lh)",
            fontWeight: 600,
            letterSpacing: "var(--ls-l)",
            color: "var(--neutral-white)",
            maxWidth: "56rem",
            marginBottom: "var(--sp-l)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {parseHeadline(item.title)}
        </h2>
      )}

      {item.subtitle && (
        <p
          className="text-l"
          style={{
            color: "var(--neutral-300)",
            maxWidth: "38rem",
            marginBottom: "var(--sp-2xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          {item.subtitle}
        </p>
      )}

      {(item.cta || item.secondaryCta) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "var(--sp-m)",
            marginBottom: "var(--sp-2xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          {item.cta && (
            <a href={item.cta.href} className="g-button primary">
              <span>{item.cta.label}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
          {item.secondaryCta && (
            <a href={item.secondaryCta.href} className="g-button ghost">
              <span>{item.secondaryCta.label}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ContentCard({ item, layout, theme }: ContentCardProps) {
  const config = getCardConfig(layout);
  const isDark = theme === "dark" || theme === "gradient";

  const isHorizontal =
    config.imagePosition === "left" || config.imagePosition === "right";
  const imageFirst =
    config.imagePosition === "top" ||
    config.imagePosition === "left";

  const imageSizes = {
    top: "(max-width: 768px) 100vw, 33vw",
    left: "(max-width: 768px) 100vw, 50vw",
    right: "(max-width: 768px) 100vw, 50vw",
    bottom: "(max-width: 768px) 100vw, 33vw",
    background: "100vw",
    none: undefined,
  }[config.imagePosition];

  // Background/overlay mode
  if (config.imagePosition === "background") {
    return (
      <div style={{ position: "relative" }}>
        <CardImage
          image={item.image}
          position="background"
          sizes={imageSizes}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <CardBody item={item} config={config} isDark={true} />
        </div>
      </div>
    );
  }

  // Horizontal layout (image-left, image-right)
  if (isHorizontal) {
    const imageEl = (
      <CardImage
        image={item.image}
        position={config.imagePosition}
        sizes={imageSizes}
      />
    );
    const bodyEl = (
      <div style={{ flex: 1, minWidth: 0 }}>
        <CardBody item={item} config={config} isDark={isDark} />
      </div>
    );

    return (
      <div
        style={{
          display: "flex",
          gap: "var(--sp-xl)",
          alignItems: "flex-start",
        }}
      >
        {imageFirst ? (
          <>
            {imageEl}
            {bodyEl}
          </>
        ) : (
          <>
            {bodyEl}
            {imageEl}
          </>
        )}
      </div>
    );
  }

  // Vertical layout (image-top, image-bottom, none)
  return (
    <div>
      {imageFirst && (
        <div style={{ marginBottom: "var(--sp-l)" }}>
          <CardImage
            image={item.image}
            position={config.imagePosition}
            sizes={imageSizes}
          />
        </div>
      )}
      <CardBody item={item} config={config} isDark={isDark} />
      {!imageFirst && config.imagePosition === "bottom" && (
        <div style={{ marginTop: "var(--sp-l)" }}>
          <CardImage
            image={item.image}
            position={config.imagePosition}
            sizes={imageSizes}
          />
        </div>
      )}
    </div>
  );
}
