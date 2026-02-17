import { NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'

interface ContactFormData {
    name: string
    email: string
    phone: string
    projectTypes?: string[]
    services?: string[]
    equipmentCategories?: string[]
    message: string
    formType: 'full' | 'equipment'
}

export async function POST(request: NextRequest) {
    try {

        // Check if the request is from a bot
        const verification = await checkBotId()

        if (verification.isBot) {
            console.log('[Contact API] Request blocked - bot detected')
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const data: ContactFormData = await request.json()

        // Validate required fields
        if (!data.name || !data.email || !data.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Get Mailgun credentials from environment
        const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
        const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
        const MAILGUN_REGION = process.env.MAILGUN_REGION || 'eu' // 'us' or 'eu'
        const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@gentech.bg'

        if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
            console.error('[Contact API] Mailgun credentials not configured')
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
        }

        // Build email content
        const subject =
            data.formType === 'equipment'
                ? `Equipment Rental Inquiry from ${data.name}`
                : `Contact Form Submission from ${data.name}`

        const htmlContent = buildEmailHtml(data)
        const textContent = buildEmailText(data)

        // Send email via Mailgun API (EU or US region)
        const mailgunBaseUrl = MAILGUN_REGION === 'eu' ? 'https://api.eu.mailgun.net/v3' : 'https://api.mailgun.net/v3'
        const mailgunUrl = `${mailgunBaseUrl}/${MAILGUN_DOMAIN}/messages`

        const formData = new FormData()
        formData.append('from', `Genesis Technology <noreply@${MAILGUN_DOMAIN}>`)
        formData.append('to', CONTACT_EMAIL) // Send to the person who filled out the form
        formData.append('reply-to', CONTACT_EMAIL) // Replies go to the studio
        formData.append('subject', subject)
        formData.append('text', textContent)
        formData.append('html', htmlContent)

        const response = await fetch(mailgunUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Contact API] Mailgun API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
            })
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
        }

        const responseData = await response.json()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

function buildEmailHtml(data: ContactFormData): string {
    const sections: string[] = []

    sections.push(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0a0f1a 0%, #0d1b2a 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
                <h1 style="color: #0071e3; margin: 0; font-size: 24px;">
                    ${data.formType === 'equipment' ? 'Equipment Inquiry' : 'New Contact Form Submission'}
                </h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; border-left: 4px solid #0071e3;">
                <h2 style="color: #333; margin-top: 0; font-size: 18px;">Contact Details</h2>
                <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #0071e3;">${escapeHtml(data.email)}</a></p>
                <p style="margin: 8px 0; color: #555;"><strong>Phone:</strong> <a href="tel:${escapeHtml(data.phone)}" style="color: #0071e3;">${escapeHtml(data.phone)}</a></p>
            </div>
    `)

    if (data.formType === 'equipment' && data.equipmentCategories?.length) {
        sections.push(`
            <div style="background: #fff; padding: 25px; border-radius: 12px; margin-top: 15px; border: 1px solid #e9ecef;">
                <h2 style="color: #333; margin-top: 0; font-size: 18px;">Equipment Categories</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${data.equipmentCategories.map((cat) => `<span style="background: #0071e320; color: #0071e3; padding: 6px 12px; border-radius: 20px; font-size: 14px;">${escapeHtml(cat)}</span>`).join('')}
                </div>
            </div>
        `)
    }

    if (data.formType === 'full') {
        if (data.projectTypes?.length) {
            sections.push(`
                <div style="background: #fff; padding: 25px; border-radius: 12px; margin-top: 15px; border: 1px solid #e9ecef;">
                    <h2 style="color: #333; margin-top: 0; font-size: 18px;">Project Types</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${data.projectTypes.map((type) => `<span style="background: #0071e320; color: #0071e3; padding: 6px 12px; border-radius: 20px; font-size: 14px;">${escapeHtml(type)}</span>`).join('')}
                    </div>
                </div>
            `)
        }

        if (data.services?.length) {
            sections.push(`
                <div style="background: #fff; padding: 25px; border-radius: 12px; margin-top: 15px; border: 1px solid #e9ecef;">
                    <h2 style="color: #333; margin-top: 0; font-size: 18px;">Requested Services</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${data.services.map((service) => `<span style="background: #0071e320; color: #0071e3; padding: 6px 12px; border-radius: 20px; font-size: 14px;">${escapeHtml(service)}</span>`).join('')}
                    </div>
                </div>
            `)
        }
    }

    if (data.message) {
        sections.push(`
            <div style="background: #fff; padding: 25px; border-radius: 12px; margin-top: 15px; border: 1px solid #e9ecef;">
                <h2 style="color: #333; margin-top: 0; font-size: 18px;">Message</h2>
                <p style="color: #555; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.message)}</p>
            </div>
        `)
    }

    sections.push(`
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #888; font-size: 12px;">
                <p>This email was sent from the Genesis Technology website contact form.</p>
            </div>
        </div>
    `)

    return sections.join('')
}

function buildEmailText(data: ContactFormData): string {
    const lines: string[] = []

    lines.push(data.formType === 'equipment' ? 'EQUIPMENT RENTAL INQUIRY' : 'NEW CONTACT FORM SUBMISSION')
    lines.push('='.repeat(40))
    lines.push('')
    lines.push('CONTACT DETAILS')
    lines.push(`Name: ${data.name}`)
    lines.push(`Email: ${data.email}`)
    lines.push(`Phone: ${data.phone}`)
    lines.push('')

    if (data.formType === 'equipment' && data.equipmentCategories?.length) {
        lines.push('EQUIPMENT CATEGORIES')
        lines.push(data.equipmentCategories.join(', '))
        lines.push('')
    }

    if (data.formType === 'full') {
        if (data.projectTypes?.length) {
            lines.push('PROJECT TYPES')
            lines.push(data.projectTypes.join(', '))
            lines.push('')
        }

        if (data.services?.length) {
            lines.push('REQUESTED SERVICES')
            lines.push(data.services.join(', '))
            lines.push('')
        }
    }

    if (data.message) {
        lines.push('MESSAGE')
        lines.push('-'.repeat(40))
        lines.push(data.message)
        lines.push('')
    }

    lines.push('='.repeat(40))
    lines.push('This email was sent from the Genesis Technology website contact form.')

    return lines.join('\n')
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
