import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import PublicProfileClient from './PublicProfileClient'

interface Props { params: Promise<{ userId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio')
    .eq('id', userId)
    .single()

  const name = profile?.full_name ?? profile?.username ?? 'Professional'
  return {
    title: `${name} — ProofForge`,
    description: `View ${name}'s verified proof-of-work profile on ProofForge.`,
  }
}

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()

  // Try profiles table first, fallback to auth user metadata
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, username, bio, avatar_url, github_username, location, website')
    .eq('id', userId)
    .single()

  // Fetch works — only public ones (self_claimed, peer_verified, company_verified all visible)
  const { data: works } = await supabase
    .from('works')
    .select('id, title, role, company, description, status, verified_by_company, tags, github_url, figma_url, live_url, case_study_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!works && !profile) notFound()

  const displayName = profile?.full_name ?? profile?.username ?? 'Anonymous'
  const workList = works ?? []
  const companyVerified = workList.filter(w => w.status === 'company_verified')
  const peerVerified    = workList.filter(w => w.status === 'peer_verified')

  return (
    <PublicProfileClient
      userId={userId}
      displayName={displayName}
      username={profile?.username ?? null}
      bio={profile?.bio ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      location={profile?.location ?? null}
      website={profile?.website ?? null}
      githubUsername={profile?.github_username ?? null}
      works={workList}
      companyVerifiedCount={companyVerified.length}
      peerVerifiedCount={peerVerified.length}
    />
  )
}
