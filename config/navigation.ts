/**
 * Navigation configuration — derived from data/index.json
 *
 * Structure and ordering come from index.json (single source of truth).
 * UI-specific extras (gradients, images, descriptions) are enriched here
 * since they are presentation concerns, not data concerns.
 */

import indexData from '@/data/index.json'

/* ── Types ── */

export interface NavChild {
    key: string
    href: string
    icon?: string
    desc?: string
    gradient?: string
    image?: string
}

export interface NavGroup {
    labelKey: string
    children: NavChild[]
}

export interface NavItem {
    key: string
    href: string
    isCTA?: boolean
    groups?: NavGroup[]
    children?: NavChild[]
    featured?: NavChild
}

/* ── Page lookup: id → href ── */

const pageSlugMap = new Map<string, string>(
    indexData.pages.map((p) => [p.id, p.slug ? `/${p.slug}` : '/'])
)

function hrefFor(id: string): string {
    return pageSlugMap.get(id) || `/${id}`
}

/**
 * Camel-case a kebab-case id for use as a translation key.
 * e.g. "genesis-alpha" → "genesisAlpha"
 */
function camelCase(id: string): string {
    return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/* ── UI enrichment data (presentation-only) ── */

interface ProductMeta {
    desc?: string
    gradient?: string
    image?: string
    icon?: string
}

const productMeta: Record<string, ProductMeta> = {
    'genesis-universa': { desc: 'Universal premium platform', gradient: 'from-gray-900 to-slate-900', image: '/images/universa/genesis-universa-ese-pods.jpg' },
    'genesis-alpha': { desc: 'Compact hot beverage system', gradient: 'from-blue-950 to-slate-900', image: '/images/alpha/genesis-alpha.png' },
    'genesis-prime': { desc: 'High-volume professional', gradient: 'from-emerald-950 to-slate-900' },
    'genesis-eclipse': { desc: 'Advanced cold brew system', gradient: 'from-purple-950 to-slate-900', image: '/images/eclipse/genesys-eclipse.jpg' },
    'genesis-solaris-2': { desc: 'Next-gen juice dispenser', gradient: 'from-amber-950 to-slate-900', image: '/images/solaris/genesys-solaris2.jpg' },
    'genesis-equinox': { desc: 'Dual temperature system', gradient: 'from-cyan-950 to-slate-900' },
    'genesis-solaris': { desc: 'Classic juice platform', gradient: 'from-orange-950 to-slate-900' },
    'cloud-system': { icon: 'mdi:cloud-sync' },
}

/* ── Build navigation from index.json ── */

function buildNavChild(item: { id: string; labelKey?: string }): NavChild {
    const meta = productMeta[item.id] || {}
    return {
        key: camelCase(item.id),
        href: hrefFor(item.id),
        ...(meta.desc && { desc: meta.desc }),
        ...(meta.gradient && { gradient: meta.gradient }),
        ...(meta.image && { image: meta.image }),
        ...(meta.icon && { icon: meta.icon }),
    }
}

function buildNavItem(raw: typeof indexData.navigation.main[number]): NavItem {
    const item: NavItem = {
        key: camelCase(raw.id),
        href: hrefFor(raw.id),
    }

    if ('isCTA' in raw && raw.isCTA) {
        item.isCTA = true
    }

    if ('groups' in raw && raw.groups) {
        item.href = '#'
        item.groups = raw.groups.map((g) => ({
            labelKey: g.labelKey.replace('nav.', ''),
            children: g.children.map(buildNavChild),
        }))
    }

    if ('children' in raw && raw.children) {
        item.children = raw.children.map(buildNavChild)
    }

    if ('featured' in raw && raw.featured) {
        const feat = raw.featured as { id: string; labelKey: string }
        const meta = productMeta[feat.id] || {}
        item.featured = {
            key: camelCase(feat.id),
            href: hrefFor(feat.id),
            ...(meta.icon && { icon: meta.icon }),
        }
    }

    return item
}

export const navLinks: NavItem[] = indexData.navigation.main.map(buildNavItem)

/**
 * Manufacturing services links (footer only)
 */
export const manufacturingLinks: NavChild[] = indexData.navigation.manufacturing.map(buildNavChild)

/**
 * Social media links
 */
export const socialLinks = [
    { icon: 'mdi:facebook', href: 'https://www.facebook.com/gentechtechnology/', label: 'Facebook' },
    { icon: 'mdi:email', href: 'mailto:info@gentech.bg', label: 'Email' },
]

/**
 * Helper: get all product links (flat list from all groups)
 */
export function getAllProductLinks(): NavChild[] {
    const systemsItem = navLinks.find((item) => item.key === 'systems')
    if (!systemsItem?.groups) return []
    return systemsItem.groups.flatMap((group) => group.children)
}

/**
 * Helper: get company links
 */
export function getCompanyLinks(): NavChild[] {
    const companyItem = navLinks.find((item) => item.key === 'company')
    return companyItem?.children ?? []
}
