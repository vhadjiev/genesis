'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

    return (
        <section ref={sectionRef} className="gt-section-dark relative h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            {data.backgroundImage && (
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.backgroundImage})`, y: bgY }}
                />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

            {/* Content */}
            <div className="relative container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                    {subtitle && <p className="text-[var(--gt-blue)] text-sm font-medium tracking-wide mb-3">{subtitle}</p>}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                        {title}
                    </h1>
                </motion.div>
            </div>
        </section>
    )
}
