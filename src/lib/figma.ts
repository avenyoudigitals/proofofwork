/**
 * Figma API client utilities.
 * All functions accept a personal access token or OAuth access token.
 * Tokens are never exposed to the client — always call from Server Components or Route Handlers.
 */

const FIGMA_API = 'https://api.figma.com'

function figmaHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export interface FigmaUser {
  id: string
  email: string
  handle: string
  img_url: string
}

export interface FigmaFile {
  name: string
  lastModified: string
  thumbnailUrl: string
  version: string
  document: Record<string, unknown>
  components: Record<string, FigmaComponent>
  schemaVersion: number
}

export interface FigmaComponent {
  key: string
  name: string
  description: string
  componentSetId?: string
  documentationLinks: { uri: string }[]
}

export interface FigmaComponentsResponse {
  error: boolean
  status: number
  meta: {
    components: Array<{
      key: string
      file_key: string
      node_id: string
      thumbnail_url: string
      name: string
      description: string
      updated_at: string
      created_at: string
    }>
    cursor?: Record<string, number>
  }
}

/** Get the authenticated Figma user's profile. */
export async function getFigmaUser(token: string): Promise<FigmaUser> {
  const res = await fetch(`${FIGMA_API}/v1/me`, {
    headers: figmaHeaders(token),
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`Figma /me failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/** Get a Figma file by its file key. */
export async function getFigmaFile(
  token: string,
  fileKey: string,
  options?: { depth?: number }
): Promise<FigmaFile> {
  const params = options?.depth ? `?depth=${options.depth}` : ''

  const res = await fetch(`${FIGMA_API}/v1/files/${fileKey}${params}`, {
    headers: figmaHeaders(token),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Figma /files/${fileKey} failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/** Get components defined in a Figma file. */
export async function getFigmaFileComponents(
  token: string,
  fileKey: string
): Promise<FigmaComponentsResponse> {
  const res = await fetch(`${FIGMA_API}/v1/files/${fileKey}/components`, {
    headers: figmaHeaders(token),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Figma /files/${fileKey}/components failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
