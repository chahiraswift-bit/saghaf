import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

function getSupabaseEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * Must be created fresh on every request (cookies() is request-scoped).
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    getSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context — the
            // middleware below refreshes the session on every request instead.
          }
        },
      },
    }
  );
}
