"use client";

import { usePathname } from "next/navigation";

export function RootChrome({ children, navbar, footer }: { children: React.ReactNode; navbar: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith("/dashboard");
  return <>{!dashboard && navbar}{dashboard?<div className="flex-1 pt-0">{children}</div>:<main className="flex-1 pt-3">{children}</main>}{!dashboard && footer}</>;
}
