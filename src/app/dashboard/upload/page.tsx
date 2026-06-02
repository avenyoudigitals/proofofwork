'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createWork } from '@/app/actions/work'
import type { WorkFormState } from '@/app/actions/work'

export const dynamic = 'force-dynamic'

const ROLE_OPTIONS = [
  'Full Stack Engineering',
  'Frontend Engineering',
  'Backend Engineering',
  'Mobile Engineering',
  'DevOps / Platform',
  'ML / AI Engineering',
  'Security Engineering',
  'Product Design',
  'UI / Design Systems',
  'UX Research',
  'Product Management',
  'Data Engineering',
  'Other',
]

/* ── Form field wrapper ── */
function Field({
  label, hint, required, children,
}: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {label}
        {required && <span className="text-violet-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-600">{hint}</p>}
    </div>
  )
}

/* ── Text input ── */
function Input({ name, placeholder, type = 'text', defaultValue = '' }: {
  name: string; placeholder?: string; type?: string; defaultValue?: string
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-violet-500/50"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
    />
  )
}

/* ── Page ── */
export default function UploadWorkPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, action, pending] = useActionState<WorkFormState | undefined, FormData>(
    createWork,
    undefined
  )

  // Redirect to dashboard on success
  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/works')
    }
  }, [state, router])

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">New Submission</p>
        <h1 className="text-2xl font-bold text-white">Upload proof of work</h1>
        <p className="mt-1 text-sm text-slate-400">
          Submit verifiable evidence of a real contribution. Start as self-claimed — peers and companies can co-sign later.
        </p>
      </div>

      {/* Error banner */}
      {state?.error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-300">{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={action} className="space-y-6">

        {/* ── Section: Project info ── */}
        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Project Info</p>

          <Field label="Project title" required hint="Keep it concise — this is your headline.">
            <Input name="title" placeholder="e.g. Stripe Checkout Redesign" />
          </Field>

          <Field label="Your role / contribution" required hint="What specifically did you build or design?">
            <div className="flex gap-3">
              <select
                name="role"
                defaultValue=""
                className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition focus:ring-1 focus:ring-violet-500/50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="" disabled>Select a role…</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r} style={{ background: '#0f0f1a' }}>{r}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="What you built / designed" required hint="Be specific. What problem did you solve? What was the measurable impact?">
            <textarea
              name="description"
              rows={5}
              placeholder="Describe your contribution in detail. Include context, what you did, what tools you used, and any measurable outcomes (e.g. reduced churn by 20%, shipped to 2M users)."
              className="w-full resize-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-1 focus:ring-violet-500/50"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </Field>

          <Field label="Skills / Tags" hint="Comma-separated. e.g. React, Figma, TypeScript, A/B Testing">
            <Input name="tags" placeholder="React, TypeScript, Figma…" />
          </Field>
        </div>

        {/* ── Section: Proof links ── */}
        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Proof Links</p>
            <p className="mt-1 text-[11px] text-slate-600">Add at least one link so verifiers can review your work.</p>
          </div>

          <Field label="GitHub Repository" hint="Direct link to the repo or a specific PR/commit.">
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex h-full items-center px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <input
                name="github_url"
                type="url"
                placeholder="https://github.com/you/repo"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
          </Field>

          <Field label="Figma File" hint="Paste a public Figma link or view-only share link.">
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex h-full items-center px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-12h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm4 0h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8zm4-8h-4V0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4zm-4 12c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4h-4v4z" />
                </svg>
              </div>
              <input
                name="figma_url"
                type="url"
                placeholder="https://figma.com/file/…"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
          </Field>

          <Field label="Live / Deployed URL" hint="Link to the live product, demo, or staging environment.">
            <Input name="live_url" type="url" placeholder="https://your-project.com" />
          </Field>

          <Field label="Case Study / Write-up" hint="Notion doc, blog post, Loom video, or any external writeup.">
            <Input name="case_study_url" type="url" placeholder="https://notion.so/… or youtube.com/…" />
          </Field>
        </div>

        {/* ── Verification info box ── */}
        <div className="flex gap-3 rounded-xl px-4 py-4"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
            style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
            ✦
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-300">Starting as Self-Claimed</p>
            <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
              Your submission starts at <strong className="text-slate-300">Self-Claimed</strong> status.
              After publishing, invite colleagues who worked with you to co-sign it (Peer Verified), or request your company to officially endorse it (Company Verified).
            </p>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl px-5 py-2.5 text-sm text-slate-400 transition hover:text-white"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            {pending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Submitting…
              </>
            ) : (
              <>⬆ Submit Proof of Work</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
