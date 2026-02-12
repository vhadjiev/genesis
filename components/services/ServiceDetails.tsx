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
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
                    <div className="w-16 h-1 bg-[var(--gt-blue)] mx-auto mt-4" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                                className="glass-card rounded-2xl p-6 flex gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--gt-blue)]/10 flex items-center justify-center shrink-0">
                                    <Icon icon={feature.icon} className="w-6 h-6 text-[var(--gt-accent)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">{featureTitle}</h3>
                                    <p className="text-foreground/60 text-sm">{featureDesc}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
