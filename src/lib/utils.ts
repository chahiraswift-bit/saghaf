import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(dzd: number) {
  if (dzd === 0) return "Free";
  return new Intl.NumberFormat("en-DZ", { maximumFractionDigits: 0 }).format(dzd) + " DZD";
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
