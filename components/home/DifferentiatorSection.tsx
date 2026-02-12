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
        <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--gt-blue)]/[0.02] to-transparent" />

            <div className="relative container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
                    <div className="w-20 h-1 bg-[var(--gt-blue)] mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                className="glass-card rounded-2xl p-8 text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-[var(--gt-blue)]/10 flex items-center justify-center mx-auto mb-6">
                                    <Icon icon={pillar.icon} className="w-7 h-7 text-[var(--gt-blue)]" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4">{pillarTitle}</h3>
                                <p className="text-foreground/60 leading-relaxed mb-6">{pillarDesc}</p>
                                <div className="pt-6 border-t border-foreground/[0.06]">
                                    <div className="text-3xl font-bold text-gradient">{pillar.stat.value}</div>
                                    <p className="text-foreground/50 text-sm uppercase tracking-wider mt-1">{statLabel}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
