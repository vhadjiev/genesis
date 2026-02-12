'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface HeroCTA {
    text: LocalizedContent<string>
    href: string
}

interface HeroSectionData {
    type: 'heroSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    backgroundImage?: string
    ctaPrimary?: HeroCTA
    ctaSecondary?: HeroCTA
}

interface HeroSectionProps {
    data: HeroSectionData
    locale: string
}

export function HeroSection({ data, locale }: HeroSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)

    return (
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
            {/* Background */}
            {data.backgroundImage && (
                <div className="absolute inset-0">
                    <Image
                        src={data.backgroundImage}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
            <div className="hero-overlay" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="hero-text max-w-3xl"
                >
                    <h1 className="hero-title">
                        <span className="hero-title-accent">Genesis</span>
                        <br />
                        Technology
                    </h1>
                    <p className="hero-subtitle">{subtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link
                            href={data.ctaPrimary ? data.ctaPrimary.href : '/equipment/genesis-universa'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-semibold rounded-lg transition-colors"
                        >
                            {data.ctaPrimary ? getLocalizedContent(data.ctaPrimary.text, locale) : (locale === 'bg' ? 'Разгледай продуктите' : 'View Products')}
                        </Link>
                        <Link
                            href={data.ctaSecondary ? data.ctaSecondary.href : '/contacts'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-colors"
                        >
                            {data.ctaSecondary ? getLocalizedContent(data.ctaSecondary.text, locale) : (locale === 'bg' ? 'Свържи се' : 'Contact Us')}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--gt-dark)] to-transparent z-10" />
        </section>
    )
}
