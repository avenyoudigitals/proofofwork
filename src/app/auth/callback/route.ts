import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * OAuth callback handler.
 * Supabase redirects here after GitHub (or any built-in OAuth provider) sign-in.
 * Exchanges the code for a session and redirects the user to /dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — redirect to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
