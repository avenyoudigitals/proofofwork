'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pf_cookie_consent'
type ConsentState = 'all' | 'essential' | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | 'loading'>('loading')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
    setConsent(stored)
    if (!stored) setTimeout(() => setVisible(true), 1200)
  }, [])

  const accept = (type: 'all' | 'essential') => {
    localStorage.setItem(STORAGE_KEY, type)
    setConsent(type)
    setVisible(false)
  }

  if (consent === 'loading' || consent !== null || !visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 380,
        maxWidth: 'calc(100vw - 32px)',
        animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div
        style={{
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5' }}>Cookie preferences</p>
              <p style={{ fontSize: 12, color: '#71717a' }}>Your choice, your experience</p>
            </div>
          </div>
          <button
            onClick={() => accept('essential')}
            aria-label="Dismiss"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, marginBottom: 16 }}>
          We use cookies to keep you signed in and improve your experience.{' '}
          <Link href="/terms#privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>
            Privacy policy
          </Link>
        </p>

        {/* Cookie types */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Essential',   desc: 'Auth & security', always: true  },
            { label: 'Analytics',   desc: 'Usage insights',  always: false },
            { label: 'Preferences', desc: 'UI settings',     always: false },
          ].map((item) => (
            <div key={item.label} style={{ padding: '10px 8px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.always ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: item.always ? '#a5b4fc' : '#a1a1aa', marginBottom: 3 }}>{item.label}</p>
              <p style={{ fontSize: 10, color: '#52525b' }}>{item.desc}</p>
              {item.always && <p style={{ fontSize: 9, color: '#818cf8', marginTop: 4, fontWeight: 500 }}>Always on</p>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => accept('essential')}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: 13 }}
          >
            Essential only
          </button>
          <button
            onClick={() => accept('all')}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: 13 }}
          >
            Accept all
          </button>
        </div>

        {/* Links */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {[
            { label: 'Terms',   href: '/terms'          },
            { label: 'Privacy', href: '/terms#privacy'  },
            { label: 'Cookies', href: '/terms#cookies'  },
          ].map((l) => (
            <Link key={l.label} href={l.href} className="hover-text" style={{ fontSize: 11, color: '#52525b', textDecoration: 'none', borderRadius: 4, transition: 'color 0.15s' }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
