import { createHash, randomBytes } from "node:crypto";

const CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function hashInvitationCode(value: unknown): string | null {
  if (typeof value !== "string" || !CODE_PATTERN.test(value.trim())) {
    return null;
  }
  return createHash("sha256").update(value.trim()).digest("hex");
}

export function generateInvitationCode() {
  const code = randomBytes(32).toString("base64url");
  const tokenHash = hashInvitationCode(code);
  if (!tokenHash) throw new Error("Invitation generation failed");
  return { code, tokenHash };
}
