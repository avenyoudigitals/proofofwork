import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from './_components/landing-nav'

export const metadata: Metadata = {
  title: 'ProofForge — Professional Verification Network',
  description: 'Discover and verify professional work. The proof-of-work platform for developers, designers, and builders.',
}

const CATEGORIES = [
  { label: 'GitHub Commits',   icon: '⌥' },
  { label: 'Figma Designs',    icon: '◈' },
  { label: 'Case Studies',     icon: '◎' },
  { label: 'Open Source',      icon: '⊕' },
  { label: 'Full Stack',       icon: '⟁' },
  { label: 'ML / AI',          icon: '◑' },
  { label: 'Design Systems',   icon: '▣' },
  { label: 'DevOps / Infra',   icon: '⊞' },
]

function HeroCard() {
  const NOTCHES = 24
  return (
    <div style={{
      width: '100%', maxWidth: 500,
      borderRadius: 28,
      boxShadow: '0 32px 80px rgba(99,102,241,0.22), 0 8px 24px rgba(0,0,0,0.12)',
      overflow: 'hidden',
    }}>
      <svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
        <defs>
          <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1740" />
            <stop offset="55%" stopColor="#2d2a6e" />
            <stop offset="100%" stopColor="#4a1d96" />
          </linearGradient>
          <linearGradient id="hgold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="hsheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hglow" cx="50%" cy="48%" r="40%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <filter id="hsglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="500" height="360" fill="url(#hbg)" />
        <rect width="500" height="200" fill="url(#hsheen)" />
        <ellipse cx="250" cy="175" rx="210" ry="150" fill="url(#hglow)" />
        {/* Circuit traces */}
        <g stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.35" fill="none">
          <polyline points="28,55 100,55 100,110" />
          <polyline points="50,85 82,85 82,140" />
          <polyline points="472,50 400,50 400,108" />
          <polyline points="450,80 418,80 418,132" />
          <polyline points="35,305 35,255 95,255" />
          <polyline points="62,285 120,285" />
          <polyline points="465,308 465,258 405,258" />
          <polyline points="438,290 380,290" />
        </g>
        {([28,100,472,400,35,465] as number[]).map((x,i) => <circle key={i} cx={x} cy={i<2?55:i<4?50:i<5?305:308} r="3" fill="#818cf8" fillOpacity="0.55" />)}
        {/* Data rings */}
        <circle cx="70" cy="308" r="40" fill="none" stroke="#6366f1" strokeWidth="1.3" strokeOpacity="0.45" />
        <circle cx="70" cy="308" r="28" fill="none" stroke="#818cf8" strokeWidth="0.9" strokeOpacity="0.38" />
        <circle cx="70" cy="308" r="16" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 3" />
        <circle cx="70" cy="308" r="6" fill="#818cf8" fillOpacity="0.3" />
        <circle cx="430" cy="314" r="36" fill="none" stroke="#7c3aed" strokeWidth="1.3" strokeOpacity="0.4" />
        <circle cx="430" cy="314" r="24" fill="none" stroke="#818cf8" strokeWidth="0.9" strokeOpacity="0.35" />
        <circle cx="430" cy="314" r="13" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.45" strokeDasharray="3 3" />
        {/* Bar charts */}
        {[{x:390,h:15},{x:399,h:22},{x:408,h:10},{x:417,h:18},{x:426,h:13}].map((b,i) => <rect key={i} x={b.x} y={66-b.h} width="6" height={b.h} rx="1.5" fill="#818cf8" fillOpacity="0.42" />)}
        {[{x:388,h:13},{x:397,h:20},{x:406,h:8},{x:415,h:16}].map((b,i) => <rect key={i} x={b.x} y={310-b.h} width="6" height={b.h} rx="1.5" fill="#7c3aed" fillOpacity="0.4" />)}
        {/* Dot grids */}
        {[65,90,115].flatMap(x => [125,150,175].map(y => <circle key={`l${x}${y}`} cx={x} cy={y} r="1.4" fill="#818cf8" fillOpacity="0.22" />))}
        {[385,410,435].flatMap(x => [125,150,175].map(y => <circle key={`r${x}${y}`} cx={x} cy={y} r="1.4" fill="#818cf8" fillOpacity="0.2" />))}
        {/* Hexagon frame */}
        <polygon points="250,88 308,121 308,187 250,220 192,187 192,121" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.55" />
        <polygon points="250,97 301,128 301,182 250,213 199,182 199,128" fill="none" stroke="#818cf8" strokeWidth="0.7" strokeOpacity="0.3" />
        {/* Glow */}
        <ellipse cx="250" cy="175" rx="58" ry="58" fill="#6366f1" fillOpacity="0.2" filter="url(#hsglow)" />
        {/* Notch ring */}
        {Array.from({length: NOTCHES}, (_,i) => {
          const a = (i/NOTCHES)*Math.PI*2, x=250+Math.cos(a)*50, y=175+Math.sin(a)*50
          return <rect key={i} x={x-2} y={y-4.5} width="4" height="9" rx="2" fill="url(#hgold)" transform={`rotate(${(i/NOTCHES)*360},${x},${y})`} />
        })}
        {/* Seal */}
        <circle cx="250" cy="175" r="43" fill="#1a1740" />
        <circle cx="250" cy="175" r="38" fill="none" stroke="url(#hgold)" strokeWidth="2.5" />
        {/* Stars */}
        <text x="228" y="162" textAnchor="middle" fontSize="9" fill="#fcd34d" fillOpacity="0.95">&#9733;</text>
        <text x="250" y="154" textAnchor="middle" fontSize="9" fill="#fcd34d" fillOpacity="0.95">&#9733;</text>
        <text x="272" y="162" textAnchor="middle" fontSize="9" fill="#fcd34d" fillOpacity="0.95">&#9733;</text>
        {/* Checkmark */}
        <path d="M232,177 L245,191 L270,162" stroke="url(#hgold)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#hsglow)" />
        {/* Divider */}
        <rect x="120" y="238" width="260" height="1" fill="#818cf8" fillOpacity="0.18" />
        {/* Label */}
        <text x="250" y="264" textAnchor="middle" fontFamily="'SF Mono',monospace" fontSize="8.5" letterSpacing="4.5" fill="#818cf8" fillOpacity="0.75">VERIFIED CREDENTIAL</text>
        {/* Dots */}
        {([-60,-40,-20,0,20,40,60] as number[]).map((dx,i) => <circle key={i} cx={250+dx} cy={286} r={2.2} fill="#6366f1" fillOpacity={i===3?0.9:0.22} />)}
        {/* Footer */}
        <text x="250" y="330" textAnchor="middle" fontFamily="'SF Mono',monospace" fontSize="7" letterSpacing="2.5" fill="#c084fc" fillOpacity="0.45">PROOFFORGE · PROFESSIONAL NETWORK</text>
        {/* Corner accents */}
        {([[30,30],[470,30],[30,330],[470,330]] as [number,number][]).map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" fill="#818cf8" fillOpacity="0.18" />)}
      </svg>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg)', fontFamily: 'var(--font)' }}>
      <Navbar />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section style={{ paddingTop: 60, minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 28px 60px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* Left column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9 20 10.5 13.5 12 12 19 10.5 12 4 10.5 10.5 9 12 2z" fill="#0a0a12" /></svg>
              <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                Professional Verification Network
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.97, marginBottom: 24, color: 'var(--text)' }}>
              Discover<br />
              Verified Work<br />
              and Collect<br />
              <span style={{ color: 'var(--text-3)' }}>Credentials</span>
            </h1>

            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
              The proof-of-work platform for professionals. Connect your GitHub, get company-verified, and build a credible record that speaks louder than a résumé.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/signup" id="hero-explore" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#0a0a12', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 'var(--radius-full)' }}>
                Explore
              </Link>
              <Link href="/signup" id="hero-verify" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', background: 'transparent', color: 'var(--text)', fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid var(--border-2)', borderRadius: 'var(--radius-full)' }}>
                Get Verified
              </Link>
            </div>
          </div>

          {/* Right column — credential card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════ WORK CATEGORIES ══════════════════════════ */}
      <section style={{ padding: '72px 28px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Work Collections</h2>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {CATEGORIES.map((c) => (
            <a key={c.label} href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', fontSize: 13, fontWeight: 500, borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border-2)', color: 'var(--text-2)', background: 'var(--card)', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.15s' }} className="cat-pill">
              <span style={{ fontSize: 15 }}>{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 72 }}>
          <Link href="/signup" id="all-collections" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#0a0a12', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', borderRadius: 'var(--radius-full)' }}>
            All Collections ▸
          </Link>
        </div>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section id="how" style={{ padding: '72px 28px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>How it works</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 440, margin: '0 auto' }}>Three tiers of verification, compounding your professional credibility.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { n: '01', title: 'Upload Evidence',  body: 'Submit commits, designs, case studies, or any proof of contribution. Connect GitHub or Figma to import automatically.' },
              { n: '02', title: 'Peer Co-signing',  body: 'Invite colleagues to co-sign your work. Their cryptographic signature adds a layer of trusted human verification.' },
              { n: '03', title: 'Company Seal',     body: 'Partner companies officially verify and endorse. Their seal carries the highest evidentiary weight in any hiring decision.' },
            ].map((step) => (
              <div key={step.n} style={{ padding: '36px 32px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }} className="hover-card">
                <div style={{ position: 'absolute', top: -12, right: 16, fontSize: 100, fontWeight: 900, color: 'rgba(0,0,0,0.03)', fontFamily: 'var(--font-mono)', lineHeight: 1, userSelect: 'none' }}>{step.n}</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0a0a12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>{step.n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section id="features" style={{ padding: '72px 28px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>Built for real proof</h2>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 440, margin: '0 auto' }}>Every claim backed by cryptographic evidence, peer signatures, and company seals.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: '⌥', title: 'GitHub Contributions', body: 'Connect your GitHub to auto-import and timestamp your real commits, PRs, and reviews.', color: '#0a0a12' },
            { icon: '◈', title: 'Design Work',           body: 'Sync Figma files and design systems. Show the actual craft behind every pixel.', color: '#6366f1' },
            { icon: '◎', title: 'Project Ownership',     body: 'Claim ownership with evidence: scope docs, metrics, team acknowledgment.', color: '#8b5cf6' },
            { icon: '⊕', title: 'Open Source Impact',    body: 'Automatically attribute your open source contributions with maintainer co-signing.', color: '#10b981' },
            { icon: '◑', title: 'ML & AI Research',      body: 'Document model runs, datasets, benchmarks, and paper citations in one place.', color: '#f59e0b' },
            { icon: '⊞', title: 'Infra & DevOps',        body: 'Prove you shipped the infra — runbooks, incident responses, uptime records included.', color: '#ef4444' },
          ].map((f) => (
            <div key={f.title} style={{ padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }} className="hover-card">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color === '#0a0a12' ? '#0a0a12' : `${f.color}12`, border: `1px solid ${f.color === '#0a0a12' ? 'transparent' : f.color + '25'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 20, color: f.color === '#0a0a12' ? '#fff' : f.color }}>{f.icon}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <section style={{ padding: '0 28px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: '#0a0a12', borderRadius: 'var(--radius-2xl)', padding: '80px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <svg style={{ position: 'absolute', top: 32, right: 48 }} width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9 20 10.5 13.5 12 12 19 10.5 12 4 10.5 10.5 9 12 2z" fill="white" opacity="0.15" /></svg>
            <svg style={{ position: 'absolute', bottom: 40, left: 52 }} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 9 20 10.5 13.5 12 12 19 10.5 12 4 10.5 10.5 9 12 2z" fill="white" opacity="0.1" /></svg>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 18 }}>
                Your career in<br />provable facts.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 420, margin: '0 auto 36px' }}>
                Stop writing &ldquo;led initiative&rdquo; and hoping they believe you. Upload the PR, the design, the metrics. Let the evidence speak.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/signup" id="cta-main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#fff', color: '#0a0a12', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 'var(--radius-full)' }}>
                  Get started for free →
                </Link>
                <Link href="/login" id="cta-login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)' }}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>ProofForge</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ label: 'Privacy', href: '/terms#privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Security', href: '#' }, { label: 'Docs', href: '#' }].map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none', padding: '5px 12px', borderRadius: 'var(--radius-full)', transition: 'color 0.15s, background 0.15s' }} className="hover-text hover-bg">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
