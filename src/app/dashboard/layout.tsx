import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'
  const avatar = user.user_metadata?.avatar_url as string | undefined

  const navItems = [
    { href: '/dashboard', label: 'Overview', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { href: '/dashboard/works', label: 'My Works', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/dashboard/upload', label: 'Upload Work', d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { href: '/dashboard/reputation', label: 'Reputation', d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { href: '/dashboard/github', label: 'GitHub', d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z', fill: true },
    { href: '/dashboard/figma', label: 'Figma', d: 'M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z', fill: true },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: '#05050f' }}>

      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-20 flex w-52 flex-col"
        style={{
          background: 'rgba(9,9,26,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Brand */}
        <div className="flex h-14 items-center gap-2.5 px-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">ProofForge</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#1e293b' }}>Workspace</p>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150"
              style={{ color: '#334155' }}>
              <svg className="h-4 w-4 shrink-0" fill={item.fill ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke={item.fill ? 'none' : 'currentColor'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.d} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} className="h-7 w-7 rounded-full"
                style={{ boxShadow: '0 0 0 2px rgba(124,58,237,0.3)' }} />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{displayName}</p>
              <p className="text-[10px]" style={{ color: '#334155' }}>Verified member</p>
            </div>
          </div>

          <form action={logout}>
            <button type="submit"
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs transition"
              style={{ color: '#334155' }}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 pl-52">
        <header
          className="sticky top-0 z-10 flex h-14 items-center justify-between px-8"
          style={{
            background: 'rgba(5,5,15,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
            <Link href="/" className="transition-colors hover:text-white">ProofForge</Link>
            <span style={{ color: '#1e293b' }}>/</span>
            <span style={{ color: '#64748b' }}>Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-lg p-2 transition"
              style={{ color: '#334155', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                style={{ background: '#7c3aed', animation: 'pulseDot 2s ease-in-out infinite' }} />
            </button>

            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} className="h-7 w-7 rounded-full"
                style={{ boxShadow: '0 0 0 2px rgba(124,58,237,0.3)' }} />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                {displayName[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
