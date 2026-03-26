import type { SectionPreset } from "./types"

export const PRESETS: Record<string, SectionPreset> = {
  // ─── Hero ────────────────────────────────────────────────────────────────────

  hero: {
    slug: "hero",
    label: "Hero (Full Viewport)",
    collection: { layout: "single" },
    itemLayout: "cta-centered",
    sectionDefaults: { theme: "dark", paddingTop: "3xl", paddingBottom: "sm" },
    activeFields: ["title", "subtitle", "cta", "secondaryCta", "bgImage", "number", "label"],
    maxItems: 1,
    capabilities: {
      fullBleed: false,
      backgroundMode: "scroll-overlay",
      backgroundImageFrom: "item",
      afterSection: "fade-strip",
      entranceAnimation: "fade-up-stagger",
      mergeNextPreset: "marquee-logos",
      bottomGradient: true,
      bottomSpacer: true,
    },
  },

  // ─── Story ───────────────────────────────────────────────────────────────────

  "story-sticky": {
    slug: "story-sticky",
    label: "Story (Sticky Background + Tags)",
    collection: { layout: "single" },
    itemLayout: "text-only",
    sectionDefaults: { theme: "dark", stickyBg: true },
    activeFields: ["title", "content", "bgImage", "tags"],
    maxItems: 1,
  },

  // ─── Benefits ────────────────────────────────────────────────────────────────

  "sticky-scroll": {
    slug: "sticky-scroll",
    label: "Benefits (Sticky Scroll)",
    collection: { layout: "sticky-scroll" },
    itemLayout: "image-left",
    sectionDefaults: { theme: "light", animation: "sticky-scroll" },
    activeFields: ["number", "title", "content", "image"],
    minItems: 2,
  },

  // ─── Accordion ───────────────────────────────────────────────────────────────

  "accordion-horizontal": {
    slug: "accordion-horizontal",
    label: "Products (Horizontal Accordion)",
    collection: { layout: "accordion", orientation: "horizontal" },
    itemLayout: "overlay",
    sectionDefaults: { theme: "light", animation: "reveal" },
    activeFields: ["id", "number", "title", "subtitle", "content", "image", "cta", "specs", "label"],
    minItems: 3,
    maxItems: 8,
  },

  "accordion-vertical": {
    slug: "accordion-vertical",
    label: "FAQ / Vertical Accordion",
    collection: { layout: "accordion", orientation: "vertical" },
    itemLayout: "text-only",
    sectionDefaults: { theme: "light", animation: "reveal" },
    activeFields: ["title", "content", "icon", "cta"],
    minItems: 2,
  },

  // ─── Tabs ────────────────────────────────────────────────────────────────────

  "tabs-feature": {
    slug: "tabs-feature",
    label: "How It Works (Tabbed Features)",
    collection: { layout: "tabs", orientation: "horizontal" },
    itemLayout: "image-left",
    sectionDefaults: { theme: "light", animation: "reveal" },
    activeFields: ["id", "label", "title", "content", "features", "image", "cta"],
  },

  "tabs-vertical": {
    slug: "tabs-vertical",
    label: "Vertical Tabs",
    collection: { layout: "tabs", orientation: "vertical" },
    itemLayout: "image-left",
    sectionDefaults: { theme: "light", animation: "reveal" },
    activeFields: ["id", "label", "title", "content", "image"],
  },

  // ─── Grid ────────────────────────────────────────────────────────────────────

  "grid-icon-card": {
    slug: "grid-icon-card",
    label: "Intelligence (Icon Card Grid)",
    collection: { layout: "grid", columns: 2 },
    itemLayout: "icon-card",
    sectionDefaults: { theme: "dark", animation: "stagger" },
    activeFields: ["id", "icon", "title", "content"],
    minItems: 2,
    capabilities: {
      decorators: ["grid-pattern"],
    },
  },

  "grid-media": {
    slug: "grid-media",
    label: "Media Card Grid",
    collection: { layout: "grid", columns: 3 },
    itemLayout: "image-top",
    sectionDefaults: { theme: "light", animation: "stagger" },
    activeFields: ["image", "label", "title", "content", "cta", "date"],
  },

  // ─── Carousel ────────────────────────────────────────────────────────────────

  "testimonial-carousel": {
    slug: "testimonial-carousel",
    label: "Testimonials (Carousel)",
    collection: { layout: "carousel" },
    itemLayout: "quote-card",
    sectionDefaults: { theme: "dark" },
    activeFields: ["image", "quote", "author", "company", "metric"],
    minItems: 1,
  },

  // ─── Bento ───────────────────────────────────────────────────────────────────

  "bento-stats": {
    slug: "bento-stats",
    label: "Stats (Bento Grid)",
    collection: { layout: "bento" },
    itemLayout: "stat-card",
    sectionDefaults: { theme: "dark", animation: "stagger" },
    activeFields: ["number", "title", "content", "color", "bgImage", "colSpan"],
    minItems: 2,
  },

  // ─── CTA ─────────────────────────────────────────────────────────────────────

  "cta-jumbo": {
    slug: "cta-jumbo",
    label: "CTA (Jumbo, Centered)",
    collection: { layout: "single" },
    itemLayout: "cta-centered",
    sectionDefaults: { theme: "dark" },
    activeFields: ["title", "subtitle", "cta", "secondaryCta"],
    maxItems: 1,
    capabilities: {
      decorators: ["ambient-glow"],
    },
  },

  // ─── Marquee ─────────────────────────────────────────────────────────────────

  "marquee-logos": {
    slug: "marquee-logos",
    label: "Logo Marquee",
    collection: { layout: "marquee", direction: "ltr", speed: 40 },
    itemLayout: "image-top",
    sectionDefaults: { theme: "dark" },
    activeFields: ["image", "label"],
  },

  "marquee-tags": {
    slug: "marquee-tags",
    label: "Tag Marquee (LTR)",
    collection: { layout: "marquee", direction: "ltr", speed: 30 },
    itemLayout: "text-only",
    sectionDefaults: { theme: "dark", padding: "none" },
    activeFields: ["label", "color"],
  },

  "marquee-tags-rtl": {
    slug: "marquee-tags-rtl",
    label: "Tag Marquee (RTL)",
    collection: { layout: "marquee", direction: "rtl", speed: 30 },
    itemLayout: "text-only",
    sectionDefaults: { theme: "dark", padding: "none" },
    activeFields: ["label", "color"],
  },

  // ─── Story sub-presets ───────────────────────────────────────────────────────

  "story-headline": {
    slug: "story-headline",
    label: "Story Headline (Frosted Card, Centered, Full Height)",
    collection: { layout: "single" },
    itemLayout: "text-only",
    sectionDefaults: { theme: "dark", padding: "none" },
    activeFields: ["title"],
    maxItems: 1,
    capabilities: {
      fullHeight: true,
      contentAlign: "center",
      contentWrapper: "frosted-card",
    },
  },

  "story-body": {
    slug: "story-body",
    label: "Story Body (Frosted Card, Centered)",
    collection: { layout: "single" },
    itemLayout: "text-only",
    sectionDefaults: { theme: "dark", padding: "lg", paddingBottom: "3xl" },
    activeFields: ["title", "content"],
    maxItems: 1,
    capabilities: {
      contentAlign: "center",
      contentWrapper: "frosted-card",
    },
  },

  // ─── Stack ───────────────────────────────────────────────────────────────────

  stack: {
    slug: "stack",
    label: "Vertical Stack",
    collection: { layout: "stack" },
    itemLayout: "image-top",
    sectionDefaults: { theme: "light", animation: "reveal" },
    activeFields: ["image", "title", "content", "cta"],
  },
} as const satisfies Record<string, SectionPreset>
