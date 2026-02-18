'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import Link from 'next/link'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ServiceItem {
    icon: string
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface ServiceSectionData {
    type: 'serviceSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    services: ServiceItem[]
    ctaText?: LocalizedContent<string>
    ctaHref?: string
}

interface ServiceSectionProps {
    data: ServiceSectionData
    locale: string
}

export function ServiceSection({ data, locale }: ServiceSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const ctaText = data.ctaText ? getLocalizedContent(data.ctaText, locale) : undefined

    return (
        <section className="gt-section-dark py-28 lg:py-36 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-[0.04] bg-[var(--gt-blue)]" />

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] text-[var(--gt-dark-text)] tracking-tight mb-5">
                        {title}
                    </h2>
                    <p className="text-[var(--gt-dark-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {data.services.map((service, index) => {
                        const serviceTitle = getLocalizedContent(service.title, locale)
                        const serviceDesc = getLocalizedContent(service.description, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-card-dark p-7 group cursor-default"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[var(--gt-blue)]/10 flex items-center justify-center mb-5">
                                    <Icon icon={service.icon} className="w-6 h-6 text-[var(--gt-blue)]" />
                                </div>
                                <h3 className="text-[15px] font-medium text-[var(--gt-dark-text)] mb-3">{serviceTitle}</h3>
                                <p className="text-[var(--gt-dark-text-muted)] text-sm leading-relaxed">{serviceDesc}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {ctaText && data.ctaHref && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href={data.ctaHref}
                            className="inline-flex items-center gap-2 text-[var(--gt-blue)] hover:text-[var(--gt-blue-light)] text-sm font-normal transition-colors"
                        >
                            {ctaText}
                            <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
