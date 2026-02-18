'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

/* ═══════════════════════════════════════════════
   Data interfaces
   ═══════════════════════════════════════════════ */

interface OverviewCallout {
    icon: string
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface OverviewStat {
    value: string
    label: LocalizedContent<string>
    description?: LocalizedContent<string>
}

interface OverviewHighlight {
    icon: string
    value: string
    label: LocalizedContent<string>
    description?: LocalizedContent<string>
}

interface OverviewBadge {
    icon: string
    text: LocalizedContent<string>
}

interface ProductOverviewData {
    type: 'productOverview'
    label: LocalizedContent<string>
    title: LocalizedContent<string>
    description: LocalizedContent<string>
    quote?: LocalizedContent<string>
    callouts: OverviewCallout[]
    stats?: OverviewStat[]
    highlights?: OverviewHighlight[]
    badge?: OverviewBadge
}

interface ProductOverviewProps {
    data: ProductOverviewData
    locale: string
}

/* ═══════════════════════════════════════════════
   Animation presets
   ═══════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.97, y: 14 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease } },
}

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const staggerFast = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

/* ═══════════════════════════════════════════════
   Shared card styles — glass on light background
   ═══════════════════════════════════════════════ */

const glassCard = [
    'relative rounded-[22px]',
    'bg-white/80 backdrop-blur-md',
    'border border-black/4',
    'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
    'hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.07)]',
    'hover:border-black/6',
    'transition-all duration-400',
].join(' ')

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export function ProductOverview({ data, locale }: ProductOverviewProps) {
    const label = getLocalizedContent(data.label, locale)
    const title = getLocalizedContent(data.title, locale)
    const description = getLocalizedContent(data.description, locale)
    const quote = data.quote ? getLocalizedContent(data.quote, locale) : null
    const callouts = data.callouts || []
    const stats = data.stats || []
    const highlights = data.highlights || []
    const badge = data.badge

    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-[#fafafa]">
            {/* ── Ambient background ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-(--gt-blue) opacity-[0.018] blur-[200px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-(--gt-blue) opacity-[0.012] blur-[160px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* ═══════════════════════════════════════
                   Section header — centered
                   ═══════════════════════════════════════ */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-14 lg:mb-20"
                >
                    {label && (
                        <motion.div variants={fadeUp} className="mb-7">
                            <span className="inline-flex items-center px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-(--gt-light-text-secondary) rounded-full border border-(--gt-light-border) bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                {label}
                            </span>
                        </motion.div>
                    )}

                    <motion.h2
                        variants={fadeUp}
                        className="font-heading text-[28px] md:text-[40px] lg:text-[50px] text-(--gt-light-text) tracking-tight leading-[1.08] mb-7 max-w-3xl mx-auto"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        className="text-(--gt-light-text-secondary) text-[15px] md:text-base lg:text-[17px] leading-[1.7] max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                </motion.div>

                {/* ═══════════════════════════════════════
                   Bento grid — quote + callouts + stat
                   ═══════════════════════════════════════ */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="overview-bento max-w-5xl mx-auto mb-5"
                >
                    {/* ── Quote card — dark contrast accent ── */}
                    {quote && (
                        <motion.div
                            variants={scaleIn}
                            className="overview-bento__quote group rounded-[22px] bg-[#1d1d1f] p-8 lg:p-10 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
                        >
                            <p className="text-white/88 text-lg lg:text-[21px] leading-[1.6] italic text-center font-light tracking-[-0.01em]">
                                &ldquo;{quote}&rdquo;
                            </p>
                        </motion.div>
                    )}

                    {/* ── Callout cards — white glass ── */}
                    {callouts.map((callout, index) => {
                        const cTitle = getLocalizedContent(callout.title, locale)
                        const cDesc = getLocalizedContent(callout.description, locale)
                        return (
                            <motion.div
                                key={`c-${index}`}
                                variants={scaleIn}
                                className={`overview-bento__callout group ${glassCard} p-7 lg:p-8`}
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-(--gt-blue)/8 flex items-center justify-center mb-5 ring-1 ring-(--gt-blue)/10">
                                        <Icon icon={callout.icon} className="w-6 h-6 text-(--gt-blue)" />
                                    </div>
                                    <h3 className="text-[17px] font-medium text-(--gt-blue) mb-2 tracking-[-0.01em]">
                                        {cTitle}
                                    </h3>
                                    <p className="text-[14px] text-(--gt-light-text-secondary) leading-relaxed">
                                        {cDesc}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}

                    {/* ── Stat card — brand blue accent ── */}
                    {stats.map((stat, index) => {
                        const sLabel = getLocalizedContent(stat.label, locale)
                        const sDesc = stat.description ? getLocalizedContent(stat.description, locale) : null
                        return (
                            <motion.div
                                key={`s-${index}`}
                                variants={scaleIn}
                                className="overview-bento__stat relative rounded-[22px] bg-linear-to-br from-(--gt-blue) to-[#005bb5] p-7 lg:p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-[0_4px_24px_rgba(0,113,227,0.18)]"
                            >
                                {/* Decorative sparkles */}
                                <span className="absolute top-5 left-5 text-white/25 text-sm select-none pointer-events-none">&#10022;</span>
                                <span className="absolute top-5 right-5 text-white/25 text-sm select-none pointer-events-none">&#10022;</span>
                                <span className="absolute bottom-5 left-7 text-white/15 text-xs select-none pointer-events-none">&#10022;</span>
                                <span className="absolute bottom-5 right-7 text-white/15 text-xs select-none pointer-events-none">&#10022;</span>

                                <span className="text-[52px] lg:text-[60px] font-semibold text-white tracking-tight leading-none mb-3 relative z-10">
                                    {stat.value}
                                </span>
                                <p className="text-[13px] text-white/75 leading-relaxed relative z-10 max-w-[220px]">
                                    {sDesc || sLabel}
                                </p>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* ═══════════════════════════════════════
                   Highlights row — glass metric cards
                   ═══════════════════════════════════════ */}
                {highlights.length > 0 && (
                    <motion.div
                        variants={staggerFast}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        className={`grid gap-4 max-w-5xl mx-auto ${
                            highlights.length === 2
                                ? 'grid-cols-1 md:grid-cols-2'
                                : highlights.length === 3
                                ? 'grid-cols-1 md:grid-cols-3'
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        }`}
                    >
                        {highlights.map((hl, index) => {
                            const hlLabel = getLocalizedContent(hl.label, locale)
                            const hlDesc = hl.description
                                ? getLocalizedContent(hl.description, locale)
                                : null
                            return (
                                <motion.div
                                    key={`hl-${index}`}
                                    variants={scaleIn}
                                    className={`group ${glassCard} p-7 lg:p-8`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-(--gt-blue)/8 flex items-center justify-center shrink-0 ring-1 ring-(--gt-blue)/10">
                                                <Icon icon={hl.icon} className="w-5 h-5 text-(--gt-blue)" />
                                            </div>
                                            <span className="text-3xl md:text-4xl font-semibold text-(--gt-light-text) tracking-tight leading-none">
                                                {hl.value}
                                            </span>
                                        </div>
                                        <h3 className="text-[15px] font-medium text-(--gt-light-text) mb-1.5">
                                            {hlLabel}
                                        </h3>
                                        {hlDesc && (
                                            <p className="text-[13px] text-(--gt-light-text-secondary) leading-relaxed">
                                                {hlDesc}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════
                   Badge / Partner
                   ═══════════════════════════════════════ */}
                {badge && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex flex-col items-center justify-center mt-16 lg:mt-20"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/4">
                            <Icon icon={badge.icon} className="w-7 h-7 text-(--gt-blue)" />
                        </div>
                        <span className="text-sm font-light text-(--gt-light-text-secondary)">
                            {getLocalizedContent(badge.text, locale)}
                        </span>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
