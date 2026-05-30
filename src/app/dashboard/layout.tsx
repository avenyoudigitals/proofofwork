import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGitHubContributionStats } from '@/lib/github'
import { calculateReputation } from '@/lib/reputation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user, session } } = await supabase.auth.getSession()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'
  const avatar = user.user_metadata?.avatar_url as string | undefined

  // Fetch real reputation score if GitHub is connected
  const token = session?.provider_token
  let repScore = 0
  let repTierColor = '#3b82f6'
  if (token) {
    try {
      const stats = await getGitHubContributionStats(token)
      const rep   = calculateReputation(stats)
      repScore     = rep.total
      repTierColor = rep.tier.color
    } catch { /* GitHub not reachable — leave at 0 */ }
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/works',
      label: 'My Works',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/upload',
      label: 'Upload Work',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      href: '/dashboard/github',
      label: 'GitHub',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/reputation',
      label: 'Reputation',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/figma',
      label: 'Figma',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: '#05050f' }}>

      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-20 flex w-56 flex-col"
        style={{
          background: 'rgba(5,5,20,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Brand */}
        <div className="flex h-14 items-center gap-2.5 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">ProofForge</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {/* Section label */}
          <p className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-widest text-slate-600">Workspace</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div className="pt-4">
            <p className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-widest text-slate-600">Network</p>
            {[
              { label: 'Explore Projects', href: '/#projects' },
              { label: 'Companies', href: '#' },
              { label: 'Collaborators', href: '#' },
            ].map((item) => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              >
                <span className="h-1 w-1 rounded-full bg-slate-600 ml-1.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 mt-3">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} className="h-7 w-7 rounded-full" style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.4)' }} />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{displayName}</p>
              <p className="text-[10px] text-slate-500">Verified member</p>
            </div>
          </div>

          <form action={logout}>
            <button type="submit"
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 pl-56">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex h-14 items-center justify-between px-8"
          style={{ background: 'rgba(5,5,20,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition">ProofForge</Link>
            <span>/</span>
            <span className="text-slate-300">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification dot */}
            <button className="relative rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-400" />
            </button>

            <div className="h-4 w-px bg-white/10" />

            <Link
              href="/dashboard/reputation"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition hover:bg-white/5"
            >
              <span className="text-slate-400">Rep:</span>
              <span
                className="font-bold text-sm"
                style={{ color: repScore > 0 ? repTierColor : '#64748b' }}
              >
                {repScore > 0 ? repScore : (token ? '…' : '—')}
              </span>
            </Link>
          </div>
        </header>

        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
