'use client'

/* ── Re-usable sub-components ───────────────────────────────────── */

export function VerificationBadge({ status, company }: { status: 'self' | 'peer' | 'company'; company?: string }) {
  if (status === 'company')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-dot-pulse" />
        {company ? company.toUpperCase() : 'COMPANY VERIFIED'}
      </span>
    )
  if (status === 'peer')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-blue-300">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        PEER VERIFIED
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
      SELF CLAIMED
    </span>
  )
}

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-pink-500', 'bg-cyan-500',
]

export function Avatar({ initials, index }: { initials: string; index: number }) {
  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-[9px] font-bold text-white ring-2 ring-[#05050f]`}
    >
      {initials}
    </div>
  )
}

/* ── ProjectCard ────────────────────────────────────────────────── */

export interface ProjectData {
  id: number
  title: string
  description: string
  role: string
  tags: string[]
  contributors: string[]
  company: string
  status: 'self' | 'peer' | 'company'
  color: string   // tailwind gradient classes e.g. "from-violet-500/20 to-indigo-500/10"
  accent: string  // hex colour e.g. "#7c3aed"
}

export function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div
      className="group relative flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.border = `1px solid ${project.accent}40`
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${project.accent}20`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.border = '1px solid rgba(255,255,255,0.08)'
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
      }}
    >
      {/* Accent top line */}
      <div className={`absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r ${project.color.replace('/20', '/60').replace('/10', '/20')}`} />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className={`rounded-xl bg-gradient-to-br ${project.color} p-2.5`}
          style={{ border: `1px solid ${project.accent}25` }}>
          <div className="h-4 w-4 rounded" style={{ background: project.accent, opacity: 0.7 }} />
        </div>
        <VerificationBadge status={project.status} />
      </div>

      {/* Company */}
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: project.accent }}>
        {project.company}
      </div>

      {/* Title + description */}
      <h3 className="mb-1.5 text-sm font-semibold leading-snug text-white">{project.title}</h3>
      <p className="mb-4 flex-1 text-xs leading-5 text-slate-400">{project.description}</p>

      {/* Role */}
      <div className="mb-3 text-[10px] font-medium text-slate-500">
        Role: <span className="text-slate-300">{project.role}</span>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/6 pt-3">
        <div className="flex -space-x-1.5">
          {project.contributors.map((c, i) => (
            <Avatar key={c} initials={c} index={i} />
          ))}
        </div>
        <span className="text-[10px] text-slate-500">
          {project.contributors.length} contributor{project.contributors.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
