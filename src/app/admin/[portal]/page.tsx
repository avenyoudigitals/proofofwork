import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPortalConfig, isAdminAuthenticated, type PortalConfig } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import AdminLoginForm from './AdminLoginForm'
import AdminDashboard from './AdminDashboard'

type Props = { params: Promise<{ portal: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { portal } = await params
  const cfg = getPortalConfig(portal)
  if (!cfg) return { title: 'Not Found' }
  return { title: `${cfg.displayName} Admin — ProofForge` }
}

export default async function AdminPortalPage({ params }: Props) {
  const { portal } = await params
  const cfg: PortalConfig | null = getPortalConfig(portal)

  // notFound() throws — TypeScript doesn't narrow after it,
  // so we use an explicit null check and cast.
  if (!cfg) return notFound()

  const authenticated = await isAdminAuthenticated(cfg.slug)

  if (!authenticated) {
    return (
      <AdminLoginForm
        portalSlug={cfg.slug}
        displayName={cfg.displayName}
        initial={cfg.initial}
        gradientFrom={cfg.gradientFrom}
        gradientTo={cfg.gradientTo}
        accentColor={cfg.accentColor}
      />
    )
  }

  const service = createServiceClient()

  const { data: allWorks } = await service
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  const works = allWorks ?? []

  const pending = works.filter((w) => w.status !== 'company_verified')
  const approved = works.filter(
    (w) => w.status === 'company_verified' && w.verified_by_company === cfg.displayName
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const approvedToday = approved.filter(
    (w) => w.updated_at && new Date(w.updated_at) >= today
  ).length

  return (
    <AdminDashboard
      cfg={cfg}
      pending={pending}
      approved={approved}
      stats={{
        totalPending:  pending.length,
        approvedToday,
        totalApproved: approved.length,
      }}
    />
  )
}
