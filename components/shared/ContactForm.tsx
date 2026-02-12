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

    /** Modern input classes */
    const inputClasses =
        'w-full px-5 py-3.5 rounded-xl bg-[var(--gt-light-surface)] border border-[var(--gt-light-border)] text-[var(--gt-light-text)] placeholder-[var(--gt-light-text-muted)] focus:border-[var(--gt-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--gt-blue)]/10 transition-all duration-200 text-sm'

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
                className="w-20 h-20 rounded-full bg-[var(--gt-blue)] flex items-center justify-center mb-6"
            >
                <Icon icon="mdi:check" className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-semibold text-[var(--gt-light-text)] mb-3"
            >
                {t(variant === 'equipment' ? 'equipmentRental.form.successTitle' : 'contact.form.successTitle')}
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--gt-light-text-secondary)] max-w-md mb-8 leading-relaxed"
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--gt-light-border)] text-[var(--gt-light-text)] font-medium hover:border-[var(--gt-blue)] transition-colors"
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
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600"
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
                    ? 'bg-[var(--gt-blue)] text-white border-[var(--gt-blue)]'
                    : 'bg-[var(--gt-light-surface)] text-[var(--gt-light-text-secondary)] border-[var(--gt-light-border)] hover:border-[var(--gt-blue)]'
            }`}
        >
            <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-white bg-white' : 'border-[var(--gt-light-text-muted)] bg-transparent'
                }`}
            >
                {isSelected && <Icon icon="mdi:check" className="w-3 h-3 text-[var(--gt-blue)]" />}
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
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--gt-blue)] text-white font-medium text-[15px] hover:bg-[var(--gt-blue-light)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
            <section className="gt-section-light-gray py-16">
                <div className="container mx-auto px-4 md:px-6 max-w-xl">
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
                                    <h3 className="text-2xl font-semibold text-[var(--gt-light-text)] mb-3">
                                        {getLocalizedContent(data.title, locale)}
                                    </h3>
                                </div>
                                <ErrorBanner />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                            {t('equipmentRental.form.name')} <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder={t('equipmentRental.form.name')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                            {t('equipmentRental.form.mobile')} <span className="text-red-500">*</span>
                                        </label>
                                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="+359 ..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                        {t('equipmentRental.form.email')} <span className="text-red-500">*</span>
                                    </label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="email@example.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">{t('equipmentRental.form.categories')}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {equipmentCategories.map((category) => (
                                            <ChipButton key={category} isSelected={selectedCategories.includes(category)} onClick={() => handleCheckboxChange(category, selectedCategories, setSelectedCategories)} disabled={status === 'submitting'}>
                                                {t(`equipmentRental.categories.${category}`)}
                                            </ChipButton>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">{t('equipmentRental.form.message')}</label>
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
        <section className="gt-section-light py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-7 md:p-9 shadow-sm overflow-hidden">
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
                                        <h3 className="text-xl font-semibold text-[var(--gt-light-text)] mb-3">
                                            {getLocalizedContent(data.title, locale)}
                                        </h3>
                                        <div className="accent-line" />
                                    </div>
                                    <ErrorBanner />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                                {t('contact.form.name')} <span className="text-red-500">*</span>
                                            </label>
                                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder={t('contact.form.name')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                                {t('contact.form.mobile')} <span className="text-red-500">*</span>
                                            </label>
                                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="+359 ..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">
                                            {t('contact.form.email')} <span className="text-red-500">*</span>
                                        </label>
                                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'} className={inputClasses} placeholder="email@example.com" />
                                    </div>
                                    {data.projectTypes && data.projectTypes.length > 0 && (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">{t('contact.form.projectType')}</label>
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
                                            <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">{t('contact.form.services')}</label>
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
                                        <label className="block text-sm font-medium text-[var(--gt-light-text-secondary)]">{t('contact.form.description')}</label>
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
