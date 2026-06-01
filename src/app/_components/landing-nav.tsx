import Link from 'next/link'

const NAV = [
  { href: '#how',      label: 'How it works' },
  { href: '#features', label: 'Features'     },
  { href: '#pricing',  label: 'Pricing'      },
]

export function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 60,
      display: 'flex', alignItems: 'center',
      background: 'rgba(9,9,11,0.8)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
            ProofForge
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden sm:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover-text hover-bg"
              style={{
                padding: '6px 12px',
                fontSize: 14,
                color: '#a1a1aa',
                textDecoration: 'none',
                borderRadius: 6,
                transition: 'color 0.15s, background 0.15s',
                fontWeight: 450,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            href="/login"
            className="hover-text"
            style={{ padding: '7px 14px', fontSize: 14, color: '#a1a1aa', textDecoration: 'none', fontWeight: 450, transition: 'color 0.15s', borderRadius: 6 }}
          >
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '7px 16px', fontSize: 14 }}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
