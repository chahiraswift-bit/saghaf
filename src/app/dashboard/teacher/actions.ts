"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function savePayoutProfile(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "teacher") redirect("/dashboard");

  const method = String(formData.get("payout_method") ?? "bank_transfer");
  const holder = String(formData.get("account_holder") ?? "").trim().slice(0, 140);
  const reference = String(formData.get("account_reference") ?? "").trim().slice(0, 180);
  const bank = String(formData.get("bank_name") ?? "").trim().slice(0, 120);

  if (!["bank_transfer", "baridimob", "paypal"].includes(method) || holder.length < 2 || reference.length < 4) {
    redirect("/dashboard/teacher?payout=invalid#payout");
  }

  const { error } = await supabase.from("teacher_payout_profiles").upsert({
    teacher_id: user.id,
    payout_method: method as "bank_transfer" | "baridimob" | "paypal",
    account_holder: holder,
    account_reference: reference,
    bank_name: bank || null,
  });

  if (error) redirect("/dashboard/teacher?payout=failed#payout");
  revalidatePath("/dashboard/teacher");
  redirect("/dashboard/teacher?payout=saved#payout");
}

export async function requestPayout(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "teacher") redirect("/dashboard");

  const amount = Number(formData.get("amount_dzd"));
  if (!Number.isFinite(amount) || amount <= 0) redirect("/dashboard/teacher?payout=invalid#payout");

  const { data: courseRows } = await supabase.from("courses").select("id").eq("teacher_id", user.id);
  const ids = (courseRows ?? []).map((c: any) => c.id);

  const { data: paid } = ids.length ? await supabase.from("transactions").select("amount_dzd").eq("status", "succeeded").in("course_id", ids) : { data: [] };
  const { data: requests } = await supabase.from("teacher_payout_requests").select("amount_dzd,status").eq("teacher_id", user.id).in("status", ["pending", "approved", "paid"]);

  const gross = (paid ?? []).reduce((n: number, r: any) => n + Number(r.amount_dzd), 0);
  const reserved = (requests ?? []).reduce((n: number, r: any) => n + Number(r.amount_dzd), 0);
  const available = Math.max(0, gross * 0.8 - reserved);

  if (amount > available) redirect("/dashboard/teacher?payout=exceeds#payout");

  const { error } = await supabase.from("teacher_payout_requests").insert({ teacher_id: user.id, amount_dzd: amount });
  if (error) redirect("/dashboard/teacher?payout=failed#payout");

  revalidatePath("/dashboard/teacher");
  redirect("/dashboard/teacher?payout=requested#payout");
}

export async function createDraftCourse(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "teacher") redirect("/dashboard");

  const title = String(formData.get("title") ?? "").trim().slice(0, 160);
  const description = String(formData.get("description") ?? "").trim().slice(0, 4000);
  const language = String(formData.get("language") ?? "").trim().slice(0, 16);
  const level = String(formData.get("level") ?? "");

  if (title.length < 3 || !description || !language || !("beginner intermediate advanced".split(" ").includes(level))) {
    redirect("/dashboard/teacher?course=invalid#workflow");
  }

  const base = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-\$/g, "").slice(0, 90) || "course";
  
  const { error } = await supabase.from("courses").insert({
    teacher_id: user.id,
    title,
    description,
    slug: `${base}-${crypto.randomUUID().slice(0, 8)}`,
    level: level as "beginner" | "intermediate" | "advanced",
    language,
    mode: "online",
    price_dzd: 0,
    status: "draft",
  });

  if (error) redirect("/dashboard/teacher?course=failed#workflow");
  revalidatePath("/dashboard/teacher");
  redirect("/dashboard/teacher?course=created#courses");
}
