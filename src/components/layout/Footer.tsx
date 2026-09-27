import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--surface-subtle] mt-24">
      <div className="container-shagaf py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size={28} />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            From Passion to Profession. A digital education ecosystem connecting
            learners, teachers and private schools in one platform.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[--text]">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><Link href="/explore" className="hover:text-[--text]">Explore Courses</Link></li>
            <li><Link href="/explore?tab=schools" className="hover:text-[--text]">Schools</Link></li>
            <li><Link href="/explore?tab=teachers" className="hover:text-[--text]">Teachers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[--text]">For Schools</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><Link href="/for-schools" className="hover:text-[--text]">Grow with SHAGAF</Link></li>
            <li><Link href="/register" className="hover:text-[--text]">Register your School</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[--text]">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><Link href="/about" className="hover:text-[--text]">About</Link></li>
            <li><Link href="/contact" className="hover:text-[--text]">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-shagaf border-t border-[--border] py-6 text-xs text-ink-muted">
        © {new Date().getFullYear()} SHAGAF. All rights reserved.
      </div>
    </footer>
  );
}
