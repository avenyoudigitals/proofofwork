import { createClient } from '@/lib/supabase/server'
import { getGitHubUser, getGitHubRepos } from '@/lib/github'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'GitHub — Proof',
}

// Language colour dots
const langColors: Record<string, string> = {
  TypeScript: 'bg-blue-400',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-400',
  Rust: 'bg-orange-500',
  Go: 'bg-cyan-400',
  Java: 'bg-red-500',
  'C++': 'bg-pink-500',
  Ruby: 'bg-red-400',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-purple-400',
  CSS: 'bg-blue-500',
  HTML: 'bg-orange-400',
  Shell: 'bg-emerald-400',
  Dart: 'bg-sky-400',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default async function GitHubPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const token = session.provider_token

  // Not connected via GitHub OAuth
  if (!token) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold text-white mb-2">GitHub</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Connect your GitHub account to browse your repositories and profile.
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-5">
            <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <p className="text-white font-medium mb-1">GitHub not connected</p>
          <p className="text-zinc-500 text-sm mb-6">
            Sign in with GitHub to access your profile and repositories.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition"
          >
            Connect GitHub
          </Link>
        </div>
      </div>
    )
  }

  // Fetch both in parallel
  const [githubUser, repos] = await Promise.all([
    getGitHubUser(token),
    getGitHubRepos(token, { per_page: 30, sort: 'updated' }),
  ])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-white mb-8">GitHub</h1>

      {/* ── User Data Card ── */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          User Data
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-start gap-5">
          {/* Avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={githubUser.avatar_url}
            alt={githubUser.login}
            className="h-16 w-16 rounded-full ring-2 ring-white/10"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-lg font-semibold text-white">
                {githubUser.name ?? githubUser.login}
              </p>
              <a
                href={githubUser.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition font-mono"
              >
                @{githubUser.login} ↗
              </a>
            </div>
            {githubUser.email && (
              <p className="mt-1 text-sm text-zinc-400">{githubUser.email}</p>
            )}

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap gap-4">
              {[
                { label: 'Public repos', value: githubUser.public_repos },
                { label: 'Followers', value: githubUser.followers },
                { label: 'Following', value: githubUser.following },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON peek */}
          <a
            href="/api/github/user"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition font-mono"
          >
            GET /api/github/user ↗
          </a>
        </div>
      </section>

      {/* ── Repositories ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Repositories
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-zinc-400 normal-case tracking-normal">
              {repos.length}
            </span>
          </h2>
          <a
            href="/api/github/repos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition font-mono"
          >
            GET /api/github/repos ↗
          </a>
        </div>

        <div className="space-y-2">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="group rounded-xl border border-white/8 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.06] hover:border-white/14"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white hover:underline underline-offset-2"
                    >
                      {repo.name}
                    </a>
                    {repo.private && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500">
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="mt-1 text-xs text-zinc-500 truncate max-w-md">
                      {repo.description}
                    </p>
                  )}
                </div>

                {/* Star count */}
                {repo.stargazers_count > 0 && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {repo.stargazers_count.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${langColors[repo.language] ?? 'bg-zinc-500'}`} />
                    {repo.language}
                  </span>
                )}
                <span>Updated {timeAgo(repo.updated_at)}</span>
                <span className="font-mono">{repo.default_branch}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
