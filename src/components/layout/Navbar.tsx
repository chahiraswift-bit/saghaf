import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { signOut } from "@/lib/actions/auth";

const ROLE_HOME: Record<string, string> = {
  learner: "/dashboard",
  teacher: "/teacher",
  school_admin: "/school",
  super_admin: "/admin",
};

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/explore?tab=schools", label: "Schools" },
  { href: "/explore?tab=teachers", label: "Teachers" },
  { href: "/explore?tab=courses", label: "Courses" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }
  const dashboardHref = role ? ROLE_HOME[role] ?? "/" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[--border] bg-[--surface]/90 backdrop-blur">
      <div className="container-shagaf flex h-16 items-center justify-between">
        <Logo size={30} />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-ink-muted hover:text-[--text] hover:bg-[--surface-subtle]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link href={dashboardHref}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">Log out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <MobileMenu signedIn={!!user} dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
}
