'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface SpecItem {
    label: LocalizedContent<string>
    value: LocalizedContent<string>
}

interface ProductSpecsData {
    type: 'productSpecs'
    title: LocalizedContent<string>
    subtitle?: LocalizedContent<string>
    specs: SpecItem[]
    drinks?: LocalizedContent<string[]>
    podExplanation?: LocalizedContent<string>
    steps?: LocalizedContent<string>[]
    certifications?: string[]
}

interface ProductSpecsProps {
    data: ProductSpecsData
    locale: string
}

export function ProductSpecs({ data, locale }: ProductSpecsProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = data.subtitle ? getLocalizedContent(data.subtitle, locale) : null
    const hasSpecs = data.specs && data.specs.length > 0
    const drinks = data.drinks ? getLocalizedContent(data.drinks, locale) : null
    const podExplanation = data.podExplanation ? getLocalizedContent(data.podExplanation, locale) : null
    const steps = data.steps
        ? data.steps.map((s) => getLocalizedContent(s, locale))
        : null
    const certifications = data.certifications || []

    if (!hasSpecs && !drinks) return null

    return (
        <section className="gt-section-light-gray py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-(--gt-light-text) tracking-tight mb-3">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-(--gt-light-text-secondary) text-lg max-w-xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                <div className={`max-w-4xl mx-auto ${drinks || steps ? 'grid lg:grid-cols-2 gap-8' : ''}`}>
                    {/* Specs table */}
                    {hasSpecs && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-(--gt-light-border)"
                        >
                            {data.specs.map((spec, index) => {
                                const label = getLocalizedContent(spec.label, locale)
                                const value = getLocalizedContent(spec.value, locale)
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.04 }}
                                        className={`flex justify-between items-center px-7 py-4 ${
                                            index !== data.specs.length - 1
                                                ? 'border-b border-(--gt-light-border)'
                                                : ''
                                        }`}
                                    >
                                        <span className="text-(--gt-light-text-secondary) text-sm">
                                            {label}
                                        </span>
                                        <span className="font-mono font-medium text-(--gt-light-text) text-sm text-right">
                                            {value}
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}

                    {/* Side panel: drinks list, pod explanation, steps, certifications */}
                    {(drinks || steps || podExplanation) && (
                        <div className="flex flex-col gap-6">
                            {/* Drinks grid */}
                            {drinks && drinks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-white rounded-2xl p-7 shadow-sm border border-(--gt-light-border)"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-9 h-9 rounded-xl bg-(--gt-blue)/8 flex items-center justify-center">
                                            <Icon icon="mdi:cup" className="w-4.5 h-4.5 text-(--gt-blue)" />
                                        </div>
                                        <h3 className="text-base font-semibold text-(--gt-light-text)">
                                            {locale === 'bg' ? 'Налични напитки' : 'Available Drinks'}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {drinks.map((drink, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex px-3 py-1.5 rounded-lg bg-(--gt-light-surface) text-(--gt-light-text-secondary) text-xs font-medium"
                                            >
                                                {drink}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Pod explanation */}
                            {podExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                    className="bg-white rounded-2xl p-7 shadow-sm border border-(--gt-light-border)"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                                            <Icon icon="mdi:leaf" className="w-4.5 h-4.5 text-emerald-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-(--gt-light-text)">
                                            {locale === 'bg' ? 'E.S.E Pods' : 'E.S.E Pods'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-(--gt-light-text-secondary) leading-relaxed">
                                        {podExplanation}
                                    </p>
                                </motion.div>
                            )}

                            {/* Steps */}
                            {steps && steps.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="bg-white rounded-2xl p-7 shadow-sm border border-(--gt-light-border)"
                                >
                                    <h3 className="text-base font-semibold text-(--gt-light-text) mb-5">
                                        {locale === 'bg' ? 'Как работи' : 'How It Works'}
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {steps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-(--gt-blue)/8 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-(--gt-blue)">
                                                        {i + 1}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-(--gt-light-text)">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center justify-center gap-6 mt-12"
                    >
                        {certifications.map((cert, i) => (
                            <span
                                key={i}
                                className="text-xs font-medium text-(--gt-light-text-muted) uppercase tracking-wider"
                            >
                                {cert}
                            </span>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
