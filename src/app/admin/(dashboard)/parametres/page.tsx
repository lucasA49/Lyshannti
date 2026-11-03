import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/admin/settings";

export const metadata: Metadata = {
  title: "Paramètres",
};

// Valeurs : table settings si la base est disponible, sinon siteConfig (provisoire).
export default async function AdminSettingsPage() {
  const saved = await getSiteSettings();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="Paramètres" description="Les informations générales du site." />
      <SettingsForm
        initial={saved ?? {
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
