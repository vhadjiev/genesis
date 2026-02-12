'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ServiceHeroData {
    type: 'serviceHero'
    name: LocalizedContent<string>
    tagline: LocalizedContent<string>
    description: LocalizedContent<string>
    image: string
}

interface ServiceHeroProps {
    data: ServiceHeroData
    locale: string
}

export function ServiceHero({ data, locale }: ServiceHeroProps) {
    const name = getLocalizedContent(data.name, locale)
    const tagline = getLocalizedContent(data.tagline, locale)
    const description = getLocalizedContent(data.description, locale)

    return (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-darker)] via-[var(--gt-dark)] to-[var(--gt-navy)]" />

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-[var(--gt-accent)] font-medium mb-2">{tagline}</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{name}</h1>
                        <p className="text-foreground/70 text-lg leading-relaxed max-w-lg">{description}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative aspect-video rounded-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gt-blue)]/10 to-[var(--gt-accent)]/10" />
                        <Image
                            src={data.image}
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
