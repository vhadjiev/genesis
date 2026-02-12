import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.aquasync.app',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
            },

            // Add CDN URL from environment variable
            ...(process.env.NEXT_PUBLIC_CDN_URL
                ? [
                      {
                          protocol: 'https' as const,
                          hostname: new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname,
                      },
                  ]
                : []),
        ],
    },

    // Explicitly set the workspace root to silence turbopack warning
    turbopack: {
        root: __dirname,
    },

    async redirects() {
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL as string
        const APP_URL = process.env.NEXT_PUBLIC_APP_URL as string

        return [
            {
                source: '/logout/:token',
                destination: `${AUTH_URL}/oidc/logout?id_token_hint=:token&post_logout_redirect_uri=${encodeURIComponent(
                    APP_URL
                )}`,
                permanent: true,
            },
        ]
    },
}

export default withBotId(nextConfig)
