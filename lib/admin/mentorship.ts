import "server-only";

import { createClient } from "@/lib/supabase/server";

export type MentorshipApplicationStatus =
  "new" | "reviewing" | "accepted" | "declined";

export type MentorshipApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  selectedPackage: "Foundation" | "Momentum" | "Elevation" | null;
  professionalRole: string | null;
  experienceLevel: string | null;
  education: string | null;
  reasonForApplying: string | null;
  careerGoals: string | null;
  additionalInformation: string | null;
  status: MentorshipApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export async function getMentorshipApplications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mentorship_applications")
    .select(
      "id,name,email,phone,selected_package,professional_role,experience_level,education,reason_for_applying,career_goals,additional_information,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (data ?? []).map((application): MentorshipApplication => ({
    id: application.id,
    name: application.name,
    email: application.email,
    phone: application.phone,
    selectedPackage: application.selected_package as MentorshipApplication["selectedPackage"],
    professionalRole: application.professional_role,
    experienceLevel: application.experience_level,
    education: application.education,
    reasonForApplying: application.reason_for_applying,
    careerGoals: application.career_goals,
    additionalInformation: application.additional_information,
    status: application.status as MentorshipApplicationStatus,
    createdAt: application.created_at,
    updatedAt: application.updated_at,
  }));
}
