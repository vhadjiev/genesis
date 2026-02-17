'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ProductCTAData {
    type: 'productCTA'
    title: LocalizedContent<string>
    description: LocalizedContent<string>
    buttonLabel: LocalizedContent<string>
    buttonHref?: string
    features?: LocalizedContent<string>[]
}

interface ProductCTAProps {
    data: ProductCTAData
    locale: string
}

export function ProductCTA({ data, locale }: ProductCTAProps) {
    const title = getLocalizedContent(data.title, locale)
    const description = getLocalizedContent(data.description, locale)
    const buttonLabel = getLocalizedContent(data.buttonLabel, locale)
    const href = data.buttonHref || '/contacts'

    const features = data.features
        ? data.features.map((f) => getLocalizedContent(f, locale))
        : []

    return (
        <section className="gt-section-dark relative py-24 lg:py-32 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[#050508]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-(--gt-blue) opacity-[0.06] blur-[200px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500 opacity-[0.03] blur-[120px] pointer-events-none" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Section heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                            {title}
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-(--gt-dark-text-secondary) text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>

                    {/* Feature checklist */}
                    {features.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12"
                        >
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-(--gt-blue)/15 flex items-center justify-center shrink-0">
                                        <Icon icon="mdi:check" className="w-3 h-3 text-(--gt-blue)" />
                                    </div>
                                    <span className="text-sm text-(--gt-dark-text-secondary)">{feature}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* CTA button */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link
                            href={href}
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-(--gt-blue) text-white font-semibold text-base hover:bg-(--gt-blue-dark) transition-all duration-300 shadow-[0_0_32px_rgba(0,113,227,0.25)] hover:shadow-[0_0_48px_rgba(0,113,227,0.35)] hover:translate-y-[-2px]"
                        >
                            {buttonLabel}
                            <Icon
                                icon="mdi:arrow-right"
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        {/* Contact info below button */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-(--gt-dark-text-muted)">
                            <a
                                href="tel:+359895657706"
                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                <Icon icon="mdi:phone-outline" className="w-4 h-4" />
                                <span>+359 89 565 7706</span>
                            </a>
                            <a
                                href="mailto:info@gentech.bg"
                                className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                <Icon icon="mdi:email-outline" className="w-4 h-4" />
                                <span>info@gentech.bg</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
