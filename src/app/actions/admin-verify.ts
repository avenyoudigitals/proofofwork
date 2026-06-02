'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { getAdminSessionCookie, verifySession, type PortalSlug, getPortalConfig } from '@/lib/admin-auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/* ── Auth guard ───────────────────────────────────────────────── */

async function guardAdminAction(slug: PortalSlug): Promise<true | { error: string }> {
  const token = await getAdminSessionCookie(slug)
  if (!token || !verifySession(slug, token)) {
    return { error: 'Not authenticated. Please log in.' }
  }
  return true
}

/* ── Email: approved notification ────────────────────────────── */

function buildAdminApprovedEmail({
  ownerName,
  workTitle,
  companyName,
  dashboardUrl,
}: {
  ownerName: string
  workTitle: string
  companyName: string
  dashboardUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#05050f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050f;padding:48px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="padding-bottom:36px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:9px;text-align:center;line-height:34px;font-size:16px;color:#fff;font-weight:700;">✦</td>
      <td style="padding-left:10px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px;">ProofForge</td>
      <td style="padding-left:10px;"><span style="font-size:10px;font-weight:600;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:3px 8px;letter-spacing:1px;text-transform:uppercase;">✓ Verified</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#059669,#10b981,#34d399);"></td></tr>
    <tr><td style="padding:40px;">
      <div style="width:56px;height:56px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:24px;">✓</div>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f5f9;line-height:1.3;">Your contribution has been verified! 🎉</h1>
      <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#94a3b8;">
        Hi <strong style="color:#f1f5f9;">${ownerName}</strong>, great news —
        <strong style="color:#10b981;">${companyName}</strong> has officially verified your contribution
        to <strong style="color:#f1f5f9;">${workTitle}</strong>.
        Your ProofForge profile now shows <em style="color:#10b981;">Company Verified</em> status.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:14px;margin-bottom:28px;">
        <tr><td style="padding:24px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#10b981;">Company Verified</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#fff;">${workTitle}</p>
          <p style="margin:12px 0 0;font-size:12px;color:#475569;">Verified by: <span style="color:#94a3b8;">${companyName}</span></p>
        </td></tr>
      </table>
      <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
        <a href="${dashboardUrl}" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#059669,#10b981);border-radius:12px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">View your profile →</a>
      </td></tr></table>
      <p style="margin:28px 0 0;font-size:11px;line-height:1.6;color:#334155;text-align:center;">ProofForge · Verified Proof-of-Work Network</p>
    </td></tr>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

/* ── Email: rejected notification ─────────────────────────────── */

function buildAdminRejectedEmail({
  ownerName,
  workTitle,
  companyName,
  adminNote,
  dashboardUrl,
}: {
  ownerName: string
  workTitle: string
  companyName: string
  adminNote?: string
  dashboardUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#05050f;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05050f;padding:48px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
  <tr><td style="padding-bottom:36px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;background:linear-gradient(135deg,#3b82f6,#7c3aed);border-radius:9px;text-align:center;line-height:34px;font-size:16px;color:#fff;font-weight:700;">✦</td>
      <td style="padding-left:10px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.3px;">ProofForge</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#dc2626,#ef4444,#f87171);"></td></tr>
    <tr><td style="padding:40px;">
      <div style="width:56px;height:56px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:24px;">✕</div>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f5f9;line-height:1.3;">Verification was declined</h1>
      <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#94a3b8;">
        Hi <strong style="color:#f1f5f9;">${ownerName}</strong>, unfortunately
        <strong style="color:#f87171;">${companyName}</strong> was unable to verify your contribution
        to <strong style="color:#f1f5f9;">${workTitle}</strong>.
        ${adminNote ? `<br><br>Note from ${companyName}: <em style="color:#94a3b8;">${adminNote}</em>` : ''}
      </p>
      <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
        <a href="${dashboardUrl}/works" style="display:inline-block;padding:16px 32px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:12px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">Go to My Works →</a>
      </td></tr></table>
      <p style="margin:28px 0 0;font-size:11px;line-height:1.6;color:#334155;text-align:center;">ProofForge · Verified Proof-of-Work Network</p>
    </td></tr>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

/* ── Helper: notify the work owner ───────────────────────────── */

async function notifyOwner(
  userId: string,
  html: string,
  subject: string
): Promise<void> {
  const service = createServiceClient()
  const { data: authUser } = await service.auth.admin.getUserById(userId)
  const ownerEmail = authUser?.user?.email
  if (!ownerEmail) return

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL
      ? `ProofForge <${process.env.RESEND_FROM_EMAIL}>`
      : 'ProofForge <onboarding@resend.dev>',
    to:      process.env.RESEND_DEV_OVERRIDE_TO ?? ownerEmail,
    subject,
    html,
  })
}

/* ── Approve: directly on works table ────────────────────────── */

export async function adminApproveWork(
  slug: PortalSlug,
  workId: string
): Promise<{ error?: string; success?: boolean }> {
  const guard = await guardAdminAction(slug)
  if (guard !== true) return guard

  const cfg     = getPortalConfig(slug)!
  const service = createServiceClient()
  const appUrl  = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  // Fetch the work directly
  const { data: work, error: fetchErr } = await service
    .from('works')
    .select('*')
    .eq('id', workId)
    .single()

  if (fetchErr || !work) return { error: 'Work not found.' }

  // Already verified by another company — block it
  if (work.status === 'company_verified') {
    const verifier = work.verified_by_company ?? 'another company'
    if (verifier === cfg.displayName) {
      return { error: 'You have already verified this work.' }
    }
    return { error: `This work was already verified by ${verifier}. Only one company can verify a task.` }
  }

  // Mark as verified by this company portal
  const { error: updateErr } = await service
    .from('works')
    .update({
      status: 'company_verified',
      verified_by_company: cfg.displayName,
    })
    .eq('id', workId)

  if (updateErr) return { error: `Failed to update work: ${updateErr.message}` }

  // Notify the student
  const { data: authUser } = await service.auth.admin.getUserById(work.user_id)
  const ownerEmail = authUser?.user?.email
  const ownerName  = authUser?.user?.user_metadata?.full_name
    ?? ownerEmail?.split('@')[0]
    ?? 'there'

  if (ownerEmail) {
    await notifyOwner(
      work.user_id,
      buildAdminApprovedEmail({
        ownerName,
        workTitle:   work.title,
        companyName: cfg.displayName,
        dashboardUrl: `${appUrl}/dashboard`,
      }),
      `✓ ${cfg.displayName} verified your work — ${work.title}`
    )
  }

  revalidatePath(`/admin/${slug}`)
  revalidatePath('/dashboard/works')
  revalidatePath('/dashboard')
  return { success: true }
}

/* ── Reject: record in a per-portal rejection log ────────────── */
// Rejection does NOT set status = 'company_verified'.
// It only records that THIS portal has reviewed and declined the work,
// so the other portal can still approve it.

export async function adminRejectWork(
  slug: PortalSlug,
  workId: string,
  adminNote?: string
): Promise<{ error?: string; success?: boolean }> {
  const guard = await guardAdminAction(slug)
  if (guard !== true) return guard

  const cfg     = getPortalConfig(slug)!
  const service = createServiceClient()
  const appUrl  = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  const { data: work, error: fetchErr } = await service
    .from('works')
    .select('*')
    .eq('id', workId)
    .single()

  if (fetchErr || !work) return { error: 'Work not found.' }

  if (work.status === 'company_verified') {
    return { error: 'This work has already been verified by a company and cannot be rejected.' }
  }

  // Record the rejection in admin_rejections table (upsert, per portal per work)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (service as any)
    .from('admin_rejections')
    .upsert({
      work_id:      workId,
      portal_slug:  slug,
      admin_note:   adminNote ?? null,
      rejected_at:  new Date().toISOString(),
    }, { onConflict: 'work_id,portal_slug' })

  // Notify the student
  const { data: authUser } = await service.auth.admin.getUserById(work.user_id)
  const ownerEmail = authUser?.user?.email
  const ownerName  = authUser?.user?.user_metadata?.full_name
    ?? ownerEmail?.split('@')[0]
    ?? 'there'

  if (ownerEmail) {
    await notifyOwner(
      work.user_id,
      buildAdminRejectedEmail({
        ownerName,
        workTitle:   work.title,
        companyName: cfg.displayName,
        adminNote,
        dashboardUrl: `${appUrl}/dashboard`,
      }),
      `Verification declined for "${work.title}" — ${cfg.displayName}`
    )
  }

  revalidatePath(`/admin/${slug}`)
  return { success: true }
}
