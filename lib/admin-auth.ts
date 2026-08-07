import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "editor";
export type StaffProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: StaffRole;
};

export async function getStaffUser(): Promise<StaffProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return null;
  }

  return profile as StaffProfile;
}

export async function requireStaffUser() {
  const staff = await getStaffUser();
  if (!staff) redirect("/admin/login");
  return staff;
}

export async function requireAdminUser() {
  const staff = await requireStaffUser();
  if (staff.role !== "admin") redirect("/admin?access=denied");
  return staff;
}
