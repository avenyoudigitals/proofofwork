import { createClient } from '@/lib/supabase/server'
import { getFigmaFile } from '@/lib/figma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/figma/file/:fileKey
 * Proxies a Figma file request server-side so the token is never exposed to the browser.
 * Query params:
 *   - depth (optional): How deep to traverse the document tree (default: full)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileKey: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const figmaToken = user.user_metadata?.figma_access_token as string | undefined

  if (!figmaToken) {
    return NextResponse.json(
      { error: 'Figma not connected.' },
      { status: 403 }
    )
  }

  const { fileKey } = await params
  const { searchParams } = new URL(request.url)
  const depth = searchParams.get('depth') ? Number(searchParams.get('depth')) : undefined

  try {
    const file = await getFigmaFile(figmaToken, fileKey, { depth })
    return NextResponse.json(file)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Figma file'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
