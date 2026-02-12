'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ServiceFeature {
    icon: string
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface ServiceDetailsData {
    type: 'serviceDetails'
    title: LocalizedContent<string>
    features: ServiceFeature[]
}

interface ServiceDetailsProps {
    data: ServiceDetailsData
    locale: string
}

export function ServiceDetails({ data, locale }: ServiceDetailsProps) {
    const title = getLocalizedContent(data.title, locale)

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-[var(--gt-text)] italic">{title}</h2>
                    <div className="gold-accent-line mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {data.features.map((feature, index) => {
                        const featureTitle = getLocalizedContent(feature.title, locale)
                        const featureDesc = getLocalizedContent(feature.description, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-7 flex gap-5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--gt-gold)]/8 flex items-center justify-center shrink-0">
                                    <Icon icon={feature.icon} className="w-6 h-6 text-[var(--gt-gold)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--gt-text)] mb-1.5">{featureTitle}</h3>
                                    <p className="text-[var(--gt-text-muted)] text-sm leading-relaxed">{featureDesc}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
