'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/icons'
import i18nConfig from '@/i18nConfig'
import { getAllProductLinks, getCompanyLinks, manufacturingLinks, socialLinks } from '@/config/navigation'
import { Logo } from '@/components/shared'

function FooterNewsletter() {
    const { t, i18n } = useTranslation()
    const locale = i18n.language || 'en'
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStatus('success')
                setEmail('')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <div>
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-[var(--gt-dark-text-muted)] mb-5">
                {locale === 'bg' ? 'Бюлетин' : 'Newsletter'}
            </h3>
            <p className="text-sm text-[var(--gt-dark-text-muted)] mb-4 leading-relaxed">
                {locale === 'bg'
                    ? 'Получавайте продуктови новини и индустриални прозрения.'
                    : 'Get product updates and industry insights.'}
            </p>
            {status === 'success' ? (
                <div className="flex items-center gap-2 text-[var(--gt-success)] text-sm">
                    <Icon icon="mdi:check-circle" className="w-4 h-4" />
                    {locale === 'bg' ? 'Благодарим!' : 'Thank you!'}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={locale === 'bg' ? 'Имейл адрес' : 'Email address'}
                        required
                        className="flex-1 px-3.5 py-2 rounded-lg bg-white/5 border border-[var(--gt-dark-border)] text-[var(--gt-dark-text)] text-sm placeholder:text-[var(--gt-dark-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--gt-blue)]/30 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-4 py-2 bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-light)] text-white text-sm font-normal rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {status === 'loading' ? (
                            <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                        ) : (
                            <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                        )}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p className="text-[var(--gt-danger)] text-xs mt-2">
                    {locale === 'bg' ? 'Нещо се обърка.' : 'Something went wrong.'}
                </p>
            )}
        </div>
    )
}

