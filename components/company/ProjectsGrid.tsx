'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ProjectCategory {
    id: string
    title: LocalizedContent<string>
    image: string
}

interface ProjectsGridData {
    type: 'projectsGrid'
    title: LocalizedContent<string>
    categories: ProjectCategory[]
}

interface ProjectsGridProps {
    data: ProjectsGridData
    locale: string
}

export function ProjectsGrid({ data, locale }: ProjectsGridProps) {
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.categories.map((category, index) => {
                        const categoryTitle = getLocalizedContent(category.title, locale)
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-card cursor-pointer"
                            >
                                <Image
                                    src={category.image}
                                    alt={categoryTitle}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold text-white">{categoryTitle}</h3>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
