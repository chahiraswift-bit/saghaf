"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Presentation, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPasswordValidationError } from "@/lib/auth/password";
import { withLocale } from "@/lib/i18n";

type Role = "learner" | "teacher" | "school_admin";

const ROLE_HOME: Record<Role, string> = {
  learner: "/dashboard",
  teacher: "/teacher",
  school_admin: "/school",
};

const roleOptions: { value: Role; label: string; icon: typeof GraduationCap }[] = [
  { value: "learner", label: "Learner", icon: GraduationCap },
  { value: "teacher", label: "Teacher", icon: Presentation },
  { value: "school_admin", label: "School", icon: School },
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("learner");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${ROLE_HOME[role]}`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push("/register/check-email");
    } catch {
      setError("We couldn’t reach the authentication service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SHAGAF as a learner, teacher, or school."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="role">I am joining as</Label>
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-md border py-3 text-xs font-medium transition-colors",
                  role === value
                    ? "border-shagaf-600 bg-shagaf-100 text-shagaf-800 dark:bg-shagaf-900/40 dark:text-shagaf-200"
                    : "border-[--border] text-ink-muted hover:border-shagaf-300"
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Amina Benali"
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
              minLength={12}
              autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
          />
            <p className="mt-1.5 text-xs text-ink-muted">
              At least 12 characters, with uppercase, lowercase, a number, and a special character.
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
            />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href={withLocale("/login", "en")} className="font-medium text-shagaf-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
