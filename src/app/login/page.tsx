"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { withLocale } from "@/lib/i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : signInError.message
        );
        return;
      }

      const redirectTo = searchParams.get("redirect");
      router.push(redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/");
      router.refresh();
    } catch {
      setError("We couldn’t reach the authentication service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your journey.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {searchParams.get("passwordUpdated") === "1" && (
          <p role="status" className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            Your password has been updated. Log in with your new password.
          </p>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href={withLocale("/forgot-password", "en")} className="mb-1.5 text-xs text-shagaf-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <FieldError>{error}</FieldError>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to SHAGAF?{" "}
        <Link href={withLocale("/register", "en")} className="font-medium text-shagaf-600 hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-md border border-[--border] bg-[--surface-subtle] p-4 text-xs text-ink-muted">
        <p className="font-medium text-[--text]">Demo accounts</p>
        <p className="mt-1">
          learner@shagaf.demo · teacher@shagaf.demo · school@shagaf.demo ·
          admin@shagaf.demo — password set during seeding (see README).
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
