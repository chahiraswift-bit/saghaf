export function formatDzd(value: number | string | null | undefined) {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(Number(value));
}
