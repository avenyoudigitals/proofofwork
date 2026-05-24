import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/email/send
 * Sends a transactional email via Resend.
 * Protected — requires authentication.
 *
 * Body:
 * {
 *   to: string | string[]
 *   subject: string
 *   html?: string
 *   text?: string
 *   type?: 'welcome' | 'notification' | 'custom'  (defaults to 'custom')
 * }
 */
export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    to: string | string[]
    subject: string
    html?: string
    text?: string
    type?: 'welcome' | 'notification' | 'custom'
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { to, subject, html, text, type = 'custom' } = body

  if (!to || !subject) {
    return NextResponse.json(
      { error: 'Missing required fields: to, subject' },
      { status: 422 }
    )
  }

  // Build HTML based on type if no custom html provided
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'noreply@resend.dev'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'

  let emailHtml = html

  if (!emailHtml) {
    if (type === 'welcome') {
      emailHtml = buildWelcomeHtml(userName, appUrl)
    } else {
      emailHtml = buildGenericHtml(subject, text ?? subject)
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ id: data?.id, success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── Email templates ──────────────────────────────────────────────

function buildWelcomeHtml(name: string, appUrl: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden">
        <tr>
          <td style="padding:40px 40px 32px;border-bottom:1px solid #27272a">
            <div style="display:inline-flex;width:40px;height:40px;background:#27272a;border-radius:10px;align-items:center;justify-content:center">
              <span style="color:#fff;font-size:20px">⚡</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px">
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#fff">Welcome, ${name}! 👋</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#a1a1aa">
              Your account is ready. Connect your GitHub and Figma to get started.
            </p>
            <a href="${appUrl}/dashboard" style="display:inline-block;padding:12px 24px;background:#fff;color:#09090b;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none">
              Go to Dashboard →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #27272a">
            <p style="margin:0;font-size:12px;color:#52525b">
              You're receiving this because you signed up for Proof. 
              <a href="${appUrl}" style="color:#71717a;text-decoration:underline">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildGenericHtml(subject: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden">
        <tr>
          <td style="padding:32px 40px">
            <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#fff">${subject}</h1>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#a1a1aa">${body}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
