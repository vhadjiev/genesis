'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface ProjectTypeOption {
    id: string
    label: LocalizedContent<string>
}

interface ServiceTypeOption {
    id: string
    label: LocalizedContent<string>
}

interface ContactFormData {
    type: 'contactForm'
    variant: 'equipment' | 'full'
    title: LocalizedContent<string>
    projectTypes?: ProjectTypeOption[]
    serviceTypes?: ServiceTypeOption[]
}

interface ContactFormProps {
    data: ContactFormData
    locale: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const equipmentCategories = ['cameras', 'lenses', 'fieldRecorders', 'microphones', 'storage', 'sticks']

export function ContactForm({ data, locale }: ContactFormProps) {
    const { t } = useTranslation()
    const variant = data.variant

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [status, setStatus] = useState<FormStatus>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleCheckboxChange = (
        value: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value))
        } else {
            setSelected([...selected, value])
        }
    }

    const resetForm = () => {
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setSelectedCategories([])
        setSelectedProjects([])
        setSelectedServices([])
    }

    const handleSendAnother = () => {
        setStatus('idle')
        setErrorMessage('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMessage('')

        try {
            const formData = {
                name,
                email,
                phone,
                message,
                formType: variant,
                ...(variant === 'equipment'
                    ? {
                          equipmentCategories: selectedCategories.map((cat) =>
                              t(`equipmentRental.categories.${cat}`)
                          ),
                      }
                    : {
                          projectTypes: selectedProjects.map((type) => {
                              const option = data.projectTypes?.find((p) => p.id === type)
                              return option ? getLocalizedContent(option.label, locale) : type
                          }),
                          services: selectedServices.map((type) => {
                              const option = data.serviceTypes?.find((s) => s.id === type)
                              return option ? getLocalizedContent(option.label, locale) : type
                          }),
                      }),
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message')
            }

            setStatus('success')
            resetForm()
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
        }
    }

    /** Premium gold-themed input classes */
    const inputClasses =
        'w-full px-5 py-3.5 rounded-xl bg-[var(--gt-surface-elevated)] border border-[var(--gt-border-subtle)] text-[var(--gt-text)] placeholder-[var(--gt-text-muted)] focus:border-[var(--gt-gold)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gt-gold)]/10 transition-all duration-200 text-sm'

    /** Success View */
    const SuccessView = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center py-12 px-6"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gt-gold)] to-[var(--gt-gold-dim)] flex items-center justify-center mb-6 shadow-lg shadow-[var(--gt-gold)]/20"
            >
                <Icon icon="mdi:check" className="w-10 h-10 text-[var(--gt-bg)]" />
            </motion.div>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl text-[var(--gt-text)] mb-3 italic"
            >
                {t(variant === 'equipment' ? 'equipmentRental.form.successTitle' : 'contact.form.successTitle')}
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--gt-text-secondary)] max-w-md mb-8 leading-relaxed"
            >
                {t(variant === 'equipment' ? 'equipmentRental.form.successDescription' : 'contact.form.successDescription')}
            </motion.p>
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleSendAnother}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--gt-border)] text-[var(--gt-text)] font-medium hover:border-[var(--gt-gold)]/30 transition-colors"
            >
                <Icon icon="mdi:plus" className="w-5 h-5" />
                {t(variant === 'equipment' ? 'equipmentRental.form.sendAnother' : 'contact.form.sendAnother')}
            </motion.button>
        </motion.div>
    )

    /** Error message */
    const ErrorBanner = () => (
        <AnimatePresence mode="wait">
            {status === 'error' && (
                <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--gt-danger)]/10 border border-[var(--gt-danger)]/20 text-[var(--gt-danger)]"
                >
                    <Icon icon="mdi:alert-circle" className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">
                        {errorMessage || t('contact.form.errorMessage')}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )

    /** Chip button for categories/types */
    const ChipButton = ({
        isSelected,
        onClick,
        disabled,
        children,
    }: {
        isSelected: boolean
        onClick: () => void
        disabled: boolean
        children: React.ReactNode
    }) => (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                    ? 'bg-[var(--gt-gold)] text-[var(--gt-bg)] border-[var(--gt-gold)] shadow-md shadow-[var(--gt-gold)]/15'
                    : 'bg-[var(--gt-surface-elevated)] text-[var(--gt-text-secondary)] border-[var(--gt-border-subtle)] hover:border-[var(--gt-gold)]/30'
            }`}
        >
            <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[var(--gt-bg)] bg-[var(--gt-bg)]' : 'border-[var(--gt-text-muted)] bg-transparent'
                }`}
            >
                {isSelected && <Icon icon="mdi:check" className="w-3 h-3 text-[var(--gt-gold)]" />}
            </span>
            {children}
        </motion.button>
    )

    /** Submit button */
    const SubmitButton = () => (
        <motion.button
            type="submit"
            disabled={status === 'submitting'}
            whileHover={{ scale: status === 'submitting' ? 1 : 1.01 }}
            whileTap={{ scale: status === 'submitting' ? 1 : 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--gt-gold)] text-[var(--gt-bg)] font-semibold text-sm uppercase tracking-wide hover:bg-[var(--gt-gold-light)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--gt-gold)]/15"
        >
            {status === 'submitting' ? (
                <>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                    {t('contact.form.sending')}
                </>
            ) : (
                <>
                    {t(variant === 'equipment' ? 'equipmentRental.form.submit' : 'contact.form.submit')}
                    <Icon icon="mdi:send" className="w-5 h-5" />
                </>
            )}
        </motion.button>
    )

    // Equipment variant
    if (variant === 'equipment') {
        return (
            <section className="py-16" style={{ backgroundColor: 'var(--gt-surface)' }}>
                <div className="container mx-auto px-4 md:px-6 max-w-xl">
                    <div className="border-t border-[var(--gt-border-subtle)] mb-12" />
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <SuccessView key="success" />
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="font-display text-2xl text-[var(--gt-text)] mb-3 italic">
                                        {getLocalizedContent(data.title, locale)}
                                    </h3>
                                    <div className="gold-accent-line mx-auto" />
                                </div>
                                <ErrorBanner />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                            {t('equipmentRental.form.name')} <span className="text-[var(--gt-danger)]">*</span>
                                        </label>
                                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder={t('equipmentRental.form.name')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                            {t('equipmentRental.form.mobile')} <span className="text-[var(--gt-danger)]">*</span>
                                        </label>
                                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="+359 ..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                        {t('equipmentRental.form.email')} <span className="text-[var(--gt-danger)]">*</span>
                                    </label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="email@example.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">{t('equipmentRental.form.categories')}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {equipmentCategories.map((category) => (
                                            <ChipButton key={category} isSelected={selectedCategories.includes(category)} onClick={() => handleCheckboxChange(category, selectedCategories, setSelectedCategories)} disabled={status === 'submitting'}>
                                                {t(`equipmentRental.categories.${category}`)}
                                            </ChipButton>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">{t('equipmentRental.form.message')}</label>
                                    <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === 'submitting'} className={`${inputClasses} resize-none`} placeholder={t('equipmentRental.form.message')} />
                                </div>
                                <SubmitButton />
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        )
    }

    // Full Contact Form
    return (
        <section className="py-16" style={{ backgroundColor: 'var(--gt-bg)' }}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card rounded-2xl p-7 md:p-9 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <SuccessView key="success" />
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="mb-6">
                                        <h3 className="font-display text-xl text-[var(--gt-text)] mb-3 italic">
                                            {getLocalizedContent(data.title, locale)}
                                        </h3>
                                        <div className="gold-accent-line" />
                                    </div>
                                    <ErrorBanner />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                                {t('contact.form.name')} <span className="text-[var(--gt-danger)]">*</span>
                                            </label>
                                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder={t('contact.form.name')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                                {t('contact.form.mobile')} <span className="text-[var(--gt-danger)]">*</span>
                                            </label>
                                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="+359 ..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">
                                            {t('contact.form.email')} <span className="text-[var(--gt-danger)]">*</span>
                                        </label>
                                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="email@example.com" />
                                    </div>
                                    {data.projectTypes && data.projectTypes.length > 0 && (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">{t('contact.form.projectType')}</label>
                                            <div className="flex flex-wrap gap-2">
                                                {data.projectTypes.map((type) => (
                                                    <ChipButton key={type.id} isSelected={selectedProjects.includes(type.id)} onClick={() => handleCheckboxChange(type.id, selectedProjects, setSelectedProjects)} disabled={status === 'submitting'}>
                                                        {getLocalizedContent(type.label, locale)}
                                                    </ChipButton>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {data.serviceTypes && data.serviceTypes.length > 0 && (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">{t('contact.form.services')}</label>
                                            <div className="flex flex-wrap gap-2">
                                                {data.serviceTypes.map((type) => (
                                                    <ChipButton key={type.id} isSelected={selectedServices.includes(type.id)} onClick={() => handleCheckboxChange(type.id, selectedServices, setSelectedServices)} disabled={status === 'submitting'}>
                                                        {getLocalizedContent(type.label, locale)}
                                                    </ChipButton>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-text-secondary)]">{t('contact.form.description')}</label>
                                        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === 'submitting'} className={`${inputClasses} resize-none`} placeholder={t('contact.form.description')} />
                                    </div>
                                    <SubmitButton />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
