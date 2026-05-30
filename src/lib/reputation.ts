/**
 * ProofForge Reputation Scoring
 *
 * Score is 0–1000 based on real GitHub contribution data.
 * Each category is capped to prevent gaming.
 */

import type { GitHubContributionStats } from './github'

export interface ReputationBreakdown {
  total: number           // 0–1000

  // Category scores (each 0–100 before weighting)
  activityScore:    number   // commits & recent pushes
  reachScore:       number   // stars, forks, followers
  consistencyScore: number   // account age, repo count, languages
  communityScore:   number   // followers, contributing repos

  // Human-readable label for each sub-score
  breakdown: ReputationCategory[]

  tier: ReputationTier
  nextTier: ReputationTier | null
  pointsToNextTier: number
  percentile: string   // e.g. "Top 8%"
}

export interface ReputationCategory {
  label: string
  score: number        // 0–250 (out of max for that category)
  max: number
  icon: string
  color: string
  description: string
}

export type ReputationTier = {
  name: string
  min: number
  color: string
  glow: string
  badge: string
}

export const TIERS: ReputationTier[] = [
  { name: 'Newcomer',   min: 0,   color: '#64748b', glow: 'rgba(100,116,139,0.3)',  badge: '○' },
  { name: 'Contributor',min: 200, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)',   badge: '◎' },
  { name: 'Builder',    min: 400, color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',  badge: '◈' },
  { name: 'Expert',     min: 600, color: '#f59e0b', glow: 'rgba(245,158,11,0.35)',  badge: '◆' },
  { name: 'Elite',      min: 800, color: '#10b981', glow: 'rgba(16,185,129,0.4)',   badge: '✦' },
  { name: 'Legend',     min: 950, color: '#ec4899', glow: 'rgba(236,72,153,0.45)',  badge: '★' },
]

/** Clamp a value between 0 and max. */
function clamp(v: number, max: number) {
  return Math.min(Math.max(v, 0), max)
}

/** Log-scale mapping: returns 0–1 for input 0–infinity, saturating fast. */
function logScale(value: number, saturationAt: number): number {
  if (value <= 0) return 0
  return Math.log(1 + value) / Math.log(1 + saturationAt)
}

/**
 * Calculate reputation from real GitHub contribution stats.
 *
 * Weighting:
 *   Activity (commits, pushes)        → 300 pts max
 *   Reach    (stars, forks)           → 250 pts max
 *   Portfolio (repos, languages, age) → 250 pts max
 *   Community (followers, collab)     → 200 pts max
 *                                       ──────────
 *                                       1000 pts
 */
export function calculateReputation(stats: GitHubContributionStats): ReputationBreakdown {
  // ── Activity (max 300) ────────────────────────────────────────────
  // Commits: saturates at 500 commits in recent events window
  const commitPts   = clamp(logScale(stats.totalCommits, 500) * 200, 200)
  // Active repos: saturates at 20 repos pushed to recently
  const activePts   = clamp(logScale(stats.contributingRepos, 20) * 100, 100)
  const activityRaw = commitPts + activePts                                     // 0–300

  // ── Reach (max 250) ───────────────────────────────────────────────
  // Stars: log scale, saturates at 1000 total stars
  const starPts  = clamp(logScale(stats.totalStars, 1000) * 175, 175)
  // Forks: saturates at 200
  const forkPts  = clamp(logScale(stats.totalForks, 200) * 75, 75)
  const reachRaw = starPts + forkPts                                            // 0–250

  // ── Portfolio (max 250) ───────────────────────────────────────────
  // Repos: saturates at 50 public repos
  const repoPts     = clamp(logScale(stats.publicRepos, 50) * 120, 120)
  // Languages: each unique language = 10 pts, cap at 8
  const langPts     = clamp(stats.languages.length * 10, 80)
  // Account age: +6.25 pts/year, cap at 8 years (50 pts)
  const agePts      = clamp(stats.accountAgeYears * 6.25, 50)
  const portfolioRaw = repoPts + langPts + agePts                               // 0–250

  // ── Community (max 200) ───────────────────────────────────────────
  // Followers: log scale, saturates at 500
  const followerPts  = clamp(logScale(stats.followers, 500) * 200, 200)
  const communityRaw = followerPts                                              // 0–200

  const total = Math.round(
    clamp(activityRaw, 300) +
    clamp(reachRaw, 250) +
    clamp(portfolioRaw, 250) +
    clamp(communityRaw, 200)
  )

  const breakdown: ReputationCategory[] = [
    {
      label: 'Activity',
      score: Math.round(activityRaw),
      max: 300,
      icon: '⚡',
      color: '#3b82f6',
      description: `${stats.totalCommits} recent commits across ${stats.contributingRepos} active repos`,
    },
    {
      label: 'Reach & Impact',
      score: Math.round(reachRaw),
      max: 250,
      icon: '★',
      color: '#f59e0b',
      description: `${stats.totalStars} total stars · ${stats.totalForks} forks`,
    },
    {
      label: 'Portfolio Depth',
      score: Math.round(portfolioRaw),
      max: 250,
      icon: '◈',
      color: '#8b5cf6',
      description: `${stats.publicRepos} public repos · ${stats.languages.length} languages · ${stats.accountAgeYears.toFixed(1)}y account age`,
    },
    {
      label: 'Community',
      score: Math.round(communityRaw),
      max: 200,
      icon: '◎',
      color: '#10b981',
      description: `${stats.followers} followers`,
    },
  ]

  // Tier lookup
  const tier = [...TIERS].reverse().find((t) => total >= t.min) ?? TIERS[0]
  const tierIndex = TIERS.indexOf(tier)
  const nextTier  = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null
  const pointsToNextTier = nextTier ? nextTier.min - total : 0

  // Rough percentile (static mapping based on typical GitHub distributions)
  function percentile(score: number): string {
    if (score >= 950) return 'Top 0.5%'
    if (score >= 900) return 'Top 1%'
    if (score >= 800) return 'Top 3%'
    if (score >= 700) return 'Top 6%'
    if (score >= 600) return 'Top 10%'
    if (score >= 500) return 'Top 18%'
    if (score >= 400) return 'Top 28%'
    if (score >= 300) return 'Top 42%'
    if (score >= 200) return 'Top 58%'
    return 'Growing'
  }

  return {
    total,
    activityScore:    Math.round(activityRaw),
    reachScore:       Math.round(reachRaw),
    consistencyScore: Math.round(portfolioRaw),
    communityScore:   Math.round(communityRaw),
    breakdown,
    tier,
    nextTier,
    pointsToNextTier,
    percentile: percentile(total),
  }
}
