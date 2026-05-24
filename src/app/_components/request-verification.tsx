'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendVerificationRequest } from '@/app/actions/verification'
import type { VerificationRequestState } from '@/app/actions/verification'

interface Props {
  workId: string
  workTitle: string
  company?: string | null
}

export function RequestVerificationButton({ workId, workTitle, company }: Props) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [state, action, pending] = useActionState<VerificationRequestState | undefined, FormData>(
    sendVerificationRequest,
    undefined
  )

  // Close on success after a moment
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => setOpen(false), 2200)
      return () => clearTimeout(t)
    }
  }, [state])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition hover:opacity-80"
        style={{
          background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.25)',
          color: '#a78bfa',
        }}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Request Verification
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: '#0a0a18',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)',
            }}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                  style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}
                >
                  ✦ Company Verification
                </div>
                <h2 className="text-base font-bold text-white">Request company verification</h2>
                <p className="mt-1 text-xs text-slate-400 leading-5">
                  We&apos;ll send a professional email to your company contact asking them to confirm your contribution to{' '}
                  <span className="text-slate-200 font-medium">{workTitle}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {state?.success ? (
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.15)' }}>
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">Verification request sent!</p>
                  <p className="text-xs text-slate-400 mt-0.5">The company contact will receive your request by email.</p>
                </div>
              </div>
            ) : (
              <form action={action} className="space-y-4">
                <input type="hidden" name="workId" value={workId} />

                {state?.error && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm text-red-300"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    {state.error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contact name <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    name="contactName"
                    type="text"
                    defaultValue={company ?? ''}
                    placeholder="e.g. Sarah Chen, Hiring Manager"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-violet-500/50"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Company contact email <span className="text-violet-400">*</span>
                  </label>
                  <input
                    name="companyEmail"
                    type="email"
                    required
                    placeholder="hr@company.com or manager@company.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-violet-500/50"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <p className="text-[10px] text-slate-600">
                    They&apos;ll receive an email with your work details. Your email address will be set as the reply-to.
                  </p>
                </div>

                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] leading-5 text-slate-500">
                    The email will include your work title, role, description, and proof links. The contact just needs to reply confirming your contribution.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl py-2.5 text-sm text-slate-400 transition hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                  >
                    {pending ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send request →'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
