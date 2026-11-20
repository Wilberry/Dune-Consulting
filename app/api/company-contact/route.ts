import { NextResponse } from "next/server";
import { getCompanyContactDetails } from "@/lib/company-contact";

export async function GET() {
  const contactDetails = await getCompanyContactDetails();
  return NextResponse.json(contactDetails, {
    headers: { "Cache-Control": "no-store" },
  });
}
