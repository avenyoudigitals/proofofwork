'use client'

import { useState } from 'react'
import Link from 'next/link'

type Work = {
  id: string
  title: string
  role: string
  company: string | null
  description: string | null
  status: string
  verified_by_company: string | null
  tags: string[] | null
  github_url: string | null
  figma_url: string | null
  live_url: string | null
  case_study_url: string | null
  created_at: string
}

interface Props {
  userId: string
  displayName: string
  username: string | null
  bio: string | null
  avatarUrl: string | null
  location: string | null
  website: string | null
  githubUsername: string | null
  works: Work[]
  companyVerifiedCount: number
  peerVerifiedCount: number
  profileSlug: string
}

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  company_verified: { label: 'Company Verified', color: '#059669', bg: 'rgba(5,150,105,0.08)',   border: 'rgba(5,150,105,0.25)',  dot: '#10b981' },
  peer_verified:    { label: 'Peer Verified',    color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)', dot: '#818cf8' },
  self_claimed:     { label: 'Self Claimed',     color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', dot: '#9ca3af' },
}

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days < 1) return 'today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function Avatar({ name, avatarUrl, size = 80 }: { name: string; avatarUrl: string | null; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e5e8' }} />
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color: '#fff', border: '3px solid #e5e5e8', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  const st = STATUS_CONFIG[work.status] ?? STATUS_CONFIG.self_claimed
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const links = [
    work.github_url     && { label: 'GitHub', href: work.github_url,     icon: '⌥' },
    work.figma_url      && { label: 'Figma',  href: work.figma_url,      icon: '◈' },
    work.live_url       && { label: 'Live',   href: work.live_url,       icon: '↗' },
    work.case_study_url && { label: 'Case',   href: work.case_study_url, icon: '◎' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[]

  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8e8f0', borderRadius: 20, overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s' }} className="pub-work-card">
      <div style={{ height: 140, background: gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)', userSelect: 'none' }}>
          {work.title.slice(0, 2).toUpperCase()}
        </span>
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', borderRadius: 99, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: st.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {work.status === 'company_verified' && work.verified_by_company ? `✓ ${work.verified_by_company}` : st.label.toUpperCase()}
          </span>
        </div>
        <span style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>{timeAgo(work.created_at)}</span>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0a0a12', letterSpacing: '-0.02em', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{work.title}</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: work.description ? 10 : 14 }}>{work.role}{work.company ? ` · ${work.company}` : ''}</p>
        {work.description && <p style={{ fontSize: 12, color: '#55556e', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{work.description}</p>}
        {work.tags && work.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: links.length ? 14 : 0 }}>
            {work.tags.slice(0, 4).map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', border: '1px solid #e5e5e8', color: '#6b7280', borderRadius: 99, fontFamily: 'var(--font-mono)' }}>{t}</span>)}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {links.map(l => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 600, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '3px 9px', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 99, background: 'rgba(99,102,241,0.06)' }}>{l.icon} {l.label}</a>)}
          </div>
        )}
      </div>
    </div>
  )
}

