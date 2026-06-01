import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — ProofForge' }

function heatVal(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  const r = x - Math.floor(x)
  return r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4
}
const HEATMAP = Array.from({ length: 52 }, (_, w) => Array.from({ length: 7 }, (_, d) => heatVal(w * 7 + d)))
const HEAT_COLORS = ['rgba(255,255,255,0.04)', 'rgba(99,102,241,0.2)', 'rgba(99,102,241,0.4)', 'rgba(99,102,241,0.65)', '#6366f1']

const VERIFICATIONS = [
  { project: 'Stripe Checkout Redesign', company: 'stripe.com',  status: 'company', rep: 48  },
  { project: 'Real-time Sync Engine',    company: 'linear.app',  status: 'pending',  rep: null },
  { project: 'ML Pipeline Architecture', company: 'openai.com',  status: 'company', rep: 92  },
  { project: 'Zero-Trust Auth Overhaul', company: 'github.com',  status: 'review',   rep: null },
  { project: 'Design System v4.0',       company: 'figma.com',   status: 'peer',     rep: 31  },
]

const ACTIVITY = [
  { text: 'stripe.com verified your Checkout Redesign',  time: '2h ago',  badge: 'badge-green',  label: 'Verified'   },
  { text: '3 peers co-signed Zero-Trust Auth Overhaul',  time: '1d ago',  badge: 'badge-indigo', label: 'Co-signed'  },
  { text: 'ML Pipeline submitted to openai.com',          time: '3d ago',  badge: 'badge-zinc',   label: 'Submitted'  },
  { text: 'Reputation milestone — top 4% globally',       time: '4d ago',  badge: 'badge-amber',  label: 'Milestone'  },
]

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  company: { label: 'Verified',   cls: 'badge-green'  },
  pending: { label: 'Pending',    cls: 'badge-zinc'   },
  review:  { label: 'In Review',  cls: 'badge-amber'  },
  peer:    { label: 'Peer Verif', cls: 'badge-indigo' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = (user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there') as string

  return (
    <div style={{ maxWidth: 1100, fontFamily: 'var(--font)' }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {displayName.split(' ')[0]}
        </h1>
        <p style={{ fontSize: 14, color: '#71717a' }}>
          Here&apos;s what&apos;s happening with your verification record.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Reputation Score', val: '847',  sub: '↑ +12 this month',  accent: '#6366f1' },
          { label: 'Verified Works',   val: '23',   sub: '↑ +3 this month',   accent: '#22c55e' },
          { label: 'Company Seals',    val: '7',    sub: '↑ +1 this month',   accent: '#f59e0b' },
          { label: 'Collaborators',    val: '34',   sub: 'total',             accent: '#a78bfa' },
        ].map(({ label, val, sub, accent }) => (
          <div key={label} className="card-flat" style={{ padding: '20px' }}>
            <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12 }}>{label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6 }}>{val}</p>
            <p style={{ fontSize: 12, color: accent, fontWeight: 500 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Reputation progress */}
      <div className="card-flat" style={{ padding: '20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 2 }}>Reputation Score</p>
            <p style={{ fontSize: 12, color: '#71717a' }}>153 points to Elite tier · Top 4% globally</p>
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#6366f1', letterSpacing: '-0.03em' }}>847<span style={{ fontSize: 14, color: '#52525b', fontWeight: 500 }}>/1000</span></span>
        </div>
        <div className="progress" style={{ marginBottom: 6 }}>
          <div className="progress-fill" style={{ width: '84.7%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#52525b' }}>
          <span>0</span><span>Elite: 1000</span>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Verifications table */}
          <div className="card-flat">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 2 }}>Verifications</p>
                <p style={{ fontSize: 12, color: '#71717a' }}>Your submitted work records</p>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: 11 }}>{VERIFICATIONS.length} records</span>
            </div>

            <div>
              {VERIFICATIONS.map((v, i) => {
                const s = STATUS_CFG[v.status] ?? { label: v.status, cls: 'badge-zinc' }
                return (
                  <div key={i} className="hover-row" style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 20px',
                    borderBottom: i < VERIFICATIONS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.1s',
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.project}</p>
                      <p style={{ fontSize: 12, color: '#71717a' }}>{v.company}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      {v.rep != null && <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>+{v.rep} rep</span>}
                      <span className={`badge ${s.cls}`} style={{ fontSize: 10 }}>{s.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contribution heatmap */}
          <div className="card-flat" style={{ padding: '20px' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 2 }}>Contribution Activity</p>
              <p style={{ fontSize: 12, color: '#71717a' }}>Past 12 months</p>
            </div>
            <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
              <div style={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
                {HEATMAP.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((lvl, di) => (
                      <div key={di} title={`Level ${lvl}`} style={{ width: 11, height: 11, borderRadius: 2, background: HEAT_COLORS[lvl] }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#52525b' }}>Less</span>
              {HEAT_COLORS.map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />)}
              <span style={{ fontSize: 11, color: '#52525b' }}>More</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Activity feed */}
          <div className="card-flat">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', marginBottom: 2 }}>Recent Activity</p>
            </div>
            <div>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span className={`badge ${a.badge}`} style={{ fontSize: 10, flexShrink: 0, alignSelf: 'flex-start', marginTop: 1 }}>{a.label}</span>
                  <div>
                    <p style={{ fontSize: 12, color: '#d4d4d8', lineHeight: 1.5 }}>{a.text}</p>
                    <p style={{ fontSize: 11, color: '#52525b', marginTop: 3 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-flat">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>Quick Actions</p>
            </div>
            {[
              { label: 'Connect GitHub',      href: '/dashboard/github',  sub: 'Import your repositories'      },
              { label: 'Upload Work',          href: '/dashboard/upload',  sub: 'Add a new work submission'     },
              { label: 'Request Company Seal', href: '#',                  sub: 'Ask a company to verify'      },
              { label: 'Invite Collaborator',  href: '#',                  sub: 'Co-sign a contribution'       },
            ].map((a, i) => (
              <Link key={a.label} href={a.href} className="hover-row" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                textDecoration: 'none',
                transition: 'background 0.1s',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7' }}>{a.label}</p>
                  <p style={{ fontSize: 11, color: '#52525b', marginTop: 1 }}>{a.sub}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
