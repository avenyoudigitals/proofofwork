import Link from 'next/link'
import type { Metadata } from 'next'
import { ProjectCard, VerificationBadge } from './_components/project-card'
import type { ProjectData } from './_components/project-card'
import { HeroFloatingCard } from './_components/hero-floating-card'

export const metadata: Metadata = {
  title: 'ProofForge — Proof of Work. Verified.',
  description:
    'A professional network where designers, developers, and students showcase verified contributions and real-world work.',
}

/* ─────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                       */
/* ─────────────────────────────────────────────────────────────── */

const PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: 'Stripe Checkout Redesign',
    description: 'End-to-end redesign of payment flow reducing drop-off by 34%.',
    role: 'Product Design',
    tags: ['Figma', 'UX Research', 'A/B Testing'],
    contributors: ['AK', 'SR', 'MJ'],
    company: 'Stripe',
    status: 'company' as const,
    color: 'from-violet-500/20 to-indigo-500/10',
    accent: '#7c3aed',
  },
  {
    id: 2,
    title: 'Real-time Sync Engine',
    description: 'Built distributed CRDT engine supporting 10k concurrent users.',
    role: 'Full Stack Engineering',
    tags: ['Rust', 'WebSockets', 'CRDT'],
    contributors: ['TN', 'PK'],
    company: 'Linear',
    status: 'company' as const,
    color: 'from-blue-500/20 to-cyan-500/10',
    accent: '#3b82f6',
  },
  {
    id: 3,
    title: 'ML Pipeline Architecture',
    description: 'Designed scalable training pipeline processing 2TB/day on-prem.',
    role: 'ML Engineering',
    tags: ['Python', 'Kubernetes', 'PyTorch'],
    contributors: ['YZ', 'RB', 'CL', 'DW'],
    company: 'OpenAI',
    status: 'company' as const,
    color: 'from-emerald-500/20 to-teal-500/10',
    accent: '#10b981',
  },
  {
    id: 4,
    title: 'Design System v4.0',
    description: 'Shipped enterprise component library used across 12 product teams.',
    role: 'UI / Design Systems',
    tags: ['React', 'Storybook', 'Tokens'],
    contributors: ['LH', 'OA'],
    company: 'Figma',
    status: 'peer' as const,
    color: 'from-pink-500/20 to-rose-500/10',
    accent: '#ec4899',
  },
  {
    id: 5,
    title: 'Zero-Trust Auth Overhaul',
    description: 'Re-architected auth layer — zero CVEs since rollout in Q2 2025.',
    role: 'Security Engineering',
    tags: ['OAuth 2.1', 'OIDC', 'Go'],
    contributors: ['JK', 'NM', 'FB'],
    company: 'GitHub',
    status: 'company' as const,
    color: 'from-orange-500/20 to-amber-500/10',
    accent: '#f97316',
  },
  {
    id: 6,
    title: 'Edge CDN Dashboard',
    description: 'Analytics platform visualising 50M+ daily edge requests globally.',
    role: 'DevOps / Frontend',
    tags: ['Next.js', 'ClickHouse', 'D3.js'],
    contributors: ['PV'],
    company: 'Vercel',
    status: 'peer' as const,
    color: 'from-cyan-500/20 to-sky-500/10',
    accent: '#06b6d4',
  },
]

const STATS = [
  { value: '47K+', label: 'Verified Contributors' },
  { value: '180K+', label: 'Proof-of-Work Submissions' },
  { value: '2,400+', label: 'Company Verifications' },
  { value: '98.7%', label: 'Verification Accuracy' },
]

/* ─────────────────────────────────────────────────────────────── */
/*  TYPE (re-exported from _components for local use)              */
/* ─────────────────────────────────────────────────────────────── */

// ProjectData imported above — PROJECTS array must match it.

