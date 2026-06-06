import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from '@/app/_components/delete-button'
import { RequestVerificationButton } from '@/app/_components/request-verification'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Works — ProofForge' }

type Work = {
  id: string
  title: string
  description: string
  role: string
  company: string | null
  status: 'self_claimed' | 'peer_verified' | 'company_verified'
  verified_by_company: string | null
  github_url: string | null
  figma_url: string | null
  live_url: string | null
  case_study_url: string | null
  tags: string[]
  created_at: string
}

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
]

const STATUS_CONFIG = {
  company_verified: { label: 'Company Verified', color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.22)',  dot: '#10b981'  },
  peer_verified:    { label: 'Peer Verified',    color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)', dot: '#818cf8'  },
  self_claimed:     { label: 'Self Claimed',     color: '#6b7280', bg: 'rgba(107,114,128,0.07)',border: 'rgba(107,114,128,0.18)',dot: '#9ca3af'  },
} as const

export default async function WorksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: works, error } = await supabase
    .from('works')
    .select('id, title, description, role, company, status, verified_by_company, github_url, figma_url, live_url, case_study_url, tags, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = (works ?? []) as Work[]
  const total       = list.length
  const compVerified = list.filter(w => w.status === 'company_verified').length
  const peerVerified = list.filter(w => w.status === 'peer_verified').length

  return (
    <div style={{ maxWidth: 900, fontFamily: 'var(--font)' }}>

      {/* ── Page header ───────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
              Portfolio
            </p>
            <h1 style={{ fontSize: 42, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.05em', lineHeight: 1 }}>
              My Work
            </h1>
            {total > 0 && (
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                  {String(total).padStart(2, '0')} total
                </span>
                {peerVerified > 0 && (
                  <span style={{ fontSize: 12, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                    {String(peerVerified).padStart(2, '0')} peer verified
                  </span>
                )}
                {compVerified > 0 && (
                  <span style={{ fontSize: 12, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {String(compVerified).padStart(2, '0')} company verified
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            href="/dashboard/upload"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', flexShrink: 0,
              background: '#0a0a12', color: '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              transition: 'opacity 0.15s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Work
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', fontSize: 12, color: '#f87171' }}>
          {error.message}
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !error && (
        <div style={{ padding: '80px 40px', textAlign: 'center', border: '2px dashed var(--border-2)', borderRadius: 'var(--radius-2xl)', background: 'var(--card)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.02em' }}>No proof submitted yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28, lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
            Upload your first contribution. It starts as self-claimed — peers and companies can verify it later.
          </p>
          <Link href="/dashboard/upload" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#0a0a12', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 'var(--radius-full)' }}>
            Upload your first work →
          </Link>
        </div>
      )}

      {/* ── Work cards grid ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {list.map((work, idx) => {
          const s = STATUS_CONFIG[work.status] ?? STATUS_CONFIG.self_claimed
          const isVerified = work.status === 'company_verified' && work.verified_by_company
          const gradient = GRADIENTS[idx % GRADIENTS.length]
          const links = [
            work.github_url     && { label: 'GitHub',     href: work.github_url,     icon: '⌥' },
            work.figma_url      && { label: 'Figma',      href: work.figma_url,      icon: '◈' },
            work.live_url       && { label: 'Live',       href: work.live_url,       icon: '↗' },
            work.case_study_url && { label: 'Case Study', href: work.case_study_url, icon: '◎' },
          ].filter(Boolean) as { label: string; href: string; icon: string }[]

          return (
            <div
              key={work.id}
              style={{
                background: 'var(--card)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                position: 'relative',
              }}
              className="hover-card"
            >
              {/* Gradient cover */}
              <div style={{ height: 120, background: gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-mono)', userSelect: 'none', letterSpacing: '-0.05em' }}>
                  {work.title.slice(0, 2).toUpperCase()}
                </span>

                {/* Status badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                  borderRadius: 99, padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, boxShadow: isVerified ? `0 0 6px ${s.dot}` : 'none' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                    {isVerified ? `✓ ${work.verified_by_company}` : s.label.toUpperCase()}
                  </span>
                </div>

                {/* Time */}
                <span style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>
                  {timeAgo(work.created_at)}
                </span>

                {/* Index */}
                <span style={{ position: 'absolute', top: 13, left: 14, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {work.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: work.description ? 12 : 14, letterSpacing: '-0.01em' }}>
                  {work.role}{work.company ? ` · ${work.company}` : ''}
                </p>

                {work.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {work.description}
                  </p>
                )}

                {/* Tags */}
                {work.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {work.tags.slice(0, 5).map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: '2px 8px', border: '1px solid var(--border-2)', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', borderRadius: 99 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {links.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 99, background: 'rgba(99,102,241,0.06)' }}>
                        {l.icon} {l.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Footer actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  {isVerified ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10b981', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', fontWeight: 600 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {work.verified_by_company?.toUpperCase()}
                    </span>
                  ) : (
                    <RequestVerificationButton
                      workId={work.id}
                      workTitle={work.title}
                      company={work.company}
                    />
                  )}
                  <DeleteButton workId={work.id} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
