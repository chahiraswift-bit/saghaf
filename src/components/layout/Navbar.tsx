import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { signOut } from "@/lib/actions/auth";
import { getLocale, withLocale } from "@/lib/i18n";

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
  const locale = getLocale((await import("next/headers")).cookies().get("lang")?.value ?? undefined);
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
    <header className="sticky top-0 z-[60] px-3 pt-3">
      <div className="container-shagaf">
        <div className="flex h-[72px] items-center justify-between gap-4 rounded-full border border-[--border] bg-[--surface] px-3 shadow-[0_10px_35px_-18px_rgba(79,52,151,0.35)] md:px-5">
          <Logo size={28} className="shrink-0" />

          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={withLocale(l.href, locale)}
                className="rounded-full px-3 py-2 text-[13px] font-medium text-[--text-muted] transition-all hover:bg-shagaf-50 hover:text-shagaf-800 dark:hover:bg-shagaf-900/40 dark:hover:text-shagaf-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <>
                <Link href={withLocale(dashboardHref, locale)}>
                  <Button variant="outline" size="sm" className="px-3">
                    {locale === "fr" ? "Tableau de bord" : locale === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Button>
                </Link>
                <form action={signOut}>
                  <Button variant="ghost" size="sm" type="submit" className="px-3">
                    {locale === "fr" ? "Déconnexion" : locale === "ar" ? "تسجيل الخروج" : "Log out"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href={withLocale("/login", locale)}>
                  <Button variant="ghost" size="sm" className="px-3">
                    {locale === "fr" ? "Connexion" : locale === "ar" ? "تسجيل الدخول" : "Log in"}
                  </Button>
                </Link>
                <Link href={withLocale("/register", locale)}>
                  <Button size="sm" className="px-4 shadow-lg shadow-shagaf-700/20">
                    {locale === "fr" ? "Commencer" : locale === "ar" ? "ابدأ الآن" : "Get Started"}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <MobileMenu signedIn={!!user} dashboardHref={dashboardHref} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
