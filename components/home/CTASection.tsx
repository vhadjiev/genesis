'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

    return (
        <section ref={sectionRef} className="gt-section-dark py-28 lg:py-36 relative overflow-hidden">
            {/* Blue glow bg */}
            <motion.div
                style={{ scale: glowScale }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px]"
            >
                <div className="w-full h-full bg-[var(--gt-blue)] opacity-[0.06]" />
            </motion.div>

            <div className="relative container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="font-heading text-3xl md:text-5xl text-[var(--gt-dark-text)] mb-7 tracking-tight">{title}</h2>
                    <p className="text-[var(--gt-dark-text-secondary)] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">{subtitle}</p>
                    <Link
                        href={data.buttonHref}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-normal text-[15px] rounded-full transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(0,113,227,0.4)]"
                    >
                        {buttonText}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
