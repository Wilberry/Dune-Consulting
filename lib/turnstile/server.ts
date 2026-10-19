import "server-only";

import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getTurnstileEnvironment,
  requiresTurnstileVerification,
} from "@/lib/server-env";
import {
  isTurnstileResponseValid,
  parseProductionTurnstileHostname,
  usesTurnstileTestKeys,
  type TurnstileSiteverifyResponse,
} from "@/lib/turnstile/verification";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined
  );
}

export type TurnstileVerificationResult =
  | { ok: true; status: "disabled" | "verified" }
  | { ok: false; response: NextResponse };

export async function verifyTurnstileRequest(
  request: Request,
  action: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileVerificationResult> {
  const environment = getTurnstileEnvironment();

  if (environment.status === "disabled") {
    if (requiresTurnstileVerification()) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            status: "error",
            message:
              "Spam protection is temporarily unavailable. Please try again shortly.",
          },
          { status: 503 },
        ),
      };
    }
    return { ok: true, status: "disabled" };
  }

  if (environment.status === "misconfigured") {
    console.error("Turnstile configuration is incomplete");
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Spam protection is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 },
      ),
    };
  }

  // Vercel production must validate both Turnstile action and hostname.
  // A missing, non-HTTPS or placeholder canonical URL is misconfiguration,
  // not a reason to silently skip the hostname security boundary.
  const productionHostname =
    process.env.VERCEL_ENV === "production"
      ? parseProductionTurnstileHostname(process.env.NEXT_PUBLIC_SITE_URL)
      : null;

  if (process.env.VERCEL_ENV === "production" && !productionHostname) {
    console.error("Production Turnstile canonical hostname is not configured");
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Spam protection is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 },
      ),
    };
  }

  if (
    process.env.VERCEL_ENV === "production" &&
    usesTurnstileTestKeys(
      environment.values.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      environment.values.TURNSTILE_SECRET_KEY,
    )
  ) {
    console.error("Production Turnstile is configured with testing keys");
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Spam protection is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 },
      ),
    };
  }

  const ip = requestIp(request) || "unknown";
  if (!checkRateLimit(`turnstile:${action}:${ip}`).allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Too many verification attempts were submitted. Please wait before trying again.",
        },
        { status: 429 },
      ),
    };
  }

  let token: string | null = null;
  try {
    const body = (await request.clone().json()) as unknown;
    if (body && typeof body === "object" && "turnstileToken" in body) {
      const candidate = (body as { turnstileToken?: unknown }).turnstileToken;
      token = typeof candidate === "string" ? candidate.trim() : null;
    }
  } catch {
    // The existing endpoint parser will return its normal malformed-body error.
    return { ok: true, status: "disabled" };
  }

  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Please complete the spam-protection check and submit the form again.",
        },
        { status: 400 },
      ),
    };
  }

  let result: TurnstileSiteverifyResponse;
  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: environment.values.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip === "unknown" ? undefined : ip,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error("Siteverify request failed");
    result = (await response.json()) as TurnstileSiteverifyResponse;
  } catch (error) {
    console.error(
      "Turnstile verification service failed",
      error instanceof Error ? error.name : "UnknownTurnstileError",
    );
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "Spam protection could not be verified. Please try again shortly.",
        },
        { status: 503 },
      ),
    };
  }

  if (!isTurnstileResponseValid(result, action, productionHostname)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message:
            "The spam-protection check could not be confirmed. Please try again.",
        },
        { status: 400 },
      ),
    };
  }

  return { ok: true, status: "verified" };
}
