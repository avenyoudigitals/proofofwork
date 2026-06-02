import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — ProofForge' }

const STATUS_STYLE = {
  self_claimed:     { label: 'Self Claimed',     color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  dot: '#94a3b8' },
  peer_verified:    { label: 'Peer Verified',    color: '#818cf8', bg: 'rgba(129,140,248,0.1)',  dot: '#818cf8' },
  company_verified: { label: 'Company Verified', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    dot: '#22c55e' },
} as const

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = (user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there') as string
  const firstName = displayName.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Fetch real works data
  const { data: works } = await supabase
    .from('works')
    .select('id, title, role, status, verified_by_company, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = works ?? []

  const total       = list.length
  const selfClaimed  = list.filter(w => w.status === 'self_claimed').length
  const peerVer      = list.filter(w => w.status === 'peer_verified').length
  const compVer      = list.filter(w => w.status === 'company_verified').length
  const nextovateVer = list.filter(w => w.verified_by_company === 'Nextovate').length
  const axVer        = list.filter(w => w.verified_by_company === 'AX Ventures').length
  const recent       = list.slice(0, 5)

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
  }

  return (
    <div style={{ maxWidth: 1060, fontFamily: 'var(--font)' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', margin: '0 0 5px' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 14, color: '#71717a', margin: 0 }}>
          Here's your proof-of-work record at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Submissions',    val: total,    accent: '#818cf8', icon: '📂' },
          { label: 'Peer Verified',         val: peerVer,  accent: '#60a5fa', icon: '👥' },
          { label: 'Company Verified',      val: compVer,  accent: '#22c55e', icon: '🏢' },
        ].map(({ label, val, accent, icon }) => (
          <div key={label} style={{ ...cardStyle, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0, fontWeight: 500 }}>{label}</p>
              <span style={{ fontSize: 18 }}>{icon}</span>
            </div>
            <p style={{ fontSize: 36, fontWeight: 700, color: accent, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* LEFT — recent works */}
        <div style={cardStyle}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', margin: '0 0 2px' }}>Recent Works</p>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>Your latest submissions</p>
            </div>
            <Link href="/dashboard/works" style={{
              fontSize: 11, fontWeight: 600, color: '#818cf8', textDecoration: 'none',
              padding: '5px 12px', borderRadius: 8,
              background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
            }}>
              View all →
            </Link>
          </div>

          {list.length === 0 ? (
            <div style={{ padding: '52px 24px', textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>⬆</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#71717a', margin: '0 0 6px' }}>No submissions yet</p>
              <p style={{ fontSize: 12, color: '#52525b', margin: '0 0 18px' }}>Upload your first proof-of-work to get started.</p>
              <Link href="/dashboard/upload" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none',
              }}>
                ⬆ Upload work
              </Link>
            </div>
          ) : (
            recent.map((w, i) => {
              const s = STATUS_STYLE[w.status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.self_claimed
              return (
                <div key={w.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px',
                  borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.title}
                    </p>
                    <p style={{ fontSize: 11, color: '#71717a', margin: '2px 0 0' }}>
                      {w.role} · {timeAgo(w.created_at)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                    color: s.color, background: s.bg,
                    border: `1px solid ${s.color}30`,
                    letterSpacing: '0.03em', flexShrink: 0,
                  }}>
                    {w.status === 'company_verified' && w.verified_by_company
                      ? `✓ ${w.verified_by_company}`
                      : s.label}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* RIGHT — quick actions + breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Status breakdown */}
          <div style={cardStyle}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', margin: 0 }}>Verification Breakdown</p>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Self Claimed',          count: selfClaimed,  color: '#94a3b8' },
                { label: 'Peer Verified',          count: peerVer,      color: '#818cf8' },
                { label: '🏢 Nextovate Verified',  count: nextovateVer, color: '#22c55e' },
                { label: '🏢 AX Ventures Verified',count: axVer,        color: '#0ea5e9' },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: '#a1a1aa' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      height: 4, borderRadius: 4, background: color,
                      width: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              ))}
              {total === 0 && (
                <p style={{ fontSize: 12, color: '#52525b', textAlign: 'center', margin: 0 }}>No data yet</p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div style={cardStyle}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', margin: 0 }}>Quick Actions</p>
            </div>
            {[
              { label: 'Upload new work',   href: '/dashboard/upload', sub: 'Add a proof-of-work',     icon: '⬆' },
              { label: 'View my works',     href: '/dashboard/works',  sub: 'Manage submissions',      icon: '📋' },
              { label: 'Connect GitHub',    href: '/dashboard/github', sub: 'Import repositories',     icon: '🔗' },
            ].map((a, i) => (
              <Link key={a.label} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                textDecoration: 'none', transition: 'background 0.1s',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#e4e4e7', margin: 0 }}>{a.label}</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: '1px 0 0' }}>{a.sub}</p>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2">
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
