'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/icons'
import i18nConfig from '@/i18nConfig'
import { navLinks, type NavItem } from '@/config/navigation'
import { Logo } from '@/components/shared'

type HeaderTheme = 'dark' | 'light'

export function Header() {
    const { t, i18n } = useTranslation()
    const pathname = usePathname()
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('dark')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
    const [logoDrawActive, setLogoDrawActive] = useState(false)
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    const isHomePage =
        pathname === '/' ||
        i18nConfig.locales.some(
            (l) => l !== i18nConfig.defaultLocale && (pathname === `/${l}` || pathname === `/${l}/`)
        )

    const localizedHref = (href: string) => {
        if (isDefaultLocale) return href
        if (href === '/') return `/${currentLocale}`
        return `/${currentLocale}${href}`
    }

    const switchLanguage = (newLocale: string) => {
        document.cookie = `${i18nConfig.localeCookie ?? '_LOCALE'}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`

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

        router.push(newPath)
    }

    // Chameleon header: detect section behind header and adapt theme
    // useEffect(() => {
    //     let ticking = false

    //     const detectTheme = () => {
    //         const scrollY = window.scrollY
    //         setIsScrolled(scrollY > 50)

    //         // Sample point: center of header (26px from top)
    //         const probeY = 26
    //         const sections = document.querySelectorAll<HTMLElement>('section, [class*="gt-section-"]')
    //         let detectedTheme: HeaderTheme = 'dark' // default for hero

    //         for (const section of sections) {
    //             const rect = section.getBoundingClientRect()
    //             if (rect.top <= probeY && rect.bottom > probeY) {
    //                 const cls = section.className
    //                 if (cls.includes('gt-section-light')) {
    //                     detectedTheme = 'light'
    //                 } else {
    //                     detectedTheme = 'dark'
    //                 }
    //                 break
    //             }
    //         }

    //         setHeaderTheme(detectedTheme)
    //     }

    //     const handleScroll = () => {
    //         if (!ticking) {
    //             ticking = true
    //             requestAnimationFrame(() => {
    //                 detectTheme()
    //                 ticking = false
    //             })
    //         }
    //     }

    //     detectTheme()
    //     window.addEventListener('scroll', handleScroll, { passive: true })
    //     return () => window.removeEventListener('scroll', handleScroll)
    // }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setOpenDropdown(null)
    }, [pathname])

    useEffect(() => {
        if (!isHomePage) {
            setLogoDrawActive(false)
            return
        }
        const t = setTimeout(() => setLogoDrawActive(true), 200)
        return () => clearTimeout(t)
    }, [isHomePage])

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
        if (item.groups) {
            return item.groups.some((group) => group.children.some((child) => pathname.includes(child.href)))
        }
        if (item.children) {
            return item.children.some((child) => pathname.includes(child.href))
        }
        if (item.featured) {
            return pathname.includes(item.featured.href)
        }
        return isActive(item.href)
    }

    const hasDropdown = (item: NavItem) => !!(item.groups || item.children)

    const handleDropdownEnter = (key: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
        setOpenDropdown(key)
    }

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
    }

    /** Render a grouped mega-dropdown with product cards */
    const renderMegaDropdown = (item: NavItem) => (
        <div className="gt-mega-dropdown-menu">
            <div className="gt-mega-dropdown-groups">
                {item.groups!.map((group) => (
                    <div
                        key={group.labelKey}
                        className="gt-mega-dropdown-group"
                    >
                        <span className="gt-mega-dropdown-label">{t(`nav.${group.labelKey}`)}</span>
                        {group.children.map((child) => (
                            <Link
                                key={child.key}
                                href={localizedHref(child.href)}
                                className={`gt-mega-product-card ${isActive(child.href) ? 'is-active' : ''}`}
                            >
                                {/* Product thumbnail — real image or gradient placeholder */}
                                <div
                                    className={`gt-mega-product-thumb ${child.image ? '' : `bg-gradient-to-br ${child.gradient || 'from-slate-800 to-slate-900'}`}`}
                                >
                                    {child.image ? (
                                        <Image
                                            src={child.image}
                                            alt={t(`nav.${child.key}`)}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <Icon
                                            icon="mdi:coffee-maker-outline"
                                            className="w-5 h-5 text-white/40"
                                        />
                                    )}
                                </div>
                                <div className="gt-mega-product-info">
                                    <span className="gt-mega-product-name">{t(`nav.${child.key}`)}</span>
                                    {child.desc && <span className="gt-mega-product-desc">{child.desc}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            {item.featured && (
                <>
                    <div className="gt-mega-dropdown-separator" />
                    <Link
                        href={localizedHref(item.featured.href)}
                        className={`gt-mega-dropdown-featured ${isActive(item.featured.href) ? 'is-active' : ''}`}
                    >
                        <div className="gt-mega-featured-icon">
                            {item.featured.icon && (
                                <Icon
                                    icon={item.featured.icon}
                                    className="w-4.5 h-4.5 text-[var(--gt-blue)]"
                                />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="gt-mega-featured-title">{t(`nav.${item.featured.key}`)}</span>
                            <span className="gt-mega-featured-desc">
                                {currentLocale === 'bg'
                                    ? 'Управлявайте машините отдалечено'
                                    : 'Manage your machines remotely'}
                            </span>
                        </div>
                        <Icon
                            icon="mdi:arrow-right"
                            className="w-4 h-4 ml-auto gt-mega-featured-arrow"
                        />
                    </Link>
                </>
            )}
        </div>
    )

    /** Render a simple dropdown */
    const renderSimpleDropdown = (item: NavItem) => (
        <div className="gt-dropdown-menu">
            {item.href !== '#' && (
                <Link
                    href={localizedHref(item.href)}
                    className={`gt-dropdown-item font-medium ${isActive(item.href) ? 'is-active' : ''}`}
                >
                    {t(`nav.${item.key}`)}
                </Link>
            )}
            {item.children!.map((child) => (
                <Link
                    key={child.key}
                    href={localizedHref(child.href)}
                    className={`gt-dropdown-item ${isActive(child.href) ? 'is-active' : ''}`}
                >
                    {t(`nav.${child.key}`)}
                </Link>
            ))}
        </div>
    )

    /** Render mobile submenu content for a grouped item */
    const renderMobileGroupedSubmenu = (item: NavItem) => (
        <div className="flex flex-col items-center gap-2 mt-3">
            {item.groups!.map((group) => (
                <React.Fragment key={group.labelKey}>
                    <span className="text-[11px] uppercase tracking-widest text-[var(--gt-dark-text-muted)] mt-3 mb-1 font-medium">
                        {t(`nav.${group.labelKey}`)}
                    </span>
                    {group.children.map((child) => (
                        <Link
                            key={child.key}
                            href={localizedHref(child.href)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-base transition-colors ${
                                isActive(child.href)
                                    ? 'text-[var(--gt-dark-text)]'
                                    : 'text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)]'
                            }`}
                        >
                            {t(`nav.${child.key}`)}
                        </Link>
                    ))}
                </React.Fragment>
            ))}
            {item.featured && (
                <>
                    <div className="w-8 h-px bg-[var(--gt-dark-border)] my-2" />
                    <Link
                        href={localizedHref(item.featured.href)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base flex items-center gap-2 transition-colors ${
                            isActive(item.featured.href)
                                ? 'text-[var(--gt-blue)]'
                                : 'text-[var(--gt-blue)] hover:text-[var(--gt-blue-light)]'
                        }`}
                    >
                        {item.featured.icon && (
                            <Icon
                                icon={item.featured.icon}
                                className="w-4 h-4"
                            />
                        )}
                        {t(`nav.${item.featured.key}`)}
                    </Link>
                </>
            )}
        </div>
    )

    /** Render mobile submenu content for a simple dropdown */
    const renderMobileSimpleSubmenu = (item: NavItem) => (
        <div className="flex flex-col items-center gap-3 mt-3">
            {item.href !== '#' && (
                <Link
                    href={localizedHref(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base transition-colors ${
                        isActive(item.href)
                            ? 'text-[var(--gt-dark-text)]'
                            : 'text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)]'
                    }`}
                >
                    {t(`nav.${item.key}`)}
                </Link>
            )}
            {item.children!.map((child) => (
                <Link
                    key={child.key}
                    href={localizedHref(child.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base transition-colors ${
                        isActive(child.href)
                            ? 'text-[var(--gt-dark-text)]'
                            : 'text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)]'
                    }`}
                >
                    {t(`nav.${child.key}`)}
                </Link>
            ))}
        </div>
    )

    return (
        <>
            <header
                className={[
                    'gt-header fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                    'bg-black/85 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.25)]',
                    'theme-dark',
                    // isScrolled
                    //     ? headerTheme === 'light'
                    //         ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[0_1px_16px_rgba(0,0,0,0.06)]'
                    //         : 'bg-black/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.25)]'
                    //     : 'bg-transparent border-b border-transparent',
                    // headerTheme === 'light' ? 'theme-light' : 'theme-dark',
                ].join(' ')}
            >
                <nav className="container mx-auto px-4 md:px-6 gt-header-nav">
                    <div className="gt-header-bar">
                        {/* Logo — adapts color to header theme */}
                        <Link
                            href={localizedHref('/')}
                            className="gt-header-logo py-5"
                        >
                            <Logo
                                // animated={isHomePage}
                                className={`h-[22px] w-auto transition-colors duration-500 ${isHomePage && logoDrawActive ? 'active' : ''}`}
                                color={headerTheme === 'light' ? '#4b6db1' : '#ffffff'}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex gt-header-links">
                            {navLinks.map((link) => (
                                <div
                                    key={link.key}
                                    className="relative"
                                >
                                    {link.isCTA ? (
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="gt-nav-cta"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    ) : hasDropdown(link) ? (
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
                                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                        openDropdown === link.key ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            {link.groups ? renderMegaDropdown(link) : renderSimpleDropdown(link)}
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

                        {/* Language Switcher — uses CSS classes for theme adaptation */}
                        <div className="hidden lg:flex items-center gap-1 text-[11px] absolute right-0 z-2">
                            {i18nConfig.locales.map((locale, index) => (
                                <React.Fragment key={locale}>
                                    {index > 0 && <span className="gt-lang-divider">/</span>}
                                    <button
                                        onClick={() => switchLanguage(locale)}
                                        className={`uppercase tracking-wide transition-colors duration-500 px-1 ${
                                            currentLocale === locale ? 'gt-lang-active font-medium' : 'gt-lang-inactive'
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
                            className="absolute inset-0 bg-black/70 backdrop-blur-[40px] saturate-[1.8]"
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
                                        {link.isCTA ? (
                                            <Link
                                                href={localizedHref(link.href)}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="inline-flex items-center justify-center px-8 py-3 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white font-medium rounded-full transition-colors text-lg"
                                            >
                                                {t(`nav.${link.key}`)}
                                            </Link>
                                        ) : hasDropdown(link) ? (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        setOpenMobileSubmenu(
                                                            openMobileSubmenu === link.key ? null : link.key
                                                        )
                                                    }
                                                    className={`text-2xl font-medium transition-colors flex items-center gap-2 mx-auto ${
                                                        isParentActive(link)
                                                            ? 'text-[var(--gt-dark-text)]'
                                                            : 'text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)]'
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
                                                            {link.groups
                                                                ? renderMobileGroupedSubmenu(link)
                                                                : renderMobileSimpleSubmenu(link)}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                href={localizedHref(link.href)}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-2xl font-medium transition-colors ${
                                                    isActive(link.href)
                                                        ? 'text-[var(--gt-dark-text)]'
                                                        : 'text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)]'
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
                                    className="flex items-center gap-3 mt-4 pt-6 border-t border-[var(--gt-dark-border)]"
                                >
                                    {i18nConfig.locales.map((locale) => (
                                        <button
                                            key={locale}
                                            onClick={() => {
                                                switchLanguage(locale)
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className={`uppercase text-lg tracking-wide transition-colors px-3 py-1 rounded-full ${
                                                currentLocale === locale
                                                    ? 'text-white bg-[var(--gt-blue)]'
                                                    : 'text-[var(--gt-dark-text-muted)] hover:text-[var(--gt-dark-text)]'
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
