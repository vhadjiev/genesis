'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface HeroCTA {
    text: LocalizedContent<string>
    href: string
}

interface HeroSectionData {
    type: 'heroSection'
    title: LocalizedContent<string>
    subtitle: LocalizedContent<string>
    backgroundImage?: string
    ctaPrimary?: HeroCTA
    ctaSecondary?: HeroCTA
}

interface HeroSectionProps {
    data: HeroSectionData
    locale: string
}

/**
 * Subtle animated particle canvas for premium depth effect
 */
function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let particles: Array<{
            x: number; y: number; vx: number; vy: number;
            size: number; opacity: number; opacitySpeed: number
        }> = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const initParticles = () => {
            particles = Array.from({ length: 40 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3,
                opacitySpeed: (Math.random() - 0.5) * 0.003,
            }))
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                p.opacity += p.opacitySpeed

                if (p.opacity <= 0.05 || p.opacity >= 0.35) p.opacitySpeed *= -1
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(0, 113, 227, ${p.opacity})`
                ctx.fill()
            })

            // Draw subtle connecting lines for nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 200) {
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(0, 113, 227, ${0.04 * (1 - dist / 200)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(animate)
        }

        resize()
        initParticles()
        animate()

        window.addEventListener('resize', () => {
            resize()
            initParticles()
        })

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[1] pointer-events-none"
            aria-hidden="true"
        />
    )
}

export function HeroSection({ data, locale }: HeroSectionProps) {
    const title = getLocalizedContent(data.title, locale)
    const subtitle = getLocalizedContent(data.subtitle, locale)
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    return (
        <section ref={sectionRef} className="gt-section-dark relative h-screen min-h-[700px] flex items-center overflow-hidden">
            {/* Background */}
            {data.backgroundImage ? (
                <motion.div className="absolute inset-0" style={{ y: bgY }}>
                    <Image
                        src={data.backgroundImage}
                        alt=""
                        fill
                        className="object-cover scale-110"
                        priority
                    />
                </motion.div>
            ) : (
                <div className="absolute inset-0 bg-black">
                    {/* Premium gradient orbs */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            radial-gradient(ellipse 600px 400px at 25% 30%, rgba(0, 113, 227, 0.12) 0%, transparent 70%),
                            radial-gradient(ellipse 500px 350px at 75% 65%, rgba(0, 88, 181, 0.10) 0%, transparent 70%),
                            radial-gradient(ellipse 800px 300px at 50% 90%, rgba(0, 113, 227, 0.06) 0%, transparent 70%)
                        `,
                    }} />
                    {/* Subtle grid pattern for depth */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }} />
                    {/* Animated particles */}
                    <ParticleBackground />
                </div>
            )}
            <div className="hero-overlay" />

            {/* Content */}
            <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-text max-w-4xl mx-auto"
                >
                    {/* Premium accent line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-[2px] bg-[var(--gt-blue)] mx-auto mb-8 origin-center"
                    />

                    <h1 className="hero-title">
                        {title}
                    </h1>
                    <p className="hero-subtitle">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
                        <Link
                            href={data.ctaPrimary ? data.ctaPrimary.href : '/equipment/genesis-universa'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-medium text-[15px] rounded-full transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
                        >
                            {data.ctaPrimary ? getLocalizedContent(data.ctaPrimary.text, locale) : (locale === 'bg' ? 'Разгледай системите' : 'Explore Our Systems')}
                        </Link>
                        <Link
                            href={data.ctaSecondary ? data.ctaSecondary.href : '/contacts'}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/8 backdrop-blur-xl hover:bg-white/15 text-white font-medium text-[15px] rounded-full transition-all duration-300 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                        >
                            {data.ctaSecondary ? getLocalizedContent(data.ctaSecondary.text, locale) : (locale === 'bg' ? 'Заявете консултация' : 'Schedule a Consultation')}
                        </Link>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    )
}
