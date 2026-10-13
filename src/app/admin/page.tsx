import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RoadmapCard } from "@/components/dashboard/RoadmapCard";

export const dynamic = "force-dynamic";

interface AdminProfile {
  full_name: string | null;
  role: string | null;
}

export default async function AdminHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // جلب البيانات مع تحديد النوع بشكل صحيح لـ TypeScript
  const { data } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as AdminProfile | null;

  return (
    <div className="container-shagaf py-12">
      <p className="text-sm text-ink-muted">Signed in as {user.email}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-shagaf-700 dark:text-shagaf-200">
        Welcome, {profile?.full_name ?? "there"}
      </h1>
      <p className="mt-2 text-ink-muted">
        Your role: <span className="font-medium text-[--text]">{profile?.role ?? "User"}</span>
      </p>

      <div className="mt-10">
        <RoadmapCard area="admin" />
      </div>
    </div>
  );
}