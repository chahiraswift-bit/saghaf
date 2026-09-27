import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-[--surface-subtle] text-ink-muted",
  purple: "bg-shagaf-100 text-shagaf-800 dark:bg-shagaf-900/50 dark:text-shagaf-200",
  gold: "bg-gold-400/15 text-gold-600",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
