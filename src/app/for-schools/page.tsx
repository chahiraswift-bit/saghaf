import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, Users, LineChart, Megaphone } from "lucide-react";
import { dictionaries, getLocale, withLocale } from "@/lib/i18n";

const points = [
  { icon: LayoutDashboard, title: "School dashboard · planned", copy: "Manage school courses, teachers, and enrollment from one workspace." },
  { icon: Users, title: "Teacher management · planned", copy: "Invite teachers and organize course ownership from your school account." },
  { icon: LineChart, title: "School analytics · planned", copy: "Review enrollments and course activity when school tools launch." },
  { icon: Megaphone, title: "School discovery · planned", copy: "Approved school profiles will be discoverable through Explore." },
];

export default function ForSchoolsPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = getLocale(searchParams?.lang);
  const t = dictionaries[locale];

  return (
    <div className="container-shagaf py-16">
      <div className="max-w-2xl rounded-[28px] border border-[--border] bg-[--surface] p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <h1 className="font-display text-4xl font-semibold text-shagaf-700 dark:text-shagaf-200">
          {t.home.schoolCTA}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          {t.home.schoolText}
        </p>
        <Link href={withLocale("/register", locale)}>
          <Button size="lg" className="mt-6 rounded-full">{t.home.createSchool}</Button>
        </Link>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {points.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="rounded-2xl border border-[--border] bg-[--surface] p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <Icon size={20} className="text-shagaf-600" />
            <h3 className="mt-3 font-display font-semibold text-[--text]">{title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
