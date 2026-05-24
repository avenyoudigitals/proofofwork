import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/me
 * Returns the current authenticated user's profile.
 * Returns 401 if not authenticated.
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

  // Return only safe fields — never expose sensitive metadata
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    created_at: user.created_at,
    providers: user.identities?.map((i) => i.provider) ?? [],
  })
}
