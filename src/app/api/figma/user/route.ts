import { createClient } from '@/lib/supabase/server'
import { getFigmaUser } from '@/lib/figma'
import { NextResponse } from 'next/server'

/**
 * GET /api/figma/user
 * Returns the authenticated user's Figma profile.
 * Requires a Figma access token stored in the user's Supabase metadata.
 *
 * Note: Figma is not a native Supabase OAuth provider.
 * The Figma token should be stored in user_metadata after the custom OAuth callback
 * at /auth/figma/callback.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const figmaToken = user.user_metadata?.figma_access_token as string | undefined

  if (!figmaToken) {
    return NextResponse.json(
      { error: 'Figma not connected. Please connect your Figma account in settings.' },
      { status: 403 }
    )
  }

  try {
    const figmaUser = await getFigmaUser(figmaToken)
    return NextResponse.json(figmaUser)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Figma user'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
