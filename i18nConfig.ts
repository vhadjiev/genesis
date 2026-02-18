import { Config } from 'next-i18n-router/dist/types'

const i18nConfig: Config = {
    locales: ['bg', 'en'],
    defaultLocale: 'bg',
    // Don't add prefix for default locale (Bulgarian)
    prefixDefault: false,
    // Disable automatic locale detection from browser headers
    localeDetector: false,
    // Disable cookie-based locale persistence (use URL as source of truth)
    localeCookie: '_LOCALE',
    // serverSetCookie: 'never',
}

export default i18nConfig
