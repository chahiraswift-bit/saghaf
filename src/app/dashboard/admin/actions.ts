"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function moderateRecord(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "super_admin") redirect("/dashboard");

  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!id || !(decision === "approve" || decision === "reject")) {
    redirect("/dashboard/admin?updated=invalid");
  }

  let error: { message: string } | null = null;
  const newStatus = decision === "approve" ? "published" : "rejected";

  if (kind === "course") {
    const result = await supabase.from("courses").update({ status: decision === "approve" ? "published" : "rejected" }).eq("id", id);
    error = result.error;
  } else if (kind === "school") {
    const result = await supabase.from("schools").update({ status: decision === "approve" ? "approved" : "rejected", verified: decision === "approve" }).eq("id", id);
    error = result.error;
  } else if (kind === "company") {
    const result = await supabase.from("companies").update({ status: decision === "approve" ? "approved" : "suspended" }).eq("id", id);
    error = result.error;
  } else if (kind === "training_request") {
    const result = await supabase.from("training_requests").update({ status: decision === "approve" ? "approved" : "declined", reviewed_at: new Date().toISOString() }).eq("id", id);
    error = result.error;
  } else {
    redirect("/dashboard/admin?updated=invalid");
  }

  if (error) redirect("/dashboard/admin?updated=failed");

  const entity = kind === "training_request" ? "training_request" : kind;
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: `${decision}_${kind}`,
    entity_type: entity,
    entity_id: id,
    metadata: { decision },
  });

  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin?updated=success");
}

export async function setAccountStatus(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: actor } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (actor?.role !== "super_admin") redirect("/dashboard");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["active", "suspended"].includes(status) || id === user.id) {
    redirect("/dashboard/admin?updated=invalid");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ account_status: status })
    .eq("id", id);

  if (error) redirect("/dashboard/admin?updated=failed");

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: `account_${status}`,
    entity_type: "profile",
    entity_id: id,
    metadata: { status },
  });

  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin?updated=success");
}

export async function settleCourseOrder(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: actor } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (actor?.role !== "super_admin") redirect("/dashboard");

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/dashboard/admin?updated=invalid#payments");

  const { data: order } = await supabase
    .from("transactions")
    .select("id,learner_id,course_id,status")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();

  if (!order || !order.course_id) redirect("/dashboard/admin?updated=failed#payments");

  const { error } = await supabase
    .from("transactions")
    .update({ status: "succeeded", paid_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");

  if (error) redirect("/dashboard/admin?updated=failed#payments");

  const { error: enrollmentError } = await supabase
    .from("enrollments")
    .upsert({ learner_id: order.learner_id, course_id: order.course_id, status: "active" }, { onConflict: "learner_id,course_id" });

  if (enrollmentError) redirect("/dashboard/admin?updated=failed#payments");

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "payment_settled",
    entity_type: "transaction",
    entity_id: id,
    metadata: { transaction_id: id },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/learner");
  redirect("/dashboard/admin?updated=success#payments");
}

export async function reviewPayoutRequest(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: actor } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (actor?.role !== "super_admin") redirect("/dashboard");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !(status === "paid" || status === "rejected")) {
    redirect("/dashboard/admin?updated=invalid#payouts");
  }

  const { error } = await supabase
    .from("teacher_payout_requests")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");

  if (error) redirect("/dashboard/admin?updated=failed#payouts");

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: `payout_${status}`,
    entity_type: "teacher_payout_request",
    entity_id: id,
    metadata: { status },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/teacher");
  redirect("/dashboard/admin?updated=success#payouts");
}

