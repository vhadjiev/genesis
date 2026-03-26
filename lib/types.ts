// ─── Primitives ──────────────────────────────────────────────────────────────

export interface CmsImage {
  src: string
  alt: string
  objectPosition?: string
}

export interface CmsCta {
  label: string
  href: string
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger"
  /** Button size: sm, md, lg (HeroUI native) + xl (custom) */
  size?: "sm" | "md" | "lg" | "xl"
  /** Iconify icon name for trailing icon (e.g., "lucide:arrow-right") */
  icon?: string
}

export interface CmsTag {
  label: string
  variant?: "blue" | "green" | "gradient" | "coral" | "default"
}

// ─── ContentItem: The universal data atom ────────────────────────────────────

export interface ContentItem {
  // Identity
  id?: string

  // Text
  label?: string // eyebrow, badge, category
  title?: string
  subtitle?: string
  content?: string // body text or richtext
  number?: string // "01", "3,000+", "€350m+"

  // Media
  image?: CmsImage
  bgImage?: CmsImage
  icon?: string // icon identifier (e.g., "cloud", "ai", "mobile")

  // Actions
  cta?: CmsCta
  secondaryCta?: CmsCta

  // Presentation hints
  color?: string // CSS color value
  gradient?: string // CSS gradient value
  colSpan?: number // for bento layouts

  // Social proof
  author?: string
  company?: string
  quote?: string
  metric?: string

  // Lists
  tags?: CmsTag[]
  features?: string[]
  specs?: string[]

  // Meta
  date?: string
}

// ─── Layout enums ────────────────────────────────────────────────────────────

export type CollectionLayout =
  | "carousel"
  | "accordion"
  | "tabs"
  | "sticky-scroll"
  | "bento"
  | "grid"
  | "marquee"
  | "stack"
  | "single"

export type ItemLayout =
  | "image-top"
  | "image-left"
  | "image-right"
  | "overlay"
  | "text-only"
  | "icon-card"
  | "stat-card"
  | "quote-card"
  | "hero-full"
  | "cta-centered"

// ─── Collection config ───────────────────────────────────────────────────────

export interface CollectionConfig {
  layout: CollectionLayout
  orientation?: "horizontal" | "vertical" // for accordion, tabs
  columns?: number // for grid
  direction?: "ltr" | "rtl" // for marquee
  speed?: number // for marquee (animation duration in seconds)
}

// ─── Section config ──────────────────────────────────────────────────────────

export interface SectionConfig {
  label?: string // eyebrow text above headline
  headline?: string
  headlineGradient?: string // substring to render with gradient treatment
  theme?: "light" | "dark" | "gradient"
  bgColor?: string
  bgGradient?: string
  bgImage?: string
  stickyBg?: boolean // sticky full-viewport background image behind content
  stickyBgSrc?: string // image source for sticky background
  stickyBgAlt?: string // alt text for sticky background
  overlapPrevious?: string // negative margin to overlap previous section (e.g., "-80vh")
  /** Shorthand padding for all sides */
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  /** Individual side padding overrides (same scale as padding) */
  paddingTop?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  paddingBottom?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  paddingLeft?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  paddingRight?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  animation?: "reveal" | "stagger" | "sticky-scroll" | "hero-scroll-overlay" | "none"
  sectionId?: string // stable anchor ID for navigation (#machines, #technology)
  /** Heading level for section title and content headings (default: 2) */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

// ─── Capabilities ────────────────────────────────────────────────────────────

export interface SectionCapabilities {
  /** Skip the .gc max-width container — content goes full-bleed */
  fullBleed?: boolean
  /** Background rendering mode */
  backgroundMode?: "static" | "scroll-overlay" | "parallax"
  /** Expect bgImage from the first item (hero pattern) or from sectionConfig */
  backgroundImageFrom?: "item" | "config"
  /** Element rendered after the section closing tag */
  afterSection?: "fade-strip" | "gradient-bleed"
  /** Entrance animation for child content */
  entranceAnimation?: "fade-up-stagger" | "reveal" | "none"
  /** Decorative overlays rendered inside the section */
  decorators?: ("grid-pattern" | "ambient-glow")[]
  /** Absorb the next block into this section (e.g., hero absorbs logo marquee) */
  mergeNextPreset?: string
  /** Bottom gradient inside the section for smooth transition */
  bottomGradient?: boolean
  /** Spacer between content and bottom of section */
  bottomSpacer?: boolean
  /** Make section fill full viewport height */
  fullHeight?: boolean
  /** Vertical alignment of content within fullHeight section */
  contentAlign?: "center" | "start" | "end"
  /** Wrap section content in a styled card */
  contentWrapper?: "frosted-card" | "none"
}

// ─── Preset ──────────────────────────────────────────────────────────────────

export interface SectionPreset {
  slug: string
  label: string // shown in CMS block picker
  collection: CollectionConfig
  itemLayout: ItemLayout
  sectionDefaults: Partial<SectionConfig>
  activeFields: (keyof ContentItem)[]
  minItems?: number
  maxItems?: number
  capabilities?: SectionCapabilities
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

export interface SectionBlock {
  id: string
  type?: never // discriminator: absence distinguishes from CompositeBlock
  preset: string // references SectionPreset.slug
  sectionConfig?: Partial<SectionConfig>
  items: ContentItem[]
  displayFields?: (keyof ContentItem)[] // override preset activeFields per instance
}

export interface CompositeBlock {
  id: string
  type: "composite"
  sectionConfig?: Partial<SectionConfig>
  blocks: SectionBlock[]
}

export type PageBlock = SectionBlock | CompositeBlock

// ─── Page ────────────────────────────────────────────────────────────────────

export interface PageMeta {
  title: string
  description?: string
  ogImage?: string
}

export interface CmsPage {
  meta: PageMeta
  blocks: PageBlock[]
}

// ─── Globals ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon?: string
}

export interface SocialLink {
  label: string
  href: string
  icon: string // iconify name
}

export interface FooterColumn {
  title: string
  links: Array<{
    label: string
    href: string
    icon?: string
    external?: boolean
    highlight?: boolean // e.g., "Cloud Platform" link in blue
  }>
}

export interface ContactInfo {
  address: string
  addressUrl?: string
  phone: string
  email: string
}

export interface NewsletterConfig {
  title: string
  description: string
  placeholder: string
}

export interface TrustBadge {
  label: string
  icon?: string
}

export interface HeaderGlobal {
  logo: string // URL to logo SVG
  navigation: NavItem[]
  cta: CmsCta
  /** Display names for locale switcher, keyed by locale code */
  localeNames?: Record<string, string>
}

export interface FooterGlobal {
  logo: string
  tagline: string
  columns: FooterColumn[]
  socials: SocialLink[]
  contact: ContactInfo
  newsletter: NewsletterConfig
  badges: TrustBadge[]
  copyright: string
}

// ─── Type guards ─────────────────────────────────────────────────────────────

export function isCompositeBlock(block: PageBlock): block is CompositeBlock {
  return block.type === "composite"
}

export function isSectionBlock(block: PageBlock): block is SectionBlock {
  return block.type !== "composite"
}
