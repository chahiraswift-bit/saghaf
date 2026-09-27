import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";

export interface SchoolCardData {
  slug: string;
  name: string;
  logo_url: string | null;
  location: string | null;
  verified: boolean;
  description: string | null;
}

export function SchoolCard({ school }: { school: SchoolCardData }) {
  return (
    <Link
      href={`/schools/${school.slug}`}
      className="group flex items-start gap-4 rounded-lg border border-[--border] bg-[--surface] p-5 transition-colors hover:border-shagaf-400"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-shagaf-100 dark:bg-shagaf-900/40">
        {school.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={school.logo_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display font-semibold text-shagaf-700 dark:text-shagaf-300">
            {school.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-display font-semibold text-[--text]">{school.name}</h3>
          {school.verified && <BadgeCheck size={16} className="shrink-0 text-shagaf-600" />}
        </div>
        {school.location && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin size={12} /> {school.location}
          </p>
        )}
        {school.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{school.description}</p>
        )}
      </div>
    </Link>
  );
}
