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
          fontFamily: 'var(--font)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.01em',
          color: 'var(--text-2)',
          border: '1px solid var(--border-2)',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
          e.currentTarget.style.color = '#a5b4fc'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.borderColor = 'var(--border-2)'
          e.currentTarget.style.color = 'var(--text-2)'
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Request Verification
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border-2)',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              padding: 28,
            }}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}
                >
                  ✦ Company Verification
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.025em' }}>
                  Request company verification
                </h2>
                <p style={{ marginTop: 6, fontSize: 13, color: 'var(--text-2)', lineHeight: '1.6' }}>
                  Send a professional email to your company contacts asking them to verify{' '}
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>{workTitle}</span>.
                  {rows.length > 1 && (
                    <span style={{ marginLeft: 4, color: '#a78bfa', fontWeight: 500 }}>
                      {rows.length} contacts will be emailed.
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid var(--border-2)',
                  background: 'transparent',
                  color: 'var(--text-2)',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {isSuccess ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderRadius: 12,
                  border: '1px solid rgba(34,197,94,0.25)',
                  background: 'rgba(34,197,94,0.08)',
                  padding: '16px',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, flexShrink: 0,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  color: '#4ade80',
                  fontSize: 14, fontWeight: 700,
                }}>
                  ✓
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#4ade80' }}>
                    {successCount === 1
                      ? 'Verification request sent!'
                      : `${successCount} verification requests sent!`}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(74,222,128,0.7)', marginTop: 2 }}>
                    {successCount === 1
                      ? 'The company contact will receive your request by email.'
                      : "All company contacts have been emailed. You'll be notified when they respond."}
                  </p>
                  {state?.partialError && (
                    <p style={{ fontSize: 12, color: '#fbbf24', marginTop: 8 }}>{state.partialError}</p>
                  )}
                </div>
              </div>
            ) : (
              <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="hidden" name="workId" value={workId} />
                <input type="hidden" name="rowCount" value={rows.length} />

                {state?.error && (
                  <div style={{
                    borderRadius: 10,
                    border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)',
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#fca5a5',
                  }}>
                    {state.error}
                  </div>
                )}

                {/* Company rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rows.map((row, idx) => (
                    <div
                      key={row.id}
                      style={{
                        borderRadius: 12,
                        padding: 16,
                        border: '1px solid var(--border-2)',
                        background: 'var(--card-2)',
                      }}
                    >
                      {/* Row number + remove */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>
                          Contact {rows.length > 1 ? idx + 1 : ''}
                        </span>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              borderRadius: 6, padding: '2px 8px',
                              fontSize: 10, color: 'var(--text-3)',
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              transition: 'color 0.15s, background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Contact name */}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.02em' }}>
                          Contact name <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          name={`contactName_${idx}`}
                          type="text"
                          value={row.contactName}
                          onChange={e => updateRow(row.id, 'contactName', e.target.value)}
                          defaultValue={idx === 0 ? (company ?? '') : ''}
                          placeholder="e.g. Sarah Chen, Hiring Manager"
                          style={{ width: '100%', padding: '8px 12px' }}
                        />
                      </div>

                      {/* Company email */}
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.02em' }}>
                          Company contact email <span style={{ color: 'var(--amber)' }}>*</span>
                        </label>
                        <input
                          name={`companyEmail_${idx}`}
                          type="email"
                          required
                          value={row.companyEmail}
                          onChange={e => updateRow(row.id, 'companyEmail', e.target.value)}
                          placeholder="hr@company.com or manager@company.com"
                          style={{ width: '100%', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add another company button */}
                <button
                  type="button"
                  onClick={addRow}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    borderRadius: 10,
                    border: '1px dashed var(--border-2)',
                    padding: '10px 0',
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--text-3)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another company contact
                </button>

                {/* Info note */}
                <div style={{
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <svg style={{ marginTop: 1, flexShrink: 0, color: 'var(--text-3)' }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ fontSize: 11, lineHeight: '1.7', color: 'var(--text-3)' }}>
                    Each contact will receive an email with your work title, role, description, and proof links.
                    You&apos;ll get a return email when they approve or decline. Only one approval is needed to mark the work as Company Verified.
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: '1px solid var(--border-2)',
                      padding: '10px 0',
                      fontSize: 13, fontWeight: 500,
                      color: 'var(--text-2)',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    style={{
                      flex: 1,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      borderRadius: 10,
                      border: 'none',
                      padding: '10px 0',
                      fontSize: 13, fontWeight: 600,
                      color: '#fff',
                      background: pending ? 'var(--indigo-h)' : 'var(--indigo)',
                      cursor: pending ? 'not-allowed' : 'pointer',
                      opacity: pending ? 0.7 : 1,
                      transition: 'background 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { if (!pending) { e.currentTarget.style.background = 'var(--indigo-h)'; e.currentTarget.style.boxShadow = '0 4px 16px var(--indigo-glow)' } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--indigo)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {pending ? (
                      <>
                        <span style={{
                          width: 13, height: 13, borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spin 0.7s linear infinite',
                          display: 'inline-block',
                        }} />
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
