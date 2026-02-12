'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Feature {
    icon: string
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface ProductFeaturesData {
    type: 'productFeatures'
    features: Feature[]
}

interface ProductFeaturesProps {
    data: ProductFeaturesData
    locale: string
}

export function ProductFeatures({ data, locale }: ProductFeaturesProps) {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {data.features.map((feature, index) => {
                        const title = getLocalizedContent(feature.title, locale)
                        const description = getLocalizedContent(feature.description, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-7 text-center group relative overflow-hidden"
                            >
                                {/* Top gold accent */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-[var(--gt-gold)] to-transparent opacity-40 group-hover:w-16 group-hover:opacity-80 transition-all duration-500" />

                                <div className="w-14 h-14 rounded-xl bg-[var(--gt-gold)]/8 flex items-center justify-center mx-auto mb-5">
                                    <Icon icon={feature.icon} className="w-7 h-7 text-[var(--gt-gold)]" />
                                </div>
                                <h3 className="text-base font-semibold text-[var(--gt-text)] mb-2">{title}</h3>
                                <p className="text-[var(--gt-text-muted)] text-sm leading-relaxed">{description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
