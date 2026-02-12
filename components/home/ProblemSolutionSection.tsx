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
        <section className="py-24 relative">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
                        {title}
                    </h2>
                    <div className="w-20 h-1 bg-[var(--gt-blue)] mx-auto mt-6" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Problems */}
                    <div className="space-y-6">
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
                                    className="glass-card rounded-2xl p-6 flex gap-4"
                                >
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5">
                                        <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg mb-1">{problemTitle}</h3>
                                        <p className="text-foreground/60 leading-relaxed">{problemDesc}</p>
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
                        className="glass-card rounded-2xl p-8 border border-[var(--gt-blue)]/20 bg-[var(--gt-blue)]/[0.03]"
                    >
                        <div className="w-12 h-12 rounded-full bg-[var(--gt-blue)]/10 flex items-center justify-center mb-5">
                            <Icon icon="mdi:check-circle" className="w-6 h-6 text-[var(--gt-blue)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">{solutionTitle}</h3>
                        <p className="text-foreground/70 leading-relaxed text-lg">{solutionDesc}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
