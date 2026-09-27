import Link from "next/link";
import { ArrowUpRight, BookOpen, Users2, Compass, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseCard, type CourseCardData } from "@/components/course/CourseCard";
import { SchoolCard, type SchoolCardData } from "@/components/school/SchoolCard";

export const revalidate = 60;

async function getFeaturedCourses(): Promise<CourseCardData[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("courses")
    .select(
      "slug, title, thumbnail_url, level, mode, price_dzd, rating_avg, rating_count, students_count, teacher:profiles(full_name), school:schools(name)"
    )
    .eq("status", "published")
    .order("students_count", { ascending: false })
    .limit(6);

  return (data ?? []).map((c: any) => ({
    ...c,
    teacher_name: c.teacher?.full_name ?? null,
    school_name: c.school?.name ?? null,
  }));
}

async function getFeaturedSchools(): Promise<SchoolCardData[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("schools")
    .select("slug, name, logo_url, location, verified, description")
    .eq("status", "approved")
    .limit(3);
  return data ?? [];
}

const offerings = [
  {
    icon: Compass,
    title: "Discover",
    copy: "Search across every school, teacher and course on one map of what's out there to learn.",
  },
  {
    icon: BookOpen,
    title: "Learn",
    copy: "Enroll, track your progress lesson by lesson, and walk away with a certificate that means something.",
  },
  {
    icon: Users2,
    title: "Teach",
    copy: "Build a course once, publish it, and reach learners who are actively looking for exactly this.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    copy: "Schools get a real back office — enrollments, teachers, analytics — instead of spreadsheets.",
  },
];

export default async function LandingPage() {
  const [courses, schools] = await Promise.all([getFeaturedCourses(), getFeaturedSchools()]);

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="border-b border-[--border]">
        <div className="container-shagaf grid gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24 md:gap-6">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[--text] md:text-6xl">
              Your passion deserves a path.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-muted">
              SHAGAF connects learners, teachers and private schools on one
              platform — so finding the right course, or building one, takes
              minutes instead of months.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/explore">
                <Button size="lg">Explore Courses</Button>
              </Link>
              <Link href="/for-schools">
                <Button size="lg" variant="outline">For Schools</Button>
              </Link>
            </div>
          </div>

          {/* Abstract "path" motif — original composition, not the brand mark */}
          <div className="hidden md:flex items-center justify-center">
            <svg viewBox="0 0 320 280" className="w-full max-w-sm" aria-hidden="true">
              <path
                d="M20 240 C 90 240, 60 150, 130 150 S 210 60, 280 60"
                fill="none"
                stroke="url(#pathGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 14"
              />
              <circle cx="20" cy="240" r="7" className="fill-shagaf-300" />
              <circle cx="130" cy="150" r="5" className="fill-shagaf-500" />
              <circle cx="280" cy="60" r="8" className="fill-gold-500" />
              <defs>
                <linearGradient id="pathGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#9C79F5" />
                  <stop offset="1" stopColor="#C79A3B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Offerings */}
      <section className="container-shagaf py-16 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="border-t-2 border-shagaf-600 pt-4">
              <Icon size={20} className="text-shagaf-600" />
              <h3 className="mt-3 font-display font-semibold text-[--text]">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- Featured courses */}
      <section className="container-shagaf py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-[--text]">Featured courses</h2>
          <Link href="/explore" className="text-sm font-medium text-shagaf-600 hover:underline">
            Browse all
          </Link>
        </div>
        {courses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published courses yet"
            hint="Once your Supabase project is seeded (see README), courses will appear here automatically."
          />
        )}
      </section>

      {/* ------------------------------------------------- Featured schools */}
      <section className="container-shagaf py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-[--text]">Featured schools</h2>
          <Link href="/explore?tab=schools" className="text-sm font-medium text-shagaf-600 hover:underline">
            Browse all
          </Link>
        </div>
        {schools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {schools.map((s) => (
              <SchoolCard key={s.slug} school={s} />
            ))}
          </div>
        ) : (
          <EmptyState title="No approved schools yet" />
        )}
      </section>

      {/* --------------------------------------------------- Schools band */}
      <section className="mt-8 border-y border-[--border] bg-[--surface-subtle]">
        <div className="container-shagaf py-16 md:py-20 grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[--text] md:text-4xl">
              Run your school's digital education on SHAGAF.
            </h2>
            <p className="mt-4 max-w-lg text-ink-muted">
              Give your teachers a place to publish courses, give your
              students a place to learn, and give yourself a dashboard that
              actually shows what's happening — enrollments, revenue,
              teachers, all in one place.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Register your school <ArrowUpRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
