# Abstract UI Component System for CMS-Driven Sections

## Context

The v2 landing page has 8 hardcoded sections. We need an abstraction layer that decouples **content shape** from **presentation**, so sections become CMS-configurable blocks. The goal: a CMS editor picks a layout preset, fills in content items, and the system renders the right section.

---

## Current Section Inventory

| # | Section | Pattern | Inner Item Shape |
|---|---------|---------|-----------------|
| 1 | Hero | Single + logo marquee | headline, subheading, CTA, bgImage |
| 2 | Story | Sticky bg + frosted card + tag marquees | headline, body, badge, tags[] |
| 3 | Benefits | Sticky scroll (left text + right images) | number, heading, description, image |
| 4 | Products | Horizontal accordion | number, name, tagline, image, CTA, accent |
| 5 | How It Works | Tabs with step grids | tab name, steps[]{number, text} |
| 6 | Intelligence | 2x2 icon card grid | icon, title, description |
| 7 | Proof - Testimonials | Carousel | image, quote, author, company, metric |
| 7 | Proof - Stats | Bento grid | number, title, description, bgImage, colSpan |
| 8 | CTA | Single centered | headline (gradient), CTAs, trust line |

**Key observation**: Every section is a **collection of items** with a **section wrapper** and a **collection layout**. The items share many overlapping fields but each section uses a different subset.

---

## Three Options

### Option A: Fully Atomic

One universal `ContentItem` shape. One `ItemLayout` enum controls how a single item renders. One `CollectionLayout` enum controls how the group renders.

```typescript
interface ContentItem {
  id?: string
  label?: string          // eyebrow/badge
  title?: string
  subtitle?: string
  content?: string        // body text or richtext
  number?: string         // "01", "3,000+"
  image?: { src: string; alt: string }
  bgImage?: { src: string; alt: string }
  icon?: string
  cta?: { label: string; href: string; variant?: string }
  secondaryCta?: { label: string; href: string; variant?: string }
  author?: string
  company?: string
  quote?: string
  metric?: string
  color?: string
  gradient?: string
  colSpan?: number
  tags?: { label: string; variant?: string }[]
  features?: string[]
  specs?: string[]
  date?: string
}

type ItemLayout = "image-top" | "image-left" | "overlay" | "text-only"
  | "icon-card" | "stat-card" | "quote-card" | "hero-full" | "cta-centered"

type CollectionLayout = "carousel" | "accordion" | "tabs" | "sticky-scroll"
  | "bento" | "grid" | "marquee" | "stack" | "single"

interface SectionBlock {
  sectionConfig: SectionConfig
  collectionLayout: CollectionLayout
  itemLayout: ItemLayout
  items: ContentItem[]
}
```

**Tradeoffs:**
- (+) Maximum CMS simplicity — one item schema in DB for all blocks
- (+) Adding sections = adding enum values, not new components
- (-) `ItemLayout` becomes a long enum with complex switch rendering
- (-) No compile-time enforcement of which fields matter per layout
- (-) Layout concerns (colSpan) leak into the data atom

---

### Option B: Layered (Specialized Card Types)

Named card types each with only their relevant fields. Collection layouts remain generic.

```typescript
interface MediaCard { type: "media"; image: Image; title: string; content?: string; cta?: CTA; label?: string; date?: string }
interface FeatureCard { type: "feature"; icon?: string; number?: string; title: string; content: string; features?: string[] }
interface TestimonialCard { type: "testimonial"; image: Image; quote: string; author: string; company: string; metric?: string }
interface StatCard { type: "stat"; number: string; title: string; content?: string; bgImage?: Image; colSpan?: number; color?: string }
interface AccordionCard { type: "accordion"; title: string; content: string; image: Image; cta?: CTA }
type AnyCard = MediaCard | FeatureCard | TestimonialCard | StatCard | AccordionCard

interface SectionBlock<T extends AnyCard> {
  sectionConfig: SectionConfig
  collectionConfig: { layout: CollectionLayout; columns?: number }
  items: T[]
}
```

**Tradeoffs:**
- (+) Strongest TypeScript guarantees — each card has only its fields
- (+) Small focused card components, easy to test
- (-) CMS needs separate field schemas per card type (7+ schemas)
- (-) `FeatureCard` becomes a catch-all (Hero, Story, Intelligence, CTA all use it)
- (-) CMS author must know which card type to pick — cognitive overhead

---

### Option C: Hybrid (Universal Item + Presentation Presets) -- RECOMMENDED

Single `ContentItem` shape (like A), but presentation controlled by named **presets** that bundle itemLayout + collectionLayout + defaults + which fields are active. CMS editors pick a preset, see only relevant fields.

```typescript
interface ContentItem { /* same universal shape as Option A */ }

interface CollectionConfig {
  layout: CollectionLayout
  orientation?: "horizontal" | "vertical"  // for accordion, tabs
  columns?: number                          // for grid
  direction?: "ltr" | "rtl"                // for marquee
  speed?: number                            // for marquee (seconds)
}

interface SectionPreset {
  slug: string
  label: string                        // shown in CMS block picker
  collection: CollectionConfig
  itemLayout: ItemLayout
  sectionDefaults: Partial<SectionConfig>
  activeFields: (keyof ContentItem)[]  // controls which fields show in CMS admin
  minItems?: number
  maxItems?: number
}

interface SectionBlock {
  preset: string                        // references SectionPreset.slug
  sectionConfig?: Partial<SectionConfig> // overrides preset defaults
  items: ContentItem[]
}
```

**Preset registry (all 8+ sections):**

| Preset Slug | Collection | Orientation | Item Layout | Active Fields |
|---|---|---|---|---|
| `hero` | single | — | hero-full | title, subtitle, cta, bgImage |
| `story-sticky` | single | — | text-only | title, content, bgImage, tags |
| `sticky-scroll` | sticky-scroll | — | image-left | number, title, content, image |
| `accordion-horizontal` | accordion | horizontal | overlay | title, content, image, cta, number |
| `accordion-vertical` | accordion | vertical | text-only | title, content, icon, cta |
| `tabs-feature` | tabs | horizontal | image-left | label, title, content, features, image |
| `tabs-vertical` | tabs | vertical | image-left | label, title, content, image |
| `grid-icon-card` | grid (2 cols) | — | icon-card | icon, title, content |
| `grid-media` | grid (3 cols) | — | image-top | image, label, title, content, cta, date |
| `testimonial-carousel` | carousel | — | quote-card | image, quote, author, company, metric |
| `bento-stats` | bento | — | stat-card | number, title, content, color, bgImage, colSpan |
| `cta-jumbo` | single | — | cta-centered | title, subtitle, cta, secondaryCta |
| `marquee-logos` | marquee (ltr) | — | image-top | image, label |
| `marquee-tags` | marquee (ltr+rtl) | — | text-only | label, color |

**HeroUI component usage per preset:**
- `accordion-vertical` → HeroUI `DisclosureGroup` + `Disclosure` (custom triggers, controlled state)
- `accordion-horizontal` → Custom flex-based layout (no HeroUI equivalent)
- `tabs-*` → HeroUI `Tabs` with `data-orientation` attribute
- All others → Custom implementations (CSS Grid, Framer Motion, CSS keyframes)

**Tradeoffs:**
- (+) Best CMS author UX — pick a named preset, see only relevant fields
- (+) Single ContentItem table in DB — all blocks share one schema
- (+) Preset registry IS the CMS block picker list
- (+) Adding a layout = add one preset object + potentially a new renderer
- (+) `activeFields` solves "why does a stat card have a quote field" at UI level
- (-) ContentItem is a god object — no compile-time field enforcement per preset
- (-) `sticky-scroll` has a dual-pane model that needs special treatment
- (-) Presets can proliferate over time

