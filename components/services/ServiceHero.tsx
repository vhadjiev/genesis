'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ServiceHeroData {
    type: 'serviceHero'
    name: LocalizedContent<string>
    tagline: LocalizedContent<string>
    description: LocalizedContent<string>
    image: string
}

interface ServiceHeroProps {
    data: ServiceHeroData
    locale: string
}

export function ServiceHero({ data, locale }: ServiceHeroProps) {
    const name = getLocalizedContent(data.name, locale)
    const tagline = getLocalizedContent(data.tagline, locale)
    const description = getLocalizedContent(data.description, locale)

    return (
        <section className="relative min-h-[65vh] flex items-center overflow-hidden pt-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-bg)] via-[var(--gt-surface)] to-[var(--gt-bg)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gt-gold)]/[0.02] rounded-full blur-[100px]" />

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <p className="text-[var(--gt-gold)] font-medium text-sm uppercase tracking-[0.1em] mb-3">{tagline}</p>
                        <h1 className="font-display text-4xl md:text-5xl text-[var(--gt-text)] mb-6 italic">{name}</h1>
                        <p className="text-[var(--gt-text-secondary)] text-lg leading-relaxed max-w-lg">{description}</p>
                        <div className="gold-accent-line mt-8" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="relative aspect-video rounded-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-gold)]/[0.05] to-transparent" />
                        <Image
                            src={data.image}
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
