import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEmailEnvironment } from "@/lib/server-env";
import {
  mentorshipApplicationSchema,
  type MentorshipApplicationInput,
} from "@/lib/validations";

const MIN_COMPLETION_MS = 3000;

export type MentorshipApplicationInsert = {
  name: string;
  email: string;
  phone: string;
  professional_role: string | null;
  experience_level: string | null;
  education: string | null;
  reason_for_applying: string;
  career_goals: string;
  additional_information: string | null;
};

type MentorshipHandlerDependencies = {
  persist: (application: MentorshipApplicationInsert) => Promise<void>;
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

function toInsert(
  application: MentorshipApplicationInput,
): MentorshipApplicationInsert {
  return {
    name: application.name,
    email: application.email,
    phone: application.phone,
    professional_role: nullable(application.professionalRole),
    experience_level: nullable(application.experienceLevel),
    education: nullable(application.education),
    reason_for_applying: application.reasonForApplying,
    career_goals: application.careerGoals,
    additional_information: nullable(application.additionalInformation),
  };
}

function successResponse() {
  return NextResponse.json({
    status: "success",
    message:
      "Your mentorship application has been received. Our team will review it and contact you using the details provided.",
  });
}

export async function handleMentorshipApplication(
  request: Request,
  dependencies: MentorshipHandlerDependencies,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(`mentorship:${ip}`).allowed) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Too many mentorship applications were submitted. Please wait before trying again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "The application could not be read." },
      { status: 400 },
    );
  }

  const parsed = mentorshipApplicationSchema.safeParse(body);
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

  const application = parsed.data;
  if (Date.now() - application.formStartedAt < MIN_COMPLETION_MS) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "The form was completed too quickly. Please review your application and try again.",
      },
      { status: 400 },
    );
  }

  try {
    await dependencies.persist(toInsert(application));
  } catch (error) {
    console.error(
      "Mentorship persistence failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      {
        status: "error",
        message:
          "We could not safely record your application. Your information remains in the form so you can try again.",
      },
      { status: 503 },
    );
  }

  const environment = getEmailEnvironment();
  if (!environment.configured) {
    console.warn(
      "Mentorship notification skipped because email delivery is not configured.",
    );
    return successResponse();
  }

  const submittedAt = new Date().toISOString();
  const html = `<h1>New Dune Consulting mentorship application</h1><dl><dt>Name</dt><dd>${text(application.name)}</dd><dt>Email</dt><dd>${text(application.email)}</dd><dt>Phone</dt><dd>${text(application.phone)}</dd><dt>Professional role</dt><dd>${text(application.professionalRole)}</dd><dt>Experience level</dt><dd>${text(application.experienceLevel)}</dd><dt>Education</dt><dd>${text(application.education)}</dd><dt>Reason for applying</dt><dd>${text(application.reasonForApplying).replace(/\n/g, "<br>")}</dd><dt>Career goals</dt><dd>${text(application.careerGoals).replace(/\n/g, "<br>")}</dd><dt>Additional information</dt><dd>${text(application.additionalInformation).replace(/\n/g, "<br>")}</dd><dt>Submitted</dt><dd>${submittedAt}</dd></dl>`;

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
        reply_to: application.email,
        subject: `HSE Mentorship application: ${application.name}`,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notification provider returned ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Mentorship notification failed",
      error instanceof Error ? error.name : "Unknown error",
    );
  }

  return successResponse();
}
