import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PublicProfileClient from './PublicProfileClient'

interface Props { params: Promise<{ username: string }> }

async function resolveUser(username: string) {
  const service = createServiceClient()
  const { data: { users } } = await service.auth.admin.listUsers({ perPage: 1000, page: 1 })
  return users.find(u =>
    (u.user_metadata?.user_name ?? '').toLowerCase() === username.toLowerCase() ||
    (u.email?.split('@')[0] ?? '').toLowerCase() === username.toLowerCase()
  ) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const authUser = await resolveUser(username)
  const name = authUser?.user_metadata?.full_name ?? authUser?.email?.split('@')[0] ?? 'Professional'
  return {
    title: `${name} — ProofForge`,
    description: `View ${name}'s verified proof-of-work profile on ProofForge.`,
  }
}

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const authUser = await resolveUser(username)
  if (!authUser) notFound()

  const userId         = authUser.id
  const displayName    = (authUser.user_metadata?.full_name ?? authUser.email?.split('@')[0] ?? 'Professional') as string
  const avatarUrl      = (authUser.user_metadata?.avatar_url ?? null) as string | null
  const githubUsername = (authUser.user_metadata?.user_name ?? null) as string | null

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, bio, location, website')
    .eq('id', userId)
    .maybeSingle()

  const { data: works } = await supabase
    .from('works')
    .select('id, title, role, company, description, status, verified_by_company, tags, github_url, figma_url, live_url, case_study_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const workList             = works ?? []
  const companyVerifiedCount = workList.filter(w => w.status === 'company_verified').length
  const peerVerifiedCount    = workList.filter(w => w.status === 'peer_verified').length

  return (
    <PublicProfileClient
      userId={userId}
      displayName={displayName}
      username={githubUsername ?? profile?.username ?? username}
      bio={profile?.bio ?? null}
      avatarUrl={avatarUrl}
      location={profile?.location ?? null}
      website={profile?.website ?? null}
      githubUsername={githubUsername}
      works={workList}
      companyVerifiedCount={companyVerifiedCount}
      peerVerifiedCount={peerVerifiedCount}
      profileSlug={username}
    />
  )
}
