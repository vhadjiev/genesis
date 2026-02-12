'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface StatItem {
    value: number
    suffix?: string
    label: LocalizedContent<string>
}

interface StatsSectionData {
    type: 'statsSection'
    stats: StatItem[]
}

interface StatsSectionProps {
    data: StatsSectionData
    locale: string
}

/** Animated counter hook */
function useCounter(end: number, duration: number = 2000, shouldStart: boolean = false) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!shouldStart) return

        let startTime: number | null = null
        let animationFrame: number

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration, shouldStart])

    return count
}

function StatCounter({ stat, locale, index }: { stat: StatItem; locale: string; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const count = useCounter(stat.value, 2000, isInView)
    const label = getLocalizedContent(stat.label, locale)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="text-center relative"
        >
            <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 tracking-tighter">
                {Number.isInteger(stat.value) ? count : count.toFixed(1)}
                {stat.suffix && <span>{stat.suffix}</span>}
            </div>
            <p className="text-[var(--gt-text-muted)] text-[11px] uppercase tracking-[0.15em]">{label}</p>
        </motion.div>
    )
}

export function StatsSection({ data, locale }: StatsSectionProps) {
    return (
        <section className="py-24 relative">
            {/* Subtle divider line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[var(--gt-border)] to-transparent" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-4xl mx-auto">
                    {data.stats.map((stat, index) => (
                        <React.Fragment key={index}>
                            <StatCounter stat={stat} locale={locale} index={index} />
                            {/* Gold separator between stats on desktop */}
                            {index < data.stats.length - 1 && (
                                <div className="hidden md:block absolute" style={{
                                    left: `${((index + 1) / data.stats.length) * 100}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}
