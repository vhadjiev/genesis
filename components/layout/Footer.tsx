'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import i18nConfig from '@/i18nConfig'

const equipmentLinks = [
    { key: 'genesisAlpha', href: '/equipment/genesis-alpha' },
    { key: 'genesisPrime', href: '/equipment/genesis-prime' },
    { key: 'genesisUniversa', href: '/equipment/genesis-universa' },
    { key: 'genesisEclipse', href: '/equipment/genesis-eclipse' },
    { key: 'genesisSolaris2', href: '/equipment/genesis-solaris-2' },
]

const companyLinks = [
    { key: 'about', href: '/about' },
    { key: 'projects', href: '/projects' },
    { key: 'news', href: '/news' },
    { key: 'exhibitions', href: '/exhibitions' },
    { key: 'contacts', href: '/contacts' },
]

const socialLinks = [
    { icon: 'mdi:facebook', href: 'https://www.facebook.com/gentechtechnology/', label: 'Facebook' },
    { icon: 'mdi:email', href: 'mailto:info@gentech.bg', label: 'Email' },
]

export function Footer() {
    const { t, i18n } = useTranslation()
    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    const localizedHref = (href: string) => {
        if (isDefaultLocale) return href
        if (href === '/') return `/${currentLocale}`
        return `/${currentLocale}${href}`
    }

    return (
        <footer className="bg-(--gt-darker) border-t border-white/6">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                {/* Mobile Layout */}
                <div className="md:hidden">
                    {/* Logo + Social Row */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href={localizedHref('/')}>
                            <Image
                                src="/images/gentech-logo.svg"
                                alt={t('site.name')}
                                width={120}
                                height={35}
                                className="w-28 h-auto object-contain"
                            />
                        </Link>
                        <div className="flex gap-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-(--gt-blue)/20 hover:text-(--gt-accent) transition-colors text-white/60"
                                    aria-label={link.label}
                                >
                                    <Icon icon={link.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                        {companyLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={localizedHref(link.href)}
                                className="text-sm text-white/60 hover:text-(--gt-accent) transition-colors"
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-2 text-sm text-white/60 mb-6">
                        <a
                            href="tel:+35989565770‭6"
                            className="flex items-center gap-2 hover:text-(--gt-accent) transition-colors"
                        >
                            <Icon icon="mdi:phone" className="w-4 h-4 text-(--gt-accent)" />
                            +359 89 565 7706
                        </a>
                        <a
                            href="mailto:info@gentech.bg"
                            className="flex items-center gap-2 hover:text-(--gt-accent) transition-colors"
                        >
                            <Icon icon="mdi:email" className="w-4 h-4 text-(--gt-accent)" />
                            info@gentech.bg
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="pt-4 border-t border-white/8">
                        <p className="text-xs text-white/30 text-center">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd.
                        </p>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-4 gap-12">
                        {/* Logo & Social */}
                        <div className="flex flex-col gap-6">
                            <Link href={localizedHref('/')} className="inline-block">
                                <Image
                                    src="/images/gentech-logo.svg"
                                    alt={t('site.name')}
                                    width={160}
                                    height={46}
                                    className="w-36 h-auto object-contain"
                                />
                            </Link>
                            <p className="text-sm text-white/40 leading-relaxed">
                                {t('footer.tagline')}
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-(--gt-blue)/20 hover:text-(--gt-accent) transition-colors text-white/60"
                                        aria-label={link.label}
                                    >
                                        <Icon icon={link.icon} className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Equipment */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">{t('nav.equipment')}</h3>
                            <ul className="space-y-2">
                                {equipmentLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-white/50 hover:text-(--gt-accent) transition-colors flex items-center gap-2"
                                        >
                                            <Icon icon="mdi:chevron-right" className="w-4 h-4" />
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.company')}</h3>
                            <ul className="space-y-2">
                                {companyLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-white/50 hover:text-(--gt-accent) transition-colors flex items-center gap-2"
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
                                        href="https://maps.app.goo.gl/gentech-plovdiv"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/50 hover:text-(--gt-accent) transition-colors flex items-start gap-2"
                                    >
                                        <Icon icon="mdi:map-marker" className="w-5 h-5 shrink-0 mt-0.5 text-(--gt-accent)" />
                                        <span>
                                            {t('footer.addressLine1')}
                                            <br />
                                            {t('footer.addressLine2')}
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="tel:+35989565770‭6"
                                        className="text-sm text-white/50 hover:text-(--gt-accent) transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="mdi:phone" className="w-5 h-5 shrink-0 text-(--gt-accent)" />
                                        <span>+359 89 565 7706</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@gentech.bg"
                                        className="text-sm text-white/50 hover:text-(--gt-accent) transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="mdi:email" className="w-5 h-5 shrink-0 text-(--gt-accent)" />
                                        <span>info@gentech.bg</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-white/30">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd. {t('footer.rights')}
                        </p>
                        <div className="flex items-center gap-2 text-white/30 text-sm">
                            <span>TUV Nord</span>
                            <span className="text-white/15">|</span>
                            <span>{t('footer.certificate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
