import { isSuperuserAuthenticated } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { superuserLoginAction, superuserLogoutAction } from './superuser-actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Superuser — ProofForge' }

// ── Types ───────────────────────────────────────────────
type WorkRow = {
  id: string
  title: string
  role: string
  status: string
  assigned_to: string | null
  verified_by_company: string | null
  created_at: string
  updated_at: string | null
  user_id: string
}

type RejectionRow = {
  work_id: string
  portal_slug: string
}

// ── Helpers ──────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Login page ───────────────────────────────────────────
function LoginPage({ error }: { error: boolean }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)',
      fontFamily: 'var(--font)',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
          }}>👑</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', margin: '0 0 5px', letterSpacing: '-0.03em' }}>
            Superuser Portal
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', margin: 0 }}>Platform-level oversight access</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '11px 14px', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#f87171',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
            </svg>
            Invalid username or password.
          </div>
        )}

        {/* Form */}
        <form action={superuserLoginAction} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#a1a1aa', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Username
            </label>
            <input
              name="username" type="text" required autoComplete="username"
              style={{
                width: '100%', padding: '11px 13px', borderRadius: 10, boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f4f4f5', fontSize: 14, outline: 'none', fontFamily: 'var(--font)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#a1a1aa', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              name="password" type="password" required autoComplete="current-password"
              style={{
                width: '100%', padding: '11px 13px', borderRadius: 10, boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f4f4f5', fontSize: 14, outline: 'none', fontFamily: 'var(--font)',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              fontSize: 14, fontWeight: 700, color: '#0a0a0a', cursor: 'pointer',
              marginTop: 4, boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            }}
          >
            Sign in as Superuser →
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3f3f46', marginTop: 16 }}>
          ProofForge platform owner access only
        </p>
      </div>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────
export default async function SuperuserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const authenticated = await isSuperuserAuthenticated()

  if (!authenticated) {
    return <LoginPage error={error === '1'} />
  }

  // ── Fetch all data ────────────────────────────────────
  const service = createServiceClient()

  const { data: allWorks } = await service
    .from('works')
    .select('id, title, role, status, assigned_to, verified_by_company, created_at, updated_at, user_id')
    .order('created_at', { ascending: false })

  const { data: rejections } = await service
    .from('admin_rejections')
    .select('work_id, portal_slug')

  const works: WorkRow[] = allWorks ?? []
  const rejectMap = new Map<string, string[]>()
  for (const r of (rejections ?? []) as RejectionRow[]) {
    if (!rejectMap.has(r.work_id)) rejectMap.set(r.work_id, [])
    rejectMap.get(r.work_id)!.push(r.portal_slug)
  }

  // ── Stats ─────────────────────────────────────────────
  const total = works.length
  const nWorks = works.filter(w => w.assigned_to === 'nextovate')
  const axWorks = works.filter(w => w.assigned_to === 'ax-ventures')

  const portalStats = [
    {
      name: 'Nextovate',
      slug: 'nextovate',
      accent: '#6366f1',
      works: nWorks,
      verified: nWorks.filter(w => w.verified_by_company === 'Nextovate').length,
      rejected: nWorks.filter(w => (rejectMap.get(w.id) ?? []).includes('nextovate')).length,
      pending: nWorks.filter(w => w.status !== 'company_verified' && !(rejectMap.get(w.id) ?? []).includes('nextovate')).length,
    },
    {
      name: 'AX Ventures',
      slug: 'ax-ventures',
      accent: '#0ea5e9',
      works: axWorks,
      verified: axWorks.filter(w => w.verified_by_company === 'AX Ventures').length,
      rejected: axWorks.filter(w => (rejectMap.get(w.id) ?? []).includes('ax-ventures')).length,
      pending: axWorks.filter(w => w.status !== 'company_verified' && !(rejectMap.get(w.id) ?? []).includes('ax-ventures')).length,
    },
  ]

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
  }

  // ── Status badge helper ───────────────────────────────
  function statusBadge(work: WorkRow) {
    const rejected = rejectMap.get(work.id) ?? []
    if (work.status === 'company_verified' && work.verified_by_company) {
      return (
        <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
          ✓ {work.verified_by_company}
        </span>
      )
    }
    if (rejected.length > 0) {
      return (
        <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
          ✗ Rejected
        </span>
      )
    }
    return (
      <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
        ⏳ Pending
      </span>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', fontFamily: 'var(--font)', padding: '0 0 60px' }}>

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>👑</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
            Superuser Portal
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
            background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)',
            letterSpacing: '0.05em',
          }}>PLATFORM OWNER</span>
        </div>
        <form action={superuserLogoutAction}>
          <button type="submit" style={{
            padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 12, cursor: 'pointer',
          }}>
            Sign out
          </button>
        </form>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 0' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', margin: '0 0 5px', letterSpacing: '-0.03em' }}>
            Platform Overview
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', margin: 0 }}>
            All submissions across both admin portals — {total} total work{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Global stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Submissions', val: total, accent: '#f59e0b', icon: '📦' },
            { label: 'Assigned to Nextovate', val: nWorks.length, accent: '#6366f1', icon: '🔵' },
            { label: 'Assigned to AX Ventures', val: axWorks.length, accent: '#0ea5e9', icon: '🩵' },
          ].map(({ label, val, accent, icon }) => (
            <div key={label} style={{ ...card, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: '#71717a', margin: 0, fontWeight: 500 }}>{label}</p>
                <span style={{ fontSize: 18 }}>{icon}</span>
              </div>
              <p style={{ fontSize: 34, fontWeight: 700, color: accent, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Per-portal breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {portalStats.map((p) => (
            <div key={p.slug} style={{ ...card, overflow: 'hidden' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${p.accent}, ${p.accent}88)` }} />
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${p.accent}20`, border: `1px solid ${p.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: p.accent,
                  }}>
                    {p.slug === 'nextovate' ? 'N' : 'AX'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: '#71717a', margin: 0 }}>{p.works.length} assigned works</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Pending',  val: p.pending,  color: '#fbbf24' },
                    { label: 'Verified', val: p.verified, color: '#22c55e' },
                    { label: 'Rejected', val: p.rejected, color: '#f87171' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{
                      padding: '10px', borderRadius: 10, textAlign: 'center',
                      background: `${color}10`, border: `1px solid ${color}25`,
                    }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color, margin: '0 0 2px', lineHeight: 1 }}>{val}</p>
                      <p style={{ fontSize: 10, color: '#71717a', margin: 0, fontWeight: 500 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All works table */}
        <div style={card}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', margin: '0 0 2px' }}>All Submissions</p>
            <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>Full view across both portals</p>
          </div>

          {works.length === 0 ? (
            <div style={{ padding: '48px 22px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#52525b', margin: 0 }}>No submissions yet.</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 130px 120px 130px 90px',
                padding: '9px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                {['Work Title', 'Role', 'Assigned To', 'Verification', 'Submitted'].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {works.map((w, i) => {
                const assignedAccent = w.assigned_to === 'nextovate' ? '#6366f1' : w.assigned_to === 'ax-ventures' ? '#0ea5e9' : '#52525b'
                const assignedLabel  = w.assigned_to === 'nextovate' ? 'Nextovate' : w.assigned_to === 'ax-ventures' ? 'AX Ventures' : 'Unassigned'
                return (
                  <div
                    key={w.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 130px 120px 130px 90px',
                      padding: '13px 22px', alignItems: 'center',
                      borderBottom: i < works.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {/* Title */}
                    <div style={{ minWidth: 0, paddingRight: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {w.title}
                      </p>
                    </div>

                    {/* Role */}
                    <p style={{ fontSize: 11, color: '#71717a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.role}
                    </p>

                    {/* Assigned to */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 20, width: 'fit-content',
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.03em',
                      color: assignedAccent, background: `${assignedAccent}12`,
                      border: `1px solid ${assignedAccent}30`,
                    }}>
                      {assignedLabel}
                    </span>

                    {/* Status */}
                    {statusBadge(w)}

                    {/* Time */}
                    <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>
                      {timeAgo(w.created_at)}
                    </p>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
