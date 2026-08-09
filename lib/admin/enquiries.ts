import "server-only";

import { createClient } from "@/lib/supabase/server";

export type ContactEnquiryStatus = "new" | "read" | "replied" | "closed";

export type ContactEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string | null;
  service: string;
  projectDate: string | null;
  location: string | null;
  message: string;
  status: ContactEnquiryStatus;
  originPage: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getContactEnquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select(
      "id,name,email,phone,organisation,service,project_date,location,message,status,origin_page,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (data ?? []).map(
    (enquiry): ContactEnquiry => ({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      organisation: enquiry.organisation,
      service: enquiry.service,
      projectDate: enquiry.project_date,
      location: enquiry.location,
      message: enquiry.message,
      status: enquiry.status as ContactEnquiryStatus,
      originPage: enquiry.origin_page,
      createdAt: enquiry.created_at,
      updatedAt: enquiry.updated_at,
    }),
  );
}
