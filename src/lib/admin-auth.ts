import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

/* ── Portal config types ──────────────────────────────────────── */

export type PortalSlug = 'nextovate' | 'ax-ventures'

export interface PortalConfig {
  slug: PortalSlug
  displayName: string
  initial: string
  accentColor: string
  gradientFrom: string
  gradientTo: string
  cookieName: string
}

/* ── Per-portal metadata ──────────────────────────────────────── */

export const PORTAL_CONFIGS: Record<PortalSlug, PortalConfig> = {
  nextovate: {
    slug: 'nextovate',
    displayName: 'Nextovate',
    initial: 'N',
    accentColor: '#6366f1',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    cookieName: 'admin_nextovate_session',
  },
  'ax-ventures': {
    slug: 'ax-ventures',
    displayName: 'AX Ventures',
    initial: 'AX',
    accentColor: '#0ea5e9',
    gradientFrom: '#0284c7',
    gradientTo: '#0891b2',
    cookieName: 'admin_ax_ventures_session',
  },
}

export function getPortalConfig(slug: string): PortalConfig | null {
  return PORTAL_CONFIGS[slug as PortalSlug] ?? null
}

/* ── Credential validation ────────────────────────────────────── */

export function validateAdminCredentials(
  slug: PortalSlug,
  username: string,
  password: string
): boolean {
  let envUser: string | undefined
  let envPass: string | undefined

  if (slug === 'nextovate') {
    envUser = process.env.NEXTOVATE_ADMIN_USERNAME
    envPass = process.env.NEXTOVATE_ADMIN_PASSWORD
  } else {
    envUser = process.env.AX_VENTURES_ADMIN_USERNAME
    envPass = process.env.AX_VENTURES_ADMIN_PASSWORD
  }

  if (!envUser || !envPass) return false

  // Timing-safe comparison
  try {
    const userMatch = timingSafeEqual(Buffer.from(username), Buffer.from(envUser))
    const passMatch = timingSafeEqual(Buffer.from(password), Buffer.from(envPass))
    return userMatch && passMatch
  } catch {
    return false
  }
}

/* ── Session signing / verification ──────────────────────────── */

const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'dev_secret_change_in_prod'
}

export function signSession(slug: PortalSlug): string {
  const payload = `${slug}:${Date.now()}`
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifySession(slug: PortalSlug, token: string): boolean {
  try {
    const lastDot = token.lastIndexOf('.')
    if (lastDot === -1) return false

    const payload = token.slice(0, lastDot)
    const sig     = token.slice(lastDot + 1)

    // Verify HMAC
    const expected = createHmac('sha256', getSecret()).update(payload).digest('hex')
    const sigBuf   = Buffer.from(sig, 'hex')
    const expBuf   = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length) return false
    if (!timingSafeEqual(sigBuf, expBuf)) return false

    // Verify slug
    const [tokenSlug, timestampStr] = payload.split(':')
    if (tokenSlug !== slug) return false

    // Verify TTL
    const ts = parseInt(timestampStr, 10)
    if (isNaN(ts) || Date.now() - ts > SESSION_TTL_MS) return false

    return true
  } catch {
    return false
  }
}

/* ── Cookie helpers ───────────────────────────────────────────── */

export async function getAdminSessionCookie(slug: PortalSlug): Promise<string | undefined> {
  const cfg = getPortalConfig(slug)
  if (!cfg) return undefined
  const jar = await cookies()
  return jar.get(cfg.cookieName)?.value
}

export async function isAdminAuthenticated(slug: PortalSlug): Promise<boolean> {
  const token = await getAdminSessionCookie(slug)
  if (!token) return false
  return verifySession(slug, token)
}
