import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-shagaf-700 text-white shadow-[0_8px_20px_-10px_rgba(111,4,70,0.65)] hover:bg-shagaf-800 active:translate-y-px disabled:bg-shagaf-300",
  secondary:
    "bg-shagaf-100 text-shagaf-800 hover:bg-shagaf-200 dark:bg-shagaf-900/40 dark:text-shagaf-200 dark:hover:bg-shagaf-900/60",
  outline:
    "border border-[--border] bg-white/75 text-[--text] hover:bg-[--surface-subtle] backdrop-blur-sm dark:bg-white/5",
  ghost: "text-[--text] hover:bg-[--surface-subtle] bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shagaf-600 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
