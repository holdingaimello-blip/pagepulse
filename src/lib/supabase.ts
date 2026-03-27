import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public client (browser-safe, uses anon key with RLS)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  _supabase = createClient(url, anonKey);
  return _supabase;
}

// Admin/server client (service role key, bypasses RLS)
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _supabaseAdmin;
}

// Convenience exports for direct import
export const supabase = getSupabase();
export const supabaseAdmin = getSupabaseAdmin();
