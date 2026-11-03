import type { Metadata } from "next";

import { MediaLibrary } from "@/components/admin/media/media-library";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MEDIA_ACCEPTED_TYPES, MEDIA_MAX_SIZE_MB, getMediaLibrary } from "@/lib/admin/media";

export const metadata: Metadata = {
  title: "Médias",
};

export default async function AdminMediaPage() {
  const items = await getMediaLibrary();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader title="Médias" description="La bibliothèque d'images utilisée dans les articles." />
      <MediaLibrary items={items} acceptedTypes={MEDIA_ACCEPTED_TYPES} maxSizeMb={MEDIA_MAX_SIZE_MB} />
    </div>
  );
}