function WorkRow({ work, index }: { work: Work; index: number }) {
  const st = STATUS_CONFIG[work.status] ?? STATUS_CONFIG.self_claimed
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const links = [
    work.github_url     && { label: 'GitHub', href: work.github_url,     icon: '⌥' },
    work.figma_url      && { label: 'Figma',  href: work.figma_url,      icon: '◈' },
    work.live_url       && { label: 'Live',   href: work.live_url,       icon: '↗' },
    work.case_study_url && { label: 'Case',   href: work.case_study_url, icon: '◎' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[]

  return (
    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #e8e8f0', borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.2s, border-color 0.2s' }} className="pub-work-row">
      <div style={{ width: 4, alignSelf: 'stretch', background: gradient, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>{work.title.slice(0, 2).toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0a0a12', letterSpacing: '-0.02em', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{work.title}</p>
          <p style={{ fontSize: 12, color: '#6b7280' }}>{work.role}{work.company ? ` · ${work.company}` : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {(work.tags ?? []).slice(0, 3).map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', border: '1px solid #e5e5e8', color: '#6b7280', borderRadius: 99, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{t}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {links.map(l => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#6366f1', textDecoration: 'none', padding: '3px 9px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, background: 'rgba(99,102,241,0.06)', whiteSpace: 'nowrap' }}>{l.icon} {l.label}</a>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: st.bg, border: `1px solid ${st.border}`, borderRadius: 99, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: st.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {work.status === 'company_verified' && work.verified_by_company ? `✓ ${work.verified_by_company}` : st.label.toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{timeAgo(work.created_at)}</span>
      </div>
    </div>
  )
}

export default function PublicProfileClient({
  displayName, username, bio, avatarUrl,
  location, website, githubUsername,
  works, companyVerifiedCount, peerVerifiedCount,
  profileSlug,
}: Props) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [copied, setCopied] = useState(false)

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/u/${profileSlug}`
    : `/u/${profileSlug}`

  function copyLink() {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <style>{`
        .pub-work-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-2px); border-color: #c7c7d4 !important; }
        .pub-work-row:hover  { box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-color: #c7c7d4 !important; }
        .view-btn:hover { opacity: 0.8; }
        .copy-btn:hover { background: #f0f0f8 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f8f8fc', fontFamily: 'var(--font)' }}>

        {/* Nav */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: 15, fontWeight: 800, color: '#0a0a12', letterSpacing: '-0.03em' }}>ProofForge</Link>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login"  style={{ fontSize: 13, fontWeight: 500, color: '#55556e', textDecoration: 'none', padding: '7px 16px', borderRadius: 99, border: '1.5px solid #e5e5e8' }}>Sign in</Link>
              <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, color: '#fff',    textDecoration: 'none', padding: '7px 18px', borderRadius: 99, background: '#0a0a12' }}>Get started</Link>
            </div>
          </div>
        </div>

        {/* Profile hero */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8f0' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
              <Avatar name={displayName} avatarUrl={avatarUrl} size={88} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a12', letterSpacing: '-0.04em', lineHeight: 1 }}>{displayName}</h1>
                  {companyVerifiedCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 99 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>COMPANY VERIFIED</span>
                    </div>
                  )}
                </div>
                {username && <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>@{username}</p>}
                {bio && <p style={{ fontSize: 14, color: '#55556e', lineHeight: 1.7, maxWidth: 480, marginBottom: 14 }}>{bio}</p>}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {location && (
                    <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {location}
                    </span>
                  )}
                  {website && <a href={website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>}
                  {githubUsername && (
                    <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#55556e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                      {githubUsername}
                    </a>
                  )}
                </div>
              </div>

              {/* Stats + share */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { v: works.length,         l: 'Proofs',  color: '#0a0a12' },
                    { v: peerVerifiedCount,    l: 'Peer',    color: '#6366f1' },
                    { v: companyVerifiedCount, l: 'Company', color: '#10b981' },
                  ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center', padding: '10px 16px', background: '#f8f8fc', border: '1.5px solid #e8e8f0', borderRadius: 14, minWidth: 60 }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</p>
                      <p style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'var(--font-mono)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <button onClick={copyLink} className="copy-btn" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: '#fff', border: '1.5px solid #e8e8f0', borderRadius: 99, fontSize: 12, fontWeight: 600, color: copied ? '#059669' : '#55556e', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font)' }}>
                  {copied
                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>Link copied!</>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" /></svg>Share profile</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Works */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0a0a12', letterSpacing: '-0.03em', marginBottom: 2 }}>
                Works <span style={{ color: '#9ca3af', fontWeight: 600 }}>({works.length})</span>
              </h2>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Verified proof-of-work submissions</p>
            </div>
            <div style={{ display: 'flex', background: '#f0f0f8', borderRadius: 12, padding: 4, gap: 2 }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className="view-btn" title={`${v} view`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 9, border: 'none', background: view === v ? '#0a0a12' : 'transparent', color: view === v ? '#fff' : '#6b7280', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {v === 'grid'
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" /><line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" /><line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" /></svg>
                  }
                </button>
              ))}
            </div>
          </div>

          {works.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 20, border: '1.5px dashed #e8e8f0' }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>◎</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0a0a12', marginBottom: 6 }}>No works yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af' }}>This user hasn&apos;t submitted any proof of work yet.</p>
            </div>
          )}

          {view === 'grid' && works.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {works.map((w, i) => <WorkCard key={w.id} work={w} index={i} />)}
            </div>
          )}

          {view === 'list' && works.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {works.map((w, i) => <WorkRow key={w.id} work={w} index={i} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e8e8f0', background: '#fff' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 800, color: '#0a0a12', letterSpacing: '-0.03em', textDecoration: 'none' }}>ProofForge</Link>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>Verified proof-of-work profiles</p>
          </div>
        </div>
      </div>
    </>
  )
}
