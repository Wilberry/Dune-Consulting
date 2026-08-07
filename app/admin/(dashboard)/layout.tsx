import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireStaffUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaffUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
