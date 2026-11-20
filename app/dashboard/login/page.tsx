import type { Metadata } from "next";
import { MenteeLoginForm } from "@/components/mentee/mentee-login-form";

export const metadata: Metadata = {
  title: "Mentee account access",
  robots: { index: false, follow: false },
};

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return (
    <MenteeLoginForm initialMode={mode === "signup" ? "signup" : "signin"} />
  );
}
