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
  const total     = list.length
  const selfClaimed = list.filter(w => w.status === 'self_claimed').length
  const peerVer   = list.filter(w => w.status === 'peer_verified').length
  const compVer   = list.filter(w => w.status === 'company_verified').length
  const nextovateVer = list.filter(w => w.verified_by_company === 'Nextovate').length
  const axVer        = list.filter(w => w.verified_by_company === 'AX Ventures').length
  const recent    = list.slice(0, 6)

  const stats = [
    { label: 'Total', val: total,   accent: '#fff' },
    { label: 'Peer Verified',  val: peerVer, accent: '#818cf8' },
    { label: 'Company Verified', val: compVer, accent: '#10b981' },
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
      <div style={{ marginBottom: 48, borderBottom: '1px solid var(--border)', paddingBottom: 32 }}>
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--text-3)',
          fontFamily: 'var(--font-mono)', marginBottom: 12,
        }}>
          {greeting}
        </p>
        <h1 style={{
          fontSize: 42, fontWeight: 800, color: 'var(--text)',
          letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 10px',
        }}>
          {firstName}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)', letterSpacing: '-0.01em' }}>
          Proof-of-work record at a glance.
        </p>
      </div>

      {/* ── Stat strip ────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 48,
      }}>
        {stats.map(({ label, val, accent }, i) => (
          <div key={label} style={{
            padding: '28px 0',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            paddingLeft: i > 0 ? 32 : 0,
          }}>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 10,
            }}>
              {label}
            </p>
            <p style={{
              fontSize: 52, fontWeight: 800, color: accent,
              letterSpacing: '-0.06em', lineHeight: 1,
            }}>
              {val < 10 ? `0${val}` : val}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>

        {/* LEFT — recent works */}
        <div>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              Recent Work
            </p>
            <Link href="/dashboard/works" style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              textDecoration: 'none', fontFamily: 'var(--font-mono)',
              transition: 'color 0.15s',
            }}>
              View all ↗
            </Link>
          </div>

          {/* Work rows */}
          <div style={{ border: '1px solid var(--border)' }}>
            {list.length === 0 ? (
              <div style={{ padding: '52px 28px', textAlign: 'center' }}>
                <p style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'var(--text-3)',
                  fontFamily: 'var(--font-mono)', marginBottom: 16,
                }}>
                  No submissions
                </p>
                <Link href="/dashboard/upload" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px',
                  background: '#fff', color: '#000',
                  fontSize: 12, fontWeight: 600, textDecoration: 'none',
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
                    padding: '14px 20px',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
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
                        fontSize: 13, fontWeight: 500, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        letterSpacing: '-0.015em',
                      }}>
                        {w.title}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Verification breakdown */}
          <div>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 16,
            }}>
              Breakdown
            </p>
            <div style={{ border: '1px solid var(--border)' }}>
              {breakdown.map(({ label, count, color }, i) => (
                <div key={label} style={{
                  padding: '12px 16px',
                  borderBottom: i < breakdown.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{count}</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border-2)' }}>
                    <div style={{
                      height: 1, background: color,
                      width: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              ))}
              {total === 0 && (
                <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: 20 }}>No data</p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)', marginBottom: 16,
            }}>
              Actions
            </p>
            <div style={{ border: '1px solid var(--border)' }}>
              {[
                { label: 'Upload new work',  href: '/dashboard/upload', sub: 'Add a proof',       num: '01' },
                { label: 'View my works',    href: '/dashboard/works',  sub: 'Manage portfolio',  num: '02' },
                { label: 'Connect GitHub',   href: '/dashboard/github', sub: 'Import repos',      num: '03' },
              ].map((a, i) => (
                <Link key={a.label} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none', transition: 'background 0.1s',
                }}
                  className="hover-row"
                >
                  <span style={{
                    fontSize: 9, color: 'var(--text-3)',
                    fontFamily: 'var(--font-mono)', flexShrink: 0,
                  }}>
                    {a.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {a.label}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{a.sub}</p>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
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
