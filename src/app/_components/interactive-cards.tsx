'use client'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <div
      style={{
        padding: '32px 28px',
        background: 'var(--card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        position: 'relative',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.2s',
        cursor: 'default',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border-hi)'
        el.style.background = 'var(--card-2)'
        el.style.boxShadow = '0 12px 40px rgba(99,102,241,0.15)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--card)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Subtle gradient top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
      }} />

      {/* Index */}
      <span style={{
        position: 'absolute', top: 18, right: 20,
        fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-2)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#818cf8', marginBottom: 20,
        boxShadow: '0 4px 12px rgba(99,102,241,0.15)',
      }}>
        {icon}
      </div>

      <h3 style={{
        fontSize: 15, fontWeight: 700, color: 'var(--text)',
        marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.3,
      }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75 }}>
        {description}
      </p>
    </div>
  )
}
