'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  getPortalConfig,
  validateAdminCredentials,
  signSession,
  type PortalSlug,
} from '@/lib/admin-auth'

export type LoginState = {
  error?: string
}

export async function adminLogin(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const slug     = formData.get('portal') as PortalSlug
  const username = (formData.get('username') as string)?.trim()
  const password = (formData.get('password') as string) ?? ''

  const cfg = getPortalConfig(slug)
  if (!cfg) return { error: 'Invalid portal.' }

  if (!username || !password) {
    return { error: 'Username and password are required.' }
  }

  const valid = validateAdminCredentials(slug, username, password)
  if (!valid) {
    return { error: 'Invalid username or password.' }
  }

  // Sign a session token and store it in an HttpOnly cookie
  const token = signSession(slug)
  const jar = await cookies()
  jar.set(cfg.cookieName, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     `/admin/${slug}`,
    maxAge:   8 * 60 * 60, // 8 hours in seconds
  })

  redirect(`/admin/${slug}`)
}

export async function adminLogout(slug: PortalSlug): Promise<void> {
  const cfg = getPortalConfig(slug)
  if (cfg) {
    const jar = await cookies()
    jar.delete(cfg.cookieName)
  }
  redirect(`/admin/${slug}`)
}
