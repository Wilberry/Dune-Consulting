import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "editor";

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: StaffRole;
};

export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) return null;
  if (profile.role !== "admin" && profile.role !== "editor") return null;

  return {
    id: profile.id,
    email: profile.email || user.email || "",
    fullName: profile.full_name,
    role: profile.role,
  };
}

export async function requireStaffUser() {
  const user = await getStaffUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdminUser() {
  const user = await requireStaffUser();
  if (user.role !== "admin") redirect("/admin?access=restricted");
  return user;
}
