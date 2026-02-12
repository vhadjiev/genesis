'use client'

import React, { ViewTransition, useState, useEffect } from 'react'
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

/* ---- Stagger orchestration ----
   Container does NOT set opacity — that would hide the <ViewTransition>
   title at capture time and break the shared-element morph. */
const stagger = {
    hidden: {},
    show: {
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

    // Detect if we arrived via a ViewTransition navigation.
    // When true, shared elements (title, image) render at full opacity so the
    // browser captures a visible snapshot for the morph. On direct page load
    // the flag is absent, so framer-motion entrance animations play normally.
    const [isVTNav] = useState(() => {
        if (typeof window === 'undefined') return false
        return !!(window as any).__vtNavigating
    })
    useEffect(() => {
        delete (window as any).__vtNavigating
    }, [])

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

            {/* ═══ Product image — single element, always in DOM ═══
                 On desktop: absolute, right half, inset for rounded container.
                 On mobile: full width background behind text.
                 Single <ViewTransition name> so the morph works at all viewports + back nav. */}
            <div className="absolute top-0 right-0 bottom-0 left-0 lg:left-1/2 z-10 pointer-events-none flex items-center justify-center lg:py-24 lg:px-8 lg:pr-12">
                {/* Multi-layer glow */}
                <div className="absolute inset-[-15%] rounded-full bg-[var(--gt-blue)] opacity-[0.1] blur-[120px] pointer-events-none" />
                <div className="absolute top-[10%] right-[5%] w-[80%] h-[80%] rounded-full bg-blue-400 opacity-[0.06] blur-[90px] pointer-events-none" />
                <div className="absolute bottom-[15%] left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500 opacity-[0.04] blur-[70px] pointer-events-none" />

                <div className="relative w-full h-full max-h-full">
                    {/* ViewTransition wraps the rounded container so the snapshot includes border-radius.
                         motion.div adds an entrance animation on direct load; initial={false}
                         during VT navigation keeps the element visible for snapshot capture. */}
                    {hasRealImage(data.image) ? (
                        <ViewTransition name={`product-${productId}`}>
                            <motion.div
                                initial={isVTNav ? false : { opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
                                className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent shadow-[0_0_100px_rgba(75,109,177,0.18),0_0_200px_rgba(75,109,177,0.08)]"
                            >
                                <Image
                                    src={data.image}
                                    alt={data.name}
                                    fill
                                    className="object-contain lg:object-cover drop-shadow-[0_25px_80px_rgba(75,109,177,0.35)]"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </motion.div>
                        </ViewTransition>
                    ) : (
                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/[0.04] bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 flex items-center justify-center shadow-[0_0_100px_rgba(75,109,177,0.1)]">
                            <span className="text-white/[0.05] text-[80px] lg:text-[140px] font-bold tracking-tighter select-none leading-none">
                                {data.name.split(' ').pop()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Content — sits on top of the image on mobile, left half on desktop ── */}
            <div className="relative z-20 container mx-auto px-4 md:px-6 py-32 lg:py-40">
                <div className="lg:w-1/2 lg:pr-12">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="max-w-xl flex flex-col justify-center min-h-[60vh]"
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

                        {/* Product name — motion.h1 with conditional initial:
                             • VT navigation → initial={false} keeps it visible for the snapshot
                             • Direct load → fadeUp variant plays the stagger entrance */}
                        <ViewTransition name={`product-title-${productId}`}>
                            <motion.h1
                                variants={fadeUp}
                                initial={isVTNav ? false : 'hidden'}
                                animate="show"
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
