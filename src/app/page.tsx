import Link from 'next/link'
import type { Metadata } from 'next'
import { ProjectCard, VerificationBadge } from './_components/project-card'
import type { ProjectData } from './_components/project-card'
import { HeroFloatingCard } from './_components/hero-floating-card'
import { FeatureCard } from './_components/interactive-cards'
import { Navbar } from './_components/landing-nav'

export const metadata: Metadata = {
  title: 'ProofForge — Proof of Work. Verified.',
  description: 'The verified proof-of-work platform. Showcase real contributions. Get verified by companies and peers.',
}

/* ── Data ────────────────────────────────────────────────────── */

const PROJECTS: ProjectData[] = [
  { id: 1, title: 'Stripe Checkout Redesign', description: 'End-to-end redesign of payment flow, reducing cart abandonment by 34% across 12M monthly users.', role: 'Product Design Lead', tags: ['Figma', 'UX Research', 'A/B Testing'], contributors: ['AK', 'SR', 'MJ'], company: 'Stripe', status: 'company', color: 'from-violet-500/15 to-indigo-500/5', accent: '#7c3aed' },
  { id: 2, title: 'Real-time Sync Engine', description: 'Distributed CRDT engine supporting 10k concurrent users with sub-50ms latency at global scale.', role: 'Senior Backend Engineer', tags: ['Rust', 'WebSockets', 'CRDTs'], contributors: ['TN', 'PK'], company: 'Linear', status: 'company', color: 'from-sky-500/15 to-cyan-500/5', accent: '#38bdf8' },
  { id: 3, title: 'ML Pipeline Architecture', description: 'Designed training pipeline processing 2TB/day with 99.9% uptime. Cut training costs by 42%.', role: 'ML Infrastructure Engineer', tags: ['PyTorch', 'Kubernetes', 'Ray'], contributors: ['YZ', 'RB', 'CL'], company: 'OpenAI', status: 'company', color: 'from-emerald-500/15 to-teal-500/5', accent: '#10b981' },
  { id: 4, title: 'Design System v4.0', description: '350-component library adopted across 12 product teams. Reduced design-to-dev handoff time by 60%.', role: 'Design Systems Lead', tags: ['React', 'Storybook', 'Tokens'], contributors: ['LH', 'OA'], company: 'Figma', status: 'peer', color: 'from-rose-500/15 to-pink-500/5', accent: '#f43f5e' },
  { id: 5, title: 'Zero-Trust Auth Overhaul', description: 'Re-architected auth across 200+ microservices. Zero CVEs since rollout, serving 90M developers.', role: 'Security Engineering Lead', tags: ['OAuth 2.1', 'OIDC', 'Go'], contributors: ['JK', 'NM', 'FB'], company: 'GitHub', status: 'company', color: 'from-orange-500/15 to-amber-500/5', accent: '#f59e0b' },
  { id: 6, title: 'Edge CDN Dashboard', description: 'Analytics platform visualizing 50M+ daily edge requests globally with P99 latency tracking.', role: 'Full Stack Engineering', tags: ['Next.js', 'ClickHouse', 'D3.js'], contributors: ['PV', 'KT'], company: 'Vercel', status: 'peer', color: 'from-sky-500/15 to-blue-500/5', accent: '#3b82f6' },
]

const FEATURES = [
  {
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    title: 'GitHub & Figma Integration',
    description: 'Connect your accounts and let ProofForge automatically detect and surface your real contributions — commits, PRs, designs — with cryptographic timestamps.',
    color: '#7c3aed', glow: 'rgba(124,58,237,0.2)',
  },
  {
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Company Verification',
    description: 'Verified companies officially co-sign your work. A badge from Stripe, Linear, or GitHub is worth more than any resume line — it\'s immutable evidence.',
    color: '#10b981', glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    title: 'Reputation Score',
    description: 'An algorithmic score weighted by verification tier, contribution impact, and peer consensus — giving employers a signal they can actually trust and compare.',
    color: '#f59e0b', glow: 'rgba(245,158,11,0.2)',
  },
]

