import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getGitHubContributionStats } from '@/lib/github'
import { calculateReputation, TIERS } from '@/lib/reputation'
import type { ReputationBreakdown } from '@/lib/reputation'

export const metadata = { title: 'Reputation — ProofForge' }

/* ── Not-connected state ─────────────────────────────────────────── */
function NotConnected() {
  return (
    <div className="max-w-lg">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Reputation</p>
      <h1 className="text-2xl font-bold text-white mb-2">Your Reputation Score</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Connect your GitHub account to calculate your live reputation score from real contribution data.
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
          ★
        </div>
        <p className="text-white font-semibold mb-1">GitHub not connected</p>
        <p className="text-zinc-500 text-sm mb-6">
          Your reputation is calculated from commits, stars, repos, followers, and account age.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
        >
          Connect GitHub →
        </Link>
      </div>
    </div>
  )
}

/* ── Score ring ──────────────────────────────────────────────────── */
function ScoreRing({ score, max = 1000, color }: { score: number; max?: number; color: string }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const pct  = Math.min(score / max, 1)
  const dash = pct * circ

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      {/* Track */}
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      {/* Progress */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  )
}

/* ── Category bar ────────────────────────────────────────────────── */
function CategoryBar({ label, score, max, icon, color, description }: {
  label: string; score: number; max: number; icon: string; color: string; description: string
}) {
  const pct = Math.round((score / max) * 100)
  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-sm font-bold text-white">{score}<span className="text-slate-600 text-xs font-normal">/{max}</span></p>
          <p className="text-[10px] text-slate-500">{pct}%</p>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default async function ReputationPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const token = session.provider_token
  if (!token) return <NotConnected />

  let rep: ReputationBreakdown
  try {
    const stats = await getGitHubContributionStats(token)
    rep = calculateReputation(stats)
  } catch {
    return <NotConnected />
  }

  const { tier, nextTier, total, breakdown, percentile, pointsToNextTier } = rep

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Reputation</p>
        <h1 className="text-2xl font-bold text-white">Your Reputation Score</h1>
        <p className="mt-1 text-sm text-slate-400">Calculated live from your GitHub contribution history.</p>
      </div>

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${tier.color}30`,
          boxShadow: `0 0 60px ${tier.glow}`,
        }}
      >
        {/* Glow blob */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full"
          style={{ background: `radial-gradient(circle, ${tier.glow} 0%, transparent 70%)` }} />

        <div className="relative flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="relative shrink-0">
            <ScoreRing score={total} color={tier.color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{total}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">/ 1000</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {/* Tier badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}35`, color: tier.color }}>
              <span>{tier.badge}</span>
              {tier.name} Tier
            </div>

            <p className="text-3xl font-black text-white mb-1">{percentile}</p>
            <p className="text-sm text-slate-400 mb-4">among ProofForge developers</p>

            {/* Progress to next tier */}
            {nextTier ? (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progress to <span style={{ color: nextTier.color }}>{nextTier.name}</span></span>
                  <span className="text-slate-400 font-semibold">{pointsToNextTier} pts away</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((total - tier.min) / (nextTier.min - tier.min)) * 100}%`,
                      background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-600">{tier.min} → {nextTier.min} pts</p>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${tier.color}15`, color: tier.color }}>
                ✦ Maximum tier reached
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier ladder ── */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Tier Ladder</h2>
        <div className="flex items-end gap-2 overflow-x-auto pb-2">
          {TIERS.map((t, i) => {
            const isActive = t.name === tier.name
            const isPast   = t.min < tier.min
            return (
              <div key={t.name} className="flex-1 min-w-[70px] text-center">
                <div
                  className="rounded-xl py-3 px-2 mb-2 transition"
                  style={{
                    background: isActive ? `${t.color}20` : isPast ? `${t.color}10` : 'rgba(255,255,255,0.03)',
                    border: isActive ? `1px solid ${t.color}50` : `1px solid ${t.color}20`,
                    boxShadow: isActive ? `0 0 20px ${t.glow}` : 'none',
                  }}
                >
                  <p className="text-xl mb-1" style={{ color: isActive || isPast ? t.color : '#334155' }}>{t.badge}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: isActive ? t.color : '#475569' }}>{t.name}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">{t.min}+ pts</p>
                </div>
                {/* Step arrow */}
                {i < TIERS.length - 1 && (
                  <div className="text-[9px] text-slate-700 text-center">→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Score breakdown ── */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">Score Breakdown</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {breakdown.map((cat) => (
            <CategoryBar key={cat.label} {...cat} />
          ))}
        </div>
      </div>

      {/* ── How it's calculated ── */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">How it&apos;s calculated</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: '⚡', label: 'Activity (300 pts)', text: 'Recent commits & number of actively-pushed repos' },
            { icon: '★', label: 'Reach & Impact (250 pts)', text: 'Stars and forks across all your repositories' },
            { icon: '◈', label: 'Portfolio Depth (250 pts)', text: 'Repo count, language diversity, and account age' },
            { icon: '◎', label: 'Community (200 pts)', text: 'Followers on GitHub' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="text-[11px] text-slate-500 leading-4 mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[11px] text-slate-600 leading-5">
            Score is refreshed every 5 minutes and uses a logarithmic scale — easy to grow from 0, harder at the top.
            All signals are sourced directly from GitHub's API using your OAuth token.
          </p>
        </div>
      </div>

      {/* CTA if not fully scored */}
      {total < 400 && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-sm font-semibold text-white mb-2">Boost your score</p>
          <ul className="text-xs text-slate-400 space-y-1.5">
            {rep.activityScore < 150 && <li>⚡ Push more commits — activity is the highest-weighted category</li>}
            {rep.reachScore < 50    && <li>★ Share your repos — stars and forks increase your Reach score</li>}
            {rep.communityScore < 50 && <li>◎ Connect with other developers to grow your follower count</li>}
            <li>
              <Link href="/dashboard/works" className="text-blue-400 hover:text-blue-300 transition underline underline-offset-2">
                Upload and verify your works →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
