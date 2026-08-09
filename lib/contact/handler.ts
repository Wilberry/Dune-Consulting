import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEmailEnvironment } from "@/lib/server-env";
import {
  consultationSchema,
  type ConsultationInput,
} from "@/lib/validations";

const MIN_COMPLETION_MS = 3000;

export type ContactEnquiryInsert = {
  name: string;
  email: string;
  phone: string;
  organisation: string | null;
  service: string;
  project_date: string | null;
  location: string | null;
  message: string;
  origin_page: string | null;
};

type ContactHandlerDependencies = {
  persist: (enquiry: ContactEnquiryInsert) => Promise<void>;
  fetchImpl?: typeof fetch;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function text(value?: string) {
  return escapeHtml(value?.trim() || "Not provided");
}

function nullable(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toInsert(enquiry: ConsultationInput): ContactEnquiryInsert {
  return {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    organisation: nullable(enquiry.organisation),
    service: enquiry.service,
    project_date: nullable(enquiry.projectDate),
    location: nullable(enquiry.location),
    message: enquiry.message,
    origin_page: nullable(enquiry.originPage),
  };
}

function successResponse() {
  return NextResponse.json({
    status: "success",
    message:
      "Your enquiry has been received. Our team will respond using the details provided.",
  });
}

export async function handleContactRequest(
  request: Request,
  dependencies: ContactHandlerDependencies,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip).allowed) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Too many enquiries were submitted. Please wait before trying again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "The enquiry could not be read." },
      { status: 400 },
    );
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "Please review the highlighted information and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const enquiry = parsed.data;
  if (Date.now() - enquiry.formStartedAt < MIN_COMPLETION_MS) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "The form was completed too quickly. Please review your enquiry and try again.",
      },
      { status: 400 },
    );
  }

  try {
    await dependencies.persist(toInsert(enquiry));
  } catch (error) {
    console.error(
      "Contact persistence failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      {
        status: "error",
        message:
          "We could not safely record your enquiry. Your information remains in the form so you can try again.",
      },
      { status: 503 },
    );
  }

  const environment = getEmailEnvironment();
  if (!environment.configured) {
    console.warn(
      "Contact notification skipped because email delivery is not configured.",
    );
    return successResponse();
  }

  const submittedAt = new Date().toISOString();
  const html = `<h1>New Dune Consulting enquiry</h1><dl><dt>Name</dt><dd>${text(enquiry.name)}</dd><dt>Email</dt><dd>${text(enquiry.email)}</dd><dt>Phone</dt><dd>${text(enquiry.phone)}</dd><dt>Organisation</dt><dd>${text(enquiry.organisation)}</dd><dt>Service</dt><dd>${text(enquiry.service)}</dd><dt>Project date</dt><dd>${text(enquiry.projectDate)}</dd><dt>Location</dt><dd>${text(enquiry.location)}</dd><dt>Message</dt><dd>${text(enquiry.message).replace(/\n/g, "<br>")}</dd><dt>Submitted</dt><dd>${submittedAt}</dd><dt>Origin page</dt><dd>${text(enquiry.originPage)}</dd></dl>`;

  try {
    const fetchImpl = dependencies.fetchImpl ?? fetch;
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${environment.values.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: environment.values.CONTACT_FROM_EMAIL,
        to: [environment.values.CONTACT_RECIPIENT_EMAIL],
        reply_to: enquiry.email,
        subject: `Website enquiry: ${enquiry.service}`,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notification provider returned ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Contact notification failed",
      error instanceof Error ? error.name : "Unknown error",
    );
  }

  return successResponse();
}
