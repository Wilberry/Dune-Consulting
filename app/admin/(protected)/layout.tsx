import type { Metadata } from "next";
import { Brand } from "@/components/layout/brand";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav";
import { requireStaffUser } from "@/lib/admin-auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaffUser();

  return (
    <div className="bg-off-white min-h-screen lg:flex">
      <AdminSidebar role={staff.role} />
      <div className="min-w-0 flex-1">
        <header className="border-line sticky top-0 z-30 flex min-h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <AdminMobileNav role={staff.role} />
            <Brand
              logoClassName="h-8"
              textClassName="hidden text-sm sm:block"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-navy text-sm font-bold">
                {staff.full_name || staff.email}
              </p>
              <p className="text-muted text-xs capitalize">{staff.role}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border-line text-navy rounded-md border bg-white px-3 py-2 text-sm font-bold hover:bg-off-white"
              >
                Logout
              </button>
            </form>
          </div>
        </header>
        <main id="main-content" className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
