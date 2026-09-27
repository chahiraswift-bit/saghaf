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

type Role = "learner" | "teacher" | "school_admin";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/register/check-email");
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-shagaf-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
