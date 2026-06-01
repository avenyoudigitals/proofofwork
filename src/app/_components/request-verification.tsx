'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendVerificationRequest } from '@/app/actions/verification'
import type { VerificationRequestState } from '@/app/actions/verification'

interface Props {
  workId: string
  workTitle: string
  company?: string | null
}

interface ContactRow {
  id: number
  contactName: string
  companyEmail: string
}

let _nextId = 1
function nextId() { return _nextId++ }

export function RequestVerificationButton({ workId, workTitle, company }: Props) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [state, action, pending] = useActionState<VerificationRequestState | undefined, FormData>(
    sendVerificationRequest,
    undefined
  )
  const [rows, setRows] = useState<ContactRow[]>([
    { id: nextId(), contactName: '', companyEmail: '' },
  ])

  // Reset rows when modal opens
  function openModal() {
    setRows([{ id: nextId(), contactName: '', companyEmail: '' }])
    setOpen(true)
  }

  // Close on success after a moment
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => setOpen(false), 2500)
      return () => clearTimeout(t)
    }
  }, [state])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function addRow() {
    setRows(r => [...r, { id: nextId(), contactName: '', companyEmail: '' }])
  }

  function removeRow(id: number) {
    setRows(r => r.filter(x => x.id !== id))
  }

  function updateRow(id: number, field: keyof Omit<ContactRow, 'id'>, value: string) {
    setRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  const successCount = state?.successCount ?? 0
  const isSuccess = state?.success

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openModal}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#d97706',
          border: '1px solid #d97706',
          background: '#fef3c7',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#fde68a' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fef3c7' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="square" />
        </svg>
        Request Verification
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(14,13,11,0.7)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{
              background: '#fff',
              border: '2px solid #0e0d0b',
              boxShadow: '8px 8px 0 #0e0d0b',
              padding: 28,
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
                  Send a professional email to your company contacts asking them to verify{' '}
                  <span className="text-slate-200 font-medium">{workTitle}</span>.
                  {rows.length > 1 && (
                    <span className="ml-1 text-violet-400 font-medium">
                      {rows.length} contacts will be emailed.
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-200/50 hover:text-stone-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {isSuccess ? (
              <div
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {successCount === 1
                      ? 'Verification request sent!'
                      : `${successCount} verification requests sent!`}
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {successCount === 1
                      ? 'The company contact will receive your request by email.'
                      : 'All company contacts have been emailed. You\'ll be notified when they respond.'}
                  </p>
                  {state?.partialError && (
                    <p className="text-xs text-amber-700 mt-2">{state.partialError}</p>
                  )}
                </div>
              </div>
            ) : (
              <form action={action} className="space-y-4">
                <input type="hidden" name="workId" value={workId} />
                <input type="hidden" name="rowCount" value={rows.length} />

                {state?.error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                    {state.error}
                  </div>
                )}

                {/* Company rows */}
                <div className="space-y-3">
                  {rows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="rounded-xl p-4 relative border border-stone-200 bg-white"
                    >
                      {/* Row number + remove */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          Contact {rows.length > 1 ? idx + 1 : ''}
                        </span>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-stone-400 transition hover:text-red-600 hover:bg-red-50"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Contact name */}
                      <div className="space-y-1.5 mb-3">
                        <label className="block text-xs font-semibold text-stone-700">
                          Contact name <span className="text-stone-400">(optional)</span>
                        </label>
                        <input
                          name={`contactName_${idx}`}
                          type="text"
                          value={row.contactName}
                          onChange={e => updateRow(row.id, 'contactName', e.target.value)}
                          defaultValue={idx === 0 ? (company ?? '') : ''}
                          placeholder="e.g. Sarah Chen, Hiring Manager"
                          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-500"
                        />
                      </div>

                      {/* Company email */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-700">
                          Company contact email <span className="text-amber-600">*</span>
                        </label>
                        <input
                          name={`companyEmail_${idx}`}
                          type="email"
                          required
                          value={row.companyEmail}
                          onChange={e => updateRow(row.id, 'companyEmail', e.target.value)}
                          placeholder="hr@company.com or manager@company.com"
                          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add another company button */}
                <button
                  type="button"
                  onClick={addRow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 py-2.5 text-xs font-bold text-stone-500 transition hover:border-stone-400 hover:text-stone-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another company contact
                </button>

                {/* Info note */}
                <div className="rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 flex items-start gap-2.5">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] leading-5 text-stone-600">
                    Each contact will receive an email with your work title, role, description, and proof links.
                    You&apos;ll get a return email when they approve or decline. Only one approval is needed to mark the work as Company Verified.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm text-stone-600 transition hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:opacity-50"
                  >
                    {pending ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending…
                      </>
                    ) : (
                      rows.length > 1
                        ? `Send ${rows.length} requests →`
                        : 'Send request →'
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
