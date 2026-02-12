'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Testimonial {
    quote: LocalizedContent<string>
    author: string | LocalizedContent<string>
    role: LocalizedContent<string>
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

    const testimonials = data.testimonials?.length
        ? data.testimonials.map((t) => ({
              quote: getLocalizedContent(t.quote, locale),
              author: typeof t.author === 'string' ? t.author : getLocalizedContent(t.author, locale),
              role: getLocalizedContent(t.role, locale),
          }))
        : PLACEHOLDER_TESTIMONIALS(locale)

    return (
        <section className="py-32">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-[var(--gt-text)] italic">{title}</h2>
                    <div className="gold-accent-line mx-auto mt-8" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-8 lg:p-9 relative"
                        >
                            {/* Left gold accent border */}
                            <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[var(--gt-gold)] via-[var(--gt-gold)]/40 to-transparent rounded-full" />

                            {/* Large decorative serif quote mark */}
                            <span className="font-display text-6xl text-[var(--gt-gold)]/15 absolute top-4 right-6 select-none leading-none">&ldquo;</span>

                            <p className="text-[var(--gt-text)]/85 mb-8 leading-relaxed relative pl-4 text-[15px]">{testimonial.quote}</p>

                            <div className="pl-4 border-t border-[var(--gt-border-subtle)] pt-5">
                                <p className="font-semibold text-[var(--gt-text)] text-sm">{testimonial.author}</p>
                                <p className="text-[11px] text-[var(--gt-text-muted)] uppercase tracking-[0.1em] mt-0.5">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
