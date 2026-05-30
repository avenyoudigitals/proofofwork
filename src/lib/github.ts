/**
 * GitHub API client utilities.
 * All functions accept a user access token obtained via GitHub OAuth.
 * Tokens are never exposed to the client — always call from Server Components or Route Handlers.
 */

const GITHUB_API = 'https://api.github.com'

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  default_branch: string
}

export interface GitHubContributionStats {
  totalCommits: number       // commit events in the last year across all repos
  totalStars: number         // sum of stargazers on owned repos
  totalForks: number         // sum of forks on owned repos
  publicRepos: number        // public repo count
  followers: number
  following: number
  contributingRepos: number  // repos with ≥1 recent push event
  languages: string[]        // distinct non-null languages
  accountAgeYears: number    // years since account creation
}

/** Get the authenticated GitHub user's profile. */
export async function getGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: githubHeaders(token),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`GitHub /user failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/** List repositories for the authenticated user. */
export async function getGitHubRepos(
  token: string,
  options?: { per_page?: number; sort?: 'updated' | 'created' | 'pushed' | 'full_name' }
): Promise<GitHubRepo[]> {
  const params = new URLSearchParams({
    per_page: String(options?.per_page ?? 30),
    sort: options?.sort ?? 'updated',
  })

  const res = await fetch(`${GITHUB_API}/user/repos?${params}`, {
    headers: githubHeaders(token),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`GitHub /user/repos failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}


/** Get a single repository by owner and name. */
export async function getGitHubRepo(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: githubHeaders(token),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`GitHub /repos/${owner}/${repo} failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/**
 * Fetch the contribution stats needed for reputation scoring.
 * Uses only endpoints available with the `read:user` + `repo` scopes we already request.
 */
export async function getGitHubContributionStats(
  token: string
): Promise<GitHubContributionStats> {
  const headers = githubHeaders(token)

  // 1. Full user profile (gives public_repos, followers, created_at)
  const userRes = await fetch(`${GITHUB_API}/user`, {
    headers,
    next: { revalidate: 300 },
  })
  const user = userRes.ok ? await userRes.json() : {}

  // 2. All repos (public + private) to get star/fork totals and languages
  const reposRes = await fetch(`${GITHUB_API}/user/repos?per_page=100&sort=updated`, {
    headers,
    next: { revalidate: 300 },
  })
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : []

  // 3. Recent push events (last ~90 days) for commit count estimation
  //    GitHub public events API gives the last 300 events for the user.
  const eventsRes = await fetch(`${GITHUB_API}/users/${user.login}/events?per_page=100`, {
    headers,
    next: { revalidate: 300 },
  })
  const events: Array<{ type: string; payload?: { commits?: unknown[] } }> =
    eventsRes.ok ? await eventsRes.json() : []

  // Count commits from PushEvents
  const totalCommits = events
    .filter((e) => e.type === 'PushEvent')
    .reduce((sum, e) => sum + (e.payload?.commits?.length ?? 0), 0)

  // Distinct repos pushed to recently
  const contributingRepos = new Set(
    events.filter((e) => e.type === 'PushEvent').map((e: Record<string, unknown>) => (e.repo as { name?: string })?.name)
  ).size

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count ?? 0), 0)
  const totalForks = repos.reduce((s, r) => s + (r.forks_count ?? 0), 0)
  const languages  = [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[]

  // Account age in years
  const createdAt = user.created_at ? new Date(user.created_at) : new Date()
  const accountAgeYears = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)

  return {
    totalCommits,
    totalStars,
    totalForks,
    publicRepos: user.public_repos ?? repos.filter((r) => !r.private).length,
    followers:   user.followers ?? 0,
    following:   user.following ?? 0,
    contributingRepos,
    languages,
    accountAgeYears,
  }
}
