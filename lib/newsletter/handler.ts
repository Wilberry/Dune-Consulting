import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { newsletterSignupSchema } from "@/lib/validations";

const MIN_COMPLETION_MS = 1500;

type NewsletterHandlerDependencies = {
  persist: (email: string) => Promise<void>;
};

function successResponse() {
  return NextResponse.json({
    status: "success",
    message:
      "You are subscribed to Dune Consulting insights. We will share practical HSE updates using this email address.",
  });
}

export async function handleNewsletterSignup(
  request: Request,
  dependencies: NewsletterHandlerDependencies,
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(`newsletter:${ip}`).allowed) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Too many subscription attempts were submitted. Please wait before trying again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "The subscription could not be read." },
      { status: 400 },
    );
  }

  const parsed = newsletterSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "Please enter a valid email address and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (Date.now() - parsed.data.formStartedAt < MIN_COMPLETION_MS) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "The form was completed too quickly. Please check the email address and try again.",
      },
      { status: 400 },
    );
  }

  try {
    await dependencies.persist(parsed.data.email);
  } catch (error) {
    console.error(
      "Newsletter persistence failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      {
        status: "error",
        message:
          "We could not safely record your subscription. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  return successResponse();
}
