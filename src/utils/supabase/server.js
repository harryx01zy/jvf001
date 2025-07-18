// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// createClient function async hona chahiye
export async function createClient() {
  // ✅ cookies() ko await karo
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // ✅ Ab cookieStore ready hai, use directly use kar sakte ho
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Server Components mein cookie set karte waqt aane wale errors ko ignore karein.
          }
        },
      },
    }
  )
}
