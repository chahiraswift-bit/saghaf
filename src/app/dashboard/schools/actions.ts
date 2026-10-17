"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createSchoolWorkspace(formData:FormData){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="school_admin")redirect("/dashboard");
 const name=String(formData.get("name")??"").trim().slice(0,140);const location=String(formData.get("location")??"").trim().slice(0,160);const description=String(formData.get("description")??"").trim().slice(0,2000);
 if(name.length<2)redirect("/dashboard/schools?setup=invalid#institution");
 const slug=`${name.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,100)||"school"}-${crypto.randomUUID().slice(0,8)}`;
 const {error}=await supabase.from("schools").insert({owner_id:user.id,name,slug,location:location||null,description:description||null});
 if(error)redirect("/dashboard/schools?setup=failed#institution");revalidatePath("/dashboard/schools");redirect("/dashboard/schools?setup=created#institution");
}

export async function requestSchoolPlan(formData:FormData){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="school_admin")redirect("/dashboard");
 const schoolId=String(formData.get("school_id")??"");const plan=String(formData.get("plan")??"");const seats=Number(formData.get("seats"));
 if(!["basic","pro","enterprise"].includes(plan)||!Number.isInteger(seats)||seats<1||seats>100000)redirect("/dashboard/schools?plan=invalid#plans");
 const {data:school}=await supabase.from("schools").select("id").eq("id",schoolId).eq("owner_id",user.id).maybeSingle();if(!school)redirect("/dashboard/schools?plan=failed#plans");
 const {error}=await supabase.from("school_subscription_orders").insert({school_id:schoolId,requested_plan:plan as "basic"|"pro"|"enterprise",requested_seats:seats});
 if(error)redirect("/dashboard/schools?plan=failed#plans");revalidatePath("/dashboard/schools");redirect("/dashboard/schools?plan=requested#plans");
}
