import "server-only";

import { NextResponse } from "next/server";
import { getTurnstileEnvironment } from "@/lib/server-env";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined
  );
}

function expectedHostname() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;

  try {
    const hostname = new URL(siteUrl).hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".example")
    ) {
      return null;
    }
    return hostname;
  } catch {
    return null;
  }
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

  let token: string | null = null;
  try {
    const body = (await request.clone().json()) as unknown;
    if (body && typeof body === "object" && "turnstileToken" in body) {
      const candidate = (body as { turnstileToken?: unknown }).turnstileToken;
      token = typeof candidate === "string" ? candidate.trim() : null;
    }
  } catch {
    return { ok: true, status: "verified" };
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

  let result: TurnstileResponse;
  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: environment.values.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: requestIp(request),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error("Siteverify request failed");
    result = (await response.json()) as TurnstileResponse;
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

  const hostname = expectedHostname();
  const actionMatches = !result.action || result.action === action;
  const hostnameMatches = !hostname || result.hostname === hostname;

  if (!result.success || !actionMatches || !hostnameMatches) {
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
