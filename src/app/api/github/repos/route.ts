import { createClient } from '@/lib/supabase/server'
import { getGitHubRepos } from '@/lib/github'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/github/repos
 * Returns the authenticated user's GitHub repositories.
 * Query params:
 *   - per_page (default 30)
 *   - sort: updated | created | pushed | full_name (default: updated)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const githubToken = session.provider_token

  if (!githubToken) {
    return NextResponse.json(
      { error: 'No GitHub token. Please sign in with GitHub.' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const per_page = Math.min(Number(searchParams.get('per_page') ?? '30'), 100)
  const sort = (searchParams.get('sort') ?? 'updated') as 'updated' | 'created' | 'pushed' | 'full_name'

  try {
    const repos = await getGitHubRepos(githubToken, { per_page, sort })
    return NextResponse.json(repos)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch repos'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
