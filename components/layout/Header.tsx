'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import i18nConfig from '@/i18nConfig'

interface NavChild {
    key: string
    href: string
}

interface NavItem {
    key: string
    href: string
    children?: NavChild[]
}

const navLinks: NavItem[] = [
    {
        key: 'equipment',
        href: '#',
        children: [
            { key: 'genesisAlpha', href: '/equipment/genesis-alpha' },
            { key: 'genesisPrime', href: '/equipment/genesis-prime' },
            { key: 'genesisUniversa', href: '/equipment/genesis-universa' },
            { key: 'genesisEclipse', href: '/equipment/genesis-eclipse' },
            { key: 'genesisSolaris', href: '/equipment/genesis-solaris' },
            { key: 'genesisSolaris2', href: '/equipment/genesis-solaris-2' },
            { key: 'genesisEquinox', href: '/equipment/genesis-equinox' },
        ],
    },
    {
        key: 'services',
        href: '#',
        children: [
            { key: 'cloudSystem', href: '/services/cloud-system' },
            { key: 'laserCutting', href: '/services/laser-cutting' },
            { key: 'sheetMetalBending', href: '/services/sheet-metal-bending' },
        ],
    },
    {
        key: 'about',
        href: '/about',
        children: [
            { key: 'news', href: '/news' },
            { key: 'exhibitions', href: '/exhibitions' },
            { key: 'projects', href: '/projects' },
        ],
    },
    { key: 'contacts', href: '/contacts' },
]

export function Header() {
    const { t, i18n } = useTranslation()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    const localizedHref = (href: string) => {
        if (isDefaultLocale) return href
        if (href === '/') return `/${currentLocale}`
        return `/${currentLocale}${href}`
    }

    const switchLanguage = (newLocale: string) => {
        let pathWithoutLocale = pathname
        for (const locale of i18nConfig.locales) {
            if (locale !== i18nConfig.defaultLocale && pathname.startsWith(`/${locale}`)) {
                pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
                break
            }
        }

        let newPath: string
        if (newLocale === i18nConfig.defaultLocale) {
            newPath = pathWithoutLocale || '/'
        } else {
            newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
        }

        window.location.href = newPath
    }

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setOpenDropdown(null)
    }, [pathname])

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
        if (href === '/' || href === '#') {
            if (isDefaultLocale) return pathname === '/' || pathname === ''
            return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`
        }
        return pathname.includes(href)
    }

    const isParentActive = (item: NavItem) => {
        if (item.children) {
            return item.children.some((child) => pathname.includes(child.href))
        }
        return isActive(item.href)
    }

    const handleDropdownEnter = (key: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
        setOpenDropdown(key)
    }

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
    }

    return (
        <>
            <header className={`gt-header fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'is-scrolled' : ''}`}>
                <nav className="container mx-auto gt-header-nav">
                    <div className="gt-header-bar">
                        {/* Logo */}
                        <Link href={localizedHref('/')} className="gt-header-logo">
                            <Image
                                src="/images/gentech-logo.svg"
                                alt="Genesis Technology"
                                width={140}
                                height={40}
                                className="w-auto h-[36px] object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex gt-header-links">
                            {navLinks.map((link) => (
                                <div key={link.key} className="relative">
                                    {link.children ? (
                                        <div
                                            className={`gt-dropdown ${openDropdown === link.key ? 'is-open' : ''}`}
                                            onMouseEnter={() => handleDropdownEnter(link.key)}
                                            onMouseLeave={handleDropdownLeave}
                                        >
                                            <button
                                                className={`gt-dropdown-trigger ${isParentActive(link) ? 'is-active' : ''}`}
                                                onClick={() =>
                                                    setOpenDropdown(openDropdown === link.key ? null : link.key)
                                                }
                                            >
                                                {t(`nav.${link.key}`)}
                                                <Icon
                                                    icon="mdi:chevron-down"
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        openDropdown === link.key ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            <div className="gt-dropdown-menu">
                                                {link.href !== '#' && (
                                                    <Link
                                                        href={localizedHref(link.href)}
                                                        className={`gt-dropdown-item font-semibold ${
                                                            isActive(link.href) ? 'is-active' : ''
                                                        }`}
                                                    >
                                                        {t(`nav.${link.key}`)}
                                                    </Link>
                                                )}
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.key}
                                                        href={localizedHref(child.href)}
                                                        className={`gt-dropdown-item ${
                                                            isActive(child.href) ? 'is-active' : ''
                                                        }`}
                                                    >
                                                        {t(`nav.${child.key}`)}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={localizedHref(link.href)}
                                            className={`gt-nav-link ${isActive(link.href) ? 'is-active' : ''}`}
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Language Switcher */}
                        <div className="hidden lg:flex items-center gap-1 text-sm absolute right-0 z-2">
                            {i18nConfig.locales.map((locale, index) => (
                                <React.Fragment key={locale}>
                                    {index > 0 && <span className="text-white/30">|</span>}
                                    <button
                                        onClick={() => switchLanguage(locale)}
                                        className={`uppercase tracking-wide transition-colors px-1 ${
                                            currentLocale === locale
                                                ? 'text-(--gt-accent) font-medium'
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
                            className="gt-menu-button lg:hidden absolute right-4 lg:right-0 z-10"
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
                        <div
                            className="absolute inset-0 bg-(--gt-darker)/98 backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="relative flex flex-col items-center justify-center h-full overflow-y-auto py-20"
                        >
                            <nav className="flex flex-col items-center gap-4">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                        className="w-full text-center"
                                    >
                                        {link.children ? (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        setOpenMobileSubmenu(
                                                            openMobileSubmenu === link.key ? null : link.key
                                                        )
                                                    }
                                                    className={`text-2xl font-light transition-colors flex items-center gap-2 mx-auto ${
                                                        isParentActive(link)
                                                            ? 'text-(--gt-accent)'
                                                            : 'text-white/90 hover:text-white'
                                                    }`}
                                                >
                                                    {t(`nav.${link.key}`)}
                                                    <Icon
                                                        icon="mdi:chevron-down"
                                                        className={`w-5 h-5 transition-transform duration-200 ${
                                                            openMobileSubmenu === link.key ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {openMobileSubmenu === link.key && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex flex-col items-center gap-3 mt-3">
                                                                {link.href !== '#' && (
                                                                    <Link
                                                                        href={localizedHref(link.href)}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className={`text-base transition-colors ${
                                                                            isActive(link.href)
                                                                                ? 'text-(--gt-accent)'
                                                                                : 'text-white/60 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        {t(`nav.${link.key}`)}
                                                                    </Link>
                                                                )}
                                                                {link.children.map((child) => (
                                                                    <Link
                                                                        key={child.key}
                                                                        href={localizedHref(child.href)}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className={`text-base transition-colors ${
                                                                            isActive(child.href)
                                                                                ? 'text-(--gt-accent)'
                                                                                : 'text-white/60 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        {t(`nav.${child.key}`)}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                href={localizedHref(link.href)}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-2xl font-light transition-colors ${
                                                    isActive(link.href)
                                                        ? 'text-(--gt-accent)'
                                                        : 'text-white/90 hover:text-white'
                                                }`}
                                            >
                                                {t(`nav.${link.key}`)}
                                            </Link>
                                        )}
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
                                                    ? 'text-(--gt-accent) bg-(--gt-accent)/10'
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
