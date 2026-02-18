'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'
import i18nConfig from '@/i18nConfig'

const DRAW_DELAY = 200
const DRAW_COMPLETE = 2600
const MOVE_DELAY = DRAW_COMPLETE + 500
const MOVE_MS = 1400
const FADE_DELAY = MOVE_DELAY + MOVE_MS
const FADE_MS = 600
const CLEANUP_DELAY = FADE_DELAY + FADE_MS + 100

export function LogoSplash() {
    const pathname = usePathname()
    const [visible, setVisible] = useState(false)
    const [drawActive, setDrawActive] = useState(false)
    const [moving, setMoving] = useState(false)
    const [fading, setFading] = useState(false)
    const [target, setTarget] = useState<{ x: number; y: number; scale: number } | null>(null)
    const logoRef = useRef<HTMLDivElement>(null)

    const isHomePage =
        pathname === '/' ||
        i18nConfig.locales.some(
            (l) =>
                l !== i18nConfig.defaultLocale &&
                (pathname === `/${l}` || pathname === `/${l}/`)
        )

    useEffect(() => {
        if (!isHomePage) {
            setVisible(false)
            return
        }
    }, [isHomePage])

    useEffect(() => {
        if (!isHomePage) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reducedMotion) return

        try {
            if (sessionStorage.getItem('gt-splash-shown')) return
            sessionStorage.setItem('gt-splash-shown', '1')
        } catch {
            return
        }

        setVisible(true)
        document.body.style.overflow = 'hidden'

        const timers: ReturnType<typeof setTimeout>[] = []

        timers.push(setTimeout(() => setDrawActive(true), DRAW_DELAY))

        timers.push(
            setTimeout(() => {
                const headerSvg = document.querySelector('.gt-header-logo svg')
                if (headerSvg && logoRef.current) {
                    const from = logoRef.current.getBoundingClientRect()
                    const to = headerSvg.getBoundingClientRect()
                    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
                    const dy = to.top + to.height / 2 - (from.top + from.height / 2)
                    const scale = to.width / from.width
                    setTarget({ x: dx, y: dy, scale })
                }
                setMoving(true)
            }, MOVE_DELAY)
        )

        timers.push(setTimeout(() => setFading(true), FADE_DELAY))

        timers.push(
            setTimeout(() => {
                setVisible(false)
                document.body.style.overflow = ''
            }, CLEANUP_DELAY)
        )

        return () => {
            timers.forEach(clearTimeout)
            document.body.style.overflow = ''
        }
    }, [isHomePage])

    if (!visible) return null

    return (
        <motion.div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black"
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: FADE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
        >
            <motion.div
                ref={logoRef}
                className="w-[min(480px,80vw)]"
                animate={
                    moving && target
                        ? { x: target.x, y: target.y, scale: target.scale }
                        : { x: 0, y: 0, scale: 1 }
                }
                transition={{
                    duration: MOVE_MS / 1000,
                    ease: [0.65, 0, 0.35, 1],
                }}
            >
                <Logo
                    animated
                    color="#ffffff"
                    className={`w-full h-auto ${drawActive ? 'active' : ''}`}
                />
            </motion.div>
        </motion.div>
    )
}
