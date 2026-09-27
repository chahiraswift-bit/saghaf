import Link from "next/link";
import { Star, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export interface CourseCardData {
  slug: string;
  title: string;
  thumbnail_url: string | null;
  level: string;
  mode: string;
  price_dzd: number;
  rating_avg: number;
  rating_count: number;
  students_count: number;
  teacher_name?: string | null;
  school_name?: string | null;
}

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block overflow-hidden rounded-lg border border-[--border] bg-[--surface] transition-colors hover:border-shagaf-400"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-[--surface-subtle]">
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-shagaf-300">SHAGAF</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          {course.school_name && <span>{course.school_name}</span>}
          {course.school_name && course.teacher_name && <span aria-hidden>·</span>}
          {course.teacher_name && <span>{course.teacher_name}</span>}
        </div>

        <h3 className="mt-1.5 line-clamp-2 font-display font-semibold text-[--text]">
          {course.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="purple">{course.level}</Badge>
          <Badge>{course.mode}</Badge>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[--border] pt-3">
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-gold-500 text-gold-500" />
              {course.rating_avg > 0 ? course.rating_avg.toFixed(1) : "New"}
              {course.rating_count > 0 && ` (${course.rating_count})`}
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} /> {course.students_count}
            </span>
          </div>
          <span className="font-display font-semibold text-[--text]">
            {formatPrice(course.price_dzd)}
          </span>
        </div>
      </div>
    </Link>
  );
}
