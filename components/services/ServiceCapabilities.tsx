'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ServiceCapabilitiesData {
    type: 'serviceCapabilities'
    title: LocalizedContent<string>
    items: { label: LocalizedContent<string>; value: LocalizedContent<string> }[]
}

interface ServiceCapabilitiesProps {
    data: ServiceCapabilitiesData
    locale: string
}

export function ServiceCapabilities({ data, locale }: ServiceCapabilitiesProps) {
    const title = getLocalizedContent(data.title, locale)

    if (!data.items || data.items.length === 0) {
        return null
    }

    return (
        <section className="py-24" style={{ backgroundColor: 'var(--gt-surface)' }}>
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="font-display text-3xl text-[var(--gt-text)] italic">{title}</h2>
                    <div className="gold-accent-line mx-auto mt-6" />
                </motion.div>

                <div className="max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden">
                    {data.items.map((item, index) => {
                        const label = getLocalizedContent(item.label, locale)
                        const value = getLocalizedContent(item.value, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`flex justify-between items-center px-7 py-4.5 ${
                                    index !== data.items.length - 1 ? 'border-b border-[var(--gt-border-subtle)]' : ''
                                }`}
                            >
                                <span className="text-[var(--gt-text-secondary)] text-sm">{label}</span>
                                <span className="font-mono font-medium text-[var(--gt-text)] text-sm">{value}</span>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
