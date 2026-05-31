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
    // Small delay so it doesn't flash on load
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
      className="fixed bottom-5 left-5 right-5 z-[9999] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
      style={{ animation: 'fadeUp 0.4s ease-out both' }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        style={{
          background: 'rgba(9,9,26,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.08) inset',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '20px 22px',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Cookie icon */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <span style={{ fontSize: 15 }}>🍪</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#f8fafc' }}>We use cookies</p>
              <p className="text-[10px]" style={{ color: '#334155' }}>Your experience, your choice</p>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => accept('essential')}
            className="rounded-lg p-1.5 transition"
            style={{ color: '#334155', background: 'rgba(255,255,255,0.04)' }}
            aria-label="Dismiss"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <p className="mb-4 text-xs leading-5" style={{ color: '#475569' }}>
          ProofForge uses cookies to enhance your experience, analyse traffic, and personalise content.
          Essential cookies are always active. You can manage your preferences at any time in{' '}
          <Link href="/terms#privacy" className="underline underline-offset-2 transition hover:opacity-80" style={{ color: '#a78bfa' }}>
            Privacy Settings
          </Link>.
        </p>

        {/* What we use */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Essential',   desc: 'Auth & security',   color: '#10b981', always: true },
            { label: 'Analytics',   desc: 'Usage patterns',    color: '#7c3aed', always: false },
            { label: 'Preferences', desc: 'UI settings',       color: '#38bdf8', always: false },
          ].map((item) => (
            <div key={item.label}
              className="rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}15` }}>
              <div className="h-1.5 w-1.5 rounded-full mx-auto mb-1.5" style={{ background: item.color }} />
              <p className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>{item.label}</p>
              <p className="text-[9px] mt-0.5" style={{ color: '#334155' }}>{item.desc}</p>
              {item.always && (
                <p className="mt-1 text-[8px] font-bold uppercase tracking-wide" style={{ color: item.color }}>Always on</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => accept('essential')}
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            Essential only
          </button>
          <button
            onClick={() => accept('all')}
            className="flex-1 rounded-xl py-2.5 text-xs font-bold transition hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              border: 'none',
            }}
          >
            Accept all ✓
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-3 flex items-center justify-center gap-3 text-[10px]" style={{ color: '#1e293b' }}>
          <Link href="/terms" className="transition hover:text-slate-400">Terms</Link>
          <span>·</span>
          <Link href="/terms#privacy" className="transition hover:text-slate-400">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms#cookies" className="transition hover:text-slate-400">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
