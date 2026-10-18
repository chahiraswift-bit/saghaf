"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOut() {
  const supabase = createClient() as any;
  await supabase.auth.signOut();
  redirect("/");
}

export async function markNotificationRead(formData: FormData) {
  const supabase = createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const notificationId = String(formData.get("notification_id") ?? "");
  if (!notificationId) return;
  await supabase.from("notifications").update({ read: true }).eq("id", notificationId).eq("user_id", user.id);
  revalidatePath("/dashboard", "layout");
}