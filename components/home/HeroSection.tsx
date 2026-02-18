'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
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

const SHOWCASE = {
    primary: '/images/universa/genesis-universa-ese-pods.jpg',
    secondary: '/images/universa/genesis-universa-ese-pods.jpg',
    detail: '/images/universa/genesis-universa.jpg',
} as const

export function HeroSection({ data, locale }: HeroSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const sectionRef = useRef<HTMLElement>(null)
    const prefersReducedMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })

    const still = !!prefersReducedMotion
    const layerDeep = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 80])
    const layerMid = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 140])
    const layerFront = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 220])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
    const contentY = useTransform(scrollYProgress, [0, 0.55], still ? [0, 0] : [0, 80])
    const primaryScale = useTransform(scrollYProgress, [0, 0.6], still ? [1, 1] : [1, 1.06])

    return (
        <section
            ref={sectionRef}
            className="gt-section-dark relative h-screen min-h-[700px] flex items-center overflow-hidden"
        >
            {/* L0 — Deep background with exhibition spotlights */}
            <div className="absolute inset-0 bg-[#04040a]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 900px 700px at 68% 38%, rgba(170, 145, 70, 0.055) 0%, transparent 70%),
                            radial-gradient(ellipse 650px 500px at 22% 58%, rgba(0, 113, 227, 0.04) 0%, transparent 65%),
                            radial-gradient(ellipse 1400px 350px at 50% 100%, rgba(0, 0, 0, 0.95) 0%, transparent 50%)
                        `,
                    }}
                />
            </div>

            {/* L1 — Detail texture: touchscreen close-up (deepest, slowest) */}
            <motion.div
                className="absolute inset-[-12%] hidden lg:block"
                style={{ y: layerDeep }}
            >
                <Image
                    src={SHOWCASE.detail}
                    alt=""
                    fill
                    className="object-cover opacity-[0.07] blur-[3px] scale-[1.4]"
                    sizes="100vw"
                />
            </motion.div>

            {/* L2 — Secondary product: black machine (mid-depth) */}
            <motion.div
                className="hero-floating-product hero-floating-product--secondary"
                style={{ y: layerMid }}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 0.4, x: 0 }}
                transition={{ duration: 1.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                    <Image
                        src={SHOWCASE.secondary}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 0vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04040a]/50 to-transparent" />
                </div>
            </motion.div>

            {/* L3 — Primary product: gold machine (foreground, fastest) */}
            <motion.div
                className="hero-floating-product hero-floating-product--primary"
                style={{ y: layerFront, scale: primaryScale }}
                initial={{ opacity: 0, x: 60, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="absolute -inset-[40%] rounded-full bg-[radial-gradient(ellipse,rgba(170,145,70,0.07)_0%,transparent_65%)] pointer-events-none" />
                <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
                    <Image
                        src={SHOWCASE.primary}
                        alt="Genesis Universa — Premium Coffee System"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 0vw, (max-width: 1024px) 42vw, 44vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-t from-[#04040a] via-[#04040a]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04040a]/25 to-transparent" />
                </div>
            </motion.div>

            {/* Mobile backdrop — subtle product presence */}
            <motion.div
                className="absolute inset-0 md:hidden"
                style={{ y: layerDeep }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.22 }}
                transition={{ duration: 1.2 }}
            >
                <Image
                    src={SHOWCASE.primary}
                    alt=""
                    fill
                    className="object-cover object-[center_20%]"
                    priority
                    sizes="100vw"
                />
            </motion.div>

            {/* Vignette overlay — ensures text readability */}
            <div className="hero-vignette" />
            <div className="absolute inset-0 md:hidden z-[4] bg-[#04040a]/55" />

            {/* Content */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 container mx-auto px-4 md:px-6"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-text max-w-4xl mx-auto lg:mx-0 lg:max-w-[620px]"
                >
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-[2px] bg-[var(--gt-blue)] mx-auto lg:mx-0 mb-8 origin-center lg:origin-left"
                    />

                    <h1 className="hero-title lg:text-left">{title}</h1>
                    <p className="hero-subtitle lg:text-left lg:mx-0">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
                        <Link
                            href={data.ctaPrimary?.href ?? '/equipment/genesis-universa'}
                            className="hero-cta-primary"
                        >
                            {data.ctaPrimary
                                ? getLocalizedContent(data.ctaPrimary.text, locale)
                                : locale === 'bg'
                                  ? 'Разгледай системите'
                                  : 'Explore Our Systems'}
                        </Link>
                        <Link
                            href={data.ctaSecondary?.href ?? '/contacts'}
                            className="hero-cta-secondary"
                        >
                            {data.ctaSecondary
                                ? getLocalizedContent(data.ctaSecondary.text, locale)
                                : locale === 'bg'
                                  ? 'Заявете консултация'
                                  : 'Schedule a Consultation'}
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 2.2, duration: 1 }}
            >
                <motion.div
                    className="w-[22px] h-[34px] rounded-full border border-white/20 flex justify-center pt-2"
                    animate={{ opacity: [0.45, 0.15, 0.45] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <motion.div
                        className="w-[3px] h-[6px] rounded-full bg-white/40"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </motion.div>

            {/* Bottom gradient bleed into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
        </section>
    )
}
