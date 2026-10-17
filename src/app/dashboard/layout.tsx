import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell, type Role } from "./ui";

const roleRoute: Record<string, Role> = { learner: "learner", teacher: "teacher", school_admin: "schools", company_admin: "corporate", super_admin: "admin" };
export default async function DashboardLayout({children}:{children:React.ReactNode}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");
  const [{data},{data:notifications}] = await Promise.all([
    supabase.from("profiles").select("full_name,role,avatar_url").eq("id",user.id).maybeSingle(),
    supabase.from("notifications").select("id,title,message,read,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8),
  ]);
  const profile = data as {full_name:string;role:string;avatar_url:string|null} | null;
  const role = roleRoute[profile?.role ?? ""];
  if (!role) redirect("/login");
  return <DashboardShell role={role} displayName={profile?.full_name || user.email || "Account"} avatarUrl={profile?.avatar_url ?? null} notifications={notifications ?? []}>{children}</DashboardShell>;
}
