import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/dashboard/works',
    label: 'My Work',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/upload',
    label: 'Upload',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/github',
    label: 'GitHub',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/reputation',
    label: 'Reputation',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'
  const avatar = user.user_metadata?.avatar_url as string | undefined
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 220,
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 20,
      }}>

        {/* Brand */}
        <div style={{
          height: 56, display: 'flex', alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            {/* Sharp logo mark */}
            <div style={{
              width: 22, height: 22, flexShrink: 0,
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                <path d="M9 12l2 2 4-4" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700, color: 'var(--text)',
              letterSpacing: '-0.01em', fontFamily: 'var(--font)',
            }}>
              ProofForge
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {/* Section label */}
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-3)',
            padding: '0 20px', marginBottom: 8,
            fontFamily: 'var(--font-mono)',
          }}>
            Workspace
          </p>

          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 20px',
                fontSize: 13, fontWeight: 450, color: 'var(--text-2)',
                textDecoration: 'none',
                borderRadius: 0,
                transition: 'color 0.15s, background 0.1s',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ color: 'inherit', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 20px', marginBottom: 4,
          }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} style={{
                width: 28, height: 28, borderRadius: 0,
                border: '1px solid var(--border-2)', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                background: 'var(--card-3)',
                border: '1px solid var(--border-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
              }}>
                {initials}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}>
                {displayName}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                member
              </p>
            </div>
          </div>

          <form action={logout}>
            <button type="submit" className="nav-link" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '6px 20px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 450, color: 'var(--text-3)',
              borderRadius: 0, transition: 'color 0.15s, background 0.1s',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, paddingLeft: 220 }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 10, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              ProofForge
            </span>
            <span style={{ color: 'var(--border-2)', fontSize: 12 }}>·</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-2)',
              fontFamily: 'var(--font-mono)',
            }}>
              Dashboard
            </span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Notification bell */}
            <button
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, position: 'relative',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 0, cursor: 'pointer', color: 'var(--text-3)',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              aria-label="Notifications"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" />
              </svg>
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 4, height: 4, borderRadius: '50%', background: '#6366f1',
              }} />
            </button>

            {/* Avatar */}
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} style={{
                width: 28, height: 28, borderRadius: 0,
                border: '1px solid var(--border-2)',
              }} />
            ) : (
              <div style={{
                width: 28, height: 28,
                background: 'var(--card-3)',
                border: '1px solid var(--border-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
              }}>
                {initials}
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: '40px 36px' }}>{children}</main>
      </div>
    </div>
  )
}
