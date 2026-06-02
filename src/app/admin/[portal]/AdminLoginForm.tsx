'use client'

import { useActionState, useEffect, useRef } from 'react'
import { adminLogin, type LoginState } from './login-action'

interface LoginFormProps {
  portalSlug: string
  displayName: string
  initial: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
}

export default function AdminLoginForm({
  portalSlug,
  displayName,
  initial,
  gradientFrom,
  gradientTo,
  accentColor,
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState | undefined, FormData>(
    adminLogin,
    undefined
  )
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05050f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: `radial-gradient(circle, ${accentColor}1a 0%, transparent 70%)`,
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: '10%',
          width: 500, height: 500,
          background: `radial-gradient(circle, ${accentColor}0d 0%, transparent 70%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>

        {/* ProofForge wordmark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', letterSpacing: '-0.01em' }}>
              ProofForge
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}>
          {/* Gradient header */}
          <div style={{
            padding: '36px 36px 28px',
            background: `linear-gradient(135deg, ${gradientFrom}22, ${gradientTo}15)`,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Company logo initial */}
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: initial.length > 1 ? 16 : 22,
              fontWeight: 700, color: '#fff',
              marginBottom: 20,
              boxShadow: `0 8px 24px ${accentColor}40`,
            }}>
              {initial}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
              {displayName} Portal
            </h1>
            <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
              Verification admin dashboard — sign in to continue
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '28px 36px 36px' }}>
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="hidden" name="portal" value={portalSlug} />

              {/* Error */}
              {state?.error && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10,
                  fontSize: 13, color: '#f87171',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                  {state.error}
                </div>
              )}

              {/* Username */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#a1a1aa', letterSpacing: '0.02em' }}>
                  Username
                </label>
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  id={`${portalSlug}-username`}
                  autoComplete="username"
                  required
                  placeholder="admin username"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    color: '#f4f4f5',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#a1a1aa', letterSpacing: '0.02em' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id={`${portalSlug}-password`}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    color: '#f4f4f5',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}22`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                id={`${portalSlug}-login-btn`}
                disabled={isPending}
                style={{
                  marginTop: 4,
                  padding: '13px 20px',
                  background: isPending
                    ? 'rgba(255,255,255,0.06)'
                    : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: isPending ? '#71717a' : '#fff',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: isPending ? 'none' : `0 4px 16px ${accentColor}40`,
                  letterSpacing: '-0.01em',
                }}
              >
                {isPending ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to {displayName}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p style={{ marginTop: 20, fontSize: 11, color: '#3f3f46', textAlign: 'center' }}>
              Authorized personnel only · ProofForge admin access
            </p>
          </div>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#27272a' }}>
          ProofForge · Verified Proof-of-Work Network
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </main>
  )
}
