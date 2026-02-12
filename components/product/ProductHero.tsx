'use client'

import React, { ViewTransition } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Callout {
    value: string
    label: LocalizedContent<string>
}

interface ProductHeroData {
    type: 'productHero'
    name: string
    tagline: LocalizedContent<string>
    description: LocalizedContent<string>
    image: string
    badge?: LocalizedContent<string>
    highlights?: LocalizedContent<string>[]
    callouts?: Callout[]
    designNote?: LocalizedContent<string>
}

interface ProductHeroProps {
    data: ProductHeroData
    locale: string
}

/** Extract product ID from name for view-transition-name matching */
function nameToId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-')
}

/** Check if a product has a real (non-placeholder) image */
function hasRealImage(src: string): boolean {
    return !!src && !src.includes('/products/')
}

/* ---- Stagger children orchestration ---- */
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
}
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ProductHero({ data, locale }: ProductHeroProps) {
    const tagline = getLocalizedContent(data.tagline, locale)
    const description = getLocalizedContent(data.description, locale)
    const badge = data.badge ? getLocalizedContent(data.badge, locale) : undefined
    const productId = nameToId(data.name)
    const callouts = data.callouts || []
    const designNote = data.designNote ? getLocalizedContent(data.designNote, locale) : null

    return (
        <section className="gt-section-dark relative min-h-screen flex items-center overflow-hidden">
            {/* ── Background layers ── */}
            <div className="absolute inset-0 bg-[#050508]" />

            {/* Primary radial glow — shifted right to sit behind the image */}
            <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[var(--gt-blue)] opacity-[0.07] blur-[180px] pointer-events-none" />
            {/* Secondary accent glow — lower-left for depth */}
            <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[500px] rounded-full bg-blue-500 opacity-[0.04] blur-[140px] pointer-events-none" />
            {/* Warm counter-accent — top-right */}
            <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-400 opacity-[0.03] blur-[120px] pointer-events-none" />

            {/* Subtle grid texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* ── Content: two-column grid ── */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 py-32 lg:py-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch min-h-[70vh]">

                    {/* ═══ LEFT: Product info ═══ */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="max-w-xl flex flex-col justify-center"
                    >
                        {/* Badge */}
                        {badge && (
                            <motion.div variants={fadeUp} className="mb-6">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] bg-(--gt-blue)/10 text-(--gt-blue) rounded-full border border-(--gt-blue)/15 backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-(--gt-blue) animate-pulse" />
                                    {badge}
                                </span>
                            </motion.div>
                        )}

                        {/* Tagline */}
                        <motion.p
                            variants={fadeUp}
                            className="text-(--gt-blue) font-medium text-sm tracking-wide mb-4"
                        >
                            {tagline}
                        </motion.p>

                        {/* Product name — shared element for view transition */}
                        <ViewTransition name={`product-title-${productId}`}>
                            <motion.h1
                                variants={fadeUp}
                                className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 tracking-tight leading-[1.08]"
                            >
                                {data.name}
                            </motion.h1>
                        </ViewTransition>

                        {/* Description */}
                        <motion.p
                            variants={fadeUp}
                            className="text-(--gt-dark-text-secondary) text-base md:text-lg leading-relaxed mb-8"
                        >
                            {description}
                        </motion.p>

                        {/* Design note */}
                        {designNote && (
                            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-2 text-(--gt-dark-text-muted) text-sm">
                                <Icon icon="mdi:palette-outline" className="w-4 h-4 text-(--gt-blue)/60" />
                                <span>{designNote}</span>
                            </motion.div>
                        )}

                        {/* Callout stats — horizontal chips */}
                        {callouts.length > 0 && (
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-wrap gap-3"
                            >
                                {callouts.map((callout, i) => {
                                    const label = getLocalizedContent(callout.label, locale)
                                    return (
                                        <div
                                            key={i}
                                            className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                                        >
                                            <span className="text-xl font-bold text-(--gt-blue) tracking-tight leading-none">
                                                {callout.value}
                                            </span>
                                            <span className="text-(--gt-dark-text-muted) text-sm leading-snug max-w-[160px]">
                                                {label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* ═══ RIGHT: Product image — fills full height ═══ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                        className="relative flex items-stretch justify-center min-h-[400px] lg:min-h-0"
                    >
                        {/* Multi-layer glow effect behind the image */}
                        <div className="absolute inset-[-15%] rounded-full bg-[var(--gt-blue)] opacity-[0.08] blur-[100px] pointer-events-none" />
                        <div className="absolute inset-[-8%] rounded-full bg-blue-400 opacity-[0.05] blur-[70px] pointer-events-none" />
                        <div className="absolute inset-[5%] rounded-full bg-indigo-500 opacity-[0.04] blur-[50px] pointer-events-none" />

                        {/* Shared element — matches <ViewTransition name> in FeaturedProducts */}
                        <ViewTransition name={`product-${productId}`}>
                            <div className="relative w-full h-full">
                                {hasRealImage(data.image) ? (
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent shadow-[0_0_80px_rgba(75,109,177,0.15),0_0_160px_rgba(75,109,177,0.08)]">
                                        <Image
                                            src={data.image}
                                            alt={data.name}
                                            fill
                                            className="object-contain p-8 drop-shadow-[0_20px_60px_rgba(75,109,177,0.3)]"
                                            priority
                                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 680px"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 flex items-center justify-center shadow-[0_0_80px_rgba(75,109,177,0.1)]">
                                        <span className="text-white/[0.06] text-[120px] font-bold tracking-tighter select-none leading-none">
                                            {data.name.split(' ').pop()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </ViewTransition>
                    </motion.div>
                </div>
            </div>

            {/* ── Bottom fade to next section ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-20" />

            {/* ── Scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Icon icon="mdi:chevron-down" className="w-5 h-5 text-white/20" />
                </motion.div>
            </motion.div>
        </section>
    )
}
