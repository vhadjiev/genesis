'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface PartnersSectionData {
    type: 'partnersSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
}

interface PartnersSectionProps {
    data: PartnersSectionData
    locale: string
}

export function PartnersSection({ data, locale }: PartnersSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)

    return (
        <section className="py-24" style={{ backgroundColor: 'var(--gt-surface)' }}>
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-[var(--gt-text)] italic mb-5">{title}</h2>
                    <p className="text-[var(--gt-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
                </motion.div>

                {/* Partner logos placeholder grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="w-full max-w-[140px] aspect-[2.5/1] rounded-xl border border-[var(--gt-border-subtle)] flex items-center justify-center hover:border-[var(--gt-border)] transition-all duration-300 cursor-default"
                            style={{ backgroundColor: 'var(--gt-surface-elevated)' }}
                        >
                            <span className="text-[var(--gt-text-muted)] text-[10px] uppercase tracking-[0.2em]">Partner</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
