import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

function getSupabaseEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call multiple times — @supabase/ssr reuses the underlying client.
 */
export function createClient() {
  return createBrowserClient<Database>(
    getSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
