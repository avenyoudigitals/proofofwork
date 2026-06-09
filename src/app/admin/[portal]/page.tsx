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

  // Only load works assigned to this portal
  const { data: allWorks } = await service
    .from('works')
    .select('*')
    .eq('assigned_to', cfg.slug)
    .order('created_at', { ascending: false })

  const works = allWorks ?? []

  // Fetch rejections this portal has already recorded (with notes + timestamps)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rejectionRows } = await (service as any)
    .from('admin_rejections')
    .select('work_id, admin_note, rejected_at')
    .eq('portal_slug', cfg.slug)
    .order('rejected_at', { ascending: false })

  const rejectionMap = new Map(
    (rejectionRows ?? []).map((r: { work_id: string; admin_note: string | null; rejected_at: string }) => [
      r.work_id,
      { adminNote: r.admin_note, rejectedAt: r.rejected_at },
    ])
  )

  const rejectedIds = new Set(rejectionMap.keys())

  // Pending = assigned to us, not yet company_verified by anyone, and not already rejected by us
  const pending = works.filter(
    (w) => w.status !== 'company_verified' && !rejectedIds.has(w.id)
  )
  // Approved = verified specifically by this portal
  const approved = works.filter(
    (w) => w.status === 'company_verified' && w.verified_by_company === cfg.displayName
  )
  // Rejected by this portal
  const rejected = works
    .filter((w) => rejectedIds.has(w.id))
    .map((w) => ({
      ...w,
      adminNote: rejectionMap.get(w.id)?.adminNote ?? null,
      rejectedAt: rejectionMap.get(w.id)?.rejectedAt ?? w.updated_at,
    }))

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
      rejected={rejected}
      stats={{
        totalPending:  pending.length,
        approvedToday,
        totalApproved: approved.length,
        totalRejected: rejected.length,
      }}
    />
  )
}
