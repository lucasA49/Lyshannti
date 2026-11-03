import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProfileForms } from "@/components/admin/profile/profile-forms";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function AdminProfilePage() {
  const admin = await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader title="Mon profil" description="Votre compte d'administration." />
      <ProfileForms name={admin.name} email={admin.email} />
    </div>
  );
}
