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
    title?: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
    label?: LocalizedContent<string>
    features: Feature[]
    variant?: 'grid' | 'columns'
}

interface ProductFeaturesProps {
    data: ProductFeaturesData
    locale: string
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ProductFeatures({ data, locale }: ProductFeaturesProps) {
    const title = data.title ? getLocalizedContent(data.title, locale) : null
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null
    const label = data.label ? getLocalizedContent(data.label, locale) : null
    const features = data.features || []

    if (features.length === 0) return null

    const colCount = features.length <= 3 ? features.length : features.length <= 4 ? 2 : features.length <= 6 ? 3 : 4

    return (
        <section className="gt-section-light py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section header */}
                {(title || subtitle || label) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center mb-16"
                    >
                        {label && (
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-(--gt-blue) mb-4">
                                {label}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold text-(--gt-light-text) tracking-tight mb-4 leading-[1.15]">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-(--gt-light-text-secondary) text-lg leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Feature grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className={`grid gap-5 ${
                        colCount === 2
                            ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
                            : colCount === 3
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}
                >
                    {features.map((feature, index) => {
                        const featureTitle = getLocalizedContent(feature.title, locale)
                        const description = getLocalizedContent(feature.description, locale)

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative rounded-2xl p-7 bg-white border border-(--gt-light-border) hover:border-(--gt-blue)/15 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,113,227,0.06)] cursor-default"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-(--gt-blue)/[0.07] flex items-center justify-center mb-5 group-hover:bg-(--gt-blue)/12 transition-colors duration-300">
                                    <Icon
                                        icon={feature.icon}
                                        className="w-6 h-6 text-(--gt-blue)"
                                    />
                                </div>

                                {/* Content */}
                                <h3 className="text-base font-semibold text-(--gt-light-text) mb-2 leading-snug">
                                    {featureTitle}
                                </h3>
                                <p className="text-sm text-(--gt-light-text-secondary) leading-relaxed">
                                    {description}
                                </p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
