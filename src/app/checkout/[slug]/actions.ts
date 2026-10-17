"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function startCourseCheckout(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/explore");
const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "learner") redirect("/dashboard");
  const courseId = String(formData.get("course_id") ?? "");
  const method = String(formData.get("payment_method") ?? "bank_transfer");
  if (!courseId || !["bank_transfer", "cib", "edahabia", "stripe", "paypal"].includes(method)) redirect("/explore");
  const { data: course } = await supabase.from("courses").select("id,title,slug,price_dzd,status").eq("id", courseId).eq("status", "published").maybeSingle();
  if (!course) redirect("/explore?checkout=unavailable");
  const { data: existing } = await supabase.from("enrollments").select("id").eq("learner_id", user.id).eq("course_id", course.id).neq("status", "cancelled").maybeSingle();
  if (existing) redirect("/dashboard/learner?checkout=already-enrolled");
  if (Number(course.price_dzd) <= 0) {
    const { error } = await supabase.from("enrollments").insert({ learner_id: user.id, course_id: course.id, status: "active" });
    if (error) redirect(`/checkout/${course.slug}?checkout=failed`);
    revalidatePath("/dashboard/learner");
    redirect("/dashboard/learner?checkout=free-enrolled");
  }
  // No payment provider is configured in this workspace: all orders stay pending.
  const invoice = `SH-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { error } = await supabase.from("transactions").insert({
    learner_id: user.id, course_id: course.id, amount_dzd: Number(course.price_dzd), status: "pending",
    provider: method, payment_method: method, invoice_number: invoice,
  });
  if (error) redirect(`/checkout/${course.slug}?checkout=failed`);
  revalidatePath("/dashboard/learner");
  redirect(`/dashboard/learner?checkout=order-created&invoice=${invoice}#orders`);
}
