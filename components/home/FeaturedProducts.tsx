'use client'

import React from 'react'
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

/** Unique gradient for each product as image placeholder */
const productGradients: Record<string, string> = {
    'genesis-alpha': 'from-[#1a1520] via-[#1f1a2e] to-[#0f0d18]',
    'genesis-universa': 'from-[#1a1815] via-[#1f1c18] to-[#12100d]',
    'genesis-prime': 'from-[#151a18] via-[#182018] to-[#0d1210]',
    'genesis-eclipse': 'from-[#1a1518] via-[#201820] to-[#120d10]',
    'genesis-solaris-2': 'from-[#1a1a15] via-[#20201a] to-[#12120d]',
    'genesis-equinox': 'from-[#151820] via-[#181d28] to-[#0d1018]',
    'genesis-solaris': 'from-[#1a1815] via-[#201e18] to-[#12100d]',
}

export function FeaturedProducts({ data, locale }: FeaturedProductsProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null

    return (
        <section className="py-32 relative">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] text-[var(--gt-text)] italic">{title}</h2>
                    {subtitle && <p className="text-[var(--gt-text-secondary)] text-lg mt-5 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
                    <div className="gold-accent-line mx-auto mt-8" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {data.products.map((product, index) => {
                        const tagline = getLocalizedContent(product.tagline, locale)
                        const description = product.description ? getLocalizedContent(product.description, locale) : tagline
                        const gradient = productGradients[product.id] || 'from-[#1a1a1f] to-[#0f0f14]'

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ViewTransitionLink href={product.href} className="group block">
                                    <div className="glass-card rounded-2xl overflow-hidden">
                                        {/* Product image with view transition name */}
                                        <div
                                            className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}
                                            style={{ viewTransitionName: `product-${product.id}` }}
                                        >
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-[var(--gt-bg)]/0 group-hover:bg-[var(--gt-bg)]/30 transition-all duration-500 flex items-center justify-center">
                                                <span className="flex items-center gap-2 text-sm font-medium text-[var(--gt-text)] uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                    {locale === 'bg' ? 'Разгледай' : 'Explore'}
                                                    <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-7">
                                            <h3 className="font-display text-xl italic text-[var(--gt-text)] mb-2">{product.name}</h3>
                                            <p className="text-[var(--gt-text-muted)] text-sm leading-relaxed line-clamp-2">{description}</p>
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
