import type { Metadata } from "next";

import {
  PublicationCalendar,
  RecentContacts,
  RecentPosts,
  SeoIssues,
  StatCards,
  TopPosts,
} from "@/components/admin/dashboard/dashboard-blocks";
import { Greeting } from "@/components/admin/dashboard/greeting";
import { getDashboardData } from "@/lib/admin/dashboard";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function AdminDashboardPage() {
  const [admin, data] = await Promise.all([requireAdmin(), getDashboardData()]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Greeting name={admin.name} />
      <StatCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentContacts contacts={data.recentContacts} />
        <RecentPosts posts={data.recentPosts} />
        <PublicationCalendar upcoming={data.upcoming} />
        <TopPosts posts={data.topPosts} />
        <SeoIssues items={data.seoIssues} />
      </div>
    </div>
  );
}
