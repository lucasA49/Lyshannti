import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Mail, Phone, Reply } from "lucide-react";
import { cn } from "cn";

import { ContactActions } from "@/components/admin/contacts/contact-actions";
import { StatusBadge } from "@/components/admin/dashboard/widgets";
import { AdminPageHeader } from "@/components/admin/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import { contactDeletionDate, getContact } from "@/lib/admin/contacts";
import { formatLongDate } from "@/lib/admin/format";
import { frenchTypo } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

// Rendue à la demande (données privées, toujours à jour, réservées à l'admin).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const contact = await getContact((await params).id);
  return { title: contact ? `Demande de ${contact.name}` : "Demande introuvable" };
}

const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

export default async function AdminContactPage({ params }: Props) {
  const contact = await getContact((await params).id);
  if (!contact) notFound();

  const created = new Date(contact.createdAt);
  // « Répondre » ouvre la messagerie avec le destinataire et l'objet remplis.
  const replyHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Re : ${contact.subject}`)}`;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title={contact.name}
        description={contact.subject}
        back={{ href: "/admin/contacts", label: "Toutes les demandes" }}
        actions={<StatusBadge kind="contact" status={contact.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-labelledby="message-title" className="min-w-0 rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
          <h2 id="message-title" className="font-heading text-xl font-semibold text-plum">
            Message
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-plum/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4" />
              <time dateTime={contact.createdAt}>{formatLongDate(created)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden="true" className="size-4" />
              {time.format(created)}
            </span>
          </p>
          <p className="mt-5 text-lg leading-relaxed whitespace-pre-line text-plum/90">{frenchTypo(contact.message)}</p>

          <a href={replyHref} className={cn(buttonVariants({ variant: "gold", size: "cta" }), "mt-6")}>
            <Reply />
            Répondre par e-mail
          </a>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="details-title" className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
            <h2 id="details-title" className="font-heading text-xl font-semibold text-plum">
              Coordonnées
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-plum/60" />
                <a href={`mailto:${contact.email}`} className="truncate font-medium text-plum underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden="true" className="size-4 shrink-0 text-plum/60" />
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/[^+0-9]/g, "")}`} className="font-medium text-plum underline-offset-4 hover:underline">
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-plum/60">Non renseigné</span>
                )}
              </li>
            </ul>
          </section>

          <section aria-labelledby="manage-title" className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
            <h2 id="manage-title" className="font-heading text-xl font-semibold text-plum">
              Suivi
            </h2>
            <div className="mt-4">
              <ContactActions status={contact.status} />
            </div>
            <p className="mt-5 text-xs text-plum/65">
              Suppression automatique le {formatLongDate(contactDeletionDate(contact.createdAt))} (RGPD).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
