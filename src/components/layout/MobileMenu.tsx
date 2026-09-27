"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/explore?tab=schools", label: "Schools" },
  { href: "/explore?tab=teachers", label: "Teachers" },
  { href: "/explore?tab=courses", label: "Courses" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/about", label: "About" },
];

export function MobileMenu({ signedIn, dashboardHref }: { signedIn: boolean; dashboardHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[--text]"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[--surface]">
          <div className="container-shagaf flex h-16 items-center justify-between">
            <span className="font-display font-semibold">SHAGAF</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="h-9 w-9">
              <X size={22} />
            </button>
          </div>
          <nav className="container-shagaf flex flex-col gap-1 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-lg text-[--text] hover:bg-[--surface-subtle]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-[--border] pt-4">
              {signedIn ? (
                <Link href={dashboardHref} onClick={() => setOpen(false)}>
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get Started</Button>
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
