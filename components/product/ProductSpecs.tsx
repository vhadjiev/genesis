'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface SpecItem {
    label: LocalizedContent<string>
    value: LocalizedContent<string>
}

interface ProductSpecsData {
    type: 'productSpecs'
    title: LocalizedContent<string>
    specs: SpecItem[]
}

interface ProductSpecsProps {
    data: ProductSpecsData
    locale: string
}

export function ProductSpecs({ data, locale }: ProductSpecsProps) {
    const title = getLocalizedContent(data.title, locale)

    if (!data.specs || data.specs.length === 0) {
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
                    <div className="w-16 h-1 bg-[var(--gt-blue)] mx-auto mt-4" />
                </motion.div>

                <div className="max-w-2xl mx-auto glass-card rounded-2xl overflow-hidden">
                    {data.specs.map((spec, index) => {
                        const label = getLocalizedContent(spec.label, locale)
                        const value = getLocalizedContent(spec.value, locale)
                        return (
                            <div
                                key={index}
                                className={`flex justify-between items-center px-6 py-4 ${
                                    index !== data.specs.length - 1 ? 'border-b border-foreground/10' : ''
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
