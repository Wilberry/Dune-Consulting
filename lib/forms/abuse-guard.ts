import "server-only";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  abuseSubjectHash,
  isAllowedProductionFormOrigin,
  normalizedSubmissionEmail,
  requestClientIp,
  type FormAction,
} from "@/lib/forms/abuse-policy";

const MAX_REQUEST_BYTES = 32 * 1024;

function denied(status: number, message: string) {
  return {
    ok: false as const,
    response: NextResponse.json({ status: "error", message }, { status }),
  };
}

/**
 * Invisible admission control, shared by every Vercel server instance.
 * Requires the private, service-role-only reserve_public_form_attempt RPC.
 *
 * This runs before the existing full validation, consent, honeypot, minimum
 * completion-time and durable persistence in each form handler.
 */
export async function checkPublicFormAbuse(
  request: Request,
  action: FormAction,
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  if (
    process.env.VERCEL_ENV !== "production" &&
    process.env.REQUIRE_FORM_ABUSE_LIMIT !== "true"
  ) {
    return { ok: true };
  }

  const secret =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || secret.length < 24) {
    console.error("Public form abuse protection is not configured");
    return denied(503, "Submission protection is temporarily unavailable. Please try again shortly.");
  }

  if (process.env.VERCEL_ENV === "production") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!isAllowedProductionFormOrigin(siteUrl, null)) {
      console.error("Public form canonical HTTPS origin is not configured");
      return denied(503, "Submission protection is temporarily unavailable. Please try again shortly.");
    }
    if (!isAllowedProductionFormOrigin(siteUrl, request.headers.get("origin"))) {
      return denied(403, "This submission cannot be accepted from another website.");
    }
  }

  const ip = requestClientIp(request.headers);
  if (!ip) {
    return denied(503, "Submission protection is temporarily unavailable. Please try again shortly.");
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return denied(415, "Please submit this form using the website.");
  }

  const size = Number(request.headers.get("content-length"));
  if (size > MAX_REQUEST_BYTES) {
    return denied(413, "The submitted information is too large.");
  }

  let payload: unknown;
  try {
    const raw = await request.clone().text();
    if (Buffer.byteLength(raw, "utf8") > MAX_REQUEST_BYTES) {
      return denied(413, "The submitted information is too large.");
    }
    payload = JSON.parse(raw) as unknown;
  } catch {
    return denied(400, "The submitted information could not be read.");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return denied(400, "The submitted information could not be read.");
  }

  const fields = payload as Record<string, unknown>;
  if (fields.website !== "") {
    return denied(400, "Please review the form and try again.");
  }
  const email = normalizedSubmissionEmail(fields.email);
  if (!email) {
    return denied(400, "Please enter a valid email address.");
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("reserve_public_form_attempt", {
      p_action: action,
      p_ip_hash: abuseSubjectHash(secret, "ip", ip),
      p_email_hash: abuseSubjectHash(secret, "email", email),
    });

    if (error || typeof data !== "boolean") {
      console.error("Public form rate limit RPC unavailable", error?.code ?? "UnexpectedResult");
      return denied(503, "Submission protection is temporarily unavailable. Please try again shortly.");
    }
    if (!data) {
      return denied(429, "Too many submissions were attempted. Please try again later.");
    }
    return { ok: true };
  } catch (error) {
    console.error("Public form abuse guard failed", error instanceof Error ? error.name : "UnknownError");
    return denied(503, "Submission protection is temporarily unavailable. Please try again shortly.");
  }
}
