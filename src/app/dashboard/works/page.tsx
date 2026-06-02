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
  self_claimed:      { label: 'Self Claimed',      color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
  peer_verified:     { label: 'Peer Verified',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)' },
  company_verified:  { label: 'Company Verified',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)' },
}

function LinkChip({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium text-slate-400 transition hover:text-white"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {icon}
      {label}
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
    <div className="max-w-3xl space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Portfolio</p>
          <h1 className="text-2xl font-bold text-white">My Works</h1>
          <p className="mt-1 text-sm text-slate-400">
            {list.length === 0 ? 'No submissions yet.' : `${list.length} submission${list.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
        >
          ⬆ Add work
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Could not load works: {error.message}
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            ⬆
          </div>
          <h2 className="mb-2 text-base font-semibold text-white">No proof submitted yet</h2>
          <p className="mb-6 max-w-xs text-sm text-slate-400">
            Upload your first contribution. It starts as self-claimed — peers and companies can verify it later.
          </p>
          <Link href="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            Upload your first work →
          </Link>
        </div>
      )}

      {/* Work cards */}
      <div className="space-y-4">
        {list.map((work) => {
          const s = STATUS_MAP[work.status] ?? STATUS_MAP.self_claimed
          const date = new Date(work.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })

          return (
            <div key={work.id} className="group rounded-2xl p-6 transition hover:bg-white/[0.03]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white leading-snug">{work.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{work.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status chip — shows verifying company name when company_verified */}
                  {work.status === 'company_verified' && work.verified_by_company ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 20,
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.28)',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Verified by {work.verified_by_company}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                      {s.label.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 text-sm leading-6 text-slate-400 line-clamp-3">{work.description}</p>

              {/* Tags */}
              {work.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <span key={tag} className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="mb-4 flex flex-wrap gap-2">
                {work.github_url && (
                  <LinkChip href={work.github_url} label="GitHub" icon={
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  } />
                )}
                {work.figma_url && (
                  <LinkChip href={work.figma_url} label="Figma" icon={
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z" />
                    </svg>
                  } />
                )}
                {work.live_url && (
                  <LinkChip href={work.live_url} label="Live" icon={
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  } />
                )}
                {work.case_study_url && (
                  <LinkChip href={work.case_study_url} label="Case study" icon={
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  } />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/6 pt-3">
                <span className="text-[10px] text-slate-600">Submitted {date}</span>
                <div className="flex items-center gap-2">
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


