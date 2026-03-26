import Image from "next/image";
import type {
  SectionBlock,
  CompositeBlock,
  PageBlock,
  SectionConfig,
  ContentItem,
  CmsImage,
} from "@/lib/types";
import { isCompositeBlock } from "@/lib/types";
import { PRESETS } from "@/lib/presets";
import { SectionHeader } from "./SectionHeader";
import { CollectionRenderer } from "./CollectionRenderer";
import { SectionShell } from "./SectionShell";
import { FadeStrip } from "./capabilities/FadeStrip";
import { Text } from "./primitives";

interface SectionProps {
  block: SectionBlock;
  insideComposite?: boolean;
  /** Items from a merged next-block (e.g., hero absorbs logo marquee) */
  mergedBlock?: SectionBlock;
  /** Below-fold sections get content-visibility: auto for rendering perf */
  belowFold?: boolean;
}

const paddingScale: Record<string, string> = {
  none: "0",
  sm: "var(--sp-xl)",       // 1.5rem
  md: "var(--sp-3xl)",      // 3rem
  lg: "var(--sp-4xl)",      // 5rem
  xl: "var(--sp-6xl)",      // 8rem
  "2xl": "10rem",
  "3xl": "12rem",
};

function sectionStyles(config: SectionConfig): React.CSSProperties {
  const styles: React.CSSProperties = {};

  // Background
  if (config.bgColor) styles.backgroundColor = config.bgColor;
  if (config.bgGradient) styles.backgroundImage = config.bgGradient;
  if (config.bgImage) {
    styles.backgroundImage = `url(${config.bgImage})`;
    styles.backgroundSize = "cover";
    styles.backgroundPosition = "center";
  }

  // Padding — shorthand sets all sides, individual overrides take precedence
  const pad = paddingScale[config.padding || "lg"];
  styles.paddingTop = pad;
  styles.paddingBottom = pad;
  if (config.paddingTop) styles.paddingTop = paddingScale[config.paddingTop];
  if (config.paddingBottom) styles.paddingBottom = paddingScale[config.paddingBottom];
  if (config.paddingLeft) styles.paddingLeft = paddingScale[config.paddingLeft];
  if (config.paddingRight) styles.paddingRight = paddingScale[config.paddingRight];

  return styles;
}

/**
 * Renders a single SectionBlock using its preset configuration.
 * Capabilities from the preset drive structural behaviors (background, animations, decorators).
 */
export function Section({ block, insideComposite, mergedBlock, belowFold }: SectionProps) {
  const preset = PRESETS[block.preset];

  if (!preset) {
    if (process.env.NODE_ENV === "development") {
      return (
        <section style={{ background: "#fee2e2", padding: "2rem" }}>
          <div className="gc">
            <p style={{ color: "#991b1b" }}>Unknown preset: &quot;{block.preset}&quot;</p>
          </div>
        </section>
      );
    }
    return null;
  }

  if (!block.items?.length && preset.minItems) return null;

  const config: SectionConfig = { ...preset.sectionDefaults, ...block.sectionConfig };
  const isDark = config.theme === "dark" || config.theme === "gradient";
  const headingLevel = config.headingLevel || 2;
  const caps = preset.capabilities;

  // Filter items to activeFields
  const activeFields = block.displayFields?.length ? block.displayFields : preset.activeFields;
  const filteredItems = block.items.map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(
        ([key]) => activeFields.includes(key as keyof ContentItem) || key === "id"
      )
    )
  ) as ContentItem[];

  // Resolve background image for scroll-overlay capability
  let bgImage: CmsImage | undefined;
  if (caps?.backgroundMode === "scroll-overlay") {
    if (caps.backgroundImageFrom === "item") {
      bgImage = block.items[0]?.bgImage;
    }
  }

  // Has any capabilities that need the client shell?
  const needsShell = !!(
    caps?.backgroundMode === "scroll-overlay" ||
    caps?.entranceAnimation === "fade-up-stagger" ||
    caps?.decorators?.length ||
    caps?.bottomGradient ||
    caps?.bottomSpacer ||
    caps?.fullHeight ||
    caps?.contentWrapper
  );

  // Section header + collection content
  // Main content — may be wrapped in entrance animation by SectionShell
  const mainContent = (
    <div className="gc" style={{ position: "relative" }}>
      <SectionHeader config={config} headingLevel={headingLevel} id={`${block.id}-heading`} />
      {config.headline && <div style={{ marginBottom: "var(--sp-3xl)" }} />}
      <CollectionRenderer
        blockId={block.id}
        collection={preset.collection}
        itemLayout={preset.itemLayout}
        items={filteredItems}
        theme={config.theme || "light"}
        animation={config.animation || "reveal"}
        sectionConfig={config}
      />
    </div>
  );

  // Merged block rendered outside animation wrapper — appears instantly
  const mergedContent = mergedBlock ? <MergedSection block={mergedBlock} /> : null;

  return (
    <>
      <section
        id={config.sectionId || undefined}
        aria-labelledby={config.headline || block.items?.[0]?.title ? `${block.id}-heading` : undefined}
        data-header-theme={isDark ? "dark" : "light"}
        data-below-fold={belowFold || undefined}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: isDark
            ? insideComposite ? "transparent" : "var(--brand-midnight)"
            : undefined,
          position: "relative",
          overflow: (caps?.fullHeight || preset.collection.layout === "sticky-scroll") ? undefined : "hidden",
          ...sectionStyles(config),
        }}
      >
        {needsShell ? (
          <SectionShell
            capabilities={caps!}
            bgImage={bgImage}
            isDark={isDark}
          >
            {mainContent}
            {mergedContent}
          </SectionShell>
        ) : (
          <>
            {mainContent}
            {mergedContent}
          </>
        )}
      </section>

      {/* After-section elements */}
      {caps?.afterSection === "fade-strip" && <FadeStrip />}
      {caps?.afterSection === "gradient-bleed" && <FadeStrip height="8rem" />}
    </>
  );
}

