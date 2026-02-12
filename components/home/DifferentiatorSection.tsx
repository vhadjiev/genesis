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
        <section className="gt-section-light py-28 lg:py-36">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-[44px] font-semibold text-[var(--gt-light-text)] tracking-tight">{title}</h2>
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
                                className="glass-card-light p-8 lg:p-10 text-center group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-blue-50/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-7">
                                    <Icon icon={pillar.icon} className="w-7 h-7 text-[var(--gt-blue)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--gt-light-text)] mb-4">{pillarTitle}</h3>
                                <p className="text-[var(--gt-light-text-secondary)] leading-relaxed mb-8 text-sm">{pillarDesc}</p>

                                <div className="pt-6 border-t border-[var(--gt-light-border)]">
                                    <div className="font-mono text-3xl font-bold text-[var(--gt-blue)] tracking-tight">{pillar.stat.value}</div>
                                    <p className="text-[var(--gt-light-text-muted)] text-[11px] uppercase tracking-widest mt-2">{statLabel}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
