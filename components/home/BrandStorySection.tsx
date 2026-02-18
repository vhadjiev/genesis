'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Highlight {
    icon: string
    label: LocalizedContent<string>
}

interface BrandStorySectionData {
    type: 'brandStorySection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    story: LocalizedContent<string>
    highlights: Highlight[]
}

interface BrandStorySectionProps {
    data: BrandStorySectionData
    locale: string
}

export function BrandStorySection({ data, locale }: BrandStorySectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const story = getLocalizedContent(data.story, locale)

    return (
        <section className="gt-section-dark py-28 lg:py-36 relative overflow-hidden">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle at center, var(--gt-blue) 0%, transparent 70%)',
            }} />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="w-12 h-[2px] bg-[var(--gt-blue)] mb-8" />
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] text-[var(--gt-dark-text)] tracking-tight leading-[1.1] mb-6">
                            {title}
                        </h2>
                        <p className="text-[var(--gt-dark-text-secondary)] text-lg leading-relaxed mb-6">
                            {subtitle}
                        </p>
                        <p className="text-[var(--gt-dark-text-muted)] text-[15px] leading-relaxed">
                            {story}
                        </p>
                    </motion.div>

                    {/* Highlights grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {data.highlights.map((highlight, index) => {
                            const label = getLocalizedContent(highlight.label, locale)
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    className="glass-card-dark p-6 text-center group cursor-default"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--gt-blue)]/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon icon={highlight.icon} className="w-6 h-6 text-[var(--gt-blue)]" />
                                    </div>
                                    <p className="text-[var(--gt-dark-text-secondary)] text-sm font-light leading-snug">
                                        {label}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
