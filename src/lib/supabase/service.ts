import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client with the service role key.
 * Bypasses Row-Level Security — only use on the server side.
 * Never expose this client to the browser.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
