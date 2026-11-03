import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Paramètres",
};

// Valeurs actuelles : celles de siteConfig (provisoires), en attendant la table settings.
export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="Paramètres" description="Les informations générales du site." />
      <SettingsForm
        initial={{
          name: siteConfig.name,
          tagline: siteConfig.tagline,
          description: siteConfig.description,
          phone: siteConfig.contact.phone,
          email: siteConfig.contact.email,
          city: siteConfig.contact.city,
          hours: siteConfig.contact.hours.short,
          instagram: siteConfig.socials.instagram,
          facebook: siteConfig.socials.facebook,
          linkedin: siteConfig.socials.linkedin,
          notificationEmail: siteConfig.contact.email,
        }}
      />
    </div>
  );
}
