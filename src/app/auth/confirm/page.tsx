import Link from 'next/link'

export const metadata = {
  title: 'Check your email — Proof',
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-6">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-white">Check your email</h1>
        <p className="mt-3 text-sm text-zinc-400">
          We&apos;ve sent you a confirmation link. Click it to activate your account and get started.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          Already confirmed?{' '}
          <Link href="/login" className="font-medium text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
