import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

type MiddlewareProfile = Pick<Database["public"]["Tables"]["profiles"]["Row"], "role" | "full_name">;

function getSupabaseEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Refreshes the Supabase auth session on every request and returns
 * both the response and the current user's profile (role, id) so
 * the root middleware can make routing decisions.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  let supabase: ReturnType<typeof createServerClient<Database>> | null = null;

  try {
    supabase = createServerClient<Database>(
      getSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
      getSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
  } catch {
    return { response, user: null, profile: null };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let profile: MiddlewareProfile | null = null;

    if (user) {
      const { data } = (await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single()) as { data: MiddlewareProfile | null };
      profile = data;
    }

    return { response, user, profile };
  } catch {
    return { response, user: null, profile: null };
  }
}
