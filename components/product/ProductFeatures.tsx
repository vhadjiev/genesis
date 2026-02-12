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
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                className="glass-card rounded-2xl p-6 text-center"
                            >
                                <div className="w-14 h-14 rounded-xl bg-[var(--gt-blue)]/10 flex items-center justify-center mx-auto mb-4">
                                    <Icon icon={feature.icon} className="w-7 h-7 text-[var(--gt-accent)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                                <p className="text-foreground/60 text-sm">{description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
