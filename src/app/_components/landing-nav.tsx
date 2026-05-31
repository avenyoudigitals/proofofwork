'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const LOGO = (
  <div className="flex h-7 w-7 items-center justify-center rounded-full"
    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.45)' }}>
    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  </div>
)

const NAV_LINKS = ['Product', 'Companies', 'Pricing', 'Docs']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{ padding: scrolled ? '8px 24px' : '16px 24px' }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5"
        style={{
          height: 52,
          background: scrolled ? 'rgba(5,5,15,0.92)' : 'rgba(5,5,15,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          {LOGO}
          <span className="text-sm font-bold tracking-tight text-white">ProofForge</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item} href="#"
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150"
              style={{ color: '#94a3b8' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex"
            style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.18)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#34d399', animation: 'pulseDot 2s ease-in-out infinite' }} />
            47K+ verified
          </span>
          <Link href="/login" className="px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
            Sign in
          </Link>
          <Link href="/signup"
            className="inline-flex items-center justify-center"
            style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 999, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', whiteSpace: 'nowrap' }}>
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  )
}

export function IconSidebar() { return null }
export function FilterBar() { return null }
