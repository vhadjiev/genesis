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
        <section className="py-20 bg-foreground/[0.02]">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
                    <p className="text-foreground/60 text-lg">{subtitle}</p>
                </motion.div>

                {/* Partner logos placeholder */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="w-32 h-16 rounded-lg bg-foreground/5 flex items-center justify-center"
                        >
                            <span className="text-foreground/20 text-sm">Logo</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
