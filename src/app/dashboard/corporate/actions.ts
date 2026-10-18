"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addCompanyEmployee(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "company_admin") redirect("/dashboard");

  const companyId = String(formData.get("company_id") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 140);
  const department = String(formData.get("department") ?? "").trim().slice(0, 100);

  if (!companyId || !/^\S+@\S+\.\S+$/.test(email)) redirect("/dashboard/corporate?invite=invalid#employees");

  const { data: company } = await supabase
    .from("companies")
    .select("id,seats_allocated")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!company) redirect("/dashboard/corporate?invite=failed#employees");

  const { count } = await supabase
    .from("company_employees")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);

  if ((count ?? 0) >= company.seats_allocated) redirect("/dashboard/corporate?invite=seats#employees");

  const { error } = await supabase
    .from("company_employees")
    .insert({ company_id: companyId, email, full_name: fullName || null, department: department || null });

  if (error) redirect("/dashboard/corporate?invite=failed#employees");
  revalidatePath("/dashboard/corporate");
  redirect("/dashboard/corporate?invite=created#employees");
}

export async function assignEmployeeCourse(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "company_admin") redirect("/dashboard");

  const companyId = String(formData.get("company_id") ?? "");
  const employeeId = String(formData.get("employee_id") ?? "");
  const courseId = String(formData.get("course_id") ?? "");

  if (!companyId || !employeeId || !courseId) redirect("/dashboard/corporate?assignment=invalid#matrix");

  const { error } = await supabase
    .from("company_course_assignments")
    .insert({ company_id: companyId, employee_id: employeeId, course_id: courseId });

  if (error) redirect("/dashboard/corporate?assignment=failed#matrix");
  revalidatePath("/dashboard/corporate");
  redirect("/dashboard/corporate?assignment=created#matrix");
}

export async function updateCompanyAllocation(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "company_admin") redirect("/dashboard");

  const companyId = String(formData.get("company_id") ?? "");
  const seats = Number(formData.get("seats_allocated"));
  const budget = Number(formData.get("training_budget_dzd"));

  if (!companyId || !Number.isInteger(seats) || seats < 1 || seats > 100000 || !Number.isFinite(budget) || budget < 0 || budget > 1_000_000_000) {
    redirect("/dashboard/corporate?allocation=invalid#employees");
  }

  const { count } = await supabase
    .from("company_employees")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);

  if (seats < (count ?? 0)) redirect("/dashboard/corporate?allocation=below-roster#employees");

  const { error } = await supabase
    .from("companies")
    .update({ seats_allocated: seats, training_budget_dzd: budget })
    .eq("id", companyId)
    .eq("owner_id", user.id);

  if (error) redirect("/dashboard/corporate?allocation=failed#employees");
  revalidatePath("/dashboard/corporate");
  redirect("/dashboard/corporate?allocation=updated#employees");
}

export async function createCompanyWorkspace(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "company_admin") redirect("/dashboard");

  const name = String(formData.get("name") ?? "").trim().slice(0, 140);
  const sector = String(formData.get("sector") ?? "").trim().slice(0, 100);
  const location = String(formData.get("location") ?? "").trim().slice(0, 120);
  const seats = Number(formData.get("seats_allocated") ?? 0);
  const budget = Number(formData.get("training_budget_dzd") ?? 0);

  if (name.length < 2 || !Number.isInteger(seats) || seats < 1 || seats > 100000 || !Number.isFinite(budget) || budget < 0 || budget > 1_000_000_000) {
    redirect("/dashboard/corporate?workspace=invalid");
  }

  const { error } = await supabase
    .from("companies")
    .insert({ owner_id: user.id, name, sector: sector || null, location: location || null, seats_allocated: seats, training_budget_dzd: budget });

  if (error) redirect("/dashboard/corporate?workspace=failed");
  revalidatePath("/dashboard/corporate");
  redirect("/dashboard/corporate?workspace=created");
}

export async function submitTrainingRequest(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = String(formData.get("company_id") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const objectives = String(formData.get("objectives") ?? "").trim().slice(0, 2000);
  const seats = Number(formData.get("target_seats"));

  if (!companyId || title.length < 3 || objectives.length < 10 || !Number.isInteger(seats) || seats < 1 || seats > 10000) {
    redirect("/dashboard/corporate?request=invalid");
  }

  const estimated = seats * (seats >= 250 ? 8400 : seats >= 50 ? 11200 : 14500);
  const { error } = await supabase
    .from("training_requests")
    .insert({ company_id: companyId, title, objectives, target_seats: seats, estimated_amount_dzd: estimated });

  if (error) redirect("/dashboard/corporate?request=failed");
  revalidatePath("/dashboard/corporate");
  redirect("/dashboard/corporate?request=submitted");
}