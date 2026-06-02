'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type WorkFormState = {
  error?: string
  success?: boolean
  workId?: string
}

export async function createWork(
  _prev: WorkFormState | undefined,
  formData: FormData
): Promise<WorkFormState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Parse fields
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const role = (formData.get('role') as string)?.trim()
  const company = (formData.get('company') as string)?.trim() || null
  const github_url = (formData.get('github_url') as string)?.trim() || null
  const figma_url = (formData.get('figma_url') as string)?.trim() || null
  const live_url = (formData.get('live_url') as string)?.trim() || null
  const case_study_url = (formData.get('case_study_url') as string)?.trim() || null
  const tagsRaw = (formData.get('tags') as string)?.trim() || ''
  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  // Basic validation
  if (!title) return { error: 'Project title is required.' }
  if (!description) return { error: 'Description is required.' }
  if (!role) return { error: 'Your role / contribution is required.' }
  if (title.length > 120) return { error: 'Title must be under 120 characters.' }
  if (description.length > 2000) return { error: 'Description must be under 2000 characters.' }

  // ── Round-robin assignment ──────────────────────────────────────
  // Count all works globally; alternate assignment based on parity.
  const { count: totalWorks } = await supabase
    .from('works')
    .select('*', { count: 'exact', head: true })

  const assigned_to = (totalWorks ?? 0) % 2 === 0 ? 'nextovate' : 'ax-ventures'
  // ───────────────────────────────────────────────────────────────

  const { data, error } = await supabase
    .from('works')
    .insert({
      user_id: user.id,
      title,
      description,
      role,
      company,
      github_url,
      figma_url,
      live_url,
      case_study_url,
      tags,
      status: 'self_claimed',
      assigned_to,
    })
    .select('id')
    .single()

  if (error) {
    console.error('createWork error:', error)
    return { error: 'Failed to save your work. Please try again.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/works')

  return { success: true, workId: data.id }
}

export async function deleteWork(workId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('works')
    .delete()
    .eq('id', workId)
    .eq('user_id', user.id)   // RLS double-check

  if (error) return { error: 'Failed to delete.' }

  revalidatePath('/dashboard/works')
  return {}
}
