'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type AuthState = { error?: string } | undefined

/**
 * Sign in with email and password.
 */
export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

/**
 * Sign up with email, password, and display name.
 */
export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Supabase sends a confirmation email — redirect to a "check your email" page.
  redirect('/auth/confirm')
}

/**
 * Sign in with GitHub OAuth.
 */
export async function loginWithGitHub(_formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      scopes: 'read:user user:email repo',
    },
  })

  if (error || !data.url) {
    redirect('/login?error=github_oauth_failed')
  }

  redirect(data.url)
}

/**
 * Sign in with Google OAuth.
 */
export async function loginWithGoogle(_formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })

  if (error || !data.url) {
    redirect('/login?error=google_oauth_failed')
  }

  redirect(data.url)
}

/**
 * Sign in with Figma OAuth (custom OAuth provider via Supabase custom flow).
 * Figma isn't a built-in Supabase provider — this initiates your own OAuth flow.
 */
export async function loginWithFigma() {
  const params = new URLSearchParams({
    client_id: process.env.FIGMA_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/figma/callback`,
    scope: 'file_read',
    response_type: 'code',
    state: crypto.randomUUID(),
  })

  redirect(`https://www.figma.com/oauth?${params}`)
}

/**
 * Sign out the current user and redirect to login.
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
