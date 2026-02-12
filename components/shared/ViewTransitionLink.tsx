'use client'

import React, { startTransition, useCallback } from 'react'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'

interface ViewTransitionLinkProps extends Omit<LinkProps, 'onClick'> {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Link that triggers navigation inside React's startTransition,
 * which activates any <ViewTransition> boundaries in the tree.
 *
 * React handles document.startViewTransition() automatically —
 * we must never call it ourselves.
 */
export function ViewTransitionLink({
    children,
    onClick,
    style,
    ...props
}: ViewTransitionLinkProps) {
    const router = useRouter()

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            onClick?.(e)
            if (e.defaultPrevented) return

            // Only intercept regular left-click (no modifier keys)
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

            e.preventDefault()
            const href =
                typeof props.href === 'string' ? props.href : props.href.pathname || '/'

            // Signal to destination components that this is a VT navigation.
            // Components with shared <ViewTransition> elements check this to
            // skip framer-motion initial states (which would make snapshots invisible).
            if (typeof window !== 'undefined') {
                ;(window as any).__vtNavigating = true
            }

            // Wrap navigation in startTransition so React activates
            // any <ViewTransition> boundaries during the update.
            startTransition(() => {
                router.push(href)
            })
        },
        [onClick, props.href, router]
    )

    return (
        <Link {...props} onClick={handleClick} style={style}>
            {children}
        </Link>
    )
}
