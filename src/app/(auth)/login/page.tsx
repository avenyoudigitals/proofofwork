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
    <div className="min-h-screen flex" style={{
      background: '#05050f',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(124,58,237,0.18) 0%, transparent 65%)' }} />

      {/* ── LEFT: Branding ── */}
      <div
        className="relative z-10 hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{
          background: 'rgba(9,9,26,0.8)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">ProofForge</span>
        </div>

        {/* Quote */}
        <div>
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#a78bfa', animation: 'pulseDot 2s ease-in-out infinite' }} />
            47,000+ verified professionals
          </div>

          <h2 className="text-3xl font-black leading-tight text-white mb-5" style={{ letterSpacing: '-0.02em' }}>
            &ldquo;Professional evidence
            <br />
            over empty claims.
            <br />
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Finally.</span>&rdquo;
          </h2>
          <p className="text-sm leading-7" style={{ color: '#334155' }}>
            Join engineers, designers, and builders at companies like Stripe, Linear, and Vercel who prove their impact with verified evidence — not LinkedIn bullet points.
          </p>

          {/* Tier cards */}
          <div className="mt-8 space-y-2.5">
            {[
              { label: 'Self Claimed',     sub: 'You upload the evidence',   color: '#334155', bg: 'rgba(255,255,255,0.03)' },
              { label: 'Peer Verified',    sub: 'Colleagues co-sign',        color: '#818cf8', bg: 'rgba(79,70,229,0.08)'   },
              { label: 'Company Verified', sub: 'Employers officially seal', color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
            ].map((tier) => (
              <div key={tier.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: tier.bg, border: `1px solid ${tier.color}18` }}>
                <div className="h-2 w-2 rounded-full shrink-0" style={{ background: tier.color }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: tier.color }}>{tier.label}</p>
                  <p className="text-[10px]" style={{ color: '#1e293b' }}>{tier.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div>
          <p className="mb-3 text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#1e293b' }}>
            Verified by teams at
          </p>
          <div className="flex flex-wrap gap-2">
            {['Stripe', 'Linear', 'Vercel', 'OpenAI', 'Figma', 'GitHub'].map((c) => (
              <span key={c}
                className="rounded-full px-3 py-1 text-[10px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#334155', border: '1px solid rgba(255,255,255,0.07)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Auth form ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">ProofForge</span>
          </div>

          <h1 className="mb-1 text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p className="mb-8 text-sm" style={{ color: '#334155' }}>Sign in to your verified workspace</p>

          {/* GitHub — PRIMARY */}
          <form action={loginWithGitHub} onSubmit={() => setGithubPending(true)}>
            <button id="github-login-btn" type="submit" disabled={githubPending}
              className="w-full flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.1) inset' }}>
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="flex-1 text-left">{githubPending ? 'Redirecting…' : 'Continue with GitHub'}</span>
              {!githubPending && (
                <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#1e293b' }}>or</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Google */}
          <form action={loginWithGoogle} onSubmit={() => setGooglePending(true)}>
            <button id="google-login-btn" type="submit" disabled={googlePending}
              className="w-full flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset' }}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="flex-1 text-left">{googlePending ? 'Redirecting…' : 'Continue with Google'}</span>
              {!googlePending && (
                <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-4 rounded-xl px-4 py-3.5 space-y-2"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['Access your verified contribution history', 'Browse and import GitHub repositories', 'One-click sign-in — no password needed'].map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>✓</span>
                <span className="text-xs" style={{ color: '#334155' }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Email toggle */}
          <div className="mt-5 text-center">
            <button type="button" onClick={() => setShowEmail((v) => !v)}
              className="text-xs transition" style={{ color: '#334155' }}>
              {showEmail ? '↑ Hide' : 'Sign in with email instead'}
            </button>
          </div>

          {showEmail && (
            <div className="mt-4">
              <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <form action={formAction} className="space-y-4">
                {state?.error && (
                  <div className="rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: 'rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.06)', color: '#f43f5e' }}>
                    {state.error}
                  </div>
                )}
                {[
                  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
                  { id: 'password', label: 'Password', type: 'password', autoComplete: 'current-password', placeholder: '••••••••' },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                    <input id={f.id} name={f.id} type={f.type} autoComplete={f.autoComplete} required
                      className="w-full rounded-xl px-4 py-3 text-sm transition"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f8fafc' }}
                      placeholder={f.placeholder} />
                  </div>
                ))}
                <button id="email-login-btn" type="submit" disabled={pending}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50"
                  style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                  {pending ? 'Signing in…' : 'Sign in with email'}
                </button>
              </form>
            </div>
          )}

          <p className="mt-8 text-center text-xs" style={{ color: '#1e293b' }}>
            No account?{' '}
            <Link href="/signup" className="font-semibold transition hover:text-violet-400" style={{ color: '#7c3aed' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
