import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — ProofForge' }

/* ─────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                       */
/* ─────────────────────────────────────────────────────────────── */

const VERIFICATIONS = [
  { project: 'Stripe Checkout Redesign', company: 'Stripe', status: 'approved', time: '2h ago', rep: +48, accent: '#10b981' },
  { project: 'Real-time Sync Engine', company: 'Linear', status: 'pending', time: '1d ago', rep: null, accent: '#3b82f6' },
  { project: 'ML Pipeline Architecture', company: 'OpenAI', status: 'approved', time: '3d ago', rep: +92, accent: '#10b981' },
  { project: 'Zero-Trust Auth Overhaul', company: 'GitHub', status: 'review', time: '5d ago', rep: null, accent: '#f97316' },
  { project: 'Design System v4.0', company: 'Figma', status: 'peer', time: '7d ago', rep: +31, accent: '#60a5fa' },
]

const ACTIVITY = [
  { type: 'verification', text: 'Stripe verified your Checkout Redesign contribution', time: '2 hours ago', icon: '✦', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { type: 'peer', text: '3 peers co-signed Auth Overhaul on GitHub', time: '1 day ago', icon: '🔗', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { type: 'upload', text: 'ML Pipeline Architecture submitted for review', time: '3 days ago', icon: '⬆', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  { type: 'rep', text: 'Reputation milestone reached: Top 5% globally', time: '4 days ago', icon: '★', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { type: 'company', text: 'OpenAI joined ProofForge — you\'re an early verifier', time: '1 week ago', icon: '◆', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
]

// Generate heatmap data (52 weeks × 7 days)
function generateHeatmap() {
  return Array.from({ length: 52 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const rand = Math.random()
      if (rand < 0.45) return 0
      if (rand < 0.65) return 1
      if (rand < 0.80) return 2
      if (rand < 0.92) return 3
      return 4
    })
  )
}

const HEATMAP = generateHeatmap()
const HEAT_COLORS = [
  'rgba(255,255,255,0.05)',
  'rgba(59,130,246,0.2)',
  'rgba(59,130,246,0.45)',
  'rgba(124,58,237,0.55)',
  'rgba(124,58,237,0.9)',
]

/* ─────────────────────────────────────────────────────────────── */
/*  SUB-COMPONENTS                                                  */
/* ─────────────────────────────────────────────────────────────── */

function StatCard({
  label, value, delta, sub, color,
}: { label: string; value: string; delta?: string; sub?: string; color: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-0.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
    >
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}25 0%, transparent 70%)` }}
      />
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{label}</div>
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      {delta && <div className="text-xs font-semibold" style={{ color }}>{delta}</div>}
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: 'Company Verified', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    pending:  { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    review:   { label: 'In Review', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    peer:     { label: 'Peer Verified', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  }
  const s = map[status] ?? { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}25` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/*  PAGE                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'
  const avatar = user.user_metadata?.avatar_url as string | undefined

  return (
    <div className="max-w-5xl space-y-8">

      {/* ── Page header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Overview</p>
        <h1 className="text-2xl font-bold text-white">
          Good {getTimeOfDay()},{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {displayName}
          </span>{' '}
          👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">Your verified professional identity at a glance.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Reputation Score" value="847" delta="↑ +12 this month" sub="Top 4% globally" color="#3b82f6" />
        <StatCard label="Verified Works" value="23" delta="↑ +3 this month" color="#10b981" />
        <StatCard label="Companies" value="7" delta="↑ +1 this month" color="#7c3aed" />
        <StatCard label="Collaborators" value="34" sub="across all projects" color="#f97316" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── Left column (3/5) ── */}
        <div className="space-y-6 lg:col-span-3">

          {/* Verification requests */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-semibold text-white">Verification Requests</h2>
              <span className="text-xs text-slate-500">{VERIFICATIONS.length} total</span>
            </div>

            <div className="divide-y" style={{ divideColor: 'rgba(255,255,255,0.04)' }}>
              {VERIFICATIONS.map((v, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 transition hover:bg-white/[0.02]">
                  {/* Company dot */}
                  <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: v.accent + '25', border: `1px solid ${v.accent}30` }}>
                    {v.company[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{v.project}</p>
                    <p className="text-xs text-slate-500">{v.company} · {v.time}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {v.rep && (
                      <span className="text-xs font-semibold text-emerald-400">+{v.rep} rep</span>
                    )}
                    <StatusBadge status={v.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution heatmap */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Contribution Activity</h2>
              <span className="text-xs text-slate-500">Last 12 months · 180+ contributions</span>
            </div>

            {/* Month labels */}
            <div className="mb-2 flex text-[9px] text-slate-600 gap-[11px] ml-3">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                <span key={m} className="w-4">{m}</span>
              ))}
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2">
              {HEATMAP.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1 shrink-0">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className="h-2.5 w-2.5 rounded-sm transition hover:scale-125"
                      style={{ background: HEAT_COLORS[level] }}
                      title={`Level ${level}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
              <span>Less</span>
              {HEAT_COLORS.map((c, i) => (
                <div key={i} className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* ── Right column (2/5) ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Profile card */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-4 mb-5">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={displayName} className="h-14 w-14 rounded-full ring-2" style={{ ringColor: 'rgba(124,58,237,0.4)' }} />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-semibold text-emerald-300"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  VERIFIED MEMBER
                </div>
              </div>
            </div>

            {/* Rep bar */}
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Reputation</span>
              <span className="font-bold text-white">847 / 1000</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: '84.7%', background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">Top 4% · Need 153 more for Elite tier</p>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="mb-5 text-sm font-semibold text-white">Activity Feed</h2>
            <div className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{ background: a.bg, color: a.color }}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 leading-5">{a.text}</p>
                    <p className="mt-0.5 text-[10px] text-slate-600">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="mb-4 text-sm font-semibold text-white">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Browse GitHub repos',    href: '/dashboard/github', icon: '⎇', color: '#3b82f6' },
                { label: 'Upload proof of work',   href: '/dashboard/upload', icon: '⬆', color: '#7c3aed' },
                { label: 'Invite a collaborator',  href: '#',                 icon: '🔗', color: '#10b981' },
                { label: 'Request company review', href: '#',                 icon: '✦', color: '#f59e0b' },
              ].map((action) => (
                <Link key={action.label} href={action.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="text-base" style={{ color: action.color }}>{action.icon}</span>
                  {action.label}
                  <svg className="ml-auto h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getUTCHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