export function Footer() {
    const { t, i18n } = useTranslation()
    const footerRef = useRef<HTMLElement>(null)
    const currentLocale = i18n.language || i18nConfig.defaultLocale
    const isDefaultLocale = currentLocale === i18nConfig.defaultLocale

    const localizedHref = (href: string) => {
        if (isDefaultLocale) return href
        if (href === '/') return `/${currentLocale}`
        return `/${currentLocale}${href}`
    }

    // Measure footer height and set CSS custom property so main content gets correct margin-bottom
    useEffect(() => {
        const updateHeight = () => {
            if (footerRef.current) {
                const height = footerRef.current.offsetHeight
                document.documentElement.style.setProperty('--footer-height', `${height}px`)
            }
        }
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    const productLinks = getAllProductLinks()
    const companyLinks = getCompanyLinks()

    const allSocialLinks = [
        ...socialLinks,
        { icon: 'mdi:instagram', href: 'https://www.instagram.com/genesistechnology/', label: 'Instagram' },
        { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/company/genesis-technology-bg/', label: 'LinkedIn' },
    ]

    return (
        <footer ref={footerRef} className="gt-footer-reveal gt-section-dark">
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between mb-8">
                        <Link href={localizedHref('/')}>
                            <Logo className="h-[18px] w-auto" color="#ffffff" />
                        </Link>
                        <div className="flex gap-2">
                            {allSocialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-[var(--gt-dark-border)] text-[var(--gt-dark-text-muted)] hover:text-[var(--gt-blue)] hover:border-[var(--gt-blue)]/30 transition-all"
                                    aria-label={link.label}
                                >
                                    <Icon icon={link.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Mobile newsletter */}
                    <div className="mb-6">
                        <FooterNewsletter />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                        {companyLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={localizedHref(link.href)}
                                className="text-sm text-[var(--gt-dark-text-muted)] hover:text-[var(--gt-dark-text)] transition-colors"
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                        <Link
                            href={localizedHref('/contacts')}
                            className="text-sm text-[var(--gt-dark-text-muted)] hover:text-[var(--gt-dark-text)] transition-colors"
                        >
                            {t('nav.contacts')}
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[var(--gt-dark-text-muted)] mb-6">
                        <a href="tel:+359895657706" className="flex items-center gap-2 hover:text-[var(--gt-dark-text)] transition-colors">
                            <Icon icon="mdi:phone" className="w-4 h-4" />
                            +359 89 565 7706
                        </a>
                        <a href="mailto:info@gentech.bg" className="flex items-center gap-2 hover:text-[var(--gt-dark-text)] transition-colors">
                            <Icon icon="mdi:email" className="w-4 h-4" />
                            info@gentech.bg
                        </a>
                    </div>

                    <div className="pt-4 border-t border-[var(--gt-dark-border)]">
                        <div className="flex items-center justify-center gap-3 text-[var(--gt-dark-text-muted)] text-xs mb-3">
                            <span className="flex items-center gap-1.5">
                                <Icon icon="mdi:shield-check" className="w-3.5 h-3.5 text-[var(--gt-blue)]" />
                                TÜV Nord
                            </span>
                            <span className="text-[var(--gt-dark-border)]">|</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="mdi:coffee" className="w-3.5 h-3.5 text-[var(--gt-blue)]" />
                                ILLY Partner
                            </span>
                        </div>
                        <p className="text-xs text-[var(--gt-dark-text-muted)] text-center">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd.
                        </p>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-6 gap-8">
                        {/* Logo & Social */}
                        <div className="flex flex-col gap-5">
                            <Link href={localizedHref('/')}>
                                <Logo className="h-[18px] w-auto" color="#ffffff" />
                            </Link>
                            <p className="text-sm text-[var(--gt-dark-text-muted)] leading-relaxed">
                                {t('footer.tagline')}
                            </p>
                            <div className="flex gap-2">
                                {allSocialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-[var(--gt-dark-border)] text-[var(--gt-dark-text-muted)] hover:text-[var(--gt-blue)] hover:border-[var(--gt-blue)]/30 transition-all"
                                        aria-label={link.label}
                                    >
                                        <Icon icon={link.icon} className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Systems */}
                        <div>
                            <h3 className="text-[11px] font-medium uppercase tracking-widest text-[var(--gt-dark-text-muted)] mb-5">{t('nav.systems')}</h3>
                            <ul className="space-y-2.5">
                                {productLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href={localizedHref('/services/cloud-system')}
                                        className="text-sm text-[var(--gt-blue)] hover:text-[var(--gt-blue-light)] transition-colors flex items-center gap-1.5"
                                    >
                                        <Icon icon="mdi:cloud-sync" className="w-3.5 h-3.5" />
                                        {t('nav.cloudPlatform')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-[11px] font-medium uppercase tracking-widest text-[var(--gt-dark-text-muted)] mb-5">{t('nav.company')}</h3>
                            <ul className="space-y-2.5">
                                {companyLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Manufacturing */}
                        <div>
                            <h3 className="text-[11px] font-medium uppercase tracking-widest text-[var(--gt-dark-text-muted)] mb-5">{t('nav.manufacturingServices')}</h3>
                            <ul className="space-y-2.5">
                                {manufacturingLinks.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={localizedHref(link.href)}
                                            className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors"
                                        >
                                            {t(`nav.${link.key}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contacts */}
                        <div>
                            <h3 className="text-[11px] font-medium uppercase tracking-widest text-[var(--gt-dark-text-muted)] mb-5">{t('footer.contacts')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://maps.app.goo.gl/gentech-plovdiv"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors flex items-start gap-2"
                                    >
                                        <Icon icon="mdi:map-marker" className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{t('footer.addressLine1')}<br />{t('footer.addressLine2')}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+359895657706" className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors flex items-center gap-2">
                                        <Icon icon="mdi:phone" className="w-4 h-4 shrink-0" />
                                        <span>+359 89 565 7706</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@gentech.bg" className="text-sm text-[var(--gt-dark-text-secondary)] hover:text-[var(--gt-dark-text)] transition-colors flex items-center gap-2">
                                        <Icon icon="mdi:email" className="w-4 h-4 shrink-0" />
                                        <span>info@gentech.bg</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <FooterNewsletter />
                        </div>
                    </div>

                    <div className="mt-14 pt-6 border-t border-[var(--gt-dark-border)] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-[var(--gt-dark-text-muted)]">
                            &copy; {new Date().getFullYear()} Genesis Technology Ltd. {t('footer.rights')}
                        </p>
                        <div className="flex items-center gap-4 text-[var(--gt-dark-text-muted)] text-xs">
                            <span className="flex items-center gap-1.5">
                                <Icon icon="mdi:shield-check" className="w-3.5 h-3.5 text-[var(--gt-blue)]" />
                                TÜV Nord Certified
                            </span>
                            <span className="text-[var(--gt-dark-border)]">|</span>
                            <span className="flex items-center gap-1.5">
                                <Icon icon="mdi:coffee" className="w-3.5 h-3.5 text-[var(--gt-blue)]" />
                                Official ILLY Partner
                            </span>
                            <span className="text-[var(--gt-dark-border)]">|</span>
                            <span>{t('footer.certificate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
