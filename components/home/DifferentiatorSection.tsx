'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Pillar {
    icon: string
    title: LocalizedContent<string>
    description: LocalizedContent<string>
    stat: {
        value: string
        label: LocalizedContent<string>
    }
}

interface DifferentiatorSectionData {
    type: 'differentiatorSection'
    title: LocalizedContent<string>
    pillars: Pillar[]
}

interface DifferentiatorSectionProps {
    data: DifferentiatorSectionData
    locale: string
}

export function DifferentiatorSection({ data, locale }: DifferentiatorSectionProps) {
    const title = getLocalizedContent(data.title, locale)

    return (
        <section className="py-32 relative">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gt-gold)]/[0.015] to-transparent" />

            <div className="relative container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] text-[var(--gt-text)] italic">{title}</h2>
                    <div className="gold-accent-line mx-auto mt-8" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {data.pillars.map((pillar, index) => {
                        const pillarTitle = getLocalizedContent(pillar.title, locale)
                        const pillarDesc = getLocalizedContent(pillar.description, locale)
                        const statLabel = getLocalizedContent(pillar.stat.label, locale)

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="glass-card rounded-2xl p-8 lg:p-10 text-center relative overflow-hidden group"
                            >
                                {/* Top gold accent line */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[var(--gt-gold)] to-transparent opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-500" />

                                <div className="w-14 h-14 rounded-full bg-[var(--gt-gold)]/8 flex items-center justify-center mx-auto mb-7">
                                    <Icon icon={pillar.icon} className="w-7 h-7 text-[var(--gt-gold)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--gt-text)] mb-4">{pillarTitle}</h3>
                                <p className="text-[var(--gt-text-secondary)] leading-relaxed mb-8 text-sm">{pillarDesc}</p>

                                <div className="pt-6 border-t border-[var(--gt-border-subtle)]">
                                    <div className="font-mono text-3xl font-bold text-gradient tracking-tight">{pillar.stat.value}</div>
                                    <p className="text-[var(--gt-text-muted)] text-[11px] uppercase tracking-[0.15em] mt-2">{statLabel}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
