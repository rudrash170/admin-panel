import { supabase } from '@/lib/supabaseClient'

// Client-side helper to check authentication; returns the user or null.
export const requireClientAuth = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) return null
    return user || null
  } catch (err) {
    return null
  }
}
