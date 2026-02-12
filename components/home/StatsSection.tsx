'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface StatItem {
    value: number
    suffix?: string
    label: LocalizedContent<string>
}

interface StatsSectionData {
    type: 'statsSection'
    stats: StatItem[]
}

interface StatsSectionProps {
    data: StatsSectionData
    locale: string
}

export function StatsSection({ data, locale }: StatsSectionProps) {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {data.stats.map((stat, index) => {
                        const label = getLocalizedContent(stat.label, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-6xl font-bold text-gradient mb-3">
                                    {stat.value}
                                    {stat.suffix && <span>{stat.suffix}</span>}
                                </div>
                                <p className="text-foreground/60 text-lg uppercase tracking-wider">{label}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
