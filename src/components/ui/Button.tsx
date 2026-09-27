import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-shagaf-700 text-white hover:bg-shagaf-800 active:bg-shagaf-900 disabled:bg-shagaf-300",
  secondary:
    "bg-shagaf-100 text-shagaf-800 hover:bg-shagaf-200 dark:bg-shagaf-900/40 dark:text-shagaf-200 dark:hover:bg-shagaf-900/60",
  outline:
    "border border-[--border] text-[--text] hover:bg-[--surface-subtle] bg-transparent",
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
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
