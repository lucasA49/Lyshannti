import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { AuthCard } from "@/components/admin/auth-card";
import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      icon={<KeyRound className="size-9" strokeWidth={1.6} />}
      title="Mot de passe oublié"
      description="Indiquez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
