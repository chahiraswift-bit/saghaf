import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RoadmapCard } from "@/components/dashboard/RoadmapCard";

export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="container-shagaf py-12">
      <p className="text-sm text-ink-muted">Signed in as {user.email}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-[--text]">
        Welcome, {profile?.full_name ?? "there"}
      </h1>
      <p className="mt-2 text-ink-muted">
        Your role: <span className="font-medium text-[--text]">{profile?.role}</span>
      </p>

      <div className="mt-10">
        <RoadmapCard area="dashboard" />
      </div>
    </div>
  );
}
