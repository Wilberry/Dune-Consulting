import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEmailEnvironment } from "@/lib/server-env";
import { quoteRequestSchema, type QuoteRequestInput } from "@/lib/validations";

const MIN_COMPLETION_MS = 3000;

export type QuoteRequestInsert = {
  name: string;
  company: string | null;
  email: string;
  phone: string;
  service: string;
  location: string | null;
  expected_start_date: string | null;
  participant_count: number | null;
  project_description: string;
  additional_requirements: string | null;
};

type QuoteHandlerDependencies = {
  persist: (quote: QuoteRequestInsert) => Promise<string>;
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

function toInsert(quote: QuoteRequestInput): QuoteRequestInsert {
  return {
    name: quote.name,
    company: nullable(quote.company),
    email: quote.email,
    phone: quote.phone,
    service: quote.service,
    location: nullable(quote.location),
    expected_start_date: nullable(quote.expectedStartDate),
    participant_count:
      typeof quote.participantCount === "number" ? quote.participantCount : null,
    project_description: quote.projectDescription,
    additional_requirements: nullable(quote.additionalRequirements),
  };
}

function successResponse(referenceNumber: string) {
  return NextResponse.json({
    status: "success",
    referenceNumber,
    message: `Your quote request has been received. Reference: ${referenceNumber}. Our team will review the details and contact you using the information provided.`,
  });
}

export async function handleQuoteRequest(
  request: Request,
  dependencies: QuoteHandlerDependencies,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(`quote:${ip}`).allowed) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Too many quote requests were submitted. Please wait before trying again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "The quote request could not be read." },
      { status: 400 },
    );
  }

  const parsed = quoteRequestSchema.safeParse(body);
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

  const quote = parsed.data;
  if (Date.now() - quote.formStartedAt < MIN_COMPLETION_MS) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "The form was completed too quickly. Please review your request and try again.",
      },
      { status: 400 },
    );
  }

  let referenceNumber: string;
  try {
    referenceNumber = await dependencies.persist(toInsert(quote));
  } catch (error) {
    console.error(
      "Quote persistence failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      {
        status: "error",
        message:
          "We could not safely record your quote request. Your information remains in the form so you can try again.",
      },
      { status: 503 },
    );
  }

  const environment = getEmailEnvironment();
  if (!environment.configured) {
    console.warn(
      "Quote notification skipped because email delivery is not configured.",
    );
    return successResponse(referenceNumber);
  }

  const submittedAt = new Date().toISOString();
  const html = `<h1>New Dune Consulting quote request</h1><dl><dt>Reference</dt><dd>${text(referenceNumber)}</dd><dt>Name</dt><dd>${text(quote.name)}</dd><dt>Company</dt><dd>${text(quote.company)}</dd><dt>Email</dt><dd>${text(quote.email)}</dd><dt>Phone</dt><dd>${text(quote.phone)}</dd><dt>Service</dt><dd>${text(quote.service)}</dd><dt>Location</dt><dd>${text(quote.location)}</dd><dt>Expected start date</dt><dd>${text(quote.expectedStartDate)}</dd><dt>Participant count</dt><dd>${quote.participantCount ?? "Not provided"}</dd><dt>Project description</dt><dd>${text(quote.projectDescription).replace(/\n/g, "<br>")}</dd><dt>Additional requirements</dt><dd>${text(quote.additionalRequirements).replace(/\n/g, "<br>")}</dd><dt>Submitted</dt><dd>${submittedAt}</dd><dt>Origin page</dt><dd>${text(quote.originPage)}</dd></dl>`;

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
        reply_to: quote.email,
        subject: `Quote request ${referenceNumber}: ${quote.service}`,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notification provider returned ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Quote notification failed",
      error instanceof Error ? error.name : "Unknown error",
    );
  }

  return successResponse(referenceNumber);
}
