'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Testimonial {
    quote: LocalizedContent<string>
    author: string
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
              author: t.author,
              role: getLocalizedContent(t.role, locale),
          }))
        : PLACEHOLDER_TESTIMONIALS(locale)

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
                    <div className="w-20 h-1 bg-[var(--gt-blue)] mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-8"
                        >
                            <Icon icon="mdi:format-quote-open" className="w-8 h-8 text-[var(--gt-accent)] mb-4 opacity-50" />
                            <p className="text-foreground/80 mb-6 leading-relaxed">{testimonial.quote}</p>
                            <div>
                                <p className="font-semibold text-foreground">{testimonial.author}</p>
                                <p className="text-sm text-foreground/50">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
