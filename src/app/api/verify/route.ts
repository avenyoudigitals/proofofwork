import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

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
  // Take the first label of the domain (before the first dot)
  const label = domain.split('.')[0] ?? ''
  if (!label) return null
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
}

/**
 * GET /api/verify?token=xxx&action=approve|reject
 *
 * Public endpoint — no auth required (company contacts don't have accounts).
 * Validates the one-time token, updates the work status, then redirects
 * to a confirmation page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token  = searchParams.get('token')
  const action = searchParams.get('action')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  function redirect(status: string, extra?: Record<string, string>) {
    const params = new URLSearchParams({ status, ...extra })
    return NextResponse.redirect(`${appUrl}/verify?${params.toString()}`)
  }

  if (!token || (action !== 'approve' && action !== 'reject')) {
    return redirect('invalid')
  }

  const service = createServiceClient()

  // Look up the token
  const { data: req, error: fetchError } = await service
    .from('verification_requests')
    .select('*, works(*)')
    .eq('token', token)
    .single()

  if (fetchError || !req) return redirect('invalid')

  // Already used?
  if (req.status !== 'pending') {
    return redirect(req.status === 'approved' ? 'already_approved' : 'already_rejected')
  }

  // Expired?
  if (new Date(req.expires_at) < new Date()) {
    return redirect('expired')
  }

  // Mark the token as used
  await service
    .from('verification_requests')
    .update({ status: action === 'approve' ? 'approved' : 'rejected' })
    .eq('token', token)

  // Update the work status + stamp the verified company name
  if (action === 'approve') {
    const verifiedCompany = companyNameFromEmail(req.company_email)

    // Only overwrite company when we have a real corporate domain name.
    // Free providers (gmail, yahoo…) return null — keep whatever the user entered.
    const workUpdate: Record<string, string> = { status: 'company_verified' }
    if (verifiedCompany) workUpdate.company = verifiedCompany

    await service
      .from('works')
      .update(workUpdate)
      .eq('id', req.work_id)

    const extra: Record<string, string> = { company_email: req.company_email }
    const displayCompany = verifiedCompany ?? (req.works as { company?: string } | null)?.company
    if (displayCompany) extra.company = displayCompany

    return redirect('approved', extra)
  }

  return redirect('rejected')
}

