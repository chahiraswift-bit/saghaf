const ROADMAP: Record<string, { phase: string; items: string[] }> = {
  dashboard: {
    phase: "Phase 3",
    items: ["My Courses & progress", "Certificates", "Favorites", "Reviews"],
  },
  teacher: {
    phase: "Phase 4",
    items: ["Create & manage courses", "Lessons", "Students", "Analytics & earnings"],
  },
  school: {
    phase: "Phase 5",
    items: ["Teachers roster", "Courses", "Enrollments", "Advertising", "Analytics"],
  },
  admin: {
    phase: "Phase 6",
    items: ["User/School/Course moderation", "Advertising approval", "Platform analytics"],
  },
};

export function RoadmapCard({ area }: { area: string }) {
  const info = ROADMAP[area];
  if (!info) return null;

  return (
    <div className="rounded-lg border border-dashed border-[--border] p-6">
      <p className="text-sm font-medium text-[--text]">
        Auth and role routing are live. The rest of this dashboard ships in {info.phase}.
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
        {info.items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-shagaf-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
