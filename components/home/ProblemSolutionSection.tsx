'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icons'
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
        <section className="gt-section-light py-28 lg:py-36">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] text-[var(--gt-light-text)] max-w-3xl mx-auto leading-tight tracking-tight">
                        {title}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Problems */}
                    <div className="space-y-4">
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
                                    className="glass-card-light p-7 flex gap-5"
                                >
                                    <div className="shrink-0 w-10 h-10 rounded-2xl bg-red-50/80 backdrop-blur-sm flex items-center justify-center mt-0.5">
                                        <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[var(--gt-light-text)] text-lg mb-1.5">{problemTitle}</h3>
                                        <p className="text-[var(--gt-light-text-secondary)] leading-relaxed">{problemDesc}</p>
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
                        className="glass-card-light p-9 relative overflow-hidden"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/80 backdrop-blur-sm flex items-center justify-center mb-6">
                                <Icon icon="mdi:check-circle" className="w-6 h-6 text-[var(--gt-blue)]" />
                            </div>
                            <h3 className="text-2xl font-medium text-[var(--gt-light-text)] mb-4">{solutionTitle}</h3>
                            <p className="text-[var(--gt-light-text-secondary)] leading-relaxed text-lg">{solutionDesc}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
