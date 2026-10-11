import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MenteeDashboardProfile = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string | null;
};

export type MenteeDashboardApplication = {
  id: string;
  email: string | null;
  status: string | null;
  selectedPackage: string | null;
  linkedUserId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MenteeDashboardEnrolment = {
  id: string;
  applicationId: string | null;
  userId: string | null;
  package: string | null;
  status: string | null;
  cohortName: string | null;
  cohortStartDate: string | null;
  cohortEndDate: string | null;
  enrolledAt: string | null;
};

export type MenteeDashboardData = {
  user: MenteeDashboardProfile | null;
  linkedApplication: MenteeDashboardApplication | null;
  enrolment: MenteeDashboardEnrolment | null;
};

export async function getMenteeDashboardData(): Promise<MenteeDashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/dashboard/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("Mentee profile could not be loaded.");
  }

  // A profile trigger or backfill may be delayed. Authentication and the
  // immutable user UUID, not profile-row presence, determine enrolment access.
  const dashboardUser: MenteeDashboardProfile = {
    id: user.id,
    email: profile?.email ?? user.email ?? null,
    emailVerified: Boolean(user.email_confirmed_at),
    fullName:
      profile?.full_name ??
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null),
  };

  // Linked users may inspect their own application status even when their
  // programme access is suspended or withdrawn. RLS still prevents reading
  // other applicants' records.
  const { data: linked, error: linkedError } = await supabase
    .from("mentorship_applications")
    .select("id,email,status,selected_package,linked_user_id,created_at,updated_at")
    .eq("linked_user_id", user.id)
    .maybeSingle();

  if (linkedError) {
    throw new Error("Linked application status could not be loaded.");
  }

  const linkedApplication: MenteeDashboardApplication | null = linked
    ? {
        id: linked.id,
        email: linked.email,
        status: linked.status,
        selectedPackage: linked.selected_package,
        linkedUserId: linked.linked_user_id,
        createdAt: linked.created_at,
        updatedAt: linked.updated_at,
      }
    : null;

  const { data: enrolmentData, error: enrolmentError } = await supabase
    .from("mentorship_enrolments")
    .select(
      "id,application_id,user_id,package,status,cohort_name,cohort_start_date,cohort_end_date,enrolled_at",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (enrolmentError) {
    throw new Error("Mentee enrolment could not be loaded.");
  }

  if (!enrolmentData) {
    return {
      user: dashboardUser,
      linkedApplication,
      enrolment: null,
    };
  }

  const { data: application, error: applicationError } = await supabase
    .from("mentorship_applications")
    .select(
      "id,email,status,selected_package,linked_user_id,created_at,updated_at",
    )
    .eq("id", enrolmentData.application_id)
    .eq("linked_user_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (applicationError) {
    throw new Error("Mentee application could not be loaded.");
  }

  const enrolment: MenteeDashboardEnrolment | null = application
    ? {
        id: enrolmentData.id,
        applicationId: enrolmentData.application_id,
        userId: enrolmentData.user_id,
        package: enrolmentData.package,
        status: enrolmentData.status,
        cohortName: enrolmentData.cohort_name,
        cohortStartDate: enrolmentData.cohort_start_date,
        cohortEndDate: enrolmentData.cohort_end_date,
        enrolledAt: enrolmentData.enrolled_at,
      }
    : null;

  return {
    user: dashboardUser,
    linkedApplication: application
      ? {
          id: application.id,
          email: application.email,
          status: application.status,
          selectedPackage: application.selected_package,
          linkedUserId: application.linked_user_id,
          createdAt: application.created_at,
          updatedAt: application.updated_at,
        }
      : linkedApplication,
    enrolment,
  };
}
