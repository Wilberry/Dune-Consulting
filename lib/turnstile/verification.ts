/**
 * A deployed production Turnstile token must belong to the canonical
 * public HTTPS origin. Missing or placeholder origins are not acceptable:
 * otherwise Siteverify's hostname check could silently be skipped.
 *
 * This is intentionally a pure helper so tests can cover deployment
 * misconfiguration without depending on Next.js server-only imports.
 */
export function parseProductionTurnstileHostname(
  siteUrl: string | undefined,
): string | null {
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

// Cloudflare's published dummy sitekeys/secrets must never be accepted
// in Vercel production, even when a developer accidentally configures them.
const dummySitekeys = new Set([
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000FF",
]);

const dummySecrets = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export function usesTurnstileTestKeys(sitekey: string, secret: string): boolean {
  return dummySitekeys.has(sitekey) || dummySecrets.has(secret);
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