const STEPS = [
  { n: '01', title: 'Upload Evidence', body: 'Submit code commits, design files, case studies, or any proof of contribution. Link your GitHub, Figma, or upload directly.', color: '#7c3aed', pale: 'rgba(124,58,237,0.1)', status: 'self' as const },
  { n: '02', title: 'Peer Co-signing', body: 'Colleagues who worked alongside you cryptographically co-sign your contributions — adding a layer of trust beyond self-reporting.', color: '#38bdf8', pale: 'rgba(56,189,248,0.1)', status: 'peer' as const },
  { n: '03', title: 'Company Seal', body: 'Partner companies officially verify and endorse your work. Their badge is backed by legal accountability and carries maximum weight.', color: '#10b981', pale: 'rgba(16,185,129,0.1)', status: 'company' as const },
]

const STATS = [
  { v: '47K+',  l: 'Verified professionals' },
  { v: '180K+', l: 'Proof submissions' },
  { v: '2,400+',l: 'Company verifications' },
  { v: '98.7%', l: 'Verification accuracy' },
]

const COMPANIES = ['Stripe', 'Linear', 'Vercel', 'OpenAI', 'GitHub', 'Figma', 'Shopify', 'Notion']

/* ── Page ────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="relative z-10 overflow-x-hidden">
      <Navbar />

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20">

        {/* Badge */}
        <div className="mb-8" style={{ animation: 'fadeUp 0.6s ease-out both' }}>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#c4b5fd',
            }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: 'rgba(124,58,237,0.25)', color: '#a78bfa' }}>✦</span>
            Company verification now live for 2,400+ companies
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl" style={{ animation: 'fadeUp 0.6s ease-out both', animationDelay: '0.1s' }}>
          <h1 className="text-6xl font-black leading-[1.04] tracking-tight sm:text-7xl lg:text-8xl" style={{ letterSpacing: '-0.03em' }}>
            <span style={{ color: '#f8fafc' }}>Your Work.</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #818cf8 70%, #67e8f9 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verified.</span>
          </h1>
        </div>

        {/* Sub */}
        <p className="mt-7 max-w-lg text-center text-base leading-7" style={{ color: '#64748b', animation: 'fadeUp 0.6s ease-out both', animationDelay: '0.2s' }}>
          The professional network where contributions are{' '}
          <span style={{ color: '#94a3b8' }}>cryptographically proven</span> and{' '}
          <span style={{ color: '#94a3b8' }}>company-verified</span> — not just claimed.
          Stop writing words. Start showing receipts.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row" style={{ animation: 'fadeUp 0.6s ease-out both', animationDelay: '0.3s' }}>
          <Link href="/signup"
            className="inline-flex items-center justify-center gap-2"
            style={{ padding: '13px 28px', fontSize: 14, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 999, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload Your Work — Free
          </Link>
          <Link href="#how"
            className="inline-flex items-center justify-center gap-2"
            style={{ padding: '13px 28px', fontSize: 14, fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, textDecoration: 'none', boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset', whiteSpace: 'nowrap' }}>
            See how it works
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6" style={{ animation: 'fadeUp 0.6s ease-out both', animationDelay: '0.4s' }}>
          {STATS.map((s, i) => (
            <div key={s.l} className="flex items-center gap-2">
              {i > 0 && <div className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
              <span className="text-sm font-bold" style={{ color: '#f8fafc' }}>{s.v}</span>
              <span className="text-sm" style={{ color: '#475569' }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Hero visual */}
        <div className="mt-20 w-full max-w-5xl" style={{ animation: 'fadeUp 0.6s ease-out both', animationDelay: '0.5s' }}>
          <HeroFloatingCard />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUSTED BY
      ════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
              Trusted by engineers at world-class companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {COMPANIES.map((c) => (
                <span key={c} className="text-sm font-bold transition-colors" style={{ color: '#334155' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>Why ProofForge</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Evidence over claims.
            </h2>
            <p className="mt-4 text-sm leading-7" style={{ color: '#475569' }}>
              Three tools that replace empty LinkedIn bullet points with irrefutable proof.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section id="how" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>Three Tiers of Truth</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Evidence compounds.
            </h2>
            <p className="mt-4 text-sm" style={{ color: '#475569' }}>
              Each tier adds weight. Company-verified work is undeniable.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="relative rounded-2xl p-7"
                style={{
                  background: 'rgba(255,255,255,0.028)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
                }}
              >
                {/* Step connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-2.5 top-10 hidden h-px w-5 sm:block"
                    style={{ background: 'rgba(255,255,255,0.1)' }} />
                )}
                {/* Number */}
                <div className="mb-5 text-xs font-black uppercase tracking-widest" style={{ color: step.color, opacity: 0.7 }}>
                  Step {step.n}
                </div>
                {/* Icon circle */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: step.pale, border: `1px solid ${step.color}25` }}>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: step.color }} />
                </div>
                <h3 className="mb-2 text-base font-bold" style={{ color: '#f8fafc' }}>{step.title}</h3>
                <p className="mb-5 text-xs leading-6" style={{ color: '#475569' }}>{step.body}</p>
                <VerificationBadge status={step.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PROJECTS GRID
      ════════════════════════════════════════════ */}
      <section id="projects" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>Verified Work</p>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Real contributions.
                <br />
                <span style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #818cf8 70%, #67e8f9 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verified.</span>
              </h2>
            </div>
            <Link href="/signup"
              className="inline-flex items-center justify-center shrink-0"
              style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '10px 20px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Browse all projects →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SOCIAL PROOF / QUOTE
      ════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div
            className="relative overflow-hidden rounded-3xl p-10 sm:p-14"
            style={{
              background: 'linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(79,70,229,0.08) 50%, rgba(16,185,129,0.06) 100%)',
              border: '1px solid rgba(124,58,237,0.2)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
            }}
          >
            {/* BG glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)' }} />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>For Professionals</p>
                <h2 className="mb-5 text-3xl font-black leading-tight" style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Your career in{' '}
                  <span style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #818cf8 70%, #67e8f9 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>provable facts.</span>
                </h2>
                <p className="mb-8 text-sm leading-7" style={{ color: '#475569' }}>
                  Stop writing &ldquo;I led this initiative&rdquo; and hoping they believe you.
                  Upload the PR, the design file, the metrics dashboard. Let the evidence speak.
                </p>
                <Link href="/signup"
                  className="inline-flex items-center justify-center"
                  style={{ padding: '12px 24px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 999, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', whiteSpace: 'nowrap' }}>
                  Build your proof profile →
                </Link>
              </div>

              {/* Mini stat cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Reputation Score', val: '847', sub: 'Top 4% globally', color: '#7c3aed' },
                  { label: 'Verified Works', val: '23', sub: '+3 this month', color: '#10b981' },
                  { label: 'Company Seals', val: '7', sub: 'Stripe, GitHub…', color: '#38bdf8' },
                  { label: 'Collaborators', val: '34', sub: 'Across all works', color: '#f59e0b' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}20` }}>
                    <div className="text-2xl font-black" style={{ color: '#f8fafc' }}>{s.val}</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: s.color }}>{s.label}</div>
                    <div className="mt-0.5 text-[10px]" style={{ color: '#334155' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="relative overflow-hidden rounded-3xl px-10 py-20"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
              boxShadow: '0 24px 80px rgba(124,58,237,0.45)',
            }}
          >
            {/* Noise / glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
            <div className="relative">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">Get Started Today</p>
              <h2 className="mb-5 text-5xl font-black leading-tight text-white" style={{ letterSpacing: '-0.02em' }}>
                Prove it.
                <br />
                Get hired.
              </h2>
              <p className="mx-auto mb-10 max-w-md text-sm leading-7 text-white/65">
                Join 47,000+ professionals who swapped claims for cryptographic proof. Free forever for individuals.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#fff', color: '#4f46e5', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  Upload Your Work — Free
                </Link>
                <Link href="/login"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white/80 transition hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  Sign in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="relative z-10 px-6 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">ProofForge</span>
            <span className="text-xs ml-2" style={{ color: '#1e293b' }}>© 2026</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: 'Privacy',   href: '/terms#privacy' },
              { label: 'Terms',     href: '/terms' },
              { label: 'Cookies',   href: '/terms#cookies' },
              { label: 'Security',  href: '#' },
              { label: 'Docs',      href: '#' },
              { label: 'Blog',      href: '#' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs transition" style={{ color: '#334155' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
