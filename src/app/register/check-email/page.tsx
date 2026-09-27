import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function CheckEmailPage() {
  return (
    <AuthLayout title="Check your inbox" subtitle="One last step before you can log in.">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[--border] p-8 text-center">
        <MailCheck size={32} className="text-shagaf-600" />
        <p className="text-sm text-ink-muted">
          We sent a confirmation link to your email address. Click it to
          activate your account, then come back and log in.
        </p>
      </div>
    </AuthLayout>
  );
}
