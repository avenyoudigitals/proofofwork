'use client'

/* ── VerificationBadge ─────────────────────────────────────────── */

export function VerificationBadge({ status, company }: { status: 'self' | 'peer' | 'company'; company?: string }) {
  if (status === 'company')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#10b981', animation: 'pulseDot 2s ease-in-out infinite' }} />
        {company ? `${company} Verified` : 'Company Verified'}
      </span>
    )
  if (status === 'peer')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{ color: '#818cf8', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)' }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#818cf8' }} />
        Peer Verified
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
      style={{ color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#475569' }} />
      Self Claimed
    </span>
  )
}

/* ── Avatar ─────────────────────────────────────────────────────── */

const COLORS = ['#7c3aed','#4f46e5','#10b981','#f59e0b','#f43f5e','#38bdf8','#8b5cf6']

function Avatar({ initials, idx }: { initials: string; idx: number }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2"
      style={{ background: COLORS[idx % COLORS.length], ringColor: 'transparent', boxShadow: '0 0 0 2px #05050f' }}>
      {initials}
    </div>
  )
}

/* ── ProjectData ─────────────────────────────────────────────────── */

export interface ProjectData {
  id: number
  title: string
  description: string
  role: string
  tags: string[]
  contributors: string[]
  company: string
  status: 'self' | 'peer' | 'company'
  color: string
  accent: string
}

/* ── ProjectCard ─────────────────────────────────────────────────── */

export function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div
      className="group relative flex flex-col rounded-2xl p-5 transition-all duration-250"
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.042)'
        el.style.border = `1px solid ${project.accent}28`
        el.style.boxShadow = `0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${project.accent}14`
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
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accent}50, transparent)` }} />

      {/* Corner glow (visible on hover via group) */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${project.accent}12 0%, transparent 70%)` }} />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black"
          style={{ background: `${project.accent}14`, color: project.accent, border: `1px solid ${project.accent}20` }}>
          {project.company[0]}
        </div>
        <VerificationBadge status={project.status} />
      </div>

      {/* Company */}
      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: project.accent, opacity: 0.8 }}>
        {project.company}
      </div>

      {/* Title + description */}
      <h3 className="mb-1.5 text-sm font-bold leading-snug" style={{ color: '#f8fafc' }}>{project.title}</h3>
      <p className="mb-4 flex-1 text-[11px] leading-5" style={{ color: '#475569' }}>{project.description}</p>

      {/* Role */}
      <div className="mb-3 text-[10px]" style={{ color: '#334155' }}>
        <span style={{ color: '#1e293b' }}>Role:</span> {project.role}
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex -space-x-1.5">
          {project.contributors.map((c, i) => <Avatar key={c} initials={c} idx={i} />)}
        </div>
        <span className="text-[10px]" style={{ color: '#334155' }}>
          {project.contributors.length} contributor{project.contributors.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
