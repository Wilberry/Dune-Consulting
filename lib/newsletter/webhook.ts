import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_WEBHOOK_AGE_SECONDS = 5 * 60;

export type SvixWebhookHeaders = {
  id: string;
  timestamp: string;
  signature: string;
};

export function verifySvixWebhook(
  payload: string,
  headers: SvixWebhookHeaders,
  secret: string,
  nowMilliseconds = Date.now(),
) {
  const timestamp = Number(headers.timestamp);
  if (!Number.isFinite(timestamp)) return false;

  const nowSeconds = Math.floor(nowMilliseconds / 1000);
  if (Math.abs(nowSeconds - timestamp) > MAX_WEBHOOK_AGE_SECONDS) return false;

  const secretValue = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let key: Buffer;
  try {
    key = Buffer.from(secretValue, "base64");
  } catch {
    return false;
  }
  if (key.length === 0) return false;

  const signedContent = `${headers.id}.${headers.timestamp}.${payload}`;
  const expected = createHmac("sha256", key)
    .update(signedContent)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);

  return headers.signature.split(" ").some((candidate) => {
    const [version, signature] = candidate.split(",", 2);
    if (version !== "v1" || !signature) return false;
    const receivedBuffer = Buffer.from(signature);
    return (
      receivedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(receivedBuffer, expectedBuffer)
    );
  });
}

/**
 * Read a signed webhook without allowing unbounded request bodies to exhaust
 * a serverless worker. Signature verification must use this exact text.
 */
export async function readBoundedWebhookPayload(
  request: Request,
  maxBytes = 256 * 1024,
): Promise<string | null> {
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    const size = Number(declared);
    if (!Number.isFinite(size) || size < 0 || size > maxBytes) return null;
  }

  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }

  const combined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(combined);
}
