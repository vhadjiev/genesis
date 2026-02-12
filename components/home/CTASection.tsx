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
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-blue)]/5 via-transparent to-[var(--gt-accent)]/5" />

            <div className="relative container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{title}</h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-10">{subtitle}</p>
                    <Link
                        href={data.buttonHref}
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[var(--gt-blue)]/20"
                    >
                        {buttonText}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
