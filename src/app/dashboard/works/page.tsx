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

const STATUS_MAP = {
  self_claimed:     { label: 'Self Claimed',     color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)'  },
  peer_verified:    { label: 'Peer Verified',     color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.25)' },
  company_verified: { label: 'Company Verified',  color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)'   },
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

function LinkPill({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 7,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: 11, color: '#94a3b8', textDecoration: 'none',
        transition: 'color 0.1s',
      }}
    >
      {icon}
      {label} ↗
    </a>
  )
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

  return (
    <div style={{ maxWidth: 760, fontFamily: 'var(--font)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525b', margin: '0 0 6px' }}>
            Portfolio
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
            My Works
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', margin: 0 }}>
            {list.length === 0 ? 'No submissions yet.' : `${list.length} submission${list.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add work
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          fontSize: 13, color: '#f87171',
        }}>
          Could not load works: {error.message}
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !error && (
        <div style={{
          padding: '64px 24px', textAlign: 'center', borderRadius: 20,
          background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 18px',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>⬆</div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7', margin: '0 0 6px' }}>
            No proof submitted yet
          </h2>
          <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 22px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}>
            Upload your first contribution. It starts as self-claimed — peers and companies can verify it later.
          </p>
          <Link
            href="/dashboard/upload"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none',
            }}
          >
            Upload your first work →
          </Link>
        </div>
      )}

      {/* Work cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((work) => {
          const s = STATUS_MAP[work.status] ?? STATUS_MAP.self_claimed
          const isVerified = work.status === 'company_verified' && work.verified_by_company

          return (
            <div
              key={work.id}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: isVerified ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Verified top bar */}
              {isVerified && (
                <div style={{ height: 2, background: 'linear-gradient(90deg, #059669, #10b981, #34d399)' }} />
              )}

              <div style={{ padding: '20px 22px' }}>

                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em', margin: '0 0 3px', lineHeight: 1.3 }}>
                      {work.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
                      {work.role} · <span style={{ color: '#52525b' }}>{timeAgo(work.created_at)}</span>
                    </p>
                  </div>

                  {/* Status badge */}
                  {isVerified ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                      padding: '5px 11px', borderRadius: 20,
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.28)',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Verified by {work.verified_by_company}
                      </span>
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                      padding: '5px 10px', borderRadius: 20,
                      background: s.bg, border: `1px solid ${s.border}`,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {s.label}
                      </span>
                    </span>
                  )}
                </div>

                {/* Description */}
                {work.description && (
                  <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {work.description}
                  </p>
                )}

                {/* Tags */}
                {work.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {work.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10, padding: '3px 9px', borderRadius: 6,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#94a3b8',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(work.github_url || work.figma_url || work.live_url || work.case_study_url) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {work.github_url && (
                      <LinkPill href={work.github_url} label="GitHub" icon={
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      } />
                    )}
                    {work.figma_url && (
                      <LinkPill href={work.figma_url} label="Figma" icon={
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z" />
                        </svg>
                      } />
                    )}
                    {work.live_url && (
                      <LinkPill href={work.live_url} label="Live" icon={
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      } />
                    )}
                    {work.case_study_url && (
                      <LinkPill href={work.case_study_url} label="Case Study" icon={
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      } />
                    )}
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
                  paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
                  marginTop: 2,
                }}>
                  <RequestVerificationButton
                    workId={work.id}
                    workTitle={work.title}
                    company={work.company}
                  />
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
