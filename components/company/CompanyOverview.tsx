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

interface CompanyOverviewData {
    type: 'companyOverview'
    title: LocalizedContent<string>
    description: LocalizedContent<string>
    stats?: StatItem[]
}

interface CompanyOverviewProps {
    data: CompanyOverviewData
    locale: string
}

export function CompanyOverview({ data, locale }: CompanyOverviewProps) {
    const title = getLocalizedContent(data.title, locale)
    const description = getLocalizedContent(data.description, locale)

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{title}</h2>
                        <p className="text-foreground/70 text-lg leading-relaxed">{description}</p>
                    </motion.div>

                    {data.stats && data.stats.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            {data.stats.map((stat, index) => {
                                const label = getLocalizedContent(stat.label, locale)
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="text-center glass-card rounded-2xl p-8"
                                    >
                                        <div className="text-4xl font-bold text-gradient mb-2">
                                            {stat.value}{stat.suffix || ''}
                                        </div>
                                        <p className="text-foreground/60">{label}</p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
