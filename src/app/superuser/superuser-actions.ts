'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  validateSuperuserCredentials,
  signSuperuserSession,
  isSuperuserAuthenticated,
  SUPERUSER_COOKIE,
} from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'

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

export async function superuserDeleteWork(formData: FormData) {
  // Auth guard — superuser only
  const ok = await isSuperuserAuthenticated()
  if (!ok) redirect('/superuser')

  const workId = (formData.get('workId') as string)?.trim()
  if (!workId) return

  const service = createServiceClient()

  // Delete related rejection records first (FK safety)
  await service.from('admin_rejections').delete().eq('work_id', workId)

  // Delete the work itself (service role bypasses RLS)
  await service.from('works').delete().eq('id', workId)

  revalidatePath('/superuser')
}
