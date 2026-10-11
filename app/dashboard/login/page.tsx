import type { Metadata } from "next";
import { MenteeLoginForm } from "@/components/mentee/mentee-login-form";

export const metadata: Metadata = {
  title: "Mentee sign in",
  robots: { index: false, follow: false },
};

export default function DashboardLoginPage() {
  return <MenteeLoginForm />;
}
