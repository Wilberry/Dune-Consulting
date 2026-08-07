import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getStaffUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getStaffUser();
  if (user) redirect("/admin");

  return <AdminLoginForm />;
}
