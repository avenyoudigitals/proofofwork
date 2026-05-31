'use client'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  glow: string
}

export function FeatureCard({ icon, title, description, color, glow }: FeatureCardProps) {
  return (
    <div
      className="group relative rounded-2xl p-7 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.border = `1px solid ${color}28`
        el.style.boxShadow = `0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.3)`
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.028)'
        el.style.border = '1px solid rgba(255,255,255,0.07)'
        el.style.boxShadow = '0 1px 0 rgba(255,255,255,0.04) inset'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${color}14 0%, transparent 70%)` }} />

      {/* Icon */}
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: `${color}12`, border: `1px solid ${color}20`, color }}>
        {icon}
      </div>

      <h3 className="mb-2.5 text-sm font-bold" style={{ color: '#f8fafc' }}>{title}</h3>
      <p className="text-xs leading-6" style={{ color: '#475569' }}>{description}</p>
    </div>
  )
}

export function HoverCard({ children, style = {} }: { children: React.ReactNode; accentColor?: string; glowColor?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.028)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </div>
  )
}