---

## Why Option C

1. **Single ContentItem schema = simplest CMS storage.** One `items` array field definition reused across all blocks. The preset's `activeFields` controls the admin form dynamically.

2. **Presets map directly to the CMS block picker.** The `/` inserter shows named presets with labels. Each has validation (min/max items) and sensible defaults.

3. **Existing scroll logic stays intact.** Benefits' rAF scroll math, Story's sticky parallax, Hero's scroll overlay become named `animation` modes on `SectionConfig` — the preset bundles them. No re-abstraction needed.

---

## HeroUI v3 Component Mapping

Based on HeroUI v3 docs, here's how collection layouts map to HeroUI primitives:

| Collection Layout | HeroUI Component | Notes |
|---|---|---|
| **Accordion (vertical)** | `Accordion` / `Accordion.Item` | Built-in expand/collapse, surface variant, icon support. Vertical only. |
| **Accordion (horizontal)** | Custom (no HeroUI) | HeroUI Accordion is vertical-only. Horizontal accordion needs a custom flex-based component (current Products pattern). |
| **Tabs** | `Tabs` / `Tabs.Tab` / `Tabs.Panel` | Supports horizontal + vertical orientation via `data-orientation`. Has `secondary` variant, `Tabs.Indicator`, `Tabs.Separator`. |
| **Disclosure Group** | `DisclosureGroup` + `Disclosure` | More flexible than Accordion — fully custom trigger (any Button), controlled via `expandedKeys`. Better for non-standard accordion UIs. |
| **Carousel** | Custom (no HeroUI) | No built-in carousel. Build with scroll snap or Framer Motion. |
| **Grid / Bento** | CSS Grid (no HeroUI) | Pure CSS layout. |
| **Marquee** | Custom CSS animation | Existing pattern with duplicated arrays + `@keyframes`. |

### Accordion: Vertical vs Horizontal Config

The `accordion` collection layout should accept an `orientation` config:

```typescript
type CollectionLayout =
  | { type: "accordion"; orientation: "horizontal" | "vertical" }
  | { type: "carousel" }
  | { type: "tabs"; orientation?: "horizontal" | "vertical" }
  | { type: "sticky-scroll" }
  | { type: "bento" }
  | { type: "grid"; columns?: number }
  | { type: "marquee"; direction?: "ltr" | "rtl"; speed?: number }
  | { type: "stack" }
  | { type: "single" }
```

- **Vertical accordion**: Use HeroUI `Accordion` component (or `DisclosureGroup` for custom triggers). Good for FAQ, feature lists, content panels.
- **Horizontal accordion**: Custom implementation using flex layout with animated width transitions. Current Products section pattern. Good for product showcases, portfolio items.

**Recommendation**: Use `DisclosureGroup` as the base for **vertical** accordion — it's more flexible than `Accordion` (custom triggers, fully controlled). For **horizontal**, keep the custom flex-based implementation since HeroUI has no horizontal variant.

---

## Performance Architecture (Vercel + Next.js Best Practices)

### 1. RSC Boundaries — Server vs Client Split

**Principle**: Push the `"use client"` boundary as deep as possible. Section wrappers, headers, and static layouts stay on the server. Only interactive layouts cross to the client.

```
SERVER COMPONENTS (no JS shipped)        CLIENT COMPONENTS ("use client")
────────────────────────────────         ─────────────────────────────────
Page (RSC) — fetches CMS data           CarouselLayout (slide state, touch)
  Section (RSC) — bg, padding, theme    AccordionLayout (expanded state, HeroUI)
    SectionHeader (RSC) — static text   TabsLayout (active tab, HeroUI Tabs)
    GridLayout (RSC) — pure CSS grid    StickyScrollLayout (rAF, IntersectionObserver)
    BentoLayout (RSC) — pure CSS grid   MarqueeLayout (CSS animation, but needs client
    SingleLayout (RSC) — no state         for pause-on-hover)
    ItemRenderer (RSC) — static cards   Interactive items (hover effects, counters)
```

**Key rules applied:**
- **`server-serialization`**: Section (RSC) filters ContentItem to only `activeFields` before passing to client CollectionRenderer — strip unused fields at the RSC boundary to minimize serialized payload.
- **`rsc-boundaries`**: Never pass functions, Dates, Maps, or class instances across the boundary. All ContentItem fields are plain strings/numbers/objects — already compliant.
- **`rerender-no-inline-components`**: All ItemRenderer variants and layout components are top-level module exports, never defined inline inside parent components.

```typescript
// Section.tsx (SERVER COMPONENT — no "use client")
import { SectionHeader } from "./SectionHeader"
import { CollectionRenderer } from "./CollectionRenderer"
import { PRESETS } from "@/lib/cms/presets"

interface Props { block: SectionBlock }

export function Section({ block }: Props) {
  const preset = PRESETS[block.preset]
  const config = { ...preset.sectionDefaults, ...block.sectionConfig }

  // RSC filters items to only active fields before crossing to client
  const filteredItems = block.items.map(item =>
    Object.fromEntries(
      Object.entries(item).filter(([key]) =>
        preset.activeFields.includes(key as keyof ContentItem) || key === "id"
      )
    )
  ) as ContentItem[]

  return (
    <section className="g-section" data-theme={config.theme} style={sectionStyles(config)}>
      <div className="gc">
        {config.label && <SectionHeader label={config.label} headline={config.headline} />}
        <CollectionRenderer
          collection={preset.collection}
          itemLayout={preset.itemLayout}
          items={filteredItems}
        />
      </div>
    </section>
  )
}
```

### 2. Compound Component Architecture (Vercel Composition Patterns)

**RSC/Client boundary clarification:**
- `Section` (RSC) — renders `<section>` wrapper, filters items, passes props down. NO context provider here.
- `CollectionRenderer` ("use client") — this is where interactivity begins. It provides `SectionContext` internally so nested layout components and item renderers can access theme/animation config without prop drilling.

```typescript
// CollectionRenderer.tsx ("use client") — the client boundary
"use client"
const SectionContext = createContext<SectionContextValue | null>(null)

interface SectionContextValue {
  state: { theme: "light" | "dark"; animation: string }
  meta: { preset: string; sectionId: string }
}

export function CollectionRenderer({ collection, itemLayout, items, theme, animation, sectionId }: Props) {
  // Context provider lives INSIDE the client component, not in the RSC
  return (
    <SectionContext value={{ state: { theme, animation }, meta: { preset: collection.layout, sectionId } }}>
      <LayoutDispatcher collection={collection} itemLayout={itemLayout} items={items} />
    </SectionContext>
  )
}

// Nested items can access section config without prop drilling
function ItemRenderer({ item, layout }: Props) {
  const { state: { theme } } = use(SectionContext)
  // Render with awareness of parent section's theme
}
```

**All layouts are client components.** Even Grid/Bento (pure CSS) go through the client CollectionRenderer for simplicity. The RSC benefit for tiny CSS layouts is negligible vs the complexity of two render paths.

**Explicit variants over boolean props** — each collection layout is its own component, not `<Layout type="carousel" isHorizontal={false} showDots={true}>`:

```typescript
// Each layout is a dedicated component, not a mode switch
<CarouselLayout items={items} />        // has its own dots, navigation
<AccordionLayout items={items} orientation="horizontal" />  // flex-based
<TabsLayout items={items} />            // wraps HeroUI Tabs
```

**Children over render props** where possible, but CMS-driven rendering uses the dispatcher pattern since the layout choice is data-driven:

