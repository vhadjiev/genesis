'use client'

import React, { ViewTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import { ViewTransitionLink } from '@/components/shared/ViewTransitionLink'
import type { LocalizedContent } from '@/types'

interface Product {
    id: string
    name: string
    tagline: LocalizedContent<string>
    description?: LocalizedContent<string>
    image: string
    href: string
}

interface FeaturedProductsData {
    type: 'featuredProducts'
    title: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
    products: Product[]
    layout?: 'left' | 'right'
    theme?: 'dark' | 'light'
    viewAllHref?: string
    viewAllText?: LocalizedContent<string>
}

interface FeaturedProductsProps {
    data: FeaturedProductsData
    locale: string
}

function hasRealImage(src: string): boolean {
    return !!src && !src.includes('/products/')
}

const productGradients: Record<string, string> = {
    'genesis-alpha': 'from-slate-900 via-blue-950 to-slate-900',
    'genesis-universa': 'from-slate-900 via-gray-900 to-slate-900',
    'genesis-prime': 'from-slate-900 via-emerald-950 to-slate-900',
    'genesis-eclipse': 'from-slate-900 via-purple-950 to-slate-900',
    'genesis-solaris-2': 'from-slate-900 via-amber-950 to-slate-900',
    'genesis-equinox': 'from-slate-900 via-cyan-950 to-slate-900',
    'genesis-solaris': 'from-slate-900 via-orange-950 to-slate-900',
}

/* ── Light-theme gradient placeholders ── */
const productGradientsLight: Record<string, string> = {
    'genesis-alpha': 'from-blue-50 via-slate-100 to-blue-50',
    'genesis-universa': 'from-gray-100 via-slate-50 to-gray-100',
    'genesis-prime': 'from-emerald-50 via-slate-50 to-emerald-50',
    'genesis-eclipse': 'from-purple-50 via-slate-50 to-purple-50',
    'genesis-solaris-2': 'from-amber-50 via-slate-50 to-amber-50',
    'genesis-equinox': 'from-cyan-50 via-slate-50 to-cyan-50',
    'genesis-solaris': 'from-orange-50 via-slate-50 to-orange-50',
}

function ProductCard({
    product,
    locale,
    index,
    isHero,
    isDark,
}: {
    product: Product
    locale: string
    index: number
    isHero: boolean
    isDark: boolean
}) {
    const tagline = getLocalizedContent(product.tagline, locale)
    const description = product.description
        ? getLocalizedContent(product.description, locale)
        : tagline
    const gradient = isDark
        ? (productGradients[product.id] || 'from-slate-900 to-gray-900')
        : (productGradientsLight[product.id] || 'from-slate-50 to-gray-50')

    const cardClass = isDark
        ? 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
        : 'border-black/[0.06] bg-white/60 hover:border-black/[0.10] hover:bg-white/80 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]'

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
            <ViewTransitionLink href={product.href} className="group block cursor-pointer">
                <div className={`relative overflow-hidden rounded-[20px] border backdrop-blur-sm transition-all duration-500 ${cardClass}`}>
                    {/* Image */}
                    <ViewTransition name={`product-${product.id}`}>
                        <div className={`relative overflow-hidden ${isHero ? 'aspect-[16/10]' : 'aspect-[4/3]'} ${hasRealImage(product.image) ? '' : `bg-gradient-to-br ${gradient}`}`}>
                            {hasRealImage(product.image) ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-[100px] font-bold tracking-tighter select-none leading-none ${isDark ? 'text-white/[0.04]' : 'text-black/[0.04]'}`}>
                                        {product.name.split(' ').pop()}
                                    </span>
                                </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Product number */}
                            <div className="absolute top-4 left-5">
                                <span className="font-mono text-[11px] font-medium text-white/30 tracking-wider">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Explore prompt on hover */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="flex items-center gap-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                    {locale === 'bg' ? 'Разгледай' : 'Explore'}
                                    <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                                </span>
                            </div>

                            {/* Bottom info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <ViewTransition name={`product-title-${product.id}`}>
                                    <h3 className={`font-heading font-semibold text-white mb-1 ${isHero ? 'text-xl' : 'text-[17px]'}`} style={{ textWrap: 'balance' }}>
                                        {product.name}
                                    </h3>
                                </ViewTransition>
                                <p className="text-white/50 text-[13px] font-medium">{tagline}</p>
                            </div>
                        </div>
                    </ViewTransition>

                    {/* Description below image — only on hero card */}
                    {isHero && (
                        <div className="p-5 pt-4">
                            <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-[var(--gt-dark-text-muted)]' : 'text-[var(--gt-light-text-secondary)]'}`}>
                                {description}
                            </p>
                        </div>
                    )}
                </div>
            </ViewTransitionLink>
        </motion.div>
    )
}

export function FeaturedProducts({ data, locale }: FeaturedProductsProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null
    const layout = data.layout || 'left'
    const isDark = (data.theme || 'dark') === 'dark'
    const isReversed = layout === 'right'

    const viewAllText = data.viewAllText
        ? getLocalizedContent(data.viewAllText, locale)
        : locale === 'bg' ? 'Виж всички системи' : 'View all systems'
    const viewAllHref = data.viewAllHref || '#'

    const isOdd = data.products.length % 2 !== 0
    const heroProduct = isOdd ? data.products[0] : null
    const gridProducts = isOdd ? data.products.slice(1) : data.products

    const sectionClass = isDark ? 'gt-section-dark' : 'gt-section-light'
    const headingColor = isDark ? 'text-[var(--gt-dark-text)]' : 'text-[var(--gt-light-text)]'
    const subtitleColor = isDark ? 'text-[var(--gt-dark-text-secondary)]' : 'text-[var(--gt-light-text-secondary)]'

    return (
        <section className={`${sectionClass} py-24 lg:py-32 overflow-hidden`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

                    {/* ── Text column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className={`lg:col-span-4 lg:sticky lg:top-28 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
                    >
                        {/* Accent line */}
                        <div className="w-10 h-[2px] bg-[var(--gt-blue)] mb-6 rounded-full" />

                        <h2
                            className={`font-heading text-3xl md:text-4xl lg:text-[40px] font-bold ${headingColor} tracking-tight leading-[1.1] mb-5`}
                            style={{ textWrap: 'balance' }}
                        >
                            {title}
                        </h2>

                        {subtitle && (
                            <p className={`${subtitleColor} text-[15px] leading-relaxed mb-8 max-w-md`}>
                                {subtitle}
                            </p>
                        )}

                        {/* View all link */}
                        {viewAllHref !== '#' && (
                            <Link
                                href={viewAllHref}
                                className="inline-flex items-center gap-2 text-[var(--gt-blue)] hover:text-[var(--gt-blue-light)] text-sm font-medium transition-colors duration-200 group/link cursor-pointer"
                            >
                                {viewAllText}
                                <Icon icon="mdi:arrow-right" className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                        )}
                    </motion.div>

                    {/* ── Products column ── */}
                    <div className={`lg:col-span-8 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Hero product — full width, only when odd count */}
                            {heroProduct && (
                                <div className="sm:col-span-2">
                                    <ProductCard
                                        product={heroProduct}
                                        locale={locale}
                                        index={0}
                                        isHero={true}
                                        isDark={isDark}
                                    />
                                </div>
                            )}

                            {/* Grid products — 2 per row */}
                            {gridProducts.map((product, i) => (
                                <div key={product.id}>
                                    <ProductCard
                                        product={product}
                                        locale={locale}
                                        index={heroProduct ? i + 1 : i}
                                        isHero={false}
                                        isDark={isDark}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
