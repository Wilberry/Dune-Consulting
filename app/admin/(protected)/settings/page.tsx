import { requireStaffUser } from "@/lib/admin-auth";
import { ProfileForm } from "./profile-form";

export default async function AdminSettingsPage() {
  const staff = await requireStaffUser();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[.18em] uppercase">Account</p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold">Settings</h1>
      <p className="text-muted mt-2 text-sm">Manage the profile information associated with your Dune administrator account.</p>

      <section className="border-line mt-8 rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-muted text-xs font-bold uppercase tracking-wide">Email</dt>
            <dd className="text-navy mt-1 text-sm font-semibold">{staff.email}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-bold uppercase tracking-wide">Role</dt>
            <dd className="text-navy mt-1 text-sm font-semibold capitalize">{staff.role}</dd>
          </div>
        </dl>
        <ProfileForm fullName={staff.full_name ?? ""} />
        <p className="text-muted mt-5 text-xs leading-5">Email and role are intentionally read-only here. Role changes must be performed through an approved administrative process.</p>
      </section>
    </div>
  );
}
