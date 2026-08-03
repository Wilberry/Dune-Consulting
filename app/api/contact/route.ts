import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/validations";
import { getEmailEnvironment } from "@/lib/server-env";
import { checkRateLimit } from "@/lib/rate-limit";

const MIN_COMPLETION_MS = 3000;
function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );
}
function text(value?: string) {
  return escapeHtml(value?.trim() || "Not provided");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(ip).allowed)
    return NextResponse.json(
      {
        status: "error",
        message:
          "Too many enquiries were submitted. Please wait before trying again.",
      },
      { status: 429 },
    );
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
  if (!parsed.success)
    return NextResponse.json(
      {
        status: "error",
        message: "Please review the highlighted information and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const enquiry = parsed.data;
  if (Date.now() - enquiry.formStartedAt < MIN_COMPLETION_MS)
    return NextResponse.json(
      {
        status: "error",
        message:
          "The form was completed too quickly. Please review your enquiry and try again.",
      },
      { status: 400 },
    );
  const environment = getEmailEnvironment();
  if (!environment.configured)
    return NextResponse.json(
      {
        status: "unconfigured",
        message:
          process.env.NODE_ENV === "development"
            ? `Email delivery is not configured (${environment.missing.join(", ")}). Your enquiry was validated but not sent.`
            : "Email delivery is temporarily unavailable. Please contact us by phone or email.",
      },
      { status: 503 },
    );
  const submittedAt = new Date().toISOString();
  const html = `<h1>New Dune Consulting enquiry</h1><dl><dt>Name</dt><dd>${text(enquiry.name)}</dd><dt>Email</dt><dd>${text(enquiry.email)}</dd><dt>Phone</dt><dd>${text(enquiry.phone)}</dd><dt>Organisation</dt><dd>${text(enquiry.organisation)}</dd><dt>Service</dt><dd>${text(enquiry.service)}</dd><dt>Project date</dt><dd>${text(enquiry.projectDate)}</dd><dt>Location</dt><dd>${text(enquiry.location)}</dd><dt>Message</dt><dd>${text(enquiry.message).replace(/\n/g, "<br>")}</dd><dt>Submitted</dt><dd>${submittedAt}</dd><dt>Origin page</dt><dd>${text(enquiry.originPage)}</dd></dl>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
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
    if (!response.ok) throw new Error(`Resend returned ${response.status}`);
    return NextResponse.json({
      status: "success",
      message:
        "Your enquiry has been sent. Our team will respond using the details provided.",
    });
  } catch (error) {
    console.error(
      "Contact delivery failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        status: "error",
        message:
          "We could not send your enquiry. Your details remain in the form so you can try again.",
      },
      { status: 502 },
    );
  }
}
