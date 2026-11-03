import { AdminShell } from "@/components/admin/shell/admin-shell";
import { requireAdmin } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/admin/dashboard";

// Cadre des pages du back-office (menu, en-tête). Réservé à l'admin connecté :
// la session est vérifiée ici (redirection vers la connexion sinon) ET dans
// chaque Server Action ; proxy.ts n'est qu'une première barrière.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const { stats, isDemo } = await getDashboardData();

  return (
    <AdminShell admin={admin} badges={{ newContacts: stats.newContacts }} isDemo={isDemo}>
      {children}
    </AdminShell>
  );
}
