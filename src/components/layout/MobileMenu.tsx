"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/actions/auth";
import { Logo } from "@/components/brand/Logo";
import { withLocale } from "@/lib/i18n";

const links = [
  { href: "/explore", label: { en: "Explore", fr: "Explorer", ar: "استكشف" } },
  { href: "/explore?tab=schools", label: { en: "Schools", fr: "Écoles", ar: "المدارس" } },
  { href: "/explore?tab=teachers", label: { en: "Teachers", fr: "Enseignants", ar: "المعلمون" } },
  { href: "/explore?tab=courses", label: { en: "Courses", fr: "Cours", ar: "الدورات" } },
  { href: "/for-schools", label: { en: "For Schools", fr: "Pour les écoles", ar: "للمدارس" } },
  { href: "/about", label: { en: "About", fr: "À propos", ar: "من نحن" } },
];

export function MobileMenu({ signedIn, dashboardHref, locale }: { signedIn: boolean; dashboardHref: string; locale: "en" | "fr" | "ar" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[--border] bg-[--surface-subtle] text-[--text] shadow-sm transition hover:bg-[--surface]"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[--surface]">
          <div className="container-shagaf flex h-20 items-center justify-between">
            <Logo size={28} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[--border] bg-[--surface-subtle] text-[--text]"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="container-shagaf flex flex-col gap-2 pt-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={withLocale(l.href, locale)}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-transparent px-4 py-3 text-base font-medium text-[--text] transition hover:border-[--border] hover:bg-[--surface-subtle]"
              >
                {l.label[locale]}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-[--border] pt-4">
              {signedIn ? (
                <>
                  <Link href={withLocale(dashboardHref, locale)} onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-xl">{locale === "fr" ? "Tableau de bord" : locale === "ar" ? "لوحة التحكم" : "Go to Dashboard"}</Button>
                  </Link>
                  <form action={signOut}>
                    <Button type="submit" variant="outline" className="w-full rounded-xl">{locale === "fr" ? "Déconnexion" : locale === "ar" ? "تسجيل الخروج" : "Log out"}</Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href={withLocale("/login", locale)} onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">{locale === "fr" ? "Connexion" : locale === "ar" ? "تسجيل الدخول" : "Log in"}</Button>
                  </Link>
                  <Link href={withLocale("/register", locale)} onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-xl">{locale === "fr" ? "Commencer" : locale === "ar" ? "ابدأ الآن" : "Get Started"}</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