```tsx
// The dispatcher pattern for CMS blocks — layout chosen by preset config
function LayoutDispatcher({ collection, itemLayout, items }: Props) {
  const Layout = layouts[collection.layout]  // dynamic import
  return <Layout items={items} itemLayout={itemLayout} config={collection} />
}
```

### 3. ISR + Static Generation for CMS Pages

```typescript
// app/[locale]/page.tsx (SERVER COMPONENT)
import { cache } from "react"

// Deduplicate fetches across metadata + page render
const getPageBlocks = cache(async (locale: string) => {
  return fetchCmsPage("home", locale) // returns SectionBlock[]
})

// Pre-render for all supported locales
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bg" }]
}

// Revalidate every 60s (ISR) — CMS changes appear within a minute
export const revalidate = 60

// Dynamic SEO metadata from CMS content
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageBlocks(locale)
  return {
    title: page.meta?.title || "Genesis Technology",
    description: page.meta?.description,
    openGraph: { images: page.meta?.ogImage ? [page.meta.ogImage] : [] },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const page = await getPageBlocks(locale)
  return <PageRenderer blocks={page.blocks} />
}
```

### 4. Streaming with Suspense — Section-by-Section

Above-the-fold sections (Hero) render immediately. Below-fold sections stream in:

```tsx
// PageRenderer.tsx (SERVER COMPONENT)
import { Suspense } from "react"
import { Section } from "./cms/Section"

export function PageRenderer({ blocks }: { blocks: SectionBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        // Hero (first section) renders synchronously — critical for LCP
        if (i === 0) return <Section key={block.id} block={block} />

        // All other sections stream in with skeleton fallbacks
        return (
          <Suspense key={block.id} fallback={<SectionSkeleton preset={block.preset} />}>
            <Section block={block} />
          </Suspense>
        )
      })}
    </>
  )
}
```

### 5. Bundle Optimization — Dynamic Imports per Layout

Don't bundle all 8+ layout implementations. Load only what the page uses:

```typescript
// CollectionRenderer.tsx ("use client")
import dynamic from "next/dynamic"

// Each layout code-splits independently
const layouts = {
  carousel:       dynamic(() => import("./layouts/CarouselLayout")),
  accordion:      dynamic(() => import("./layouts/AccordionLayout")),
  tabs:           dynamic(() => import("./layouts/TabsLayout")),
  "sticky-scroll": dynamic(() => import("./layouts/StickyScrollLayout")),
  bento:          dynamic(() => import("./layouts/BentoLayout")),
  grid:           dynamic(() => import("./layouts/GridLayout")),
  marquee:        dynamic(() => import("./layouts/MarqueeLayout")),
  single:         dynamic(() => import("./layouts/SingleLayout")),
} as const

export function CollectionRenderer({ collection, itemLayout, items }: Props) {
  const Layout = layouts[collection.layout]
  return <Layout items={items} itemLayout={itemLayout} config={collection} />
}
```

**All layouts go through the client CollectionRenderer** for simplicity. Even stateless layouts like Grid/Bento are client components — the RSC savings would be negligible for simple CSS grid wrappers, and having a single render path avoids branching complexity.

### 6. Image Optimization for CMS Media

All images from CMS use `next/image` with proper responsive `sizes`:

```typescript
// In ItemRenderer — images always use next/image
import Image from "next/image"

function ItemImage({ image, layout }: { image: ContentItem["image"]; layout: ItemLayout }) {
  if (!image) return null

  // Sizes vary by layout context
  const sizes = {
    "hero-full": "100vw",
    "overlay": "(max-width: 768px) 100vw, 50vw",
    "image-top": "(max-width: 768px) 100vw, 33vw",
    "image-left": "(max-width: 768px) 100vw, 50vw",
    "quote-card": "(max-width: 768px) 100vw, 50vw",
    "stat-card": "(max-width: 768px) 100vw, 58vw",
  }[layout] || "100vw"

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      style={{ objectFit: "cover" }}
      // First section hero gets priority loading for LCP
      priority={layout === "hero-full"}
    />
  )
}
```

