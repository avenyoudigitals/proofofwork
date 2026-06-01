import Link from 'next/link'
import type { Metadata } from 'next'
import { ProjectCard } from './_components/project-card'
import type { ProjectData } from './_components/project-card'
import { HeroFloatingCard } from './_components/hero-floating-card'
import { FeatureCard } from './_components/interactive-cards'
import { Navbar } from './_components/landing-nav'

export const metadata: Metadata = {
  title: 'ProofForge — Professional Verification for Developers',
  description: 'The verified proof-of-work platform. Connect your GitHub, get company-verified, and build a credible professional record.',
}

/* ── Data ─────────────────────────────────────────────────────── */
const PROJECTS: ProjectData[] = [
  { id: 1, title: 'Stripe Checkout Redesign',   description: 'End-to-end redesign of the payment flow. Reduced cart abandonment by 34% across 12M monthly users.', role: 'Product Design Lead',       tags: ['Figma', 'UX Research', 'A/B Testing'],  contributors: ['AK','SR','MJ'], company: 'Stripe', status: 'company' },
  { id: 2, title: 'Real-time Sync Engine',       description: 'Distributed CRDT sync engine handling 10k concurrent users with sub-50ms global latency.',           role: 'Senior Backend Engineer',   tags: ['Rust', 'WebSockets', 'CRDTs'],         contributors: ['TN','PK'],      company: 'Linear', status: 'company' },
  { id: 3, title: 'ML Pipeline Architecture',    description: 'Designed a 2TB/day training pipeline with 99.9% uptime, cutting training costs by 42%.',             role: 'ML Infrastructure Lead',    tags: ['PyTorch', 'Kubernetes', 'Ray'],         contributors: ['YZ','RB','CL'], company: 'OpenAI', status: 'company' },
  { id: 4, title: 'Design System v4.0',          description: '350-component library adopted by 12 product teams, reducing design-to-dev handoff by 60%.',           role: 'Design Systems Lead',       tags: ['React', 'Storybook', 'Tokens'],        contributors: ['LH','OA'],      company: 'Figma',  status: 'peer'    },
  { id: 5, title: 'Zero-Trust Auth Overhaul',    description: 'Re-architected auth across 200+ microservices. Zero CVEs post-rollout for 90M developers.',          role: 'Security Engineering Lead', tags: ['OAuth 2.1', 'OIDC', 'Go'],             contributors: ['JK','NM','FB'], company: 'GitHub', status: 'company' },
  { id: 6, title: 'Edge CDN Dashboard',          description: 'Real-time global analytics dashboard for 50M+ daily requests with sub-second P99 latency tracking.',  role: 'Full Stack Engineering',    tags: ['Next.js', 'ClickHouse', 'D3.js'],      contributors: ['PV','KT'],      company: 'Vercel', status: 'peer'    },
]

const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>,
    title: 'GitHub & Figma Integration',
    description: 'Connect your accounts and automatically surface verified commits, pull requests, and designs with cryptographic timestamps.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Company Verification',
    description: 'Verified companies co-sign your work with legal accountability. A seal from Stripe or GitHub carries real evidentiary weight.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Peer Co-signing',
    description: 'Colleagues who worked alongside you cryptographically co-sign contributions, adding trusted human verification to your record.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Reputation Score',
    description: 'An algorithmic score weighted by verification tier, contribution impact, and peer consensus — a signal employers can act on.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Cryptographic Proof',
    description: 'Every submission is timestamped and hashed. Your work record is immutable, auditable, and tamper-proof by design.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Recruiter Discovery',
    description: 'Companies search ProofForge for verified professionals matching specific skills, companies, and contribution types.',
  },
]

const STEPS = [
  { n: '01', title: 'Upload Evidence',    body: 'Submit commits, designs, case studies, or any proof of contribution. Connect GitHub or Figma to import automatically.' },
  { n: '02', title: 'Peer Co-signing',    body: 'Invite colleagues to co-sign your work. Their cryptographic signature adds a layer of trusted human verification.' },
  { n: '03', title: 'Company Seal',       body: 'Partner companies officially verify and endorse your work. Their seal carries the highest evidentiary weight.' },
]

const STATS = [
  { v: '47K+',  l: 'Verified professionals' },
  { v: '180K+', l: 'Proof submissions'       },
  { v: '2,400+',l: 'Company seals issued'    },
  { v: '98.7%', l: 'Verification accuracy'   },
]

