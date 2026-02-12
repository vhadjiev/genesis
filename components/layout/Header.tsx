'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import i18nConfig from '@/i18nConfig'

const navLinks = [
    { key: 'studio', href: '/' },
    { key: 'events', href: '/events' },
    { key: 'gallery', href: '/gallery' },
    { key: 'equipment', href: '/equipment' },
    { key: 'contacts', href: '/contacts' },
]

export function Header() {
    const { t, i18n } = useTranslation()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Get current locale from i18next (initialized server-side with correct locale)
    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    // Helper to create localized href (no prefix for default locale)
    const localizedHref = (href: string) => {
        // Default locale (bg) doesn't need prefix
        if (isDefaultLocale) {
            return href
        }
        // Non-default locale (en) needs prefix
        if (href === '/') {
            return `/${currentLocale}`
        }
        return `/${currentLocale}${href}`
    }

    // Switch language - navigate to new locale URL (full page reload for server translations)
    const switchLanguage = (newLocale: string) => {
        // Get path without any locale prefix
        let pathWithoutLocale = pathname
        // Strip locale prefix if present (for non-default locales)
        for (const locale of i18nConfig.locales) {
            if (locale !== i18nConfig.defaultLocale && pathname.startsWith(`/${locale}`)) {
                pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
                break
            }
        }

        // Build new URL - only add prefix for non-default locale
        let newPath: string
        if (newLocale === i18nConfig.defaultLocale) {
            newPath = pathWithoutLocale || '/'
        } else {
            newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
        }

        // Use full page navigation to reload server translations
        window.location.href = newPath
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    const isActive = (href: string) => {
        if (href === '/') {
            // Home is active if we're at root (default locale) or /en (English)
            if (isDefaultLocale) {
                return pathname === '/' || pathname === ''
            }
            return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`
        }
        // For other pages, check if the path segment matches
        return pathname.includes(href)
    }

    return (
        <>
            <header className={`ubc-header fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'is-scrolled' : ''}`}>
                <nav className="container mx-auto ubc-header-nav">
                    <div className="ubc-header-bar">
                        {/* Logo - Left */}
                        <Link
                            href={localizedHref('/')}
                            className="ubc-header-logo"
                        >
                            <Image
                                src="/images/ubc-no-typos-logo.svg"
                                alt="UBC Sound & Cinema"
                                width={65}
                                height={63}
                                className="w-auto h-[52px] object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <div className="hidden lg:flex ubc-header-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.key}
                                    href={localizedHref(link.href)}
                                    className={`ubc-nav-link ${isActive(link.href) ? 'is-active' : ''}`}
                                >
                                    {t(`nav.${link.key}`)}
                                </Link>
                            ))}
                        </div>

                        {/* Language Switcher - Right (Absolute) */}
                        <div className="hidden lg:flex items-center gap-1 text-sm absolute right-0 z-2">
                            {i18nConfig.locales.map((locale, index) => (
                                <React.Fragment key={locale}>
                                    {index > 0 && <span className="text-white/30">|</span>}
                                    <button
                                        onClick={() => switchLanguage(locale)}
                                        className={`uppercase tracking-wide transition-colors px-1 ${
                                            currentLocale === locale
                                                ? 'text-[#67923d] font-medium'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        {locale}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            isIconOnly
                            variant="ghost"
                            className="ubc-menu-button lg:hidden absolute right-4 lg:right-0 z-10"
                            onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <div className="flex flex-col justify-center items-center w-6 h-6">
                                <span
                                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? 'rotate-45 translate-y-[3px]' : '-translate-y-1'
                                    }`}
                                />
                                <span
                                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                                    }`}
                                />
                                <span
                                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                                        isMobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : 'translate-y-1'
                                    }`}
                                />
                            </div>
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-[#0a1612]/98 backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="relative flex flex-col items-center justify-center h-full"
                        >
                            <nav className="flex flex-col items-center gap-8">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link
                                            href={localizedHref(link.href)}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`text-2xl font-light transition-colors ${
                                                isActive(link.href)
                                                    ? 'text-[#67923d]'
                                                    : 'text-white/90 hover:text-white'
                                            }`}
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile Language Switcher */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                                    className="flex items-center gap-3 mt-4 pt-6 border-t border-white/10"
                                >
                                    {i18nConfig.locales.map((locale) => (
                                        <button
                                            key={locale}
                                            onClick={() => {
                                                switchLanguage(locale)
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className={`uppercase text-lg tracking-wider transition-colors px-3 py-1 rounded ${
                                                currentLocale === locale
                                                    ? 'text-[#67923d] bg-[#67923d]/10'
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {locale}
                                        </button>
                                    ))}
                                </motion.div>
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
