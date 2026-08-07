import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { getStaffUser } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage() {
  const staff = await getStaffUser();
  if (staff) redirect("/admin");

  return (
    <main id="main-content" className="bg-off-white flex min-h-screen items-center justify-center px-5 py-12">
      <section className="border-line w-full max-w-md rounded-2xl border bg-white p-7 shadow-sm sm:p-9" aria-labelledby="admin-login-title">
        <Brand logoClassName="h-10" textClassName="text-base" />
        <p className="text-amber-text mt-8 text-xs font-extrabold tracking-[.18em] uppercase">Staff administration</p>
        <h1 id="admin-login-title" className="text-navy mt-2 text-3xl font-extrabold">Sign in to Dune Admin</h1>
        <p className="text-muted mt-3 text-sm leading-6">Access is limited to approved Dune Consulting administrators and editors.</p>
        <LoginForm />
      </section>
    </main>
  );
}
