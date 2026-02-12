'use client'

import { I18nextProvider } from 'react-i18next'
import { ReactNode } from 'react'
import initTranslations from '@/app/i18n'
import { Resource, createInstance } from 'i18next'

export function TranslationsProvider({
    children,
    locale,
    resources,
}: {
    children: ReactNode
    locale: string
    resources: Resource
}) {
    const i18n = createInstance()

    initTranslations(locale, i18n, resources)

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
