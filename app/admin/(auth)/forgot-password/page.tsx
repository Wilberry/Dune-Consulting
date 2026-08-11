import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { getStaffUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Reset admin password",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const user = await getStaffUser();
  if (user) redirect("/admin");

  return <ForgotPasswordForm />;
}
