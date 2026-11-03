import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

import { AuthCard } from "@/components/admin/auth-card";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function AdminLoginPage() {
  return (
    <AuthCard
      icon={<LockKeyhole className="size-9" strokeWidth={1.6} />}
      title="Connexion Administrateur"
      description="Accédez à l'espace d'administration du site"
    >
      <LoginForm />
    </AuthCard>
  );
}
