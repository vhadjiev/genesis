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
        <section className="py-8 border-y border-foreground/[0.06] bg-foreground/[0.02]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                    {data.items.map((item, index) => {
                        const label = getLocalizedContent(item.label, locale)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="flex items-center gap-2.5"
                            >
                                <Icon icon={item.icon} className="w-5 h-5 text-[var(--gt-accent)] shrink-0" />
                                <span className="text-sm font-medium text-foreground/70 whitespace-nowrap tracking-wide uppercase">
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
