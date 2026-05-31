'use client'

// Seeded random — no hydration mismatch
function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const HEAT_LEVELS = Array.from({ length: 56 }, (_, i) => {
  const r = sr(i)
  return r < 0.38 ? 0 : r < 0.58 ? 1 : r < 0.76 ? 2 : r < 0.90 ? 3 : 4
})

const HEAT_COLORS = [
  'rgba(124,58,237,0.06)',
  'rgba(124,58,237,0.2)',
  'rgba(124,58,237,0.42)',
  'rgba(124,58,237,0.65)',
  'rgba(124,58,237,0.9)',
]

const WORKS = [
  { title: 'Stripe Checkout Redesign', company: 'Stripe', badge: '✓', color: '#7c3aed', rep: '+48' },
  { title: 'Real-time Sync Engine', company: 'Linear', badge: '✓', color: '#10b981', rep: '+92' },
  { title: 'Design System v4.0', company: 'Figma', badge: '◈', color: '#38bdf8', rep: '+31' },
]

export function HeroFloatingCard() {
  return (
    <div className="relative w-full">
      {/* Main browser mockup */}
      <div
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(9,9,26,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.08) inset',
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px]"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#334155' }}>
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            proofforge.app/dashboard
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3].map((i) => (
              <div key={i} className="h-4 w-4 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="flex" style={{ minHeight: 360 }}>
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 p-4 sm:block"
            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Logo */}
            <div className="mb-5 flex items-center gap-2">
              <div className="h-5 w-5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }} />
              <span className="text-xs font-bold" style={{ color: '#f8fafc' }}>ProofForge</span>
            </div>
            {/* Nav items */}
            {['Overview', 'My Works', 'Upload', 'Reputation', 'GitHub', 'Figma'].map((item, i) => (
              <div key={item}
                className="mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium"
                style={{
                  background: i === 0 ? 'rgba(124,58,237,0.12)' : 'transparent',
                  color: i === 0 ? '#c4b5fd' : '#334155',
                }}>
                <div className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === 0 ? '#7c3aed' : '#1e293b' }} />
                {item}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5">
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold" style={{ color: '#f8fafc' }}>Overview</div>
                <div className="text-[10px]" style={{ color: '#334155' }}>Alex Kim · #4872</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }} />
                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Stat mini cards */}
            <div className="mb-4 grid grid-cols-4 gap-2">
              {[
                { l: 'Rep Score', v: '847', c: '#7c3aed' },
                { l: 'Works', v: '23', c: '#10b981' },
                { l: 'Companies', v: '7', c: '#38bdf8' },
                { l: 'Collabs', v: '34', c: '#f59e0b' },
              ].map((s) => (
                <div key={s.l} className="rounded-lg p-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.c}18` }}>
                  <div className="text-lg font-black" style={{ color: '#f8fafc' }}>{s.v}</div>
                  <div className="text-[9px]" style={{ color: s.c }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="mb-4 rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="mb-2 text-[10px] font-medium" style={{ color: '#334155' }}>Contribution activity</div>
              <div className="flex flex-wrap gap-0.5">
                {HEAT_LEVELS.map((lvl, i) => (
                  <div key={i} className="h-2 w-2 rounded-sm"
                    style={{ background: HEAT_COLORS[lvl] }} />
                ))}
              </div>
            </div>

            {/* Works list */}
            <div className="space-y-2">
              {WORKS.map((w) => (
                <div key={w.title}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-bold"
                    style={{ background: `${w.color}18`, color: w.color }}>
                    {w.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[11px] font-semibold" style={{ color: '#f8fafc' }}>{w.title}</div>
                    <div className="text-[9px]" style={{ color: '#334155' }}>{w.company} · Verified</div>
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: '#10b981' }}>{w.rep}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating card — top left */}
      <div
        className="absolute -top-4 -left-4 hidden lg:block"
        style={{ width: 180, animation: 'float 6s ease-in-out infinite', animationDelay: '0.5s' }}
      >
        <div style={{ background: 'rgba(9,9,26,0.92)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', padding: 16 }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)' }}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#10b981' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold" style={{ color: '#f8fafc' }}>Stripe Verified</div>
              <div className="text-[9px]" style={{ color: '#334155' }}>+48 rep · just now</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#475569' }}>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#10b981', animation: 'pulseDot 2s ease-in-out infinite' }} />
            Checkout Redesign confirmed
          </div>
        </div>
      </div>

      {/* Floating card — bottom right */}
      <div
        className="absolute -bottom-6 -right-4 hidden lg:block"
        style={{ width: 196, animation: 'floatR 7s ease-in-out infinite', animationDelay: '1s' }}
      >
        <div style={{ background: 'rgba(9,9,26,0.92)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', padding: 16 }}>
          <div className="mb-2 text-[10px] font-semibold" style={{ color: '#94a3b8' }}>Reputation Milestone</div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black" style={{ color: '#f8fafc' }}>847</span>
            <span className="mb-1 text-xs font-bold" style={{ color: '#7c3aed' }}>/ 1000</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{ width: '84.7%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)' }} />
          </div>
          <div className="mt-1.5 text-[9px]" style={{ color: '#334155' }}>Top 4% globally · Elite in 153 rep</div>
        </div>
      </div>
    </div>
  )
}
