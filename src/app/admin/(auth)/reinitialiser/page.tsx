import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";

import { AuthCard } from "@/components/admin/auth-card";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  // Le jeton est dans l'URL : ne jamais l'envoyer à un site tiers via le Referer.
  referrer: "no-referrer",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      icon={<ShieldCheck className="size-9" strokeWidth={1.6} />}
      title="Nouveau mot de passe"
      description="Choisissez un nouveau mot de passe pour votre espace d'administration."
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
