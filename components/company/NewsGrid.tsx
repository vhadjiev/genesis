'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface NewsArticle {
    id: string
    title: LocalizedContent<string>
    excerpt: LocalizedContent<string>
    date: string
    image?: string
}

interface NewsGridData {
    type: 'newsGrid'
    title: LocalizedContent<string>
    articles: NewsArticle[]
}

interface NewsGridProps {
    data: NewsGridData
    locale: string
}

export function NewsGrid({ data, locale }: NewsGridProps) {
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
                    <h2 className="font-heading text-3xl md:text-4xl text-foreground">{title}</h2>
                    <div className="w-16 h-1 bg-[var(--gt-blue)] mx-auto mt-4" />
                </motion.div>

                {data.articles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-foreground/40 text-lg">
                            {locale === 'bg' ? 'Няма налични новини' : 'No news available'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.articles.map((article, index) => {
                            const articleTitle = getLocalizedContent(article.title, locale)
                            const excerpt = getLocalizedContent(article.excerpt, locale)
                            return (
                                <motion.article
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="glass-card rounded-2xl overflow-hidden"
                                >
                                    <div className="p-6">
                                        <time className="text-sm text-[var(--gt-accent)]">{article.date}</time>
                                        <h3 className="text-lg font-medium text-foreground mt-2 mb-3">{articleTitle}</h3>
                                        <p className="text-foreground/60 text-sm">{excerpt}</p>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
