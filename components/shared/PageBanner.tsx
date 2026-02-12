'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface PageBannerData {
    type: 'pageBanner'
    backgroundImage?: string
    title: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
}

interface PageBannerProps {
    data: PageBannerData
    locale: string
}

export function PageBanner({ data, locale }: PageBannerProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle
        ? getLocalizedContent(data.subtitle, locale)
        : undefined

    return (
        <section className="relative h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            {data.backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.backgroundImage})` }}
                />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[var(--gt-bg)]/75" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--gt-bg)]/60 via-transparent to-[var(--gt-bg)]" />

            {/* Content */}
            <div className="relative container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                    {subtitle && <p className="text-[var(--gt-gold)] text-sm uppercase tracking-[0.1em] mb-3">{subtitle}</p>}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--gt-text)] italic">
                        {title}
                    </h1>
                    <div className="gold-accent-line mx-auto mt-8" />
                </motion.div>
            </div>
        </section>
    )
}
