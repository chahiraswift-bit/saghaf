import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Users2, Compass, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { dictionaries, getLocale, withLocale } from "@/lib/i18n";
import { EmptyState } from "@/components/ui/EmptyState";
import { CourseCard, type CourseCardData } from "@/components/course/CourseCard";
import { SchoolCard, type SchoolCardData } from "@/components/school/SchoolCard";

export const dynamic = "force-dynamic";

async function getFeaturedCourses(): Promise<CourseCardData[]> {
  try {
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
  } catch {
    return [];
  }
}

async function getFeaturedSchools(): Promise<SchoolCardData[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("schools")
      .select("slug, name, logo_url, location, verified, description")
      .eq("status", "approved")
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

const offerings = [
  {
    icon: Compass,
    title: "Discover",
    copy: "Explore published courses, approved schools, and teacher profiles in one searchable catalog.",
  },
  {
    icon: BookOpen,
    title: "Learn",
    copy: "Compare course listings and find a subject worth pursuing. Enrollment and progress tracking are planned for a later phase.",
  },
  {
    icon: Users2,
    title: "Teach",
    copy: "Join as a teacher and appear in the Explore directory. Course creation and publishing tools are planned for a later phase.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    copy: "School accounts and role-based access are available now. School management and analytics are planned for a later phase.",
  },
];

export default async function LandingPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = getLocale(searchParams?.lang);
  const t = dictionaries[locale];
  const [courses, schools] = await Promise.all([getFeaturedCourses(), getFeaturedSchools()]);

  return (
    <>
      <section className="relative overflow-hidden pb-2">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(199,154,59,0.14),transparent_20%)]" />
        <div className="container-shagaf relative py-10 md:py-16 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-shagaf-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-700 shadow-sm backdrop-blur-sm dark:border-shagaf-800/60 dark:bg-shagaf-950/50 dark:text-shagaf-200">
                {t.home.badge}
              </div>
              <h1 className="max-w-[13ch] font-display text-4xl font-semibold leading-[0.96] text-shagaf-700 dark:text-shagaf-200 md:text-5xl lg:text-6xl">
                {t.home.hero}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[--text-muted] md:text-lg md:leading-8">
                {t.home.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={withLocale("/explore", locale)}>
                  <Button size="lg" className="px-6">{t.home.explore}</Button>
                </Link>
                <Link href={withLocale("/for-schools", locale)}>
                  <Button size="lg" variant="outline" className="px-6">{t.home.forSchools}</Button>
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[--border] bg-[--surface]/80 p-4 shadow-card">
                  <p className="text-2xl font-semibold text-[--text]">+120</p>
                  <p className="mt-1 text-sm text-[--text-muted]">{t.home.schools}</p>
                </div>
                <div className="rounded-2xl border border-[--border] bg-[--surface]/80 p-4 shadow-card">
                  <p className="text-2xl font-semibold text-[--text]">+500</p>
                  <p className="mt-1 text-sm text-[--text-muted]">{t.home.teachers}</p>
                </div>
                <div className="rounded-2xl border border-[--border] bg-[--surface]/80 p-4 shadow-card">
                  <p className="text-2xl font-semibold text-[--text]">Career</p>
                  <p className="mt-1 text-sm text-[--text-muted]">{t.home.career}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-5 -top-5 hidden h-24 w-24 rounded-full bg-gold-500/20 blur-2xl md:block" />
              <div className="absolute -left-5 bottom-5 hidden h-24 w-24 rounded-full bg-shagaf-500/20 blur-2xl md:block" />
              <div className="relative overflow-hidden rounded-[28px] border border-[--border] bg-[--surface] shadow-[0_30px_80px_-25px_rgba(31,21,61,0.45)]">
                <div className="relative h-[420px] sm:h-[500px]">
                  <Image
                    src="/images/academy-classroom.webp"
                    alt={t.home.photoAlt}
                    fill
                    priority
                    sizes="(max-width: 767px) 100vw, (max-width: 1200px) 48vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171126]/85 via-[#171126]/20 to-transparent" />
                </div>
                <div className="grid gap-4 border-t border-[--border] bg-[--surface] p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">{t.home.why}</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-[--text]">{t.home.photoCaption}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-shagaf-200 bg-shagaf-50 text-shagaf-700 dark:border-shagaf-800/80 dark:bg-shagaf-900/40 dark:text-shagaf-200">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shagaf py-14 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">{t.home.why}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[--text] md:text-4xl">{t.home.subtitle}</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {offerings.map(({ icon: Icon, title, copy }, index) => {
            const localizedTitle = [t.home.discover, t.home.learn, t.home.teach, t.home.grow][index];
            const localizedCopy = [
              "Explore published courses, approved schools, and teacher profiles in one searchable catalog.",
              "Compare course listings and find a subject worth pursuing. Enrollment and progress tracking are planned for a later phase.",
              "Join as a teacher and appear in the Explore directory. Course creation and publishing tools are planned for a later phase.",
              "School accounts and role-based access are available now. School management and analytics are planned for a later phase.",
            ][index];

            return (
              <div key={title} className="rounded-2xl border border-[--border] bg-[--surface] p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_-22px_rgba(76,40,184,0.35)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-shagaf-100 text-shagaf-700 dark:bg-shagaf-900/40 dark:text-shagaf-200">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-[--text]">{localizedTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-[--text-muted]">{localizedCopy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-shagaf py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[--border] bg-[--surface-subtle] shadow-card">
            <Image
              src="/images/academy-study-group.webp"
              alt="Learner studying in an academy library"
              fill
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">Built for momentum</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[--text] md:text-4xl">A platform designed around real career outcomes.</h2>
            <p className="mt-4 text-base leading-7 text-[--text-muted] md:text-lg">
              SHAGAF brings together schools, teachers, and learners in one premium experience that makes discovery feel easier, smarter, and more motivating.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
                <p className="font-display text-2xl font-semibold text-[--text]">1.7x</p>
                <p className="mt-1 text-sm text-[--text-muted]">More discoverability for schools and teachers</p>
              </div>
              <div className="rounded-2xl border border-[--border] bg-[--surface] p-4">
                <p className="font-display text-2xl font-semibold text-[--text]">24/7</p>
                <p className="mt-1 text-sm text-[--text-muted]">Always-on access to profiles and pathways</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shagaf py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-[--text]">{t.home.featuredCourses}</h2>
          <Link href={withLocale("/explore", locale)} className="text-sm font-medium text-shagaf-600 hover:underline">
            {t.home.browseAll}
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

      <section className="container-shagaf py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-[--text]">{t.home.featuredSchools}</h2>
          <Link href={withLocale("/explore?tab=schools", locale)} className="text-sm font-medium text-shagaf-600 hover:underline">
            {t.home.browseAll}
          </Link>
        </div>
        {schools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {schools.map((s) => (
              <SchoolCard key={s.slug} school={s} />
            ))}
          </div>
        ) : (
          <EmptyState title={t.home.noSchools} />
        )}
      </section>

      <section className="mt-8 border-y border-[--border] bg-[--surface-subtle]">
        <div className="container-shagaf grid items-center gap-8 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[--text] md:text-4xl">{t.home.schoolCTA}</h2>
            <p className="mt-4 max-w-lg text-[--text-muted]">{t.home.schoolText}</p>
          </div>
          <div className="flex md:justify-end">
            <Link href={withLocale("/register", locale)}>
              <Button size="lg" className="gap-2">
                Create a school account <ArrowUpRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
