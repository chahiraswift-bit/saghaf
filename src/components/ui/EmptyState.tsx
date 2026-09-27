export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[--border] p-10 text-center">
      <p className="font-display font-medium text-[--text]">{title}</p>
      {hint && <p className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}
