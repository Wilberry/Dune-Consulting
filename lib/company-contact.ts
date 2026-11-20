import "server-only";

import { publicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type CompanyContactDetails = {
  telephone: string;
  telephoneHref: string;
  email: string;
};

const fallbackContactDetails: CompanyContactDetails = {
  telephone: publicEnv.companyPhone,
  telephoneHref: publicEnv.companyPhone.replace(/[^+\d]/g, ""),
  email: publicEnv.companyEmail,
};

export async function getCompanyContactDetails(): Promise<CompanyContactDetails> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("company_contact_settings")
      .select("contact_phone, contact_email")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;

    if (!data) return fallbackContactDetails;

    return {
      telephone: data.contact_phone,
      telephoneHref: data.contact_phone.replace(/[^+\d]/g, ""),
      email: data.contact_email,
    };
  } catch (error) {
    console.warn(
      "Unable to load public company contact details. Falling back to environment values.",
      error,
    );
    return fallbackContactDetails;
  }
}
