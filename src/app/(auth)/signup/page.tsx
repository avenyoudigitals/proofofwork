'use client'

import { signup, loginWithGitHub, loginWithGoogle } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
import Link from 'next/link'

type ActionState = { error?: string } | undefined

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signup,
    undefined
  )
  const [githubPending, setGithubPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="mt-1 text-sm text-zinc-400">Start building in seconds</p>
        </div>

        {/* GitHub OAuth */}
        <form action={loginWithGitHub} onSubmit={() => setGithubPending(true)}>
          <button
            type="submit"
            disabled={githubPending}
            className="group w-full flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 32px rgba(124,58,237,0.25)' }}
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="flex-1 text-left">
              {githubPending ? 'Redirecting to GitHub…' : 'Continue with GitHub'}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">or</span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google OAuth */}
        <form action={loginWithGoogle} onSubmit={() => setGooglePending(true)}>
          <button
            type="submit"
            disabled={googlePending}
            className="group w-full flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="flex-1 text-left">
              {googlePending ? 'Redirecting to Google…' : 'Continue with Google'}
            </span>
          </button>
        </form>

        {/* Sign up form */}
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
              placeholder="Jane Smith"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-xs text-zinc-500">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline hover:text-zinc-300">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-zinc-300">Privacy Policy</Link>.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
