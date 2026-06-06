'use client'

import Link from 'next/link'

const NAV = [
  { href: '#how',      label: 'How it works' },
  { href: '#features', label: 'Features'     },
  { href: '#work',     label: 'Work'         },
]

export function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 64,
      display: 'flex', alignItems: 'center',
      background: 'rgba(5,5,10,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,92,246,0.1)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            fontSize: 15, fontWeight: 700, color: 'var(--text)',
            letterSpacing: '-0.02em', fontFamily: 'var(--font)',
          }}>
            ProofForge
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: '6px 14px',
                fontSize: 13, fontWeight: 500,
                color: 'var(--text-2)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-full)',
                transition: 'color 0.15s, background 0.15s',
              }}
              className="nav-link"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 500, color: 'var(--text-2)',
            textDecoration: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            transition: 'color 0.15s',
          }}
          className="hover-text"
          >
            Sign in
          </Link>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '-0.01em',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88'
            ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.55)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = '1'
            ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'
          }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
