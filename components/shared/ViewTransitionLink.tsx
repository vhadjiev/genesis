'use client'

import React, { useCallback } from 'react'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'

interface ViewTransitionLinkProps extends Omit<LinkProps, 'onClick'> {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    /** Optional view-transition-name for shared element transitions */
    viewTransitionName?: string
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Progressive enhancement wrapper around Next.js Link
 * Uses the View Transitions API for smooth page transitions when supported
 */
export function ViewTransitionLink({
    children,
    viewTransitionName,
    onClick,
    style,
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter()

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            // Call user onClick if provided
            onClick?.(e)
            if (e.defaultPrevented) return

            // Only intercept left-click without modifier keys
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

            // Check for View Transitions API support and reduced motion preference
            const supportsVT =
                typeof document !== 'undefined' &&
                'startViewTransition' in document
            const prefersReducedMotion =
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches

            if (!supportsVT || prefersReducedMotion) return

            e.preventDefault()
            const href = typeof props.href === 'string' ? props.href : props.href.pathname || '/'

            document.startViewTransition(() => {
                router.push(href)
            })
        },
        [onClick, props.href, router]
    )

    const mergedStyle = viewTransitionName
        ? { ...style, viewTransitionName }
        : style

    return (
        <Link {...props} onClick={handleClick} style={mergedStyle}>
            {children}
        </Link>
    )
}
