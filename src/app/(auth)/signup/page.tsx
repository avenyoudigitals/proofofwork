'use client'

import { signup, loginWithGitHub, loginWithGoogle } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
import Link from 'next/link'

type ActionState = { error?: string } | undefined

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signup, undefined)
  const [githubPending, setGithubPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── Left panel — branding ────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: '0 0 44%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 52px',
          background: 'var(--surface)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orb */}
        <div style={{
          position: 'absolute', top: '25%', left: '15%',
          width: 420, height: 420,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 65%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 280, height: 280,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 65%)',
          filter: 'blur(32px)', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
              ProofForge
            </span>
          </Link>
        </div>

        {/* Center */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', color: '#f4f4f5', lineHeight: 1.2, marginBottom: 14 }}>
            Build a career<br />backed by proof.
          </h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.75, marginBottom: 36, maxWidth: 320 }}>
            Upload your contributions. Get verified by peers and employers.
            Build a profile that actually proves what you can do.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '📂', label: 'Upload proof of work', sub: 'GitHub, Figma, live demos, case studies' },
              { icon: '👥', label: 'Get peer verified',    sub: 'Colleagues co-sign your contributions' },
              { icon: '🏢', label: 'Company verified',     sub: 'Official employer endorsement on your record' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#d4d4d8', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#71717a' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['stripe.com', 'linear.app', 'vercel.com', 'openai.com', 'figma.com'].map((c) => (
              <span key={c} style={{
                fontSize: 10, color: '#52525b', padding: '3px 10px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, background: 'rgba(255,255,255,0.03)',
              }}>
                {c}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 10 }}>
            Verified by teams at these companies
          </p>
        </div>
      </div>

      {/* ── Right panel — signup form ────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle bg orb */}
        <div style={{
          position: 'absolute', top: '20%', right: '5%',
          width: 320, height: 320,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 390, position: 'relative', zIndex: 1 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 36, display: 'flex', justifyContent: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em' }}>ProofForge</span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: '#71717a' }}>
              Already have one?{' '}
              <Link href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* GitHub */}
          <form action={loginWithGitHub} onSubmit={() => setGithubPending(true)} style={{ marginBottom: 10 }}>
            <button
              id="github-signup-btn"
              type="submit"
              disabled={githubPending}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '12px 20px',
                background: githubPending
                  ? 'rgba(99,102,241,0.15)'
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none', borderRadius: 11,
                fontSize: 14, fontWeight: 600, color: '#fff',
                cursor: githubPending ? 'not-allowed' : 'pointer',
                opacity: githubPending ? 0.75 : 1,
                transition: 'all 0.15s',
                boxShadow: githubPending ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {githubPending ? 'Redirecting to GitHub…' : 'Continue with GitHub'}
            </button>
          </form>

          {/* Google */}
          <form action={loginWithGoogle} onSubmit={() => setGooglePending(true)} style={{ marginBottom: 20 }}>
            <button
              id="google-signup-btn"
              type="submit"
              disabled={googlePending}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 11,
                fontSize: 14, fontWeight: 500, color: '#d4d4d8',
                cursor: googlePending ? 'not-allowed' : 'pointer',
                opacity: googlePending ? 0.75 : 1,
                transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googlePending ? 'Redirecting to Google…' : 'Continue with Google'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 11, color: '#52525b', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Email/password form */}
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Error */}
            {state?.error && (
              <div style={{
                padding: '11px 14px', borderRadius: 9,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: 13, color: '#f87171',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
                {state.error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a1a1aa', marginBottom: 6, letterSpacing: '0.01em' }}>
                Full name
              </label>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                placeholder="Jane Smith"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9, color: '#f4f4f5', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'var(--font)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a1a1aa', marginBottom: 6, letterSpacing: '0.01em' }}>
                Email
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9, color: '#f4f4f5', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'var(--font)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a1a1aa', marginBottom: 6, letterSpacing: '0.01em' }}>
                Password
              </label>
              <input
                id="password" name="password" type="password"
                autoComplete="new-password" required minLength={8}
                placeholder="Min. 8 characters"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9, color: '#f4f4f5', fontSize: 14,
                  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'var(--font)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={pending}
              style={{
                width: '100%',
                padding: '12px 20px', marginTop: 2,
                background: pending
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                color: pending ? '#71717a' : '#fff',
                cursor: pending ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: pending ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              {pending ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>

          {/* Fine print */}
          <p style={{ marginTop: 20, fontSize: 11, color: '#52525b', textAlign: 'center', lineHeight: 1.7 }}>
            By signing up you agree to our{' '}
            <Link href="/terms" style={{ color: '#71717a', textDecoration: 'underline' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#71717a', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}
