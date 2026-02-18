'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface TrustItem {
    icon: string
    label: LocalizedContent<string>
}

interface TrustBarSectionData {
    type: 'trustBarSection'
    items: TrustItem[]
}

interface TrustBarSectionProps {
    data: TrustBarSectionData
    locale: string
}

export function TrustBarSection({ data, locale }: TrustBarSectionProps) {
    return (
        <section className="gt-section-light py-8 border-b border-[var(--gt-light-border)] relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 backdrop-blur-sm">
                    {data.items.map((item, index) => {
                        const label = getLocalizedContent(item.label, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="flex items-center gap-2.5"
                            >
                                <Icon icon={item.icon} className="w-4 h-4 text-[var(--gt-blue)] shrink-0" />
                                <span className="text-[12px] font-light text-[var(--gt-light-text-secondary)] whitespace-nowrap tracking-wide">
                                    {label}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
