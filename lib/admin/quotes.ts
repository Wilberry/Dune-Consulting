import "server-only";

import { createClient } from "@/lib/supabase/server";

export type QuoteRequestStatus =
  "new" | "reviewing" | "contacted" | "converted" | "closed";

export type QuoteRequest = {
  id: string;
  referenceNumber: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  service: string;
  location: string | null;
  expectedStartDate: string | null;
  participantCount: number | null;
  projectDescription: string;
  additionalRequirements: string | null;
  status: QuoteRequestStatus;
  createdAt: string;
  updatedAt: string;
};

export async function getQuoteRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_requests")
    .select(
      "id,reference_number,name,company,email,phone,service,location,expected_start_date,participant_count,project_description,additional_requirements,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (data ?? []).map((quote): QuoteRequest => ({
    id: quote.id,
    referenceNumber: quote.reference_number,
    name: quote.name,
    company: quote.company,
    email: quote.email,
    phone: quote.phone,
    service: quote.service,
    location: quote.location,
    expectedStartDate: quote.expected_start_date,
    participantCount: quote.participant_count,
    projectDescription: quote.project_description,
    additionalRequirements: quote.additional_requirements,
    status: quote.status as QuoteRequestStatus,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at,
  }));
}