Configure remote patterns for CMS-uploaded media in `next.config.ts`:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cms.genesis-technology.eu", pathname: "/media/**" },
  ],
}
```

### 7. SEO Architecture for CMS Pages

```
app/
├── [locale]/
│   ├── page.tsx              ← generateMetadata + generateStaticParams
│   ├── [slug]/
│   │   └── page.tsx          ← dynamic CMS pages, ISR
│   └── layout.tsx            ← title template: "%s | Genesis Technology"
├── opengraph-image.tsx       ← dynamic OG image generation with next/og
├── sitemap.ts                ← generateSitemaps from CMS pages collection
├── robots.ts
└── layout.tsx                ← viewport config, base metadata
```

```typescript
// app/sitemap.ts — auto-generates from CMS pages collection
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await fetchAllCmsPages()
  return pages.map(page => ({
    url: `https://genesis-technology.eu/${page.locale}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "weekly",
    priority: page.slug === "" ? 1 : 0.8,
  }))
}
```

### 8. Client-Side Performance Rules

- **`client-passive-event-listeners`**: All scroll/touch handlers in StickyScrollLayout and CarouselLayout use `{ passive: true }`
- **`rendering-content-visibility`**: Apply `content-visibility: auto; contain-intrinsic-size: 0 600px;` to below-fold sections via CSS
- **`rerender-use-ref-transient-values`**: Scroll position in StickyScrollLayout stored in `useRef`, not `useState`, to avoid re-renders on every frame
- **`rerender-functional-setstate`**: Carousel/Accordion state updates use functional form `setState(prev => ...)` for stable callbacks
- **`bundle-defer-third-party`**: Analytics, chat widgets, etc. load after hydration via `next/script` strategy="afterInteractive"

### 9. Caching Strategy for CMS Data

**Primary approach** (standard, works today): `React.cache()` + route-level `revalidate`:

```typescript
// lib/cms/get-page.ts
import { cache } from "react"

// Deduplicate within a single request (metadata + page both call this)
export const getCmsPage = cache(async (slug: string, locale: string) => {
  return fetchFromCmsApi(slug, locale)
})

// Route-level ISR revalidation (in page.tsx)
export const revalidate = 60
```

**Future approach** (when `'use cache'` is stable in Next.js): Replace `revalidate` with per-function `cacheLife()` + `cacheTag()` for granular on-demand invalidation when CMS content is published.

### 10. Animation Strategy: Framer Motion + CSS

The project already uses Framer Motion v12. Use it where it provides clear value over raw CSS. The guiding principle is: **Framer Motion for orchestration and scroll-awareness, CSS for simple state transitions.**

| Use Case | Tool | Why |
|---|---|---|
| **Entrance animations** (fade-in, slide-up on scroll) | Framer Motion `whileInView` | Best DX — declarative, handles IntersectionObserver, stagger children with `variants` + `transition.staggerChildren` |
| **Scroll-linked animations** (Hero overlay, Benefits parallax) | Framer Motion `useScroll` + `useTransform` + `motion.div` | Maps scroll position to CSS values without rAF boilerplate. `useMotionValueEvent` avoids re-renders. |
| **Layout animations** (accordion expand, card resize) | Framer Motion `layout` prop + `AnimatePresence` | Smooth FLIP-based layout transitions that CSS can't do (auto-animating height changes). |
| **Exit animations** (tab panel leave, carousel slide out) | Framer Motion `AnimatePresence` + `exit` | CSS can't animate unmounting elements. |
| **Carousel slides** | Framer Motion `drag` + `animate` | Built-in drag gesture with snap, velocity-based spring physics. |
| **Tab panel content swap** | Framer Motion `AnimatePresence` + `motion.div` with `key` | Animate old panel out, new panel in. Use `mode="wait"` for sequential. |
| **Marquee** | CSS `@keyframes` | Pure CSS infinite scroll, no JS needed. Pause on hover via CSS `:hover`. |
| **Hover micro-interactions** | CSS `:hover` + `transition` | No JS overhead for simple hover states. |
| **Staggered grid reveals** | Framer Motion `variants` + `staggerChildren` | Cleaner than manual `transition-delay` calculation. |

**Performance rules for Framer Motion:**
- Use `useMotionValue` and `useTransform` for scroll-linked animations — they bypass React's render cycle (no setState).
- Animate `transform` and `opacity` only — never animate `width`, `height`, `top`, `left` (triggers layout).
- Set `layout` prop only on elements that actually change size — not on everything.
- Use `willChange: "transform"` on elements about to animate for GPU compositing.
- For `AnimatePresence`, use `mode="popLayout"` when you want the entering element to animate simultaneously with the exiting one (carousel), or `mode="wait"` for sequential (tabs).

**Example: Scroll-linked section reveal with Framer Motion v12:**

```tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.6"] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  )
}
```

**Example: Staggered grid items:**

```tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

<motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      <ItemRenderer item={item} layout={itemLayout} />
    </motion.div>
  ))}
</motion.div>
```

---

## Complete SectionConfig Interface

```typescript
interface SectionConfig {
  label?: string              // eyebrow text above headline
  headline?: string           // section headline (h2)
  headlineGradient?: string   // substring to render with gradient text treatment
  theme?: "light" | "dark" | "gradient"
  bgColor?: string            // CSS color value
  bgGradient?: string         // CSS gradient value
  bgImage?: string            // background image URL
  stickyBg?: boolean          // Story section: sticky parallax background
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  animation?: "reveal" | "stagger" | "sticky-scroll" | "hero-scroll-overlay" | "none"
  sectionId?: string          // stable anchor ID for navigation (#machines, #technology)
}
```

---

## Component Hierarchy

```
<Section preset={PRESETS[block.preset]} config={block.sectionConfig}>
  <SectionHeader />                          // label + headline + gradient text
  <CollectionRenderer layout={preset.collectionLayout}>
    <ItemRenderer item={item} layout={preset.itemLayout} />
    <ItemRenderer item={item} layout={preset.itemLayout} />
    ...
  </CollectionRenderer>
</Section>
```

- **Section** — handles bg, padding, theme, animation flags, sticky bg
- **SectionHeader** — renders eyebrow label + headline + gradient text parsing
- **CollectionRenderer** — pure layout engine (carousel state, accordion state, tab switching, bento grid, scroll tracking). Does NOT know about ContentItem shape.
- **ItemRenderer** — dispatches on `itemLayout` enum, renders one ContentItem

---

## Responsive Behavior per Layout

Each collection layout has defined mobile breakpoint behavior:

| Layout | Desktop | Mobile (< 768px) |
|---|---|---|
| **Accordion horizontal** | Flex row, expanding cards | Stacked vertical cards (full-width images) |
| **Accordion vertical** | HeroUI DisclosureGroup | Same (already vertical) |
| **Tabs** | Horizontal tab bar + panels | Scrollable tab bar or accordion fallback |
| **Carousel** | Multi-slide with arrows | Single-slide with swipe + dots |
| **Sticky scroll** | Left sticky text + right scrolling images | Stacked cards (no sticky) |
| **Bento grid** | 12-col grid with variable spans | Single column, all cards full-width |
| **Grid** | 2-3 columns | Single column |
| **Marquee** | Continuous horizontal scroll | Same, narrower viewport |

Each layout component handles its own responsive behavior internally using CSS media queries or `useMediaQuery`. The preset system does NOT need mobile-specific config — responsiveness is a layout concern, not a content concern.

---

## Sticky Scroll Dual-Pane Solution

The Benefits section has a unique dual-pane layout: left panel shows active item's text (sticky), right column shows all images (scrolling). This doesn't fit the simple "render each item the same way" pattern.

**Solution**: The `StickyScrollLayout` component treats items as having two roles — text (left) and image (right) — derived from the same ContentItem:

```typescript
// StickyScrollLayout.tsx
export function StickyScrollLayout({ items, itemLayout }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  // ... rAF scroll tracking logic from existing benefits-section.tsx

  return (
    <div className="sticky-scroll-container">
      {/* LEFT: sticky text panel — shows active item's text fields */}
      <div className="sticky-scroll-text" style={{ position: "sticky", top: "30vh" }}>
        <span className="number">{items[activeIndex].number}</span>
        <h3>{items[activeIndex].title}</h3>
        <p>{items[activeIndex].content}</p>
        <ProgressDots count={items.length} active={activeIndex} />
      </div>

      {/* RIGHT: scrolling image column — all items' images */}
      <div className="sticky-scroll-images">
        {items.map((item, i) => (
          <div key={item.id} className="sticky-scroll-image-slot" data-index={i}>
            <ItemImage image={item.image} layout={itemLayout} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

No special ContentItem shape needed — the layout component decides what to render from each item based on its pane (left = text fields, right = image). The `activeFields` for this preset include both: `["number", "title", "content", "image"]`.

---

## Error Handling & Fallbacks

```typescript
// Section.tsx — graceful handling of unknown presets or malformed data
export function Section({ block }: { block: SectionBlock }) {
  const preset = PRESETS[block.preset]

  // Unknown preset → render nothing in production, warning in dev
  if (!preset) {
    if (process.env.NODE_ENV === "development") {
      return <div className="g-section" style={{ background: "#fee", padding: "2rem" }}>
        Unknown preset: "{block.preset}"
      </div>
    }
    return null
  }

  // Empty items → skip section entirely
  if (!block.items?.length && preset.minItems) return null

  // ... normal render
}
```

---

## Composite Sections

Proof section (testimonials + stats) needs two blocks under one shared background. This requires a `CompositeBlock`:

```typescript
interface CompositeBlock {
  id: string
  type: "composite"
  sectionConfig?: Partial<SectionConfig>  // shared bg, theme
  blocks: SectionBlock[]
}

// Discriminated union for PageRenderer to handle both types
type PageBlock = SectionBlock | CompositeBlock

// SectionBlock gets an implicit type
interface SectionBlock {
  id: string
  type?: never  // distinguishes from CompositeBlock
  preset: string
  sectionConfig?: Partial<SectionConfig>
  items: ContentItem[]
}

// PageRenderer handles both:
function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  return blocks.map((block, i) => {
    if (block.type === "composite") {
      return (
        <section key={block.id} style={sectionStyles(block.sectionConfig)}>
          {block.blocks.map(subBlock => <Section key={subBlock.id} block={subBlock} />)}
        </section>
      )
    }
    return <Section key={block.id} block={block} />
  })
}
```

Hero (hero content + logo marquee) also fits this pattern.

---

## CMS Block Definition Example

```typescript
// horizontal-accordion in Payload-style registry
{
  slug: "horizontal-accordion",
  label: "Products / Accordion",
  group: "LAYOUT",
  fields: [
    { name: "label",    type: "text", multilingual: true },
    { name: "headline", type: "text", multilingual: true },
    { name: "bgColor",  type: "text" },
    { name: "theme",    type: "select", options: ["light", "dark"] },
    {
      name: "items", type: "array", minRows: 3, maxRows: 6,
      fields: [
        { name: "title",   type: "text", required: true, multilingual: true },
        { name: "content", type: "text", multilingual: true },
        { name: "image",   type: "upload", relationTo: "media", required: true },
        { name: "cta",     type: "group", fields: [
          { name: "label", type: "text", multilingual: true },
          { name: "href",  type: "text" },
        ]},
      ],
    },
  ],
}
```

---

## Concrete Examples

### Products Section as SectionBlock

```typescript
{
  preset: "horizontal-accordion",
  sectionConfig: { label: "Our machines", headline: "Precision-built for every setting" },
  items: [
    { number: "01", title: "Genesis Universa", content: "A modular system...", image: { src: "/images/universa.jpg", alt: "Universa" }, cta: { label: "Explore", href: "/machines/universa" } },
    { number: "02", title: "Genesis Alpha", content: "A bean-to-cup system...", image: { src: "/images/alpha.png", alt: "Alpha" }, cta: { label: "Explore", href: "/machines/alpha" } },
    // ...
  ]
}
```

### Proof Section as CompositeBlock

```typescript
{
  type: "composite",
  sectionConfig: { theme: "dark", bgGradient: "linear-gradient(220deg, ...)" },
  blocks: [
    {
      preset: "testimonial-carousel",
      items: [
        { image: { src: "/images/testimonial-1.webp", alt: "..." }, quote: "...", author: "John", company: "Hilton" },
      ]
    },
    {
      preset: "bento-stats",
      items: [
        { number: "3,000+", title: "Locations served", colSpan: 7, bgImage: { src: "/images/world-map.svg", alt: "" } },
        { number: "99.2%", title: "Uptime", colSpan: 5, color: "var(--neutral-100)" },
        { number: "15+", title: "Years", colSpan: 5, color: "var(--secondary-mint)" },
        { number: "<4h", title: "Response time", colSpan: 7, bgImage: { src: "/images/chart.svg", alt: "" } },
      ]
    }
  ]
}
```

---

## Dynamic Data Sources: Products, Users, and Entity References

Not all section content is static CMS text. Some sections need to pull from **existing database entities** (products, users, testimonials). This is handled through two mechanisms:

### 1. Relationship Fields + Resolver Pipeline (from CMS spec)

The CMS spec already defines `relationship` fields and a `resolver.ts` pipeline. A block can reference entities by ID, and the resolver hydrates them at read time:

```typescript
// Example: "featured-products" block definition
{
  slug: "featured-products",
  fields: [
    { name: "source", type: "select", options: [
      { label: "Manual pick", value: "manual" },
      { label: "Best sellers", value: "best-sellers" },
      { label: "New arrivals", value: "new-arrivals" },
      { label: "By category", value: "by-category" },
    ]},
    // Only shown when source = 'manual'
    { name: "products", type: "relationship", relationTo: "products", many: true,
      admin: { condition: (data) => data.source === "manual" } },
    // Only shown when source = 'by-category'
    { name: "category", type: "relationship", relationTo: "categories",
      admin: { condition: (data) => data.source === "by-category" } },
    // Presentation config
    { name: "preset", type: "select", options: ["grid-media", "carousel", "accordion-horizontal"] },
    { name: "limit", type: "number", defaultValue: 4 },
    { name: "displayFields", type: "multiselect", options: [
      { label: "Image", value: "image" },
      { label: "Title", value: "title" },
      { label: "Price", value: "price" },
      { label: "Description", value: "content" },
      { label: "CTA", value: "cta" },
      { label: "Specs", value: "specs" },
    ]},
  ]
}
```

At read time, the resolver fetches the actual products and **maps them to ContentItem shape**:

```typescript
// resolver for featured-products block
async function resolveFeaturedProducts(block, req) {
  let products: Product[]
  switch (block.source) {
    case "manual":       products = await fetchByIds(block.products); break
    case "best-sellers": products = await fetchBestSellers(block.limit); break
    case "by-category":  products = await fetchByCategory(block.category, block.limit); break
    // ...
  }
  // Map DB entity → ContentItem shape
  return products.map(p => ({
    id: p.id,
    title: p.name,
    content: p.description,
    image: { src: p.imageUrl, alt: p.name },
    number: formatPrice(p.price),
    cta: { label: "View", href: `/products/${p.slug}` },
    specs: p.specifications,
    label: p.category?.name,
  }))
}
```

### 2. Entity-to-ContentItem Mappers

Each entity type (Product, User, Testimonial, etc.) gets a mapper function that converts it to ContentItem:

```typescript
// lib/cms/mappers.ts
export function productToContentItem(product: Product): ContentItem { ... }
export function userToContentItem(user: User): ContentItem { ... }
export function testimonialToContentItem(testimonial: Testimonial): ContentItem { ... }
```

This keeps the UI layer pure — it only ever receives `ContentItem[]` regardless of whether the data came from:
- Static CMS content (editor typed it)
- Dynamic entity references (relationship field → resolver → mapper)
- Hybrid (some static items + some resolved entities)

### 3. Display Field Selection

The `displayFields` multiselect on the block config controls which ContentItem fields get rendered. This maps to the preset's `activeFields` but can be **overridden per block instance**:

```typescript
// At render time:
const effectiveActiveFields = block.displayFields?.length
  ? block.displayFields
  : preset.activeFields  // fallback to preset default
```

This means a CMS editor can place a "featured products" block and choose to show just image + title + price (compact grid) or image + title + description + CTA + specs (detailed cards) — same data, different field visibility.

### 4. Entity Types That Map to ContentItem

| Entity | Key Mapped Fields | Common Presets |
|---|---|---|
| **Product** | image, title (name), content (description), number (price), specs, cta, label (category) | grid-media, carousel, accordion-horizontal |
| **User/Team member** | image (avatar), title (name), content (bio), label (role), cta (profile link) | grid-media, carousel |
| **Testimonial** | image, quote, author, company, metric | testimonial-carousel |
| **FAQ** | title (question), content (answer) | accordion-vertical |
| **Blog post** | image, title, content (excerpt), label (category), date, cta | grid-media, carousel |

---

## Reusable Blocks Across Pages

### The Problem

An FAQ section, a testimonials carousel, or a CTA block might appear on multiple pages. Editors shouldn't recreate it each time.

### Solution: Global Blocks + Block References

**Option 1: Globals** (from CMS spec)

For truly site-wide blocks (one instance, used everywhere):
```typescript
// CMS Globals
{ slug: "faq-section", label: "FAQ Section", fields: [
  { name: "label", type: "text" },
  { name: "headline", type: "text" },
  { name: "preset", type: "text", defaultValue: "accordion-vertical" },
  { name: "items", type: "array", fields: [...] },
]}
```

Any page can reference: `{ blockType: "global-ref", globalSlug: "faq-section" }`

**Option 2: Shared Block Library** (better for multiple reusable blocks)

A new CMS collection called `shared-blocks`:
```typescript
{
  slug: "shared-blocks",
  label: "Shared Blocks",
  fields: [
    { name: "name", type: "text", required: true },       // "Homepage FAQ", "Footer CTA"
    { name: "block", type: "blocks", blocks: [...allBlocks], maxRows: 1 },
  ],
  admin: { useAsTitle: "name", group: "Content" },
}
```

Then a special `embed-shared-block` block type:
```typescript
{
  slug: "embed-shared-block",
  label: "Embed Shared Block",
  admin: { group: "LAYOUT" },
  fields: [
    { name: "sharedBlock", type: "relationship", relationTo: "shared-blocks" },
    { name: "overrides", type: "group", fields: [
      { name: "headline", type: "text" },  // optional override
      { name: "theme", type: "select", options: ["light", "dark"] },
    ]},
  ],
}
```

The resolver fetches the shared block and merges any overrides. This way:
- FAQ section is defined once in the shared-blocks collection
- Any page can embed it with `{ blockType: "embed-shared-block", sharedBlock: "faq-section-id" }`
- Per-page overrides (different headline, different theme) are supported
- Editing the shared block updates all pages that reference it

**Architecture**: Both coexist naturally since they serve different purposes:
- **Globals** (already in CMS spec) = site chrome that exists once: header, footer, site settings, notification templates. These are their own CMS primitive, not page blocks.
- **Shared Blocks collection** = reusable page content sections (FAQ, CTA banners, testimonial carousels) that editors create once and embed across multiple pages via `embed-shared-block` reference. Supports per-page overrides and multiple variants ("Homepage FAQ" vs "Product FAQ").

Globals are NOT part of the page block system — they render at layout level. Shared Blocks ARE page blocks that happen to be defined centrally and referenced by multiple pages.

---

## SEO Optimization for CMS-Driven Sections

### 1. Semantic HTML Structure

Each Section renders with proper landmark elements and heading hierarchy:

```tsx
// Section.tsx — semantic HTML output
<section
  id={block.sectionId || block.preset}  // anchor target for internal links
  aria-labelledby={`${block.id}-heading`}
  className="g-section"
  data-theme={config.theme}
  style={sectionStyles(config)}
>
  <div className="gc">
    {config.headline && (
      <header>
        {config.label && <p className="label-s">{config.label}</p>}
        <h2 id={`${block.id}-heading`}>{config.headline}</h2>
      </header>
    )}
    <CollectionRenderer ... />
  </div>
</section>
```

**Heading hierarchy rules for CMS-reorderable sections:**
- Page always has exactly ONE `<h1>` — either from the Hero section's headline or from the page-level title
- ALL section headlines render as `<h2>` regardless of section order — sections are siblings, not nested
- Item titles within sections use `<h3>`
- If a section is moved/reordered, heading hierarchy stays valid because all sections are at the same level
- The `SectionHeader` component enforces this: always `<h2>` for section headlines, always `<h3>` for item titles

```typescript
// SectionHeader.tsx
export function SectionHeader({ label, headline, isHero }: Props) {
  const Tag = isHero ? "h1" : "h2"  // only Hero gets h1
  return (
    <header>
      {label && <p className="label-s">{label}</p>}
      <Tag className={isHero ? "jumbo-h" : "heading-h2"}>{headline}</Tag>
    </header>
  )
}
```

### 2. Schema.org Structured Data

Generate JSON-LD from CMS blocks at the page level (RSC, not injected client-side):

```typescript
// app/[locale]/structured-data.tsx (SERVER COMPONENT)
export function PageStructuredData({ blocks, locale }: Props) {
  const schemas: object[] = []

  // Organization schema (always present)
  schemas.push({
    "@type": "Organization",
    name: "Genesis Technology",
    url: "https://genesis-technology.eu",
    logo: "https://genesis-technology.eu/images/logo.svg",
    sameAs: [/* social links */],
  })

  // Scan blocks for FAQ content → generate FAQPage schema
  const faqBlocks = blocks.filter(b => b.preset === "accordion-vertical")
  if (faqBlocks.length) {
    schemas.push({
      "@type": "FAQPage",
      mainEntity: faqBlocks.flatMap(b =>
        b.items.map(item => ({
          "@type": "Question",
          name: item.title,
          acceptedAnswer: { "@type": "Answer", text: item.content },
        }))
      ),
    })
  }

  // Scan for product blocks → generate Product schema
  const productBlocks = blocks.filter(b =>
    b.preset?.includes("accordion") && b.items.some(i => i.specs)
  )
  productBlocks.forEach(b => {
    b.items.forEach(item => {
      schemas.push({
        "@type": "Product",
        name: item.title,
        description: item.content,
        image: item.image?.src,
        brand: { "@type": "Brand", name: "Genesis Technology" },
      })
    })
  })

  // Testimonials → Review schema
  const testimonialBlocks = blocks.filter(b => b.preset === "testimonial-carousel")
  testimonialBlocks.forEach(b => {
    b.items.forEach(item => {
      schemas.push({
        "@type": "Review",
        reviewBody: item.quote,
        author: { "@type": "Person", name: item.author },
        itemReviewed: { "@type": "Organization", name: "Genesis Technology" },
      })
    })
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": schemas }),
      }}
    />
  )
}
```

### 3. Core Web Vitals for Interactive Sections

| Metric | Risk Areas | Mitigation |
|---|---|---|
| **LCP** | Hero background image, first section render | `priority` on Hero image, no Suspense on first block, preload hero bg via `<link rel="preload">` |
| **CLS** | Accordion/Tab height changes, image loads, carousel slides | Fixed `min-height` on section skeletons, `aspect-ratio` on image containers, `will-change: transform` on carousel slides |
| **INP** | Accordion expand animation, carousel swipe, tab switch | Lightweight CSS transitions (not Framer Motion) for accordion/tabs, `startTransition` for tab panel switches, passive touch listeners |

**CLS prevention for dynamic sections:**
```css
/* Reserve space for each section type to prevent layout shift */
.section-skeleton[data-preset="horizontal-accordion"] {
  min-height: 540px;  /* match actual rendered height */
}
.section-skeleton[data-preset="testimonial-carousel"] {
  min-height: 420px;
}
.section-skeleton[data-preset="bento-stats"] {
  min-height: 380px;
}

/* Image containers always reserve aspect ratio */
.item-image-container {
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
}
```

### 4. Section Anchors and Internal Linking

Each section gets a stable `id` attribute for anchor links (navigation, scroll-to):

```typescript
// SectionConfig includes optional sectionId
interface SectionConfig {
  // ...existing fields...
  sectionId?: string  // e.g., "machines", "technology", "proof"
}
```

The header navigation links to `#machines`, `#technology`, etc. When sections are CMS-reorderable, the anchor IDs stay stable because they're part of the section config, not derived from position.

### 5. Content Accessibility

- All images require `alt` text (enforced by ContentItem.image.alt being required in the type)
- Carousels include `aria-roledescription="carousel"` and `aria-label` on each slide
- Accordions use HeroUI's built-in ARIA (DisclosureGroup manages `aria-expanded`, keyboard nav)
- Tabs use HeroUI Tabs ARIA (automatic `role="tablist"`, `aria-selected`, keyboard arrows)
- Animations respect `prefers-reduced-motion: reduce` — disable parallax, reduce carousel transitions

---

## JSON Content Restructuring (v2 → CMS-Ready Format)

The current `common.json` uses section-specific keys with inconsistent shapes. Restructure to match the `SectionBlock[]` format the CMS API will eventually return.

### Current Structure (section-specific, flat)

```json
{
  "hero": { "label": "...", "headline": "...", "cta_primary": "..." },
  "products": { "label": "...", "headline": "...", "items": [{ "name": "...", "tagline": "..." }] },
  "proof": { "stats": [...], "testimonials": [...] }
}
```

### New Structure (CMS-aligned SectionBlock[])

```json
{
  "meta": {
    "title": "Genesis Technology — Intelligent Beverage Systems",
    "description": "Genesis designs, manufactures, and connects professional beverage systems — entirely in-house.",
    "ogImage": "/images/og-home.jpg"
  },
  "blocks": [
    {
      "id": "hero",
      "preset": "hero",
      "sectionConfig": { "theme": "dark", "sectionId": "hero" },
      "items": [{
        "title": "Intelligent machines,\nengineered from the\nground up.",
        "subtitle": "Genesis designs, manufactures, and connects professional beverage systems — entirely in-house. From laser-cut metal to cloud-connected AI.",
        "cta": { "label": "Explore Machines", "href": "#machines" },
        "secondaryCta": { "label": "Get a Quote", "href": "/contact" },
        "bgImage": { "src": "/images/hero-bg.jpg", "alt": "Genesis coffee machine" }
      }]
    },
    {
      "id": "trust",
      "preset": "marquee-logos",
      "sectionConfig": { "label": "Trusted by leading hospitality and retail brands" },
      "items": [
        { "label": "ILLY Official Partner", "image": { "src": "/images/logos/illy.svg", "alt": "ILLY" } },
        { "label": "Hilton Hotels", "image": { "src": "/images/logos/hilton.svg", "alt": "Hilton" } }
      ]
    },
    {
      "id": "story",
      "preset": "story-sticky",
      "sectionConfig": { "label": "Our story", "headline": "Every component.\nEvery line of code.\nOurs.", "sectionId": "story" },
      "items": [{
        "title": "Every component.\nEvery line of code.\nOurs.",
        "content": "Genesis Technology isn't an assembler or reseller...",
        "bgImage": { "src": "/images/factory.jpg", "alt": "Genesis factory" },
        "tags": [
          { "label": "In-house fabrication", "variant": "blue" },
          { "label": "Proprietary software", "variant": "green" },
          { "label": "Cloud-connected", "variant": "gradient" },
          { "label": "Patent registered", "variant": "blue" }
        ]
      }]
    },
    {
      "id": "products",
      "preset": "accordion-horizontal",
      "sectionConfig": { "label": "Our machines", "headline": "Precision-built for every setting", "sectionId": "machines" },
      "items": [
        {
          "id": "universa",
          "number": "01",
          "title": "Genesis Universa",
          "subtitle": "One platform. Every format.",
          "content": "A modular system bridging ESE pods and fresh-brew...",
          "image": { "src": "/images/universa/genesis-universa.jpg", "alt": "Genesis Universa" },
          "cta": { "label": "Explore", "href": "/machines/universa" },
          "specs": ["ESE pod + fresh-brew", "Programmable touchscreen", "Compact modular chassis"],
          "label": "Quick Service · Cafeterias · Retail"
        }
      ]
    },
    {
      "id": "howItWorks",
      "preset": "tabs-feature",
      "sectionConfig": { "label": "How it works", "headline": "Partnering with Genesis is simple", "sectionId": "how-it-works" },
      "items": [
        {
          "id": "consultation",
          "label": "Consultation",
          "title": "Consultation",
          "features": [
            "Tell us about your business — volume, space, drink preferences",
            "Our team recommends the right machine configuration",
            "Receive a detailed proposal with pricing and timeline"
          ]
        },
        {
          "id": "installation",
          "label": "Installation",
          "title": "Installation",
          "features": [
            "Our certified technicians install and calibrate on-site",
            "Staff training ensures your team operates everything from day one"
          ]
        }
      ]
    },
    {
      "id": "intelligence",
      "preset": "grid-icon-card",
      "sectionConfig": { "label": "Technology", "headline": "Cloud-connected.\nAI-powered.\nAlways improving.", "theme": "dark", "sectionId": "technology" },
      "items": [
        { "id": "cloud", "icon": "cloud", "title": "Cloud Management", "content": "Monitor every machine in your fleet..." },
        { "id": "ai", "icon": "ai", "title": "AI Operating System", "content": "Patent-registered intelligent system..." },
        { "id": "mobile", "icon": "mobile", "title": "Mobile Application", "content": "Contactless drink selection..." },
        { "id": "ota", "icon": "ota", "title": "Over-the-Air Updates", "content": "New drinks, software improvements..." }
      ]
    },
    {
      "id": "proof",
      "type": "composite",
      "sectionConfig": { "label": "Impact", "headline": "Numbers that speak for themselves", "theme": "dark", "sectionId": "proof" },
      "blocks": [
        {
          "preset": "testimonial-carousel",
          "items": [
            { "quote": "We stopped thinking about the coffee machines...", "author": "Operations Director", "company": "Regional Hotel Group", "metric": "42% fewer breakfast complaints" }
          ]
        },
        {
          "preset": "bento-stats",
          "items": [
            { "number": "3,000+", "title": "Locations served", "content": "Hotels, offices, restaurants...", "colSpan": 7 },
            { "number": "99.2%", "title": "Machine uptime", "content": "Proactive maintenance...", "colSpan": 5 },
            { "number": "15+", "title": "Years of innovation", "content": "Over a decade...", "colSpan": 5 },
            { "number": "< 4h", "title": "Service response", "content": "Local technicians...", "colSpan": 7 }
          ]
        }
      ]
    },
    {
      "id": "cta",
      "preset": "cta-jumbo",
      "sectionConfig": { "theme": "dark", "sectionId": "contact" },
      "items": [{
        "title": "Ready to elevate your\nbeverage experience?",
        "subtitle": "Whether you're outfitting a single café or a chain of 50 locations...",
        "cta": { "label": "Get in Touch", "href": "/contact" },
        "secondaryCta": { "label": "Download Catalog", "href": "/catalog" }
      }]
    }
  ]
}
```

### Migration Path

1. Create new `v2/data/locales/en/home.json` with the CMS-aligned format above
2. Update `getContent(locale)` to return the new shape
3. Update page component to use `PageRenderer` that reads `blocks[]`
4. Keep `nav` and `footer` in `common.json` — these are Globals, not page blocks
5. When CMS is live, `getContent()` becomes an API call instead of JSON import — the shape is identical

---

## Internationalization (i18n) — Dynamic, No-Rebuild Multilingual Support

### Current State (v2)

- **Libs installed**: `i18next`, `react-i18next`, `i18next-resources-to-backend`, `next-i18n-router`
- **Locales**: `en`, `bg` hardcoded in `v2/i18n/settings.ts`
- **Content**: Static JSON files at `v2/data/locales/{en,bg}/common.json`
- **Routing**: `[locale]` dynamic segment + custom middleware (`proxy.ts`) for locale detection
- **Problem**: Adding a language requires creating new JSON files, updating the hardcoded locale list, and rebuilding

### Target Architecture

Languages can be added/removed on the fly via CMS without rebuilding. The system has three layers:

#### Layer 1: Language Registry (CMS-driven, no rebuild)

```typescript
// The CMS stores available languages in a Global:
// Global: "site-settings" → field: "languages" (array)
// [{ code: "en", name: "English", isDefault: true }, { code: "bg", name: "Български" }, ...]

// At runtime, fetch available languages from API:
async function getActiveLanguages(): Promise<Language[]> {
  return fetch("/api/cms/globals/site-settings").then(r => r.json()).then(s => s.languages)
}
```

#### Layer 2: Translation Storage (CMS multilingual fields)

The CMS spec already supports `multilingual: true` on fields, stored as `{ en: "...", bg: "..." }`. This means **all CMS content is inherently multilingual** — no separate translation files needed for CMS-managed content.

For UI strings (button labels, nav items, form text), use a dedicated CMS collection:

```typescript
// CMS collection: "translations"
{
  slug: "translations",
  fields: [
    { name: "key", type: "text", required: true },         // "nav.machines", "cta.getQuote"
    { name: "namespace", type: "text", defaultValue: "common" },
    { name: "value", type: "text", multilingual: true },    // { en: "Machines", bg: "Машини" }
  ],
  admin: { useAsTitle: "key", group: "i18n" },
}

// API: GET /api/cms/translations?locale=bg&namespace=common
// Returns: { "nav.machines": "Машини", "cta.getQuote": "Поискайте оферта", ... }
```

#### Layer 3: i18next Runtime Integration

```typescript
// app/i18n.ts — server-side i18next initialization
import i18next from "i18next"
import { initReactI18next } from "react-i18next/initReactI18next"

// Cache translations for 60 seconds to avoid per-request API calls
const translationCache = new Map<string, { data: Record<string, string>; expires: number }>()

async function fetchTranslations(locale: string, ns: string) {
  const key = `${locale}:${ns}`
  const cached = translationCache.get(key)
  if (cached && cached.expires > Date.now()) return cached.data

  const data = await fetch(`${API_URL}/cms/translations?locale=${locale}&namespace=${ns}`)
    .then(r => r.json())
  translationCache.set(key, { data, expires: Date.now() + 60_000 })
  return data
}

export async function initTranslations(locale: string, namespaces: string[] = ["common"]) {
  const i18n = i18next.createInstance()
  await i18n.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    ns: namespaces,
    defaultNS: "common",
    resources: {},
  })

  // Load translations from API (or fallback to static JSON during migration)
  for (const ns of namespaces) {
    const translations = await fetchTranslations(locale, ns)
    i18n.addResourceBundle(locale, ns, translations, true, true)
  }

  return { i18n, resources: i18n.store.data }
}
```

#### Layer 4: Client-Side Language Switching (No Rebuild)

```typescript
// components/LanguageSwitcher.tsx ("use client")
"use client"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export function LanguageSwitcher({ languages, currentLocale }: Props) {
  const router = useRouter()
  const { i18n } = useTranslation()

  async function switchLanguage(newLocale: string) {
    // Fetch translations for the new language from API
    const translations = await fetch(`/api/cms/translations?locale=${newLocale}&namespace=common`)
      .then(r => r.json())

    // Add to i18next runtime — no rebuild needed
    i18n.addResourceBundle(newLocale, "common", translations, true, true)
    i18n.changeLanguage(newLocale)

    // Set cookie for middleware locale detection
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`

    // Navigate to new locale URL
    const newPath = window.location.pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div>
      {languages.map(lang => (
        <button key={lang.code} onPress={() => switchLanguage(lang.code)}>
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

### How Adding a New Language Works (Zero Rebuild)

1. **CMS admin** adds a new language (e.g., `de` German) to the `site-settings` global's `languages` array
2. **CMS admin** starts translating content — each multilingual field gets a `de` value alongside `en` and `bg`
3. **CMS admin** adds UI string translations to the `translations` collection with `de` values
4. **Middleware** picks up the new language from the API-fetched language list on next request
5. **i18next** loads `de` translations at runtime via `addResourceBundle` — no rebuild needed
6. **ISR revalidation** (60s) refreshes the page with the new language option in the language switcher

### Middleware — Dynamic Locale Detection

```typescript
// proxy.ts (middleware) — updated for dynamic locales
import { NextRequest, NextResponse } from "next/server"

// Fetch active locales periodically (cached in-memory for middleware)
let cachedLocales: string[] = ["en", "bg"]
let localesCacheExpiry = 0

async function getLocales(): Promise<string[]> {
  if (Date.now() < localesCacheExpiry) return cachedLocales
  try {
    const settings = await fetch(`${API_URL}/cms/globals/site-settings`).then(r => r.json())
    cachedLocales = settings.languages.map((l: any) => l.code)
    localesCacheExpiry = Date.now() + 300_000 // cache 5 minutes
  } catch { /* keep previous cache on error */ }
  return cachedLocales
}

export async function middleware(request: NextRequest) {
  const locales = await getLocales()
  const pathname = request.nextUrl.pathname
  const hasLocale = locales.some(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)

  if (!hasLocale) {
    const preferred = request.cookies.get("NEXT_LOCALE")?.value
      || negotiateLocale(request.headers.get("accept-language"), locales)
      || "en"
    return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url))
  }
}
```

### CMS Content Multilingual Fields

For CMS-managed content (page blocks), the multilingual support is built into the field system:

```typescript
// How a section headline looks in the CMS database:
{
  "headline": { "en": "Precision-built for every setting", "bg": "Прецизно изградени за всяка среда" }
}

// The resolver flattens based on ?locale= query param:
// GET /api/cms/pages/home?locale=bg
// Returns: { "headline": "Прецизно изградени за всяка среда" }
```

This means **ContentItem values are already locale-resolved by the time they reach the frontend**. The JSON content files during the transition period should mirror this — one file per locale, same structure.

### Migration Path (Static JSON → CMS API)

| Phase | UI Strings Source | CMS Content Source |
|---|---|---|
| **Now (v2)** | Hardcoded in components | Static JSON `data/locales/{locale}/common.json` |
| **Phase 1** | Static JSON (restructured to CMS format) | Static JSON (restructured to `blocks[]` format) |
| **Phase 2** | CMS `translations` collection via API | CMS pages collection via API |
| **Phase 3** | Same as Phase 2 | Same, with ISR revalidation + on-demand cache invalidation |

In Phase 1, `getContent(locale)` still reads JSON but the shape matches what the CMS API will return. In Phase 2, it becomes an API call. No component changes needed.

### generateStaticParams — Dynamic Locales

```typescript
// app/[locale]/layout.tsx
export async function generateStaticParams() {
  // In Phase 1: static list
  // In Phase 2: fetch from CMS API
  const languages = await getActiveLanguages()
  return languages.map(lang => ({ locale: lang.code }))
}
```

### SEO: hreflang Alternates

```typescript
// In generateMetadata — add hreflang for all active languages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const languages = await getActiveLanguages()
  const { locale } = await params

  return {
    alternates: {
      canonical: `https://genesis-technology.eu/${locale}`,
      languages: Object.fromEntries(
        languages.map(l => [l.code, `https://genesis-technology.eu/${l.code}`])
      ),
    },
  }
}
```

### Key Files

- `v2/i18n/settings.ts` — update to fetch locales dynamically (or fallback to static list)
- `v2/i18n/server.ts` — update initTranslations to use API + cache
- `v2/proxy.ts` — update middleware for dynamic locale list
- `v2/app/[locale]/layout.tsx` — dynamic generateStaticParams + hreflang metadata
- New: `v2/components/LanguageSwitcher.tsx` — client-side switcher with runtime bundle loading

---

## Key Files to Modify

- `v2/components/sections/*.tsx` — all 8 section components (migrate to preset-driven)
- `v2/lib/frost.ts` — existing, reuse as-is
- `v2/hooks/useInView.ts` — existing, reuse as-is
- `v2/components/scroll-reveal.tsx` — existing, reuse as-is

## New Files to Create

- `v2/lib/cms/types.ts` — ContentItem, SectionConfig, SectionPreset, SectionBlock, CompositeBlock
- `v2/lib/cms/presets.ts` — PRESETS registry
- `v2/components/cms/Section.tsx` — section wrapper
- `v2/components/cms/SectionHeader.tsx` — label + headline renderer
- `v2/components/cms/CollectionRenderer.tsx` — layout dispatcher
- `v2/components/cms/ItemRenderer.tsx` — item layout dispatcher
- `v2/components/cms/layouts/` — CarouselLayout, AccordionHorizontalLayout, AccordionVerticalLayout (uses HeroUI DisclosureGroup), TabsLayout (uses HeroUI Tabs), StickyScrollLayout, BentoLayout, GridLayout, MarqueeLayout, SingleLayout
- `v2/components/cms/items/` — HeroItem, OverlayItem, QuoteItem, StatItem, IconCardItem, etc.
- `v2/lib/cms/mappers.ts` — Entity-to-ContentItem mappers (productToContentItem, userToContentItem, etc.)
- `v2/lib/cms/resolve-block.ts` — Client-side block resolver (fetches shared blocks, resolves entity refs)

## Verification

1. Create the type system and preset registry
2. Build one collection layout (e.g., grid) + one item layout (e.g., icon-card) end-to-end
3. Render the Intelligence section using the new system, compare visually to current
4. Progressively migrate remaining sections, verifying visual parity