const STEPS = [
  {
    step: '01',
    icon: '⬆',
    title: 'Upload Your Proof',
    description: 'Submit code commits, design files, case studies, or any verifiable evidence of real contribution.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    step: '02',
    icon: '🔗',
    title: 'Peer Review & Verify',
    description: 'Colleagues who worked with you cryptographically co-sign your contributions. No self-promotion.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    step: '03',
    icon: '✦',
    title: 'Company Verification',
    description: 'Verified companies review and officially endorse your work. Their badge on your profile is gold.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

/* ─────────────────────────────────────────────────────────────── */
/*  SUB-COMPONENTS (VerificationBadge, Avatar, ProjectCard)         */
/*  Defined in ./_components/project-card.tsx ('use client')        */
/* ─────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────── */
/*  SECTIONS                                                        */
/* ─────────────────────────────────────────────────────────────── */

function Navbar() {
  return (
    <nav
      className="fixed top-0 z-50 w-full"
      style={{
        background: 'rgba(5,5,15,0.7)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/favicon.ico" alt="PortFort logo" className="h-7 w-7" />
          <span className="text-sm font-bold tracking-tight text-white">PortFort</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {['Explore', 'Companies', 'Pricing', 'Docs'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  )
}

// HeroFloatingCard is imported from ./_components/hero-floating-card.tsx
// ProjectCard, VerificationBadge are imported from ./_components/project-card.tsx


/* ─────────────────────────────────────────────────────────────── */
/*  PAGE                                                            */
/* ─────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: '#05050f', color: '#f1f5f9' }}>

      {/* ── Global background effects ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Violet orb — top left */}
        <div
          className="absolute -top-60 -left-60 rounded-full"
          style={{
            width: 700, height: 700,
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            animation: 'pulse-glow 5s ease-in-out infinite',
          }}
        />
        {/* Blue orb — top right */}
        <div
          className="absolute -top-40 right-0"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
            animation: 'pulse-glow 6s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        />
        {/* Cyan orb — bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 900, height: 400,
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <Navbar />

      {/* ═══════════════════════════════ HERO ═══════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-24 sm:px-10">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex-1 max-w-xl">
            {/* Status badge */}
            <div
              className="mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: '#a78bfa',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-dot-pulse" />
              Professional Verification Network · Est. 2026
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-[64px]">
              <span className="text-white">Proof of Work.</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Verified.
              </span>
            </h1>

            <p className="mb-10 text-lg leading-8 text-slate-400">
              A professional network where designers, developers, and students
              showcase <em className="not-italic text-slate-200">verified contributions</em> and real-world work.
              No claims. Only evidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
              >
                ⬆ Upload Your Work
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#projects"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-medium text-slate-300 transition hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Explore Verified Projects ↓
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {['TN', 'AK', 'SR', 'MJ', 'PK'].map((i, idx) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-[#05050f]"
                    style={{ background: ['#3b82f6', '#7c3aed', '#10b981', '#f97316', '#06b6d4'][idx] }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">47,000+ verified professionals</p>
                <p className="text-xs text-slate-500">joined the network this year</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Floating UI mockup */}
          <HeroFloatingCard />
        </div>
      </section>

      {/* ═══════════════════════════ STATS BAR ══════════════════ */}
      <section className="relative z-10 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-3xl font-bold sm:text-4xl"
                  style={{
                    background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="mb-14 text-center">
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">How It Works</div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Three tiers of truth.</h2>
          <p className="mt-3 text-slate-400">Evidence compounds. Every tier unlocks more credibility.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="relative rounded-2xl p-7"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Step connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-full sm:block"
                  style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.1)' }}
                />
              )}

              <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${step.bg} ${step.border} border`}>
                {step.icon}
              </div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Step {step.step}</div>
              <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{step.description}</p>

              {/* Badge preview */}
              <div className="mt-5">
                <VerificationBadge status={i === 0 ? 'self' : i === 1 ? 'peer' : 'company'} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PROJECT GRID ═══════════════════ */}
      <section id="projects" className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Featured Work</div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Verified contributions.</h2>
            <p className="mt-2 text-slate-400">Real work. Real companies. Real credibility.</p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            View all projects →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* ══════════════════ DASHBOARD PREVIEW STRIP ═════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
          />

          <div className="relative flex flex-col items-start gap-12 lg:flex-row lg:items-center">
            <div className="flex-1 max-w-md">
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400">For Professionals</div>
              <h2 className="mb-4 text-3xl font-bold text-white">Your professional identity. Finally provable.</h2>
              <p className="mb-8 text-slate-400 leading-7">
                Stop writing &ldquo;I led this project&rdquo; in a cover letter nobody trusts.
                Upload your commits, design files, and outcomes. Let verifiers do the talking.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  Start building your proof →
                </Link>
              </div>
            </div>

            {/* Mini dashboard preview */}
            <div className="w-full max-w-sm flex-1">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-red-500/50" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/20 flex items-center justify-center text-sm font-bold text-white">A</div>
                    <div>
                      <div className="text-sm font-semibold text-white">Alex Kim</div>
                      <div className="text-xs text-slate-500">Senior Engineer · ProofForge #4872</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[9px] font-semibold px-2 py-1 rounded-full text-emerald-300" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        VERIFIED
                      </span>
                    </div>
                  </div>
                  {['Stripe Checkout · Company ✓', 'Real-time Engine · Peer ✓', 'Design System · Peer ✓'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA ════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-10">
        <div
          className="relative overflow-hidden rounded-3xl px-10 py-20 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(124,58,237,0.12) 50%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)' }}
          />
          <div className="relative">
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-violet-400">Join the Network</div>
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Your work speaks for itself.
              <br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Let it be heard.
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-slate-400">
              Join 47,000+ professionals who have replaced claims with evidence.
              The future of work is verified.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl px-9 text-base font-semibold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 60px rgba(124,58,237,0.4)' }}
              >
                ⬆ Upload Your Work — Free
              </Link>
              <Link href="/login"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl px-9 text-base font-medium text-slate-300 transition hover:text-white"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═════════════════════ */}
      <footer className="relative z-10 border-t px-6 py-12 sm:px-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">ProofForge</span>
            <span className="text-xs text-slate-600 ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            {['Privacy', 'Terms', 'Security', 'API Docs', 'Status'].map((l) => (
              <Link key={l} href="#" className="hover:text-slate-300 transition">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
