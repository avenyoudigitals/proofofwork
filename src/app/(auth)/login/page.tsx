'use client'

import { login, loginWithGitHub, loginWithGoogle } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
import Link from 'next/link'

type ActionState = { error?: string } | undefined

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, undefined)
  const [showEmail, setShowEmail] = useState(false)
  const [githubPending, setGithubPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font)' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: '0 0 45%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '44px 56px',
          background: 'linear-gradient(145deg, #0f0c29 0%, #1a1560 45%, #2d1b69 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-5%', right: '-10%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 65%)', filter: 'blur(52px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', right: '15%', width: 180, height: 180, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%)', filter: 'blur(32px)', pointerEvents: 'none' }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(129,140,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>ProofForge</span>
          </Link>
        </div>

        {/* Center */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            Your work.<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Verified.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 44, maxWidth: 340 }}>
            Join thousands of professionals who have built verifiable, company-backed work records on ProofForge.
          </p>

          {/* Verification tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Self Claimed',     sub: 'You upload the evidence',       dot: 'rgba(255,255,255,0.3)',  glow: false },
              { label: 'Peer Verified',    sub: 'Colleagues co-sign your work',  dot: '#818cf8',                glow: true  },
              { label: 'Company Verified', sub: 'Employers officially endorse',  dot: '#10b981',                glow: true  },
            ].map((t) => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: t.dot, flexShrink: 0,
                  boxShadow: t.glow ? `0 0 10px ${t.dot}` : 'none',
                }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.label}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
            Trusted by teams at
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Stripe', 'Linear', 'Vercel', 'OpenAI', 'Figma', 'GitHub'].map((c) => (
              <span key={c} style={{
                fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                padding: '5px 12px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '-0.01em',
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
        background: '#ffffff',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 36, display: 'flex', justifyContent: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0a0a12', letterSpacing: '-0.02em' }}>ProofForge</span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0a0a12', letterSpacing: '-0.04em', marginBottom: 8 }}>
              Sign in to ProofForge
            </h1>
            <p style={{ fontSize: 14, color: '#55556e' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                Sign up for free
              </Link>
            </p>
          </div>

          {/* GitHub */}
          <form action={loginWithGitHub} onSubmit={() => setGithubPending(true)} style={{ marginBottom: 10 }}>
            <button
              id="github-login-btn"
              type="submit"
              disabled={githubPending}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '13px 20px',
                background: githubPending ? 'rgba(99,102,241,0.1)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none', borderRadius: 'var(--radius-full)',
                fontSize: 14, fontWeight: 600, color: '#fff',
                cursor: githubPending ? 'not-allowed' : 'pointer',
                opacity: githubPending ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: githubPending ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                fontFamily: 'var(--font)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {githubPending ? 'Redirecting…' : 'Continue with GitHub'}
            </button>
          </form>

          {/* Google */}
          <form action={loginWithGoogle} onSubmit={() => setGooglePending(true)} style={{ marginBottom: 24 }}>
            <button
              id="google-login-btn"
              type="submit"
              disabled={googlePending}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '13px 20px',
                background: '#fff',
                border: '1.5px solid #e5e5e8',
                borderRadius: 'var(--radius-full)',
                fontSize: 14, fontWeight: 500, color: '#0a0a12',
                cursor: googlePending ? 'not-allowed' : 'pointer',
                opacity: googlePending ? 0.7 : 1,
                transition: 'all 0.2s',
                fontFamily: 'var(--font)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googlePending ? 'Redirecting…' : 'Continue with Google'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#e5e5e8' }} />
            <span style={{ fontSize: 11, color: '#9999b2', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e5e5e8' }} />
          </div>

          {/* Email toggle */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setShowEmail((v) => !v)}
              style={{
                background: 'none', border: 'none',
                fontSize: 14, color: '#6366f1',
                cursor: 'pointer', fontFamily: 'var(--font)',
                fontWeight: 600,
                transition: 'opacity 0.15s',
              }}
            >
              {showEmail ? 'Hide email form' : 'Sign in with email →'}
            </button>
          </div>

          {showEmail && (
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {state?.error && (
                <div style={{
                  fontSize: 13, color: '#dc2626',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                  {state.error}
                </div>
              )}
              {[
                { id: 'email',    label: 'Email',    type: 'email',    placeholder: 'you@company.com', autoComplete: 'email'            },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••',        autoComplete: 'current-password' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0a0a12', marginBottom: 7 }}>
                    {f.label}
                  </label>
                  <input
                    id={f.id} name={f.id} type={f.type} autoComplete={f.autoComplete}
                    required placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '11px 14px',
                      background: '#f7f7f9',
                      border: '1.5px solid #e5e5e8',
                      borderRadius: 'var(--radius-md)',
                      color: '#0a0a12', fontSize: 14,
                      outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                      fontFamily: 'var(--font)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                      e.currentTarget.style.background = '#fff'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e8'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.background = '#f7f7f9'
                    }}
                  />
                </div>
              ))}
              <button
                id="email-login-btn"
                type="submit"
                disabled={pending}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  background: pending ? '#e5e5e8' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: 'none', borderRadius: 'var(--radius-full)',
                  fontSize: 14, fontWeight: 700,
                  color: pending ? '#9999b2' : '#fff',
                  cursor: pending ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: pending ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                  fontFamily: 'var(--font)',
                }}
              >
                {pending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          <p style={{ marginTop: 32, fontSize: 11, color: '#9999b2', textAlign: 'center', lineHeight: 1.7 }}>
            By continuing, you agree to our{' '}
            <Link href="/terms" style={{ color: '#55556e', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
            and{' '}
            <Link href="/terms#privacy" style={{ color: '#55556e', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
