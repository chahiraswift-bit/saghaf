import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard, type CourseCardData } from "@/components/course/CourseCard";
import { SchoolCard, type SchoolCardData } from "@/components/school/SchoolCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export const revalidate = 30;

type Tab = "all" | "courses" | "schools" | "teachers";

async function getCourses(q: string) {
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
  return (data ?? []).map((c: any) => ({
    ...c,
    teacher_name: c.teacher?.full_name ?? null,
    school_name: c.school?.name ?? null,
  })) as CourseCardData[];
}

async function getSchools(q: string) {
  const supabase = createClient();
  let query = supabase
    .from("schools")
    .select("slug, name, logo_url, location, verified, description")
    .eq("status", "approved")
    .limit(24);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data } = await query;
  return (data ?? []) as SchoolCardData[];
}

async function getTeachers(q: string) {
  const supabase = createClient();
  let query = supabase
    .from("profiles")
    .select("id, full_name, headline, avatar_url")
    .eq("role", "teacher")
    .limit(24);
  if (q) query = query.ilike("full_name", `%${q}%`);
  const { data } = await query;
  return data ?? [];
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string };
}) {
  const tab = (["all", "courses", "schools", "teachers"].includes(searchParams.tab ?? "")
    ? searchParams.tab
    : "all") as Tab;
  const q = searchParams.q ?? "";

  const [courses, schools, teachers] = await Promise.all([
    tab === "all" || tab === "courses" ? getCourses(q) : Promise.resolve([]),
    tab === "all" || tab === "schools" ? getSchools(q) : Promise.resolve([]),
    tab === "all" || tab === "teachers" ? getTeachers(q) : Promise.resolve([]),
  ]);

  const tabs: { value: Tab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "courses", label: "Courses" },
    { value: "schools", label: "Schools" },
    { value: "teachers", label: "Teachers" },
  ];

  return (
    <div className="container-shagaf py-10">
      <h1 className="font-display text-3xl font-semibold text-[--text]">Explore SHAGAF</h1>
      <p className="mt-1 text-ink-muted">Search courses, schools and teachers in one place.</p>

      <form className="mt-6 flex gap-2" action="/explore" method="get">
        <input type="hidden" name="tab" value={tab} />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search for Python, UI design, French…"
          className="h-11 w-full max-w-md rounded-md border border-[--border] bg-[--surface] px-3.5 text-sm"
        />
        <button className="h-11 rounded-md bg-shagaf-700 px-5 text-sm font-medium text-white hover:bg-shagaf-800">
          Search
        </button>
      </form>

      <div className="mt-6 flex gap-1 border-b border-[--border]">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={`/explore?tab=${t.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium",
              tab === t.value
                ? "border-shagaf-600 text-[--text]"
                : "border-transparent text-ink-muted hover:text-[--text]"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-12">
        {(tab === "all" || tab === "courses") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">Courses</h2>}
            {courses.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            ) : (
              <EmptyState title="No courses found" hint={q ? `Nothing matched "${q}".` : "No published courses yet."} />
            )}
          </section>
        )}

        {(tab === "all" || tab === "schools") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">Schools</h2>}
            {schools.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {schools.map((s) => (
                  <SchoolCard key={s.slug} school={s} />
                ))}
              </div>
            ) : (
              <EmptyState title="No schools found" />
            )}
          </section>
        )}

        {(tab === "all" || tab === "teachers") && (
          <section>
            {tab === "all" && <h2 className="mb-4 font-display text-xl font-semibold text-[--text]">Teachers</h2>}
            {teachers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {teachers.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg border border-[--border] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-shagaf-100 text-shagaf-700 dark:bg-shagaf-900/40 dark:text-shagaf-200">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-[--text]">{t.full_name}</p>
                      {t.headline && <p className="text-xs text-ink-muted">{t.headline}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No teachers found" />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
