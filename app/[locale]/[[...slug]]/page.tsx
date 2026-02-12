/**
 * Dynamic Page Renderer
 * Handles all pages using catch-all route with static generation
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getIndex, getPageData, getLocalizedContent, generateAllStaticParams } from '@/utils/data'
import { renderSections } from '@/utils/sections'
import { Header, Footer } from '@/components/layout'

interface PageParams {
    locale: string
    slug?: string[]
}

/**
 * Generate all static routes at build time (Static Generation)
 * Creates pages for all combinations of locales and page slugs
 */
export async function generateStaticParams() {
    return generateAllStaticParams()
}

/**
 * Generate metadata from page JSON with full SEO support
 */
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
    const { locale, slug } = await params
    const pageSlug = slug?.join('/') || ''

    const index = await getIndex()
    const pageRef = index.pages.find((p) => p.slug === pageSlug)

    if (!pageRef) {
        return {}
    }

    const page = await getPageData(pageRef.id)
    const seo = getLocalizedContent(page.seo, locale)
    const siteSeo = index.site.seo
    const pagePath = pageSlug ? `/${pageSlug}` : ''
    const defaultLocale = index.site.defaultLocale

    // Helper to build locale-aware URLs (no prefix for default locale)
    const buildUrl = (loc: string) => {
        const localePrefix = loc === defaultLocale ? '' : `/${loc}`
        return `${siteSeo.siteUrl}${localePrefix}${pagePath}`
    }

    const canonicalUrl = buildUrl(locale)

    // Build hreflang alternates including x-default
    const languageAlternates = Object.fromEntries([
        ...index.site.locales.map((l) => [l, buildUrl(l)]),
        ['x-default', buildUrl(defaultLocale)],
    ])

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        // Robots directive - respect noindex flag from JSON
        robots: seo.noindex ? { index: false, follow: false } : undefined,
        openGraph: {
            title: seo.openGraph?.title || seo.title,
            description: seo.openGraph?.description || seo.description,
            images: seo.openGraph?.images || siteSeo.openGraph.images,
            type: siteSeo.openGraph.type as 'website' | 'article' | 'book' | 'profile' | undefined,
            siteName: siteSeo.openGraph.siteName,
            locale: locale,
            url: canonicalUrl,
        },
        twitter: {
            card: siteSeo.twitter.card,
            site: siteSeo.twitter.site,
            title: seo.openGraph?.title || seo.title,
            description: seo.openGraph?.description || seo.description,
            images: seo.openGraph?.images || siteSeo.openGraph.images,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates,
        },
    }
}

/**
 * JSON-LD Structured Data component
 * Renders structured data for rich search results
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

/**
 * Dynamic Page Component
 * Renders the page content based on JSON data
 */
export default async function DynamicPage({ params }: { params: Promise<PageParams> }) {
    const { locale, slug } = await params
    const pageSlug = slug?.join('/') || ''

    // Get index to find page reference
    const index = await getIndex()
    const pageRef = index.pages.find((p) => p.slug === pageSlug)

    if (!pageRef) {
        notFound()
    }

    // Get full page data (deduplicated by React.cache if already called in generateMetadata)
    const page = await getPageData(pageRef.id)
    const seo = getLocalizedContent(page.seo, locale)

    return (
        <>
            {/* JSON-LD Structured Data for rich search results */}
            {seo.structuredData && (
                <JsonLd
                    data={{
                        '@context': 'https://schema.org',
                        ...seo.structuredData,
                    }}
                />
            )}
            <main className="min-h-screen">
                <Header />
                {renderSections(page.sections, locale)}
                <Footer />
            </main>
        </>
    )
}
