'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import i18nConfig from '@/i18nConfig'
import { getAllProductLinks, getCompanyLinks, manufacturingLinks, socialLinks } from '@/config/navigation'

export function Footer() {
    const { t, i18n } = useTranslation()
    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    const localizedHref = (href: string) => {
        if (isDefaultLocale) return href
        if (href === '/') return `/${currentLocale}`
        return `/${currentLocale}${href}`
    }

    const productLinks = getAllProductLinks()
    const companyLinks = getCompanyLinks()

    return (
        <footer className="gt-section-light-gray border-t border-[var(--gt-light-border)]">
            <div className="container mx-auto px-4 md:px-6 py-14 md:py-16">
                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between mb-8">
                        <Link href={localizedHref('/')} className="text-base font-semibold text-[var(--gt-light-text)]">
                            Genesis<span className="font-normal text-[var(--gt-light-text-secondary)]"> Technology</span>
                        </Link>
                        <div className="flex gap-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--gt-light-bg)] text-[var(--gt-light-text-muted)] hover:text-[var(--gt-blue)] transition-colors"
                                    aria-label={link.label}
                                >
                                    <Icon icon={link.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                        {companyLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={localizedHref(link.href)}
                                className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors"
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                        <Link
                            href={localizedHref('/contacts')}
                            className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors"
                        >
                            {t('nav.contacts')}
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[var(--gt-light-text-secondary)] mb-6">
                        <a href="tel:+359895657706" className="flex items-center gap-2 hover:text-[var(--gt-blue)] transition-colors">
                            <Icon icon="mdi:phone" className="w-4 h-4" />
                            +359 89 565 7706
                        </a>
                        <a href="mailto:info@gentech.bg" className="flex items-center gap-2 hover:text-[var(--gt-blue)] transition-colors">
                            <Icon icon="mdi:email" className="w-4 h-4" />
                            info@gentech.bg
                        </a>
                    </div>

                    <div className="pt-4 border-t border-[var(--gt-light-border)]">
                        <p className="text-xs text-[var(--gt-light-text-muted)] text-center">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd.
                        </p>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-5 gap-10">
                        {/* Logo & Social */}
                        <div className="flex flex-col gap-5">
                            <Link href={localizedHref('/')} className="inline-block text-base font-semibold text-[var(--gt-light-text)]">
                                Genesis<span className="font-normal text-[var(--gt-light-text-secondary)]"> Technology</span>
                            </Link>
                            <p className="text-sm text-[var(--gt-light-text-secondary)] leading-relaxed">
                                {t('footer.tagline')}
                            </p>
                            <div className="flex gap-2">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--gt-light-bg)] text-[var(--gt-light-text-muted)] hover:text-[var(--gt-blue)] transition-colors"
                                        aria-label={link.label}
                                    >
                                        <Icon icon={link.icon} className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Systems */}
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--gt-light-text-muted)] mb-5">{t('nav.systems')}</h3>
                            <ul className="space-y-2.5">
                                {productLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href={localizedHref('/services/cloud-system')}
                                        className="text-sm text-[var(--gt-blue)] hover:text-[var(--gt-blue-dark)] transition-colors flex items-center gap-1.5"
                                    >
                                        <Icon icon="mdi:cloud-sync" className="w-3.5 h-3.5" />
                                        {t('nav.cloudPlatform')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--gt-light-text-muted)] mb-5">{t('nav.company')}</h3>
                            <ul className="space-y-2.5">
                                {companyLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Manufacturing */}
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--gt-light-text-muted)] mb-5">{t('nav.manufacturingServices')}</h3>
                            <ul className="space-y-2.5">
                                {manufacturingLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contacts */}
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--gt-light-text-muted)] mb-5">{t('footer.contacts')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://maps.app.goo.gl/gentech-plovdiv"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors flex items-start gap-2"
                                    >
                                        <Icon icon="mdi:map-marker" className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{t('footer.addressLine1')}<br />{t('footer.addressLine2')}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+359895657706" className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors flex items-center gap-2">
                                        <Icon icon="mdi:phone" className="w-4 h-4 shrink-0" />
                                        <span>+359 89 565 7706</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@gentech.bg" className="text-sm text-[var(--gt-light-text-secondary)] hover:text-[var(--gt-blue)] transition-colors flex items-center gap-2">
                                        <Icon icon="mdi:email" className="w-4 h-4 shrink-0" />
                                        <span>info@gentech.bg</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-[var(--gt-light-border)] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-[var(--gt-light-text-muted)]">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd. {t('footer.rights')}
                        </p>
                        <div className="flex items-center gap-3 text-[var(--gt-light-text-muted)] text-xs">
                            <span className="flex items-center gap-1.5">
                                <Icon icon="mdi:shield-check" className="w-3.5 h-3.5 text-[var(--gt-blue)]" />
                                TÜV Nord
                            </span>
                            <span className="text-[var(--gt-light-border)]">|</span>
                            <span>{t('footer.certificate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
