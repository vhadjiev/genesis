'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Partner {
    name: string
    logo?: string
}

interface PartnersSectionData {
    type: 'partnersSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    partners?: Partner[]
}

interface PartnersSectionProps {
    data: PartnersSectionData
    locale: string
}

export function PartnersSection({ data, locale }: PartnersSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)

    const partners = data.partners || []

    return (
        <section className="gt-section-light-gray py-24 lg:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-3xl md:text-4xl text-[var(--gt-light-text)] tracking-tight mb-5">{title}</h2>
                    <p className="text-[var(--gt-light-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-items-center">
                    {partners.map((partner, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="w-full max-w-[160px] aspect-[2.5/1] rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 flex items-center justify-center hover:bg-white/80 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 cursor-default shadow-sm px-4"
                        >
                            {partner.logo ? (
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={120}
                                    height={40}
                                    className="max-h-8 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity"
                                />
                            ) : (
                                <span className="text-[var(--gt-light-text-muted)] text-[11px] font-light uppercase tracking-wider text-center leading-tight">
                                    {partner.name}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
