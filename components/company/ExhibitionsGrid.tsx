'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Exhibition {
    id: string
    name: string
    location: LocalizedContent<string>
    date: string
    image?: string
}

interface ExhibitionsGridData {
    type: 'exhibitionsGrid'
    title: LocalizedContent<string>
    exhibitions: Exhibition[]
}

interface ExhibitionsGridProps {
    data: ExhibitionsGridData
    locale: string
}

export function ExhibitionsGrid({ data, locale }: ExhibitionsGridProps) {
    const title = getLocalizedContent(data.title, locale)

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
                    <div className="w-16 h-1 bg-[var(--gt-blue)] mx-auto mt-4" />
                </motion.div>

                {data.exhibitions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-foreground/40 text-lg">
                            {locale === 'bg' ? 'Няма налични изложения' : 'No exhibitions available'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.exhibitions.map((exhibition, index) => {
                            const location = getLocalizedContent(exhibition.location, locale)
                            return (
                                <motion.div
                                    key={exhibition.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="glass-card rounded-2xl p-8"
                                >
                                    <h3 className="text-xl font-bold text-foreground mb-2">{exhibition.name}</h3>
                                    <div className="flex items-center gap-2 text-foreground/60 mb-1">
                                        <Icon icon="mdi:map-marker" className="w-4 h-4" />
                                        <span>{location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/60">
                                        <Icon icon="mdi:calendar" className="w-4 h-4" />
                                        <span>{exhibition.date}</span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
