import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CourseCard, type CourseCardData } from "@/components/course/CourseCard";
import { SchoolCard, type SchoolCardData } from "@/components/school/SchoolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { GraduationCap, Search } from "lucide-react";
import { dictionaries, getLocale, withLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Tab = "all" | "courses" | "schools" | "teachers";

interface CourseRow {
  slug: string;
  title: string;
  thumbnail_url: string | null;
  level: string;
  mode: string;
  price_dzd: number;
  rating_avg: number;
  rating_count: number;
  students_count: number;
  teacher?: { full_name: string | null } | null;
  school?: { name: string | null } | null;
}

interface SchoolRow {
  slug: string;
  name: string;
  logo_url: string | null;
  location: string | null;
  verified: boolean;
  description: string | null;
}

interface TeacherRow {
  id: string;
  full_name: string;
  headline: string | null;
  avatar_url: string | null;
}

async function getCourses(q: string): Promise<CourseCardData[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("courses")
      .select(
        "slug, title, thumbnail_url, level, mode, price_dzd, rating_avg, rating_count, students_count, teacher:profiles(full_name), school:schools(name)"
      )
      .eq("status", "published")
      .limit(24);
    if (q) query = query.ilike("title", `%${q}%`);
    const { data } = await query;
    const rows = (data ?? []) as CourseRow[];
    return rows.map((course) => ({
      slug: course.slug,
      title: course.title,
      thumbnail_url: course.thumbnail_url,
      level: course.level,
      mode: course.mode,
      price_dzd: course.price_dzd,
      rating_avg: course.rating_avg,
      rating_count: course.rating_count,
      students_count: course.students_count,
      teacher_name: course.teacher?.full_name ?? null,
      school_name: course.school?.name ?? null,
    }));
  } catch {
    return [];
  }
}

async function getSchools(q: string): Promise<SchoolCardData[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("schools")
      .select("slug, name, logo_url, location, verified, description")
      .eq("status", "approved")
      .limit(24);
    if (q) query = query.ilike("name", `%${q}%`);
    const { data } = await query;
    return (data ?? []) as SchoolRow[] as SchoolCardData[];
  } catch {
    return [];
  }
}

async function getTeachers(q: string): Promise<TeacherRow[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("profiles")
      .select("id, full_name, headline, avatar_url")
      .eq("role", "teacher")
      .limit(24);
    if (q) query = query.ilike("full_name", `%${q}%`);
    const { data } = await query;
    return (data ?? []) as TeacherRow[];
  } catch {
    return [];
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string; lang?: string };
}) {
  const locale = getLocale(searchParams.lang);
  const t = dictionaries[locale];
  const tab = (["all", "courses", "schools", "teachers"].includes(searchParams.tab ?? "")
    ? searchParams.tab
    : "all") as Tab;
  const q = searchParams.q ?? "";

  const [courses, schools, teachers]: [CourseCardData[], SchoolCardData[], TeacherRow[]] = await Promise.all([
    tab === "all" || tab === "courses" ? getCourses(q) : Promise.resolve([] as CourseCardData[]),
    tab === "all" || tab === "schools" ? getSchools(q) : Promise.resolve([] as SchoolCardData[]),
    tab === "all" || tab === "teachers" ? getTeachers(q) : Promise.resolve([] as TeacherRow[]),
  ]);

  const tabs: { value: Tab; label: string }[] = [
    { value: "all", label: t.explore.all },
    { value: "courses", label: t.explore.courses },
    { value: "schools", label: t.explore.schools },
    { value: "teachers", label: t.explore.teachers },
  ];

  return (
    <div className="container-shagaf py-8 md:py-12">
      <section className="grid gap-7 md:grid-cols-[1fr_0.82fr] md:items-center md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-shagaf-600">{t.explore.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-shagaf-700 dark:text-shagaf-200 md:text-5xl">{t.explore.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[--text-muted] md:text-lg">{t.explore.subtitle}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-[--border] bg-shagaf-900 shadow-[0_30px_80px_-30px_rgba(31,21,61,0.5)] sm:min-h-[260px]">
          <Image
            src="/images/academy-classroom-interior.webp"
            alt="Bright academy classroom ready for a lesson"
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 40vw, 460px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171126]/80 via-[#171126]/25 to-transparent" />
          <p className="absolute bottom-0 p-4 font-display text-lg font-semibold text-white sm:p-5">{t.explore.photoCaption}</p>
        </div>
      </section>

      <form className="mt-8 flex max-w-3xl gap-2 rounded-2xl border border-[--border] bg-[--surface] p-2 shadow-card" action="/explore" method="get">
        <input type="hidden" name="tab" value={tab} />
        {locale !== "en" && <input type="hidden" name="lang" value={locale} />}
        <input
          name="q"
          defaultValue={q}
          placeholder={t.explore.searchPlaceholder}
          className="h-12 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-4 text-sm text-[--text] placeholder:text-[--text-muted] focus:border-shagaf-200 focus:outline-none"
        />
        <button className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-shagaf-700 px-4 text-sm font-medium text-white transition-colors hover:bg-shagaf-800 sm:px-5">
          <Search size={16} aria-hidden="true" />
          <span>{t.explore.search}</span>
        </button>
      </form>

      <nav aria-label="Explore categories" className="mt-7 flex gap-1 overflow-x-auto border-b border-[--border] pb-1">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={withLocale(`/explore?tab=${t.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`, locale)}
            className={cn(
              "whitespace-nowrap rounded-t-xl border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-shagaf-600 text-[--text]"
                : "border-transparent text-[--text-muted] hover:text-[--text]"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 space-y-12">
        {(tab === "all" || tab === "courses") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">{t.explore.courses}</h2>}
            {courses.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            ) : (
              <EmptyState title={t.explore.noCourses} hint={q ? t.explore.noMatch.replace("{q}", q) : t.explore.noPublished} />
            )}
          </section>
        )}

        {(tab === "all" || tab === "schools") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">{t.explore.schools}</h2>}
            {schools.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {schools.map((s) => (
                  <SchoolCard key={s.slug} school={s} />
                ))}
              </div>
            ) : (
              <EmptyState title={t.explore.noSchools} />
            )}
          </section>
        )}

        {(tab === "all" || tab === "teachers") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">{t.explore.teachers}</h2>}
            {teachers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 rounded-2xl border border-[--border] bg-[--surface] p-4 shadow-card transition-colors hover:bg-[--surface-subtle]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-shagaf-100 text-shagaf-700 dark:bg-shagaf-900/40 dark:text-shagaf-200">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-[--text]">{teacher.full_name}</p>
                      {teacher.headline && <p className="text-xs text-[--text-muted]">{teacher.headline}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={t.explore.noTeachers} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
