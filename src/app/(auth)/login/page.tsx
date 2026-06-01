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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── Left — branding ── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: '0 0 45%', flexDirection: 'column', justifyContent: 'space-between',
          padding: '40px 56px',
          background: 'var(--surface)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Gradient orb */}
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em' }}>ProofForge</span>
          </Link>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: '#f4f4f5', lineHeight: 1.15, marginBottom: 16 }}>
            Your work.<br />Verified.
          </h2>
          <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            Join 47,000+ professionals who have built verifiable, company-backed work records on ProofForge.
          </p>

          {/* Verification tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Self Claimed',     sub: 'You upload the evidence',       dot: '#52525b' },
              { label: 'Peer Verified',    sub: 'Colleagues co-sign your work',  dot: '#818cf8' },
              { label: 'Company Verified', sub: 'Employers officially endorse',  dot: '#22c55e' },
            ].map((t) => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#d4d4d8' }}>{t.label}</p>
                  <p style={{ fontSize: 12, color: '#71717a' }}>{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['stripe.com', 'linear.app', 'vercel.com', 'openai.com', 'figma.com', 'github.com'].map((c) => (
              <span key={c} style={{ fontSize: 11, color: '#52525b', padding: '3px 10px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, background: 'rgba(255,255,255,0.03)' }}>
                {c}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 12 }}>
            Verified by teams at these companies
          </p>
        </div>
      </div>

      {/* ── Right — auth form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 36 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em' }}>ProofForge</span>
            </Link>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Sign in to ProofForge
            </h1>
            <p style={{ fontSize: 14, color: '#71717a' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>
                Sign up for free
              </Link>
            </p>
          </div>

          {/* GitHub primary */}
          <form action={loginWithGitHub} onSubmit={() => setGithubPending(true)} style={{ marginBottom: 10 }}>
            <button
              id="github-login-btn"
              type="submit"
              disabled={githubPending}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14, opacity: githubPending ? 0.7 : 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
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
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14, opacity: googlePending ? 0.7 : 1 }}
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
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: '#52525b' }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          {/* Email toggle */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setShowEmail((v) => !v)}
              style={{ background: 'none', border: 'none', fontSize: 14, color: '#71717a', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'color 0.15s' }}
              className="hover-text"
            >
              {showEmail ? 'Hide email form' : 'Sign in with email →'}
            </button>
          </div>

          {showEmail && (
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {state?.error && (
                <div style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 14px', borderRadius: 8 }}>
                  {state.error}
                </div>
              )}
              {[
                { id: 'email',    label: 'Email',    type: 'email',    placeholder: 'you@company.com',  autoComplete: 'email'            },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••',         autoComplete: 'current-password' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#a1a1aa', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    id={f.id} name={f.id} type={f.type} autoComplete={f.autoComplete}
                    required placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </div>
              ))}
              <button
                id="email-login-btn"
                type="submit"
                disabled={pending}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: pending ? 0.7 : 1 }}
              >
                {pending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          <p style={{ marginTop: 32, fontSize: 12, color: '#3f3f46', textAlign: 'center', lineHeight: 1.6 }}>
            By continuing, you agree to our{' '}
            <Link href="/terms" style={{ color: '#71717a', textDecoration: 'none' }}>Terms of Service</Link>{' '}
            and{' '}
            <Link href="/terms#privacy" style={{ color: '#71717a', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