const COMPANIES = ['Stripe', 'Linear', 'Vercel', 'OpenAI', 'GitHub', 'Figma', 'Shopify', 'Notion']

/* ── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ paddingTop: 120, paddingBottom: 96, padding: '120px 24px 96px', position: 'relative', overflow: 'hidden' }}>
        {/* Background gradient orbs */}
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 80, alignItems: 'center' }} className="lg:grid">

            {/* Left */}
            <div style={{ maxWidth: 560 }}>
              {/* Eyebrow */}
              <div style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, background: 'rgba(255,255,255,0.04)' }}>
                <span className="dot-live" />
                <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 450 }}>
                  2,400+ company verifications live
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#f4f4f5', marginBottom: 20 }}>
                The professional<br />
                verification network<br />
                <span style={{ color: '#818cf8' }}>for builders.</span>
              </h1>

              <p style={{ fontSize: 17, color: '#71717a', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Connect your GitHub, get company-verified, and build a credible work record that speaks louder than a resume. Stop claiming. Start proving.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link href="/signup" id="hero-primary" className="btn-primary" style={{ fontSize: 15, padding: '11px 22px' }}>
                  Get started for free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="#how" id="hero-secondary" className="btn-secondary" style={{ fontSize: 15, padding: '11px 22px' }}>
                  See how it works
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {[
                  'Free for individuals',
                  'No credit card required',
                  'GitHub OAuth',
                ].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#71717a' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product screenshot */}
            <div className="hidden lg:block" style={{ paddingBottom: 32 }}>
              <HeroFloatingCard />
            </div>
          </div>

          {/* Mobile card */}
          <div className="lg:hidden" style={{ marginTop: 48 }}>
            <HeroFloatingCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SOCIAL PROOF BAR
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '16px 0', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#52525b', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>
          Trusted by professionals at
        </p>
        <div style={{ display: 'flex', width: 'max-content' }} className="animate-marquee">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <div key={i} style={{ padding: '0 32px', fontSize: 14, fontWeight: 600, color: '#3f3f46', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }} className="sm:grid-cols-4">
          {STATS.map(({ v, l }, i) => (
            <div key={l} style={{ padding: '32px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6 }}>{v}</p>
              <p style={{ fontSize: 13, color: '#71717a' }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" style={{ padding: '96px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, maxWidth: 560, margin: '0 auto 64px' }}>
            <p className="label" style={{ marginBottom: 12 }}>Platform Features</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5', marginBottom: 14 }}>
              Evidence over claims
            </h2>
            <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.65 }}>
              Everything you need to build a professional record that companies can actually trust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how" style={{ padding: '96px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, maxWidth: 560, margin: '0 auto 64px' }}>
            <p className="label" style={{ marginBottom: 12 }}>How It Works</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5' }}>
              Three tiers, compounding trust
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>{step.n}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f4f4f5', marginBottom: 10, letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="label" style={{ marginBottom: 12 }}>Verified Work</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5' }}>
                Real contributions
              </h2>
            </div>
            <Link
              href="/signup"
              id="browse-all"
              className="btn-secondary hover-border"
              style={{ fontSize: 13 }}
            >
              Browse all
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 24, padding: '72px 48px', position: 'relative', overflow: 'hidden' }}>
            {/* Gradient bg */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="label" style={{ marginBottom: 16 }}>Get started today</p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.04em', color: '#f4f4f5', marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
                Your career in provable facts
              </h2>
              <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.65, maxWidth: 460, margin: '0 auto 32px' }}>
                Stop writing &ldquo;led initiative&rdquo; and hoping they believe you. Upload the PR, the design file, the metrics. Let the evidence speak.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/signup" id="cta-primary" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
                  Get started for free
                </Link>
                <Link href="/login" id="cta-secondary" className="btn-secondary" style={{ fontSize: 15, padding: '12px 24px' }}>
                  Sign in
                </Link>
              </div>

              <p style={{ marginTop: 20, fontSize: 13, color: '#52525b' }}>
                Free forever for individuals · No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a1a1aa', letterSpacing: '-0.01em' }}>ProofForge</span>
            <span style={{ fontSize: 12, color: '#3f3f46' }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
            {[
              { label: 'Privacy',  href: '/terms#privacy'  },
              { label: 'Terms',    href: '/terms'           },
              { label: 'Security', href: '#'                },
              { label: 'Docs',     href: '#'                },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hover-text"
                style={{ fontSize: 13, color: '#52525b', textDecoration: 'none', padding: '4px 12px', borderRadius: 4, transition: 'color 0.15s' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
