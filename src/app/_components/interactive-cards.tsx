'use client'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#818cf8', marginBottom: 16, flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65 }}>{description}</p>
    </div>
  )
}
