import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }

        // Resend integration
        // When RESEND_API_KEY is configured, subscribers are added to the audience
        const RESEND_API_KEY = process.env.RESEND_API_KEY
        const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

        if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
            const response = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    unsubscribed: false,
                }),
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('[Newsletter API] Resend error:', errorData)
                return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
            }
        } else {
            // Fallback: log the subscription (configure Resend for production)
            console.log('[Newsletter API] New subscriber (no Resend configured):', email)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Newsletter API] Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
