'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#work', label: 'Work' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 60,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
      }}>

        {/* Left nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-2)',
              textDecoration: 'none', padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              transition: 'color 0.15s, background 0.15s',
            }} className="nav-link">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Center logo */}
        <Link href="/" style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          textDecoration: 'none', display: 'flex', alignItems: 'center',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: 'var(--text)',
            letterSpacing: '-0.03em',
          }}>
            ProofForge
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 500, color: 'var(--text-2)',
            textDecoration: 'none', padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            transition: 'color 0.15s, background 0.15s',
          }} className="nav-link">
            Sign in
          </Link>
          <Link href="/signup" id="nav-cta" style={{
            fontSize: 13, fontWeight: 700, color: '#fff',
            textDecoration: 'none', padding: '8px 20px',
            background: '#0a0a12',
            borderRadius: 'var(--radius-full)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
