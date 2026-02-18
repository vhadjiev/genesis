'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface TestimonialMetric {
    value: string
    label: LocalizedContent<string>
}

interface Testimonial {
    quote: LocalizedContent<string>
    author: string | LocalizedContent<string>
    role: LocalizedContent<string>
    metric?: TestimonialMetric
}

interface TestimonialsSectionData {
    type: 'testimonialsSection'
    title: LocalizedContent<string>
    testimonials?: Testimonial[]
}

interface TestimonialsSectionProps {
    data: TestimonialsSectionData
    locale: string
}

const PLACEHOLDER_TESTIMONIALS = (locale: string) => [
    {
        quote: locale === 'bg' ? 'Отлично обслужване и професионален подход.' : 'Excellent service and professional approach.',
        author: locale === 'bg' ? 'Хотел Марица' : 'Hotel Maritsa',
        role: locale === 'bg' ? 'Пловдив' : 'Plovdiv',
    },
    {
        quote: locale === 'bg' ? 'Машините работят безупречно вече 5 години.' : 'The machines have been working flawlessly for 5 years.',
        author: locale === 'bg' ? 'Бизнес Парк' : 'Business Park',
        role: locale === 'bg' ? 'София' : 'Sofia',
    },
    {
        quote: locale === 'bg' ? 'Клауд системата ни спестява много време.' : 'The cloud system saves us a lot of time.',
        author: locale === 'bg' ? 'Ресторант Верея' : 'Restaurant Vereya',
        role: locale === 'bg' ? 'Стара Загора' : 'Stara Zagora',
    },
]

export function TestimonialsSection({ data, locale }: TestimonialsSectionProps) {
    const title = getLocalizedContent(data.title, locale)

    const testimonials: Array<{
        quote: string
        author: string
        role: string
        metric?: { value: string; label: string }
    }> = data.testimonials?.length
        ? data.testimonials.map((t) => ({
              quote: getLocalizedContent(t.quote, locale),
              author: typeof t.author === 'string' ? t.author : getLocalizedContent(t.author, locale),
              role: getLocalizedContent(t.role, locale),
              metric: t.metric ? {
                  value: t.metric.value,
                  label: getLocalizedContent(t.metric.label, locale),
              } : undefined,
          }))
        : PLACEHOLDER_TESTIMONIALS(locale)

    return (
        <section className="gt-section-light py-28 lg:py-36">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-heading text-3xl md:text-4xl text-[var(--gt-light-text)] tracking-tight">{title}</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card-light p-8 lg:p-9 relative flex flex-col"
                        >
                            {/* Blue accent top bar */}
                            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[var(--gt-blue)] to-transparent opacity-40 rounded-full" />

                            {/* Quote icon */}
                            <div className="w-10 h-10 rounded-2xl bg-blue-50/80 backdrop-blur-sm flex items-center justify-center mb-6">
                                <Icon icon="mdi:format-quote-close" className="w-5 h-5 text-[var(--gt-blue)]" />
                            </div>

                            <p className="text-[var(--gt-light-text)] mb-8 leading-relaxed text-[15px] flex-1">{testimonial.quote}</p>

                            {/* Metric badge */}
                            {'metric' in testimonial && testimonial.metric && (
                                <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                    <span className="font-mono text-xl font-semibold text-[var(--gt-blue)]">{testimonial.metric.value}</span>
                                    <span className="text-[var(--gt-light-text-secondary)] text-xs">{testimonial.metric.label}</span>
                                </div>
                            )}

                            <div className="pt-5 border-t border-[var(--gt-light-border)]">
                                <p className="font-medium text-[var(--gt-light-text)] text-sm">{testimonial.author}</p>
                                <p className="text-[12px] text-[var(--gt-light-text-muted)] mt-0.5">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
