/**
 * Shared navigation configuration
 * Single source of truth for Header and Footer navigation
 */

export interface NavChild {
    key: string
    href: string
    icon?: string
    /** Short description for mega dropdown */
    desc?: string
    /** Gradient class for placeholder thumbnail */
    gradient?: string
    /** Product image path (when available, replaces gradient placeholder) */
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

/**
 * Primary navigation links used by both Header and Footer
 */
export const navLinks: NavItem[] = [
    {
        key: 'systems',
        href: '#',
        groups: [
            {
                labelKey: 'hotBeverages',
                children: [
                    { key: 'genesisAlpha', href: '/equipment/genesis-alpha', desc: 'Compact hot beverage system', gradient: 'from-blue-950 to-slate-900', image: '/images/alpha/genesis-alpha.png' },
                    { key: 'genesisUniversa', href: '/equipment/genesis-universa', desc: 'Universal premium platform', gradient: 'from-gray-900 to-slate-900', image: '/images/universa/genesis-universa-ese-pods.jpg' },
                    { key: 'genesisPrime', href: '/equipment/genesis-prime', desc: 'High-volume professional', gradient: 'from-emerald-950 to-slate-900' },
                ],
            },
            {
                labelKey: 'coldBeverages',
                children: [
                    { key: 'genesisEclipse', href: '/equipment/genesis-eclipse', desc: 'Advanced cold brew system', gradient: 'from-purple-950 to-slate-900', image: '/images/eclipse/genesys-eclipse.jpg' },
                    { key: 'genesisSolaris2', href: '/equipment/genesis-solaris-2', desc: 'Next-gen juice dispenser', gradient: 'from-amber-950 to-slate-900', image: '/images/solaris/genesys-solaris2.jpg' },
                    { key: 'genesisEquinox', href: '/equipment/genesis-equinox', desc: 'Dual temperature system', gradient: 'from-cyan-950 to-slate-900' },
                    { key: 'genesisSolaris', href: '/equipment/genesis-solaris', desc: 'Classic juice platform', gradient: 'from-orange-950 to-slate-900' },
                ],
            },
        ],
        featured: {
            key: 'cloudPlatform',
            href: '/services/cloud-system',
            icon: 'mdi:cloud-sync',
        },
    },
    {
        key: 'company',
        href: '/about',
        children: [
            { key: 'about', href: '/about' },
            { key: 'projects', href: '/projects' },
            { key: 'news', href: '/news' },
            { key: 'exhibitions', href: '/exhibitions' },
        ],
    },
    {
        key: 'contactUs',
        href: '/contacts',
        isCTA: true,
    },
]

/**
 * Manufacturing services links (footer only, different audience)
 */
export const manufacturingLinks: NavChild[] = [
    { key: 'laserCutting', href: '/services/laser-cutting' },
    { key: 'sheetMetalBending', href: '/services/sheet-metal-bending' },
]

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
