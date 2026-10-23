import type { UnifiedEnquiryInput } from "@/lib/validations";

/** Route the single public form to the two existing API/admin workflows. */
export function buildEnquirySubmission(
  values: UnifiedEnquiryInput,
  originPage: string,
  formStartedAt: number,
) {
  const common = {
    name: values.name,
    email: values.email,
    phone: values.phone,
    service: values.service,
    location: values.location,
    consent: values.consent,
    website: values.website,
    formStartedAt,
    originPage,
  };
  if (values.intent === "quote") {
    return {
      endpoint: "/api/quote" as const,
      payload: {
        ...common,
        company: values.organisation,
        expectedStartDate: values.projectDate,
        participantCount: values.participantCount,
        projectDescription: values.message,
        additionalRequirements: values.additionalRequirements,
      },
    };
  }
  return {
    endpoint: "/api/contact" as const,
    payload: {
      ...common,
      organisation: values.organisation,
      projectDate: values.projectDate,
      message: values.message,
    },
  };
}
