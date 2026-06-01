'use client'

export function HeroFloatingCard() {
  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '10%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
        filter: 'blur(32px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Main dashboard card */}
      <div className="card-flat" style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Card header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', marginBottom: 2 }}>Verification Overview</p>
            <p style={{ fontSize: 11, color: '#71717a' }}>Updated just now</p>
          </div>
          <span className="badge badge-green">
            <span className="dot-live" style={{ width: 5, height: 5 }} />
            Active
          </span>
        </div>

        {/* Reputation score */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
            <div>
              <p className="label" style={{ marginBottom: 4 }}>Reputation Score</p>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.04em', lineHeight: 1 }}>847</p>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>↑ Top 4%</span>
            </div>
          </div>
          <div className="progress" style={{ marginBottom: 4 }}>
            <div className="progress-fill" style={{ width: '84.7%' }} />
          </div>
          <p style={{ fontSize: 11, color: '#71717a' }}>153 points to Elite tier</p>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '16px 20px', gap: 12 }}>
          {[
            { label: 'Verified Works',  val: '23' },
            { label: 'Company Seals',   val: '7'  },
            { label: 'Collaborators',   val: '34' },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', marginBottom: 2 }}>{s.val}</p>
              <p style={{ fontSize: 11, color: '#71717a' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Verification list */}
        <div style={{ padding: '8px 0' }}>
          {[
            { name: 'Stripe Checkout Redesign', co: 'stripe.com',  status: 'Verified',   badge: 'badge-green'  },
            { name: 'Real-time Sync Engine',    co: 'linear.app',  status: 'In Review',  badge: 'badge-amber'  },
            { name: 'ML Pipeline',              co: 'openai.com',  status: 'Verified',   badge: 'badge-green'  },
          ].map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ fontSize: 11, color: '#71717a' }}>{item.co}</p>
              </div>
              <span className={`badge ${item.badge}`} style={{ fontSize: 10 }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating notification */}
      <div style={{
        position: 'absolute', bottom: -18, right: -12, zIndex: 2,
        background: '#18181b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', gap: 10,
        minWidth: 220,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#f4f4f5' }}>Stripe verified your work</p>
          <p style={{ fontSize: 11, color: '#71717a' }}>+48 reputation · just now</p>
        </div>
      </div>
    </div>
  )
}
