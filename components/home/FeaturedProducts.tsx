'use client'

import React, { ViewTransition } from 'react'
import Image from 'next/image'
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
}

interface FeaturedProductsProps {
    data: FeaturedProductsData
    locale: string
}

/** Check if a product has a real (non-placeholder) image */
function hasRealImage(src: string): boolean {
    return !!src && !src.includes('/products/')
}

/** Gradient placeholders per product for when images aren't ready */
const productGradients: Record<string, string> = {
    'genesis-alpha': 'from-slate-900 via-blue-950 to-slate-900',
    'genesis-universa': 'from-slate-900 via-gray-900 to-slate-900',
    'genesis-prime': 'from-slate-900 via-emerald-950 to-slate-900',
    'genesis-eclipse': 'from-slate-900 via-purple-950 to-slate-900',
    'genesis-solaris-2': 'from-slate-900 via-amber-950 to-slate-900',
    'genesis-equinox': 'from-slate-900 via-cyan-950 to-slate-900',
    'genesis-solaris': 'from-slate-900 via-orange-950 to-slate-900',
}

export function FeaturedProducts({ data, locale }: FeaturedProductsProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null

    return (
        <section className="gt-section-dark py-28 lg:py-36">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-[44px] font-semibold text-[var(--gt-dark-text)] tracking-tight">{title}</h2>
                    {subtitle && <p className="text-[var(--gt-dark-text-secondary)] text-lg mt-5 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {data.products.map((product, index) => {
                        const tagline = getLocalizedContent(product.tagline, locale)
                        const description = product.description ? getLocalizedContent(product.description, locale) : tagline
                        const gradient = productGradients[product.id] || 'from-slate-900 to-gray-900'

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ViewTransitionLink href={product.href} className="group block">
                                    <div className="glass-card-dark overflow-hidden">
                                        {/* Product image — shared element via <ViewTransition name> */}
                                        <ViewTransition name={`product-${product.id}`}>
                                            <div
                                                className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}
                                            >
                                                {hasRealImage(product.image) && (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                )}
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                                                    <span className="flex items-center gap-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                        {locale === 'bg' ? 'Разгледай' : 'Explore'}
                                                        <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </ViewTransition>

                                        <div className="p-6">
                                            {/* Product title — shared element via <ViewTransition name> */}
                                            <ViewTransition name={`product-title-${product.id}`}>
                                                <h3 className="text-lg font-semibold text-[var(--gt-dark-text)] mb-2">
                                                    {product.name}
                                                </h3>
                                            </ViewTransition>
                                            <p className="text-[var(--gt-dark-text-muted)] text-sm leading-relaxed line-clamp-2">{description}</p>
                                        </div>
                                    </div>
                                </ViewTransitionLink>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
