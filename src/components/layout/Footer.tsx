import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { withLocale } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[--border] bg-[--surface-subtle]/80 backdrop-blur-xl">
      <div className="container-shagaf py-12 md:py-14">
        <div className="mb-10 rounded-2xl border border-shagaf-100 bg-shagaf-50 p-6 dark:border-shagaf-900/50 dark:bg-shagaf-950/40 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">SHAGAF</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-[--text] md:text-2xl">Build your next learning chapter.</h3>
          </div>
          <Link href={withLocale("/register", "en")} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-gold-400 md:mt-0">
            Create a school account
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-xs text-sm leading-6 text-[--text-muted]">
              From Passion to Profession. A digital education ecosystem connecting learners, teachers and private schools in one platform.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text]">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-[--text-muted]">
              <li><Link href={withLocale("/explore", "en")} className="hover:text-[--text]">Explore Courses</Link></li>
              <li><Link href={withLocale("/explore?tab=schools", "en")} className="hover:text-[--text]">Schools</Link></li>
              <li><Link href={withLocale("/explore?tab=teachers", "en")} className="hover:text-[--text]">Teachers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text]">For Schools</h3>
            <ul className="mt-3 space-y-2 text-sm text-[--text-muted]">
              <li><Link href={withLocale("/for-schools", "en")} className="hover:text-[--text]">Grow with SHAGAF</Link></li>
              <li><Link href={withLocale("/register", "en")} className="hover:text-[--text]">Create a school account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text]">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-[--text-muted]">
              <li><Link href={withLocale("/about", "en")} className="hover:text-[--text]">About</Link></li>
              <li><Link href={withLocale("/contact", "en")} className="hover:text-[--text]">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-shagaf border-t border-[--border] py-6 text-xs text-[--text-muted]">
        © {new Date().getFullYear()} SHAGAF. All rights reserved.
      </div>
    </footer>
  );
}
