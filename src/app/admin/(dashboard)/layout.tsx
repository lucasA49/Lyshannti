import { AdminShell } from "@/components/admin/shell/admin-shell";
import { getDashboardData } from "@/lib/admin/dashboard";

// Cadre des pages du back-office (menu, en-tête).
// TODO backend : vérifier la session admin ici ET dans chaque action serveur,
// et rediriger vers /admin/connexion sinon (proxy.ts en complément).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin, stats, isDemo } = await getDashboardData();

  return (
    <AdminShell admin={admin} badges={{ newContacts: stats.newContacts }} isDemo={isDemo}>
      {children}
    </AdminShell>
  );
}
