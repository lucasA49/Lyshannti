import type { Metadata } from "next";

import { ContactsList } from "@/components/admin/contacts/contacts-list";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CONTACT_RETENTION_MONTHS, getContacts } from "@/lib/admin/contacts";

export const metadata: Metadata = {
  title: "Demandes de contact",
};

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Demandes de contact"
        description={`Les demandes envoyées depuis le formulaire du site. Elles sont supprimées automatiquement au bout de ${CONTACT_RETENTION_MONTHS} mois.`}
      />
      <ContactsList contacts={contacts} />
    </div>
  );
}
