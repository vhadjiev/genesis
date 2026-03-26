"use client";

import { useInView } from "@/hooks/useInView";
import { themeColors } from "@/lib/theme-colors";
import { Card, Button, Badge, Heading, Icon, Text } from "./primitives";
import type { CmsCta } from "@/lib/types";
import type { ImagePosition, CardVariant } from "./primitives";
import type { ContentItem, ItemLayout } from "@/lib/types";

/** Renders a CmsCta as a Button with its optional trailing icon */
/** Renders a CmsCta as a Button — all props come from the CTA data */
function renderCta(cta: CmsCta, style?: React.CSSProperties) {
  return (
    <Button
      href={cta.href}
      variant={(cta.variant || "primary") as "primary"}
      size={cta.size}
      style={style}
    >
      {cta.label}
      {cta.icon && <Icon name={cta.icon} size={16} />}
    </Button>
  );
}

// ─── Layout → Card config mapping ───────────────────────────────────────────

interface ContentConfig {
  imagePosition: ImagePosition;
  cardVariant: CardVariant;
  mode: "standard" | "stat" | "quote" | "centered";
}

function getContentConfig(layout: ItemLayout): ContentConfig {
  switch (layout) {
    case "image-top":
      return { imagePosition: "top", cardVariant: "flat", mode: "standard" };
    case "image-left":
      return { imagePosition: "left", cardVariant: "flat", mode: "standard" };
    case "image-right":
      return { imagePosition: "right", cardVariant: "flat", mode: "standard" };
    case "overlay":
      return { imagePosition: "background", cardVariant: "flat", mode: "standard" };
    case "icon-card":
      return { imagePosition: "none", cardVariant: "flat", mode: "standard" };
    case "stat-card":
      return { imagePosition: "none", cardVariant: "flat", mode: "stat" };
    case "quote-card":
      return { imagePosition: "none", cardVariant: "flat", mode: "quote" };
    case "cta-centered":
    case "hero-full":
      return { imagePosition: "none", cardVariant: "flat", mode: "centered" };
    case "text-only":
    default:
      return { imagePosition: "none", cardVariant: "flat", mode: "standard" };
  }
}

// ─── Mode renderers ──────────────────────────────────────────────────────────

function StatBody({ item, theme }: { item: ContentItem; theme?: string }) {
  const colors = themeColors(theme);
  return (
    <>
      <div>
        <Heading level={4} size="jumbo" theme={theme} style={{ marginBottom: "var(--sp-s)" }}>
          {item.number || ""}
        </Heading>
        <Heading level={5} size="h6" theme={theme} style={{ margin: 0 }}>
          {item.title || ""}
        </Heading>
      </div>
      {item.content && (
        <Text size="l" theme={theme} style={{ maxWidth: "23rem" }}>
          {item.content}
        </Text>
      )}
    </>
  );
}

function QuoteBody({ item, theme }: { item: ContentItem; theme?: string }) {
  const colors = themeColors(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xl)" }}>
      {item.metric && <Badge text={item.metric} variant="metric" />}
      {item.quote && (
        <blockquote style={{ fontStyle: "normal", fontWeight: 500, margin: 0 }}>
          <Heading level={4} size="h4" theme={theme}>
            {`\u201C${item.quote}\u201D`}
          </Heading>
        </blockquote>
      )}
      <div>
        {item.author && (
          <p style={{ color: colors.text, fontWeight: 600, fontSize: "var(--text-m)", marginBottom: "0.25rem" }}>
            {item.author}
          </p>
        )}
        {item.company && (
          <p style={{ color: colors.muted, fontSize: "var(--text-s)" }}>
            {item.company}
          </p>
        )}
      </div>
    </div>
  );
}

function CenteredBody({ item, headingLevel = 2 }: { item: ContentItem; headingLevel?: number }) {
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
        <Heading
          level={headingLevel as 1 | 2 | 3 | 4 | 5 | 6}
          size="jumbo"
          theme="dark"
          style={{
            maxWidth: "56rem",
            marginBottom: "var(--sp-l)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {item.title}
        </Heading>
      )}

      {item.subtitle && (
        <Text
          size="l"
          theme="dark"
          style={{
            maxWidth: "38rem",
            marginBottom: "var(--sp-2xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          {item.subtitle}
        </Text>
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
          {item.cta && renderCta(item.cta)}
          {item.secondaryCta && renderCta(item.secondaryCta)}
        </div>
      )}
    </div>
  );
}

function StandardBody({ item, theme }: { item: ContentItem; theme?: string }) {
  const colors = themeColors(theme);
  return (
    <>
      {item.icon && (
        <div style={{ color: colors.muted, marginBottom: "var(--sp-m)" }}>
          <Icon name={item.icon} size={28} />
        </div>
      )}

      {item.number && (
        <span
          style={{
            fontSize: "var(--jumbo-2)",
            fontWeight: 600,
            letterSpacing: "var(--ls-l)",
            lineHeight: "var(--lh)",
            color: colors.accent,
            opacity: theme === "dark" ? 1 : 0.25,
            display: "block",
            marginBottom: "var(--sp-xs)",
          }}
        >
          {item.number}
        </span>
      )}

      {item.label && (
        <Text variant="label" theme={theme} style={{ marginBottom: "var(--sp-xs)" }}>
          {item.label}
        </Text>
      )}

      {item.title && (
        <Heading level={3} size="h5" theme={theme} style={{ marginBottom: "var(--sp-s)" }}>
          {item.title}
        </Heading>
      )}

      {item.subtitle && (
        <Text size="l" theme={theme} style={{ marginBottom: "var(--sp-s)" }}>
          {item.subtitle}
        </Text>
      )}

      {item.content && (
        <Text size="l" theme={theme}>
          {item.content}
        </Text>
      )}

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
            <Text key={i} as="li" size="m" theme={theme} style={{ paddingLeft: "1rem", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: colors.accent }}>·</span>
              {f}
            </Text>
          ))}
        </ul>
      )}

      {item.cta && renderCta(item.cta, { marginTop: "var(--sp-m)" })}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export interface ContentProps {
  item: ContentItem;
  layout: ItemLayout;
  theme?: string;
  /** Override card variant (e.g., frosted for accordion panels) */
  cardVariant?: CardVariant;
  /** Make the whole card a link */
  href?: string;
  /** Override image sizes hint */
  imageSizes?: string;
  /** Heading level for the main title (1 for hero, 2 for sections, 3 for items) */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  index?: number;
}

/**
 * CMS content renderer. Composes Card + body mode based on ItemLayout.
 * This is the "smart" component that knows about ContentItem and dispatches
 * to the right atom composition.
 */
export function Content({
  item,
  layout,
  theme,
  cardVariant: variantOverride,
  href,
  imageSizes,
  headingLevel,
}: ContentProps) {
  const config = getContentConfig(layout);
  const variant = variantOverride || config.cardVariant;

  // Render the body based on mode
  let body: React.ReactNode;
  switch (config.mode) {
    case "stat":
      body = <StatBody item={item} theme={theme} />;
      break;
    case "quote":
      body = <QuoteBody item={item} theme={theme} />;
      break;
    case "centered":
      body = <CenteredBody item={item} headingLevel={headingLevel} />;
      break;
    default:
      body = <StandardBody item={item} theme={theme} />;
  }

  return (
    <Card
      image={item.image}
      imagePosition={config.imagePosition}
      imageSizes={imageSizes}
      variant={variant}
      href={href}
    >
      {body}
    </Card>
  );
}
