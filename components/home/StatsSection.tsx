'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
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
            className="text-center"
        >
            <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-4 tracking-tighter">
                {Number.isInteger(stat.value) ? count : count.toFixed(1)}
                {stat.suffix && <span className="text-[var(--gt-blue)]">{stat.suffix}</span>}
            </div>
            <p className="text-[var(--gt-dark-text-muted)] text-[12px] uppercase tracking-widest">{label}</p>
        </motion.div>
    )
}

export function StatsSection({ data, locale }: StatsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    return (
        <section ref={sectionRef} className="gt-section-dark py-28 lg:py-36 relative overflow-hidden">
            {/* Parallax gradient bg */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 opacity-30"
            >
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(ellipse at 50% 50%, var(--gt-blue) 0%, transparent 70%)',
                    opacity: 0.15,
                }} />
            </motion.div>

            <div className="relative container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-4xl mx-auto glass-surface-dark rounded-[var(--radius-card)] p-12 lg:p-16">
                    {data.stats.map((stat, index) => (
                        <StatCounter key={index} stat={stat} locale={locale} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