/**
 * Renders a merged block inside a parent section (e.g., logo marquee inside hero).
 * Uses the merged block's own preset for layout/items but doesn't wrap in <section>.
 */
function MergedSection({ block }: { block: SectionBlock }) {
  const preset = PRESETS[block.preset];
  if (!preset || !block.items?.length) return null;

  const config: SectionConfig = { ...preset.sectionDefaults, ...block.sectionConfig };

  return (
    <div style={{ position: "relative", zIndex: 2, paddingBottom: "var(--sp-4xl)" }}>
      {config.label && (
        <Text variant="label" theme={config.theme} style={{ textAlign: "center", marginBottom: "var(--sp-xl)" }}>
          {config.label}
        </Text>
      )}
      <CollectionRenderer
        blockId={block.id}
        collection={preset.collection}
        itemLayout={preset.itemLayout}
        items={block.items}
        theme={config.theme || "dark"}
        animation={config.animation || "none"}
        sectionConfig={config}
      />
    </div>
  );
}

/**
 * Renders a CompositeBlock — multiple SectionBlocks under one shared wrapper.
 * Supports: gradient backgrounds, sticky full-viewport backgrounds, overlap with previous section.
 */
export function CompositeSection({ block }: { block: CompositeBlock }) {
  const config = block.sectionConfig || {};
  const isDark = config.theme === "dark" || config.theme === "gradient";
  const hasStickyBg = config.stickyBg && config.stickyBgSrc;

  if (hasStickyBg) {
    return <StickyBgComposite block={block} config={config} isDark={isDark} />;
  }

  return (
    <div
      style={{
        position: "relative",
        ...(config.bgGradient ? { backgroundImage: config.bgGradient } : {}),
        ...(config.bgColor ? { backgroundColor: config.bgColor } : {}),
      }}
    >
      {block.blocks.map((subBlock) => (
        <Section key={subBlock.id} block={subBlock} insideComposite />
      ))}
      {isDark && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8rem",
            background: "linear-gradient(180deg, transparent 0%, #000000 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

/**
 * Composite with a sticky full-viewport background image.
 * The background stays fixed while child blocks scroll over it.
 * Used by the Story section pattern.
 */
function StickyBgComposite({
  block,
  config,
  isDark,
}: {
  block: CompositeBlock;
  config: SectionConfig;
  isDark: boolean;
}) {
  return (
    <div
      data-header-theme={isDark ? "dark" : "light"}
      style={{
        position: "relative",
        marginTop: config.overlapPrevious || undefined,
      }}
    >
      {/* Sticky background image — z:0 so hero's fade strip (z:2) covers it */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={config.stickyBgSrc!}
            alt={config.stickyBgAlt || ""}
            fill
            sizes="100vw"
            quality={90}
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.35)",
            }}
          />
        </div>
      </div>

      {/* Content overlay — pulled up over the sticky background */}
      <div style={{ marginTop: "-100vh", position: "relative", zIndex: 1 }}>
        {block.blocks.map((subBlock) => (
          <Section key={subBlock.id} block={subBlock} insideComposite />
        ))}
      </div>
    </div>
  );
}

/**
 * Top-level block renderer — handles both SectionBlock and CompositeBlock.
 */
export function BlockRenderer({ block, mergedBlock, belowFold }: { block: PageBlock; mergedBlock?: SectionBlock; belowFold?: boolean }) {
  if (isCompositeBlock(block)) {
    return <CompositeSection block={block} />;
  }
  return <Section block={block} mergedBlock={mergedBlock} belowFold={belowFold} />;
}
