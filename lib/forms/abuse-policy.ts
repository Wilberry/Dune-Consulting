import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export const FORM_ACTIONS = [
  "mentorship",
  "contact",
  "quote",
  "newsletter",
] as const;
export type FormAction = (typeof FORM_ACTIONS)[number];

// A stable HMAC is important: plain SHA-256 of email/IP leaks dictionary-prone
// identifiers. Derive purpose-separated hashes from the existing server-only
// Supabase secret; no third-party service or extra customer-facing challenge.
export function abuseSubjectHash(
  secret: string,
  kind: "ip" | "email",
  value: string,
): string {
  return createHmac("sha256", secret)
    .update("dune-public-form-abuse/v1\0")
    .update(kind)
    .update("\0")
    .update(value)
    .digest("hex");
}

export function normalizedSubmissionEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  return email;
}

/**
 * Vercel supplies x-forwarded-for at its ingress. Do not read any IP passed
 * through the request JSON body. A missing/invalid IP fails closed in prod.
 */
export function requestClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  const candidate = first || headers.get("x-real-ip")?.trim();
  if (!candidate || !isIP(candidate)) return null;
  return candidate.toLowerCase();
}
