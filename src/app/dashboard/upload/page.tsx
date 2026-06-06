'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createWork } from '@/app/actions/work'
import type { WorkFormState } from '@/app/actions/work'

export const dynamic = 'force-dynamic'

const ROLE_OPTIONS = [
  'Full Stack Engineering',
  'Frontend Engineering',
  'Backend Engineering',
  'Mobile Engineering',
  'DevOps / Platform',
  'ML / AI Engineering',
  'Security Engineering',
  'Product Design',
  'UI / Design Systems',
  'UX Research',
  'Product Management',
  'Data Engineering',
  'Other',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--card-2)',
  border: '1px solid var(--border-2)',
  borderRadius: 10,
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--font)',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-2)',
  marginBottom: 7,
  letterSpacing: '0.01em',
}

const sectionStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px',
  marginBottom: 16,
}

function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = '#6366f1'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
}
function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'var(--border-2)'
  e.currentTarget.style.boxShadow = 'none'
}

export default function UploadWorkPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, action, pending] = useActionState<WorkFormState | undefined, FormData>(
    createWork,
    undefined
  )

  useEffect(() => {
    if (state?.success) router.push('/dashboard/works')
  }, [state, router])

  return (
    <div style={{ maxWidth: 680, fontFamily: 'var(--font)' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717a', margin: '0 0 8px' }}>
          New Submission
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
          Upload proof of work
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0, lineHeight: 1.65 }}>
          Submit verifiable evidence of a real contribution. Starts as self-claimed — peers and companies can verify it later.
        </p>
      </div>

      {/* Error banner */}
      {state?.error && (
        <div style={{
          marginBottom: 20, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#f87171',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}

      <form ref={formRef} action={action}>

        {/* ── Project Info ── */}
        <div style={sectionStyle}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717a', margin: '0 0 20px' }}>
            Project Info
          </p>

          {/* Title */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              Project title <span style={{ color: '#818cf8' }}>*</span>
            </label>
            <input
              name="title" type="text" required
              placeholder="e.g. Stripe Checkout Redesign"
              style={inputStyle}
              onFocus={focusInput} onBlur={blurInput}
            />
            <p style={{ fontSize: 11, color: '#71717a', margin: '5px 0 0' }}>Keep it concise — this is your headline.</p>
          </div>

          {/* Role */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              Your role / contribution <span style={{ color: '#818cf8' }}>*</span>
            </label>
            <select
              name="role" required defaultValue=""
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusInput} onBlur={blurInput}
            >
              <option value="" disabled>Select a role…</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <p style={{ fontSize: 11, color: '#71717a', margin: '5px 0 0' }}>What specifically did you build or design?</p>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              What you built / designed <span style={{ color: '#818cf8' }}>*</span>
            </label>
            <textarea
              name="description" rows={5} required
              placeholder="Describe your contribution in detail. Include context, what you did, tools used, and measurable outcomes (e.g. reduced churn by 20%, shipped to 2M users)."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={focusInput} onBlur={blurInput}
            />
            <p style={{ fontSize: 11, color: '#71717a', margin: '5px 0 0' }}>Be specific. What problem did you solve? What was the measurable impact?</p>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Skills / Tags</label>
            <input
              name="tags" type="text"
              placeholder="React, TypeScript, Figma…"
              style={inputStyle}
              onFocus={focusInput} onBlur={blurInput}
            />
            <p style={{ fontSize: 11, color: '#71717a', margin: '5px 0 0' }}>Comma-separated. e.g. React, Figma, TypeScript, A/B Testing</p>
          </div>
        </div>

        {/* ── Proof Links ── */}
        <div style={sectionStyle}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#71717a', margin: '0 0 3px' }}>
              Proof Links
            </p>
            <p style={{ fontSize: 11, color: '#71717a', margin: 0 }}>Add at least one link so verifiers can review your work.</p>
          </div>

          {[
            {
              name: 'github_url', label: 'GitHub Repository', type: 'url',
              placeholder: 'https://github.com/you/repo',
              hint: 'Direct link to the repo or a specific PR/commit.',
              icon: (
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#71717a' }}>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              ),
            },
            {
              name: 'figma_url', label: 'Figma File', type: 'url',
              placeholder: 'https://figma.com/file/…',
              hint: 'Paste a public Figma link or view-only share link.',
              icon: (
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#71717a' }}>
                  <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z" />
                </svg>
              ),
            },
            {
              name: 'live_url', label: 'Live / Deployed URL', type: 'url',
              placeholder: 'https://your-project.com',
              hint: 'Link to the live product, demo, or staging environment.',
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: '#71717a' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              ),
            },
            {
              name: 'case_study_url', label: 'Case Study / Write-up', type: 'url',
              placeholder: 'https://notion.so/… or youtube.com/…',
              hint: 'Notion doc, blog post, Loom video, or any external writeup.',
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: '#71717a' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
          ].map((f, idx, arr) => (
            <div key={f.name} style={{ marginBottom: idx < arr.length - 1 ? 18 : 0 }}>
              <label style={labelStyle}>{f.label}</label>
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'var(--card-2)',
                border: '1px solid var(--border-2)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '11px 12px',
                  borderRight: '1px solid var(--border)',
                  background: 'var(--card-3)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {f.icon}
                </div>
                <input
                  name={f.name} type="url"
                  placeholder={f.placeholder}
                  style={{
                    flex: 1, padding: '11px 14px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text)', fontSize: 14, outline: 'none',
                    fontFamily: 'var(--font)',
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: '#52525b', margin: '5px 0 0' }}>{f.hint}</p>
            </div>
          ))}
        </div>

        {/* Info notice */}
        <div style={{
          display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#a5b4fc',
          }}>✦</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', margin: '0 0 3px' }}>Starting as Self-Claimed</p>
            <p style={{ fontSize: 11, color: '#71717a', margin: 0, lineHeight: 1.65 }}>
              Your submission starts at <strong style={{ color: '#c7d2fe' }}>Self-Claimed</strong> status.
              Peers can co-sign it (Peer Verified), or a company can officially endorse it (Company Verified).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: '11px 20px', borderRadius: 10,
              background: 'var(--card-2)', border: '1px solid var(--border-2)',
              fontSize: 13, color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            style={{
              padding: '11px 28px', borderRadius: 10,
              background: pending ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none',
              fontSize: 13, fontWeight: 600, color: '#fff',
              cursor: pending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: pending ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              transition: 'all 0.15s',
            }}
          >
            {pending ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4" strokeLinecap="round" />
                </svg>
                Submitting…
              </>
            ) : '⬆ Submit Proof of Work'}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}
