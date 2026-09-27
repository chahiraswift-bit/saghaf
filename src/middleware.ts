import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROLE_HOME: Record<string, string> = {
  learner: "/dashboard",
  teacher: "/teacher",
  school_admin: "/school",
  super_admin: "/admin",
};

// Route prefix -> role allowed to access it.
const PROTECTED_PREFIXES: { prefix: string; role: keyof typeof ROLE_HOME }[] = [
  { prefix: "/dashboard", role: "learner" },
  { prefix: "/teacher", role: "teacher" },
  { prefix: "/school", role: "school_admin" },
  { prefix: "/admin", role: "super_admin" },
];

export async function middleware(request: NextRequest) {
  const { response, user, profile } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const matchedRule = PROTECTED_PREFIXES.find((r) => path.startsWith(r.prefix));

  if (matchedRule) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    if (profile && profile.role !== matchedRule.role) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_HOME[profile.role] ?? "/";
      return NextResponse.redirect(url);
    }
  }

  // Signed-in users visiting /login or /register go straight to their dashboard.
  if ((path === "/login" || path === "/register") && user && profile) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_HOME[profile.role] ?? "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and image optimization files,
     * so the session cookie stays fresh across the whole app.
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
