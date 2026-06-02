'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { PortalConfig } from '@/lib/admin-auth'
import { adminApproveWork, adminRejectWork } from '@/app/actions/admin-verify'
import { adminLogout } from './login-action'

/* ────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */

export interface Work {
  id: string
  user_id: string
  title: string
  description: string
  role: string
  company: string | null
  status: string
  verified_by_company: string | null
  github_url: string | null
  figma_url: string | null
  live_url: string | null
  case_study_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

interface Stats {
  totalPending: number
  approvedToday: number
  totalApproved: number
}

interface AdminDashboardProps {
  cfg: PortalConfig
  pending: Work[]
  approved: Work[]
  stats: Stats
}

/* ────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/* ────────────────────────────────────────────────────────────────
   WorkCard — shown in the pending queue
──────────────────────────────────────────────────────────────── */

function WorkCard({
  work,
  cfg,
  onApprove,
  onReject,
  isActioning,
}: {
  work: Work
  cfg: PortalConfig
  onApprove: (id: string) => void
  onReject: (id: string, note?: string) => void
  isActioning: boolean
}) {
  const [showReject, setShowReject] = useState(false)
  const [note, setNote] = useState('')

  const lockedByOther =
    work.status === 'company_verified' && work.verified_by_company !== cfg.displayName

  const statusChip =
    work.status === 'peer_verified'
      ? { label: 'Peer Verified', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' }
      : { label: 'Self Claimed', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.15)' }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: `${cfg.accentColor}15`,
          border: `1px solid ${cfg.accentColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.accentColor} strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em', margin: 0 }}>
              {work.title}
            </h3>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              color: statusChip.color, background: statusChip.bg, border: `1px solid ${statusChip.border}`,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {statusChip.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
            <strong style={{ color: '#a1a1aa' }}>{work.role}</strong>
            {work.company && <> · <span style={{ color: '#818cf8' }}>{work.company}</span></>}
            &nbsp;·&nbsp;{timeAgo(work.created_at)}
          </p>
        </div>
      </div>

      {/* Description */}
      {work.description && (
        <p style={{ margin: '14px 24px 0', fontSize: 13, color: '#71717a', lineHeight: 1.65 }}>
          {work.description}
        </p>
      )}

      {/* Tags */}
      {work.tags?.length > 0 && (
        <div style={{ padding: '12px 24px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {work.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 11, padding: '3px 10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, color: '#a1a1aa',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      {(work.github_url || work.figma_url || work.live_url || work.case_study_url) && (
        <div style={{ padding: '12px 24px 0', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {work.github_url && (
            <a href={work.github_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub ↗
            </a>
          )}
          {work.figma_url && (
            <a href={work.figma_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#a78bfa', textDecoration: 'none' }}>
              Figma ↗
            </a>
          )}
          {work.live_url && (
            <a href={work.live_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#34d399', textDecoration: 'none' }}>
              Live ↗
            </a>
          )}
          {work.case_study_url && (
            <a href={work.case_study_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#fbbf24', textDecoration: 'none' }}>
              Case Study ↗
            </a>
          )}
        </div>
      )}

      {/* Action row */}
      <div style={{ padding: '16px 24px 20px', marginTop: 4 }}>
        {lockedByOther ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 16px', borderRadius: 10,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, color: '#a5b4fc' }}>
              Already verified by <strong style={{ color: '#c7d2fe' }}>{work.verified_by_company}</strong>
              &nbsp;— only one company can verify a task.
            </span>
          </div>
        ) : showReject ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for the student (shown in their notification email)…"
              rows={2}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8, color: '#f4f4f5', fontSize: 13,
                resize: 'vertical', fontFamily: 'inherit', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                id={`reject-confirm-${work.id}`}
                disabled={isActioning}
                onClick={() => { onReject(work.id, note || undefined); setShowReject(false) }}
                style={{
                  flex: 1, padding: '10px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  color: '#f87171', cursor: 'pointer', opacity: isActioning ? 0.5 : 1,
                }}
              >
                Confirm Reject
              </button>
              <button
                onClick={() => { setShowReject(false); setNote('') }}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, fontSize: 13, color: '#71717a', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              id={`approve-${work.id}`}
              disabled={isActioning}
              onClick={() => onApprove(work.id)}
              style={{
                flex: 1, padding: '11px 16px',
                background: isActioning ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg, #059669, #10b981)',
                border: isActioning ? '1px solid rgba(16,185,129,0.2)' : 'none',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: isActioning ? '#34d399' : '#fff',
                cursor: isActioning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: isActioning ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
                transition: 'all 0.15s',
              }}
            >
              {isActioning ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4" strokeLinecap="round" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Verify as {cfg.displayName}
                </>
              )}
            </button>
            <button
              id={`reject-${work.id}`}
              disabled={isActioning}
              onClick={() => setShowReject(true)}
              style={{
                flex: 1, padding: '11px 16px',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.18)',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: '#f87171', cursor: isActioning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   ApprovedRow — shown in history tab
──────────────────────────────────────────────────────────────── */

function ApprovedRow({ work, cfg }: { work: Work; cfg: PortalConfig }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {work.title}
        </p>
        <p style={{ fontSize: 11, color: '#52525b', margin: '2px 0 0' }}>
          {work.role}{work.company ? ` · ${work.company}` : ''} · {timeAgo(work.updated_at)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#86efac', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Verified by {cfg.displayName}
        </span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Main Dashboard
──────────────────────────────────────────────────────────────── */

export default function AdminDashboard({ cfg, pending, approved, stats }: AdminDashboardProps) {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [, startTransition] = useTransition()

  // Remove actioned cards from the pending list instantly
  const visiblePending = pending.filter(
    (w) => !dismissed.includes(w.id) && w.status !== 'company_verified'
  )

  const handleApprove = (id: string) => {
    setActioningId(id)
    setFeedback(null)
    startTransition(async () => {
      const res = await adminApproveWork(cfg.slug, id)
      setActioningId(null)
      if (res.error) {
        setFeedback({ type: 'error', msg: res.error })
      } else {
        setDismissed((prev) => [...prev, id])
        setFeedback({ type: 'success', msg: `✓ Verified! The student has been notified.` })
      }
    })
  }

  const handleReject = (id: string, note?: string) => {
    setActioningId(id)
    setFeedback(null)
    startTransition(async () => {
      const res = await adminRejectWork(cfg.slug, id, note)
      setActioningId(null)
      if (res.error) {
        setFeedback({ type: 'error', msg: res.error })
      } else {
        setDismissed((prev) => [...prev, id])
        setFeedback({ type: 'success', msg: 'Rejected. Student has been notified.' })
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5' }}>

      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30, height: 62,
        background: 'rgba(9,9,11,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${cfg.gradientFrom}, ${cfg.gradientTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: cfg.initial.length > 1 ? 11 : 16,
              fontWeight: 800, color: '#fff',
              boxShadow: `0 4px 14px ${cfg.accentColor}50`,
            }}>
              {cfg.initial}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {cfg.displayName}
              </p>
              <p style={{ fontSize: 10, color: '#52525b', margin: 0, marginTop: 1 }}>
                Verification Admin
              </p>
            </div>
          </div>
          <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <Link href="/" style={{ fontSize: 12, color: '#52525b', textDecoration: 'none' }}>
            ← ProofForge
          </Link>
        </div>

        <form action={adminLogout.bind(null, cfg.slug)}>
          <button type="submit" id={`${cfg.slug}-logout`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, fontSize: 12, color: '#71717a', cursor: 'pointer',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </form>
      </header>

      <main style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: 'inline-block', marginBottom: 12,
            padding: '3px 12px', borderRadius: 20, fontSize: 10,
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: cfg.accentColor,
            background: `${cfg.accentColor}12`,
            border: `1px solid ${cfg.accentColor}28`,
          }}>
            Admin Portal
          </span>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: '#f4f4f5',
            letterSpacing: '-0.03em', margin: '0 0 8px',
          }}>
            {cfg.displayName} Verification Queue
          </h1>
          <p style={{ fontSize: 14, color: '#71717a', margin: 0, maxWidth: 560, lineHeight: 1.65 }}>
            All student proof-of-work submissions appear here. Approve to award a{' '}
            <strong style={{ color: cfg.accentColor }}>{cfg.displayName}</strong> verified badge.
            Once verified by either company, the task is locked.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Awaiting Review', val: stats.totalPending,  color: cfg.accentColor },
            { label: 'Verified Today',  val: stats.approvedToday, color: '#22c55e' },
            { label: 'Total Verified',  val: stats.totalApproved, color: '#10b981' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
            }}>
              <p style={{ fontSize: 10, color: '#52525b', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {label}
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 2, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: 3, width: 'fit-content',
        }}>
          {([
            { key: 'pending',  label: `Pending (${stats.totalPending})` },
            { key: 'approved', label: `Verified by us (${stats.totalApproved})` },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setTab(key)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                background: tab === key
                  ? `linear-gradient(135deg, ${cfg.gradientFrom}, ${cfg.gradientTo})`
                  : 'transparent',
                color: tab === key ? '#fff' : '#71717a',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div style={{
            marginBottom: 16, padding: '12px 16px', borderRadius: 10,
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            background: feedback.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: feedback.type === 'success' ? '#34d399' : '#f87171',
          }}>
            <span style={{ flex: 1 }}>{feedback.msg}</span>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}

        {/* ── Pending tab ──────────────────────────────────────────── */}
        {tab === 'pending' && (
          visiblePending.length === 0 ? (
            <div style={{
              padding: '72px 24px', textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
                background: `${cfg.accentColor}10`,
                border: `1px solid ${cfg.accentColor}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={cfg.accentColor} strokeWidth="1.75">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#71717a', margin: '0 0 6px' }}>All clear!</p>
              <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>
                No student submissions are waiting for review.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visiblePending.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  cfg={cfg}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isActioning={actioningId === work.id}
                />
              ))}
            </div>
          )
        )}

        {/* ── Approved/History tab ─────────────────────────────────── */}
        {tab === 'approved' && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {approved.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>
                  No works verified by {cfg.displayName} yet.
                </p>
              </div>
            ) : (
              approved.map((work) => (
                <ApprovedRow key={work.id} work={work} cfg={cfg} />
              ))
            )}
          </div>
        )}
      </main>

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}
