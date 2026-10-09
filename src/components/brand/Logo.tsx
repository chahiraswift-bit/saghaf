import Image from "next/image";
import Link from "next/link";

/**
 * Renders the official SHAGAF lockup, unaltered, choosing the light- or
 * dark-background version of the source file rather than recoloring it.
 * Per brand guidelines: never reshape, recolor, or redraw the mark.
 */
export function Logo({
  variant = "auto",
  withTagline = false,
  size = 36,
  className = "",
}: {
  variant?: "auto" | "light" | "dark";
  withTagline?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="SHAGAF home">
      {variant !== "dark" && (
        <Image
          src="/brand/logo-symbol-light.png"
          alt="SHAGAF"
          width={size}
          height={size * 1.5}
          className={variant === "auto" ? "block shrink-0 dark:hidden" : "shrink-0"}
          style={{ width: size, height: "auto" }}
          priority
        />
      )}
      {variant !== "light" && (
        <Image
          src="/brand/logo-symbol-light.png"
          alt="SHAGAF"
          width={size}
          height={size * 1.5}
          className={variant === "auto" ? "hidden shrink-0 dark:block" : "shrink-0"}
          style={{ width: size, height: "auto", filter: "brightness(1.05)" }}
          priority
        />
      )}
      <span className="flex flex-col leading-none">
        <span className="font-display font-semibold tracking-tight text-[1.15rem] text-ink dark:text-white">
          SHAGAF
        </span>
        {withTagline && (
          <span className="text-[0.65rem] text-ink-muted dark:text-white/60 mt-0.5">
            From Passion to Profession
          </span>
        )}
      </span>
    </Link>
  );
}

/** Full lockup (mark + wordmark baked into the source file) — for auth screens, footer, certificates. */
export function LogoLockup({ theme = "auto" }: { theme?: "auto" | "light" | "dark" }) {
  return (
    <span className="inline-block">
      {theme !== "dark" && (
        <Image
          src="/brand/logo-lockup-light.png"
          alt="SHAGAF — From Passion to Profession"
          width={220}
          height={294}
          className={theme === "auto" ? "block dark:hidden" : ""}
        />
      )}
      {theme !== "light" && (
        <Image
          src="/brand/logo-lockup-dark.png"
          alt="SHAGAF — From Passion to Profession"
          width={220}
          height={294}
          className={theme === "auto" ? "hidden dark:block" : ""}
        />
      )}
    </span>
  );
}
