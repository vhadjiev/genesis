import { Resource, createInstance, i18n } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import i18nConfig from '@/i18nConfig'

// Import translations directly
import enTranslations from '@/locales/en/translations.json'
import bgTranslations from '@/locales/bg/translations.json'

const translationsMap: Record<string, object> = {
    en: enTranslations,
    bg: bgTranslations,
}

export default async function initTranslations(
    locale: string,
    i18nInstance?: i18n,
    resources?: Resource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: { revalidate?: boolean } = {}
) {
    i18nInstance = i18nInstance || createInstance()
    i18nInstance.use(initReactI18next)

    // Load translations from local files
    const loadTranslations = (): Resource => {
        const translations = translationsMap[locale] || translationsMap[i18nConfig.defaultLocale]
        return {
            [locale]: {
                translation: translations,
            },
        }
    }

    // Initial resources loading
    if (!resources) {
        resources = loadTranslations()
    }

    await i18nInstance.init({
        lng: locale,
        resources,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        preload: resources ? [] : i18nConfig.locales,
        showSupportNotice: false,
    })

    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t,
    }
}
