'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface CTASectionData {
    type: 'ctaSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    buttonText: LocalizedContent<string>
    buttonHref: string
}

interface CTASectionProps {
    data: CTASectionData
    locale: string
}

export function CTASection({ data, locale }: CTASectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const buttonText = getLocalizedContent(data.buttonText, locale)

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Radial glow behind button area */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--gt-gold)]/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="gold-accent-line mx-auto mb-10" />
                    <h2 className="font-display text-3xl md:text-5xl text-[var(--gt-text)] mb-7 italic">{title}</h2>
                    <p className="text-[var(--gt-text-secondary)] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">{subtitle}</p>
                    <Link
                        href={data.buttonHref}
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--gt-gold)] hover:bg-[var(--gt-gold-light)] text-[var(--gt-bg)] font-semibold text-sm tracking-wide uppercase rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[var(--gt-gold)]/20"
                    >
                        {buttonText}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
