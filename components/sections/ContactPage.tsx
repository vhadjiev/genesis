'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/icons'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ContactPageData {
    type: 'contactPage'
    hero: {
        title: LocalizedContent<string>
        subtitle: LocalizedContent<string>
    }
    contactInfo: {
        description: LocalizedContent<string>
        phone: string
        email: string
        address: LocalizedContent<string>
        addressUrl: string
    }
    openingHours: {
        title: LocalizedContent<string>
        rows: { label: LocalizedContent<string>; value: LocalizedContent<string> }[]
    }
    booking?: {
        title: LocalizedContent<string>
        subtitle: LocalizedContent<string>
        calendlyUrl?: string
    }
    mapEmbedUrl: string
}

interface ContactPageProps {
    data: ContactPageData
    locale: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const ease = [0.22, 1, 0.36, 1] as const

function CalendlyEmbed({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://assets.calendly.com/assets/external/widget.js'
        script.async = true
        document.head.appendChild(script)
        return () => {
            document.head.removeChild(script)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="calendly-inline-widget"
            data-url={`${url}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f5f5f7&primary_color=0071e3`}
            style={{ minWidth: '320px', height: '660px', width: '100%' }}
        />
    )
}

export function ContactPage({ data, locale }: ContactPageProps) {
    const { t } = useTranslation()
    const description = getLocalizedContent(data.contactInfo.description, locale)
    const address = getLocalizedContent(data.contactInfo.address, locale)
    const heroTitle = getLocalizedContent(data.hero.title, locale)
    const heroSubtitle = getLocalizedContent(data.hero.subtitle, locale)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<FormStatus>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const resetForm = () => {
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMessage('')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, message, formType: 'full' }),
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Failed to send')
            setStatus('success')
            resetForm()
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
        }
    }

    const inputClasses =
        'w-full px-5 py-3.5 rounded-xl bg-(--gt-light-surface) border border-(--gt-light-border) text-(--gt-light-text) placeholder:text-(--gt-light-text-muted) focus:border-(--gt-blue) focus:outline-none focus:ring-2 focus:ring-[rgba(0,113,227,0.1)] transition-all duration-200 text-sm font-light'

    return (
        <>
            {/* ═══════════════════════════════════════
               HERO — dark, minimal, ambient glow
               ═══════════════════════════════════════ */}
            <section className="gt-section-dark relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-(--gt-blue) opacity-[0.04] blur-[180px] pointer-events-none" />

                <div className="relative container mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease }}
                    >
                        <p className="text-(--gt-blue) text-sm font-normal tracking-wide mb-4">
                            {heroSubtitle}
                        </p>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] text-(--gt-dark-text) tracking-tight leading-[1.08] max-w-3xl mx-auto">
                            {heroTitle}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
               MAIN CONTENT — form + info side by side
               ═══════════════════════════════════════ */}
            <section className="relative py-20 lg:py-28 bg-[#fafafa] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-(--gt-blue) opacity-[0.015] blur-[200px]" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">

                        {/* ── Left: Contact Form ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease }}
                            className="lg:col-span-7"
                        >
                            <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_40px_rgba(0,0,0,0.04)] border border-black/4">
                                <AnimatePresence mode="wait">
                                    {status === 'success' ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex flex-col items-center justify-center text-center py-16"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                                                className="w-16 h-16 rounded-full bg-(--gt-blue) flex items-center justify-center mb-6"
                                            >
                                                <Icon icon="mdi:check" className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <h3 className="text-xl font-medium text-(--gt-light-text) mb-2">
                                                {t('contact.form.successTitle')}
                                            </h3>
                                            <p className="text-(--gt-light-text-secondary) text-sm max-w-sm mb-8">
                                                {t('contact.form.successDescription')}
                                            </p>
                                            <button
                                                onClick={() => setStatus('idle')}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-(--gt-light-border) text-(--gt-light-text) text-sm font-normal hover:border-(--gt-blue) transition-colors cursor-pointer"
                                            >
                                                <Icon icon="mdi:plus" className="w-4 h-4" />
                                                {t('contact.form.sendAnother')}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="mb-8">
                                                <h2 className="font-heading text-2xl text-(--gt-light-text) mb-2">
                                                    {t('contact.form.title')}
                                                </h2>
                                                <p className="text-(--gt-light-text-secondary) text-sm">
                                                    {description}
                                                </p>
                                            </div>

                                            <AnimatePresence mode="wait">
                                                {status === 'error' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8, height: 0 }}
                                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                                        className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 mb-5"
                                                    >
                                                        <Icon icon="mdi:alert-circle" className="w-5 h-5 shrink-0" />
                                                        <span className="text-sm">{errorMessage || t('contact.form.errorMessage')}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="space-y-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-normal text-(--gt-light-text-secondary) mb-2 tracking-wide uppercase">
                                                            {t('contact.form.name')} <span className="text-red-400">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            disabled={status === 'submitting'}
                                                            className={inputClasses}
                                                            placeholder={t('contact.form.name')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-normal text-(--gt-light-text-secondary) mb-2 tracking-wide uppercase">
                                                            {t('contact.form.mobile')} <span className="text-red-400">*</span>
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            disabled={status === 'submitting'}
                                                            className={inputClasses}
                                                            placeholder="+359 ..."
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-normal text-(--gt-light-text-secondary) mb-2 tracking-wide uppercase">
                                                        {t('contact.form.email')} <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        disabled={status === 'submitting'}
                                                        className={inputClasses}
                                                        placeholder="email@example.com"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-normal text-(--gt-light-text-secondary) mb-2 tracking-wide uppercase">
                                                        {t('contact.form.message')}
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        disabled={status === 'submitting'}
                                                        className={`${inputClasses} resize-none`}
                                                        placeholder={t('contact.form.message')}
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={status === 'submitting'}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-(--gt-blue) text-white font-normal text-[15px] hover:bg-(--gt-blue-light) transition-all duration-300 disabled:opacity-60 cursor-pointer shadow-[0_4px_20px_rgba(0,113,227,0.25)]"
                                                >
                                                    {status === 'submitting' ? (
                                                        <>
                                                            <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                                                            {t('contact.form.sending')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {t('contact.form.submit')}
                                                            <Icon icon="mdi:send" className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* ── Right: Contact Info ── */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Phone + Email row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                                <motion.a
                                    href={`tel:${data.contactInfo.phone.replace(/\s/g, '')}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1, ease }}
                                    className="group gt-contact-card"
                                >
                                    <div className="w-11 h-11 rounded-2xl bg-[rgba(0,113,227,0.08)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(0,113,227,0.15)] transition-colors">
                                        <Icon icon="mdi:phone-outline" className="w-5 h-5 text-(--gt-blue)" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--gt-light-text-muted) mb-1 tracking-wide uppercase">
                                            {locale === 'bg' ? 'Телефон' : 'Phone'}
                                        </p>
                                        <p className="text-(--gt-light-text) text-[15px] font-normal group-hover:text-(--gt-blue) transition-colors">
                                            {data.contactInfo.phone}
                                        </p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href={`mailto:${data.contactInfo.email}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15, ease }}
                                    className="group gt-contact-card"
                                >
                                    <div className="w-11 h-11 rounded-2xl bg-[rgba(0,113,227,0.08)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(0,113,227,0.15)] transition-colors">
                                        <Icon icon="mdi:email-outline" className="w-5 h-5 text-(--gt-blue)" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-(--gt-light-text-muted) mb-1 tracking-wide uppercase">
                                            {locale === 'bg' ? 'Имейл' : 'Email'}
                                        </p>
                                        <p className="text-(--gt-light-text) text-[15px] font-normal group-hover:text-(--gt-blue) transition-colors">
                                            {data.contactInfo.email}
                                        </p>
                                    </div>
                                </motion.a>
                            </div>

                            {/* Address */}
                            <motion.a
                                href={data.contactInfo.addressUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2, ease }}
                                className="group gt-contact-card"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-[rgba(0,113,227,0.08)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(0,113,227,0.15)] transition-colors">
                                    <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-(--gt-blue)" />
                                </div>
                                <div>
                                    <p className="text-xs text-(--gt-light-text-muted) mb-1 tracking-wide uppercase">
                                        {locale === 'bg' ? 'Адрес' : 'Address'}
                                    </p>
                                    <p className="text-(--gt-light-text) text-[15px] font-normal group-hover:text-(--gt-blue) transition-colors">
                                        {address}
                                    </p>
                                </div>
                            </motion.a>

                            {/* Opening Hours */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.25, ease }}
                                className="gt-contact-card cursor-default! flex-col! items-stretch!"
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 rounded-2xl bg-[rgba(0,113,227,0.08)] flex items-center justify-center shrink-0">
                                        <Icon icon="mdi:clock-outline" className="w-5 h-5 text-(--gt-blue)" />
                                    </div>
                                    <h3 className="text-[15px] font-medium text-(--gt-light-text)">
                                        {getLocalizedContent(data.openingHours.title, locale)}
                                    </h3>
                                </div>
                                <div className="space-y-3 pl-14">
                                    {data.openingHours.rows.map((row, i) => (
                                        <div key={i} className="flex justify-between items-center gap-4">
                                            <span className="text-sm text-(--gt-light-text-secondary) font-light">
                                                {getLocalizedContent(row.label, locale)}
                                            </span>
                                            <span className="text-sm text-(--gt-light-text) font-normal">
                                                {getLocalizedContent(row.value, locale)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Quick CTA for booking */}
                            {data.booking && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3, ease }}
                                    className="relative rounded-[20px] bg-linear-to-br from-(--gt-blue) to-[#005bb5] p-7 overflow-hidden"
                                >
                                    <div className="absolute top-3 right-3 w-24 h-24 rounded-full bg-white/6 blur-2xl pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                                            <Icon icon="mdi:calendar" className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-white font-medium text-[15px] mb-1.5">
                                            {getLocalizedContent(data.booking.title, locale)}
                                        </h3>
                                        <p className="text-white/60 text-sm font-light mb-5">
                                            {getLocalizedContent(data.booking.subtitle, locale)}
                                        </p>
                                        {data.booking.calendlyUrl ? (
                                            <a
                                                href="#booking"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-(--gt-blue) text-sm font-normal hover:bg-white/90 transition-colors"
                                            >
                                                {locale === 'bg' ? 'Запазете час' : 'Book Now'}
                                                <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <a
                                                href={`tel:${data.contactInfo.phone.replace(/\s/g, '')}`}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-(--gt-blue) text-sm font-normal hover:bg-white/90 transition-colors"
                                            >
                                                {locale === 'bg' ? 'Обадете се' : 'Call Us'}
                                                <Icon icon="mdi:phone-outline" className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
               BOOK A CONSULTATION — Calendly embed
               ═══════════════════════════════════════ */}
            {data.booking?.calendlyUrl && (
                <section id="booking" className="gt-section-dark py-20 lg:py-28 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-(--gt-blue) opacity-[0.04] blur-[200px] pointer-events-none" />

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease }}
                            className="text-center mb-12"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[rgba(0,113,227,0.1)] flex items-center justify-center mx-auto mb-5">
                                <Icon icon="mdi:calendar" className="w-6 h-6 text-(--gt-blue)" />
                            </div>
                            <h2 className="font-heading text-3xl md:text-4xl text-(--gt-dark-text) tracking-tight mb-4">
                                {getLocalizedContent(data.booking.title, locale)}
                            </h2>
                            <p className="text-(--gt-dark-text-secondary) text-base max-w-lg mx-auto">
                                {getLocalizedContent(data.booking.subtitle, locale)}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15, ease }}
                            className="max-w-3xl mx-auto rounded-[24px] overflow-hidden border border-white/6 bg-white/2"
                        >
                            <CalendlyEmbed url={data.booking.calendlyUrl} />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════
               MAP — full width, dark themed
               ═══════════════════════════════════════ */}
            <section className="relative h-[400px] lg:h-[480px]">
                <iframe
                    src={data.mapEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0 gt-map-dark"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Genesis Technology Location"
                />
                <div className={`absolute top-0 left-0 right-0 h-16 bg-linear-to-b ${data.booking?.calendlyUrl ? 'from-(--gt-dark-bg)' : 'from-[#fafafa]'} to-transparent pointer-events-none z-10`} />
            </section>
        </>
    )
}
