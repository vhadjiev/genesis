'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ProductHeroData {
    type: 'productHero'
    name: string
    tagline: LocalizedContent<string>
    description: LocalizedContent<string>
    image: string
    badge?: LocalizedContent<string>
}

interface ProductHeroProps {
    data: ProductHeroData
    locale: string
}

/** Extract product ID from name for view-transition-name matching */
function nameToId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-')
}

export function ProductHero({ data, locale }: ProductHeroProps) {
    const tagline = getLocalizedContent(data.tagline, locale)
    const description = getLocalizedContent(data.description, locale)
    const badge = data.badge ? getLocalizedContent(data.badge, locale) : undefined
    const productId = nameToId(data.name)

    return (
        <section className="gt-section-dark relative min-h-[75vh] flex items-center overflow-hidden pt-24">
            {/* Subtle blue gradient background */}
            <div className="absolute inset-0 bg-black" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--gt-blue)] opacity-[0.04] rounded-full blur-[120px]" />

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {badge && (
                            <span className="inline-block px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest bg-[var(--gt-blue)]/10 text-[var(--gt-blue)] rounded-full mb-5 border border-[var(--gt-blue)]/20">
                                {badge}
                            </span>
                        )}
                        <p className="text-[var(--gt-blue)] font-medium text-sm tracking-wide mb-3">{tagline}</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--gt-dark-text)] mb-6 tracking-tight">{data.name}</h1>
                        <p className="text-[var(--gt-dark-text-secondary)] text-lg leading-relaxed max-w-lg">{description}</p>
                        <div className="accent-line mt-8" />
                    </motion.div>

                    {/* Image — matches view-transition-name from FeaturedProducts */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="relative aspect-square max-w-lg mx-auto"
                        style={{ viewTransitionName: `product-${productId}` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-blue)]/[0.04] to-transparent rounded-3xl" />
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            className="object-contain p-8"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
