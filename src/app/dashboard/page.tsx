import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — ProofForge' }

/* ── Seeded heatmap (no hydration mismatch) ── */
function heatVal(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  const r = x - Math.floor(x)
  return r < 0.42 ? 0 : r < 0.62 ? 1 : r < 0.78 ? 2 : r < 0.91 ? 3 : 4
}
const HEATMAP = Array.from({ length: 52 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => heatVal(w * 7 + d))
)
const HEAT_COLORS = [
  'rgba(124,58,237,0.05)',
  'rgba(124,58,237,0.18)',
  'rgba(124,58,237,0.38)',
  'rgba(124,58,237,0.6)',
  'rgba(124,58,237,0.88)',
]

/* ── Mock data ── */
const VERIFICATIONS = [
  { project: 'Stripe Checkout Redesign', company: 'Stripe',  status: 'approved', time: '2h ago',  rep: +48,  color: '#10b981' },
  { project: 'Real-time Sync Engine',     company: 'Linear',  status: 'pending',  time: '1d ago',  rep: null, color: '#f59e0b' },
  { project: 'ML Pipeline Architecture',  company: 'OpenAI',  status: 'approved', time: '3d ago',  rep: +92,  color: '#10b981' },
  { project: 'Zero-Trust Auth Overhaul',  company: 'GitHub',  status: 'review',   time: '5d ago',  rep: null, color: '#7c3aed' },
  { project: 'Design System v4.0',        company: 'Figma',   status: 'peer',     time: '7d ago',  rep: +31,  color: '#818cf8' },
]

const ACTIVITY = [
  { text: 'Stripe officially verified your Checkout Redesign', time: '2h ago', icon: '✦', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  { text: '3 peers co-signed Zero-Trust Auth Overhaul', time: '1d ago', icon: '◈', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  { text: 'ML Pipeline Architecture submitted to OpenAI', time: '3d ago', icon: '⬆', color: '#818cf8', bg: 'rgba(79,70,229,0.1)'  },
  { text: 'Reputation milestone — Top 4% globally', time: '4d ago', icon: '★', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { text: 'OpenAI joined ProofForge. You verified early.', time: '1w ago', icon: '◆', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
]

/* ── Sub-components ── */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset',
      }}
    >
      {children}
    </div>
  )
}

function StatCard({ label, value, delta, color }: { label: string; value: string; delta?: string; color: string }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}12 0%, transparent 70%)` }} />
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#1e293b' }}>{label}</div>
      <div className="text-4xl font-black text-white mb-1">{value}</div>
      {delta && <div className="text-xs font-semibold" style={{ color }}>{delta}</div>}
    </Card>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: 'Verified',   color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
    pending:  { label: 'Pending',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    review:   { label: 'In Review',  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)'  },
    peer:     { label: 'Peer Verif', color: '#818cf8', bg: 'rgba(79,70,229,0.1)'   },
  }
  const s = map[status] ?? { label: status, color: '#475569', bg: 'rgba(255,255,255,0.04)' }
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}20` }}>
      <span className="h-1 w-1 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

/* ── Page ── */

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'
  const avatar = user.user_metadata?.avatar_url as string | undefined

  const hour = new Date().getUTCHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#1e293b' }}>Overview</p>
        <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
          {greeting}, <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{displayName}</span> 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#334155' }}>Your verified professional identity at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Reputation" value="847" delta="↑ +12 this month" color="#7c3aed" />
        <StatCard label="Verified Works" value="23" delta="↑ +3 this month" color="#10b981" />
        <StatCard label="Company Seals" value="7" delta="↑ +1 this month" color="#38bdf8" />
        <StatCard label="Collaborators" value="34" color="#f59e0b" />
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Left 3 cols */}
        <div className="space-y-5 lg:col-span-3">

          {/* Verifications table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="text-sm font-bold text-white">Verification Requests</h2>
              <span className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.18)' }}>
                {VERIFICATIONS.length} total
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
              {VERIFICATIONS.map((v, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-white/[0.02]">
                  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: `${v.color}12`, color: v.color, border: `1px solid ${v.color}20` }}>
                    {v.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium" style={{ color: '#cbd5e1' }}>{v.project}</p>
                    <p className="text-xs" style={{ color: '#1e293b' }}>{v.company} · {v.time}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {v.rep != null && <span className="text-xs font-bold" style={{ color: '#10b981' }}>+{v.rep}</span>}
                    <StatusPill status={v.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">Contribution Activity</h2>
              <span className="text-xs" style={{ color: '#1e293b' }}>Last 12 months</span>
            </div>
            <div className="mb-1.5 flex text-[9px] gap-[11px] ml-4" style={{ color: '#1e293b' }}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                <span key={m} className="w-4">{m}</span>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {HEATMAP.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1 shrink-0">
                  {week.map((lvl, di) => (
                    <div key={di} className="h-2.5 w-2.5 rounded-sm transition hover:scale-110 cursor-default"
                      style={{ background: HEAT_COLORS[lvl] }} />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[9px]" style={{ color: '#1e293b' }}>
              Less
              {HEAT_COLORS.map((c, i) => <div key={i} className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />)}
              More
            </div>
          </Card>
        </div>

        {/* Right 2 cols */}
        <div className="space-y-5 lg:col-span-2">

          {/* Profile */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-5">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={displayName} className="h-14 w-14 rounded-full"
                  style={{ boxShadow: '0 0 0 3px rgba(124,58,237,0.25)' }} />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 0 3px rgba(124,58,237,0.2)' }}>
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-white">{displayName}</p>
                <p className="text-xs" style={{ color: '#334155' }}>{user.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.18)' }}>
                  <span className="h-1 w-1 rounded-full" style={{ background: '#10b981', animation: 'pulseDot 2s ease-in-out infinite' }} />
                  VERIFIED MEMBER
                </span>
              </div>
            </div>
            <div className="mb-2 flex justify-between text-xs">
              <span style={{ color: '#334155' }}>Reputation Score</span>
              <span className="font-bold text-white">847 / 1000</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full" style={{ width: '84.7%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)' }} />
            </div>
            <p className="mt-2 text-[10px]" style={{ color: '#1e293b' }}>Top 4% · 153 more for Elite tier</p>
          </Card>

          {/* Activity */}
          <Card className="p-6">
            <h2 className="mb-5 text-sm font-bold text-white">Activity Feed</h2>
            <div className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs"
                    style={{ background: a.bg, color: a.color, border: `1px solid ${a.color}18` }}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="text-[11px] leading-5" style={{ color: '#475569' }}>{a.text}</p>
                    <p className="mt-0.5 text-[10px]" style={{ color: '#1e293b' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-bold text-white">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { label: 'Browse GitHub repos',    href: '/dashboard/github', color: '#7c3aed', icon: '⎇' },
                { label: 'Upload proof of work',   href: '/dashboard/upload', color: '#818cf8', icon: '⬆' },
                { label: 'Request company review', href: '#',                 color: '#10b981', icon: '✦' },
                { label: 'Invite a collaborator',  href: '#',                 color: '#f59e0b', icon: '◈' },
              ].map((a) => (
                <Link key={a.label} href={a.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                  style={{ color: '#334155' }}>
                  <span className="text-sm" style={{ color: a.color }}>{a.icon}</span>
                  {a.label}
                  <svg className="ml-auto h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
