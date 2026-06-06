import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — ProofForge' }

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = (user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there') as string
  const firstName = displayName.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'

  const { data: works } = await supabase
    .from('works')
    .select('id, title, role, status, verified_by_company, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = works ?? []
  const total        = list.length
  const selfClaimed  = list.filter(w => w.status === 'self_claimed').length
  const peerVer      = list.filter(w => w.status === 'peer_verified').length
  const compVer      = list.filter(w => w.status === 'company_verified').length
  const nextovateVer = list.filter(w => w.verified_by_company === 'Nextovate').length
  const axVer        = list.filter(w => w.verified_by_company === 'AX Ventures').length
  const recent       = list.slice(0, 6)

  const stats = [
    { label: 'Total Proofs',      val: total,   accent: 'var(--text)',  sub: 'All submissions' },
    { label: 'Peer Verified',     val: peerVer, accent: '#818cf8',      sub: 'Co-signed by peers' },
    { label: 'Company Verified',  val: compVer, accent: '#10b981',      sub: 'Official endorsements' },
  ]

  const breakdown = [
    { label: 'Self Claimed',           count: selfClaimed,  color: 'var(--text-3)' },
    { label: 'Peer Verified',          count: peerVer,      color: '#818cf8' },
    { label: 'Nextovate Verified',     count: nextovateVer, color: '#10b981' },
    { label: 'AX Ventures Verified',   count: axVer,        color: '#10b981' },
  ]

  const STATUS_TAG: Record<string, { label: string; cls: string }> = {
    self_claimed:     { label: 'Self',    cls: 'self' },
    peer_verified:    { label: 'Peer',    cls: 'peer' },
    company_verified: { label: 'Company', cls: 'company' },
  }

  return (
    <div style={{ maxWidth: 1080, fontFamily: 'var(--font)' }}>

      {/* ── Header ────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-full)',
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#10b981', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {greeting}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.05em', lineHeight: 1, margin: '0 0 10px' }}>
              {firstName}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)', letterSpacing: '-0.01em' }}>
              Your proof-of-work record at a glance.
            </p>
          </div>
          <Link
            href={`/u/${user.id}`}
            target="_blank"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px',
              background: 'var(--card)',
              border: '1.5px solid var(--border-2)',
              borderRadius: 'var(--radius-full)',
              fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
              textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View public profile
          </Link>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14, marginBottom: 40,
      }}>
        {stats.map(({ label, val, accent, sub }) => (
          <div key={label} style={{
            padding: '28px 24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          className="hover-card"
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${accent === 'var(--text)' ? '#6366f1' : accent}, transparent)`,
            }} />
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 12,
            }}>
              {label}
            </p>
            <p style={{
              fontSize: 52, fontWeight: 800, color: accent,
              letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 6,
            }}>
              {val < 10 ? `0${val}` : val}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        {/* LEFT — recent works */}
        <div>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              Recent Work
            </p>
            <Link href="/dashboard/works" style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
              color: '#818cf8', textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              padding: '4px 10px',
              border: '1px solid rgba(129,140,248,0.2)',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99,102,241,0.06)',
              transition: 'all 0.15s',
            }}>
              View all ↗
            </Link>
          </div>

          {/* Work rows */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}>
            {list.length === 0 ? (
              <div style={{ padding: '60px 28px', textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--indigo-dim)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
                  marginBottom: 6,
                }}>
                  No submissions yet
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
                  Add your first proof of work to get started
                </p>
                <Link href="/dashboard/upload" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                  letterSpacing: '-0.01em',
                }}>
                  Upload first work →
                </Link>
              </div>
            ) : (
              recent.map((w, i) => {
                const tag = STATUS_TAG[w.status as keyof typeof STATUS_TAG] ?? STATUS_TAG.self_claimed
                const isVerified = w.status === 'company_verified' && w.verified_by_company
                return (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 22px',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  className="hover-row"
                  >
                    {/* Index */}
                    <span style={{
                      fontSize: 10, color: 'var(--text-3)',
                      fontFamily: 'var(--font-mono)', flexShrink: 0, width: 20,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        letterSpacing: '-0.015em',
                      }}>
                        {w.title}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        {w.role}
                      </p>
                    </div>

                    {/* Status tag */}
                    <span className={`status-tag ${tag.cls}`}>
                      {isVerified ? `✓ ${w.verified_by_company}` : tag.label}
                    </span>

                    {/* Time */}
                    <span style={{
                      fontSize: 10, color: 'var(--text-3)',
                      fontFamily: 'var(--font-mono)', flexShrink: 0,
                    }}>
                      {timeAgo(w.created_at)}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT — sidebar panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Verification breakdown */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 14,
            }}>
              Breakdown
            </p>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              {breakdown.map(({ label, count, color }, i) => (
                <div key={label} style={{
                  padding: '14px 18px',
                  borderBottom: i < breakdown.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{count}</span>
                  </div>
                  <div className="progress">
                    <div className="progress-fill" style={{
                      background: color,
                      width: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
                    }} />
                  </div>
                </div>
              ))}
              {total === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '24px 20px' }}>
                  No data yet
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 14,
            }}>
              Quick Actions
            </p>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              {[
                { label: 'Upload new work',  href: '/dashboard/upload', sub: 'Add a proof',       icon: '↑' },
                { label: 'View my works',    href: '/dashboard/works',  sub: 'Manage portfolio',  icon: '◎' },
                { label: 'Connect GitHub',   href: '/dashboard/github', sub: 'Import repos',      icon: '⌥' },
              ].map((a, i) => (
                <Link key={a.label} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
                className="hover-row"
                >
                  <span style={{
                    width: 30, height: 30, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13, color: '#818cf8',
                  }}>
                    {a.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {a.label}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{a.sub}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
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
