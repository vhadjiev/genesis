'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
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
        <section className="py-6 border-y border-[var(--gt-border-subtle)]" style={{ backgroundColor: 'var(--gt-surface)' }}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
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
                                <Icon icon={item.icon} className="w-4 h-4 text-[var(--gt-gold)] shrink-0" />
                                <span className="text-[11px] font-medium text-[var(--gt-text-secondary)] whitespace-nowrap tracking-[0.1em] uppercase">
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
