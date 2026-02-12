import { NextRequest } from 'next/server'
import { i18nRouter } from 'next-i18n-router'
import i18nConfig from './i18nConfig'

export function proxy(request: NextRequest) {
    return i18nRouter(request, i18nConfig)
}

// Applies this middleware only to files in the app directory
// Excludes: api routes, static files, Next.js internals, images
export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)',
}
