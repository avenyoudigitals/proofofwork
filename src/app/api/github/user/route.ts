import { createClient } from '@/lib/supabase/server'
import { getGitHubUser } from '@/lib/github'
import { NextResponse } from 'next/server'

/**
 * GET /api/github/user
 * Returns the authenticated user's GitHub profile.
 * Requires the user to have signed in via GitHub OAuth
 * (so Supabase stores the provider_token).
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // provider_token is the GitHub access token from OAuth
  const githubToken = session.provider_token

  if (!githubToken) {
    return NextResponse.json(
      {
        error: 'No GitHub token found. Please sign in with GitHub to access this endpoint.',
      },
      { status: 403 }
    )
  }

  try {
    const githubUser = await getGitHubUser(githubToken)
    return NextResponse.json(githubUser)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch GitHub user'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
