'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface NewsletterSectionData {
    type: 'newsletterSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    placeholder?: LocalizedContent<string>
    buttonText?: LocalizedContent<string>
    successMessage?: LocalizedContent<string>
}

interface NewsletterSectionProps {
    data: NewsletterSectionData
    locale: string
}

export function NewsletterSection({ data, locale }: NewsletterSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const placeholder = data.placeholder
        ? getLocalizedContent(data.placeholder, locale)
        : locale === 'bg' ? 'Вашият имейл' : 'Your email address'
    const buttonText = data.buttonText
        ? getLocalizedContent(data.buttonText, locale)
        : locale === 'bg' ? 'Абонирай се' : 'Subscribe'
    const successMessage = data.successMessage
        ? getLocalizedContent(data.successMessage, locale)
        : locale === 'bg' ? 'Благодарим! Ще получите нашите актуализации.' : 'Thank you! You\'ll receive our updates.'

    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStatus('success')
                setEmail('')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <section className="gt-section-light-gray py-20 lg:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-xl mx-auto text-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center mx-auto mb-6">
                        <Icon icon="mdi:email-newsletter" className="w-6 h-6 text-[var(--gt-blue)]" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl text-[var(--gt-light-text)] tracking-tight mb-3">
                        {title}
                    </h2>
                    <p className="text-[var(--gt-light-text-secondary)] text-[15px] mb-8 leading-relaxed">
                        {subtitle}
                    </p>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-2 text-green-600 font-normal text-sm"
                        >
                            <Icon icon="mdi:check-circle" className="w-5 h-5" />
                            {successMessage}
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={placeholder}
                                required
                                className="flex-1 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 text-[var(--gt-light-text)] text-sm placeholder:text-[var(--gt-light-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--gt-blue)]/30 focus:border-[var(--gt-blue)]/40 transition-all shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-6 py-3 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-normal text-sm rounded-full transition-all duration-300 shadow-[0_2px_12px_rgba(0,113,227,0.3)] disabled:opacity-60 cursor-pointer"
                            >
                                {status === 'loading' ? (
                                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                                ) : buttonText}
                            </button>
                        </form>
                    )}

                    {status === 'error' && (
                        <p className="text-red-500 text-xs mt-3">
                            {locale === 'bg' ? 'Нещо се обърка. Моля, опитайте отново.' : 'Something went wrong. Please try again.'}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
