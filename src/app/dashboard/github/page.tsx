import { createClient } from '@/lib/supabase/server'
import { getGitHubUser, getGitHubRepos } from '@/lib/github'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'GitHub — Proof',
}

const langColors: Record<string, string> = {
  TypeScript:  '#d97706',
  JavaScript:  '#b45309',
  Python:      '#4a4740',
  Rust:        '#92400e',
  Go:          '#0e0d0b',
  Java:        '#2a2820',
  'C++':       '#4a4740',
  Ruby:        '#7a776e',
  Swift:       '#d97706',
  Kotlin:      '#b45309',
  CSS:         '#4a4740',
  HTML:        '#d97706',
  Shell:       '#4a4740',
  Dart:        '#4a4740',
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

  if (!token) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '2px solid #0e0d0b' }}>
          <div className="label-sm" style={{ marginBottom: 8 }}>GitHub</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e0d0b', letterSpacing: '-0.03em' }}>
            Connect GitHub
          </h1>
        </div>

        <div style={{ background: '#fff', border: '1px solid #d6d0c4', padding: 40, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: '#0e0d0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#f5f0e8">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 18, color: '#0e0d0b', marginBottom: 8 }}>
            GitHub not connected
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#7a776e', lineHeight: 1.6, marginBottom: 24 }}>
            Sign in with GitHub to access your profile and repositories.
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Connect GitHub
          </Link>
        </div>
      </div>
    )
  }

  const [githubUser, repos] = await Promise.all([
    getGitHubUser(token),
    getGitHubRepos(token, { per_page: 30, sort: 'updated' }),
  ])

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '2px solid #0e0d0b' }}>
        <div className="label-sm" style={{ marginBottom: 8 }}>GitHub</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e0d0b', letterSpacing: '-0.03em' }}>
          Your Repositories
        </h1>
      </div>

      {/* User card */}
      <div style={{ background: '#fff', border: '1px solid #d6d0c4', marginBottom: 20 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #e8e3d8' }}>
          <span className="label-sm">User Data</span>
        </div>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={githubUser.avatar_url}
            alt={githubUser.login}
            style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #d6d0c4', flexShrink: 0 }}
          />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 16, color: '#0e0d0b' }}>
                {githubUser.name ?? githubUser.login}
              </p>
              <a
                href={githubUser.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7a776e', textDecoration: 'none', border: '1px solid #d6d0c4', padding: '2px 8px' }}
              >
                @{githubUser.login} ↗
              </a>
            </div>
            {githubUser.email && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7a776e', marginBottom: 12 }}>{githubUser.email}</p>
            )}

            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Public repos', value: githubUser.public_repos },
                { label: 'Followers', value: githubUser.followers },
                { label: 'Following', value: githubUser.following },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 20, color: '#0e0d0b', lineHeight: 1 }}>{value.toLocaleString()}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#7a776e', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* API link */}
          <a
            href="/api/github/user"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#7a776e',
              border: '1px solid #d6d0c4',
              padding: '5px 10px',
              textDecoration: 'none',
              transition: 'border-color 0.1s, color 0.1s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            GET /api/github/user ↗
          </a>
        </div>
      </div>

      {/* Repos */}
      <div style={{ background: '#fff', border: '1px solid #d6d0c4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e8e3d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="label-sm">Repositories</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                color: '#d97706',
                border: '1px solid #d97706',
                background: '#fef3c7',
                padding: '1px 7px',
              }}
            >
              {repos.length}
            </span>
          </div>
          <a
            href="/api/github/repos"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a776e', textDecoration: 'none' }}
          >
            GET /api/github/repos ↗
          </a>
        </div>

        <div>
          {repos.map((repo, i) => (
            <div
              key={repo.id}
              className="hover-row"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '14px 20px',
                borderBottom: i < repos.length - 1 ? '1px solid #e8e3d8' : 'none',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-ink-border"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0e0d0b', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.1s' }}
                  >
                    {repo.name}
                  </a>
                  {repo.private && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#7a776e', border: '1px solid #d6d0c4', padding: '1px 6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Private
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#7a776e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>
                    {repo.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4a4740' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: langColors[repo.language] ?? '#7a776e', display: 'inline-block' }} />
                      {repo.language}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a776e' }}>
                    Updated {timeAgo(repo.updated_at)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a776e' }}>
                    {repo.default_branch}
                  </span>
                </div>
              </div>

              {repo.stargazers_count > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7a776e', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {repo.stargazers_count.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
