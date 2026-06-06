import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import PublicProfileClient from './PublicProfileClient'

interface Props { params: Promise<{ userId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const service = createServiceClient()
  const { data: { user } } = await service.auth.admin.getUserById(userId)
  const name = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'Professional'
  return {
    title: `${name} — ProofForge`,
    description: `View ${name}'s verified proof-of-work profile on ProofForge.`,
  }
}

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()
  const service  = createServiceClient()

  // Get auth user metadata (has full_name, avatar_url from OAuth)
  const { data: { user: authUser } } = await service.auth.admin.getUserById(userId)
  if (!authUser) notFound()

  const displayName  = (authUser.user_metadata?.full_name ?? authUser.email?.split('@')[0] ?? 'Professional') as string
  const avatarUrl    = (authUser.user_metadata?.avatar_url ?? null) as string | null
  const githubUsername = (authUser.user_metadata?.user_name ?? null) as string | null

  // Try profiles table for extra fields (bio, location, website, username)
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, bio, location, website')
    .eq('id', userId)
    .maybeSingle()

  // Fetch works
  const { data: works } = await supabase
    .from('works')
    .select('id, title, role, company, description, status, verified_by_company, tags, github_url, figma_url, live_url, case_study_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const workList = works ?? []
  const companyVerifiedCount = workList.filter(w => w.status === 'company_verified').length
  const peerVerifiedCount    = workList.filter(w => w.status === 'peer_verified').length

  return (
    <PublicProfileClient
      userId={userId}
      displayName={displayName}
      username={profile?.username ?? null}
      bio={profile?.bio ?? null}
      avatarUrl={avatarUrl}
      location={profile?.location ?? null}
      website={profile?.website ?? null}
      githubUsername={githubUsername}
      works={workList}
      companyVerifiedCount={companyVerifiedCount}
      peerVerifiedCount={peerVerifiedCount}
    />
  )
}
