'use client'

export interface ProjectData {
  id: number
  title: string
  description: string
  role: string
  tags: string[]
  contributors: string[]
  company: string
  status: 'self' | 'peer' | 'company'
}

const STATUS_CFG = {
  company: { label: 'Company Verified', cls: 'badge-green'  },
  peer:    { label: 'Peer Verified',    cls: 'badge-indigo' },
  self:    { label: 'Self Claimed',     cls: 'badge-zinc'   },
}

const COMPANY_INITIALS: Record<string, string> = {
  Stripe: 'S', Linear: 'L', OpenAI: 'O', Figma: 'F', GitHub: 'G', Vercel: 'V',
}

export function ProjectCard({ project }: { project: ProjectData }) {
  const cfg = STATUS_CFG[project.status]
  const initial = COMPANY_INITIALS[project.company] ?? project.company[0]

  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Company + Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#818cf8',
            flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#f4f4f5' }}>{project.company}</p>
            <p style={{ fontSize: 11, color: '#71717a' }}>{project.role}</p>
          </div>
        </div>
        <span className={`badge ${cfg.cls}`} style={{ fontSize: 10, flexShrink: 0 }}>
          {cfg.label}
        </span>
      </div>

      {/* Title & description */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f5', marginBottom: 6, letterSpacing: '-0.02em' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>
          {project.description}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: 11, color: '#a1a1aa',
            padding: '2px 8px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex' }}>
            {project.contributors.slice(0, 3).map((c, i) => (
              <div key={c} style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `hsl(${i * 60 + 200}, 60%, 50%)`,
                border: '2px solid #18181b',
                marginLeft: i > 0 ? -6 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff',
                flexShrink: 0,
              }}>
                {c.toUpperCase()}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#71717a' }}>
            {project.contributors.length} contributor{project.contributors.length !== 1 ? 's' : ''}
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
