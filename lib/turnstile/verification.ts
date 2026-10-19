/**
 * A deployed production Turnstile token must belong to the canonical
 * public HTTPS origin. Missing or placeholder origins are not acceptable:
 * otherwise Siteverify's hostname check could silently be skipped.
 *
 * This is intentionally a pure helper so tests can cover deployment
 * misconfiguration without depending on Next.js server-only imports.
 */
export function parseProductionTurnstileHostname(siteUrl: string | undefined): string | null {
  if (!siteUrl) return null;
  try {
    const url = new URL(siteUrl);
    const hostname = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      !hostname ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
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

export type TurnstileSiteverifyResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export function isTurnstileResponseValid(
  result: TurnstileSiteverifyResponse,
  expectedAction: string,
  expectedHostname: string | null,
) {
  if (!result.success) return false;
  if (result.action !== expectedAction) return false;
  if (expectedHostname && result.hostname !== expectedHostname) return false;
  return true;
}
