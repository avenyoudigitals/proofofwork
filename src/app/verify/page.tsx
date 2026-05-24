import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Verification — ProofForge' }

type Status = 'approved' | 'rejected' | 'expired' | 'invalid' | 'already_approved' | 'already_rejected'

const STATUS_CONFIG: Record<Status, {
  icon: string
  iconBg: string
  iconBorder: string
  badge: string
  badgeBg: string
  badgeBorder: string
  heading: string
  body: string
}> = {
  approved: {
    icon: '✓',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(16,185,129,0.3)',
    badge: 'CONTRIBUTION VERIFIED',
    badgeBg: 'rgba(16,185,129,0.1)',
    badgeBorder: 'rgba(16,185,129,0.25)',
    heading: 'Verification approved',
    body: "Thank you — the contributor's ProofForge profile has been updated to show Company Verified status. They'll be notified of your endorsement.",
  },
  rejected: {
    icon: '✕',
    iconBg: 'rgba(239,68,68,0.12)',
    iconBorder: 'rgba(239,68,68,0.25)',
    badge: 'VERIFICATION DECLINED',
    badgeBg: 'rgba(239,68,68,0.08)',
    badgeBorder: 'rgba(239,68,68,0.2)',
    heading: 'Verification declined',
    body: "You've declined this verification request. The contributor will be notified. No changes have been made to their profile.",
  },
  expired: {
    icon: '⏱',
    iconBg: 'rgba(245,158,11,0.12)',
    iconBorder: 'rgba(245,158,11,0.25)',
    badge: 'LINK EXPIRED',
    badgeBg: 'rgba(245,158,11,0.08)',
    badgeBorder: 'rgba(245,158,11,0.2)',
    heading: 'This link has expired',
    body: 'Verification links are valid for 7 days. Please ask the contributor to send a new verification request.',
  },
  invalid: {
    icon: '⚠',
    iconBg: 'rgba(148,163,184,0.1)',
    iconBorder: 'rgba(148,163,184,0.2)',
    badge: 'INVALID LINK',
    badgeBg: 'rgba(148,163,184,0.06)',
    badgeBorder: 'rgba(148,163,184,0.15)',
    heading: 'Invalid verification link',
    body: 'This link is not valid. It may have been copied incorrectly. Please ask the contributor to send a new request.',
  },
  already_approved: {
    icon: '✓',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(16,185,129,0.3)',
    badge: 'ALREADY VERIFIED',
    badgeBg: 'rgba(16,185,129,0.1)',
    badgeBorder: 'rgba(16,185,129,0.25)',
    heading: 'Already verified',
    body: 'This contribution has already been verified. No further action is needed.',
  },
  already_rejected: {
    icon: '✕',
    iconBg: 'rgba(239,68,68,0.12)',
    iconBorder: 'rgba(239,68,68,0.25)',
    badge: 'ALREADY DECLINED',
    badgeBg: 'rgba(239,68,68,0.08)',
    badgeBorder: 'rgba(239,68,68,0.2)',
    heading: 'Already declined',
    body: 'This verification request has already been declined.',
  },
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; company_email?: string; company?: string }>
}) {
  const { status: rawStatus, company_email, company } = await searchParams
  const status = (rawStatus as Status) in STATUS_CONFIG
    ? (rawStatus as Status)
    : 'invalid'

  const cfg = STATUS_CONFIG[status]

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4"
      style={{ background: '#05050f', color: '#f1f5f9' }}
    >
      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: 900, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      <div className="relative w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
              ✦
            </div>
            <span className="text-sm font-bold tracking-tight text-white">ProofForge</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl px-8 py-10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
            style={{ background: cfg.iconBg, border: `1px solid ${cfg.iconBorder}` }}>
            {cfg.icon}
          </div>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest"
            style={{ background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`, color: cfg.icon === '✓' ? '#10b981' : cfg.icon === '✕' ? '#f87171' : '#f59e0b' }}>
            {cfg.badge}
          </div>

          <h1 className="mb-3 text-xl font-bold text-white">{cfg.heading}</h1>
          <p className="text-sm leading-7 text-slate-400">{cfg.body}</p>

          {/* Approved-by attribution */}
          {status === 'approved' && (company_email || company) && (
            <div className="mt-5 rounded-xl px-4 py-4"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified by</p>
              {company && (
                <p className="text-sm font-semibold text-white">{company}</p>
              )}
              {company_email && (
                <p className="mt-0.5 text-xs text-slate-400 break-all">{company_email}</p>
              )}
            </div>
          )}

          {/* CTA for approved */}
          {status === 'approved' && (
            <div className="mt-8 rounded-xl px-4 py-4"
              style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <p className="text-xs text-slate-400 leading-6">
                Want to verify more contributors or join ProofForge as a company partner?
              </p>
              <Link href="/signup"
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                Learn more →
              </Link>
            </div>
          )}

          {/* Back home */}
          <div className="mt-8">
            <Link href="/"
              className="text-xs text-slate-500 transition hover:text-slate-300">
              Return to ProofForge →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-slate-700">
          ProofForge · Verified Proof-of-Work Network
        </p>
      </div>
    </main>
  )
}
