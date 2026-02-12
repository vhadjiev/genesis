import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const nextConfig: NextConfig = {
    experimental: {
        viewTransition: true,
    },
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
}

export default withBotId(nextConfig)
