import Link from 'next/link'
import type { Metadata } from 'next'
import { FeatureCard } from './_components/interactive-cards'
import { Navbar } from './_components/landing-nav'

export const metadata: Metadata = {
  title: 'ProofForge — Professional Verification for Developers',
  description: 'The verified proof-of-work platform. Connect your GitHub, get company-verified, and build a credible professional record.',
}

/* ── Data ──────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>,
    title: 'GitHub & Figma Integration',
    description: 'Connect your accounts and automatically surface verified commits, pull requests, and designs with cryptographic timestamps.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Company Verification',
    description: 'Verified companies co-sign your work with legal accountability. A seal from Stripe or GitHub carries real evidentiary weight.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Peer Co-signing',
    description: 'Colleagues who worked alongside you cryptographically co-sign contributions, adding trusted human verification to your record.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Reputation Score',
    description: 'An algorithmic score weighted by verification tier, contribution impact, and peer consensus — a signal employers can act on.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Cryptographic Proof',
    description: 'Every submission is timestamped and hashed. Your work record is immutable, auditable, and tamper-proof by design.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Recruiter Discovery',
    description: 'Companies search ProofForge for verified professionals matching specific skills, companies, and contribution types.',
  },
]

const STEPS = [
  { n: '01', title: 'Upload Evidence',  body: 'Submit commits, designs, case studies, or any proof of contribution. Connect GitHub or Figma to import automatically.', color: '#6366f1' },
  { n: '02', title: 'Peer Co-signing',  body: 'Invite colleagues to co-sign your work. Their cryptographic signature adds a layer of trusted human verification.', color: '#8b5cf6' },
  { n: '03', title: 'Company Seal',     body: 'Partner companies officially verify and endorse your work. Their seal carries the highest evidentiary weight.', color: '#a855f7' },
]

const STATS = [
  { v: '47K+',   l: 'Verified professionals' },
  { v: '180K+',  l: 'Proof submissions'       },
  { v: '2,400+', l: 'Company seals issued'    },
  { v: '98.7%',  l: 'Verification accuracy'   },
]

const COMPANIES = ['Stripe', 'Linear', 'Vercel', 'OpenAI', 'GitHub', 'Figma', 'Shopify', 'Notion']

const WORKS = [
  { title: 'Stripe Checkout Redesign',   role: 'Product Design Lead',       company: 'Stripe', tags: ['Figma', 'UX Research', 'A/B Testing'],  status: 'company', verifiedBy: 'Stripe'  },
  { title: 'Real-time Sync Engine',      role: 'Senior Backend Engineer',    company: 'Linear', tags: ['Rust', 'WebSockets', 'CRDTs'],           status: 'company', verifiedBy: 'Linear'  },
  { title: 'ML Pipeline Architecture',   role: 'ML Infrastructure Lead',     company: 'OpenAI', tags: ['PyTorch', 'Kubernetes', 'Ray'],           status: 'company', verifiedBy: 'OpenAI'  },
  { title: 'Design System v4.0',         role: 'Design Systems Lead',        company: 'Figma',  tags: ['React', 'Storybook', 'Tokens'],           status: 'peer',    verifiedBy: null      },
  { title: 'Zero-Trust Auth Overhaul',   role: 'Security Engineering Lead',  company: 'GitHub', tags: ['OAuth 2.1', 'OIDC', 'Go'],               status: 'company', verifiedBy: 'GitHub'  },
  { title: 'Edge CDN Dashboard',         role: 'Full Stack Engineering',     company: 'Vercel', tags: ['Next.js', 'ClickHouse', 'D3.js'],         status: 'peer',    verifiedBy: null      },
]

/* ── Page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg)', fontFamily: 'var(--font)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: 600, height: 600,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Top marquee bar */}
        <div style={{
          borderBottom: '1px solid var(--border)',
          borderTop: '1px solid var(--border)',
          padding: '11px 0', overflow: 'hidden',
          background: 'rgba(12,12,21,0.6)',
          backdropFilter: 'blur(8px)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', width: 'max-content' }} className="animate-marquee">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} style={{
                padding: '0 32px',
                fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRight: '1px solid var(--border)',
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          maxWidth: 1280, margin: '0 auto', width: '100%',
          padding: '0 32px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: 32,
            paddingTop: 80, paddingBottom: 80,
            alignItems: 'center',
          }}>

            {/* Left — headline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Live badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginBottom: 32,
                padding: '6px 14px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0, animation: 'pulseDot 2.4s ease-in-out infinite', boxShadow: '0 0 8px #10b981' }} />
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                  color: '#10b981',
                  fontFamily: 'var(--font-mono)',
                }}>
                  2,400+ company verifications live
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(48px, 6.5vw, 84px)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 0.95,
                color: 'var(--text)',
                marginBottom: 28,
              }}>
                The
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Professional</span>
                <br />
                Verification
                <br />
                <span style={{ color: 'var(--text-3)' }}>Network.</span>
              </h1>

              <p style={{
                fontSize: 16, color: 'var(--text-2)', lineHeight: 1.75,
                marginBottom: 40, maxWidth: 460,
                letterSpacing: '-0.01em',
              }}>
                Connect your GitHub, get company-verified, and build a credible work record that speaks louder than a resume. Stop claiming. Start proving.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/signup" id="hero-primary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
                  transition: 'all 0.2s',
                }}>
                  Get started free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="#how" id="hero-secondary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-2)',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  border: '1px solid var(--border-2)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(8px)',
                }}>
                  How it works
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
                {['Free for individuals', 'No credit card', 'GitHub OAuth'].map((t) => (
                  <span key={t} style={{
                    fontSize: 11, color: 'var(--text-3)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ color: '#10b981' }}>✓</span>
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — live work feed */}
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)',
            }}>
              {/* Panel header */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(99,102,241,0.04)',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                  color: '#818cf8',
                  fontFamily: 'var(--font-mono)',
                }}>
                  Live Verifications
                </span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulseDot 2.4s ease-in-out infinite', boxShadow: '0 0 8px #10b981' }} />
              </div>

              {/* Work rows */}
              <div style={{ overflowY: 'auto', maxHeight: 480 }}>
                {WORKS.map((w, i) => (
                  <div key={i} style={{
                    padding: '14px 20px',
                    borderBottom: i < WORKS.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  className="hover-row"
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                      <p style={{
                        fontSize: 12, fontWeight: 600, color: 'var(--text)',
                        letterSpacing: '-0.015em', lineHeight: 1.3, flex: 1,
                      }}>
                        {w.title}
                      </p>
                      {w.verifiedBy ? (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#10b981',
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                          textTransform: 'uppercase', flexShrink: 0,
                          border: '1px solid rgba(16,185,129,0.3)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(16,185,129,0.08)',
                        }}>
                          ✓ {w.verifiedBy}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                          textTransform: 'uppercase', flexShrink: 0,
                          border: '1px solid var(--border-2)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}>
                          PEER
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
                      {w.role} · {w.company}
                    </p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {w.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 9, padding: '2px 8px',
                          border: '1px solid var(--border)',
                          color: 'var(--text-3)',
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(255,255,255,0.02)',
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            {STATS.map(({ v, l }) => (
              <div key={l} style={{
                padding: '40px 32px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              className="hover-card"
              >
                <p style={{
                  fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #f0f0ff, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.05em', lineHeight: 1,
                  marginBottom: 10,
                }}>
                  {v}
                </p>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section id="how" style={{ padding: '80px 32px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#818cf8',
              fontFamily: 'var(--font-mono)',
              padding: '5px 14px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 20,
            }}>
              Process
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text)',
            }}>
              Three tiers,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>compounding trust.</span>
            </h2>
          </div>

          {/* Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{
                padding: '40px 36px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              className="hover-card"
              >
                {/* Step number accent */}
                <span style={{
                  fontSize: 64, fontWeight: 900, color: 'transparent',
                  letterSpacing: '-0.06em', lineHeight: 1,
                  display: 'block', marginBottom: 24,
                  fontFamily: 'var(--font-mono)',
                  WebkitTextStroke: `1px ${step.color}30`,
                }}>
                  {step.n}
                </span>
                {/* Colored top border */}
                <div style={{
                  position: 'absolute', top: 0, left: 20, right: 20, height: 2,
                  background: `linear-gradient(90deg, ${step.color}, transparent)`,
                  borderRadius: '0 0 4px 4px',
                }} />
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: 'var(--text)',
                  marginBottom: 14, letterSpacing: '-0.02em',
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA below steps */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
            }}>
              Start building →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section id="features" style={{ padding: '80px 32px 96px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#818cf8',
              fontFamily: 'var(--font-mono)',
              padding: '5px 14px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 20,
            }}>
              Platform Features
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text)',
            }}>
              Evidence{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>over claims.</span>
            </h2>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VERIFIED WORK — showcase
      ═══════════════════════════════════════════ */}
      <section id="work" style={{ padding: '80px 32px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}>
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#818cf8',
                fontFamily: 'var(--font-mono)',
                padding: '5px 14px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 20,
                display: 'block' as const,
              }}>
                Verified Work
              </span>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800,
                letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text)',
              }}>
                Real{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>contributions.</span>
              </h2>
            </div>
            <Link href="/signup" id="browse-all" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', flexShrink: 0,
              border: '1px solid var(--border-2)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-2)',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}>
              Browse all →
            </Link>
          </div>

          {/* Work rows */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}>
            {WORKS.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 0,
                borderBottom: i < WORKS.length - 1 ? '1px solid var(--border)' : 'none',
                padding: '0',
                transition: 'background 0.15s',
                position: 'relative',
              }}
              className="hover-row"
              >
                {/* Verified bar */}
                {w.verifiedBy && (
                  <div style={{ width: 3, alignSelf: 'stretch', background: 'linear-gradient(180deg, #10b981, #059669)', flexShrink: 0 }} />
                )}

                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 0,
                  padding: '20px 32px',
                }}>
                  {/* Index */}
                  <span style={{
                    fontSize: 9, color: 'var(--text-3)',
                    fontFamily: 'var(--font-mono)', flexShrink: 0,
                    width: 36,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--text)',
                      letterSpacing: '-0.02em', marginBottom: 3,
                    }}>
                      {w.title}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {w.role} · {w.company}
                    </p>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginRight: 24 }}>
                    {w.tags.slice(0, 2).map(t => (
                      <span key={t} style={{
                        fontSize: 9, padding: '2px 9px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-3)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Status */}
                  <div style={{ width: 120, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                    {w.verifiedBy ? (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: '#10b981',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(16,185,129,0.3)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16,185,129,0.08)',
                      }}>
                        ✓ {w.verifiedBy}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        border: '1px solid var(--border-2)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        Peer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 32px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            padding: '80px 64px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(168,85,247,0.05) 100%)',
            border: '1px solid var(--border-2)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background orb */}
            <div style={{
              position: 'absolute', top: '-20%', right: '-5%',
              width: 400, height: 400,
              background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 65%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{
                display: 'inline-block',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#818cf8',
                fontFamily: 'var(--font-mono)',
                padding: '5px 14px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 28,
              }}>
                Get started today
              </span>

              <h2 style={{
                fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 800,
                letterSpacing: '-0.05em', lineHeight: 1,
                color: 'var(--text)', marginBottom: 24,
              }}>
                Your career
                <br />
                in provable{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>facts.</span>
              </h2>

              <p style={{
                fontSize: 16, color: 'var(--text-2)', lineHeight: 1.75,
                maxWidth: 500, marginBottom: 40, letterSpacing: '-0.01em',
              }}>
                Stop writing &ldquo;led initiative&rdquo; and hoping they believe you. Upload the PR, the design file, the metrics. Let the evidence speak.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                <Link href="/signup" id="cta-primary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
                }}>
                  Get started for free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/login" id="cta-secondary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border-2)',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(8px)',
                }}>
                  Sign in
                </Link>
              </div>

              <span style={{
                fontSize: 10, color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
              }}>
                FREE FOREVER FOR INDIVIDUALS · NO CREDIT CARD REQUIRED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 24, height: 24,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700, color: 'var(--text-2)',
                letterSpacing: '-0.01em',
              }}>
                ProofForge
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                © 2026
              </span>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { label: 'Privacy',  href: '/terms#privacy' },
                { label: 'Terms',    href: '/terms' },
                { label: 'Security', href: '#' },
                { label: 'Docs',     href: '#' },
              ].map((l) => (
                <Link key={l.label} href={l.href} style={{
                  fontSize: 12, color: 'var(--text-3)', textDecoration: 'none',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  transition: 'color 0.15s, background 0.15s',
                }}
                className="hover-text hover-bg"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
