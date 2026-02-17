'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface FAQItem {
    question: LocalizedContent<string>
    answer: LocalizedContent<string>
}

interface ProductFAQData {
    type: 'productFAQ'
    title?: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
    items: FAQItem[]
}

interface ProductFAQProps {
    data: ProductFAQData
    locale: string
}

function AccordionItem({
    question,
    answer,
    isOpen,
    onToggle,
    index,
}: {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
    index: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="border-b border-(--gt-light-border)"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 py-6 text-left group cursor-pointer"
                aria-expanded={isOpen}
            >
                <span className="text-base md:text-lg font-medium text-(--gt-light-text) group-hover:text-(--gt-blue) transition-colors duration-200 pr-4">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 w-8 h-8 rounded-full bg-(--gt-light-surface) flex items-center justify-center group-hover:bg-(--gt-blue)/10 transition-colors duration-200"
                >
                    <Icon
                        icon="mdi:plus"
                        className={`w-4.5 h-4.5 transition-colors duration-200 ${
                            isOpen ? 'text-(--gt-blue)' : 'text-(--gt-light-text-secondary)'
                        }`}
                    />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-(--gt-light-text-secondary) text-base leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function ProductFAQ({ data, locale }: ProductFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const title = data.title ? getLocalizedContent(data.title, locale) : null
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null

    if (!data.items || data.items.length === 0) return null

    return (
        <section className="gt-section-light py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold text-(--gt-light-text) tracking-tight mb-3">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-(--gt-light-text-secondary) text-lg max-w-xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>

                    {/* FAQ items */}
                    <div className="border-t border-(--gt-light-border)">
                        {data.items.map((item, index) => {
                            const question = getLocalizedContent(item.question, locale)
                            const answer = getLocalizedContent(item.answer, locale)

                            return (
                                <AccordionItem
                                    key={index}
                                    question={question}
                                    answer={answer}
                                    isOpen={openIndex === index}
                                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                    index={index}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
