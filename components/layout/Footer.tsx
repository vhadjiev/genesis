'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import i18nConfig from '@/i18nConfig'

const sitemapLinks = [
    { key: 'studio', href: '/' },
    { key: 'events', href: '/events' },
    { key: 'gallery', href: '/gallery' },
    { key: 'equipment', href: '/equipment' },
    { key: 'contacts', href: '/contacts' },
]

const socialLinks = [
    { icon: 'mdi:facebook', href: 'https://www.facebook.com/ubcsoundandcinemastudio/', label: 'Facebook' },
    { icon: 'mdi:instagram', href: 'https://www.instagram.com/ubcstudio/', label: 'Instagram' },
]

export function Footer() {
    const { t, i18n } = useTranslation()
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

    return (
        <footer className="bg-[#282834] border-t border-white/10">
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Mobile Layout */}
                <div className="md:hidden">
                    {/* Logo + Social Row */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href={localizedHref('/')}>
                            <Image
                                src="/images/ubc-logo.svg"
                                alt={t('site.name')}
                                width={60}
                                height={60}
                                className="w-14 h-14 object-contain"
                            />
                        </Link>
                        <div className="flex gap-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-white/60"
                                    aria-label={link.label}
                                >
                                    <Icon icon={link.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav Links - Horizontal */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                        {sitemapLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={localizedHref(link.href)}
                                className="text-sm text-white/60 hover:text-primary transition-colors"
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Info - Compact */}
                    <div className="flex flex-col gap-2 text-sm text-white/60 mb-6">
                        <a
                            href="https://maps.app.goo.gl/V3rvmEvFyFLjkH1d9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <Icon icon="mdi:map-marker" className="w-4 h-4 text-primary" />
                            Preslav 15, Plovdiv, Bulgaria
                        </a>
                        <a
                            href="tel:+359888352211"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <Icon icon="mdi:phone" className="w-4 h-4 text-primary" />
                            +359 888 352211
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-white/40 text-center">
                            {t('site.name')} - {new Date().getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-3 gap-12">
                        {/* Logo & Social */}
                        <div className="flex flex-col gap-6">
                            <Link href={localizedHref('/')} className="inline-block">
                                <Image
                                    src="/images/ubc-logo.svg"
                                    alt={t('site.name')}
                                    width={120}
                                    height={120}
                                    className="w-24 h-24 object-contain"
                                />
                            </Link>
                            <div className="flex gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-white/60"
                                        aria-label={link.label}
                                    >
                                        <Icon icon={link.icon} className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Sitemap */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.sitemap')}</h3>
                            <ul className="space-y-2">
                                {sitemapLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            <Icon icon="mdi:chevron-right" className="w-4 h-4" />
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contacts */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.contacts')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://maps.app.goo.gl/V3rvmEvFyFLjkH1d9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-start gap-2"
                                    >
                                        <Icon icon="mdi:map-marker" className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-white">{t('footer.location')}:</strong>
                                            <br />
                                            Preslav 15
                                            <br />
                                            Plovdiv, Bulgaria
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="tel:+359888352211"
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="mdi:phone" className="w-5 h-5 shrink-0" />
                                        <span>
                                            <strong className="text-white">{t('footer.mobile')}:</strong> +359 888 352211
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-sm text-white/40 text-center">
                            {t('site.name')} - {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
