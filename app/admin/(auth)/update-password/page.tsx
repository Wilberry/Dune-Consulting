import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/admin/update-password-form";

export const metadata: Metadata = {
  title: "Update admin password",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
