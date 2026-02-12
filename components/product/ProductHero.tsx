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

export function ProductHero({ data, locale }: ProductHeroProps) {
    const tagline = getLocalizedContent(data.tagline, locale)
    const description = getLocalizedContent(data.description, locale)
    const badge = data.badge ? getLocalizedContent(data.badge, locale) : undefined

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-darker)] via-[var(--gt-dark)] to-[var(--gt-navy)]" />

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {badge && (
                            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-[var(--gt-accent)]/10 text-[var(--gt-accent)] rounded-full mb-4 border border-[var(--gt-accent)]/20">
                                {badge}
                            </span>
                        )}
                        <p className="text-[var(--gt-accent)] font-medium mb-2">{tagline}</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">{data.name}</h1>
                        <p className="text-foreground/70 text-lg leading-relaxed max-w-lg">{description}</p>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative aspect-square max-w-lg mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-blue)]/10 to-[var(--gt-accent)]/10 rounded-3xl" />
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
