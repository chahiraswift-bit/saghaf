import { LogoLockup } from "@/components/brand/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-[--text]">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center bg-[--surface-subtle] border-l border-[--border] px-12">
        <LogoLockup />
        <p className="mt-8 max-w-xs text-center text-ink-muted">
          "I'm not just looking for a course, I'm building my future."
        </p>
      </div>
    </div>
  );
}
