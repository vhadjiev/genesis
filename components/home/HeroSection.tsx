'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    return (
        <section ref={sectionRef} className="gt-section-dark relative h-screen min-h-[700px] flex items-center overflow-hidden">
            {/* Parallax background */}
            {data.backgroundImage ? (
                <motion.div className="absolute inset-0" style={{ y: bgY }}>
                    <Image
                        src={data.backgroundImage}
                        alt=""
                        fill
                        className="object-cover scale-110"
                        priority
                    />
                </motion.div>
            ) : (
                <div className="absolute inset-0 bg-black">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle at 30% 40%, var(--gt-blue) 0%, transparent 50%), radial-gradient(circle at 70% 60%, var(--gt-blue-dark) 0%, transparent 50%)',
                    }} />
                </div>
            )}
            <div className="hero-overlay" />

            {/* Content */}
            <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-text max-w-4xl mx-auto"
                >
                    <h1 className="hero-title">
                        {title}
                    </h1>
                    <p className="hero-subtitle">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                        <Link
                            href={data.ctaPrimary ? data.ctaPrimary.href : '/equipment/genesis-universa'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-medium text-[15px] rounded-full transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
                        >
                            {data.ctaPrimary ? getLocalizedContent(data.ctaPrimary.text, locale) : (locale === 'bg' ? 'Разгледай системите' : 'Explore Our Systems')}
                        </Link>
                        <Link
                            href={data.ctaSecondary ? data.ctaSecondary.href : '/contacts'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/8 backdrop-blur-xl hover:bg-white/15 text-white font-medium text-[15px] rounded-full transition-all duration-300 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                        >
                            {data.ctaSecondary ? getLocalizedContent(data.ctaSecondary.text, locale) : (locale === 'bg' ? 'Заявете консултация' : 'Schedule a Consultation')}
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    )
}
