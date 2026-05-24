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
  language: string | null
  updated_at: string
  default_branch: string
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
