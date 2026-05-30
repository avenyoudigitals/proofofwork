import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Free / generic email providers that carry no company signal. */
const FREE_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.uk',
  'hotmail.com', 'hotmail.in', 'outlook.com', 'outlook.in',
  'live.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me', 'aol.com', 'zoho.com',
  'rediffmail.com', 'yandex.com', 'yandex.ru',
])

/**
 * Derives a display company name from a corporate email address.
 * Returns null for free/generic providers (gmail, yahoo, etc.)
 * e.g. "hr@carestack.com"  → "Carestack"
 *      "jobs@stripe.co.uk" → "Stripe"
 *      "me@gmail.com"      → null
 */
function companyNameFromEmail(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  if (FREE_DOMAINS.has(domain)) return null
  const label = domain.split('.')[0] ?? ''
  if (!label) return null
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
}

/* ── Return-mail builders ──────────────────────────────────────── */

function buildApprovedEmail({
  ownerName,
  workTitle,
  workCompany,
  verifierEmail,
  dashboardUrl,
}: {
  ownerName: string
  workTitle: string
  workCompany: string | null
  verifierEmail: string
  dashboardUrl: string
}): string {
  const verifierLabel = workCompany ?? companyNameFromEmail(verifierEmail) ?? verifierEmail

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#05050f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050f;padding:48px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Logo -->
  <tr><td style="padding-bottom:36px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:9px;text-align:center;line-height:34px;font-size:16px;color:#fff;font-weight:700;">✦</td>
      <td style="padding-left:10px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px;">ProofForge</td>
      <td style="padding-left:10px;">
        <span style="font-size:10px;font-weight:600;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:3px 8px;letter-spacing:1px;text-transform:uppercase;">✓ Verified</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#059669,#10b981,#34d399);"></td></tr>
    <tr><td style="padding:40px;">

      <!-- Icon -->
      <div style="width:56px;height:56px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:24px;">✓</div>

      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f5f9;line-height:1.3;">
        Your contribution has been verified! 🎉
      </h1>

      <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#94a3b8;">
        Hi <strong style="color:#f1f5f9;">${ownerName}</strong>, great news —
        <strong style="color:#10b981;">${verifierLabel}</strong> has officially verified your contribution
        to <strong style="color:#f1f5f9;">${workTitle}</strong>.
        Your ProofForge profile has been updated to show <em style="color:#10b981;">Company Verified</em> status.
      </p>

      <!-- Work badge -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:14px;margin-bottom:28px;">
        <tr><td style="padding:24px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#10b981;">Company Verified</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#fff;">${workTitle}</p>
          ${workCompany ? `<p style="margin:4px 0 0;font-size:12px;color:#64748b;">at ${workCompany}</p>` : ''}
          <p style="margin:12px 0 0;font-size:12px;color:#475569;">Verified by: <span style="color:#94a3b8;">${verifierEmail}</span></p>
        </td></tr>
      </table>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
        <a href="${dashboardUrl}"
          style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#059669,#10b981);border-radius:12px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:-0.2px;">
          View your profile →
        </a>
      </td></tr></table>

      <p style="margin:28px 0 0;font-size:11px;line-height:1.6;color:#334155;text-align:center;">
        ProofForge · Verified Proof-of-Work Network
      </p>
    </td></tr>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function buildRejectedEmail({
  ownerName,
  workTitle,
  verifierEmail,
  dashboardUrl,
}: {
  ownerName: string
  workTitle: string
  verifierEmail: string
  dashboardUrl: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#05050f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050f;padding:48px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

  <!-- Logo -->
  <tr><td style="padding-bottom:36px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:9px;text-align:center;line-height:34px;font-size:16px;color:#fff;font-weight:700;">✦</td>
      <td style="padding-left:10px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px;">ProofForge</td>
      <td style="padding-left:10px;">
        <span style="font-size:10px;font-weight:600;background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.25);border-radius:20px;padding:3px 8px;letter-spacing:1px;text-transform:uppercase;">Declined</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#dc2626,#ef4444,#f87171);"></td></tr>
    <tr><td style="padding:40px;">

      <!-- Icon -->
      <div style="width:56px;height:56px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:24px;">✕</div>

      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f5f9;line-height:1.3;">
        Verification was declined
      </h1>

      <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#94a3b8;">
        Hi <strong style="color:#f1f5f9;">${ownerName}</strong>, unfortunately
        <strong style="color:#f87171;">${verifierEmail}</strong> was unable to verify your contribution
        to <strong style="color:#f1f5f9;">${workTitle}</strong>.
        Your work remains as-is on your profile — you can try requesting verification from a different contact.
      </p>

      <!-- Info box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;margin-bottom:28px;">
        <tr><td style="padding:20px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#94a3b8;">What you can do next:</p>
          <p style="margin:0 0 4px;font-size:12px;color:#64748b;">• Try a different contact at the same company</p>
          <p style="margin:0 0 4px;font-size:12px;color:#64748b;">• Ask a direct manager or team lead</p>
          <p style="margin:0;font-size:12px;color:#64748b;">• Request peer verification from colleagues who worked with you</p>
        </td></tr>
      </table>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
        <a href="${dashboardUrl}/works"
          style="display:inline-block;padding:16px 32px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:12px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:-0.2px;">
          Go to My Works →
        </a>
      </td></tr></table>

      <p style="margin:28px 0 0;font-size:11px;line-height:1.6;color:#334155;text-align:center;">
        ProofForge · Verified Proof-of-Work Network
      </p>
    </td></tr>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

/* ── Route handler ─────────────────────────────────────────────── */

/**
 * GET /api/verify?token=xxx&action=approve|reject
 *
 * Public endpoint — no auth required (company contacts don't have accounts).
 * Validates the one-time token, updates the work status, sends a return
 * notification email to the work owner, then redirects to a confirmation page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token  = searchParams.get('token')
  const action = searchParams.get('action')
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  function redirectTo(status: string, extra?: Record<string, string>) {
    const params = new URLSearchParams({ status, ...extra })
    return NextResponse.redirect(`${appUrl}/verify?${params.toString()}`)
  }

  if (!token || (action !== 'approve' && action !== 'reject')) {
    return redirectTo('invalid')
  }

  const service = createServiceClient()

  // Look up the token (join works so we have work details + user_id)
  const { data: req, error: fetchError } = await service
    .from('verification_requests')
    .select('*, works(*)')
    .eq('token', token)
    .single()

  if (fetchError || !req) return redirectTo('invalid')

  // Already used?
  if (req.status !== 'pending') {
    return redirectTo(req.status === 'approved' ? 'already_approved' : 'already_rejected')
  }

  // Expired?
  if (new Date(req.expires_at) < new Date()) {
    return redirectTo('expired')
  }

  // Mark the token as used
  await service
    .from('verification_requests')
    .update({ status: action === 'approve' ? 'approved' : 'rejected' })
    .eq('token', token)

  const work = req.works as Record<string, unknown> | null
  const userId = work?.user_id as string | undefined

  // Fetch the work owner's email + name from auth.users (service role only)
  let ownerEmail: string | null = null
  let ownerName = 'there'
  if (userId) {
    const { data: authUser } = await service.auth.admin.getUserById(userId)
    ownerEmail = authUser?.user?.email ?? null
    ownerName  = authUser?.user?.user_metadata?.full_name
      ?? ownerEmail?.split('@')[0]
      ?? 'there'
  }

  // ── Approve ──────────────────────────────────────────────────────
  if (action === 'approve') {
    // Keep the company name the user entered — only fall back to email domain if none exists
    const existingCompany = (work?.company as string | null) ?? null
    const fallbackCompany = companyNameFromEmail(req.company_email)

    const workUpdate: Record<string, string> = { status: 'company_verified' }
    if (!existingCompany && fallbackCompany) workUpdate.company = fallbackCompany

    await service.from('works').update(workUpdate).eq('id', req.work_id)

    const displayCompany = existingCompany || fallbackCompany

    // Send return email to the work owner
    if (ownerEmail) {
      const html = buildApprovedEmail({
        ownerName,
        workTitle:   (work?.title as string) ?? 'your contribution',
        workCompany: displayCompany,
        verifierEmail: req.company_email,
        dashboardUrl: `${appUrl}/dashboard`,
      })

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL
          ? `ProofForge <${process.env.RESEND_FROM_EMAIL}>`
          : 'ProofForge <onboarding@resend.dev>',
        to:      process.env.RESEND_DEV_OVERRIDE_TO ?? ownerEmail,
        subject: `✓ ${displayCompany ?? req.company_email} verified your contribution — ${work?.title ?? ''}`,
        html,
      })
    }

    const extra: Record<string, string> = { company_email: req.company_email }
    if (displayCompany) extra.company = displayCompany
    return redirectTo('approved', extra)
  }

  // ── Reject ───────────────────────────────────────────────────────
  // Send return email to the work owner
  if (ownerEmail) {
    const html = buildRejectedEmail({
      ownerName,
      workTitle:     (work?.title as string) ?? 'your contribution',
      verifierEmail: req.company_email,
      dashboardUrl:  `${appUrl}/dashboard`,
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL
        ? `ProofForge <${process.env.RESEND_FROM_EMAIL}>`
        : 'ProofForge <onboarding@resend.dev>',
      to:      process.env.RESEND_DEV_OVERRIDE_TO ?? ownerEmail,
      subject: `Verification declined for "${work?.title ?? 'your contribution'}"`,
      html,
    })
  }

  return redirectTo('rejected')
}
