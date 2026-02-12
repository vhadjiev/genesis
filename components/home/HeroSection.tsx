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
        <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
            {/* Background with Ken Burns */}
            {data.backgroundImage ? (
                <div className="absolute inset-0">
                    <Image
                        src={data.backgroundImage}
                        alt=""
                        fill
                        className="object-cover ken-burns-zoom"
                        priority
                    />
                </div>
            ) : (
                /* Premium gradient placeholder */
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-bg)] via-[var(--gt-surface)] to-[var(--gt-bg)]">
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, var(--gt-gold) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--gt-gold) 0%, transparent 50%)',
                    }} />
                </div>
            )}
            <div className="hero-overlay" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-text max-w-3xl"
                >
                    {/* Decorative label */}
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 48 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="gold-accent-line mb-8"
                    />

                    <h1 className="hero-title">
                        {title}
                    </h1>
                    <p className="hero-subtitle">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <Link
                            href={data.ctaPrimary ? data.ctaPrimary.href : '/equipment/genesis-universa'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--gt-gold)] hover:bg-[var(--gt-gold-light)] text-[var(--gt-bg)] font-semibold text-sm tracking-wide uppercase rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[var(--gt-gold)]/15"
                        >
                            {data.ctaPrimary ? getLocalizedContent(data.ctaPrimary.text, locale) : (locale === 'bg' ? 'Разгледай системите' : 'Explore Our Systems')}
                        </Link>
                        <Link
                            href={data.ctaSecondary ? data.ctaSecondary.href : '/contacts'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[var(--gt-gold)]/30 hover:border-[var(--gt-gold)]/60 text-[var(--gt-text)] font-medium text-sm tracking-wide uppercase rounded-lg transition-all duration-300"
                        >
                            {data.ctaSecondary ? getLocalizedContent(data.ctaSecondary.text, locale) : (locale === 'bg' ? 'Заявете консултация' : 'Schedule a Consultation')}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--gt-bg)] to-transparent z-10" />
        </section>
    )
}
