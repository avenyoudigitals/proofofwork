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

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 9px',
        background: 'transparent',
        border: '1px solid var(--border-2)',
        fontSize: 10, color: 'var(--text-3)', textDecoration: 'none',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
        transition: 'color 0.1s, border-color 0.1s',
      }}
    >
      {label} ↗
    </a>
  )
}

const STATUS_CFG = {
  self_claimed:     { label: 'Self Claimed',    cls: 'self' },
  peer_verified:    { label: 'Peer Verified',   cls: 'peer' },
  company_verified: { label: 'Company Verified',cls: 'company' },
}

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
  const total = list.length
  const compVerified = list.filter(w => w.status === 'company_verified').length

  return (
    <div style={{ maxWidth: 860, fontFamily: 'var(--font)' }}>

      {/* ── Page header ──────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)',
        gap: 20,
      }}>
        <div>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)', marginBottom: 12,
          }}>
            Portfolio
          </p>
          <h1 style={{
            fontSize: 48, fontWeight: 800, color: 'var(--text)',
            letterSpacing: '-0.05em', lineHeight: 1,
          }}>
            My Work
          </h1>
          {total > 0 && (
            <p style={{
              fontSize: 11, color: 'var(--text-3)', marginTop: 10,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            }}>
              {String(total).padStart(2, '0')} submissions ·{' '}
              <span style={{ color: '#10b981' }}>{String(compVerified).padStart(2, '0')} verified</span>
            </p>
          )}
        </div>

        <Link
          href="/dashboard/upload"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', flexShrink: 0,
            background: '#fff', color: '#000',
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'background 0.15s',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="square" />
          </svg>
          Add Work
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 24, padding: '12px 16px',
          border: '1px solid rgba(239,68,68,0.2)',
          background: 'rgba(239,68,68,0.05)',
          fontSize: 12, color: '#f87171', fontFamily: 'var(--font-mono)',
        }}>
          Error: {error.message}
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !error && (
        <div style={{
          padding: '80px 40px', textAlign: 'center',
          border: '1px dashed var(--border-2)',
        }}>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)', marginBottom: 20,
          }}>
            No proof submitted yet
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28, lineHeight: 1.7 }}>
            Upload your first contribution. It starts as self-claimed —{' '}
            peers and companies can verify it later.
          </p>
          <Link
            href="/dashboard/upload"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px',
              background: '#fff', color: '#000',
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Upload your first work →
          </Link>
        </div>
      )}

      {/* ── Work list ────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {list.map((work, idx) => {
          const s = STATUS_CFG[work.status] ?? STATUS_CFG.self_claimed
          const isVerified = work.status === 'company_verified' && work.verified_by_company

          return (
            <div
              key={work.id}
              className={`work-card${isVerified ? ' verified' : ''}`}
            >
              {/* Left accent bar for verified */}
              {isVerified && <div className="work-card-accent" />}

              <div style={{ padding: '22px 24px', paddingLeft: isVerified ? 30 : 24 }}>

                {/* Top row */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 16, marginBottom: 14,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Index + status tag row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 9, color: 'var(--text-3)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {isVerified ? (
                        <span className="status-tag company">✓ {work.verified_by_company}</span>
                      ) : (
                        <span className={`status-tag ${s.cls}`}>{s.label}</span>
                      )}
                    </div>

                    <h3 style={{
                      fontSize: 17, fontWeight: 700, color: 'var(--text)',
                      letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 4,
                    }}>
                      {work.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', letterSpacing: '-0.01em' }}>
                      {work.role}{work.company ? ` · ${work.company}` : ''}{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                        · {timeAgo(work.created_at)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                {work.description && (
                  <p style={{
                    fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7,
                    marginBottom: 16,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {work.description}
                  </p>
                )}

                {/* Tags */}
                {work.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                    {work.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 9, padding: '2px 7px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-3)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(work.github_url || work.figma_url || work.live_url || work.case_study_url) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {work.github_url && <LinkPill href={work.github_url} label="GitHub" />}
                    {work.figma_url && <LinkPill href={work.figma_url} label="Figma" />}
                    {work.live_url && <LinkPill href={work.live_url} label="Live" />}
                    {work.case_study_url && <LinkPill href={work.case_study_url} label="Case Study" />}
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 8,
                  paddingTop: 14, borderTop: '1px solid var(--border)',
                }}>
                  {isVerified ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 10, color: '#10b981',
                      fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      VERIFIED · {work.verified_by_company?.toUpperCase()}
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
