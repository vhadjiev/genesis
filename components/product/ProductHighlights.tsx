'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Highlight {
    icon: string
    value: string
    label: LocalizedContent<string>
    description?: LocalizedContent<string>
}

interface ProductHighlightsData {
    type: 'productHighlights'
    title?: LocalizedContent<string>
    highlights: Highlight[]
}

interface ProductHighlightsProps {
    data: ProductHighlightsData
    locale: string
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ProductHighlights({ data, locale }: ProductHighlightsProps) {
    const title = data.title ? getLocalizedContent(data.title, locale) : null

    if (!data.highlights || data.highlights.length === 0) return null

    return (
        <section className="gt-section-dark relative py-20 lg:py-28 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-(--gt-blue) opacity-[0.03] blur-[160px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {title && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-white tracking-tight">{title}</h2>
                    </motion.div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className={`grid gap-6 ${
                        data.highlights.length === 2
                            ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
                            : data.highlights.length === 3
                            ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}
                >
                    {data.highlights.map((highlight, index) => {
                        const label = getLocalizedContent(highlight.label, locale)
                        const description = highlight.description
                            ? getLocalizedContent(highlight.description, locale)
                            : null

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative rounded-3xl p-8 bg-white/3 border border-white/6 backdrop-blur-sm hover:bg-white/6 hover:border-white/10 transition-all duration-400"
                            >
                                {/* Subtle glow on hover */}
                                <div className="absolute inset-0 rounded-3xl bg-(--gt-blue) opacity-0 group-hover:opacity-[0.04] blur-xl transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-11 h-11 rounded-2xl bg-(--gt-blue)/10 flex items-center justify-center shrink-0">
                                            <Icon icon={highlight.icon} className="w-5 h-5 text-(--gt-blue)" />
                                        </div>
                                        <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-none">
                                            {highlight.value}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-medium text-white/90 mb-1.5">{label}</h3>

                                    {description && (
                                        <p className="text-sm text-(--gt-dark-text-muted) leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
