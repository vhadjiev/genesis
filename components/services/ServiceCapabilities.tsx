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
        <section className="py-20 bg-foreground/[0.02]">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                </motion.div>

                <div className="max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden">
                    {data.items.map((item, index) => {
                        const label = getLocalizedContent(item.label, locale)
                        const value = getLocalizedContent(item.value, locale)
                        return (
                            <div
                                key={index}
                                className={`flex justify-between items-center px-6 py-4 ${
                                    index !== data.items.length - 1 ? 'border-b border-foreground/10' : ''
                                }`}
                            >
                                <span className="text-foreground/60">{label}</span>
                                <span className="font-medium text-foreground">{value}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
