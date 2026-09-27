import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, Users, LineChart, Megaphone } from "lucide-react";

const points = [
  { icon: LayoutDashboard, title: "One dashboard", copy: "Courses, teachers, students and revenue in one place — no more spreadsheets." },
  { icon: Users, title: "Your teachers, organized", copy: "Add teachers to your school, assign courses, and see who's teaching what." },
  { icon: LineChart, title: "Real analytics", copy: "Enrollments and revenue at a glance, per course and per teacher." },
  { icon: Megaphone, title: "Get discovered", copy: "Appear in SHAGAF's Explore page and, later, in Featured placements." },
];

export default function ForSchoolsPage() {
  return (
    <div className="container-shagaf py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-[--text]">
          Your school, running on SHAGAF.
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          Give your teachers a place to publish courses and your students a
          place to learn — with a real dashboard behind it.
        </p>
        <Link href="/register">
          <Button size="lg" className="mt-6">Register your school</Button>
        </Link>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {points.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="border-t-2 border-shagaf-600 pt-4">
            <Icon size={20} className="text-shagaf-600" />
            <h3 className="mt-3 font-display font-semibold text-[--text]">{title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
