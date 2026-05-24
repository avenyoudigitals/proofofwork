'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export type VerificationRequestState = {
  error?: string
  success?: boolean
}

export async function sendVerificationRequest(
  _prev: VerificationRequestState | undefined,
  formData: FormData
): Promise<VerificationRequestState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const workId       = formData.get('workId') as string
  const companyEmail = (formData.get('companyEmail') as string)?.trim()
  const contactName  = (formData.get('contactName') as string)?.trim() || 'there'

  if (!companyEmail) return { error: 'Company contact email is required.' }
  if (!companyEmail.includes('@')) return { error: 'Please enter a valid email address.' }

  // Fetch the work (ensure it belongs to the current user)
  const { data: work, error: workError } = await supabase
    .from('works')
    .select('*')
    .eq('id', workId)
    .eq('user_id', user.id)
    .single()

  if (workError || !work) return { error: 'Work not found.' }

  // ── Generate a secure one-time token ──────────────────────────
  const token     = randomBytes(32).toString('hex')   // 256-bit, unguessable
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const service = createServiceClient()
  // Use rpc to bypass PostgREST schema cache (avoids "not found in schema cache"
  // errors immediately after table creation).
  const { error: tokenError } = await service.rpc('insert_verification_request', {
    p_work_id:       workId,
    p_token:         token,
    p_company_email: companyEmail,
    p_expires_at:    expiresAt.toISOString(),
  })

  if (tokenError) {
    console.error('Token insert error:', tokenError)
    // Fallback: try direct insert (works once schema cache refreshes)
    const { error: insertError } = await service
      .from('verification_requests')
      .insert({
        work_id:       workId,
        token,
        company_email: companyEmail,
        status:        'pending',
        expires_at:    expiresAt.toISOString(),
      })
    if (insertError) {
      console.error('Fallback insert error:', insertError)
      return { error: `DB error: ${insertError.message}` }
    }
  }

  // ── Build email ────────────────────────────────────────────────
  const senderName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'A ProofForge member'
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const approveUrl = `${appUrl}/api/verify?token=${token}&action=approve`
  const rejectUrl  = `${appUrl}/api/verify?token=${token}&action=reject`

  const links: string[] = []
  if (work.github_url)     links.push(`<a href="${work.github_url}" style="color:#60a5fa;text-decoration:none;">GitHub Repository ↗</a>`)
  if (work.figma_url)      links.push(`<a href="${work.figma_url}"  style="color:#60a5fa;text-decoration:none;">Figma File ↗</a>`)
  if (work.live_url)       links.push(`<a href="${work.live_url}"   style="color:#60a5fa;text-decoration:none;">Live / Demo ↗</a>`)
  if (work.case_study_url) links.push(`<a href="${work.case_study_url}" style="color:#60a5fa;text-decoration:none;">Case Study ↗</a>`)

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#05050f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050f;padding:48px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Logo -->
  <tr><td style="padding-bottom:36px;">
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:9px;text-align:center;line-height:34px;font-size:16px;color:#fff;font-weight:700;">✦</td>
        <td style="padding-left:10px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px;">ProofForge</td>
        <td style="padding-left:10px;">
          <span style="font-size:10px;font-weight:600;background:rgba(124,58,237,0.15);color:#a78bfa;border:1px solid rgba(124,58,237,0.3);border-radius:20px;padding:3px 8px;letter-spacing:1px;text-transform:uppercase;">Verification Request</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Main card -->
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">

    <!-- Top accent bar -->
    <tr><td style="height:3px;background:linear-gradient(90deg,#3b82f6,#7c3aed,#06b6d4);"></td></tr>

    <tr><td style="padding:40px;">

      <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#f1f5f9;line-height:1.3;">
        Hi ${contactName}, <br>
        can you verify this contribution?
      </h1>

      <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#94a3b8;">
        <strong style="color:#f1f5f9;">${senderName}</strong> has submitted proof of work on
        <strong style="color:#f1f5f9;">ProofForge</strong> and is requesting that you officially
        verify their contribution. Please review the details below and approve or decline.
      </p>

      <!-- Work card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;margin-bottom:28px;">
        <tr><td style="padding:28px;">
          ${work.company ? `<p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;">${work.company}</p>` : ''}
          <h2 style="margin:0 0 6px;font-size:19px;font-weight:700;color:#fff;">${work.title}</h2>
          <p style="margin:0 0 16px;font-size:12px;color:#64748b;">Role: <span style="color:#94a3b8;">${work.role}</span></p>
          <p style="margin:0 0 0;font-size:14px;line-height:1.7;color:#94a3b8;">${work.description}</p>
          ${work.tags?.length ? `
          <div style="margin-top:16px;">
            ${work.tags.map((t: string) => `<span style="display:inline-block;margin:2px 3px 2px 0;padding:3px 10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;color:#94a3b8;">${t}</span>`).join('')}
          </div>` : ''}
          ${links.length ? `
          <div style="margin-top:20px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#475569;">Proof Links</p>
            ${links.map(l => `<div style="margin-bottom:6px;font-size:13px;">${l}</div>`).join('')}
          </div>` : ''}
        </td></tr>
      </table>

      <!-- CTA -->
      <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#94a3b8;">
        Click <strong style="color:#10b981;">Approve</strong> to officially endorse this contribution —
        it will be marked as <em>Company Verified</em> on ${senderName}&apos;s ProofForge profile.
        Click <strong style="color:#ef4444;">Decline</strong> if you cannot verify this.
      </p>

      <!-- Action buttons -->
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="48%" align="center">
            <a href="${approveUrl}"
              style="display:block;padding:16px 24px;background:linear-gradient(135deg,#059669,#10b981);border-radius:12px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;text-align:center;letter-spacing:-0.2px;">
              ✓ Approve Verification
            </a>
          </td>
          <td width="4%"></td>
          <td width="48%" align="center">
            <a href="${rejectUrl}"
              style="display:block;padding:16px 24px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px;font-size:15px;font-weight:700;color:#f87171;text-decoration:none;text-align:center;letter-spacing:-0.2px;">
              ✕ Decline
            </a>
          </td>
        </tr>
      </table>

      <!-- Security note -->
      <p style="margin:28px 0 0;font-size:11px;line-height:1.6;color:#334155;text-align:center;">
        This link expires in <strong style="color:#475569;">7 days</strong> and can only be used once.<br>
        If you didn&apos;t expect this email, you can safely ignore it.
      </p>

    </td></tr>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:28px;text-align:center;font-size:11px;color:#1e293b;">
    Sent by ProofForge on behalf of ${senderName} (${user.email})<br>
    Reply-to is set to their email if you wish to respond directly.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  // ── Dev-mode override ─────────────────────────────────────────
  // Resend sandbox keys only deliver to the account owner's address.
  // Set RESEND_DEV_OVERRIDE_TO=aaronrthomas88@gmail.com in .env.local
  // to redirect all emails there while still seeing the full template.
  const devOverrideTo = process.env.RESEND_DEV_OVERRIDE_TO?.trim() || undefined
  const actualTo      = devOverrideTo ?? companyEmail
  const isDevOverride = !!devOverrideTo && devOverrideTo !== companyEmail

  const devBanner = isDevOverride
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr><td style="background:#7c3aed;border-radius:10px;padding:12px 20px;">
          <p style="margin:0;font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;">
            ⚙ Dev Override Active
          </p>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.8);">
            Originally addressed to: <strong>${companyEmail}</strong>
          </p>
        </td></tr>
      </table>`
    : ''

  const finalHtml = html.replace(
    '<h1 style="margin:0 0 16px',
    `${devBanner}<h1 style="margin:0 0 16px`,
  )

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL
      ? `ProofForge <${process.env.RESEND_FROM_EMAIL}>`
      : 'ProofForge <onboarding@resend.dev>',
    to:      actualTo,
    replyTo: user.email!,
    subject: isDevOverride
      ? `[DEV → ${companyEmail}] Verify ${senderName}'s contribution — ${work.title}`
      : `[Action Required] Verify ${senderName}'s contribution — ${work.title}`,
    html: finalHtml,
  })

  if (emailError) {
    // Roll back the token if the email failed
    await service.from('verification_requests').delete().eq('token', token)
    console.error('Resend error:', emailError)
    return { error: `Email error: ${emailError.message}` }
  }

  return { success: true }
}
