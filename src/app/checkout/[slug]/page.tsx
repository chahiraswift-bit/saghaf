import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Banknote, CreditCard, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDzd } from "@/app/dashboard/data";
import { startCourseCheckout } from "./actions";

export const dynamic = "force-dynamic";

export default async function CourseCheckout({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }> | { slug: string }; 
  searchParams: Promise<{ checkout?: string }> | { checkout?: string } 
}) {
  //فك الـ Promises لضمان التوافق التام مع Next.js 14
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const checkoutStatus = resolvedSearchParams.checkout;

  const supabase = createClient() as any;
  const [{ data: { user } }, { data: course }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("id,title,description,price_dzd,level,language").eq("slug", slug).eq("status", "published").maybeSingle(),
  ]);

  if (!course) redirect("/explore?checkout=unavailable");
  if (!user) redirect(`/login?redirect=/checkout/${slug}`);

  return (
    <main className="min-h-screen bg-[#100d15] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/explore" className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={14}/> Course catalog
        </Link>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-purple-300">Secure enrollment</p>
            <h1 className="mt-3 font-display text-3xl font-bold">{course.title}</h1>
            <p className="mt-3 text-sm leading-6 text-white/60">{course.description ?? `${course.level} course · ${course.language}`}</p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <ShieldCheck className="text-emerald-300" size={20}/>
              <div>
                <p className="text-sm font-semibold">Enrollment protected</p>
                <p className="mt-1 text-xs text-white/50">Your course access begins after payment verification.</p>
              </div>
            </div>
            <h2 className="mt-8 text-sm font-semibold">Payment method</h2>
            <div className="mt-3 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-purple-400/50 bg-purple-400/10 p-3">
                <input type="radio" name="payment_method" value="bank_transfer" form="checkout-form" defaultChecked/>
                <Banknote size={18}/>
                <span className="flex-1">
                  <b className="block text-xs">Bank transfer · CIB / Edahabia</b>
                  <small className="text-[10px] text-white/50">Request a transfer invoice; access awaits verification.</small>
                </span>
                <span className="text-[9px] text-emerald-300">Available</span>
              </label>
              {[["cib","CIB card"],["edahabia","Edahabia card"],["stripe","Stripe"],["paypal","PayPal"]].map(([id,label]) => (
                <div key={id} className="flex items-center gap-3 rounded-xl border border-white/[.07] p-3 opacity-50">
                  <CreditCard size={17}/>
                  <span className="flex-1 text-xs">{label}</span>
                  <span className="text-[9px]">Processor setup required</span>
                </div>
              ))}
            </div>
          </section>
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[.035] p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-5 flex justify-between border-b border-white/10 pb-4 text-sm">
              <span className="text-white/60">Course access</span>
              <span>{formatDzd(Number(course.price_dzd))}</span>
            </div>
            <div className="mt-4 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatDzd(Number(course.price_dzd))}</span>
            </div>
            <p className="mt-2 text-right text-[10px] text-white/45">Prices shown in Algerian dinars (DZD)</p>
            {checkoutStatus === "failed" && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-200">We couldn’t create the order. Please retry.</p>
            )}
            <form id="checkout-form" action={startCourseCheckout} className="mt-6">
              <input type="hidden" name="course_id" value={course.id}/>
              <button className="w-full rounded-xl bg-[#814bd0] px-4 py-3 text-sm font-semibold hover:bg-[#925ee0]">
                {Number(course.price_dzd) > 0 ? "Create payment order" : "Enroll for free"}
              </button>
            </form>
            <p className="mt-3 text-center text-[10px] leading-5 text-white/40">Orders are recorded as pending until payment is confirmed by Shagaf. No card is charged on this page.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}