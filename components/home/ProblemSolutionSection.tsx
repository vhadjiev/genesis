'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface Problem {
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface Solution {
    title: LocalizedContent<string>
    description: LocalizedContent<string>
}

interface ProblemSolutionSectionData {
    type: 'problemSolutionSection'
    title: LocalizedContent<string>
    problems: Problem[]
    solution: Solution
}

interface ProblemSolutionSectionProps {
    data: ProblemSolutionSectionData
    locale: string
}

export function ProblemSolutionSection({ data, locale }: ProblemSolutionSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const solutionTitle = getLocalizedContent(data.solution.title, locale)
    const solutionDesc = getLocalizedContent(data.solution.description, locale)

    return (
        <section className="py-32 relative">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] text-[var(--gt-text)] max-w-4xl mx-auto leading-[1.15] italic">
                        {title}
                    </h2>
                    <div className="gold-accent-line mx-auto mt-8" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Problems */}
                    <div className="space-y-5">
                        {data.problems.map((problem, index) => {
                            const problemTitle = getLocalizedContent(problem.title, locale)
                            const problemDesc = getLocalizedContent(problem.description, locale)
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.12 }}
                                    className="glass-card rounded-2xl p-7 flex gap-5"
                                >
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--gt-danger)]/10 flex items-center justify-center mt-0.5">
                                        <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-[var(--gt-danger)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--gt-text)] text-lg mb-1.5">{problemTitle}</h3>
                                        <p className="text-[var(--gt-text-secondary)] leading-relaxed">{problemDesc}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Solution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card rounded-2xl p-9 border-[var(--gt-border)] relative overflow-hidden"
                    >
                        {/* Gold glow effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--gt-gold)]/[0.04] rounded-full blur-3xl" />

                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-[var(--gt-gold)]/10 flex items-center justify-center mb-6">
                                <Icon icon="mdi:check-circle" className="w-6 h-6 text-[var(--gt-gold)]" />
                            </div>
                            <h3 className="font-display text-2xl italic text-[var(--gt-text)] mb-4">{solutionTitle}</h3>
                            <p className="text-[var(--gt-text-secondary)] leading-relaxed text-lg">{solutionDesc}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
