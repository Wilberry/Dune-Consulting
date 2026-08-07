import { ProfileForm } from "@/components/admin/profile-form";
import { requireStaffUser } from "@/lib/admin/auth";

export default async function AdminSettingsPage() {
  const user = await requireStaffUser();

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">Account</p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">Settings</h1>
      <p className="text-muted mt-3 max-w-2xl leading-7">
        Update your staff display name. Email addresses and authorization roles remain read-only in the dashboard.
      </p>
      <ProfileForm user={user} />
    </div>
  );
}
