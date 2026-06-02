'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  validateSuperuserCredentials,
  signSuperuserSession,
  SUPERUSER_COOKIE,
} from '@/lib/admin-auth'

export async function superuserLoginAction(formData: FormData) {
  const username = (formData.get('username') as string)?.trim() ?? ''
  const password = (formData.get('password') as string) ?? ''

  if (!validateSuperuserCredentials(username, password)) {
    return redirect('/superuser?error=1')
  }

  const token = signSuperuserSession()
  const jar = await cookies()
  jar.set(SUPERUSER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60,
    path: '/',
  })

  redirect('/superuser')
}

export async function superuserLogoutAction() {
  const jar = await cookies()
  jar.delete(SUPERUSER_COOKIE)
  redirect('/superuser')
}
