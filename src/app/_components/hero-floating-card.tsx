'use client'

// Seeded random to avoid hydration mismatch
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const HEATMAP_LEVELS = Array.from({ length: 70 }, (_, i) => {
  const r = seededRand(i)
  return r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.72 ? 2 : r < 0.88 ? 3 : 4
})

const HEAT_COLORS = [
  'rgba(255,255,255,0.05)',
  'rgba(59,130,246,0.2)',
  'rgba(59,130,246,0.4)',
  'rgba(124,58,237,0.5)',
  'rgba(124,58,237,0.8)',
]

export function HeroFloatingCard() {
  return (
    <div className="relative hidden lg:block" style={{ width: 520, height: 560 }}>

      {/* ── Main dashboard mockup ── */}
      <div
        className="absolute inset-x-10 top-8 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,246,0.10)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          transform: 'perspective(800px) rotateY(-6deg) rotateX(2deg)',
          animation: 'float-slow 7s ease-in-out infinite',
        }}
      >
        {/* Mockup header */}
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-3 font-mono text-xs text-slate-500">proofforge.app/dashboard</span>
        </div>

        {/* Mockup content */}
        <div className="p-5">
          {/* Stat row */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Rep Score', value: '847', delta: '+12', color: '#3b82f6' },
              { label: 'Verified', value: '23', delta: '+3', color: '#10b981' },
              { label: 'Companies', value: '7', delta: '+1', color: '#7c3aed' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="mb-1 text-[9px] text-slate-500">{s.label}</div>
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-[9px] font-medium" style={{ color: s.color }}>{s.delta} this month</div>
              </div>
            ))}
          </div>

          {/* Recent verifications */}
          <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-slate-500">Recent</div>
          <div className="space-y-2">
            {[
              { title: 'Stripe Checkout Redesign', badge: 'COMPANY', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
              { title: 'Real-time Sync Engine',    badge: 'PEER',    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
              { title: 'ML Pipeline Architecture', badge: 'COMPANY', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="max-w-[160px] truncate text-[10px] font-medium text-slate-300">{item.title}</span>
                <span className="rounded-full px-2 py-0.5 text-[8px] font-semibold"
                  style={{ color: item.color, background: item.bg }}>
                  {item.badge} ✓
                </span>
              </div>
            ))}
          </div>

          {/* Contribution mini-heatmap — deterministic, no Math.random() */}
          <div className="mt-4 flex flex-wrap gap-0.5">
            {HEATMAP_LEVELS.map((level, i) => (
              <div key={i} className="h-2 w-2 rounded-sm" style={{ background: HEAT_COLORS[level] }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating: Reputation card ── */}
      <div
        className="absolute -left-6 top-16 w-44 rounded-2xl p-4"
        style={{
          background: 'rgba(5,5,20,0.85)',
          border: '1px solid rgba(124,58,237,0.3)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1s',
        }}
      >
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-slate-500">Reputation Score</div>
        <div className="text-3xl font-bold"
          style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          847
        </div>
        <div className="mt-1 text-[9px] text-slate-400">Top 4% globally</div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: '84.7%', background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }} />
        </div>
      </div>

      {/* ── Floating: Verification approved ── */}
      <div
        className="absolute -right-4 top-24 w-52 rounded-2xl p-4"
        style={{
          background: 'rgba(5,5,20,0.9)',
          border: '1px solid rgba(16,185,129,0.3)',
          boxShadow: '0 8px 32px rgba(16,185,129,0.15)',
          backdropFilter: 'blur(20px)',
          animation: 'float 4.5s ease-in-out infinite',
          animationDelay: '0.5s',
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: 'rgba(16,185,129,0.2)' }}>
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="text-[9px] font-semibold text-emerald-300">Stripe Inc. Verified</div>
            <div className="text-[8px] text-slate-500">2 min ago</div>
          </div>
        </div>
        <div className="text-[10px] font-medium text-slate-300">Checkout Redesign</div>
        <div className="mt-0.5 text-[8px] text-slate-500">+48 rep points earned</div>
      </div>

      {/* ── Floating: Network activity pill ── */}
      <div
        className="absolute bottom-20 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: 'rgba(5,5,20,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      >
        <div className="flex -space-x-1.5">
          {(['SK', 'AM', 'LR'] as const).map((initials, idx) => (
            <div key={initials}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-[#05050f]"
              style={{ background: ['#3b82f6', '#7c3aed', '#10b981'][idx] }}>
              {initials}
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-semibold text-white">3 peers co-signed</div>
          <div className="text-[8px] text-slate-500">Auth Overhaul · GitHub</div>
        </div>
      </div>

      {/* ── Glow behind ── */}
      <div
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />
    </div>
  )
}
