'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Product {
    id: string
    name: string
    tagline: LocalizedContent<string>
    description?: LocalizedContent<string>
    image: string
    href: string
}

interface FeaturedProductsData {
    type: 'featuredProducts'
    title: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
    products: Product[]
}

interface FeaturedProductsProps {
    data: FeaturedProductsData
    locale: string
}

export function FeaturedProducts({ data, locale }: FeaturedProductsProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null

    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
                    {subtitle && <p className="text-foreground/60 text-lg mt-4 max-w-2xl mx-auto">{subtitle}</p>}
                    <div className="w-20 h-1 bg-[var(--gt-blue)] mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.products.map((product, index) => {
                        const tagline = getLocalizedContent(product.tagline, locale)
                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={product.href} className="group block">
                                    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                        <div className="relative aspect-[4/3] bg-foreground/5">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                                            <p className="text-foreground/60 line-clamp-2">{product.description ? getLocalizedContent(product.description, locale) : tagline}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
