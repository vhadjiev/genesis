'use client'

import React from 'react'
import { Resource } from 'i18next'
import { TranslationsProvider } from '@/providers/TranslationsProvider'

export function Providers({
    locale,
    resources,
    children,
}: {
    locale: string
    resources: Resource
    children: React.ReactNode
}) {
    return (
        <TranslationsProvider
            locale={locale}
            resources={resources}
        >
            {children}
        </TranslationsProvider>
    )
}
